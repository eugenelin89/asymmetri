# INFRA-01 validation — retirement amendment and recovery verification

> **Current status (October 9, 2026): migration cancelled/deferred; snapshot deleted;
> cleanup complete.** The [cancellation record](INFRA-01-CANCELLATION.md) supersedes
> all execution and snapshot-retention instructions below. Django retirement was
> evaluated but not executed; services/data remain intact. The following text is
> retained historical phase evidence, including failed attempts and unperformed gates.
> It is not an active plan or authority to rebuild, retire, or start INFRA-02.

## Historical preparation record — superseded

**INFRA-01 RECOVERY PARTIALLY VERIFIED — SPECIFIC BLOCKERS REMAIN**

Updated 2026-10-09. Production remains Ubuntu 22.10 on the same Droplet/IP and pinned
website release. The live Django service/socket still run. No production restart,
stop/disable, Nginx/DNS change, data deletion, rebuild, snapshot deletion or INFRA-02
work occurred. The [retirement amendment](INFRA-01-DJANGO-RETIREMENT.md) changes the
required target stack; it does not itself change public behavior.

## Current acceptance table

| Component / environment | Actual test | Result | Limit / remaining gate |
| --- | --- | --- | --- |
| Private retained archive / Mac | Encrypted case-sensitive APFS volume, noexec/nosuid/nodev; full tree restore | 42,605 members; 66 case collisions preserved; all content, links and non-symlink modes verified | Private numeric Linux ownership audited, not applied; no execution of retained environments |
| Restore helper / Mac and Ubuntu | Traversal, links, hashes, missing members, existing destination and case gate tests; synthetic Linux UID/GID fixture | 16 total tests on Mac: 14 pass/2 filesystem skips; 9 restorer tests on case-sensitive Mac/Linux: 8 pass/1 inverse-filesystem skip; Linux numeric owner application passes | Synthetic owners do not prove all private Linux metadata; no ACL/xattrs found in tested archive |
| Actual Django/SQLite / Mac Python 3.12.12 | All networking denied; copied SQLite read-only; checks, migration plan and 10 read journeys | Pass; zero pending migrations, integrity/FK pass, DB bytes unchanged; temporary plaintext DB removed | Test settings/mail/cache overrides; actual-data Linux/Gunicorn runtime untested and no longer required for active target service |
| Source preservation / production read-only | Current non-DB files compared against trusted archive manifest | 216 files match content, size, modes and UID/GID, including settings/static | Live DB remains writable; final consistent retirement checkpoint still required |
| Synthetic Django / Ubuntu 24.04.5 x86_64 Python 3.12.3 | Generated DB/settings, migrations, 16 request/form/CSRF/admin checks and 128 collected static files | Pass; SQLite integrity/FK pass | No actual records/settings/media/keys transferred |
| Tooling compatibility / isolated Mac and Linux | Exact installed pins, then narrow recovery-only adaptation | Django/Gunicorn imports pass; setuptools 59.6.0 fails on Python 3.12; 68.2.2 imports pass | Production untouched; application Python installation removed from new target plan |
| Actual dormant PG / Mac and production read-only | 2,404-member archive/source verification; cold control/config/link review; TLS supplement decrypted and key/cert checked | Pass for archival preservation; no external tablespaces/symlinks found | Real-cluster startup, logical export and structural checks remain unperformed; retain full data and snapshot |
| Synthetic PG / Ubuntu PG14.24 | 100 generated rows, clean cold copy, matching files, checksums, restart, normalized logical comparison, pg_amcheck and final clean shutdown | Pass | Does not establish actual private-cluster runtime recovery |
| Pinned Next / Ubuntu Node22.23.1 | Prior exact-release check/build/native image/startup/22 requests, plus offline rebuild for combined test | Pass | Full target systemd/TLS/renewal/reboot acceptance pending |
| Combined synthetic services / Ubuntu | Next + Gunicorn(one worker) + Nginx(one worker), correct synthetic SNI/TLS; 37 initial + 300 load requests | Pass; aggregate 512 MiB RAM/256 MiB swap/50% CPU cap; measured in-unit memory peak 130.71 MiB; zero swap, OOM, cgroup memory-limit events | Representative 15-host roles, not exact private vhosts/certs; 3-minute test excludes OS/HQ overhead and cold-build peak |
| Production resources / read-only | 16 samples over 30.49 seconds, service identities before/after | 413.71–413.93 MiB available; no sampled swap I/O/OOM; Django 35.81 MiB RAM / 19.68 MiB swap | Idle sample, not traffic capacity; PSS parser failed and its zero values are excluded |
| DigitalOcean / authenticated UI | Correct existing Droplet, retained snapshot, Rebuild image choices inspected then cancelled | Ubuntu24.04 LTS x64 and exact old snapshot both offered on existing Droplet; no action submitted | Actual restore not tested; numeric image/min_disk fields not exposed; reconfirm exact selection before authorized action |
| Bootstrap / production read-only | cloud-init data metadata and password status | Original custom user-data empty; root/admin password states locked | Emergency console transport works but authenticated recovery shell/bootstrap remains unresolved; do not ask owner to guess passwords |
| Cleanup / BotSquad | Exact task directory/process/unit removal and before/after comparisons | Pass at 19:24:58 UTC; 44,984 files / 1,733,402,849 regular bytes removed; HQ service, listeners and dpkg inventory unchanged | No host packages installed, no private production payload transferred |
| Separate custody | Verified encrypted copies, passphrase and trusted hashes off production | Same-Mac independent copies pass, including new PG TLS supplement | Separate-device/custodian copy remains unverified |

