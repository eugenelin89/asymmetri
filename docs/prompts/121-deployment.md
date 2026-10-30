# Prompt 121: Vancouver V0.3 verified production deployment

- Date: 2026-10-30
- Scope: deployment
- Goal: Activate the validated V0.3 candidate safely and preserve complete V0.2 recovery.

## Original user request

> I authorize autonomous implementation, testing, Git commits, pushes, and deployment under the established production safety requirements.

The V0.3 request requires a real public release if gates pass, unchanged 192 MiB
available-memory / 6 GiB free-disk floors, an independent Linux candidate, complete
immediate rollback, preservation of Motion/BotSquad/peer sites/configuration and
old geographic snapshots, and a precise final source/build/health report. See
journal 120 for the complete decision-oriented development summary.

## Scope

Exact validated candidate, isolated staging, health/compatibility acceptance,
whole-directory activation and release evidence. No infrastructure, dependency,
credential, peer-service or unrelated application changes.

## Decisions

Reuse the established read-only GitHub Linux build and guarded SSH swap. Preserve
all complete current/immediate rollback state. Reclaim capacity only from the
redundant original V0.1 runtime after lossless archive, matching SHA-256, gzip,
full remote tar comparison and inactivity/source/config-reference rechecks.

A concurrent task switched the shared checkout to `codex/surrey-adventure-v01`
while release documentation was being committed. The two-document release commit
is a direct child of the already deployed main revision. Its journal is prepared
with an isolated Git index, and main is fast-forwarded by compare-and-swap; no
checkout, reset, staging of Surrey files or force-push is used. The shared branch
and other task's new files remain available to that task.

## Implementation

Activated source `8d0530e65dabf23266f892cf3aef2b3b55e6733d`, build
`Y3ReGxnH5WDkIJA_b0D-G`, at 16:04 UTC / 09:04 PDT. Successful isolated Linux
workflow 41085398178; artifact 12991522305. Tar SHA-256:
`b88941d70b9b2c84565ff0a0ed9ceb0e2a9cc3a81de6777dce0586f60dd2888c`.

## Engineering impact

Only the website process was stopped/started. A complete previous V0.2 directory
is retained with source `7990eabe022aed0ed28b477b07bc2d9ad457e1d6`, build
`LgdQfEvDuIcwEAl6_yxWS` and executable Linux dependencies. V0.1 and pre-Vancouver
recovery are retained too. No rollback was needed or simulated as a drill.

## Files changed

Release evidence and the deployment-guide pointer. No application code changed
after the accepted implementation, apart from that previously recorded in 120.

## Documentation updated

V0.3 release record now contains exact identities, candidate/public/browser
acceptance, measured resource floors, preserved peers and actual recovery steps.
The deployment guide identifies it as the active release.

## Git diff summary

Two files changed, 57 insertions and five deletions in the release-record commit.
The earlier implementation changed 24 files, 968 insertions and 103 deletions.

## Verification

Linux checks, 25 Vancouver tests, audit and production build passed. Local Next
and Vinext builds and seven investment tests had already passed. Candidate:
12 route checks, eight host/path combinations, 124 tutorial IDs, 24 tutorial
assets, Sharp image optimization HTTP 200, preserved Motion/form/video behavior,
Ask/Trade main content, no-JS summaries and all three versioned dataset hashes.
The separate 13-route protected comparison passed before and after activation;
24 additional public apex/www/redirect/data checks passed.

Guarded preparation stayed above 238.1 MiB available memory and 6.407 GiB free
disk. Final 16:06 UTC health: 406.1 MiB available, about 6.407 GiB free, enabled
running website, zero restarts, zero post-activation errors. The old wrapper's
intentional-stop exit-143 entry is accounted for. Five peer service identities,
55 configuration hashes, 13 peer vhosts and Node binary stayed unchanged.

Public 3D loaded V0.3 and the correct Labs menu. The live 72.7-second drive covered
769.8 m without collision, 59.9 average / 58 minimum sampled FPS and 17.6 ms rolling
p95, stable 85 geometry / 11 texture counts and no application browser errors.
Live 390×844 expanded layout had no overflow; braking/Escape worked. Earlier
both-direction browser acceptance covered 5 km / 8 minutes without collisions;
additional optimized local driving covered 3.2 km / five minutes without collision.
Physical-phone, thermal/multi-touch, forced GPU-loss and OS reduced-motion-emulation
limits remain explicit. Private receipts/screenshots are retained by the owner.

## Repository state after implementation commit

Release record `1895aaeb54750e9d518a787ae1e209a5df451156` is a direct child of deployed main `8d0530e`.
The shared checkout was concurrently moved to the Surrey task's branch. This
journal/main update uses an independent index and a normal fast-forward push;
other task files are not included. Production stays at the exact tested `8d0530e`
source; subsequent release records change documentation only.

## Implementation commits

- 6a8aa71e1f5bbc03dc4e6c69f3004b1121a470b2 — feat(vancouver): add continuous scenic driving and local navigation
- 1895aaeb54750e9d518a787ae1e209a5df451156 — docs(vancouver): record verified V0.3 production release

## Archive commit

`docs(journal): record Vancouver V0.3 production deployment`

## Lessons learned

Keep exact build/source provenance, complete immediately prior runtimes and
resource guards through the private smoke window. A concurrent shared checkout
needs isolated-index publication and compare-and-swap refs, not a branch reset.

## Follow-up ideas

Physical devices and broader manual routes first; current bounded geography and
coordinated bridge elevation later. Plan verified archival before the next large
runtime candidate, while preserving its immediate rollback.
