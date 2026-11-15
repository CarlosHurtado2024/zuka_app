#!/bin/sh
# Revisión rápida antes de construir: ritmo de la narración y tiempo de lectura de cada texto.
#   sh video/trig-zoom/check.sh grados arco
HERE=$(cd "$(dirname "$0")" && pwd -W 2>/dev/null || pwd); LIB=${LIB:-$HOME/lemo-opuscar}
for F in "$@"; do
  node -e "
const s=require('fs').readFileSync('$HERE/films/$F.js','utf8');const N=eval(s.match(/FILM\.NARR = (\[[\s\S]*?\n\]);/)[1]);
let bad=0;for(const [a,b,x] of N){const w=x.split(/\s+/).length;if(b-a<1.8||w/(b-a)>3.2){bad++;console.log('RÁPIDA',a,(w/(b-a)).toFixed(2),x);}}
for(let i=1;i<N.length;i++) if(N[i][0]<N[i-1][1]) console.log('SE PISAN',N[i][0]);
console.log('$F narración', bad?'con fallas':'ok');"
  (cd "$LIB" && node core/render/readcheck.mjs "$HERE" --size 1080x1920 --q "f=$F" > "$HERE/out/readcheck_$F.txt" && echo "$F lectura ok" || grep -v "^OK\|^--" "$HERE/out/readcheck_$F.txt")
done
