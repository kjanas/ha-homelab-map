const CARD_TYPE = "ha-homelab-map";
const VERSION = "0.101.14";

const RACK = Object.freeze({ unit: 32, width: Math.round((32 * 482.6) / 44.45), cap: 10, inset: 21 });
const BOX_RADIUS = 2;
const ENDPOINT = Object.freeze({ size: 32, pad: 4 });
const FAN = Object.freeze({ size: 24, count: 4, units: 2, blades: 7, minRps: 0.125, maxRps: 0.75, range: [0, 100] });
const DISK = Object.freeze({ size: [27, 36], spinSeconds: 2.4, sheen: 1.1, types: ["hdd", "ssd", "bay"] });
const DEFAULTS = Object.freeze({ lineRadius: 6, margin: 20, edgePoint: 50 });
const EDGES = ["top", "right", "bottom", "left"];
const POWER_COLOR = "#d9b945";

const DEVICE_TYPES = ["rack", "device", "rackdevice", "endpoint"];
const LABEL = Object.freeze({ size: 10, colors: { primary: "var(--hhm-text)", secondary: "var(--hhm-text-dim)" } });
const LED = Object.freeze({
  captionGap: 2.5,
  size: [3, 8],
  effects: ["flicker", "blink", "none"],
  on: [0.8, 3],
  off: [0.08, 0.2],
  blink: 0.5,
  dim: 0.55,
  dark: 0.3,
});
const UP_STATES = ["on", "true", "1", "running", "home", "ok"];
const UPDATE_STATES = ["on", "true", "1"];
const CHIP = Object.freeze({ size: 16, inner: 0.7, blinkSeconds: 1.6, small: 0.26, count: 0.36, smallAt: 0.72 });
const BADGE = Object.freeze({ size: 8, padX: 2, padY: 2, iconScale: 1.25 });
const BADGE_MAX = Object.freeze({ "": 99, "%": 100, "°C": 99, V: 999, Mbps: 999, ms: 999, W: 9999 });
const ITEM_KEYS = {
  rack: ["type", "id", "at", "units", "items"],
  device: ["type", "id", "at", "size", "status_entity", "status_map", "texture", "texture_opacity", "items"],
  rackdevice: ["type", "id", "u", "units", "status_entity", "status_map", "texture", "texture_opacity", "items"],
  endpoint: ["type", "id", "at", "icon", "items"],
  badge: ["type", "id", "at", "entity", "icon", "units", "decimals", "size", "show_border", "toggle", "thresholds"],
  chip: ["type", "id", "at", "size", "icon", "image", "small_image", "small_entity", "status_entity", "update_entity", "url"],
  led: ["type", "id", "at", "size", "vlan", "color", "entity", "effect", "caption"],
  label: ["type", "id", "at", "text", "size", "bold", "color", "vertical"],
  group: ["type", "id", "at", "items"],
  ports: ["type", "id", "at", "size", "speed", "icon", "states", "items"],
  pool: ["type", "id", "at", "size", "label", "usage_entity", "status_entity", "status_map", "thresholds", "items"],
  hdd: ["type", "id", "at", "size", "temperature", "status_entity", "status_map", "thresholds"],
  ssd: ["type", "id", "at", "size", "temperature", "status_entity", "status_map", "thresholds"],
  bay: ["type", "id", "at", "size"],
  fanpanel: ["type", "id", "u", "units", "count", "entity", "range", "thresholds", "texture", "texture_opacity"],
  fan: ["type", "id", "at", "size", "entity", "range", "thresholds"],
  port: ["type", "id", "at", "entity", "speed"],
};
const CHILD_TYPES = {
  top: ["rack", "device", "endpoint", "badge", "chip", "led", "label", "group", "ports", "pool", "hdd", "ssd", "bay", "fan"],
  rack: ["rackdevice", "device", "badge", "chip", "led", "label", "group", "ports", "pool", "hdd", "ssd", "bay", "fan", "fanpanel"],
  device: ["badge", "chip", "led", "label", "group", "ports", "pool", "hdd", "ssd", "bay", "fan"],
  rackdevice: ["badge", "chip", "led", "label", "group", "ports", "pool", "hdd", "ssd", "bay", "fan"],
  endpoint: ["chip", "label"],
  group: ["badge", "chip", "led", "label", "fan"],
  ports: ["port"],
  pool: ["hdd", "ssd", "bay"],
};
const ICON_PATHS = new Map();
const ICON_POLL = Object.freeze({ ms: 50, tries: 200 });
const TOGGLE_KEYS = {
  data: "ha-homelab-map:animate-vlans",
  power: "ha-homelab-map:animate-power",
  motion: "ha-homelab-map:animate",
  debug: "ha-homelab-map:debug",
};
const HIDDEN_GROUPS_KEY = "ha-homelab-map:hidden-groups";
const LINE_KEYS = ["id", "start_device", "start_port", "start_edge", "start_point", "end_device", "end_port", "end_edge", "end_point", "points", "flow"];
const PORT = Object.freeze({
  size: 12,
  speed: "1Gbps",
  icon: "mdi:ethernet",
  on: ["on", "true", "1"],
  off: ["off", "false", "0"],
  states: ["active", "warn", "inactive", "fault", "disabled"],
});
const SPEED_UNITS = { "": 1, k: 1e3, m: 1e6, g: 1e9 };
const DATALINE_KEYS = [...LINE_KEYS, "vlans", "status", "rx", "tx", "rates_at", "rates_placement", "rates_size"];
const RATES = Object.freeze({ size: 8, gap: 3, lineGap: 1.15, placements: ["middle", "above", "below"] });
const CARD_KEYS = [
  "type",
  "line_radius",
  "vlans",
  "font",
  "look",
  "background",
  "scale",
  "fit_viewport",
  "debug",
  "vlan_toggle",
  "power_toggle",
  "animation_toggle",
  "debug_toggle",
  "toggles_at",
  "items",
  "datalines",
  "powerlines",
  "view_layout",
  "grid_options",
];

const DOWN_STATES = new Set(["unavailable", "unknown", "off", "down", "offline", "disconnected", "not_home"]);
const FRAME_STATES = ["ok", "warn", "down"];
const THRESHOLD_COLORS = Object.freeze({
  red: "var(--error-color, #db4437)",
  orange: "var(--warning-color, #ffa600)",
  yellow: "#fdd835",
  green: "var(--success-color, #43a047)",
});

const LOOKS = ["flat", "depth"];
const SHADE = { fill: "#000", "fill-opacity": 0.38 };
const SHINE = { fill: "#fff", "fill-opacity": 0.05 };
const TEXTURES = Object.freeze({
  hex: {
    w: 9,
    h: 15.588,
    marks: [["path", {
      d: "M4.5 0L9 2.598V7.794L4.5 10.392L0 7.794V2.598ZM4.5 10.392V15.588",
      fill: "none",
      stroke: "#000",
      "stroke-opacity": 0.55,
      "stroke-width": 1.1,
    }]],
  },
  mesh: { w: 6, h: 6, marks: [["circle", { cx: 3, cy: 3, r: 1.6, fill: "#000", "fill-opacity": 0.5 }]] },
  slots: { w: 10, h: 7, marks: [["rect", { x: 1, y: 2, width: 8, height: 2.4, rx: 1.2, fill: "#000", "fill-opacity": 0.5 }]] },
  grille: { w: 5, h: 5, rotate: 45, marks: [["rect", { width: 2, height: 5, fill: "#000", "fill-opacity": 0.4 }]] },
  carbon: {
    w: 8,
    h: 8,
    marks: [["rect", { width: 4, height: 4, ...SHINE }], ["rect", { x: 4, width: 4, height: 4, ...SHADE }], ["rect", { y: 4, width: 4, height: 4, ...SHADE }], [
      "rect",
      { x: 4, y: 4, width: 4, height: 4, ...SHINE },
    ]],
  },
  ribbed: {
    w: 4,
    h: 4,
    marks: [["rect", { width: 4, height: 2, fill: "#000", "fill-opacity": 0.35 }], ["rect", {
      y: 2,
      width: 4,
      height: 0.6,
      fill: "#fff",
      "fill-opacity": 0.06,
    }]],
  },
  brushed: { gradient: [[0, 0.02], [0.3, 0.1], [0.55, 0.03], [0.8, 0.09], [1, 0.02]] },
  glass: { vertical: true, gradient: [[0, 0.16], [0.47, 0.06], [0.48, 0], [1, 0.05]] },
  tpl: { w: 4, h: 4, tint: ["#0f3a3c", 0.35], accent: "#1fb6b0", marks: [["circle", { cx: 2, cy: 2, r: 0.7, fill: "#000", "fill-opacity": 0.45 }]] },
  mtk: {
    w: 6,
    h: 14,
    tint: ["#13284a", 0.35],
    accent: "#3a7bd5",
    marks: [["rect", { x: 2, y: 2, width: 2, height: 10, rx: 1, fill: "#000", "fill-opacity": 0.45 }]],
  },
  dll: {
    w: 6,
    h: 6,
    tint: ["#0a1a2a", 0.3],
    accent: "#0076ce",
    marks: [["path", { d: "M3 0.9L5.1 3L3 5.1L0.9 3Z", fill: "#000", "fill-opacity": 0.5 }]],
  },
  hpe: {
    w: 5,
    h: 5,
    tint: ["#ffffff", 0.05],
    accent: "#01a982",
    marks: [["rect", { x: 1, y: 1, width: 3, height: 3, rx: 0.4, fill: "#000", "fill-opacity": 0.5 }]],
  },
  unf: {
    w: 6,
    h: 10.392,
    tint: ["#ffffff", 0.07],
    accent: "#006fff",
    marks: [["circle", { cx: 3, cy: 2.598, r: 1.3, fill: "#000", "fill-opacity": 0.45 }], ["circle", {
      cx: 0,
      cy: 7.794,
      r: 1.3,
      fill: "#000",
      "fill-opacity": 0.45,
    }], [
      "circle",
      { cx: 6, cy: 7.794, r: 1.3, fill: "#000", "fill-opacity": 0.45 },
    ]],
  },
});
const BACKGROUNDS = ["none", "blueprint", "pegboard", "vignette"];
const isColor = (value) => typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);
const isImageUrl = (value) => typeof value === "string" && /^(\/|https?:\/\/)\S+$/.test(value);
const DEPTH = Object.freeze({ big: { dy: 2.2, blur: 2.2, alpha: 0.55 }, small: { dy: 1, blur: 0.9, alpha: 0.5 } });
const ZOOM = Object.freeze({ maxPx: 4, step: 2.5, tapMs: 320, tapPx: 30, dragPx: 6, compactWidth: 520 });
const FX = Object.freeze({ fps: 30, period: 18, lineWidth: 1.2 });
const NO_DASH = Object.freeze([]);
const FADE = Object.freeze({ half: 6 });
const BUNDLED_FONTS = Object.freeze({ "JetBrains Mono": "JetBrainsMono" });

const STYLES = `
  :host {
    display: block;
    --hhm-bg: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    --hhm-frame: var(--secondary-background-color, #282828);
    --hhm-frame-border: var(--divider-color, rgba(225,225,225,.12));
    --hhm-text: var(--primary-text-color, #e1e1e1);
    --hhm-text-dim: var(--secondary-text-color, #9b9b9b);
    --hhm-badge: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    --hhm-badge-border: var(--divider-color, rgba(225,225,225,.12));
    --hhm-chip: #2f3540;
    --hhm-accent: var(--primary-color, #03a9f4);
    --hhm-rail: var(--divider-color, rgba(225,225,225,.12));
  }
  ha-card { background: var(--hhm-bg); padding: 8px; overflow: hidden; font-family: var(--hhm-font, var(--ha-font-family-body, inherit)); }
  .view { position: relative; user-select: none; -webkit-user-select: none; }
  .scroller { position: relative; overflow: hidden; touch-action: pan-y; scrollbar-width: none; }
  .scroller::-webkit-scrollbar { display: none; }
  .scroller.zoomed { overflow: auto; touch-action: none; cursor: grab; }
  .scroller.panning { cursor: grabbing; }
  .stage { position: relative; width: fit-content; margin: 0 auto; }
  svg { display: block; height: auto; }
  .fx { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; will-change: transform; }
  .zoom-reset { position: absolute; bottom: 6px; right: 6px; z-index: 4; display: none; width: 28px; height: 28px; border: 1px solid var(--hhm-frame-border); border-radius: 6px; background: var(--hhm-bg); color: var(--hhm-text-dim); font: 16px/1 sans-serif; cursor: pointer; }
  .view.zoomed .zoom-reset { display: block; }
  .toggle-menu { display: none; width: 28px; height: 28px; border: 1px solid var(--hhm-frame-border); border-radius: 6px; background: var(--hhm-bg); color: var(--hhm-text-dim); font: 16px/1 sans-serif; cursor: pointer; padding: 0; }
  .toggles.compact .toggle-menu { display: block; }
  .toggles.compact { align-items: flex-end; }
  .toggles.placed { right: auto; }
  .toggles.compact.placed { align-items: flex-start; }
  .toggles.compact:not(.open) { padding: 0; border: none; background: none; }
  .toggles.compact:not(.open) .toggle { display: none; }
  .cab { fill: var(--hhm-frame); fill-opacity: .55; stroke: var(--hhm-frame-border); stroke-width: 2; }
  .rail { fill: var(--hhm-rail); }
  .hole { fill: var(--hhm-bg); }
  .ulabel { font-size: 10px; fill: var(--hhm-text-dim); font-variant-numeric: tabular-nums; }
  .frame { fill: var(--hhm-frame); stroke: var(--hhm-frame-border); stroke-width: 1.4; transition: stroke .3s; }
  .dev.warn > .frame { stroke: var(--warning-color, #ffa600); }
  .dev.down > .frame { stroke: var(--error-color, #db4437); }
  .mdi { fill: var(--hhm-text-dim); }
  .chip-bg, .chip-small { fill: var(--hhm-chip); }
  .chip-small { stroke: var(--hhm-bg); stroke-width: 1; }
  .chip-count { fill: var(--hhm-text); font-weight: 700; font-variant-numeric: tabular-nums; }
  .port .mdi { fill: color-mix(in srgb, var(--hhm-text-dim) 40%, var(--hhm-bg)); }
  .port.up .mdi { fill: color-mix(in srgb, var(--hhm-text) 92%, var(--hhm-bg)); }
  .port.slow .mdi { fill: var(--warning-color, #ffa600); }
  .port.fault .mdi { fill: var(--error-color, #db4437); }
  .pool .pfill { fill: color-mix(in srgb, var(--hhm-text-dim) 22%, var(--hhm-bg)); }
  .pool .pbox { fill: none; stroke: var(--hhm-frame-border); stroke-width: 1.2; transition: stroke .3s; }
  .pool.warn .pbox { stroke: var(--warning-color, #ffa600); }
  .pool.down .pbox { stroke: var(--error-color, #db4437); }
  .pool .plabel-bg { fill: var(--hhm-bg); stroke: var(--hhm-frame-border); stroke-width: .8; }
  .pool .plabel { font-size: 7px; font-weight: 700; fill: var(--hhm-text-dim); }
  .disk .dbody { fill: color-mix(in srgb, var(--hhm-text-dim) 18%, var(--hhm-bg)); stroke: var(--hhm-frame-border); stroke-width: .8; }
  .disk.down .dbody { stroke: var(--error-color, #db4437); }
  .disk .dtemp { fill: var(--hhm-text); font-variant-numeric: tabular-nums; }
  .disk .dled { fill: color-mix(in srgb, var(--hhm-text-dim) 30%, var(--hhm-bg)); }
  .disk.ok .dled { fill: var(--success-color, #43a047); }
  .disk.warn .dled { fill: var(--warning-color, #ffa600); }
  .disk.down .dled { fill: var(--error-color, #db4437); }
  .disk .hdd-hub { fill: color-mix(in srgb, var(--hhm-text-dim) 35%, var(--hhm-bg)); }
  .disk .ssd-board { fill: color-mix(in srgb, #2e7d32 35%, var(--hhm-bg)); }
  .disk .ssd-chip { fill: color-mix(in srgb, var(--hhm-text-dim) 45%, var(--hhm-bg)); }
  .bay .dbody { fill: none; stroke: color-mix(in srgb, var(--hhm-text-dim) 45%, var(--hhm-bg)); stroke-dasharray: 2 2; }
  .led-caption { font-size: 8px; fill: var(--hhm-text-dim); }
  .fan-hole { fill: color-mix(in srgb, #000000 10%, var(--hhm-bg)); stroke: color-mix(in srgb, var(--hhm-text-dim) 12%, var(--hhm-bg)); stroke-width: 1; }
  .fan-screw { fill: color-mix(in srgb, #000000 25%, var(--hhm-bg)); stroke: color-mix(in srgb, var(--hhm-text-dim) 25%, var(--hhm-bg)); stroke-width: .6; }
  .fan-rotor { fill: color-mix(in srgb, var(--hhm-text-dim) 7%, var(--hhm-bg)); }
  .fan-hub { fill: color-mix(in srgb, var(--hhm-text-dim) 11%, var(--hhm-bg)); }
  .port-x { display: none; stroke: color-mix(in srgb, var(--hhm-text-dim) 70%, var(--hhm-bg)); stroke-linecap: round; }
  .port.disabled .port-x { display: inline; }
  .icon-loader { position: absolute; width: 0; height: 0; overflow: hidden; visibility: hidden; }
  .lnk { fill: none; stroke: color-mix(in srgb, var(--hhm-text-dim) 55%, var(--hhm-bg)); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: stroke .3s; }
  .lnk.power { stroke: color-mix(in srgb, #666666 90%, var(--hhm-bg)); }
  .lnk.down { stroke: color-mix(in srgb, var(--error-color, #db4437) 70%, var(--hhm-bg)); stroke-dasharray: 2 6; }
  .lnk.bare { stroke: none; }
  .rates { fill: var(--hhm-text-dim); font-variant-numeric: tabular-nums; }
  .stage.still-data .lnk.data:not(.down) { stroke: color-mix(in srgb, var(--hhm-text-dim) 35%, var(--hhm-bg)); }
  .stage.still-power .lnk.power { stroke: color-mix(in srgb, #666666 35%, var(--hhm-bg)); }
  .toggles { position: absolute; top: 6px; right: 6px; z-index: 4; display: flex; flex-direction: column; gap: 6px; padding: 7px 9px; border-radius: 6px; background: var(--hhm-badge); border: 1px solid var(--hhm-frame-border); }
  .toggle { display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; font-size: 10px; color: var(--hhm-text); }
  .toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
  .toggle .track { position: relative; width: 26px; height: 14px; border-radius: 7px; background: color-mix(in srgb, var(--hhm-text-dim) 40%, var(--hhm-badge)); transition: background .2s; }
  .toggle .track::after { content: ""; position: absolute; top: 2px; left: 2px; width: 10px; height: 10px; border-radius: 50%; background: var(--hhm-text); transition: transform .2s; }
  .toggle input:checked + .track { background: var(--hhm-accent); }
  .toggle input:checked + .track::after { transform: translateX(12px); }
  .toggle input:focus-visible + .track { outline: 2px solid var(--hhm-accent); outline-offset: 2px; }
  .badge .bframe { fill: var(--hhm-badge); stroke: var(--hhm-badge-border); stroke-width: 1; }
  .badge .btext { fill: var(--hhm-text); font-variant-numeric: tabular-nums; }
  .clickable { cursor: pointer; }
  .depth .rail { fill: url(#hhm-rail); }
  .depth .hole { fill: color-mix(in srgb, #000000 45%, var(--hhm-bg)); }
  .bg-line { fill: none; stroke: color-mix(in srgb, #6c9cda 22%, var(--hhm-bg)); stroke-width: .8; }
  .bg-fine { fill: none; stroke: color-mix(in srgb, #6c9cda 10%, var(--hhm-bg)); stroke-width: .5; }
  .bg-dot { fill: color-mix(in srgb, var(--hhm-text) 13%, var(--hhm-bg)); }
  .lift { fill: url(#hhm-lift); stroke: none; pointer-events: none; }
  .dbg-grid, .dbg-box { pointer-events: none; }
  .dbg-box { fill: none; stroke: #ff4081; stroke-width: .6; stroke-dasharray: 2 2; }
  .dbg-tip { position: absolute; z-index: 5; pointer-events: none; padding: 2px 6px; border-radius: 4px; background: rgba(0,0,0,.8); color: #fff; font: 11px/1.4 var(--hhm-font, monospace); white-space: pre; display: none; }
`;

