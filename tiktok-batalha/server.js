// Servidor da Batalha das Rosas: conecta na live do TikTok sozinho e envia os eventos pro jogo.
// Configure tudo em config.json e rode: node server.js   (ou dê dois cliques em iniciar-windows.bat / iniciar-mac.command)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');

// ---------------- Configuração ----------------
const DEFAULTS = {
  usuario_tiktok: '',
  chave_euler: '',
  porta: 8080,
  abrir_navegador: true,
  tempo_recrutamento: 60,
  tempo_vitoria: 10,
  max_lutadores_por_time: 220,
  som: true,
};
let fileCfg = {};
const cfgPath = path.join(__dirname, 'config.json');
try {
  fileCfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
} catch (e) {
  if (e.code !== 'ENOENT') { console.error(`\n❌ Erro no config.json: ${e.message}\n   Confira se não apagou alguma vírgula ou aspas.\n`); process.exit(1); }
}
const CFG = { ...DEFAULTS, ...fileCfg };
if (process.argv[2]) CFG.usuario_tiktok = process.argv[2];
if (process.argv[3]) CFG.porta = Number(process.argv[3]);
if (process.env.TIKTOK_USER) CFG.usuario_tiktok = process.env.TIKTOK_USER;
if (process.env.SIGN_API_KEY) CFG.chave_euler = process.env.SIGN_API_KEY;
if (process.env.PORT) CFG.porta = Number(process.env.PORT);
const USERNAME = String(CFG.usuario_tiktok || '').trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?tiktok\.com\/@/, '').replace(/\/.*$/, '');
const PORT = Number(CFG.porta) || 8080;

// Configurações do jogo enviadas ao navegador
const gameCfg = {
  recruitSeconds: Number(CFG.tempo_recrutamento) || 60,
  endSeconds: Number(CFG.tempo_vitoria) || 10,
  maxUnitsPerTeam: Number(CFG.max_lutadores_por_time) || 220,
  sound: CFG.som !== false,
};

// ---------------- Servidor web ----------------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' };

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (urlPath === '/config.js') {
    res.writeHead(200, { 'Content-Type': MIME['.js'], 'Cache-Control': 'no-store' });
    return res.end(`window.BATALHA_CFG = ${JSON.stringify(gameCfg)};`);
  }
  const file = path.normalize(path.join(PUBLIC, urlPath === '/' ? 'index.html' : urlPath));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });
let status = { type: 'status', game: gameCfg, connected: false, username: USERNAME, message: USERNAME ? 'Iniciando…' : 'Modo demo: coloque seu usuário no config.json' };
const broadcast = (msg) => { const s = JSON.stringify(msg); for (const c of wss.clients) if (c.readyState === 1) c.send(s); };
const time = () => new Date().toLocaleTimeString('pt-BR');
function setStatus(patch) {
  const changed = patch.message !== status.message;
  status = { ...status, ...patch };
  broadcast(status);
  if (changed) console.log(`[${time()}] ${status.connected ? '🟢' : '⚪'} ${status.message}`);
}
wss.on('connection', (ws) => ws.send(JSON.stringify(status)));

function userInfo(u = {}) {
  const avatar = u.profilePicture?.url?.[0] || u.profilePicture?.urls?.[0] || u.avatarThumb?.urlList?.[0] || u.avatarThumb?.url?.[0] || '';
  return { id: String(u.userId || u.uniqueId || Math.random()), user: u.uniqueId || 'anonimo', nick: u.nickname || u.uniqueId || 'anônimo', avatar };
}

// ---------------- Conexão automática com a live ----------------
const stats = { gifts: 0, roses: 0 };

