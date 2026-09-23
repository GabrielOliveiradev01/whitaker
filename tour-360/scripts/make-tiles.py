"""Gera os tiles multirresolução de um panorama 360° equirretangular.

Uso:
    python3 scripts/make-tiles.py public/panoramas/<foto>.jpg <id-do-ambiente>

Cria public/tiles/<id>/ com:
    base.jpg              prévia 2048×1024 exibida enquanto os tiles carregam
    0/<col>_<row>.jpg     nível 1024 px (2×1 tiles)
    1/<col>_<row>.jpg     nível na largura original (tiles de 512×512)

Requer Pillow (pip install pillow).
"""
import shutil
import sys
from pathlib import Path

from PIL import Image

TILE = 512
Image.MAX_IMAGE_PIXELS = None


def save(img, path, quality):
    path.parent.mkdir(parents=True, exist_ok=True)
    # subsampling=0 (4:4:4) preserva a nitidez de textos e bordas.
    img.save(path, quality=quality, subsampling=0, optimize=True, progressive=True)


def write_level(img, out, level, width):
    level_img = img if img.width == width else img.resize((width, width // 2), Image.LANCZOS)
    cols, rows = width // TILE, width // 2 // TILE
    for col in range(cols):
        for row in range(rows):
            box = (col * TILE, row * TILE, (col + 1) * TILE, (row + 1) * TILE)
            save(level_img.crop(box), out / str(level) / f'{col}_{row}.jpg', 90)
    return cols, rows


def main(src, room_id):
    img = Image.open(src).convert('RGB')
    if img.width != img.height * 2:
        sys.exit(f'{src}: a imagem precisa ter proporção 2:1 (recebido {img.width}×{img.height}).')

    # Largura máxima múltipla de 1024 (para tiles de 512 exatos), até 16384.
    width = min(img.width // 1024 * 1024, 16384)
    if width < 2048:
        sys.exit(f'{src}: largura mínima 2048 px (recebido {img.width}).')
    if width != img.width:
        img = img.resize((width, width // 2), Image.LANCZOS)

    out = Path('public/tiles') / room_id
    shutil.rmtree(out, ignore_errors=True)
    save(img.resize((2048, 1024), Image.LANCZOS), out / 'base.jpg', 85)
    write_level(img, out, 0, 1024)
    cols, rows = write_level(img, out, 1, width)

    print(f'OK: {out} ({width}×{width // 2}, {cols}×{rows} tiles)')
    print(f"No tour.config.js use:  tiles: {{ dir: 'tiles/{room_id}', width: {width} }},")


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
