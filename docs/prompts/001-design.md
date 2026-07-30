# Prompt 001 — Asymmetrico website and identity

- Date: 2026-07-29
- Scope: design
- Goal: Reposition the company as Asymmetrico and deliver a complete,
  production-quality sports-technology website.

## Original user request

> Build the new Asymmetrico website in the primary repository using the supplied
> implementation brief.

The attached brief required a complete redesign and repositioning of the
primary Asymmetrico repository. It asked for source-backed product discovery
across the private athlete-development system and the ChristopherLin.ca
reference repository; a new company narrative, visual identity, logo system,
multi-page website, product case study, asset audit, social preview, metadata,
privacy/anonymity treatment, responsive and accessibility validation,
documentation, production deployment, screenshots, and Git status.

## Scope

Included:

- source-repository capability and asset audits;
- company and product positioning;
- six public routes;
- a complete identity, palette, logo family, icons, and social card;
- synthetic product-interface reconstruction;
- approved sports and research imagery;
- privacy, content, asset, engineering, and deployment documentation;
- OpenAI Sites packaging and private production deployment.

Excluded:

- private athlete data and direct application screenshots;
- source-organization identity;
- unverified customer, adoption, or performance claims;
- a contact form, database, analytics, authentication, or product backend;
- public access and custom-domain activation.

## Decisions

- Positioned Asymmetrico around asymmetric advantage: practical leverage for
  athletes and organizations with more potential than resources.
- Used “Talent is everywhere. The tools aren’t.” as the primary headline.
- Created an open, interrupted “A” mark from unequal Ink and Clay forms.
- Replaced the former neon blue-purple identity with an editorial Ink, Canvas,
  Clay, Signal Green, and Data Blue system.
- Treated Asymmetrico Platform as deployed, biomechanics and sensing as
  emerging, and broader video/intelligence concepts as future direction.
- Reconstructed the product interface with synthetic data instead of exposing
  private screenshots.
- Selected only first-party imagery with a relevant technical or human role and
  excluded team images, source branding, and identity-bearing material.
- Kept the inherited canonical domain and mailbox centralized but marked them
  for confirmation before a public launch.

## Implementation

The former single-page Physical-AI site was replaced with an editorial Next.js
App Router experience spanning the homepage, work overview, detailed Platform
case study, name rationale, about page, and contact page. The implementation
added typed centralized content, reusable site structure and diagrams, local
assets, route metadata, JSON-LD, sitemap and robots rules, favicons, a generated
social card, and a complete supporting documentation set.

Vinext, Vite, and the Cloudflare Worker adapter were added to package the site
for OpenAI Sites. The validated source was deployed as a private, owner-only
Sites version.

## Engineering impact

- Replaced legacy page components and raster logo files.
- Introduced strict typed content and shared metadata generation.
- Preserved server-component rendering and avoided client state.
- Added Worker-compatible production packaging without adding application
  persistence or runtime secrets.
- Added accessible focus, reduced-motion, responsive, contrast, and semantic
  behavior.
- Reduced production audit exposure to zero known vulnerabilities at delivery.

## Files changed

- Rebuilt all application routes and the global style system.
- Replaced shared layout and product-visual components.
- Added typed content and metadata helpers.
- Added brand, favicon, photography, research, social, and preview assets.
- Added strategy, identity, provenance, deployment, and README documentation.
- Added linting, TypeScript, Vinext, Vite, Worker, and Sites configuration.
- Removed obsolete Physical-AI components, runbook, and legacy logo variants.

## Documentation updated

Created `README.md`, `docs/BRAND_STRATEGY.md`,
`docs/SITE_STRATEGY.md`, `docs/VISUAL_IDENTITY.md`,
`docs/ASSET_MANIFEST.md`, and `docs/DEPLOYMENT.md` to document the
delivered brand, content, asset, engineering, and release decisions.

## Git diff summary

The implementation commit changed 79 files with 13,730 insertions and 2,700
deletions. It replaced the legacy site, added six routes and the complete
identity/asset system, introduced Sites packaging, and removed superseded
components and raster logos.

## Verification

- ESLint and strict TypeScript checks passed.
- Standard Next.js and Vinext production builds passed.
- Production dependency audit reported zero vulnerabilities.
- Routes and public assets returned successful local responses.
- Layouts were checked at 320, 768, and 1440 CSS pixels.
- Broken-image, overflow, browser-console, privacy, prohibited-reference,
  credential, and Git whitespace scans passed.
- Primary text color pairs met WCAG AA contrast; the lowest recorded tested
  pair was 4.84:1.
- OpenAI Sites reported the private production deployment succeeded.

## Repository state after implementation commit

- Branch: `main`
- Implementation commit: `a835c5037ba20329af3feab18be322fb5fbdc3d2`
- Worktree: clean
- GitHub origin: not pushed during the original task
- Sites source: pushed and deployed privately

## Implementation commits

- `a835c5037ba20329af3feab18be322fb5fbdc3d2` — Build the Asymmetrico company website

## Archive commit

`docs: add Asymmetrico repository workflow`

This retrospective record is introduced with the repository workflow rather
than by a historical standalone archive commit.

## Lessons learned

- Product truth is strongest when capability claims are traced to source
  implementation and separated from research direction.
- Synthetic reconstructions can communicate workflow without compromising
  athlete or organization privacy.
- A provenance manifest should be created alongside asset selection, not after
  launch.
- Canonical domain, mailbox, and image-use permission remain launch gates even
  when the technical deployment is complete.

## Follow-up ideas

- Confirm image-use permission and the intended public domain/mailbox.
- Prepare synthetic product screenshots from a dedicated demonstration
  environment if richer case-study media becomes useful.
- Add verified team biographies or additional deployed products when available.
