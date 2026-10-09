# Prompt 053: Cancel INFRA-01 migration and close temporary resources

- Date: 2026-10-09
- Scope: deployment
- Goal: Close the cancelled migration, remove its exact paid snapshot and disposable resources, preserve production and recovery data, and update both repositories.

## Original user request

> INFRA-01 — Cancel Ubuntu Migration, Delete Snapshot, Clean Up Resources, and Resume Development on Ubuntu 22.10

The owner explicitly cancelled/deferred Ubuntu 24.04 migration and retained the
existing Ubuntu 22.10 Droplet, addresses, DNS, websites, services and data. The
request superseded the prior same-Droplet rebuild plan and snapshot-retention gate.
It authorized deletion of the exact INFRA-01 migration snapshot after identity,
dependency and independent-backup verification, plus scoped disposable cleanup on
the Mac and previously authorized test host. It required an inventory before
removal, measured new reclamation by location, preserved historical evidence and
no double-counting of earlier cleanup.

The owner required all independent recovery copies, Django/source/settings/media,
SQLite, dormant PostgreSQL, shared users, runtimes, swap and application rollback
to remain. No rebuild, upgrade, resize, new host/expense, production restart,
Nginx/DNS change, Django retirement, receiver deployment, market collection, Ask
activation or next milestone was authorized. Verify 15-host/198-request behavior,
DNS/TLS, infrastructure identity, services and BotSquad preservation without disruption.

Record continued Ubuntu 22.10 operation as a time-limited unsupported-OS risk
exception. Remove automatic migration prerequisites from future investment work,
while retaining explicit deployment authority and actual runtime/SQLite, proxy,
security, capacity, least-privilege and recovery acceptance. Preserve INV-01,
INV-02, contract 1.0 and Decision 029's US$0 market-data policy. Update the existing
owned BotSquad PR #35, follow Asymmetri's implementation/journal commits and push,
and provide the requested evidence-backed cancellation report. No attachment path,
private recovery path, credentials or host inventory is included in this record.

## Scope

Cloud deletion was limited to the uniquely identified INFRA-01 snapshot. Filesystem
cleanup was limited to verified task fixtures/cache and one redundant log. Server
inspection remained read-only. Repository changes are documentation only; no
application code, dependency, contract, feature status or production release changed.

## Decisions

- Record cancellation, not successful migration. Preserve prior plans and failed
  attempts under explicit historical/superseded notices.
- Delete the exact 11.23 GB SFO3 snapshot after all 12 encrypted archive copies pass
  trusted-hash, full decryption and archive/SQLite verification.
- Retain both off-server sets, both keys, manifests, recovery tools and receipts.
  Same-Mac copies remain a separate-device custody limitation; existing backups
  remain historical recovery points while live services stay writable.
- Keep Django and its socket/domain behavior active; retirement remains independent
  and unexecuted. Preserve inactive PG data and all shared identities/runtimes.
- Review the unsupported-OS exception before the next deployment/public exposure.
  The owner supplied no calendar expiry. Do not invent one or claim compensating
  controls replace missing security patches.
- Update BotSquad's owned branch with Decision 030 and future readiness gates;
  do not merge PR #35 or start INFRA-02/INV-03 automatically.

## Implementation

The authenticated cloud account and original Droplet were verified. Exact snapshot
name, source, date, region and size matched prior receipts; both existing Droplets
predated it and no other recovery dependency was identified. Supported control-panel
deletion completed; account absence and zero Droplet/volume snapshots were confirmed
by October 9 at 13:05:58 PDT / 20:05:58 UTC. The timestamp is an observation, not a
claimed exact provider action time. No duplicate or new task-related paid resource remains.

Before local removal, 155 significant files were classified. Six disposable/duplicate
files were removed: 31,224 logical bytes and 49,152 allocated bytes. The observed
system-wide free-space increase was 32,768 bytes; APFS/concurrent activity prevents
exact physical attribution. HQ and production had no task remnants, so new reclamation
there was zero. The earlier 1,733,402,849-byte HQ cleanup was verified and not recounted.
Cloud storage eliminated was 11.23 GB, distinct from running-Droplet root capacity.

Recurring snapshot storage of approximately US$0.6738/month before tax is eliminated.
Daily billing was last updated before snapshot creation and has not itemized accrued
usage; a US$0.01 minimum may apply. No refund or zero prior charge is claimed.
Private deletion, inventory, cleanup, recovery and production comparison receipts
remain in restricted storage. Current private indexes explicitly mark the deleted
snapshot unavailable and prior instructions historical.

## Engineering impact