## New attempt history and corrections

The case-sensitive restore used a task-created encrypted sparse image. The first
attach command used an unsupported mount option; it was corrected with a separate
mount operation and verified noexec/nosuid/nodev flags. The restorer then preserved
all case collisions, hardlinks and symlinks. It rejects unsafe paths, existing
outputs and unexpected content; explicit exceptions were required for one literal
absolute Python symlink and archived special mode bits. No restored binary ran.
Symlink modes and ACL/xattrs are not claimed as applied.

Local Python's initial ensurepip bootstrap could not read a bundled global wheel.
A verified official pip wheel bootstrapped only the temporary venv; global Python
was not repaired or changed. The initial nested sandbox invocation failed; an
approved invocation then verified network denial while exercising real copied
SQLite data. No schema/data writes or external email calls occurred.

Synthetic Linux packages were acquired separately from execution: official Node
checksums, PyPI wheel hashes, signed PGDG index/package checks and trusted Ubuntu
package hashes. Packages were extracted into the task tree, never installed on HQ.
Early source directory permissions blocked non-root execution and were corrected
only inside that tree. The combined test then exposed unwritable temporary paths
and missing Nginx default temp directories; these were redirected inside its sandbox.
A wrong runner path produced exit127 before startup, then the corrected run passed.
These failed attempts are retained as private receipts, not hidden by the success.

The successful combined unit ran 190.212 seconds. Its sequential load was 60 requests
at 1/s (p95 21.52 ms), then 240 at 4/s using a pool capped at four client workers (p95 17.52 ms), plus
idle/recovery intervals. All services remained alive and were stopped on exit.
Memory was sampled 372 times **inside the live shared cgroup**; its kernel peak was
137,056,256 bytes, zero swap/OOM. The post-exit systemd summary reported an unreliable
smaller peak and is not used. Shared host cache and short synthetic traffic mean this
is supporting evidence, not a whole-1-GB-host or cold-cache stress test. Requests
completed before the next 250 ms submission, so sustained four-way concurrency was
not demonstrated. CPU throttling occurred under the 50% quota (54 events/about 2.54 s);
zero memory pressure must not be generalized to zero resource pressure.

The 1 GB plan remains a reasonable provisional choice after Django retirement,
with restored 2 GiB swap and serial builds. Earlier production-build rehearsal
needed 900 MiB RAM plus a 1536 MiB swap allowance after 256 MiB swap failed. Reserve
OS/agent headroom and verify target build/renewal/reboot under real system conditions
before accepting migration. No resize is authorized or currently proposed.

