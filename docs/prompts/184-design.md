# Prompt 184: Remove Stanford Play privacy panels

- Date: 2026-10-31
- Scope: design
- Goal: Remove the Play privacy panel from every Stanford screen while preserving existing recording preferences and visitor reviews.

## Original user request

> I don’t want it anywhere.

The owner clarified the Play privacy panel removal in the coordinated campus release. Stanford owns removal from its landing page and in-game Project information; UBC owns shared-page changes and CWRU owns its frontend.

## Scope

Remove both Stanford component uses, their unused import and scoped styles. Update Stanford documentation and identify earlier privacy-panel captures as historical. No shared tracking logic, APIs, stored preferences, reviews, geographic assets or gameplay are changed.

## Decisions

Keep PlaySession with the same ready-game condition and region ref. Stored opt-outs, GPC/DNT and activity gates remain honored; the shared policy describes collection. CWRU owns the combined runtime activation after all removal commits and exact-source Linux CI. Stanford retains live acceptance and release documentation.

## Implementation

The landing page opens directly into the campus entry. Project information contains architectural, source and public-character notes without the Play privacy card or its controls. Unused panel-specific CSS is removed.

## Engineering impact

A UI removal with no dependency, server-state or telemetry-schema change. The recording checkbox and history-deletion action are removed without changing existing preferences. Reviews and the game-region session boundary remain intact.

## Files changed

Stanford page, campus component and CSS; project and integration documentation, validation notes and the Stanford asset-manifest description.

## Documentation updated

Current descriptions no longer promise removed controls. Earlier privacy-panel screenshots remain historical. Integration notes distinguish earlier lifecycle checks, new UI-only validation and pending combined acceptance.

## Git diff summary

8 files changed, 19 insertions and 35 deletions. Three runtime files remove panel rendering and styles; five documentation files record current behavior and historical evidence. This excludes the separate journal record.

## Verification

An isolated d93828d export plus Stanford changes passed 182 focused tests, TypeScript/ESLint (one existing tutorial warning), Vinext, Next webpack and the production dependency audit (zero vulnerabilities). Next compilation ran directly after focused tests without repeating the full prebuild hook. Browser checks passed at 1280×720, 390×844 and 768×1024: both panels absent, reviews retained, no overflow, no sampled broken images and no console errors. Closing information restored canvas focus. Private local screenshots record the revised landing and information panel. Shared tests cover stored opt-outs/GPC/DNT; these signals were not manually reinjected. The disposable preview stopped; the original user preview remains. Final combined CI and production acceptance are separate.

A later Mac disk shortage affected concurrent owners' builds after Stanford verification. Reclaimed only completed Stanford .next/dist outputs from three inactive validation exports, preserving source, dependencies, release archives, evidence and the running user preview. No server changes.

## Repository state after implementation commit

Implementation committed as `8db97b61e5d844226c6943dd7db21ec6223510c5` on shared main after CWRU journal182 (`5aa6cdf`). Eight explicit paths were staged, with the shared asset manifest reconstructed from HEAD plus only the Stanford paragraph. Concurrent UBC/shared-page changes and generated next-env.d.ts remain unstaged. The two Stanford commits will be pushed together before the index returns to UBC for journal183; no Stanford server action occurred.

## Implementation commits

- `8db97b61e5d844226c6943dd7db21ec6223510c5` — `fix(stanford): remove play privacy panels`

## Archive commit

`docs: archive Stanford privacy panel removal`

## Lessons learned

Remove unused styles with their component and update current documentation without rewriting prior evidence. Pin the final combined source so later releases cannot restore removed UI. Keep completed local build caches bounded during concurrent validation.

## Follow-up ideas

Complete the already-authorized combined rollout and Stanford live acceptance; no extra feature scope.