No runtime behavior changed. Current-facing documentation now permits separately
requested investment work on the retained host without an automatic LTS dependency,
while preserving concrete deployment/security acceptance. Historical evidence and
recovery limits remain visible, preventing the cancelled runbook from reactivating.

## Files changed

- New cancellation record consolidates decision, safe deletion evidence, resource
  inventory, preservation, verification and future review triggers.
- README, architecture, deployment, CLI, maintenance, testing and receiver guidance
  describe current host state and explicit future authority.
- Migration, validation and retirement documents retain their prior bodies under
  historical notices. The infrastructure-tool README also points to current scope.
- BotSquad memory, investment guide/roadmap/architecture/decisions, decision index,
  Decision 030 and the existing handoff plan reflect cancellation and pin the exact
  Asymmetri implementation commit.

## Documentation updated

All affected current operator entry points distinguish cancellation from migration
acceptance. Recovery console login is unnecessary for this closure; authenticated
recovery-shell access remains an acknowledged historical limitation. Existing SSH
access and the standing Node 22 approval are preserved. INV statuses and Decision029
remain unchanged; unsupported Ubuntu risk is explicit and time-limited by review trigger.

## Git diff summary

Asymmetri implementation: **12 files, 261 insertions, 54 deletions**. The change adds
the closure record and narrows current instructions without altering application code.
BotSquad implementation: **8 files, 163 insertions, 64 deletions**; documentation and
Decision 030 only. This journal is excluded from its own diff summary.

## Verification

- Twelve encrypted archive copies, totaling 2,758,545,568 ciphertext bytes, passed
  trusted hashes, decryption and full manifest/content verification. Copied SQLite
  integrity/foreign-key checks passed in memory; no closure plaintext export.
- The 198-request baseline passed without differences; all 15 hosts retained expected
  behavior, including existing errors/retired responses and protected Motion routes.
- DNS destinations and TLS certificate fingerprints matched; all 15 hostname/validity
  checks passed. Cached DNS TTL differences were ignored appropriately.
- Production Droplet/OS/IPs, source/build, master PIDs/start times, listeners, rollback
  presence and 48 Nginx/service fingerprints matched. Nginx syntax passed; Django
  socket remained active and PG inactive. Normal disk/swap and SSH-session changes
  were distinguished from service/configuration changes.
- HQ retained its service identity/start time, listeners and packages with no rehearsal
  remnants. Current ownership/modes and service access checks were appropriate; no
  earlier filesystem-mode baseline exists, so full permission equality is not claimed.
- Receiver remains undeployed/default disabled. No production restart or mutation.
- Relative Markdown links and git diff --check passed. INV/INV-ASK rows, contracts,
  Decision 029, simulation rules and historical INV validation remain unchanged.
- Read-only recovery/security and roadmap reviewers checked evidence and scope. A
  draft replacement accidentally removed unrelated README sections; review restored
  them before commit. A stale tool-runbook reference and stale INV status/version
  wording were corrected. No paid review credits were purchased.
- No application build/runtime suite was rerun for this documentation-only change;
  actual receiver deployment, real private PG runtime recovery, separate-device
  custody and authenticated recovery-console access are not newly claimed.

## Repository state after implementation commit

Asymmetri: main at `f229c05d8cfad7a8fd71edef48bc6f7df74f8580`, implementation committed,
clean before this journal and one commit ahead of origin/main; push follows the
separate journal commit. Initial main was clean at `4b46e094cb61478f1ea447d851d5ad6a66cce880`
and fast-forward pull succeeded. No feature branch/worktree/PR was created here.

BotSquad: owned `feature/infra01-documentation-handoff` at
`e2f2caa0e3f267e412639a45e3c11cf7567134b8`, pushed to the same open PR #35.
Other writers/worktrees and main were not changed. PR metadata is aligned with
the cancellation; the PR is not merged and no deployment occurs.

## Implementation commits

- Asymmetri: `f229c05d8cfad7a8fd71edef48bc6f7df74f8580` — docs: close INFRA-01 migration and record verified cleanup.
- BotSquad: `e2f2caa0e3f267e412639a45e3c11cf7567134b8` — docs: cancel INFRA-01 and accept bounded Ubuntu host exception.

## Archive commit

`docs: journal INFRA-01 cancellation and resource cleanup`

## Lessons learned

Explicit cancellation must supersede old approval and retention gates in every
current entry point while preserving evidence. Cloud deletion, local file allocation
and system-wide free space are different measurements. Honest limitations in billing,
backup custody and historical permission baselines are preferable to invented precision.

## Follow-up ideas

Only on a separate owner request: local INV-03 development, INFRA-02 readiness and
deployment, independent backup custody, Django retirement or a future supported-OS
project. None is started or automatically scheduled by this closure.
