import { Viewer } from '@photo-sphere-viewer/core';
import { EquirectangularTilesAdapter } from '@photo-sphere-viewer/equirectangular-tiles-adapter';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import './style.css';

import { property, rooms, startRoom } from './tour.config.js';
import { placeholderPanorama } from './placeholder.js';

const DEBUG = new URLSearchParams(location.search).has('debug');
const deg = (v) => `${v}deg`;
const roomById = new Map(rooms.map((r) => [r.id, r]));

// Panorama em tiles (gerados por scripts/make-tiles.py): uma prévia leve
// aparece na hora e os blocos em resolução total carregam conforme a vista.
// O nível 0 (1024 px) nunca é escolhido na prática, então o visualizador
// sempre usa a resolução máxima, com mipmaps (sem serrilhado ao afastar).
function tiledPanorama({ dir, width }) {
  return {
    baseUrl: `${dir}/base.jpg`,
    levels: [
      { width: 1024, cols: 2, rows: 1 },
      { width, cols: width / 512, rows: width / 1024 },
    ],
    tileUrl: (col, row, level) => `${dir}/${level}/${col}_${row}.jpg`,
  };
}

// Ambiente ainda sem foto: só a imagem provisória, sem tiles.
function placeholderTiles(room, i) {
  return {
    baseUrl: placeholderPanorama(room.name, (i * 47 + 25) % 360),
    width: 4096,
    cols: 8,
    rows: 4,
    tileUrl: () => null,
  };
}

function arrowElement(link) {
  const target = roomById.get(link.nodeId);
  const el = document.createElement('div');
  el.className = 'hotspot';
  el.innerHTML = `
    <span class="hotspot__ring"></span>
    <span class="hotspot__dot"></span>
    <span class="hotspot__label">${target?.name ?? link.nodeId}</span>`;
  return el;
}

const nodes = rooms.map((room, i) => ({
  id: room.id,
  name: room.name,
  caption: room.name,
  description: room.description,
  panorama: room.tiles ? tiledPanorama(room.tiles) : placeholderTiles(room, i),
  thumbnail: room.thumbnail || undefined,
  links: room.links
    .filter((l) => roomById.has(l.to))
    .map((l) => ({
      nodeId: l.to,
      position: { yaw: deg(l.yaw), pitch: deg(l.pitch ?? 0) },
      data: { view: l.view },
    })),
  markers: (room.info ?? []).map((info, j) => ({
    id: `${room.id}-info-${j}`,
    position: { yaw: deg(info.yaw), pitch: deg(info.pitch ?? 0) },
    html: '<div class="info-pin"><span>i</span></div>',
    size: { width: 34, height: 34 },
    anchor: 'center center',
    tooltip: {
      content: `<strong>${info.title ?? ''}</strong>${info.text ? `<p>${info.text}</p>` : ''}`,
      className: 'info-tooltip',
      position: 'top center',
    },
  })),
  data: room,
}));

document.title = `${property.name} — ${property.subtitle}`;
document.querySelector('[data-name]').textContent = property.name;
document.querySelector('[data-subtitle]').textContent = property.subtitle;
if (property.address) document.querySelector('[data-address]').textContent = property.address;
const cta = document.querySelector('[data-cta]');
if (property.contact?.href) {
  cta.textContent = property.contact.label;
  cta.href = property.contact.href;
  cta.hidden = false;
}

const viewer = new Viewer({
  container: document.querySelector('#viewer'),
  adapter: EquirectangularTilesAdapter.withConfig({ baseBlur: false, antialias: true }),
  navbar: false,
  // Em tela vertical (celular) abre mais aberto para mostrar mais do ambiente.
  defaultZoomLvl: window.innerWidth < window.innerHeight ? 0 : 30,
  loadingTxt: '',
  touchmoveTwoFingers: false,
  mousewheelCtrlKey: false,
  plugins: [
    MarkersPlugin,
    AutorotatePlugin.withConfig({
      autostartDelay: 6000,
      autostartOnIdle: true,
      autorotateSpeed: '0.6rpm',
      autorotatePitch: 0,
    }),
    GyroscopePlugin,
    VirtualTourPlugin.withConfig({
      positionMode: 'manual',
      renderMode: '2d',
      nodes,
      startNodeId: roomById.has(startRoom) ? startRoom : rooms[0].id,
      preload: true,
      transitionOptions: { showLoader: true, effect: 'fade', speed: 1200, rotation: true },
      showLinkTooltip: false,
      arrowStyle: { element: arrowElement, size: { width: 64, height: 64 } },
    }),
  ],
});