const SVG_NS = "http://www.w3.org/2000/svg";

const svgEl = (tag, attrs = {}, parent = null) => {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== undefined && value !== null) node.setAttribute(key, value);
  }
  if (parent) parent.appendChild(node);
  return node;
};

const htmlEl = (tag, className, parent = null) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (parent) parent.appendChild(node);
  return node;
};

const isNum = (value) => typeof value === "number" && Number.isFinite(value);
const isPair = (value) => Array.isArray(value) && value.length === 2 && value.every(isNum);
const isEntity = (value) => typeof value === "string" && /^[a-z_]+\.[a-z0-9_]+$/.test(value);
const isBinarySensor = (value) => typeof value === "string" && /^binary_sensor\.[a-z0-9_]+$/.test(value);
const parseSpeed = (value) => {
  const match = /^\s*(\d+(?:\.\d+)?)\s*([kmg]?)(?:bps|bit\/s|b\/s)\s*$/i.exec(String(value ?? ""));
  return match ? Number(match[1]) * SPEED_UNITS[match[2].toLowerCase()] : NaN;
};
const isMdi = (value) => typeof value === "string" && /^mdi:[a-z0-9-]+$/.test(value);
const isSize = (value) => isNum(value) && value > 0;
const isBox = (value) => isPair(value) && value[0] > 0 && value[1] > 0;
const HIDDEN = (value) => value === false || value === null || value === "none";
const isUpState = (state) => Boolean(state) && UP_STATES.includes(String(state.state).toLowerCase());

const textLength = (node) => {
  try {
    return node.getComputedTextLength();
  } catch {
    return 0;
  }
};

const storedGroups = () => {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(HIDDEN_GROUPS_KEY) || "[]"));
  } catch {
    return new Set();
  }
};

const storeGroups = (ids) => {
  try {
    window.localStorage.setItem(HIDDEN_GROUPS_KEY, JSON.stringify([...ids]));
  } catch {
    return;
  }
};

const storedOn = (key, fallback = true) => {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value !== "0";
  } catch {
    return fallback;
  }
};

const storeOn = (key, on) => {
  try {
    window.localStorage.setItem(key, on ? "1" : "0");
  } catch {
    return;
  }
};

const toNumber = (state) => (state && state.state !== "" ? Number(state.state) : NaN);
const orZero = (value) => (Number.isNaN(value) ? 0 : value);

const RATE_UNITS = {
  "bit/s": 1 / 8000,
  bps: 1 / 8000,
  "kbit/s": 1 / 8,
  kbps: 1 / 8,
  "Mbit/s": 125,
  mbps: 125,
  "Gbit/s": 125000,
  gbps: 125000,
  "B/s": 0.001,
  "kB/s": 1,
  "KB/s": 1,
  "MB/s": 1000,
  "GB/s": 1e6,
  "KiB/s": 1.024,
  "MiB/s": 1048.576,
  "GiB/s": 1073741.824,
};

const toKBps = (state) => {
  const value = toNumber(state);
  const unit = state?.attributes?.unit_of_measurement;
  return value * (RATE_UNITS[unit] ?? RATE_UNITS[String(unit).toLowerCase()] ?? 1);
};

const formatRate = (kBps) => {
  const kbps = Math.max(0, kBps * 8);
  if (kbps >= 1e6) return `${(kbps / 1e6).toFixed(1)}G`;
  if (kbps >= 1000) return `${(kbps / 1000).toFixed(1)}M`;
  return `${kbps.toFixed(1)}k`;
};

const pointAlong = (pts, fraction) => {
  const segs = pts.slice(1).map((b, i) => ({ a: pts[i], b, len: Math.hypot(b[0] - pts[i][0], b[1] - pts[i][1]) })).filter((sg) => sg.len > 0);
  const total = segs.reduce((sum, sg) => sum + sg.len, 0);
  let left = Math.max(0, Math.min(1, fraction)) * total;
  for (const sg of segs) {
    if (left <= sg.len || sg === segs[segs.length - 1]) {
      const k = Math.min(1, left / sg.len);
      const dir = [(sg.b[0] - sg.a[0]) / sg.len, (sg.b[1] - sg.a[1]) / sg.len];
      return { at: [sg.a[0] + (sg.b[0] - sg.a[0]) * k, sg.a[1] + (sg.b[1] - sg.a[1]) * k], dir };
    }
    left -= sg.len;
  }
  return { at: pts[0], dir: [1, 0] };
};

const flowSeconds = (traffic, metered) => (metered ? Math.max(0.35, Math.min(4, 4 - Math.log10(1 + traffic) * 0.9)) : 2.4);

const roundedPath = (pts, radius) => {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [cx, cy] = pts[i];
    const a = [pts[i - 1][0] - cx, pts[i - 1][1] - cy];
    const b = [pts[i + 1][0] - cx, pts[i + 1][1] - cy];
    const la = Math.hypot(...a);
    const lb = Math.hypot(...b);
    if (!la || !lb) continue;
    const cos = Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1]) / (la * lb)));
    const theta = Math.acos(cos);
    if (theta > Math.PI - 1e-3 || radius <= 0) {
      d += `L${cx},${cy}`;
      continue;
    }
    const tanHalf = Math.tan(theta / 2);
    const t = Math.min(radius / tanHalf, la / 2, lb / 2);
    const r = t * tanHalf;
    const p1 = [cx + (a[0] / la) * t, cy + (a[1] / la) * t];
    const p2 = [cx + (b[0] / lb) * t, cy + (b[1] / lb) * t];
    const sweep = -a[0] * b[1] + a[1] * b[0] > 0 ? 1 : 0;
    d += `L${p1[0]},${p1[1]}A${r},${r} 0 0 ${sweep} ${p2[0]},${p2[1]}`;
  }
  const end = pts[pts.length - 1];
  return `${d}L${end[0]},${end[1]}`;
};

const edgeAnchor = (box, edge, percent) => {
  const k = (percent ?? DEFAULTS.edgePoint) / 100;
  if (edge === "top") return [box.x + box.w * k, box.y];
  if (edge === "bottom") return [box.x + box.w * k, box.y + box.h];
  if (edge === "left") return [box.x, box.y + box.h * k];
  return [box.x + box.w, box.y + box.h * k];
};

const randomIn = ([min, max]) => min + Math.random() * (max - min);

