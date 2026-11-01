# UBC Virtual Campus — research preview

“Explore the University of British Columbia, virtually.”

Independent Asymmetri Labs → GIS Apps project at `/labs/ubc`. This is a working
implementation candidate, not a completed UBC digital twin or a certified
production-quality milestone. It is unofficial and has no UBC or faculty endorsement.

See the [flagship development roadmap](../../docs/UBC_ROADMAP.md) for adopted flagship
V0.5–V1.1 planning milestones, quality gates, and current fidelity priorities.

## Run and validate

Use Node 24 from the repository `.nvmrc` and the existing lockfile. No dependency
was added for UBC.

```sh
npm ci
npm run dev:next -- --port 3026 --hostname 127.0.0.1
npm run test:ubc
npm run check
npm run build:next -- --webpack
npm run build
```

Open `http://127.0.0.1:3026/labs/ubc` and select Start exploring (Enter if you dare
in the Halloween edition). The renderer and
committed GIS snapshot load on demand. Production compilation does not fetch GIS
services. See [the Orchard V0.2 report](../../docs/UBC_ORCHARD_MVR_2026-10-31.md) and [original campus report](../../docs/UBC_IMPLEMENTATION_2026-10-30.md).

## Visitor experience

- Arrival: start on the source-mapped pedestrian island beside the silver UBC
  entrance letters at University Boulevard and Wesbrook Mall, facing the sign.
  The earlier West 16th Avenue start remains available through campus exploration.
- First person / Third person: WASD moves (A/D strafe); left/right arrows turn,
  up/down arrows move. Click-hold and drag to turn/look; E interacts; V switches
  first/third person. The third-person visitor uses the existing original figure model.
  Optional mouse lock is in Help; Escape releases it. Natural speed is 1.45 m/s;
  running is 5.5 m/s with Shift or the held Run touch control. Touch controls
  maintain independent pointer ownership; ↶/↷ turn.
- Aerial: orbit, pan and zoom with Three's OrbitControls. Returning to either on-foot view retains
  the visitor's coordinates. Map is north-up source geometry with selectable destinations.
- Search: priority destinations and imported building names. People are never listed.
  Multipart source buildings share one directory entry, with addresses and footprint counts; all source geometry remains on the map. Visit entrance is explicit virtual fast travel and returns keyboard focus to the scene, as do map travel and on-foot camera controls. Walking route uses the official
  source route graph, and refuses disconnected results instead of drawing a shortcut.
- Interiors: physically walk through entrance gaps. Rose, Bookstore, Nest, Sauder, Hennings and War Memorial Gym
  have walls and fixture collision. Orchard adds a lobby and one representative floor
  with eight bedrooms, five bathrooms, sixteen working doors, lounge/study, stairs
  and a continuous platform lift. The Nest has ground/5 m/10 m public galleries,
  two stair flights and a suspended lounge. Beaty adds a glass whale pavilion,
  descending ramps and a lower public collection gallery. Irving K. Barber adds
  four supported public levels, the Chapman hall and Ridington reading room with
  a mezzanine and spiral stair. These are **nine supported building interiors**;
  outdoor sports venues are counted separately.
- Conversations: encounter people in the world; approach and press E or tap **Talk**
  to begin a choice-based conversation. Say hello, wave, ask who they are, choose a reviewed question and follow-ups, or say goodbye. The character faces you and performs an original wave/nod/talking gesture. No character roster, location markers, name labels,
  Find actions or routes to people are exposed, even after meeting someone.
  The underlying registry includes the original guides, sourced faculty/roster/alumni records, historical guests and optional participant profiles,
  curated questions, follow-ups, session-only
  history and keyword lookup. Unsupported private opinions, promises and whereabouts
  produce a source-linked refusal. No external AI service or voice imitation. Optional public profiles use the explicitly requested server persistence.
  Each record has a short spoken introduction separate from its biography. Routine
  answers use conversational language; full simulation/source/model notes are in
  About this simulation. Typed greetings and identity questions share the button flow.
