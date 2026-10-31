# UBC Virtual Campus — research preview

“Explore the University of British Columbia, virtually.”

Independent Asymmetri Labs → GIS Apps project at `/labs/ubc`. This is a working
implementation candidate, not a completed UBC digital twin or a certified
production-quality milestone. It is unofficial and has no UBC or faculty endorsement.

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

Open `http://127.0.0.1:3026/labs/ubc` and select Start exploring. The renderer and
committed GIS snapshot load on demand. Production compilation does not fetch GIS
services. See [the Orchard V0.2 report](../../docs/UBC_ORCHARD_MVR_2026-10-31.md) and [original campus report](../../docs/UBC_IMPLEMENTATION_2026-10-30.md).

## Visitor experience

- Walk: WASD/arrows, drag to look, Shift for faster walking, E for nearby information.
  Optional mouse lock is in Help; Escape releases it. Natural speed is 1.45 m/s;
  faster walking is 3 m/s. Touch controls maintain independent pointer ownership.
- Aerial: orbit, pan and zoom with Three's OrbitControls. Returning to Walk retains
  the visitor's coordinates. Map is north-up source geometry with selectable destinations.
- Search: priority destinations, named educational guides and imported building names.
  Visit entrance is explicit virtual fast travel. Walking route uses the official
  source route graph, and refuses disconnected results instead of drawing a shortcut.
- Interiors: physically walk through entrance gaps. Rose, Bookstore, Nest and Sauder
  have walls and fixture collision. Orchard adds a lobby and one representative floor
  with eight bedrooms, five bathrooms, sixteen working doors, lounge/study, stairs
  and a continuous platform lift. The Nest has ground/5 m/10 m public galleries,
  two stair flights and a suspended lounge. Only these supported spaces are enterable.
- Conversations: two named guides and three fictional residence students,
  curated questions, follow-ups, session-only
  history and keyword lookup. Unsupported private opinions, promises and whereabouts
  produce a source-linked refusal. No external AI service, accounts, voice or persistence.
- Atmosphere: four seasons, representative Vancouver dates with a NOAA solar
  approximation, daylight/night, rain/fog/cloud/snow scenarios, wet pavement and lights.
  Winter snow is optional; evergreen and deciduous trees are separate materials.
- Photo: hides normal UI and shows a fresh canvas PNG preview with a Save PNG link.
  The browser validation gallery retains real scene exports and interaction captures.

## Architecture and reuse

`Campus.tsx` owns the accessible React shell, directory, information dialogs and
map. `engine.ts` owns Three.js lifecycle, cameras, inputs, selection, scene LOD and
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

This is separate from Surrey/Richmond gameplay: it has no combat, health, missions,
scores, money, inventory or live tracking. Shared improvements can be extracted
later after browser acceptance; no broad existing-project refactor was necessary.

## Accuracy and permissions

All five supported building interiors are **Level B reference reconstructions**, not verified
as-built layouts. Public historic Bookstore plans and the AMS amenities map support
research but do not prove today's fixture arrangement. Other buildings are **Level C
exterior-only**. No Level A interior is claimed. Orchard bedrooms are fictional demonstrations, not current private rooms or assignments.

The source footprint establishes geography; oriented architectural envelopes,
facades, roof forms, furnishings and stadium components remain interpretations.
Ground elevation is flat, so this is not a terrain survey or real-world accessible
route planner. The Sauder expansion is described as construction expected to finish
in 2027, not rendered as a completed future building.
The Nest's supported central envelope is narrowed to 76 m to avoid overlap with the
Alumni Centre. Ten source trees inside model envelopes are excluded from rendering;
source records and mapped footprints remain unchanged.

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
