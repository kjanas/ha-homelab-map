load(H + "/harness.js");
window.addEventListener = () => {};
window.removeEventListener = () => {};
window.matchMedia = () => ({ matches: false });
window.innerHeight = 900;
var frames = [],
  requestAnimationFrame = (f) => {
    frames.push(f);
    return frames.length;
  },
  cancelAnimationFrame = () => {},
  performance = { now: () => 0 },
  setTimeout = () => 1,
  clearTimeout = () => {};
var getComputedStyle = () => ({ getPropertyValue: () => "" });
var Path2D = class {
  constructor(d) {
    if (typeof d !== "string") throw new TypeError("Path2D d");
    this.d = d;
  }
};
const fin = (name, a) =>
  a.forEach((v, i) => {
    if (typeof v === "number" && !Number.isFinite(v)) throw new TypeError(`${name} arg ${i} non-finite`);
  });
let calls = 0;
Node_.prototype.getContext = () =>
  new Proxy({}, {
    get: (t, k) => (k in t ? t[k] : (...a) => {
      calls++;
      fin(String(k), a);
      if (k === "setLineDash") fin("dash", a[0]);
      if (k === "createLinearGradient") return { addColorStop: (o) => fin("stop", [o]) };
    }),
    set: (t, k, v) => {
      if (typeof v === "number") fin(String(k), [v]);
      t[k] = v;
      return true;
    },
  });
loadString(readFile(CARD).replace(/import\.meta\.url/g, JSON.stringify("file://" + CARD)));
let failed = 0;
const expect = (name, cfg, part) => {
  try {
    validateConfig(cfg);
    print(`FAIL ${name}: no error`);
    failed++;
  } catch (e) {
    if (e.message.includes(part)) print(`ok   ${name}: ${e.message}`);
    else {
      print(`FAIL ${name}: ${e.message}`);
      failed++;
    }
  }
};
const D = (extra = {}) => ({ type: "device", id: "a", at: [0, 0], size: [10, 10], ...extra });
const R = (items, extra = {}) => ({ type: "rack", id: "r", at: [0, 0], units: 4, items, ...extra });
const B = (extra = {}) => ({ type: "badge", id: "b1", at: [0, 0], entity: "sensor.t", icon: "mdi:thermometer", ...extra });
const L = (extra = {}) => ({ id: "l", start_device: "a", start_edge: "right", end_device: "b", end_edge: "left", ...extra });
const two = [D(), D({ id: "b", at: [50, 0] })];
expect("no items", {}, "'items' list is required");
expect("old devices key", { items: [], devices: [] }, "card.devices: unknown property");
expect("bad type", { items: [{ type: "switch", id: "x" }] }, "items[0].type");
expect("missing id", { items: [{ type: "device", at: [0, 0], size: [1, 1] }] }, "items[0].id: required");
expect("missing at", { items: [{ type: "device", id: "x", size: [1, 1] }] }, "items[0].at: expected [x, y]");
expect("missing size", { items: [{ type: "device", id: "x", at: [0, 0] }] }, "items[0].size");
expect("unknown key", { items: [D({ name: "Router" })] }, "items[0].name: unknown property");
expect("rack units", { items: [{ type: "rack", id: "r", at: [0, 0] }] }, "items[0].units");
expect("rackdevice at top", { items: [{ type: "rackdevice", id: "x", u: 1 }] }, "'rackdevice' must be inside a rack's items");
expect("rack_id gone", { items: [R([{ type: "rackdevice", id: "x", u: 1, rack_id: "r" }])] }, "items[0].items[0].rack_id: unknown property");
expect("rackdevice overflow", { items: [R([{ type: "rackdevice", id: "x", u: 3, units: 3 }])] }, "U3–U5 does not fit in the 4U rack 'r'");
expect(
  "endpoint in rack",
  { items: [R([{ type: "endpoint", id: "e", at: [0, 0], icon: "mdi:tv" }])] },
  "a rack can contain only: rackdevice, device, badge, chip, led",
);
expect("device in device", { items: [D({ items: [D({ id: "x" })] })] }, "a device can contain only: badge");
expect("endpoint icon and chip", {
  items: [{ type: "endpoint", id: "e", at: [0, 0], icon: "mdi:tv", items: [{ type: "chip", id: "c", at: [4, 4], icon: "mdi:xbox" }] }],
}, "either an mdi 'icon' or a chip in 'items'");
expect("endpoint badge", {
  items: [{ type: "endpoint", id: "e", at: [0, 0], items: [{ type: "badge", id: "b", at: [0, 0], entity: "sensor.x", icon: "none" }] }],
}, "an endpoint can contain only: chip, label");
expect("endpoint image gone", { items: [{ type: "endpoint", id: "e", at: [0, 0], image: "/x.png" }] }, "items[0].image: unknown property");
expect("endpoint neither", { items: [{ type: "endpoint", id: "e", at: [0, 0] }] }, "either an mdi 'icon' or a chip in 'items'");
expect("duplicate nested id", { items: [D({ items: [B({ id: "a" })] })] }, "items[0].items[0].id: duplicate id 'a'");
expect("badge no entity", { items: [B({ entity: undefined })] }, "items[0].entity");
expect("badge icon required", { items: [{ type: "badge", id: "b", at: [0, 0], entity: "sensor.t" }] }, "items[0].icon: required");
expect("badge icon not mdi", { items: [B({ icon: "thermometer" })] }, "items[0].icon: expected an mdi icon");
expect("badge units", { items: [B({ units: 5 })] }, "items[0].units");
expect("badge decimals", { items: [B({ decimals: 1.5 })] }, "items[0].decimals");
expect("badge size", { items: [B({ size: "8pt" })] }, "items[0].size: expected a font size in px");
expect("badge border", { items: [B({ show_border: "yes" })] }, "items[0].show_border");
expect("line to badge", { items: [D(), B({ id: "b" })], datalines: [L()] }, "'b' is not a device – lines connect devices and ports only");
expect("line unknown device", { items: two, datalines: [L({ end_device: "zz" })] }, "datalines[0].end_device: unknown device 'zz'");
expect("line bad edge", { items: two, datalines: [L({ start_edge: "up" })] }, "datalines[0].start_edge");
expect("line bad point", { items: two, datalines: [L({ start_point: 120 })] }, "percentage 0–100");
expect("dominant needs rx tx", { items: two, datalines: [L({ flow: "dominant", rx: "sensor.a" })] }, "'dominant' needs both 'rx' and 'tx'");
expect("status not binary", { items: two, datalines: [L({ status: "sensor.a" })] }, "datalines[0].status");
expect("power has no status", { items: two, powerlines: [L({ status: "active" })] }, "powerlines[0].status: unknown property");
expect("line id clashes with item", { items: two, datalines: [L({ id: "a" })] }, "duplicate id 'a'");
try {
  validateConfig({ items: [], visibility: [{ condition: "screen", media_query: "(min-width: 0px)" }], card_mod: { style: "" }, layout_options: {}, grid_options: {}, view_layout: {} });
  print("ok   dashboard keys (visibility, card_mod, layout_options, grid_options, view_layout)");
} catch (e) {
  print(`FAIL dashboard keys: ${e.message}`);
  failed++;
}
expect("chip javascript url", { items: [{ type: "chip", id: "c", at: [0, 0], icon: "mdi:server", url: "javascript:alert(1)" }] }, "items[0].url: expected a link");
try {
  validateConfig({ items: [{ type: "chip", id: "c", at: [0, 0], icon: "mdi:server", url: "obsidian://open?vault=x" }] });
  print("ok   chip app link (obsidian://)");
} catch (e) {
  print(`FAIL chip app link: ${e.message}`);
  failed++;
}
expect("chip protocol-relative image", { items: [{ type: "chip", id: "c", at: [0, 0], image: "//evil.example/x.svg" }] }, "items[0].image: expected an image URL");
expect("chip data small_image", { items: [{ type: "chip", id: "c", at: [0, 0], icon: "mdi:server", small_image: "data:image/svg+xml,x" }] }, "items[0].small_image: expected an image URL");
expect("vlan colour not a colour", { items: [], vlans: { LAN: 123 } }, "vlans.LAN: expected a colour");
expect("led colour url()", { items: [{ type: "led", id: "e", at: [0, 0], color: "url(https://x/y)" }] }, "items[0].color: expected a colour");
expect("label colour with css", { items: [{ type: "label", id: "t", at: [0, 0], text: "x", color: "red; display: none" }] }, "items[0].color: expected primary, secondary");
expect("threshold colour empty", { items: [B({ thresholds: [{ above: 1, color: " " }] })] }, "items[0].thresholds[0].color: expected red");
try {
  validateConfig({ vlans: { LAN: "tomato", IoT: "hsl(120, 50%, 40%)" }, items: [{ type: "label", id: "t", at: [0, 0], text: "x", color: "var(--accent-color)" }, B({ thresholds: [{ above: 1, color: "yellow" }] })] });
  print("ok   named, hsl() and var() colours accepted");
} catch (e) {
  print(`FAIL colour names: ${e.message}`);
  failed++;
}
expect("scale zero", { items: [], scale: 0 }, "scale: expected a number above 0");
expect("toggle not boolean", { items: [], vlan_toggle: "yes" }, "vlan_toggle: expected true or false");
expect("power toggle not boolean", { items: [], power_toggle: 1 }, "power_toggle: expected true or false");
const C = (extra = {}) => ({ type: "chip", id: "c1", at: [0, 0], icon: "mdi:docker", ...extra });
expect("chip neither", { items: [{ type: "chip", id: "c", at: [0, 0] }] }, "a chip needs either 'icon' or 'image'");
expect("chip both", { items: [C({ image: "/x.png" })] }, "a chip needs either 'icon' or 'image'");
expect("chip bad icon", { items: [C({ icon: "docker" })] }, "items[0].icon: expected an mdi icon");
expect("chip status not entity", { items: [C({ status_entity: "running" })] }, "items[0].status_entity: expected an entity id");
expect("chip update not entity", { items: [C({ update_entity: 5 })] }, "items[0].update_entity: expected an entity id");
expect("chip size", { items: [C({ size: 0 })] }, "items[0].size: expected a diameter in px");

