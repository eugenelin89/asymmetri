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

- `/`
- `/motion` (real product page, truthful release status)
- `/privacy` and `/support` (actual articles, not homepage redirects)
- `/story`, `/contact`, and `/about` (permanent redirects to homepage anchors)
- `/work`, the legacy name route, and the named-product URL (permanent redirects
  to the homepage or Story anchor)
- `/robots.txt`
- `/sitemap.xml`
- `/favicon.svg`
- `/og.svg`

Confirm successful responses, correct page titles and canonical values, and no
broken public assets. Verify footer links on all four pages, mutual
Privacy/Support links, the `mailto:info@asymmetri.co` contact, homepage anchor
navigation from utility pages, exactly one H1 per article and ordered H2 sections.
The sitemap must include all four canonical routes; robots must allow them.
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

- the Story → Approach → Product → Get in touch navigation follows homepage
  order; Product reaches `/#product` from every route and is visible below the
  sticky header; the section's Explore button still opens `/motion`;
- no horizontal overflow;
- readable hierarchy and comfortable line lengths;
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
- confirm public product data is synthetic;
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
content export with its prior committed version; shared navigation must not alter
the audited Privacy/Support bodies. New assets require provenance and rights review.
