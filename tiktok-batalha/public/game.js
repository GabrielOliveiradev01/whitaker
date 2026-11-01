// ⚔️ Batalha TikTok — Vermelho x Azul
// Cada 🌹 Rosa recruta 1 soldado com o nome/foto de quem enviou. Depois os times batalham.
'use strict';

// ---------------- Configuração (pode mudar pela URL: ?recrutar=60&max=200&som=0) ----------------
const params = new URLSearchParams(location.search);
const SRV = window.BATALHA_CFG || {}; // vem do config.json via servidor
const CFG = {
  recruitSeconds: Number(params.get('recrutar') || SRV.recruitSeconds || 60),   // duração da fase de recrutamento
  endSeconds: Number(params.get('fim') || SRV.endSeconds || 10),             // tempo mostrando o vencedor
  maxUnitsPerTeam: Number(params.get('max') || SRV.maxUnitsPerTeam || 220),       // limite de soldados por time (desempenho)
  giantMinDiamonds: 5,                                     // presente com >= N diamantes toca som especial
  reinforcements: params.get('reforcos') === '1',          // padrão: o que chega depois de montar o time fica pra próxima rodada
  sound: params.has('som') ? params.get('som') !== '0' : SRV.sound !== false,
  demo: params.has('demo') || !!window.BATALHA_DEMO,
  bots: params.has('bots') || !!window.BATALHA_DEMO,
};
const ROSE_IDS = new Set([5655]);
const isRose = (g) => ROSE_IDS.has(Number(g.giftId)) || /^(rose|rosa)$/i.test(g.giftName || '');

const W = 1080, H = 1920;
const ARENA = { x: 40, y: 330, w: W - 80, h: 1230 };
const TEAMS = {
  red:  { name: 'VERMELHO', color: '#ff3b4e', dark: '#7a0f1c', light: '#ff9aa5', emoji: '🔴' },
  blue: { name: 'AZUL',     color: '#2f8bff', dark: '#0c2f6b', light: '#9cc7ff', emoji: '🔵' },
};
const other = (t) => (t === 'red' ? 'blue' : 'red');

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// ---------------- Estado ----------------
const players = new Map();   // id -> { id, nick, avatar, team, roses, kills }
let units = [];
let particles = [];
let floaters = [];
let feed = [];               // últimas mensagens na tela
let phase = 'recruit';       // recruit | countdown | battle | end
let phaseTime = CFG.recruitSeconds;
let winner = null;
let round = 1;
let wins = { red: 0, blue: 0 };
let banner = null;           // { text, color, t }
let connStatus = { connected: false, message: CFG.demo ? 'Modo demo' : 'Conectando ao servidor…' };
let nextUnitId = 1;

// ---------------- Imagens (fotos de perfil) ----------------
const imgCache = new Map();
function avatarImg(url) {
  if (!url) return null;
  let e = imgCache.get(url);
  if (!e) {
    e = { img: new Image(), ok: false };
    e.img.referrerPolicy = 'no-referrer';
    e.img.onload = () => (e.ok = true);
    e.img.src = url;
    imgCache.set(url, e);
  }
  return e.ok ? e.img : null;
}

// ---------------- Som (sintetizado, sem arquivos) ----------------
let audio = null;
function beep(freq, dur = 0.08, type = 'square', vol = 0.04) {
  if (!CFG.sound) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
    o.connect(g).connect(audio.destination);
    o.start(); o.stop(audio.currentTime + dur);
  } catch { /* sem áudio */ }
}
let lastHitSound = 0;

// ---------------- Jogadores e times ----------------
function teamCount(t) { let n = 0; for (const u of units) if (u.team === t && u.hp > 0) n++; return n; }
function teamPower(t) { let n = 0; for (const u of units) if (u.team === t && u.hp > 0) n += u.hp; return n; }

function getPlayer(ev) {
  let p = players.get(ev.id);
  if (!p) {
    p = { id: ev.id, nick: ev.nick || ev.user || 'anônimo', avatar: ev.avatar || '', team: null, roses: 0, kills: 0 };
    players.set(ev.id, p);
  }
  if (ev.nick) p.nick = ev.nick;
  if (ev.avatar) p.avatar = ev.avatar;
  return p;
}

