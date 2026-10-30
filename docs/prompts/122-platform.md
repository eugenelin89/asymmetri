# Prompt 122: Build Surrey Adventure V0.1

- Date: 2026-10-30
- Scope: platform
- Goal: Implement, test and prepare a playable, independently sourced Surrey Labs game for guarded production release.

## Original user request

> Pasted text contains the user's request.

The supplied project brief asks for Surrey Adventure at `/labs/surrey`, using
Vancouver's technical foundation while preserving Vancouver unchanged. It requests
real, documented City Centre geography; a colorful third-person character game;
walking/sprinting/camera/collision; mobile controls; health/stamina/money/inventory;
NPCs, interaction, a complete stolen-backpack introduction and optional danger;
fictional-content and homelessness representation safeguards; a future mystery
hook; Labs navigation/listing/SEO; open-source/data notices; focused tests and both
build paths. It explicitly requires a dedicated feature branch, coherent commits,
and deployment when the established production safeguards can be satisfied. If
blocked, preserve the tested candidate and report the exact blocker. Future
missions, vehicles/transit and city expansion must not displace the first release.

## Scope

Separate Surrey route, source-backed map, offline importer, gameplay and UI,
regression/asset tests, documentation and existing Linux CI integration through a build hook. No
Vancouver source/data changes, new runtime dependency, backend, account, saved
progress, real crime data or unrelated infrastructure change.

## Decisions

Reuse Vancouver's tested geometry predicates directly; retain separate player
physics, simulation, renderer and map. Use bounded City of Surrey GIS queries under
the City open-data licence. An unavailable optional paths layer is excluded.
Heights are stylized from an attribute with unverified units/observation dates;
footprints and streets remain sourced. Keep all incidents/characters fictional,
include a community-assisted mission solution, and offer Gentle streets.

Use the requested `codex/surrey-adventure-v01` branch, overriding the repository's
default main-only workflow for this task. Follow the two-commit implementation /
journal convention. Preserve the unrelated pre-existing prompt 121 file unstaged.
The initial push was rejected because the existing Git credential cannot modify
workflow files. The two unpublished commits were rebuilt with that file unchanged
and a `prebuild:next` test hook, using existing authority; no credential scope or
security setting was changed.
Production still requires the exact-source Linux candidate, unchanged memory/disk
floors, protected-route and peer-service checks, and whole-runtime rollback.

## Implementation

The player starts on a source sidewalk near Surrey Central, follows Alex's clue,
catches or outsmarts a runner, recovers the backpack and returns it for $35.
Random pickpocket events have a warning, response/escape and cooldown. Community
NPCs offer help and water. A stopped watch introduces a clearly future mystery.
The client includes an SVG map, HUD, inventory, dialogue, touch pad, pause/restart,
recovery, Lite, reduced-motion behavior and complete WebGL teardown.

## Engineering impact

Pure deterministic logic enables mission tests through actual movement/collision.
Rendering and AI remain outside React's frame lifecycle. Static assets load only
when Play Now is selected on Surrey. No map service is queried at runtime.
The 2,224,370-byte immutable dataset and raw sources have SHA-256 receipts.
The optional importer uses an isolated Python/Shapely environment outside Git.

## Files changed

New `projects/surrey` gameplay, scene, UI, tests, importer and licence files;
`app/labs/surrey` route; separate public map/manifest; central content/sitemap;
Surrey test command and a prebuild hook executed by the existing Linux workflow.

## Documentation updated

Project README/notices document controls, implementation, provenance and roadmap.
Repository README, architecture, content, assets, local development, testing and
deployment documentation describe the new route and preserved release boundaries.

## Git diff summary

Implementation commit: 28 files, 4,005 insertions and 5 deletions. Most additions
are isolated Surrey code, readable formatting, documentation and its static map.
No diff under the Vancouver source, route or public asset directories.

## Verification

- Node 24.10.0 matches `.nvmrc`; existing dependency graph is unchanged.
- 17 Surrey, 25 Vancouver and 7 investment regression tests pass.
- TypeScript/ESLint pass with only the existing unrelated tutorial warning.
- `npm run build:next` and `npm run build` pass; production audit: zero findings.
- Offline regeneration is byte-identical; source/output pin checks pass.
- Manual browser mission: accept, clue, chase, backpack recovery, return and $35
  reward (balance $55). Held keyboard movement/sprint and held touch-pad input,
  pause/Escape, map, responsive layout and dialogue focus verified.
- Actual CSS viewports 320×740, 390×844, 767×1024, 844×390 and 1280×900 have no
  horizontal overflow. These are desktop viewport tests, not physical phones.
- The tested desktop scene sampled about 60 FPS. This is not a device-independent
  performance promise. Browser extension warnings were unrelated to application.
- Scoped privacy/path scan and `git diff --check` pass.
- Production release gates and final deployment identity are recorded separately.

## Repository state after implementation commit

Branch `codex/surrey-adventure-v01`, implementation `22ded9f`. Intended source is
committed; unrelated prompt 121 remains untracked and untouched. The feature
branch will be pushed with this journal before exact-source Linux validation.

## Implementation commits

- `22ded9f` — feat(surrey): add playable City Centre adventure and introductory mission.

## Archive commit

`docs(journal): record Surrey Adventure V0.1 implementation and acceptance`

## Lessons learned

A real footprint dataset needs a shared visible/collision coordinate system and
full-mission traversal tests. Endpoint interception can arrive before a runner;
tests should pursue the actor or wait, not assume the endpoint implies recovery.
One contact must be limited independently of stolen cash to prevent repeated
health loss when a wallet is empty. Keep geography currency and height assumptions
explicit rather than equating retrieval with survey date.

## Follow-up ideas

Richer landmarks/street furniture, physical-phone acceptance, and a second complete
investigation. Broader NPC avoidance, persistence, terrain and transit are later work.
