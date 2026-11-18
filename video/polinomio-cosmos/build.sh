#!/bin/sh
# Videos del mundo «Álgebra de Polinomios» (Álgebra, lecciones alg-23a, alg-3, alg-24c y alg-24b) en estilo «showreel matemático», 1080×1920 a 60 fps.
#   sh video/polinomio-cosmos/build.sh                      -> las cuatro películas de films/
#   sh video/polinomio-cosmos/build.sh polinomios binomio       -> solo esas
# Cada una deja out/<nombre>/<nombre>.mp4, <nombre>.srt y poster.jpg. Motor: kit.js + polinomio.js; guion en
# films/<nombre>.data.js y escenas en films/<nombre>.js. Imagen y sonido salen de código (sin metraje ni muestras).
# Necesita Node 20+, ffmpeg y ffprobe en el PATH y la biblioteca Lemo-Opuscar (LIB, por defecto ~/lemo-opuscar).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"
SIZE=1080x1920
FPS=${FPS:-60}
FILMS=${*:-polinomios notables binomio factorizacion}
mkdir -p "$HERE/fonts"
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://github.com/google/fonts/raw/main/ofl/jost/Jost%5Bwght%5D.ttf"
for f in KaTeX_Main-Regular KaTeX_Main-Italic KaTeX_Math-Italic; do [ -f "$HERE/fonts/$f.ttf" ] || curl -sfL -o "$HERE/fonts/$f.ttf" "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/$f.ttf"; done
for F in $FILMS; do
  O="$HERE/out/$F"; mkdir -p "$O"
  echo "== $F"
  (cd "$HERE" && node -e "const D=require('./films/$F.data.js');require('fs').writeFileSync('out/$F/events.json',JSON.stringify({dur:D.DUR,sc:D.SC,narr:D.NARR}))")
  "$PY" -X utf8 "$HERE/mix.py" "$F"
  (cd "$LIB" && node core/render/video.mjs "$HERE" --size $SIZE --fps $FPS --workers ${WORKERS:-2} --q "f=$F" --out "$O/video.mp4")
  (cd "$LIB" && sh core/render/mux.sh "$O/video.mp4" "$O/mix.wav" "$O/$F.mp4" $FPS 0)
  (cd "$LIB" && node core/render/still.mjs "$HERE" 30 --size $SIZE --q "f=$F" --out "$O" --prefix poster_)
  cp "$O/poster_30.jpg" "$O/poster.jpg"
  echo "listo: $O/$F.mp4"
done
