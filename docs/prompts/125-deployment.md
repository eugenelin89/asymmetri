# Prompt 125: Publish Surrey Adventure V0.2 safely

- Date: 2026-10-30
- Scope: deployment
- Goal: Activate the tested V0.2 Linux runtime and preserve the complete preceding production release.

## Original user request

> Implement, test, and ship the strongest playable V0.2 achievable under the existing safe release process. Begin now.

This is the deployment phase of the detailed request summarized in journal 124:
keep `/labs/surrey`, preserve V0.1/Vancouver and unrelated services/data, use a
separate development branch and existing release guards, commit/push completed
work, and retain the full production rollback. No new deployment permission was
needed; the user explicitly requested shipping through the established process.

## Scope

Exact-source GitHub Actions Linux candidate, isolated application-owned server
checkout, verified transfer/staged checks, guarded whole-runtime activation,
public/browser acceptance and release documentation. No live install/build,
proxy/runtime/service configuration, database, receiver or unrelated route change.

## Decisions

Use successful workflow 41107855489 for source
`52f4451752c2995a7f397a022090a42a821b31a0`; verify ZIP/tar digests, source, Node
and safe archive members. Archive only an older inactive Vancouver V0.2 runtime
after full off-server SHA/gzip/tar comparison and activity/reference checks.
Keep live Surrey V0.1 and Vancouver V0.3 complete. Retain 192 MiB available memory
and 6 GiB disk floors throughout. Advance main normally only after staged checks;
activation requires exact origin/main and artifact identity and auto-restores on failure.

Parallel GIS Apps work used another clone and was asked to wait through activation,
preserve the released source, and reserve journal 126 or later. Its navigation
changes are outside this deployment. The public game remains Surrey Adventure.

## Implementation

Activated V0.2 at 18:40:46 UTC / 11:40 PDT. Build `kpnCoQ9y6YEz8nDG63G0n`, Node
22.23.1, Next 16.4.3, Three 0.186.1. Full preceding source `883ebfe5d81a191b9d73e6fd183ec2d589d88be6`
and build `Ph1NW42c_br8k4AmOXJQ4` retained with executable dependencies at the
Surrey V0.1 rollback path recorded in the release receipt. No rollback needed.

## Engineering impact

Only the website process was replaced. Five peer service identities, 55 config
hashes, 13 unrelated virtual-host responses and Node binary stayed unchanged.
The old shutdown's exit-143 entry is separate from zero post-activation errors.
No app data upload, credentials, paid API or service authority was introduced.

## Files changed

Final V0.2 release receipt includes exact artifact/source/build, staged/public/
browser checks, capacity and rollback. Deployment guide links the receipt. Root
README punctuation was corrected. Runtime code is unchanged by this phase.

## Documentation updated

`docs/SURREY_V02_RELEASE_2026-10-30.md`, `docs/DEPLOYMENT.md`, and `README.md`.
Older release records retain their dated meaning; the new record explains which
older runtime was archived and which full runtime is now the immediate rollback.

## Git diff summary

3 files changed, 89 insertions and 5 deletions in the release documentation commit.
No runtime, geographic, dependency or infrastructure diff in that commit.

## Verification

Successful exact-source Linux workflow and artifact 13003215702. Runtime tar
SHA-256 `75a31ab792fed582682ad1d18ef366be3be9dbcd2aa8716e80ecb0947c9cb69d`.
All seven guarded preparation steps passed; minima 250.5 MiB available memory and
6.522 GiB free disk. Twenty-five activation samples retained all peer/config guards.

Staging passed 12 baseline routes, eight protected host/path checks, 124 tutorial
IDs, 24 assets, native Sharp, Motion/Ask/Trade and unchanged Vancouver. Apex/www
passed 13 routes each, protected content/assets, two Surrey and six Vancouver
asset hashes per host, sitemap/Labs entries, access redirect and image optimization.

Live browser passed aerial controls, exact marker/return, waypoint, ground resume
and reload/Continue. One canvas, no errors, warm 60 fps at adaptive DPR 0.75;
physical-device and long-session performance are not claimed. Local acceptance
already completed both cases, three street encounters and save/reload with $158,
plus 61 tests, both builds, lint/types and clean production audit (journal 124).
Owned local servers were stopped; live screenshot/artifacts/receipts are retained
outside Git. No secret or raw infrastructure log is committed.

## Repository state after implementation commit

Branch `codex/surrey-adventure-v02`, release documentation `4492652eaacafd03aa7c211185e363b9b161ef83`.
Production remains exactly at tested `52f4451`; later documentation does not imply
a new runtime build. Final docs/journal will be pushed normally to branch and main.

## Implementation commits

- `b171541` — feat(surrey): add aerial exploration and Dangerous Streets V0.2
- `4492652eaacafd03aa7c211185e363b9b161ef83` — docs(release): record Surrey V0.2 deployment and full rollback

Implementation journal `52f4451` is the tested/deployed source head.

## Archive commit

`docs(journal): record Surrey V0.2 guarded production release`

## Lessons learned

Shared hardlinks can hide whether retiring an old runtime actually frees capacity;
verify full archives and disk recovery. Keep exact tested source distinct from
later receipt-only commits. Coordinate shared main/journal numbering before parallel
navigation work. Adaptive quality and viewport testing do not replace phone acceptance.

## Follow-up ideas

Physical iOS/Android testing; richer recurring-character errands/schedules; verified
paths/terrain/transit before expanding geography. Optional navigation grouping is
owned by the separately requested GIS Apps task, not silently added to this release.
