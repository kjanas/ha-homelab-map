#!/bin/zsh
set -e
R=${0:A:h}
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
YAML=${1:-$R/scenes/demo.yaml}
STATES=${2:-$R/scenes/demo.states.json}
mkdir -p $R/out
/usr/bin/ruby -ryaml -rjson -e 'puts JSON.generate(YAML.safe_load(File.read(ARGV[0])))' "$YAML" > $R/out/check-config.json
$JSC -e "var H='$R', CARD='$R/../dist/ha-homelab-map.js', CFG='$R/out/check-config.json', STATES='$STATES'; load('$R/check.js')" | tee $R/out/check.log | grep -E '^(FAIL|ALL PASSED)|FAILED|Exception'
$JSC -e "var H='$R', CARD='$R/../dist/ha-homelab-map.js'; load('$R/zoom.js')" | grep -E '^(ok|FAIL)|Exception'
