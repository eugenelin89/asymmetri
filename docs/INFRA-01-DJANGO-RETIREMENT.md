# INFRA-01 — Django retirement amendment

> **Current status (October 9, 2026): migration cancelled/deferred; snapshot deleted;
> cleanup complete.** The [cancellation record](INFRA-01-CANCELLATION.md) supersedes
> all execution and snapshot-retention instructions below. Django retirement was
> evaluated but not executed; services/data remain intact. The following text is
> retained historical phase evidence, including failed attempts and unperformed gates.
> It is not an active plan or authority to rebuild, retire, or start INFRA-02.

## Historical preparation record — superseded

Updated 2026-10-09. **Preparation complete for owner review; retirement not executed.**
This changes the existing [migration plan](INFRA-01-UBUNTU-MIGRATION.md), not its
milestone. The owner selected archival retirement instead of running Django on
Ubuntu 24.04. Public behavior, live services, production data, Nginx and DNS remain
unchanged until the retirement approach and service changes are approved. Rebuild
still requires separate approval. INFRA-02 remains unstarted.

## Dependencies and preservation decision

| Component | Evidence | Target disposition |
| --- | --- | --- |
| Active peer Django, two hostnames | Django 5.2.9/Gunicorn 23.0.0; SQLite; one worker; enabled service **and socket** | Archive and retire after approval; no target application Python environment |
| Dormant draft | Private settings select PostgreSQL; generic Gunicorn service/socket are inactive and disabled | Preserve source/settings and keep inactive; do not revive |
| PostgreSQL 14 | Cleanly stopped cluster, no listener or running process; linked to dormant draft by settings | Preserve **entire cluster**, configuration and TLS supplement; no target PG service installation |
| Two other retained Django projects | Settings select SQLite; no observed active service/cron consumer | Preserve as historical files; do not install or start their runtimes |
| Next and static sites | Separate Node/Nginx request paths; no observed dependency on Django/PG | Continue migration acceptance, including Motion URLs |
| Shared application owner | Next also runs as `django-user`; Nginx uses shared `www-data` group | Preserve users, UID/GID, permissions and deployment helper; do not delete an account because of its name |
| OS Python | Used by operating-system administration tools | Keep Ubuntu system Python and its dependencies; retirement removes only application runtime requirements |

Read-only inspection covered running services/processes/listeners, service dependency
properties, custom systemd units, cron directories/user crontabs, Nginx references
and retained application settings. No other active consumer of these application
runtimes was found. There is no custom cron reference requiring either app. This is
observed dependency evidence, not proof about undocumented external clients.

The active service requires its socket; stopping the service alone can allow socket
activation to restart it. The generic dormant service and socket must remain disabled.
PostgreSQL settings establish a draft dependency, **not ownership of every database
inside the cluster**. No database was dropped or selectively omitted, and the real
cluster was not started to inspect private records.

## Off-server preservation evidence

All sensitive material stays in the owner's restricted Mac recovery store, outside
Git. The private recovery index maps the exact hostnames, source revision, modified
settings hash, paths, service configuration, package pins, ownership, encrypted
archive names and trusted checksums. Copies are independent of the production disk;
separate-device custody is still outstanding.

| Data | Verified evidence | Remaining obligation |
| --- | --- | --- |
| Active source/settings/static | All 216 current non-database application files match archived content, sizes, modes and numeric owner metadata; modified settings overlay preserved | Repeat change comparison at retirement; source snapshot excludes `.git` history and rebuildable virtualenv |
| SQLite | Consistent backup via SQLite backup API; decrypted independent copy; integrity `ok`, zero FK failures and canonical schema/data comparison; actual copied data passes 10 read-only Django journeys on Mac | Historical recovery point while service remains writable; fence/drain writes and capture a **final** consistent backup before retirement |
| Media/uploads | No `MEDIA_ROOT`/`MEDIA_URL`, upload model fields, external storage backend or application filesystem symlink found; both `static/` and `staticfiles/` included | Recheck for new upload/configuration changes at final freeze; absence of a configured media directory is recorded, not silently skipped |
| Runtime/recovery information | Exact source identity, modified settings, migrations, nine installed package pins, service/socket and Nginx/TLS configurations retained | Original setuptools 59.6.0 is incompatible with Python 3.12; tested recovery-only adaptation to 68.2.2 documented below |
| Dormant PG | 2,404 archive entries including 2,369 regular files; source content/modes/owners match; clean control state; WAL/control/data/config included, no external tablespaces or symlinks found | Real-cluster Linux runtime recovery remains unperformed; keep full archive and snapshot, do not infer a logical database check |
| PG TLS dependency | Supplemental encrypted certificate/key archive verified; certificate and key public components match; independent same-Mac copy verified | Preserve with cluster because original selected archive omitted referenced `/etc/ssl` files |
| Other retained environments | Case-sensitive encrypted Mac volume restored 42,605 members, preserving 66 case-folding collisions, content, hardlinks/symlinks and non-symlink modes | Numeric Linux owners were audited, not applied to private Mac restore; synthetic Linux ownership test is separate evidence |

