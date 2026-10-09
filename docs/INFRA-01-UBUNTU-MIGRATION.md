# INFRA-01 — Ubuntu LTS migration and existing-site acceptance

Updated: 2026-10-09. **Prepared; resource and later migration approvals required.**
Production remains on the original Ubuntu 22.10 Droplet. No replacement, snapshot,
DNS change, routing change, restart, release, or receiver activation was performed.
See [validation](INFRA-01-VALIDATION.md) for measured evidence and its limits.

## Authority and gates

The owner selected INFRA-01 only: inventory, baselines, backup preparation,
compatibility investigation, migration engineering, documentation and safe work on
existing resources. This is not a BotSquad HQ or runtime-worker administration task.

| Gate | Current state | Required before crossing |
| --- | --- | --- |
| New paid resources | Not approved; none created | Exact size/image/region, recurring cost, overlap and backup budget approved |
| Production traffic | Not approved; unchanged | Every-site staging acceptance, recoverability and explicit cutover approval |
| Interruption | Not approved; services left running | Agreed write-freeze/downtime scope and window for the peer mutable application |
| Destruction | Not approved; original host/data/rollback retained | Separate owner decision, including post-cutover writes and retention |
| Cloud recovery | SSH works; authenticated cloud console not verified | Owner signs into DigitalOcean; confirm emergency console and independent recovery |

Do not interpret approved SSH/root access as approval for these gates. Do not use
an unsupported direct 22.10-to-24.04 upgrade or boot a restored 22.10 image as the
replacement LTS host. Do not install/activate INV-02, start INFRA-02, generate its
prompt, begin INV-03, or modify HQ. Market-data spending remains US$0 under Decision
029; hosting requires its own approval.

## Current inventory

Private operator evidence uses stable site aliases below. Exact hostnames, IPs,
paths, configuration inventories, certificate fingerprints and DNS answers are in
the owner's restricted administrator evidence directory, outside Git. Public source
does not contain unrelated application settings, visitor data or credentials.

| Host group | Named hosts | Current behavior and migration responsibility |
| --- | ---: | --- |
| Asymmetri apex and www | 2 | Next.js on loopback 3001; all nine pages, robots and sitemap 200; preserve Motion resources |
| Peer active Django site, apex and www | 2 | Homepage 200; admin requires login redirect; SQLite and local settings overlay must survive |
| Peer static portfolio, apex and www | 2 | Static 200; preserve exact deployed files and canonical behavior |
| Peer static utility subdomains | 5 | Static 200; preserve HTML/meta refresh and destinations as well as HTTP behavior |
| Peer static research site | 1 | Static application 200; preserve deployed assets and separately retained source |
| Peer inactive draft | 1 | Existing 502 from absent upstream; retain source/data/configuration, do not revive it implicitly |
| Retired relays | 2 | HTTPS 410 including health route; preserve retirement and certificates |
| Default virtual host | Unnamed | HTTP default-server static root; retain default-host behavior |

There are **13 enabled site configuration files and 25 server blocks**, serving
15 named hosts. Named HTTP roots redirect to HTTPS. Nginx serves ports 80/443 on
IPv4/IPv6; SSH listens on 22. The only application TCP listener is loopback 3001;
the active Django application uses a Unix socket. No public database listener was
observed. No PHP service or active container workload was found; installed LXD has
an empty instance list. Historical packages/directories are not deletion candidates.

| Layer | Observed state |
| --- | --- |
| OS/kernel/architecture | Ubuntu 22.10 Kinetic; 5.19.0-46-generic; x86_64 |
| Region/CPU | SFO3 from provider metadata; 1 shared DO-Regular vCPU |
| Memory sample | 956 MiB visible; approximately 347 MiB used, 424 MiB available |
| Swap | 2 GiB; approximately 122 MiB used; no swap-in/out in short sample |
| Root storage | Approximately 25 GiB ext4; 44% used, approximately 13.6 GiB available; 9% inodes used |
| Mounts/boot | Root disk and EFI partition, swapfile; no extra mounted data volume found |
| Time | Etc/UTC; NTP active and synchronized |
| Node/npm | 22.23.1 / 10.9.8 |
| Python/web | Python 3.10.7; Django 5.2.9; Gunicorn 23.0.0; Nginx 1.22.0 |
| Databases | Active peer SQLite; retained inactive PostgreSQL 14 cluster, clean shutdown; legacy SQLite also retained |
| APT | Kinetic old-releases; NodeSource 22 and two DigitalOcean agent sources; package/pin inventory retained privately |
| Firewall/access | UFW deny incoming; SSH/HTTP/HTTPS allowed for v4/v6; password and keyboard-interactive SSH disabled |
| Services | Next and peer Gunicorn active; Nginx active; no failed units at inspection; dormant draft/database remain inactive |
| Scheduled work | Certbot snap renewal timer plus OS timers/cron; no application backup scheduler identified |
| TLS | Seven retained lineages, six used by named site groups; Nginx authenticator/installer; earliest used expiry November 10, 2026 |