- Pedestrians: source-route arrivals have spacing and local density limits. Walkers yield and pass each other; only the selected conversation partner stops for a conversation. Other nearby people keep walking.
- Outdoor athletics: Ken Woods, Harry Warren and South Turf have reconstructed
  soccer markings, goals, fences, benches and fictional practice groups. Rashpal
  Dhillon Track has an eight-lane running loop with fictional joggers. The existing
  Thunderbird Stadium has Canadian-football/soccer markings, spectator structures
  and a traversable grandstand/grass embankment. These are simulated activities,
  not real matches, training schedules or occupancy.
- Atmosphere: four seasons, representative Vancouver dates with a NOAA solar
  approximation, daylight/night, rain/fog/cloud/snow scenarios, wet pavement and lights.
  Winter snow is optional; evergreen and deciduous trees are separate materials.
- Halloween audio: enabling sound requests the browser's optional playback audio
  session, which WebKit documents for Silent Mode playback on iOS 17 and later.
  Mute, zero volume and background pause still apply. Unsupported browsers keep
  their existing behavior. Entry applies the chosen sound settings and starts
  the audio graph before campus assets load. Silent Mode playback was confirmed
  after a manual toggle; the owner reports the deployed first-entry correction working in the November 1 roadmap. See the
  [audio follow-up and primary sources](../../docs/UBC_AUDIO_IOS_2026-10-31.md).
- Photo: hides normal UI and shows a fresh canvas PNG preview with a Save PNG link.
  The browser validation gallery retains real scene exports and interaction captures.

## Architecture and reuse

`Campus.tsx` owns the accessible React shell, directory, information dialogs and
map. `ConversationPanel.tsx` renders action/response choices; `conversation.ts` owns bounded session dialogue and reviewed follow-ups. `building-directory.ts` groups importer-generated multipart IDs without merging unrelated same-named records. `engine.ts` owns Three.js lifecycle, cameras, inputs, selection, scene LOD and
telemetry. It directly reuses Surrey's `disposeScene`, already covered by its
resource-disposal regression test. Existing city engines and their immutable
snapshots are not modified.

`spatial.ts` is a reusable metre-space coordinate, collision, floor/ramp and graph
routing module. `environment.ts` contains pure season/time calculations.
`registry.ts` centralizes reviewed places, official links, displays, biographies,
permissions, source dates and conversation content. `types.ts` defines contracts.
`architecture.ts`, `stadium.ts`, `scenery.ts` and `people.ts` provide original
procedural assets. Asset material batching and geographic tree groups reduce draw
calls. Detailed architecture switches to source-outline proxies at distance;
quality presets control pixel density, vegetation range and shadows.

`gateway-layout.ts` shares the arrival pose and additive place anchor between the
renderer and map; `gateway-model.ts` builds original extruded letters. `beaty-layout.ts`
selects the Main Mall pavilion part of VBL10086 at runtime, correcting the older
anchor on the research wing without changing the published GIS snapshot.
`beaty.ts` and `whale-model.ts` build the public museum reconstruction and original
skeletal interpretation. Ground openings and below-grade floor support allow the
visitor to descend beneath the exterior terrain. `irving.ts` uses the shared
architecture builder for its varied wings, heritage core and connected public
floors. Its main entrance follows the source East Mall doorway offset.
`athletics-layout.ts` records source-aligned sports anchors and separates published
dimensions from estimates. `athletics.ts` batches original venue geometry and
updates distance-limited practice groups/joggers, with shared collision surfaces.

This is separate from Surrey/Richmond gameplay: it has no combat, health, missions,
scores, money, inventory or live tracking. Shared improvements can be extracted
later after browser acceptance; no broad existing-project refactor was necessary.

## Accuracy and permissions

All nine supported building interiors are **Level B reference reconstructions**, not verified
as-built layouts. Public historic Bookstore plans and the AMS amenities map support
research but do not prove today's fixture arrangement. Other buildings are **Level C
exterior-only**. No Level A interior is claimed. Orchard bedrooms are fictional demonstrations, not current private rooms or assignments.

