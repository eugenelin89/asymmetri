# BotSquad and Asymmetri — Investment Showcase integration map

**Current coordination: October 13, 2026.** The [INV-REAL-01 website handoff](INV-REAL-01-WEBSITE.md) records the owner's release authorization, observed-paper integration and actual verification. The October 9 milestone baseline below is historical; BotSquad INV-05–09 source work has since advanced and INV-REAL-01 is active. Do not infer production activation from source completion. The [closed Ask production-path release](ASK-04-RELEASE_2026-10-13.md) records current website source/build identity; the detailed investment handoff retains its initial-release history.

## Which repository owns what?

| Responsibility | Repository / location | Status |
| --- | --- | --- |
| Persistent employees, private Task/conversation/working-group and execution control | [BotSquad HQ](https://github.com/eugenelin89/bot_messenger), including `src/` and private host `ssh botsquad` | Existing product; no investment authority merely because workers exist |
| Canonical versioned investment protocol, types, fixtures and signature vectors | [BotSquad `contracts/investment/v1/`](https://github.com/eugenelin89/bot_messenger/tree/ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755/contracts/investment/v1) | Contract 1.0 accepted; do not fork independently |
| Paper-trading ledger, permitted free-source market adapter, trusted public publisher, employee collaboration and operating cadence | [BotSquad investment roadmap](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/ROADMAP.md), INV-05–09 | HQ reports repaired private authentication; genuine activation and publication gates remain incomplete; see current handoff |
| Investment signed REST receiver, SQLite archive, CAS, exact-version artifacts, withdrawal controls | [Asymmetri `receiver/`](../receiver/) and [receiver runbook](INVESTMENT_RECEIVER.md) | Installed with strict HTTPS, empty archive and no publisher authority |
| Public pages, live-desk UI, charts, evidence/journal/Ask preview | [Asymmetri `app/botsquad/`](../app/botsquad/), [components/investment](../components/investment/), [INV-04 acceptance](INV-04-VALIDATION.md) | Public October 13 release; archive unconfigured, Ask intake disabled |
| Public Ask UI and private Q&A integration | [BotSquad Ask roadmap](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/ASK_BOTSQUAD_ROADMAP.md) and [Asymmetri interface](ASK-03-WEBSITE-UI.md) | Local synthetic UI and typed transport accepted; unavailable public page released, genuine intake closed |

**Authoritative planning:** [BotSquad investment guide](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/README.md), [roadmap](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/ROADMAP.md), [design decisions](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/DECISIONS.md) and [market-data Decision 029](https://github.com/eugenelin89/bot_messenger/blob/main/docs/decisions/decision_029_zero_cost_market_data.md). Asymmetri's [architecture](ARCHITECTURE.md), [receiver runbook](INVESTMENT_RECEIVER.md), [INV-03](INV-03-VALIDATION.md), [INV-04](INV-04-VALIDATION.md) and [deployment guide](DEPLOYMENT.md) own website-specific implementation and operations evidence.

## Contract and integration boundary

Canonical contract commit: `ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755`; nine files; manifest SHA-256 `7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`. Asymmetri's `receiver/vendor/investment/v1/` is a byte-identical, pinned consumer as checked during the October 9 review. Run `npm --prefix receiver run contracts:check` after contract-related edits. Neither project fetches the protocol from GitHub at runtime.

The approved authority flow is: trusted BotSquad HQ public projection and publisher (later INV-07) **outbound signed HTTPS** → isolated Asymmetri receiver and public archive → bounded read-only Next.js routes → visitors. Website receipts are not trading commands, and the website must not obtain private HQ employee state or signing keys. Ask BotSquad uses a separate private-session Q&A boundary with public intake disabled; an investment publication grant does not authorize Ask.

The website requires a verified `X-Archive-Visibility` header and optionally a bounded `X-Archive-Latest-Cursor` header. The installed receiver supports these headers. The current d0c4543 website includes the fixed-authority loopback helper. Before configuring live reads, verify the exact run and retained visibility checks. Shared-443 HTTPS is now verified; the rejected normalizing HTTP profile remains unsuitable.

## Historical October 9 milestone baseline

- **INV-01:** Contract v1.0 accepted in BotSquad.
- **INV-02:** Receiver implemented and locally tested in Asymmetri.
- **INFRA-02:** Receiver installed on existing Ubuntu 22.10, privately validated, left inactive/static and config disabled.
- **INV-03:** Artifacts, discussions, exact downloads, controls and isolated TLS stream tests; source and private installation complete.
- **INV-04:** Full investment interface with 53-event *synthetic* fixture and disabled Ask preview; source/browser acceptance complete. The later INV-REAL-01 website release is live with unconfigured archive and disabled Ask states; no fixture was published.
- **INV-05:** Next owner-selectable milestone. Implement deterministic paper simulator in **BotSquad**, with synthetic prices/clocks only.

Cross-repository provenance: [BotSquad INV-04 handoff](https://github.com/eugenelin89/bot_messenger/blob/main/docs/validation/investment/INV-04.md) pins the [Asymmetri implementation](https://github.com/eugenelin89/asymmetri/commit/c31f500c6ebb063341bca7444dac6782df7a7b17), [journal](https://github.com/eugenelin89/asymmetri/commit/3d9e1ad55dc5ad1861393e63d05370a2a1a7b054) and [browser/fixture checks](INV-04-VALIDATION.md).

## Operations and future activation

INFRA-01 Ubuntu migration was cancelled. The present Droplet runs unsupported Ubuntu 22.10 under [Decision 030](https://github.com/eugenelin89/bot_messenger/blob/main/docs/decisions/decision_030_defer_ubuntu_migration.md); a future OS upgrade is a separate owner project. RECOVERY-01 is not a required development milestone. Independently verified backup custody is currently unestablished after the later deletion of historical archives; any valuable *live* data and public activation need a separate backup/retention and security review. Do not silently claim that GitHub stores private databases/configuration.

Live receiver ingress, publisher grants/keys, operational market source, real HQ synchronization, visitor Ask and capacity/retention are **not enabled** by INV-01–04. The later [October 13 shared HTTPS release](INGRESS_RELEASE_2026-10-13.md) starts the empty investment and disabled-intake Ask listeners with verified confinement/renewal; zero operational publishers/events and no Ask service keys remain. The current website release is `d0c454314d646b74895f4d9e3e4a014c63c666a6`, superseding the initial `97b4087` release, with no configured archive reads or visitor intake. Owner-reported Yahoo permission and producer authentication status are recorded in the [current handoff](INV-REAL-01-WEBSITE.md). Always verify the current source and service state before changes.

## How future Codex work is routed

- **Asymmetri.co Codex project:** website, isolated receiver, API serving, Nginx/Ubuntu web-hosting and future website release. Follow this repository's `AGENTS.md`, mainline/two-commit journal workflow and explicit deployment gate.
- **BotSquad Codex project:** HQ employees, paper simulator INV-05, market adapter INV-06, HQ publisher INV-07, later team/scheduler and private HQ Ask integration. Follow BotSquad's `AGENTS.md`, short-lived branch/worktree, review/PR workflow.
- If a task touches both, keep one owning implementation repository per packet, pin exact contract SHA and both tested source commits, record a documentation handoff to the other repository, and do not assume an atomic cross-repository deploy. No implementation milestone is started by reading this document.


[INV-ASK-03/04 readiness](ASK-04-READINESS.md) records metadata-only visitor recovery,
advertised disclosure binding, focused restore/race/capacity evidence and the
independent receiver rollout boundary. Production has no approved Ask disclosure
and no intake; authority and HQ content custody remain independently verified gates.

The [closed Ask receiver rollout](ASK-04-RECEIVER-RELEASE_2026-10-13.md) installs
source 4daa713 without changing website or ingress identity. Updated readiness
also pins HQ's dormant private-content receipt from PR 83; neither source packet
activates operational HQ execution, finite Ask authority or visitor intake.

HQ documentary integration [PR 84](https://github.com/eugenelin89/bot_messenger/pull/84)
merged at `36ef02747fa6a8c6f6b84894f15718089efa2170`, after accepted private-storage
source `8034404c5df1b89c6cff10ed990814c154172478`. Its pinned
[morning handoff](https://github.com/eugenelin89/bot_messenger/blob/36ef02747fa6a8c6f6b84894f15718089efa2170/docs/operations/INV-REAL-01.md)
records the closed receiver release and HQ's anonymous public read-back.
[Readiness](ASK-04-READINESS.md#hq-documentary-integration) separates those public
observations from unverified genuine employee, custody/restore and capacity gates.
Finite Ask grants and immutable attempts are next HQ source work; login repair
alone cannot enable intake or establish public Ask eligibility. Website d0c4543,
Ask receiver 4daa713 and their independent rollback records remain unchanged.

The [later private-authentication update](ASK-04-READINESS.md#repaired-private-authentication)
records HQ's successful account/configuration/routing/private-investment eligibility
checks at 19:55–19:56 UTC, without model turns. The old 401 is historical. Public
Ask eligibility, reload-OFF attestation, new authority, genuine employee acceptance
and custody/restore/capacity gates remain incomplete; no public activation follows.
