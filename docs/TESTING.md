# Testing

## Required checks

For meaningful implementation changes, confirm that `node --version` matches
`.nvmrc`, then run:

```bash
npm run check
npm run build
npm audit --omit=dev
git diff --check
```

`npm run check` runs strict TypeScript validation followed by ESLint.

Run the optional standard framework build when changing Next.js integration,
metadata behavior, routing, or dependencies:

```bash
npm run build:next
```

## Route checks

When routes or shared layout code change, verify:

- `/`
- `/story`
- `/work` and `/about` (permanent redirects)
- legacy name and named-product URLs (permanent redirects)
- `/contact`
- `/robots.txt`
- `/sitemap.xml`
- `/favicon.svg`
- `/og.svg`

Confirm successful responses, correct page titles and canonical values, and no
broken public assets.

When changing Worker or Vite binding configuration, request at least one
`/_vinext/image` URL from the local Vinext server and confirm that it returns an
image response without a Worker exception.

## Visual and interaction checks

For visual, layout, or navigation changes, verify the affected routes at:

- 320 CSS pixels;
- 768 CSS pixels;
- 1440 CSS pixels.

Check:

- no horizontal overflow;
- readable hierarchy and comfortable line lengths;
- image loading, crops, and alt text;
- mobile navigation;
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
- confirm deployed, emerging, and future claims remain distinct;
- confirm the asset manifest reflects all public asset changes.

Never paste sensitive scan matches into prompt records.

## Dependency checks

Review both `package.json` and `package-lock.json` after dependency changes. Use
`npm audit --omit=dev` for production exposure and investigate warnings before
adding overrides.

Do not update packages solely to silence a warning without confirming runtime
compatibility and the affected dependency path.

## Deployment verification

A successful local build is required before saving a Sites version. The saved
version must reference the exact pushed commit and the archive built from that
source. Poll deployment status to a terminal success or failure state.

Private Sites deployments may require ChatGPT sign-in before route-level browser
inspection. A successful provider deployment does not replace local route,
accessibility, and privacy verification.
