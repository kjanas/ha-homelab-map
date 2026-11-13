import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "jsr:@std/yaml@1.3.0";

const here = path.dirname(fileURLToPath(import.meta.url));
const card = path.join(here, "..", "dist", "ha-homelab-map.js");
const out = path.join(here, "out");
const [yamlFile = path.join(here, "scenes", "demo.yaml"), statesFile = path.join(here, "scenes", "demo.states.json")] = Deno.args;

fs.mkdirSync(out, { recursive: true });
const config = path.join(out, "check-config.json");
fs.writeFileSync(config, JSON.stringify(parse(fs.readFileSync(yamlFile, "utf8"))));

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

const run = async (name, vars = {}) => {
  const lines = [];
  const ctx = vm.createContext({ H: here, CARD: card, ...vars });
  ctx.print = (...parts) => lines.push(parts.join(" "));
  ctx.readFile = (file) => fs.readFileSync(file, "utf8");
  ctx.load = (file) => vm.runInContext(ctx.readFile(file), ctx, { filename: file });
  ctx.loadString = (source) => vm.runInContext(source, ctx, { filename: card });
  ctx.drainMicrotasks = tick;
  try {
    ctx.load(path.join(here, `${name}.js`));
    await ctx.finished;
  } catch (error) {
    lines.push(`Exception: ${error?.stack ?? error}`);
  }
  await tick();
  fs.writeFileSync(path.join(out, `${name}.log`), `${lines.join("\n")}\n`);
  return lines;
};

const suites = [
  ["check", await run("check", { CFG: config, STATES: statesFile }), (lines) => lines.includes("ALL PASSED")],
  ["zoom", await run("zoom"), (lines) => lines.some((line) => line.startsWith("ok "))],
  ["register", await run("register"), (lines) => lines.some((line) => line.startsWith("ok "))],
];

let failed = false;
for (const [name, lines, complete] of suites) {
  const bad = lines.filter((line) => /^FAIL|FAILED|Exception|Error/.test(line));
  for (const line of bad) console.log(`${name}: ${line}`);
  const passed = lines.filter((line) => line.startsWith("ok ")).length;
  if (bad.length || !complete(lines)) {
    failed = true;
    console.log(`${name}: FAILED (${passed} passed, see test/out/${name}.log)`);
  } else console.log(`${name}: ${passed} passed`);
}
console.log(failed ? "TESTS FAILED" : "ALL PASSED");
Deno.exit(failed ? 1 : 0);
