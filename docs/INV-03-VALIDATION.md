# INV-03 — Acceptance and inherited-issue disposition

Date: October 9, 2026. Status: **archive validated; private compatibility install
completed; remaining activation dependencies documented**. No public website or
receiver release, real publisher, market collection, paper trading, Ask, OS migration,
DNS/certificate change, paid service or unrelated production restart occurred.

## Source and evidence boundaries

Asymmetri started clean on synchronized main `193dc1fcf9d973506dadb68b3732cf47d44d1b9a`.
[Journal 055](prompts/055-platform.md) records the resulting exact implementation
commit and two-commit integration. Installed source is the same implementation;
`/opt/asymmetri-receiver/SOURCE_COMMIT` records its full SHA, and a 75-file source/
compiled-output SHA256 receipt verifies installation separately from Git integration.
Previous installed source was `a38696e9efb4d55dff1835d4dbb674454332170d`.
The public website remains at `745a92c676bcbe85c3aa675a1099d26321f1c1e2`.
These were sequential updates, not a cross-repository/host atomic transaction.

Contract 1.0 remains pinned to BotSquad `ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755`,
manifest `7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`.
Migration 001 is unchanged:
`f3bb5c4d6478c41ad4db172ea50065f2db34b252dc0aa75b5129bb1ec8c98bc1`.
Additive 002: `01a88a836252db81aaeccc61b6fde80d524cd5eaa0f468a273043f1ec8861748`.
All new identities, discussions, prices, reports, images and keys used in tests are
synthetic. Private raw evidence/screenshots are retained outside both repositories;
no private infrastructure inventory, key or response body is published here.

## Acceptance executed

| Check | Actual result |
| --- | --- |
| Local receiver build/tests, Node 24.10.0 | 200/200 pass, final candidate; includes prior 183 regression cases |
| Actual Ubuntu 22.10 / Node 22.23.1 receiver tests | 200/200 pass, 78.14s; SQLite 3.53.4 |
| Installed Nginx 1.22.0 isolated TLS stream/SNI | 62/62 pass, 18.97s; verified TLS1.2/1.3, ALPN, ordinary-site fixture |
| Same installed Nginx HTTP proxy negative profile | 48/52 pass; three deliberately retained failing subcases plus parent, 19.6s; rejected |
| Isolated low-disk tmpfs | 1/1 pass; 8MiB mount, leave 512KiB free, reject upload 503 without event mutation, accepted receipt survives; mount removed |
| Linux confinement probe | UID/GID997, no elevated groups/capabilities, no-new-privileges, 10 hidden paths, root-owned code unwritable, fsync/atomic rename and loopback work, nonloopback denied |
| Sustained/overlap/restart/full restore | Results below; actual constrained host, disposable private datasets only |
| Website TypeScript/ESLint | `npm run check` passes; existing tutorial image lint warning remains |
| Standard Next compatibility | `npm run build:next -- --webpack` passes; default Turbopack attempts failed environment EPERM on local process/port startup, not silently reported as passing |
| Sites/Vinext build | `npm run build` passes; no hosted preview/publication |
| Production dependency audit | Root and receiver each 0 vulnerabilities (`npm audit --omit=dev`) |
| Infrastructure Python tests | 16 cases: 14 pass, 2 documented platform/dependency skips |
| Whitespace/privacy/reference review | `git diff --check` and targeted content/secret/prohibited-reference review pass; no public asset/real athlete/private sports data added |
| Existing public site preservation | Fresh 228 before/after probes across 15 hosts, all unchanged; details below |

A03/A06/A07 cover artifact lifecycle, registry accounting, exact immutable versions,
relationships, safe verified downloads, owner withdrawal/correction, recoverability
and human views. A02/A09 regressions cover finite scope/expiry/rotation/revocation,
canonical signing, replay/idempotency/conflicts, financial predecessors, bounded
reads, generation fencing and cursor invalidation. This is synthetic acceptance,
not evidence of actual workers, provider rights or a trading system.

