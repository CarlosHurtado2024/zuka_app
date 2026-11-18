#!/bin/sh
# Un solo comando: «El día que Plutón cambió de conjunto» (lección alg-0a), estilo «showreel matemático», 1080×1920 a 60 fps
#   sh video/conjunto-cosmos-2/build.sh   -> conjunto-cosmos-2.mp4, conjunto-cosmos-2.srt y poster.jpg
# Necesita Node 20+, ffmpeg y ffprobe en el PATH y la biblioteca Lemo-Opuscar (solo sus herramientas de render y su Python
# con numpy y soundfile). La imagen y el sonido salen de código: no usa metraje, imágenes ni muestras.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"
NAME=conjunto-cosmos-2
SIZE=1080x1920
FPS=${FPS:-60}
mkdir -p "$HERE/out" "$HERE/fonts"
# letras (OFL): no van en git. Jost para la marca; las de KaTeX (Computer Modern) para fórmulas y títulos.
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://github.com/google/fonts/raw/main/ofl/jost/Jost%5Bwght%5D.ttf"
for f in KaTeX_Main-Regular KaTeX_Main-Italic KaTeX_Math-Italic; do [ -f "$HERE/fonts/$f.ttf" ] || curl -sfL -o "$HERE/fonts/$f.ttf" "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/$f.ttf"; done
# escenas y narración para el sonido y los subtítulos
(cd "$HERE" && node -e "const D=require('./data.js');require('fs').writeFileSync('events.json',JSON.stringify({dur:D.DUR,sc:D.SC,narr:D.NARR}))")
"$PY" "$HERE/mix.py"
cd "$LIB"
node core/render/video.mjs "$HERE" --size $SIZE --fps $FPS --workers ${WORKERS:-2} --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" $FPS 0
node core/render/still.mjs "$HERE" 293 --size $SIZE --out "$HERE/out" --prefix poster_
cp "$HERE/out/poster_293.jpg" "$HERE/poster.jpg"
echo "listo: $HERE/$NAME.mp4"
