# Prompt 055: INV-03 archive and INFRA-02 remediation

- Date: 2026-10-09
- Scope: platform
- Goal: Complete the artifact/discussion archive and actionable infrastructure remediation while preserving disabled public activation.

## Original user request

> BotSquad Investment Showcase — INV-03 + INFRA-02 Hardening and Outstanding Issue Resolution

The large request authorized INV-03 artifact publication/discussion archive and required
investigation, correction and retesting of inherited INFRA-02 issues. It asked for one
integration writer and independent read-only reviewers, actual retained Ubuntu 22.10/
Node 22 compatibility, strict signed HTTP/TLS ingress, stronger bounded capacity and
crash/restore/isolation acceptance, complete archive lifecycle and human views, safe
backup/retention/credential/reconciliation procedures, and review/integration of BotSquad
PR #35/36 followed by a separate reviewed documentation handoff. Routine SSH/Node22/Git
permissions were already authorized. Preserve all unrelated websites, protected Motion
routes, HQ runtime, pinned contract/Decision 029 US$0/Decision 030 retained-host exception.
Do not expose a receiver, release the website, create real publisher keys, collect market
data, activate paper trading/Ask, change DNS/OS/infrastructure or buy services. Follow
Asymmetri's main/two-commit journal workflow and push; record exact cross-repository
commits, actual evidence and every inherited issue's honest disposition. Finish at this
milestone with sections A–G and an evidence-supported completion status.

## Scope

Receiver storage/controls/visibility/downloads/recovery, server-rendered archive views,
explicit deployment acceptance tools, relevant operational/architecture/content/testing
records, and private disabled installation. BotSquad changes are a separate documentation
PR; no HQ runtime changes. No public website deployment or subsequent packet started.

## Decisions

- Keep contract 1.0 and migration 001 byte-identical; add migration 002 for owner controls,
  exact rights approvals, immutable audit, restore read holds and future suppression.
- Use strict per-connection request admission and Nginx stream TLS/SNI on loopback.
  Preserve the rejected HTTP proxy regressions instead of weakening authentication.
- Serve exact SHA256-verified allowed bytes; recheck metadata/control visibility before
  headers, while streaming and before HTML rendering. Withdrawals cover aliases and
  stale-backup replay. Already transmitted bytes cannot be recalled.
- Keep observed-paper artifact rights separate from signing and run approval. Distinguish
  worker, owner and system records; preserve synthetic labels in unavailable states.
- Restore into a fresh held/fenced directory with a durable incomplete marker and current
  control reconciliation. Publish encrypted output filenames only after authenticated,
  synced completion; keep key custody outside source/control records.
- Report measured capacity limits and multisecond read/write latency. The tested small
  private envelope does not qualify configured maximum storage or public TLS traffic.
- Correct backup custody assumptions: later owner-approved cleanup deleted old Mac
  copies and recovery keys; no independent copy or active schedule is claimed.

## Implementation

Exact-version registry, artifact content pages/downloads, discussion and typed-record
pages now exist in source. All seven lifecycle states, relationships, safe formats,
owner withdrawals/reviewed corrections and source-rights evidence are implemented.
Private receiver code matches implementation commit below; 75 source/compiled files
were hash-verified. Additive schema 002 is installed with zero keys/events/data,
configuration disabled, marker absent, unit inactive/static and no listener. Previous
empty code/schema/config/unit remains protected for receiver-only rollback.

## Engineering impact

No dependency, contract or public asset additions. Existing Next server-component,
loopback-read, dedicated SQLite/CAS and least-privilege boundaries remain. Human views
use semantic company structure, responsive wrapping, visible focus and explicit truth
states. No analytics, browser credentials, dynamic external fetch, public admin or Ask.
Public shared 443 topology/authority/client-IP/certificate/renewal/capacity integration,
independent backup custody and real HQ/source rights remain explicit future gates.

## Files changed

- Receiver source and additive migration: controls, download visibility, signed admission,
  discussion validation, rights, backup/restore and atomic encrypted files.
- Receiver tests/deployment tools: artifact/fault regressions, TLS/HTTP profiles, sustained
  load, contention/restart/recovery, isolated disk pressure and offline audit.
- Website routes/shared views/read helper/styles/content: exact artifact/discussion/record
  pages, secure downloads, safe unavailable states and persisted fixture labels.
- Documentation: current source behavior, private installation boundaries, measured
  evidence, operational procedures, inherited issue table and next milestones.

## Documentation updated

