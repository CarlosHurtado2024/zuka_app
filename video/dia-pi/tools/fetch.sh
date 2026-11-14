#!/bin/sh
# Baja a raw/ solo los tramos usados (Wikimedia Commons), las dos fotos y la resolución H. Res. 224 (govinfo, dominio público),
# y saca las páginas del PDF a 220 ppp. Queda constancia de cada archivo en SOURCES.jsonl.
set -e
H=$(cd "$(dirname "$0")/.." && pwd); cd "$H/raw" 2>/dev/null || { mkdir -p "$H/raw"; cd "$H/raw"; }
LIB=${LIB:-"$HOME/lemo-opuscar"}
if [ -x "$LIB/.venv/Scripts/python.exe" ]; then PY="$LIB/.venv/Scripts/python.exe"; else PY="$LIB/.venv/bin/python"; fi
S=../tools/commons-tools/seg.py; KA="ZDF/Terra X/Bilderfest/Lena Paul/Dirk Hagen/Saba Bussmann/Jochen Schmidt"
"$PY" -X utf8 $S "File:Was sich hinter der Kreiszahl pi verbirgt.webm" kreis_a 6 18 "CC BY 4.0" "$KA" "taza y cinta métrica"; sleep 3
"$PY" -X utf8 $S "File:Was sich hinter der Kreiszahl pi verbirgt.webm" kreis_b 50 16 "CC BY 4.0" "$KA" "pastel de dígitos"; sleep 3
"$PY" -X utf8 $S "File:Ma première tarte abricot.webm" tarte_a 116 14 "CC BY 3.0" "Lycée Georges Baptiste" "tarta"; sleep 3
"$PY" -X utf8 $S "File:Ma première tarte abricot.webm" tarte_b 144 22 "CC BY 3.0" "Lycée Georges Baptiste" "tarta glaseada"; sleep 3
"$PY" -X utf8 $S "File:Sunset on Eiffel Tower in Paris - Vimeo.webm" eiffel 0 15 "CC0" "Mythomen" "París al atardecer"
[ -d raw ] && mv raw/* . && rmdir raw; [ -f SOURCES.jsonl ] && cat SOURCES.jsonl >> ../SOURCES.jsonl && rm SOURCES.jsonl
UA="lemo-opuscar/1.0 (https://github.com/lemomo-ai/lemo-opuscar)"
curl -s -A "$UA" -o pie.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Pi_Day_pie.jpg/1920px-Pi_Day_pie.jpg"; sleep 3
curl -s -A "$UA" -o unesco.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Paris_-_UNESCO_%2829775501630%29.jpg/3840px-Paris_-_UNESCO_%2829775501630%29.jpg"
curl -sfL -o hres224eh.pdf "https://www.govinfo.gov/content/pkg/BILLS-111hres224eh/pdf/BILLS-111hres224eh.pdf"
pdftoppm -r 220 -f 1 -l 2 -jpeg hres224eh.pdf doc
