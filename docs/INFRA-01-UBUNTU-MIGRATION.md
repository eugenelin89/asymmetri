# INFRA-01 — Same-Droplet Ubuntu LTS rebuild and existing-site acceptance

> **Current status (October 9, 2026): migration cancelled/deferred; snapshot deleted;
> cleanup complete.** The [cancellation record](INFRA-01-CANCELLATION.md) supersedes
> all execution and snapshot-retention instructions below. Django retirement was
> evaluated but not executed; services/data remain intact. The following text is
> retained historical phase evidence, including failed attempts and unperformed gates.
> It is not an active plan or authority to rebuild, retire, or start INFRA-02.

## Historical preparation record — superseded

Updated: 2026-10-09. **Retirement amendment incorporated; recovery partially verified; destructive rebuild not authorized.**
The accepted direction is a clean Ubuntu 24.04 LTS amd64 rebuild of the **existing
Droplet**, retaining its identity, public IP and DNS destinations. Production remains
Ubuntu 22.10. The owner now selects [Django retirement and PG archival
preservation](INFRA-01-DJANGO-RETIREMENT.md), with domain behavior and service changes
awaiting approval. [Validation](INFRA-01-VALIDATION.md) separates actual evidence from
unperformed rebuild steps. INFRA-02 has not started.

## Authority, strategy change and gates