Root public-key login and forwarding remain enabled. Shared application ownership
and the peer service's weaker process isolation are existing risks, not silently
changed here. Asymmetri has NoNewPrivileges and PrivateTmp. Both operational SSH
aliases and the scoped deployment helper were verified. Keep private SSH keys on
their existing systems; only authorized public keys are migration material.

No kernel OOM match appeared in the retained 30-day query, but cleanup shortened
log retention. This and a short idle utilization sample do not prove peak capacity.
Other retained user projects/Conda environments exist outside active web roots;
inventory and preserve them without reactivating them. The current host remains
their recovery environment pending complete retention/restore acceptance.

## Source and runtime preservation

Production Asymmetri is clean `main` at
`745a92c676bcbe85c3aa675a1099d26321f1c1e2`, build `Ic-zxi4WHpmgjiSDnsJCw`,
Next 16.3.6. The immediate predecessor is
`fd65c46c16588903bb74198f1988cafff8d8b20c`, build `3sb31Jjj0R0QRPODTe0e_`.
Repository preparation began at `66a882d3f2c95deb1ac1a2808c36b4627742586b`.
GitHub main contains Next 16.3.8 and the disabled receiver; it is **not** the
approved replacement website release. Do not run a floating `git pull` on the
candidate or copy this repository's new receiver into service configuration.

Prepare the candidate from the exact live SHA and lockfile, installing dependencies
on the new OS as the application owner. Do not copy native node_modules or Python
virtual environments as the new runtime. Preserve generated current output for
recovery, but rebuild and test a candidate before use. A rebuilt build ID may
differ: compare public content, route/asset contracts and exact source identity,
and record both build IDs. Never bless unexpected changes by rewriting a baseline.

The peer Django checkout has a modified settings file. Its source SHA and overlay
hash belong in the private inventory; migrating its remote branch alone loses
production configuration. Preserve its SQLite, settings, static/media files and
ownership separately from rebuildable dependencies. No data/schema migration is
authorized merely by installing Python.

The known Next security patch remains undeployed. Inspect the exact patch separately
and record an explicitly chosen candidate if remediation must accompany migration;
do not silently substitute newer main. A vulnerable baseline is evidence, not a
security acceptance waiver.

## Backup and restoration plan

The existing single-site rollback on the same disk is not a whole-server backup.
This preparation adds encrypted off-server application/configuration exports and
an isolated SQLite restore; precise completion and limitations are in validation.

Backup classes must remain distinct:

1. Exact Git source plus **production-only overlays**, static files and retained
   user projects; current/predecessor executable releases for immediate recovery.
