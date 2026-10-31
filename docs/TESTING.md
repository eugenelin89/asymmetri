# Testing

## Required checks

For meaningful implementation changes, confirm that `node --version` matches
`.nvmrc`, then run:

```bash
npm run check
npm run build:next
npm run build
npm audit --omit=dev
git diff --check
```

`npm run check` runs strict TypeScript validation followed by ESLint.
`npm run build:next` validates the standard Next.js build used by DigitalOcean
production. `npm run build` validates the retained Vinext and Cloudflare Worker
path.

Ask launch regressions in `receiver/test/ask-admission.test.ts` exercise paused
claims/delivery and changed session consent through real disposable HTTP listeners.
They require no provider credentials or model calls. Exact prior receipts, owned
reads and cancel/delete must survive these admission changes. The authored UI
helpers run with `node --test tests/ask-ui.test.mjs`; browser acceptance additionally
checks old publication/unknown event dates, source limitations, disabled context
removal during delayed preflight, focus across normal renewals and suppression
after a failed refresh reaches the body deadline. See the
[closed launch packet](ASK-LAUNCH-CLOSED.md) for the operational boundary.

## Route checks

When routes or shared layout code change, verify:

- `/` (Asymmetri umbrella and peer divisions)
- `/labs` (open-source playground and project list)
- `/labs/gis` (GIS Apps cards and street/building reconstruction explanation)
- `/labs/vancouver`, `/labs/surrey`, `/labs/richmond` (original city URLs retained by the GIS grouping)
- `/sports` (division, founder story, Motion family and anchors)
- `/botsquad` (experimental, SSH-tunnel access, deferred native mobile)
- `/botsquad/trade/guide` (dated technical explanation, noindex, contents,
  glossary, readable diagrams/tables and genuine public-interface screenshots)
- `/botsquad/trade/hq-guide` (companion links, twenty contents targets,
  five UX-01 sample captures and seven historical crops, preserved anchors,
  code blocks and numbered task/investigation steps)
- `/about` (real company page, no redirect)
- `/motion` (real product page, truthful release status)
- `/motion/try` (307 to the exact public Google Form in `motion.access.formUrl`;
  temporary, not 308; no extra landing page or sitemap entry)
- `/tutorial` (actual guide, exact www canonical, no redirect)
- `/privacy` and `/support` (actual articles, not homepage redirects)
- `/sport` → `/sports`; `/work` → `/labs` (308, including fragment preservation);
- `/story` → `/sports#story`; `/contact` → `/#contact` (existing footer email)
- `/why-asymmetrico` → `/about`;
  `/work/asymmetrico-platform` → `/sports`
- `/robots.txt`
- `/sitemap.xml`
- `/favicon.svg`
- `/images/labs-social.png`, `/images/sport-social.png` and retained `/og.svg`

Confirm successful responses, correct page titles and canonical values, and no
broken public assets. Verify footer links on all ten main pages, mutual
Privacy/Support links, the `mailto:info@asymmetri.co` contact, direct company/product
navigation from utility pages, exactly one H1 per article and ordered H2 sections.
The sitemap must include all ten indexable canonical routes; robots must allow them.
Check the policy effective date and bounded app/platform/website/email claims
against `docs/WEBSITE_PRIVACY_AUDIT.md`. Inspect cookies, browser storage and
network resources for accidental tracking, forms or external scripts/fonts.

When changing Worker or Vite binding configuration, request at least one
`/_vinext/image` URL from the local Vinext server and confirm that it returns an
image response without a Worker exception.

## Motion access requests

Verify both Motion access buttons and the Sports product-section button point to
`/motion/try`, expose their eligibility/provider text through `aria-describedby`,
and remain reachable with visible keyboard focus at mobile, tablet and desktop
widths. Retain the how-it-works, Motion family, tutorial, privacy/support and
product-detail links. Follow an access link to the public form, verify its title
and required fields, and do not submit a synthetic response to the live sheet.
Before navigation, the website must not load Google Forms resources or introduce
form inputs, tracking, cookies or browser storage for the form. Check the current
policy date and `#testflight-access` disclosure. A request must not imply a confirmed
invitation, download, App Store launch or external TestFlight build availability.

## Visual and interaction checks

For visual, layout, or navigation changes, verify the affected routes at:

- 320 CSS pixels;
- 390 CSS pixels;
- 768 CSS pixels;
- 1024 CSS pixels;
- 1440 CSS pixels;
- 1920 CSS pixels for wide desktop.

Check:

- HQ guide: follow Home → New task → Start task → All tasks → Open task →
  Results and files in an isolated sample HQ, checking current labels, employee
  profile, attention, retry-loading instructions and original result visibility.
  Confirm six destinations and the private Investment navigation. Current sample
  captures and October 15 historical evidence must be clearly distinguished;
  original image URLs and historical anchors must remain available. Compare the
  capture manifest with the final HQ UI asset hashes before releasing the guide.
- The Trade landing page leads with the latest-decision summary, followed by the
  four-field Experiment Status summary.
  Exercise fresh, stale, unknown, market-closed and unavailable reads; failed
  reads must not become “Not published” dates. Dates in this summary use UTC.
  Confirm full status/history/amendment evidence remains on an exact-run page,
  current portfolio limitations and comparison conventions remain visible, and
  raw exports, financial values and charts are unchanged.
- Both guides cross-link and the HQ companion is directly discoverable from Trade
  and methodology/archive. Its narrow sidebar capture must not be stretched; wide
  captures have full-size original links. Code blocks scroll within labelled,
  keyboard-focusable regions; private source labels never become HQ access links.
