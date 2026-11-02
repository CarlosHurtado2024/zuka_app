"""Genera el fondo de los videos de un curso con el mismo degradado que usan los clips de la app
(js/viz.js · drawClipBg). Uso:  python make_background.py "#8b7bff" fondo_algebra.png
"""
import sys

import numpy as np
from PIL import Image

W, H = 1080, 1920


def hex_rgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=float)


def blend(base, color, alpha):
    return base * (1 - alpha[..., None]) + color * alpha[..., None]


def make(color_hex, out):
    color = hex_rgb(color_hex)
    y = np.linspace(0, 1, H)[:, None].repeat(W, axis=1)
    x = np.linspace(0, 1, W)[None, :].repeat(H, axis=0)
    img = np.zeros((H, W, 3)) + hex_rgb('#090b18')
    # Degradado vertical: color al 25 % arriba → #0d1024 al 45 % → #080a16 abajo
    top = blend(hex_rgb('#090b18'), color, np.full((H, W), 0.25))
    mid, bottom = hex_rgb('#0d1024'), hex_rgb('#080a16')
    t1 = np.clip(y / 0.45, 0, 1)[..., None]
    t2 = np.clip((y - 0.45) / 0.55, 0, 1)[..., None]
    grad = np.where(y[..., None] < 0.45, top * (1 - t1) + mid * t1, mid * (1 - t2) + bottom * t2)
    img = grad
    # Brillo radial suave arriba, como en la app
    r = np.hypot((x - 0.5) * W, (y - 0.23) * H) / (W * 0.7)
    glow = np.clip(1 - r, 0, 1) * 0.19
    img = blend(img, color, glow)
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(out)


if __name__ == '__main__':
    make(sys.argv[1] if len(sys.argv) > 1 else '#8b7bff', sys.argv[2] if len(sys.argv) > 2 else 'fondo_algebra.png')