The source footprint establishes geography; oriented architectural envelopes,
facades, roof forms, furnishings and stadium components remain interpretations.
General campus ground elevation is flat; local museum ramps and building stairs
do not constitute a terrain survey or real-world accessible route planner.
Beaty's lower level is interpreted at −3.4 m. Irving's four levels use 0/5/10/15 m;
exterior steps reach the west heritage entrance because Main Mall's actual higher
grade is not modelled. The Sauder expansion is described as construction expected to finish
in 2027, not rendered as a completed future building.
The Nest's supported central envelope is narrowed to 76 m to avoid overlap with the
Alumni Centre. Source trees whose canopies intersect supported model envelopes are
excluded from rendering; source records and mapped footprints remain unchanged.

The entrance island is identified by the pinned landscape record
`LSHARD_TYPE-642-0`. The sign's dimensions, exact position and orientation within
that island remain reference interpretations. Beaty's whale is an original
approximately 26 m skeletal model, not a scientific specimen scan. Its head faces
south-southeast, as in the architect's public plan. Collection cases are representative
educational fixtures; private research rooms are not included. Irving's 2019
visitor map informs public circulation, while photographs inform materials and
room character. No current room assignments, complete floor-plan accuracy or
access to its restricted collections is claimed.

The outdoor additions are Ken Woods Field, Harry Warren Field, South Turf,
Rashpal Dhillon Track and the existing Thunderbird Stadium. Other sports facilities
retain their previous context geometry; this is not a complete Thunderbird Park
architectural reconstruction. Ken Woods and Harry Warren field dimensions follow
published facility measurements. South Turf's 105 × 68 m markings, track curve/lane
geometry, fences, seating, lights and event-fixture positions are interpretations.
The stadium uses the published 150 × 74.5 m playing surface with Canadian-football
markings; its grandstand detail is reconstructed. Future stadium proposals are
not presented as completed structures.

Greg Werker's current faculty profile says “Senior Associate Dean, Student Experience”.
The older leadership-directory wording “Students” is recorded as a source conflict.
Bacon's official biography and September 2026 welcome support his presidential role.
Virtual routes do not represent either person's actual movements.

Read [third-party notices](THIRD_PARTY_NOTICES.md), the data manifest and the full
acceptance report before publishing. Browser walkthroughs and 25 real captures now
exist; physical-device testing, reference comparisons and sustained frame-time
measurements remain separate acceptance gates. See the [evidence gallery](../../docs/validation/ubc/README.md).

## Updating information

Edit the reviewed record in `registry.ts`, re-open its official sources, update the
verification date, and run the UBC tests. Never infer an academic title from a stale
directory alone. Do not add an unverified named person. New links must pass the
HTTPS host allowlist and receive `noopener noreferrer` in the accessible UI.
Data refreshes must produce a new versioned directory and manifest; do not silently
replace accepted published snapshots. Raw research downloads belong outside Git.

## Orchard Commons V0.2

`residence-layout.ts` owns rooms, doors, bathrooms and the source-derived anchor.
`residence.ts` builds the open-house floor; `residence-mesh.ts` owns original
furniture/finishes; `residence-exterior.ts` preserves source podium outlines and
separates historical-height tower interpretations. `doors.ts` shares leaf animation
and collision. `residence-content.ts` supplies sourced Housing content and three
fictional students to the registry. `ResidenceGuide.tsx` is a visitor-facing
schematic with explicit reconstruction limits.

The separate `orchard-v0.2-2026-10-31` snapshot preserves the original campus bytes.
Run `python3 projects/ubc/tools/verify_orchard.py PATH_TO_PINNED_SUBBUILDINGS`
to recheck its transformation/digest; the exact source URL is in the manifest.
Refresh Housing claims in `residence-content.ts`, verify official pages, update
the date and run UBC tests. Do not replace a published snapshot in place.
The latest user instruction authorizes guarded production release after validation.
See the V0.2 report for actual release status and remaining fidelity limits.

## V0.3 map travel and walking guide

