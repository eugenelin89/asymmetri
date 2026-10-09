# Prompt 048: Aggressive server disk cleanup

- Date: 2026-10-09
- Scope: deployment
- Goal: Recover server capacity while preserving the live websites and a verified immediate-predecessor rollback.

## Original user request

> can you do an audit of asymmetri server on disk space

After receiving the read-only audit:

> aggressively clean the disk space

## Scope

Storage maintenance on the existing DigitalOcean server through the approved
administrator SSH route. Included obsolete Asymmetri releases/staging copies,
regenerable caches, old logs and one disabled snap revision. Preserved live
applications, other websites, databases, project source/results, installed
application environments, active snaps and swap. No website release, dependency
upgrade, operating-system upgrade or recurring automation was requested or added.

## Decisions

- Treat the second request as authorization to perform the proposed cleanup.
  No repeated permission request was needed for the established server access.
- Account for shared hard links when measuring deployment and snap-cache usage;
  measure actual recovery using filesystem availability before and after work.
- Replace accumulated recovery copies with one complete independent rollback of
  the immediately preceding production release. Verify it before deleting older
  snapshots, including the workspace from which it was assembled.
- Check old Git checkouts for clean source, ancestry and unexpected ignored files;
  check processes, mappings, configurations and mounts before explicit-path removal.
- Preserve active logs. Apply a one-time journal vacuum and remove only old,
  unopened rotated logs plus unused journals from a retired machine identity.
- Keep current-facing recovery instructions accurate while retaining historical
  prompt records and immutable source history.

## Implementation

Recorded a root-only baseline, cleared caches to provide working headroom, and
assembled `/var/www/asymmetri-rollback-20261009-fd65c46` as `django-user`. Its source
is `fd65c46c16588903bb74198f1988cafff8d8b20c` and build is
`3sb31Jjj0R0QRPODTe0e_`. Source/Git archives and the prior production build supplied
the rollback; matching live dependencies were copied independently.

Removed 24 obsolete Asymmetri directories and the old compressed rollback/checksum.
Cleared npm, Node compile and apt caches; trimmed archived journals and numbered
logs older than seven days; removed retired-machine journals from 2022; removed
disabled snapd revision 27738 and unlinked snap download-cache names. The current
revision and hard-linked installed snap files remained intact.

Recovered 13,509,468,160 bytes (approximately 12.58 GiB) net. Available space rose
from approximately 1.05 GiB to 13.63 GiB; disk usage fell from 96% to 44% and inode
usage from 23% to 9%. Exact removal/verification receipts remain root-only under
`/var/backups/asymmetri-disk-cleanup-20261009`.

## Engineering impact

Substantially more deployment headroom, with one independently runnable prior
release retained. Live source, assets, dependencies and build content remained
unchanged; no Asymmetri or Nginx restart was needed. Other hosted-site behavior
retained its baseline, including the unrelated draft site's pre-existing 502.
Older runtime snapshots are no longer locally available, but their checked source
commits remain in current Git history. No persistent retention policy was added.

## Files changed

- Server maintenance guide: current cleanup outcome, scope, rollback identity,
  validation and receipt location.
- Deployment guide: current recovery directory and removal of stale operational
  references to obsolete staging/rollback paths.

## Documentation updated

Both operational guides now describe the actual retained recovery material.
The README already links to the maintenance guide and needed no change. No public
asset, application code, dependency or local command changed.

## Git diff summary

Implementation: 2 files changed, 112 insertions and 13 deletions. Documentation
records server operations and corrects the immediate rollback procedure. This
record is excluded from those totals.

## Verification

- Local `main` was clean and `git pull --ff-only origin main` succeeded before edits.
- Baseline captured disk/inodes, production source/build identity, service process
  identities/start times, configuration hashes and 35 HTTPS responses on 15 hosts.
- Retained rollback: 174 source and 306 Git archive files matched content hashes;
  28,491 dependency files/links and 379 build files/links matched their sources.
  Runtime files had independent inodes, ownership was `django-user`, Git was clean,
  and package manifests matched live production.
- Initial tar comparison flagged synthetic archive ownership and a Git index stat
  refresh. Restoring the archived index and comparing exact contents, with separate
  ownership checks, resolved those expected metadata differences before deletion.
- Rollback's nine pages, robots and sitemap returned 200 from a temporary private
  loopback process; it was stopped after validation.
- After cleanup, all 29,025 checked live source/asset/runtime files and links had
  the identical aggregate content hash. Git metadata and mutable Next cache were
  excluded; clean source SHA and build ID were verified separately.
- All 35 hosted-site responses matched baseline. Public apex and `www` independently
  returned 200. Protected Motion routes passed on both hosts.
- Nginx configuration and Asymmetri/Nginx process identities/start times matched.
  The broad systemd fingerprint changed because Snap removed the obsolete mount
  unit and its two symlinks. Virtually reinserting those exact entries reproduced
  the baseline hash, proving that the configuration change was limited to them.
- Final capacity and inode checks passed; no significant deleted-open disk files
  remained. Journal usage was approximately 109.5 MiB.
- `git diff --check` passed. Application builds, dependency installs and npm audit
  were not rerun for documentation-only repository changes and server file cleanup;
  the production content hashes and route checks directly validate the affected work.

## Repository state after implementation commit

Local branch `main` was clean and one implementation commit ahead of `origin/main`.
Production remained on clean `745a92c676bcbe85c3aa675a1099d26321f1c1e2`, build
`Ic-zxi4WHpmgjiSDnsJCw`; these documentation commits are not a production deployment.
The implementation and journal are to be pushed together under the standing workflow.

## Implementation commits

- `e1f614f4afd53f97e199ff06e797fa5c8c48c38f` — `docs: record aggressive server cleanup and current rollback`

## Archive commit

`docs: journal aggressive server disk cleanup`

## Lessons learned

Repeated retained dependency trees can exhaust a small server even when the live
site is modest. Hard-link-aware accounting prevents inflated recovery estimates.
Verify an independent runnable rollback before removing the workspace containing
the previous build, and distinguish metadata-only comparison differences from
content failures. Historical receipts do not guarantee that a path still exists.

## Follow-up ideas

Agree on bounded future release retention and persistent journal limits in a
separate change; neither is installed by this cleanup.
