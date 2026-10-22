#!/bin/zsh
set -e
R=${0:A:h}; D=$R/scenes/docs
mkdir -p $R/out
echo '{}' > $R/out/empty.states.json
names=()
for y in $D/*.yaml; do
  n=${y:t:r}
  st=$D/$n.states.json; [ -f $st ] || st=$R/out/empty.states.json
  fl=$D/$n.flags.json; [ -f $fl ] || fl=""
  tg=0; grep -q "_toggle: true" $y && tg=1
  $R/render.sh $n $y $st "$fl" $tg 2 >/dev/null
  names+=$n
  echo -n "$n "
done
echo
rm -rf $R/out/docs-images && mkdir $R/out/docs-images
for n in $names; do cp $R/out/$n.png $R/out/docs-images/$n.png; done
rm -f $R/../docs/images/*.png(N)
mv $R/out/docs-images/*.png $R/../docs/images/
