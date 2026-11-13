#!/bin/sh
# Valle de los Números en estilo Tablet Sketch Explainer (1080×1920, 24 fps): las seis lecciones con un solo motor.
#   sh video/valle-sketch/build.sh            -> las seis (v1 … v6)
#   sh video/valle-sketch/build.sh v3 v4      -> solo esas
# Cada una deja out/<film>/<film>.mp4, <film>.srt (narración con tiempos), <film>_narracion.txt y poster.jpg.
# Necesita Node 20+, ffmpeg y ffprobe en el PATH y la biblioteca Lemo-Opuscar (LIB).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "falta la biblioteca: pon LIB=<carpeta de lemo-opuscar>"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python"
SIZE=1080x1920
FPS=24
FILMS=${*:-v1 v2 v3 v4 v5 v6}
cd "$LIB"
mkdir -p "$HERE/out" "$HERE/fonts"
if [ ! -f "$HERE/fonts/Caveat-Bold.ttf" ]; then
  curl -sfL -o "$HERE/out/Caveat.ttf" "https://github.com/google/fonts/raw/main/ofl/caveat/Caveat%5Bwght%5D.ttf"
  "$PY" -m fontTools.varLib.instancer "$HERE/out/Caveat.ttf" wght=700 -o "$HERE/fonts/Caveat-Bold.ttf" -q
  "$PY" -m fontTools.varLib.instancer "$HERE/out/Caveat.ttf" wght=500 -o "$HERE/fonts/Caveat-Medium.ttf" -q
fi
[ -f "$HERE/glyphs.json" ] || "$PY" -X utf8 "$HERE/tools/skeleton.py"
"$PY" core/audio/sampler.py --need "$HERE/mix.py"
for F in $FILMS; do
  O="$HERE/out/$F"; mkdir -p "$O"
  node core/render/events.mjs "$HERE" --size $SIZE --q film=$F --out "$HERE/out/ev_$F.json"
  FILM=$F "$PY" -X utf8 "$HERE/mix.py"
  node core/render/video.mjs "$HERE" --size $SIZE --fps $FPS --workers ${WORKERS:-2} --q film=$F --out "$O/video.mp4"
  sh core/render/mux.sh "$O/video.mp4" "$O/mix.wav" "$O/$F.mp4" $FPS 1
  node core/render/readcheck.mjs "$HERE" --size $SIZE --q film=$F > "$O/readcheck.txt" && echo "$F: lectura ok" || { grep -v "^OK\|^--" "$O/readcheck.txt" | tail -8; echo "$F: lectura, revisar out/$F/readcheck.txt"; }
  node core/render/still.mjs "$HERE" 8 --size $SIZE --q "film=$F&clean=1" --out "$O" --prefix poster_
  mv -f "$O/poster_8.jpg" "$O/poster.jpg"
  echo "listo: $O/$F.mp4"
done
