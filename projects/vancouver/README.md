# Vancouver V0.3 — Experimental

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
  finds a checked nearby forward run. The north-up map follows the car; Whole city
  toggles the overview. Gold is the route; dashed bridges are view-only.
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
- Expand city view fills the browser window. Escape/exit returns to the page.
  This portable mode does not depend on the native browser fullscreen API.
- Lite lowers pixel density and disables shadows. Slow sustained frame rates
  also reduce automatic resolution. Pause 3D releases rendering resources;
  sources and descriptions remain usable. Retry recreates a failed scene.

Driving uses smoothed arcade steering, a full-car safety footprint, short movement
substeps and indexed street/building queries. It is constrained to flat ground
streets, land and building avoidance. Bridge/viaduct traversal, slopes, traffic,
pedestrians and realistic physics are absent. Unvalidated corners and imperfect old
geography can still stop a car; reverse, Recover car, or reset to recover.

## City and provenance

Original lightweight procedural scenery adds window textures, varied facades,
roof details, sidewalks, crossings, lamps, mixed trees, water highlights, Science
World's dome, Creekside's green roof, Hinge wetland, Habitat Island rocks and
Cambie Bridge supports. These are artistic models, not architectural surveys.

The V0.3 snapshot is 471,161 bytes: 436 retained building parts, 296 road lines,
18 park parts, 241 graph nodes and 282 edges in the original extent
[-123.123,49.267,-123.099,49.278]. V0.1 and V0.2 remain byte-identical. V0.3 repairs
four sub-metre endpoint gaps and adds 110 illustrative, 8.5 m junction aprons.
Visible pavement and 64 m collision tiles share one geometry, clipped to land and
around buildings. Existing V0.2 footprint trims are retained; no further building
footprints or water polygons change. A 2.6 m clearance graph includes even the
short 2.6 m Ontario / 1st connector, which is essential to the loop.

115 heights use the City's **2009 LiDAR-derived `hgt_agl`**, joined only where the
2009 and retained 2015 footprints have intersection-over-union >= 0.8 and height
is 3–150 m. Each match records source record ID and overlap. Special landmark
models and the stadium are excluded. The remaining 321 heights are illustrative;
these mixed-date approximations are explicitly **not current measurements**.
Bridge deck sampling keeps water spans level and smooths illustrative land ramps;
grade-separated approaches, vehicle elevation and bridge collisions are absent.

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
owns procedural models/materials; `physics.ts` owns pure collision/movement and
safe spawns. `navigation.ts` owns local Dijkstra routing, checked corner smoothing,
route projection and the optional pure-pursuit scenic controller. `Explorer.tsx` owns UI and `MiniMap.tsx` the SVG navigation aid.
`places.ts` owns reviewed facts. React receives only throttled driving telemetry;
there is no per-frame React scene update. Context loss preserves readable content;
retry/restoration creates a new engine. Offscreen/background scenes stop animation,
and unmount disposes listeners, observers, geometries, materials and textures.

## Licence and next steps

Original Vancouver code/models are MIT. City-derived data remains under the Open
Government Licence – Vancouver; see `THIRD_PARTY_NOTICES.md` and the public
manifest. No OSM data or reference-project source/media was copied.

V0.4 priorities: physical-phone profiling, broader manual-driving acceptance,
current footprint/height matching and independently modelled bridge elevations. Historical/proposal layers, walking, missions,
multiplayer and geographic expansion remain future work.
