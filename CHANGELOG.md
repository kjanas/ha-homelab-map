# Changelog

## 0.102.0 – unreleased

- `look: depth` – optional subtle 3D: soft shadows, lifted frames, metallic rack rails.
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
