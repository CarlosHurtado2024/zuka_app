#!/bin/sh
# Un solo comando: «¿Qué es un conjunto?» (alg-0a) en estilo Bauhaus Shapes, vertical 1080×1920, 30 fps.
#   sh video/conjunto-bauhaus/build.sh   -> conjunto-bauhaus.mp4, conjunto-bauhaus_guion.md / .srt y poster.jpg
# Necesita Node 20+, ffmpeg y ffprobe 7+ en el PATH (winget install Gyan.FFmpeg) y la biblioteca Lemo-Opuscar.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"
NAME=conjunto-bauhaus
SIZE=1080x1920
FPS=30
cd "$LIB"
mkdir -p "$HERE/out" "$HERE/fonts"
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://github.com/google/fonts/raw/main/ofl/jost/Jost%5Bwght%5D.ttf"
"$PY" core/audio/sampler.py --need "$HERE/mix.py"

node core/render/events.mjs "$HERE" --size $SIZE
"$PY" -X utf8 "$HERE/mix.py"
node core/render/video.mjs "$HERE" --size $SIZE --fps $FPS --workers ${WORKERS:-3} --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" $FPS 1
node core/render/readcheck.mjs "$HERE" --size $SIZE > "$HERE/out/readcheck.txt" && echo "lectura ok" || { grep -v "^OK\|^--" "$HERE/out/readcheck.txt" | tail -20; echo "lectura: revisar out/readcheck.txt"; }
T=$(cd "$HERE" && node -e "console.log(JSON.parse(require('fs').readFileSync('events.json','utf8')).dur - 1)")
node core/render/still.mjs "$HERE" $T --size $SIZE --out "$HERE/out" --prefix poster_
cp "$HERE/out/poster_$T.jpg" "$HERE/poster.jpg"
echo "listo: $HERE/$NAME.mp4"
