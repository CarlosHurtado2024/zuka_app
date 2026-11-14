#!/bin/sh
# Cuadros a 30 fps del tamaño final (1080 × 1350, escala ≤ 1.33×: recorte, lanczos, unsharp), fotos y páginas del documento.
# uso: sh tools/prep.sh   (desde cualquier carpeta; necesita raw/ con los recortes de video, las fotos y el PDF)
set -e
H=$(cd "$(dirname "$0")/.." && pwd); cd "$H"
command -v ffmpeg >/dev/null 2>&1 || PATH="$(ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg_*/ffmpeg-*/bin 2>/dev/null | head -1):$PATH"
mkdir -p assets/fr assets/img
node --input-type=module -e "
import { CLIPS } from './data.js';
for (const [n, c] of Object.entries(CLIPS)) console.log([n, c.src, c.ss, c.t, c.cx || 0, (c.crop || []).join(':') || '-', (c.size || []).join(':') || '-'].join(' '));
" | while read n src ss t cx crop size; do
  [ -f "assets/fr/${n}_001.jpg" ] && continue
  sh_=$(ffprobe < /dev/null -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "raw/$src")
  cw=$(python -c "print(int(round(1080*$sh_/1350/2))*2)")
  x=$(python -c "print(max(0, min(1920-$cw, int($cx-$cw/2))))")
  if [ "$crop" != "-" ]; then vf="crop=$crop,scale=$size:flags=lanczos"; else vf="crop=$cw:$sh_:$x:0,scale=1080:1350:flags=lanczos"; fi
  ffmpeg -nostdin -v error -y -ss "$ss" -t "$t" -i "raw/$src" -vf "fps=30,$vf,unsharp=5:5:0.45" -q:v 3 "assets/fr/${n}_%03d.jpg"
  echo "$n $(ls assets/fr/${n}_*.jpg | wc -l) cuadros"
done
[ -f assets/img/pie.jpg ] || ffmpeg -v error -y -i raw/pie.jpg -vf "scale=1080:-2:flags=lanczos" -q:v 2 assets/img/pie.jpg
[ -f assets/img/unesco.jpg ] || ffmpeg -v error -y -i raw/unesco.jpg -vf "scale=-2:1350:flags=lanczos" -q:v 2 assets/img/unesco.jpg
for p in 1 2; do [ -f "assets/img/doc$p.jpg" ] || cp "raw/doc-$p.jpg" "assets/img/doc$p.jpg"; done
ls assets/img
