# Richmond Learns to Drive — coordination and implementation

Initial baseline: `313dba357ecc00f1de28b8db5d2c326ec9d1125e` (Vancouver V0.4 + GIS Apps,
2026-10-30), clean main observed before isolated checkout. Subsequently fast-forwarded
GIS naming and Surrey V0.3 main through `37d33110f95b31ad99dd1e2c6d616dcc3fada53b`, then Vancouver V0.5
implementation/journal main `44654b3`, V0.5 release main `965d5b9`, and Surrey V0.4
release main `9e5f4cad26f426e00c647499cb8b4bf59492ca14`. Branch:
`codex/richmond-delivery`. The app worktree API rejected the unrelated project
root, so an independent local clone of the same repository is used; the active
website checkout is untouched. No new remote repository or hosting is created.

## Ownership and decisions

- Greater Vancouver GTA: design chats **Vancouver Drive**, **Surrey Adventure**;
  implementation chats **Vancouver** (`01a18b88-b771-7620-96b4-427970acf243`),
  **Surrey** (`01a18d8e-c3fb-7f30-9fe3-3201b90badf7`). Latest accessible decisions read.
- Asymmetri: **Organize Labs under GIS Apps**
  (`01a18e1b-4912-75e2-a0de-c916feb0bd7a`), current category/release owner.
- Richmond owns `projects/richmond/`, `public/richmond/`, `app/labs/richmond/`,
  Richmond docs/tests. Proposed shared edits: typed registry, sitemap, script,
  relevant docs. No Vancouver/Surrey modifications or shared engine rewrite.
- Confirmed from main and GIS chat: GIS Apps landing `/labs/gis`, unchanged
  `/labs/vancouver` and `/labs/surrey`, Vancouver display **Vancouver, City in Progress**.
  Richmond uses the acknowledged `/labs/richmond` and `gisApps.projects` convention.
- Coordination messages sent via app tools to all three implementation chats.
  Sending is not acknowledgement. Responses and final integration status below.
- Vancouver owns the current combined Vancouver/GIS production release. Richmond
  will not start a competing deployment. Final release needs exact-source Linux
  acceptance, capacity floors, complete preceding runtime, protected-route and
  peer-service checks under existing deployment documentation.
- Open PR #4 is an unrelated unpublished Hitting privacy/support draft. Preserve
  its isolation; do not publish it. Existing other branches remain untouched.

## Sources and architecture

Inspect existing predicate/vehicle interfaces, but import only stable pure helpers
when confirmed compatible. Richmond state, maps, renderer, interiors and save key
are independent. Source data is versioned same-origin; no live third-party game
requests. OSM provides explicit ODbL terms. Richmond RIM public visibility does not
establish redistribution rights; no municipal/proprietary imagery is copied.
Original fictional interiors and stories are independent of operational plans.

## Integration gates

Test full delivery, mall, terminal and airport-office loops; graph and collision
connectivity across required anchors; airfield/public graph separation; four
cameras and local saves; encounter limits and gentle mode; realistic coverage
report; both Next/Vinext builds; Vancouver, Surrey and investment regressions.
Re-read current main/shared files immediately before merging the narrow patch.
Physical-device and browser journeys must be reported separately from unit tests.

## Acknowledgements and release

Acknowledgements are recorded below. No Richmond deployment has occurred.

### Confirmed follow-ups

Surrey replied October 30: use separate radius/vehicle clearance, route reachability
checks, bounded aerial camera and Richmond-owned save schema. No shared extraction
was agreed. Preserve Surrey snapshot and namespace exactly.

Vancouver confirmed existing `inPolygon`, `segmentDistance`, `carFits`, `stepCar`
exports and physical behaviour will remain compatible during V0.5. Richmond imports
those pure helpers only. Vancouver V0.5 is active; coordinate final shared pushes.

