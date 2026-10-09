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

## Route checks

When routes or shared layout code change, verify:

- `/` (Asymmetri umbrella and peer divisions)
- `/labs` (open-source playground and project list)
- `/sports` (division, founder story, Motion family and anchors)
- `/botsquad` (experimental, SSH-tunnel access, deferred native mobile)
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
broken public assets. Verify footer links on all nine pages, mutual
Privacy/Support links, the `mailto:info@asymmetri.co` contact, direct company/product
navigation from utility pages, exactly one H1 per article and ordered H2 sections.
The sitemap must include all nine canonical routes; robots must allow them.
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

INFRA-01 compares every hosted site against an independently reviewed production
baseline, including expected errors and retired endpoints. See
[its validation ledger](INFRA-01-VALIDATION.md) and the
[Python/curl helper](../ops/infra/README.md). Run the helper's focused checks with
`python3 -m unittest discover -s ops/infra -p 'test_*.py'`. Keep its private manifests,
DNS/TLS records and responses outside Git. Local macOS builds and SQLite restoration
do not establish Ubuntu LTS, every-site staging, renewal or production-cutover acceptance.

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

At 320, 390, 768, 1024 and 1440 **effective CSS pixels**, verify all nine routes.
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