- HQ `#tail-logs` is reachable from contents, pause troubleshooting and escalation.
  Verify all four SSH command blocks copy as shown, including nested quotes in the
  recent-history command and `--once`. The dated helper must be labelled as an
  incident-specific read-only tool. Preserve UTC/Vancouver context, Ctrl+C meaning,
  private-output handling and the distinctions between service, stage and decision.
  At narrow widths, command blocks scroll within their labelled keyboard regions.
- Trade guide links from the showcase, methodology/archive, Research and overview;
  all guide contents anchors and return links; screenshot loading, captions,
  meaningful alt text and full-size original links; tables scroll within their
  labelled region rather than widening the page; keyboard focus, print styles
  and readable article measures at narrow and wide widths;

- Sports/Labs disclosures expose overview and direct BotSquad/Motion links;
- Enter/Space opens disclosures, Tab reaches links, Escape closes and restores
  focus, outside-pointer interaction closes, and opening one closes the other;
- disclosures and their links remain usable without JavaScript;
- About opens `/about`; Contact opens the centralized mailbox; no current link
  targets the removed homepage product showcase;
- Sports retains Story → Approach → Product → Contact and its Motion action;
- old root `#story`, `#approach`, `#product` migrate to Sports;
  legacy `/#contact` and `/contact` reach the homepage footer email;
- no horizontal overflow;
- readable hierarchy and comfortable line lengths;
- graphite-header logo/nav contrast, the shared Asymmetri → Sports/Labs → product links,
  product statuses and distinct product panels at all widths;
- homepage contains one gateway section between header/footer, with no philosophy,
  product showcases, common-thread or contact section;
- explicit equal division/product links, one “Why Asymmetri” action, comfortable
  responsive height and no clipped content or excessive empty space;
- Pitching v1.2 private TestFlight versus pending public release, Hitting in
  development with experimental measurements, planned Team/Dual View, exactly
  one professional app and its three nested entitlements, finite Cloud and later
  Mechanics Lab/Enterprise;
- the Motion Reference Study link opens `/tutorial#reference-study`; Notes,
  PDF sharing and comparison steps are reachable in guided/complete/no-JS modes;
  Explore starts with All while Saved Views retain filters; all prior tutorial
  hashes and original-image links remain valid;
- Labs introduction/open-source statement, “Currently playing with,” GitHub/detail/
  established-license links and short closing; no Labs approach/principles section
  or stale `/labs#approach` links;
- Labs menu contains GIS Apps in place of the individual city entries, while
  BotSquad and its nested links stay intact. Follow Labs → GIS Apps → each original
  city URL and verify source/licence links, metadata and sitemap entries. Footer
  city shortcuts and Motion resources remain reachable. The GIS hub must render
  its cards and reconstruction discussion without JavaScript and must not load
  either city's engine or datasets. Check mobile/tablet/desktop layout, keyboard
  disclosure navigation/focus, reduced motion, images and overflow; compare old
  route, canonical, fragment and versioned asset/data URLs before and after.
- About origin and BotSquad example/access/current focus;
- image loading, crops, and alt text;
- compact mobile navigation;
- keyboard navigation and visible focus;
- skip-link behavior;
- touch target usability;
- `prefers-reduced-motion`;
- browser console errors;
- hover-independent interactions.

## Accessibility

Maintain at least WCAG AA contrast for normal text. Accent colors on light
surfaces should use the accessible dark variants defined in
`docs/VISUAL_IDENTITY.md`.

Use semantic landmarks and headings, descriptive link text, properly labelled
controls, meaningful alt text, and text or structure in addition to color for
state.

## Privacy and content checks

After content, asset, metadata, or product-visual changes:

- scan for the private source organization and its abbreviations;
- scan for former company-name/product combinations;
- scan for credentials, private keys, tokens, and athlete information;
- confirm public product reconstructions are synthetic; the specifically authorized
  tutorial captures must retain genuine values and exclude profile/system details;
- confirm verified V1 capabilities, scientific interpretation limits and future
  direction remain distinct;
- confirm the asset manifest reflects all public asset changes.

Never paste sensitive scan matches into prompt records.

## Dependency checks

Review both `package.json` and `package-lock.json` after dependency changes. Use
`npm audit --omit=dev` for production exposure and investigate warnings before
adding overrides.

Do not update packages solely to silence a warning without confirming runtime
compatibility and the affected dependency path.

## Deployment verification

The [INFRA-01 cancellation](INFRA-01-CANCELLATION.md) passed the unchanged 198-request
baseline; no retirement response overlay was applied. Reusable INFRA-01 tooling
compares every hosted site against an independently reviewed production
baseline, including expected errors and retired endpoints. See
[its validation ledger](INFRA-01-VALIDATION.md) and the
[Python/curl helper](../ops/infra/README.md). Run the helper's focused checks with
`python3 -m unittest discover -s ops/infra -p 'test_*.py'`. Keep its private manifests,
DNS/TLS records and responses outside Git. Local macOS builds and SQLite restoration
do not establish Ubuntu LTS, every-site staging, renewal or production-cutover
acceptance. The archive helper requires a new case-sensitive destination and
independently trusted manifest/hash. Linux synthetic owner tests remain distinct from
private Mac file restoration. Retired-domain response changes need a separately approved
expected-result overlay; preserve the original baseline. See the [retirement acceptance
amendment](INFRA-01-DJANGO-RETIREMENT.md), now a deferred historical proposal.

