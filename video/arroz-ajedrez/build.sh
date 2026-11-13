#!/bin/sh
# Un solo comando: «El arroz del rey» (clip de curiosidades de Zuka), estilo Data Physicalization.
#   sh video/arroz-ajedrez/build.sh     fuentes y luz de estudio (si faltan), eventos, sonido, lectura, imagen, máster, póster y 720p
# Necesita Node, ffmpeg y la biblioteca lemo-opuscar con su entorno base (setup.sh deps).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-"$HOME/lemo-opuscar"}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "pon LIB en la carpeta de lemo-opuscar"; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || PATH="$(ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg_*/ffmpeg-*/bin 2>/dev/null | head -1):$PATH"
if [ -x "$LIB/.venv/Scripts/python.exe" ]; then PY="$LIB/.venv/Scripts/python.exe"; else PY="$LIB/.venv/bin/python"; fi
NAME=arroz-ajedrez; SIZE=1080x1920
mkdir -p "$HERE/out" "$HERE/fonts"
GF=https://github.com/google/fonts/raw/main/ofl
[ -f "$HERE/fonts/Inter.ttf" ] || curl -sfL -o "$HERE/fonts/Inter.ttf" "$GF/inter/Inter%5Bopsz,wght%5D.ttf"
[ -f "$HERE/fonts/JBMono.ttf" ] || curl -sfL -o "$HERE/fonts/JBMono.ttf" "$GF/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf"
[ -f "$HERE/fonts/NotoSerif.ttf" ] || curl -sfL -o "$HERE/fonts/NotoSerif.ttf" "$GF/notoserif/NotoSerif%5Bwdth,wght%5D.ttf"
cd "$LIB"
[ -f core/assets/polyhaven/photo_studio_loft_hall_2k.hdr ] || sh tools/fetch.sh hdri      # luz de estudio de Poly Haven (CC0)

node core/render/events.mjs "$HERE" --size $SIZE
"$PY" -X utf8 "$HERE/mix.py"
node core/render/readcheck.mjs "$HERE" --size $SIZE --q 'ss=1' > "$HERE/out/readcheck.txt" && echo "lectura bien" || { tail -25 "$HERE/out/readcheck.txt"; exit 1; }
rm -rf "$HERE/out/frames"; node "$HERE/render.mjs" "$HERE" --fps 24 --out out/video.mp4      # guarda cuadro a cuadro y reintenta si el GPU se cuelga
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" 24 1
node core/render/still.mjs "$HERE" 58 --size $SIZE --out "$HERE/out/still" --prefix poster_
ffmpeg -v error -y -i "$HERE/out/still/poster_58.jpg" -q:v 3 "$HERE/poster.jpg"
ffmpeg -v error -y -i "$HERE/$NAME.mp4" -vf scale=720:1280 -c:v libx264 -preset slow -crf 30 -movflags +faststart -c:a aac -b:a 112k "$HERE/out/$NAME-720.mp4"
mkdir -p "$HERE/../../media/clips" && cp "$HERE/out/$NAME-720.mp4" "$HERE/../../media/clips/$NAME.mp4"
echo "listo: $HERE/$NAME.mp4 (app: out/$NAME-720.mp4)"
