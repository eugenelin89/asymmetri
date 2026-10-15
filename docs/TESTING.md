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
- `/sports` (division, founder story, Motion family and anchors)
- `/botsquad` (experimental, SSH-tunnel access, deferred native mobile)
- `/botsquad/investment/guide` (dated technical explanation, noindex, contents,
  glossary, readable diagrams/tables and genuine public-interface screenshots)
- `/botsquad/investment/hq-guide` (companion links, seventeen contents targets,
  seven approved crops, code blocks and numbered investigation steps)
- `/about` (real company page, no redirect)
- `/motion` (real product page, truthful release status)
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

## Visual and interaction checks

For visual, layout, or navigation changes, verify the affected routes at:

- 320 CSS pixels;
- 390 CSS pixels;
- 768 CSS pixels;
- 1024 CSS pixels;
- 1440 CSS pixels;
- 1920 CSS pixels for wide desktop.

Check:

- Both guides cross-link and the HQ companion is directly discoverable from Trade
  and methodology/archive. Its narrow sidebar capture must not be stretched; wide
  captures have full-size original links. Code blocks scroll within labelled,
  keyboard-focusable regions; private source labels never become HQ access links.
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
- Pitching preparation versus planned Hitting/Team, exactly one professional app,
  its three nested entitlements, finite Cloud and later Mechanics Lab/Enterprise;
- Labs introduction/open-source statement, “Currently playing with,” GitHub/detail/
  established-license links and short closing; no Labs approach/principles section
  or stale `/labs#approach` links;
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


## Optional video regression

Test both `/botsquad` and `/motion` with a fresh browser request log. Before Load,
there must be no iframe, remote thumbnail, preconnect or request to YouTube, Google,
ytimg or advertising domains attributable to the site. External links alone do not
load those resources. After Load, inspect the exact iframe ID and native playback.
BotSquad uses the owner-corrected English `E5r_lOecC-M`; Motion uses `kaSatKC8HBg`.
Confirm no autoplay, title, origin referrer policy, responsive 16:9 reservation,
fullscreen, keyboard access, visible disclosure and an always-available fallback.
Close must restore the poster and button focus. Check no-JavaScript and blocked
frames, plus reduced-motion navigation. Do not weaken browser privacy settings to
force playback; document provider/network limitations when they remain.


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
Verify no pre-Load Google/YouTube requests and both exact approved video IDs.

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
anchors, current capability limits, illustrative Hitting label, planned Hitting state,
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

Verify Labs → BotSquad → Research → Investment through visible links, and return
through the breadcrumbs. Overview, Research, Investment and Ask must be reachable
from the shared area navigation and global Labs menu. Ask breadcrumbs place it
beside Research. Verify archive and methodology pages retain exact-run navigation.
The Research hub must have its apex canonical and sitemap entry. Existing
investment/Ask URLs and noindex policy stay intact. At 390/768/1440 CSS pixels,
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
