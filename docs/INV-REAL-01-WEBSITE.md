# INV-REAL-01 — Website integration and release handoff

Date: October 13, 2026 (America/Vancouver). **Website publicly released and verified.
Observed-data activation remains held by producer authentication.** This is the current
handoff, superseding the next-milestone descriptions in the historical INV-04 record.

## Authority and scope

The owner requested that the BotSquad INV-REAL-01 chat route website work to the
Asymmetri.co project and document the overnight work. The owner subsequently said:
“just proceed to deployment and public release when ready. no need to ask me for
approval.” That authorization covers a verified release; it does not establish
producer readiness, genuine records or a completed forward trial.

The owner reports direct Yahoo confirmation for the complete personal,
noncommercial hobby project, including automated research, simulated investing and
publication through the owner's personally registered website. The owner retains
permission/compliance responsibility. This is owner-reported confirmation; no
independent written verification is claimed. No additional Yahoo licensing
investigation or provider-rights approval milestone is required. Preserve normal
technical provenance, integrity, rate limits, access-denial handling and point-in-time
accounting. No real trades, paid data or credit purchase/reload is included.

## Compatible website implementation

The canonical v1 manifest remains
`7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`.
No schema, migration, receiver financial invariant or signed transport is changed.

- Existing desk, research, discussions, decisions, portfolio/benchmark, journal and
  exact-record routes are reused. The methodology page describes `inv-real-open-v1`.
- Verified public run descriptions, frozen settings and limitations are displayed.
  The publisher owns the public descriptions; the website invents no owner quote,
  employee summary, observation or portfolio result.
- `observed_paper` is explicitly labelled observed market data with modeled paper
  results. Synthetic fixtures retain their labels. Failed verification is described
  as unavailable, not evidence that an experiment never started.
- A future-session decision precedes its target OPEN. The completed daily bar is
  retrieved after close; the OPEN is a modeled execution reference. The display
  separates market as-of, evidence availability/retrieval, ledger effective and
  accounting-recorded times. Exact records retain publication receipts.
- Journal and CSV show accounting/evidence clocks; source summaries expose their
  limitations. Holdings show mark retrieval time. Cash is labelled as cash at the
  last complete valuation, not unreserved spending capacity.
- Incomplete observations expose quality and reasons. Pagination does not imply
  newest data. Chart paths break across absent valuation sequences as well as null
  values; hidden records do not acquire an interpolated return.
- Ask BotSquad remains unavailable. No input, visitor session, private transcript,
  source-response body, credentials or operational control is added to public routes.

## Producer coordination and readiness

BotSquad owns the simulator, observed data admission, genuine employees, scheduler,
persistent history and public projection. Website preflight reviewed producer base
`b06bc51059372b633c98b68ecc3ef144f999781c` and its active INV-REAL-01 source. That
working source is not a deployment identity or acceptance result.

Independent review found the original simulator public projection synthetic-only,
and the original team projection capable of publishing selected raw private text.
These findings were sent to the producer chat. The producer acknowledged the need
for explicit public decision/review summaries with genuine execution provenance,
and an observed v1 projection using a 36,000-second opening-evidence window.
No observed payload is accepted merely because these changes are planned.

Before enabling observed reads, verify the producer's accepted commit, public-only
projection, real publication grant/key lifecycle, exact configuration approval,
signed end-to-end receiver acceptance and immutable receipt reconciliation. Existing
publication controls establish exact scope/content integrity, not a renewed Yahoo
licensing gate. The receiver version must supply `X-Archive-Visibility` before
website reads are configured. Preserve strict signed ingress; the old normalizing
HTTP proxy remains unsuitable. Private installation, website release and real
publisher activation need separate evidence even though deployment is authorized.

## Validation and review ledger

Two independent read-only reviews accepted the final source scope. Compatibility
review confirmed unchanged v1 support and identified producer projection blockers.
Website review corrected two P2 findings: timestamp precision and accessible
sequence-gap counts. Both fixes have focused regression tests.

- Node 24.10.0 matches `.nvmrc`; nvm is absent. Locked dependencies installed.
- `npm run check` passes (zero errors, one existing tutorial navigation warning).
- `npm run test:investment`: 5/5 pass, including sequence gaps and UTC precision.
- `npm run receiver:test`: 202/202 pass; original sandbox listener denial was
  resolved by approved loopback access. Canonical manifest check passes.
- Both `npm run build` (Sites/Vinext) and default `npm run build:next` pass.
- Root and receiver `npm audit --omit=dev`: zero vulnerabilities each.
- Actual browser widths 320, 390, 768, 1024, 1440 and 1920: no horizontal overflow,
  no broken images, two charts, frozen settings disclosure intact. Keyboard Enter
  toggles it with visible teal focus. Exact timestamps and fixture labels verified.
