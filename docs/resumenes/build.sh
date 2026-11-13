#!/bin/sh
# Convierte cada resumen HTML de esta carpeta en PDF (media/resumenes/<nombre>.pdf) con Chrome sin ventana.
# Uso: sh docs/resumenes/build.sh [nombre …]   (sin nombres: todos)
cd "$(dirname "$0")/../.." || exit 1
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
mkdir -p media/resumenes
names="$*"; [ -z "$names" ] && names=$(ls docs/resumenes/*.html | xargs -n1 basename | sed 's/\.html$//')
for n in $names; do
  src="$(cd docs/resumenes && pwd -W 2>/dev/null || pwd)/$n.html"
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=15000 \
    --print-to-pdf="$(pwd -W 2>/dev/null || pwd)/media/resumenes/$n.pdf" "file:///$src" 2>/dev/null && echo "listo: media/resumenes/$n.pdf"
done
