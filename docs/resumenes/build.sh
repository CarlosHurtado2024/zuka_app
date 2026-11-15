#!/bin/sh
# Compila los resúmenes en LaTeX de cada mundo (docs/resumenes/tex/<mundo>.tex) y deja el PDF en
# media/resumenes/<mundo>.pdf. <mundo> es el id del mundo (u.world): conjuntos, numeros, ondas…
# Uso: sh docs/resumenes/build.sh [mundo …]   (sin nombres: todos)
# Necesita pdflatex (MiKTeX o TeX Live) con tikz, pgfplots, tcolorbox y newpx.
cd "$(dirname "$0")/tex" || exit 1
mkdir -p salida ../../../media/resumenes
names="$*"; [ -z "$names" ] && names=$(ls *.tex | sed 's/\.tex$//')
ok=0; bad=0
for n in $names; do
  if pdflatex -interaction=nonstopmode -halt-on-error -output-directory=salida "$n.tex" > "salida/$n.consola.txt" 2>&1 &&
     pdflatex -interaction=nonstopmode -halt-on-error -output-directory=salida "$n.tex" > "salida/$n.consola.txt" 2>&1; then
    cp "salida/$n.pdf" "../../../media/resumenes/$n.pdf"; echo "listo: media/resumenes/$n.pdf"; ok=$((ok + 1))
  else
    echo "ERROR en $n.tex (ver docs/resumenes/tex/salida/$n.log):"; grep -A3 '^!' "salida/$n.log" | head -8; bad=$((bad + 1))
  fi
done
echo "$ok listos, $bad con error"
[ "$bad" -eq 0 ]
