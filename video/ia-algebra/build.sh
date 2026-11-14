#!/bin/sh
# Un solo comando: «La IA está hecha de álgebra» (clip de curiosidades de Zuka), estilo Sci-fi Hologram HUD.
#   sh video/ia-algebra/build.sh     fuentes (si faltan), eventos, sonido, lectura, imagen, máster, póster y 720p
# Necesita Node, ffmpeg y la biblioteca lemo-opuscar con su entorno base (setup.sh deps).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-"$HOME/lemo-opuscar"}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "pon LIB en la carpeta de lemo-opuscar"; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || PATH="$(ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg_*/ffmpeg-*/bin 2>/dev/null | head -1):$PATH"
if [ -x "$LIB/.venv/Scripts/python.exe" ]; then PY="$LIB/.venv/Scripts/python.exe"; else PY="$LIB/.venv/bin/python"; fi
NAME=ia-algebra; SIZE=1080x1920
mkdir -p "$HERE/out" "$HERE/fonts"
GF=https://github.com/google/fonts/raw/main/ofl
for w in Light Regular Medium SemiBold; do [ -f "$HERE/fonts/Rajdhani-$w.ttf" ] || curl -sfL -o "$HERE/fonts/Rajdhani-$w.ttf" "$GF/rajdhani/Rajdhani-$w.ttf"; done
[ -f "$HERE/fonts/ShareTechMono-Regular.ttf" ] || curl -sfL -o "$HERE/fonts/ShareTechMono-Regular.ttf" "$GF/sharetechmono/ShareTechMono-Regular.ttf"
[ -f "$HERE/fonts/NotoSans.ttf" ] || curl -sfL -o "$HERE/fonts/NotoSans.ttf" "$GF/notosans/NotoSans%5Bwdth%2Cwght%5D.ttf"
cd "$LIB"

node core/render/events.mjs "$HERE" --size $SIZE
"$PY" -X utf8 "$HERE/mix.py"
node core/render/readcheck.mjs "$HERE" --size $SIZE > "$HERE/out/readcheck.txt" && echo "lectura bien" || { grep BAD "$HERE/out/readcheck.txt"; exit 1; }
rm -rf "$HERE/out/frames"; node "$HERE/render.mjs" "$HERE" --fps 24 --out out/video.mp4
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" 24 1
node core/render/still.mjs "$HERE" 70.5 --size $SIZE --out "$HERE/out/still" --prefix poster_
ffmpeg -v error -y -i "$HERE/out/still/poster_70.5.jpg" -q:v 3 "$HERE/poster.jpg"
ffmpeg -v error -y -i "$HERE/$NAME.mp4" -vf scale=720:1280 -c:v libx264 -preset slow -crf 30 -movflags +faststart -c:a aac -b:a 112k "$HERE/out/$NAME-720.mp4"
mkdir -p "$HERE/../../media/clips" && cp "$HERE/out/$NAME-720.mp4" "$HERE/../../media/clips/$NAME.mp4"
echo "listo: $HERE/$NAME.mp4 (app: out/$NAME-720.mp4)"
