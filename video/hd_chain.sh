#!/bin/bash
# HD de varias clases en cadena, una a la vez: bash hd_chain.sh carpeta1 carpeta2 ...
cd "$(dirname "$0")"
export PATH="$(pwd)/.venv-gl/Scripts:$PATH"
for d in "$@"; do
  rm -f "$d/videos/layout_warnings.txt"
  (cd "$d" && export PYTHONPATH="$(pwd -W)" && python -X utf8 build.py > build_hd.log 2>&1; echo "$d: $(tail -1 build_hd.log)")
  cat "$d/videos/layout_warnings.txt" 2>/dev/null
done
