#!/bin/sh
# Videos «lámina» de las lecciones de Álgebra (1080×1920, 30 fps): un video por lección, todos con el mismo motor (kit.js).
#   sh video/lamina/build.sh                  -> todas las películas de films/
#   sh video/lamina/build.sh tipos operaciones -> solo esas
#   ESTILO=neon sh video/lamina/build.sh naturales -> estilo neón, deja out/naturales-neon/naturales-neon.mp4
# Cada una deja out/<nombre>/<nombre>.mp4, <nombre>.srt, <nombre>_narracion.txt, readcheck.txt y poster.jpg.
# Trabaja sobre una copia congelada (out/_snap<pid>): se puede seguir editando el motor mientras renderiza.
# Necesita Node 20+, ffmpeg y ffprobe 7+ en el PATH y la biblioteca Lemo-Opuscar (LIB, por defecto ~/lemo-opuscar).
# Las fórmulas usan Georgia, Cambria y Cambria Math (vienen con Windows).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"
SIZE=1080x1920
FPS=30
FILMS=${*:-$(ls "$HERE/films" | sed "s/.js$//")}
mkdir -p "$HERE/fonts" "$HERE/out"
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://github.com/google/fonts/raw/main/ofl/jost/Jost%5Bwght%5D.ttf"
SNAP="$HERE/out/_snap$$"; mkdir -p "$SNAP"
cp -r "$HERE/index.html" "$HERE/kit.js" "$HERE/timeline.js" "$HERE/plates.js" "$HERE/mix.py" "$HERE/films" "$HERE/fonts" "$SNAP/"
trap 'rm -rf "$SNAP"' EXIT
cd "$LIB"
"$PY" core/audio/sampler.py --need "$SNAP/mix.py"
for F in $FILMS; do
  Q="f=$F"; N="$F"; [ -n "$ESTILO" ] && { Q="f=$F&s=$ESTILO"; N="$F-$ESTILO"; }
  O="$SNAP/out/$F"; mkdir -p "$O"
  echo "== $F"
  node core/render/readcheck.mjs "$SNAP" --size $SIZE --step 0.1 --q "$Q" > "$O/readcheck.txt" && echo "lectura ok" || { grep -v "^OK\|^--" "$O/readcheck.txt" | tail -20; exit 1; }
  node core/render/events.mjs "$SNAP" --size $SIZE --q "$Q" --out "$O/events.json"
  "$PY" -X utf8 "$SNAP/mix.py" "$F"
  # el navegador a veces se traba con el equipo ocupado: hasta tres intentos
  OK=0; for TRY in 1 2 3; do node core/render/video.mjs "$SNAP" --size $SIZE --fps $FPS --workers ${WORKERS:-2} --q "$Q" --out "$O/video.mp4" && { OK=1; break; }; echo "reintento $TRY de $F"; done
  [ $OK = 1 ] || { echo "falló el render de $F"; exit 1; }
  sh core/render/mux.sh "$O/video.mp4" "$O/mix.wav" "$O/$F.mp4" $FPS 0
  POS=$(grep -o '^const POSTER = [0-9.]*' "$SNAP/films/$F.js" | grep -o '[0-9.]*$'); [ -n "$POS" ] || POS=3
  node core/render/still.mjs "$SNAP" $POS --size $SIZE --q "$Q" --out "$O" --prefix poster_
  cp "$O/poster_$POS.jpg" "$O/poster.jpg"
  rm -f "$O/video.mp4" "$O/mix.wav"
  [ "$N" = "$F" ] || for x in "$O/$F".*; do mv "$x" "$O/$N.${x##*.}"; done
  [ "$N" = "$F" ] || mv "$O/${F}_narracion.txt" "$O/${N}_narracion.txt"
  rm -rf "$HERE/out/$N"; cp -r "$O" "$HERE/out/$N"
  echo "listo: $HERE/out/$N/$N.mp4"
done
