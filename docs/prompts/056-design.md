# Prompt 056: INV-04 public investment showcase

- Date: 2026-10-09
- Scope: design
- Goal: Complete a locally validated synthetic BotSquad showcase and its reviewed cross-repository handoff without activating production.

## Original user request

> CODEX CLI — BotSquad Investment Showcase INV-04
>
> Complete Public Showcase UI — Synthetic Demonstration, Integration, Accessibility and Git Handoff
>
> Proceed autonomously with **INV-04 only**.
>
> **Do not deploy the public website, activate real investment operations, create paid resources or begin the next milestone.**

The large attached request authorized frontend implementation, archive integration,
deterministic fixtures, independent read-only review, browser acceptance,
documentation, the website's two-commit/main push workflow, and a reviewed BotSquad
documentation branch/worktree PR and merge. Its decision-oriented scope follows.
No private attachment location or generated filename is retained.

## Scope

Complete the introduction/purpose, roster, Live Investment Desk, discussion and
artifact pages, decisions/dissent, performance/benchmark/drawdown, holdings,
transaction journal, methodology, health/truth states and disabled general/contextual
Ask preview. Preserve exact immutable evidence links and the work-to-outcome journey.
Use the frozen v1 contract, existing archive semantics and server validation; do not
invent real employees, activity, prices, official configuration or financial outcomes.
Exercise desktop/tablet/mobile, keyboard access, accessible chart/table/export
alternatives, pagination, pause/follow, stale/empty/error/withdrawal/recovery states.
Preserve company styling, Motion resources and both Next/Vinext build paths.

The owner required one integration writer and independent development reviewers,
not runtime employees. Inspect the accepted INV-03 baseline and Decision029/030,
the investment decision log, simulation rules and roadmap before changes. Keep the
US$0 market-data constraint and future activation dependencies explicit. Do not
recreate migration/recovery milestones or change HQ, production services, installed
receiver state, ingress, keys, permissions, hosting, market sources or paid resources.
The final report must distinguish implementation, validation, deployed state and
future gates, include exact Git evidence, and stop before INV-05.

## Decisions

- Use existing Graphite/Teal tokens, semantic server-rendered sections and small
  client components only for controls/polling/charts. No new public visual assets.
- Serve labelled fixture data only through a signed, validated, disposable local
  receiver. Ordinary unconfigured builds show empty truth states without invented
  team members or financial data. Ask is a static disabled preview.
- Keep canonical contract files/migrations unchanged. Add visibility and bounded
  latest-window cursor headers without changing v1 JSON. Require a matching final
  visibility witness and a verified run mode before rendering dynamic data.
- Preserve exact versions/run context, finite pagination, hidden-tab pause,
  reconnect/backoff and paused-reader position. Withdrawal fails closed on the next
  verification; existing downloads cannot be retracted.
- Keep financial presentation exact where accounting precision matters. Benchmark
  drawdown is explicitly derived and unavailable when loaded history cannot prove
  the peak. Nulls/gaps never become zero or invented interpolation.
- Add AJV/format validators for the pinned server DTOs. Lockfile resolution updates
  fast-uri to a non-vulnerable compatible patch. Avoid unrelated dev-tool upgrades.
- No deploy/activation occurs. A future coordinated receiver/site release must
  supply the new visibility header before the new dynamic reads can succeed.

## Implementation

The showcase, exact run/decision routes, static methodology/Ask pages and scoped
read adapter are complete. Existing archive/detail/download pages now share visible
truth labels, readable typed records, nested evidence links and visibility protection.
The fixture includes 53 deterministic signed events, positive/negative/missing and
corrected valuations, objections/review, available/withheld/withdrawn artifacts,
order outcomes and an ended run. Local fault controls exercise pause, cursor expiry,
withdrawal and outage without operational state.

## Engineering impact

The read adapter performs nine finite bootstrap reads with at most two in flight,
schema/identity/byte/timeout checks and a final epoch witness. Desk polling is finite,
backed off and hidden-tab-aware; no recursive catch-up or model execution. The
receiver adds additive response headers while retaining signing, authority,
fixed-watermark cursors, filtering and migrations. Native SVG/table/CSV/JSON
alternatives preserve non-visual access and exact record context. No database,
authentication, analytics or visitor-message backend is added to the website.

