Coloque aqui as fotos 360° originais (equirretangulares, proporção 2:1,
ex.: 8192×4096), uma por ambiente, e gere os tiles:

    python3 scripts/make-tiles.py public/panoramas/<foto>.jpg <id-do-ambiente>

Depois aponte no ambiente, em `src/tour.config.js`:

    tiles: { dir: 'tiles/<id-do-ambiente>', width: 8192 },