A DigitalOcean deployment requires a successful local `npm run build:next`
before the commit is pushed. On production, the standard Next.js build must
complete before `asymmetri.service` is restarted. Verify the loopback
application at `127.0.0.1:3001`, the public HTTPS endpoint, important static and
metadata routes, permanent redirects, service status, and recent logs. Follow
`docs/DEPLOYMENT.md`.

The standard Next.js production executable is
`node_modules/.bin/next start`. Do not use `npm run start` for DigitalOcean
because that script starts Vinext.

When an OpenAI Sites deployment is explicitly requested, a successful Vinext
`npm run build` is required before saving a Sites version. The saved version
must reference the exact pushed commit and the archive built from that source.
Poll deployment status to a terminal success or failure state.

Private Sites deployments may require ChatGPT sign-in before route-level browser
inspection. A successful provider deployment does not replace local route,
accessibility, and privacy verification.

## Motion marketing regression

Verify the eight-step workflow, event-grouped measurements and six-stage evidence list remain readable at every
width. Confirm conditional HFR wording, exact human confirmation, projected 2D
qualifiers, descriptive comparison and the release state against the current
source review. Do not expose Developer-only metrics, future features, an unverified
Store link or price. Check the icon and product Open Graph/Twitter image, factual
SoftwareApplication schema and absence of offer/rating fields. Compare the utility
content export with its prior committed version; shared navigation must preserve
the audited app/Apple/support-retention meaning. Only the approved website-media
disclosure and effective-date history change with the videos. New assets require provenance and rights review.


Check Measure / Track / Compare / Learn, one pitch → history, two-period questions,
manual mechanics/performance context, evidence return and human interpretation.
Verify all eight view/event entries against the owner-approved public mapping in
`MOTION_PRODUCT_REVIEW.md`: three Side FFC, two Side Ball Release, one Back FFC
and two Back Ball Release. Keep event results separate, preserve scientific
identities and retain both technical Back arm names. Check positive descriptions,
one general methods note and tutorial Analyze/History terminology consistency.
The October 8 owner decision supersedes the earlier website-only naming gate.

## Tutorial regression

At 320, 390, 768, 1024 and 1440 **effective CSS pixels**, verify all ten main routes.
Inspect the actual `innerWidth` when browser zoom affects viewport overrides.
Exercise all ten module links, Previous/Next and browser Back/Forward; load a fresh
URL containing a module hash and a step hash. Check deep links into a previously
hidden branch, Record/Import and Back/Side radios, complete-guide mode, module step
contents, image-original links and native troubleshooting disclosures. Keyboard
focus must reach the newly exposed section and remain visible; radio arrows and
summary Enter/Space must work without pointer dependence.

Check all module/step content is present in the initial server HTML. A no-JavaScript
render must expose all ten modules and both paths/views with working native anchors
and disclosures. Verify reduced motion removes smooth scrolling and animation.
Check screenshot natural dimensions, no broken/missing-alt images, image labels,
consistent aspect ratios, footer/context links, canonical/OG/description, sitemap
uniqueness and console errors. Privacy review includes final image crops, not only
text scans. Generated physical setup imagery must never be mistaken for app UI.

The tutorial adds no persistent browser storage, cookies, forms, tracking or external
runtime resources. Tutorial changes must not silently change policy. The September 28 media
disclosure is a separate authorized website change. Runtime device preservation claims must
be limited to the actions actually performed, not inferred byte-level preservation.


## Video regression

Test `/motion` with a fresh browser request log. The initial server HTML must
include the player iframe without a Load video gate or client-side activation.
Google/YouTube requests may begin on page load, before Play, as disclosed.
Inspect the exact iframe ID, native preview and visitor-initiated playback.
Motion uses `nEv9nJO83NM` ("Every Pitch, Together"). Verify YouTube's publisher metadata resolves to
`https://www.youtube.com/@Asymmetri` before accepting a video replacement.
Confirm no autoplay, title, origin referrer policy, responsive 16:9 reservation,
fullscreen, keyboard access, visible disclosure and an always-available fallback.
Player loading must not steal focus. Check the iframe remains in server HTML
without site JavaScript and the external link remains usable with scripts disabled
or blocked frames, plus reduced-motion navigation. Do not weaken browser privacy settings to
force playback; document provider/network limitations when they remain.
On `/botsquad`, require no video player or off-channel video link. Preserve the
`#introduction-video` destination as a plain link to the official Asymmetri channel.


## Motion release-link continuity

Before and after deployment, require HTTP 200 and the actual Motion article title
at `https://www.asymmetri.co/privacy` and `https://www.asymmetri.co/support`, the
current app Settings destinations. Also check apex equivalents, both tutorial
hosts, `/motion`, shared Motion-labelled footer links and mutual policy/support
links. These are protected app/App Store resources, not disposable marketing
routes. Preserve tutorial step hashes and original-image destinations.


## Architecture-release regression

Confirm the four status vocabulary entries can represent current, preparation,
development and roadmap while public values use only source-supported states.
Scan rendered pages and metadata for obsolete Asymmetri Work/singular Sport and
Labs-as-umbrella claims. Historical policy update descriptions and unused retained
logo/source variants are not current hierarchy claims. Compare utility text against
the baseline; only current brand references and tutorial title affiliation change.
No tutorial ID/original asset or audited data-handling commitment may disappear.
Verify the direct Motion player, no autoplay, accurate page-load disclosure,
approved video ID and official-channel-only link on BotSquad.

For the route-change deployment, use the complete isolated-candidate procedure,
verify the source SHA/build ID, retain the full old directory and remotely verify
both immutable tags. The pre-change tag must resolve to `679f3378701af6b04557c0bebff15120f21e3754`.


## Visual identity regression