Formats exercised are Markdown, UTF-8 text, JSON, CSV and normalized RGBA8 PNG.
Negative cases include HTML/script/SVG/unsupported formats, invalid JSON/UTF-8,
formula-like CSV, MIME/hash mismatch, path traversal, oversized content, PNG trailing
compressed bytes and inflation bounds. Published bytes are SHA256 verified, never
served by hash-only lookup or public CAS directory. A near-limit stalled PNG
connection was observed active at 500ms and closed by the absolute 15s deadline.
Withdrawal was injected before headers and between chunks, including shared-byte
aliases, prior registrations and replay after restoring older controls. Already
transferred bytes cannot be recalled. Revocation does not claim remote erasure.

Observed-paper negative tests use actual signed writes: an approved run does not
substitute for exact artifact metadata/rights approval; absent, wrong-run and altered
metadata approvals fail before public acceptance. Synthetic fixtures do not need or
imply real source permission. Correction releases cross only their own supersedes
edge, never a hidden arbitrary source dependency. Owner/system discussion actors,
worker membership, ordering, replies, evidence/challenges, synthesis, dissent,
unresolved matters and terminal closure are checked.

Independent read-only archive, ingress and website/PR reviewers reviewed changes;
only the integration writer edited. Findings corrected include prepublication
withdrawal resurrection, incomplete-restore startup, encryption interrupted-final
publication/size symmetry/empty input, and mid-render metadata visibility. Final
reviews found no private-install blocker. Their public integration gates remain.
Early Node22 directory-copy incompatibility, read-only candidate test-location and
candidate group-permission failures were corrected and rerun. An initial install
preflight assumed a native build/audit-helper path absent in the old release; it
stopped before mutation and was replaced with verified prebuilt/CLI paths. These
failures are retained in private evidence; they are not counted as passing runs.

## Human view verification

Local isolated synthetic preview exercised artifact widths 320, 390, 768, 1024,
1440 and 1920px, plus discussion at 320/768/1440px: no horizontal overflow.
All five formats rendered, including literal escaped HTML, a normalized PNG and
96,143-character report. Waiting, failed, withheld, withdrawn, missing, malformed,
superseded and cursor-reset states were exercised. Independent discussion pagination
reached topic 22. Exact-version evidence/reply/record links and safe download headers
were checked. Backend loss showed unavailable state with persistent synthetic label.
Keyboard Tab reached the skip link with visible outline; semantic headings/landmarks
were inspected. No browser console errors/warnings. New archive CSS adds no motion;
existing reduced-motion rules were reviewed, without claiming an OS preference or
screen-reader-device audit. Default unset configuration showed no published experiment.
Screenshots are private evidence, not new public brand assets. Local previews stopped.

## Ingress result and restrictions

`INFRA02_NGINX_MODE=tls node --test deploy/nginx-acceptance.test.mjs` passes the full
isolated design. The HTTP mode remains an intentionally rejected regression:
HTTP/1.0 is normalized and accepted (200), duplicate Connection is hidden and accepted
(200), and a keep-alive pipeline's distinct signed sentinel mutates durable state.
The failed parent is the fourth reported failure. No assertion was weakened.

Stream SNI routing and stream TLS termination preserve the transport to Node's
strict HTTP parser and canonical signature verification. One-request-per-socket
admission prevents pipelined hidden writes; duplicate/framing/authority/path/signature,
TLS trust, hostname, protocol and ALPN cases pass. See [the ingress record](INV-03-INGRESS.md)
for exact scope. **Complete isolated transport accepted; complete production/shared443
integration not accepted or activated.** Real authority/certificate, all-vhost IPv4/IPv6
listener migration, trusted client-IP preservation, Certbot renewal, handshake budgets,
rollback and an owner-approved activation check remain. The current website loopback
Host and future public signed authority additionally need an explicit trusted
server-side mapping and tests; strict receiver Host equality must remain.

## Capacity: measured bounded workload, not a public maximum

The production-sized host has one CPU, approximately 1GiB RAM, 2GiB swap and 25GiB root.
The disposable receiver used the installed confinement with MemoryMax256MiB,
MemorySwapMax64MiB, CPUQuota50% and TasksMax32. A separate low-priority monitor enforced
available memory>=180MiB, swap growth<96MiB, disk>=2GiB and stop after repeated public
site errors or >3s latency; a systemd runtime deadline also bounded tests.

953.199 seconds (22:39:28.014–22:55:21.213 UTC), 60 rounds with 15s pacing and idle
periods: 1,894 events, 62 artifact versions, 7 registry entries, 1,800 additional
contributions, 3,237,147 logical event bytes and 3,414,567 content bytes. Uploads mixed
text (~63KiB), JSON (~44KiB) and PNG (~65KiB); 240 reads in groups of four, pagination,
6 idempotent retry sets and 6 passive checkpoints. Only generated keys were used,
then fenced. Follow-up contention added four events for recovery at 1,898 events.

