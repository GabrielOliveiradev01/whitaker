# Whitaker — Landing Page Premium

Landing page de altíssimo padrão para o **Whitaker**: um MCP (assistente de IA)
que se conecta ao seu celular, monitora tudo em tempo real e envia **avisos
prévios sobre todas as operações financeiras** — antes que elas aconteçam.

A sensação proposta é a de entrar em uma **plataforma financeira exclusiva de
IA**, não em um app comum.

## Direção visual

- Fundo preto absoluto (`#050505`), grafite e cinza escuro
- Detalhes em dourado fosco / prata premium
- Glassmorphism discreto + gradientes suaves
- Muito espaço negativo
- Tipografia serifada de display (Cormorant Garamond) + Inter

## Recursos / animações

- **Cursor personalizado** (dot dourado + anel com lag)
- **Partículas douradas** flutuando lentamente (canvas)
- **Núcleo 3D** (Three.js) girando, com arcos dourados representando o fluxo de operações
- **Mockup de celular** com avisos prévios animando em sequência
- **Light sweep** percorrendo os botões no hover
- **Números contando** suavemente ao entrar na viewport
- **Cards 3D** com tilt no mouse, brilho dourado, profundidade e sombra premium
- **Scroll reveal** elegante (blur + fade + slide)
- **Linhas luminosas** conectando os cards da seção de IA
- Barra de progresso de scroll, film grain
- Respeita `prefers-reduced-motion`

## Stack

React · Vite · Tailwind CSS · Framer Motion · Three.js (`@react-three/fiber` + `drei`)

## Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # build de produção em /dist
npm run preview  # preview do build
```

## Deploy na Netlify (upload manual)

1. Gere o build: `npm run build` (cria a pasta `dist/`).
2. Acesse [app.netlify.com](https://app.netlify.com) → **Add new site** → **Deploy manually**.
3. **Arraste a pasta `dist/`** inteira para a área de upload. Pronto.

O projeto já inclui:

- `netlify.toml` — define `publish = "dist"`, build command, Node 20, fallback SPA e cache dos assets.
- `public/_redirects` — copiado para `dist/_redirects` no build, garantindo o fallback `/* → /index.html (200)`.

> Se preferir deploy contínuo, conecte o repositório Git na Netlify: ela lê o
> `netlify.toml` automaticamente (build `npm run build`, publish `dist`).

## Estrutura

```
src/
  components/   # primitivos reutilizáveis (cursor, partículas, núcleo 3D, cards, etc.)
  sections/     # seções da página
  App.jsx       # composição da página
```

## Seções

1. **Hero** — título, subtítulo, CTAs, núcleo 3D + terminal de IA + stats animados
2. **Exclusividade** — "Não Foi Criado Para Todos."
3. **Inteligência** — "Sua IA Nunca Dorme." + 4 cards (Monitoramento, Avisos Prévios, Controle, Proteção)
4. **Controle** — mockup de celular com avisos prévios + "saber de cada operação antes que ela aconteça"
5. **90 Dias Gratuitos** — oferta de fundação
6. **CTA final** — "O Futuro do Controle Financeiro Já Existe."
