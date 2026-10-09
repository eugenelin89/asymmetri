# INFRA-01 — Cancellation and resource cleanup

**Current disposition, 2026-10-09: INFRA-01 CANCELLED — SNAPSHOT DELETED AND CLEANUP COMPLETE.**

The owner explicitly cancelled/deferred the Ubuntu 24.04 migration and chose to
continue on the existing Ubuntu 22.10 Droplet. This closes migration preparation;
it does not certify migration completion or a supported operating system. The
original Droplet, addresses, DNS, websites, applications and data remain in place.
No rebuild, upgrade, resize, replacement host, deployment, service restart or new
hosting expense was authorized or performed during closure.

## Decision and chronology

The original objective was Ubuntu LTS migration with acceptance of every existing
site. Preparation progressed from a replacement-host proposal to a same-Droplet
rebuild, then archival Django retirement as a possible simplification. Inventories,
encrypted off-server exports, a paid live snapshot, actual-data Mac recovery checks
and synthetic Ubuntu rehearsals were completed. Recovery limitations and failed
attempts remain in the [historical validation record](INFRA-01-VALIDATION.md).
Neither a rebuild nor Django retirement occurred.

The final owner instruction explicitly supersedes the rebuild plan and its snapshot
retention gate: retain the current server, remove the migration snapshot after
backup verification, clean disposable resources and resume separately requested
investment work. The reason recorded is the owner's choice to continue using the
existing infrastructure; no additional motive is inferred.

The [migration runbook](INFRA-01-UBUNTU-MIGRATION.md) and
[retirement proposal](INFRA-01-DJANGO-RETIREMENT.md) are historical plans, not active
execution instructions. Django retirement may be reconsidered independently with
new explicit approval. A future OS upgrade requires a separately requested project
and fresh recovery evidence; never silently reactivate this cancelled plan.

## Snapshot deletion receipt

| Evidence | Verified result |
| --- | --- |
| Exact snapshot | `infra01-pre-rebuild-20261009-live` |
| Identification before deletion | Created October 9 from the original production Droplet; SFO3; 11.23 GB; authenticated owner account matched prior receipt |
| Reference check | Both existing Droplets predated it; its recorded recovery purpose was cancelled INFRA-01; no other snapshot or active recovery dependency identified |
| Recovery precondition | All six encrypted archives in both retained off-server sets verified against trusted hashes and decrypted successfully before deletion |
| Action | Supported DigitalOcean control panel, exact-name confirmation, owner-authorized deletion |
| Absence confirmed by | October 9, 2026, 13:05:58 PDT / 20:05:58 UTC; observation time, not an invented provider action timestamp |
| Account inventory after deletion | Zero Droplet snapshots and zero volume snapshots; no duplicate INFRA-01 snapshot |
| Recurring storage eliminated | 11.23 GB × US$0.06/GB/month = approximately US$0.6738/month before tax |
| Already accrued charges | Not yet itemized: billing was last updated October 8 at 21:18 PDT, before creation. A US$0.01 short-lived snapshot minimum may apply. No refund or zero prior charge claimed |