const tour = viewer.getPlugin(VirtualTourPlugin);
const autorotate = viewer.getPlugin(AutorotatePlugin);
const gyroscope = viewer.getPlugin(GyroscopePlugin);

// --- Barra de ambientes -----------------------------------------------------
const roomBar = document.querySelector('[data-rooms]');
for (const room of rooms) {
  const btn = document.createElement('button');
  btn.className = 'room';
  btn.dataset.room = room.id;
  btn.innerHTML = `<span class="room__name">${room.name}</span>`;
  if (room.thumbnail) btn.style.setProperty('--thumb', `url("${room.thumbnail}")`);
  btn.addEventListener('click', () => {
    if (tour.getCurrentNode()?.id !== room.id) tour.setCurrentNode(room.id);
  });
  roomBar.appendChild(btn);
}

const roomTitle = document.querySelector('[data-room-title]');
const roomDesc = document.querySelector('[data-room-desc]');

tour.addEventListener('node-changed', ({ node, data }) => {
  const room = node.data;
  roomTitle.textContent = room.name;
  roomDesc.textContent = room.description ?? '';
  for (const btn of roomBar.children) {
    const active = btn.dataset.room === node.id;
    btn.classList.toggle('is-active', active);
    if (active) btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }
  const view = data?.fromLink?.data?.view ?? room.initialView;
  if (view) viewer.rotate({ yaw: deg(view.yaw ?? 0), pitch: deg(view.pitch ?? 0) });
  const url = new URL(location.href);
  url.hash = node.id;
  history.replaceState(null, '', url);
});

viewer.addEventListener('ready', () => {
  document.body.classList.add('is-ready');
  const fromHash = location.hash.slice(1);
  if (fromHash && roomById.has(fromHash) && fromHash !== tour.getCurrentNode()?.id) {
    tour.setCurrentNode(fromHash, { showLoader: false });
  }
}, { once: true });

// --- Controles --------------------------------------------------------------
const btnRotate = document.querySelector('[data-action="autorotate"]');
btnRotate.addEventListener('click', () => {
  autorotate.isEnabled() ? autorotate.stop() : autorotate.start();
});
autorotate.addEventListener('autorotate', ({ autorotateEnabled }) => {
  btnRotate.classList.toggle('is-on', autorotateEnabled);
});

const btnGyro = document.querySelector('[data-action="gyroscope"]');
gyroscope.isSupported().then((ok) => {
  btnGyro.hidden = !ok;
});
btnGyro.addEventListener('click', () => gyroscope.toggle());
gyroscope.addEventListener('gyroscope-updated', ({ gyroscopeEnabled }) => {
  btnGyro.classList.toggle('is-on', gyroscopeEnabled);
});

document.querySelector('[data-action="zoom-in"]').addEventListener('click', () => viewer.zoomIn(15));
document.querySelector('[data-action="zoom-out"]').addEventListener('click', () => viewer.zoomOut(15));

const btnFull = document.querySelector('[data-action="fullscreen"]');
btnFull.addEventListener('click', () => {
  try {
    viewer.toggleFullscreen();
  } catch {
    // Tela cheia indisponível (ex.: dentro de iframe no celular).
  }
});
viewer.addEventListener('fullscreen', ({ fullscreenEnabled }) => {
  btnFull.classList.toggle('is-on', fullscreenEnabled);
});

// --- Modo de calibração (?debug) --------------------------------------------
if (DEBUG) {
  const toast = document.createElement('div');
  toast.className = 'debug';
  toast.textContent = 'Modo calibração: clique na imagem para ler yaw/pitch';
  document.body.appendChild(toast);
  viewer.addEventListener('click', ({ data }) => {
    const yaw = Math.round(((data.yaw * 180) / Math.PI + 540) % 360 - 180);
    const pitch = Math.round((data.pitch * 180) / Math.PI);
    const text = `{ yaw: ${yaw}, pitch: ${pitch} }`;
    toast.textContent = `${tour.getCurrentNode().id} → ${text}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    console.log(tour.getCurrentNode().id, text);
  });
}
