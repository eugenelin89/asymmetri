# Prompt 182: Remove CWRU play-privacy panels

- Date: 2026-10-31
- Scope: design
- Goal: Remove the unwanted Play privacy panel from CWRU while preserving its working campus controls, public reviews and existing reporting boundaries.

## Original user request

> i don't want to show this

> i don't want it anywhere

The owner identified the Play privacy panel in the UBC chat, then clarified that it should not appear anywhere. These direct human messages were verified there. The existing instruction to have each college's chat handle its own implementation applies: this journal covers only CWRU. UBC owns the shared privacy-page and UBC changes; Stanford owns its campus.

## Decisions and implementation

Remove CampusPrivacyPreferences from the CWRU landing page and Project information, including both imports. Replace the obsolete reference to controls below with a discreet link to the plain campus privacy policy, opening separately so the game remains available. Keep PlaySession and its game-region/readiness conditions, existing opt-outs, GPC/DNT handling, public reviews, player profiles and the larger running instructions unchanged. This UI removal does not change backend recording defaults or delete stored visitor data.

## Engineering impact and files

The CWRU route and explorer lose the two panels and recording checkboxes. The project README and integration report describe the selected UI and coordinated rollout. The validation gallery and CWRU asset-manifest paragraph mark the earlier privacy-panel screenshots as historical evidence. No shared component, API, store, dependency, other campus source or public image is changed.

## Verification

An isolated export on Node 24.10.0 passed TypeScript and ESLint, with only the pre-existing tutorial navigation warning. Desktop 1280×720 and phone 390×844 checks found no privacy panel or recording checkbox, no horizontal overflow and no console errors. Project information exposes the intended separate policy link, closing it returns focus to CANVAS, and the larger running instructions remain present. The viewport was reset and preview stopped. Browser emulation does not certify a physical device.

The Vinext build passed after an initial output-write failure caused by local disk exhaustion. Only idle CWRU temporary generated `.next`, `dist` and `.wrangler` output was removed, after confirming no open files. Source snapshots, dependencies, Linux artifacts, validation evidence and all rollback archives were retained. The standard Next production build will be verified on the final combined Linux candidate.

No new tests were added for this removal. The previously accepted engine/reporting suites remain applicable; the combined release still requires its own immutable-source Linux checks/build and live acceptance. The earlier039 artifact is retained as evidence and will not be deployed over this request. All production stores, backend configuration, maintenance and rollback custody remain untouched by this change.

## Git diff summary

Six files changed, 17 insertions and 12 deletions. This journal is excluded from its own diff summary.

## Repository state and release ordering

Implementation uses main after the shared-backend release journal178. The backend owner explicitly released the index to CWRU. Only the six reviewed CWRU source/documentation paths are staged; the other campus edits and generated next-env change are preserved. After this implementation and separate journal commit, main is pushed without force and the index is released to Stanford, then UBC for its shared UI commit. No branch, worktree, PR or merge is created.

The shared704 backend has completed live acceptance, but CWRU's frontend follow-up is not yet live. CWRU owns the forthcoming coordinated runtime rollout after all owners' source commits and exact-source CI; each campus retains its own live acceptance responsibility. CWRU deployment journal181 remains reserved for actual release evidence.

## Implementation commits

- 123f3bbbb03239f7c28f7f115567d390de06a61d — fix(cwru): remove play privacy panels

## Archive commit

`docs: archive CWRU privacy panel removal`

## Lessons learned

A display preference should be applied at every requested UI location without silently changing persistence or recording behavior. Mark superseded screenshots as historical, and freeze a new shared-site candidate after all campus owners finish their scoped changes.
