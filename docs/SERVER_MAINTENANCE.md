# Server storage maintenance

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
