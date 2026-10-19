# AGENTS.md – helping a user build and maintain their Homelab Map

This file is for AI assistants that help someone write or change the YAML configuration of the **ha-homelab-map** Home Assistant card. Read it fully before proposing any configuration. The complete reference with screenshots is [docs/configuration.md](docs/configuration.md), and complete sample setups are in [docs/examples.md](docs/examples.md) – start from the closest example. This file is the condensed version plus the working method.

## What the card is

A Lovelace card (`type: custom:ha-homelab-map`) that draws a homelab:

- racks and devices with live values;
- logos with status rings;
- VLAN LEDs;
- animated network and power cables.

Everything is placed by hand with pixel coordinates. The card does no automatic layout, so you must compute positions yourself, and you can only compute them correctly with the geometry below.

## Hard rules (the card rejects configs that break them)

1. **Only documented properties exist.** Any other key fails with `unknown property – allowed: …`. Never invent options (no `name:` on devices, no `color:` on lines, no `align:` on labels). If the user wants something that is not listed here or in the docs, say it is not supported yet instead of guessing.
2. **Pixels only.** Every coordinate and size is in px. If the user says pt, em, % of the screen or similar, point it out and ask.
3. **`at: [x, y]` is always the top-left corner** of the item.
4. **Children are relative to their parent's top-left corner.** Negative values are allowed and are the normal way to pin something onto a parent's edge.
5. **Every item and every line has an `id`**, unique across the whole map (items and lines share one namespace).
6. **Lines connect devices and ports only.** Devices are `rack`, `rackdevice`, `device` and `endpoint`; a line end can also be a `port`. Badges, chips, LEDs, labels and groups can't be line ends.
7. **Containment is fixed:**

   | Parent | Allowed children (`items`) |
   | --- | --- |
   | the map (top level) | rack, device, endpoint, badge, chip, led, label, group, ports, pool, hdd, ssd, bay, fan |
   | `rack` | rackdevice, fanpanel, device, badge, chip, led, label, group, ports, pool, hdd, ssd, bay, fan |
   | `device`, `rackdevice` | badge, chip, led, label, group, ports, pool, hdd, ssd, bay, fan |
   | `endpoint` | chip, label |
   | `group` | badge, chip, led, label, fan |
   | `ports` | port |
   | `pool` | hdd, ssd, bay |

   A `rackdevice` can only be inside a rack, and a `port` only inside `ports`. A group cannot contain a group.

## Schema cheat sheet

### Card

```yaml
type: custom:ha-homelab-map
line_radius: 6            # px, every line corner
font: JetBrains Mono      # optional; bundled; falls back to the theme font
vlans: {LAN: "#6c9cda", IoT: "#66b771"}   # name → colour, used by datalines and LEDs
scale: 1                  # or fit_viewport: true (fills window height; scale ignored)
vlan_toggle: true         # optional switches in the top-left corner
power_toggle: true
animation_toggle: true    # off = cables, LEDs and disks freeze; chip rings stay lit (red wins over green)
debug_toggle: true
debug: false              # overlay; with debug_toggle = starting position
items: []                 # required
datalines: []
powerlines: []
```

### Items

