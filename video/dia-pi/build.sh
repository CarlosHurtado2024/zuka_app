#!/bin/sh
# Un solo comando: «¿Por qué el 14 de marzo?» (clip de curiosidades de Zuka), estilo Caption News, vertical.
#   sh video/dia-pi/build.sh     material (si falta), cuadros, fuentes, eventos, sonido, lectura, imagen, máster, póster y 720p
# Necesita Node, ffmpeg, pdftoppm y la biblioteca lemo-opuscar con su entorno base (setup.sh deps).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-"$HOME/lemo-opuscar"}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "pon LIB en la carpeta de lemo-opuscar"; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || PATH="$(ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg_*/ffmpeg-*/bin 2>/dev/null | head -1):$PATH"
if [ -x "$LIB/.venv/Scripts/python.exe" ]; then PY="$LIB/.venv/Scripts/python.exe"; else PY="$LIB/.venv/bin/python"; fi
NAME=dia-pi; SIZE=1080x1920
[ -f "$HERE/raw/tarte_b.mp4" ] || sh "$HERE/tools/fetch.sh"
sh "$HERE/tools/prep.sh" >/dev/null
sh "$HERE/tools/fonts.sh" >/dev/null
cd "$LIB"
node core/render/events.mjs "$HERE" --size $SIZE
"$PY" -X utf8 "$HERE/mix.py"
node core/render/readcheck.mjs "$HERE" --size $SIZE > "$HERE/out/readcheck.txt" && echo "lectura bien" || { grep BAD "$HERE/out/readcheck.txt"; exit 1; }
rm -rf "$HERE/out/frames"; node "$HERE/render.mjs" "$HERE" --fps 30 --out out/video.mp4
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" 30 1
node core/render/still.mjs "$HERE" 17.5 --size $SIZE --out "$HERE/out/still" --prefix poster_
ffmpeg -v error -y -i "$HERE/out/still/poster_17.5.jpg" -q:v 3 "$HERE/poster.jpg"
ffmpeg -v error -y -i "$HERE/$NAME.mp4" -vf scale=720:1280 -c:v libx264 -preset slow -crf 30 -movflags +faststart -c:a aac -b:a 112k "$HERE/out/$NAME-720.mp4"
mkdir -p "$HERE/../../media/clips" && cp "$HERE/out/$NAME-720.mp4" "$HERE/../../media/clips/$NAME.mp4"
echo "listo: $HERE/$NAME.mp4 (app: out/$NAME-720.mp4)"
