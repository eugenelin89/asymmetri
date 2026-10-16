# Prompt 099: Compact public Trade experiment status

- Date: 2026-10-15
- Scope: design
- Goal: Replace the oversized public Trade status area with a concise, accurate summary while retaining operational and financial evidence.

## Original user request

> Simplify Public Trade Experiment Status — Coordinated Website Update

> I am going to bed. You have full authorization using the system both this computer and Ubuntu for HQ and for Asymmetri,co to complete this task.

The owner supplied a detailed coordinated request through BotSquad: use the existing website writer and direct project coordination; inspect production and repository source; replace the main page's status block with run state, actual freshness, last publication and next published review using readable labels and dates. Remove retained-run history, the close-amendment panel, methodology exceptions, deadlines, historical usage explanations and approval-reference material from this main presentation without adding a substitute disclosure panel. Retain immutable records, contract/API behavior, exact-run and evidence access, financial values and calculations, portfolio/holdings/decisions/journal/charts, navigation, portraits and previously approved wording. Preserve unknown/unavailable states and distinguish an active run from current employee activity. Validate responsive/accessibility behavior, obtain independent BotSquad review, use the guarded existing release procedure, compare service/configuration/authority/financial baselines and send the resulting evidence directly to the coordinator. No HQ, receiver or Ask mutation, authority expansion, financial dispatch or model-allowance change is authorized by this display task.

## Scope

The Trade landing page and its presentation components only. Exact-run views retain the detailed status/history/amendment and benchmark allocation evidence. APIs, schema, receiver, configuration, immutable events, financial journal, exports, arithmetic, links and operational services are unchanged. Existing “This trading experiment”, “Live Trading Desk”, hero layout and Atlas/Maya portraits remain.

## Decisions

A server-rendered Experiment Status section contains four labelled values. Canonical freshness maps to Current, Stale, Unknown or Market closed; an unverified response displays Unavailable for all fields. Missing dates in a verified response display Not published. Dates use readable UTC formatting here; exact evidence clocks retain seconds and milliseconds. One short sentence clarifies that run state does not establish live employee or trading activity.

Only the exact known historical close-amendment limitation is shortened into its benchmark comparison convention on the main page. Every other limitation is retained, including current quality failures and unknown future text. Full original text, allocation evidence and raw exports remain available. No substring-based blanket filtering or financial data mutation is introduced.

## Implementation

Added the compact component, scoped responsive grid and centralized labels. Main and unavailable landing states select the new summary, while explicit run routes retain the existing detailed component. A default-preserving portfolio presentation flag omits the historical detail panel and shortens the exact known note only on the landing page.

## Engineering impact

No dependencies, assets, API requests, runtime configuration or calculation changes. Semantic heading/description-list markup and existing contrast/focus styling are preserved. No client-side code is required for the summary. The financial presentation flag preserves full detail by default.

## Files changed

- Trade styles and a new Experiment Status component provide the compact layout.
- Showcase selects landing versus exact-run presentation; performance/portfolio components carry the explicit detail preference.
- Central content owns labels and the exact historical-note/benchmark-summary mapping.
- Content and testing documentation describe truthful fallback behavior and retained evidence.

## Documentation updated

`docs/CONTENT_GUIDE.md` explains landing/detail boundaries and date/freshness semantics. `docs/TESTING.md` adds manual acceptance scenarios for status and financial evidence preservation. No asset or deployment procedure changed.

## Git diff summary

Eight implementation/documentation files changed: 90 insertions and 16 deletions. This record is excluded from its own summary.

## Verification

- Local Node24.10.0 matches `.nvmrc`; TypeScript and ESLint pass with the existing tutorial-reader navigation warning.
- All22 Ask/Trade regressions pass. The initial sandbox loopback-listener restriction was resolved by rerunning the unchanged test with local listener permission.
- Eight focused rendering scenarios pass: four freshness values, unavailable status, compact landing, retained exact-run details and preservation of an unrelated current limitation.
- Browser checks at320,390,768,1024,1440 and1920 CSS pixels: no horizontal overflow; both portraits loaded; keyboard focus is a visible3px outline; status has no animation; no console errors. Failed archive reads show four Unavailable fields. Exact-run history, amendment, original limitation and benchmark evidence remain present.
- Independent BotSquad desktop/mobile/tablet, focus and console review passed. Desktop status height is161px versus1433px before; narrow mobile is375px.
- Production dependency audit found zero vulnerabilities; diff check and scoped privacy/prohibited-reference scan passed; no assets changed.
- Final Linux Node22.23.1 check,22 regressions, Sites build and Next webpack build pass. Build `uelSUV42FwWr1kXNQ_9Xf`, artifact SHA256 `b7a12ea9dbc7580d55bbb1b4c19acbc79efc609cd025a943998ae10aedcdad9a`,269 source hashes verified.
- Reserved-host guard retained965228KiB minimum available memory and13460107264 free bytes with HQ/nginx identities unchanged.
- Pre-release production baseline captured148 observations, including140 verified HTTP responses,74 original image checks and four known unrelated IPv6 TLS failures with unchanged reference fingerprints. Ask remains empty/closed and receiver records/configuration/authority are captured read-only.
- Guarded website candidate smoke, activation and final production comparisons follow this journal commit. Their final receipt is retained privately with the build evidence and reported directly to BotSquad; this record does not claim that activation has already occurred.

## Repository state after implementation commit

On main, implementation df5178a01138ea31a54612c9312c49bbf0019bf4; working tree was clean before creating this journal. One implementation commit ahead of origin/main. Push follows the separate journal commit. Next development's generated-only AGENTS and next-env changes were restored after the preview processes stopped.

## Implementation commits

- `df5178a01138ea31a54612c9312c49bbf0019bf4` — Simplify the public Trade experiment status

## Archive commit

Record compact Trade status engineering journal

## Lessons learned

Use exact verified record content for narrow historical presentation changes; a methodology label is not an amendment record ID. Unavailable data must never assert that a date was not published. Verify actual rendered financial limitations as well as the status section.

## Follow-up ideas

None committed. The separately coordinated HQ UX redesign requires its own verified labels, routes and sanitized tutorial evidence.
