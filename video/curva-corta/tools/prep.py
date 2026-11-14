"""Prepara los recursos del globo a partir de raw/ (ver fetch.py).

assets/albedo.jpg  8192 × 4096 equirectangular: tierra de Sentinel-2 un poco más cálida, relieve horneado con un sol bajo
                   del suroeste (exageración ×20) y el mar sombreado por su profundidad real (bajos verde azulado, hondo azul noche)
assets/height.png  2048 × 1024 equirectangular, altura de la tierra 0–6 400 m en 0–255 (el mar es 0), para desplazar el globo
uso: python -I tools/prep.py <carpeta del clip>
"""
import sys, os, math
import numpy as np
from PIL import Image
from scipy import ndimage

D = sys.argv[1]; RAW = os.path.join(D, 'raw'); OUT = os.path.join(D, 'assets'); os.makedirs(OUT, exist_ok=True)
Image.MAX_IMAGE_PIXELS = None


def to_equi(m, W, H, OW, OH, order=1):
    lon = (np.arange(OW) + .5) / OW * 360 - 180
    lat = 90 - (np.arange(OH) + .5) / OH * 180
    latc = np.clip(lat, -85.05, 85.05)
    X = (lon + 180) / 360 * W - .5
    Y = (1 - np.log(np.tan(np.radians(latc)) + 1 / np.cos(np.radians(latc))) / math.pi) / 2 * H - .5
    XX, YY = np.meshgrid(X, Y)
    if m.ndim == 2: return ndimage.map_coordinates(m, [YY, XX], order=order, mode='nearest'), lat
    return np.stack([ndimage.map_coordinates(m[..., c], [YY, XX], order=order, mode='nearest') for c in range(m.shape[2])], -1), lat


OW, OH = 8192, 4096
t = np.asarray(Image.open(os.path.join(RAW, 'terr_z4.png')).convert('RGB'), np.float32)
hm = t[..., 0] * 256 + t[..., 1] + t[..., 2] / 256 - 32768          # metros (terrarium)
h, lat = to_equi(hm, hm.shape[1], hm.shape[0], OW, OH)
s2 = np.asarray(Image.open(os.path.join(RAW, 's2_z5.jpg')).convert('RGB'), np.float32)
img, _ = to_equi(s2, s2.shape[1], s2.shape[0], OW, OH)
a = (img / 255) ** 2.2
l = (a * [.2126, .7152, .0722]).sum(-1, keepdims=True)
a = l + (a - l) * .86; a = a * np.array([1.06, 1.0, .9])           # tierra: un poco menos saturada y más cálida

# relieve horneado: sol a 20° de altura desde el suroeste, exageración ×20
kmpx = 40030 / OW; coslat = np.cos(np.radians(lat))[:, None]
hl = np.maximum(h, 0) * 20 / 1000                                    # km exagerados
hs_ = ndimage.gaussian_filter(hl, 1.2, mode=('nearest', 'wrap'))   # da la vuelta en la línea de 180°
gy = np.gradient(hs_, axis=0); gx = (np.roll(hs_, -1, 1) - np.roll(hs_, 1, 1)) / 2
gx = gx / (kmpx * np.maximum(coslat, .05)); gy = -gy / kmpx       # pendientes este y norte
az, el = math.radians(225), math.radians(20)
sx, sy, sz = math.cos(el) * math.sin(az), math.cos(el) * math.cos(az), math.sin(el)
n = np.sqrt(gx ** 2 + gy ** 2 + 1)
shade = np.clip((-gx * sx - gy * sy + sz) / n / sz, 0, 2.2)
land = h > 0
a = np.where(land[..., None], a * (.58 + .42 * shade[..., None]), a)

# mar por profundidad real
dep = np.clip(-h, 0, 6000)
shallow = np.array([.016, .095, .10]); deep = np.array([.0045, .016, .03])
k = np.clip(np.log1p(dep / 40) / np.log1p(5000 / 40), 0, 1)[..., None]
sea = shallow * (1 - k) + deep * k
sea = sea * (1 - .25 * (1 - k)) + a * .25 * (1 - k)                 # un poco de textura de la imagen en los bajos
a = np.where(land[..., None], a, sea)
polar = np.abs(lat)[:, None] > 84.5
rows = np.where(~polar[:, 0])[0]; r0, r1 = rows.min(), rows.max()       # más allá de 84.5°: se estira la última fila con imagen
a[:r0] = ndimage.uniform_filter1d(a[r0], 64, axis=0, mode='wrap')[None]; a[r1 + 1:] = ndimage.uniform_filter1d(a[r1], 64, axis=0, mode='wrap')[None]
a = np.minimum(a, .62)                                               # hielo y nubes sin encandilar
Image.fromarray((np.clip(a, 0, 1) ** (1 / 2.2) * 255 + .5).astype(np.uint8)).save(os.path.join(OUT, 'albedo.jpg'), quality=90)

hs = ndimage.zoom(np.maximum(h, 0), 2048 / OW, order=1)
Image.fromarray(np.clip(hs / 6400 * 255, 0, 255).astype(np.uint8)).save(os.path.join(OUT, 'height.png'))
print('albedo.jpg', OW, OH, '· height.png', hs.shape[::-1])
