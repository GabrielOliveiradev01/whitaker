// Servidor da Batalha TikTok: conecta na live, normaliza eventos e envia pro jogo via WebSocket.
// Uso: node server.js <usuario_tiktok> [porta]
//   ou TIKTOK_USER=fulano PORT=8080 SIGN_API_KEY=xxx node server.js
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');
const USERNAME = (process.argv[2] || process.env.TIKTOK_USER || '').replace(/^@/, '');
const PORT = Number(process.argv[3] || process.env.PORT || 8080);
const SIGN_API_KEY = process.env.SIGN_API_KEY || undefined;

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' };

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.normalize(path.join(PUBLIC, urlPath === '/' ? 'index.html' : urlPath));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });
let status = { type: 'status', connected: false, username: USERNAME, message: USERNAME ? 'Conectando…' : 'Modo demo (sem usuário TikTok)' };
const broadcast = (msg) => { const s = JSON.stringify(msg); for (const c of wss.clients) if (c.readyState === 1) c.send(s); };
const setStatus = (patch) => { status = { ...status, ...patch }; broadcast(status); console.log('[status]', status.message); };
wss.on('connection', (ws) => ws.send(JSON.stringify(status)));

function userInfo(u = {}) {
  const avatar = u.profilePicture?.url?.[0] || u.profilePicture?.urls?.[0] || u.avatarThumb?.urlList?.[0] || u.avatarThumb?.url?.[0] || '';
  return { id: String(u.userId || u.uniqueId || Math.random()), user: u.uniqueId || 'anonimo', nick: u.nickname || u.uniqueId || 'anônimo', avatar };
}

async function connectTikTok() {
  const { TikTokLiveConnection, WebcastEvent, ControlEvent } = await import('tiktok-live-connector');
  const conn = new TikTokLiveConnection(USERNAME, { signApiKey: SIGN_API_KEY, enableExtendedGiftInfo: true });

  // Sequências (streaks) de presentes: enviamos só a diferença a cada evento, pra o jogo reagir em tempo real.
  const streaks = new Map();

  conn.on(WebcastEvent.GIFT, (d) => {
    const u = userInfo(d.user);
    const details = d.giftDetails || {};
    const ext = d.extendedGiftInfo || {};
    const giftId = d.giftId ?? details.giftId;
    const giftName = details.giftName || ext.name || `gift ${giftId}`;
    const diamonds = Number(details.diamondCount ?? ext.diamond_count ?? 1) || 1;
    const total = Number(d.repeatCount) || 1;
    let count = total;
    if (details.giftType === 1) {
      const key = `${u.id}:${giftId}:${d.groupId ?? ''}`;
      const prev = streaks.get(key) || 0;
      count = Math.max(0, total - prev);
      if (d.repeatEnd) streaks.delete(key); else streaks.set(key, total);
    }
    if (count > 0) broadcast({ type: 'gift', ...u, giftId, giftName, diamonds, count });
  });

  conn.on(WebcastEvent.CHAT, (d) => broadcast({ type: 'chat', ...userInfo(d.user), comment: d.comment || '' }));
  conn.on(WebcastEvent.LIKE, (d) => broadcast({ type: 'like', ...userInfo(d.user), count: Number(d.likeCount) || 1 }));
  conn.on(WebcastEvent.FOLLOW, (d) => broadcast({ type: 'follow', ...userInfo(d.user) }));
  conn.on(WebcastEvent.STREAM_END, () => setStatus({ connected: false, message: 'Live encerrada' }));
  conn.on(ControlEvent.DISCONNECTED, () => { setStatus({ connected: false, message: 'Desconectado — tentando de novo em 15s' }); setTimeout(tryConnect, 15000); });

  async function tryConnect() {
    try {
      const st = await conn.connect();
      setStatus({ connected: true, message: `Conectado na live de @${USERNAME} (sala ${st.roomId})` });
    } catch (e) {
      setStatus({ connected: false, message: `Falha ao conectar (${e?.message || e}). Nova tentativa em 30s` });
      setTimeout(tryConnect, 30000);
    }
  }
  tryConnect();
}

server.listen(PORT, () => {
  console.log(`\n⚔️  Batalha TikTok rodando em http://localhost:${PORT}`);
  console.log(`   Modo demo (teclado):     http://localhost:${PORT}/?demo=1\n`);
  if (USERNAME) connectTikTok(); else console.log('Nenhum usuário informado: rodando só em modo demo. Uso: node server.js <usuario_tiktok>');
});