The encrypted Mac test volume was detached and removed with its temporary key,
plaintext source/settings copy and temporary Python environment. Encrypted recovery
archives, manifests, scripts and receipts remain protected off-server.

## Retirement and remaining decisions

The dormant draft declares PostgreSQL; active and other retained Django projects
use SQLite. No other active application consumer was found. Preserve the entire PG
cluster because not every database's historical ownership was enumerated. Django
source/settings/static and database recovery evidence are now sufficient to prepare
archival retirement, with a final write-frozen capture still required.

The owner must approve the [static 410 notice and exact service/socket
changes](INFRA-01-DJANGO-RETIREMENT.md#precise-proposed-service-changes--not-executed)
before the two former Django hosts change. Preserve the old baseline and accept only
those explicitly approved response differences. The dormant draft's current 502
response changes only under a separate domain-behavior decision. No deletion of
historical data or removal of the shared application user is proposed.

Before destructive rebuild, resolve usable console/bootstrap recovery and independent
custody, finalize the exact surviving-site Nginx/TLS/renewal/access/owner restoration
and timed rollback command sheet, then obtain separate outage/rebuild approval.
Private actual-data Linux restoration remains an acknowledged archival limitation,
not a reason to reinstall unused applications on the target. The completed 11.23 GB
snapshot remains retained at approximately US$0.6738/month before tax; mandatory
cleanup follows accepted migration, current independent recovery and at least 48
healthy hours including renewal evidence. INFRA-02 remains unstarted.

The sections below preserve earlier evidence and superseded acceptance requirements.
Their private-transfer question and active Django/PG restoration requirements are
historical; the current owner prohibition and retirement amendment above govern.

---

# Earlier same-Droplet continuation — historical record, 2026-10-09

**INFRA-01 SAME-DROPLET PLAN BLOCKED — RECOVERY GAPS REMAIN**

Production is still the existing Ubuntu 22.10 Droplet at the original IP and website
release. No destructive rebuild, maintenance outage, DNS/firewall/SSH policy change
or application deployment occurred. The active plan is the owner-selected clean
Ubuntu 24.04 rebuild of that same Droplet. INFRA-02 remains unstarted.

## Current authority and evidence

The continuation superseded the earlier replacement-host recommendation. The later
amendment explicitly approved migration snapshot storage up to US$1.50/month and
requires deletion only after successful migration, healthy observation and tested
current recovery. Rebuild and service interruption remain separately unapproved.
The owner subsequently selected `ssh botsquad` for isolated Linux rehearsal and
required cleanup afterward. The previous no-HQ-contact boundary changed only for
this bounded test environment; BotSquad application/runtime authority is unchanged.

| Class | Actual continuation evidence | Remaining acceptance |
| --- | --- | --- |
| Account/Droplet | Authenticated account's Droplet entry/ID matches server metadata; original IPv4, assigned IPv6, private VPC address, SFO3, 1 vCPU/1 GB/25 GB and US$6/month displayed | Target image/minimum disk and original bootstrap metadata need final verification |
| Network | No attached cloud firewall; no automated backup subscription; all 15 A/AAAA/CNAME queries repeated; zero published AAAA and no PTR answers for assigned IPv4/IPv6 | Authoritative-zone/account details and any external allowlists; no DNS changes proposed |
| Snapshot | Live snapshot completed, 11.23 GB, SFO3, US$0.6738/month before tax; unique name/source recorded privately; one account Droplet snapshot listed | Numeric image ID/minimum restore size; final write-frozen checkpoint and actual snapshot restoration remain untested |
| Recovery console | Encrypted QEMU connection to correct Droplet and Ubuntu 22.10 login prompt | Authenticated admin recovery shell unverified; existing SSH success is not its substitute |
| Independent custody | All five ciphertexts copied and trusted hashes rechecked off production; copied key decrypts them without production access | Copies/key are on the same Mac; separate-device custody still unverified |
| File/SQLite restore | Copied SQLite integrity/FK/canonical-data checks pass; site/configuration, PG files and public-access files extracted/hashed with links verified on Mac | Linux owners/ACL/xattrs/runtime not established by Mac extraction |
| Retained files | Full copied archive decrypt/gzip/tar verification passes; exact Mac tree restore failed on case-sensitive name collisions | Case-sensitive Linux file-tree restoration required; do not rename/skip files to call it restored |
| Ubuntu rehearsal | Ubuntu 24.04.5 x86_64 isolated sandbox: pinned Next release passes checks, production build, native image processing, startup and 22 requests; task cleanup verified | Private Django/PG/file restoration, full Nginx/TLS/systemd acceptance and combined production capacity remain unverified |
| Private transfer | Automatic approval review rejected transferring settings/data/TLS archives to the separate host; no private recovery payload transferred | Explicit scoped permission requested; no workaround or indirect transfer |
| Rebuild/observation/cleanup | Not performed; production unchanged; snapshot retained | Every runtime/recovery gate, then explicit outage/rebuild approval; snapshot deletion only after current post-rebuild recovery and healthy observation |

## Continuation chronology and corrections

1. Confirmed clean Asymmetri main at f75f6f2 and ff-only pull; BotSquad PR #35 remained
   open/unmerged with matching owned branch at bc97c88. Read both repositories'
   required guidance and Decision 029. Read-only specialists reviewed recovery,
   rebuild/IP/cost, access and roadmap boundaries; the primary remains sole writer.
2. Rechecked official rebuild/snapshot guidance. Same-Droplet rebuild retains IP but
   replaces the disk. Original on-disk current/predecessor runtimes cannot survive
   as an old-server fallback. Snapshot rollback means another disk restoration and
   a potentially extended outage, including reconciliation of post-snapshot writes.
3. With independent ciphertext/key copies, restored SQLite 184,320 bytes: integrity
   `ok`, zero FK violations, 130 rows and canonical schema/data digest matched the
   accepted source backup. No private records were printed. The copied configuration
   archive restored 1,379 regular files and 157 links; PG 2,369 files; authorized-public-key
   archive 2 files. All checked content/links and archived metadata matched. Numeric
   Linux ownership/ACL/xattrs were not applied on macOS.
4. Retained-user extraction failed at Linux terminfo names colliding on the Mac's
   case-insensitive filesystem. Manifest inspection confirmed 66 distinct case-folding
   collisions. The temporary partial tree was removed; the first script/failure
   record was retained. Repeated full decrypt/gzip/tar checks covered 42,605 members
   and 1,024,218,651 regular bytes successfully. This corrected the diagnosis, **not**
   the missing exact-tree restore.
5. Re-read current production versions/packages/network/services without mutation.
   Exact live Next source/build remained 745a92c/`Ic-zxi4WHpmgjiSDnsJCw`; full nine-item
   Django virtualenv package inventory was captured. Its requirements file alone
   has broad ranges and omits Gunicorn, so recovery must use exact installed pins.
6. After owner sign-in, matched account and metadata Droplet identity; verified plan,
   assigned IPv4/IPv6/VPC and no cloud firewall. Created the specifically approved
   **live** snapshot without stopping services. Waited until progress was replaced
   by completed size/region and confirmed it in account inventory. Actual 11.23 GB
   is within the cap; no replacement Droplet or subscription was purchased. Provider
   Activity separately records the completed operation taking 2 minutes 8 seconds.
7. Opened recovery console: encrypted transport and old-OS login screen work. Owner
   asked to use established SSH aliases; those remain usable, but no console admin
   session was demonstrated and no password/security setting was changed.
8. No local Mac Linux runtime was found; the Mac had approximately 9.9 GiB free and
   is arm64. The owner then authorized trying `ssh botsquad`; read-only inspection
   found suitable existing Ubuntu 24.04 x86_64 resources. Existing failed historical
   test units were observed and left untouched; the active HQ service was recorded
   before testing. No new cloud resource or host package installation was needed.
9. Empty sandbox first failed directory traversal before loading any data. Corrected
   test-only parent permissions and moved privilege drop before entering the app
   directory. Retest proved UID/GID 1002, zero effective/bounding capabilities,
   NoNewPrivs 1, only loopback, private writable test storage and hidden HQ paths/sockets.
10. Verified official Node 22.23.1 distribution hash, nine pure Python wheels against
    PyPI hashes and PGDG signed InRelease/index/package hashes. An initial `.xz`
    package-index assumption failed; the signed manifest provided `.gz`, which was
    used successfully. PG 14.24 Noble packages were extracted into task storage;
    no global apt install/repository configuration occurred.
11. Sensitive archive transfer was rejected by automatic approval review before
    execution because the host instruction did not explicitly name that payload.
    Requested specific permission and continued only public source/dependencies.
    The prepared transfer keeps the passphrase on the Mac and would require verified
    sandbox restoration and mandatory deletion of all copied test data afterward.
12. Public pinned website source and lockfile were copied. `npm ci --ignore-scripts`
    in the isolated acquisition environment succeeded after fixing missing public
    OpenSSL configuration/traversal in the sandbox. Dependency scripts were rebuilt
    offline. Linux Node 22 TypeScript/lint passed with the existing tutorial warning.
    The first Next 16.3.6 production build hit the cgroup 900 MiB RAM/256 MiB swap limit
    and was terminated; BotSquad PID/start time and health were unchanged. A second
    attempt retained 900 MiB RAM with 1536 MiB of existing swap and passed all website
    checks below in 219.421 seconds. No host RAM/swap configuration was changed.
13. Repeated the 198-request live production comparison after snapshot creation:
    zero differences. Final read-only service identities/start times, deployed source
    and build, peer working-tree state and Nginx syntax remained unchanged. Repeated
    all 15 DNS queries without changing records.
14. Collected local receipts, stopped the test application and verified no remaining
    rehearsal process/unit before deleting the exact task directory. Cleanup completed
    at 2026-10-09 18:37:09 UTC; BotSquad service and listeners remained unchanged.

Exact timestamps, command scripts, private paths, original/corrected attempts,
archive identities and cloud receipts are in protected operator storage. Public
source contains no credentials, backup key, private rows or raw inventories.

## Linux results and cleanup

The exact public production source `745a92c676bcbe85c3aa675a1099d26321f1c1e2`
ran on Ubuntu 24.04.5 x86_64 with Node 22.23.1 and Next 16.3.6. The successful
isolated run used a 50% CPU quota, 900 MiB RAM limit and 1536 MiB swap allowance.
These are configured limits, not measured peak usage; completion-only memory
accounting was unreliable. The unchanged 1 GiB production host still needs a
capacity rehearsal including its other services and operating-system overhead.

| Check | Actual result | Measured duration |
| --- | --- | ---: |
| Public dependency acquisition, lifecycle scripts disabled | 535 packages installed using the pinned lockfile | 76.059 s |
| Offline dependency rebuild | Pass | 5.38 s |
| TypeScript/ESLint | Pass; existing tutorial warning only | 67.83 s |
| Next production build | Pass; build ID `uZ5xLDmR8P6NOuJscfeGS` | 141.62 s |
| Native Sharp image processing | Generated a nonempty PNG | 0.49 s |
| Isolated loopback startup | Nine pages, robots and sitemap on apex/www: 22 HTTP 200 responses; exact www tutorial canonical preserved | Included in successful unit |
| Successful offline test unit | Checks/build/native/startup completed; server stopped | 219.421 s |

The 22 application requests did not exercise restored Nginx, production TLS or peer
sites. The separate 198-request result describes **unchanged live production**, not
a completed Linux multi-site restoration. Python wheels and compatible PG packages
were verified/downloaded, but no private Django/SQLite restoration or PG cluster
startup occurred. No private recovery archive payload was transferred.

Cleanup removed 36,650 task files containing 1,592,376,700 regular-file bytes
(approximately 1.48 GiB). The exact rehearsal directory is absent, no task process
or running transient unit remains, and HQ service PID/start time and host listeners
match the pre-test record. No host packages or persistent test units were installed.
Safe receipts and failed/corrected attempts remain in protected local storage.

Repository validation passed on local Node 24.10.0: `npm run check` (existing tutorial
warning only), seven infrastructure-helper tests, changed Markdown relative-link
checks and `git diff --check`. The BotSquad INV/INV-ASK status table remains
byte-identical. These documentation checks do not imply infrastructure completion.

## Remaining destructive-operation gate

Resolve private recovery authorization/testing, case-sensitive retained-file restore,
Django/PG runtime recovery, target/bootstrap/snapshot-ID details and usable emergency
administrator recovery. Verify Nginx/TLS/renewal, units/schedules/access and capacity
for the unchanged 1 GiB target, including recreation of 2 GiB swap before builds. Finalize
and time the exact command sheet, failure deadline and post-write reconciliation.
Then obtain explicit approval for the maintenance window, writer freeze and **same
existing Droplet** Ubuntu 24.04 destructive rebuild. No rebuild approval is requested
as a substitute for unresolved recovery. Keep the snapshot until all acceptance and
current post-rebuild backup/observation gates permit mandatory deletion.

The initial report below is immutable evidence of the earlier proposal and checks;
its replacement-resource/DNS-cutover/old-host-retention instructions are superseded
by the [current runbook](INFRA-01-UBUNTU-MIGRATION.md). Its “no snapshot” statements
refer to that initial phase, before the separately approved snapshot above.

---

## Initial preparation record — preserved historical evidence

**Initial outcome: INFRA-01 PREPARED — RESOURCE OR MIGRATION APPROVAL REQUIRED**

This is evidence of current-host inspection and preparation, not a completed LTS
migration. The original host remains live and retained. No new paid resource,
snapshot, cloud rule, DNS/proxy change, restart, app release or receiver activation
occurred. INFRA-02 is not started or ready. [Runbook](INFRA-01-UBUNTU-MIGRATION.md).

## Evidence levels and phases

| Work | Result | Limits |
| --- | --- | --- |
| A: current inventory | OS/kernel/packages/APT/runtime/services/listeners/storage/time/Nginx/TLS/host firewall inspected; 15 named hosts accounted for | Cloud firewall, snapshot/backup inventory, plan and console recovery require authenticated account access |
| B: baseline | 198 external HTTP(S) requests, 15 external TLS identities, DNS records and live source/build recorded privately | Known failures remain classified separately; browser/authenticated business journeys still need staged acceptance |
| C: recovery preparation | Consistent active SQLite backup decrypted and restored in isolation; configuration/site, cold PG14 and retained-user archives decrypted and source-verified | No whole-server or PG14 runtime restoration acceptance; independent recovery custody pending |
| D: target design | Fresh Ubuntu 24.04 amd64, provisional SFO3 2 GiB proposal, explicit recurring costs and gates | Image/size combination not yet confirmed in account; no purchase |
| Local source checks | Node 24 macOS check, both website builds and production audit pass | Current main only; not live pinned-release Ubuntu compatibility |
| E–G: new-host setup/migration/acceptance | Not performed | No approved/provisioned target; Linux runtime, peer app, data, TLS renewal and every-site acceptance outstanding |
| H–I: traffic/post-cutover | Not performed | Explicit approval and accepted staging/recovery required |

Inspection took place October 9 UTC/PDT. The private evidence ledger records exact
times, hashes, DNS/TLS identities, paths and response metadata. It contains no
copied client or server SSH private key. Protected backup archives contain required
application configuration and certificate material and must never enter Git.

## Current-host and source identity

- Ubuntu 22.10; kernel 5.19.0-46-generic; x86_64; SFO3; 1 vCPU; 956 MiB visible RAM;
  2 GiB swap. Approximately 44% disk and 9% inode usage; approximately 13.6 GiB free.
- Node 22.23.1 / npm 10.9.8; Nginx 1.22.0; Python 3.10.7; Django 5.2.9/Gunicorn 23.0.0.
- Clean live website `745a92c676bcbe85c3aa675a1099d26321f1c1e2`,
  Next 16.3.6, build `Ic-zxi4WHpmgjiSDnsJCw`.
- Retained predecessor `fd65c46c16588903bb74198f1988cafff8d8b20c`,
  build `3sb31Jjj0R0QRPODTe0e_`.
- Active peer Django source and modified settings overlay recorded privately;
  preserve both. Its source-only remote does not reproduce production.
- Admin sudo works. Deployment alias/helper works as the application owner with
  `NoNewPrivs: 1`. Password/keyboard-interactive SSH off; old access unchanged.
- Final Next, Nginx and peer Gunicorn PIDs/start times matched the initial sample;
  all remained active. Final disk usage stayed 44%, with 13.55 GiB available. Dormant draft service/socket are
  disabled; PostgreSQL 14 cluster is down with clean shutdown. Its generated systemd
  enablement is not proof it should be activated on the candidate.
- Certbot renewal timer's most recent service result was success, exit 0. This is
  evidence of scheduled execution, not a completed challenge test on the future host.

## HTTP, DNS and TLS baseline

All nine Asymmetri pages, robots and sitemap returned 200 on apex and www (22 checks).
Both tutorial responses retain exactly `https://www.asymmetri.co/tutorial` as canonical.
All six compatibility redirects retain 308 and their destination. Motion support,
privacy and tutorial remain actual pages; no redesign or content change was made.

The expanded baseline has 198 requests: 100 responses 200, 65 responses 301,
12 responses 308, 14 responses 404, 2 responses 302, 1 pre-existing 502 and 4 expected 410.
It includes 34 local tutorial/image/script/style resources on each Asymmetri host.
There were no curl transport/TLS failures. The two retired relays remain 410 at root
and health; the inactive draft remains 502. The active peer admin redirects to login;
sample environment/database/Git paths do not expose data. Investment/Ask probe paths
remain 404; no receiver listener/service exists on this host.

Every named host's public certificate chain/hostname passed ordinary TLS validation;
external fingerprints, SANs, issuer and expiry are stored privately. Seven retained
certificate lineages include one not used by current site definitions. Earliest used
expiry is November 10. No certificate renewal or Nginx reload was triggered.

DNS inspection accounts for 15 hosts, two authoritative provider groups and A/CNAME
behavior. No queried host had AAAA. Original values/TTLs and mail-related answers are
private evidence; an authenticated zone export is still required before DNS changes.
Provider metadata says no floating IPv4 assigned. It does not enumerate the account's
other Reserved IPs, cloud firewalls, volumes or managed backups.

The final baseline uses the reviewed helper's resource-attribute hashing. A fresh
198-request post-preparation comparison matched with zero differences. Earlier
receipts are retained as historical evidence and must not be substituted for it.
HTTP status/selected markup/asset checks do not prove JS behavior, visual layout,
authenticated journeys, redirect destination availability or certificate renewal.

## Backup evidence

The active SQLite snapshot was made through the database backup API from a read-only
connection, encrypted during transfer, decrypted into an isolated private temporary
directory and removed from that temporary location after checks. Restored database:
184,320 bytes; full integrity result `ok`; zero foreign-key violations; 33 schema
objects. A deterministic schema-and-row digest matched the live read-only transaction.
No records, passwords or session contents were printed. Django was not started locally.

The encrypted SQLite archive is 184,352 bytes. Its ciphertext SHA-256 is
`6504917d4618cf6af1f694e0056cbf0784039fd16121410c3cab9228f3c8752b`.
The restored file hash and canonical-data digest are in the private receipt.
Raw database bytes and Python `iterdump` checksums differed across backup/runtime
versions; these were not falsely treated as corruption or equivalence. Explicit
deterministic schema/row comparison and integrity checks established data equality.

The configuration/site ciphertext is 946,723,024 bytes, SHA-256
`364e2f39fb14de2546f933058a079e75348ba740632aa55d811aba5be07eaf39`.
All 1,815 members passed source content, mode, UID/GID and link comparison. An initial
tar exit 2 identified one nonexistent optional application-owner authorized-key
file. The complete encrypted stream passed decrypt/gzip/tar validation; a corrected
independent source inventory returned exit 0 and exactly the same 1,815 members,
with zero missing/extra entries. It was accepted only after these checks. The
verified deployment/admin public keys were included; no private SSH key was copied.
This is selected-file backup acceptance, not a whole-server restore.

The retained non-serving user-project/environment ciphertext is 417,260,224 bytes,
SHA-256 `7ecd2a2c5a4b6797e5f0184804f96cd219831c6f7e71b3c606396e63cdd62b52`.
Decrypt/gzip/tar verification covered 42,605 entries; every source content,
mode, UID/GID and link matched. SSH directories and shell histories were excluded.
The two remaining users' authorized public keys have a separate encrypted export;
no private keys were copied. Private manifests/receipts own detailed inventory. Archives preserve ownership/mode/link metadata. No live SQLite
main-file copy is used as its backup. The cleanly stopped PostgreSQL 14 archive is
15,101,632 encrypted bytes, SHA-256
`fcc097f8fbc2660813236eae631aae100e8dce84ebdfbbcb3a546541a73c329b`;
decrypt/gzip/tar verification traversed 2,404 members and 99,072,422 regular-file bytes.
All 2,404 archived PostgreSQL entries also matched source content/modes/ownership/links.
An isolated compatible PostgreSQL runtime restore remains unperformed.

The existing on-disk predecessor rollback is preserved. These exports do not prove
whole-server recoverability or rebuildability of historical environments. Original
OS, installed dependencies, source history and private SSH identities are retained
on the old server; do not delete/reimage it. No paid snapshot exists because of this
task. Confirm account backups, independently protect recovery material and rehearse
all critical retained state before production-changing work.

## Local verification and independent review

| Check | Result |
| --- | --- |
| Clean main and `git pull --ff-only origin main` before edits | Pass; baseline 66a882d |
| Runtime | `.nvmrc` 24; active 24.10.0; nvm unavailable |
| `npm run check` | Pass; pre-existing tutorial navigation lint warning only |
| `npm run build:next` | Pass; Next 16.3.8 on macOS |
| `npm run build` | Pass; Vinext packaging; existing route-classification and Browserslist notices |
| `npm audit --omit=dev` | Pass, 0 vulnerabilities; rerun with network access after sandbox DNS failure |
| HTTP helper focused tests | 7 pass; transport failures, route set/redirect changes, disabled endpoints, resource/form drift and credential-bearing URL rejection |
| `git diff --check` and local Markdown links | Pass |

One primary writer/integration owner; read-only specialists reviewed LTS/cost,
backup/security and BotSquad roadmap boundaries. A reproduced helper false-pass
for changed image/style/script/form references was corrected with resource/metadata
attribute hashes and a regression test before recapturing the final baseline.
No specialist changed production. BotSquad changes use an isolated documentation
branch/PR and do not modify its runtime, grants, contracts or Decision 029.

## Remaining acceptance and approvals

1. Authenticated DigitalOcean access: plan/charges, region image/size, cloud firewall,
   snapshots/backups, networking and usable emergency console. No SSH/firewall
   hardening is allowed before independent recovery is confirmed.
2. Owner approval for the exact replacement resource and bounded snapshot budget;
   proposed 2 GiB $12/month, seven–fourteen days initial overlap, original retained.
3. Full critical-data recovery, isolated PG14 and Django application restore,
   independently held recovery key/checksums, retained-data and ownership acceptance.
4. Actual Ubuntu 24.04 candidate install, pinned-release builds, Python/runtime/native
   dependency compatibility, all sites/assets/journeys, TLS issuance/renewal,
   schedules, access/security and capacity measurements.
5. Separate explicit traffic and any peer-write-freeze/interruption approval,
   final data synchronization, DNS zone/TTL handling and rollback rehearsal.
6. All-host post-cutover verification and a separately agreed old-host retention
   period. No automatic destruction, no INFRA-02 task or receiver activation.

**Initial outcome: INFRA-01 PREPARED — RESOURCE OR MIGRATION APPROVAL REQUIRED**
