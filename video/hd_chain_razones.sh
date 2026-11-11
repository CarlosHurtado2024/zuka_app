#!/bin/bash
# HD de R1–R3 en cadena, una a la vez.
cd "$(dirname "$0")"
export PATH="$(pwd)/.venv-gl/Scripts:$PATH"
for d in clase_alg_u2_r1_razones clase_alg_u2_r2_proporciones clase_alg_u2_r3_regla_tres; do
  (cd $d && export PYTHONPATH="$(pwd -W)" && python -X utf8 build.py > build_hd.log 2>&1; echo "$d: $(tail -1 build_hd.log)")
done