| Metric during sustained workload | Observed |
| --- | --- |
| Peak receiver cgroup / RSS / swap | 92.98MiB / 121.34MiB / 1.004MiB (different sampled accounting) |
| Minimum host available RAM / disk | 319.92MiB / 13.424GiB |
| CPU / throttled time | 142.181s / 123.244s across 2,605 throttled periods |
| Maximum main DB / WAL / archive disk | 7,852,032 / 1,442,032 / 12,761,886 bytes |
| Maximum open FDs / minimum free inodes | 30 / 2,893,409 |
| Write p50 / p95 / max | 2,779 / 4,604 / 5,220ms |
| Four-concurrent-read p50 / p95 / max | 701 / 2,891 / 3,479ms |
| Existing production home p50 / p95 / max | 67 / 138 / 186ms, all 200 |
| OOM kills / automatic threshold aborts | 0 / 0 |

A later 48-request benchmark on the final candidate against the same larger archive
measured p50 1,132ms, p95 3,498ms and max 4,298ms. Removing unnecessary JSON parsing
was correct but did not establish a latency improvement. Report both runs.

Provisional engineering envelope is limited to this tested synthetic size (about
2,000 events/3.4MB content), four batches of about 30 events and four uploads per minute,
and groups of four reads at the tested pacing. This is a bounded low-rate private
workload, not a throughput or latency SLA. Do not infer that configured 16MiB run/
64MiB archive/256MiB CAS ceilings have been capacity-qualified. Larger archives,
sustained TLS handshakes, burst/concurrent visitor traffic and integrated webpage
read fan-out require further measurement/optimization and separate activation review.

## Recovery and custody

Four write/read overlap rounds held an external SQLite writer lock for 300ms while
one signed batch and three paginated reads overlapped; all passed, 1.93–2.32s per
round, without partial state. Finite key rotation reconciled a lost receipt through a
fresh generation, suppressed identical retry, rejected conflicting receipt bytes,
revoked old authority and reset old cursors. Graceful restart and SIGKILL preserved
1,898 events/66 batches and the exact receipt digest. Only a verified dead test PID's
stale lock was removed; no operational lock was bypassed.

A complete consistent SQLite/CAS/config/control/watermark snapshot contained 65
manifested files. Restore into a fresh private target verified every hash, full
integrity/FKs/content, fenced all publishers/keys, held reads, then reconciled a
withdrawal newer than the backup. Manifest digest was independently passed to restore.
An 11,335,680-byte snapshot tar sealed to 11,335,716 bytes and authenticated back to
the identical SHA256; the ephemeral key and encryption-test files were deleted.
Interrupted encryption/decryption, tamper and oversize rejection also passed actual
Node22 tests. The empty operational schema001/code/config/unit was separately retained
and hash-verified for receiver-only rollback before the schema002 installation.

These are synthetic recovery drills, not operational offsite backups. The owner later
approved deletion of both historical Mac backup copies and their recovery records/keys;
the cloud snapshot had already been deleted. No independent destination is verified.
[Operations](INV-03-OPERATIONS.md) proposes daily+prechange backups, 24h ordinary RPO,
current-control exports on each visibility action, target2h RTO, 7daily/4weekly/3monthly,
monthly synthetic/quarterly representative restore and three separately held copies.
No schedule, cost, destination or notification channel was activated. RTO is a target,
not a measured recovery promise. Real HQ reconciliation remains INV-07.

## Existing production preservation and final private state

Fresh before/after manifests cover 180 site/API/route requests and 48 original tutorial
image requests across 15 hosts. All 228 match status, TLS and relevant redirect/
canonical/text/link/resource/image hashes. This is a fresh broader manifest, not a
claim to have rerun the deleted historical 198-request manifest. `/privacy`, `/support`,
`/tutorial`, `/motion`, apex/www, the exact tutorial canonical, hashes and original
images remain available. Public receiver routes remain absent. DNS/certificate
fingerprints, Nginx/firewall/renewal/unit files, public website HEAD/build and production
PIDs match. Existing Django remains running; dormant PostgreSQL remains untouched.

