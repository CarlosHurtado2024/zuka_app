"""Descarga los datos reales del globo de «La curva más corta» (se corre una vez; build.sh lo llama si faltan).

- Imagen: Sentinel-2 cloudless 2016 de EOX (capa s2cloudless_3857, CC BY 4.0), zoom 5: 32 × 32 teselas = 8192 px Mercator.
- Relieve y batimetría: AWS Terrain Tiles (terrarium), zoom 4: 16 × 16 teselas = 4096 px Mercator.
Escribe raw/s2_z5.jpg, raw/terr_z4.png y anota cada URL en raw/manifest.jsonl.
uso: python -I tools/fetch.py <carpeta del clip>
"""
import sys, os, io, json, time, datetime, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

D = sys.argv[1]; RAW = os.path.join(D, 'raw'); os.makedirs(RAW, exist_ok=True)
LOG = open(os.path.join(RAW, 'manifest.jsonl'), 'a')
UA = {'User-Agent': 'zuka-clip/1.0 (educational video)'}


def get(url):
    for k in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
                b = r.read()
            LOG.write(json.dumps({'url': url, 'bytes': len(b), 'date': datetime.date.today().isoformat()}) + '\n')
            return b
        except Exception:
            if k == 5: raise
            time.sleep(2 + 3 * k)


def mosaic(tmpl, z, out, mode):
    if os.path.exists(out): return
    n = 2 ** z; im = Image.new(mode, (n * 256, n * 256))
    jobs = [(x, y) for y in range(n) for x in range(n)]
    with ThreadPoolExecutor(8) as ex:
        for (x, y), b in ex.map(lambda j: (j, get(tmpl.format(z=z, x=j[0], y=j[1]))), jobs):
            im.paste(Image.open(io.BytesIO(b)).convert(mode), (x * 256, y * 256))
    im.save(out, quality=94) if out.endswith('.jpg') else im.save(out)
    print(out, im.size)


mosaic('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg', 5, os.path.join(RAW, 's2_z5.jpg'), 'RGB')
mosaic('https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png', 4, os.path.join(RAW, 'terr_z4.png'), 'RGB')