2. App-consistent SQLite snapshot using Python's SQLite backup API from a read-only
   source connection. Validate integrity, foreign keys, deterministic schema/data
   digest and isolated application startup. A filesystem copy of a live database
   is not sufficient. [SQLite backup API](https://www.sqlite.org/backup.html).
3. Dormant PostgreSQL 14: prove no postmaster and clean shutdown, then preserve the
   whole cluster/configuration/tablespaces. It must be restored on an isolated,
   compatible PostgreSQL 14 runtime before any conversion. A raw cluster cannot
   be attached to Ubuntu's different default major version. Preserve dormant
   state on the candidate. [PostgreSQL filesystem backup](https://www.postgresql.org/docs/14/backup-file.html).
   PostgreSQL 14 reaches upstream end of support on November 12, 2026; this isolated
   recovery rehearsal does not authorize reactivation. Later activation requires a
   supported-version decision. [Version policy](https://www.postgresql.org/support/versioning/).
4. Nginx, systemd, schedules, UID/GID/public-key mappings, firewall/network rules,
   access helpers, log rotation and necessary environment files. Reconstruct the
   LTS configuration deliberately; never overlay old `/etc`, APT sources, kernels
   or system libraries onto it.
5. TLS/ACME keys and renewal configuration transferred only through encrypted
   private backup/SSH channels, preserving root ownership and restrictive modes.
   Never commit them, password databases, environment values or SSH private keys.
6. Separately approved original-host snapshot as additional rollback protection.
   A live snapshot is not an application-consistency substitute. A powered-down
   snapshot needs interruption approval; old-OS snapshot restore is only recovery.

Local administrator storage is mode 0700, evidence/archive/key files 0600. The
export encryption uses AES-256-CBC/PBKDF2-SHA256, 600,000 iterations and a random
recovery passphrase; ciphertext SHA-256 receipts detect accidental corruption.
CBC is not authenticated encryption: verify a trusted independent digest before
decrypting, do not accept an archive and replacement checksum from an untrusted
source. Move the recovery passphrase and trusted checksums to owner-controlled
separate recovery custody before cutover; current same-device custody is a limit.
No private values are displayed or stored in public Git. Incomplete exports are excluded from acceptance; a known missing optional path
was resolved only through independent complete-membership and source-hash checks
recorded in validation.

During final synchronization, explicitly approve freezing peer Django writes,
drain in-flight requests and stop its writers in the agreed window. Keep both
candidate and old clone unable to write until the final SQLite+media snapshot has
been verified and exactly one host is selected as writer. Inventory scheduled
writers too. If caches still send requests to the old host, preserve read-only or
maintenance behavior there, or use a separately approved temporary proxy to the
single authoritative writer. Do not allow independent writable database copies.

## Replacement proposal and cost gate

Prefer fresh **Ubuntu 24.04 LTS amd64** with current security updates. Canonical
lists standard maintenance through May 2029. Ubuntu 26.04 is released and appears
in DigitalOcean's catalog, but a newer Python/system stack adds compatibility work
without evidence of a benefit here. Choosing 24.04 is a compatibility inference,
not proof of staged acceptance. [Ubuntu lifecycle](https://ubuntu.com/about/release-cycle),
[DigitalOcean image catalog](https://docs.digitalocean.com/products/droplets/details/images/).

Propose SFO3 to match the original region. **Actual SFO3 image/size availability
and account entitlement remain unverified** while the cloud console is signed out.
Before purchase inspect the exact distribution image's regions, region/size
availability, minimum disk, image ID and current checkout price in the authenticated
account/API. Do not infer availability solely from the public image catalog.

| Proposed item | Expected incremental cost, USD before taxes/excess usage | State |
| --- | --- | --- |
| Recommended Basic Regular 1 vCPU, 2 GiB, 50 GiB SSD | $12/month cap; $0.01786 hourly equivalent | Approval required; provisional sizing |
| Lower-cost 1 vCPU, 1 GiB, 25 GiB alternative | $6/month cap; $0.00893 hourly equivalent | Keeps current memory constraint; not recommended for builds/concurrent growth |
| Seven / fourteen days of recommended replacement overlap | Approximately $3 / $6, plus the original server's existing charges | Proposed overlap, not an automatic retention/deletion deadline |
| Original-host snapshot | $0.06 per stored GB/month; e.g. 10–25 GB is $0.60–$1.50/month | Size/budget and snapshot consistency/window need approval |
| Volumes, new Reserved IP, managed backup add-on | None proposed | Not authorized |

Sources: [Droplet pricing](https://www.digitalocean.com/pricing/droplets),
[billing rules](https://docs.digitalocean.com/products/droplets/details/pricing/),
[snapshot pricing](https://docs.digitalocean.com/products/snapshots/details/pricing/).
Compute is billed while resources exist, including powered-off Droplets; snapshots
continue billing while retained. Billing has per-second granularity and a monthly
cap; estimates are not an account quote. Existing plan/backups/taxes are not verified.
No billable resource was created. Original-server charges continue; ordinary
transfer usage and any account overage are not verified while signed out.

The 2 GiB recommendation provides more build/runtime room; it is not acceptance of
future receiver load. Retain measured swap/headroom and perform one build at a time.
If the expense is declined, keep production intact, retain these preparations and
seek an existing approved Linux staging resource. There is no approved safe zero-cost
in-place shortcut to a fresh supported host.

## Deterministic staging sequence — not executed

1. Resolve cloud/account/recovery access; approve exact compute and backup costs.
   Record old-host identity, recovery route and evidence checksums privately.
2. Provision a fresh 24.04 image. Verify its SSH host-key fingerprints through the
   authenticated console before recording known-hosts; never disable host checking.
   Apply supported updates and any required reboot on the new host only.
3. Recreate intended application/deployment/admin identities and compatible numeric
   ownership, checking conflicts first. Install reviewed access helpers/sudo rules;
   validate visudo and independently test admin and restricted deployment sessions.
   Confirm console recovery before target firewall or SSH restrictions. Preserve
   the old aliases until deliberate cutover; use a separate candidate alias.
4. Install supported Nginx, compatible Node 22 and Python 3.12/venv dependencies.
   Django 5.2 supports Python 3.12, but exact application/extension behavior still
   needs rehearsal. [Django compatibility](https://docs.djangoproject.com/en/5.2/faq/install/).
   Rebuild from pinned manifests; preserve the peer settings overlay and data.
5. Restore reviewed site definitions, service semantics, static roots, log rotation,
   public authorized keys and required configuration. Maintain only intended public
   22/80/443 exposure; app loopback/Unix socket and disabled services stay private.
   Reconstruct necessary schedules without enabling duplicate external actions.
6. Restore encrypted TLS material securely or use a separately authorized validated
   issuance method. Verify all SANs, full chains, expiry, permissions and renewal
   mapping. Do not run the old host's nginx Certbot dry-run without considering its
   reload behavior. Stage renewal configuration; prove challenges after approved
   routing or approved DNS validation. No `curl -k`/disabled host validation.
7. Start only intended candidate applications with externally effective writes
   disabled. Restore/test SQLite and the retained PG14 cluster in isolation, check
   uploads and owner/mode inventories, then leave the historical draft inactive.
8. Run pinned website checks/build and all controlled-resolution host/route/asset
   comparisons. Use `ops/infra/http-baseline.py` with private manifest/output and
   `--resolve VERIFIED_CANDIDATE_IP --against BASELINE_JSON`; it retains Host/SNI
   and validates TLS. Review known generated build-asset changes explicitly.
9. Check Nginx syntax, systemd units, SSH/sudo boundaries, renewal, no unexpected
   listeners, process errors, disk/RAM/swap and important journeys. Compare browser
   tutorial hashes/original images, navigation, privacy/support and all peer sites.
   Run authenticated read-only application journeys only with existing authorization.
10. Complete every unresolved backup, compatibility and acceptance item in validation.
    Freeze exact candidate identities and request the separate production gate.

## Cutover and rollback — not authorized or executed

DNS inventory found two authoritative provider groups: registrar-servers.com for
Asymmetri and DigitalOcean nameservers for the two peer zones. Relevant published
A/CNAME answers and original TTLs are stored privately. No queried host had an AAAA
answer at inspection. Provider metadata reports no assigned floating IPv4; account
Reserved IP/firewall/volume inventory is still unverified. Do not assume there are
no additional records, cloud firewalls or reserved resources.

Before cutover export all affected authoritative zones through authenticated access,
record old A/AAAA/CNAME/TTL values and preserve MX/TXT/CAA/delegations/unrelated records.
If DNS is chosen, explicitly approve any TTL change, wait at least the prior TTL,
and recheck authoritative and public resolvers. Change only the reviewed records
after final write freeze/sync, both-owner acceptance and explicit traffic approval.
No old/new concurrent writes; no automatic destruction at the end of overlap.

Immediately test the complete baseline externally and on the candidate, plus
process readiness, TLS, private/retired endpoints, database/media integrity, log
errors and capacity. Restore normal TTL only after stability and approval as part
of the traffic change. Observe through the agreed retention window; old-server
power/retention continues until a separate owner decision.

Stop/rollback for SSH lockout, TLS or critical-route failure, persistent new 502/503,
broken peer sites, data loss/corruption, unexpected service exposure, unsafe capacity,
or unresolved writer ownership. **Before new writes**, approved DNS/routing rollback
can restore the exact original destinations and verified original runtime. **After
new writes**, freeze candidate writes, preserve a fresh consistent candidate backup,
reconcile database/media onto the chosen authoritative recovery host, validate it,
then restore routing. Never overwrite newer data with the older snapshot or revert
DNS while assuming new data is disposable. Stop after an uncertain outcome; no
automatic repeated cutover cycles.

INFRA-02 readiness is **not satisfied** until live LTS migration and every existing
site's acceptance are complete. Its receiver deployment/Linux testing remains a
separate owner-selected task and changes no investment feature milestone status.