Check equal Sports/Labs hierarchy in the shared Graphite + Teal system, neutral
light reading sections, dark/light text and focus contrast, and retained social
exports. Ensure no theme selector, query switch, comparison route or review tool
is included in production. Compare all public asset bytes against the baseline.
Calculate rendered contrast (including hover states), and verify explicit labels
and link underlines alongside color. Keep original Motion image bytes, tutorial
hashes/original links, policy/support text and video IDs unchanged. Browser checks
should measure effective innerWidth and look for clipped descendants as well as
document overflow, since the site container uses overflow clipping.


## BotSquad project-page regression

Check the reference hierarchy at 320/390, 768/1024 and 1440px: Atlas owns Maya,
Turing, Scout and Nix; Linus/Ada/Grace remain nested under Turing. Four branches
sit alongside each other above 1100px and become a nested single column at or
below that width. Verify all eight portraits load inside the name/role cards,
including Nix's DevOps portrait. Verify native page-index
anchors, current capability limits, illustrative Hitting label, current Hitting state,
and Today / Current focus / Later distinctions. Check source, setup, white paper,
roadmap and video links. No internal prompt numbers or private workspace identifiers
belong in public copy. Keep setup and approvals understandable without implying broad
iOS engineering, browser writes, public hosting or publication authority. Smoke-test
Labs/home and protected Motion resources on both production hosts.

## INV-02 receiver checks

Run `npm run receiver:check`, `npm run receiver:test` and `npm --prefix receiver audit --omit=dev`, in addition to both website builds/check/audit. The test command verifies exact contract hashes/type regeneration and real HTTP/SQLite tests, including separate-process races/SIGKILL, signed replay/revocation, immutable financial ordering, CAS and isolated restore. Run the compiled tests on Node22 as well as `.nvmrc` Node24; see [INV-02-VALIDATION.md](INV-02-VALIDATION.md) for results and untested deployment gates.

## Private receiver Linux acceptance

INV-REAL-01 owner controls add signed observed-run preapproval/ingestion tests,
duplicate/conflicting configuration checks, official-run replacement with stale
expected-pointer rejection, restart persistence, fixture/private-trial denial and
restore/withdrawal fences in `receiver/test/run-controls.test.ts`. These disposable
fixtures do not approve a real operational configuration or select a live run.

[INFRA-02](INFRA-02-VALIDATION.md) records actual Ubuntu 22.10/Node22 results;
[the runbook](INFRA-02-RECEIVER-DEPLOYMENT.md) owns setup, confinement and cleanup.
These are explicitly invoked, synthetic deployment tools, not startup scripts or
production health endpoints. Build the receiver first and use a disposable non-root
Linux copy with the installed nginx stream module and private temporary paths:

```sh
npm run receiver:check
npm --prefix receiver test
cd receiver
node --test --test-concurrency=1 deploy/nginx-acceptance.test.mjs deploy/restore-acceptance.test.mjs
```

The nginx harness defaults to loopback stream transport and checks canonical signatures,
ambiguous headers/framing, limits and retry receipts. `INFRA02_NGINX_MODE=http`
selects the diagnostic HTTP profile: **it fails duplicate Connection preservation,
HTTP/1.0 rejection and keep-alive pipeline isolation on nginx 1.22 and is not accepted ingress**. Keep this assertion.
No test modifies production nginx. The restore test copies complete stopped storage,
checks hashes/integrity/CAS/receipts and reconciles newer withholding before reads.

`isolation-probe.mjs` requires an explicit disposable unit and
`INFRA02_PROBE_DIR` beneath `/var/lib/infra02-acceptance/`; verify masked site roots,
zero capabilities, denied network and writable fsync/rename behavior under the
installed unit's restrictions. `capacity-acceptance.mjs` and
`restart-acceptance.mjs` require the documented disposable archive/config/loopback
ports and operator orchestration; never point them at operational data. Their
signing keys remain in memory. Stop/fence and reconcile before fixture removal.
`archive-audit.mjs` requires disabled config and an offline operational archive;
it opens SQLite and asserts empty authority/data plus schema/integrity/settings.
It is an operator-only audit, not a read-only file command or a background job.

Measure CPU/cgroup/RSS/swap/disk/WAL and site latency separately. A startup memory
snapshot is not a settled idle interval. Preserve a fresh before-state manifest and
repeat it after cleanup, including DNS/TLS and service/configuration identities. The
old 198-request manifest was deleted during later owner-approved Mac cleanup; INV-03
uses a fresh 228-request/15-host manifest and does not claim the two are identical.
No fixture test establishes public TLS ingress, sustained full-archive capacity,
hardware power-loss tolerance or an approved recurring backup policy.

## INV-03 archive, TLS and recovery acceptance

Run `npm run receiver:test` for artifact lifecycle, safe formats, owner controls,
exact downloads, alias withdrawal, prepublication suppression, interrupted restore,
current-control reconciliation, encrypted-file tampering and stalled-download tests.
The existing contract/auth/financial/crash tests remain unchanged in purpose.

On a disposable Linux copy, `INFRA02_NGINX_MODE=tls node --test --test-concurrency=1
receiver/deploy/nginx-acceptance.test.mjs receiver/deploy/restore-acceptance.test.mjs`
tests installed Nginx/OpenSSL with loopback SNI/TLS only. `INFRA02_NGINX_MODE=http`
retains all three HTTP-profile failures; a nonzero result is evidence that this
profile is rejected, never a waived production check.

