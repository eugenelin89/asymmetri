# Prompt 170: CWRU V0.1 production deployment and ETA updates

- Date: 2026-10-31
- Scope: deployment
- Goal: Deploy and verify the prepared CWRU campus, preserve shared services and recovery evidence, and provide ten-minute ETA updates.

## Original user request

> eta till full deployment?

> update eta to full deploymen every 10 minutes

The preceding campus, character, interior, Halloween, calendar and sound requirements are recorded in journal 169. The owner also supplied student research, whose safe import is covered there. Subsequent shared reviews and play-reporting requirements are a separate follow-up assigned to each campus chat; they were excluded from this frozen artifact.

## Scope

Published the exact tested CWRU V0.1 source and its independent private profile store on the existing production site. Preserved UBC, city projects, BotSquad, protected Motion pages, other virtual hosts, prior profile data and recovery artifacts. No operating-system upgrade, Node replacement, unrelated service restart or live dependency compilation occurred.

## Decisions

Used source `28b5521a9f7edd809b49d594b7a75eb64f3f66be`, a Linux artifact built by successful CI, an independent application-owned checkout and guarded runtime swap. Kept the 192 MiB available-memory and 6 GiB disk floors. Two older inactive expanded runtimes were losslessly archived to private owner storage before retirement; six existing server archives and the historical owner archive were retained. The complete immediate predecessor remains on server.

Configured CWRU persistence outside the runtime with its own path/cookie. Used disposable synthetic characters for private and public create/read/edit/recovery/delete acceptance and removed them. Preserved the UBC store byte-for-byte. Local and private candidate servers were stopped; the empty private candidate store was removed after verifying no listener/writer.

Created one active ten-minute heartbeat in this chat, avoiding duplicate schedules. It provides evidence-based stage/ETA updates and remains active for the separately assigned reviews/reporting follow-up. Core campus deployment is complete; that follow-up awaits committed shared code and shared backend activation.

## Implementation

Activated at 22:32:09 UTC, October 31. Live build `H6dUdFnitvZI1P5BXdc9O`; final health passed at 22:37:38 UTC. Both public hostnames serve CWRU with the expected geographic assets, Halloween controls and working private profile lifecycle. Live browser checks covered welcome, movement, phone layout, audio controls, seasonal restoration and actual library entry. The server slot was handed to the Stanford chat after acceptance under the owner's explicit cross-campus coordination instruction.

## Engineering impact

The new `/var/lib/asymmetri-cwru-community` store and `40-cwru-community.conf` systemd setting are now part of every successor baseline. Release/custody receipts identify the complete immediate rollback, owner-only older archives and unchanged resource floors. Documentation distinguishes live core functionality from upcoming shared services. No new dependency was introduced. Source-informed architecture remains an interpreted reconstruction, with exact room geometry, physical-device performance and subjective sound quality outside the verification claim.

## Files changed

Updated onboarding, project guide, CWRU implementation/operations reports, deployment guidance and asset provenance. Added the production release receipt and three original live browser captures. Shared uncommitted UBC/community/Stanford changes were preserved and excluded through scoped staging.

## Documentation updated

`docs/CWRU_RELEASE_2026-10-31.md` is the complete public receipt: source/build/artifact identities, validation, private persistence, capacity, retention and rollback. README and operations/project documents now correctly identify V0.1 as live. The asset manifest records the actual JPEG format, dimensions and limitations of the production screenshots.

## Git diff summary

10 files changed, 71 insertions and 9 deletions, including three new image files. The implementation commit contains documentation/evidence only; the live runtime remains the frozen journal 169 source. This record is excluded from its own summary.

## Verification

- Exact-source Linux CI passed all 393 tests: 74 Vancouver, 69 Surrey, 27 Richmond, 134 UBC and 89 CWRU, plus check/lint, production audit with zero vulnerabilities and the standard Next build. Local Node 24 CWRU/Next/Vinext checks had already passed.
- Verified artifact ZIP/tar hashes, source/Node/BUILD_ID, safe archive paths and staged runtime scope before activation.
- Private candidate passed 18 routes, protected product checks, geographic/tutorial assets, image optimization and the CWRU profile lifecycle.
- Both public hostnames passed 17-route protected-content/link/ID/canonical comparisons, 24 tutorial assets each, CWRU HTML/asset matching and profile responses. Public synthetic profile lifecycle and origin/cookie checks passed; fixture removed.
- Browser checked automatic Halloween, movement, Regular restoration, sound preview/runtime, mute/reduced-motion controls, 390×844 layout with no horizontal overflow and Kelvin Smith Library Level 1 entry; no final console errors. Browser emulation is not physical-device performance or subjective audio certification. No new expanded-student conversation is claimed from this live pass.
- Final health: zero restarts/post-activation errors, unchanged peer services, 13 virtual hosts, 56 earlier configs, Node binary and UBC store; complete rollback and archive custody verified. 405,172 KiB available memory and 7,770,398,720 free bytes remained above floors.
- `git diff --cached --check` passed for the documentation commit. Routine browser evidence and receipts are retained privately; no raw logs, participant records or secrets are added to Git.

## Repository state after implementation commit

Branch `main`; implementation `416afa9cf8679941f133b5464f221f6c5da4b351`; local main ahead of the previously pushed journal 169 pending this separate journal commit. The worktree contains other active chats' changes, preserved and unstaged. The two CWRU documentation commits are pushed without force. No branch, worktree, PR or merge was created.

## Implementation commits

- `416afa9cf8679941f133b5464f221f6c5da4b351` — docs(cwru): record verified V0.1 production deployment
- The runtime implementation `2332e7b4448dc02b02ad1088042a06e60cf45a63` was already separately archived by 169; this deployment uses source `28b5521a9f7edd809b49d594b7a75eb64f3f66be`.

## Archive commit

`docs: archive CWRU production deployment and ETA journal`

## Lessons learned

A passing private smoke is not public profile evidence; verify and clean the complete lifecycle after activation. Preserve shared profile settings and archive custody during every successor release. Inspect screenshot signatures before assigning filename extensions. Scope shared-file staging to the current workstream while preserving concurrent drafts.

## Follow-up ideas

The separately requested reviews and privacy-controlled usage reporting await the shared source/backend handoff. Christmas remains planned and December continues to use Regular until implemented. More accurate surveyed interiors require additional usable architectural evidence; no campus-wide digital-twin claim is made.
