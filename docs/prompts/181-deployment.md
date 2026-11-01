# Prompt 181: Deploy CWRU community and clearer running instructions

- Date: 2026-10-31
- Scope: deployment
- Goal: Release the reviewed CWRU follow-ups with exact-source validation, preserved data and independent live acceptance.

## Original user request

> like make the words bigger

> update eta to full deploymen every 10 minutes

> deploy asap

The last instruction was verified in the coordinating UBC chat. Existing owner instructions require each campus chat to implement and accept its own work; CWRU received the coordinated server rollout after UBC activated and handed off the shared backend. Journals 179, 180 and 182 record the running controls, review/reporting integration and later privacy-panel removal requests.

## Scope

Deploy the final combined source `b3601b31fa5bfe296496046a1f6f911e5f16e4df`, including each campus owner's reviewed changes. CWRU owns its own browser acceptance and this deployment record. The separately requested iPhone Silent Mode audio change is excluded from this artifact and remains separate follow-up work.

## Decisions

Wait for the explicit healthy 704 backend handoff; preserve main/index ownership while other campuses finish source changes. Freeze exact b360 after all owners' removals rather than deploy superseded 039 or moving main. Consume the successful Linux artifact, clone a new application-owned staging tree without hardlinks, and verify the archive stream before any activation. Keep all existing shared/profile settings and private stores. Drain website/pruning writers around the swap and resume maintenance only against a healthy compatible runtime. Retain complete rollback and all 12 owner-held archives.

## Implementation

Activated build `xMZDEUQlNPy6b48OwpOC3` at 00:28:14 UTC on November 1 (October 31 Vancouver). The larger desktop/touch Run labels, CWRU public reviews/reporting and requested privacy-panel removal are live. The plain policy link and existing opt-outs/browser privacy signals remain. Final server acceptance passed at 00:32:19 UTC. No backend configuration was installed or removed.

## Engineering impact

The release preserves all three profile stores, review/analytics data, protected Motion resources, other campus/city applications, peer services and current archive custody. No live build/dependency install or unrelated service restart occurred. The previous 704 runtime is retained whole for rollback. Documentation commits do not change the frozen runtime.

## Files changed and documentation updated

Six documentation files: new CWRU community release receipt; CWRU integration and running-control status; project/onboarding references; deployment/recovery guidance. The receipt includes exact source/build/artifact identity, live checks, resource floors, retention and rollback. Private operational receipts and screenshot evidence remain outside the repository. Other owners' pending audio files and generated next-env change were preserved.

## Git diff summary

Six files changed, 52 insertions and 7 deletions. This journal is excluded from its own totals.

## Verification

Exact Linux workflow 41255821757 passed 585 tests, TypeScript/ESLint, zero-vulnerability production audit and Next webpack build. ZIP/tar/source/Node/build checksums matched. Guarded checkout/transfer/private smoke/activation passed. Loopback, apex and www each passed 18 pages, 800 public asset digests and 40 static assets. Private candidate profile/review fixtures, analytics readiness/prune and image optimization passed. Public API checks published zero synthetic reviews or sessions.

CWRU live desktop and phone acceptance verified automatic Halloween, 17px run instructions, 88px touch Run target with 18px label, CANVAS keyboard input/focus restoration, absence of privacy panels, separate policy link, review empty state/form and no horizontal overflow or console errors. Physical-device audio/performance is not claimed. The shared owner temporarily opted the test browser out during all campuses' gameplay checks, retaining its previous preference for restoration.

One HTTPS asset GET disconnected during the first final-health pass. Application identity/PID remained unchanged with zero restarts. The private verification helper was extended with bounded GET-only transport retries and five fault-test groups; original helper/failure receipts were preserved. Full acceptance then passed, including 15 peer hosts, all private stores/configs, successful retention maintenance, 12 archive custody records and zero new-process errors/warnings. Final-health minimums were 300,324 KiB RAM and 10,327,392,256 free bytes; all phases stayed above 192 MiB / 6 GiB. No runtime redeployment was needed for the checker correction.

## Repository state after implementation commit

Main at `ca0bbd561b26fac2165f932747f4b10f31a73e85`. Only the six CWRU release-documentation paths were committed. UBC/Stanford audio changes and generated next-env remained unstaged. After the separate journal commit, push main without force and release the index to UBC 185. No branch, worktree, PR or merge was created.

## Implementation commits

- `ca0bbd561b26fac2165f932747f4b10f31a73e85` — docs(cwru): record verified community and running controls release

## Archive commit

`docs: archive CWRU community deployment acceptance`

## Lessons learned

Freeze immutable shared-site artifacts after each owner finishes source changes, keep runtime deployment separate from later documentation/audio work, and verify HTTP transport recovery without weakening content or certificate checks. Preserve custody receipts when authorized cleanup changes archive locations.

## Follow-up ideas

The owner-requested CWRU iPhone Silent Mode support is required follow-up work, reserved as journal 187. It needs its own tests, source commit and coordinated deployment. Ten-minute ETA updates remain active until all requested CWRU follow-ups are verified live.
