# Prompt 124: Surrey Adventure V0.2 — Dangerous Streets

- Date: 2026-10-30
- Scope: design
- Goal: Deliver a playable aerial/street adventure with expanded fiction, a complete mystery and local saves, then release through existing safeguards.

## Original user request

> Implement, test, and ship the strongest playable V0.2 achievable under the existing safe release process. Begin now.

The detailed request called for an aerial camera sharing Surrey's existing scene,
exact player marker, orbit/pan/zoom/follow/return controls and paused street activity;
recognizable source-backed landmarks; an extensible seeded encounter framework
covering robbery, theft, optional adult solicitation/dealer dialogue, scams and
community interactions; a complete non-graphic homicide mystery; better pedestrians;
versioned local saves; responsive accessible controls; performance/disposal tests;
and preservation of V0.1, Vancouver, datasets, other routes and services. It explicitly
required a separate branch, commits/push and safe production deployment with a full
rollback, or a measured blocker. Aerial, playable encounters, mystery and saves took
priority over optional cosmetics. All characters/incidents are fictional adults;
no real crime assertions, explicit acts or practical drug transaction instructions.

## Scope

Only Surrey game code/UI, its route/status metadata and affected documentation.
No dependencies, geographic snapshots, Vancouver code, workflow, proxy or service
configuration changes. Candidate publication and production activation are separate;
this journal records implementation, not a future successful release.

## Decisions

Retain the existing world and one renderer/loop. Isolate pure aerial maths, authored
encounter/story data, validated saves and bounded pedestrian movement. Freeze the
simulation in aerial mode so inspection cannot cost health, chase time or progress.
Use discovered journal leads rather than exposing hidden evidence. Cap mission and
encounter rewards against repeat farming. Mature dialogue is optional/off by default;
Gentle Streets suppresses threats. Original procedural massing references public
architectural sources without copying photographs, marks or artworks. Keep all
player data browser-local and validate before restore; storage failures permit play.

## Implementation

Two complete cases, six new encounter types, a shared-scene aerial explorer,
landmark/lead waypoints, exact YOU marker, evidence journal, versioned Continue/New
Game, rounded shared people, sidewalk routes and source-backed civic detailing.
Improved active-case HUD when investigating before the backpack case. Recovery
cannot move the character in aerial mode; far aerial pedestrians are culled.

## Engineering impact

No runtime dependency/service added. React receives bounded snapshots; camera and
simulation remain outside React's frame work. Save data adds one versioned localStorage
key with no upload/account/tracking. Touch controls and keyboard/focus boundaries
cover journal, choices and aerial mode. Existing reduced-motion, Lite, visibility
suspension and disposal remain. Collision and both old quest solutions are preserved.

## Files changed

Surrey scene/engine/simulation/types and responsive UI were extended. Seven small
modules isolate camera, story, encounters, save validation, population, landmarks
and journal presentation. Automated Surrey tests expanded to 29 cases. Route and
central Surrey release metadata identify V0.2. No public binary assets changed.

## Documentation updated

Project README/notices cover controls, gameplay, architecture, sources and limits.
Root README and architecture/content/local-development/testing/asset/deployment
references reflect V0.2. A dated privacy-audit extension describes local-only saves.
The V0.2 release record captures candidate acceptance and guarded capacity preparation.

## Git diff summary

28 files changed, 1,295 insertions and 410 deletions. The implementation extends the
isolated Surrey project and records its provenance/verification without changing
Vancouver or other product behavior.

## Verification

29 Surrey, 25 Vancouver and 7 investment tests pass. TypeScript/ESLint pass with one
pre-existing tutorial warning; production dependency audit is clean. Standard
Next.js webpack and Vinext builds pass. Local production HTTP comparison passes
13 routes, preserved content and 24 tutorial assets; Vancouver page is identical.

Ordinary browser movement completed five clues, three witnesses, both mystery
outcomes and the original backpack quest. Three new encounters resolved, including
optional adult dialogue and an aerial-paused pursuit. Reload restored both cases,
three resolved street stories and $158. Aerial pan/orbit/zoom/follow/waypoint and
20 mode switches kept one canvas; counts stabilized after warm-up. Route exit
removed the canvas. New Game confirmation, journal focus wrap, empty error log,
held touch pan and 320/390/tablet/landscape/desktop layouts passed. Physical phone
performance and long-session heap tracing are not claimed.

## Repository state after implementation commit

Branch `codex/surrey-adventure-v02`; implementation `b1715418b0cefed02325c6694a5111491bf7113a`. All implementation
changes committed, no unrelated work included. Both commits will be pushed to the
feature branch for exact-source Linux validation; main advances only after checks.

## Implementation commits

- `b1715418b0cefed02325c6694a5111491bf7113a` — feat(surrey): add aerial exploration and Dangerous Streets V0.2

## Archive commit

`docs(journal): record Surrey V0.2 implementation and acceptance`

## Lessons learned

Ordinary browser play-through catches presentation and navigation details that pure
state tests cannot. Keep aerial pause and save validation at the simulation boundary.
Record actual CSS viewport dimensions when browser zoom affects emulation. Preserve
full live rollback while archiving only verified older inactive runtimes.

## Follow-up ideas

Physical iOS/Android performance/input acceptance, richer recurring-character errands
and schedules, and source-backed paths/terrain/transit before expanding map extent.
