#!/bin/sh
# Un solo comando: «La curva más corta» (clip de curiosidades de Zuka), estilo 3D Map Explainer.
#   sh video/curva-corta/build.sh     fuentes y datos del mapa (si faltan), eventos, sonido, lectura, imagen, máster, póster y 720p
# Necesita Node, ffmpeg y la biblioteca lemo-opuscar con su entorno base (setup.sh deps).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-"$HOME/lemo-opuscar"}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "pon LIB en la carpeta de lemo-opuscar"; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || PATH="$(ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg_*/ffmpeg-*/bin 2>/dev/null | head -1):$PATH"
if [ -x "$LIB/.venv/Scripts/python.exe" ]; then PY="$LIB/.venv/Scripts/python.exe"; else PY="$LIB/.venv/bin/python"; fi
NAME=curva-corta; SIZE=1080x1920
mkdir -p "$HERE/out" "$HERE/fonts"
GF=https://github.com/google/fonts/raw/main/ofl/barlowcondensed
for w in Regular Medium SemiBold; do [ -f "$HERE/fonts/BarlowCondensed-$w.ttf" ] || curl -sfL -o "$HERE/fonts/BarlowCondensed-$w.ttf" "$GF/BarlowCondensed-$w.ttf"; done
# datos del mapa (Sentinel-2 cloudless 2016 de EOX y AWS Terrain Tiles): se bajan y preparan solo si faltan
[ -f "$HERE/raw/s2_z5.jpg" ] && [ -f "$HERE/raw/terr_z4.png" ] || "$PY" -I "$HERE/tools/fetch.py" "$HERE"
[ -f "$HERE/assets/albedo.jpg" ] && [ -f "$HERE/assets/height.png" ] || "$PY" -I "$HERE/tools/prep.py" "$HERE"
cd "$LIB"

node core/render/events.mjs "$HERE" --size $SIZE
"$PY" -X utf8 "$HERE/mix.py"
node core/render/readcheck.mjs "$HERE" --size $SIZE --q 'ss=1' > "$HERE/out/readcheck.txt" && echo "lectura bien" || { tail -25 "$HERE/out/readcheck.txt"; exit 1; }
rm -rf "$HERE/out/frames"; node "$HERE/render.mjs" "$HERE" --fps 24 --out out/video.mp4      # guarda cuadro a cuadro y reintenta si el GPU se cuelga
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" 24 1
node core/render/still.mjs "$HERE" 66 --size $SIZE --out "$HERE/out/still" --prefix poster_
ffmpeg -v error -y -i "$HERE/out/still/poster_66.jpg" -q:v 3 "$HERE/poster.jpg"
ffmpeg -v error -y -i "$HERE/$NAME.mp4" -vf scale=720:1280 -c:v libx264 -preset slow -crf 30 -movflags +faststart -c:a aac -b:a 112k "$HERE/out/$NAME-720.mp4"
mkdir -p "$HERE/../../media/clips" && cp "$HERE/out/$NAME-720.mp4" "$HERE/../../media/clips/$NAME.mp4"
echo "listo: $HERE/$NAME.mp4 (app: out/$NAME-720.mp4)"
