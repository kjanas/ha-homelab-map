load(H + "/harness.js");
let seed = 7;
Math.random = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
const THEME = {
  "--hhm-bg": "#1c1c1c",
  "--primary-text-color": "#e1e1e1",
  "--secondary-text-color": "#9b9b9b",
  "--card-background-color": "#1c1c1c",
  "--ha-card-background": "#1c1c1c",
  "--secondary-background-color": "#282828",
  "--divider-color": "rgba(225,225,225,0.12)",
  "--primary-color": "#03a9f4",
  "--success-color": "#43a047",
  "--warning-color": "#ffa600",
  "--error-color": "#db4437",
  "--info-color": "#039be5",
  "--ha-font-family-body": "-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif",
};
var getComputedStyle = () => ({ getPropertyValue: (k) => THEME[k] || "" });
var frames = [];
var requestAnimationFrame = (f) => {
    frames.push(f);
    return frames.length;
  },
  cancelAnimationFrame = () => {},
  performance = { now: () => 0 };
var setTimeout = (f) => {
    return 1;
  },
  clearTimeout = () => {};
window.matchMedia = () => ({ matches: false });
window.devicePixelRatio = 1;
window.addEventListener = () => {};
window.removeEventListener = () => {};
window.innerHeight = 4000;
const flagText = FLAGSFILE ? readFile(FLAGSFILE) : "";
const store = Object.assign({}, JSON.parse(flagText.trim() || "{}"));
window.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => {
    store[k] = String(v);
  },
};
const W = {
  "0123456789": 0.556,
  ".,:;'|!il": 0.26,
  " ": 0.278,
  "%": 0.89,
  "°": 0.4,
  "↓↑": 0.6,
  "MW": 0.83,
  "ABCDEFGHKNOPQRSUVXYZ": 0.67,
  "IJ": 0.3,
  "mw": 0.8,
  "abcdeghknopqsuvxyz": 0.53,
  "frt": 0.33,
  "-()/+": 0.33,
};
const cw = (ch) => {
  for (const [k, v] of Object.entries(W)) if (k.includes(ch)) return v;
  return 0.55;
};
Node_.prototype.getComputedTextLength = function () {
  let fs = 10, bold = 1;
  const cls = this.attrs.class || "";
  if (/\bname\b/.test(cls)) {
    fs = 12;
    bold = 1.07;
  }
  const ts = this.children.find((c) => c.tag === "tspan");
  if (ts && ts.style._p.fontSize) fs = parseFloat(ts.style._p.fontSize);
  if (this.style._p.fontSize) fs = parseFloat(this.style._p.fontSize);
  if (/vlabel|llabel/.test(cls)) fs = 8;
  return [...this.textContent].reduce((s, ch) => s + (cfg.font ? 0.6 : cw(ch)), 0) * fs * (cfg.font ? 1 : bold);
};
const mul = (
  m,
  n,
) => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];
const inv = (m) => {
  const d = m[0] * m[3] - m[1] * m[2];
  return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d];
};
const f3 = (v) => +(+v).toFixed(3);
class PathB {
  constructor(d) {
    this.d = typeof d === "string" ? d : "";
    this.cur = null;
  }
  moveTo(x, y) {
    this.d += `M${f3(x)} ${f3(y)}`;
    this.cur = [x, y];
  }
  lineTo(x, y) {
    this.d += `L${f3(x)} ${f3(y)}`;
    this.cur = [x, y];
  }
  quadraticCurveTo(cx, cy, x, y) {
    this.d += `Q${f3(cx)} ${f3(cy)} ${f3(x)} ${f3(y)}`;
    this.cur = [x, y];
  }
  closePath() {
    this.d += "Z";
  }
  arc(x, y, r, a0, a1, ccw) {
    const sx = x + r * Math.cos(a0), sy = y + r * Math.sin(a0);
    let span = ccw ? a0 - a1 : a1 - a0;
    if (Math.abs(span) >= 2 * Math.PI - 1e-6) {
      this.d += `${this.cur ? "L" : "M"}${f3(x + r)} ${f3(y)}A${f3(r)} ${f3(r)} 0 1 1 ${f3(x - r)} ${f3(y)}A${f3(r)} ${f3(r)} 0 1 1 ${f3(x + r)} ${f3(y)}`;
      this.cur = [x + r, y];
      return;
    }
    while (span < 0) span += 2 * Math.PI;
    const ex = x + r * Math.cos(a1), ey = y + r * Math.sin(a1);
    this.d += `${this.cur ? "L" : "M"}${f3(sx)} ${f3(sy)}A${f3(r)} ${f3(r)} 0 ${span > Math.PI ? 1 : 0} ${ccw ? 0 : 1} ${f3(ex)} ${f3(ey)}`;
    this.cur = [ex, ey];
  }
}
var Path2D = PathB;
function makeCtx() {
  const out = [];
  let M = [1, 0, 0, 1, 0, 0], B = [1, 0, 0, 1, 0, 0], stack = [], path = new PathB();
  const st = { globalAlpha: 1, strokeStyle: "#000", fillStyle: "#000", lineWidth: 1, lineCap: "butt", lineDashOffset: 0, dash: [] };
  const tf = () => {
    const t = mul(inv(B), M);
    return t.every((v, i) => Math.abs(v - [1, 0, 0, 1, 0, 0][i]) < 1e-9) ? "" : ` transform="matrix(${t.map(f3).join(" ")})"`;
  };
  const col = (c) => (typeof c === "string" ? c : "#888");
  const ctx = {
    out,
    setTransform(a, b, c, d, e, f) {
      M = [a, b, c, d, e, f];
      if (!(a === 1 && d === 1 && e === 0 && f === 0)) B = M.slice();
    },
    translate(x, y) {
      M = mul(M, [1, 0, 0, 1, x, y]);
    },
    rotate(a) {
      M = mul(M, [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
    },
    scale(x, y) {
      M = mul(M, [x, 0, 0, y, 0, 0]);
    },
    save() {
      stack.push([M.slice(), { ...st, dash: st.dash.slice() }]);
    },
    restore() {
      const [m, s] = stack.pop();
      M = m;
      Object.assign(st, s);
    },
    clearRect(x, y) {
      if (x === 0 && y === 0 && M[4] === 0 && M[5] === 0 && M[0] === 1) out.length = 0;
    },
    beginPath() {
      path = new PathB();
    },
    moveTo(x, y) {
      path.moveTo(x, y);
    },
    lineTo(x, y) {
      path.lineTo(x, y);
    },
    arc(...a) {
      path.arc(...a);
    },
    closePath() {
      path.closePath();
    },
    rect(x, y, w, h) {
      path.moveTo(x, y);
      path.lineTo(x + w, y);
      path.lineTo(x + w, y + h);
      path.lineTo(x, y + h);
      path.closePath();
    },
    clip(rule) {
      const id = "c" + out.length;
      out.push(`<clipPath id="${id}"><path d="${path.d}" clip-rule="${rule === "evenodd" ? "evenodd" : "nonzero"}"${tf()}/></clipPath>`);
      st.clip = id;
    },
    setLineDash(a) {
      st.dash = Array.from(a);
    },
    createLinearGradient(x1, y1, x2, y2) {
      const g = {
        id: "g" + out.length + "x" + Math.round(x1 * 7 + y1),
        x1,
        y1,
        x2,
        y2,
        stops: [],
        addColorStop(o, c) {
          this.stops.push([o, c]);
        },
      };
      return g;
    },
    stroke(p) {
      const d = (p || path).d;
      if (!d) return;
      const dash = st.dash.length ? ` stroke-dasharray="${st.dash.map(f3).join(" ")}" stroke-dashoffset="${f3(st.lineDashOffset)}"` : "";
      let stroke = col(st.strokeStyle), defs = "";
      if (typeof st.strokeStyle === "object" && st.strokeStyle.stops) {
        const g = st.strokeStyle;
        defs = `<defs><linearGradient id="${g.id}" gradientUnits="userSpaceOnUse" x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}">${
          g.stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")
        }</linearGradient></defs>`;
        stroke = `url(#${g.id})`;
      }
      out.push(
        `${defs}<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${f3(st.lineWidth)}" stroke-linecap="${st.lineCap}" opacity="${
          f3(st.globalAlpha)
        }"${dash}${st.clip ? ` clip-path="url(#${st.clip})"` : ""}${tf()}/>`,
      );
    },
    fill(p) {
      const d = (p || path).d;
      if (d) out.push(`<path d="${d}" fill="${col(st.fillStyle)}" opacity="${f3(st.globalAlpha)}"${tf()}/>`);
    },
    fillRect(x, y, w, h) {
      out.push(`<rect x="${f3(x)}" y="${f3(y)}" width="${f3(w)}" height="${f3(h)}" fill="${col(st.fillStyle)}" opacity="${f3(st.globalAlpha)}"${tf()}/>`);
    },
    drawImage(img, x, y, w, h) {
      out.push(`<image href="${img.src}" x="${x}" y="${y}" width="${w}" height="${h}"${tf()}/>`);
    },
  };
  return new Proxy(ctx, {
    get: (t, k) => (k in t ? t[k] : st[k]),
    set: (t, k, v) => {
      st[k] = v;
      return true;
    },
  });
}
Node_.prototype.getContext = function () {
  return (this._ctx = this._ctx || makeCtx());
};
loadString(readFile(CARD).replace(/import\.meta\.url/g, JSON.stringify("file://" + CARD)));
const cfg = JSON.parse(readFile(CFG));
const states = {};
for (const [id, v] of Object.entries(JSON.parse(readFile(STATES)))) {
  states[id] = { entity_id: id, state: String(v.state ?? v), attributes: v.attributes || {}, last_changed: "" };
}
const card = new CardClass();
card.setConfig(cfg);
card.hass = { states };
const stage = card.shadowRoot.querySelectorAll("div").find((d) => /\bstage\b/.test(d.attrs.class || ""));
for (let i = 0; i < (FRAMES || 2); i++) {
  const q = frames.splice(0);
  for (const f of q) f(400 * (i + 1));
}
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const FAMILY = cfg.font
  ? `'${cfg.font}', 'JetBrainsMono Nerd Font', -apple-system, sans-serif`
  : "-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif";
function monogram(n) {
  const name = (/([^/]+?)(\.[a-z0-9]+)?(\?.*)?$/i.exec(n.attrs.href || "") || [])[1] || "?";
  const w = +n.attrs.width, h = +n.attrs.height, x = +n.attrs.x, y = +n.attrs.y;
  return `<text x="${f3(x + w / 2)}" y="${f3(y + h * 0.78)}" text-anchor="middle" font-size="${
    f3(h * 0.85)
  }" font-weight="700" font-family="${FAMILY}" fill="#c8ced6">${esc(name[0].toUpperCase())}</text>`;
}
const RENDER_ICONS = {
  "mdi:docker":
    "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z",
  "mdi:calendar-today": "M7,10H12V15H7M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z",
  "mdi:calendar-month":
    "M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z",
  "mdi:cctv":
    "M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z",
  "mdi:water-percent":
    "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
  "mdi:update":
    "M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z",
  "mdi:account": "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",
  "mdi:battery": "M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:clock-outline":
    "M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z",
  "mdi:cpu-64-bit":
    "M9,3V5H7A2,2 0 0,0 5,7V9H3V11H5V13H3V15H5V17A2,2 0 0,0 7,19H9V21H11V19H13V21H15V19H17A2,2 0 0,0 19,17V15H21V13H19V11H21V9H19V7A2,2 0 0,0 17,5H15V3H13V5H11V3M8,9H11.5V10.5H8.5V11.25H10.5A1,1 0 0,1 11.5,12.25V14A1,1 0 0,1 10.5,15H8A1,1 0 0,1 7,14V10A1,1 0 0,1 8,9M12.5,9H14V11H15.5V9H17V15H15.5V12.5H12.5M8.5,12.75V13.5H10V12.75",
  "mdi:download": "M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z",
  "mdi:ethernet":
    "M7,15H9V18H11V15H13V18H15V15H17V18H19V9H15V6H9V9H5V18H7V15M4.38,3H19.63C20.94,3 22,4.06 22,5.38V19.63A2.37,2.37 0 0,1 19.63,22H4.38C3.06,22 2,20.94 2,19.63V5.38C2,4.06 3.06,3 4.38,3Z",
  "mdi:flash": "M7,2V13H10V22L17,10H13L17,2H7Z",
  "mdi:gauge":
    "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.81,9.77L11.71,10C11,10.13 10.41,10.6 10.14,11.26C9.73,12.29 10.23,13.45 11.26,13.86C12.29,14.27 13.45,13.77 13.86,12.74C14.12,12.08 14,11.32 13.57,10.76L13.67,10.5L14.96,7.29L14.97,7.26C15.17,6.75 14.92,6.17 14.41,5.96C14.28,5.91 14.15,5.89 14,5.89M10,6A1,1 0 0,0 9,7A1,1 0 0,0 10,8A1,1 0 0,0 11,7A1,1 0 0,0 10,6M7,9A1,1 0 0,0 6,10A1,1 0 0,0 7,11A1,1 0 0,0 8,10A1,1 0 0,0 7,9M17,9A1,1 0 0,0 16,10A1,1 0 0,0 17,11A1,1 0 0,0 18,10A1,1 0 0,0 17,9Z",
  "mdi:harddisk":
    "M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M12,4A6,6 0 0,0 6,10C6,13.31 8.69,16 12.1,16L11.22,13.77C10.95,13.29 11.11,12.68 11.59,12.4L12.45,11.9C12.93,11.63 13.54,11.79 13.82,12.27L15.74,14.69C17.12,13.59 18,11.9 18,10A6,6 0 0,0 12,4M12,9A1,1 0 0,1 13,10A1,1 0 0,1 12,11A1,1 0 0,1 11,10A1,1 0 0,1 12,9M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M12.09,13.27L14.58,19.58L17.17,18.08L12.95,12.77L12.09,13.27Z",
  "mdi:memory":
    "M17,17H7V7H17M21,11V9H19V7C19,5.89 18.1,5 17,5H15V3H13V5H11V3H9V5H7C5.89,5 5,5.89 5,7V9H3V11H5V13H3V15H5V17A2,2 0 0,0 7,19H9V21H11V19H13V21H15V19H17A2,2 0 0,0 19,17V15H21V13H19V11M13,13H11V11H13M15,9H9V15H15V9Z",
  "mdi:power-plug": "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z",
  "mdi:sine-wave":
    "M16.5,21C13.5,21 12.31,16.76 11.05,12.28C10.14,9.04 9,5 7.5,5C4.11,5 4,11.93 4,12H2C2,11.63 2.06,3 7.5,3C10.5,3 11.71,7.25 12.97,11.74C13.83,14.8 15,19 16.5,19C19.94,19 20.03,12.07 20.03,12H22.03C22.03,12.37 21.97,21 16.5,21Z",
  "mdi:thermometer": "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",
  "mdi:upload": "M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z",
};
function svg(n) {
  if (n.tag === "path" && n.attrs["data-icon"] && !n.attrs.d) {
    const d = RENDER_ICONS[n.attrs["data-icon"]];
    return d
      ? `<path class="${n.attrs.class || ""}" d="${d}" fill="#9b9b9b"${
        n.style._p.fill ? ` style="fill:${n.style._p.fill}"` : ""
      } transform="${n.attrs.transform}"/>`
      : "";
  }
  if (n.tag === "foreignObject") {
    const icon = n.querySelector("ha-icon");
    const d = icon && RENDER_ICONS[icon.attrs.icon];
    if (!d) return "";
    const wrap = n.children[0];
    const px = parseFloat((wrap && wrap.style._p["--mdc-icon-size"]) || 24);
    const off = (+n.attrs.width - px) / 2;
    return `<path d="${d}" fill="#9b9b9b" transform="translate(${+n.attrs.x + off},${+n.attrs.y + off}) scale(${px / 24})"/>`;
  }
  if (n.tag === "image") return monogram(n);
  if (n.tag === "#text") return esc(n._text);
  if (n.tag === "title") return "";
  const a = Object.entries(n.attrs).filter(([k]) => !k.startsWith("data-") && k !== "tabindex" && k !== "role").map(([k, v]) => ` ${k}="${esc(v)}"`).join("");
  const style = Object.entries(n.style._p).filter(([k, v]) => v !== "" && v !== undefined).map(([k, v]) =>
    `${k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}:${v}`
  ).join(";");
  const inner = n._text !== null && !n.children.length ? esc(n._text) : n.children.map(svg).join("");
  return `<${n.tag}${a}${style ? ` style="${esc(style)}"` : ""}>${inner}</${n.tag}>`;
}
const backSvg = stage.children.find((c) => c.tag === "svg" && /back/.test(c.attrs.class || ""));
const mainSvg = stage.children.find((c) => c.tag === "svg");
const canvases = card.shadowRoot.querySelectorAll("canvas");
const fans = canvases.find((c) => /fans/.test(c.attrs.class || ""));
const fx = canvases.find((c) => !/fans/.test(c.attrs.class || ""));
let [vx, vy, vw, vh] = mainSvg.attrs.viewBox.split(" ").map(Number);
if (TOGGLES && !cfg.toggles_at) vw += 130;
const css = readFile(CARD).split("const STYLES = `")[1].split("`;")[0].replace(/:host\s*\{/, "svg {").replace(/\n\s*ha-card\s*\{[^}]*\}/, "");
const theme = Object.entries({ ...THEME, ...card.style._p }).map(([k, v]) => `${k}:${v}`).join(";") +
  ";--hlm-fs-title:12px;--hlm-fs-text:10px;--hlm-fs-small:8px";
const toggles = [];
if (TOGGLES) {
  const labels = card.shadowRoot.querySelectorAll("label").filter((l) => l.style._p.display !== "none");
  const pw = 112;
  const px = cfg.toggles_at ? cfg.toggles_at[0] : vx + vw - 6 - pw;
  const py = cfg.toggles_at ? cfg.toggles_at[1] : vy + 6;
  toggles.push(`<rect x="${px}" y="${py}" width="${pw}" height="${labels.length * 20 + 10}" rx="6" fill="#1c1c1c" stroke="rgba(225,225,225,0.12)"/>`);
  labels.forEach((l, i) => {
    const on = l.children.find((c) => c.tag === "input").checked;
    const txt = l.children.filter((c) => c.tag === "span").map((c) => c.textContent).join("");
    const y = py + 8 + i * 20;
    toggles.push(
      `<g><rect x="${px + 9}" y="${y}" width="26" height="14" rx="7" fill="${on ? "#03a9f4" : "#4a4a4a"}"/><circle cx="${px + 9 + (on ? 19 : 7)}" cy="${
        y + 7
      }" r="5" fill="#e1e1e1"/><text x="${px + 41}" y="${y + 11}" font-size="10" font-family="${FAMILY}" fill="#e1e1e1">${txt}</text></g>`,
    );
  });
}
const scale = +SCALE || 2;
print(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" width="${Math.round(vw * scale)}" height="${
    Math.round(vh * scale)
  }" style="${theme}"><style>${css} svg{display:inline;max-width:100%}</style><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" style="fill:var(--hhm-bg)"/><g class="${
    esc(stage.attrs.class || "stage")
  }">${backSvg ? backSvg.children.map(svg).join("") : ""}${fans && fans._ctx ? fans._ctx.out.join("") : ""}<g class="main" font-family="${FAMILY}">${
    mainSvg.children.map(svg).join("")
  }</g>${fx && fx._ctx ? fx._ctx.out.join("") : ""}${toggles.join("")}</g></svg>`,
);
