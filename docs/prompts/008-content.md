# Prompt 008 — Ground the site in the founder origin story

- Date: 2026-07-30
- Scope: content
- Goal: Replace generic startup positioning with a specific, privacy-conscious founder story while preserving the established site and visual identity.

## Original user request

> Refine the Asymmetri Labs website around the founder’s real origin story.
>
> Repository:
> https://github.com/eugenelin89/asymmetri

The user supplied a long, repeated implementation brief. It required preserving
the existing three-page design while explaining that Asymmetri Labs grew from the
founder’s experience as a baseball coach, division coordinator, and parent. The
story needed to cover a son’s pitching injury without medical or identifying
detail; slow-motion smartphone recording and frame-by-frame comparison as the
first experiment; small adjustments and repeated review; later affordable
wearable-sensor experiments; and repeated pitching-velocity personal bests as the
result of a broader process involving coaching, training, evidence, measurement,
and experimentation—not technology alone.

The brief also required clear role boundaries: cameras and sensors capture
evidence, AI surfaces patterns, coaches provide judgment, athletes receive clearer
insight, and parents receive context to support rather than override coaching. It
asked for a concise editorial lessons section, an accurate contact call to action,
readable multiline JSX, removal of clearly obsolete CSS, limited documentation
updates, unchanged raster assets, privacy and prohibited-reference checks, a full
validation suite, two commits, a push, and a pull request.

## Scope

Updated homepage and Story-page narrative, shared content, related presentation
styles, JSX formatting, and only the documentation needed to preserve the new
content and asset decisions. The route structure, dependencies, deployment code,
brand system, product behavior, and binary assets were not changed.

## Decisions

- Kept the existing hero headline and replaced its support text with one concise
  sentence that postpones AI until its role can be explained.
- Described velocity progress as part of coaching, training, evidence, repeated
  experimentation, and measurement, with an explicit statement that no tool did
  the work alone.
- Added role-specific language that keeps coaches at the centre and positions
  parents as appropriately informed supporters.
- Retained the workbench image because a new visible caption directly connects it
  to physical experimentation and testing ideas against the real world.
- Added the requested lessons as a simple editorial list rather than feature
  cards or a roadmap.
- Preserved exactly three public storytelling images and did not alter any binary
  or SVG asset.

## Implementation

The homepage now tells the founder origin in first person and clearly distinguishes
evidence capture, AI pattern identification, and coaching judgment. The Story page
now moves through the origin experiment, founding question, lessons about human
judgment, concise evidence learnings, and an honest exploratory direction. The
Contact page and homepage JSX were reformatted without changing behavior, and the
Story call to action now accurately says “Start a conversation.”

## Engineering impact

No routes, dependencies, client-side behavior, APIs, persistence, analytics,
deployment boundaries, or product features changed. Semantic sections, image alt
text, responsive rules, focus behavior, and reduced-motion support remain in place.
The CSS surface is smaller after removing selectors left behind by retired Work and
About compositions. Public privacy protections were strengthened in documentation
and observed in copy.

## Files changed

- Shared copy and metadata in `content/site.ts`.
- Page composition and formatting in the Home, Story, and Contact routes.
- Focused editorial, workbench-caption, and dead-selector changes in global CSS.
- Founder-story, content, asset, and site-strategy guidance in the README and docs.

## Documentation updated

Updated `README.md`, `docs/BRAND_STRATEGY.md`, `docs/CONTENT_GUIDE.md`,
`docs/ASSET_MANIFEST.md`, and `docs/SITE_STRATEGY.md` to record the founder story,
truthful causation limits, coaching and parent roles, privacy expectations, and the
decision to retain all three images without modifying binaries.

## Git diff summary

Implementation commit `f8cecca` changed 10 text files with 419 insertions and 45
deletions. Most additions replace minified JSX with readable multiline markup and
expand the Story page’s specific editorial narrative.

## Verification

- Installed the repository’s Node 24 version through nvm and completed `npm ci`.
- Removed `.next`; TypeScript, ESLint, and the standard Next.js production build
  passed.
- The production build generated only Home, Story, Contact, framework not-found,
  robots, and sitemap routes.
- Production dependency audit reported zero vulnerabilities.
- Diff whitespace, status, stat, and numstat inspections completed.
- Public prohibited-reference and binary-diff scans found no matches.
- SVG inspection found no embedded image/font data or remote resource references.

## Repository state after implementation commit

Branch `work` at implementation commit `f8cecca`; the worktree was clean before
this journal file was added. No Git remote was configured in the provided checkout,
so the implementation commit had no upstream relationship and could not be pushed
directly from Git.

## Implementation commits

- `f8cecca` — `content: ground site in founder origin story`

## Archive commit

`docs: archive founder origin refinement prompt`

## Lessons learned

A personal origin becomes more credible when the evidence cycle is described
concretely and performance outcomes remain connected to the full human training
process. Images with an indirect relationship to the story need visible context or
should not be rendered.

## Follow-up ideas

None committed. Future product directions should remain exploratory until they can
be supported by evidence.
