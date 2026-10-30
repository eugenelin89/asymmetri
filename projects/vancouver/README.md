# Vancouver V0.1 — Experimental

Explore the city. See what's changing.

An independent Asymmetri Labs city experiment at `/labs/vancouver`, covering
eastern False Creek. Aerial orbit/pan/zoom, bounded arcade driving on flat streets,
six selectable landmarks, local search, source panels and an accessible text
alternative. Three.js 0.186.1 / WebGL2, loaded only by this route. No new backend,
accounts, analytics, external fonts or runtime geographic API requests.

## Run

From the website root, follow `.nvmrc`, `npm ci`, then `npm run dev:next`.
Visit `/labs/vancouver`. `npm run check`, `npm run test:vancouver`,
`npm run build:next -- --webpack` and `npm run build` validate the integration.
The repository's Next/Vinext deployment distinction remains unchanged.

## Controls

- Aerial: drag to orbit, scroll/pinch to zoom, right-drag/two fingers to pan.
  Focus the canvas for arrow-key/WASD panning. Click teal landmark beacons or
  use the place list. Reset restores the starting view.
- Drive: arrows/WASD, space to brake, R to reset. On-screen press-and-hold
  controls support touch and keyboard. Switching modes resets the car.
- Driving is constrained to flat street corridors, land and building avoidance.
  Bridge traversal, slopes and realistic physics are absent. Some old footprints
  and current streets disagree; reset if a road is blocked.

## Data and refresh

The checked-in snapshot is ~184 KB uncompressed. City 2015 footprints,
public-street centrelines, parks and a simplified 2002 shoreline are transformed
to WGS84 / UTM zone 10N and local east/south metre coordinates. Heights, trees,
landmark dimensions and flat terrain are illustrative, not measurements.
The area is bounded by [-123.123, 49.267, -123.099, 49.278].

Use an isolated Python environment outside the repository:

```sh
python3 -m venv /path/to/vancouver-tooling
/path/to/vancouver-tooling/bin/pip install -r projects/vancouver/tools/requirements.txt
/path/to/vancouver-tooling/bin/python projects/vancouver/tools/build_city.py --cache /path/to/vancouver-source-data
```

The importer fetches four bounded/public datasets once, records exact request URLs
and raw-response hashes, rejects truncation, fixes geometry and checks water-area
topology. A common 10 cm precision grid prevents shoreline-boundary gaps. Cached
responses make regeneration deterministic. For a refresh, use a new cache, update
the dataset version/retrieval date and engine URL, review output and provenance,
and release a new immutable version; never silently overwrite published data.
Raw source records stay outside Git. No full BC download is needed.

`engine.ts` owns rendering, navigation, input and disposal; `physics.ts` is pure
bounded movement; `Explorer.tsx` owns React UI; `places.ts` owns reviewed facts.
The route supplies shared framing, disclaimers, data credits and no-JavaScript
content. Engine state is not stored in React on every animation frame.

## Licence and next steps

Original Vancouver code and models are MIT. City-derived data remains under the
Open Government Licence – Vancouver. See `THIRD_PARTY_NOTICES.md` and the public
dataset manifest. No OSM data or reference-project source/media was copied.

V0.2 candidates: better building heights, road/bridge continuity, more informative
landmark models, physical-phone profiling and western False Creek. Walking,
traffic, historical/proposal layers, missions and multiplayer are not implemented.
