#!/bin/sh
# Un solo comando: «Los números naturales y los enteros» (alg-11) en estilo Sketchnote, vertical 1080×1920, 24 fps.
#   sh video/n1-sketchnote/build.sh   -> n1-sketchnote.mp4, n1-sketchnote_guion.md / .srt y poster.jpg
# Necesita Node 20+, ffmpeg y ffprobe 7+ en el PATH (winget install Gyan.FFmpeg) y la biblioteca Lemo-Opuscar.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"
NAME=n1-sketchnote
SIZE=1080x1920
FPS=24
cd "$LIB"
mkdir -p "$HERE/out" "$HERE/fonts"
# letra a mano (OFL): no va en git
G=https://github.com/google/fonts/raw/main/ofl
[ -f "$HERE/fonts/Kalam-Bold.ttf" ] || curl -sfL -o "$HERE/fonts/Kalam-Bold.ttf" "$G/kalam/Kalam-Bold.ttf"
[ -f "$HERE/fonts/PatrickHand-Regular.ttf" ] || curl -sfL -o "$HERE/fonts/PatrickHand-Regular.ttf" "$G/patrickhand/PatrickHand-Regular.ttf"
[ -f "$HERE/glyphs.json" ] || "$PY" -X utf8 "$HERE/tools/skeleton.py"
"$PY" core/audio/sampler.py --need "$HERE/mix.py"

node core/render/events.mjs "$HERE" --size $SIZE
"$PY" -X utf8 "$HERE/mix.py"
node core/render/video.mjs "$HERE" --size $SIZE --fps $FPS --workers ${WORKERS:-3} --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" $FPS 0
node core/render/readcheck.mjs "$HERE" --size $SIZE > "$HERE/out/readcheck.txt" && echo "lectura ok" || { grep -v "^OK\|^--" "$HERE/out/readcheck.txt" | tail -20; echo "lectura: revisar out/readcheck.txt"; }
T=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$HERE/events.json','utf8')).dur - 1)")
node core/render/still.mjs "$HERE" $T --size $SIZE --out "$HERE/out" --prefix poster_
cp "$HERE/out/poster_$T.jpg" "$HERE/poster.jpg"
echo "listo: $HERE/$NAME.mp4"
