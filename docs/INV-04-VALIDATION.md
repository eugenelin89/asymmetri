# INV-04 — Public showcase source and local acceptance

Date: October 9, 2026 (America/Vancouver). Status: **complete in source and local
synthetic validation; not deployed or activated**. The accepted implementation
and separate journal commit are pinned in [Journal 056](prompts/056-design.md).
This record supersedes INV-03's next-packet statement only; its historical
installation, ingress and recovery evidence remains unchanged.

## Delivered experience

- `/botsquad/investment`: streamed introduction, goal, official-run truth state,
  operational health, published example roster, Live Investment Desk, research
  library, discussions, decisions, portfolio, holdings and transaction journal.
- `/botsquad/investment/runs/[runId]`: retained exact-run view. Experiment history
  preserves the official pointer without treating the newest fixture as official.
- `/botsquad/investment/decisions/[decisionId]`: rationale, alternatives, risks,
  disagreement, reviews and exact order/fill/evidence references.
- Existing discussion, exact artifact/version/download and typed record pages
  remain available; nested evidence links retain their run and immutable version.
- `/botsquad/investment/methodology`: static methodology, missingness, benchmark,
  publication and experiment limitations, available when receiver reads fail.
- `/botsquad/ask`: static future capability. Embedded/contextual entry points
  display their context but accept no questions or invoke models.
- `/botsquad`: one scoped discovery section; existing company/product content
  and protected Motion resources are preserved.

Charts compare portfolio/benchmark returns on equal configured initial capital,
show published portfolio drawdown and explicitly derived benchmark drawdown,
and preserve missing observations as gaps. Derived benchmark drawdown requires
complete contiguous history and all benchmark marks; otherwise it is unavailable.
Captions, textual summaries, exact revision links, tables and CSV/JSON alternatives
accompany the SVGs. Holdings show allocation, cash, sector and provenance; journal
filters keep orders distinct from actual ledger effects. Filters/exports disclose
their bounded loaded-page scope.

## Contract, authority and privacy

The nine vendored v1 files remain unchanged, pinned to BotSquad
`ba3dd74bc6be495f655b5ad1e6e4ba3fdf85b755`, manifest
`7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`.
Schema002 and all migration files are unchanged. Server-side AJV validates public
DTOs against those schemas; browser components receive approved public DTOs only.
Money labels use exact decimal/BigInt arithmetic. Sequence comparison preserves
integers beyond JavaScript Number precision. CSV cells neutralize formula prefixes.

The server adapter allows only the configured loopback read origin, experiment,
run and named public resources. It rejects arbitrary URLs, redirects, extra query
parameters, oversized/invalid responses and identity mismatches. Bootstrap uses
nine bounded reads, at most two concurrently, and a final visibility witness.
`X-Archive-Visibility` adds archive/visibility epoch evidence; ordinary publication
does not change it. `X-Archive-Latest-Cursor` supplies a standard fixed-watermark
cursor to a bounded latest event window. Neither changes canonical v1 JSON.
The source requires the visibility header and fails closed against the previously
installed receiver until a separately authorized coordinated release.

Successful DTOs must agree with the final witness. Missing/unverified run mode
does not mount data clients or remove fixture protection. Open dynamic pages hide
cached records on failed visibility verification, withdrawal, restored browser
history or changed epochs. Visible pages verify about every 15 seconds with bounded
backoff; this is not instantaneous push withdrawal and cannot retract content
already downloaded. Exact downloads recheck visibility and content integrity.

The desk polls about every 12–13 seconds, backs off to about 96–97 seconds on
failures, and pauses while hidden. Catch-up uses at most two bounded event reads;
no recursive history load. Paused reading retains scroll and counts unseen updates;
ordinary publications do not remount it. Expired/invalidated cursors clear cache,
reconcile status/snapshot and obtain a new window. Unmount cancels active desk reads
and timers. Static Ask/methodology do not depend on live visibility checks.

The 53-event fixture uses invented people, instruments, reports, prices and activity,
all `synthetic_fixture`, with a persistent label above the content. It contains
positive/negative/partial/corrected valuations, disagreement, exact versions,
rejected/cancelled/expired orders, available/withheld/withdrawn records and an ended
run. It demonstrates interface behavior, not intelligent employee execution.
The local harness signs and validates batches in a fresh disposable database,
revokes test keys after seeding, exposes GET-only loopback reads and cleans up on
exit. Test-only append commands temporarily authorize one in-memory fixture key,
then disable and revoke it. No operational database, HQ, market source, provider,
real publisher, visitor store, analytics, account or financial authority is used.

## Executed verification

| Check | Actual result |
| --- | --- |
| Runtime | Node 24.10.0 matches `.nvmrc`; nvm unavailable |
| TypeScript/ESLint | `npm run check` passes; existing tutorial internal-navigation lint warning, zero errors |
| Focused UI/data helpers | `npm run test:investment`: 3/3 pass, exact decimals, sequence ordering, CSV safety, run context and incomplete benchmark guards |
| Full receiver suite | `npm run receiver:test`: 202/202 pass, including 200 inherited tests and new fixture/tail/witness/expiry tests |
| Contract integrity | Receiver contract check passes; canonical v1 files/migrations unchanged |
| Standard Next compatibility | Final `npm run build:next -- --webpack` passes |
| Default Next build | Turbopack fails with environment EPERM creating a PostCSS process/port; not counted as passing |
| Sites/Vinext | Final `npm run build` passes all five phases; no hosted preview or publication |
| Local packaged runtime smoke | Built Vinext Node server and compiled Worker under local Wrangler each return 200 with the expected unconfigured showcase; no cloud deployment |
| Production audits | Root and receiver `npm audit --omit=dev`: each 0 vulnerabilities; network-restricted retry succeeded with approved network access |
| Development dependency scope | Full audit still reports 23 dev-toolchain findings; no unrelated broad toolchain upgrade |
| Whitespace/privacy | `git diff --check` and targeted changed-file secret/private-source/prohibited-reference scans pass |

