# Prompt 134: Reconstruct Surrey and clear the phone playing view

- Date: 2026-10-30
- Scope: design
- Goal: Ship the V0.3 reconstruction and discoverable views while preserving stories and saves.

## Original user request

> Surrey, City of Adventure — retain the recent rename

> I find on the iPhone, the main playing view is blocked by multiple sub views...

The attached V0.3 brief requests persistent Street Adventure/Aerial Explore
controls, accessible active semantics, guarded V switching, first-use help,
touch-specific guidance, source-backed road/curb/path reconstruction, verified
height provenance, a reliable terrain investigation, recognizable procedural
landmarks and batched detail. It requires the fixed extent, missions, encounters
and saves to survive; versioned immutable data, documented rights and limitations,
automated/browser acceptance, a dedicated branch, push and guarded production
deployment complete the request. The owner supplied two iPhone photographs
showing V0.2 panels obscuring the street and aerial scenes.

## Scope

Surrey game, snapshot, source importer, Surrey route/registry copy and affected
documentation. No geographic expansion, story expansion, dependency or unrelated
service/configuration changes. Concurrent city projects retain isolated work.

## Decisions

- Keep the recently approved public name and existing route; integrate the latest
  shared Labs menu before committing.
- Show compact controls and objective on phones, with status in paused Menu and
  map/aerial tools opened on demand. Phone play expands automatically.
- Retain one renderer and scene. The active view is expressed in text and ARIA;
  V ignores editable controls, dialogue, Journal and pause.
- Verify height units and native-coordinate official matches, but label values
  derived because measurement dates/methods/accuracy remain unknown.
- Use source road surfaces and in-service geometry, deriving only uncovered
  corridors. A missing classification label does not imply missing geometry.
- Keep explicit flat ground: DEM header/metadata evidence does not establish the
  vertical datum needed for a reliable terrain integration.
- Preserve V0.1 bytes, collision geometry and anchors. Migrate the existing v2
  local save explicitly to the new map ID instead of discarding progress.

## Implementation

Persistent two-mode controls, help preference, phone Menu and collapsible panels;
new topology-checked source snapshot; deterministic building profiles, batched
facades, nearby detail and landmark-specific cues; wide aerial character culling.
The reconstruction is reproducible from pinned retained source receipts.

## Engineering impact

Client rendering and local storage only. No tracking or server state. New map is
approximately 3 MB uncompressed and below the loader's explicit 4 MB bound.
The old map remains published. Primary touch controls are 44–48 px; focus handling
and mode guards preserve modal interaction. Production requires a full independent
Linux runtime and whole-directory rollback, not the earlier menu-only exception.

## Files changed

Surrey view/UI, rendering, data/save types, importer/tests and new city/manifest;
Surrey page and registry; project notices/readme; repository development, testing,
architecture, content, assets and deployment documentation; V0.3 acceptance record.

## Documentation updated

Documents describe actual control behavior, geography and licence evidence,
height/terrain limits, save migration, reproducibility, validation and release
requirements. Historical prompt records and published snapshots are unchanged.

## Git diff summary

31 files changed, 1,427 insertions and 213 deletions in the implementation commit.
The city is a compact one-line JSON asset; line counts do not express its size.

## Verification

TypeScript/ESLint pass with one pre-existing tutorial warning; 35 Surrey, 43
Vancouver and seven investment tests pass; audit reports zero production issues.
Next.js webpack and Vinext builds pass. Three independent geometry tests and
byte-for-byte offline reproduction pass. Fresh browser play completes the backpack
case, starts the mystery and collects two clues. Prior save migration, guarded V,
help persistence, panel controls, route exit/reload, phone/tablet/desktop layout
and repeated switching are checked. Exact evidence and limits are in the release
record. Physical-phone after-testing and long-session endurance remain separate.

## Repository state after implementation commit

Dedicated branch `codex/surrey-adventure-v03`, clean after implementation commit,
based on latest shared main `1727292`. Journal 134 and the release window were
coordinated with the active Vancouver and Richmond chats. Push and exact Linux
candidate verification follow this journal; no production activation is claimed.

## Implementation commits

- `f58a1ec` — Reconstruct Surrey V0.3 and clear the mobile playing view.

## Archive commit

Record Surrey V0.3 engineering journal

## Lessons learned

Real phone photographs revealed obstruction that feature-by-feature checks
missed. Validate the unobstructed play area and open one detail panel at a time.
Rounding repaired polygons can recreate invalid topology; apply precision before
serialization and test the exported bytes independently. Metre units and matching
official attributes do not establish a measured-height survey provenance.

## Follow-up ideas

Physical phone acceptance, a verified terrain datum, and measured landmark facade
details are future work within the existing area.
