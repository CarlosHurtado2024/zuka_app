#!/bin/sh
# Un solo comando: «La cuerda del escriba» (clip de curiosidades de Zuka), estilo Watercolor Brush.
#   sh video/egipto-acuarela/build.sh     fuentes y papel (si faltan), eventos, sonido, lectura, imagen, máster, póster y 720p
#   WORKERS=3 sh …/build.sh               más trabajadores de render (por defecto 2)
# Necesita Node, ffmpeg y la biblioteca lemo-opuscar con su entorno base (setup.sh deps).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-"$HOME/lemo-opuscar"}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "pon LIB en la carpeta de lemo-opuscar"; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || PATH="$(ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg_*/ffmpeg-*/bin 2>/dev/null | head -1):$PATH"
if [ -x "$LIB/.venv/Scripts/python.exe" ]; then PY="$LIB/.venv/Scripts/python.exe"; else PY="$LIB/.venv/bin/python"; fi
NAME=egipto-acuarela; WORKERS=${WORKERS:-2}; SIZE=1080x1920
mkdir -p "$HERE/out" "$HERE/fonts"
GF=https://github.com/google/fonts/raw/main/ofl
[ -f "$HERE/fonts/CormorantGaramond.ttf" ] || curl -sfL -o "$HERE/fonts/CormorantGaramond.ttf" "$GF/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf"
[ -f "$HERE/fonts/CormorantGaramond-Italic.ttf" ] || curl -sfL -o "$HERE/fonts/CormorantGaramond-Italic.ttf" "$GF/cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf"
[ -f "$HERE/fonts/Caveat.ttf" ] || curl -sfL -o "$HERE/fonts/Caveat.ttf" "$GF/caveat/Caveat%5Bwght%5D.ttf"
[ -f "$HERE/fonts/IBMPlexMono-Regular.ttf" ] || curl -sfL -o "$HERE/fonts/IBMPlexMono-Regular.ttf" "$GF/ibmplexmono/IBMPlexMono-Regular.ttf"
[ -f "$HERE/paper.jpg" ] || "$PY" -X utf8 "$HERE/paper.py"
cd "$LIB"

node core/render/events.mjs "$HERE" --size $SIZE
"$PY" -X utf8 "$HERE/mix.py"
node core/render/readcheck.mjs "$HERE" --size $SIZE > "$HERE/out/readcheck.txt" && echo "lectura bien" || { tail -25 "$HERE/out/readcheck.txt"; exit 1; }
node core/render/video.mjs "$HERE" --fps 30 --workers "$WORKERS" --size $SIZE --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" 30 0
node core/render/still.mjs "$HERE" 76 --size $SIZE --out "$HERE/out/still" --prefix poster_
ffmpeg -v error -y -i "$HERE/out/still/poster_76.jpg" -q:v 3 "$HERE/poster.jpg"
ffmpeg -v error -y -i "$HERE/$NAME.mp4" -vf scale=720:1280 -c:v libx264 -preset slow -crf 26 -movflags +faststart -c:a aac -b:a 112k "$HERE/out/$NAME-720.mp4"
echo "listo: $HERE/$NAME.mp4 (app: out/$NAME-720.mp4)"
