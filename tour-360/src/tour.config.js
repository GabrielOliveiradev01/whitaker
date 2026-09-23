/**
 * Configuração do tour 360°.
 *
 * Para cada ambiente, coloque a foto equirretangular (proporção 2:1) em
 * `public/panoramas/` e preencha `panorama` com o caminho, ex.:
 *   panorama: '/panoramas/sala.jpg'
 *
 * Enquanto `panorama` estiver vazio, o tour gera uma imagem provisória com
 * grade de graus — útil para posicionar os pontos de navegação.
 *
 * Posições usam graus: `yaw` = horizontal (0° = centro da foto, cresce para a
 * direita), `pitch` = vertical (0° = horizonte, negativo = para baixo).
 * Abra o tour com `?debug` na URL e clique na imagem para ler yaw/pitch.
 */
export const property = {
  name: 'The Residences',
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
    panorama: '/panoramas/lobby.jpg',
    thumbnail: '/panoramas/lobby-thumb.jpg',
    initialView: { yaw: 0, pitch: 0 },
    links: [{ to: 'sala', yaw: 35, pitch: -4 }],
    info: [{ yaw: 0, pitch: -12, title: 'Recepção', text: 'Concierge e atendimento aos moradores.' }],
  },
  {
    id: 'sala',
    name: 'Sala de estar',
    description: 'Living integrado com pé-direito generoso e luz natural.',
    panorama: '',
    initialView: { yaw: 0, pitch: 0 },
    links: [
      { to: 'lobby', yaw: 0, pitch: -8 },
      { to: 'cozinha', yaw: 90, pitch: -8 },
      { to: 'suite', yaw: -90, pitch: -8 },
      { to: 'varanda', yaw: 180, pitch: -8 },
    ],
    info: [],
  },
  {
    id: 'cozinha',
    name: 'Cozinha',
    description: 'Cozinha aberta integrada ao living.',
    panorama: '',
    initialView: { yaw: 0, pitch: 0 },
    links: [{ to: 'sala', yaw: -90, pitch: -8 }],
    info: [],
  },
  {
    id: 'suite',
    name: 'Suíte',
    description: 'Suíte master com closet e banheiro privativo.',
    panorama: '',
    initialView: { yaw: 0, pitch: 0 },
    links: [{ to: 'sala', yaw: 90, pitch: -8 }],
    info: [],
  },
  {
    id: 'varanda',
    name: 'Varanda',
    description: 'Varanda com vista aberta.',
    panorama: '',
    initialView: { yaw: 0, pitch: 0 },
    links: [
      { to: 'sala', yaw: 180, pitch: -8 },
      { to: 'rooftop', yaw: 0, pitch: 10 },
    ],
    info: [],
  },
  {
    id: 'rooftop',
    name: 'Rooftop',
    description: 'Terraço na cobertura com vista panorâmica da cidade.',
    panorama: '',
    initialView: { yaw: 0, pitch: 0 },
    links: [{ to: 'varanda', yaw: 180, pitch: -15 }],
    // Pontos de informação, ex.:
    // { yaw: 45, pitch: 5, title: 'Piscina', text: 'Borda infinita aquecida.' }
    info: [],
  },
];
