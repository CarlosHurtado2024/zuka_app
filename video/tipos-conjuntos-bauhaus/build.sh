#!/bin/sh
# Un solo comando: «Tipos de conjuntos y relaciones entre ellos» (lección alg-0b), estilo Bauhaus Shapes.
#   sh video/tipos-conjuntos-bauhaus/build.sh        fuente (si falta), eventos, sonido, imagen, máster, lectura y póster
#   WORKERS=3 sh …/build.sh                          más trabajadores de render (por defecto 2)
# Necesita Node, ffmpeg y la biblioteca lemo-opuscar con su entorno base (setup.sh deps).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-"$HOME/lemo-opuscar"}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "pon LIB en la carpeta de lemo-opuscar"; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || PATH="$(ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg_*/ffmpeg-*/bin 2>/dev/null | head -1):$PATH"
if [ -x "$LIB/.venv/Scripts/python.exe" ]; then PY="$LIB/.venv/Scripts/python.exe"; else PY="$LIB/.venv/bin/python"; fi
NAME=tipos-conjuntos-bauhaus; WORKERS=${WORKERS:-2}; SIZE=1080x1920
mkdir -p "$HERE/out" "$HERE/fonts"
[ -f "$HERE/fonts/Jost-VF.ttf" ] || curl -sfL -o "$HERE/fonts/Jost-VF.ttf" "https://github.com/google/fonts/raw/main/ofl/jost/Jost%5Bwght%5D.ttf"
cd "$LIB"

node core/render/events.mjs "$HERE" --size $SIZE
"$PY" "$HERE/mix.py"
node core/render/readcheck.mjs "$HERE" --size $SIZE --q 'tex=0' > "$HERE/out/readcheck.txt" && echo "lectura bien" || { tail -25 "$HERE/out/readcheck.txt"; exit 1; }
node core/render/video.mjs "$HERE" --fps 30 --workers "$WORKERS" --size $SIZE --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" 30 1
node core/render/still.mjs "$HERE" 5.2 --size $SIZE --out "$HERE/out/still" --prefix card_
ffmpeg -v error -y -i "$HERE/out/still/card_5.2.jpg" -q:v 3 "$HERE/poster.jpg"
echo "listo: $HERE/$NAME.mp4"
