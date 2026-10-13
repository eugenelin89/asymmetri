# Closed Ask operational safeguards and morning handoff

October 13, 2026, 21:08 UTC (14:08 America/Vancouver). Website-owned safeguards
are installed on the original production host. Ask is still closed: availability
returns `disabled`, session creation returns 503 `UNAVAILABLE`, neither sets a
cookie, and both use `private, no-store`. All content, authority and recovery
records remain empty; generation zero and its entire metadata hash are unchanged.
Volatile HTTP quota counters are excluded from that equality check.

## Installed identity and scope

| Boundary | Verified result |
| --- | --- |
| Ask application | Unchanged source `4daa713cd848f3798b87169ed3694bf2be0332f7`; PID 2388788, active 21:08:26 UTC |
| Ask configuration | Unchanged SHA-256 `ae4a0bb70ac41a58f28c0d5d9bc5c44fae6869ad5afdc43b4ba3081f75913e5c`; listener enabled, admission/claims/delivery false, empty worker roster |
| Website | Unchanged source d0c4543, build `P7LP4PKXMUyZ96RJnAgcz`, PID 2386085 |
| Investment receiver | Unchanged PID 2385469, finite publisher/key, official run, existing accepted events/batch and journal |
| Shared services | Website, investment, ingress, Nginx and gunicorn PID/start identities preserved |

The exact live experiment/run remain
`16496aa38732845beeea0a75f4614b93136be792accbb4e0` /
`0f6ea49caee91243f2f028a8ddde55abaa68faaaa2de453c`. The initial configured portfolio
and Atlas/Maya roster remain public. This operation did not restart or replace
that investment. It did not change website source/build, TLS, ingress, account
settings, keys, grants or privacy disclosures.

## Memory safeguards and rollback

The Ask-only drop-in is
`/etc/systemd/system/asymmetri-ask.service.d/30-memory-privacy.conf`, SHA-256
`e6a77172896ac32a4358886047f4dd9b5b7b54774fce48184d002ff023b9a4af`.
It sets `MemorySwapMax=0`, `LimitCORE=0`, `CoredumpFilter=0x0` and starts the
unchanged Node command through `/usr/local/libexec/asymmetri-ask-private-exec`.
The root-owned 0755 launcher comes from `receiver/deploy/ask-private-exec.sh`,
SHA-256 `c6bde5929800ed224c6ba35759091a24f1b46848da0227b5837b8e5efe4f738c`.
MemoryMax 192 MiB, Node heap 96 MiB, CPU quota 25%, TasksMax 32 and existing
namespace/network restrictions remain.