Click/tap any map spot or named landmark. **Go here** immediately moves to a safe
outdoor source-path vertex within 120 m; the selected pin shows the resolved point.
**Guide me** keeps the current position and opens GPS-style guidance in the last
on-foot view. The arrow turns with the visitor, remaining distance follows the
route, and arrival/off-route/exit-building states are explicit. Recalculate and
Stop controls remain available. Disconnected paths report failure without inventing
a route through buildings. Guidance is a virtual-campus aid, not real-world GPS.

Map keyboard: focus the map, use arrows to move a pin, Enter to mark the centre
or current selection; Tab reaches Go here/Guide me. Existing building information
is available through Place info. The map and guide collect no device location.

`navigation.ts` centralizes controls/speeds; `follow-camera.ts` reuses the original
visitor mesh and fits the camera with five clearance rays against visible scenery,
including loaded room furniture and moving doors. It hides the visitor when close
clearance would obscure the view. `wayfinding.ts` resolves safe map points and
computes route progress; `CampusMap.tsx` owns map selection and accessible actions.

## V0.3 campus life and community

See [the V0.3 report](../../docs/UBC_CAMPUS_LIFE_V03.md) for that release's seven interiors, partial faculty coverage, varsity seasons, transport sources and limitations. The current implementation adds Beaty and Irving as described above. Public profiles require Node and a private persistent `UBC_PROFILE_DIR`; the Cloudflare build alone does not provision this filesystem service. See [community operations](../../docs/UBC_COMMUNITY_OPERATIONS.md).

The [encounter refinements](../../docs/UBC_ENCOUNTER_REFINEMENTS_2026-10-31.md)
are [verified live](../../docs/UBC_ENCOUNTER_RELEASE_2026-10-31.md): action-and-response
dialogue, dispersed pedestrians, grouped building entries and immediate movement
focus after travel. The release adds no new geographic coverage.

See [natural dialogue](../../docs/UBC_NATURAL_DIALOGUE_2026-10-31.md) for the
[verified live refinement](../../docs/UBC_NATURAL_DIALOGUE_RELEASE_2026-10-31.md): concise introductions and conversational answers across the registry,
with source/reconstruction notes outside the spoken response.

## Landmark and Halloween candidate — October 31

See the [implementation report](../../docs/UBC_LANDMARKS_HALLOWEEN_2026-10-31.md)
for the gateway start, Beaty and Irving additions, five outdoor athletics venues
and current reconstruction limits. Nine supported building interiors are separate
from those five outdoor venues. [Local browser evidence](../../docs/validation/ubc-landmarks-halloween/README.md)
includes the gateway, Beaty, Irving, athletics and responsive Halloween controls.
The report records 99 passing UBC tests and the observed development-rendering
performance limitation. Its [production receipt](../../docs/UBC_LANDMARKS_HALLOWEEN_RELEASE_2026-10-31.md)
records the deployed source and build; later follow-ups require their own validation.

**Halloween campus** is available in Atmosphere throughout the year. With no
current-year manual choice, the automatic default is October 24–November 7
inclusive every year in `America/Vancouver`, returning to normal on November 8. An explicit device-local
on/off choice overrides the date for that calendar year; it expires for the next
year. The current welcome resolves this preference after hydration, before entry,
with a guarded initialization fallback on Start exploring. The initial server and
client renders remain deterministic.

The edition uses autumn, overcast weather and 19:30, with an original full moon,
cloud canopy and seasonal decoration. Turn it off to restore the previous season,
weather and time from the same visit. Quality, population, markers and reduced
motion remain independent. The normal season/weather/time controls are temporarily
disabled while Halloween is on, and photo mode also has an off action. The moon is
artistic, not an assertion of the real lunar phase. No account or live weather
service is involved; only the edition choice is saved on this device.

`halloween.ts` supplies dispersed pumpkin/ghost/cobweb sets across nine interiors,
including supported upper and lower levels, plus gateway pumpkins and creatures
along clear source paths. The additive overlay uses instanced geometry, adds no
solid collision, and creates no dialogue or required activity. Reduced motion
freezes its animation; population off hides and stops outdoor creatures while
retaining décor. Turning the edition off hides the entire overlay. Existing scene
disposal owns its original shared geometry and materials.

