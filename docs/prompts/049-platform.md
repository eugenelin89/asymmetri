# Prompt 049: INV-02 signed REST receiver and durable public archive

- Date: 2026-10-09
- Scope: platform
- Goal: Deliver a tested, default-disabled public investment receiver and exact cross-repository handoff without deployment.

## Original user request

> You are implementing **INV-02 — Authenticated Public REST Receiver and Durable Archive** for the BotSquad Investment Showcase.
>
> Proceed autonomously with implementation, testing, security review, documentation, and normal Git integration.
>
> **Execute INV-02 only. Do not begin INV-03, INV-04, INV-05, INV-06, or any Ask BotSquad implementation milestone.**

The full request specified an actual independently runnable Node22-compatible REST
service in Asymmetri, exact accepted BotSquad1.0 contracts, SQLite archive, scoped
Ed25519 HTTP signatures, atomic durable ingestion/receipts, financial consistency,
public projections and safe private artifact storage. It required disposable
synthetic HTTP/SQLite/recovery tests, independent reviewers, existing website
checks/builds/audits, operational documentation and normal two-repository Git
integration. It explicitly prohibited production maintenance/deployment, public
activation, live market data, HQ changes, real identities and later milestones.
Decision029's US$0 data budget and separate future Ask boundary were mandatory.
Asymmetri must use clean-main implementation/journal commits, while BotSquad gets
an isolated documentation PR with exact implementation SHA/digest.

## Scope

Receiver, tests, immutable vendor package, configuration/service proposals,
website read-type/location foundation, documentation and a minimal dependency
security patch needed by the required production audit. No application page/UI,
production server, data collector, authoritative trading engine or Ask service.
No preview, deployment, SSH session or production identity was created.

## Decisions

- Independent package and runtime; Next/Vinext do not import SQLite or start it.
- Explicit disabled configuration, loopback-only binding, private data outside Git.
- Exact contract source ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755, manifest digest
  7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31; no wire changes.
- SQLite WAL/FULL/FK, immutable identities and atomic event/projection/receipt commits.
- Current trusted publisher/key/generation and publication approval at commit;
  durable nonces and authenticated receipt reconciliation.
- Streamed bounded CAS with fsync/atomic rename, private metadata and offline cleanup.
- Conservative finite archive/receipt/cursor budgets, reserved reconciliation space,
  no invented prices or authority derived from publisher source claims.
- Next/eslint-config-next16.3.8 is the minimal patch resolving reported16.3.6 audit
  advisories; both builds remain compatible. Production was not patched.

## Implementation

Migration001 persists public runs/configuration, keys/scopes/nonces, immutable
batches/events/receipts, record dependencies and typed projections, journal/orders/
valuations, content staging, visibility, cursors and heartbeats. Seventeen investment
contract routes are recognized; sixteen offer their INV-02 behavior and artifact
content download explicitly remains unavailable. Exact named DTOs are validated.
Public freshness distinguishes transport from market data. Withdrawal propagates
through scalar dependencies and cannot resurrect obsolete current values.

## Engineering impact

Adds an isolated stateful public archive while preserving the website's existing
rendering and packaging. better-sqlite3, AJV, canonicalize and jsonc-parser are
receiver-local. No market provider or cloud service dependency. Code accepts only
explicitly scoped signed publication, never commands HQ or creates a trade from
a receipt. Runtime is designed for a separate future non-root identity/store.

## Files changed

- Receiver package/lock/build/config, migration, authentication/HTTP/schema/
  publication/database/read/content/storage/CLI modules and contract checker.
- Exact versioned vendor package and MIT attribution.
- Shared conformance, HTTP integration, separate-process crash/recovery tests.
- Framework-neutral read types/location helper and isolated root build/lint settings.
- Root dependency pins/lock and onboarding/architecture/development/testing/deployment
  docs; dedicated receiver runbook, acceptance evidence and execution plan.

## Documentation updated

README and architecture distinguish the new disabled archive from deployed pages.
Local development/testing describe independent install/tests. Deployment/runbook
cover identity, storage, signatures/proxy, quotas, migration, diagnostics, backups,
restore fencing, rights and later rollback. Historical disk96% is not represented
as current: separate October9 maintenance documentation reports cleanup; this task
made no live host checks. BotSquad roadmap/validation handoff follows separately.

## Git diff summary

Implementation: 49 files changed, 18,807 insertions and95 deletions. Most additions
are the exact generated schema/OpenAPI/types/fixtures; remaining groups are the
bounded receiver, tests and documentation. No generated builds, node_modules,
private keys, databases or unrelated changes are committed.

## Verification

- Node24.10.0 and official checksum-verified temporary Node22.23.1 on macOS arm64:
  **183/183 tests each, zero failures/skips**, native SQLite3.53.4 loaded on both.
- Exact vendor/type regeneration, all47 named DTOs/all18 publication event types;
  RFC9421 vectors, actual HTTP/TCP signatures/expiry/replay/revocation; real SQLite
  ingestion, same/separate-process duplicates, financial ordering and visibility.
- SIGKILL at pre/post-commit and post-rename; isolated SQLite/CAS backup/restore,
  fresh authority/generation fencing, exact receipt reconciliation and cursor reset.
- Required receiver check, website check, Next16.3.8 and Vinext builds pass.
  Existing tutorial navigation lint warning and build notices remain unchanged.
- Both production dependency audits return0 vulnerabilities; diff whitespace clean.
  CLI without configuration exits disabled as expected.
- Security/recovery/test read-only reviewers accepted corrected source; no remaining
  blocking findings. Material review findings have focused regression tests.
- Not tested/claimed: Linux/systemd/proxy, production, sustained host load, hardware
  power loss, offsite disaster recovery, live data/HQ/Ask. These remain later gates.

## Repository state after implementation commit

Clean main at457f9354b3f8daf5c4c75b8f5ac1946433da3ce0, one commit ahead of fetched
origin/main1232d1cbbe642a10a2455c2ed9c601174e548d2a. No Asymmetri branch/worktree/PR.
This journal is the separate second commit; normal push and remote identity check
follow. BotSquad documentation uses its own isolated codex/inv02-receiver-handoff.

## Implementation commits

- 457f9354b3f8daf5c4c75b8f5ac1946433da3ce0 — feat: implement disabled signed investment archive receiver (INV-02)

## Archive commit

Intended message: `docs: record INV-02 receiver engineering journal`

## Lessons learned

Artifact atomicity must include the install syscall boundary. Withdrawal requires
semantic scalar dependencies, not only explicit RecordRef fields. Current values
must be chosen before visibility filtering. Public cursor allocations consume real
DB capacity and must preserve signed reconciliation headroom. Rights approval is a
current commit-time gate. Restore revokes authority and reconciles later visibility
controls; a backed-up key is not permission to resume publishing.

## Follow-up ideas

INV-03 local artifact/discussion work is ready only on a separate request. Before
production: supported OS/fresh resources, Linux/proxy verification, service isolation,
backup drill and explicit activation. Future observed data requires permitted
zero-cost sources and publication rights; no paid fallback. Ask remains independent.
Initial3–5 hour ETA did not materially change.
