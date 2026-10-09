# INFRA-02 — Actual-host private receiver acceptance

**Accepted October 9, 2026:** installed and synthetically validated on the existing
Ubuntu 22.10 host; final service stopped/default disabled. No public ingress, real
publisher, HQ connection, market collection, INV-03 or Ask activation. Operational
procedures and remaining gates are in the [deployment record](INFRA-02-RECEIVER-DEPLOYMENT.md).

## Source, runtime and final state

- Installed runtime source: `a38696e9efb4d55dff1835d4dbb674454332170d`; all 36 tracked
  receiver files rehashed after cleanup. Its receiver subtree equals accepted
  INV-02 `457f9354b3f8daf5c4c75b8f5ac1946433da3ce0` byte for byte. New acceptance
  utilities were temporary host tooling and removed from the installed release.
- Contract 1.0: BotSquad `ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755`, nine files;
  manifest SHA-256 `7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`.
- Hardened installed unit SHA-256:
  `b38560721388226c3942c5e42a752ecb9124cd9f6b0311e4123a8ee7153c618a`.
  This unit is supplied by the INFRA-02 implementation commit; the installed runtime
  source receipt deliberately continues to identify the accepted earlier runtime.
- Receiver lockfile SHA-256:
  `cf95b07b20cd4c53edf83effd3fe46190fc88453802fe2de0aab66cc3d53656b`.
- Migration **001** SHA-256:
  `f3bb5c4d6478c41ad4db172ea50065f2db34b252dc0aa75b5129bb1ec8c98bc1`.
- Ubuntu **22.10**, kernel **5.19.0-46-generic**, x64, glibc **2.36**;
  existing `/usr/bin/node` **22.23.1**, npm **10.9.8**, systemd **251.4**, nginx **1.22.0**.
  Pinned better-sqlite3 **13.0.3** loads SQLite **3.53.4**; native shared-library
  resolution passed. No compiler, global Node/library or OS upgrade was needed.
- Dedicated non-login user/group `asymmetri-investment`, UID/GID997, no additional
  groups. Code `/opt/asymmetri-receiver/receiver` root-owned 0750/0640; config
  `/etc/asymmetri-investment/config.json` root:receiver0640; archive
  `/var/lib/asymmetri-investment`0700, SQLite0600, receiver owned.
- `asymmetri-investment.service`: **inactive**, `UnitFileState=static`, no Install
  target/enablement dependencies. `enabled:false`, marker absent; attempted ordinary
  start skipped with `ConditionResult=no`. No receiver/proxy listener remains.
  Configured future address is **127.0.0.1:3101**, never an external interface.
- Operational publishers, keys, runs, events, batches, nonces, content objects and
  publication approvals: **all zero**. RFC9421 Ed25519 authentication remains required;
  installation grants no authority. Test keys existed only in test-process memory.

## Reproducible checks and evidence

Private logs, full host inventories, DNS/TLS identities and baseline responses stay
outside Git. Git contains sanitized results and reusable acceptance source. The
primary writer retained failure and final logs; three independent read-only reviewers
inspected source and relevant private evidence. No evidence archive contains an
exported real publisher credential or an HQ key.

| Actual check | Result |
| --- | --- |
| Linux isolated `npm ci --ignore-scripts`, receiver check/contract/build | Pass; exact lockfile and vendored contract |
| Linux `node --test --test-concurrency=1 dist/test/*.test.js` | **183/183 pass**, no skips/failures; 52.5 seconds test time |
| Local Node24.10.0 `npm run receiver:check` and `npm --prefix receiver test` | Pass; **183/183** |
| Linux `node --test --test-concurrency=1 deploy/nginx-acceptance.test.mjs deploy/restore-acceptance.test.mjs` | **42/42 pass** (40 nginx subtests, parent, complete-directory restore) |
| Installed-profile isolated probe; `systemd-analyze verify` | Pass; real confinement, filesystem and network checks |
| Migration twice plus offline archive audit | Schema001 exact checksum; integrity `ok`, FK violations0; WAL, synchronous FULL(2), foreign_keys1 |
| Actual CLI graceful restart and SIGKILL/recovery | Pass; exact receipts/nonces/rows preserved and fresh-key reconciliation succeeds |
| Local `npm run check`, `npm run build:next`, `npm run build` | Pass; existing tutorial lint warning and Vinext classification notice only |
| Root and receiver `npm audit --omit=dev`; Linux receiver audit | Zero production vulnerabilities at check time |
| `git diff --check` | Pass |
| Original HTTP baseline before/after | **198/198 unchanged across15 hosts** |
| DNS/TLS, original service/configuration/source/build identity | Pass; original public application processes and releases preserved |