const fanBlades = (cx, cy, r) => {
  const ri = r * 0.3;
  const at = (radius, angle) => `${(cx + radius * Math.cos(angle)).toFixed(2)} ${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  let d = "";
  for (let k = 0; k < FAN.blades; k++) {
    const a = (k * 2 * Math.PI) / FAN.blades;
    d += `M${at(ri, a)}Q${at((ri + r) / 2, a + 0.02)} ${at(r, a + 0.3)}A${r} ${r} 0 0 1 ${at(r, a + 0.78)}Q${at((ri + r) / 2, a + 0.55)} ${
      at(ri, a + 0.42)
    }A${ri} ${ri} 0 0 0 ${at(ri, a)}Z`;
  }
  return d;
};

const fadeBand = ([ax, ay], [bx, by]) => {
  const len = Math.hypot(bx - ax, by - ay) || 1;
  const [nx, ny] = [((ay - by) / len) * FADE.half, ((bx - ax) / len) * FADE.half];
  const [ex, ey] = [bx + ((bx - ax) / len) * FADE.half, by + ((by - ay) / len) * FADE.half];
  return { from: [ax, ay], to: [bx, by], band: [[ax + nx, ay + ny], [ex + nx, ey + ny], [ex - nx, ey - ny], [ax - nx, ay - ny]] };
};

const toRgb = (color) => {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color || "");
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, (c) => c + c) : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(color || "");
  return rgb ? rgb.slice(1, 4).map(Number) : null;
};

const mixColor = (color, background, amount) => {
  const a = toRgb(color);
  const b = toRgb(background);
  if (!a || !b) return color;
  return `rgb(${a.map((v, i) => Math.round(v * amount + b[i] * (1 - amount))).join(",")})`;
};

const resolveColor = (value, host) => {
  const match = /^var\((--[\w-]+)\s*(?:,\s*(.+))?\)$/.exec(value || "");
  if (!match) return value;
  const own = host && typeof getComputedStyle === "function" ? getComputedStyle(host).getPropertyValue(match[1]).trim() : "";
  return own || (match[2] ? resolveColor(match[2].trim(), host) : "#888");
};

const reducedMotion = () => Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

const fail = (path, message) => {
  throw new Error(`${CARD_TYPE}: ${path}: ${message}`);
};

const checkKeys = (obj, allowed, path) => {
  for (const key of Object.keys(obj)) if (!allowed.includes(key)) fail(`${path}.${key}`, `unknown property – allowed: ${allowed.join(", ")}`);
};

const validateStatus = (item, path) => {
  if (item.status_entity !== undefined && !isEntity(item.status_entity)) fail(`${path}.status_entity`, "expected an entity id");
  if (item.status_map === undefined) return;
  if (item.status_entity === undefined) fail(`${path}.status_map`, "has no effect without 'status_entity'");
  if (!item.status_map || typeof item.status_map !== "object" || Array.isArray(item.status_map)) {
    fail(`${path}.status_map`, "expected a map of state: ok | warn | down");
  }
  for (const [key, value] of Object.entries(item.status_map)) {
    if (!FRAME_STATES.includes(value)) fail(`${path}.status_map.${key}`, "expected ok, warn or down");
  }
};

const validateThresholds = (list, path) => {
  if (!Array.isArray(list) || !list.length) fail(path, "expected a list such as [{above: 85, color: red}]");
  list.forEach((t, i) => {
    const at = `${path}[${i}]`;
    if (!t || typeof t !== "object" || Array.isArray(t)) fail(at, "expected {above: number, color: …} or {below: number, color: …}");
    checkKeys(t, ["above", "below", "color"], at);
    if ((t.above === undefined) === (t.below === undefined)) fail(at, "needs either 'above' or 'below'");
    const limit = t.above ?? t.below;
    if (!isNum(limit)) fail(`${at}.${t.above !== undefined ? "above" : "below"}`, "expected a number");
    if (typeof t.color !== "string" || !t.color.trim()) fail(`${at}.color`, 'expected red, orange, yellow, green or a colour such as "#e91e63"');
  });
};

const validateItem = (item, path, parent, ctx) => {
  if (!item || typeof item !== "object") fail(path, "expected an item");
  const parentType = parent ? parent.type : "top";
  const allowed = CHILD_TYPES[parentType];
  if (!ITEM_KEYS[item.type]) fail(`${path}.type`, `expected one of ${Object.keys(ITEM_KEYS).join(", ")}`);
  if (!allowed.includes(item.type)) {
    fail(
      `${path}.type`,
      parent
        ? `${/^[aeiou]/.test(parentType) ? "an" : "a"} ${parentType} can contain only: ${allowed.join(", ")}`
        : `'${item.type}' must be inside a rack's items`,
    );
  }
  checkKeys(item, ITEM_KEYS[item.type], path);
  if (typeof item.id !== "string" || !item.id) fail(`${path}.id`, "required");
  if (ctx.ids.has(item.id)) fail(`${path}.id`, `duplicate id '${item.id}'`);
  ctx.ids.add(item.id);
  if (!["rackdevice", "fanpanel"].includes(item.type) && !isPair(item.at)) fail(`${path}.at`, "expected [x, y]");
  if (item.type === "rack" && !(Number.isInteger(item.units) && item.units >= 1)) fail(`${path}.units`, "expected a whole number of U");
  if (item.type === "device" && !isBox(item.size)) fail(`${path}.size`, "expected [width, height]");
  if (item.type === "endpoint") {
    if (item.icon !== undefined && !isMdi(item.icon)) fail(`${path}.icon`, "expected an mdi icon such as mdi:television");
  }
  if (item.type === "rackdevice" || item.type === "fanpanel") {
    const units = item.units ?? (item.type === "fanpanel" ? FAN.units : 1);
    if (!Number.isInteger(item.u) || item.u < 1) fail(`${path}.u`, "expected a whole number from 1");
    if (!Number.isInteger(units) || units < 1) fail(`${path}.units`, "expected a whole number from 1");
    if (item.u + units - 1 > parent.units) fail(`${path}.u`, `U${item.u}–U${item.u + units - 1} does not fit in the ${parent.units}U rack '${parent.id}'`);
  }
  if (item.type === "fanpanel" || item.type === "fan") {
    if (item.type === "fanpanel" && item.count !== undefined && !(Number.isInteger(item.count) && item.count >= 1)) {
      fail(`${path}.count`, "expected a whole number from 1");
    }
    if (item.type === "fan" && item.size !== undefined && !isSize(item.size)) fail(`${path}.size`, "expected a size in px");
    if (item.entity !== undefined && !isEntity(item.entity)) fail(`${path}.entity`, "expected an entity id");
    if (item.range !== undefined && !(Array.isArray(item.range) && item.range.length === 2 && item.range.every(isNum) && item.range[0] !== item.range[1])) {
      fail(`${path}.range`, "expected [slow, fast] – two different numbers such as [27, 35]");
    }
    if (item.range !== undefined && item.entity === undefined) fail(`${path}.range`, "has no effect without 'entity'");
    if (item.thresholds !== undefined && item.entity === undefined) fail(`${path}.thresholds`, "has no effect without 'entity'");
  }
  if (item.type === "badge") {
    if (!isEntity(item.entity)) fail(`${path}.entity`, "expected an entity id");
    if (!("icon" in item)) fail(`${path}.icon`, "required – an mdi icon such as mdi:thermometer, or none");
    if (!HIDDEN(item.icon) && !isMdi(item.icon)) fail(`${path}.icon`, "expected an mdi icon such as mdi:thermometer, or none");
    if (item.units !== undefined && item.units !== true && !HIDDEN(item.units) && typeof item.units !== "string") {
      fail(`${path}.units`, "expected true, none or your own text");
    }
    if (item.decimals !== undefined && !(Number.isInteger(item.decimals) && item.decimals >= 0)) fail(`${path}.decimals`, "expected a whole number from 0");
    if (item.size !== undefined && !isSize(item.size)) fail(`${path}.size`, "expected a font size in px");
    if (item.show_border !== undefined && typeof item.show_border !== "boolean") fail(`${path}.show_border`, "expected true or false");
  }
  if (item.type === "label") {
    if (typeof item.text !== "string" && typeof item.text !== "number") fail(`${path}.text`, "required – the text to show");
    if (item.size !== undefined && !isSize(item.size)) fail(`${path}.size`, "expected a font size in px");
    if (item.color !== undefined && typeof item.color !== "string") fail(`${path}.color`, 'expected primary, secondary or a colour such as "#d26066"');
    for (const key of ["bold", "vertical"]) if (item[key] !== undefined && typeof item[key] !== "boolean") fail(`${path}.${key}`, "expected true or false");
  }
  if (item.type === "led") {
    if (item.size !== undefined && !isBox(item.size)) fail(`${path}.size`, "expected [width, height] in px");
    if (Boolean(item.vlan) === Boolean(item.color)) fail(path, "a led needs either 'vlan' or 'color'");
    if (item.caption !== undefined) {
      if (typeof item.caption !== "string" && typeof item.caption !== "number") fail(`${path}.caption`, "expected a text");
      if (item.size === undefined) fail(`${path}.caption`, "needs 'size' – captions are shown only on LEDs with an explicit size");
    }
    if (item.vlan !== undefined && !ctx.vlans[item.vlan]) fail(`${path}.vlan`, `unknown VLAN '${item.vlan}' – add it to the card's 'vlans'`);
    if (item.color !== undefined && typeof item.color !== "string") fail(`${path}.color`, 'expected a colour such as "#66b771"');
    if (item.entity !== undefined && !isEntity(item.entity)) fail(`${path}.entity`, "expected an entity id");
    if (item.effect !== undefined && !LED.effects.includes(item.effect)) fail(`${path}.effect`, `expected one of ${LED.effects.join(", ")}`);
  }
  if (["device", "rackdevice", "pool", "hdd", "ssd"].includes(item.type)) validateStatus(item, path);
  if (item.texture !== undefined && !TEXTURES[item.texture]) fail(`${path}.texture`, `expected one of ${Object.keys(TEXTURES).join(", ")}`);
  if (item.texture_opacity !== undefined) {
    if (!(isNum(item.texture_opacity) && item.texture_opacity >= 0 && item.texture_opacity <= 1)) {
      fail(`${path}.texture_opacity`, "expected a number from 0 to 1");
    }
    if (item.texture === undefined) fail(`${path}.texture_opacity`, "has no effect without 'texture'");
  }
  if (item.type === "pool") {
    if (!isBox(item.size)) fail(`${path}.size`, "expected [width, height]");
    if (item.label !== undefined && typeof item.label !== "string" && typeof item.label !== "number") fail(`${path}.label`, "expected a text");
    if (item.usage_entity !== undefined && !isEntity(item.usage_entity)) fail(`${path}.usage_entity`, "expected an entity id");
    if (item.thresholds !== undefined && item.usage_entity === undefined) fail(`${path}.thresholds`, "has no effect without 'usage_entity'");
  }
  if (DISK.types.includes(item.type)) {
    if (item.size !== undefined && !isBox(item.size)) fail(`${path}.size`, "expected [width, height]");
    if (item.temperature !== undefined && !isEntity(item.temperature)) fail(`${path}.temperature`, "expected an entity id");
    if (item.thresholds !== undefined && item.temperature === undefined) fail(`${path}.thresholds`, "has no effect without 'temperature'");
  }
  if (["badge", "pool", "hdd", "ssd", "fanpanel", "fan"].includes(item.type) && item.thresholds !== undefined) {
    validateThresholds(item.thresholds, `${path}.thresholds`);
  }
  if (item.type === "chip") {
    if (item.size !== undefined && !isSize(item.size)) fail(`${path}.size`, "expected a diameter in px");
    if (Boolean(item.icon) === Boolean(item.image)) fail(path, "a chip needs either 'icon' or 'image'");
    if (item.icon !== undefined && !isMdi(item.icon)) fail(`${path}.icon`, "expected an mdi icon such as mdi:docker");
    if (item.small_image !== undefined && typeof item.small_image !== "string") fail(`${path}.small_image`, "expected an image URL");
    if (item.small_image !== undefined && item.small_entity !== undefined) fail(path, "a chip can have 'small_image' or 'small_entity', not both");
    for (const key of ["small_entity", "status_entity", "update_entity"]) {
      if (item[key] !== undefined && !isEntity(item[key])) fail(`${path}.${key}`, "expected an entity id");
    }
    if (item.url !== undefined && typeof item.url !== "string") fail(`${path}.url`, "expected a URL");
  }
  if (item.type === "badge" && item.toggle !== undefined) ctx.toggles.push({ path: `${path}.toggle`, id: item.toggle });
  if (item.type === "group") ctx.groups.add(item.id);
  if (item.type === "ports") {
    if (item.size !== undefined && !isSize(item.size)) fail(`${path}.size`, "expected an icon size in px");
    if (item.icon !== undefined && !isMdi(item.icon)) fail(`${path}.icon`, "expected an mdi icon such as mdi:ethernet");
    if (item.states !== undefined) {
      if (!item.states || typeof item.states !== "object" || Array.isArray(item.states)) {
        fail(`${path}.states`, "expected a map of state: active | warn | inactive | fault | disabled");
      }
      for (const [key, value] of Object.entries(item.states)) {
        if (!PORT.states.includes(value)) fail(`${path}.states.${key}`, `expected one of ${PORT.states.join(", ")}`);
      }
    }
  }
  if ((item.type === "ports" || item.type === "port") && item.speed !== undefined && Number.isNaN(parseSpeed(item.speed))) {
    fail(`${path}.speed`, "expected a link speed such as 1Gbps, 2.5Gbps or 100Mbps");
  }
  if (item.type === "port") {
    if (!isEntity(item.entity)) fail(`${path}.entity`, "expected an entity id");
    ctx.ports.add(item.id);
  }
  if (DEVICE_TYPES.includes(item.type)) ctx.devices.add(item.id);
  if (item.items !== undefined) {
    if (!Array.isArray(item.items)) fail(`${path}.items`, "expected a list");
    item.items.forEach((child, i) => validateItem(child, `${path}.items[${i}]`, item, ctx));
  }
  if (item.type === "endpoint" && Boolean(item.icon) === Boolean((item.items || []).some((child) => child.type === "chip"))) {
    fail(path, "an endpoint needs either an mdi 'icon' or a chip in 'items'");
  }
};

const validateLine = (line, path, kind, { devices, ports, ids }, vlans) => {
  if (!line || typeof line !== "object") fail(path, "expected a line");
  checkKeys(line, kind === "data" ? DATALINE_KEYS : LINE_KEYS, path);
  if (typeof line.id !== "string" || !line.id) fail(`${path}.id`, "required");
  if (line.points !== undefined && !(Array.isArray(line.points) && line.points.every(isPair))) fail(`${path}.points`, "expected a list of [x, y]");
  const open = [];
  for (const end of ["start", "end"]) {
    const device = line[`${end}_device`];
    const port = line[`${end}_port`];
    if (device !== undefined && port !== undefined) fail(path, `use either '${end}_device' or '${end}_port', not both`);
    if (device === undefined && port === undefined) {
      if (kind !== "data") fail(path, `needs either '${end}_device' or '${end}_port'`);
      for (const key of ["edge", "point"]) {
        if (line[`${end}_${key}`] !== undefined) fail(`${path}.${end}_${key}`, `has no effect on an open end – add '${end}_device' or '${end}_port'`);
      }
      open.push(end);
      continue;
    }
    if (port !== undefined && !ports.has(port)) fail(`${path}.${end}_port`, `unknown port '${port}'`);
    if (device !== undefined && !devices.has(device)) {
      fail(`${path}.${end}_device`, ids.has(device) ? `'${device}' is not a device – lines connect devices and ports only` : `unknown device '${device}'`);
    }
    if (!EDGES.includes(line[`${end}_edge`])) fail(`${path}.${end}_edge`, `expected one of ${EDGES.join(", ")}`);
    const point = line[`${end}_point`];
    if (point !== undefined && !(isNum(point) && point >= 0 && point <= 100)) fail(`${path}.${end}_point`, "expected a percentage 0–100");
  }
  if (open.length > 1) fail(path, "only one end can be open – give 'start_device'/'start_port' or 'end_device'/'end_port'");
  if (open.length && !line.points?.length) {
    fail(`${path}.points`, `an open ${open[0]} needs at least one point – the ${open[0] === "end" ? "last" : "first"} point is where the line fades out`);
  }
  const flows = kind === "data" ? ["forward", "reverse", "dominant"] : ["forward", "reverse"];
  if (line.flow !== undefined && !flows.includes(line.flow)) fail(`${path}.flow`, `expected one of ${flows.join(", ")}`);
  if (kind !== "data") return;
  for (const name of line.vlans || []) if (!vlans[name]) fail(`${path}.vlans`, `unknown VLAN '${name}' – add it to the card's 'vlans'`);
  if (line.status !== undefined && !["active", "inactive"].includes(line.status) && !isBinarySensor(line.status)) {
    fail(`${path}.status`, "expected active, inactive or a binary_sensor entity id (e.g. binary_sensor.router_ether1)");
  }
  for (const key of ["rx", "tx"]) if (line[key] !== undefined && !isEntity(line[key])) fail(`${path}.${key}`, "expected an entity id");
  if (line.flow === "dominant" && !(line.rx && line.tx)) fail(`${path}.flow`, "'dominant' needs both 'rx' and 'tx'");
  const at = line.rates_at;
  if (at !== undefined) {
    if (!(at === "start" || at === "end" || (isNum(at) && at >= 0 && at <= 100))) fail(`${path}.rates_at`, "expected start, end or a percentage 0–100");
    if (!line.rx && !line.tx) fail(`${path}.rates_at`, "needs 'rx' and/or 'tx' to show");
  }
  if (line.rates_placement !== undefined && !RATES.placements.includes(line.rates_placement)) {
    fail(`${path}.rates_placement`, `expected one of ${RATES.placements.join(", ")}`);
  }
  if (line.rates_size !== undefined && !isSize(line.rates_size)) fail(`${path}.rates_size`, "expected a font size in px");
  for (const key of ["rates_placement", "rates_size"]) {
    if (line[key] !== undefined && at === undefined) fail(`${path}.${key}`, "has no effect without 'rates_at'");
  }
};

const validateConfig = (config) => {
  if (!config || typeof config !== "object") throw new Error(`${CARD_TYPE}: missing configuration`);
  checkKeys(config, CARD_KEYS, "card");
  if (!Array.isArray(config.items)) throw new Error(`${CARD_TYPE}: 'items' list is required`);
  const vlans = config.vlans || {};
  if (typeof vlans !== "object" || Array.isArray(vlans)) fail("vlans", "expected a map of name: colour");
  for (const key of ["fit_viewport", "debug", "vlan_toggle", "power_toggle", "animation_toggle", "debug_toggle"]) {
    if (config[key] !== undefined && typeof config[key] !== "boolean") fail(key, "expected true or false");
  }
  if (config.background !== undefined && !BACKGROUNDS.includes(config.background) && !isColor(config.background) && !isImageUrl(config.background)) {
    fail("background", `expected ${BACKGROUNDS.join(", ")}, a colour such as "#1a2230" or an image URL such as /local/background.jpg`);
  }
  if (config.toggles_at !== undefined) {
    if (!isPair(config.toggles_at)) fail("toggles_at", "expected [x, y]");
    if (!["vlan_toggle", "power_toggle", "animation_toggle", "debug_toggle"].some((key) => config[key])) fail("toggles_at", "has no effect without a switch");
  }
  if (config.look !== undefined && !LOOKS.includes(config.look)) fail("look", `expected one of ${LOOKS.join(", ")}`);
  if (config.font !== undefined && !(typeof config.font === "string" && /^[\w .-]+$/.test(config.font.trim()) && config.font.trim())) {
    fail("font", "expected a font family name such as JetBrains Mono");
  }
  for (const key of ["line_radius", "scale"]) {
    if (config[key] !== undefined && !(isNum(config[key]) && config[key] >= 0)) fail(key, "expected a number");
  }
  const ctx = { ids: new Set(), devices: new Set(), ports: new Set(), groups: new Set(), toggles: [], vlans };
  config.items.forEach((item, i) => validateItem(item, `items[${i}]`, null, ctx));
  for (const { path, id } of ctx.toggles) if (!ctx.groups.has(id)) fail(path, `'${id}' is not a group`);
  const { ids } = ctx;
  for (const [list, kind] of [["datalines", "data"], ["powerlines", "power"]]) {
    if (config[list] === undefined) continue;
    if (!Array.isArray(config[list])) fail(list, "expected a list");
    config[list].forEach((line, i) => {
      validateLine(line, `${list}[${i}]`, kind, ctx, vlans);
      if (ids.has(line.id)) fail(`${list}[${i}].id`, `duplicate id '${line.id}'`);
      ids.add(line.id);
    });
  }
};