GIS owner confirmed `/labs/gis`, `gisApps.projects` and sitemap conventions. Its
naming release finished at main `efbafd8`; this branch fast-forwarded that main
before any shared edit. Approved names are **Vancouver, City in Progress** and
**Surrey, City of Adventure**. Routes/assets/saves remain unchanged. Journals
130/131 belong to GIS naming. Live source is `69fae18`, build
`q8_M2Gb7kqFINS-9chdOm`; no Richmond production change is implied. Feature releases
need full independent runtime rollback, not the naming-only copy exception.


### Current coordination window

Surrey V0.3 completed its release and main push through `37d3311`. Vancouver then
requested the next main/server window and journals 137/138; Richmond explicitly
acknowledged and remains local-only while that window is active. Its narrow shared
patch was reconciled with main `44654b3` (V0.5 implementation `53fe754`, journal 137).
The appended asset-manifest sections were the sole stash conflict; both city
sections were retained. Final integration still waits for the release handoff. The GIS owner
has no unresolved route/name decision for Richmond. The user's iPhone obstruction
feedback was forwarded to both city implementation chats; each acknowledged
phone-layout work. Their changes remain owned by those chats.

## Implementation and data evidence

The implementation includes all eight authored orders and generated offers,
independent four-camera/walk/drive state, the mall's two usable entrances and three
shops, terminal and airport-office interiors, bounded encounters, Gentle Streets,
local transaction/equipment/order persistence and the explicit Open Airfield
connection. See `projects/richmond/README.md` for the complete 33-place coverage
matrix and exact runway coverage. Accuracy and source/derived database licences
are documented there and in the immutable manifest; no real interior plan is used.

Two independent offline compiles (final candidate and its immediate predecessor)
produced identical bytes for all 688 declared data outputs. The committed public
copy matches every output digest. City digest:
`a9cac23e9143dc6bb6f72b9690283a3265eefba0a2f309905f2ac6ddfd1814dd`.
The normalized inputs and raw source hashes remain in the manifest. Raw caches
are intentionally outside Git.

The phone regression is addressed with a screen-filling dynamic viewport, safe
areas, controls outside the canvas, on-demand full status/minimap and a single
paused dialog. Landscape uses side gutters. The foreground dialog traps focus
and makes the game controls inert; Close returns to the same playing view.

## Actual browser evidence

Environment: macOS host, Brave extension-controlled browser, Next.js local origin
`http://127.0.0.1:3015`, 390 × 843 CSS-pixel portrait viewport emulation. This is not
a physical-iPhone performance certification. Lite Mode and Gentle Streets were
used; population initially 1.0, reduced to 0.25 for the later mall driving pass.
Sampled foreground performance during these scenes was 58–60 FPS; this is a
sampled local observation, not a universal or sustained device benchmark.

- **Core delivery completed through real UI input:** accepted First Day at $20;
  entered/driven/parked the car, walked into Brighouse Kitchen, collected its
  labelled bento, returned to the same car, drove the roughly 1.5 km route, parked
  and walked to Mei at Minoru Park. Handover credited $13 plus $1 tip once, ending
  at $34. Repeated interaction did not pay again. Four-camera switching preserved
  the completed state. Reload retained the single $14 receipt and the car at
  x −758.09, z 78.26. Manual steering included reverse corrections and two bounded
  local road recoveries; this was not a flawless-driving performance claim.
- **Mall pickup/purchase/exit completed through real UI input:** drove from Minoru
  Park to Richmond Centre using its connected public route, parked at x −35.62,
  z −149.94, entered on foot, followed corridors to the food court and collected
  bubble tea. Bought an insulated bag for $28, reducing $34 to $6, and verified
  both the order and equipment in inventory. Reloaded inside the mall, walked
  back through its corridors, exited and re-entered the same unchanged car.
  The initial mall order expired while driving controls were being examined;
  it cost $0 and a new order was accepted at the mall. The tested purchase loop
  is complete; that mall order's City Hall handover is not claimed here.
- The browser mall approach required several ordinary short reversing manoeuvres
  at tight turns and two local recovery actions. A route-following test helper
  initially failed to advance after overshooting a waypoint; its browser-control
  logic was corrected. It did not change game position/state directly.
