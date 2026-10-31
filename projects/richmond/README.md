# Richmond Learns to Drive

An independent, experimental browser delivery game at `/labs/richmond`, under
Asymmetri Labs → GIS Apps. **V0.1 playable preview**: a geographically grounded,
stylized world with original fictional people, businesses and interiors.
The title refers to the fictional courier learning city driving.

**V0.2 candidate, not released:** the isolated driving/exploration revision and
its incomplete browser gates are recorded in
[V0.2 acceptance](../../docs/RICHMOND_V02_ACCEPTANCE.md). The changes described
below apply to that candidate; the public release remains V0.1.

The opening screen offers **Continue** for a validated save, **Start Delivery
Shift** (opens the order board without resetting progress), **Explore Richmond**
(paused aerial survey), and **Open Airfield** (enables the fictional permission
and surveys the office connection). None relocates the courier. Replacing a
career requires the explicit Settings confirmation.

While surveying, use **Find Me**, **Find My Car**, **Whole City**, the landmark
selector, or **Return to Player**. Drag to orbit, right-drag or WASD/arrows to
pan, and wheel or +/− to zoom. Find Me follows the exterior entrance while the
courier is indoors; Return to Player restores that interior and the prior play
camera. Clock, orders, health, cash and actors remain paused. Free-roam routes
cannot replace an active delivery. Top down remains a playable overhead view.

## Play

Start with a compact car, $20 fictional CAD, full health/stamina and a delivery
bag. Accept **First Day in Richmond**, drive and park, leave the car, enter
Brighouse Kitchen and collect the labelled bento. Return to the same car and
deliver to Mei at Minoru Park. The introductory order allows 20 minutes of active
play; menus, aerial surveying, shops and hidden tabs pause progression.

Eight authored regional stories and three regenerated neighbourhood offers use
the same economy and inventory. Every offer quotes actual routed distance,
distance-sensitive pay and a time allowance that includes travel to pickup. Pickups require walking inside;
delivery requires the correct collected item. Payments have stable transaction
IDs. A repeated handover or reload cannot credit the same delivery again.
Orders can expire, be cancelled or lose freshness; none creates debt.

Richmond Centre Shopping Break includes the food-court pickup, delivery earnings
and a return trip to buy the insulated bag. The mall has two usable exterior
entrances linked by connected interior corridors and three shops. The YVR main
terminal has arrivals, departures, baggage scenery, passenger concourses, three
shops, a pickup counter and an arrivals meeting point. A separate fictional
Airport Operations Office is enterable. **Terminal Takeout** and **Airport Lunch
Run** use the same car, inventory and progression as the rest of Richmond.

Open Airfield is available from the map immediately. Drive to the Airport
Operations Office, use the marked **fictional airfield connection**, and explore
the runways, taxiways and aprons. The public vehicle graph does not route through
the airfield. This does not describe real airport access, permission or security.
Aircraft are parked decorative models; no moving aircraft are simulated.
The map opens on **Nearby streets**; **Richmond region** provides the wider view.
Shaded aprons and the gold connection show the existing office-to-airfield access.
From office parking, enter the apron and turn west toward the marked taxiways.

## Controls and accessible menus

| Action | Keyboard / mouse | Touch |
| --- | --- | --- |
| Walk / drive | WASD or arrows | Hold arrows |
| Sprint / brake | Shift on foot / Space in car | Sprint / Brake |
| Enter or leave the same car | F, while stopped | Car / Exit |
| Enter, collect, talk, shop, deliver | E | Interact |
| Look / orbit | Drag; pointer lock optional in Menu | Drag the clear playing area |
| Third / first / top / aerial camera | 1 / 2 / 3 / 4 | Camera buttons |
| Aerial pan / zoom | WASD, right-drag / wheel | Arrows / + and − |
| Map / orders | M / O | Map / Orders |
| Pause / recover | Escape / R | Menu / Recover safely |

On phones, Start opens a screen-filling play shell using the dynamic viewport
and safe-area insets. Touch controls, camera buttons and short status messages
occupy separate rows outside the canvas. The large objective, health panel and
minimap are hidden until requested through Details or Map. A single full-screen
paused panel replaces the view. Landscape uses side controls with an unobstructed
centre. Done saves and returns to the website. This avoids overlapping phone HUD
panels; it is not a claim of physical-iPhone performance certification.

Settings include Lite Mode, population density, text size, north-up overhead
view, reduced motion, English/bilingual core labels, Gentle Streets, encounter
frequency and consequence severity. Longer instructional copy remains English;
Traditional Chinese signs and courtesy lines are authored, not machine-random
characters. Menus have focus traps, visible focus and Escape/Close controls.
The static page and text guide remain usable without WebGL or JavaScript.
Recovery aligns with the current delivery road where possible; Open Airfield
recovery stays on nearby airport surfaces. Graphics retry creates a fresh canvas.

## City and interior coverage

