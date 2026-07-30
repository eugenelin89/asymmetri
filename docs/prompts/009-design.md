# Prompt 009 — Baseball pitching startup redesign

- Date: 2026-07-30
- Scope: design
- Goal: Radically simplify the company website into a focused one-page baseball pitching technology startup story.

## Original user request

> # Files mentioned by the user:
>
> ## Redesign and radically simplify the Asymmetri Labs website as a focused basebal…: /Users/eugenelin/.codex/attachments/9aecbb0a-f4f7-4e18-9aa1-4e4d1c12ebf2/pasted-text.txt
>
> The attached pasted text file(s) contain the user's request. Read and act on that content.
>
> ## My request for Codex:

The attached brief requested a complete implementation, validation, and Git
workflow for a one-page Asymmetri Labs website focused on baseball technology
and pitching development. It specified the headline “Better evidence for better
pitching.”; four sections covering the hero, founder story, Capture / Understand
/ Improve approach, and contact close; first-person origin copy grounded in
smartphone slow-motion video, sensors, coaching, training, repetition,
measurement, and repeated personal-best velocity; an explicit early-stage truth
state; coaches as the source of judgment; and parents as informed supporters.

The brief also required an audit of every supplied baseball image, one strong
privacy-safe pitching photograph by default, no screenshots or fabricated
visuals, a vector-only social card, baseball-specific metadata, permanent
redirects from former routes, 350–550 visible words, responsive and accessibility
testing at 320, 768, and 1440 pixels, privacy scans, source-photo preservation,
documentation updates, a feature branch, two commits, a safe push, and a detailed
handoff.

## Scope

Included the public information architecture, company copy, metadata, structured
data, redirects, responsive visual system, header and footer, photo selection and
processing, asset provenance, test guidance, and supporting strategy
documentation.

Excluded authentication, APIs, persistence, analytics, tracking, a CMS, product
screenshots, generated photography, raster social assets, private application
content, and any claim that a finished commercial platform exists. The
owner-supplied source folder remained untouched.

## Decisions

- Reduced the public narrative to one page and exactly four sections.
- Made pitching development the present focus instead of presenting a broad
  generic sports-technology story.
- Kept AI in a supporting pattern-identification role and coaching judgment at
  the centre of development decisions.
- Preserved the founder’s son and injury as context without publishing a name,
  evaluation, team, or source-organization identity.
- Reviewed all 96 supplied still images and chose a single follow-through frame
  with a visible ball, clear mechanics, no bystanders, and flexible cropping.
- Produced one restrained WebP derivative with mild tonal work and localized
  softening of remaining uniform marks; omitted source metadata.
- Retained older repository assets but removed their runtime references so the
  site renders exactly one photograph.
- Kept the social preview as local vector markup because the brief explicitly
  prohibited raster social generation and fabricated imagery.
- Used semantic server-rendered HTML, anchor navigation, CSS media queries, and
  the existing design tokens without adding dependencies or client-side state.

## Implementation

Rebuilt the homepage around the requested hero, founder story, three-step
approach, and contact close. Centralized the new copy and selected image
description in `content/site.ts`; simplified shared navigation and footer
components; replaced the prior visual language with a near-black, white, and
orange sans-serif system; removed obsolete Story and Contact route components;
and added permanent redirects to the corresponding homepage anchors.

Updated title, description, Open Graph data, structured data, sitemap output, and
the vector social preview for the baseball positioning. Added the selected
privacy-reviewed photo derivative at 2400×1600.

## Engineering impact

The public route surface is smaller and statically renderable. No dependency,
runtime, API, state, analytics, or deployment architecture changed. Former URLs
remain usable through permanent redirects. Navigation and calls to action use
native links, all focusable elements retain visible focus styling, the skip link
remains available, and reduced-motion preferences disable smooth scrolling and
transitions.

The page now renders one raster photograph instead of three. The new WebP adds
1,194,344 bytes to the repository; all other existing binary assets remain
unchanged.

## Files changed

- Rebuilt homepage composition, global styles, layout metadata, sitemap, and
  redirects under `app/` and `next.config.ts`.
- Simplified the shared header and footer; removed the obsolete page-intro and
  route-metadata helpers.
- Replaced primary public content and image data in `content/site.ts`.
- Added one processed pitching photograph and rewrote the vector Open Graph
  artwork.
- Removed obsolete Story and Contact route files while preserving their URLs as
  redirects.

## Documentation updated

Updated the repository overview plus architecture, asset, brand, content, site
strategy, testing, and visual-identity documentation to match the one-page route
model, baseball pitching focus, image-review record, design system, truth states,
and validation requirements.

## Git diff summary

The implementation commit changed 22 files with 930 insertions and 630
deletions. It added one WebP asset, removed four obsolete source files, and
reworked the remaining site and documentation files in place.

## Verification

- `npm run check` passed TypeScript and ESLint.
- `npm run build:next` passed and statically generated the homepage, robots, and
  sitemap routes.
- `npm run build` passed the Vinext and Cloudflare Worker packaging build.
- `npm audit --omit=dev` reported zero vulnerabilities.
- `git diff --check` passed.
- Browser checks passed at 320×800, 768×900, and 1440×1000 with no horizontal
  overflow, four sections, one complete image, useful alt text, correct heading
  order, functional anchors, visible focus rules, a skip link, reduced-motion
  handling, and no console errors or warnings.
- Runtime word count was 376.
- All six legacy routes returned HTTP 308 with the requested destinations;
  robots and sitemap output were also inspected.
- Runtime source contained one `/images/` reference and no prohibited private
  name or source-organization reference.
- The vector social preview contained no image element, base64 data, remote
  asset, external font, or foreign object.
- The selected source remained 4608×3072 with SHA-256
  `9c1719b81e8ed9715cdbd03375df241c3e35421cdc6140443ae2afdddc17733e`.
  The public derivative is 2400×1600, 1,194,344 bytes, with SHA-256
  `bb0c7d22c288ed1fb0f1dfe2b828c62ff03f54fab41f0704629bbd2e4342fc24`.
- Temporary review sheets, thumbnails, inventories, and coordinate-review files
  were removed after selection.

## Repository state after implementation commit

Branch: `codex/baseball-pitching-startup-site`

Implementation commit: `2d38522830b8c7f567da006672781f514bf53a86`

The worktree was clean after the implementation commit. The branch was one
commit ahead of `origin/main` and had not yet been pushed when this record was
created.

## Implementation commits

- `2d38522830b8c7f567da006672781f514bf53a86` — Redesign site around baseball pitching

## Archive commit

`docs: archive baseball pitching redesign prompt`

## Lessons learned

A single carefully selected action photograph communicates more credibility than
several loosely related research visuals. The strongest public story is also the
most specific one: start with the real pitching-development problem, distinguish
evidence from causation, and state clearly where human judgment remains
essential.

## Follow-up ideas

None committed. Future work should remain evidence-led and should not expand the
product truth state until validated capabilities can be described publicly.
