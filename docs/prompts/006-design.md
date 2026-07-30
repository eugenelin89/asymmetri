# Prompt 006 — Refocus the Asymmetri Labs story

- Date: 2026-07-30
- Scope: design
- Goal: Rename and simplify the public website around an early-stage sports technology mission, beginning with baseball.

## Original user request

> Simplify and refocus the website around the Asymmetri Labs story.

The user supplied a detailed, repeated implementation brief requesting a complete repository update rather than recommendations. The brief required the Asymmetri Labs rename; a three-page Home, Story, and Contact structure; a six-section, story-first homepage; baseball as the personal starting point; an access-focused mission; an explicit statement that AI supports rather than replaces coaching; clear roles for athletes, coaches, and parents; accessible cameras and sensors as the technical direction; an exploratory rather than settled-product truth state; removal of named-product and feature-heavy framing; three to five intentional images; updated metadata, assets, documentation, redirects, privacy scans, responsive validation, screenshots, commits, push, and a pull request.

## Scope

The public narrative, route structure, shared brand lockup, metadata, social preview, image selection, responsive editorial layouts, dependency lockfile consistency, documentation, and preview screenshots were updated. The Next.js, React, TypeScript, Tailwind, Vinext, and Cloudflare architecture remained intact; no backend, tracking, or speculative product was added.

## Decisions

- Adopted “Talent is everywhere. The tools aren’t.” as the hero because it states the access problem emotionally and concisely.
- Reduced navigation to Home, Story, and Contact and consolidated Work and About into Story with permanent redirects.
- Used exactly three storytelling images, each with one distinct narrative role.
- Removed the product reconstruction, feature grid, research-detail plot, and redundant baseball photograph.
- Presented cameras and sensors as evidence-capture inputs, AI as pattern support, and human coaching as the source of judgment and context.
- Kept the existing asymmetric mark and made the smallest useful lockup change by adding Labs.

## Implementation

Rebuilt the homepage into six spacious sections, created a reflective Story route, broadened the minimal Contact invitation, centralized the new public copy and metadata, updated structured/social data, simplified routes and styles, regenerated responsive previews, removed two obsolete image files, and aligned current documentation.

## Engineering impact

The public route count decreased from four to three. Former routes remain reachable through permanent redirects. The application stays server-rendered, dependency-minimal, keyboard accessible, responsive, reduced-motion compatible, privacy-conscious, and free of client state or tracking. The lockfile was synchronized with the existing package manifest under the required Node release.

## Files changed

Implementation touched homepage, Story, Contact, layout, sitemap, redirects, global styles, shared logo/footer, centralized content, metadata helper, package identity and lockfile, social/image assets, strategy/architecture/content/testing/identity documentation, README, and desktop/mobile preview screenshots. Work and About page files and two redundant images were removed.

## Documentation updated

README and the brand, site, content, architecture, asset, testing, and visual-identity documents now describe Asymmetri Labs, the three-route story architecture, exploration-stage truth, three-image rationale, redirects, and human-centred AI philosophy.

## Git diff summary

The implementation commit changes 28 files with a net reduction in source and documentation, removes two routes and two images, adds Story, and refreshes two previews. Binary preview sizes are not treated as editorial line counts.

## Verification

Node 24.18.1 was installed and activated. Dependency installation, TypeScript, ESLint, Vinext production build, standard Next.js build, production dependency audit, whitespace validation, route/redirect requests, metadata inspection, image-count inspection, responsive desktop/mobile screenshots, brand scans, and prohibited-reference scans completed successfully. The initial clean install exposed a pre-existing lockfile inconsistency; npm install synchronized it, after which the full suite passed with zero production audit vulnerabilities.

## Repository state after implementation commit

Branch: work. Implementation commit: d4a84653171fb1fca17923bdecfc2b8886c86a04. The implementation worktree was clean before this journal record was created. Push status is reported after both required commits.

## Implementation commits

- d4a84653171fb1fca17923bdecfc2b8886c86a04 — Simplify site around the Asymmetri Labs story

## Archive commit

Archive prompt 006 for the Asymmetri Labs refocus

## Lessons learned

A clear access story, explicit role boundaries, and a small number of authentic images communicate the early startup direction more credibly than product taxonomies or detailed research artifacts.

## Follow-up ideas

None committed.
