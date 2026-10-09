# Prompt 054: INFRA-02 private Linux receiver acceptance

- Date: 2026-10-09
- Scope: deployment
- Goal: Install the accepted investment receiver on the retained Ubuntu 22.10 host, prove private synthetic operation and preserve every existing website, then leave publication disabled.

## Original user request

> Deploy the already implemented INV-02 REST receiver to the existing DigitalOcean Droplet running Ubuntu 22.10.

> Complete the deployment, validation, documentation and Git handoff, then stop. Do not begin the next milestone.

The large request selected INFRA-02 only and authorized independent installation,
temporary loopback startup, synthetic Ed25519/HTTP/nginx acceptance, Linux native
SQLite compatibility, least-privilege systemd confinement, bounded shared-host
capacity, migration/restart/backup/restore/receipt reconciliation, cleanup and normal
Git integration. It required reading both repositories and current Decisions029/030,
checking ownership and current Git state, preserving contract1.0 and the original
198-request/15-host baseline, using read-only specialist reviewers and one writer,
and recording exact source/runtime/paths/state plus failures and remaining gates.

The owner retained the existing Droplet, Ubuntu22.10, IPs, DNS, websites, Django,
dormant PostgreSQL, rollback data, archives and swap. The unsupported-OS exception
does not authorize new public exposure. No OS/global Node upgrade, replacement
host, paid snapshot/subscription, unrelated restart, website release/redesign,
HQ credentials/runtime/publisher, market data, real investment event, INV-03 or Ask
work was authorized. Final receiver state had to be installed but stopped/default
disabled with no operational fixture authority/data. Exact production HTTP/TLS
acceptance could remain an explicitly documented future activation gate. Existing
encrypted recovery material must be retained; future receiver retention/recurring
backup and all public/real-publisher activation need separate review and authority.
Decision029 preserves the US$0 incremental market-data budget.

## Scope

Receiver installation and isolated tests only. The live Next release was not
rebuilt, synchronized, restarted or replaced. BotSquad received a separate reviewed
documentation branch based on the still-open Decision030 branch; no HQ writes.
Historical INV-01/02 and cancelled migration evidence remain historical.

## Decisions

- Install exact accepted runtime source `a38696e9efb4d55dff1835d4dbb674454332170d`,
  whose receiver subtree equals INV-02 `457f9354b3f8daf5c4c75b8f5ac1946433da3ce0`.
  Hardened unit identity is separate and hash-pinned in acceptance.
- Preserve independent root-owned code, dedicated non-login user, private config
  and archive; add mount masks and narrow bind-backs because read-only filesystem
  protection alone did not prevent reading unrelated data.
- Retain explicit-marker/config startup gates, no boot target and bounded resources.
  Do not equate systemd's literal `static` state with boot-enabled operation.
- Preserve the failed nginx HTTP duplicate-Connection assertion. Accept transparent
  loopback stream transport only; exact public HTTP/TLS ingress remains unaccepted.
- Keep all test keys in memory, fence disposable authority and reconcile receipts
  before removing task-only fixtures. Operational schema001 remains empty.
- Record host swap separately from zero receiver/proxy swap, settled idle separately
  from startup snapshots, and bounded workload viability separately from live sizing.

## Implementation

Installed isolated code/dependencies/config/schema001 and the hardened static unit.
Added explicit nginx/restore, filesystem/network isolation, bounded traffic, restart
reconciliation and offline empty-archive acceptance utilities. Completed actual-host
checks and receiver-only cleanup. Runbook covers maintenance, stale-lock handling,
consistent complete-directory backup/restore, withdrawal reconciliation, authority
fencing, compatible rollback and activation gates.

## Engineering impact

No runtime protocol, contract, migration, website route, product copy, public asset,
dependency version, HQ code or financial semantics changed. The host gains one
independent disabled service identity/install/archive. Stronger confinement and
explicit operational evidence reduce accidental authority and cross-site access;
they do not repair unsupported OS vulnerabilities. No paid resource was created.

