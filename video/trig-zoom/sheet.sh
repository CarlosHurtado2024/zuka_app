#!/bin/sh
# Hoja de contacto rápida de una película (sin sonido ni video): sh video/trig-zoom/sheet.sh <nombre> [paso]
# Deja out/<nombre>/hoja.png con un cuadro cada <paso> segundos (por defecto 4), 10 por fila.
set -e
HERE=$(cd "$(dirname "$0")" && pwd); LIB=${LIB:-$HOME/lemo-opuscar}; F=$1; STEP=${2:-4}
O="$HERE/out/$F/sheet"; rm -rf "$O"; mkdir -p "$O"
cd "$LIB"
node core/render/still.mjs "$HERE" --range 0:126:$STEP --size 1080x1920 --q "f=$F" --out "$O" --prefix s_ > /dev/null
cd "$O"; i=0; for f in $(ls s_*.jpg | sort -t_ -k2 -g); do mv "$f" "$(printf 'n%03d.jpg' $i)"; i=$((i+1)); done
ffmpeg -loglevel error -y -i n%03d.jpg -vf "scale=216:-1,tile=10x4" -frames:v 1 "$HERE/out/$F/hoja.png"
echo "$HERE/out/$F/hoja.png"
