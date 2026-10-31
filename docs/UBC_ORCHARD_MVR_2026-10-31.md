# Orchard Commons — V0.2 minimum viable residence

This release extends `/labs/ubc` in `eugenelin89/asymmetri`. It implements a
working, representative residence open house. It is not a surveyed digital twin,
the whole Orchard interior, or a representation of current residents' rooms.
The consolidated campus specification remains the long-term roadmap; this release
follows the latest Orchard MVR scope. The romantic Easter egg remains deferred.

## Implementation

Local repository: `/Users/eugenelin/Documents/ChatGPT/Vancouver/ubc-virtual-campus`.
No new npm dependency, rendering engine, backend, tracking, authentication,
persistent dialogue, real resident data or third-party art was introduced.
Existing Rose, Bookstore, Nest, Sauder, stadium and both named educational guides
remain supported. Existing city engines and published GIS snapshots are unchanged.

| Module | Responsibility |
| --- | --- |
| `projects/ubc/residence-layout.ts` | Geographic anchor, eight room records, five bathrooms and sixteen door definitions |
| `residence.ts` | Lobby, floor, stairs, lift, collision, room loading/unloading and location descriptions |
| `doors.ts` | Reusable hinged leaves, shared visual/collision angle, swept obstruction checks and reduced-motion support |
| `residence-mesh.ts` | Original furniture, batched finishes, windows, fixtures and deterministic textures |
| `residence-exterior.ts` | Source-outline podiums, separate tower interpretations, glazing and courtyard entry |
| `residence-content.ts` | Housing sources, residence information, displays and three fictional student records |
| `ResidenceGuide.tsx` | Accessible schematic with visitor position, room pairs, stairs/lift and exit guidance |
| `engine.ts`, `spatial.ts`, `people.ts` | Existing metre-space movement, dynamic collision, floor-aware people and information integration |
| `Campus.tsx`, `registry.ts`, `types.ts`, CSS | Existing directory, map, safe links, conversations, touch and keyboard UI |
| `residence.test.mjs`, `test-loader.mjs` | Continuous physical traversal, integrated lift boarding, door obstruction, source and streaming tests |
| `landmark-fidelity.json` | Explicit completed/reconstructed/context-only/future landmark audit |
| `tools/verify_orchard.py` | Read-only reproduction check of the pinned geographic derivative |

The renderer still uses Three.js and Surrey's resource disposer. Room furniture
loads near the demonstration floor, hides by distance/quality, unloads beyond 90 m,
and returns with deterministic geometry and collision. Windows and furnishings
batch by material. Only two nearby point lights on Low, or four on other presets,
are active. Floor/collision definitions remain resident. There is no claim that
hundreds of future rooms or a complete residence streaming system are implemented.

## Geography, sources and rights

Both existing records, **VBL10013 and VBL10013-part1**, retain their exact source
rings. Five pinned subbuilding sections distinguish Vantage College, Open Kitchen,
Bartlett, Braeburn and Hummingbird. Their ground-level occupant polygons do not
establish upper-tower roof outlines. The open central courtyard is preserved.

The demonstrable entrance is the source **tertiary courtyard entrance**
`{05735B81-F14A-4C57-9377-4E083CFF6BCF}` at **49.26033144, −123.251339423**.
Its source accessible flag is retained; this simulation is not accessibility or
real-world access guidance. It is not presented as a measured reconstruction of
the complex's main front-desk entrance. Route 5747 connects this entry to the
official pedestrian network. The virtual front desk is representative furniture.

The anchor is x −450.5443912079143, z −43.99321172379285, yaw −1.0821463267948965,
in the existing UTM zone 10N local metre space, x east/z south, origin
−123.245/49.26. WGS84 is treated as NAD83 without epoch adjustment. Ground is flat.
The 36 × 18 m supported floor lies inside the Bartlett parent footprint; tests
check the envelope and preserve both original source polygons. The vestibule
connects to the recorded courtyard entrance.

