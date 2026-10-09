# INFRA-01 validation — 2026-10-09

**INFRA-01 PREPARED — RESOURCE OR MIGRATION APPROVAL REQUIRED**

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

**INFRA-01 PREPARED — RESOURCE OR MIGRATION APPROVAL REQUIRED**