The 183-test suite includes helper/schema tests, not183 separate end-to-end scenarios.
It exercises valid/missing/changed/expired/replayed signatures, current scope/key/
generation, wrong run and revoked authority, protected receipts, unsupported events,
atomic ingestion, duplicate/conflicting/concurrent retries, financial dependencies,
out-of-order corrections and stale valuations. CAS coverage includes bounded hashes/
formats, oversized/interrupted writes, staging visibility and orphan recovery.

## Proxy acceptance and explicit failure boundary

A separate non-root nginx process used loopback, private configuration/PID/temp paths
and the existing stream module. No production server block or nginx reload was used.
Stream transport preserved exact signed method/path/Host/body bytes; verification
rejected changed signatures/digests/generation, expired requests, replay, wrong run,
revoked receipt access, duplicate headers, ambiguous framing/encoding, forwarded
authority spoofing, invalid targets and oversized bodies. Incomplete bodies closed
within the bounded proxy timeout. Fresh retries and concurrent duplicates converged.

The initial nginx **HTTP proxy profile failed**: duplicate `Connection` headers were
normalized before upstream checking and received200. The assertion is retained with
`INFRA02_NGINX_MODE=http`; this profile is **not accepted**. Accepted stream transport
does not prove production HTTP/TLS ingress. An exact real-ingress design and its
TLS/signature/framing acceptance remain mandatory before separate public activation.
This is the explicitly permitted deferred production-proxy gate, not a hidden pass.

## Durability, restart and restore

The Linux suite exercised real process-kill windows before/after SQL commit, before
response and after CAS rename. Committed receipts/nonces survive; uncertain retries
reconcile without a second effect. The additional stopped-directory restore copied
the complete SQLite/CAS tree, compared all file hashes, checked full integrity/FKs,
referenced CAS and exact receipts, retained withdrawal, and applied newer withholding
before reads. Fencing revokes old keys/scopes and resets generations/cursors; the
existing suite uses fresh disposable authority for signed receipt/retry reconciliation.

The actual systemd CLI drill retained **827 events/17 batches** after graceful stop
and SIGKILL, including exact receipt SHA-256
`aea91825da1b223b2595bd53bbe73cd63fc42904aa716879481910e41b826f74`.
Nonce count remained4 across graceful restart and6 across the killed restart. The
drill checks disabled/revoked old authority in SQL plus unsigned401; actual signed
revoked-key rejection is established separately by the integration/proxy suites.

SIGKILL leaves the exclusive CLI lock. Automatic restart fails closed. After stopping
the temporary unit, verifying the old process absent and preserving evidence, the
operator removed only the stale lock, checked SQL integrity and restarted explicitly.
Fresh temporary key/generation retrieved the original signed receipt and identical
retry. Final scopes/keys were fenced before cleanup; no fixture archive remains.

The runbook establishes a full stopped-directory backup/restore procedure, separate
configuration custody and receiver-only rollback. No paid snapshot or scheduled
receiver backup was created. Retention and recurring independent custody remain
unapproved for live data. SIGKILL/fsync tests do not simulate hardware power loss.

## Measured resource envelope

Host:1vCPU, **956.93MiB RAM**, **2048MiB swap**, root44% used. Preflight available
memory423.0MiB and disk13.54GiB. Dependency/build work was serialized, bounded and
separate from the live website. Receiver limits:256MiB memory,64MiB swap,50%CPU,
32tasks,128MiB V8 heap. Proxy used a separate confined unit.

Synthetic workload: golden27 events plus800 worker activities,17 total batches,
**1,329,448 bytes** stored event JSON. **240 reads at actual concurrency4**, paced
over60 rounds, plus ingestion/receipt/concurrent-retry work; **164.4 seconds** total.
314 resource samples and64 existing-site probes were collected.

| Measurement | Observed |
| --- | --- |
| Settled empty receiver idle after5-second startup,31 samples/30.05seconds | **25.64–27.66MiB cgroup**,25.6ms CPU total, no receiver swap |
| Workload receiver memory | **68.87MiB cgroup peak**,115.125MiB maximum RSS (includes shared mappings) |
| Stream proxy cgroup memory | **1.98MiB peak** |
| Receiver tasks | Maximum11 |
| Receiver CPU | **39.05 CPU seconds** over164.4seconds; quota throttling occurred as configured |
| Receiver/proxy swap and memory failures | Zero swap, zero memory-limit/OOM events |
| Host available memory | Minimum **322.14MiB** |
| Host-wide swap during load | **64 pages in /495 pages out** (256KiB/1.934MiB); not zero system swap |
| Receiver block I/O during load | 8,544,256 bytes written;90,112 bytes read |
| Database/WAL/SHM peaks | 2,334,720 /1,260,752 /32,768 bytes |
| Free disk minimum during tests | **13.379GiB** |
| Receiver read latency | p50 **492ms**, p95 **847ms**, maximum1030ms |
| Existing Next site32 probes | All200; p95 **163ms**, maximum168ms |
| Existing Django site32 probes | All200; p95 **150ms**, maximum179ms |

