# Vancouver V0.5 — Experimental

Explore the city. See what's changing.

An independent Asymmetri Labs city experiment at `/labs/vancouver`, covering
eastern False Creek. Aerial orbit/pan/zoom, bounded arcade driving, six selectable
landmarks, local search, source panels and an accessible text alternative.
Three.js 0.186.1 / WebGL2 loads only on this route. No new backend, accounts,
analytics, external fonts or runtime geographic API requests.

## Run

From the website root, follow `.nvmrc`, `npm ci`, then `npm run dev:next`.
Visit `/labs/vancouver`. Validate with `npm run check`, `npm run test:vancouver`,
`npm run build:next -- --webpack` and `npm run build`. The existing Next/Vinext
deployment distinction is unchanged.

## Controls and experience

- Explore: drag to orbit, scroll/pinch to zoom, right-drag/two fingers to pan.
  Focus the canvas for arrow-key/WASD panning. Select numbered landmarks, quick
  viewpoints or the searchable place list; Explore here flies to that place.
- Drive: arrows/WASD, space to brake, R to reset. Hold the on-screen steering
  and pedal buttons on touch devices. Reverse first brakes forward movement.
  The HUD gives street, speed, gear and persistent obstruction feedback. Recover car
  finds a checked nearby forward run. The north-up map follows the car; Playable area
  toggles the bounded False Creek overview. Gold is the route; dashed bridges are view-only.
- Free roam is the primary start. Village backstreets (1.121 km), West-side corners
  (0.738 km) and North shore crescent (0.946 km) offer manual routes and reverse
  starts. Leave guidance with Free roam. These routes do not offer Cruise.
- Relaxed pace caps forward speed near 22 km/h without steering for you. Normal
  reaches about 68 km/h; Wide view provides more turning visibility.
- Tap a ground street on the map to route there. With map focus, arrows move a
  target 25 m, Enter/Space routes and Escape clears it. Disconnected streets give
  a notice; routes cannot jump through buildings or water.
- Start nearby chooses a checked street spawn near the selected place. Reset
  returns to that spawn; switching modes preserves the car's position.
- Drive the False Creek loop starts a 2.369 km circuit: Athletes Way, Columbia,
  W 1st, Quebec, Terminal, Main, E 2nd and Ontario. Reverse loop starts the same
  circuit in the other direction. Follow road arrows and turn instructions, or
  select Cruise. Cruise uses the normal steering/collision system; any driving
  input takes over. It is limited to this tested circuit.
- Route from car highlights a local street route to the selected place's nearest
  safe roadside stop. Waterfront landmarks may require stopping short; this is
  simulation wayfinding, not real-world directions.
- On compact screens, Drive automatically expands the city. A compact speed/street
  strip and pedals leave the playing view clear. Menu pauses motion and opens one
  panel at a time: places, routes, map or settings. Close resumes with released
  inputs. Steering buttons accept continuous slides between left and right; each
  pointer owns its input independently. This is not a physical multitouch claim.
- Expand city view fills the browser window. Escape/exit returns to the page.
  This portable mode does not depend on the native browser fullscreen API.
- Lite lowers pixel density and disables shadows. Slow sustained frame rates
  also reduce automatic resolution. Pause 3D releases rendering resources;
  sources and descriptions remain usable. Retry recreates a failed scene.

Driving uses progressive held-key steering, gentler short taps, speed-dependent
turning limits and prompt return to centre. A road-edge preview warns without
steering for the driver. Camera sight lines avoid building facades, and illustrative
bridge decks fade while they obscure the ground-level car. Driving retains a full-car safety footprint, short movement
substeps and indexed street/building queries. It is constrained to flat ground
streets, land and building avoidance. Bridge/viaduct traversal, slopes, traffic,
pedestrians and realistic physics are absent. Unvalidated corners and imperfect old
geography can still stop a car; reverse, Recover car, or reset to recover.

## City and provenance

Original lightweight procedural scenery adds window textures, varied facades,
roof details, sidewalks, crossings, lamps, mixed trees, water highlights, Science
World's dome, Creekside's green roof, Hinge wetland, Habitat Island rocks and
Cambie Bridge supports. These are artistic models, not architectural surveys.

The immutable V0.4 snapshot is 545,239 bytes, preserving all 436 V0.3 building
footprints, road centrelines, water and land geometry. V0.1–V0.3 remain byte-identical.
The full ground network contains 23.112 km of source lines; the clearance graph
contains 22.833 km, with a 21.368 km largest connected component. This is an audit
of existing coverage, not a claim to have added 21 km of streets. Cropped boundary
ends and disconnected shoreline pockets remain explicit.

110 illustrative junction aprons increase from 8.5 to 10.5 m radius, adding
3,621.1 square metres of pavement clipped around buildings and water. Rendered
pavement uses the exact indexed collision-cell polygons. Road markings stop before
junctions; crossings stay within pavement. Widths are still illustrative.

