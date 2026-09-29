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

- `/` (Labs portfolio)
- `/work` (real Work domain page, no redirect)
- `/sport` (preserved founder story and anchors)
- `/botsquad` (current access versus future web/mobile)
- `/about` (real company page, no redirect)
- `/motion` (real product page, truthful release status)
- `/tutorial` (actual guide, exact www canonical, no redirect)
- `/privacy` and `/support` (actual articles, not homepage redirects)
- `/story` → `/sport#story`; `/contact` → `/#contact`
- `/why-asymmetrico` → `/about`;
  `/work/asymmetrico-platform` → `/sport`
- `/robots.txt`
- `/sitemap.xml`
- `/favicon.svg`
- `/images/labs-social.png`, `/images/sport-social.png` and retained `/og.svg`

Confirm successful responses, correct page titles and canonical values, and no
broken public assets. Verify footer links on all nine pages, mutual
Privacy/Support links, the `mailto:info@asymmetri.co` contact, homepage anchor
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
- 1440 CSS pixels.

Check:

- Work/Sport disclosures expose overview and direct BotSquad/Motion links;
- Enter/Space opens disclosures, Tab reaches links, Escape closes and restores
  focus, outside-pointer interaction closes, and opening one closes the other;
- disclosures and their links remain usable without JavaScript;
- About/Contact work and the homepage retains `#products`;
- Sport retains Story → Approach → Product → Contact and its Motion action;
- old root `#story`, `#approach`, `#product` migrate to Sport while plural
  `#products` and company `#contact` stay on Labs;
- no horizontal overflow;
- readable hierarchy and comfortable line lengths;
- paper-header logo/nav contrast, the nested Labs → Work/Sport → product links,
  product statuses and distinct product panels at all widths;
- homepage introduction → principle → products → shared thinking → contact;
- homepage HTML, accessible copy, metadata and social artwork contain no baseball,
  pitch, pitching or pitcher terms; the Sport panel uses no discipline-specific imagery;
- Work's split hero, About's company → principles → founder sequence and
  BotSquad's standalone written example after its detailed workflow;
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

Verify the five-step workflow and six-stage evidence list remain readable at every
width. Confirm conditional HFR wording, exact human confirmation, projected 2D
qualifiers, descriptive comparison and the release state against the current
source review. Do not expose Developer-only metrics, future features, an unverified
Store link or price. Check the icon and product Open Graph/Twitter image, factual
SoftwareApplication schema and absence of offer/rating fields. Compare the utility
content export with its prior committed version; shared navigation must preserve
the audited app/Apple/support-retention meaning. Only the approved website-media
disclosure and effective-date history change with the videos. New assets require provenance and rights review.


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