The earlier three startup samples spanned only0.081 seconds and are not claimed as
an idle interval; the later settled interval supplies that evidence. Results support
this bounded private installation, not maximum capacity, full16MiB retained-run
validation, sustained multi-publisher production sizing or a latency SLA. Measure
representative archive growth and long-running load before live traffic.

## Existing-site preservation and cleanup

The198-request baseline preserved100 responses200,65×301,12×308,14×404,2×302,
1×502 and4×410. Protected Motion routes, tutorial canonical/hashes/original assets
and footer/context links are covered by that manifest. All15 DNS/TLS identities and
certificate fingerprints remained unchanged. Seven installed certificates were valid
with31–87 days remaining; existing Certbot schedule/configuration remained intact.
No forced certificate renewal was performed. Apex and www still return the website's
ordinary HTML404 for a synthetic receiver API path. Final host available memory was
442.56MiB, disk13.51GiB free (44% used), inode use9%.

Original Droplet/address, nginx/TLS/firewall configuration, Next service identity,
Gunicorn master/socket, inactive PostgreSQL state, retained PG data and rollback
presence were preserved. Website checkout remains
`745a92c676bcbe85c3aa675a1099d26321f1c1e2`; active build remains
`Ic-zxi4WHpmgjiSDnsJCw`. No existing application/nginx restart occurred. Systemd
daemon-reload naturally reassigned manager descriptor numbers; ephemeral administrator
session sockets also changed. Neither represents a public listener or application restart.

All disposable test services/proxies were stopped; temporary units, test-only source,
dependency copy and synthetic archives were removed after authority fencing and
receipt reconciliation. Operational storage remains empty/private. No new public
receiver endpoint, firewall rule, DNS mapping, cloud resource, subscription or paid
snapshot was introduced. Historical recovery archives and swap remain preserved.

## Failures, corrections and independent review

- Initial local sandbox denied listening/network; authorized reruns passed. A Linux
  helper assumption about run-as-user sudo was corrected to the documented root
  `runuser` route; application installs still ran as the dedicated user.
- Review found `ProtectSystem` prevents writes but not private reads. Empty mount
  masks plus narrow bind-backs, inaccessible credentials and zero capabilities fixed
  this. The actual-host probe passed; a site-specific test path was replaced with a
  generic masked-directory check and rerun successfully.
- Proxy timeout accepted bounded connection closure rather than requiring an HTTP408
  from stream transport. HTTP duplicate-header failure remains explicit, not removed.
- First capacity fixture exceeded the schema's1000-character summary limit and was
  correctly rejected422. Corrected996-character synthetic summaries passed; the
  failed fixture was fenced and removed after evidence retention.
- Restart orchestration initially attempted `reset-failed` on a stopped unit that
  systemd had unloaded. Removing the unnecessary command allowed the final complete
  drill; changing the unit-name spelling alone had not fixed that earlier failure.
- Runtime/storage, signing/proxy, and isolation/preservation specialists reviewed
  read-only. Blocking isolation and privacy findings were corrected. Reports retain
  the HTTP-ingress, capacity, OS and recovery limits rather than overstating acceptance.

## Security exception and remaining gates

Decision030 was read on open BotSquad PR35 at
`e2f2caa0e3f267e412639a45e3c11cf7567134b8` before installation. Ubuntu22.10 remains
unsupported; least privilege and loopback reduce exposure but do not supply missing
kernel/OS security updates. The owner selected this narrow exception. INFRA-01
stays cancelled and a later OS project remains independent.

Public ingress/TLS, sustained representative sizing, retention/backup schedule and
independent custody, current finite publisher grants/key rotation, HQ outbox/receipt
reconciliation, real source/redistribution rights under Decision029'sUS$0 budget,
feature gates and explicit activation remain outstanding. No real-worker, market,
trading or Ask acceptance is claimed. INV-03 can be separately requested for local
synthetic implementation; this milestone does not start it.

**INFRA-02 COMPLETE — RECEIVER INSTALLED AND PRIVATELY VALIDATED; PUBLIC PUBLISHING DISABLED**

## Subsequent INV-03 remediation

This record remains the original INFRA-02 evidence. [INV-03 validation](INV-03-VALIDATION.md)
records expanded TLS, capacity, recovery and archive tests. The rejected HTTP proxy
regression is retained. Earlier retained-backup claims no longer establish present
custody: later owner-approved cleanup deleted both Mac backup sets and recovery keys.