`receiver/deploy/sustained-acceptance.mjs` is explicitly bound to disposable INV-03
paths/port. Use hard runtime/resource ceilings and a host/site safety monitor, then
`inv03-recovery.mjs` for overlap/contention, restart comparison and isolated restore.
`low-disk.test.mjs` requires a dedicated small tmpfs; never fill the production disk.
[Validation](INV-03-VALIDATION.md) records actual counts, failures and limits.

Browser acceptance covers default/no-backend, exact versions, waiting/withheld/
withdrawn/missing records, cursor reset, five formats, long reports, source safety,
fixture labels, semantic headings, keyboard focus and responsive widths. No public
website release, real workers or market observations are implied.

## INV-04 interface acceptance

Run `npm run test:investment` for exact decimal rounding (including values beyond
Number precision), null handling, 18-digit sequence ordering, CSV formula safety,
run context and benchmark missing-peak guards. Run `npm run receiver:test` for the
full regression suite including the author-created showcase, corrected valuations,
negative/partial observations, terminal orders, large-history tail cursor, immutable
page watermarks, expiry and withdrawal. No fixture bypasses publication validation.

Use the disposable preview described in LOCAL_DEVELOPMENT for browser acceptance.
Check actual CSS viewport widths 320, 390, 768, 1024, 1440 and 1920; inspect the
research → discussion → decision → fill → later-review path and exact-version links.
Verify keyboard focus, upward-scroll pause, unread count, latest jump, refresh,
chart window/table/export, stale/empty/ended states, visibility withdrawal, mode
failure, offline recovery and unavailable Ask. Test static methodology/Ask with an
offline receiver. Review reduced-motion CSS and absence of animated presence.
The [INV-04 record](INV-04-VALIDATION.md) distinguishes browser checks from source
review and synthetic receiver tests; no live HQ/public-capacity result is implied.

INV-REAL-01 also tests chart path breaks across absent/withdrawn valuation sequences,
including sequences above Number's integer precision. Inspect frozen run settings,
source limitations, incomplete-quality explanations and distinct as-of/retrieval/
accounting clocks in the journal and export. An unavailable archive must not claim
that the experiment has never started. Verify the observed-paper label only with
an accepted observed producer record; fixture mode cannot be relabelled to obtain it.

## ASK-01 private source acceptance

The full receiver suite includes `ask.test.ts`, `ask-context.test.ts` and
`ask-recovery.test.ts`. They exercise only synthetic private sessions, claims,
receipts, cancellation/expiry races, ancestor context withdrawal, millisecond
ordering, bounded Unicode pagination, dedicated auth, traffic reserves and
non-content recovery. [The boundary record](ASK-01-PRIVATE-RECEIVER.md) explains
the limits. The committed Ask source first passed 227/227 tests on actual Linux
Node 22.23.1; the later full receiver source passed 230/230 before installation.
[The release receipt](INGRESS_RELEASE_2026-10-13.md) separately records installed
confinement, public ingress and certificate renewal. Real employee execution and
ongoing off-host backup custody remain unverified. Use the
[temporary HTTPS launcher](ASK-01-INTEROPERABILITY.md) for typed-client acceptance;
its authored synthetic exchange is not a genuine execution result.


## Shared-apex transport checks

The full receiver suite includes raw-routing and TLS-bridge tests. Actual Linux
Nginx acceptance uses `INFRA02_NGINX_MODE=shared`; optional
`INFRA02_INGRESS_LOAD=1` adds a bounded 60-second TLS workload. Follow
[ingress acceptance](INV-03-INGRESS.md) for exact scope and command. Verify trusted
website Host/HTTPS/client metadata, forged forwarding denial, normalized API-path
and pipeline isolation, certificate replacement/failure retention and handshake
bounds. `npm run test:investment` verifies native loopback Host mapping. Run both
Next and Sites builds after transport changes to preserve packaging compatibility.


Service packaging requires actual Linux `systemd-analyze verify`, the certificate
hook's non-mutating `--check`, confined service read/write/network probes, and
Certbot dry-run with deploy-hook read-back. Test under a restrictive root umask;
certificate group-read permission must not depend on the invoking shell. The
shared-host rehearsal covers baseline/new-routing/rollback and separate IPv4/IPv6
virtual-host sets. Final release checks still include direct tutorial image URLs.

## Dormant Ask visitor interface

