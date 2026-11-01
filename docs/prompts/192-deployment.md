# Prompt 192: Deploy UBC first-entry audio correction

- Date: 2026-10-31 (Vancouver)
- Scope: deployment
- Goal: Activate and verify the tested correction so UBC sound starts from the entry gesture while campus assets load.

## Original user request

> both CWRU and Stanford works beautifully. What is going on with UBC?

> deploy fix now

> with CWRU and Stanford, the sound begins to play even while the game is loading

## Scope

Deploy the UBC correction from journal 191 promptly under the owner's standing authorization. Each campus thread continues to own its source; CWRU operates the serialized shared-server rollout. Preserve the already working CWRU and Stanford runtime code.

## Decisions

Consume the exact successful CI artifact without rebuilding on the server. Keep the complete previous runtime and retained archives. Separate automated/browser acceptance from physical iPhone acoustic confirmation; the earlier manual Sound off/on result does not accept this new first-entry behavior.

## Implementation

Source `38d432685765161347cff7b74c2f3dddd14af378`, build `4JfgZCh6OpnpuPeTAjb1A`, activated at 01:17:48.648575 UTC on November 1, October 31 in Vancouver. The controller now starts the sound graph from the entry gesture with authoritative selected settings while campus data loads. Final health passed at 01:20:48.780416 UTC, and the deployment owner returned the healthy server after root's fresh UBC browser acceptance.

## Engineering impact

No additional runtime change was needed during deployment. Existing configuration, profile stores, shared reviews and analytics, retention timer and rollback copies were preserved. No cleanup, synthetic production play or review was performed. The final documentation changes require no redeployment.

## Files changed

The UBC iPhone audio report now records the corrected source, CI evidence, activation, health results and pending physical first-entry retest. Historical first-release evidence remains labeled separately. Local proof images and receipts are retained outside the repository.

## Documentation updated

`docs/UBC_AUDIO_IOS_2026-10-31.md` replaces stale pending-deployment statements with verified release facts. No physical success is asserted without a new user response.

## Git diff summary

One file changed, 39 insertions and 3 deletions. This journal is excluded from its own totals.

## Verification

- Exact-source Linux workflow 41259302295 passed all 619 tests, production dependency audit with zero vulnerabilities, Next.js production build and artifact upload. The preceding implementation already passed 17 focused audio tests, 154 UBC tests, TypeScript, scoped lint, isolated Vinext build and local first-entry browser checks.
- Reviewed artifact, server preflight, transfer, staged smoke test and guarded activation passed. No weakened guard or cleanup was introduced.
- Final health passed loopback, apex and www: 18 pages, 800 public assets and 40 static assets each. All 15 peer hosts, 12 retained archives, private stores, configuration and timer passed preservation checks. No new application errors or warnings were found. Minimum available memory was 312,176 KiB and free disk was 6,487,830,528 bytes.
- A fresh live browser loaded the Halloween welcome and checked soundscape control, loaded reviews, no removed privacy control, no horizontal overflow and no console errors. A real screenshot was saved; production gameplay was not entered.
- Physical first-entry playback with iPhone Silent Mode remains pending. The owner was asked to refresh and enter once without toggling Sound.
- Documentation diff check passed. Successful source tests were not repeated for this documentation-only closeout.

## Repository state after implementation commit

Main at `ff5125db8f3978689221140cba03c6dbb5c9d31f`, following the other campus owners' documentation commits. Only the UBC release report was staged. Unrelated generated `next-env.d.ts` remains outside the commit. No branch, worktree or PR was created. Both closeout commits are pushed after this record is committed.

## Implementation commits

- ff5125db8f3978689221140cba03c6dbb5c9d31f — docs(ubc): record first-entry audio deployment

## Archive commit

docs: archive UBC first-entry audio release

## Lessons learned

Preserve user-selected audio settings through asynchronous renderer initialization. Treat server health, visible audio state and physical audible output as distinct evidence, and keep the exact deployed source explicit.

## Follow-up ideas

Record the owner's new iPhone first-entry result when supplied. Investigate additional runtime changes only if that result exposes a remaining failure. Future deployments need a fresh capacity assessment; retained archives were not retired by this release.
