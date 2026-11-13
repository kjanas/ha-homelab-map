#!/bin/zsh
set -e -o pipefail
R=${0:A:h}
cd $R/..
deno run -q --frozen --allow-read --allow-write=test/out test/run.js "$@"