Encryption is AES-256-CBC with PBKDF2-SHA256/600,000 iterations. Verify the trusted
ciphertext SHA-256 **before** decrypting; CBC alone is not authenticated. Protect
keys and checksum records independently. Do not send any private archive, settings,
real SQLite/PG data or TLS material to BotSquad. Synthetic Linux tests contain only
reviewed source, generated settings and generated records.

## Recovery instructions for retired material

1. Obtain the encrypted exports, independently trusted manifests/checksums and key
   from the private operator index. Confirm the requested recovery point; final
   retirement exports supersede the current historical SQLite copy only after
   verification. Keep older copies until explicit retention decisions.
2. Use a new restricted, case-sensitive filesystem with enough space. Verify all
   hashes, decrypt and restore using the [operator helper](../ops/infra/README.md).
   Apply numeric ownership only on a suitably isolated Linux environment; never
   overlay archived `/etc`, libraries or virtualenvs onto a running system.
3. For Django, restore source plus modified settings, static files and SQLite.
   Recreate an isolated Python environment using the private exact package list.
   Python 3.12 with Django 5.2.9/Gunicorn 23.0.0 was exercised; use the explicitly
   tested setuptools 68.2.2 recovery adaptation instead of the failing 59.6.0 pin.
   Disable outbound networking, email/webhooks and schedules; use copied data.
4. Check SQLite integrity/FKs, Django checks and migration **plan** first. Do not
   apply schema migrations to historical data. Ten actual-data read journeys passed
   on macOS; generated-data Linux tests additionally passed migrations, CSRF,
   registration and authenticated admin reads. These are different evidence levels.
