# UBC Virtual Campus V0.3 — campus life and visitor navigation

This release is a functional research preview, not a completed campus digital twin.
Its original procedural models remain visibly stylized. It does not meet the
master specification's photorealistic flagship benchmark, and no such claim is made.
Production identity and activation evidence belong in the separate release receipt.

## Implementation and geography

Canonical repository: `eugenelin89/asymmetri`, independent module `projects/ubc`,
route `app/labs/ubc`. Three.js and Surrey's existing `disposeScene` are reused;
Vancouver, Surrey and Richmond source/immutable datasets are preserved.

New modules include `navigation`, `follow-camera`, `CampusMap`, `wayfinding`,
`appearance`, `AppearancePanel`, `character-expansion`, `props`, `activities`,
`traffic`, `extensions` and `community`. Existing architecture, population,
registry, renderer and accessible panels are extended. No application dependency
was added. Research parsers use BeautifulSoup outside the application environment.

The pinned UBC PDDL snapshot remains unchanged. Expansion anchors derive from its
metre-space footprints and entrances. Coordinates use the established GRS80 UTM
zone 10 transformation (WGS84 treated as NAD83 without epoch adjustment), with
origin longitude −123.245, latitude 49.26. Terrain is still flat.

Detailed geographic zones: baseball stadium/Rose, Henry Angus public lobby,
Bookstore, Nest, Orchard demonstration residence, Hennings public learning space
and War Memorial Gym. Other campus buildings remain source-footprint exterior
context. The Rose entrance is offset to its photographed timber/glass corner;
black cladding, timber screens, white base, glazing, entrance and low wing were
reworked using public UBC and MGA references. No exact-as-built claim is made.
Nearby tree canopies intersecting supported interiors are excluded from rendering;
original GIS tree records remain intact.

West 10th Avenue's 4200–4600 blocks use Vancouver public-street centrelines, with
representative pavement width. They are an isolated exterior context east of the
campus dataset; intervening neighbourhood and a continuous pedestrian/GPS link
are **not** reconstructed. The information panel says so. No invented street
replaces the missing geographic connection.

## Navigable interiors

All seven building interiors are **Level B reference reconstructions**. No Level A
surveyed interior is claimed. The stadium also supports field/grandstand access.

| Building | Supported spaces | Limits |
|---|---|---|
| Rose Training Centre | Four batting cages, pitching area, circulation, entrance | Original mesh reconstruction; no private rooms |
| UBC Bookstore | Retail aisles, books, supplies/apparel fixtures, service counters | Representative current fixtures, no live inventory |
| AMS Nest | Atrium, two stair flights, three supported levels, study pod/galleries, Blue Chip, Great Hall science-fair installation | Selected public spaces within a reduced envelope; not every floor |
| Henry Angus / Sauder | Public lobby, program displays | Expanded lecture halls/faculty offices are still outstanding |
| Orchard Commons | Lobby, eight fictional bedrooms, five bathrooms, doors, study/lounge, stairs/platform lift | One demonstration floor; additional residences and all real rooms remain outstanding |
| Hennings | Public lobby and HENN 200-inspired tiered learning room | Public classroom reference; no private labs/offices |
| War Memorial Gym | Public lobby, court, end circulation, blue bleachers, basketball practice | Published hall dimensions; interpreted seating/exterior |

Blue Chip is represented on the main floor. The GVRSF installation is in a
reconstruction of **Great Hall 2404, Level 2**, supported by GVRSF's venue FAQ and
the AMS building directory. Nine original science displays and fictional visitors
represent a retrospective fair; no actual students' projects, names or images are
copied. Interactive project explanations cover solar energy, clean water, bridge
structures and biodiversity. The 2027 event is announced for the Life Sciences
Institute, so the Nest installation does not claim to depict that future event.

## Characters and activity

People have no directory entries, map pins, floating name labels, Find actions or
fast travel. Approach an actual nearby visible actor and choose **Talk** to reveal
identity and questions. Wall/floor proximity checks prevent remote conversations.
Curated answers and follow-ups work without AI; unsupported personal claims are
refused. Session history is local to the current visit.

- Greg Werker and President Benoit-Antoine Bacon remain sourced educational guides.
- 248 Physics & Astronomy / Computer Science professional records, plus the twelve
  Vancouver deans, give 260 additional faculty/staff records. This is **not all UBC
  faculty and staff**. Other departmental directory adapters remain outstanding.
- 705 entries from 22 published varsity roster pages retain exact season labels.
  Some rosters are 2025–26 and some 2026–27; they are not a live membership claim.
  Cross-sport entries may represent the same person. Original sport kits carry a
  small original bird drawing, not the Thunderbird mark.
- Four alumni: Kim Campbell, Justin Trudeau, Jody Wilson-Raybould, Robert Mundell.
  Their public achievements and UBC connections come from official alumni material.
- Albert Einstein is an explicitly historical guest near Hennings, with IAS/Nobel
  sources and no asserted UBC affiliation.
- Mitch Hodge appears near Rose in an original stylized baseball outfit, brown hair
  and beard. The requested 6′2″ model height is a creative parameter, not a verified
  personal measurement. The supplied official profile lists Assistant Coach, but
  current assignment is not confirmed; that uncertainty is visible in conversation.
- Christopher Lin's opt-in profile uses only the user's supplied name and
  Engineering Physics student description. Its affiliation is self-described;
  no LinkedIn students or unconsenting private student profiles were imported.

