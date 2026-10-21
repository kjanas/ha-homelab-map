#!/bin/zsh
set -e
R=${0:A:h}; D=$R/scenes/docs
rm -f $R/../docs/images/*.png(N)
for y in $D/*.yaml; do
  n=${y:t:r}
  st=$D/$n.states.json; [ -f $st ] || st=$R/out/empty.states.json
  fl=$D/$n.flags.json; [ -f $fl ] || fl=""
  tg=0; grep -q "_toggle: true" $y && tg=1
  $R/render.sh $n $y $st "$fl" $tg 2 >/dev/null
  cp $R/out/$n.png $R/../docs/images/$n.png
  echo -n "$n "
done
echo