- Browser console initially had no errors/warnings. A CSV-download tool call stalled
  and eventually timed out; no new successful CSV-download claim is made. During
  the long stall, the disposable fixture exhausted its frozen-clock read quota;
  the visibility boundary correctly hid previously displayed records. Preview was
  stopped and its disposable archive removed. This was not a production incident.
- Reduced-motion styles remain unchanged; no OS-emulated or screen-reader audit is
  claimed. No public asset or dependency version changed.

Fixtures prove interface/accounting behavior, never genuine reasoning or elapsed
market sessions. Producer later delivered PR75 at deployed
`d262a8dff59ab82587bd6444b083e5e9b7603cf0`, with signed acceptance against this
compiled receiver (5/5). Its production account returned 401, so no observed run or
new employee authority is active. Later Ask source PR77/78 remains separate.

## Production baseline and release receipt

Read-only preflight: clean production main
`745a92c676bcbe85c3aa675a1099d26321f1c1e2`, service PID 2304100, activation
`2026-10-09 02:48:45 UTC`; 14 GiB free disk, 343 MiB available RAM and about 1.8 GiB
free swap. These are bounded observations, not load acceptance. Existing Node 22
approval remains effective. The unsupported Ubuntu 22.10 exception is reviewed for
this release; no OS upgrade or unrelated-site configuration change is included.
The isolated candidate passed production checks and the Next.js build before the
existing website service was switched at **2026-10-13 15:04:43 UTC**. Released source
is `97b4087b79c5f0f1472fd71dde86765489273400`, build
`kcKfT0zA-jDnr0xVy1Suy`; service PID 2369353. Production source is clean main.
The complete preceding source/dependencies/assets/build remain at
`/var/www/asymmetri-rollback-20261013-745a92c`, source
`745a92c676bcbe85c3aa675a1099d26321f1c1e2`, build `Ic-zxi4WHpmgjiSDnsJCw`.
The temporary candidate listener was stopped after activation.

Production npm 10.9.8 rejected the existing lockfile with missing optional emnapi
entries. The candidate installed the unchanged lockfile successfully using pinned,
one-shot npm 11.6.0, matching local validation. No global npm/Node, lockfile or
dependency version was changed. The existing tutorial lint warning remains.

- All 28 checks across apex and www returned 200, including the four protected
  Motion routes, investment, methodology, Ask, robots and sitemap.
- Tutorial's exact www canonical, anchor IDs and original image URL sets match the
  pre-release baseline; all 48 image requests across both hosts return image/200.
  A local concurrent image probe hit a TLS timeout; the complete server-side HTTPS
  check passed. This does not establish a new persistent availability fault.
- All 15 discovered shared-vhost responses match their baseline, including the
  existing draft 502 and two relay 410 responses. Nginx/config hashes are unchanged.
- Website and Nginx are active; no service errors appeared in the release window.
  Public browser widths 1440 and 390 have no overflow, broken images or console
  warnings/errors. Temporary viewport overrides were reset.
- Investment explicitly displays **Public archive not configured**. Methodology
  displays the observed-paper method and owner-reported Yahoo confirmation. Ask
  accepts no questions. No receiver/publisher key, grant, run or read configuration
  was activated by this website release.

Sanitized detailed baselines and screenshots are retained outside tracked source.
This documentation follows the deployed source; documentation-only commits do not
change the running build identity above.

## Remaining integration

Owner-only `approve-run` and `select-official` source now provide exact configuration
approval and explicit checked official selection without SQL edits or a wire/schema
migration; [commands](INVESTMENT_RECEIVER.md#observed-run-approval-and-official-selection).
No operational run approval or selection has been made.

The private receiver compatibility installation is complete at
`c2edfd50ed12ba576c06e6991091090b9ced3e31`: 207/207 actual Linux tests and 61/61
isolated TLS checks. Runtime source is recorded in `/opt/asymmetri-receiver/SOURCE_COMMIT`;
rollback is `/opt/asymmetri-receiver/rollback-20261013-inv-real`. The unit remains
inactive/static, configuration disabled, no port 3101 listener, and zero events,
batches, nonces, content objects or publishers. Migration 2 integrity/FK checks
pass. Website PID/start time, receiver configuration/unit and Nginx were unchanged.

[Private Ask source](ASK-01-PRIVATE-RECEIVER.md) adds a separate disabled subsystem;
it is not included in that installed receiver identity. Remaining: strict shared-apex
HTTPS delivery, verified ongoing backup/retention custody, genuine publication and
as-of history, private Ask interoperability/installation and visitor UI. No fixture
or empty archive substitutes for these outcomes.