async function startTikTok() {
  const { TikTokLiveConnection, WebcastEvent, ControlEvent } = await import('tiktok-live-connector');
  let conn = null;
  let retryTimer = null;
  let attempt = 0;

  const schedule = (seconds) => { clearTimeout(retryTimer); retryTimer = setTimeout(connect, seconds * 1000); };

  function wire(c) {
    const streaks = new Map(); // sequências de presentes: enviamos só a diferença, pra reagir em tempo real

    c.on(WebcastEvent.GIFT, (d) => {
      const u = userInfo(d.user);
      const details = d.giftDetails || {};
      const ext = d.extendedGiftInfo || {};
      const giftId = d.giftId ?? details.giftId;
      const giftName = details.giftName || ext.name || `presente ${giftId}`;
      const diamonds = Number(details.diamondCount ?? ext.diamond_count ?? 1) || 1;
      const total = Number(d.repeatCount) || 1;
      let count = total;
      if (details.giftType === 1) {
        const key = `${u.id}:${giftId}:${d.groupId ?? ''}`;
        const prev = streaks.get(key) || 0;
        count = Math.max(0, total - prev);
        if (d.repeatEnd) streaks.delete(key); else streaks.set(key, total);
      }
      if (count <= 0) return;
      stats.gifts += count;
      if (Number(giftId) === 5655) stats.roses += count;
      console.log(`[${time()}] 🎁 ${u.nick}: ${count}x ${giftName} (${diamonds}💎)`);
      broadcast({ type: 'gift', ...u, giftId, giftName, diamonds, count });
    });

    c.on(WebcastEvent.CHAT, (d) => broadcast({ type: 'chat', ...userInfo(d.user), comment: d.comment || '' }));
    c.on(WebcastEvent.LIKE, (d) => broadcast({ type: 'like', ...userInfo(d.user), count: Number(d.likeCount) || 1 }));
    c.on(WebcastEvent.FOLLOW, (d) => broadcast({ type: 'follow', ...userInfo(d.user) }));
    c.on(WebcastEvent.STREAM_END, () => {
      setStatus({ connected: false, message: `Live encerrada (${stats.roses} rosas recebidas). Aguardando a próxima live…` });
      schedule(20);
    });
    c.on(ControlEvent.DISCONNECTED, () => {
      if (!status.connected) return;
      setStatus({ connected: false, message: 'Conexão caiu — reconectando…' });
      schedule(5);
    });
  }

  async function connect() {
    attempt++;
    try { conn?.disconnect?.(); } catch { /* ignora */ }
    conn = new TikTokLiveConnection(USERNAME, { signApiKey: CFG.chave_euler || undefined, enableExtendedGiftInfo: true });
    wire(conn);
    try {
      const st = await conn.connect();
      attempt = 0;
      setStatus({ connected: true, message: `Ao vivo: conectado em @${USERNAME}` });
      if (st?.roomId) console.log(`           sala ${st.roomId}`);
    } catch (e) {
      const name = e?.constructor?.name || '';
      const msg = String(e?.message || e);
      if (/Offline|isn't online|not.*live|LIVE has ended/i.test(name + ' ' + msg)) {
        setStatus({ connected: false, message: `Aguardando @${USERNAME} entrar ao vivo…` });
        schedule(20);
      } else if (/Room ID/i.test(msg)) {
        setStatus({ connected: false, message: `Aguardando @${USERNAME} entrar ao vivo… (se você já está ao vivo, confira o usuário no config.json)` });
        schedule(20);
      } else if (/RateLimit|rate.?limit|429|api.?key|unauthori|401|403/i.test(name + ' ' + msg)) {
        setStatus({ connected: false, message: 'Limite do servidor de assinatura. Coloque uma chave grátis da eulerstream.com em "chave_euler" no config.json' });
        schedule(60);
      } else {
        const wait = Math.min(60, 10 * attempt);
        setStatus({ connected: false, message: `Não conectou (${msg.slice(0, 90)}). Tentando de novo em ${wait}s` });
        schedule(wait);
      }
    }
  }
  connect();
}

function openBrowser(url) {
  const cmd = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') console.error(`\n❌ A porta ${PORT} já está em uso. O jogo já está aberto em outra janela? Feche-a ou mude "porta" no config.json.\n`);
  else console.error(e);
  process.exit(1);
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('\n==============================================');
  console.log('   ⚔️  BATALHA DAS ROSAS — TikTok Live');
  console.log('==============================================');
  console.log(`   Tela do jogo (use no LIVE Studio/OBS): ${url}`);
  console.log(`   Teste sem live:                       ${url}/?demo=1&bots=1`);
  console.log('   Para fechar: feche esta janela (ou Ctrl+C)\n');
  if (USERNAME) startTikTok();
  else console.log('⚠️  Nenhum usuário configurado. Abra o config.json e coloque seu @ em "usuario_tiktok".\n');
  if (CFG.abrir_navegador !== false && !process.env.NO_BROWSER) openBrowser(USERNAME ? url : `${url}/?demo=1`);
});