| type | Keys (`id` and `type` always) | Notes |
| --- | --- | --- |
| `rack` | `at`, `units`, `items` | 347 px wide, `20 + units × 32` px tall |
| `rackdevice` | `u`, `units` (default 1), `status_entity`, `status_map`, `items` | inside a rack only; no `at` |
| `device` | `at`, `size: [w, h]`, `status_entity`, `status_map`, `items` | |
| `endpoint` | `at`, `icon` **or** a chip in `items` | 32 × 32 px; `items` may also hold labels |
| `badge` | `at`, `entity`, `icon` (required: `mdi:…` or `none`), `units` (`true` / own text / `none`), `decimals`, `size` (font px, default 8), `show_border`, `toggle` (group id), `thresholds` | click → more-info (or toggles the group) |
| `chip` | `at`, `icon` **or** `image`, `small_image` **or** `small_entity`, `size` (diameter, default 16), `status_entity`, `update_entity`, `url` | red ring when status not up, green when update on; `small_image` = a small logo on the lower right (e.g. the app a database belongs to); `small_entity` = a small number in the same spot (e.g. pending OS updates), hidden at 0; not both |
| `led` | `at`, `vlan` **or** `color`, `size: [w, h]` (default [3, 8]), `entity`, `effect` (`flicker` default, `blink`, `none`), `caption` | dark grey while `entity` is down; `caption` = text centred above the LED (8 px, secondary colour), only allowed together with an explicit `size` |
| `label` | `at`, `text`, `size` (default 10), `bold`, `color` (`primary` default, `secondary`, or a colour), `vertical` | not clickable |
| `group` | `at`, `items` | invisible; shown/hidden by a badge with `toggle` |
| `ports` | `at`, `size` (icon px, default 12), `speed` (expected link speed, default `1Gbps`), `icon` (default `mdi:ethernet`), `states`, `items` | container for `port` items |
| `pool` | `at`, `size: [w, h]`, `label`, `usage_entity`, `status_entity`, `status_map`, `thresholds`, `items` | storage pool (ZFS, RAID…) around its disks: fill = % used (coloured by `thresholds`), outline from `status_entity` (e.g. `{ONLINE: ok, DEGRADED: warn, FAULTED: down}`), `label` on a tag centred on the bottom edge (it sticks out 5 px below) |
| `hdd` / `ssd` | `at`, `size` (default `[27, 36]`), `temperature`, `status_entity`, `status_map`, `thresholds` | disk: temperature at the bottom (`41°`, coloured by `thresholds`), status LED top-right (green/orange/red); an HDD's platter spins unless its status is down, an SSD shows a chip board |
| `bay` | `at`, `size` | empty drive bay, dashed outline |
| `fanpanel` | `u`, `units` (default 2), `count` (default 4), `entity`, `range`, `thresholds` | rack-only panel like a rackdevice with `count` fans spread evenly; sits behind devices and cables in the rack |
| `fan` | `at`, `size` (square side, default 24), `entity`, `range`, `thresholds` | a single fan placed anywhere, drawn as a square chassis with 4 corner screw holes |
| `port` | `at` (relative to its `ports`), `entity`, `speed` (overrides the container's) | white = up at expected speed or faster, orange = slower, dimmed = no link; `icon` comes from the container only |

**Port colours:** white = active (link at the expected speed or faster), orange = warn (slower, or half duplex when the other end could do full duplex – a device that only supports half duplex is fine), dimmed = no link on a port with no cable on the map, **red = fault** (no link on a port where a map cable ends – a cable is expected – or an SFP fault), **crossed-out** = disabled. Port entities, best first: the MikroTik integration's `binary_sensor.<device>_<iface>_connection` (its `enabled`, `status`, `rate`, `full_duplex` and SFP attributes give all five states); a speed text (`1Gbps`, `100Mbps`, `10 Gbit/s`) or a bare number (read in the entity's unit, or Mbps); an on/off entity. For other devices put a `states` map on the `ports` container – state → `active` | `warn` | `inactive` | `fault` | `disabled`, case-insensitive – e.g. NVR channels `{recording: active, online: warn, offline: fault, empty: inactive}`; states not in the map fall back to the rules above.

**Badge thresholds** – the one way to flag a problem value: `thresholds: [{above: 70, color: orange}, {above: 85, color: red}]` or `{below: 20, color: red}`. Reached means equal or beyond; when several are reached the last one in the list wins (list mild → severe); `above` and `below` can be mixed. The icon and value text take the colour; nothing blinks or hides. Colours: `red`, `orange`, `green` (theme error/warning/success), `yellow`, or any CSS colour. Compared against the raw entity number in its own unit; non-numeric or unavailable states are never coloured. Don't put thresholds on values that are normally at their limit (an NVR disk is always ~100 % full).

**Fan speed** (`fanpanel`, `fan`): the `entity` value is mapped over `range: [slow, fast]` (default `[0, 100]`; e.g. a temperature `[27, 35]` or RPM `[0, 3000]`) – at or below `slow` the fan turns slowly, at or above `fast` quickly. `on` = full speed; `0` or `off` = stopped; unavailable = slow; no `entity` = always slow. Whether a stopped or slow fan is a fault is up to the user: `thresholds` colour the rotor (e.g. `{below: 500, color: red}` for RPM). Rotors freeze with the Animations switch.

