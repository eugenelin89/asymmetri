# Investment close-amendment release

The owner-authorized website and receiver release completed October 14, 2026,
with stable readiness verified at 16:06:35 UTC (09:06:35 America/Vancouver).
It installs the [one-session close contract and interface](INVESTMENT_CLOSE_RECOVERY_2026-10-14.md).
This receipt establishes compatible publication infrastructure. It does not
establish a live employee decision, fill or completed valuation.

## Installed identities

| Runtime | Source | Process / start UTC |
| --- | --- | --- |
| Website | `7dcbf3bea400f6a71d01927bc174d97692ee4e78` | PID 2414113 / 16:03:44 |
| Investment receiver | `7dcbf3bea400f6a71d01927bc174d97692ee4e78` | PID 2414008 / 16:02:27 |
| Ask receiver, unchanged | `6a194f040b70714de3b1281de5b58c1b8ad29579` | PID 2407630 / 05:29:56 |

Implementation: `b79d7a7d5058260f0f7c81aaf5ad881887ede5e6`. The installed source
includes separate prompt journal `7dcbf3b`. Website build:
`8OlCVsyW02asPY8CIxRly`. All three services reported zero automatic restarts.
Receiver health completed in 4.36 seconds; website health in 2.01 seconds.
Production Node 22.23.1 matches the verified build runtime.

Canonical HQ source is merged PR 95 commit
`fbd26f520e7403a469643ed350df5e08bbc1ec2b`; its exact nine-file manifest SHA-256
is `ff9c457580475583614541b76d9f0267ac2a15afff0f87f955acdff5f063e081`.
The independent generated-type check passed with the final source pin. Only
provenance metadata changed after the verified build; all other 246 manifest
entries match the final build inputs. All 247 final source entries matched the
committed production candidate.

## Validation and staging

The [source acceptance record](INVESTMENT_CLOSE_RECOVERY_2026-10-14.md) retains
the full results, including the earlier stopped compiler and failed stalled-socket
precondition. Final close tests passed 27/27; exact producer native HTTP/SQLite
checks passed 2/2, with signed ingestion, duplicate receipts, exact event hashes,
restart and withdrawal behavior. Both website targets, TypeScript/ESLint and
both production dependency audits passed. The existing tutorial lint warning
remains. Responsive authored-component checks passed at 390/768/1440 px.

The two exact producer projections also passed the pure consumer validator as
whole and incremental batches. HQ reported both full nine-instrument scenarios
passing, 640 regression passes with five conditional skips, and those five cases
passing separately against the final receiver. Original failed, stopped and
skipped attempts remain recorded distinctly.

The final Linux build retained at least 973,836 KiB available RAM under its
384 MiB guard, without changing live HQ or Nginx identities. No compiler or
dependency installation ran on the website host. The production candidate was a
clean application-owned clone of the pushed source. Both dependency lockfiles
matched production exactly; existing dependency files were hard-linked read-only,
with no installation, ownership/mode change or mutation of those shared inodes.
Source and build files were independent copies.

| Production guard | Minimum available RAM, KiB | Minimum free disk, bytes |
| --- | ---: | ---: |
| Candidate preparation | 302980 | 6782087168 |
| Nine-route candidate smoke | 274636 | 6781718528 |
| Exact runtime manifests | 221028 | 6764544000 |

All exceeded the unchanged 192 MiB / 6 GiB production floors and preserved live
service identities. The candidate passed live investment reads, closed Ask,
BotSquad navigation, both portraits and all four protected Motion routes before
activation. Old and candidate runtime manifests covered file bytes, type, mode,
UID/GID and symlink targets, excluding Git internals and Next's mutable cache.
No production-only environment or top-level file was omitted. The receiver was
activated first, then the website; no rollback was needed.

## Archive and Ask preservation

The following public watermark was identical before and after deployment:

| Field | Retained value |
| --- | --- |
| Source sequence | `6` |
| Journal sequence | `1` |
| Journal hash | `fe3d8a28951b7569aa2b541690ad73bf0fdefceabe2d62a4155827e70e139523` |
| Source gaps | `false` |
| Existing events / financial entries | `6` / `1` |
| Publisher generation | `1` |

Every prior event, batch and financial row remained intact. Publisher scope,
keys and approvals were unchanged. Archive epoch and schema migrations matched
the stopped backup; SQLite quick-check and foreign-key checks passed. These
counts describe the release checkpoint before HQ's subsequent activity.

Ask's source, PID/start time, configuration hash, empty private tables and metadata
were unchanged. Its intake, claims and delivery remained closed. Configuration
SHA-256: `ae4a0bb70ac41a58f28c0d5d9bc5c44fae6869ad5afdc43b4ba3081f75913e5c`.
All captured service/proxy configuration hashes matched the baseline. Ingress
PID 2375255, Nginx PID 826 and the inactive gunicorn baseline were unchanged.

## Public acceptance and handoff

All 112 observations matched the baseline: 104 verified HTTP results, four
explicit pre-existing IPv6 TLS failures with unchanged failure/certificate
fingerprints, and four fallback certificate fingerprints. The TLS failures were
not relabelled as successful verified transport.

Both apex and `www` preserved Motion, privacy, support and tutorial content,
the tutorial's exact `www` canonical, fragment links and 48 original image reads.
Eight optimized/original employee-image checks and six BotSquad hierarchy page
checks passed. Ask had no question form. A production browser confirmed Atlas
and Maya's portraits loaded at 96 × 96 px, the shared BotSquad navigation links,
no document overflow and no console warnings/errors.

After the 16:06:35 UTC readiness checkpoint, the stable receipt and exact
identities/watermark were sent to the authorized HQ coordinator. HQ agreed to keep its loop held until
this ACK so its restart/reconciliation would not overlap the receiver switch.
Subsequent HQ activation and actual employee/market outcomes belong to its own
release and operational evidence.

## Recovery and evidence custody

The receiver stopped gracefully and released its lock. SQLite was checkpointed
and its connection closed before copying the complete private directory. The copy
matched all six manifest entries, passed SQLite integrity/foreign-key checks,
and retained ownership/modes. No content objects were stored at this checkpoint,
so there were no object bytes to hash. A separate private configuration copy
matches the pre-release hash. No archive restore or authority reset occurred.
This is a host-local backup; this release establishes no new off-host custody.

Retained old runtimes are `/opt/asymmetri-receiver-rollback-20261014-c2edfd5` and
`/var/www/asymmetri-rollback-20261014-6a194f0`. Older receiver rollback must first
validate every retained event against its schema. Once an amendment is accepted,
incompatible old code must remain stopped and be repaired forward; never restore
an older database to make old code fit. An older website may likewise fail closed
on the new status field, so do not assume a website-only rollback remains useful.

Private manifests, backup, baseline/after observations, activation receipts and
`ready.json` remain under `/var/lib/asymmetri-close-recovery-release-20261014`,
root-only. Build artifacts and the exact producer-vector test receipts are retained
in the isolated Linux stage and private local release files, with hashes recorded
in the source acceptance record. No secrets or raw private contents are reproduced
in this receipt. Remaining work in this repository is documentation only.
