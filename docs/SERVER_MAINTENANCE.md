# Server storage maintenance

## October 9, 2026 INFRA-01 same-Droplet continuation

The owner superseded the replacement-host proposal with a clean Ubuntu 24.04 rebuild
of the existing Droplet, preserving its identity/IP and DNS. Production has not been
rebuilt or stopped. The approved live snapshot completed at 11.23 GB, approximately
US$0.67/month before tax, within the US$1.50/month ceiling. It remains retained and
is supplemental to independently tested encrypted exports.

A same-disk rebuild erases both the current release and the rollback directory
listed below. Neither can be treated as an available old-host fallback afterward.
Use the [revised runbook](INFRA-01-UBUNTU-MIGRATION.md) and
[actual validation record](INFRA-01-VALIDATION.md) for recovery gates, Linux rehearsal,
write freeze, snapshot restoration and mandatory post-acceptance snapshot deletion.
No new cleanup of the production filesystem, service activation or INFRA-02 work
is authorized by these preparations. Historical cleanup evidence below is unchanged.

## October 9, 2026 INFRA-01 preparation

A later [read-only infrastructure inventory](INFRA-01-UBUNTU-MIGRATION.md) and
[backup/acceptance record](INFRA-01-VALIDATION.md) reconfirm the original Ubuntu
22.10 host, approximately 44% disk usage, current source/build and all hosted-site
baselines. Encrypted off-server preparation is distinct from the cleanup below.
No additional cleanup, application upgrade, restart, DNS change, purchase or
cutover was performed. The original Droplet and predecessor rollback remain.

## October 9, 2026 cleanup

After a read-only audit, the owner requested aggressive disk cleanup. The root
filesystem was 96% full, with 1.05 GiB available. Cleanup recovered approximately
12.58 GiB net, leaving 13.63 GiB available and 44% usage. Inode usage fell from
23% to 9%. These are measured results, not a recurring capacity guarantee.

This was server maintenance through the existing administrator SSH route, not a
website deployment. The Asymmetri and Nginx processes were not restarted.

### Removed and preserved

- Removed 24 obsolete Asymmetri checkout, rollback and staging directories under
  `/var/www` and `/var/tmp`, plus the September 28 compressed rollback and its
  checksum. This includes the old source-only `asymmetri-next` checkout. Existing
  Git checkouts were clean, their commits were ancestors of live production, and
  their ignored files were generated builds, dependencies or TypeScript caches.
  Running process references, memory mappings, service/Nginx/cron configurations
  and nested mounts were checked before deletion.
- Preserved the current application and assembled one complete, independent
  immediate-predecessor rollback before removing older recovery material. Shared
  dependency hard links were accounted for; deletion unlinked obsolete copies
  without modifying live file contents.
- Cleared npm download caches, the unused Node compile cache, and apt downloads
  and regenerable package caches. Active installed application dependencies and
  Python/Conda environments were preserved.
- Rotated journals and applied a one-time 128 MiB / seven-day vacuum, removed
  rotated numbered logs older than seven days that were not open, and removed
  unused 2022 journals belonging to a retired machine identity. Current journal
  usage was approximately 109.5 MiB afterward. No persistent journal limit or
  automatic cleanup schedule was installed.
- Removed disabled snapd revision 27738 using Snap's package command and unlinked
  download-cache entries. Current revisions and seed/application data remain.
  Most snap cache entries shared hard links with installed snaps, so their apparent
  sizes were not counted as additional reclaimed capacity.
- Preserved other websites, project source/results, databases, the active 2 GiB
  swap file, installed operating-system packages other than the disabled snap
  revision, and earlier root-only maintenance receipts.

### Current recovery directory

The retained complete rollback is
`/var/www/asymmetri-rollback-20261009-fd65c46`, owned by `django-user`:

- Source: `fd65c46c16588903bb74198f1988cafff8d8b20c`.
- Build: `3sb31Jjj0R0QRPODTe0e_`.
- Source/public files and Git metadata were restored from the immediate prior
  release archives; the prior production build and matching installed dependencies
  were copied independently. No dependency install or rebuild was needed.
- Content hashes verified all 174 source archive files, 306 Git archive files,
  28,491 dependency files/links and 379 build files/links. File ownership and
  independent runtime inodes were checked, along with clean Git state and matching
  dependency manifests.
- All nine pages, robots and sitemap returned HTTP 200 from a temporary private
  loopback test process. That process was stopped after verification.

The initial tar metadata comparison detected the source archive's synthetic
ownership and a Git index refresh, not source corruption. Verification used exact
file-content comparison after restoring the archived index, plus explicit
application ownership checks. The rollback was validated before any release
directory was deleted.

The old `/var/tmp` rollback workspaces and historical complete snapshots are now
absent. Use the current directory above and the inspection/swap procedure in
[Deployment](DEPLOYMENT.md), checking its identity again before a future recovery.
This cleanup does not authorize automatic deletion of future release snapshots.

### Verification and receipt

Live production remained on clean source
`745a92c676bcbe85c3aa675a1099d26321f1c1e2`, build `Ic-zxi4WHpmgjiSDnsJCw`.
The before/after content digest matched for all 29,025 checked source, asset,
dependency and build files/links; Git metadata and the mutable Next cache
were excluded from that aggregate and source identity was checked separately.