**Device frame status** (`device`, `rackdevice`): with `status_entity` the frame outline turns red (down) or orange (warn); OK keeps the normal outline. Without `status_map`: down for `unavailable`, `unknown`, `off`, `down`, `offline`, `disconnected`, `not_home` or a missing entity, anything else is OK (so a CPU-load sensor means "reachable"). With `status_map` (`{LB: down, OB: warn, OL: ok}`), the state is matched per word (`OL CHRG` matches `OL`), the first listed key wins, and an unlisted state is `warn`. Clicking the device (outside its badges, chips and ports) opens Home Assistant's more-info for `status_entity`; devices without it are not clickable, and devices never take a `url` (only chips do). Don't use the same entity as the device's logo chip `status_entity` – that shows the same thing twice.

"Up" for chip `status_entity` and LED `entity` means a state of `on`, `true`, `1`, `running`, `home` or `ok`. Anything else, unavailable or missing counts as down. "Update" means `on`, `true`, `1` or a number above 0 (e.g. a pending-updates count).

### Lines

```yaml
datalines:
  - id: router-ap
    start_device: router       # or start_port: <port id> – exactly one of the two
    start_edge: right          # top | right | bottom | left (of the device, or of the port icon)
    start_point: 50            # % along the edge, default 50
    end_device: ap             # or end_port: <port id>
    end_edge: left
    end_point: 50
    points: [[400, 62], [400, 52]]   # map coordinates, in order; any direction
    vlans: [LAN, IoT]          # dash colours; none = theme-coloured dots
    status: binary_sensor.ap_link    # active (default) | inactive | a binary_sensor
    flow: dominant             # forward | reverse | dominant; omit = static
    rx: sensor.router_ether2_tx      # what the START device receives
    tx: sensor.router_ether2_rx      # what the START device sends
    rates_at: start            # start | end | 0–100 (% of line length); turns rate text on
    rates_placement: middle    # middle (rx above, tx below) | above | below
    rates_size: 8
powerlines:
  - {id: ups-server, start_device: ups, start_edge: left, end_device: server, end_edge: left, points: [[30, 300], [30, 120]], flow: forward}
```

- Powerlines accept only the common keys: `id`, the `start_`/`end_` device, edge and point, `points`, and `flow` (forward/reverse).
- `dominant` needs both `rx` and `tx`.
- **Open end (datalines only):** leave out `end_device`/`end_port` (or `start_device`/`start_port`, never both). The last (or first) entry of `points` is then the open end, and the line fades out along that last segment – static line and animation alike. The open end does not enlarge the map: if it lies outside the drawing area, the line is cut at the edge and fades out exactly there – so a far-away point such as `[x, -200]` makes the cable run to the top edge. Use it for an "internet" cable leaving the ONT. It needs at least one point; `*_edge`/`*_point` are not allowed on the open end. Everything else (vlans, status, flow, rx/tx, rates) works as usual.
- `rates_*` need `rates_at`, and `rates_at` needs `rx` and/or `tx`.

## Geometry you need to compute coordinates

All values in px.

**Rack** at `[rx, ry]` with `units: n`:
- width 347, height `20 + 32n`;
- U k (counted from the top, k = 1…n) spans y `ry + 10 + 32(k−1)` to `ry + 10 + 32k`;
- the outer rails occupy x `rx + 4 … rx + 18` and `rx + 329 … rx + 343`;
- unit numbers are drawn left of the rack, at about `rx − 6`.

**Rackdevice** `u: k, units: m` in that rack:
- top-left `[rx + 21, ry + 10 + 32(k−1) + 1]`;
- size `[305, 32m − 2]`.

**A device placed in a rack with `at`** (e.g. a narrow PoE injector) is relative to the rack's top-left corner.

**Port**: a `size × size` box at the `ports` container's `at` plus the port's own `at`. A line with `end_port` and `end_edge: top` ends at the middle of the port icon's top edge, so its last point should have the same x as the port's centre.

**Endpoint**: 32 × 32. An MDI icon is drawn at 24 px with a 4 px margin; a typical logo chip is `{at: [4, 4], size: 24}`.

**Edge point** of a device with top-left `[x, y]`, size `[w, h]` and percentage `p`:

