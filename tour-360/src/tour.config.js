/**
 * Configuração do tour 360°.
 *
 * Para cada ambiente, coloque a foto equirretangular (proporção 2:1) em
 * `public/panoramas/` e preencha `panorama` com o caminho, ex.:
 *   panorama: 'panoramas/sala.jpg'
 *
 * Enquanto `panorama` estiver vazio, o tour gera uma imagem provisória com
 * grade de graus — útil para posicionar os pontos de navegação.
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
    panorama: 'panoramas/IncorApp_Lobby_360_8192x4096.jpg',
    thumbnail: 'panoramas/lobby-thumb.jpg',
    initialView: { yaw: 0, pitch: 0 },
    links: [{ to: 'elevador', yaw: 35, pitch: -4 }],
    info: [{ yaw: 0, pitch: -12, title: 'Recepção', text: 'Concierge e atendimento aos moradores.' }],
  },
  {
    id: 'elevador',
    name: 'Elevador',
    description: 'Hall dos elevadores.',
    panorama: '',
    initialView: { yaw: 0, pitch: 0 },
    links: [{ to: 'lobby', yaw: 180, pitch: -8 }],
    info: [],
  },
];
