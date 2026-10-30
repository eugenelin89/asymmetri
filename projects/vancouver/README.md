# Vancouver V0.2 — Experimental

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
  The HUD gives street, speed and gear; the north-up map shows the car and places.
- Drive nearby chooses a checked street spawn near the selected place. Reset
  returns to that spawn; switching modes preserves the car's position.
- Expand city view fills the browser window. Escape/exit returns to the page.
  This portable mode does not depend on the native browser fullscreen API.
- Lite lowers pixel density and disables shadows. Slow sustained frame rates
  also reduce automatic resolution. Pause 3D releases rendering resources;
  sources and descriptions remain usable. Retry recreates a failed scene.

Driving uses smoothed arcade steering, a full-car safety footprint, short movement
substeps and indexed street/building queries. It is constrained to flat ground
streets, land and building avoidance. Bridge/viaduct traversal, slopes, traffic,
pedestrians and realistic physics are absent. Narrow curves and imperfect old
geography can still stop a car; reverse or reset to recover.

## City and provenance

Original lightweight procedural scenery adds window textures, varied facades,
roof details, sidewalks, crossings, lamps, mixed trees, water highlights, Science
World's dome, Creekside's green roof, Hinge wetland, Habitat Island rocks and
Cambie Bridge supports. These are artistic models, not architectural surveys.

The V0.2 snapshot is 276,986 bytes uncompressed: 436 building parts, 296 road lines
and 18 park parts in the original extent [-123.123,49.267,-123.099,49.278]. It derives
from the immutable V0.1 City data without new geographic downloads. Road widths,
sidewalks and the decorative coastal promenade are illustrative. Street clearance
trims 24 building parts by a total 1,922.8 square metres, retaining all 436 parts.
Ground roads and sidewalks are clipped to existing land; water is not expanded.
Building heights remain illustrative. Source centrelines, extent and original
raw-response provenance are retained in the versioned manifest.

## Offline data workflow

Use an isolated Python environment outside the repository:

```sh
python3 -m venv /path/to/vancouver-tooling
/path/to/vancouver-tooling/bin/pip install -r projects/vancouver/tools/requirements.txt
/path/to/vancouver-tooling/bin/python projects/vancouver/tools/refine_city.py
```

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
safe spawns. `Explorer.tsx` owns UI and `MiniMap.tsx` the SVG navigation aid.
`places.ts` owns reviewed facts. React receives only throttled driving telemetry;
there is no per-frame React scene update. Context loss preserves readable content;
retry/restoration creates a new engine. Offscreen/background scenes stop animation,
and unmount disposes listeners, observers, geometries, materials and textures.

## Licence and next steps

Original Vancouver code/models are MIT. City-derived data remains under the Open
Government Licence – Vancouver; see `THIRD_PARTY_NOTICES.md` and the public
manifest. No OSM data or reference-project source/media was copied.

V0.3 priorities: physical-phone profiling, better road/collision feedback and
junction continuity, measured heights/current footprints, then independently
modelled bridge elevations. Historical/proposal layers, walking, missions,
multiplayer and geographic expansion remain future work.