| edge | point |
| --- | --- |
| top | `[x + w·p/100, y]` |
| bottom | `[x + w·p/100, y + h]` |
| left | `[x, y + h·p/100]` |
| right | `[x + w, y + h·p/100]` |

`points` are absolute map coordinates even for devices nested in racks, so convert nested positions to map coordinates first: add up the `at`s of all parents, or use the rack formulas.

**Badge height** (its top is `at[1]`):
- icon size is `round(size × 1.25)`, and the content height is the larger of `size × 1.2` and the icon size;
- `show_border` adds 2 px on every side.

So a size-10 badge is about 13 px tall (17 px with `show_border`), and its text baseline is about 10 px below `at[1]`.

**Badge width** is fixed for these units: the card reserves room for the widest value, so neighbours never collide when a value grows.

| Unit | Widest value reserved |
| --- | --- |
| `%` | `100%` |
| `°C` | `99.9 °C` (with the badge's decimals) |
| `V` | `999.9 V` |
| `Mbps` | `999 Mbps` |
| `ms` | `999 ms` |
| `W` | `9999 W` |
| no unit (counts) | `99` |

Width = icon (`round(size × 1.25)`) + the reserved text. The icon and value are centred together inside that width; a value wider than the reserved one grows to the right. Other units (e.g. `kWh`) are not reserved: the value starts right after the icon and grows to the right. With `font: JetBrains Mono` every character is exactly `0.6 × size` px wide, so a size-10 `100%` badge is 13 + 24 = 37 px; with the theme font, estimate about `0.6 × size` per character.

**Label**: the text top is about `at[1]`, the baseline about `at[1] + 0.8 × size`.

**Line corners** are rounded only at `points`, with `line_radius`. Where a line touches a device edge, there is no rounding.

## Working method

1. **Collect facts before writing YAML.**
   - The device list: what is in which rack and at which U, and what stands outside.
   - The exact entity ids (ask for them, or for a list of states). Never guess entity ids.
   - What each entity reports: e.g. a container sensor reporting `running` / `exited` works directly as a chip `status_entity`.
   - Which interface counters feed each cable. They are often measured on the far device, which means swapping `rx`/`tx`.
2. **Lay out devices first:** racks with rackdevices, then free devices and endpoints. Leave about 50–100 px between columns for cable lanes.
3. **Add the content of each device:**
   - a logo chip at `[5, 4]`, size 16;
   - a bold 12 px name label at `[26, 6]`;
   - badges in rows (size 10 fits 2 rows in 2U);
   - VLAN LEDs.
4. **Add lines:**
   - Choose edges and percentages so cables don't overlap.
   - Give parallel vertical cables their own x lanes, about 15 px apart.
   - Keep segments horizontal or vertical unless the user wants diagonals.
5. **Add rates:**
   - `start` works when the first segment is long enough.
   - Use a percentage to move the text past obstacles, such as a rack rail.
   - Use `rates_placement` to keep the text off neighbouring cables.
6. **Have the user switch on Debug.** The overlay shows a 10/50 px grid and, when hovering, the coordinates on the map and inside the device under the cursor, and on a second line the id of the item under the cursor (badge, chip, port, LED, disk, line…). Ask them to read off coordinates instead of guessing visually.
7. **Change one thing at a time,** and keep the rest of the config byte-for-byte unchanged. Users iterate visually.

## Recipes

**Badge rows aligned in columns.** For two rows of three and two values (e.g. CPU, RAM, disk / voltage, temperature):
1. Give each column a fixed x and use the same x in both rows.
2. Size each column for its widest plausible value (`100%`, `99.9 °C`).
3. Make the last column end about 8 px inside the device's right edge, or 6 px before any LEDs on that side.

**Rack temperature on the rack's top edge:**

```yaml
- {type: badge, id: rack_temp, at: [22, -8], entity: sensor.rack_temperature, icon: "mdi:thermometer", decimals: 1, size: 10, show_border: true}
```

This goes inside the rack's `items`.

**Containers you can hide:** put the chips in a group, and give the container-count badge `toggle: <group id>`. Its value turns bold while the group is hidden. The browser remembers the choice.

```yaml
- type: group
  id: server_containers
  at: [10, 22]
  items:
    - {type: chip, id: c_grafana, at: [0, 0], size: 18, image: /local/ha-homelab-map/logos/grafana.svg, status_entity: sensor.server_grafana_state, update_entity: binary_sensor.server_grafana_update, url: "https://grafana.example.com"}
- {type: badge, id: server_containers_running, at: [250, 100], entity: sensor.server_containers_running, icon: "mdi:docker", size: 10, toggle: server_containers}
```

**Ports with a cable on one of them:**

```yaml
- type: ports
  id: switch_ports
  at: [170, 4]
  size: 12
  items:
    - {type: port, id: switch_ether1, at: [0, 0], entity: sensor.switch_ether1_rate}
    - {type: port, id: switch_ether2, at: [14, 0], entity: sensor.switch_ether2_rate, speed: 100Mbps}
```

This goes inside the switch's `items`. A line to the TV then uses `end_port: switch_ether2` with `end_edge: top`. Camera inputs on an NVR are a separate `ports` with `icon: "mdi:cctv"` and on/off entities.

**VLAN legend:** a row of wide LEDs (`size: [18, 3]`, 22 px apart), each with a `caption` (`LAN`, `IoT`…) – the caption is centred above its LED automatically.

**Planned or unplugged cable:** `status: inactive`. It's drawn red and dashed, without animation.

**Device and container logos:**
- Use `image:` with files under `config/www/…`, referenced as `/local/…`. Good sources are [dashboard-icons](https://github.com/homarr-labs/dashboard-icons) and [Simple Icons](https://simpleicons.org).
- `icon:` accepts any `mdi:` name.

## Checklist before handing over a config

- [ ] Every key is in the tables above. No invented options.
- [ ] Every `id` is unique, including line ids.
- [ ] Every entity id was given by the user, not guessed.
- [ ] Every `points` list uses absolute map coordinates, and segments start and end on the intended edges.
- [ ] Rackdevices sit inside a rack's `items` and fit: `u + units − 1 ≤ rack units`.
- [ ] Every endpoint has exactly one of: `icon`, or at least one chip.
- [ ] Every line end has exactly one of `*_device` or `*_port`, except one intentionally open end on a dataline (with `points`, without that end's `*_edge`/`*_point`).
- [ ] Every badge has `icon` (use `none` to hide it).
- [ ] `dominant` lines have both `rx` and `tx`; `rates_*` only on lines with `rates_at`.
- [ ] Quoted where YAML needs it: `"#hex"` colours, `"mdi:…"` inside `{…}` flow mappings, and `"on"` / `"off"`.
- [ ] Only what the user asked for changed.

## Reading errors

The card names the exact place, counting from 0:

```text
ha-homelab-map: items[0].items[2].size: expected a font size in px
```

This means: first top-level item → third item inside it → its `size`. Fix exactly that spot. Common ones:

| Error | Fix |
| --- | --- |
| `unknown property – allowed: …` | Remove or rename the key; the message lists the valid keys |
| `'rackdevice' must be inside a rack's items` | Move it into the rack's `items` |
| `U11–U13 does not fit in the 12U rack 'rack'` | Lower `u` or `units` |
| `'x' is not a device – lines connect devices and ports only` | Point the line at the device or a port, not at a badge or chip |
| `use either 'start_device' or 'start_port', not both` | Keep one of the two |
| `needs either 'end_device' or 'end_port'` (powerline) | Powerlines can't have open ends – connect both |
| `an open end needs at least one point` | Add a point where the open line should end |
| `'dominant' needs both 'rx' and 'tx'` | Add the missing sensor or use `forward` |
| `an endpoint needs either an mdi 'icon' or a chip in 'items'` | Keep exactly one of the two |

## Not supported yet (don't promise these)

- **Placeholders:** placeholder devices, and a placeholders switch.

If the user asks for one of these, say it's not available in the current version, and offer the closest supported alternative. For example, "update available" can be shown with a logo chip's `update_entity`.

**Cables are deliberately simple and these are not planned:** merged drawing of overlapping cables, a fixed animation speed, choosing dots or dashes by hand, custom animation colours, USB cables, per-line colour or width, and lines turning red when a device is down. Animation speed always follows `rx`/`tx`; dashes and colours always come from `vlans` (no `vlans` = theme-coloured dots; power lines are always gold); a cable is red only through its own `status`.