The original two Droplets remain running; no new task-related billable resource
remains. Removing cloud snapshot storage does not reclaim the production root disk.
Deletion and billing evidence are retained privately. The deleted snapshot is no
longer a recovery option. See DigitalOcean's [deletion procedure](https://docs.digitalocean.com/products/snapshots/how-to/delete/)
and [storage pricing](https://docs.digitalocean.com/products/snapshots/details/pricing/).

## Inventory and measured cleanup

A restricted inventory classified all 155 significant pre-closure files before
removal; the new closure receipts are additional retained evidence. No uncertain
item was removed. Required independent copies take precedence over deduplication.

| Resource | Location | Measured size | Classification and action |
| --- | --- | --- | --- |
| Six primary and six independent encrypted archive copies | Restricted Mac recovery storage | 2,758,545,568 ciphertext bytes | Essential reusable backups; preserve all 12 |
| Two recovery-key files | Restricted Mac recovery storage | 194 bytes total | Essential decryption information; preserve, never publish contents |
| Recovery manifests, checksums, indexes, receipts and historical evidence | Restricted Mac recovery storage | 92 files; 27,593,032 logical bytes | Historical recovery evidence; preserve |
| Recovery/validation scripts | Restricted Mac recovery storage | 43 files; 120,977 logical bytes | Reusable source/scripts; preserve |
| Generated ownership fixture and Python bytecode cache | Mac recovery workspace | Five files; 29,477 logical bytes | Disposable test material; deleted after exact inventory/hash checks |
| Duplicate Django test log | Mac recovery workspace | One file; 1,747 logical bytes | Byte-identical to retained receipt; redundant verified copy deleted |
| Large test image, temporary key/venv, source copy and Linux package bundle | Mac | Already absent | Earlier cleanup verified; not counted again |
| Task rehearsal directory, units, processes, packages, credentials and databases | BotSquad HQ | No remnants found | Earlier 1,733,402,849-byte cleanup remains complete; no new deletion |
| Task staging files, units and processes | Original production Droplet | No remnants found | No deletion; preserve application rollback and 2 GiB swap |
| Exact migration snapshot | DigitalOcean | 11.23 GB | Temporary billable storage; deleted as above |

**New Mac cleanup:** six files, 31,224 logical bytes and 49,152 allocated bytes
(48 KiB), plus their empty fixture/cache directories. Observed system-wide free
space increased 32,768 bytes; concurrent activity/APFS accounting prevents treating
that change as an exact physical attribution. **New HQ and production reclamation:
zero bytes.** No broad cleanup, package purge or production data deletion occurred.

## Preserved recovery and application data

Retained encrypted sets cover configuration/sites and source/settings/static files,
consistent active SQLite, the complete inactive PostgreSQL 14 cluster, retained user
environments, public-access configuration and the supplemental PG TLS dependency.
Trusted manifests, checksums, both decryption copies, scripts, indexes and historical
receipts remain protected outside Git. No private production payload went to HQ.

Fresh verification checked trusted ciphertext SHA-256 before decryption, fully read
all archive members against trusted content/metadata manifests, and tested the copied
SQLite integrity and foreign keys in memory. **All 12 archive copies passed.**
No plaintext export was created for closure. CBC encryption is not authenticated;
continue using independently trusted hashes before decrypting.

Both off-server sets are on the same Mac, so separate-device/custodian disaster
protection remains unverified. These are historical recovery points while the live
application remains writable. The prior actual-data Mac and synthetic Linux tests
do not prove full private-cluster runtime recovery or an Ubuntu rebuild. Preserve
those limits; cancellation does not promote incomplete tests into acceptance.

Django/Gunicorn and its socket, SQLite, both domain behaviors, Nginx, shared
`django-user`, OS/application runtimes, dormant PostgreSQL data and encrypted archives
remain unchanged. Retirement was evaluated but **not executed**. No final write freeze
or service change was necessary for this cleanup.

## Non-disruptive closure verification

- Original Droplet identity, public addresses and Ubuntu 22.10 unchanged.
- All 198 baseline requests across 15 named hosts match expected behavior, including
  existing error/retired responses and protected Motion URLs; this is not an all-200 claim.
- A/AAAA/CNAME destinations unchanged after ignoring DNS cache TTL; all 15 host TLS
  identity/validity checks pass and certificate fingerprints match.
- Nginx syntax passes. Next, Nginx and Django master PIDs/start times and service
  users/states are unchanged; Django socket remains active; PostgreSQL remains inactive.
- Production source/build, rollback presence, network listeners and 48 Nginx/service
  file content, ownership and mode fingerprints match before/after closure.
- BotSquad service identity/start time, listeners and installed package inventory match
  prior evidence; no rehearsal resources remain. Current directory/unit ownership and
  modes are consistent with production use (root-owned application/unit, private
  service-owned state). No earlier filesystem-mode baseline was captured, so full
  before/after permission equality is not claimed. No HQ data or permissions were changed.
- Receiver remains undeployed/default disabled; no receiver unit or new authority.
- Root filesystem remains about 44% used, with 14,537,629,696 bytes available at the
  final sample. This is an observation, not capacity acceptance for a future receiver.

Exact host inventories and private evidence stay outside Git. No service restart,
DNS edit, Nginx edit, port opening, database modification or additional cloud purchase
was used to obtain these results.

## Time-limited unsupported-OS exception

The owner accepts continued operation on Ubuntu 22.10 for now. Ubuntu confirms
[end of life on July 20, 2023](https://lists.ubuntu.com/archives/ubuntu-announce/2023-July/000293.html);
normal security maintenance is unavailable. Operation is not evidence of security.
The exception must be reviewed **before the next deployment or new public exposure**.
No calendar expiry was supplied; do not invent one or treat this as a permanent waiver.
Reasonable compensating controls require separate authorization and cannot replace
missing OS security patches. A future upgrade remains a separate owner decision.

INFRA-01 completion is no longer an automatic prerequisite for local investment
work or INFRA-02 planning. Before any separately authorized receiver/website deployment:

1. Verify actual Node.js 22 and SQLite/native-driver compatibility on the selected
   Ubuntu 22.10 host, including filesystem durability and the exact pinned release.
2. Verify Nginx reverse proxy and signed-request bytes, TLS, least-privilege identity,
   isolated storage and bounded exposure while preserving all existing services.
3. Measure CPU, RAM, swap and disk headroom with realistic workload/build overlap;
   1 GiB host adequacy for the added receiver is not established by idle samples.
4. Establish current independent backups, restore/fencing evidence and rollback.
5. Review the unsupported-OS exception, document residual risks and separately approve
   any compensating controls, resource expense or public activation.
6. Keep receiver/publishing default disabled and require explicit deployment authority;
   verify publication rights and preserve Decision 029's US$0 market-data ceiling.

INV-01 remains complete; INV-02 remains implemented and locally validated, not deployed.
INFRA-02 is not started; INV-03 and later/Ask milestones remain planned. Local INV-03
may proceed only when separately requested. This closure starts no next milestone.