function chooseTeamFromComment(text) {
  const first = (text || '').trim().toLowerCase().split(/\s+/)[0] || '';
  if (['1', 'vermelho', 'red', '🔴', '❤️', '❤'].includes(first)) return 'red';
  if (['2', 'azul', 'blue', '🔵', '💙'].includes(first)) return 'blue';
  return null;
}

function assignTeam(p) {
  if (!p.team) { p.team = teamCount('red') <= teamCount('blue') ? 'red' : 'blue'; reportTeam(p); }
  return p.team;
}

function pushFeed(text, color = '#fff') {
  feed.unshift({ text, color, t: 6 });
  if (feed.length > 6) feed.pop();
}

// ---------------- Unidades ----------------
function spawnPoint(team) {
  const margin = 60;
  const x = ARENA.x + margin + Math.random() * (ARENA.w - margin * 2);
  const band = 230;
  const y = team === 'red'
    ? ARENA.y + margin + Math.random() * band
    : ARENA.y + ARENA.h - margin - Math.random() * band;
  return { x, y };
}

// Cada pessoa tem UM lutador. Cada 🌹 = +1 de poder: ele fica maior, com mais vida e mais dano.
const BIG = 10; // a partir desse poder o lutador ganha coroa e ataque em área
function applyPower(u) {
  const pw = u.power;
  const hpFrac = u.maxHp ? u.hp / u.maxHp : 1;
  u.r = Math.min(22 + Math.sqrt(pw - 1) * 9, 120);
  u.maxHp = 100 * pw;
  u.hp = Math.max(1, u.maxHp * hpFrac);
  u.dmg = Math.round(10 * Math.sqrt(pw));
  u.speed = Math.max(55, 110 - Math.sqrt(pw) * 5);
  u.range = u.r * 0.35;
}

function spawnUnit(p, power) {
  const { x, y } = spawnPoint(p.team);
  const u = {
    id: nextUnitId++, owner: p.id, team: p.team, x, y, vx: 0, vy: 0,
    power, r: 22, maxHp: 0, hp: 0, dmg: 10, speed: 100, range: 0,
    cd: Math.random() * 0.5, target: null, retarget: 0, spawnT: 0.5, hitT: 0,
  };
  applyPower(u);
  u.hp = u.maxHp;
  units.push(u);
  burst(x, y, TEAMS[p.team].color, 14);
  return u;
}

function growFighter(p, amount) {
  let u = units.find((v) => v.owner === p.id && v.hp > 0);
  if (!u) {
    if (teamCount(p.team) >= CFG.maxUnitsPerTeam) return null;
    return spawnUnit(p, amount);
  }
  const wasBig = u.power >= BIG;
  u.power += amount;
  applyPower(u);
  if (phase !== 'battle') u.hp = u.maxHp; // fora da batalha fica com vida cheia
  u.spawnT = 0.35;
  burst(u.x, u.y, TEAMS[u.team].light, Math.min(40, 6 + amount * 2));
  floatText(u.x, u.y - u.r - 20, `+${amount}🌹`, '#ffd34d');
  if (!wasBig && u.power >= BIG) showBanner(`👑 ${p.nick} virou GIGANTE!`, TEAMS[u.team].color);
  return u;
}

function addGift(ev) {
  const p = getPlayer(ev);
  const team = assignTeam(p);
  const T = TEAMS[team];
  const amount = ev.count * (isRose(ev) ? 1 : Math.max(1, ev.diamonds));
  if (phase === 'end' || phase === 'countdown' || (phase === 'battle' && !CFG.reinforcements)) {
    pushFeed(`⏳ ${p.nick} +${amount}🌹 → próxima rodada ${T.emoji}`, T.light);
    p.pending = (p.pending || 0) + amount;
    return;
  }
  p.roses += amount;
  const u = growFighter(p, amount);
  const label = isRose(ev) ? `🌹 ${p.nick} +${amount}` : `🎁 ${p.nick} ${ev.giftName} +${amount}`;
  pushFeed(`${label} ${T.emoji}  (poder ${u ? u.power : p.roses})`, isRose(ev) ? T.light : '#ffd34d');
  if (!isRose(ev) && amount >= CFG.giantMinDiamonds) beep(180, 0.3, 'sawtooth', 0.06);
  else beep(660, 0.06, 'triangle', 0.05);
}