README, architecture, deployment, receiver/INFRA02 records, local development, content,
asset manifest, server maintenance and testing. New INV-03 operations/ingress/validation
records explain controls, recovery, capacity and acceptance restrictions. Historical
prompt records remain unchanged. No secret, raw transcript or private attachment metadata
is included. BotSquad's separate handoff will pin these commits and installation receipt.

## Git diff summary

Implementation: **48 files changed, 1,658 insertions, 70 deletions**. The change adds
archive/recovery features and focused acceptance records while preserving company
product content, contract bytes and unrelated work. This record is excluded from its
own implementation summary.

## Verification

- Local Node 24 and actual retained Ubuntu/Node 22 receiver: **200/200 each**.
- Isolated installed Nginx TLS: **62/62**. HTTP profile **48/52**, intentionally
  rejected: HTTP/1.0 normalization, duplicate Connection acceptance and pipelined
  signed mutation, plus failed parent. Production ingress is not approved.
- Sustained **953.199 seconds**, 1,894 events, 62 artifact versions and 1,800 added
  contributions: cgroup 92.98 MiB, RSS 121.34 MiB, swap 1.004 MiB; host available
  memory at least 319.92 MiB and disk 13.424 GiB. No OOM or threshold abort.
  Write p95 4.604s and read p95 2.891s; final 48-read benchmark p95 3.498s.
- Actual overlap/contention, graceful/SIGKILL restart, uncertain receipt, rotation,
  fencing and complete 65-file backup/restore with current withdrawal reconciliation
  pass at 1,898 events/66 batches. The 11.34 MB encrypted snapshot tar round-trip
  passes; temporary key deleted.
- Isolated 8 MiB tmpfs low-disk test 1/1; installed confinement passes. Test datasets,
  units, mounts, temporary certificates/keys and listeners removed after evidence copy.
- Browser formats, relationships, pagination, eight safe/error states, long report,
  PNG, 320–1920px wrapping, keyboard focus and console pass. Reduced-motion CSS was
  reviewed; no screen-reader-device or OS preference-emulation claim.
- Website check, Sites build and Next webpack build pass. Default Turbopack hit
  environment EPERM twice and is not reported as passing. Root/receiver production
  audits report zero vulnerabilities; infrastructure Python tests 14 pass/2 documented
  skips; diff, privacy and reference review pass.
- Fresh **228** before/after HTTP probes across 15 hosts and DNS/TLS/config/PID/build
  comparisons unchanged, including protected Motion pages and original tutorial images.
- Independent archive, ingress and website reviewers found no remaining private-install
  blocker after fixes. Their public activation/custody limitations remain documented.

See [the acceptance record](../INV-03-VALIDATION.md) for exact measurements, failed
attempts, installed state, inherited issue dispositions and future prerequisites.

## Repository state after implementation commit

Asymmetri main at `6a80e28494274b3fce1d51a45b7bf012cf2ae97e`, clean before this journal,
one commit ahead of unchanged origin/main. No branch/worktree/PR/merge created here.
BotSquad PR #35 merged `7cd52672ab1de1dc687d6aeebc718919760ac2e5`; PR #36 corrected,
retargeted and merged `8a150eb47cd1f1cbc9b5cb3178775ae656052fdf`. Its separately owned
handoff branch remains the sole documentation writer. No force push. Integration and
host changes were sequential, not atomic. Source receipt on the host matches the
implementation; public website remains `745a92c676bcbe85c3aa675a1099d26321f1c1e2`.

## Implementation commits

- `6a80e28494274b3fce1d51a45b7bf012cf2ae97e` — Implement INV-03 artifact archive and private receiver hardening

## Archive commit

`Document INV-03 engineering journal and acceptance handoff`

## Lessons learned

A passing stream test does not validate an HTTP-normalizing proxy or real shared 443
rollout. Backups require current custody evidence; a historical receipt does not prove
copies still exist. Visibility controls must survive prepublication races and older
backup replay. Capacity needs measured p95 and site impact, not just memory headroom.
Keep failed runs and blockers visible rather than translating fixture success into
operational readiness. Additional review/fault fixes and actual-host acceptance extended
the initial several-hour estimate; no safety or preservation gate was skipped.

## Follow-up ideas

A separately requested INV-04 can build fixture-based dashboard/read views. Public
activation, real HQ publishing (INV-07), market sources (INV-06), official trading, Ask
and complete Showcase launch retain their own evidence/rights/owner gates. Nothing
in this journal authorizes those actions or a new recurring backup schedule.
