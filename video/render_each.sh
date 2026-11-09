#!/bin/bash
# Borrador escena por escena (sigue aunque una falle) e imprime solo los errores.
# Uso: bash render_each.sh carpeta archivo.py Escena1 Escena2 ...
cd "$(dirname "$0")/$1" || exit 1
export PATH="../.venv-gl/Scripts:$PATH"; export PYTHONPATH="$(pwd -W)"
file=$2; shift 2
for s in "$@"; do
  if manimgl "$file" "$s" -w -l > "videos_$s.log" 2>&1; then echo "OK $s"; rm -f "videos_$s.log"
  else echo "FALLA $s"; grep -E "Error|error:" "videos_$s.log" | grep -v "it/s" | tail -3; fi
done
