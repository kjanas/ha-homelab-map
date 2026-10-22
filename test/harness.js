var window = globalThis;
var console = {
  info() {},
  log(...a) {
    print(a.join(" "));
  },
  warn() {},
};
class ClassList {
  constructor(e) {
    this.e = e;
  }
  _get() {
    return (this.e.attrs["class"] || "").split(/\s+/).filter(Boolean);
  }
  _set(a) {
    this.e.attrs["class"] = a.join(" ");
  }
  add(...c) {
    const a = this._get();
    for (const x of c) if (!a.includes(x)) a.push(x);
    this._set(a);
  }
  remove(...c) {
    this._set(this._get().filter((x) => !c.includes(x)));
  }
  contains(c) {
    return this._get().includes(c);
  }
  toggle(c, force) {
    const has = this.contains(c);
    const want = force === undefined ? !has : !!force;
    if (want && !has) this.add(c);
    if (!want && has) this.remove(c);
    return want;
  }
}
class Style {
  constructor() {
    this._p = {};
  }
  setProperty(k, v) {
    this._p[k] = String(v);
  }
  getPropertyValue(k) {
    return this._p[k] || "";
  }
  removeProperty(k) {
    delete this._p[k];
  }
}
const styleProxy = () =>
  new Proxy(new Style(), {
    get(t, k) {
      if (k in t) return typeof t[k] === "function" ? t[k].bind(t) : t[k];
      return t._p[k] || "";
    },
    set(t, k, v) {
      if (k === "_p") t._p = v;
      else t._p[k] = String(v);
      return true;
    },
  });
class Node_ {
  constructor(tag) {
    this.tag = tag;
    this.attrs = {};
    this.children = [];
    this.parentNode = null;
    this.style = styleProxy();
    this.classList = new ClassList(this);
    this.dataset = new Proxy({}, {
      set: (t, k, v) => {
        t[k] = v;
        this.attrs["data-" + k] = String(v);
        return true;
      },
    });
    this._text = null;
    this.listeners = 0;
  }
  setAttribute(k, v) {
    this.attrs[k] = String(v);
  }
  removeAttribute(k) {
    delete this.attrs[k];
  }
  set className(v) {
    this.attrs["class"] = String(v);
  }
  get className() {
    return this.attrs["class"] || "";
  }
  getAttribute(k) {
    return k in this.attrs ? this.attrs[k] : null;
  }
  appendChild(c) {
    if (this._text !== null && this._text !== "") {
      const t = new Node_("#text");
      t._text = this._text;
      t.parentNode = this;
      this.children.push(t);
    }
    this._text = null;
    c.parentNode = this;
    this.children.push(c);
    return c;
  }
  remove() {
    if (this.parentNode) this.parentNode.children = this.parentNode.children.filter((c) => c !== this);
    this.parentNode = null;
  }
  addEventListener(type, fn) {
    this.listeners++;
    (this.handlers = this.handlers || []).push([type, fn]);
  }
  dispatch(type, ev) {
    for (const [t, fn] of this.handlers || []) if (t === type) fn(ev);
  }
  append(...n) {
    for (const c of n) this.appendChild(c);
  }
  replaceChildren(...n) {
    this.children = [];
    this._text = null;
    for (const c of n) this.appendChild(c);
  }
  get textContent() {
    return this._text !== null ? this._text : this.children.map((c) => c.textContent).join("");
  }
  set textContent(v) {
    this.children = [];
    this._text = String(v);
  }
  get isConnected() {
    return true;
  }
  getBoundingClientRect() {
    return { width: 1620, height: 900 };
  }
  getComputedTextLength() {
    return this.textContent.length * 5.5;
  }
  matches(sel) {
    return sel.startsWith(".") ? this.classList.contains(sel.slice(1)) : this.tag === sel;
  }
  querySelectorAll(sel) {
    const out = [];
    const walk = (n) => {
      for (const c of n.children) {
        if (c.matches(sel)) out.push(c);
        walk(c);
      }
    };
    walk(this);
    return out;
  }
  querySelector(sel) {
    return this.querySelectorAll(sel)[0] || null;
  }
}
var document = { createElementNS: (ns, tag) => new Node_(tag), createElement: (tag) => new Node_(tag) };
class Shadow extends Node_ {
  set innerHTML(html) {
    this.children = [];
    const card = this.appendChild(new Node_("ha-card"));
    if (html.includes('class="title"')) {
      const t = card.appendChild(new Node_("div"));
      t.setAttribute("class", "title");
    }
  }
}
class HTMLElement {
  constructor() {
    this.style = styleProxy();
  }
  attachShadow() {
    this.shadowRoot = new Shadow("#shadow");
    return this.shadowRoot;
  }
  addEventListener() {}
  getBoundingClientRect() {
    return { width: 1800, height: 900 };
  }
  dispatchEvent() {}
  get isConnected() {
    return true;
  }
}
var CSS = {
  supports(property, value) {
    if (property !== "color") return false;
    const v = String(value).trim().toLowerCase();
    const names = ["red", "orange", "yellow", "green", "blue", "white", "black", "gold", "tomato", "transparent", "currentcolor"];
    return names.includes(v) || /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(v) || /^(rgba?|hsla?)\([^()]*\)$/.test(v) ||
      /^var\(--[\w-]+(,.*)?\)$/.test(v);
  },
};
var CustomEvent = class {
  constructor(t, o) {
    this.type = t;
    this.detail = o && o.detail;
  }
};
var requestAnimationFrame = (f) => f();
var customElements = {
  define(n, c) {
    globalThis.Cards = globalThis.Cards || {};
    Cards[n] = c;
    globalThis.CardClass = c;
  },
  get() {
    return undefined;
  },
};
function ser(n, ind) {
  if (n._text !== null && !n.children.length) return `${ind}<${n.tag}${attrs(n)}>${n._text}</${n.tag}>\n`;
  let s = `${ind}<${n.tag}${attrs(n)}>\n`;
  for (const c of n.children) s += ser(c, ind + " ");
  return s;
}
function attrs(n) {
  const a = Object.keys(n.attrs).sort().map((k) => ` ${k}="${k === "class" ? n.attrs[k].split(/\s+/).filter(Boolean).sort().join(" ") : n.attrs[k]}"`).join("");
  const st = Object.keys(n.style._p).sort().map((k) => `${k}:${n.style._p[k]}`).join(";");
  return a + (st ? ` style="${st}"` : "") + (n.listeners ? ` on=${n.listeners}` : "");
}
