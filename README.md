<p align="center">
  <img src="https://raw.githubusercontent.com/kjanas/ha-homelab-map/main/docs/assets/icon.png" width="96" alt="Homelab Map icon">
</p>

<h1 align="center">Homelab Map</h1>

<p align="center">
  A live, hand-drawn map of your homelab for Home Assistant.
</p>

<p align="center">
  <a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5.svg" alt="HACS Custom"></a>
  <img src="https://img.shields.io/github/v/release/kjanas/ha-homelab-map?include_prereleases" alt="Release">
</p>

![Homelab Map](https://raw.githubusercontent.com/kjanas/ha-homelab-map/main/docs/assets/hero.png)

> **Alpha.** The card works and is used daily, but options may still change between releases. Feedback and issues are welcome.

Homelab Map is a Lovelace card that draws your racks, servers, switches and cables, and brings them to life with Home Assistant data: live values, link and port states, container status, disk health, fans, and animated network and power cables whose speed follows real traffic.

You place everything yourself with pixel coordinates, so the map looks exactly like your setup – no auto-layout to fight with.

## Features

- **Racks and devices** – 19" racks with rackdevices placed by U, free-standing devices and small endpoints; frames turn orange or red from any status entity.
- **Live values** – badges with icons, fixed widths so rows never jump, and colour thresholds (e.g. CPU above 80 % orange, above 90 % red).
- **Network cables** – datalines animated in your VLAN colours, faster with more traffic, direction from rx/tx, red and dashed when the link is down, optional rate labels; open-ended cables fade out "to the internet".
- **Power cables** – animated gold dots from your UPS.
- **Ports** – port icons coloured by link state: active, slower than expected, no cable, fault (no link where a cable is expected), disabled. Works great with the MikroTik Router integration.
- **Logos and containers** – round chips with blinking status/update rings, small parent logos, pending-update counts; groups you can show and hide with a click.
- **Storage** – ZFS/RAID pools with a usage fill, HDDs with spinning platters, SSDs, empty bays, temperatures and health LEDs.
- **Fans** – rack fan panels and single fans whose speed follows a temperature or RPM sensor.
- **VLAN LEDs** with captions, labels, and a bundled **JetBrains Mono** font for a technical look.
- **Looks** – optional 3D depth, decorative backgrounds (blueprint, pegboard, vignette, a colour or your own image) and device textures, including styles inspired by TP-Link Omada, MikroTik, UniFi, Dell and HPE hardware.
- **Pan & zoom** – pinch, wheel or double-tap to zoom and drag to move, so a big map stays usable on a phone.
- **Built for daily use** – switches for VLANs / Power / Animations / Debug (folded into a ⚙ button on narrow screens), a debug grid with coordinates and item ids, clear error messages, animation paused when the card is out of view, and updates only for items whose entities changed.

## Installation

### HACS (recommended)

1. Open **HACS** in Home Assistant.
2. Open the menu (⋮) → **Custom repositories**, add `https://github.com/kjanas/ha-homelab-map` with type **Dashboard**.
3. Search for **Homelab Map** and download it.
4. Reload the browser.

### Manual

1. Download `ha-homelab-map.js` and the `JetBrainsMono-*.woff2` files from the [latest release](https://github.com/kjanas/ha-homelab-map/releases) (or the `dist` folder).
2. Copy them together into `config/www/ha-homelab-map/`.
3. Add a dashboard resource: **Settings → Dashboards → ⋮ → Resources → Add resource**, URL `/local/ha-homelab-map/ha-homelab-map.js`, type **JavaScript module**.
4. Reload the browser.

Put your logos in `config/www/` – for example `config/www/ha-homelab-map/logos/` – and reference them as `/local/ha-homelab-map/logos/<file>`.

## Quick start

Add a **Manual** card to a dashboard (a view in **Panel** mode gives the map the full width):

```yaml
type: custom:ha-homelab-map
font: JetBrains Mono
vlans: {LAN: "#6c9cda"}
debug_toggle: true
items:
  - type: device
    id: router
    at: [0, 0]
    size: [180, 50]
    status_entity: binary_sensor.router_online
    items:
      - {type: label, id: router_name, at: [8, 6], text: Router, size: 12, bold: true}
      - {type: badge, id: router_cpu, at: [8, 28], entity: sensor.router_cpu, icon: "mdi:cpu-64-bit", size: 10, show_border: true, thresholds: [{above: 80, color: orange}, {above: 90, color: red}]}
  - type: device
    id: nas
    at: [300, 0]
    size: [180, 50]
    items:
      - {type: label, id: nas_name, at: [8, 6], text: NAS, size: 12, bold: true}
datalines:
  - id: router-nas
    start_device: router
    start_edge: right
    end_device: nas
    end_edge: left
    vlans: [LAN]
    flow: dominant
    rx: sensor.router_ether2_tx
    tx: sensor.router_ether2_rx
    rates_at: start
```

Replace the entity ids with your own, then turn on the **Debug** switch: it shows a grid, the coordinates under the cursor and the id of the item you hover, which makes placing things quick.

## Documentation

- [Configuration](docs/configuration.md) – every option, with screenshots.
- [Examples](docs/examples.md) – three complete setups to start from: two devices, a home network, and a full rack.
- [AGENTS.md](AGENTS.md) – a guide for AI assistants (ChatGPT, Claude, …) helping you build and maintain your map: rules, geometry, method and recipes. Point your assistant at it before asking for a config.

## Requirements

- A recent Home Assistant with the default frontend (any modern browser).
- The data comes from your existing entities – the card has no integration of its own. Useful sources: [MikroTik Router](https://github.com/tomaae/homeassistant-mikrotik_router), [Glances](https://www.home-assistant.io/integrations/glances/), [NUT](https://www.home-assistant.io/integrations/nut/), [Scrutiny](https://github.com/AnalogJ/scrutiny) or SMART sensors, and Docker/Portainer integrations.

## Credits

- Icons: [Material Design Icons](https://pictogrammers.com/library/mdi/) (Apache 2.0), via Home Assistant.
- Font: [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) (SIL Open Font License 1.1, included as `dist/JetBrainsMono-OFL.txt`).
- No logos are included in this repository or the card. Screenshots show a letter where a logo would be; bring your own images (for example from [dashboard-icons](https://github.com/homarr-labs/dashboard-icons) or [Simple Icons](https://simpleicons.org)) and respect their licences and trademarks.

## License

[MIT](LICENSE). The bundled JetBrains Mono font is under the SIL Open Font License 1.1.
