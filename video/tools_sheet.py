"""Hoja de contacto de un video renderizado, un fotograma por subtítulo (para revisión visual).

    python tools_sheet.py <video.mp4> <subtitulos.srt> <salida.png>
"""
import re
import sys

import av
from PIL import Image

video, srt, out = sys.argv[1:4]
starts = [int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000
          for h, m, s, ms in re.findall(r"(\d+):(\d+):(\d+),(\d+) -->", open(srt, encoding="utf-8").read())]
times = [t + 2.8 for t in starts]

frames, i = [], 0
with av.open(video) as container:
    for frame in container.decode(video=0):
        if i < len(times) and frame.time >= times[i]:
            frames.append(frame.to_image().resize((270, 480)))
            i += 1
cols = 7
rows = (len(frames) + cols - 1) // cols
sheet = Image.new("RGB", (270 * cols, 480 * rows), "white")
for k, im in enumerate(frames):
    sheet.paste(im, ((k % cols) * 270, (k // cols) * 480))
sheet.save(out)
print(len(frames), "fotogramas")