const placeItems = (items, origin, out, group = null, parent = null) => {
  for (const item of items || []) {
    let box;
    if (item.type === "rackdevice" || item.type === "fanpanel") {
      box = {
        x: origin[0] + RACK.inset,
        y: origin[1] + RACK.cap + (item.u - 1) * RACK.unit + 1,
        w: RACK.width - 2 * RACK.inset,
        h: (item.units ?? (item.type === "fanpanel" ? FAN.units : 1)) * RACK.unit - 2,
      };
    } else {
      const x = origin[0] + item.at[0];
      const y = origin[1] + item.at[1];
      if (item.type === "rack") box = { x, y, w: RACK.width, h: RACK.cap * 2 + item.units * RACK.unit };
      else if (item.type === "device") box = { x, y, w: item.size[0], h: item.size[1] };
      else if (item.type === "endpoint") box = { x, y, w: ENDPOINT.size, h: ENDPOINT.size };
      else if (item.type === "port") box = { x, y, w: parent.size ?? PORT.size, h: parent.size ?? PORT.size };
      else if (item.type === "label") box = { x, y, w: String(item.text).length * (item.size ?? LABEL.size) * 0.6, h: item.size ?? LABEL.size };
      else if (item.type === "led") box = { x, y, w: (item.size ?? LED.size)[0], h: (item.size ?? LED.size)[1] };
      else if (item.type === "chip") box = { x, y, w: item.size ?? CHIP.size, h: item.size ?? CHIP.size };
      else if (item.type === "pool") box = { x, y, w: item.size[0], h: item.size[1] };
      else if (item.type === "fan") box = { x, y, w: item.size ?? FAN.size, h: item.size ?? FAN.size };
      else if (DISK.types.includes(item.type)) box = { x, y, w: (item.size ?? DISK.size)[0], h: (item.size ?? DISK.size)[1] };
      else box = { x, y, w: 0, h: 0 };
    }
    out.push({ dev: item, ...box, group });
    placeItems(item.items, [box.x, box.y], out, item.type === "group" ? item.id : group, item);
  }
  return out;
};

