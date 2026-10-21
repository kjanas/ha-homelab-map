#!/bin/zsh
set -e -o pipefail
R=${0:A:h}
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
YAML=${1:-$R/scenes/demo.yaml}
STATES=${2:-$R/scenes/demo.states.json}
mkdir -p $R/out
/usr/bin/ruby -ryaml -rjson -e 'puts JSON.generate(YAML.safe_load(File.read(ARGV[0])))' "$YAML" > $R/out/check-config.json
$JSC -e "var H='$R', CARD='$R/../dist/ha-homelab-map.js', CFG='$R/out/check-config.json', STATES='$STATES'; load('$R/check.js')" > $R/out/check.log 2>&1 || true
$JSC -e "var H='$R', CARD='$R/../dist/ha-homelab-map.js'; load('$R/zoom.js')" > $R/out/zoom.log 2>&1 || true
grep -hE '^FAIL|FAILED|Exception|Error' $R/out/check.log $R/out/zoom.log || true
if grep -qE '^FAIL|FAILED|Exception|Error' $R/out/check.log $R/out/zoom.log || ! grep -qx 'ALL PASSED' $R/out/check.log || ! grep -q '^ok ' $R/out/zoom.log; then
  echo "TESTS FAILED (see $R/out/check.log, $R/out/zoom.log)"
  exit 1
fi
echo "ALL PASSED"