Operational receiver: schema002, full integrity OK/FK empty, WAL, synchronous FULL,
foreign keys on; zero publishers, keys, runs, events, batches, nonces, content and
approvals/controls. Root-owned code and existing native SQLite binary verified.
Configuration false, explicit marker absent, unit inactive/static, no receiver socket.
Temporary acceptance units, listeners, mounts and private synthetic runtime datasets
are removed after evidence collection; no production website service was restarted.
Ubuntu22.10 remains unsupported under the retained owner exception; re-review before
any new exposure/deployment. This milestone does not provide OS security support.

## Inherited issue closure table

| Issue | Original limitation → correction and executed result | Disposition / remaining owner or milestone dependency |
| --- | --- | --- |
| Nginx duplicate headers | HTTP proxy normalization → preserved failing regression; strict stream TLS passes62; HTTP still48/52 | **Implemented but activation testing remains** — shared443 integration must replace rejected HTTP mode |
| TLS/ingress | Plain stream alone lacked TLS proof → verified TLS1.2/1.3/SNI/ALPN and adversarial requests | **Implemented but activation testing remains** — real certificates, renewal, IP/authority mapping, listener rollout and capacity |
| Sustained capacity | Short probe insufficient → 953s/1,894 events plus overlap/48read follow-up, thresholds respected | **Resolved and tested** for bounded private envelope only; larger/public envelope deferred to exposure gate |
| Backup/restore | Incomplete operational proposal → full65file restore/fence/current-control, encryption/tamper/crash/restart tests pass | **Resolved and tested** for synthetic mechanisms; live recovery and RTO acceptance remain activation gates |
| Independent custody | Old copies shared one Mac and were subsequently deleted | **Blocked by a specific technical or owner-dependent prerequisite** — owner-selected independent destination/key custody |
| Schedule/retention | No live schedule or accepted retention policy | **Blocked by a specific technical or owner-dependent prerequisite** — concrete reviewed proposal requires owner choices/authorization |
| Publisher credentials | No operational grant → finite synthetic expiry/rotation/revoke tests pass, operational0 | **Deferred to a named future milestone** — real authority provisioning at INV-07/launch, never inferred from tests |
| HQ reconciliation | Receiver-only proof → synthetic uncertainty/duplicate/conflict/new-generation tests pass | **Deferred to a named future milestone** — real HQ outbox integration and recovery INV-07 |
| Market source/public rights | No approved real provider → signed exact-approval negative cases pass; US$0 unchanged | **Deferred to a named future milestone** — INV-06 provider automated/derived/public-use evidence |
| Ubuntu22.10 exception | Unsupported retained host → actualNode22/native/isolated install reviewed and tested | **Resolved and tested** as exception review only; OS support remains absent, migration independent |
| PR35 | Reviewed infrastructure history outstanding → docs-only review and merge7cd52672ab1de1dc687d6aeebc718919760ac2e5 | **Resolved and tested** — accepted on BotSquad main |
| PR36 | Stacked/stale index/version/whitespace → corrected, retargeted, reviewed and merge8a150eb47cd1f1cbc9b5cb3178775ae656052fdf | **Resolved and tested** — no force push or HQ changes |
| Existing-site preservation | Risk to15hosts/protected routes → fresh228requests and configuration/PID/build comparisons pass | **Resolved and tested** — no public release or unrelated restart |
| INV-03 archive | Downloads/human archive incomplete → lifecycle/relationships/visibility/recovery/5formats/UI plus200tests pass | **Resolved and tested** — source/private install; website publication remains disabled |

## Handoff

INV-04 is ready for a separately requested fixture-based read-only showcase/dashboard
packet. It must retain synthetic truth states and cannot claim public launch readiness.
Public ingress requires the complete topology/authority/renewal/capacity/custody gates.
Real HQ publishing requires INV-07, real worker/capability scope and owner grants.
Real market collection requires INV-06 rights under Decision029 US$0. Official paper
trading requires validated simulator/ledger/calendar/actions/benchmark, worker evidence,
recovery and explicit run/budget activation. Ask requires its separate INV-ASK contracts,
provider/account clearance, session privacy, quotas and actual employee responses.
Full public Showcase requires completed applicable packets, company-site preservation,
privacy/rights/security review and explicit owner release/activation. None starts here.
