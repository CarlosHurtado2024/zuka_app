#!/bin/sh
# Cuadros de prueba de una película: tres por escena (casi al final de cada momento) y una hoja de contacto.
#   sh video/preuda-cosmos/tools_stills.sh <película>   -> out/<película>/stills/ y out/<película>/hoja.jpg
set -e
HERE=$(cd "$(dirname "$0")" && pwd); F=$1; LIB=${LIB:-$HOME/lemo-opuscar}; O="$HERE/out/$F/stills"; rm -rf "$O"; mkdir -p "$O"
TIMES=$(cd "$HERE" && node -e "const D=require('./films/$F.data.js');const r=[];D.SCENES.forEach((s,i)=>s.caps.forEach(c=>r.push((D.SC[i].t0+c[1]-.6).toFixed(2))));if(D.SCENES.at(-1).caps.length<3)r.push((D.DUR-6).toFixed(2),(D.DUR-14).toFixed(2));console.log(r.join(' '))")
(cd "$LIB" && node core/render/still.mjs "$HERE" $TIMES --size 1080x1920 --q "f=$F" --out "$O" --prefix s_ >/dev/null)
python -X utf8 -c "
import sys,glob,os
from PIL import Image
o=sys.argv[1]; fs=sorted(glob.glob(os.path.join(o,'s_*.jpg')),key=lambda f:float(os.path.basename(f)[2:-4]))
w,h=270,480; n=len(fs); cols=8; rows=(n+cols-1)//cols
sheet=Image.new('RGB',(cols*w,rows*h))
for i,f in enumerate(fs): sheet.paste(Image.open(f).resize((w,h)),((i%cols)*w,(i//cols)*h))
sheet.save(sys.argv[2],quality=88)
" "$O" "$HERE/out/$F/hoja.jpg"
echo "$HERE/out/$F/hoja.jpg"
