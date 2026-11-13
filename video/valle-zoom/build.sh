#!/bin/sh
# Videos zoom de Álgebra (Valle, Mercado, Torres de Potencias, Escalera de Sigma) en estilo Scale Zoom Explainer (1080×1920, 24 fps): un video por lección, todos con el mismo motor.
#   sh video/valle-zoom/build.sh                       -> todas las películas de films/
#   sh video/valle-zoom/build.sh racionales reales     -> solo esas
# Cada una deja out/<nombre>/<nombre>.mp4, <nombre>.srt, <nombre>_narracion.txt, readcheck.txt y poster.jpg.
# Necesita Node 20+, ffmpeg y ffprobe 7+ en el PATH y la biblioteca Lemo-Opuscar (LIB, por defecto ~/lemo-opuscar).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python"
SIZE=1080x1920
FPS=24
FILMS=${*:-$(ls "$HERE/films" | sed "s/.js$//")}
cd "$LIB"
mkdir -p "$HERE/fonts"
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://github.com/google/fonts/raw/main/ofl/jost/Jost%5Bwght%5D.ttf"
"$PY" core/audio/sampler.py --need "$HERE/mix.py"
for F in $FILMS; do
  O="$HERE/out/$F"; mkdir -p "$O"
  echo "== $F"
  node core/render/events.mjs "$HERE" --size $SIZE --q "f=$F" --out "$O/events.json"
  "$PY" -X utf8 "$HERE/mix.py" "$F"
  node core/render/readcheck.mjs "$HERE" --size $SIZE --q "f=$F" > "$O/readcheck.txt" && echo "lectura ok" || { grep -v "^OK\|^--" "$O/readcheck.txt" | tail -20; exit 1; }
  node core/render/video.mjs "$HERE" --size $SIZE --fps $FPS --workers ${WORKERS:-2} --q "f=$F" --out "$O/video.mp4"
  sh core/render/mux.sh "$O/video.mp4" "$O/mix.wav" "$O/$F.mp4" $FPS 0
  POS=$(grep -o '^const POSTER = [0-9.]*' "$HERE/films/$F.js" | grep -o '[0-9.]*$'); [ -n "$POS" ] || POS=40
  node core/render/still.mjs "$HERE" $POS --size $SIZE --q "f=$F" --out "$O" --prefix poster_
  cp "$O/poster_$POS.jpg" "$O/poster.jpg"
  echo "listo: $O/$F.mp4"
done
