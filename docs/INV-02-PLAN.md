# INV-02 execution plan

Status: implementation and local acceptance complete; owner: INV-02 Codex implementation/integration task, sole writer.
Started: 2026-10-09. Initial ETA: 3–5 hours.
Asymmetri: clean synchronized main at 1232d1cbbe642a10a2455c2ed9c601174e548d2a.
BotSquad: isolated codex/inv02-receiver-handoff from b57c41a; contracts pinned to ba3dd74.
Other worktrees and the idle server-maintenance task are preserved.

## Scope and gates

1. Exact vendoring, type regeneration and synthetic contract verification.
2. Independent disabled Node 22/24 receiver, SQLite migration, trusted scope and Ed25519 HTTP authentication.
3. Atomic ingestion, immutable records/receipts, financial prerequisites, public projections and bounded private staging.
4. Real local HTTP/SQLite fault, concurrency, restart and isolated restore tests.
5. Read-only security, recovery and acceptance reviews; resolve blocking findings.
6. Website check/Next/Vinext/audit regressions, runbook and evidence.
7. Asymmetri implementation then journal commits and main push; BotSquad documentation PR.

No deployment, production inspection/mutation, real market data, publisher grants, HQ change, Ask service or later milestone.
Decision 029: US$0 incremental market-data budget; source-independent receiver, no provider connections or paid fallback.
Historical INV-01 disk warning is superseded by a documented October 9 cleanup; future deployment still needs fresh capacity checks and OS remediation.

## Invariants

Current trusted scope before every signed response and commit; durable nonce/receipt uniqueness; immutable financial/event identities; exact decimal strings; filesystem work outside short SQL transactions; bytes staged privately before metadata; no startup authority; no SQLite import into website builds.

## Evidence and remaining work

Preflight and exact contract verification passed. Receiver 183/183 on Node24.10.0 and22.23.1, zero skips; real HTTP/SQLite/process crashes/restore validated. Three read-only specialists accepted corrected source. Website check/Next/Vinext and both production audits pass after minimal Next16.3.8 patch. Documentation complete. Exact implementation/journal integration is recorded in the subsequent Engineering Journal and canonical BotSquad INV-02 acceptance record. Initial ETA unchanged.