- The live checks found and fixed parked traffic in narrow access lanes, interior
  guidance through furniture, and quotes that omitted travel to the pickup.
  The latest order deadlines include pickup approach travel, shown separately
  from the delivery distance. Deterministic tests cover these fixes.

- **Terminal Takeout completed through real UI input:** accepted in Richmond,
  drove to Alexandra Road, parked, entered the restaurant and collected the
  labelled noodles. Drove the public road route to YVR, including the raised
  approach and descent. Parked at x −2671.64, z −3108.68, walked the entrance
  approach, entered the terminal and reached Evelyn at its meeting point.
  Handover credited $31 plus $3 tip, taking cash from $6 to $40. The drive included
  short reversing manoeuvres and bounded local recovery; no direct state injection
  or camera teleport was used.
- Collected Airport Lunch Run burgers at the terminal café, bought a $5 meal and
  $12 repair kit, and verified cash $23 and health 90. Walked back through the
  terminal, exited, reloaded the production build and re-entered the same parked
  car with the collected order and purchases preserved.
- Airport acceptance found a final-walk route incorrectly retaining the one-way
  car loop. Walking guidance now starts at the player, uses the validated entrance
  approach when clear, and ignores vehicle one-way restrictions on longer road
  walks. Every authored final approach is regression tested. Quotes at the pickup
  no longer add a spurious vehicle loop. A nearby counter no longer pushes the
  third-person camera into the courier; tight interior obstruction uses an
  overhead fallback.

- **Airport Lunch Run completed through real UI input:** drove the terminal-to-
  office public-road route, including the elevated terminal loop. Parked at
  x −2281.74, z −1280.88, exited, entered the office and walked its corridors to
  Morgan. Handover credited $33 plus $3 tip once, taking cash from $23 to $59.
  Four cameras inside the office preserved the completed state. The drive used
  multiple reversing manoeuvres and two local Recover actions at tight/blocked
  junctions. This pass is evidence of completion, not flawless traffic handling.
- **Open Airfield outbound and runway walk completed:** enabled the mode in the
  map, left the office and re-entered the unchanged car. Crossed the marked
  fictional gate, moved fully onto the apron and followed connected taxiways
  approximately 1.2 km to 08R/26L. Drove roughly 360 m along the runway, stopped,
  exited and walked, switched all four cameras, then re-entered the same car.
  Cash remained $59. Returned along the connected taxiways, turned through the
  fictional gate and parked back on the public frontage at x −2280.99,
  z −1281.50. Closed Open Airfield successfully. The excursion used ordinary
  reverse corrections at the apron edge/gate, with no Recover or position edits.

The required core, mall and airport browser loops above are complete. The full
Steveston/Terra Nova/IKEA/No.6/Knight/Hamilton regional routes and every full runway
length are verified by continuous physics tests; those full-distance routes were
not all repeated in the rendered browser. Optional threat variants and invalid
saves are covered deterministically, not all exercised manually in this session.
Physical-phone multitouch, battery and thermal performance remain unverified.

## Release status

The implementation is prepared for the two-commit integration workflow; exact
commit identities and final CI status are recorded in journal 142 and the task
handoff. No Richmond deployment has occurred. AGENTS requires an explicit publication request;
the brief permits established release authority, but standing SSH access and the
Node 22 runtime exception alone do not establish a new Richmond publish request.
The candidate uses the existing isolated Linux workflow, with no deployment
secrets or automatic activation. A future authorized release must re-read the
current live baseline, retain its complete runtime, meet the 6 GiB disk / 192 MiB
available-memory floors, pass private loopback acceptance and verify protected
routes/peer services after activation. No infrastructure change is proposed.


### Historical local build/check checkpoint

Before the final V0.5 reconciliation and focus fix, Next 16.4.3 Turbopack and Vinext
0.0.50 production builds both passed. Richmond 23 tests, Vancouver 43 tests,
Surrey 35 tests and investment 7 tests passed. `npm run check` passed with the
existing `tutorial-reader.tsx` navigation warning only; production audit reported
zero vulnerabilities. The final reconciled check results are recorded below.

