# Changelog

## Unreleased

### Fixes

- An entity id that does not exist in Home Assistant is reported once in the browser console instead of silently looking like an outage.
- `status_map` can now map `unavailable` and `unknown` (e.g. `{unavailable: warn}`), its keys match regardless of case (unquoted `on:`/`off:` keys too, here and in a ports `states` map), and a state it doesn't list is reported once in the console.
- A chip's `small_entity` shows `?` while it has no data instead of disappearing, and the tooltip says when the `update_entity` is unavailable.
- A state that is neither up nor a usual down state on a chip or LED (e.g. `online`) is reported once in the console, since it is drawn as down.
- Hovering a cable shows its status and rates; the tooltip says when its `rx`/`tx` sensors have no data or an unknown unit, and an unknown unit is reported once in the console.
- A line's `vlans` given as text or a map gets a clear error instead of `unknown VLAN 'L'` or a JavaScript error.
- Rackdevices and fan panels can no longer share a U in the same rack.
- Empty `items`, `datalines` and `powerlines` (YAML `null`) are accepted like empty lists.
- Links: a chip's `url` needs a scheme or a single leading `/` (`nas.lan:5000` and `//host` are rejected), and `blob:` and `about:` links, control characters and `\` are rejected; image URLs reject `\`, so `/\host` can no longer reach another site.
- Badges reserve the right width for values with a thousands separator (`1,234 W`) and follow the Home Assistant number format (e.g. decimal comma), the reserve table ignores names such as `constructor`, and `Infinity`, `0x10`, `0b11` and `0o7` are no longer read as numbers.
- Changing the Home Assistant language or number format refreshes the badges right away.
- A bare port rate of `0.0` means no link instead of a slow link, and a MikroTik port without a readable rate is shown as a warning with the reason.
- Two cards (or the dashboard and the editor preview) hiding different groups no longer undo each other's choice.
- Icons are looked up outside the card, so removing a card while an icon loads no longer leaves the icon blank on other cards, and a failed icon is retried every minute, up to five times.
- Clicking a label or LED on a device with `status_entity` opens the device's dialog. Badges, chips with a link, ports, devices, disks, pools and fans can be reached with Tab and opened with Enter or Space (a held key doesn't repeat).
- An error while redrawing stops the animation loop, a failing item is named in the console and each distinct error is logged once instead of on every update, a font that is not available is reported, and a colour the animations can't read is reported.
- A pool `usage_entity` that is not in % is reported in the console and its tooltip shows the real unit.
- Mouse drags that end outside the card no longer leave the map panning on hover.
- CI now runs `deno lint`, `deno fmt --check` and the test suite, with every GitHub action pinned to a commit.
- The docs screenshot script renders everything before replacing the images, never reuses a stale render, and works on a fresh clone.

## 0.102.0 – alpha

- `background` – `blueprint`, `pegboard`, `vignette`, a colour or an image URL behind the map.
- Pan & zoom – pinch, ctrl/⌘ + wheel, trackpad pinch or double-tap to zoom (up to 4 screen px per map px), drag to move, ⤢ to reset.
- Device textures – `texture` and `texture_opacity` on devices, rackdevices and fan panels: `hex`, `mesh`, `slots`, `grille`, `carbon`, `ribbed`, `brushed`, `glass`, and vendor-inspired `tpl`, `mtk`, `unf`, `dll`, `hpe`.
- The switches moved to a panel in the top-right corner; on screens narrower than 520 px they fold into a ⚙ button. `toggles_at: [x, y]` places the panel anywhere on the map.
- Colours are taken from the Home Assistant theme in one place.

### Fixes

- An error while drawing the map shows a message in the card instead of leaving it blank, and one element that fails to update no longer stops the others.
- Names such as `constructor` or `toString` in `type`, `texture`, `vlan` or a line's `vlans` are now rejected as unknown instead of passing validation and breaking the card.
- The card accepts the dashboard's own keys `visibility`, `layout_options` and `card_mod` instead of rejecting them as unknown.
- An empty entity state is shown as `—` on disks, pools and chip counts instead of being read as 0; unavailable, unknown and empty states are recognised the same way everywhere.
- The animation loop runs only while something actually moves (traffic on a cable, a flickering LED, a spinning disk or fan, a lit chip ring) and stops when everything is idle, saving CPU and battery on wall tablets.
- Switching the Home Assistant theme or dark mode now also recolours the animated cables, LEDs and chip rings, which used to keep the old theme's colours until the card was reloaded.
- Colour names and `hsl()` colours work like hex colours for LED flicker and faded cable ends (these used to be invisible or grey).
- Rate units: bit units are also recognised in lower case (`mbit/s`), `kb/s`, `Mb/s` and `Gb/s` are read as bits, and a sensor with an unknown unit shows `—` instead of being silently read as kB/s.
- The animation layer is drawn at most at 2× screen density, which cuts its memory and drawing work on 3× phones and tablets without a visible difference.
- A chip's `url` can no longer be a `javascript:`, `data:`, `vbscript:` or `file:` link (app links such as `obsidian://` still work), and `image` / `small_image` must be image URLs starting with `/` or `http(s)://`, like the background.
- VLAN, LED, label and threshold colours are checked: any CSS colour, `var(--…)` or the named choices work, anything else (a number, `url(…)`, extra CSS) is rejected with a clear error.
- `scale: 0` is rejected instead of silently meaning 1; the docs now say that the map never gets wider than the card.
- Badges, labels and rates in a group that starts hidden get their real width when the group is shown, instead of keeping an estimate until their value changes.
- A card that is off-screen or on another dashboard view skips state updates and catches up once when it becomes visible again.
- Badge, label and rate widths are measured together before any layout is changed, so one state update causes one browser layout instead of one per badge.
- Window and card resizes are combined into one re-fit per frame, and the resize observer is released when the card is removed.
- An icon that can't be loaded is reported once in the browser console and not looked up again for a minute, instead of being polled for 10 seconds on every redraw.
- The card reports its real height to masonry dashboards instead of always 10 rows, so cards below it are placed correctly.
- Images (background, chip logos) and the bundled font that fail to load are reported in the browser console.
- If the browser blocks local storage (some private modes), the card says once in the console that switches and groups won't be remembered.
- A pool whose usage entity is unavailable, unknown or missing is drawn hatched instead of looking empty (0 % used).
- A fan whose sensor is unavailable, unknown or missing stops instead of spinning slowly.
- Less work per update and per frame: number formats and the reduced-motion setting are looked up once instead of on every badge update and every frame.

## 0.101.0 – alpha

First full (non-pre-release) GitHub release, so HACS lists it without "Show beta versions". Same features as 0.100.0.

## 0.100.0 – first public alpha

First public release. Everything is placed by hand with pixel coordinates.

- Racks, rackdevices, devices and endpoints; device frames coloured from a status entity, click opens more-info.
- Badges with fixed widths, frames and colour thresholds; chips with status/update rings, small parent logos and update counts; VLAN LEDs with captions; labels; show/hide groups.
- Ports with five link states (active, slower, no cable, fault, disabled), MikroTik connection sensors supported, state maps for other devices.
- Datalines with VLAN-coloured animation, traffic-driven speed and direction, link status, rate labels and open ends; powerlines.
- Storage: pools with usage fill, spinning HDDs, SSDs, empty bays.
- Fans: rack fan panels and single fans with speed from a sensor.
- Switches for VLANs, Power, Animations and Debug; debug grid with coordinates and item ids.
- Bundled JetBrains Mono font; targeted updates and paused animation when out of view.