class HaHomelabMap extends HTMLElement {
  #config = null;
  #hass = null;
  #built = false;
  #deps = new Map();
  #frames = [];
  #platterDef = false;
  #pools = [];
  #disks = [];
  #fans = [];
  #cabled = new Set();
  #deep = false;
  #defs = null;
  #textures = new Set();
  #card;
  #view;
  #scroller;
  #reset;
  #stage;
  #togglesBox = null;
  #base = 0;
  #zoom = 1;
  #origin = [0, 0];
  #painted = false;
  #pointers = new Map();
  #gesture = null;
  #dragged = false;
  #lastTap = null;
  #svg = null;
  #canvas = null;
  #ctx = null;
  #viewBox = null;
  #scale = 1;
  #boxes = [];
  #badges = [];
  #chips = [];
  #leds = [];
  #labels = [];
  #ports = [];
  #ledPaint = null;
  #blinkPhase = 0;
  #ringPaint = null;
  #iconLoader;
  #debugOn = false;
  #debugLayer = null;
  #debugTip = null;
  #groupEls = new Map();
  #hiddenGroups = storedGroups();
  #animate = { data: true, power: true, motion: true };
  #lines = [];
  #rates = [];
  #flows = [];
  #frame = 0;
  #timer = 0;
  #lastFrame = 0;
  #visible = true;
  #observer = null;
  #onResize = () => this.#fit();

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = STYLES;
    this.#card = document.createElement("ha-card");
    this.#view = htmlEl("div", "view", this.#card);
    this.#scroller = htmlEl("div", "scroller", this.#view);
    this.#stage = htmlEl("div", "stage", this.#scroller);
    this.#reset = htmlEl("button", "zoom-reset", this.#view);
    this.#reset.textContent = "⤢";
    this.#reset.title = "Show the whole map";
    this.#reset.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this.#zoomTo(1);
    });
    this.#bindZoom();
    this.#iconLoader = htmlEl("div", "icon-loader");
    root.append(style, this.#card, this.#iconLoader);
    this.#card.addEventListener("click", (ev) => {
      const target = ev.target.closest?.("[data-toggle], [data-url], [data-entity]");
      if (!target) return;
      ev.stopPropagation();
      if (target.dataset.toggle) {
        this.#toggleGroup(target.dataset.toggle);
        return;
      }
      if (target.dataset.url) {
        window.open(target.dataset.url, "_blank", "noopener");
        return;
      }
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: target.dataset.entity }, bubbles: true, composed: true }));
    });
    this.#card.addEventListener("click", (ev) => {
      if (!this.#dragged) return;
      this.#dragged = false;
      ev.stopPropagation();
      ev.preventDefault();
    }, true);
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => this.#fit()).observe(this.#view);
  }

  static getStubConfig() {
    return {
      items: [{
        type: "device",
        id: "router",
        at: [20, 20],
        size: [240, 64],
        items: [{ type: "label", id: "router_name", at: [8, 6], text: "Router", size: 12, bold: true }],
      }],
    };
  }

  setConfig(config) {
    validateConfig(config);
    this.#config = config;
    this.#built = false;
    this.#applyFont();
    if (this.#hass) this.#render();
  }

  set hass(hass) {
    const prev = this.#hass;
    this.#hass = hass;
    if (!this.#built) {
      this.#render();
      return;
    }
    if (!prev) {
      this.#update();
      return;
    }
    const due = new Set();
    for (const [id, updates] of this.#deps) if (prev.states[id] !== hass.states[id]) { for (const update of updates) due.add(update); }
    if (!due.size) return;
    for (const update of due) update();
    if (!this.#frame && !this.#timer) this.#drawFx();
  }

  getCardSize() {
    return 10;
  }

  getGridOptions() {
    return { columns: "full", min_columns: 12 };
  }

  connectedCallback() {
    window.addEventListener("resize", this.#onResize);
    requestAnimationFrame(this.#onResize);
    if (this.#built && this.#hass) requestAnimationFrame(() => this.#update());
    this.#applyVisibility();
    if (this.#observer || typeof IntersectionObserver === "undefined") return;
    this.#observer = new IntersectionObserver((entries) => {
      this.#visible = entries[entries.length - 1].isIntersecting;
      this.#applyVisibility();
    });
    this.#observer.observe(this);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.#onResize);
    this.#observer?.disconnect();
    this.#observer = null;
    this.#applyVisibility();
  }

  #state(entityId) {
    return entityId && this.#hass ? this.#hass.states[entityId] : undefined;
  }

  #isUp(entityId) {
    const state = this.#state(entityId);
    return Boolean(state) && !DOWN_STATES.has(String(state.state).toLowerCase());
  }

  #applyFont() {
    const font = this.#config.font?.trim();
    if (!font) {
      this.#card.style.removeProperty("--hhm-font");
      return;
    }
    this.#card.style.setProperty("--hhm-font", `"${font}", var(--ha-font-family-body, sans-serif)`);
    const file = BUNDLED_FONTS[font];
    if (file && document.fonts && !document.getElementById(`hhm-font-${file}`)) {
      const style = document.createElement("style");
      style.id = `hhm-font-${file}`;
      style.textContent = ["Regular", "Bold"].map((weight) => {
        const url = new URL(`${file}-${weight}.woff2`, import.meta.url).href;
        return `@font-face { font-family: "${font}"; font-weight: ${weight === "Bold" ? 700 : 400}; font-display: swap; src: local("${font}${
          weight === "Bold" ? " Bold" : ""
        }"), url("${url}") format("woff2"); }`;
      }).join("\n");
      document.head.appendChild(style);
    }
    if (!document.fonts?.load) return;
    Promise.all([document.fonts.load(`10px "${font}"`), document.fonts.load(`bold 10px "${font}"`)])
      .then(() => this.#remeasure())
      .catch(() => {});
  }

  #remeasure() {
    if (!this.#built) return;
    for (const badge of this.#badges) badge.measured = 0;
    for (const label of this.#labels) label.measured = 0;
    for (const rate of this.#rates) rate.measured = false;
    for (const badge of this.#badges) this.#updateBadge(badge);
    for (const label of this.#labels) this.#layoutLabel(label);
    for (const rate of this.#rates) this.#updateRates(rate);
  }

  #render() {
    if (!this.#config || !this.#hass) return;
    this.#build();
    this.#update();
  }

  #fit() {
    if (!this.#svg || !this.#viewBox) return;
    const { width, height } = this.#viewBox;
    let target = width * (this.#config.scale || 1);
    if (this.#config.fit_viewport && this.isConnected) {
      const room = window.innerHeight - (this.#view.getBoundingClientRect().top || 0) - 16;
      if (room > 120) target = (room * width) / height;
    }
    const avail = this.#view.clientWidth || target;
    this.#base = Math.max(1, Math.min(target, avail));
    this.#applyZoom();
  }

  #maxZoom() {
    return this.#viewBox && this.#base ? Math.max(1, (ZOOM.maxPx * this.#viewBox.width) / this.#base) : 1;
  }

  #applyZoom() {
    if (!this.#svg || !this.#viewBox) return;
    const width = Math.round(this.#base * this.#zoom);
    const px = `${width}px`;
    if (this.#svg.style.width !== px) this.#svg.style.width = px;
    const zoomed = this.#zoom > 1.001;
    this.#scroller.classList.toggle("zoomed", zoomed);
    this.#view.classList.toggle("zoomed", zoomed);
    const height = zoomed ? `${Math.round((this.#base * this.#viewBox.height) / this.#viewBox.width)}px` : "";
    if (this.#scroller.style.height !== height) this.#scroller.style.height = height;
    if (!zoomed) {
      this.#scroller.scrollLeft = 0;
      this.#scroller.scrollTop = 0;
    }
    this.#togglesBox?.classList.toggle("compact", (this.#view.clientWidth || Infinity) < ZOOM.compactWidth);
    this.#resizeFx();
    this.#placeToggles();
  }

  #placeToggles() {
    const box = this.#togglesBox;
    const at = this.#config?.toggles_at;
    if (!box || !at || !this.#viewBox) return;
    const view = this.#view.getBoundingClientRect();
    const stage = this.#stage.getBoundingClientRect();
    if (!stage.width) return;
    const k = stage.width / this.#viewBox.width;
    const clamp = (value, max) => Math.round(Math.max(0, Math.min(max, value)));
    const left = (stage.left || 0) - (view.left || 0) + (at[0] - this.#viewBox.minX) * k;
    const top = (stage.top || 0) - (view.top || 0) + (at[1] - this.#viewBox.minY) * k;
    box.style.left = `${clamp(left, (view.width || 0) - (box.offsetWidth || 0))}px`;
    box.style.top = `${clamp(top, (view.height || 0) - (box.offsetHeight || 0))}px`;
  }

  #zoomTo(zoom, clientX, clientY) {
    if (!this.#viewBox || !this.#base) return;
    const next = Math.max(1, Math.min(this.#maxZoom(), zoom));
    if (Math.abs(next - this.#zoom) < 1e-3) return;
    const view = this.#scroller.getBoundingClientRect();
    const stage = this.#stage.getBoundingClientRect();
    const x = clientX ?? (view.left || 0) + (view.width || 0) / 2;
    const y = clientY ?? (view.top || 0) + (view.height || 0) / 2;
    const fx = stage.width ? (x - (stage.left || 0)) / stage.width : 0.5;
    const fy = stage.height ? (y - (stage.top || 0)) / stage.height : 0.5;
    this.#zoom = next;
    this.#applyZoom();
    const width = this.#base * next;
    const height = (width * this.#viewBox.height) / this.#viewBox.width;
    if (next > 1.001) {
      this.#scroller.scrollLeft = fx * width - (x - (view.left || 0));
      this.#scroller.scrollTop = fy * height - (y - (view.top || 0));
    }
    this.#onScroll();
  }

  #onScroll = () => {
    this.#placeFx();
    this.#placeToggles();
    if (!this.#frame && !this.#timer) this.#drawFx();
  };

  #bindZoom() {
    const sc = this.#scroller;
    sc.addEventListener("scroll", this.#onScroll, { passive: true });
    sc.addEventListener("pointerdown", (ev) => {
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      this.#dragged = false;
      this.#pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      const pts = [...this.#pointers.values()];
      if (pts.length === 2) {
        this.#gesture = { kind: "pinch", dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1, zoom: this.#zoom };
      } else if (pts.length === 1) {
        this.#gesture = { kind: "pan", x: ev.clientX, y: ev.clientY, left: sc.scrollLeft, top: sc.scrollTop, moved: false };
      }
    });
    sc.addEventListener("pointermove", (ev) => {
      if (!this.#pointers.has(ev.pointerId)) return;
      this.#pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      const g = this.#gesture;
      if (!g) return;
      const pts = [...this.#pointers.values()];
      if (g.kind === "pinch" && pts.length >= 2) {
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        this.#dragged = true;
        this.#zoomTo(g.zoom * (dist / g.dist), (pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
        return;
      }
      if (g.kind !== "pan" || this.#zoom <= 1.001) return;
      const dx = ev.clientX - g.x;
      const dy = ev.clientY - g.y;
      if (!g.moved && Math.hypot(dx, dy) > ZOOM.dragPx) {
        g.moved = true;
        sc.classList.add("panning");
        sc.setPointerCapture?.(ev.pointerId);
      }
      if (!g.moved) return;
      this.#dragged = true;
      sc.scrollLeft = g.left - dx;
      sc.scrollTop = g.top - dy;
    });
    const end = (ev, cancelled) => {
      if (!this.#pointers.has(ev.pointerId)) return;
      this.#pointers.delete(ev.pointerId);
      sc.classList.remove("panning");
      const g = this.#gesture;
      if (this.#pointers.size) {
        this.#gesture = null;
        return;
      }
      this.#gesture = null;
      if (cancelled || !g || g.kind !== "pan" || g.moved) return;
      if (ev.target?.closest?.("[data-entity], [data-url], [data-toggle], .toggles, button")) return;
      const now = performance.now();
      const last = this.#lastTap;
      if (last && now - last.t < ZOOM.tapMs && Math.hypot(ev.clientX - last.x, ev.clientY - last.y) < ZOOM.tapPx) {
        this.#lastTap = null;
        this.#zoomTo(this.#zoom >= this.#maxZoom() - 0.01 ? 1 : this.#zoom * ZOOM.step, ev.clientX, ev.clientY);
      } else this.#lastTap = { t: now, x: ev.clientX, y: ev.clientY };
    };
    sc.addEventListener("pointerup", (ev) => end(ev, false));
    sc.addEventListener("pointercancel", (ev) => end(ev, true));
    sc.addEventListener("wheel", (ev) => {
      if (!ev.ctrlKey && !ev.metaKey) return;
      ev.preventDefault();
      this.#zoomTo(this.#zoom * Math.exp(-Math.max(-50, Math.min(50, ev.deltaY)) * 0.01), ev.clientX, ev.clientY);
    }, { passive: false });
    let start = 1;
    sc.addEventListener("gesturestart", (ev) => {
      if (this.#pointers.size) return;
      ev.preventDefault();
      start = this.#zoom;
    });
    sc.addEventListener("gesturechange", (ev) => {
      if (this.#pointers.size) return;
      ev.preventDefault();
      this.#zoomTo(start * ev.scale, ev.clientX, ev.clientY);
    });
  }

  #build() {
    const config = this.#config;
    const placed = placeItems(config.items, [0, 0], []);
    this.#boxes = placed.filter((p) => DEVICE_TYPES.includes(p.dev.type));
    const chips = placed.filter((p) => p.dev.type === "chip");
    const storage = placed.filter((p) => p.dev.type === "pool" || DISK.types.includes(p.dev.type));
    const fans = placed.filter((p) => p.dev.type === "fan" || p.dev.type === "fanpanel");
    const leds = placed.filter((p) => p.dev.type === "led");
    const labels = placed.filter((p) => p.dev.type === "label");
    const ports = placed.filter((p) => p.dev.type === "port");
    const portParent = new Map();
    for (const p of placed) if (p.dev.type === "ports") { for (const child of p.dev.items || []) portParent.set(child.id, p.dev); }
    const badges = placed.filter((p) => p.dev.type === "badge");
    const boxOf = new Map([...this.#boxes, ...ports].map((box) => [box.dev.id, box]));
    const lines = [
      ...(config.powerlines || []).map((cfg) => ({ cfg, kind: "power" })),
      ...(config.datalines || []).map((cfg) => ({ cfg, kind: "data" })),
    ];
    for (const line of lines) {
      const { cfg } = line;
      const anchor = (end) => {
        const id = cfg[`${end}_device`] ?? cfg[`${end}_port`];
        return id === undefined ? [] : [edgeAnchor(boxOf.get(id), cfg[`${end}_edge`], cfg[`${end}_point`])];
      };
      line.pts = [...anchor("start"), ...(cfg.points || []), ...anchor("end")];
      const openEnd = cfg.end_device === undefined && cfg.end_port === undefined;
      const openStart = cfg.start_device === undefined && cfg.start_port === undefined;
      const n = line.pts.length;
      line.open = openEnd ? [n - 1, n - 2] : openStart ? [0, 1] : null;
    }

    const xs = [];
    const ys = [];
    for (const b of this.#boxes) {
      xs.push(b.x, b.x + b.w);
      ys.push(b.y, b.y + b.h);
      if (b.dev.type === "rack") xs.push(b.x - 20);
    }
    for (const p of ports) {
      xs.push(p.x, p.x + p.w);
      ys.push(p.y, p.y + p.h);
    }
    for (const l of labels) {
      xs.push(l.x, l.x + (l.dev.vertical ? l.h : l.w));
      ys.push(l.y, l.y + (l.dev.vertical ? l.w : l.h));
    }
    for (const b of [...storage, ...fans]) {
      xs.push(b.x, b.x + b.w);
      ys.push(b.y, b.y + b.h + 5);
    }
    for (const c of chips) {
      xs.push(c.x - 2, c.x + c.w + 2);
      ys.push(c.y - 2, c.y + c.h + 2);
    }
    for (const b of badges) {
      xs.push(b.x, b.x + 40);
      ys.push(b.y, b.y + 16);
    }
    for (const line of lines) {
      line.pts.forEach(([x, y], i) => {
        if (line.open && i === line.open[0]) return;
        xs.push(x);
        ys.push(y);
      });
    }
    if (!xs.length) xs.push(0);
    if (!ys.length) ys.push(0);
    const m = DEFAULTS.margin;
    const minX = Math.min(...xs) - m;
    const minY = Math.min(...ys) - m;
    const width = Math.max(...xs) + m - minX;
    const height = Math.max(...ys) + m - minY;
    for (const line of lines) {
      if (!line.open) continue;
      const [tip, inner] = line.open;
      const [ax, ay] = line.pts[inner];
      const [bx, by] = line.pts[tip];
      let t = 1;
      for (const [a, b, lo, hi] of [[ax, bx, minX, minX + width], [ay, by, minY, minY + height]]) {
        if (b < lo && b !== a) t = Math.min(t, (lo - a) / (b - a));
        if (b > hi && b !== a) t = Math.min(t, (hi - a) / (b - a));
      }
      line.pts[tip] = [ax + (bx - ax) * Math.max(0, t), ay + (by - ay) * Math.max(0, t)];
      line.fade = fadeBand(line.pts[inner], line.pts[tip]);
    }

    this.#stage.replaceChildren();
    for (const sel of [".fx", ".toggles", ".dbg-tip"]) for (const el of this.#view.querySelectorAll(sel)) el.remove();
    this.#painted = false;
    this.#zoom = 1;
    this.#togglesBox = null;
    const svg = svgEl("svg", { viewBox: `${minX} ${minY} ${width} ${height}`, role: "img", "aria-label": "Homelab map" }, this.#stage);
    this.#canvas = htmlEl("canvas", "fx", this.#view);
    this.#ctx = null;
    this.#svg = svg;
    this.#viewBox = { minX, minY, width, height };
    this.#flows = [];
    this.#lines = [];
    this.#rates = [];
    this.#badges = [];
    this.#chips = [];
    this.#leds = [];
    this.#labels = [];
    this.#ports = [];
    this.#frames = [];
    this.#pools = [];
    this.#disks = [];
    this.#fans = [];
    this.#platterDef = false;
    this.#drawToggles();
    this.#fit();

    const defs = svgEl("defs", {}, svg);
    this.#defs = defs;
    this.#textures = new Set();
    this.#deep = config.look === "depth";
    if (this.#deep) {
      svg.classList.add("depth");
      for (const [id, { dy, blur, alpha }] of [["hhm-shadow", DEPTH.big], ["hhm-shadow-sm", DEPTH.small]]) {
        const f = svgEl("filter", { id, x: "-10%", y: "-10%", width: "120%", height: "140%" }, defs);
        svgEl("feGaussianBlur", { in: "SourceAlpha", stdDeviation: blur }, f);
        svgEl("feOffset", { dy }, f);
        const ct = svgEl("feComponentTransfer", {}, f);
        svgEl("feFuncA", { type: "linear", slope: alpha }, ct);
        const merge = svgEl("feMerge", {}, f);
        svgEl("feMergeNode", {}, merge);
        svgEl("feMergeNode", { in: "SourceGraphic" }, merge);
      }
      const lift = svgEl("linearGradient", { id: "hhm-lift", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      for (const [offset, color, opacity] of [[0, "#ffffff", 0.07], [0.5, "#ffffff", 0], [1, "#000000", 0.12]]) {
        svgEl("stop", { offset, "stop-color": color, "stop-opacity": opacity }, lift);
      }
      const rail = svgEl("linearGradient", { id: "hhm-rail", x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
      for (const [offset, color] of [[0, "#5a6370"], [0.5, "#3a414b"], [1, "#2a2f36"]]) svgEl("stop", { offset, "stop-color": color }, rail);
    }
    this.#drawBackground(svg, defs, config.background);
    const racks = svgEl("g", {}, svg);
    const devices = svgEl("g", {}, svg);
    const lineLayer = svgEl("g", {}, svg);
    const badgeLayer = svgEl("g", {}, svg);
    for (const box of this.#boxes) box.el = box.dev.type === "rack" ? this.#drawRack(racks, box) : this.#drawDevice(devices, box);
    for (const box of fans) box.el = this.#drawFan(box.dev.type === "fanpanel" ? racks : devices, box);
    this.#fans.forEach((f, i) => (f.group = fans[i].group));
    for (const box of storage) box.el = box.dev.type === "pool" ? this.#drawPool(devices, box) : this.#drawDisk(devices, box, defs);
    const radius = config.line_radius ?? DEFAULTS.lineRadius;
    lines.forEach((line, i) => this.#drawLine(lineLayer, line, radius, defs, i));
    for (const line of lines) if (line.kind === "data" && line.cfg.rates_at !== undefined) this.#drawRates(badgeLayer, line);
    for (const led of leds) led.el = this.#drawLed(badgeLayer, led);
    for (const label of labels) label.el = this.#drawLabel(badgeLayer, label);
    this.#cabled = new Set(lines.flatMap(({ cfg }) => [cfg.start_port, cfg.end_port]).filter(Boolean));
    for (const port of ports) port.el = this.#drawPort(badgeLayer, port, portParent.get(port.dev.id));
    for (const chip of chips) chip.el = this.#drawChip(badgeLayer, chip);
    for (const badge of badges) badge.el = this.#drawBadge(badgeLayer, badge);
    this.#groupEls = new Map();
    for (const p of [...leds, ...labels, ...chips, ...badges, ...fans]) {
      if (!p.group) continue;
      if (!this.#groupEls.has(p.group)) this.#groupEls.set(p.group, []);
      this.#groupEls.get(p.group).push(p.el);
    }
    this.#chips.forEach((c, i) => (c.group = chips[i].group));
    this.#leds.forEach((l, i) => (l.group = leds[i].group));
    this.#applyGroups();
    this.#debugLayer = null;
    this.#debugTip = null;
    if (config.debug || config.debug_toggle) this.#drawDebug(svg, defs, badges, [...storage, ...fans]);
    this.#applyDebug();

    this.#deps = new Map();
    const depend = (ids, update) => {
      for (const id of ids) {
        if (!id) continue;
        if (!this.#deps.has(id)) this.#deps.set(id, []);
        this.#deps.get(id).push(update);
      }
    };
    for (const badge of this.#badges) depend([badge.dev.entity], () => this.#updateBadge(badge));
    for (const chip of this.#chips) depend([chip.dev.status_entity, chip.dev.update_entity, chip.dev.small_entity], () => this.#updateChip(chip));
    for (const led of this.#leds) depend([led.dev.entity], () => this.#updateLed(led));
    for (const rate of this.#rates) depend([rate.cfg.rx, rate.cfg.tx], () => this.#updateRates(rate));
    for (const port of this.#ports) depend([port.dev.entity], () => this.#updatePort(port));
    for (const frame of this.#frames) depend([frame.dev.status_entity], () => this.#updateFrame(frame));
    for (const pool of this.#pools) depend([pool.dev.usage_entity, pool.dev.status_entity], () => this.#updatePool(pool));
    for (const disk of this.#disks) depend([disk.dev.temperature, disk.dev.status_entity], () => this.#updateDisk(disk));
    for (const fan of this.#fans) depend([fan.dev.entity], () => this.#updateFan(fan));
    for (const line of this.#lines) depend([line.cfg.rx, line.cfg.tx, isEntity(line.cfg.status) ? line.cfg.status : null], () => this.#updateLine(line));
    this.#built = true;
    this.#painted = false;
    this.#resizeFx();
    this.#applyVisibility();
    requestAnimationFrame(this.#onResize);
  }

  #drawBackground(svg, defs, kind) {
    if (!kind || kind === "none") return;
    const { minX, minY, width, height } = this.#viewBox;
    const area = { x: minX, y: minY, width, height };
    const layer = svgEl("g", { class: "bg", "pointer-events": "none" }, svg);
    if (isColor(kind)) {
      svgEl("rect", { ...area, fill: kind }, layer);
      return;
    }
    if (isImageUrl(kind)) {
      svgEl("image", { ...area, href: kind, preserveAspectRatio: "xMidYMid slice" }, layer);
      return;
    }
    const glow = { blueprint: ["#6c9cda", 9, 22], pegboard: ["#ffffff", 4, 22], vignette: ["#ffffff", 6, 35] }[kind];
    const gradient = svgEl("radialGradient", { id: "hhm-bg-glow", cx: "48%", cy: "42%", r: "78%" }, defs);
    for (
      const [offset, style] of [
        [0, `stop-color: color-mix(in srgb, ${glow[0]} ${glow[1]}%, var(--hhm-bg))`],
        [0.6, "stop-color: var(--hhm-bg)"],
        [1, `stop-color: color-mix(in srgb, #000000 ${glow[2]}%, var(--hhm-bg))`],
      ]
    ) {
      svgEl("stop", { offset, style }, gradient);
    }
    svgEl("rect", { ...area, fill: "url(#hhm-bg-glow)" }, layer);
    if (kind === "blueprint") {
      const pattern = svgEl("pattern", { id: "hhm-bg-grid", width: 50, height: 50, patternUnits: "userSpaceOnUse" }, defs);
      svgEl("path", { class: "bg-fine", d: "M10 0V50M20 0V50M30 0V50M40 0V50M0 10H50M0 20H50M0 30H50M0 40H50" }, pattern);
      svgEl("path", { class: "bg-line", d: "M50 0H0V50" }, pattern);
      svgEl("rect", { ...area, fill: "url(#hhm-bg-grid)" }, layer);
    } else if (kind === "pegboard") {
      const pattern = svgEl("pattern", { id: "hhm-bg-dots", width: 12, height: 12, patternUnits: "userSpaceOnUse" }, defs);
      svgEl("circle", { class: "bg-dot", cx: 6, cy: 6, r: 0.9 }, pattern);
      svgEl("rect", { ...area, fill: "url(#hhm-bg-dots)" }, layer);
    }
  }

  #applyTexture(g, dev, x, y, w, h) {
    if (!dev.texture) return;
    const t = TEXTURES[dev.texture];
    const layer = svgEl("g", { opacity: dev.texture_opacity ?? 1, "pointer-events": "none" }, g);
    const box = { x: x + 0.7, y: y + 0.7, width: Math.max(0, w - 1.4), height: Math.max(0, h - 1.4), rx: BOX_RADIUS };
    if (t.tint) svgEl("rect", { ...box, fill: t.tint[0], "fill-opacity": t.tint[1] }, layer);
    svgEl("rect", { ...box, fill: `url(#${this.#texture(dev.texture)})` }, layer);
    if (t.accent) svgEl("rect", { x: x + 4, y: y + h - 3, width: Math.max(0, w - 8), height: 1.5, rx: 0.75, fill: t.accent, "fill-opacity": 0.85 }, layer);
  }

  #texture(name) {
    const id = `hhm-tex-${name}`;
    if (this.#textures.has(name)) return id;
    this.#textures.add(name);
    const t = TEXTURES[name];
    if (t.gradient) {
      const gradient = svgEl("linearGradient", { id, x1: 0, y1: 0, x2: t.vertical ? 0 : 1, y2: t.vertical ? 1 : 0 }, this.#defs);
      for (const [offset, opacity] of t.gradient) svgEl("stop", { offset, "stop-color": "#ffffff", "stop-opacity": opacity }, gradient);
      return id;
    }
    const pattern = svgEl(
      "pattern",
      { id, width: t.w, height: t.h, patternUnits: "userSpaceOnUse", patternTransform: t.rotate ? `rotate(${t.rotate})` : null },
      this.#defs,
    );
    for (const [tag, attrs] of t.marks) svgEl(tag, attrs, pattern);
    return id;
  }

  #raise(el, size = "big") {
    if (this.#deep) el.setAttribute("filter", `url(#${size === "big" ? "hhm-shadow" : "hhm-shadow-sm"})`);
    return el;
  }

  #lift(parent, x, y, w, h, rx) {
    if (this.#deep) svgEl("rect", { class: "lift", x, y, width: w, height: h, rx }, parent);
  }

  #drawRack(parent, { dev, x, y, w, h }) {
    const g = svgEl("g", { class: "rack", "data-id": dev.id }, parent);
    this.#raise(svgEl("rect", { class: "cab", x, y, width: w, height: h, rx: BOX_RADIUS }, g));
    for (const rx of [4, w - 18]) {
      svgEl("rect", { class: "rail", x: x + rx, y: y + RACK.cap, width: 14, height: dev.units * RACK.unit, rx: 2 }, g);
    }
    for (let k = 0; k < dev.units; k++) {
      const y0 = y + RACK.cap + k * RACK.unit;
      svgEl("text", { class: "ulabel", x: x - 6, y: y0 + RACK.unit / 2 + 3, "text-anchor": "end" }, g).textContent = k + 1;
      for (const hx of [8, w - 14]) {
        for (let j = 0; j < 3; j++) {
          svgEl("rect", { class: "hole", x: x + hx, y: y0 + RACK.unit * (0.17 + j * 0.33) - 2, width: 6, height: 4, rx: 1 }, g);
        }
      }
    }
    return g;
  }

  #drawDevice(parent, { dev, x, y, w, h }) {
    const g = svgEl("g", { class: `dev ${dev.type}`, "data-id": dev.id }, parent);
    this.#raise(svgEl("rect", { class: "frame", x, y, width: w, height: h, rx: BOX_RADIUS }, g));
    this.#applyTexture(g, dev, x, y, w, h);
    this.#lift(g, x, y, w, h, BOX_RADIUS);
    if (dev.status_entity) {
      g.dataset.entity = dev.status_entity;
      g.classList.add("clickable");
      this.#frames.push({ dev, g, title: svgEl("title", {}, g) });
    }
    if (dev.type === "endpoint" && dev.icon) {
      const { size, pad } = ENDPOINT;
      this.#drawIcon(g, dev.icon, x + pad, y + pad, size - 2 * pad);
    }
    return g;
  }

  #drawIcon(parent, name, x, y, size) {
    const path = svgEl("path", { class: "mdi", transform: `translate(${x},${y}) scale(${size / 24})`, "data-icon": name }, parent);
    this.#iconPath(name).then((d) => {
      if (d) path.setAttribute("d", d);
    });
    return path;
  }

  #drawPort(parent, { dev, x, y, w }, group) {
    const g = svgEl("g", { class: "port clickable", "data-id": dev.id }, parent);
    g.dataset.entity = dev.entity;
    const title = svgEl("title", {}, g);
    svgEl("rect", { x, y, width: w, height: w, fill: "transparent", "pointer-events": "all" }, g);
    this.#drawIcon(g, group.icon ?? PORT.icon, x, y, w);
    const inset = w * 0.12;
    svgEl("line", { class: "port-x", x1: x + inset, y1: y + inset, x2: x + w - inset, y2: y + w - inset, "stroke-width": Math.max(1, w * 0.1) }, g);
    this.#ports.push({ dev, g, title, states: group.states, cabled: this.#cabled.has(dev.id), expected: parseSpeed(dev.speed ?? group.speed ?? PORT.speed) });
    return g;
  }

  #drawPool(parent, { dev, x, y, w, h }) {
    const g = svgEl("g", { class: "pool", "data-id": dev.id }, parent);
    const entity = dev.usage_entity ?? dev.status_entity;
    if (entity) {
      g.dataset.entity = entity;
      g.classList.add("clickable");
    }
    const title = svgEl("title", {}, g);
    const fill = dev.usage_entity ? svgEl("rect", { class: "pfill", x: x + 1, y: y + h - 1, width: Math.max(0, w - 2), height: 0, rx: 2 }, g) : null;
    svgEl("rect", { class: "pbox", x, y, width: w, height: h, rx: 3 }, g);
    if (dev.label !== undefined && dev.label !== "") {
      const text = String(dev.label);
      const tw = Math.min(text.length * 7 * 0.6 + 6, w - 4);
      this.#raise(svgEl("rect", { class: "plabel-bg", x: x + (w - tw) / 2, y: y + h - 5, width: tw, height: 10, rx: 1.5 }, g), "small");
      svgEl("text", { class: "plabel", x: x + w / 2, y: y + h + 2.5, "text-anchor": "middle" }, g).textContent = text;
    }
    this.#pools.push({ dev, g, title, fill, y: y + 1, h: h - 2 });
    return g;
  }

  #drawDisk(parent, { dev, x, y, w, h }, defs) {
    const g = svgEl("g", { class: `disk ${dev.type}`, "data-id": dev.id }, parent);
    const title = svgEl("title", {}, g);
    const entity = dev.temperature ?? dev.status_entity;
    if (entity) {
      g.dataset.entity = entity;
      g.classList.add("clickable");
    }
    const k = w / DISK.size[0];
    this.#raise(svgEl("rect", { class: "dbody", x, y, width: w, height: h, rx: 2.5 * k }, g), "small");
    const disk = { dev, g, title, temp: null, spin: null };
    if (dev.type === "hdd") {
      if (!this.#platterDef) {
        const grad = svgEl("radialGradient", { id: "hhm-platter", cx: "45%", cy: "40%", r: "65%" }, defs);
        svgEl("stop", { offset: "0%", "stop-color": "#e8ebee" }, grad);
        svgEl("stop", { offset: "55%", "stop-color": "#9aa2ab" }, grad);
        svgEl("stop", { offset: "100%", "stop-color": "#5d646c" }, grad);
        this.#platterDef = true;
      }
      const cx = x + w / 2;
      const cy = y + h * 0.4;
      const r = w * 0.38;
      svgEl("circle", { cx, cy, r, fill: "url(#hhm-platter)" }, g);
      svgEl("circle", { class: "hdd-hub", cx, cy, r: r * 0.22 }, g);
      disk.spin = { cx, cy, r, angle: Math.random() * 2 * Math.PI };
    } else if (dev.type === "ssd") {
      const bx = x + 3 * k;
      const by = y + 4 * k;
      const bw = w - 6 * k;
      const bh = h * 0.62;
      svgEl("rect", { class: "ssd-board", x: bx, y: by, width: bw, height: bh, rx: 1 * k }, g);
      const cw = (bw - 4 * k) / 2;
      const ch = (bh - 6 * k) / 2;
      for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
        svgEl("rect", { class: "ssd-chip", x: bx + 1.5 * k + i * (cw + 1 * k), y: by + 2 * k + j * (ch + 2 * k), width: cw, height: ch, rx: 0.5 * k }, g);
      }
    }
    if (dev.type !== "bay") {
      if (dev.status_entity) svgEl("circle", { class: "dled", cx: x + w - 3.5 * k, cy: y + 3.5 * k, r: 1.8 * k }, g);
      const size = Math.max(6, 7 * k);
      disk.temp = svgEl("text", { class: "dtemp", x: x + w / 2, y: y + h - 3.5 * k, "text-anchor": "middle" }, g);
      disk.temp.style.fontSize = `${size}px`;
    }
    this.#disks.push(disk);
    return g;
  }

  #drawFan(parent, { dev, x, y, w, h }) {
    const g = svgEl("g", { class: `fan-item ${dev.type}`, "data-id": dev.id }, parent);
    if (dev.entity) {
      g.dataset.entity = dev.entity;
      g.classList.add("clickable");
    }
    const title = svgEl("title", {}, g);
    const holes = [];
    if (dev.type === "fanpanel") {
      this.#raise(svgEl("rect", { class: "frame", x, y, width: w, height: h, rx: BOX_RADIUS }, g));
      this.#applyTexture(g, dev, x, y, w, h);
      this.#lift(g, x, y, w, h, BOX_RADIUS);
      const count = dev.count ?? FAN.count;
      const step = w / count;
      const r = Math.max(2, Math.min(h / 2 - 3, step / 2 - 4));
      for (let i = 0; i < count; i++) holes.push([x + step * (i + 0.5), y + h / 2, r]);
    } else {
      this.#raise(svgEl("rect", { class: "frame", x, y, width: w, height: w, rx: w * 0.08 }, g), "small");
      this.#lift(g, x, y, w, w, w * 0.08);
      const inset = w * 0.11;
      for (const [sx, sy] of [[x + inset, y + inset], [x + w - inset, y + inset], [x + inset, y + w - inset], [x + w - inset, y + w - inset]]) {
        svgEl("circle", { class: "fan-screw", cx: sx, cy: sy, r: w * 0.045 }, g);
      }
      holes.push([x + w / 2, y + w / 2, w * 0.45]);
    }
    const rotors = holes.map(([cx, cy, r], i) => {
      svgEl("circle", { class: "fan-hole", cx, cy, r }, g);
      const angle = i * 50;
      const el = svgEl("path", { class: "fan-rotor", d: fanBlades(cx, cy, r - 2), transform: `rotate(${angle} ${cx} ${cy})` }, g);
      svgEl("circle", { class: "fan-hub", cx, cy, r: (r - 2) * 0.28 }, g);
      return { el, cx, cy, angle };
    });
    this.#fans.push({ dev, g, title, rotors, rps: dev.entity ? 0 : FAN.minRps });
    return g;
  }

  #updateFan(fan) {
    const { dev } = fan;
    if (!dev.entity) {
      if (fan.title.textContent !== dev.id) fan.title.textContent = dev.id;
      return;
    }
    const state = this.#state(dev.entity);
    const raw = String(state?.state ?? "").toLowerCase();
    const value = toNumber(state);
    const [lo, hi] = dev.range ?? FAN.range;
    const stopped = raw === "off" || value === 0;
    let speed = null;
    if (PORT.on.includes(raw) && !Number.isFinite(value)) speed = 1;
    else if (Number.isFinite(value)) speed = Math.max(0, Math.min(1, (value - lo) / (hi - lo)));
    fan.rps = stopped ? 0 : FAN.minRps + (speed ?? 0) * (FAN.maxRps - FAN.minRps);
    const hit = this.#threshold(dev, state);
    const color = hit ? THRESHOLD_COLORS[hit.color] ?? hit.color : "";
    for (const rotor of fan.rotors) if (rotor.el.style.fill !== color) rotor.el.style.fill = color;
    const unit = state?.attributes.unit_of_measurement ? ` ${state.attributes.unit_of_measurement}` : "";
    const reading = state ? `${state.state}${Number.isFinite(value) ? unit : ""}` : "missing";
    const pace = stopped ? "stopped" : speed === null ? "slow (no reading)" : `speed ${Math.round(speed * 100)}%`;
    const text = `${dev.id} · ${reading} · ${pace}`;
    if (fan.title.textContent !== text) fan.title.textContent = text;
    this.#applyVisibility();
  }

  #updatePool(pool) {
    const { dev } = pool;
    const usage = dev.usage_entity ? this.#state(dev.usage_entity) : null;
    const used = Number(usage?.state);
    const parts = [dev.label ?? dev.id];
    if (pool.fill) {
      const percent = Number.isFinite(used) ? Math.max(0, Math.min(100, used)) : 0;
      const height = (pool.h * percent) / 100;
      pool.fill.setAttribute("y", pool.y + pool.h - height);
      pool.fill.setAttribute("height", height);
      const hit = this.#threshold(dev, usage);
      const color = hit ? `color-mix(in srgb, ${THRESHOLD_COLORS[hit.color] ?? hit.color} 55%, var(--hhm-bg))` : "";
      if (pool.fill.style.fill !== color) pool.fill.style.fill = color;
      parts.push(Number.isFinite(used) ? `${Math.round(used)}% used` : "usage —");
    }
    if (dev.status_entity) {
      const status = this.#frameStatus(dev);
      for (const k of ["warn", "down"]) pool.g.classList.toggle(k, status === k);
      parts.push(this.#state(dev.status_entity)?.state ?? "missing");
    }
    const text = parts.join(" · ");
    if (pool.title.textContent !== text) pool.title.textContent = text;
  }

  #updateDisk(disk) {
    const { dev } = disk;
    if (dev.type === "bay") {
      if (disk.title.textContent !== `${dev.id} · empty bay`) disk.title.textContent = `${dev.id} · empty bay`;
      return;
    }
    const status = dev.status_entity ? this.#frameStatus(dev) : null;
    for (const k of ["ok", "warn", "down"]) disk.g.classList.toggle(k, status === k);
    if (disk.spin) disk.spin.stopped = status === "down";
    const state = dev.temperature ? this.#state(dev.temperature) : null;
    const value = Number(state?.state);
    const text = !dev.temperature ? "" : Number.isFinite(value) ? `${Math.round(value)}°` : "—";
    if (disk.temp.textContent !== text) disk.temp.textContent = text;
    const hit = this.#threshold(dev, state);
    const color = hit ? THRESHOLD_COLORS[hit.color] ?? hit.color : "";
    if (disk.temp.style.fill !== color) disk.temp.style.fill = color;
    const parts = [dev.id];
    if (dev.temperature) parts.push(Number.isFinite(value) ? `${value} ${state.attributes.unit_of_measurement ?? "°C"}` : "temperature —");
    if (dev.status_entity) parts.push(status === "ok" ? "healthy" : `${status} (${this.#state(dev.status_entity)?.state ?? "missing"})`);
    const tip = parts.join(" · ");
    if (disk.title.textContent !== tip) disk.title.textContent = tip;
  }

  #frameStatus(dev) {
    const state = this.#state(dev.status_entity);
    const raw = String(state?.state ?? "");
    if (!state || ["unavailable", "unknown", ""].includes(raw.toLowerCase())) return "down";
    if (!dev.status_map) return DOWN_STATES.has(raw.toLowerCase()) ? "down" : "ok";
    const words = raw.split(/\s+/);
    const hit = Object.entries(dev.status_map).find(([key]) => words.includes(String(key)));
    return hit ? hit[1] : "warn";
  }

  #updateFrame(frame) {
    const status = this.#frameStatus(frame.dev);
    for (const k of ["warn", "down"]) frame.g.classList.toggle(k, status === k);
    const state = this.#state(frame.dev.status_entity);
    const text = `${frame.dev.id} · ${state ? state.state : "missing"}`;
    if (frame.title.textContent !== text) frame.title.textContent = text;
  }

  #portStatus(port) {
    const state = this.#state(port.dev.entity);
    const noLink = port.cabled ? "fault" : "inactive";
    if (!state || ["unavailable", "unknown", ""].includes(String(state.state).toLowerCase())) return [noLink, state ? state.state : "missing"];
    const raw = String(state.state);
    const mapped = port.states && Object.entries(port.states).find(([key]) => key.toLowerCase() === raw.toLowerCase());
    if (mapped) return [mapped[1], raw];
    const a = state.attributes;
    if (a.enabled !== undefined && a.status !== undefined) {
      if (a.enabled === false || a.enabled === "false") return ["disabled", "disabled"];
      if ([a.sfp_rx_loss, a.sfp_tx_fault].some((v) => v === true || v === "true")) return ["fault", "SFP fault"];
      if (a.status !== "link-ok") return [noLink, String(a.status)];
      const speed = parseSpeed(a.rate);
      const partner = typeof a.link_partner_advertising === "string" ? a.link_partner_advertising : "";
      const halfOnly = partner !== "" && !/full/i.test(partner);
      const half = !halfOnly && (a.full_duplex === false || a.full_duplex === 0 || a.full_duplex === "false");
      if (half) return ["warn", `${a.rate} half duplex`];
      return [!Number.isNaN(speed) && speed < port.expected ? "warn" : "active", String(a.rate)];
    }
    const lower = raw.toLowerCase();
    if (PORT.on.includes(lower)) return ["active", raw];
    if (PORT.off.includes(lower)) return [noLink, raw];
    const bare = /^\s*\d+(?:\.\d+)?\s*$/.test(raw);
    const speed = parseSpeed(bare ? `${raw} ${a.unit_of_measurement || "Mbps"}` : raw);
    if (Number.isNaN(speed)) return [noLink, raw];
    return [speed >= port.expected ? "active" : "warn", raw];
  }

  #updatePort(port) {
    const [status, detail] = this.#portStatus(port);
    const classes = { active: "up", warn: "slow", fault: "fault", disabled: "disabled" };
    for (const k of ["up", "slow", "fault", "disabled"]) port.g.classList.toggle(k, classes[status] === k);
    const why = status === "fault" && port.cabled && !["SFP fault"].includes(detail) ? " · cable expected" : "";
    const text = `${port.dev.id} · ${detail}${why}`;
    if (port.title.textContent !== text) port.title.textContent = text;
  }

  #iconPath(name) {
    if (!ICON_PATHS.has(name)) {
      ICON_PATHS.set(
        name,
        new Promise((resolve) => {
          const el = document.createElement("ha-icon");
          el.setAttribute("icon", name);
          this.#iconLoader.appendChild(el);
          let tries = 0;
          const poll = () => {
            const d = el._path || el.shadowRoot?.querySelector("ha-svg-icon")?.path;
            tries += 1;
            if (d || tries > ICON_POLL.tries) {
              el.remove();
              if (!d) ICON_PATHS.delete(name);
              resolve(d || null);
              return;
            }
            setTimeout(poll, ICON_POLL.ms);
          };
          const ready = window.customElements?.whenDefined ? customElements.whenDefined("ha-icon") : Promise.resolve();
          ready.then(poll);
        }),
      );
    }
    return ICON_PATHS.get(name);
  }

  #drawBadge(parent, { dev, x, y }) {
    const size = dev.size ?? BADGE.size;
    const iconSize = HIDDEN(dev.icon) ? 0 : Math.round(size * BADGE.iconScale);
    const pad = dev.show_border ? [BADGE.padX, BADGE.padY] : [0, 0];
    const lineH = Math.max(size * 1.2, iconSize);
    const g = svgEl("g", { class: "badge clickable", "data-id": dev.id }, parent);
    if (dev.toggle) g.dataset.toggle = dev.toggle;
    else g.dataset.entity = dev.entity;
    const title = svgEl("title", {}, g);
    const frame = dev.show_border ? this.#raise(svgEl("rect", { class: "bframe", x, y, height: lineH + 2 * pad[1], rx: BOX_RADIUS }, g), "small") : null;
    const content = svgEl("g", {}, g);
    const icon = iconSize ? this.#drawIcon(content, dev.icon, x + pad[0], y + pad[1] + (lineH - iconSize) / 2, iconSize) : null;
    const textX = x + pad[0] + iconSize;
    const text = svgEl("text", { class: "btext", x: textX, y: y + pad[1] + lineH / 2 + size * 0.36 }, content);
    text.style.fontSize = `${size}px`;
    const probe = svgEl("text", { class: "btext", x: textX, y: 0, visibility: "hidden", "aria-hidden": "true" }, g);
    probe.style.fontSize = `${size}px`;
    this.#badges.push({ dev, x, content, icon, text, probe, title, frame, pad, textX, size, measured: 0 });
    return g;
  }

  #drawChip(parent, { dev, x, y, w }) {
    const g = svgEl("g", { class: "chip", "data-id": dev.id }, parent);
    if (dev.url) {
      g.dataset.url = dev.url;
      g.classList.add("clickable");
    }
    const title = svgEl("title", {}, g);
    const r = w / 2;
    this.#raise(svgEl("circle", { class: "chip-bg", cx: x + r, cy: y + r, r }, g), "small");
    const inner = w * CHIP.inner;
    const at = (w - inner) / 2;
    if (dev.image) svgEl("image", { href: dev.image, x: x + at, y: y + at, width: inner, height: inner }, g);
    else this.#drawIcon(g, dev.icon, x + at, y + at, inner);
    const sr = w * CHIP.small;
    const scx = x + r + r * CHIP.smallAt;
    const scy = y + r + r * CHIP.smallAt;
    if (dev.small_image) {
      svgEl("circle", { class: "chip-small", cx: scx, cy: scy, r: sr }, g);
      svgEl("image", { href: dev.small_image, x: scx - sr * 0.75, y: scy - sr * 0.75, width: sr * 1.5, height: sr * 1.5 }, g);
    }
    let count = null;
    if (dev.small_entity) {
      const cg = svgEl("g", {}, g);
      const cr = w * CHIP.count;
      svgEl("circle", { class: "chip-small", cx: scx, cy: scy, r: cr }, cg);
      const fs = cr * 1.5;
      const text = svgEl("text", { class: "chip-count", x: scx, y: scy + fs * 0.36, "text-anchor": "middle" }, cg);
      text.style.fontSize = `${fs}px`;
      cg.style.display = "none";
      count = { g: cg, text, cx: scx, cy: scy, r: cr + 0.5, shown: false };
    }
    this.#chips.push({ dev, title, count, cx: x + r, cy: y + r, r: r + 1, down: false, update: false });
    return g;
  }

  #drawLabel(parent, { dev, x, y }) {
    const size = dev.size ?? LABEL.size;
    const g = svgEl("g", { class: "label", "data-id": dev.id }, parent);
    const text = svgEl("text", { x: 0, y: size * 0.8 }, g);
    text.textContent = String(dev.text);
    text.style.fontSize = `${size}px`;
    text.style.fill = LABEL.colors[dev.color ?? "primary"] ?? dev.color;
    if (dev.bold) text.style.fontWeight = "700";
    const label = { dev, g, text, x, y, size, measured: 0 };
    this.#labels.push(label);
    this.#layoutLabel(label);
    return g;
  }

  #layoutLabel(label) {
    const w = textLength(label.text);
    label.measured = w;
    const length = w || String(label.dev.text).length * label.size * 0.6;
    const transform = label.dev.vertical ? `translate(${label.x},${label.y + length}) rotate(-90)` : `translate(${label.x},${label.y})`;
    if (label.g.getAttribute("transform") !== transform) label.g.setAttribute("transform", transform);
  }

  #drawLed(parent, { dev, x, y, w, h }) {
    const g = svgEl("g", { class: "led", "data-id": dev.id }, parent);
    const title = svgEl("title", {}, g);
    const color = dev.color || this.#config.vlans[dev.vlan];
    const rect = svgEl("rect", { x, y, width: w, height: h, fill: color }, g);
    if (dev.caption !== undefined) {
      const caption = svgEl("text", { class: "led-caption", x: x + w / 2, y: y - LED.captionGap, "text-anchor": "middle" }, g);
      caption.textContent = String(dev.caption);
    }
    this.#leds.push({ dev, title, rect, color, x, y, w, h, lit: true, left: randomIn(LED.on), down: false });
    return g;
  }

  #updateLed(led) {
    const { dev } = led;
    const state = dev.entity ? this.#state(dev.entity) : null;
    led.down = Boolean(dev.entity) && !isUpState(state);
    const name = dev.vlan ? `VLAN ${dev.vlan}` : dev.id;
    const text = dev.entity ? `${name} · ${state ? state.state : "missing"}` : name;
    if (led.title.textContent !== text) led.title.textContent = text;
    const fill = led.down && this.#ledPaint ? this.#ledPaint.dark : led.color;
    if (led.rect.getAttribute("fill") !== fill) led.rect.setAttribute("fill", fill);
  }

  #ledMoving(led) {
    if (led.down || (led.dev.effect ?? "flicker") === "none" || !this.#animate.motion) return false;
    return !(led.dev.vlan && !this.#animate.data);
  }

  #updateChip(chip) {
    const { dev } = chip;
    const status = dev.status_entity ? this.#state(dev.status_entity) : null;
    chip.down = Boolean(dev.status_entity) && !isUpState(status);
    const update = dev.update_entity ? this.#state(dev.update_entity) : null;
    chip.update = Boolean(update) && (UPDATE_STATES.includes(String(update.state).toLowerCase()) || Number(update.state) > 0);
    const parts = [dev.id];
    if (dev.status_entity) parts.push(chip.down ? `down (${status ? status.state : "missing"})` : "up");
    if (chip.update) parts.push("update available");
    if (chip.count) {
      const raw = this.#state(dev.small_entity);
      const num = Number(raw?.state);
      const show = Number.isFinite(num) && num > 0;
      const value = !show ? "" : num > 99 ? "99+" : String(Math.round(num));
      if (chip.count.text.textContent !== value) chip.count.text.textContent = value;
      const display = show ? "" : "none";
      if (chip.count.g.style.display !== display) chip.count.g.style.display = display;
      chip.count.shown = show;
      parts.push(`${raw?.attributes.friendly_name || dev.small_entity}: ${raw ? raw.state : "missing"}`);
    }
    const text = parts.join(" · ");
    if (chip.title.textContent !== text) chip.title.textContent = text;
  }

  #badgeText(dev) {
    const state = this.#state(dev.entity);
    const ownUnit = state?.attributes.unit_of_measurement || "";
    const unit = dev.units === undefined || dev.units === true ? ownUnit : HIDDEN(dev.units) ? "" : String(dev.units);
    const withUnit = (value) => (!unit ? value : unit === "%" ? `${value}%` : `${value} ${unit}`);
    const format = (num, decimals) =>
      new Intl.NumberFormat(this.#hass.locale?.language, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num);
    const reserve = (decimals) => {
      const max = BADGE_MAX[unit];
      if (max === undefined) return "";
      return withUnit(format(max === 100 ? max : max + 1 - 10 ** -decimals, decimals));
    };
    if (!state || ["unavailable", "unknown", ""].includes(state.state)) return { text: "—", template: reserve(dev.decimals ?? 0) };
    const num = Number(state.state);
    let value;
    if (Number.isNaN(num)) value = this.#hass.formatEntityState ? this.#hass.formatEntityState(state) : state.state;
    else if (dev.decimals !== undefined) value = format(num, dev.decimals);
    else if (this.#hass.formatEntityState) {
      const full = this.#hass.formatEntityState(state);
      value = ownUnit && full.endsWith(ownUnit) ? full.slice(0, -ownUnit.length).trim() : full;
    } else value = state.state;
    if (Number.isNaN(num)) return { text: value, template: "" };
    const decimals = dev.decimals ?? (/[.,](\d+)$/.exec(value)?.[1].length || 0);
    return { text: withUnit(value), template: reserve(decimals) };
  }

  #threshold(dev, state) {
    if (!dev.thresholds || !state || ["unavailable", "unknown", ""].includes(String(state.state))) return null;
    const value = Number(state.state);
    if (!Number.isFinite(value)) return null;
    let hit = null;
    for (const t of dev.thresholds) if (t.above !== undefined ? value >= t.above : value <= t.below) hit = t;
    return hit;
  }

  #updateBadge(badge) {
    const { text, template } = this.#badgeText(badge.dev);
    const changed = badge.text.textContent !== text;
    if (changed) badge.text.textContent = text;
    const state = this.#state(badge.dev.entity);
    const name = state?.attributes.friendly_name || badge.dev.entity;
    const hit = this.#threshold(badge.dev, state);
    const color = hit ? THRESHOLD_COLORS[hit.color] ?? hit.color : "";
    for (const node of [badge.text, badge.icon]) if (node && node.style.fill !== color) node.style.fill = color;
    const reached = hit ? ` · ${hit.above !== undefined ? `above ${hit.above}` : `below ${hit.below}`}` : "";
    const tip = `${name}: ${text}${reached}${badge.dev.toggle ? " · click to show/hide" : ""}`;
    if (badge.title.textContent !== tip) badge.title.textContent = tip;
    if (badge.probe.textContent !== template) {
      badge.probe.textContent = template;
      badge.measured = 0;
    }
    if (!changed && badge.measured > 0) return;
    const estimate = (node) => textLength(node) || node.textContent.length * badge.size * 0.6;
    const w = textLength(badge.text);
    badge.measured = w;
    const textW = w || estimate(badge.text);
    const width = Math.max(textW, template ? estimate(badge.probe) : 0);
    const transform = width > textW ? `translate(${(width - textW) / 2},0)` : "";
    if ((badge.content.getAttribute("transform") || "") !== transform) {
      if (transform) badge.content.setAttribute("transform", transform);
      else badge.content.removeAttribute("transform");
    }
    if (badge.frame) badge.frame.setAttribute("width", badge.textX - badge.x + width + badge.pad[0]);
  }

  #drawToggles() {
    const config = this.#config;
    this.#animate = { data: true, power: true, motion: true };
    this.#debugOn = config.debug_toggle ? storedOn(TOGGLE_KEYS.debug, Boolean(config.debug)) : Boolean(config.debug);
    const toggles = [
      ["data", "VLANs", config.vlan_toggle],
      ["power", "Power", config.power_toggle],
      ["motion", "Animations", config.animation_toggle],
      ["debug", "Debug", config.debug_toggle],
    ].filter(([, , on]) => on);
    if (toggles.length) {
      const box = htmlEl("div", config.toggles_at ? "toggles placed" : "toggles", this.#view);
      this.#togglesBox = box;
      const menu = htmlEl("button", "toggle-menu", box);
      menu.textContent = "⚙";
      menu.title = "Switches";
      menu.addEventListener("click", (ev) => {
        ev.stopPropagation();
        box.classList.toggle("open");
        this.#placeToggles();
      });
      for (const [kind, text] of toggles) {
        if (kind !== "debug") this.#animate[kind] = storedOn(TOGGLE_KEYS[kind]);
        const label = htmlEl("label", "toggle", box);
        const input = htmlEl("input", "", label);
        input.type = "checkbox";
        input.checked = kind === "debug" ? this.#debugOn : this.#animate[kind];
        htmlEl("span", "track", label);
        htmlEl("span", "", label).textContent = text;
        input.addEventListener("change", () => {
          storeOn(TOGGLE_KEYS[kind], input.checked);
          if (kind === "debug") {
            this.#debugOn = input.checked;
            this.#applyDebug();
            return;
          }
          this.#animate[kind] = input.checked;
          this.#applyAnimate();
        });
      }
    }
    this.#applyAnimate();
  }

  #toggleGroup(id) {
    if (this.#hiddenGroups.has(id)) this.#hiddenGroups.delete(id);
    else this.#hiddenGroups.add(id);
    storeGroups(this.#hiddenGroups);
    this.#applyGroups();
  }

  #applyGroups() {
    for (const [id, els] of this.#groupEls) {
      const display = this.#hiddenGroups.has(id) ? "none" : "";
      for (const el of els) if (el.style.display !== display) el.style.display = display;
    }
    for (const badge of this.#badges) {
      if (badge.dev.toggle) badge.text.style.fontWeight = this.#hiddenGroups.has(badge.dev.toggle) ? "700" : "";
    }
    if (!this.#frame && !this.#timer) this.#drawFx();
  }

  #isHidden(item) {
    return Boolean(item.group) && this.#hiddenGroups.has(item.group);
  }

  #applyAnimate() {
    for (const led of this.#leds) if (!this.#ledMoving(led)) led.lit = true;
    this.#stage.classList.toggle("still-data", !this.#animate.data);
    this.#stage.classList.toggle("still-power", !this.#animate.power);
    for (const line of this.#lines) if (line.multi && line.flow) line.path.classList.toggle("bare", !line.flow.off && this.#animate.data);
    this.#applyVisibility();
    if (!this.#frame && !this.#timer) this.#drawFx();
  }

  #drawLine(parent, line, radius, defs, index) {
    const { cfg, kind, pts, fade } = line;
    const d = roundedPath(pts, radius);
    const path = svgEl("path", { d, class: `lnk ${kind}`, "data-id": cfg.id }, parent);
    if (fade) {
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const area = {
        x: Math.min(...xs) - 10,
        y: Math.min(...ys) - 10,
        width: Math.max(...xs) - Math.min(...xs) + 20,
        height: Math.max(...ys) - Math.min(...ys) + 20,
      };
      const id = `hhm-fade-${index}`;
      const gradient = svgEl("linearGradient", {
        id: `${id}-g`,
        gradientUnits: "userSpaceOnUse",
        x1: fade.from[0],
        y1: fade.from[1],
        x2: fade.to[0],
        y2: fade.to[1],
      }, defs);
      svgEl("stop", { offset: 0, "stop-color": "#fff" }, gradient);
      svgEl("stop", { offset: 1, "stop-color": "#000" }, gradient);
      const mask = svgEl("mask", { id, maskUnits: "userSpaceOnUse", ...area }, defs);
      svgEl("rect", { ...area, fill: "#fff" }, mask);
      svgEl("polygon", { points: fade.band.map((p) => p.join(",")).join(" "), fill: `url(#${id}-g)` }, mask);
      path.setAttribute("mask", `url(#${id})`);
    }
    const vlanColors = kind === "data" ? (cfg.vlans || []).map((name) => this.#config.vlans[name]) : [];
    const colors = kind === "power" ? [POWER_COLOR] : vlanColors.length ? vlanColors : ["var(--hhm-accent)"];
    const dashed = vlanColors.length > 0;
    const flow = cfg.flow ? this.#addFlow(d, colors, dashed, kind) : null;
    if (flow) flow.fade = fade;
    this.#lines.push({ cfg, kind, path, flow, multi: dashed && colors.length > 1 });
  }

  #drawRates(parent, { cfg, pts }) {
    const fraction = cfg.rates_at === "start" ? 0 : cfg.rates_at === "end" ? 1 : cfg.rates_at / 100;
    const { at, dir } = pointAlong(pts, fraction);
    const vertical = Math.abs(dir[1]) > Math.abs(dir[0]);
    const along = vertical ? -dir[1] : dir[0];
    const size = cfg.rates_size ?? RATES.size;
    const gap = RATES.gap;
    const mode = cfg.rates_at === "start" ? (along >= 0 ? "after" : "before") : cfg.rates_at === "end" ? (along >= 0 ? "before" : "after") : "centre";
    const keys = ["rx", "tx"].filter((key) => cfg[key]);
    const step = size * RATES.lineGap;
    const placement = cfg.rates_placement ?? "middle";
    const offsets = keys.map((key, i) => {
      if (placement === "middle") return keys.length === 1 || key === "rx" ? -gap : gap + size * 0.8;
      if (placement === "above") return -gap - (keys.length - 1 - i) * step;
      return gap + size * 0.8 + i * step;
    });
    const transform = `translate(${at[0]},${at[1]})${vertical ? " rotate(-90)" : ""}`;
    const text = svgEl("text", { class: "rates", transform, "data-id": cfg.id }, parent);
    text.style.fontSize = `${size}px`;
    const spans = keys.map((key, i) => {
      const span = svgEl("tspan", { x: 0, y: offsets[i], class: "clickable" }, text);
      span.dataset.entity = cfg[key];
      return { key, arrow: key === "rx" ? "↓" : "↑", span };
    });
    this.#rates.push({ cfg, spans, mode, gap, size });
  }

  #updateRates(rate) {
    let changed = !rate.measured;
    for (const { key, arrow, span } of rate.spans) {
      const value = toKBps(this.#state(rate.cfg[key]));
      const text = `${arrow} ${Number.isNaN(value) ? "—" : formatRate(value)}`;
      if (span.textContent === text) continue;
      span.textContent = text;
      changed = true;
    }
    if (!changed) return;
    const measured = rate.spans.map(({ span }) => textLength(span));
    rate.measured = measured.every((w) => w > 0);
    const block = Math.max(...measured.map((w, i) => w || rate.spans[i].span.textContent.length * rate.size * 0.55));
    const x = rate.mode === "after" ? rate.gap : rate.mode === "before" ? -rate.gap - block : -block / 2;
    for (const { span } of rate.spans) if (span.getAttribute("x") !== String(x)) span.setAttribute("x", x);
  }

  #addFlow(d, colors, dashed, kind) {
    const n = colors.length;
    const len = dashed ? (n > 1 ? FX.period : FX.period / 2) : 2;
    const cycle = FX.period * n;
    const dash = { cycle, core: [len, cycle - len] };
    const flow = { d, colors, dashed, dash, kind, seconds: 2.4, reverse: false, off: false, phase: 0, paint: null, path: null, fade: null, faded: null };
    this.#flows.push(flow);
    return flow;
  }

  #drawDebug(svg, defs, badges, extras) {
    const { minX, minY, width, height } = this.#viewBox;
    const pattern = svgEl("pattern", { id: "hhm-grid", width: 50, height: 50, patternUnits: "userSpaceOnUse" }, defs);
    svgEl("path", { d: "M50 0H0V50", fill: "none", stroke: "#ff4081", "stroke-opacity": 0.35, "stroke-width": 0.6 }, pattern);
    for (let k = 10; k < 50; k += 10) {
      svgEl("path", { d: `M${k} 0V50M0 ${k}H50`, fill: "none", stroke: "#ff4081", "stroke-opacity": 0.12, "stroke-width": 0.4 }, pattern);
    }
    const layer = svgEl("g", { class: "dbg-grid" }, svg);
    this.#debugLayer = layer;
    svgEl("rect", { x: minX, y: minY, width, height, fill: "url(#hhm-grid)" }, layer);
    for (const b of this.#boxes) {
      svgEl("rect", { class: "dbg-box", x: b.x, y: b.y, width: b.w, height: b.h }, layer);
    }
    for (const b of extras) svgEl("rect", { class: "dbg-box", x: b.x, y: b.y, width: b.w, height: b.h }, layer);
    for (const c of this.#chips) {
      svgEl("circle", { class: "dbg-box", cx: c.cx, cy: c.cy, r: c.r - 1 }, layer);
    }
    for (const b of badges) {
      svgEl("circle", { cx: b.x, cy: b.y, r: 1.5, fill: "#ff4081" }, layer);
    }
    const tip = htmlEl("div", "dbg-tip", this.#view);
    this.#debugTip = tip;
    svg.addEventListener("mousemove", (ev) => {
      const ctm = svg.getScreenCTM?.();
      if (!ctm || !this.#debugOn) return;
      const pt = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(ctm.inverse());
      const hit = this.#boxes.filter((b) => pt.x >= b.x && pt.x <= b.x + b.w && pt.y >= b.y && pt.y <= b.y + b.h).pop();
      const local = hit ? ` · ${hit.dev.id}: ${Math.round(pt.x - hit.x)}, ${Math.round(pt.y - hit.y)}` : "";
      const item = ev.target?.closest?.("[data-id]")?.dataset.id;
      tip.textContent = `${Math.round(pt.x)}, ${Math.round(pt.y)}${local}${item ? `\n${item}` : ""}`;
      const rect = this.#view.getBoundingClientRect();
      tip.style.left = `${ev.clientX - rect.left + 12}px`;
      tip.style.top = `${ev.clientY - rect.top + 12}px`;
      tip.style.display = "block";
    });
    svg.addEventListener("mouseleave", () => {
      tip.style.display = "none";
    });
  }

  #applyDebug() {
    if (this.#debugLayer) this.#debugLayer.style.display = this.#debugOn ? "" : "none";
    if (this.#debugTip && !this.#debugOn) this.#debugTip.style.display = "none";
  }

  #update() {
    if (!this.#built || !this.#hass) return;
    for (const badge of this.#badges) this.#updateBadge(badge);
    for (const chip of this.#chips) this.#updateChip(chip);
    for (const led of this.#leds) this.#updateLed(led);
    for (const rate of this.#rates) this.#updateRates(rate);
    for (const label of this.#labels) if (!label.measured) this.#layoutLabel(label);
    for (const port of this.#ports) this.#updatePort(port);
    for (const frame of this.#frames) this.#updateFrame(frame);
    for (const pool of this.#pools) this.#updatePool(pool);
    for (const disk of this.#disks) this.#updateDisk(disk);
    for (const fan of this.#fans) this.#updateFan(fan);
    for (const line of this.#lines) this.#updateLine(line);
    if (!this.#frame && !this.#timer) this.#drawFx();
  }

  #updateLine(line) {
    const { cfg, kind, flow, path } = line;
    const status = cfg.status ?? "active";
    const down = kind === "data" && (status === "inactive" || (isEntity(status) && !this.#isUp(status)));
    path.classList.toggle("down", down);
    if (!flow) return;
    const rx = cfg.rx ? toKBps(this.#state(cfg.rx)) : NaN;
    const tx = cfg.tx ? toKBps(this.#state(cfg.tx)) : NaN;
    const metered = kind === "data" && Boolean(cfg.rx || cfg.tx);
    const traffic = orZero(rx) + orZero(tx);
    flow.off = down || (metered && traffic <= 0);
    flow.seconds = Number(flowSeconds(traffic, metered).toFixed(2));
    flow.reverse = cfg.flow === "reverse" || (cfg.flow === "dominant" && orZero(rx) > orZero(tx));
    if (line.multi) path.classList.toggle("bare", !flow.off && this.#animate.data);
  }

  #tick = (now) => this.#loop(now);

  #resume = () => {
    this.#timer = 0;
    this.#frame = requestAnimationFrame(this.#tick);
  };

  #applyVisibility() {
    const moving = this.#animate.motion &&
      (this.#flows.length > 0 || this.#leds.some((led) => led.dev.effect !== "none") || this.#disks.some((d) => d.spin) || this.#fans.length > 0);
    const animated = moving || (this.#animate.motion && this.#chips.some((c) => c.dev.status_entity || c.dev.update_entity));
    const run = this.#visible && this.isConnected && this.#built && animated && !reducedMotion();
    if (run && !this.#frame && !this.#timer) {
      this.#lastFrame = performance.now();
      this.#frame = requestAnimationFrame(this.#tick);
    } else if (!run && (this.#frame || this.#timer)) {
      cancelAnimationFrame(this.#frame);
      clearTimeout(this.#timer);
      this.#frame = 0;
      this.#timer = 0;
    }
  }

  #loop(now) {
    this.#frame = 0;
    this.#timer = setTimeout(this.#resume, 1000 / FX.fps - 4);
    const dt = Math.min(0.25, (now - this.#lastFrame) / 1000);
    this.#lastFrame = now;
    if (this.#animate.motion) { for (const flow of this.#flows) flow.phase = (flow.phase + dt / (flow.seconds * flow.colors.length)) % 1; }
    for (const led of this.#leds) {
      if (!this.#ledMoving(led)) {
        led.lit = true;
        continue;
      }
      led.left -= dt;
      if (led.left > 0) continue;
      led.lit = !led.lit;
      led.left = led.dev.effect === "blink" ? LED.blink : randomIn(led.lit ? LED.on : LED.off);
    }
    this.#blinkPhase = (this.#blinkPhase + dt / CHIP.blinkSeconds) % 2;
    if (this.#animate.motion) {
      for (const { spin } of this.#disks) if (spin && !spin.stopped) spin.angle = (spin.angle + (2 * Math.PI * dt) / DISK.spinSeconds) % (2 * Math.PI);
      for (const fan of this.#fans) {
        if (!fan.rps || this.#isHidden(fan)) continue;
        for (const rotor of fan.rotors) {
          rotor.angle = (rotor.angle + 360 * fan.rps * dt) % 360;
          rotor.el.setAttribute("transform", `rotate(${rotor.angle.toFixed(1)} ${rotor.cx} ${rotor.cy})`);
        }
      }
    }
    this.#drawFx();
  }

  #context() {
    if (!this.#canvas || typeof Path2D === "undefined") return null;
    this.#ctx = this.#ctx || this.#canvas.getContext("2d");
    return this.#ctx;
  }

  #placeFx() {
    if (!this.#canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const stage = this.#stage.getBoundingClientRect();
    const view = this.#view.getBoundingClientRect();
    this.#origin = [((stage.left || 0) - (view.left || 0)) * dpr, ((stage.top || 0) - (view.top || 0)) * dpr];
  }

  #resizeFx() {
    if (!this.#canvas || !this.#viewBox) return;
    const view = this.#view.getBoundingClientRect();
    const stage = this.#stage.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.round(view.width * dpr);
    const height = Math.round(view.height * dpr);
    if (!width || !height || !stage.width) return;
    if (this.#canvas.width !== width) this.#canvas.width = width;
    if (this.#canvas.height !== height) this.#canvas.height = height;
    this.#scale = (stage.width / this.#viewBox.width) * dpr;
    this.#placeFx();
    if (this.#painted) {
      this.#drawFx();
      return;
    }
    this.#painted = true;
    for (const flow of this.#flows) {
      flow.paint = flow.colors.map((c) => resolveColor(c, this));
      flow.faded = null;
    }
    const background = resolveColor("var(--hhm-bg, #1c1c1c)", this);
    const grey = resolveColor("var(--hhm-text-dim, #9b9b9b)", this);
    this.#ledPaint = { dark: mixColor(grey, background, LED.dark) };
    for (const led of this.#leds) {
      led.off = mixColor(resolveColor(led.color, this), background, LED.dim);
      if (led.down) led.rect.setAttribute("fill", this.#ledPaint.dark);
    }
    this.#ringPaint = { down: resolveColor("var(--error-color, #db4437)", this), update: resolveColor("var(--success-color, #43a047)", this) };
    this.#drawFx();
  }

  #drawRings(ctx) {
    if (!this.#ringPaint) return;
    const still = reducedMotion() || !this.#animate.motion;
    const cycle = still ? 0 : Math.floor(this.#blinkPhase + 0.5) % 2;
    const pulse = still ? 1 : 0.575 + 0.425 * Math.cos(2 * Math.PI * this.#blinkPhase);
    ctx.lineWidth = 1.5;
    for (const chip of this.#chips) {
      if ((!chip.down && !chip.update) || this.#isHidden(chip)) continue;
      const kind = chip.down && chip.update ? (cycle ? "update" : "down") : chip.down ? "down" : "update";
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = this.#ringPaint[kind];
      const cut = chip.count?.shown;
      if (cut) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(chip.cx - chip.r - 2, chip.cy - chip.r - 2, 2 * chip.r + 4, 2 * chip.r + 4);
        ctx.arc(chip.count.cx, chip.count.cy, chip.count.r, 0, 2 * Math.PI);
        ctx.clip("evenodd");
      }
      ctx.beginPath();
      ctx.arc(chip.cx, chip.cy, chip.r, 0, 2 * Math.PI);
      ctx.stroke();
      if (cut) ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  #strokeFlow(ctx, flow, paints) {
    const { cycle, core } = flow.dash;
    ctx.lineCap = flow.dashed ? "butt" : "round";
    for (let ci = 0; ci < paints.length; ci++) {
      ctx.strokeStyle = paints[ci];
      ctx.setLineDash(core);
      ctx.lineDashOffset = (flow.reverse ? 1 : -1) * cycle * flow.phase - FX.period * ci;
      ctx.stroke(flow.path);
    }
  }

  #drawFx() {
    const ctx = this.#context();
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    const k = this.#scale;
    ctx.setTransform(k, 0, 0, k, this.#origin[0] - this.#viewBox.minX * k, this.#origin[1] - this.#viewBox.minY * k);
    ctx.lineWidth = FX.lineWidth;
    ctx.lineJoin = "round";
    for (const flow of this.#flows) {
      if (flow.off || !flow.paint || !this.#animate[flow.kind]) continue;
      flow.path = flow.path || new Path2D(flow.d);
      if (!flow.fade) {
        this.#strokeFlow(ctx, flow, flow.paint);
        continue;
      }
      const { band, from, to } = flow.fade;
      const vb = this.#viewBox;
      ctx.save();
      ctx.beginPath();
      ctx.rect(vb.minX, vb.minY, vb.width, vb.height);
      band.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.clip("evenodd");
      this.#strokeFlow(ctx, flow, flow.paint);
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      band.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.clip();
      flow.faded = flow.faded || flow.paint.map((color) => {
        const rgb = (toRgb(color) || [128, 128, 128]).join(",");
        const gradient = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);
        gradient.addColorStop(0, `rgba(${rgb},1)`);
        gradient.addColorStop(1, `rgba(${rgb},0)`);
        return gradient;
      });
      this.#strokeFlow(ctx, flow, flow.faded);
      ctx.restore();
    }
    ctx.setLineDash(NO_DASH);
    this.#drawRings(ctx);
    for (const { spin } of this.#disks) {
      if (!spin) continue;
      ctx.fillStyle = "rgba(255,255,255,0.32)";
      ctx.beginPath();
      ctx.moveTo(spin.cx, spin.cy);
      ctx.arc(spin.cx, spin.cy, spin.r * 0.96, spin.angle, spin.angle + DISK.sheen);
      ctx.closePath();
      ctx.fill();
    }
    for (const led of this.#leds) {
      if (led.down || !led.off || led.lit || this.#isHidden(led)) continue;
      ctx.fillStyle = led.off;
      ctx.fillRect(led.x, led.y, led.w, led.h);
    }
  }
}

if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, HaHomelabMap);
  window.customCards = window.customCards || [];
  window.customCards.push({ type: CARD_TYPE, name: "Homelab Map", description: "A hand-placed, live map of your homelab.", preview: false });
  console.info(`%c HA-HOMELAB-MAP %c ${VERSION} `, "background:#0f7fa8;color:#fff", "");
}
