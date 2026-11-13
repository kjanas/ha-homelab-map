load(H + "/harness.js");
const warned = [];
console.warn = (...a) => warned.push(a.join(" "));
let defined = 0;
customElements.get = () => ({ version: "1.0.0" });
customElements.define = () => defined++;
loadString(readFile(CARD).replace(/import\.meta\.url/g, '"/local/community/ha-homelab-map/ha-homelab-map.js"'));
const hit = warned.filter((m) => m.includes("version 1.0.0 was loaded first") && m.includes("/local/community/ha-homelab-map/") && m.includes("twice"));
print(
  defined === 0 && hit.length === 1
    ? "ok   a second copy of the card warns which version was loaded first instead of failing silently"
    : `FAIL duplicate registration: defined ${defined}, warnings ${JSON.stringify(warned)}`,
);
