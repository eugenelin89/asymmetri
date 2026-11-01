# Prompt 191: Preserve iPhone audio through first campus entry

- Date: 2026-10-31 (Vancouver)
- Scope: platform
- Goal: Remove the extra off/on gesture needed after entering UBC with iPhone Silent Mode enabled.

## Original user request

> I had to turn off sound and turn back sound (by pressing the button) to make the sound work

> Stanford and CWRU both still need phone to turn off silent mode. please ask their respective thread to fix it

The standing instruction is to deploy promptly and keep each campus thread responsible for its own source. UBC's first playback-category fix is already live; the user confirmed audible Silent Mode output after manually toggling sound.

## Scope and decisions

Correct UBC's initial entry without changing other campus source. Forward the user's physical-device feedback to Stanford and CWRU. Their prepared fixes proceed in a separate serialized rollout while this correction builds. Preserve the working deployed toggle workaround until the correction passes exact-source production checks.

## Implementation

Campus keeps the chosen settings in a ref, updates it synchronously on relevant controls and feeds that authoritative choice to audio callbacks. Temporary engine defaults can no longer clear the initial playback intent. Explicit mute, zero volume and edition-off configure the controller immediately rather than waiting for renderer telemetry.

The audio controller accepts desired settings in resume, starts the existing audio graph during the same gesture and avoids suspending an initial pending unlock merely because assets have not finished loading. Construction alone no longer resumes audio or claims a playback session. Session ownership, hidden-page behavior and cleanup remain covered.

## Engineering impact

The change addresses two observed startup paths: a 400 ms suspension before scene settings arrive, and an early default-off engine snapshot before React applies the selected settings. No audio asset, dependency, permission, schema, tracking or other-campus source changes are introduced. The physical result after this correction still needs confirmation; the earlier phone report is not treated as acceptance of first entry.

## Files changed and documentation updated

Five UBC files: Campus settings integration, audio controller, focused regression tests, project README and audio report. The report separates the first release and its qualified phone result from this correction's tests and pending deployment.

## Git diff summary

Five files changed, 163 insertions and 40 deletions. This journal is excluded from its own totals.

## Verification

- All 17 focused audio tests and all 154 UBC tests passed on Node 24.10.0; strict TypeScript and scoped ESLint passed.
- New regressions permit only one initial gesture, wait beyond 400 ms without a scene callback and assert a running context, no suspension and started audio sources. The actual Campus callback is exercised with engine-default-off settings while the selected choice remains on; a later actual mute still wins.
- Independent bounded review and a separate 17-test run accepted the patch. Mute, zero, hidden, disposal, failed/pending resume and prior-session ownership remain covered.
- An isolated committed-source snapshot plus only the three runtime/test files passed Vinext build. Existing dependencies were reused, no install occurred, and hashes matched the tested files before commit. Successful source suites were not repeated unnecessarily.
- Local browser entry completed loading with Sound on without a second activation; mute/re-enable then passed and console errors were absent. The initial screenshot was taken before later toggle checks. This verifies the visible integration, not physical iPhone acoustic output.
- Diff check passed. Exact-source Linux build, deployment and a physical first-entry retest remain separate gates.

## Repository state after implementation commit

Main at c1d489f1a0deca6390b93f98611315481e51e5dc. Only five explicit UBC paths were staged; generated next-env remains outside the commit. CWRU confirmed its independent 33e4 checkout was frozen before this source could be pushed, allowing CI to run alongside that rollout. No branch, worktree, PR or root-owned server mutation was introduced.

## Implementation commits

- c1d489f1a0deca6390b93f98611315481e51e5dc — fix(ubc): preserve gesture audio through campus startup

## Archive commit

docs: archive UBC first-entry audio correction

## Lessons learned

Test the user gesture, audio context and renderer initialization as one sequence. A running status alone does not prove the selected media category survived initialization. Make actual user settings authoritative instead of asking asynchronous engine defaults to stand in for intent.

## Follow-up

Consume the exact successful production artifact through the existing deployment owner, then ask the user to retry first entry with Silent Mode enabled. Keep each campus owner's validation and deployment status explicit.