5. PG cold restore requires compatible **major 14**, archived cluster configuration,
   correct numeric ownership, recreated runtime socket/PID directories and the TLS
   supplement or a deliberately isolated TLS override. Test with no external
   listener, review extensions/collations, validate databases and make logical
   exports before any future supported-version migration. Synthetic PG14.24 cold
   copy, checksums, logical comparison and structural checks passed; the **real**
   cluster did not undergo that test. PG14 support ends November 12, 2026.
   [PostgreSQL version policy](https://www.postgresql.org/support/versioning/).
6. A future public reactivation needs separate approval, restored-domain/TLS review,
   current security maintenance and final data selection. Archived credentials and
   the old snapshot are recovery evidence, not permission to resume old integrations.

## Recommended domain behavior — approval pending

Keep both former Django domain names, all DNS records, HTTP-to-HTTPS behavior and
certificate renewal. Recommend a small static HTML retirement notice served by
Nginx with **HTTP 410 Gone** for the former application paths. This gives visitors
an explanation and indicates deliberate permanent removal to automated clients. [HTTP
410 semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-410-gone).
No form, login, tracking, database or Python process is needed.

Proposed visible text:

> This website has been retired.
>
> Its pages and registration services are no longer available.

GET and HEAD requests, including former admin/course/registration/static paths,
would receive 410. Keep any required ACME challenge handler separate and validate
renewal. Do not redirect visitors to an unrelated website or disclose archived data.
An alternative is a 200-status static landing page if the owner wants an ongoing
public presence, but that should be an explicit content/status decision.

The dormant draft currently returns 502. Changing its domain to 410 is a **separate
optional behavior approval**, not implied by archiving PG. Until then retain its
recorded 502 response. The two already-retired relay domains remain 410, and the
other ten named hosts plus default host keep their existing accepted behavior.

## Precise proposed service changes — NOT EXECUTED

The private command sheet contains exact domain and configuration paths. This is
one reviewable change set; approval must specify its timing as well as the response.

1. Recheck the current source/configuration and service identities. Preserve original
   vhost, service and socket files and verify the existing encrypted recovery copies.
2. In the approved window, fence new application writes and drain current requests.
   Stop the active peer socket and Gunicorn service together, preventing socket
   reactivation. Capture a final SQLite backup and any changed source/settings/static
   files, verify them off-server, and record the final recovery timestamp. If this
   fails, restore the old routing and resume the original service; do not rebuild.
3. Install the approved notice outside application/private archive directories.
   Change **only the two former Django hostnames' locations** to serve the 410 notice,
   retaining their TLS and HTTP redirect/challenge configuration. Run `nginx -t`,
   then reload Nginx and verify both hosts plus all unrelated baseline requests.
4. Disable both the active peer socket and service (exact unit names in the private command sheet) after
   successful retirement acceptance. Verify neither is active/enabled and no
   Gunicorn worker or socket can serve the old site. Leave the disabled dormant
   `gunicorn.service`/`gunicorn.socket` and inactive PostgreSQL cluster unchanged.
5. Preserve every source/data/configuration directory, shared user/group and
   certificate. No package purge, database deletion, `rm` of production directories,
   SSH/firewall change or DNS edit is part of retirement.
6. For the separately approved Ubuntu rebuild, omit application Django/Gunicorn/
   virtualenv and PostgreSQL installation/activation. Restore Next, Nginx, static
   sites, notice, TLS renewal, shared identities and operating-system tools. Keep
   historical files available in protected non-served storage/off-server archives.
7. Rollback before rebuild: restore the saved two-host routing, re-enable/start
   the original socket/service, reload only after `nginx -t`, then verify the old
   site and SQLite recovery point. After erasure, recovery instead requires the
   retained snapshot or independently restored files; it is not an instant toggle.

The static notice and a location-level Nginx fragment are prepared in the private
approval sheet; no production file was installed. The fragment sends `Cache-Control:
no-store` during initial retirement verification so rollback is not obscured by cached
410 responses.
Do not restart Next or alter unrelated vhosts as part of this change set.

## Resource and acceptance changes

A 30.49-second production sample found Django/Gunicorn at 35.81 MiB cgroup RAM and
19.68 MiB swap, using only 5.272 ms CPU during the sample. Retirement should remove
roughly **36 MiB charged RAM and 20 MiB swap allocations**, not 56 MiB RAM. CPU savings
in this idle window are negligible; peak traffic savings were not measured. PG was
already stopped, so no current PG RAM/CPU saving is demonstrated.

The active virtualenv occupies 66.64 MiB; installed PG/libpq package size metadata
totals about 47.93 MiB. Omitting these on a fresh target avoids roughly **115 MiB of
reinstallable runtime footprint**, before dependency overlap or Ubuntu version
changes. The cold cluster is 94.69 MiB and remains preservation material, not a
cleanup target. Active and dormant project directories total about 316.91 MiB,
including source/data/Git/dependencies; do not add those totals to the runtime
estimate. **Archiving alone frees no production disk space.**

The 956.93 MiB visible host retained 413.71–413.93 MiB available during the idle
sample, with no sampled swap I/O or OOM. Existing **1 GB RAM/1 vCPU/25 GB disk is a
reasonable provisional target for Next + Nginx + static sites**, retaining 2 GiB
swap and serial builds. A short idle sample is not peak or build acceptance; the
[validation ledger](INFRA-01-VALIDATION.md) records bounded tests and their limits.
No resize or additional paid hosting is proposed.

Operationally this removes one active application/service/socket pair, its Python
package maintenance and SQLite write path and ongoing application-data backup obligation from the future live stack.
It also avoids PG14 installation, extension/collation recovery and an imminent
supported-major upgrade for an unused database. Archives still need integrity,
access and retention management. Shared TLS renewals and OS Python remain.

INFRA-01 now requires verified **archival preservation** of retired Django/PG data,
final frozen exports, approved retirement response tests and continuing recovery
instructions. Full private Django/Gunicorn/PG runtime restoration is no longer an
active-service migration requirement. Unperformed real PG runtime recovery remains
an explicit archival limitation. Every surviving-site, TLS/renewal, access/bootstrap,
1 GB capacity, snapshot/rollback and post-rebuild observation/cleanup gate remains.