The WGS84 bounds are `[-123.235, 49.10, -122.94, 49.215]`. Distances are metres,
not a compressed theme-park scale. Local coordinates use EPSG:32610 and origin
`[-123.137,49.166]`; x points east and z south. The extent includes some neighbouring
land around the Fraser. It is independent of the Vancouver and Surrey games.

All imported building footprints are rendered at distant LOD; nearby 512 m tiles
load original facade detail. Exterior visibility does not imply an enterable
building. Authored destinations use clear approaches to the largest strongly
connected public road network. Other imported source roads can be isolated,
restricted or outside mission routing. Source path coverage is separate from
vehicle routing. Streets end at the marked model bounds; recovery remains available.

| Anchor | District | Playable destination |
| --- | --- | --- |
| CF Richmond Centre | City Centre | Enterable mall |
| Brighouse Kitchen | City Centre | Enterable restaurant |
| Minoru Park | City Centre | Outdoor meeting point |
| Richmond City Hall | City Centre | Outdoor meeting point |
| Richmond–Brighouse Station | City Centre | Exterior landmark |
| Lansdowne Centre | City Centre | Enterable restaurant |
| Aberdeen Centre | Golden Village | Enterable restaurant |
| Parker Place | Golden Village | Exterior landmark |
| Yaohan Centre | Golden Village | Exterior landmark |
| Alexandra Road | Golden Village | Enterable restaurant |
| Steveston Village / Moncton Street | Steveston | Enterable restaurant |
| Garry Point Park | Steveston | Outdoor meeting point |
| Britannia Shipyards | Steveston | Outdoor meeting point |
| Terra Nova Rural Park | Terra Nova | Outdoor meeting point |
| Terra Nova Village | Terra Nova | Enterable restaurant |
| Thompson | Northwest | Exterior landmark |
| Seafair | Southwest | Outdoor meeting point |
| Westwind | Southwest | Outdoor meeting point |
| Broadmoor | Southwest | Outdoor meeting point |
| Garden City | Garden City | Enterable lobby |
| Blundell | Central Richmond | Outdoor meeting point |
| Ironwood | East Richmond | Outdoor meeting point |
| South Arm | South Richmond | Outdoor meeting point |
| McLennan | East Richmond | Outdoor meeting point |
| IKEA Richmond / Jacombs Road | Bridgeport | Enterable office |
| Bridgeport Road | Bridgeport | Exterior landmark |
| Cambie Road | East Richmond | Exterior landmark |
| No. 5 Road | East Richmond | Exterior landmark |
| No. 6 Road | East Richmond | Exterior landmark |
| Knight Street Bridge | Bridgeport | Exterior landmark |
| Hamilton | Hamilton | Outdoor meeting point |
| YVR Main Terminal | Sea Island | Enterable terminal |
| Airport Operations Office | Sea Island | Enterable office |

The central/Steveston/Terra Nova/Bridgeport/YVR connections, No. 6 Road, Knight
Street Bridge approach and Hamilton are exercised by continuous vehicle-physics
tests. This is not a statement that every private property or building is usable.
The Middle Arm, No. 3 Road, Jacombs Road, Moncton Street, agricultural land and
industrial areas follow imported geography; only the listed places have authored
interactions. No real residential occupants or private-home interiors are modeled.

### Playable airport surfaces

- 08R/26L (`osm:16187299`), full included centreline and broad surface.
- 08L/26R (`osm:16261588`), full included centreline and broad surface.
- Airfield taxiway (`osm:95049739`), full included centreline and broad surface.
- 13/31 (`osm:515160877`), full included centreline and broad surface.
- Airfield taxiway (`osm:865452034`), full included centreline and broad surface.
- Airfield taxiway (`osm:1246788317`), full included centreline and broad surface.

All imported taxiway centrelines are checked for continuous supported surfaces;
aprons use polygon areas. The three included runway lengths are driven through
the actual vehicle integrator. The authored office-to-apron connection is about
19 m and is gated by Open Airfield. The terminal and operations office are the two
enterable airport buildings; other hangars/terminals remain exterior scenery.

## Data, licences and reproducibility

© OpenStreetMap contributors. The **entire derived geographic database**, including
authored approach polygons, is ODbL; original code and procedural artwork are MIT.
See [third-party notices](THIRD_PARTY_NOTICES.md) and the public snapshot manifest.
No proprietary maps, airport plans, imagery or business logos are reproduced.
Original interior plans are not current operational layouts.

Snapshot `v0.1-2026-10-30` contains 34,540 road/path/airfield ways, 59,361 footprints,
686 building tiles, 137,093 source-topology nodes and 146,604 graph edges. Among
building heights, 1,038 are source-reported, 3,784 estimated from floor count and
54,539 illustrative. None is represented as a newly measured survey. Source edit
dates are not observation dates; observation dates are unknown.