expect("line to chip", { items: [D(), C({ id: "b" })], datalines: [L()] }, "'b' is not a device – lines connect devices and ports only");
const E = (extra = {}) => ({ type: "led", id: "e1", at: [0, 0], color: "#66b771", ...extra });
expect("led neither", { items: [{ type: "led", id: "e", at: [0, 0] }] }, "a led needs either 'vlan' or 'color'");
expect("led both", { items: [E({ vlan: "LAN" })], vlans: { LAN: "#fff" } }, "a led needs either 'vlan' or 'color'");
expect("led unknown vlan", { items: [E({ color: undefined, vlan: "IoT" })], vlans: { LAN: "#fff" } }, "items[0].vlan: unknown VLAN 'IoT'");
expect("led vlan named like a built-in", { items: [E({ color: undefined, vlan: "toString" })], vlans: { LAN: "#fff" } }, "items[0].vlan: unknown VLAN 'toString'");
expect("line vlan named like a built-in", { items: two, datalines: [L({ vlans: ["constructor"] })] }, "datalines[0].vlans: unknown VLAN 'constructor'");
expect("texture named like a built-in", { items: [D({ texture: "constructor" })] }, "items[0].texture: expected one of");
expect("type named like a built-in", { items: [{ type: "toString", id: "x" }] }, "items[0].type: expected one of");
expect("led bad effect", { items: [E({ effect: "pulse" })] }, "items[0].effect: expected one of flicker, blink, none");
expect("led bad size", { items: [E({ size: 3 })] }, "items[0].size: expected [width, height] in px");
expect("led bad entity", { items: [E({ entity: "on" })] }, "items[0].entity: expected an entity id");
expect("line to led", { items: [D(), E({ id: "b" })], datalines: [L()] }, "'b' is not a device");
const T = (extra = {}) => ({ type: "label", id: "t1", at: [0, 0], text: "LAN", ...extra });
expect("label no text", { items: [{ type: "label", id: "t", at: [0, 0] }] }, "items[0].text: required");
expect("label size", { items: [T({ size: "8pt" })] }, "items[0].size: expected a font size in px");
expect("label bold", { items: [T({ bold: "yes" })] }, "items[0].bold: expected true or false");
expect("label vertical", { items: [T({ vertical: 1 })] }, "items[0].vertical: expected true or false");
expect("label unknown key", { items: [T({ align: "right" })] }, "items[0].align: unknown property");
expect("endpoint label only", { items: [{ type: "endpoint", id: "e", at: [0, 0], items: [T()] }] }, "either an mdi 'icon' or a chip in 'items'");
for (
  const cfg of [{ items: [{ type: "endpoint", id: "e", at: [0, 0], icon: "mdi:tv", items: [T()] }] }, {
    items: [D({ items: [T({ color: "secondary", vertical: true, bold: true, size: 6 })] })],
  }]
) {
  try {
    validateConfig(cfg);
    print("ok   label accepted");
  } catch (e) {
    print(`FAIL label: ${e.message}`);
    failed++;
  }
}
expect("rates_at bad", { items: two, datalines: [L({ rx: "sensor.r", rates_at: "middle" })] }, "rates_at: expected start, end or a percentage 0–100");
expect("rates_at no sensors", { items: two, datalines: [L({ rates_at: "start" })] }, "rates_at: needs 'rx' and/or 'tx' to show");
expect(
  "rates_placement bad",
  { items: two, datalines: [L({ rx: "sensor.r", rates_at: 50, rates_placement: "left" })] },
  "rates_placement: expected one of middle, above, below",
);
expect("rates_size without at", { items: two, datalines: [L({ rx: "sensor.r", rates_size: 9 })] }, "rates_size: has no effect without 'rates_at'");
expect("rates on powerline", { items: two, powerlines: [L({ rates_at: "start" })] }, "powerlines[0].rates_at: unknown property");
const G = (items = [], extra = {}) => ({ type: "group", id: "g1", at: [0, 0], items, ...extra });
expect("toggle unknown group", { items: [B({ toggle: "nope" })] }, "items[0].toggle: 'nope' is not a group");
expect("toggle to a device", { items: [D(), B({ toggle: "a" })] }, "items[1].toggle: 'a' is not a group");
expect("device in group", { items: [G([D({ id: "x" })])] }, "a group can contain only: badge, chip, led, label");
expect("group in endpoint", { items: [{ type: "endpoint", id: "e", at: [0, 0], icon: "mdi:tv", items: [G()] }] }, "an endpoint can contain only: chip, label");
expect("group in group", { items: [G([G([], { id: "g2" })])] }, "a group can contain only");
expect("group no at", { items: [{ type: "group", id: "g", items: [] }] }, "items[0].at: expected [x, y]");
try {
  validateConfig({ items: [D({ items: [G([C()]), B({ toggle: "g1" })] })] });
  print("ok   group + toggle accepted");
} catch (e) {
  print(`FAIL group: ${e.message}`);
  failed++;
}
expect("debug_toggle not boolean", { items: [], debug_toggle: "yes" }, "debug_toggle: expected true or false");
expect("animation_toggle not boolean", { items: [], animation_toggle: 1 }, "animation_toggle: expected true or false");
expect("led caption without size", { items: [{ type: "led", id: "e", at: [0, 0], color: "#fff", caption: "LAN" }] }, "items[0].caption: needs 'size'");
expect("look removed", { items: [], look: "depth" }, "card.look: unknown property");
expect("background bad", { items: [], background: "stars" }, "background: expected none, blueprint, pegboard, vignette");
expect(
  "texture bad",
  { items: [D({ texture: "dell" })] },
  "items[0].texture: expected one of hex, mesh, slots, grille, carbon, ribbed, brushed, glass, tpl, mtk, dll, hpe, unf",
);
expect("toggles_at shape", { debug_toggle: true, toggles_at: [10], items: [D()] }, "toggles_at: expected [x, y]");
expect("toggles_at without switch", { toggles_at: [10, 10], items: [D()] }, "toggles_at: has no effect without a switch");
expect("texture_opacity without texture", { items: [D({ texture_opacity: 0.5 })] }, "items[0].texture_opacity: has no effect without 'texture'");
expect("texture_opacity range", { items: [D({ texture: "hex", texture_opacity: 2 })] }, "items[0].texture_opacity: expected a number from 0 to 1");
expect("font not a name", { items: [], font: 12 }, "font: expected a font family name");
expect("font with quotes", { items: [], font: 'x"; color: red' }, "font: expected a font family name");
expect(
  "chip small_image not string",
  { items: [{ type: "chip", id: "c", at: [0, 0], image: "/a.svg", small_image: 5 }] },
  "items[0].small_image: expected an image URL",
);
expect("chip small_image and small_entity", {
  items: [{ type: "chip", id: "c", at: [0, 0], image: "/a.svg", small_image: "/b.svg", small_entity: "sensor.x" }],
}, "not both");
expect(
  "chip small_entity bad",
  { items: [{ type: "chip", id: "c", at: [0, 0], image: "/a.svg", small_entity: "x" }] },
  "items[0].small_entity: expected an entity id",
);
const PS = (items = [], extra = {}) => ({ type: "ports", id: "ps", at: [0, 0], items, ...extra });
const P = (extra = {}) => ({ type: "port", id: "p1", at: [0, 0], entity: "sensor.p1_rate", ...extra });
expect("port outside ports", { items: [D({ items: [P()] })] }, "a device can contain only");
expect("ports bad speed", { items: [D({ items: [PS([P()], { speed: "fast" })] })] }, "items[0].items[0].speed: expected a link speed");
expect("port bad speed", { items: [D({ items: [PS([P({ speed: "1 Gig" })])] })] }, "items[0].items[0].items[0].speed: expected a link speed");
expect("port icon not allowed", { items: [D({ items: [PS([P({ icon: "mdi:cctv" })])] })] }, "items[0].items[0].items[0].icon: unknown property");
expect("port no entity", { items: [D({ items: [PS([P({ entity: undefined })])] })] }, "items[0].items[0].items[0].entity");
expect("ports bad icon", { items: [D({ items: [PS([P()], { icon: "ethernet" })] })] }, "items[0].items[0].icon: expected an mdi icon");
expect(
  "line device and port",
  { items: [D({ items: [PS([P()])] }), D({ id: "b", at: [50, 0] })], datalines: [L({ start_port: "p1" })] },
  "use either 'start_device' or 'start_port', not both",
);
expect(
  "powerline open end",
  { items: [D(), D({ id: "b", at: [50, 0] })], powerlines: [L({ end_device: undefined, end_edge: undefined, points: [[80, 0]] })] },
  "needs either 'end_device' or 'end_port'",
);
expect(
  "open end with edge",
  { items: [D(), D({ id: "b", at: [50, 0] })], datalines: [L({ end_device: undefined, points: [[80, 0]] })] },
  "end_edge: has no effect on an open end",
);
expect(
  "open end no points",
  { items: [D(), D({ id: "b", at: [50, 0] })], datalines: [L({ end_device: undefined, end_edge: undefined })] },
  "an open end needs at least one point",
);
expect("both ends open", { items: [D()], datalines: [{ id: "l", points: [[0, 0], [10, 0]] }] }, "only one end can be open");
for (
  const [name, line] of [["open end", L({ end_device: undefined, end_edge: undefined, points: [[10, -40]] })], [
    "open start",
    L({ start_device: undefined, start_edge: undefined, points: [[60, -40], [60, 5]] }),
  ]]
) {
  try {
    validateConfig({ items: [D(), D({ id: "b", at: [50, 0] })], datalines: [line] });
    print(`ok   ${name} accepted`);
  } catch (e) {
    print(`FAIL ${name}: ${e.message}`);
    failed++;
  }
}
expect(
  "line unknown port",
  { items: [D(), D({ id: "b", at: [50, 0] })], datalines: [L({ start_device: undefined, start_port: "zz" })] },
  "start_port: unknown port 'zz'",
);
try {
  validateConfig({
    items: [
      D({ items: [PS([P(), P({ id: "p2", at: [14, 0], speed: "100Mbps" })], { size: 16, speed: "2.5Gbps", icon: "mdi:ethernet" })] }),
      D({ id: "b", at: [50, 0] }),
    ],
    datalines: [L({ start_device: undefined, start_port: "p2", start_edge: "top" })],
  });
  print("ok   ports + port line accepted");
} catch (e) {
  print(`FAIL ports: ${e.message}`);
  failed++;
}
let okNeg = true;
try {
  validateConfig({ items: [R([B({ at: [-10, -8] })])] });
} catch (e) {
  okNeg = false;
  print(`FAIL negative at: ${e.message}`);
  failed++;
}
if (okNeg) print("ok   negative relative coordinates accepted");
for (const icon of [false, "none", null]) {
  try {
    validateConfig({ items: [B({ icon })] });
    print(`ok   icon ${icon} accepted`);
  } catch (e) {
    print(`FAIL icon ${icon}: ${e.message}`);
    failed++;
  }
}
const good = JSON.parse(readFile(CFG));
validateConfig(good);
print("ok   demo config valid");
const states = {};
for (const [id, v] of Object.entries(JSON.parse(readFile(STATES)))) states[id] = { entity_id: id, state: String(v.state ?? v), attributes: v.attributes || {} };
const card = new CardClass();
card.setConfig(good);
card.connectedCallback();
card.hass = { states };
for (let i = 0; i < 3; i++) frames.splice(0).forEach((f) => f(100 * (i + 1)));
const next = { ...states };
for (const k of Object.keys(next)) next[k] = { ...next[k], state: k.startsWith("binary_sensor") ? "off" : "0" };
card.hass = { states: next };
card.hass = { states: next };
card.disconnectedCallback();
const motionCfg = {
  animation_toggle: true,
  vlans: { LAN: "#6c9cda" },
  items: [D({ items: [{ type: "led", id: "led1", at: [2, 2], vlan: "LAN" }] }), D({ id: "b", at: [50, 0] })],
  datalines: [L({ flow: "forward", vlans: ["LAN"] })],
};
const queuedFrames = {};
for (const stored of ["1", "0"]) {
  window.localStorage = { getItem: (k) => (k === "ha-homelab-map:animate" ? stored : null), setItem: () => {} };
  frames.splice(0);
  const m = new CardClass();
  m.setConfig(motionCfg);
  m.connectedCallback();
  m.hass = { states };
  queuedFrames[stored] = frames.length;
  m.disconnectedCallback();
  frames.splice(0);
}
if (queuedFrames["1"] === queuedFrames["0"] + 1) print("ok   animations switch off stops the loop");
else {
  print(`FAIL animations switch: frames on ${queuedFrames["1"]}, off ${queuedFrames["0"]}`);
  failed++;
}
{
  frames.splice(0);
  const ic = new CardClass();
  ic.setConfig({ items: [{ type: "chip", id: "c", at: [0, 0], icon: "mdi:server", status_entity: "binary_sensor.up" }] });
  ic.connectedCallback();
  const up = (state) => ({ states: { "binary_sensor.up": { entity_id: "binary_sensor.up", state, attributes: {} } } });
  ic.hass = up("on");
  const idle = frames.length;
  ic.hass = up("off");
  const down = frames.length;
  ic.disconnectedCallback();
  frames.splice(0);
  if (down === idle + 1) print("ok   no animation loop while nothing moves, starts when a chip goes down");
  else {
    print(`FAIL idle loop: frames idle ${idle}, down ${down}`);
    failed++;
  }
}
{
  frames.splice(0);
  const strokes = [];
  const getContext = Node_.prototype.getContext;
  Node_.prototype.getContext = () => new Proxy({}, {
    get: (t, k) => (k in t ? t[k] : () => ({ addColorStop: () => {} })),
    set: (t, k, v) => {
      if (k === "strokeStyle") strokes.push(v);
      t[k] = v;
      return true;
    },
  });
  let red = "#111111";
  const css = getComputedStyle;
  getComputedStyle = () => ({ getPropertyValue: (name) => (name === "--error-color" ? red : "") });
  const tc = new CardClass();
  tc.setConfig({ items: [{ type: "chip", id: "c", at: [0, 0], icon: "mdi:server", status_entity: "binary_sensor.up" }] });
  const hs = (dark) => ({ themes: { darkMode: dark, theme: "default" }, states: { "binary_sensor.up": { entity_id: "binary_sensor.up", state: "off", attributes: {} } } });
  const run = () => { for (const f of frames.splice(0)) f(0); };
  tc.hass = hs(true);
  run();
  const before = strokes.at(-1);
  red = "#222222";
  tc.hass = hs(true);
  run();
  const same = strokes.at(-1);
  tc.hass = hs(false);
  run();
  const after = strokes.at(-1);
  getComputedStyle = css;
  Node_.prototype.getContext = getContext;
  frames.splice(0);
  if (before === "#111111" && same === "#111111" && after === "#222222") print("ok   theme switch re-resolves canvas colours");
  else {
    print(`FAIL theme switch: ${before} ${same} ${after}`);
    failed++;
  }
}
{
  const getContext = Node_.prototype.getContext;
  const named = { tomato: "#ff6347", "hsl(120, 100%, 25%)": "#008000" };
  Node_.prototype.getContext = () => {
    let fill = "#000000";
    return { set fillStyle(v) { if (named[v] || /^#/.test(v)) fill = named[v] || v; }, get fillStyle() { return fill; } };
  };
  const got = [mixColor("tomato", "#000000", 0.5), mixColor("hsl(120, 100%, 25%)", "#000000", 1), mixColor("nonsense", "#000000", 0.5)].join(" ");
  Node_.prototype.getContext = getContext;
  if (got === "rgb(128,50,36) rgb(0,128,0) nonsense") print("ok   named and hsl() colours mix like hex colours");
  else {
    print(`FAIL colour names: ${got}`);
    failed++;
  }
}
{
  const r = (state, unit) => toKBps({ state, attributes: unit === undefined ? {} : { unit_of_measurement: unit } });
  const got = [r("8", "Mbit/s"), r("8", "mbit/s"), r("8", "Mb/s"), r("8", "MB/s"), r("8"), r("8", "B"), r("8", "MBps"), r("8", "mbps")].map(String).join(" ");
  if (got === "1000 1000 1000 8000 8 NaN NaN 1000") print("ok   rate units (case, Mb/s, no unit = kB/s, unknown = —)");
  else {
    print(`FAIL rate units: ${got}`);
    failed++;
  }
}
{
  window.devicePixelRatio = 3;
  frames.splice(0);
  const dc = new CardClass();
  dc.setConfig({ items: [{ type: "chip", id: "c", at: [0, 0], icon: "mdi:server" }] });
  dc.hass = { states: {} };
  dc.connectedCallback();
  for (const f of frames.splice(0)) f(0);
  const canvas = dc.shadowRoot.querySelectorAll("canvas")[0];
  dc.disconnectedCallback();
  delete window.devicePixelRatio;
  if (canvas && canvas.width === 1620 * 2) print("ok   canvas density capped at 2x");
  else {
    print(`FAIL canvas density: ${canvas && canvas.width}`);
    failed++;
  }
}
{
  const measure = Node_.prototype.getComputedTextLength;
  Node_.prototype.getComputedTextLength = function () {
    for (let n = this; n; n = n.parentNode) if (n.style && n.style._p && n.style._p.display === "none") return 0;
    return this.textContent.length * 5.5;
  };
  window.localStorage = { getItem: (k) => (k === HIDDEN_GROUPS_KEY ? JSON.stringify(["g1"]) : null), setItem: () => {} };
  const gc = new CardClass();
  gc.setConfig({ items: [D({ size: [200, 100], items: [G([B({ id: "inner", entity: "sensor.inner", show_border: true })]), B({ id: "switch", at: [0, 60], entity: "sensor.inner", toggle: "g1" })] })] });
  gc.hass = { states: { "sensor.inner": { entity_id: "sensor.inner", state: "123456", attributes: {} } } };
  const frameW = () => gc.shadowRoot.querySelectorAll("rect").filter((r) => /\bbframe\b/.test(r.attrs.class || "")).map((r) => r.attrs.width)[0];
  const hiddenW = frameW();
  const target = gc.shadowRoot.querySelectorAll("g").find((g) => g.dataset && g.dataset.toggle === "g1");
  gc.shadowRoot.querySelectorAll("ha-card")[0].dispatch("click", { target: { closest: () => target }, stopPropagation() {}, preventDefault() {} });
  const shownW = frameW();
  Node_.prototype.getComputedTextLength = measure;
  delete window.localStorage;
  if (Number(shownW) > Number(hiddenW)) print("ok   badges in a hidden group are measured when the group is shown");
  else {
    print(`FAIL hidden group badge width: hidden ${hiddenW}, shown ${shownW}`);
    failed++;
  }
}
{
  let seen = null;
  IntersectionObserver = class {
    constructor(fn) { seen = fn; }
    observe() {}
    disconnect() {}
  };
  frames.splice(0);
  const vc = new CardClass();
  vc.setConfig({ items: [B({ entity: "sensor.v" })] });
  const st = (v) => ({ states: { "sensor.v": { entity_id: "sensor.v", state: v, attributes: {} } } });
  vc.hass = st("1");
  vc.connectedCallback();
  for (const f of frames.splice(0)) f(0);
  const text = () => vc.shadowRoot.querySelectorAll("text").map((t) => t.textContent).filter((t) => /^\d+$/.test(t))[0];
  seen([{ isIntersecting: false }]);
  vc.hass = st("2");
  const hidden = text();
  seen([{ isIntersecting: true }]);
  const shown = text();
  vc.disconnectedCallback();
  delete globalThis.IntersectionObserver;
  frames.splice(0);
  if (hidden === "1" && shown === "2") print("ok   off-screen card skips updates and catches up when shown");
  else {
    print(`FAIL off-screen updates: hidden ${hidden}, shown ${shown}`);
    failed++;
  }
}
{
  const oc = new CardClass();
  oc.setConfig({ items: [0, 1, 2].map((i) => B({ id: `o${i}`, at: [0, i * 20], entity: `sensor.o${i}`, show_border: true })) });
  const st = (v) => ({ states: Object.fromEntries([0, 1, 2].map((i) => [`sensor.o${i}`, { entity_id: `sensor.o${i}`, state: v, attributes: {} }])) });
  oc.hass = st("1");
  const order = [];
  const measure = Node_.prototype.getComputedTextLength;
  const setAttr = Node_.prototype.setAttribute;
  Node_.prototype.getComputedTextLength = function () { order.push("r"); return measure.call(this); };
  Node_.prototype.setAttribute = function (k, v) { if (k === "width" || k === "transform") order.push("w"); return setAttr.call(this, k, v); };
  oc.hass = st("12345");
  Node_.prototype.getComputedTextLength = measure;
  Node_.prototype.setAttribute = setAttr;
  const seq = order.join("");
  if (/^r+w+$/.test(seq)) print("ok   one state update measures all text before writing layout");
  else {
    print(`FAIL measure order: ${seq}`);
    failed++;
  }
}
{
  const log = [];
  let notify = null;
  ResizeObserver = class {
    constructor(fn) { notify = fn; log.push("new"); }
    observe() { log.push("observe"); }
    disconnect() { log.push("disconnect"); }
  };
  frames.splice(0);
  const rc = new CardClass();
  rc.setConfig({ items: [D()] });
  rc.hass = { states: {} };
  for (const f of frames.splice(0)) f(0);
  rc.connectedCallback();
  const connected = frames.length;
  notify([]);
  notify([]);
  const queued = frames.length - connected;
  for (const f of frames.splice(0)) f(0);
  rc.disconnectedCallback();
  rc.connectedCallback();
  rc.disconnectedCallback();
  delete globalThis.ResizeObserver;
  frames.splice(0);
  const got = `${queued} ${log.join(",")}`;
  if (got === "0 new,observe,disconnect,new,observe,disconnect") print("ok   resizes coalesce into one frame, observer follows connect/disconnect");
  else {
    print(`FAIL resize handling: ${got}`);
    failed++;
  }
}
{
  const timer = setTimeout;
  setTimeout = (fn) => { fn(); return 1; };
  const create = document.createElement;
  let icons = 0;
  document.createElement = function (tag) { if (tag === "ha-icon") icons++; return create.call(this, tag); };
  const warn = console.warn;
  const warned = [];
  console.warn = (m) => warned.push(m);
  for (let i = 0; i < 2; i++) {
    const ic = new CardClass();
    ic.setConfig({ items: [B({ icon: "mdi:no-such-icon" })] });
    ic.hass = { states: {} };
    drainMicrotasks();
  }
  setTimeout = timer;
  document.createElement = create;
  console.warn = warn;
  if (icons === 1 && warned.filter((m) => String(m).includes("no-such-icon")).length === 1) print("ok   a missing icon is looked up once, then skipped for a while");
  else {
    print(`FAIL missing icon: ${icons} lookups, ${warned.length} warnings`);
    failed++;
  }
}
{
  const sc = new CardClass();
  const before = sc.getCardSize();
  sc.setConfig({ items: [{ type: "device", id: "tall", at: [0, 0], size: [100, 1000] }] });
  sc.hass = { states: {} };
  const small = new CardClass();
  small.setConfig({ items: [{ type: "device", id: "flat", at: [0, 0], size: [1000, 40] }] });
  small.hass = { states: {} };
  const got = `${before} ${sc.getCardSize() > 10} ${small.getCardSize() < 10}`;
  if (got === "10 true true") print("ok   getCardSize follows the map height");
  else {
    print(`FAIL getCardSize: ${got} (${sc.getCardSize()}, ${small.getCardSize()})`);
    failed++;
  }
}
{
  const warn = console.warn;
  const warned = [];
  console.warn = (m) => warned.push(String(m));
  const mc = new CardClass();
  mc.setConfig({ items: [{ type: "chip", id: "c", at: [0, 0], image: "/local/missing.svg" }, { type: "chip", id: "c2", at: [20, 0], image: "/local/missing.svg" }] });
  mc.hass = { states: {} };
  for (const image of mc.shadowRoot.querySelectorAll("image")) image.dispatch("error", {});
  console.warn = warn;
  const hits = warned.filter((m) => m.includes("/local/missing.svg"));
  if (hits.length === 1) print("ok   a missing image is reported once");
  else {
    print(`FAIL missing image: ${hits.length} warnings`);
    failed++;
  }
}
{
  const warn = console.warn;
  const warned = [];
  console.warn = (m) => warned.push(String(m));
  storageWarned = false;
  window.localStorage = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
  storedOn("x");
  storeOn("x", true);
  storedGroups();
  delete window.localStorage;
  console.warn = warn;
  if (warned.filter((m) => m.includes("browser storage")).length === 1) print("ok   blocked storage is reported once");
  else {
    print(`FAIL blocked storage: ${warned.length} warnings`);
    failed++;
  }
}
delete window.localStorage;
const portCard = new CardClass();
portCard.setConfig({ items: [D({ items: [PS([P({ entity: "sensor.cam_link" })], { speed: "100Mbps" })] })] });
portCard.hass = { states: { "sensor.cam_link": { entity_id: "sensor.cam_link", state: "100", attributes: {} } } };
const portG = portCard.shadowRoot.querySelectorAll("g").find((g) => /\bport\b/.test(g.attrs.class || ""));
if (portG && /\bup\b/.test(portG.attrs.class)) print("ok   bare port speed 100 = 100 Mbps up");
else {
  print(`FAIL bare port speed: ${portG && portG.attrs.class}`);
  failed++;
}
const fadeCard = new CardClass();
fadeCard.setConfig({
  vlans: { WAN: "#2d4abe" },
  items: [D({ size: [40, 20] })],
  datalines: [L({ end_device: undefined, end_edge: undefined, start_edge: "top", points: [[20, -40]], vlans: ["WAN"], flow: "forward" })],
});
fadeCard.hass = { states: {} };
frames.splice(0).forEach((f) => f(500));
const fadePath = fadeCard.shadowRoot.querySelectorAll("path").find((p) => /\blnk\b/.test(p.attrs.class || ""));
if (fadePath && /url\(#hhm-fade-0\)/.test(fadePath.attrs.mask || "")) print("ok   open end line is masked to fade");
else {
  print(`FAIL open end mask: ${fadePath && fadePath.attrs.mask}`);
  failed++;
}
expect("status_map without entity", { items: [D({ status_map: { OL: "ok" } })] }, "items[0].status_map: has no effect without 'status_entity'");
expect(
  "status_map bad value",
  { items: [D({ status_entity: "sensor.ups", status_map: { OL: "green" } })] },
  "items[0].status_map.OL: expected ok, warn or down",
);
expect(
  "endpoint status",
  { items: [{ type: "endpoint", id: "e", at: [0, 0], icon: "mdi:tv", status_entity: "sensor.x" }] },
  "items[0].status_entity: unknown property",
);
{
  const frameCard = new CardClass();
  frameCard.setConfig({
    items: [
      D({ status_entity: "sensor.ups", status_map: { LB: "down", OB: "warn", OL: "ok" } }),
      D({ id: "b", at: [50, 0], status_entity: "sensor.cpu" }),
      D({ id: "c", at: [100, 0], status_entity: "sensor.gone" }),
    ],
  });
  const cls = (st) => {
    frameCard.hass = { states: st };
    return frameCard.shadowRoot.querySelectorAll("g").filter((g) => /\bdev\b/.test(g.attrs.class || "")).map((g) =>
      (g.attrs.class.match(/\b(warn|down)\b/) || ["ok"])[0]
    );
  };
  const mk = (ups, cpu) => ({
    "sensor.ups": { entity_id: "sensor.ups", state: ups, attributes: {} },
    "sensor.cpu": { entity_id: "sensor.cpu", state: cpu, attributes: {} },
  });
  const got = [cls(mk("OL CHRG", "5")), cls(mk("OB DISCHRG", "unavailable")), cls(mk("OB LB", "0")), cls(mk("BYPASS", "5"))].map((a) => a.join(",")).join(
    " | ",
  );
  const want = "ok,ok,down | warn,down,down | down,ok,down | warn,ok,down";
  if (got === want) print("ok   frame status (map words, first key wins, default rule, missing)");
  else {
    print(`FAIL frame status: ${got}`);
    failed++;
  }
}
expect("threshold both", { items: [B({ thresholds: [{ above: 1, below: 2, color: "red" }] })] }, "items[0].thresholds[0]: needs either 'above' or 'below'");
expect("threshold no color", { items: [B({ thresholds: [{ above: 1 }] })] }, "items[0].thresholds[0].color");
expect("threshold not number", { items: [B({ thresholds: [{ above: "80%", color: "red" }] })] }, "items[0].thresholds[0].above: expected a number");
expect("threshold unknown key", { items: [B({ thresholds: [{ over: 1, color: "red" }] })] }, "items[0].thresholds[0].over: unknown property");
{
  const tc = new CardClass();
  tc.setConfig({
    items: [
      B({ id: "t", entity: "sensor.t", icon: "none", thresholds: [{ above: 70, color: "orange" }, { above: 85, color: "red" }] }),
      B({ id: "bat", at: [0, 20], entity: "sensor.bat", icon: "none", thresholds: [{ below: 50, color: "orange" }, { below: 20, color: "#123456" }] }),
    ],
  });
  const fills = (t, bat) => {
    tc.hass = {
      states: { "sensor.t": { entity_id: "sensor.t", state: t, attributes: {} }, "sensor.bat": { entity_id: "sensor.bat", state: bat, attributes: {} } },
    };
    return tc.shadowRoot.querySelectorAll("text").filter((n) => /\bbtext\b/.test(n.attrs.class || "") && n.attrs.visibility !== "hidden").map((n) =>
      n.style._p.fill || "-"
    ).join(",");
  };
  const got = [fills("50", "80"), fills("70", "50"), fills("90", "20"), fills("unavailable", "x")].join(" | ");
  const want = "-,- | var(--warning-color, #ffa600),var(--warning-color, #ffa600) | var(--error-color, #db4437),#123456 | -,-";
  if (got === want) print("ok   thresholds colour (above/below, last wins, equal reaches, non-numeric)");
  else {
    print(`FAIL thresholds: ${got}`);
    failed++;
  }
}
expect(
  "ports bad states",
  { items: [D({ items: [PS([P()], { states: { recording: "green" } })] })] },
  "items[0].items[0].states.recording: expected one of active, warn, inactive, fault, disabled",
);
{
  const ids = ["p1", "p2", "p3", "p4", "p5", "p6", "p7"];
  const pc = new CardClass();
  pc.setConfig({
    items: [
      D({ size: [200, 20], items: [PS(ids.map((id, i) => P({ id, at: [i * 14, 0], entity: `binary_sensor.${id}` })))] }),
      PS([P({ id: "c1", entity: "sensor.c1" }), P({ id: "c2", at: [14, 0], entity: "sensor.c2" })], {
        id: "cams",
        at: [0, 40],
        states: { recording: "active", online: "warn", offline: "fault", empty: "inactive" },
      }),
      D({ id: "b", at: [300, 0] }),
    ],
    datalines: [
      L({ start_device: undefined, start_port: "p2", start_edge: "top" }),
      L({ id: "l2", start_device: undefined, start_port: "p6", start_edge: "top" }),
    ],
  });
  const mt = (enabled, status, rate, duplex, extra = {}) => ({
    state: status === "link-ok" ? "on" : "off",
    attributes: { enabled, status, rate, full_duplex: duplex, ...extra },
  });
  const st = {
    p1: mt(true, "no-link", "unknown", "unknown"),
    p2: mt(true, "no-link", "unknown", "unknown"),
    p3: mt(false, "no-link", "unknown", "unknown"),
    p4: mt(true, "link-ok", "1Gbps", 1),
    p5: mt(true, "link-ok", "100Mbps", 1),
    p6: mt(true, "link-ok", "1Gbps", 0, { link_partner_advertising: "100M-baseT-half,1G-baseT-full" }),
    p7: mt(true, "link-ok", "1Gbps", 1, { sfp_rx_loss: true }),
  };
  const states = {};
  for (const [id, v] of Object.entries(st)) states[`binary_sensor.${id}`] = { entity_id: `binary_sensor.${id}`, ...v };
  states["sensor.c1"] = { entity_id: "sensor.c1", state: "Recording", attributes: {} };
  states["sensor.c2"] = { entity_id: "sensor.c2", state: "offline", attributes: {} };
  pc.hass = { states };
  const got = pc.shadowRoot.querySelectorAll("g").filter((g) => /\bport\b/.test(g.attrs.class || "")).map((g) =>
    (g.attrs.class.match(/\b(up|slow|fault|disabled)\b/) || ["dim"])[0]
  ).join(",");
  const want = "dim,fault,disabled,up,slow,slow,fault,up,fault";
  pc.hass = {
    states: {
      ...states,
      "binary_sensor.p6": { entity_id: "binary_sensor.p6", ...mt(true, "link-ok", "1Gbps", 0, { link_partner_advertising: "1G-baseT-half" }) },
    },
  };
  if (got === want) print("ok   port states (no cable, cable expected, disabled, speed, duplex, sfp, states map)");
  else {
    print(`FAIL port states: ${got}`);
    failed++;
  }
  const p6 = pc.shadowRoot.querySelectorAll("g").filter((g) => /\bport\b/.test(g.attrs.class || ""))[5];
  if (!/\b(slow|fault)\b/.test(p6.attrs.class)) print("ok   half duplex on a half-only partner is not a warning");
  else {
    print(`FAIL half-only partner: ${p6.attrs.class}`);
    failed++;
  }
}
expect("pool no size", { items: [{ type: "pool", id: "p", at: [0, 0] }] }, "items[0].size: expected [width, height]");
expect(
  "pool thresholds without usage",
  { items: [{ type: "pool", id: "p", at: [0, 0], size: [40, 40], thresholds: [{ above: 80, color: "red" }] }] },
  "items[0].thresholds: has no effect without 'usage_entity'",
);
expect(
  "disk outside allowed",
  { items: [{ type: "endpoint", id: "e", at: [0, 0], items: [{ type: "hdd", id: "h", at: [0, 0] }] }] },
  "an endpoint can contain only: chip, label",
);
expect("pool child badge", { items: [{ type: "pool", id: "p", at: [0, 0], size: [40, 40], items: [B()] }] }, "a pool can contain only: hdd, ssd, bay");
expect("bay with temperature", { items: [{ type: "bay", id: "b", at: [0, 0], temperature: "sensor.t" }] }, "items[0].temperature: unknown property");
expect(
  "disk bad status map",
  { items: [{ type: "hdd", id: "h", at: [0, 0], status_entity: "binary_sensor.h", status_map: { on: "fine" } }] },
  "items[0].status_map.on: expected ok, warn or down",
);
{
  const sc = new CardClass();
  sc.setConfig({
    items: [D({
      size: [200, 80],
      items: [
        {
          type: "pool",
          id: "tank",
          at: [4, 4],
          size: [66, 48],
          label: "TANK",
          usage_entity: "sensor.use",
          status_entity: "sensor.zfs",
          status_map: { ONLINE: "ok", DEGRADED: "warn" },
          thresholds: [{ above: 80, color: "red" }],
          items: [{
            type: "hdd",
            id: "d1",
            at: [4, 4],
            temperature: "sensor.t1",
            status_entity: "binary_sensor.h1",
            thresholds: [{ above: 50, color: "orange" }],
          }, { type: "hdd", id: "d2", at: [35, 4], temperature: "sensor.t2", status_entity: "binary_sensor.h2" }],
        },
        { type: "ssd", id: "s1", at: [80, 8], temperature: "sensor.t3", status_entity: "binary_sensor.h3" },
        { type: "bay", id: "e1", at: [120, 8] },
      ],
    })],
  });
  const st = (o) => Object.fromEntries(Object.entries(o).map(([id, state]) => [id, { entity_id: id, state, attributes: {} }]));
  sc.hass = {
    states: st({
      "sensor.use": "85",
      "sensor.zfs": "DEGRADED",
      "sensor.t1": "55",
      "binary_sensor.h1": "on",
      "sensor.t2": "40",
      "binary_sensor.h2": "off",
      "sensor.t3": "38",
      "binary_sensor.h3": "on",
    }),
  };
  frames.splice(0).forEach((f) => f(700));
  const gs = sc.shadowRoot.querySelectorAll("g");
  const pool = gs.find((g) => /\bpool\b/.test(g.attrs.class || ""));
  const disks = gs.filter((g) => /\bdisk\b/.test(g.attrs.class || ""));
  const fill = pool.children.find((c) => c.attrs.class === "pfill");
  const temps = disks.map((g) => g.children.find((c) => c.attrs.class === "dtemp"));
  const got = [
    pool.attrs.class,
    fill.attrs.height,
    fill.style._p.fill ? "red" : "-",
    disks.map((g) => g.attrs.class).join("/"),
    temps.map((t) => (t ? `${t.textContent}${t.style._p.fill ? "!" : ""}` : "-")).join("/"),
  ].join(" | ");
  const want = "pool clickable warn | 39.1 | red | disk hdd clickable ok/disk hdd clickable down/disk ssd clickable ok/disk bay | 55°!/40°/38°/-";
  if (got === want) print("ok   pool fill/status/threshold, disk status/temperature/threshold, bay");
  else {
    print(`FAIL storage: ${got}`);
    failed++;
  }
}
expect("fanpanel at top", { items: [{ type: "fanpanel", id: "f", u: 1 }] }, "'fanpanel' must be inside a rack's items");
expect("fanpanel overflow", { items: [R([{ type: "fanpanel", id: "f", u: 4 }])] }, "U4–U5 does not fit in the 4U rack 'r'");
expect("fan bad range", { items: [{ type: "fan", id: "f", at: [0, 0], entity: "sensor.t", range: [30, 30] }] }, "items[0].range: expected [slow, fast]");
expect("fan range without entity", { items: [{ type: "fan", id: "f", at: [0, 0], range: [0, 100] }] }, "items[0].range: has no effect without 'entity'");
{
  const fc = new CardClass();
  fc.setConfig({
    items: [R([{ type: "fanpanel", id: "fp", u: 1, count: 3, entity: "sensor.temp", range: [27, 35] }]), {
      type: "fan",
      id: "f1",
      at: [400, 0],
      size: 30,
      entity: "sensor.rpm",
      range: [0, 3000],
      thresholds: [{ below: 500, color: "red" }],
    }],
  });
  const st = (t, rpm) => ({
    "sensor.temp": { entity_id: "sensor.temp", state: t, attributes: { unit_of_measurement: "°C" } },
    "sensor.rpm": { entity_id: "sensor.rpm", state: rpm, attributes: {} },
  });
  const info = () =>
    fc.shadowRoot.querySelectorAll("g").filter((g) => /\bfan-item\b/.test(g.attrs.class || "")).map((g) => {
      const rotors = g.children.filter((c) => c.attrs.class === "fan-rotor");
      return `${rotors.length}:${g.children.find((c) => c.tag === "title").textContent.split(" · ").pop()}:${rotors[0].style._p.fill ? "red" : "-"}`;
    }).join(" ");
  fc.hass = { states: st("31", "1500") };
  const a = info();
  fc.hass = { states: st("20", "0") };
  const b = info();
  fc.hass = { states: st("unavailable", "400") };
  const c = info();
  const got = [a, b, c].join(" | ");
  const want = "3:speed 50%:- 1:speed 50%:- | 3:speed 0%:- 1:stopped:red | 3:stopped (no reading):- 1:speed 13%:red";
  if (got === want) print("ok   fan speed mapping, stopped, no reading, thresholds");
  else {
    print(`FAIL fans: ${got}`);
    failed++;
  }
}
{
  const ic = new CardClass();
  ic.setConfig({ items: [B({ id: "bad", entity: "sensor.bad" }), B({ id: "good", at: [0, 40], entity: "sensor.good" })] });
  const states = { "sensor.good": { entity_id: "sensor.good", state: "21" } };
  Object.defineProperty(states, "sensor.bad", { enumerable: true, get: () => { throw new Error("broken entity"); } });
  const logged = [];
  const error = console.error;
  console.error = (...a) => logged.push(a.join(" "));
  ic.hass = { states };
  console.error = error;
  const texts = ic.shadowRoot.querySelectorAll("text").map((t) => t.textContent);
  const box = ic.shadowRoot.querySelectorAll("div").find((d) => d.attrs.class === "error");
  if (texts.includes("21") && !box && logged.length === 1) print("ok   one failing element does not stop the others");
  else {
    print(`FAIL update isolation: texts ${texts} error box ${Boolean(box)} logged ${logged.length}`);
    failed++;
  }
}
{
  const nc = new CardClass();
  nc.setConfig({ items: [{ type: "pool", id: "p", at: [0, 0], size: [80, 60], usage_entity: "sensor.used", items: [{ type: "hdd", id: "d", at: [4, 4], temperature: "sensor.temp" }] }] });
  nc.hass = { states: { "sensor.used": { entity_id: "sensor.used", state: "", attributes: {} }, "sensor.temp": { entity_id: "sensor.temp", state: "", attributes: {} } } };
  const titles = nc.shadowRoot.querySelectorAll("title").map((t) => t.textContent).join(" | ");
  const temps = nc.shadowRoot.querySelectorAll("text").map((t) => t.textContent).join(" ");
  const hatched = nc.shadowRoot.querySelectorAll("g").some((g) => /\bpool\b/.test(g.attrs.class || "") && /\bnodata\b/.test(g.attrs.class));
  if (hatched && titles.includes("usage —") && titles.includes("temperature —") && temps.includes("—") && !temps.includes("0°")) print("ok   empty states show — instead of 0");
  else {
    print(`FAIL empty states: ${titles} / ${temps}`);
    failed++;
  }
}
{
  const host = readFile(CARD).split("const STYLES = `")[1].split(":host {")[1].split("}")[0];
  const loops = [...host.matchAll(/(--[\w-]+):\s*([^;]+);/g)].filter(([, name, value]) => value.includes(`var(${name})`) || value.includes(`var(${name},`)).map(
    ([, name]) => name,
  );
  const undefinedRefs = [...host.matchAll(/var\((--hhm-[\w-]+)/g)].map((m) => m[1]).filter((name) => !new RegExp(`^\\s*${name}:`, "m").test(host));
  if (!loops.length && !undefinedRefs.length) print("ok   :host colour defaults resolve (no self-references)");
  else {
    print(`FAIL :host defaults: self ${loops} undefined ${undefinedRefs}`);
    failed++;
  }
}
print(`ok   canvas calls: ${calls}`);
print("ok   lifecycle (setConfig, hass, frames, update, disconnect)");
print(failed ? `${failed} FAILED` : "ALL PASSED");
