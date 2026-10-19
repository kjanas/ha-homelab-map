#!/bin/zsh
set -e
R=${0:A:h}; H=$R; CARD=$R/../dist/ha-homelab-map.js
NAME=$1; YAML=$2; STATES=$3; FLAGS=${4:-/dev/null}; TOGGLES=${5:-0}; SCALE=${6:-2}; FRAMES=${7:-2}
/usr/bin/ruby -ryaml -rjson -e 'puts JSON.generate(YAML.safe_load(File.read(ARGV[0])))' "$YAML" > $R/out/$NAME.json
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc -e "var H='$H', CARD='$CARD', CFG='$R/out/$NAME.json', STATES='$STATES', FLAGSFILE='$FLAGS', TOGGLES=$TOGGLES, SCALE=$SCALE, FRAMES=$FRAMES; load('$R/render.js')" > $R/out/$NAME.svg
W=$(grep -o 'width="[0-9]*"' $R/out/$NAME.svg | head -1 | grep -o '[0-9]*'); HH=$(grep -o 'height="[0-9]*"' $R/out/$NAME.svg | head -1 | grep -o '[0-9]*')
S=$(( W > HH ? W : HH ))
( qlmanage -t -s $S -o $R/out $R/out/$NAME.svg >/dev/null 2>&1 & ); for i in {1..40}; do [ -s $R/out/$NAME.svg.png ] && break; sleep 0.25; done; pkill -f "qlmanage -t" 2>/dev/null || true
python3 -I $R/crop.py $R/out/$NAME.svg.png $R/out/$NAME.png $W $HH && rm $R/out/$NAME.svg.png && echo "$NAME.png ${W}x${HH}"