Production phone layout measurements: 390 × 843 viewport → 390 × 545.44 canvas;
844 × 390 landscape → 539.51 × 235.92 canvas; 320 × 675 at Extra large text →
320.25 × 363.26 canvas. All had zero overlapping game buttons and no horizontal
overflow. The landscape canvas at Extra large text remained 539.51 × 222.50.
Tablet 768 and desktop 1296 widths had no horizontal overflow. Modal checks showed
one dialog and inert background controls. Escape returned focus to the canvas;
initial Shift+Tab uncovered a focus-trap gap which was fixed and then verified
in the production build. No physical-phone claim is made.


### Reliability and integration follow-up

Main was refreshed again to `965d5b9e13fc19ecf84947807bb7ec2522fd9bf9` after the
Vancouver V0.5 release; 139 is reserved for Richmond's journal. Vancouver and
Surrey have begun their next isolated iterations and acknowledged Richmond's
current integration turn. Vancouver agreed to leave the imported physics module
unchanged. No unrelated implementation was edited.

Integrated Vancouver regression: 59/59 passed. Richmond now has 27 passing cases:
all eight authored delivery road legs drive continuously; recovery faces the
current delivery route and remains local on airfield geometry; dynamic bumper
contacts permit separation while retaining solid actor collision. Both build paths
and `npm run check` passed after those fixes, with the existing tutorial lint and
known build warnings only. The development-only diagnostic/fresh-canvas retry addition and final walking
routing/counter-camera fixes are included in the latest build checkpoint.

After reconciling Surrey V0.4 main `9e5f4ca`, Richmond 27, Vancouver 59, Surrey 44
and investment 7 tests passed. Both Next and Vinext builds, typecheck/lint and
production audit passed (zero vulnerabilities; existing tutorial navigation lint,
Browserslist age and large-chunk warnings remain). One initial regression command
used a nonexistent investment test filename; it stopped before builds, and was
corrected to the repository's `npm run test:investment` script before continuing.

Actual browser reliability on a separate development origin:
- Forced WebGL context loss using the visible development-only check, observed
  the recovery message, pressed Retry, and verified the same player/car position,
  $20 starting balance and exactly one canvas. The error cleared and rendering
  resumed at 60 sampled FPS. Teardown produced an expected context-extension
  warning while the deliberately lost context was being disposed.
- Withheld the local city response in the isolated checkout, observed the readable
  “Map download failed” message and available text guide/Retry. Restored the exact
  SHA-256-matching asset, retried, and verified restored rendering/state. The map
  file is restored; no published or source-cache bytes were changed.
- Verified the repaired initial Shift+Tab wraps to Recover safely, Tab returns to
  Close, and focus stays inside the dialog. Normal Escape returns to the canvas.
- Followed GIS Apps → Play Richmond in a 390 px browser viewport, confirmed the
  correct route/title, no horizontal overflow and no canvas before Start.
- Local HTTP checks passed homepage, Labs/GIS, all three cities, Motion/Sports,
  privacy/support/tutorial and BotSquad. Richmond canonical is the expected apex
  `https://asymmetri.co/labs/richmond`; tutorial retains its exact www canonical.
  Sitemap contains Richmond. These local checks do not claim a live release.


### Shared-window handback during airport acceptance

Richmond explicitly released its current integration window and journal 139 to
Surrey V0.4 while extended airport gameplay checks continued locally. Surrey
acknowledged journals 139–140 and reserved 141 for its release receipt. Vancouver
V0.6 was notified. Richmond will re-read and reconcile the resulting main before
its own two-commit integration; no concurrent production action was taken.

Surrey returned the window at main `9e5f4ca`; Richmond acknowledged and reserved
journal 142. Reconciliation kept Surrey's new README/version copy and appended
architecture/assets/content/testing sections alongside Richmond's additions.
Shared tracked files were temporarily stashed, fast-forwarded, reconciled and
verified before dropping the task's stash. No unrelated files were staged.