function onChat(ev) {
  const t = chooseTeamFromComment(ev.comment);
  if (!t) return;
  const p = getPlayer(ev);
  if (p.team === t) return;
  const hasUnits = units.some((u) => u.owner === p.id && u.hp > 0);
  if (hasUnits && phase === 'battle') return; // não troca de time no meio da luta
  p.team = t;
  reportTeam(p);
  for (const u of units) if (u.owner === p.id) { u.team = t; const s = spawnPoint(t); u.x = s.x; u.y = s.y; }
  pushFeed(`${p.nick} entrou no time ${TEAMS[t].emoji} ${TEAMS[t].name}`, TEAMS[t].light);
}

// ---------------- Efeitos ----------------
function burst(x, y, color, n = 12) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = 80 + Math.random() * 260;
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.4 + Math.random() * 0.5, max: 0.9, color, size: 3 + Math.random() * 5 });
  }
  if (particles.length > 1500) particles.splice(0, particles.length - 1500);
}
function floatText(x, y, text, color) {
  floaters.push({ x, y, text, color, life: 0.8 });
  if (floaters.length > 120) floaters.shift();
}
function showBanner(text, color) { banner = { text, color, t: 2.5 }; }

// ---------------- Fases ----------------
function startPhase(name) {
  phase = name;
  if (name === 'recruit') {
    phaseTime = CFG.recruitSeconds;
    winner = null;
    units = []; particles = [];
    for (const p of players.values()) {
      p.kills = 0; p.roses = 0;
      if (p.pending && p.team) { const n = p.pending; p.pending = 0; p.roses += n; growFighter(p, n); }
    }
    showBanner(`RODADA ${round} — ENVIE 🌹 PARA RECRUTAR!`, '#ffd34d');
  } else if (name === 'countdown') {
    phaseTime = 3.99;
  } else if (name === 'battle') {
    phaseTime = 0;
    showBanner('⚔️ BATALHA! ⚔️', '#ffffff');
    beep(220, 0.4, 'sawtooth', 0.07);
  } else if (name === 'end') {
    phaseTime = CFG.endSeconds;
    wins[winner]++;
    round++;
    beep(523, 0.15, 'square', 0.06); setTimeout(() => beep(659, 0.15, 'square', 0.06), 150); setTimeout(() => beep(784, 0.3, 'square', 0.06), 300);
  }
}

function mvp(team) {
  let best = null;
  for (const p of players.values()) {
    if (p.team !== team) continue;
    const score = p.kills * 2 + p.roses;
    if (score > 0 && (!best || score > best.score)) best = { p, score };
  }
  return best && best.p;
}

// ---------------- Simulação ----------------
const GRID = 80;
let grid = new Map();
function buildGrid() {
  grid = new Map();
  for (const u of units) {
    if (u.hp <= 0) continue;
    const k = ((u.x / GRID) | 0) + ',' + ((u.y / GRID) | 0);
    let c = grid.get(k); if (!c) grid.set(k, (c = [])); c.push(u);
  }
}
function neighbors(u, cb) {
  const gx = (u.x / GRID) | 0, gy = (u.y / GRID) | 0;
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
    const c = grid.get((gx + dx) + ',' + (gy + dy)); if (c) for (const o of c) if (o !== u) cb(o);
  }
}
// Fúria: depois de 45s de batalha o dano sobe sem parar, pra toda rodada ter fim
function fury() { return phase === 'battle' ? 1 + Math.max(0, phaseTime - 45) / 15 : 1; }
function nearestEnemy(u) {
  let best = null, bd = Infinity;
  for (const o of units) {
    if (o.team === u.team || o.hp <= 0) continue;
    const d = (o.x - u.x) ** 2 + (o.y - u.y) ** 2;
    if (d < bd) { bd = d; best = o; }
  }
  return best;
}