18 heights use conservatively matched NRCan **February 2013 LiDAR maximum roof
heights** (IoU >=0.8, good extraction quality, no flags, 3–150 m). 13 replace older
measurements and five replace estimates. Another 102 retain the City's 2009
measurements; 316 remain illustrative. Poor-quality 2016 extraction is rejected.
Each accepted match records source identity, dates, overlap, quality and accuracy.
No new footprint or roof geometry is imported. These are historical approximations,
not current survey measurements. Bridges remain view-only.

## Offline data workflow

Use an isolated Python environment outside the repository:

```sh
python3 -m venv /path/to/vancouver-tooling
/path/to/vancouver-tooling/bin/pip install -r projects/vancouver/tools/requirements.txt
/path/to/vancouver-tooling/bin/python projects/vancouver/tools/refine_city.py
```

For V0.3, retrieve the bounded height request exactly as recorded in
`public/vancouver/v0.3-2026-10-30/manifest.json` into an external cache, then run:

```sh
/path/to/vancouver-tooling/bin/python projects/vancouver/tools/build_v03.py \
  --height-source /path/to/cache/building-footprints-2009.json
```

The importer requires the pinned raw SHA-256, all 915 records and immutable V0.2
parent. It checks separated surfaces and full graph clearance and refuses changed
output under an existing snapshot name. The raw bounded response is about 905 kB;
no citywide or provincewide import is needed. A changed upstream response needs
explicit source review and a new snapshot, not a silently changed checksum.

For V0.4, the optional NRCan extractor additionally requires `pyarrow==20.0.0`
in that external venv. It reads only intersecting GeoParquet row groups and columns,
pins the object ETag, verifies HTTP byte ranges and enforces a 64 MiB transfer cap.
The retained extraction used 12,211,931 bytes and 372 local records, not the full
2.4 GB national object. Source requests/ranges and per-range hashes remain in the
external raw record; its digest is pinned by the builder.

```sh
/path/to/vancouver-tooling/bin/python projects/vancouver/tools/extract_nrcan.py /path/to/cache/nrcan-buildings.json
/path/to/vancouver-tooling/bin/python projects/vancouver/tools/build_v04.py \
  --nrcan-source /path/to/cache/nrcan-buildings.json
```

The extractor refuses an existing raw-output path; a changed remote ETag requires
source review. The builder verifies the immutable V0.3 parent and raw source digest
and rejects changed output under an existing version name.
`refine_city.py` verifies the published V0.1 digest and derives V0.2 with Shapely.
It checks retained parts, a bounded trim budget, and pavement/building/water
separation. The original `build_city.py --cache /path/to/vancouver-source-data`
imports four bounded City datasets, records request URLs and raw-response hashes,
rejects truncation and checks topology. The shared 10 cm precision grid prevents
shoreline gaps; remove fixed precision before overlay buffering to avoid collapse.

Published snapshots are immutable. These commands reproduce their specified
version; for new changes first choose a new output version/date, update engine and
route URLs, review geometry and provenance, and add regression coverage. Never
silently replace a published version. Keep raw responses outside Git; no full BC
download is needed.

## Module boundaries

`engine.ts` owns rendering lifecycle, navigation, camera and input; `scenery.ts`
owns procedural models/materials; `input.ts` tracks each pointer/key independently; `physics.ts` owns pure collision/movement and
safe spawns. Its shared signatures remain unchanged. `handling.ts` shapes manual
input without consulting roads/routes; `camera.ts` constrains the chase sight line.
`DriveControls.tsx` handles pointer capture, slides and release. `navigation.ts` owns local Dijkstra routing, checked corner smoothing,
route projection and the optional pure-pursuit scenic controller. `Explorer.tsx` owns UI and `MiniMap.tsx` the SVG navigation aid.
`places.ts` owns reviewed facts. React receives only throttled driving telemetry;
there is no per-frame React scene update. Context loss preserves readable content;
retry/restoration creates a new engine. Offscreen/background scenes stop animation,
and unmount disposes listeners, observers, geometries, materials and textures.

## Licence and next steps

Original Vancouver code/models are MIT. City-derived data remains under the Open
Government Licence – Vancouver; NRCan heights use the Open Government Licence –
Canada. See `THIRD_PARTY_NOTICES.md` and the public manifest. No OSM data or reference-project source/media was copied.

V0.5 reuses the immutable V0.4 dataset; no geographic snapshot changed.
The development-only Local elevation proof mounts `ElevationLab.tsx` on demand.
`elevation.ts` supplies explicit XYZ connections, smooth ramps, deck-aware full-car
clearance, height/pitch and separate underpass routing for an original synthetic
480 m corridor. It is not Cambie Bridge and is excluded from production UI.
See [bridge research and release conditions](../../docs/VANCOUVER_V05_ELEVATION_2026-10-30.md).

V0.6 priorities: physical-phone profiling, independent human driving feedback,
current footprint/height matching and verified bridge elevations. Historical/proposal layers, walking, missions,
multiplayer and geographic expansion remain future work.
