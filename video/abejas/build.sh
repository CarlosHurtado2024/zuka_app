#!/bin/sh
# Un solo comando: «Matemáticas de abeja» en estilo Tablet Sketch Explainer (1080×1920, 24 fps)
#   sh video/abejas/build.sh        -> abejas.mp4, abejas.srt (narración) y poster.jpg
# Necesita Node 20+, ffmpeg y ffprobe 7+ en el PATH (winget install Gyan.FFmpeg) y la biblioteca Lemo-Opuscar.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"
NAME=abejas
SIZE=1080x1920
FPS=24
cd "$LIB"
mkdir -p "$HERE/out" "$HERE/fonts"
# letra Caveat (OFL): no va en git. Se cortan dos pesos de la fuente variable y se sacan los trazos de cada letra.
if [ ! -f "$HERE/fonts/Caveat-Bold.ttf" ]; then
  curl -sfL -o "$HERE/out/Caveat.ttf" "https://github.com/google/fonts/raw/main/ofl/caveat/Caveat%5Bwght%5D.ttf"
  "$PY" -m fontTools.varLib.instancer "$HERE/out/Caveat.ttf" wght=700 -o "$HERE/fonts/Caveat-Bold.ttf" -q
  "$PY" -m fontTools.varLib.instancer "$HERE/out/Caveat.ttf" wght=500 -o "$HERE/fonts/Caveat-Medium.ttf" -q
fi
[ -f "$HERE/glyphs.json" ] || "$PY" -X utf8 "$HERE/tools/skeleton.py"
"$PY" core/audio/sampler.py --need "$HERE/mix.py"            # muestras CC0

node core/render/events.mjs "$HERE" --size $SIZE
"$PY" -X utf8 "$HERE/mix.py"
node core/render/video.mjs "$HERE" --size $SIZE --fps $FPS --workers ${WORKERS:-2} --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" $FPS 1
node core/render/readcheck.mjs "$HERE" --size $SIZE > "$HERE/out/readcheck.txt" && echo "lectura ok" || { grep -v "^OK\|^--" "$HERE/out/readcheck.txt" | tail -20; echo "lectura: revisar out/readcheck.txt"; }
node core/render/still.mjs "$HERE" 75.3 --size $SIZE --q clean=1 --out "$HERE/out" --prefix poster_
cp "$HERE/out/poster_75.3.jpg" "$HERE/poster.jpg"
echo "listo: $HERE/$NAME.mp4"