## Files changed

Deployment tooling: hardened unit plus six explicitly invoked acceptance utilities.
Operational documentation: two new INFRA-02 records and current installation/status
updates in README, architecture, access, deployment, receiver, maintenance and testing.

## Documentation updated

Current-facing docs distinguish installed, synthetically tested, privately running,
stopped/default disabled, public reachability and real publisher activation. The
new validation record owns exact identities, commands, measurements, failures,
review dispositions and unperformed tests; the runbook owns repeatable procedures.

## Git diff summary

Implementation: **16 files changed,857 insertions,43 deletions**. Changes consist of
confinement/test tooling and precise operational evidence, with no website release
or receiver runtime feature change. This journal is excluded from those totals.

## Verification

- Linux Node22 receiver suite183/183; local Node24 suite183/183; contract/check/build pass.
- Isolated nginx stream and complete-directory restore42/42. HTTP duplicate-Connection
  profile failed and remains explicitly rejected for public/real ingress.
- Actual-profile isolation probe: zero capabilities, unrelated roots hidden,
  filesystem fsync/rename, allowed loopback and denied non-loopback TCP pass.
- Empty/repeated migration001, full SQL integrity/FKs, WAL/FULL and empty authority pass.
- Actual CLI graceful/SIGKILL recovery retained827 events/17 batches and exact durable
  receipts/nonces; stale-lock recovery and fresh-key reconciliation pass.
- Bounded164-second workload:240 reads/concurrency4,68.87MiB cgroup peak,
  zero receiver swap/OOM,322.14MiB minimum host available memory;64 site probes pass.
  Settled idle30seconds measured25.64–27.66MiB. Small system swap is recorded.
- All198 baseline checks unchanged across15 hosts; DNS/TLS, firewall,48 configuration
  fingerprints and original application/source/build identities preserved.
- Final unit inactive/static, configfalse, marker/listeners absent, operational
  authority/data zero; temporary units/test code/dependencies/archives removed.
- Root check, standard Next and Vinext builds pass; pre-existing lint/build notices
  retained. Root/receiver production audits report0 vulnerabilities. Relative links,
  sensitive-pattern scan and diff whitespace pass.
- Three read-only specialist reviews accepted corrected evidence. Fixed read-isolation
  and sensitive test-path findings. Schema fixture overlength, bounded timeout closure
  and systemd unloaded-unit reset failures/corrections are documented.

Not established: public HTTP/TLS ingress, sustained full-archive/live sizing,
hardware power loss/offsite disaster recovery, approved recurring receiver backups,
real-source rights, real HQ/worker/trading or Ask operation. These remain future gates.

## Repository state after implementation commit

Asymmetri `main`, clean at the implementation commit and one commit ahead of verified
`origin/main` `a38696e9efb4d55dff1835d4dbb674454332170d`. No branch/worktree/PR created
for Asymmetri; no unrelated work staged. This journal is the separately required
second commit; both are pushed together afterward. BotSquad's handoff follows its
separate branch/PR workflow, with immutable links to these commits.

## Implementation commits

- `2e663dd3f4281e29aa7e45bf34fbc54ad8a59559` — deploy: install and privately validate isolated investment receiver

## Archive commit

`docs: archive INFRA-02 private receiver deployment journal`

## Lessons learned

Measure the real protection boundary: ProtectSystem alone is not read isolation.
An nginx HTTP proxy can erase ambiguity before a signed receiver sees it; passing
stream tests cannot bless that HTTP configuration. Preserve failed evidence and
explicit future gates. A killed exclusive-lock service should fail closed until
operator reconciliation rather than automatically erase the lock/history.

## Follow-up ideas

Only on a new request: INV-03 local synthetic implementation; separately reviewed
real ingress, representative sizing, receiver backup/custody/retention and publisher
activation. A future OS project remains independent; INFRA-01 stays cancelled.
