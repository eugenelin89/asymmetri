# UBC landmarks and Halloween implementation — October 31, 2026

This implementation adds a new arrival at the UBC entrance letters, enterable
Beaty Biodiversity Museum and Irving K. Barber Learning Centre reconstructions,
five improved outdoor athletics venues, and an optional Halloween atmosphere.
It is an implementation report, **not a production-release receipt**. Local integrated validation passed; public deployment is pending.

## Geography and arrival

Visitors begin on the pedestrian island at University Boulevard and Wesbrook
Mall, facing original three-dimensional silver UBC letters. The same anchor
serves the scene, map, directory and return-to-start action. The earlier baseball
precinct remains connected through the existing campus route network.

`gateway-layout.ts` uses the pinned PDDL pedestrian polygon
`LSHARD_TYPE-642-0`. The arrival is approximately 49.266295° N, 123.245676° W;
these are model coordinates within the documented island, not surveyed sign or
accessibility measurements. `gateway-model.ts` builds extruded letter outlines,
supports and a plinth with an original generated roughness texture. Letter size,
precise placement, finish and orientation remain photographic interpretations.
The [sign designer](https://www.lostandfoundstudio.ca/ubc-gateway-sign),
[project architect](https://www.publicarchitecture.ca/projects/ubc-gateway) and
[UBC development drawings](https://planning.ubc.ca/sites/default/files/2021-01/201223_GatewayDPBooklet_DP20037.pdf)
provide research references; their images are not shipped.

No published GIS snapshot is rewritten. The campus retains its existing metre
coordinate system, with additive runtime anchors shared by rendering and the map.

## New navigable public interiors

There are now **nine supported building interiors**: Rose Indoor Training Centre,
Bookstore, AMS Nest, Sauder, Hennings, War Memorial Gym, Orchard Commons, Beaty and
Irving. All nine are Level B reference reconstructions; no Level A as-built
interior is claimed. Outdoor fields and stadiums are counted separately.

### Beaty Biodiversity Museum

`beaty-layout.ts` corrects the runtime anchor to the narrow Main Mall glass
pavilion of source building VBL10086. The older anchor selected the larger research
wing. The source footprint remains intact; only the custom model's placement is
corrected. `beaty.ts` supplies glazing, the northern entrance, upper landing,
descending ramps, lower whale atrium and a representative public collection gallery.
`whale-model.ts` supplies an original approximately 26 m skeletal interpretation,
visible through the glass from Main Mall. Its head faces south-southeast, following
the architect's public plan.

The visitor can enter from outside, descend both ramp sections, explore the lower
atrium and gallery, then return normally. Ground and paving openings prevent the
flat exterior terrain from sealing the below-grade space. Shared floor/collision
logic supports the height transitions. The lower floor at −3.4 m and roof at 5.8 m
are modelling estimates. The whale is not a scientific specimen scan, and the cases
are educational fixtures rather than an exact exhibit inventory. Private research
rooms are excluded.

Research uses [Patkau's project plans and photographs](https://www.patkau.ca/projects/ubc-beaty-biodiversity-centre),
[UBC Properties](https://ubcproperties.com/project/beaty-biodiversity-research-centre-beaty-natural-history-museum/),
[the museum's whale information](https://beatymuseum.ubc.ca/exhibitions/permanent-exhibitions/blue-whale-display/blue-whale-project/)
and [public visitor map](https://explore.beatymuseum.ubc.ca/map/). Museum indoor-map
geometry was consulted, not imported or relicensed as a scene asset.

### Irving K. Barber Learning Centre

`irving.ts` builds a granite heritage core with arched openings and timber roof,
varied modern glazed wings, an East Mall entrance/lobby, public circulation,
Chapman hall, Ridington reading room and a mezzanine reached by a spiral stair.
The source VBL10080 footprint and East Mall doorway offset establish placement.
Three main stair flights connect four supported levels; furniture and railings
use the shared collision framework. Floor and rail openings preserve stair
clearance and the double-height Ridington space.

The [2019 public four-level map](https://wiki.ubc.ca/images/3/34/Irving_K._Barber_Learning_Centre_Map_2019.pdf),
[UBC history and highlights](https://ikblc.ubc.ca/spaces/building-history-and-highlights/)
and [architectural photographs](https://www.da-architects.ca/projects/ubc-irving-k-barber-learning-centre/)
inform the reconstruction. Model floor heights are 0/5/10/15 m, not measured
levels. Exterior steps connect the west heritage entrance to the model's second
level because Main Mall's actual higher terrain is not represented. Historic room
names are not assertions of current room assignments. Restricted collections,
private rooms, portraits and architectural artwork are not reproduced.

## Five outdoor athletics venues

`athletics-layout.ts` separates source footprint placement and published dimensions
from estimated fixture geometry. `athletics.ts` supplies original field paint,
goals/nets, seating, fences, lights and practice activity.

| Venue | Implemented scope and measurement limits |
| --- | --- |
| Ken Woods Field | Source-aligned soccer venue; published 120 × 75 yard playing dimensions. |
| Harry Warren Field | Source-aligned soccer venue; published 110 × 71 yard playing dimensions. |
| South Turf | Soccer venue with estimated 105 × 68 m markings within the actual source turf. |
| Rashpal Dhillon Track | Documented eight-lane, 400 m track, with interpreted 36.5 m inner radius and 1.22 m lane width; lane routing respects the source track polygon and its holes. |
| Existing Thunderbird Stadium | Published 150 × 74.5 m surface, Canadian-football/soccer markings, reconstructed spectator seating, walkable stand stairs/concourse and west grass bank. |

Sources are [UBC Thunderbird Park](https://sportfacilities.ubc.ca/thunderbird-park/),
[the official park map](https://sportfacilities.ubc.ca/wp-content/uploads/2020/08/3-THUNDERBIRD-PARK-Map-page-001.jpg),
[the existing stadium](https://sportfacilities.ubc.ca/thunderbird-stadium/)
and [Football Canada's 2025 rules](https://footballcanada.com/wp-content/uploads/2025/03/2025-Tackle-Rulebook-English.pdf).
Future stadium proposals are not rendered as completed buildings. Gates, benches,
lighting, fence placement and grandstand details remain interpretations. This
release adds no bespoke Osborne, rugby, Wright or NSDC reconstruction.

The activity system has 24 fictional soccer-practice players and 12 fictional
joggers. It uses articulated nearby figures and simplified distant figures, yields
to the visitor, and honours population/reduced-motion choices. These are simulated
activities, not real teams, schedules or occupancy. Existing baseball activity and
other campus systems remain separate.

## Halloween controls and calendar

The automatic default is **on for October 31–November 6, 2026 inclusive**, evaluated
in `America/Vancouver`. On November 7, a new visit without a current-year manual
override starts with normal atmosphere. The setting is available throughout the
year; a visitor's explicit on/off choice takes precedence and is stored locally
for the current calendar year. No profile, server account or tracking is required.
The schedule is centralized for reuse in future years; subsequent years currently
use an October 25–November 1 automatic window. This is separate from the special
seven-day 2026 release window. Initialization happens when Start exploring is
selected, so server rendering does not depend on browser date or storage.

Enabling the edition selects autumn, overcast weather and 19:30. The previous
season, weather and time are saved for that visit and restored when it is turned
off. Quality, population and reduced-motion preferences are retained. Ordinary
season/time/weather controls are disabled while the edition is active so that
they do not silently replace the saved atmosphere. The Atmosphere panel and photo
mode provide an explicit off action; storage failure leaves a usable session-only
choice. Only the edition preference is persisted, not the prior visit's complete
atmosphere settings.

`halloween-sky.ts` provides an original generated full-moon texture, cloud shader
and moonlight. This is an art-directed scene, not a claim about the actual lunar
phase or weather. The sky follows the camera in all three dimensions, keeping
walking, below-grade and aerial views inside the cloud canopy with a stable moon
direction. Reduced motion freezes cloud drift; disabling the edition hides both
the sky meshes and their moonlight.

`halloween.ts` adds 29 dispersed decoration sets across nine enterable interiors,
each with an original pumpkin, translucent ghost and cobweb, plus two glowing
pumpkins at the gateway. There are three sets per building, with four at Irving
and Orchard. Sets extend across supported levels at Beaty, the Nest, Irving and
Orchard; sets on the same floor remain at least eight metres apart. The placement
system finds clear standing space away from entrances, stairs and low ceilings.
Friendly ghost, pumpkin and moss creatures roam sampled, clear segments
of the existing pedestrian routes; their starting positions are dispersed rather
than clustered. They yield to the visitor and avoid newly blocked movement.

The overlay uses six instanced batches with distance limits. It adds no solid
collision, dialogue, audio or gameplay objective and does not alter ordinary
campus geometry. Disabling Halloween hides and freezes the overlay; reduced motion
freezes decorative motion; population off hides and stops outdoor creatures while
retaining the decorations. Repeated toggles reuse the same objects, and the existing
scene lifecycle disposes their shared resources. Automated lifecycle checks and browser visual checks passed; physical-device
acceptance remains outstanding.

## Assets, scope and limits

These additions use original MIT procedural geometry, existing Three.js and the
unchanged UBC PDDL exterior dataset. They add no third-party model, portrait, voice,
font, photograph, floor-plan image, university logo file or copyrighted artwork.
Reference imagery remains research material outside the shipped assets. Full
provenance and exclusions are in [UBC third-party notices](../projects/ubc/THIRD_PARTY_NOTICES.md)
and the [asset manifest](ASSET_MANIFEST.md).

The wider campus retains mixed detail and exterior-only background buildings.
General ground elevation remains flat; local stairs/ramps do not constitute a
terrain survey or real-world accessible navigation. Exact architecture, current
furnishing layouts and full campus coverage are not claimed. Virtual access does
not grant real access. The project remains unofficial and independent.

## Local validation results

| Check | Result |
| --- | --- |
| `npm run test:ubc` | **99 passed, 0 failed**, including the four new sky tests. |
| Vancouver / Surrey / Richmond regression suites | **74 / 69 / 27 passed**. |
| TypeScript and ESLint (`npm run check`) | Passed; the existing tutorial warning remains. |
| Vinext candidate build | Passed with final athletics shader and V0.4 public copy verified in emitted bundles. |
| Production dependency audit | **0 vulnerabilities** reported. |
| Next production build | Passed; local build `qwey2Xqf7rk9-KesME5qs`. All 195 prebuild tests passed. |

The automated suites exercise source containment, actual generated collision,
continuous entrance/stair/ramp traversal, rendered clearance, the visible whale,
sports arrivals and actors, and Halloween controls and lifecycle. Beaty's first
ramp is checked at two lateral walking positions after moving its obstructing
columns against the curtain wall. Irving tests use the actual GIS placement with
adjacent source buildings solid, as well as its public stairs and spiral.
See [testing requirements](TESTING.md#ubc-landmarks-and-halloween--october-31)
for the specific suites.

Actual browser checks on the local development application at **1280 × 720** covered:

- Gateway letters, full moon, roaming creature and pumpkins in the starting scene.
- Beaty's whale visible through Main Mall glazing, its entrance, and walking down both ramps.
- Irving's entrance, walking to Levels 2 and 3, and the Chapman space. Automated tests additionally cover the other supported levels, heritage steps and spiral.
- A moving track jogger, the final athletics aerial view, and Thunderbird Stadium's covered grandstand view. The final aerial rendering produced no browser errors or warnings.
- A visible Halloween ghost inside Rose and the working reduced-motion checkbox. Automated tests establish motion freezing and safe on/off transitions.

The **390 × 844 phone viewport** and **820 × 1180 tablet viewport** exercised the
Halloween controls without horizontal overflow. These were browser viewport
checks, not physical phone or tablet tests. The [eight-image browser gallery](validation/ubc-landmarks-halloween/README.md)
contains actual local screenshots; earlier galleries document earlier versions.

Performance remains a material limitation: an Irving development-view observation
showed approximately **12 FPS, 559 draw calls and 1.817 million triangles**. This is
a single development-browser observation, not a sustained benchmark or a production
device result. The 60 FPS desktop target has not been demonstrated. Sustained
frame-time testing and physical-device testing remain outstanding.

A fresh-origin production-mode preview starts with Halloween enabled, as scheduled.
Keyboard Space toggles the edition and restores the previous normal atmosphere;
the preview produced no console errors or warnings. The public UBC badge and GIS
Apps card now describe V0.4 and nine interiors.
Production activation remains pending. These local checks
do not establish production availability or a complete walkthrough of every space.

A future deployment receipt must separately record exact source/build identities,
Linux artifact checks, protected-site/profile continuity, activation, public health
and the complete immediate rollback. This report contains none of those claims.