The October 9 continuation supersedes the replacement-Droplet proposal in
[preparation commit 50fb207](https://github.com/eugenelin89/asymmetri/blob/50fb207ffbd752ebd1d3d2a0e35c3612826b16dd/docs/INFRA-01-UBUNTU-MIGRATION.md)
and [journal 050](prompts/050-deployment.md). That proposal's 2 GiB plan, parallel
host, overlap billing and DNS cutover are historical only. No replacement Droplet,
resize or permanent additional hosting expense is authorized. Do not follow a chain
of obsolete Ubuntu upgrades. The original observations and failed attempts remain
in the validation history; no document update means a migration occurred.

| Action | Authority and acceptance |
| --- | --- |
| Read-only inspection, independent backups and isolated recovery rehearsal | Authorized; preserve running services and unrelated data |
| Snapshot of existing Droplet | Explicitly approved, aggregate migration-snapshot storage up to US$1.50/month; verify size and cost |
| Django retirement / former-domain response | Archival preparation authorized; static 410 notice and precise service/socket changes proposed, approval required before public change |
| Private production payload on BotSquad | Explicitly prohibited without separate authorization; use synthetic fixtures only |
| Production write freeze, shutdown or outage | Not yet authorized; agree scope/window after readiness |
| Erase/rebuild existing disk | Not authorized; separate explicit owner approval after demonstrated recovery |
| DNS, cloud firewall or SSH policy changes | Not authorized during preparation |
| New Droplet, receiver activation or application upgrades | Not authorized |
| Migration snapshot deletion | Required and authorized **only after** all completion/observation/recovery gates below pass |
| BotSquad test environment | Later owner instruction permits `ssh botsquad` for isolated rehearsal and requires cleanup; no HQ application, data or authority change |

[DigitalOcean's rebuild procedure](https://docs.digitalocean.com/products/droplets/how-to/rebuild/)
states that rebuilding replaces the disk while retaining the Droplet IP; Ubuntu to
Ubuntu satisfies its OS-family rule. This is **not** destroy-and-create. The exact
existing Droplet ID and assigned IPv4 must be matched before and after every cloud
action. If IP retention cannot be established, stop for an owner decision. Never
substitute another host or change DNS to conceal a failed same-Droplet procedure.

## Current inventory

Private operator evidence uses stable site aliases below. Exact hostnames, IPs,
paths, configuration inventories, certificate fingerprints and DNS answers are in
the owner's restricted administrator evidence directory, outside Git. Public source
does not contain unrelated application settings, visitor data or credentials.

| Host group | Named hosts | Current behavior and migration responsibility |
| --- | ---: | --- |
| Asymmetri apex and www | 2 | Next.js on loopback 3001; all nine pages, robots and sitemap 200; preserve Motion resources |
| Peer active Django site, apex and www | 2 | Still live: homepage 200/admin login redirect. Preserve SQLite/source/settings; proposed static 410 retirement awaits approval |
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
approved migration website release. Do not run a floating `git pull` on the
restored website or copy this repository's new receiver into service configuration.

Prepare the restored website from the exact live SHA and lockfile, installing dependencies
on the new OS as the application owner. Do not copy native node_modules or Python
virtual environments as the new runtime. Preserve generated current output for
recovery, but rebuild and test it before use. A rebuilt build ID may
differ: compare public content, route/asset contracts and exact source identity,
and record both build IDs. Never bless unexpected changes by rewriting a baseline.

The peer Django checkout has a modified settings file. Its source SHA and overlay
hash belong in the private inventory; migrating its remote branch alone loses
production configuration. Preserve its SQLite, settings, static/media files and
ownership separately from rebuildable dependencies. No data/schema migration is
authorized merely by installing Python.

The known Next security patch remains undeployed. Inspect the exact patch separately
and record an explicitly chosen release if remediation must accompany migration;
do not silently substitute newer main. A vulnerable baseline is evidence, not a
security acceptance waiver.

## Independent recovery and custody

A rebuild erases the current executable release, predecessor rollback, databases,
users, installed packages and all other root-disk state. Retired data must remain in
verified protected recovery storage even when its runtime is omitted. Those directories
cease
to be a fallback. A snapshot and tested off-server recovery must replace that
assumption before approval. Selected-file exports are not a complete disk image.

| Recovery class | Required proof before destruction |
| --- | --- |
| Pinned Next website | Exact source/lockfile at 745a92c, Node 22, native dependencies, successful Linux checks/build/startup and route/asset comparison; retain original and rebuilt build IDs |
| Retiring Django | Source/settings/package pins, consistent final SQLite, static and any new media, verified off-server archives and recovery instructions; actual-data Mac read recovery passed. No active target Django/Gunicorn requirement after retirement approval |
| SQLite | Read-only-source backup API, independently decrypted copy, full integrity/FK checks and canonical schema/data comparison; repeat after final write freeze |
| Dormant PostgreSQL 14 | Entire cleanly stopped cluster/configuration/WAL plus supplemental TLS files; hash/member/source verification and cold-recovery instructions. Synthetic Linux recovery passed; actual-cluster runtime remains untested. No target PG install/activation |
| Static and retained files | All source/deployed roots, complete member/content/link/mode comparison on a case-sensitive filesystem, audit numeric owner metadata and test Linux owner application separately; retained environments remain dormant |
| TLS and server configuration | Certificate chains/private keys and ACME configuration; reviewed Nginx, units, schedules, users/groups/public keys, sudo/helper/firewall/network/logging requirements; reconstruct LTS configuration deliberately |
| Whole-disk fallback | Completed snapshot identified against this Droplet, restore compatibility and usable out-of-band administrator recovery; old image is emergency Ubuntu 22.10 rollback only |

The original five encrypted exports, trusted hashes and receipts are in the owner's
protected INFRA-01 administrator storage outside Git. The operator index is
`README-RECOVERY.md`; `FINAL-LEDGER.json` and the continuation receipts own exact
paths, identities, timestamps and private inventory. Never put the recovery key,
TLS private keys, application settings, user records or raw inventories in Git.

Archives use AES-256-CBC, PBKDF2-SHA256 and 600,000 iterations. CBC is not authenticated:
verify the expected ciphertext SHA-256 from independently trusted evidence before
decryption. Use `-pass file:...`, never a literal password or shell tracing. Both
ciphertext and decryption material exist off production. Separate-copy tests on the
Mac prove independence from the production disk, **not** separate-device disaster
custody. Keep a separately protected key/checksum copy and usable archives before
rebuild; record the custodian/location privately.

Safe reusable inspection pattern (private shell, reviewed paths only):

```sh
umask 077
# RECOVERY_DIR, ARCHIVE and KEY_FILE refer to verified private operator records.
shasum -a 256 "$ARCHIVE"
# Compare with the trusted receipt before executing any decrypt/restore step.
openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 -md sha256 \
  -pass "file:$KEY_FILE" -in "$ARCHIVE" | gzip -t
```

The last command applies to encrypted tar/gzip archives, not the raw SQLite export.
A private restore helper must reject escaping paths and symlink-parent traversal,
verify complete membership/content/metadata, consume the gzip trailer and check
both pipeline exits. A successful tar listing does not prove application recovery.
Do not overlay old `/etc`, kernels, APT sources, libraries or virtual environments
onto Ubuntu 24.04. Preserve originals as evidence; create reviewed target files.

SQLite was captured through Python's backup API, with canonical schema/row checks;
see [SQLite's backup guidance](https://www.sqlite.org/backup.html). PG 14 must stay on
major version 14 for cold restore; Ubuntu's default PostgreSQL major is not a
substitute. [Filesystem backup rules](https://www.postgresql.org/docs/14/backup-file.html).
PG 14 reaches upstream end of support November 12, 2026; a later supported-version
migration needs a separate tested decision, without activating the dormant site.
[PostgreSQL version policy](https://www.postgresql.org/support/versioning/).

## Snapshot procedure, cost and mandatory cleanup

The owner approved up to **US$1.50/month** for necessary migration snapshot storage.
Current [DigitalOcean pricing](https://docs.digitalocean.com/products/snapshots/details/pricing/)
is US$0.06 per billable GB/month, with a US$0.01 minimum. Count **all simultaneously
retained migration snapshots** against the ceiling. A nominal 25 GiB disk is not
proof of 25 billable GB. Verify account pricing/taxes and measured usage before any
additional snapshot; ask only if the expected charge exceeds the approved bound.

Actual continuation action: after authenticated account verification, the existing
Droplet's **Take Live Snapshot** operation completed. The UI reports **11.23 GB in
SFO3**, approximately **US$0.6738/month before tax**. Exact name, originating Droplet and creation evidence are protected operator
records. The UI exposes the unique snapshot name/size/source, but its numeric image
ID and minimum restore-disk field are not exposed by the inspected UI. A later
inspection confirmed both Ubuntu 24.04 LTS x64 and this uniquely named snapshot are
offered by this existing Droplet’s Rebuild selector; no rebuild was submitted. Record
exact selected identity again before the authorized action. Existing compute
remains the account-displayed US$6/month plan. No new Droplet or backup subscription
was purchased. Droplet Activity reports a completed snapshot action taking **2 minutes
8 seconds**. The snapshot remains retained; deletion has not occurred.

This live snapshot is supplemental and may be crash-consistent. It is not the final
write-frozen checkpoint. DigitalOcean recommends shutdown for consistent snapshots;
that requires the separate outage authorization. [Snapshot procedure](https://docs.digitalocean.com/products/snapshots/how-to/snapshot-droplets/).
Before the final snapshot, stop/drain all mutable writers, complete consistent
SQLite/media/configuration exports, verify cold PG state, and capture exact source
identities. Record snapshot action completion, image ID/name/time, source Droplet
ID, region, minimum restore disk and billable size. A submitted action or a progress
bar at 100% alone is not completion evidence.

Snapshots contain disk state, not all account/network metadata; attached volumes
need separate protection. [Snapshot limits](https://docs.digitalocean.com/products/snapshots/details/limits/).
Do not delete the preliminary snapshot to make budget room while recovery is
uncertain. Re-evaluate aggregate size before adding a final frozen snapshot; if it
would exceed the cap, request the difference. Do not quietly leave several images
billing beyond the owner's bound.

**Mandatory cleanup gate:** retain the exact task snapshots until the same Droplet
runs Ubuntu 24.04 with its original IP; all 15 hosts and default behavior pass;
approved retired-domain responses and archival data/retained files, TLS/renewal, SSH/firewall, units and schedules pass; tested
independent recovery of the accepted Ubuntu 24.04 configuration and **current**
live mutable data plus final retired SQLite/media remains (pre-rebuild exports alone do
not satisfy the current-system recovery gate); and no incident needs old-OS rollback.
Observe for
**at least 48 healthy hours**, including a scheduled Certbot timer execution and
representative surviving-site usage and retired-domain requests. Extend the period for any unresolved incident or missing
scheduled-cycle evidence; 48 hours is a minimum proposal, not automatic permission
to discard needed recovery.

Once all conditions are evidenced, delete only the exact migration snapshot(s),
verify absence in the account and cessation of storage accrual, and retain the
snapshot identity, UTC deletion time and billing verification privately. Previously
accrued charges may still appear on the invoice; absence of future accrual is the
claim to verify. Leave unrelated snapshots/backups untouched. If deletion fails,
report the continuing cost and keep INFRA-01 incomplete. Snapshot cleanup is part
of completion, not an optional follow-up or an authorization to delete it now.

## Network, DNS and access continuity

Authenticated account inspection matched the server metadata's existing Droplet ID,
SFO3 and original IPv4. An assigned public IPv6 and private VPC address are present;
**absence of published AAAA records did not mean absence of IPv6**. The Droplet has
no attached DigitalOcean cloud firewall and automated backups are not enabled.
Preserve host UFW rules and every assigned address. Record network masks/gateways,
VPC membership, Reserved IP/volume state, reverse DNS and bootstrap metadata privately.

Fifteen host A/CNAME answers, original TTLs and authoritative providers are in the
DNS baseline. Asymmetri uses registrar-servers.com; the two peer zones use DigitalOcean.
All queried named hosts lacked AAAA at initial inspection. Recheck authoritative
A/AAAA/CNAME and PTR before and after rebuild. Preserve MX/TXT/CAA/delegations and
unrelated records. Inventory any external IP allowlists with their owners; absence
of an observed dependency is not proof no allowlist exists. **No DNS changes are
part of this plan**, including TTL changes. IPv6/interface recovery and account-side
settings must be explicitly verified, not inferred from IPv4 documentation.

The recovery console connects through encrypted QEMU transport and displays the
correct old Ubuntu login prompt. An authenticated administrator recovery shell is
still a separate acceptance item. Read-only password-status checks found root and the
administrator account locked; the owner does not have a console password to enter. Do
not request that login again as though a password were known. Successful `ssh asymmetri`
and
`ssh asymmetri-admin` do not establish access if networking/sshd fails after erasure.
Do not enable password SSH, reset a password, power-cycle, or change recovery boot
mode merely to bypass this gate.

Original cloud-init user-data was inspected: zero bytes. Vendor data exists and its
digest is retained privately; this does not recreate custom admin/deploy accounts.
Before erasure, verify initial public-key selection and an approved working
emergency/bootstrap route. Rebuild uses original configuration parameters; the current
on-disk admin/deploy accounts are not guaranteed to reappear. Resolve bootstrap and
console authentication before approval. The existing access installer/helper and
sudo policy must be reviewed against the clean target before use.

Fresh host keys are expected. From a verified console session, record:

```sh
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub -E sha256
ssh-keygen -lf /etc/ssh/ssh_host_rsa_key.pub -E sha256
```

On the Mac, preserve the old known-host record and replace only the verified
host/alias entries after comparing fingerprints over the authenticated console.
Never disable host-key checking or blindly accept a changed key. Verify independent
admin and deployment sessions, scoped helper identity/NoNewPrivs and `visudo -c`
before applying SSH or UFW restrictions. Client private keys stay on the Mac.

## Ubuntu 24.04 rehearsal contract

Use an authorized isolated Ubuntu 24.04 **amd64** environment. An arm64 macOS build
or file extraction is not Linux runtime acceptance. The owner subsequently selected
the existing `ssh botsquad` host for rehearsal and required cleanup. Public-source
and dependency tests are authorized. Automatic approval review previously blocked
private archive transfer. The current owner instruction explicitly prohibits sensitive
production archives on BotSquad without separate authorization; no private payload was
transferred. Do not treat general host access as permission. Use only a
private task directory, isolated mount/PID/network namespaces, non-root application
processes, no host Unix sockets, explicit resource limits and serial builds. Acquire
public dependencies separately from restored secrets. Do not change HQ services,
packages, data, authority or boot configuration. Record before/after service and
listener identities and remove task processes/files after collecting safe receipts.

The public pinned Next release passed Linux checks/build/native-image/startup tests
and 22 application requests. BotSquad cleanup completed on October 9 at 18:37:09 UTC;
the task directory/processes/units are gone and HQ service/listener identities are
unchanged. Later synthetic Django/PG and combined-service tests, private Mac restoration and second cleanup are recorded separately. See the
[current results and cleanup](INFRA-01-VALIDATION.md#current-acceptance-table).

Keep test writes disposable and external integrations disabled. Do not let restored
Django mail/webhooks or scheduled tasks contact production. Test against copied data;
never migrate the original database just to satisfy a startup check. Record exact
runtime/dependency versions and adaptations, including any test-only host/socket/
settings overrides. Such overrides are not approved production configuration.

The installed peer package inventory is: Django 5.2.9, Gunicorn 23.0.0, Markdown
3.10.1, asgiref 3.11.0, packaging 25.0, sqlparse 0.5.5, typing_extensions 4.15.0,
pip 25.3 and setuptools 59.6.0. Its source requirements contain broad ranges and
omit Gunicorn; using them alone is not an exact restoration. Create a private pinned
recovery manifest. Python 3.12 recovery tests exposed setuptools 59.6.0 incompatibility;
68.2.2 imports passed in isolated tests. These pins are archival recovery information,
not target runtime requirements.
[Django compatibility](https://docs.djangoproject.com/en/5.2/faq/install/).

Test all of the following and attach receipts to validation:

1. Restore private archival file classes with complete hashes/links/non-symlink
   modes on case-sensitive storage and audit recorded numeric owners. Keep synthetic
   Linux owner-application tests distinct; verify actual target service ownership
   during surviving-site restoration. Check filesystem space.
2. Install Node 22 and exact source lockfile as the application owner; run check,
   `npm run build:next`, actual Next startup and native image dependency checks.
3. Verify retiring peer source/settings/static and consistent SQLite archives;
   repeat final capture after approved write freeze. Preserve the successful actual-data
   Mac read tests and synthetic Linux application tests as distinct evidence.
4. Verify the full cold PG14 archive and supplemental TLS dependency. Keep the real
   cluster inactive; synthetic compatible-major recovery is not an actual-data check.
   Actual PG startup is deferred historical-recovery work, not a live target dependency.
5. Validate all 13 Nginx site configurations/25 blocks, upstreams, default host,
   redirects/static assets, certificate/key matches, SAN/chain/expiry and permissions.
6. Verify systemd unit semantics/ownership, sudo/access, intended listeners, schedules
   and restart/reboot recovery. A transient test unit is not full reboot acceptance.
7. Compare all 198 baseline requests with ordinary TLS verification and correct Host/SNI;
   explicitly review generated Next asset changes without replacing the old baseline.
   Preserve the old baseline and add a separately approved retirement expectation for the former peer; add surviving-site browser checks. Prove Certbot challenge/renewal with
   an authorized method; timer installation alone is insufficient.

## Ordered production run sheet — NOT EXECUTED

This is an operator draft, not a shell script to execute automatically. Fill and
review the private command sheet with the exact Droplet/image/snapshot identifiers,
users, paths, package checksums and final tested timings. Unresolved values or failed
rehearsal steps block approval. Record UTC start/end, command exit/result, receipts,
corrections and an explicit PASS/STOP decision at every checkpoint.

| Step | Ordered operation and concrete checkpoint | Stop/recovery decision |
| --- | --- | --- |
| 0 — Readiness | Match existing ID/IP/plan; verify cloud and console access, target `ubuntu-24-04-x64` availability/minimum disk, signed packages, independent recovery and completed snapshot. Review all rehearsal receipts and exact private run sheet. | Any gap: keep current host serving; do not schedule erasure. |
| 1 — Authorization | Owner approves exact outage/window, write freeze, same-ID clean rebuild, failure deadline and snapshot rollback procedure. Record authorized window and responsible operator. | Approval absent: preparation only. |
| 2 — Final baseline | Read source/build and `systemctl show` identities; run `nginx -t`, all-site HTTP/TLS/DNS baseline, database and resource checks. Compare with accepted historical baseline. | Unexpected production state: investigate before freeze. |
| 3 — Freeze | Enter the approved maintenance response; drain peer requests and stop the active peer socket and Gunicorn service together, plus any inventoried writers/schedules. Verify both units inactive and no socket activation or remaining writer before final backup. Record first unavailable request as outage start. Keep SSH/admin access. | Unidentified writer or failed drain: restore normal operation and stop. |
| 4 — Final data | Use SQLite backup API; copy final media/settings/static deltas; verify hashes/integrity and PG clean shutdown; record exact source/build, owners and config. Confirm independent decrypt/restore of final exports. | Failed backup: do not erase; resume old service when safe. |
| 5 — Final snapshot | Within approved window, gracefully shut down if selected, take final snapshot within aggregate budget, verify completed action/identity/region/size/restore compatibility. | Failed/uncertain snapshot: stop; power on existing disk if needed. |
| 6 — Rebuild | On the **existing Droplet's** Settings → Rebuild flow, match ID/IP, choose verified Ubuntu 24.04 amd64 image, review destructive confirmation, then perform only under explicit authorization. Record action ID, image ID and times. | Never Destroy/Create. Unknown action outcome: inspect once settled; do not resubmit blindly. |
| 7 — Bootstrap | Connect through verified console; inspect `/etc/os-release`, `uname -r`, `ip -br address`, routes and provider metadata. Verify same ID and both assigned address families; obtain new host-key fingerprints. | Wrong ID/IP/image or inaccessible console: stop and execute authorized recovery decision. |
| 8 — Clean OS | Apply supported security updates/reboot within window. Reconstruct reviewed accounts/UIDs/groups, public keys, sudo/helper and independent admin/deploy access. Recreate the reviewed 2 GiB swapfile/fstab entry before builds; verify `free -h`/`swapon --show`. Install signed compatible runtimes and Nginx. | No old APT/system-library overlay. No global firewall restriction until recovery access works. |
| 9 — Restore | Restore exact Next source/public files, build under app owner with tested lockfile/Node 22; all surviving static/retained roots and approved retirement notice; preserve retired source/settings/SQLite and full PG archives without installing their application runtimes. Restore reviewed units/logging/schedules/TLS permissions. | Any source/data/mode discrepancy: preserve evidence and hold writers stopped. |
| 10 — Start privately | `visudo -c`, `sshd -t`, `nginx -t`, `systemd-analyze verify` reviewed units, then `systemctl daemon-reload`; start only intended services with writes fenced. Check loopback/socket health and error logs. | Failed critical check: fix only tested minimal adaptation, or rollback at deadline. |
| 11 — Accept | All named/default hosts, 198 baseline requests/assets with only explicitly approved retirement differences, archive integrity, TLS/renewal, redirects, access/firewall/schedules, DNS/IP comparison and capacity pass. Record new runtime/build IDs. | Do not reopen writes to hide a partial restore. |
| 12 — Resume | Resume accepted surviving services, retain retired writers stopped/disabled, recheck external journeys and record outage end. Any retained live mutable application must have one deliberate writer. | Preserve every new write for any later rollback. |
| 13 — Observe/clean | Observe at least the documented healthy period, test independent recovery, then delete only task snapshots and verify billing cessation. Commit final actual configuration/evidence and update BotSquad roadmap. | Any incident or failed deletion keeps INFRA-01 incomplete. No automatic INFRA-02. |

Reviewed command patterns to incorporate into the exact private sheet, **only at
the authorized phase**, include:

```sh
# Read-only identity and service/configuration checks.
cat /etc/os-release
uname -r
ip -br address
systemctl show asymmetri.service nginx.service -p ActiveState -p MainPID -p ActiveEnterTimestamp
sudo -n nginx -t
sudo -n visudo -c
sudo -n sshd -t

# Inside the isolated/restored app directory, as its application owner.
node --version
npm --version
npm ci
npm run check
npm run build:next
node_modules/.bin/next start -p 3001 -H 127.0.0.1

# From the administrator workstation; manifest/baseline are protected files.
python3 ops/infra/http-baseline.py "$MANIFEST" "$NEW_RECEIPT" \
  --resolve "$VERIFIED_ORIGINAL_IPV4" --against "$ACCEPTED_BASELINE"
```

The original target has only 956 MiB visible RAM. A rebuild removes its 2 GiB swap
file and old fstab. On the clean target, after checking no swapfile already exists,
recreate it at restrictive mode before any build, then persist exactly one reviewed
fstab entry and verify capacity:

```sh
# Authorized clean target only; never run mkswap over an existing file/device.
(
  set -eu
  if [ -e /swapfile ] || [ -L /swapfile ]; then
    printf '%s\n' 'STOP: /swapfile already exists; inspect before continuing.' >&2
    exit 1
  fi
  sudo -n fallocate -l 2G /swapfile
  sudo -n chmod 600 /swapfile
  sudo -n mkswap /swapfile
  sudo -n swapon /swapfile
)
# Add the reviewed '/swapfile none swap sw 0 0' entry exactly once.
free -h
swapon --show
```

Stop if the file exists unexpectedly; inspect rather than overwrite it. The clean
fstab must retain the new image's own root/EFI identifiers. A successful build on
the 2 GiB rehearsal host is not sufficient evidence of 1 GiB production capacity;
record bounded-build memory/swap and preserve headroom for OS and peer services.
No resize or additional paid capacity is approved.

The Next start example is a foreground rehearsal command; production uses the
reviewed systemd unit, not a second competing process. Root handles OS configuration;
Git/dependency/build commands run as the application owner. `.nvmrc` remains for
local development, while Node 22 has existing production approval. Do not run a
floating pull of current main, an application schema migration, `npm audit fix`,
receiver setup or unrelated hardening as part of this sheet.

## Downtime and rollback

No production outage has been measured or started. Local seconds for file extraction
and individual Linux checks are not a full-server recovery time. Build, transfer,
provider rebuild/snapshot, package installation, console recovery and all-site
acceptance must be timed in the final rehearsal. Plan in **hours**, with an explicit
failure deadline and a separate rollback allowance; no defensible minute-level
promise exists yet. The live snapshot took 2 minutes 8 seconds in provider Activity. The UI also displays
a general 1–3 minutes per used GB estimate; neither observation bounds a future
frozen snapshot, rebuild or whole-service restoration.

There is no old live server after same-Droplet erasure. Rollback means selecting the
verified old snapshot in the existing Droplet's restore flow and replacing its disk
again. [DigitalOcean restore procedure](https://docs.digitalocean.com/products/snapshots/how-to/create-and-restore-droplets/).
Record its exact image/Droplet IDs and verify no second host or DNS operation is
selected. Reverify original IP, old OS/build, SSH fingerprint, all sites/data and
access after restoration. Old SSH keys may return with the snapshot: verify them
through the console before updating known-hosts. Ubuntu 22.10 remains unsupported;
rollback restores service temporarily, not INFRA-01 success.

Rollback triggers include lost administrator access, wrong IP, critical TLS/route
failure, new sustained 502/503, missing/corrupt peer data, unexpected exposure or
insufficient capacity. Before new writes, the accepted frozen snapshot plus final
consistent application backup is the recovery point. **After new writes**, freeze
again, export/reconcile newer SQLite/media and configuration before restoring the
old image. Never overwrite those writes with a pre-rebuild snapshot. Unknown data
ownership or reconciliation blocks reopening writes and may extend the outage.

## Actual execution record and final configuration requirements

[Validation](INFRA-01-VALIDATION.md) records performed, failed, corrected and
unperformed actions chronologically. The private ledger retains exact commands,
checksums, snapshot IDs, address/host mappings and protected output. The Engineering
Journal summarizes decisions without raw logs or private attachment paths.

After an authorized migration, record before/after Ubuntu/kernel/resources, runtime
versions, source/build IDs, deployment and DB paths, user/service ownership, Nginx/
TLS/renewal, host/cloud firewall, SSH recovery, timers/cron, logging/update/backup
procedures, disk/RAM/swap, every-site results, actual outage and observation times,
remaining risks and snapshot deletion receipt. Until those measurements exist,
**the original inventory remains the production configuration**, not a fictional
Ubuntu 24.04 final state. Update deployment/access/maintenance docs from that evidence.

INFRA-01 completion requires the same live Droplet on 24.04, original IP and approved domain
behavior (including explicitly approved retirements), accepted services/data/recovery, healthy observation, verified snapshot
cleanup and committed documentation. INFRA-02 still needs separate owner selection.
