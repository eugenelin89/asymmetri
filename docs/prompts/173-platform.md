# Prompt 173: Integrate Stanford reviews and private play reporting

- Date: 2026-10-31
- Scope: platform
- Goal: Add the committed shared review and privacy components to Stanford without changing other campus integrations.

## Original user request

> Continue the Stanford campus deployment work in this chat within its existing authorization and shared-release coordination.

The user’s heartbeat assigns Stanford both its initial campus release and its later Stanford-only reviews/private-usage integration, testing and deployment after the UBC-owned shared components are committed. The owner also requires ten-minute ETA updates through both stages.

## Scope

Stanford frontend integration, scoped information-panel styles, local validation and evidence. Initial production source a69cb68 is already live; this integration does not itself establish follow-up deployment. Shared APIs, storage, privacy documentation and retention remain owned by the shared-service release.

## Decisions

Use the canonical shared modules from `704a9b3`. Put compact privacy choices before entry and full controls in Project information. Pass only the Stanford campus identifier, loaded-game eligibility and the game-section ref to PlaySession. Leave surrounding notes, reviews and footer outside its activity region. Place unseeded visitor reviews above the footer. Preserve CWRU’s prior shared-feature commit in the final candidate.

## Implementation

The Stanford page composes the privacy notice and review section. The explorer mounts PlaySession only with its loaded-game signal and exposes the full privacy/deletion control. Scoped Stanford panel styles preserve checkbox spacing and touch size without modifying shared components.

## Engineering impact

Uses existing shared components with no new dependency or server configuration. Public profiles, review ownership and private telemetry remain separate. GPC/DNT, opt-out, visibility/activity gates, cookie bootstrap, request serialization and bounded timing come from the canonical shared client/server. Production reviews must be verified without publishing synthetic records.

## Files changed

Stanford route, explorer and scoped styles; implementation/project documentation; integration evidence; three local screenshots and their asset/gallery records. Final diff totals to insert after the implementation commit.

## Documentation updated

The Stanford guides distinguish its live initial release from follow-up integration. The integration report records exact local checks and privacy boundaries. Asset/gallery entries identify local proof captures and do not imply production acceptance.

## Git diff summary

11 files changed, 70 insertions and 3 deletions, including three JPEG proof captures. The only runtime changes are the Stanford route, explorer and its scoped CSS. The shared asset-manifest change records only Stanford proof.

## Verification

182 focused tests passed (140 Stanford and 42 shared). TypeScript/lint passed with the existing tutorial warning; production audit found zero vulnerabilities. Final Vinext and Next builds passed; Next prebuild passed 511 tests. Disposable local browser checks passed review create/edit/remove/sort and focus restoration, no recording before entry or while opted out, ready-game start, off-screen pause, fresh-input resume and history deletion/opt-out. Test stores ended empty. Corrected privacy panel passed mobile/tablet layout checks with no document overflow at 390/768 px; desktop 1280 px was inspected. No final console errors or broken images. Shared tests cover the broader idle/GPC/DNT/cross-tab cases; no claim that every case was repeated manually. Local validation used committed base `4bc6d7b` plus these Stanford changes. All three staged runtime files exactly match the final tested export. CWRU integration `0394569` is preserved as the final candidate parent; exact-source Linux CI will validate that combined committed tree before deployment. Production deployment remains a separate release step.

## Repository state after implementation commit

Branch main at `c91bf86c7987a3e53be3868e3e4318ac32912c68`, directly after CWRU integration source `0394569de2b883fe06f8bae0c010a6b0ad9bf1cf`. The CWRU owner explicitly released main/index after pushing that candidate. The implementation is one commit ahead of origin before this journal; both will be pushed together without force. Only the pre-existing generated `next-env.d.ts` change remains unstaged. No other campus file was staged or edited by Stanford.

## Implementation commits

- `c91bf86c7987a3e53be3868e3e4318ac32912c68` — feat(stanford): add visitor reviews and play privacy controls

## Archive commit

`docs: archive Stanford shared-feature integration`

## Lessons learned

A shared component can inherit broad campus-panel styles; verify it in the actual nested panel. Freeze a candidate only after predecessor campus integrations are committed, so successor deployment preserves their behavior. Refresh archive custody from the separately authorized disk cleanup before the follow-up release.

## Follow-up ideas

Complete exact-source Linux CI and guarded deployment after the shared-backend and CWRU handoffs, record journal 174 and remove the ETA heartbeat only when full live acceptance passes.