Run `node --test tests/ask-ui.test.mjs` on the local Node version. The
[focused suite and browser receipt](ASK-03-WEBSITE-UI.md#local-verification)
cover response identity, bounded pagination, same-request retries, owned privacy
controls, metadata-only storage, legacy migration, consent identity and backoff.
[ASK-04](ASK-04-READINESS.md) maps the additional receiver recovery/race/capacity
fixtures to remaining operational gates. Verify both the default unavailable page and the
explicit synthetic client. Synthetic browser transport does not prove genuine
execution, operational Secure cookies or provider deletion.

## Closed Ask receiver rollout checks

The [Ask-only release](ASK-04-RECEIVER-RELEASE_2026-10-13.md) passed all 236 receiver
tests on Linux/Node 22.23.1 in isolated authored state under the service's memory,
swap and CPU ceilings. Its bounded concurrent public checks and resource record
are not a real HQ/visitor capacity promise. No application source changed in the
rollout packet, so the prior website build/browser evidence remains applicable.

Operational verification must bind a successful source receipt to a nonzero
active service identity and final disabled/no-cookie HTTPS responses. Use a
bounded monotonic readiness deadline that permits cold startup under the CPU
quota. Compare content, authority, generation and root-held configuration exactly;
validate and preserve normal HTTP rate counters separately. Never reset counters
to make a snapshot match. Preserve failed activation and recovery evidence.

All-host verification rejects transport failures unless an exact, documented
pre-existing failure is separately classified and fingerprinted before/after.
Known-failure read-throughs are explicitly unverified TLS and must never count
as healthy HTTPS. Keep Motion routes, tutorial links/images, unrelated service
identities and Nginx hashes in the preservation set.

## Ask operational fault and capacity fixture

`receiver/test/ask-configuration.test.ts` verifies the signed configuration read:
closed intake, strict authorization/framing, per-caller persistent revisions,
canonical hashes, reserved quotas, freshness/expiry, storage bounds and held
recovery. These synthetic checks do not establish public-service eligibility.

The [interoperability launcher](ASK-01-INTEROPERABILITY.md) accepts separate explicit
strict and subscription-activity flags. Validate each over trusted loopback TLS,
including signed configuration before the control drain, unchanged strict limits,
null subscription cost/policy and both startup-cancellation and normal cleanup.

`receiver/deploy/ask-readiness-acceptance.test.mjs` imports an existing compiled
receiver selected by `ASK_REHEARSAL_RUNTIME` (defaults to its parent receiver).
Run it explicitly with `node --test --test-concurrency=1` after receiver build.
It creates only disposable synthetic stores and loopback listeners; it must never
receive live configuration. `ASK_REHEARSAL_CONFINED=1` additionally requires the
isolated Linux profile and verifies live stores are inaccessible and core memory
is excluded. The [host receipt](ASK-04-OPERATIONS_2026-10-13.md) documents the
180-second unit, masked mounts, resource/public-health bounds and retained profiles.
The actual SIGKILL cases verify text exclusion and unfinished-copy rejection with
a valid manifest digest. The read scenario measures 80 requests/six in flight,
then ordinary quota exhaustion while reserved cancellation/control paths succeed.
It is not a genuine model-load or provider-cost benchmark.

The explicit `receiver/deploy/ask-capability-acceptance.test.mjs` requires
`ASK_CAPABILITY_RUNTIME` to name an isolated compiled candidate or accepted
receiver. It verifies the subscription variant and mixed-mode rejection without
opening a listener. The merged package is now pinned, and `npm run receiver:test` runs these four
cases with `ASK_CAPABILITY_RUNTIME=.` after its existing suite. Historical
candidate evidence remains in the [package review](ASK-04-CAPABILITY-REVIEW.md).


## BotSquad hierarchy navigation

Verify Labs → BotSquad → Research → Trade through visible links, and return
through the breadcrumbs. Overview, Research, Trade and Ask must be reachable
from the shared area navigation and global Labs menu. Ask breadcrumbs place it
beside Research. Verify archive and methodology pages retain exact-run navigation.
The Research hub must have its apex canonical and sitemap entry. Existing
investment URLs redirect to Trade; Ask URLs and noindex policy stay intact. At 390/768/1440 CSS pixels,
check wrapping, 44px targets, visible focus, current-page indication and no overflow;
verify menus by keyboard and preserve reduced-motion rules and Motion footer links.

## One-session close amendment

After the receiver build, `node --test receiver/dist/test/close-recovery.test.js`
checks the authored close chain, unchanged legacy OPEN, strict deadlines, matching
identities/references, benchmark allocation evidence and immutable old records.
Its HTTP/SQLite case puts the amendment beyond the first 100 events, appends a
later status, restarts, and verifies withdrawal propagation. The test remains in
the normal receiver suite. These are authored fixtures, not proof of live market
or employee execution. The [packet](INVESTMENT_CLOSE_RECOVERY_2026-10-14.md) records
actual validation and release results separately.


## Trade route migration regression

After starting the documented disposable showcase preview and local Next server,
run `TRADE_TEST_ORIGIN=http://127.0.0.1:4327 node --test tests/trade-routing.test.mjs`.
This suite requires loopback and published synthetic fixture data; never point it
at production. It verifies permanent redirects, per-page canonical/OG, exact-run
context, nested/duplicate/empty queries, successful attachment hashes/security
headers, HEAD, rejected writes, unknown-route 404s and bounded slash normalization.
It also crawls rendered internal links and verifies guide/navigation anchors.
Start with a fresh disposable fixture, or enter `reset` in its terminal between
acceptance runs. Its frozen clock otherwise accumulates requests in one 600-request
minute bucket; a 429 can make verified downloads correctly fail closed with 410.
Do not relax production limits or download verification to accommodate a test crawl.
Also run the existing Ask/archive tests. Browser verification must follow old
`#desk` and `#record-chain` links and confirm the destination fragment/target.
Test the separately built compatibility fallback with both namespaces before
activation; cached redirects must not turn a rollback into broken Trade bookmarks.

## Latest Trade update

Run `node --test tests/investment-brief.test.mjs tests/investment.test.mjs`.
Verify dated HOLD/BUY/SELL and approve/reject/revise rendering, missing decisions,
failed tail reads, source gaps, and incomplete valuations. A newer partial
valuation must not be hidden by the older complete snapshot. Check Vancouver
times, exact-run evidence links, and the native timeline disclosure on mobile,
tablet and desktop. No completed turn/request counts or future close times may
be inferred from citations, heartbeats or an active run label.

## Vancouver V0.5

Run `npm run test:vancouver` for courtyard holes, street distance, bounded
acceleration/braking/reversing, collision and long-frame anti-tunnelling, geographic
manifest digest and land/water sanity. Run both Next and Vinext builds, standard
check, production audit and diff checks. Browser acceptance: scene loads without
console errors; aerial drag/zoom, landmark selection/search, driving and release
of held controls, reset, text fallback and pause/resume disposal. Check 320/390,
768 and desktop widths for overflow and usable controls. Viewport emulation is
not physical-phone performance validation. Context failures must preserve the
place list; raw no-JS HTML must include all six summaries/source links.

Ensure unrelated pages request no Vancouver engine/data, and preserve Motion's
protected routes, tutorial canonical/IDs/images, redirects and BotSquad services.
The canvas exposes sampled FPS and draw-call counts as read-only DOM data
attributes for local verification; no measurements are transmitted or stored.

V0.2's 13 tests additionally verify the unchanged V0.1 parent digest, all six
whole-car safe spawns and forward departures, thousands of inland road samples,
land/water/building exclusions, opposite-pedal braking, steering direction,
full-body wall clearance, anti-tunnelling and 30/60 Hz consistency. Offline
refinement asserts bounded trim area, retained building parts and separated
pavement/buildings/water. Manual checks cover simultaneous steering/acceleration,
reverse, brake/reset, nearby-place spawns, numbered selection/search, full-window
expansion/Escape/focus, Lite, repeated pause and actual route leave/return. Review
FPS/draw calls/DPR and geometry/texture counts from canvas diagnostics. Forced
WebGL loss and physical-phone checks must be reported as untested unless actually
executed; code inspection alone does not establish their runtime acceptance.

V0.3 extends the suite to 25 tests: immutable parents, unchanged building geometry,
pinned conservative historic-height joins, exact pavement/collision tile seams,
persistent blocked state, nearby recovery, six safe destination paths and a full
scenic loop plus the next 100 m in both directions at 15/30/60/120 Hz. Browser
acceptance must include a real multi-minute Cruise session in each direction,
manual takeover, destination guidance, whole-city/local map toggle and mobile
portrait/landscape layouts. Record frame rate, rolling frame-time p95, collisions,
distance, loop count and resource counts with environment and duration. A single
idle frame or pure simulation is not a substitute for browser performance evidence.

V0.4 extends the suite to 43 tests, covering source dates/quality/retained geometry,
rendered collision-cell parity, all three manual-route centre paths in both
directions, disconnected routes, and independent pointer/key ownership. Geometry
checks are not manual-driving acceptance: drive the additional routes with real UI
input, report distances, curb contacts and recoveries, and explicitly identify any
reverse direction tested only geometrically. Record actual forced WebGL loss,
restore and Retry behavior using the development-only controls. Check map keyboard
routing and that blur/background never resumes Cruise or held acceleration.
Physical multitouch, battery and thermal claims require real device evidence.

V0.5 has 59 tests, adding manual input response, pace/steering limits, frame-rate
consistency, collision-preserving reverse/braking, non-mutating road-edge preview,
camera sight-line constraints, and synthetic elevation traversal/grade separation.
Keep manual keyboard runs distinct from Cruise or generated route following.
Per-run DOM counters report actual distance, drive-mode seconds (including stops),
moving seconds, contacts, Recover actions and resets. FPS/minimum are session-wide;
p95 covers the latest 600 frames. Do not silently treat these as per-route minima.
Record failed tuning attempts separately rather than discarding them.

On compact screens verify that the default playing view has no persistent map,
route card or settings pane; only one Menu panel can open, and it stops the car.
Test closing/Escape, focus trapping, mode switching, pointer cancellation and
background release. Verify the camera remains useful beside buildings and under
view-only bridges. Repeated pause/resume and route changes must retain bounded
renderer resources. Inspect both production builds for absence of local elevation
and graphics-test controls. Bridge proof results never count as real Cambie
acceptance. The release report distinguishes simulator, viewport and hardware.

## Surrey, City of Adventure

Run `npm run test:surrey` alongside Vancouver and investment regression tests for
city-game changes. It exercises the real snapshot and full mission by movement
through the collision world, not by teleporting between quest stages. Separate
unit cases cover stage gating, encounters, frame rates, recovery and asset failure.
The `prebuild:next` hook runs Surrey and Richmond tests inside the existing Linux candidate
workflow before packaging; the workflow file itself is unchanged.
Browser acceptance includes the complete backpack quest and reward, camera/input,
map, pause, recovery/reset, gentle/Lite settings, dialogue focus, responsive
controls, overflow, console errors and cleanup on route exit. Record physical
mobile tests separately from viewport emulation. See the project README for limits.

V0.2 acceptance additionally covers aerial orbit/pan/zoom, exact player marker,
follow/free/return, preserved positions and paused clocks, repeated mode switches
with stable canvas/resource counts, both investigation outcomes, three or more
new encounters, mature opt-in, journal focus, reload/Continue/New Game and corrupt
or unavailable storage. Pure tests cover all six types and collision walks through
five clues/three witnesses. Verify responsive controls at 320/390, 768 and desktop
widths plus landscape. Do not label viewport emulation as real touch-device testing.

V0.3 adds rendered control/pressed-state checks, blocked/editable/repeated shortcut
cases, separate tutorial persistence, explicit V0.2 migration, source-height
classification, retained collision/footprint hashes, flat-ground/transit clearance,
road/paint/path contracts and deterministic architecture. The optional offline
`test_reconstruction.py` independently checks actual exported topology, disjoint
surface interiors, centreline coverage, paint containment and coordinate controls.
Reproduce the new snapshot twice and compare bytes; V0.1 must stay unchanged.

Browser gates include both visible mode buttons, tap/keyboard switching, help
reopening/dismissal, no shortcut through a select or modal, compact phone HUD,
Menu/map/aerial-tool close paths, mission/inventory save continuity, representative
sections of both cases and repeated canvas/resource stability. Check 320/390px,
tablet, desktop and short landscape viewports. Capture FPS, DPR, draw calls and
geometry/texture counts with context, and distinguish emulation from hardware.


## Surrey V0.4 — Living Surrey

Surrey V0.4 extends `npm run test:surrey` to44 tests, including both missing-person approaches/endings, schedule/clock/light state, migration validation and camera clipping. Browser acceptance must cover new-case completion, old cases, night visibility, compact phones, renderer reuse and reload. Responsive emulation does not satisfy physical-device acceptance.

## Richmond V0.1

Run `npm run test:richmond`, `npm run check`, Vancouver/Surrey/investment regressions,
both supported builds, production dependency audit and `git diff --check`.
Richmond tests verify pinned source hashes, all required anchors, directed routing,
full-body collision and walking approaches; continuous digital-input journeys
cross the real bridge network into Steveston, Terra Nova, IKEA, YVR, No. 6 Road,
Knight Street and Hamilton. Separate tests traverse every included runway and
walk mall/terminal/office corridors, collect, shop and use both mall entrances.
Economy tests cover item/state gates, exactly-once payment, save validation,
corrupt receipts, pause/camera independence, encounters and bounded recovery.

Pure tests cannot establish rendered-browser journey acceptance. In a browser,
complete drive–park–walk–pickup–deliver, mall purchase/exit, both airport orders and
runway/taxiway exploration. Record manual recoveries, actual balances, car position,
reload continuity and any uncompleted journey. Check all four cameras, controls,
visible moving population, hidden-tab pause, route teardown, error paths and
accessible fallback. Observe actual frame rate with device, scene and settings.

For the phone obstruction regression, test portrait and short landscape play:
canvas controls must not overlap the main playing rectangle. Open one map/order/
settings panel at a time, check background inertness and focus return, then close
it and verify the same playing area returns. Check 320/390 px, tablet, desktop,
large text, keyboard, reduced motion and horizontal overflow. Dynamic viewport and
safe-area CSS do not substitute for physical-iPhone testing. Acceptance evidence
and outstanding checks belong in `docs/RICHMOND_HANDOFF.md`.


The development-only Richmond help button **Developer check: graphics loss**
forces a real `WEBGL_lose_context` event. It is excluded from production UI.
Verify the readable recovery message, Retry graphics & map, preserved cash/car/
order, and one replacement canvas. A missing-map response can be tested only in
an isolated local checkout by temporarily withholding the local city asset and
restoring the exact manifest-matching bytes before Retry. Never change live or
published immutable bytes for fault injection. Pure collision tests additionally
check that a bumper overlap can separate without allowing cars to pass through
actors; all eight authored pickup-to-customer road legs use continuous driving.

## Surrey V0.5 — On the Move

`npm run test:surrey` now has 54 tests: existing 44 regressions plus pinned driving
mask/closed-road/route clearance, small-hole and swept-body collision, 30/60/120Hz
handling, entry/exit safety, full input-driven delivery, migration/recovery/aerial
freeze, traffic/pedestrian spacing, continuous train movement, actual transport
GPU disposal and rail-support clearance. Browser acceptance must independently
drive the full delivery, exit/reward, reload, and exercise held mobile pedals at
320/390px and landscape. A renderer-independent driving controller test is not a
substitute for this browser run. See the V0.5 release record; physical phones remain
an explicit outstanding acceptance item.

## Vancouver V0.6 research acceptance

Run `npm run test:vancouver`, peer suites, check, Next webpack and Vinext builds. New tests cover high-speed input pulses with exact retained Relaxed response, optional cues preserving route geometry, spatial camera constraints, immutable Cambie identity, continuous curved profiles, full-car traversals in both directions at 15/60/120 Hz and grade-separated/water rejection. Automated route following is not manual acceptance. V0.6 failed fresh North manual comparison and remains development-only; see [all completed/failed runs, environment limits and outstanding tests](VANCOUVER_V06_RESEARCH_2026-10-30.md). Verify production bundles omit the research lab/data and keep public V0.5.

## UBC acceptance

Run `npm run test:ubc`, `npm run check`, both supported builds and the production
dependency audit. The UBC suite exercises collision movement through real generated
interiors and Nest stairs, rather than asserting only mesh existence. Existing
Vancouver/Surrey/Richmond suites protect shared behavior. Complete the browser
walkthrough and screenshot checklist in `UBC_IMPLEMENTATION_2026-10-30.md` before
claiming visual acceptance or production readiness. Viewport emulation and actual
phone measurements must be reported separately.

The October 30 UBC browser pass and 25 captures are recorded in
`validation/ubc/README.md`. It found and fixed rotated-door arrival, the Nest/Alumni
Centre overlap, guide proximity, dialogue scrolling and stadium shadow striping.
Automated coverage includes the shipped Nest's stairs against neighbouring GIS
geometry and field-normal regression checks. Desktop samples are observations, not
sustained frame-time or physical-mobile acceptance.

### Orchard MVR acceptance

The 26-test UBC suite includes both unchanged source polygons, entrance approach,
continuous stairs/corridor/all eight rooms/five bathrooms, both lift directions,
occupied-landing boarding through the actual collision loop, swept/reduced-motion
doors, student routes, wall-occluded prompts and room unload/reload. The existing
`prebuild:next` hook now also runs `npm run test:ubc` in local and Linux builds. See the V0.2 report and
`validation/ubc-orchard/README.md` for browser evidence. Reproduce the derivative
with `python3 projects/ubc/tools/verify_orchard.py PATH_TO_PINNED_SUBBUILDINGS`.
Physical-phone testing remains separate.