Browser acceptance used the built Next site and real local signed receiver harness:

- Actual CSS widths **320, 390, 768, 1024, 1440 and 1920**: eight main sections,
  two SVG charts, zero horizontal document overflow and zero broken images at each.
  Exact typed review page also checked at 320. [Measurements](validation/inv04/responsive.json).
- Keyboard skip link reaches main; visible teal focus, desk Home pauses following,
  labelled selects, touch-size controls, chart title/description and table captions
  inspected. No runtime console errors during the normal visitor journey.
- Research v2 → discussion/objection/closure → decision → filled order/ledger receipt
  → later review, including nested evidence, works. Quantity is labelled in shares,
  money in USD. Final built discussion link targets the exact run's decisions.
  Forty-four observed local main-page links returned 200 with no identity/mode errors.
- Chart recent/all windows, a missing observation, negative outcome, corrected v2,
  accessible performance table and actual downloaded CSV checked. Saved CSV contains
  11 observations, synthetic notice, eight columns and derived drawdown values.
  The committed CSV copy normalizes CRLF to LF for repository whitespace checks;
  field values are unchanged.
  JSON uses the same verified loaded DTOs; its download was not independently saved.
- Paused desk stayed at scroll position zero after an appended signed event, showed
  one unread update, and Jump to latest showed it. A larger history (>100 events)
  exposed stable first/next pages. Expiring the cursor produced the visible reset
  message and recovered to the verified latest window.
- Withdrawal while an artifact was open removed its title, body and download;
  the main library no longer exposed its title. Simulated total outage hid cached
  charts/records and automatically recovered after the fault cleared. An event-only
  outage suppressed data clients instead of losing the fixture mode boundary.
- Stale/ended status retained labelled historical metrics without inventing worker
  presence. Default unconfigured and configured empty archives rendered no invented
  roster, charts or money. Ask/methodology remained static and usable during failure;
  no question form/input/session/provider was activated.
- Reduced-motion CSS was inspected in the rendered stylesheet: animation,
  transitions and smooth scrolling are disabled. Normal-page computed animation
  names were `none`. OS-level reduced-motion emulation and a screen-reader audit
  were not available and are not claimed.
- Built-site regressions covered 17 route/redirect responses, tutorial canonical
  and 116 existing element IDs. All 24 tutorial image/original-image URLs returned
  200. Sitemap/robots and protected route sources remain unchanged. Apex and `www`
  each returned 200 for `/motion`, `/privacy`, `/support`, `/tutorial`; the tutorial
  canonical remains exactly `https://www.asymmetri.co/tutorial`.

Screenshots are unedited local synthetic evidence:
[desktop introduction](validation/inv04/overview-1440.jpg),
[mobile introduction](validation/inv04/overview-390.jpg),
[portfolio comparison](validation/inv04/portfolio-1440.jpg), and
[downloaded CSV](validation/inv04/performance-export.csv).

## Review findings and corrections

Two independent read-only development agents reviewed contract/security and
product/accessibility. Both accepted the final corrected source; they did not claim
to independently repeat the primary agent's browser session. Blocking findings
resolved included visibility race/missing-mode fallback, status ETag remounting
paused reading, desk timer cleanup, large-number rounding/sequence precision,
incomplete benchmark peaks, unreadable nested exact records, share units, missing
successful-empty messages, static pages unnecessarily depending on the receiver,
and the archived-run decision link. Browser inspection also corrected the sticky
synthetic banner under the company header. The misframed chart screenshot was
recaptured before acceptance. No unresolved source blocker remains.

## Existing production preservation

Read-only SSH observations before/final acceptance agreed:

- Public website source remains `745a92c676bcbe85c3aa675a1099d26321f1c1e2`;
  build ID `Ic-zxi4WHpmgjiSDnsJCw`, main PID 2304100 and activation time
  `2026-10-09 02:48:45 UTC` unchanged. No service restart or deployment occurred.
- Receiver configuration `enabled:false`; documented explicit-enable marker absent;
  unit inactive, enablement static; no listener on its configured port.
- Operational events, publishers, publisher keys and batches each remain **0**.
- Existing Asymmetri Nginx configuration digest unchanged. No public ingress,
  DNS, certificate, infrastructure, permission, grant or paid resource was created.
- No unrelated website, BotSquad HQ, OS or production receiver file was modified.

## Next packet and later activation gates

INV-05 may start in BotSquad only on a separate owner request, using deterministic
fixture prices/clocks and the frozen simulator rules. It is not started here.
Later work still owns permitted US$0 market evidence/redistribution (INV-06),
trusted HQ publishing and authority/key/receipt reconciliation (INV-07), actual
collaboration (INV-08), owner-controlled scheduling (INV-09), all four Ask packets,
cross-system acceptance (INV-10), forward trial (INV-11) and explicit activation
(INV-12). Shared HTTPS/TLS ingress, the rejected Nginx HTTP proxy profile, real
sustained public capacity, live-data backup/retention/independent custody, source
rights and the unsupported Ubuntu 22.10 exception remain separate launch gates.
Successful frontend validation does not close any of those gates.
