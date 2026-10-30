# Prompt 138: Vancouver V0.5 guarded production release

- Date: 2026-10-30
- Scope: deployment
- Goal: Activate the validated Vancouver V0.5 runtime while preserving Surrey, protected products and complete rollback.

## Original user request

> I am going to bed. You are authorized to make decisions. Please make sure it gets deployed so in the morning i can share this with friends.

> Proceed autonomously with implementation, testing and deployment if safe.

The complete V0.5 brief requires an independent Linux candidate, exact build
identity/checksums, unchanged production resource floors, retained recovery,
protected-route and peer-service verification, serialized GIS project deployment
and a truthful final report. Journal 137 records the implementation and mobile
steering. User phone screenshots are diagnostic evidence, not public assets.

## Scope

The existing Asymmetri website runtime only, with reviewed lossless retention of
one older inactive website runtime to create staging capacity. No new service,
OS/runtime upgrade, proxy/TLS/DNS change, receiver mutation or peer deployment.

## Decisions

Surrey completed its release first; GIS/Richmond confirmed Vancouver's exclusive
window and journal IDs. Preserve deployed Surrey V0.3. Use exact source `44654b3`
from the successful existing Linux workflow. Retire only the older `e909c8d`
runtime after owner-held archival, matching checksum, gzip verification, full
remote tar comparison, clean-source and no-reference/no-open-file checks.
Keep the live runtime and its immediate rollback throughout.

## Implementation

Built independently on GitHub Ubuntu 24.04/Node 22.23.1, verified artifact ZIP and
tar, cloned source as django-user and streamed the verified runtime into isolated
staging. The private candidate passed route/assets/content/native image checks.
A guarded whole-tree swap activated V0.5 at 21:23:49 UTC; automatic rollback was
armed and not needed. Public/browser/peer checks passed. Complete prior runtime
`248c0a5` / `VnQohiF4lOLKTwiRVOpzn` is retained at
`/var/www/asymmetri-rollback-before-vancouver-v05-20261030`.

## Engineering impact

V0.5 phone play and experimental controls are public at the existing city URL.
All previous Vancouver/Surrey datasets remain. Immediate recovery includes source,
Linux dependencies and build. Five peer services, 55 configuration hashes and
13 virtual-host responses are unchanged. No reduced safety threshold was used.

## Files changed

The Vancouver V0.5 release report gains exact runtime identity, guarded capacity,
public acceptance and recovery evidence. The deployment guide links the current
receipt. Operational scripts, artifacts, logs and private screenshots stay outside Git.

## Documentation updated

`docs/VANCOUVER_V05_RELEASE_2026-10-30.md` and `docs/DEPLOYMENT.md`. The source
report preserves mixed manual results and unperformed physical-mobile tests.

## Git diff summary

The release receipt implementation changes two files, 90 insertions and six
deletions. This journal is excluded from its own implementation statistics.

## Verification

Local integrated: Vancouver 59, Surrey 35 and investment seven tests pass;
check, production audit and both builds pass. Linux job 41129619738 succeeded.
Deployed source `44654b31afc61a17667c3fff48f88bc5094a2a3d`, build
`em5HpR-sbeh857iO3MUWB`. Runtime tar SHA-256
`16c313d147523793a53a0d1f428c5e1577b5502b0843cf248895699353eb4ba2`
matched on the server. Native Sharp returned a valid PNG.

Candidate checks: 15 routes, eight protected host/path checks, 124 tutorial IDs,
24 tutorial assets, all Vancouver snapshots, Surrey snapshots and unchanged
Surrey main content. Public apex/www each passed 14 routes and protected content
comparisons, plus 38 redirect/data/route checks. Live CSS 390×844 play had no
overflow, acceleration/Menu pause/close worked, and application errors were absent.
Simulator results remain distinct from hardware acceptance.

Five preparation guards passed, minimum available memory 217.2 MiB and free disk
6.3586 GiB. Six activation samples passed. Final website active/running/enabled,
zero restarts, zero post-activation errors, 368.96 MiB available and 6.3505 GiB
free. Expected prior-process exit 143 is recorded separately. Immediate and
required earlier rollbacks remain complete. No live rollback drill was performed.

## Repository state after implementation commit

Main, receipt commit `b6d588fa4af20312accc0cffa97eae84675468a1`, clean before this
journal, one documentation commit ahead of origin/main `44654b3`. Deployment
source remains `44654b3`; receipt and journal are documentation-only. Normal push
follows, then Richmond receives the serialized release window.

## Implementation commits

- `53fe7545ba05ffde8df5c5509a477729839a380e` — V0.5 implementation; archived in journal 137.
- `b6d588fa4af20312accc0cffa97eae84675468a1` — Production release and rollback evidence.

## Archive commit

`Archive Vancouver V0.5 production release verification`

## Lessons learned

Full verified archival can recover capacity without discarding recovery evidence.
Whole-runtime swaps keep exact Linux build identity reviewable. Good mobile layout
can ship while handling measurements and real bridge reconstruction remain honest
experimental limitations.

## Follow-up ideas

Physical iOS/Android multitouch, matched human driving trials, close-building
camera clearance and verified datum-consistent Cambie surface/approach data.