The actual live process reports core soft/hard limits 0/0 and
`/proc/PID/coredump_filter` equal to `00000000`. Its cgroup reports both swap
maximum and current use as zero. This is verified process behavior, not merely a
unit-file setting. On this systemd 251 host, `CoredumpFilter=0x0` alone left the
filter at `00000033`. The [upstream v251 parser](https://github.com/systemd/systemd/blob/v251/src/core/load-fragment.c#L691-L725)
sets the wrong state flag; the launcher explicitly writes, verifies and inherits
the filter before Node reads private input. LimitCORE alone is not sufficient
for every pipe-based core handler. No whole-host core handler was changed.

Rollback is the root-held `cutover.py rollback` in the evidence directory below.
It checks the exact task-owned drop-in before removing it, reloads systemd and
restarts only Ask. It preserves source, configuration, live database and recovery
copies. The launcher may remain unused after rollback. Previous application
rollback material is unchanged. This hardening cutover did not need rollback;
its controller retains an automatic rollback path for a failed start/read-back.

## Linux acceptance and limits

`receiver/deploy/ask-readiness-acceptance.test.mjs` runs against an explicitly
selected compiled receiver using `ASK_REHEARSAL_RUNTIME`. In host acceptance,
`ASK_REHEARSAL_CONFINED=1` also checks actual core limits/filter and denial of
both live databases. It uses authored disposable content, temporary private
stores and loopback listeners; no genuine model, visitor or investment work.

The isolated unit uses the live Ask UID, the same 192 MiB/25% CPU/32-task limits,
zero swap and the launcher, with only code/test tools mounted. `/var`, `/run`,
`/opt` and `/srv` are masked; neither live store nor configuration is mounted.
It runs Node with `--test --test-concurrency=1` against the three compiled Ask
files and this acceptance file. Runtime is bounded at 180 seconds. Monitoring
stops the fixture if host available memory falls below 192 MiB, free disk below
8 GiB, or a public health probe fails. Exact unit profiles remain in the receipt.

- The first run passed 28/29: the direct core-filter setting failed. Actual
  interrupted backups and concurrent reads passed. Its log is retained. The
  observer also encountered an unsupported `MemorySwapCurrent` systemd property;
  that first swap measurement is unknown, not zero.
- After adding the launcher and reading the cgroup's `memory.swap.current`, all
  29 passed in 80.9 seconds (82.1 seconds observed). Peak measured memory was
  93,016,064 bytes, measured swap zero, minimum host MemAvailable 291,332 KiB.
  Seventeen public health probes passed; all live service identities stayed fixed.
- Twenty simulated owned views performed 80 refreshes, six requests in flight,
  all returning 200. Observed p50/p95/max were 132/309/324 ms. Ordinary quota
  exhaustion then returned 429 while cancellation returned 200 in 100 ms and
  signed HQ control synchronization returned 200. Frozen fixture time puts the
  requests in one quota window. This is not a production concurrent-user promise.
- Actual child SIGKILL faults immediately after `INCOMPLETE` and after manifest
  creation left no synthetic private-text sentinel in any copy. Interrupted
  restoration failed. The final harness additionally uses the valid manifest
  digest and requires `UNAVAILABLE`, proving rejection is due to the unfinished
  copy rather than an unrelated checksum mismatch. All three strengthened host
  fixtures passed again in 23.7 seconds, with five more successful public probes,
  91,717,632-byte peak measured memory and zero measured swap.
- Existing focused tests cover SQLite/WAL purge, cancellation/expiry races,
  session/key retirement, generation advances and fresh control barriers.

Before/after shared-host acceptance covered 112 observations: 104 verified HTTP
responses, four unchanged fallback certificate fingerprints and four pre-existing
IPv6 TLS failures. Their exact failure/certificate/read-through fingerprints
matched; they are not successful TLS results. Protected Motion pages had identical
body hashes on apex and www. Tutorial canonical, hashes and 48 original-image
reads were preserved. Ask had no form; investment retained its real configured
records. No image, animation, layout or visitor rendering changed.

## Actual recovery custody, retention and exclusions

Root-held mode-0700 evidence:
`/var/lib/asymmetri-ask-readiness-ops-20261013`. It retains all three fixture attempts,
resource samples, public checks, process/config hashes, current control journal,
cutover/rollback scripts and checksums. Files use mode 0600. No question bodies,
cookies, private keys or credentials are retained in these receipts. The final
33-file evidence manifest SHA-256 is
`8b632a44221321984475f0a955be2ea26d9ab0fe9b033eb78d9980cd3ca8a689`.
All three temporary units, their staging tools and task-owned temporary uploads
were removed after completion; copies of the final harness and launcher remain
in the private evidence directory. Directory/file modes were rechecked as 0700/0600.

The Ask-owner mode-0700 recovery tree is
`/var/lib/asymmetri-ask-recovery-20261013`. With only Ask stopped, the installed
owner CLI exported current controls, created `before`, and restored to separate
`restore-check`. Backup canonical manifest digest:
`07803260a4f6071b5c2742deb8b1c8a3c1c5b010a43f4451c98b7146b044ba28`.
The separately retained current journal file SHA-256 is
`f5d449b17772eec141a02f0525a27f01be369fe7de1eab0340fcbb9b1a62733d`.
These are different hash domains; do not substitute the file SHA for a canonical
reconciliation digest. Integrity/FK checks passed. Restore is generation 2,
held, all four flags false, no active key. The live source remains generation 0.

Only the fixed non-content recovery projection is permitted here. It excludes
raw question/status/context/answer bodies, transport caches, session credentials
and active authority; it retires sessions and fences the copy. Never copy the
live SQLite/WAL tree into an investment, public website, source or transcript
backup. Path separation is enforced in configuration and backup/restore code.

Live access is limited to the dedicated service identity and privileged host
operators. The root filesystem is ext4; this receipt establishes no disk
encryption or physical-media erasure. The installed illustrative configuration
uses 24-hour sessions, seven-day raw retention and 30-day suppression. Request
cleanup plus the 30-second sweep performs managed SQLite purge; those disabled
example values are not an approved public data-retention promise. Minimal hashes,
IDs and suppression receipts remain private even without text.

The receiver logs safe request IDs/codes/status without request bodies. Nginx access metadata
can include IPs and paths and uses daily rotation with 14 retained rotations and
delayed compression. Journald has no explicit Ask retention override. This work
establishes neither absolute log deletion nor provider-side erasure. General
machine snapshots, external host backups, encrypted off-host custody and scheduled
recovery-copy retention were not verified. The inspected timer list showed only
`dpkg-db-backup` among backup/snapshot/Ask matches; this is not evidence that all
cron jobs or provider snapshots exclude Ask. Keep those custody gates open before
visitor intake, and do not describe these same-host copies as disaster recovery.
No recurring backup job or disposal policy was silently created.

## Restart and generation procedure

An ordinary restart preserves the live generation, epoch, receipts and suppression;
it does not grant fresh authority. Stop only Ask for offline CLI operations and
respect its exclusive lock. Never remove a lock belonging to a live process.
For a recovery, use a new isolated destination and a verified manifest. Keep the
restored configuration disabled and held; never overwrite live data with the test
copy. Obtain the current independently retained privacy journal and canonical
digest, captured within five minutes, and reconcile before issuing new authority.

Backup advances N to N+1; restore fences again to N+2. Reconciliation advances
above both generations; a new finite grant must then advance again. Prior keys,
cookies and claims remain retired. Complete a fresh current-generation control
barrier before enabling claims, delivery or admission, and reconcile HQ's own
privacy journal and retained attempts independently. An ordinary restart cannot
reset daily execution accounting or uncertain provider outcomes.

The cold empty generation-zero journal is not a positive canonical `Sequence`;
this actual restore therefore remains held. No generation or journal was invented
to bypass that boundary. The separate nonzero-generation synthetic tests verify
successful reconciliation and renewed barriers. Actual both-store recovery and
HQ provider suppression remain unproven.

## Remaining handoff

Website-owned memory spill, bounded request reserves, interrupted-copy exclusion,
current empty-state recovery and protected-route preservation now have host
receipts. Genuine combined HQ/receiver capacity, operational HQ custody/restore,
public-service eligibility, complete usage accounting, finite authority and the
reviewed public disclosure remain open. Keep intake closed and the notice registry
empty. See the [canonical capability consumer plan](ASK-04-CAPABILITY-REVIEW.md).

Local Node 24.10.0 syntax and TypeScript/ESLint checks passed (one existing
tutorial navigation warning). Whitespace validation passed. Application source,
dependencies and builds were unchanged; installed compiled Ask tests and actual
Linux service-profile acceptance were the relevant release checks.
