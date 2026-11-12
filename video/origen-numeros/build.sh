#!/bin/sh
# Un solo comando: «El origen de los números» (corto vertical 1080×1920, 30 fps) -> origen-numeros.mp4
#   sh video/origen-numeros/build.sh
# Necesita Node 20+, ffmpeg y ffprobe 7+ en el PATH (winget install Gyan.FFmpeg) y la biblioteca Lemo-Opuscar.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"
NAME=origen-numeros
SIZE=1080x1920
FPS=30
cd "$LIB"

# letra manuscrita de una línea (OFL) y grabaciones de tiza (CC0, Wikimedia Commons): no van en git
EMS=https://gitlab.com/oskay/svg-fonts/-/raw/master/fonts/EMS
[ -f "$HERE/fonts/EMSDelight.svg" ] || curl -sfL -o "$HERE/fonts/EMSDelight.svg" "$EMS/EMSDelight.svg"
C=https://upload.wikimedia.org/wikipedia/commons
mkdir -p "$HERE/foley/raw" "$HERE/out"
[ -f "$HERE/foley/raw/chalk-on-chalkboard.wav" ] || curl -sfL -A "zuka-build/1.0" -o "$HERE/foley/raw/chalk-on-chalkboard.wav" "$C/8/81/264944_chalk-on-chalkboard.wav"
[ -f "$HERE/foley/raw/Chalkboard-writing.ogg" ]  || curl -sfL -A "zuka-build/1.0" -o "$HERE/foley/raw/Chalkboard-writing.ogg" "$C/3/36/Chalkboard-writing.ogg"
[ -f "$HERE/foley/lib/index.json" ] || "$PY" -I "$HERE/tools/foley_lib.py" "$HERE/foley/lib" \
  fat="$HERE/foley/raw/chalk-on-chalkboard.wav" tom="$HERE/foley/raw/Chalkboard-writing.ogg"
"$PY" core/audio/sampler.py --need "$HERE/audio.py"          # muestras CC0 (marimba, vibráfono, contrabajo)

node core/render/events.mjs "$HERE" --size $SIZE
"$PY" "$HERE/audio.py"
node core/render/video.mjs "$HERE" --size $SIZE --fps $FPS --workers 3 --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" $FPS 1
node core/render/readcheck.mjs "$HERE" --size $SIZE > "$HERE/out/readcheck.txt" && echo "lectura ok" || { tail -20 "$HERE/out/readcheck.txt"; exit 1; }
node core/render/still.mjs "$HERE" 57.5 --size $SIZE --out "$HERE/out" --prefix poster_
cp "$HERE/out/poster_57.5.jpg" "$HERE/poster.jpg"
echo "listo: $HERE/$NAME.mp4"