The separate immutable derivative lives at
`public/ubc/orchard-v0.2-2026-10-31/`, with hashes, coordinate notes and limitations.
It uses [UBC Open Geospatial Data](https://github.com/UBCGeodata/ubc-geospatial-opendata)
at commit `885732d332a20a59143f655c83fb15e1367ebe4d`, under PDDL 1.0.
The subbuilding raw SHA-256 is
`5357f845de44b31392d088fe1c0f01f1cd0e28bd756f3e09ae20305eb62288ed`.
The aggregate 30.50868 m field is not applied uniformly to the complex.
Tower roof heights use the public 2014 design elevations (54.55/57.20 m above the
86 m drawing datum), **not current measured heights**. Tower footprints, facade
facets, window rhythm, upper storeys and podium details remain interpretations.

Principal references, checked October 31, 2026:

- [UBC Housing: Orchard Commons](https://vancouver.housing.ubc.ca/residences/orchard-commons/): room types, front-desk address, two houses, lounges, snack kitchens and study facilities; opened successfully from the application.
- [Official residence tours](https://vancouver.housing.ubc.ca/residence-virtual-tours/#orchard-commons): linked for current room comparison; embedded tour furniture was not independently measured.
- [2014 public plans](https://planning.ubc.ca/sites/default/files/2019-12/DP13034-Plans_0.pdf): double-loaded circulation, connected singles and shared bathrooms. Typical single bedroom areas of 13.17 m² are reference evidence, not the dimensions of this enlarged demonstration layout.
- [2014 elevations](https://planning.ubc.ca/sites/default/files/2019-12/DP13034-Elev_0.pdf): historical height evidence.
- [Perkins&Will architectural reference](https://perkinswill.com/project/university-of-british-columbia-orchard-commons/): separate tower/podium composition and glazed common spaces.
- [StructureCraft](https://structurecraft.com/projects/ubc-orchard-commons-residence): timber common-space reference.

Public photographs and drawings informed research but are not redistributed.
Meshes, texture noise/grain, posters and signs are original MIT assets. No UBC
logo, copied portrait, cloned voice, identifiable student or private-room plan is
used. No future proposed courtyard childcare structure is shown as complete.

## Completed residence

**Level B — representative reconstruction.** One furnished lobby and one complete
demonstration floor 3.4 m above it, joined by a visible staircase and continuous
platform lift. Upper storeys are exterior only. Every labelled room/bathroom door
works; no unfinished-floor door markers are provided.

| Rooms | Configuration and distinction |
| --- | --- |
| A / B | Science and engineering singles, one bathroom connecting the pair |
| C / D | Business and computer-science singles, one bathroom connecting the pair |
| E / F | Student-athlete and music singles, one bathroom connecting the pair |
| G | Shared double: two beds, two workspaces, one private shared bathroom |
| H | Shared double: two beds, two workspaces, one private shared bathroom |

Bedrooms contain beds/mattresses/pillows, desks/chairs/computers, books, storage,
window coverings, lights and illustrative personal objects. Shared facilities
include the corridor, lounge seating, snack counter/sink/fridge/microwave and
study tables/bookshelves. Bathroom fixtures include shower trays/screens, toilets,
sinks and mirrors. Layouts and decorations are fictional; no room number maps to
a resident. Floor dimensions and circulation are enlarged for this open house.

The visual result is procedural architectural visualization, with simple people
and vegetation. It does not meet the long-term photorealistic flagship benchmark.
Reference comparison confirms broad two-tower/podium composition, glazed common
spaces and bedroom/bathroom relationships. Facade curvature, precise glazing,
real floor layouts, landscape grades and detailed material fidelity need further work.

## Interactions

Sixteen hinged doors can open and close from either side. Collision follows the
leaf angle; opening or closing pauses when the visitor occupies its sweep. The
prompt says “step clear”. There is no automatic closing, forced teleport or push.
The lift waits for a clear threshold before departure, arrives at an occupied
landing, and offers Ride only after boarding. The floor guide explains both. Clicking the ride placard before boarding is ignored;
it cannot open an empty information panel.

Three moving, stylized **fictional** students reuse the existing conversation
registry and session history:

- **Maya**, Science, study area: first-year life, room size, shared bathrooms,
  study and packing.
- **Leo**, Engineering, lounge: noise, friendships, study, balancing activities
  and facilities.
- **Ari**, international Business, lobby: arrival, support, packing, dining
  and housing applications.

Each has five curated questions, follow-ups, official sources and an explicit
fictional/non-testimonial disclosure. Unsupported questions retain the existing
source-linked response, not fabricated opinions. Named Werker/Bacon simulations
remain distinct, with their earlier sourcing/disclaimers intact.

Orchard is searchable under Residences and Enterable buildings. Visit entrance /
Explore virtual residence is explicit optional fast travel **to the outside
entrance**; no room or floor teleport is used. Show on map, walking route, three
information displays and official Housing links reuse existing controls.
External links use the HTTPS allowlist and `target=_blank`, `noopener noreferrer`.
The official Orchard page opened in a separate tab while the campus retained its
position. No live prices, inventory, availability or room booking are claimed.

## Validation and evidence

The [actual screenshot gallery](validation/ubc-orchard/README.md) contains scene
PNG exports and browser interaction captures, not marketing renders. The earlier
[25-capture campus gallery](validation/ubc/README.md) remains available for the
unchanged Rose, Bookstore, Nest, Sauder, guides and baseball precinct.

Browser checks used the local Next application in the enabled in-app browser:

- Start existing campus, search Orchard, inspect disclosure and visit entrance.
- Walk through courtyard entrance, lobby, stairs and corridor.
- Enter **all eight** bedrooms with ordinary movement and door actions.
- Enter both double-room configurations and the H bathroom; traverse D → shared
  bathroom → C and return to corridor. Automated tests additionally traverse every
  bathroom pair and both doubles' bathrooms.
- Enter lounge/study; talk to all three students and receive sourced answers.
- Call/board lift from both floors, ride continuously, and exit the building.
- Switch Walk/Aerial/Map; select all four seasons, rain/clear/snow and day/night;
  verify rainy-winter interior lighting and no indoor precipitation.
- 1440 × 900 desktop, 767 × 920 tablet and 390 × 844 phone CSS viewport checks;
  no document horizontal overflow. Phone directory/dialogue and held touch movement
  into the lobby passed. Escape closes a panel and restores focus to its opener.
- No browser error/warning entries in the final inspected session.

Browser testing found a 10 cm lift sill gap and a threshold-arrival deadlock;
both were corrected and reproduced in an integrated regression test. It also
prompted readable two-sided signage, doorway guidance and occlusion of nearby
student/door prompts through room walls.

The UBC suite has **26 passing tests**, including continuous collision traversal,
all eight rooms, all bathroom connections, swept/reduced-motion doors, integrated
lift arrival/boarding, moving student routes, source integrity and deterministic
unload/reload. Existing regressions passed: Vancouver **74**, Surrey **54**,
Richmond **27**, investment **7**, Python GIS **5**. TypeScript and lint passed
with one pre-existing tutorial navigation warning; production audit found zero
vulnerabilities. Both production builds passed: standard Next.js (`--webpack`) and Vinext/Cloudflare.
The pinned Orchard derivative verification and diff/privacy scans also passed.
No local development server remains running after this validation pass.

Rendering observations: one desktop Auto exterior sample reported 60 FPS,
886 draw calls and 2,441,929 triangles; a rainy-night lounge sample reported
60 FPS, 285 draw calls and 1,262,715 triangles. These are short UI observations,
not sustained benchmarks or 60/30 FPS device certification. Physical iPhone and
Android testing is outstanding. Browser viewport screenshots exhibit tool-side
scaling/padding; clean scene PNG exports are retained separately.

## Release status

Version: **0.2.0 · Orchard Commons open house**. Public target:
`https://asymmetri.co/labs/ubc`. Production activation is a separate gate from
these local results. Use the exact-SHA Linux candidate and complete-directory
rollback procedure in `DEPLOYMENT.md`; a successful local build is not a deployment.
The final production receipt must record source/build/artifact identities,
protected-route and peer checks, measured headroom, browser verification and the
complete immediate predecessor. No OS, DNS, TLS or unrelated service changes.

## Five next priorities

1. Obtain current measured/appropriately licensed Orchard room and tower geometry;
   replace the enlarged demonstration layout with documented proportions.
2. Improve facade curvature, near-field vegetation, material detail and furnished
   common spaces against permitted architectural references.
3. Measure sustained frame time/GPU memory on physical phones and desktop tiers;
   add geographic/room LOD based on those measurements.
4. Apply the tested room/door/lift framework to one sourced Totem Park or Place
   Vanier floor, with distinct room arrangements and official housing content.
5. Add a documented upper-year residence such as Brock Commons, including its
   own architecture, common facilities and sourced student-life guidance.