function update(dt) {
  // timers de fase
  if (phase === 'recruit') {
    phaseTime -= dt;
    if (phaseTime <= 0) {
      if (teamCount('red') > 0 && teamCount('blue') > 0) startPhase('countdown');
      else { phaseTime = 30; showBanner('Faltam soldados! +30s — ENVIE 🌹', '#ffd34d'); }
    }
  } else if (phase === 'countdown') {
    const before = Math.ceil(phaseTime);
    phaseTime -= dt;
    if (Math.ceil(phaseTime) !== before && phaseTime > 0) beep(440, 0.1, 'square', 0.05);
    if (phaseTime <= 0) startPhase('battle');
  } else if (phase === 'battle') {
    phaseTime += dt;
    const r = teamCount('red'), b = teamCount('blue');
    if (r === 0 || b === 0) { winner = r > 0 ? 'red' : b > 0 ? 'blue' : (Math.random() < 0.5 ? 'red' : 'blue'); startPhase('end'); }
  } else if (phase === 'end') {
    phaseTime -= dt;
    if (phaseTime <= 0) startPhase('recruit');
  }

  buildGrid();
  const fighting = phase === 'battle';

  for (const u of units) {
    if (u.hp <= 0) continue;
    u.spawnT = Math.max(0, u.spawnT - dt);
    u.hitT = Math.max(0, u.hitT - dt);
    u.cd -= dt;
    let ax = 0, ay = 0;

    if (fighting) {
      u.retarget -= dt;
      if (!u.target || u.target.hp <= 0 || u.retarget <= 0) { u.target = nearestEnemy(u); u.retarget = 0.4 + Math.random() * 0.3; }
      const t = u.target;
      if (t) {
        const dx = t.x - u.x, dy = t.y - u.y, d = Math.hypot(dx, dy) || 1;
        const reach = u.r + t.r + u.range;
        if (d > reach) { ax += (dx / d) * u.speed; ay += (dy / d) * u.speed; }
        else if (u.cd <= 0) {
          const big = u.power >= BIG;
          u.cd = big ? 0.9 : 0.6 + Math.random() * 0.2;
          const hit = (v, mult) => {
            const dmg = Math.round(u.dmg * mult * fury() * (0.8 + Math.random() * 0.4));
            v.hp -= dmg; v.hitT = 0.12;
            const hx = v.x - u.x, hy = v.y - u.y, hd = Math.hypot(hx, hy) || 1;
            const kb = 120 * Math.min(4, 1 + u.r / Math.max(v.r, 1) * 0.5);
            v.vx += (hx / hd) * kb; v.vy += (hy / hd) * kb;
            floatText(v.x, v.y - v.r, '-' + dmg, '#fff');
            if (v.hp <= 0) {
              burst(v.x, v.y, TEAMS[v.team].color, v.power >= BIG ? 40 : 14);
              const killer = players.get(u.owner); if (killer) killer.kills++;
            }
          };
          hit(t, 1);
          if (big) {
            // ataque em área: atinge outros inimigos encostados no gigante
            neighbors(u, (o) => {
              if (o === t || o.team === u.team || o.hp <= 0) return;
              if (Math.hypot(o.x - u.x, o.y - u.y) < u.r + o.r + 25) hit(o, 0.5);
            });
            burst(u.x + dx / d * u.r, u.y + dy / d * u.r, '#ffd34d', 6);
          }
          if (performance.now() - lastHitSound > 60) { beep(120 + Math.random() * 120, 0.04, 'square', 0.02); lastHitSound = performance.now(); }
        }
      }
    } else {
      // vagando calmamente na sua base
      const home = u.team === 'red' ? ARENA.y + 170 : ARENA.y + ARENA.h - 170;
      ay += (home - u.y) * 0.8;
      ax += Math.sin(performance.now() / 900 + u.id) * 15;
    }

    // separação
    neighbors(u, (o) => {
      const dx = u.x - o.x, dy = u.y - o.y, d = Math.hypot(dx, dy) || 0.01, min = u.r + o.r;
      if (d < min) { const push = (min - d) * 6; ax += (dx / d) * push; ay += (dy / d) * push; }
    });

    u.vx = (u.vx + ax * dt * 6) * Math.pow(0.02, dt);
    u.vy = (u.vy + ay * dt * 6) * Math.pow(0.02, dt);
    u.x += u.vx * dt; u.y += u.vy * dt;
    u.x = Math.max(ARENA.x + u.r, Math.min(ARENA.x + ARENA.w - u.r, u.x));
    u.y = Math.max(ARENA.y + u.r, Math.min(ARENA.y + ARENA.h - u.r, u.y));
  }
  units = units.filter((u) => u.hp > 0);

  for (const p of particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.92; p.vy *= 0.92; p.life -= dt; }
  particles = particles.filter((p) => p.life > 0);
  for (const f of floaters) { f.y -= 60 * dt; f.life -= dt; }
  floaters = floaters.filter((f) => f.life > 0);
  for (const f of feed) f.t -= dt;
  feed = feed.filter((f) => f.t > 0);
  if (banner) { banner.t -= dt; if (banner.t <= 0) banner = null; }
}

