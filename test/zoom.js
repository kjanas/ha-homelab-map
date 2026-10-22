load(H + "/harness.js");
window.addEventListener = () => {};
window.removeEventListener = () => {};
window.matchMedia = () => ({ matches: false });
window.innerHeight = 900;
window.devicePixelRatio = 2;
var frames = [],
  requestAnimationFrame = (f) => 1,
  cancelAnimationFrame = () => {},
  now = 0,
  performance = { now: () => now },
  setTimeout = () => 1,
  clearTimeout = () => {};
var getComputedStyle = () => ({ getPropertyValue: () => "" });
var Path2D = class {
  constructor(d) {
    this.d = d;
  }
};
Node_.prototype.getContext = () =>
  new Proxy({}, {
    get: (t, k) => (k in t ? t[k] : (...a) => (k === "createLinearGradient" ? { addColorStop() {} } : undefined)),
    set: (t, k, v) => {
      t[k] = v;
      return true;
    },
  });
const handlers = new Map();
Node_.prototype.addEventListener = function (type, fn) {
  this.listeners++;
  (handlers.get(this) || handlers.set(this, {}).get(this))[type] = fn;
};
Node_.prototype.setPointerCapture = () => {};
loadString(readFile(CARD).replace(/import\.meta\.url/g, '"file:///x.js"'));
const card = new CardClass();
const all = () => card.shadowRoot.querySelectorAll("div");
card.setConfig({ items: [{ type: "device", id: "a", at: [0, 0], size: [1000, 500] }] });
const view = all().find((d) => d.attrs.class === "view"),
  scroller = all().find((d) => /scroller/.test(d.attrs.class)),
  stage = all().find((d) => d.attrs.class && /stage/.test(d.attrs.class));
Object.defineProperty(view, "clientWidth", { get: () => 390 });
let svgW = () => parseFloat(card.shadowRoot.querySelector("svg").style._p.width);
view.getBoundingClientRect = () => ({ left: 0, top: 0, width: 390, height: 300 });
scroller.getBoundingClientRect = () => ({ left: 0, top: 0, width: 390, height: 300 });
stage.getBoundingClientRect = () => {
  const w = svgW();
  return { left: -scroller.scrollLeft || 0, top: -scroller.scrollTop || 0, width: w, height: w * 540 / 1040 };
};
card.hass = { states: {} };
const h = handlers.get(scroller), card0 = card.shadowRoot.children.find((c) => c.tag === "ha-card");
const ev = (o) => ({ pointerType: "touch", button: 0, target: scroller, preventDefault() {}, stopPropagation() {}, ...o });
const seen = [];
const log = (l) => seen.push(`${Math.round(svgW())}/${Math.round(scroller.scrollLeft || 0)},${Math.round(scroller.scrollTop || 0)}`);
log("fit to phone");
for (const t of [0, 200]) {
  now = t;
  h.pointerdown(ev({ pointerId: 1, clientX: 300, clientY: 150 }));
  h.pointerup(ev({ pointerId: 1, clientX: 300, clientY: 150 }));
}
log("double-tap at 300,150");
h.wheel(ev({ ctrlKey: true, deltaY: -40, clientX: 100, clientY: 100 }));
log("ctrl+wheel in");
now = 5000;
h.pointerdown(ev({ pointerId: 1, clientX: 100, clientY: 150 }));
h.pointerdown(ev({ pointerId: 2, clientX: 200, clientY: 150 }));
h.pointermove(ev({ pointerId: 2, clientX: 300, clientY: 150 }));
h.pointerup(ev({ pointerId: 2, clientX: 300, clientY: 150 }));
h.pointerup(ev({ pointerId: 1, clientX: 100, clientY: 150 }));
log("pinch x2");
now = 9000;
h.pointerdown(ev({ pointerId: 3, clientX: 200, clientY: 200 }));
h.pointermove(ev({ pointerId: 3, clientX: 120, clientY: 160 }));
h.pointerup(ev({ pointerId: 3, clientX: 120, clientY: 160 }));
log("drag left/up 80,40");
let clicked = 0;
const cap = {
  stopPropagation() {
    clicked = -1;
  },
  preventDefault() {},
};
handlers.get(card0).click(cap);
seen.push(`suppressed ${clicked === -1}`);
for (let i = 0; i < 30; i++) h.wheel(ev({ ctrlKey: true, deltaY: -50, clientX: 100, clientY: 100 }));
log("max zoom");
for (const t of [20000, 20200]) {
  now = t;
  h.pointerdown(ev({ pointerId: 4, clientX: 50, clientY: 50 }));
  h.pointerup(ev({ pointerId: 4, clientX: 50, clientY: 50 }));
}
log("double-tap at max → reset");
const want = "390/0,0 975/450,225 1455/721,385 2909/1640,919 2909/1720,959 suppressed true 4160/2503,1415 390/0,0";
print(seen.join(" ") === want ? "ok   pan & zoom (double-tap, ctrl+wheel, pinch, drag, click suppression, max, reset)" : `FAIL pan & zoom: ${seen.join(" ")}`);
h.wheel(ev({ ctrlKey: true, deltaY: -40, clientX: 100, clientY: 100 }));
const mouse = (o) => ev({ pointerType: "mouse", ...o });
const scrolled = () => `${Math.round(scroller.scrollLeft || 0)},${Math.round(scroller.scrollTop || 0)}`;
const before = scrolled();
h.pointerdown(mouse({ pointerId: 5, clientX: 100, clientY: 100 }));
h.pointerleave(mouse({ pointerId: 5, clientX: 100, clientY: 100 }));
h.pointermove(mouse({ pointerId: 5, clientX: 20, clientY: 20 }));
const afterLeave = scrolled();
h.pointerdown(mouse({ pointerId: 6, clientX: 100, clientY: 100 }));
h.pointermove(mouse({ pointerId: 6, clientX: 80, clientY: 100 }));
const panned = scrolled();
h.lostpointercapture(mouse({ pointerId: 6 }));
h.pointermove(mouse({ pointerId: 6, clientX: 20, clientY: 100 }));
const afterLost = scrolled();
print(
  before === afterLeave && panned !== before && afterLost === panned
    ? "ok   a mouse press that leaves the card or loses capture stops panning"
    : `FAIL stale pan: ${before} ${afterLeave} ${panned} ${afterLost}`,
);
const placed = (at) => {
  const c = new CardClass();
  c.setConfig({ debug_toggle: true, toggles_at: at, items: [{ type: "device", id: "a", at: [0, 0], size: [1000, 500] }] });
  const divs = c.shadowRoot.querySelectorAll("div");
  const v = divs.find((d) => d.attrs.class === "view"), st = divs.find((d) => d.attrs.class && /stage/.test(d.attrs.class));
  Object.defineProperty(v, "clientWidth", { get: () => 390 });
  v.getBoundingClientRect = () => ({ left: 0, top: 0, width: 390, height: 300 });
  st.getBoundingClientRect = () => ({ left: 0, top: 0, width: 390, height: 390 * 540 / 1040 });
  c.hass = { states: {} };
  const box = c.shadowRoot.querySelectorAll("div").find((d) => /\btoggles\b/.test(d.attrs.class || ""));
  return `${box.attrs.class}@${box.style._p.left},${box.style._p.top}`;
};
const got = [placed([500, 100]), placed([5000, -500])].join(" ");
print(
  got === "toggles placed compact@195px,45px toggles placed compact@390px,0px"
    ? "ok   toggles_at (map position, clamped to the view)"
    : `FAIL toggles_at: ${got}`,
);