Road widths use available OSM widths or lane/class estimates. Vehicle-bridge decks use
illustrative 8 m elevation with 6% approach ramps. Shared OSM nodes define
junctions; projected crossings never invent connectivity. Public edges intersecting
buildings/water or lacking return connectivity are excluded from mission routing;
`excluded-road-edges.json` records each exclusion. Entrance approaches stay at
ground level beneath elevated terminal access roads. Parks, terrain and facades
remain simplified. The exact downloaded source bounds, response counts, hashes
and retrieval dates are retained in `manifest.json`.

The complete derived database and transformations are published with the source;
raw contributor-bearing API XML remains outside Git. Ordinary play and builds make
no live GIS requests. Overpass requests failed during acquisition; the successful
bounded API fallback subdivides node-limited tiles and fetches missing relation
members instead of accepting incomplete geometry. Routine refreshes should prefer
an appropriate bounded extract or Overpass instance.

```sh
python3 -m venv /path/outside/repo/richmond-tools
/path/outside/repo/richmond-tools/bin/pip install -r projects/richmond/tools/requirements.txt
# Only for a deliberately new source capture; preserve the resulting raw cache.
/path/outside/repo/richmond-tools/bin/python projects/richmond/tools/fetch_api.py --cache /path/outside/repo/richmond-raw
# Offline compile from the pinned normalized input hashes.
/path/outside/repo/richmond-tools/bin/python projects/richmond/tools/build_city.py --cache /path/outside/repo/richmond-raw --output /path/outside/repo/new-snapshot
```

The compiler refuses differing bytes in an existing output path. For a refresh,
change the version, use a fresh output directory and update runtime/tests together.
Compare output hashes before copying a verified snapshot into `public/richmond/`.
Do not run acquisition or GIS compilation on the constrained production host.

## Architecture and persistence

- `types`, `data`, `world`: stable IDs, validation, projection/topology and spatial
  indexes. Only pure Vancouver `inPolygon`, `segmentDistance` and `stepCar`
  helpers are reused; no other game's state/data is imported. Richmond's
  `collision`/`vehicle` wrapper checks the rotated car body and intermediate
  poses, including grade-separated actors and non-deepening overlap separation.
  `navigation` separates parking, entrance, interior and return-to-car legs.
- `simulation`, `story`, `interiors`: renderer-independent movement, orders,
  shopping, fictional encounters, economy and original interior geometry.
- `population`, `streetscape`: bounded local actors and instanced street detail;
  district density, pedestrian avoidance, parked/moving traffic and basic signals.
  Clothing, skin tones and stature are visual variety and never threat variables.
- `scenery`, `camera`, `engine`: procedural models, independent four-camera state,
  one renderer/loop, tiled details, LOD, capped resolution, input and cleanup.
- `Game`, `Map`: accessible menus and on-demand maps. The renderer loads after
  starting. Returning visitors with a save load the local map to validate Continue;
  that result is reused on start. New visitors load it on start. Unrelated website
  pages load neither renderer nor geographic snapshot.
- `save`: `asymmetri.richmond.save.v1`, with finite values, versions, enums,
  inventory/ledger consistency and safe position repair. Other games' keys are
  never accessed. Invalid data is retained until explicit reset; storage failure
  allows session-only play. There is no account, upload or offline elapsed penalty.

The additive v1 migration supplies missing encounter settings and gives older
preview First Day saves the same 20-minute tutorial allowance. Unknown versions
or map IDs are rejected safely; no unsupported migration is guessed. The local
save is a casual-game continuity mechanism, not a trusted anti-cheat service.

Typical actor budgets before clearance filtering are 96 outdoor people (district
factor .65–1.1) and 28 cars, scaled by the density setting. Interior crowds scale
with floor area up to 96. Lite Mode halves actor budgets and lowers rendering
resolution. Crowds are local, not a full-fidelity citywide population simulation.

## Validation and limits

```sh
npm run test:richmond
npm run check
npm run test:vancouver
npm run test:surrey
npm run build:next
npm run build
npm audit --omit=dev
```

The Richmond suites verify immutable hashes, required anchors, directed return
connectivity, whole-body collision, continuous driving through every required
region and included runway, walking through mall/terminal/office corridors,
multiple mall exits, pickups, shops, payment idempotence, validated saves,
camera independence, pause rules and bounded encounters/recovery.

See [implementation and acceptance evidence](../../docs/RICHMOND_HANDOFF.md) for
actual browser journeys, device measurements, remaining unverified checks and
release status. Automated geometry/physics tests are distinct from browser
acceptance; an HTTP response or screenshot does not prove gameplay completion.

Known limitations: stylized architecture rather than photoreal reconstruction;
flat terrain outside schematic bridge ramps; approximate sidewalks/parking;
simple local traffic/avoidance and parked decorative aircraft; partial UI
localization; browser-local saves; large first map download. Physical-phone
performance and exact real-world access/architectural accuracy are not asserted.