Named simulations use nearby checked pedestrian routes and lazy mesh creation,
with a bounded active population. They do not reproduce real schedules. Anonymous
joggers, cyclists, frisbee groups, small wildlife, baseball pitching/batting/fly-ball
practice, soccer at MacInnes Family Field, and gym basketball add ambient activity.
Animations are simplified procedural loops, not motion-captured athletes or full
sports simulation. Reduced-motion and population controls remain available.

## Visitor controls and information

First person / Third person / Aerial / Map preserve the visitor's position.
**WASD** moves; **A/D strafe**. **Drag the scene or left/right arrow keys to turn**;
**Shift** runs (5.5 m/s versus 1.45 m/s walking). **V** switches on-foot cameras,
**E** interacts, **M** opens the map. Touch provides held movement, turning and Run.
The follow camera retracts at walls/ceilings and hides the avatar in tight spaces.

Map selection provides **Go here** and **Guide me**, with safe outdoor path snapping,
turn-relative guidance, remaining route distance, arrival/off-route/indoor-exit
states and recalculation. Disconnected routes fail explicitly. Appearance controls
cover gender presentation, skin, hair/style, outfit, trouser and shoe options; those
preferences stay in browser storage.

Clickable buildings, museum/retail/AMS links, departmental displays, café and fair
information use the centralized registry, HTTPS host validation and
`noopener noreferrer`. No prices, checkout, live booking or live availability exist.

## Public opt-in profiles

The requested Node backend exposes `/labs/ubc/community-api/community`, `/labs/ubc/community-api/profile`,
`/labs/ubc/community-api/profile/recover` and `/labs/ubc/community-api/reports`. Publish is immediate, as requested.
Profiles contain only participant-written public fields and a selected virtual zone.
Identity/affiliation are unverified and the character is asynchronous, not live chat.

A private persistent `UBC_PROFILE_DIR` holds atomically written JSON with restricted
permissions. Ownership uses a random capability, SHA-256 digest at rest and an
HttpOnly/SameSite=Strict/Secure production cookie. The one-time recovery code must
stay private. Server validation, exact token parsing, origin checks, bounded bodies,
rate limits, and public-field projection prevent common ownership and content leaks.
No uploaded portraits, tracking coordinates, email collection or external AI exists.

Self-removal deletes active profile and reports. Operator reporting/hide/restore is
available through the private CLI; hidden profiles cannot republish by editing.
Reports are retained at most 90 days and are not public. Public removal cannot recall
copies others saved; the visitor notice explains this. Normal hosting logs may retain
IP addresses. Operators must actually review reports; no automatic adjudication or
24-hour response guarantee is claimed. The existing Motion policy is preserved.

## Sources, licensing and refresh

`projects/ubc/data` contains professional/athlete factual extracts, source URLs,
retrieval dates and SHA-256 receipts, directed transit shapes, expansion anchors and
West 10th geometry. `tools/collect_faculty.py`, `collect_athletes.py` and
`compile_transit.py` document refresh adapters. Inspect changed source structure and
season/title conflicts before replacing records; updates are not automatic.

Bus numbers/destinations and directed shapes use TransLink's published GTFS feed
`26SEP_20261030` (valid September 7, 2026–January 3, 2027), for routes 25/33/49.
Original blue/silver/yellow bus meshes have anonymous seated passengers. No operator
logo, timetable compliance or live vehicle tracking is asserted. The required
TransLink attribution appears in Project information and third-party notices.
Cars use sourced West 16th/Wesbrook/East Mall and West 10th road geometry; academic
pedestrian East Mall sections are excluded.

All vehicles, people, bird marks, animals, sports equipment, interiors and textures
are original procedural assets. Reference photos, plans, portraits, logos and
third-party model files are not redistributed. See `THIRD_PARTY_NOTICES.md` and the
asset manifest for reference URLs and terms.

## Validation and remaining work

The [validation gallery](validation/ubc-navigation/README.md) records 20 actual browser captures and observations. All 44 UBC automated tests pass; Vancouver 74, Surrey 54 and Richmond 27 tests also pass. TypeScript/ESLint pass (one existing tutorial lint warning), Vinext and Next webpack production builds pass, and the production dependency audit reports zero vulnerabilities. Automated
checks cover collision traversal, source routes/entrances, stairs/doors/lift, all
Orchard rooms, four Rose cages, new classrooms/gym, upper-floor fair access, camera
clearance, GPS, avatar normalization, bounded actors, sports trajectories, traffic
and public profile ownership/security/moderation. Build and deployment outcomes are
recorded in the release receipt after execution; physical-device testing and
sustained performance certification remain outstanding.

Highest-value next improvements:

1. Replace procedural priority architecture/vegetation with licensed, measured PBR
   assets and surveyed terrain, beginning with Rose and the baseball precinct.
2. Complete source-reviewed faculty/staff coverage across remaining departments,
   with roster refresh and duplicate-person reconciliation.
3. Build the expanded Sauder academic interiors and further residence zones from
   adequate public references, maintaining explicit reconstruction labels.
4. Improve animation, crowd avoidance, scene occlusion and batching; benchmark real
   phones and representative desktop hardware before claiming FPS targets.
5. Complete continuous surrounding geography, accessible interior navigation and
   source-verified pedestrian connections, including the West 10th approach.
