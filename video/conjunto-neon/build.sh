#!/bin/sh
# Un solo comando: «¿Qué es un conjunto?» (lección alg-0a), estilo neón del curso: negro, morado, letra fina (1080×1920, 30 fps)
#   sh video/conjunto-neon/build.sh        -> conjunto-neon.mp4 (1080×1920), poster.jpg, conjunto-neon.srt y narracion.txt
# Necesita Node 20+, ffmpeg y ffprobe 7+ en el PATH y la biblioteca Lemo-Opuscar (solo sus herramientas de render y de sonido).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"
NAME=conjunto-neon
SIZE=1080x1920
FPS=30
cd "$LIB"
mkdir -p "$HERE/out" "$HERE/fonts"
# tipografía Jost (OFL): no va en git. Las fórmulas usan Georgia y Cambria Math, que vienen con Windows.
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://github.com/google/fonts/raw/main/ofl/jost/Jost%5Bwght%5D.ttf"
# letra de las fórmulas: la de KaTeX (Computer Modern, OFL), como en los libros
for f in KaTeX_Main-Regular KaTeX_Main-Italic KaTeX_Math-Italic; do [ -f "$HERE/fonts/$f.ttf" ] || curl -sfL -o "$HERE/fonts/$f.ttf" "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/$f.ttf"; done
"$PY" core/audio/sampler.py --need "$HERE/mix.py"            # muestras CC0

node core/render/readcheck.mjs "$HERE" --size $SIZE --step 0.1 > "$HERE/out/readcheck.txt" && echo "lectura ok" || { grep -v "^OK\|^--" "$HERE/out/readcheck.txt" | tail -20; exit 1; }
node core/render/events.mjs "$HERE" --size $SIZE
"$PY" "$HERE/mix.py"
node core/render/video.mjs "$HERE" --size $SIZE --fps $FPS --workers ${WORKERS:-2} --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" $FPS 0
node core/render/still.mjs "$HERE" 100 --size $SIZE --out "$HERE/out" --prefix poster_
cp "$HERE/out/poster_100.jpg" "$HERE/poster.jpg"
echo "listo: $HERE/$NAME.mp4"