## Files changed

- BotSquad showcase, run/decision/methodology/read/Ask routes and existing archive
  routes; one discovery section on the BotSquad page.
- Focused investment UI components, scoped CSS, shared copy and strict read/display
  helpers; root package/lockfile for validation and local test commands.
- Receiver read headers plus deterministic fixture, preview harness and tests;
  focused exact-decimal/sequence/export/history tests.
- Architecture, content, development, deployment, receiver, testing and asset docs;
  local synthetic screenshots, measurements and downloaded CSV evidence.

## Documentation updated

README and seven implementation guides describe routes, commands, bounded reads,
fixtures, data truth states, accessibility and the unchanged deployment boundary.
The asset manifest records unchanged public assets and synthetic acceptance files.
[INV-04 validation](../INV-04-VALIDATION.md) owns detailed browser results, failures,
review dispositions, runtime limits, read-only production observations and later gates.
BotSquad's separate docs PR will pin these accepted commits; it changes no HQ runtime.

## Git diff summary

Implementation: **53 files changed, 1,483 insertions and 147 deletions**, including
three synthetic screenshot binaries. The change is concentrated in BotSquad routes,
investment UI/read helpers, two receiver files, fixtures/tests and affected docs.
Existing Motion pages, brand images, site infrastructure and contract files remain
unchanged. This record is excluded from those totals.

## Verification

- Node24.10.0; TypeScript/ESLint pass with one existing tutorial warning.
- Root focused tests3/3; full receiver tests202/202; frozen contract check passes.
- Final Next webpack and Vinext builds pass. Default Turbopack fails on local
  sandbox process/port EPERM; that attempt is not reported as passing.
- Built Vinext Node and local compiled Worker return the correct safe empty view.
- Root/receiver production audits each0; existing full dev audit23 findings remains
  outside this scoped runtime change. Whitespace and privacy/reference scans pass.
- Browser CSS widths320/390/768/1024/1440/1920 show no document overflow or broken
  images. Full evidence journey, keyboard focus/skip, chart window/table/CSV,
  exact typed quantities, pause/unread/jump, >100event cursor expiry/recovery,
  withdrawal, outage/recovery and empty/unconfigured cases pass.
- Reduced-motion rendered CSS checked; OS emulation/screen-reader audit not claimed.
  JSON export uses the verified shared export component but was not independently saved.
- Local17route checks,24tutorial image URLs and8live apex/www protected-route checks
  pass. Tutorial canonical/IDs and sitemap/robots preserved.
- Two independent read-only reviewers accept corrected contract/security and product
  source; product reviewer also accepts screenshots and the validation record.
- Production website SHA/build/PID/activation time and Nginx digest unchanged;
  receiver inactive/config disabled, enable marker absent, four operational counts0.
  Disposable preview servers stopped and browser viewport override reset.

## Repository state after implementation commit

Main began clean and synchronized at `e1b750bbecb4c3aedcbddeb94a4aab4c64bf6b03`.
The implementation commit leaves a clean working tree, one commit ahead of origin.
The initial unpublished implementation commit was finalized before handoff to
normalize the saved CSV's CRLF to LF; downloaded field values were preserved.
No unrelated work was present or staged. The journal is the second commit and both
will be pushed without force. No website feature branch, worktree, PR or release.

## Implementation commits

- `c31f500c6ebb063341bca7444dac6782df7a7b17` — Implement INV-04 synthetic investment showcase and local acceptance

## Archive commit

`Document INV-04 showcase implementation in engineering journal 056`

## Lessons learned

Ordinary data changes and visibility revocation need distinct signals: a normal
status ETag remounted paused readers. A successful build does not prove withdrawal,
cursor recovery or accessible record navigation, so test those journeys with signed
fixtures. Preserve exact decimals beyond Number precision and require enough history
before deriving peak-dependent metrics. Check saved screenshot framing and evidence
line endings before recording acceptance.

## Follow-up ideas

INV-05 is ready for separate owner selection in BotSquad; do not start it here.
Real data/rights, trusted HQ publishing, actual collaboration, schedules, all Ask
packets, shared TLS ingress, sustained public capacity, independent backup custody,
unsupported-OS review, forward trial and explicit INV-12 activation remain future work.