All 35 HTTPS response checks across 15 configured hosts matched their baselines,
including all nine Asymmetri pages, robots and sitemap on both apex and `www`.
Independent public apex/www requests also returned 200. The unrelated draft
site's existing 502 and retired relays' 410 responses were unchanged.

Nginx configuration and live service identities/start times were unchanged. The
systemd directory changed only by Snap removing the obsolete revision's mount
unit and its two enablement symlinks; virtual reinsertion of those three entries
reproduced the original directory checksum. No significant deleted-open disk
files remained.

The root-only receipt directory
`/var/backups/asymmetri-disk-cleanup-20261009` records exact removed paths,
source/build identities, rollback checks, before/after fingerprints, health
responses and final capacity. It contains no copied private keys. Historical
sections below describe earlier states; their retained paths are not current
recovery guarantees.

## September 28, 2026 cleanup

The owner requested an aggressive disk audit and cleanup of the existing
DigitalOcean server, then explicitly authorized removing the April science-fair
training environment, retiring its relay, and deleting the remaining project
source/results after confirming that important code was already on GitHub.
This was server maintenance, not a
website release. Administrator actions used the existing `ssh webadmin` route.

The root filesystem began at 99% usage with approximately 302 MiB available.
Cleanup recovered approximately 12.8 GiB, leaving about 13.1 GiB available and
46% usage. These are observed values, not a recurring capacity guarantee.

### Removed

- Downloaded pip and npm cache contents for the application and project accounts;
  installed dependencies of active websites were preserved.
- Apt package downloads and approximately 790 MiB of archived system journals.
  Journal rotation and a 200 MiB vacuum retained recent logging; the vacuum is
  a one-time operation, not a persistent retention setting. Older journal files
  under a previous machine ID explain why total journals remained about 216 MiB.
- Generated `node_modules` and `.next` from the obsolete July checkout at
  `/var/www/asymmetri-next`. Its clean source was an ancestor of live production.
- Generated dependencies and `previous-next` from the obsolete September staging
  workspace `/var/tmp/asymmetri-rel13.f8Ydiq`. Its dependency files were hard-linked
  to the retained rollback; unlinking the staging paths preserved rollback files.
- Conda download archives, a confirmed interrupted 2023 package download, and
  Node compile-cache files older than seven days. Installed Conda environments
  and extracted package directories were preserved.
- Eight disabled snap revisions and their subsequently unreferenced download
  cache files. Current revisions, seed data, and application data were preserved.
- The retired science-fair project's 5.3 GiB Python environment at
  `/home/django-user/swarm_robotics/venv`, after stopping its relay process.
- At the owner's subsequent explicit request, the remaining 874 MiB project at
  `/home/django-user/swarm_robotics`: local Git history, checkpoints, training runs,
  source, documentation, and graphs. No remaining process references were found.

### Relay retirement and project removal

The relay was a manually launched Python process, not a dedicated systemd service.
No matching automatic startup entry was found in the inspected systemd, cron,
rc.local, or application-user configuration. Its code passed messages between
robots and Mission Control using standard-library HTTP handlers and memory queues.

The two relay virtual hosts, `relay.buildclub.org` and
`relay.christopherlin.ca`, now return HTTP 410 on HTTPS instead of proxying to port
8080. Their TLS configuration and HTTP-to-HTTPS redirects remain. Nginx syntax
validation passed before its graceful reload. Port 8080 is no longer listening.
The Asymmetri and Buildclub application processes were not restarted.

Original relay Nginx configurations and an installed Python package/version
inventory are retained in the root-only directory
`/var/backups/asymmetri-disk-cleanup-20260928`. Restoring research execution would
require recovering source from GitHub, creating a new virtual environment, and
installing appropriate dependencies. No local research backup was made: the owner
explicitly requested deleting the source and results after reviewing their sizes.

Before deletion, the remaining project contained approximately 659 MiB Git history,
106 MiB model checkpoints, 98 MiB training runs, and 11 MiB of other files. The
entire project directory is now absent. The separate static science-fair website
and its source checkout remain; they were outside the requested project removal.

### Website recovery and verification

The live `/var/www/asymmetri` checkout, production build, dependencies, assets,
and source revision were unchanged. The complete immediately preceding release
remains at `/var/www/asymmetri-rollback-20260928-850536c`; its Next executable and
build identity were verified after cleanup. The existing compressed rollback
archive under `/var/tmp` was also preserved. `/var/www/asymmetri-next` now contains
old source only and must not be used as an immediate executable rollback.

All eight Asymmetri pages, robots, and sitemap returned HTTP 200 on apex and www
after maintenance. Other checked hosted sites retained their baseline responses.
The unrelated draft site already returned HTTP 502 before cleanup; it was not
modified or repaired. Both retired relay health URLs returned HTTP 410.

### Future cleanup boundaries

Reinspect sizes, active processes, configuration references, source state, hard
links, and rollback needs before deleting anything. Directory sizes can double
count shared hard links, so use filesystem free-space changes to measure recovery.
Do not delete active website dependencies, production output, databases, research
results, swap, or the retained rollback merely because they are large. No periodic
cleanup job, package upgrade, logging configuration change, or reboot was added.
