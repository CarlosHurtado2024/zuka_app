#!/bin/sh
# Subconjuntos de Inter Tight (OFL) desde la API de Google Fonts con todas las letras de film.js y data.js. FORCE=1 para bajarlos otra vez.
set -e
H=$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd)); D=$H/fonts; mkdir -p "$D"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
TXT=$(python -X utf8 -c "
import urllib.parse
s=open(r'$H/film.js',encoding='utf8').read()+open(r'$H/data.js',encoding='utf8').read()
c=set(ch for ch in s if ord(ch)>=0x20)|set('0123456789%+·—–−≈×“”…«»¿?¡!áéíóúñÁÉÍÓÚÑüπ→÷')
print(urllib.parse.quote(''.join(sorted(c))))")
font() { [ -s "$D/$2" ] && [ -z "$FORCE" ] && return 0
  url=$(curl -fsS -A "$UA" "https://fonts.googleapis.com/css2?$1&text=$TXT" | grep -o 'https://[^)]*' | head -1); curl -fsS -o "$D/$2" "$url"; echo "$2"; }
font "family=Inter+Tight:wght@800" it800.woff2
font "family=Inter+Tight:wght@500" it500.woff2
font "family=Inter+Tight:ital,wght@1,600" it600i.woff2
[ -s "$D/OFL-intertight.txt" ] || curl -fsS -o "$D/OFL-intertight.txt" "https://raw.githubusercontent.com/google/fonts/main/ofl/intertight/OFL.txt"
