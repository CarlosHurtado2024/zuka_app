#!/bin/bash
# Hojas de contacto por escena (borrador): bash sheets.sh carpeta salida [cada_seg]
cd "$(dirname "$0")/$1" || exit 1
out=$2; every=${3:-3}; mkdir -p "$out"
for f in videos/S*.mp4; do
  n=$(basename "$f" .mp4)
  ../.venv-gl/Scripts/ffmpeg -loglevel error -y -i "$f" -vf "fps=1/$every,scale=216:-1,tile=6x5" -frames:v 1 -update 1 "$out/$n.png"
done
ls "$out"
