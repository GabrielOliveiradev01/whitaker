/**
 * Configuração do tour 360°.
 *
 * Para cada ambiente, coloque a foto equirretangular original (proporção 2:1)
 * em `public/panoramas/` e gere os tiles:
 *   python3 scripts/make-tiles.py public/panoramas/<foto>.jpg <id>
 * Depois preencha `tiles` no ambiente, ex.:
 *   tiles: { dir: 'tiles/elevador', width: 8192 },
 *
 * Enquanto `tiles` não estiver definido, o tour gera uma imagem provisória
 * com grade de graus — útil para posicionar os pontos de navegação.
 *
 * Posições usam graus: `yaw` = horizontal (0° = centro da foto, cresce para a
 * direita), `pitch` = vertical (0° = horizonte, negativo = para baixo).
 * Abra o tour com `?debug` na URL e clique na imagem para ler yaw/pitch.
 */
export const property = {
  name: 'Incorapp',
  subtitle: 'Tour virtual 360°',
  address: '',
  contact: {
    label: 'Agendar visita',
    href: '',
  },
};

export const startRoom = 'lobby';

export const rooms = [
  {
    id: 'lobby',
    name: 'Lobby',
    description: 'Hall de entrada com pé-direito duplo, mármore e recepção 24h.',
    tiles: { dir: 'tiles/lobby', width: 8192 },
    thumbnail: 'panoramas/lobby-thumb.jpg',
    initialView: { yaw: 0, pitch: 0 },
    links: [{ to: 'elevador', yaw: 35, pitch: -4 }],
    info: [{ yaw: 0, pitch: -12, title: 'Recepção', text: 'Concierge e atendimento aos moradores.' }],
  },
  {
    id: 'elevador',
    name: 'Elevador',
    description: 'Hall dos elevadores.',
    initialView: { yaw: 0, pitch: 0 },
    links: [{ to: 'lobby', yaw: 180, pitch: -8 }],
    info: [],
  },
];
