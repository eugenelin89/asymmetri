# BotSquad and Asymmetri — Investment Showcase integration map

**Current state: October 9, 2026.** This is a navigation and ownership guide, not an implementation or activation grant. Follow the more detailed documents below for their normative rules.

## Which repository owns what?

| Responsibility | Repository / location | Status |
| --- | --- | --- |
| Persistent employees, private Task/conversation/working-group and execution control | [BotSquad HQ](https://github.com/eugenelin89/bot_messenger), including `src/` and private host `ssh botsquad` | Existing product; no investment authority merely because workers exist |
| Canonical versioned investment protocol, types, fixtures and signature vectors | [BotSquad `contracts/investment/v1/`](https://github.com/eugenelin89/bot_messenger/tree/ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755/contracts/investment/v1) | Contract 1.0 accepted; do not fork independently |
| Paper-trading ledger, permitted free-source market adapter, trusted public publisher, employee collaboration and operating cadence | [BotSquad investment roadmap](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/ROADMAP.md), INV-05–09 | Planned; INV-05 next, not started |
| Investment signed REST receiver, SQLite archive, CAS, exact-version artifacts, withdrawal controls | [Asymmetri `receiver/`](../receiver/) and [receiver runbook](INVESTMENT_RECEIVER.md) | INV-02/03 complete; private Ubuntu 22.10 installation disabled, no live authority |
| Public pages, live-desk UI, charts, evidence/journal/Ask preview | [Asymmetri `app/botsquad/`](../app/botsquad/), [components/investment](../components/investment/), [INV-04 acceptance](INV-04-VALIDATION.md) | INV-04 source/local synthetic acceptance complete; **not** live website release |
| Public Ask UI and private Q&A integration | [BotSquad Ask roadmap](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/ASK_BOTSQUAD_ROADMAP.md) and future Asymmetri Q&A implementation | Preview disabled; no live visitor question processing |

**Authoritative planning:** [BotSquad investment guide](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/README.md), [roadmap](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/ROADMAP.md), [design decisions](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/DECISIONS.md) and [market-data Decision 029](https://github.com/eugenelin89/bot_messenger/blob/main/docs/decisions/decision_029_zero_cost_market_data.md). Asymmetri's [architecture](ARCHITECTURE.md), [receiver runbook](INVESTMENT_RECEIVER.md), [INV-03](INV-03-VALIDATION.md), [INV-04](INV-04-VALIDATION.md) and [deployment guide](DEPLOYMENT.md) own website-specific implementation and operations evidence.

## Contract and integration boundary

Canonical contract commit: `ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755`; nine files; manifest SHA-256 `7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`. Asymmetri's `receiver/vendor/investment/v1/` is a byte-identical, pinned consumer as checked during the October 9 review. Run `npm --prefix receiver run contracts:check` after contract-related edits. Neither project fetches the protocol from GitHub at runtime.

The approved authority flow is: trusted BotSquad HQ public projection and publisher (later INV-07) **outbound signed HTTPS** → isolated Asymmetri receiver and public archive → bounded read-only Next.js routes → visitors. Website receipts are not trading commands, and the website must not obtain private HQ employee state or signing keys. Ask BotSquad uses a separate future private-session Q&A boundary; an investment publication grant does not authorize Ask.

The INV-04 website source requires a verified `X-Archive-Visibility` header and optionally a bounded `X-Archive-Latest-Cursor` header. The installed INV-03 receiver predates these INV-04 headers. **Coordinate receiver compatibility before any live website read release.** Existing shared-443 HTTPS ingress remains gated; the rejected HTTP reverse-proxy profile is not an accepted substitute for strict TLS stream testing.

## Completed milestones and next work

- **INV-01:** Contract v1.0 accepted in BotSquad.
- **INV-02:** Receiver implemented and locally tested in Asymmetri.
- **INFRA-02:** Receiver installed on existing Ubuntu 22.10, privately validated, left inactive/static and config disabled.
- **INV-03:** Artifacts, discussions, exact downloads, controls and isolated TLS stream tests; source and private installation complete.
- **INV-04:** Full investment interface with 53-event *synthetic* fixture and disabled Ask preview; source/browser acceptance complete, **not deployed**.
- **INV-05:** Next owner-selectable milestone. Implement deterministic paper simulator in **BotSquad**, with synthetic prices/clocks only.

Cross-repository provenance: [BotSquad INV-04 handoff](https://github.com/eugenelin89/bot_messenger/blob/main/docs/validation/investment/INV-04.md) pins the [Asymmetri implementation](https://github.com/eugenelin89/asymmetri/commit/c31f500c6ebb063341bca7444dac6782df7a7b17), [journal](https://github.com/eugenelin89/asymmetri/commit/3d9e1ad55dc5ad1861393e63d05370a2a1a7b054) and [browser/fixture checks](INV-04-VALIDATION.md).

## Operations and future activation

INFRA-01 Ubuntu migration was cancelled. The present Droplet runs unsupported Ubuntu 22.10 under [Decision 030](https://github.com/eugenelin89/bot_messenger/blob/main/docs/decisions/decision_030_defer_ubuntu_migration.md); a future OS upgrade is a separate owner project. RECOVERY-01 is not a required development milestone. Independently verified backup custody is currently unestablished after the later deletion of historical archives; any valuable *live* data and public activation need a separate backup/retention and security review. Do not silently claim that GitHub stores private databases/configuration.

Live receiver ingress, publisher grants/keys, operational market source and rights under US$0 Decision 029, real HQ synchronization, visitor Ask, capacity/retention and public release are **not enabled** by INV-01–04. The installed receiver ends with zero operational publishers/events and no listener; the website is still on a separately pinned production release. Always verify the current source and service state before changes.

## How future Codex work is routed

- **Asymmetri.co Codex project:** website, isolated receiver, API serving, Nginx/Ubuntu web-hosting and future website release. Follow this repository's `AGENTS.md`, mainline/two-commit journal workflow and explicit deployment gate.
- **BotSquad Codex project:** HQ employees, paper simulator INV-05, market adapter INV-06, HQ publisher INV-07, later team/scheduler and private HQ Ask integration. Follow BotSquad's `AGENTS.md`, short-lived branch/worktree, review/PR workflow.
- If a task touches both, keep one owning implementation repository per packet, pin exact contract SHA and both tested source commits, record a documentation handoff to the other repository, and do not assume an atomic cross-repository deploy. No implementation milestone is started by reading this document.