// ---------------- Desenho ----------------
function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function text(str, x, y, size, color = '#fff', align = 'center', weight = 900, stroke = true) {
  ctx.font = `${weight} ${size}px system-ui, "Segoe UI", Arial, sans-serif`;
  ctx.textAlign = align; ctx.textBaseline = 'middle';
  if (stroke) { ctx.lineWidth = Math.max(3, size / 7); ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.lineJoin = 'round'; ctx.strokeText(str, x, y); }
  ctx.fillStyle = color; ctx.fillText(str, x, y);
}
function clip(str, n) { return str.length > n ? str.slice(0, n - 1) + '…' : str; }

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#2a0710'); g.addColorStop(0.5, '#0b0d16'); g.addColorStop(1, '#061633');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // arena
  roundRect(ARENA.x, ARENA.y, ARENA.w, ARENA.h, 36);
  const ag = ctx.createLinearGradient(0, ARENA.y, 0, ARENA.y + ARENA.h);
  ag.addColorStop(0, 'rgba(255,59,78,.22)'); ag.addColorStop(0.5, 'rgba(30,34,50,.6)'); ag.addColorStop(1, 'rgba(47,139,255,.22)');
  ctx.fillStyle = ag; ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.stroke();

  // linha do meio
  ctx.save(); ctx.setLineDash([24, 18]); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(ARENA.x + 20, ARENA.y + ARENA.h / 2); ctx.lineTo(ARENA.x + ARENA.w - 20, ARENA.y + ARENA.h / 2); ctx.stroke(); ctx.restore();
  ctx.globalAlpha = 0.08; text('⚔️', W / 2, ARENA.y + ARENA.h / 2, 260, '#fff', 'center', 900, false); ctx.globalAlpha = 1;
}

function drawHeader() {
  const r = teamCount('red'), b = teamCount('blue');
  text('⚔️ BATALHA DAS ROSAS ⚔️', W / 2, 62, 58, '#ffd34d');

  // placar de soldados
  const bx = 60, by = 120, bw = W - 120, bh = 76;
  const pr = teamPower('red'), pb = teamPower('blue');
  const frac = pr + pb > 0 ? pr / (pr + pb) : 0.5;
  roundRect(bx, by, bw, bh, 38); ctx.fillStyle = TEAMS.blue.color; ctx.fill();
  ctx.save(); roundRect(bx, by, bw, bh, 38); ctx.clip(); ctx.fillStyle = TEAMS.red.color; ctx.fillRect(bx, by, bw * frac, bh); ctx.restore();
  ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; roundRect(bx, by, bw, bh, 38); ctx.stroke();
  text(`🔴 ${r}`, bx + 30, by + bh / 2, 46, '#fff', 'left');
  text(`${b} 🔵`, bx + bw - 30, by + bh / 2, 46, '#fff', 'right');
  text(`VITÓRIAS ${wins.red} x ${wins.blue}`, W / 2, by + bh / 2, 30, '#fff');

  // fase
  let label = '';
  if (phase === 'recruit') label = `RECRUTAMENTO • ${Math.ceil(phaseTime)}s`;
  else if (phase === 'countdown') label = 'PREPAREM-SE…';
  else if (phase === 'battle') label = fury() > 1 ? `🔥 FÚRIA x${fury().toFixed(1)} • ${Math.floor(phaseTime)}s` : `BATALHA • ${Math.floor(phaseTime)}s`;
  else label = 'FIM DA RODADA';
  text(`RODADA ${round}  •  ${label}`, W / 2, 245, 40, phase === 'battle' ? '#ff6b6b' : '#fff');
  if (phase !== 'recruit') {
    let pr = 0, pb = 0;
    for (const p of players.values()) if (p.pending) { if (p.team === 'red') pr += p.pending; else pb += p.pending; }
    text(`⏳ PRÓXIMA RODADA:  🔴 ${pr}🌹   🔵 ${pb}🌹`, W / 2, 292, 28, '#ffd34d', 'center', 800);
  }
  if (phase === 'recruit' && CFG.recruitSeconds > 0) {
    const f = Math.max(0, phaseTime) / CFG.recruitSeconds;
    roundRect(160, 280, W - 320, 14, 7); ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fill();
    roundRect(160, 280, (W - 320) * Math.min(1, f), 14, 7); ctx.fillStyle = '#ffd34d'; ctx.fill();
  }
}

