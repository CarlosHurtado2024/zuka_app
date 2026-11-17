#!/bin/sh
# Un solo comando: «¿Qué es un conjunto?» (lección alg-0a), versión estudio para público adulto (1080×1920, 30 fps)
#   sh video/conjunto-estudio/build.sh        -> conjunto-estudio.mp4, poster.jpg, conjunto-estudio.srt y narracion.txt
# Necesita Node 20+, ffmpeg y ffprobe 7+ en el PATH y la biblioteca Lemo-Opuscar (solo sus herramientas de render y de sonido).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"
NAME=conjunto-estudio
SIZE=1080x1920
FPS=30
cd "$LIB"
mkdir -p "$HERE/out" "$HERE/fonts"
# tipografía Jost (OFL): no va en git. Las fórmulas usan Cambria y Cambria Math, que vienen con Windows.
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://github.com/google/fonts/raw/main/ofl/jost/Jost%5Bwght%5D.ttf"
"$PY" core/audio/sampler.py --need "$HERE/mix.py"            # muestras CC0

node core/render/readcheck.mjs "$HERE" --size $SIZE > "$HERE/out/readcheck.txt" && echo "lectura ok" || { grep -v "^OK\|^--" "$HERE/out/readcheck.txt" | tail -20; exit 1; }
node core/render/events.mjs "$HERE" --size $SIZE
"$PY" "$HERE/mix.py"
node core/render/video.mjs "$HERE" --size $SIZE --fps $FPS --workers ${WORKERS:-2} --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" $FPS 0
node core/render/still.mjs "$HERE" 28 --size $SIZE --out "$HERE/out" --prefix poster_
cp "$HERE/out/poster_28.jpg" "$HERE/poster.jpg"
echo "listo: $HERE/$NAME.mp4"
