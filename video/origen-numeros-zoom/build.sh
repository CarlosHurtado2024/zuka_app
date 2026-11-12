#!/bin/sh
# Un solo comando: «El origen de los números» en estilo Scale Zoom Explainer (1080×1920, 24 fps)
#   sh video/origen-numeros-zoom/build.sh        -> origen-numeros-zoom.mp4, .srt de la narración y poster.jpg
# Necesita Node 20+, ffmpeg y ffprobe 7+ en el PATH (winget install Gyan.FFmpeg) y la biblioteca Lemo-Opuscar.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"
NAME=origen-numeros-zoom
SIZE=1080x1920
FPS=24
cd "$LIB"
mkdir -p "$HERE/out" "$HERE/fonts"
# tipografía Jost (OFL): no va en git
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://github.com/google/fonts/raw/main/ofl/jost/Jost%5Bwght%5D.ttf"
"$PY" core/audio/sampler.py --need "$HERE/mix.py"            # muestras CC0

node core/render/events.mjs "$HERE" --size $SIZE
"$PY" "$HERE/mix.py"
node core/render/video.mjs "$HERE" --size $SIZE --fps $FPS --workers 3 --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" $FPS 0
node core/render/readcheck.mjs "$HERE" --size $SIZE > "$HERE/out/readcheck.txt" && echo "lectura ok" || { grep -v "^OK\|^--" "$HERE/out/readcheck.txt" | tail -20; exit 1; }
node core/render/still.mjs "$HERE" 48.6 --size $SIZE --out "$HERE/out" --prefix poster_
cp "$HERE/out/poster_48.6.jpg" "$HERE/poster.jpg"
echo "listo: $HERE/$NAME.mp4"