function drawUnits() {
  const showNames = units.length <= 160;
  const sorted = units.slice().sort((a, b) => a.y - b.y);
  for (const u of sorted) {
    const T = TEAMS[u.team];
    const p = players.get(u.owner);
    const s = 1 + u.spawnT * 1.2;
    const r = u.r * s;

    // sombra
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.beginPath(); ctx.ellipse(u.x, u.y + r * 0.9, r * 0.9, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();

    // corpo
    ctx.beginPath(); ctx.arc(u.x, u.y, r, 0, Math.PI * 2);
    ctx.fillStyle = u.hitT > 0 ? '#ffffff' : T.dark; ctx.fill();
    const img = p && avatarImg(p.avatar);
    if (img && u.hitT <= 0) {
      ctx.save(); ctx.beginPath(); ctx.arc(u.x, u.y, r - 3, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(img, u.x - r, u.y - r, r * 2, r * 2); ctx.restore();
    } else if (u.hitT <= 0 && p) {
      text((p.nick || '?').slice(0, 1).toUpperCase(), u.x, u.y + 1, r * 1.1, T.light, 'center', 900, false);
    }
    const big = u.power >= BIG;
    ctx.lineWidth = big ? 7 : 4; ctx.strokeStyle = big ? '#ffd34d' : T.color;
    ctx.beginPath(); ctx.arc(u.x, u.y, r, 0, Math.PI * 2); ctx.stroke();
    if (big) text('👑', u.x, u.y - r - 14, Math.max(26, r * 0.5), '#fff', 'center', 900, false);

    // vida
    if (u.hp < u.maxHp) {
      const w = r * 2, f = Math.max(0, u.hp / u.maxHp);
      ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(u.x - w / 2, u.y - r - 10, w, 6);
      ctx.fillStyle = f > 0.5 ? '#5dff7a' : f > 0.25 ? '#ffd34d' : '#ff4d4d'; ctx.fillRect(u.x - w / 2, u.y - r - 10, w * f, 6);
    }
    if ((showNames || big) && p) {
      const fs = Math.min(34, 17 + Math.sqrt(u.power) * 1.5);
      text(clip(p.nick, 12), u.x, u.y + r + fs * 0.8, fs, '#fff', 'center', 800);
      if (u.power > 1) text(`🌹${u.power}`, u.x, u.y + r + fs * 1.9, fs * 0.8, '#ffd34d', 'center', 800);
    }
  }
}

function drawEffects() {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  for (const f of floaters) { ctx.globalAlpha = Math.max(0, f.life / 0.8); text(f.text, f.x, f.y, 22, f.color, 'center', 900); }
  ctx.globalAlpha = 1;
}

function drawFooter() {
  const y0 = ARENA.y + ARENA.h + 20;
  // instruções
  roundRect(40, y0, W - 80, 150, 28); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fill();
  text('Comente  1 = 🔴 VERMELHO   ou   2 = 🔵 AZUL', W / 2, y0 + 45, 38, '#fff');
  text(phase === 'recruit' ? 'Cada 🌹 = seu lutador CRESCE  •  10🌹 = GIGANTE 👑' : '🌹 enviadas agora valem para a PRÓXIMA RODADA', W / 2, y0 + 105, 32, '#ffd34d');

  // ranking de recrutadores
  const top = [...players.values()].filter((p) => p.roses > 0 || p.kills > 0)
    .sort((a, b) => (b.roses + b.kills * 2) - (a.roses + a.kills * 2)).slice(0, 3);
  let y = y0 + 195;
  text('🏆 TOP GUERREIROS', W / 2, y, 30, '#fff'); y += 42;
  const medals = ['🥇', '🥈', '🥉'];
  top.forEach((p, i) => {
    const c = p.team ? TEAMS[p.team].light : '#fff';
    text(`${medals[i]} ${clip(p.nick, 16)}  🌹${p.roses}  ⚔️${p.kills}`, W / 2, y, 30, c, 'center', 800); y += 38;
  });

  // status de conexão
  ctx.globalAlpha = 0.7;
  text(`${connStatus.connected ? '🟢' : '⚪'} ${connStatus.message || ''}`, W / 2, H - 14, 18, '#cfd3e0', 'center', 600);
  ctx.globalAlpha = 1;
}

function drawFeed() {
  let y = ARENA.y + 40;
  for (const f of feed) {
    ctx.globalAlpha = Math.min(1, f.t);
    ctx.font = '800 26px system-ui, Arial, sans-serif';
    const w = Math.min(ctx.measureText(f.text).width + 30, ARENA.w - 40);
    roundRect(ARENA.x + 20, y - 20, w, 40, 20); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fill();
    text(clip(f.text, 44), ARENA.x + 35, y, 26, f.color, 'left', 800, false);
    y += 48;
  }
  ctx.globalAlpha = 1;
}

function drawOverlay() {
  const cy = ARENA.y + ARENA.h / 2;
  if (phase === 'recruit' && units.length === 0) {
    text('ENVIE UMA 🌹 PARA', W / 2, cy - 50, 64, '#fff');
    text('ENTRAR NA BATALHA!', W / 2, cy + 30, 64, '#ffd34d');
    if (!CFG.demo && !connStatus.connected) text('⚠️ ' + clip(connStatus.message || '', 52), W / 2, cy + 120, 28, '#ffb3b3', 'center', 800);
  }
  if (phase === 'countdown') {
    const n = Math.ceil(phaseTime);
    const k = phaseTime - Math.floor(phaseTime);
    text(n > 0 ? String(n) : 'JÁ!', W / 2, cy, 220 + k * 80, '#ffd34d');
  }
  if (phase === 'end' && winner) {
    const T = TEAMS[winner];
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, cy - 260, W, 520);
    text('VITÓRIA DO TIME', W / 2, cy - 170, 60, '#fff');
    text(`${T.emoji} ${T.name} ${T.emoji}`, W / 2, cy - 70, 120, T.color);
    const m = mvp(winner);
    if (m) {
      const img = avatarImg(m.avatar);
      if (img) { ctx.save(); ctx.beginPath(); ctx.arc(W / 2, cy + 80, 60, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(img, W / 2 - 60, cy + 20, 120, 120); ctx.restore(); }
      text(`MVP: ${clip(m.nick, 18)}`, W / 2, cy + 175, 48, '#ffd34d');
      text(`🌹 ${m.roses}  •  ⚔️ ${m.kills} abates`, W / 2, cy + 225, 34, '#fff');
    }
  }
  if (banner) {
    ctx.globalAlpha = Math.min(1, banner.t * 2);
    const y = ARENA.y + ARENA.h - 90;
    roundRect(70, y - 45, W - 140, 90, 45); ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = banner.color; ctx.stroke();
    text(clip(banner.text, 36), W / 2, y, 40, banner.color);
    ctx.globalAlpha = 1;
  }
}

function render() {
  drawBackground();
  drawHeader();
  drawUnits();
  drawEffects();
  drawFeed();
  drawOverlay();
  drawFooter();
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  update(dt); render();
  requestAnimationFrame(loop);
}

// ---------------- Conexão com o servidor ----------------
function handleEvent(ev) {
  if (ev.type === 'status') {
    connStatus = { ...ev, bridge: true };
    // configurações do config.json do PC (a URL tem prioridade)
    const g = ev.game || {};
    if (g.recruitSeconds && !params.has('recrutar')) CFG.recruitSeconds = g.recruitSeconds;
    if (g.endSeconds && !params.has('fim')) CFG.endSeconds = g.endSeconds;
    if (g.maxUnitsPerTeam && !params.has('max')) CFG.maxUnitsPerTeam = g.maxUnitsPerTeam;
    if (typeof g.sound === 'boolean' && !params.has('som')) CFG.sound = g.sound;
  }
  else if (ev.type === 'gift') addGift(ev);
  else if (ev.type === 'chat') onChat(ev);
}
// Aberto pelo servidor local (localhost): conecta nele mesmo.
// Aberto pela Netlify (ou outro site): procura a "ponte" rodando no PC em ws://localhost:8080.
let socket = null;
function reportTeam(p) { try { if (socket && socket.readyState === 1) socket.send(JSON.stringify({ type: 'team', id: p.id, team: p.team })); } catch { /* sem servidor */ } }
const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(location.hostname);
function connectWS() {
  if (window.BATALHA_DEMO) { connStatus = { connected: false, message: 'Demonstração com bots (sem live)' }; return; }
  if (location.protocol === 'file:') { connStatus = { connected: false, message: 'Aberto como arquivo: só modo demo' }; return; }
  const url = IS_LOCAL
    ? (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host
    : `ws://localhost:${params.get('porta') || 8080}`;
  let ws;
  try { ws = new WebSocket(url); socket = ws; } catch { setTimeout(connectWS, 3000); return; }
  ws.onmessage = (m) => { try { handleEvent(JSON.parse(m.data)); } catch (e) { console.error(e); } };
  ws.onclose = () => {
    connStatus = { connected: false, bridge: false, message: IS_LOCAL ? 'Servidor offline — reconectando…' : 'Ponte desligada: abra o iniciar-windows.bat no seu PC' };
    setTimeout(connectWS, 3000);
  };
}

// ---------------- Modo demo / bots ----------------
const FAKE = ['ana_luz', 'pedrogamer', 'jujuba', 'leo.br', 'mari_s2', 'tiagao', 'bia.flor', 'kaique', 'duda', 'rafa99', 'lucas_mito', 'gabi', 'nanda', 'joaozin', 'carol', 'vini', 'isa', 'davi'];
const fakeUsers = FAKE.map((n, i) => ({ id: 'bot' + i, user: n, nick: n, avatar: '' }));
function fakeGift(team, count = 1, diamonds = 1) {
  // bots de índice par são do Vermelho, ímpar do Azul
  const pool = fakeUsers.filter((_, i) => (i % 2 === 0) === (team === 'red'));
  const u = pool[(Math.random() * pool.length) | 0];
  onChat({ ...u, comment: team === 'red' ? '1' : '2' });
  const rose = diamonds === 1;
  addGift({ ...u, type: 'gift', giftId: rose ? 5655 : 9999, giftName: rose ? 'Rosa' : 'Leão', diamonds, count });
}
let botsOn = CFG.bots;
setInterval(() => {
  if (!botsOn) return;
  if (phase !== 'recruit' && Math.random() < 0.6) return; // menos rosas fora do recrutamento
  const t = Math.random() < 0.5 ? 'red' : 'blue';
  const r = Math.random();
  if (r > 0.985) fakeGift(t, 1, 30); else fakeGift(t, r < 0.85 ? 1 : 5);
}, 350);

window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (k === 'q') fakeGift('red');
  else if (k === 'p') fakeGift('blue');
  else if (k === 'a') fakeGift('red', 10);
  else if (k === 'l') fakeGift('blue', 10);
  else if (k === 'g') fakeGift('red', 1, 30);
  else if (k === 'h') fakeGift('blue', 1, 30);
  else if (k === 'b') { botsOn = !botsOn; pushFeed(`Bots ${botsOn ? 'ligados' : 'desligados'}`); }
  else if (k === ' ') { if (phase === 'recruit') phaseTime = 0.01; else if (phase === 'end') phaseTime = 0.01; }
  else if (k === 'r') { players.clear(); wins = { red: 0, blue: 0 }; round = 1; startPhase('recruit'); }
});
if (CFG.demo) document.getElementById('demo').style.display = 'block';

// Integração extra: outras ferramentas (ex.: TikFinity) podem chamar window.batalha.gift({...})
window.batalha = { gift: (ev) => addGift({ id: ev.id || ev.user, count: 1, diamonds: 1, ...ev }), chat: onChat };

connectWS();
startPhase('recruit');
requestAnimationFrame(loop);
