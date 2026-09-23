# Tour 360° — Apartamento Rooftop

Visualizador de tour virtual 360° do apartamento, independente da landing page
na raiz do repositório. Feito com Vite + [Photo Sphere Viewer](https://photo-sphere-viewer.js.org/).

```bash
cd tour-360
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

## Recursos

- Navegação entre ambientes por pontos clicáveis na imagem e pela barra inferior
- Transição suave (fade) entre ambientes, com pré-carregamento
- Rotação automática após alguns segundos parado
- Giroscópio no celular (mover o aparelho para olhar em volta)
- Zoom, tela cheia e link direto para um ambiente (`/#elevador`)
- Pontos de informação opcionais (ícone "i" com texto)
- Foto em tiles de alta resolução: carrega rápido e fica nítida em qualquer tela
- Imagem provisória com grade de graus enquanto a foto real não chega

## Como adicionar as fotos

1. Salve a foto 360° original (equirretangular, proporção 2:1, ex.: 8192×4096)
   em `public/panoramas/`.
2. Gere os tiles multirresolução (precisa de `pip install pillow`):
   `python3 scripts/make-tiles.py public/panoramas/<arquivo>.jpg <id-do-ambiente>`
3. Em `src/tour.config.js`, preencha `tiles: { dir: 'tiles/<id>', width: 8192 }` no ambiente.
4. Ajuste os pontos de navegação (`links`): abra `http://localhost:5173/?debug`,
   clique onde fica a porta/passagem e copie o `{ yaw, pitch }` exibido.

## Deploy (Netlify)

Crie um site novo apontando para este repositório com **Base directory = `tour-360`**
(o `netlify.toml` desta pasta já define build e publish).