## After Dark follow-up — local checks passed

The [After Dark notes](../../docs/UBC_HALLOWEEN_AFTER_DARK_2026-10-31.md) describe
the current seasonal welcome, with original SVG campus artwork, a regular-campus
switch and an independent **Masked pursuer** checkbox. The same edition preference
drives the welcome and the world. CSS honors the operating system's reduced-motion
setting; the illustration requires no Three.js scene or external image download.

The roaming population adds six original creature designs: werewolf, lizard,
jiangshi, zombie, vampire and ghost, with shared near/far geometry and varied
movement. The complete source fixture places 84 figures, 14 of each kind. Quality
caps range from 24 on Low to 84 on Ultra, subject to safe routes and distance.
The separate masked figure follows outdoors, stops short of the
visitor, waits outside buildings and can be outrun with Shift or touch Run. Turn
it off independently in the welcome or Atmosphere. It carries a prop knife but
has no attack or damage system. Population off hides it and reduced motion freezes
it. Original eerie music, wind, wolf howls and nearby ghost cries/screams begin
after entry, with mute and volume controls. Six source-grounded alumni visitors
add encounter-only conversations about their studies. The report records the
local validation checkpoints, browser evidence and exact release acceptance;
implementation notes alone are not a deployment receipt.

The follow-up also includes 24 comic, manga and original robot costume visitors
from `halloween-heroes.ts`. They roam eligible campus paths with reciprocal crowd
yielding and nearby fictional labels, without directory listings. These are
decorative visitors; existing educational-guide conversations remain separate.
Nearest-first quality limits allow every costume to be encountered at every
quality level. Batched costume resources have their own explicit disposal.

Calendar initialization selects the matching Vancouver meteorological season
for the regular campus; winter starts overcast without automatic snow. December
1–31 is reserved for a future Christmas edition in the seasonal registry, which
is explicitly unavailable until its visuals and behavior are implemented.

Closing an in-scene panel returns keyboard control to walking without another
canvas click. Search/input fields retain normal typing while the panel is open.

## Campus community follow-up

The [community update](../../docs/UBC_CAMPUS_COMMUNITY_2026-10-31.md) adds 500 supplied student identities without duplicating two existing rowers, department-based walking encounters, public visitor reviews and private active-play reporting. Current source and validation status are recorded there; deployment requires its separate acceptance receipt. Student names remain encounter-only. Detailed import provenance and limitations are in the [student source report](../../docs/UBC_STUDENT_IMPORT_2026-10-31.md).

Public reviews use the shared `projects/campus-reviews` module, independent of the optional character-profile store. Play statistics use `projects/campus-analytics`, with an on-page privacy control and `/labs/campus-privacy`. Operator data must remain outside the checkout and every release directory. Never seed synthetic review or play fixtures into production.

## Flagship roadmap and V0.5 foundation

The owner adopted [the flagship roadmap](../../docs/UBC_ROADMAP.md) on November 1,
2026 and requested that the flagship V0.5 foundation milestone begin. The current
public badge is already “V0.5 — Campus community”; the supplied roadmap numbers
are separate planning identifiers, as explained in its version-alignment note.
The later audio patch has its own release receipt. See the
[scorecard](../../docs/UBC_FIDELITY_SCORECARD.md),
[release acceptance](../../docs/UBC_RELEASE_ACCEPTANCE.md), and
[implementation queue](../../docs/UBC_V05_FOUNDATION.md).

`npm run ubc:benchmark` builds and serves local-only fixed-camera engine tooling.
It records raw frame intervals, CPU timing, render/resource counts, loading and
optional heap observations with source/snapshot hashes. Nine fixtures cover the
baseball precinct, main interiors, outdoor core and Halloween. No public route,
visitor analytics, runtime dependency or production deployment is added. Normal
Campus callers do not enable diagnostics. Full terrain, physical-phone and visitor
acceptance remain pending; this is the beginning of V0.5, not its completion.
