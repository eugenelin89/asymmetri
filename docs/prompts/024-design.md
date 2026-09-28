# Prompt 024: Labs portfolio with protected Motion resources

- Date: 2026-09-28
- Scope: design
- Goal: Implement the Labs portfolio, preserve the Sport origin and Motion release resources, and prepare a verified staged DigitalOcean release.

## Original user request

> implement

The owner selected implementation of the supplied website-redesign brief. Its
complete decision-oriented scope was: make Labs the broad company homepage with
“Build an asymmetric advantage.” and the approved supporting line; introduce
BotSquad and Motion without inflated claims; preserve the existing sports story,
photograph, headings, founder paragraphs and order under `/sport`; retain Motion's
detailed product page and complete tutorial; create real `/botsquad` and `/about`
pages; add the two specified introduction videos with deliberate loading, local
posters, privacy disclosure and external fallbacks; review actual product sources
and selected local design concepts; maintain useful old route/hash destinations;
update metadata, raster social images, navigation, sitemap, documentation and asset
provenance; validate responsive/accessibility/privacy behavior and both build
paths; commit/push through the established journal workflow and use a staged
release on the existing DigitalOcean deployment with rollback and live checks.

Additional user-visible instructions:

> provide ETA, and every 10 minutes

> create the license file for me. you should have git access

The owner selected MIT (“allow reuse, modification, and commercial distribution
with attribution”) and Eugene Lin as copyright holder.

> should it be "sport" or "sports"?

The implementation uses Asymmetri Sport for the brand and sports technology for
the descriptive category.

> For the Bot Squad video, I think you are using the wrong one. You are using the Taiwanese video, but I want you to use the English video: https://youtu.be/E5r_lOecC-M

> The Asymmetri-Motion app to be deployed on Apple App Store is also using this site for various purposes such as privacy statement. While they don't have to remain the same URL as I will work in the other project to make sure the links work, can you make sure the links to the pages, and the pages themselves are still available and will not get deleted.

## Scope

The website implementation covers eight real routes, shared structure, optional
media, preserved product resources and the complete release documentation. Motion
source/design inputs were read only. The only separate repository change was the
explicitly requested BotSquad license. No app release, App Store configuration,
backend, database, authentication, tracking, form or dependency upgrade is included.

## Decisions

- Separate company philosophy, sports origin and product detail rather than
  compressing Motion or duplicating the founder story.
- Preserve Sport's source paragraphs, headings, section IDs and original photograph.
- Ground BotSquad in reviewed current source: durable logical workers and bounded
  execution, self-hosted tunnel access now, standard web/mobile work in development.
- Add MIT licensing only after the owner supplied license and copyright choices;
  verify GitHub recognition before publishing the open-source claim.
- Use the owner's corrected English BotSquad video and the original Motion video.
  Loading creates the privacy-enhanced iframe; scrolling, hovering and initial
  rendering do not. An origin referrer supports YouTube requirements without an SDK.
- Keep Google's processing disclosure explicit. Privacy-enhanced does not mean
  tracking-free. Preserve the audited Motion/app, Apple and support-retention meaning.
- Label two small Explorer images as synthetic design concepts, not current screens
  or scientific evidence. Preserve every existing public asset byte-for-byte.
- Keep all shared copy, product facts, navigation and video URLs in typed exports
  in `content/site.ts`, following the repository's existing ownership boundary.
- Preserve the app's actual www privacy/support URLs and protect `/privacy`,
  `/support`, `/tutorial` and `/motion` in AGENTS and maintenance documentation.
- Keep `/about` real; route `/work` to the Labs portfolio and old sports fragments
  to Sport. The tutorial keeps its exact www canonical and original-image URLs.
- Use an independent complete release candidate with a complete prior-directory
  rollback because this change includes routes and redirect configuration.

## Implementation

The Labs homepage now introduces a shared ambition through two concrete products.
The retained narrative lives on Sport with local navigation. BotSquad explains
workflow, persistence, handoffs, controls, access and source availability. About
explains the company idea. Motion retains its workflow, evidence chain, history,
limitations and privacy, with an introduction video after its hero and a bounded
concept section. Shared navigation, footer labels, metadata and sitemap match the
new hierarchy. The optional player restores button focus when closed and keeps a
normal external fallback available.

## Engineering impact

Server-rendered content remains the default. New client behavior is limited to
explicit video activation and three legacy homepage fragment mappings; the existing
tutorial enhancement is unchanged. No dependencies, lockfile, Vinext packaging,
server state, visitor storage or analytics changed. Five local assets were added:
three social-image source/exports and two optimized concept images. Staged release
procedures preserve the serving build and all rollback inputs until validation.

## Files changed

- Routes and layout: Labs replacement, new Sport/BotSquad/About compositions,
  small Motion additions, sitemap, route redirects and metadata helpers.
- Shared UI/content: semantic diagrams, optional video, fragment compatibility,
  footer navigation, portfolio copy and website-media policy disclosure.
- Styling/assets: appended portfolio/media styles, two concept WebPs and raster
  Labs/Sport social images with the editable Labs SVG source.
- Documentation: current product hierarchy, provenance, source authority, privacy,
  testing, app-link continuity and complete-release deployment procedure.

## Documentation updated

README; Architecture; Site Strategy; Brand Strategy; Visual Identity; Content Guide;
Local Development; Testing; Asset Manifest; Website Privacy Audit; Deployment; new
Portfolio Redesign source/decision record; and a narrow AGENTS continuity section.
Historical prompt records and dated audits retain their original evidence scope.

## Git diff summary

Implementation: 34 files changed, 2,510 insertions and 460 deletions. Most additions
are the new routes, explicit product content, appended styles and updated current
documentation. Existing tutorial, support route, dependency files and public assets
are preserved. This record is excluded from its own implementation summary.

## Verification

- Local Node 24.10.0 matches `.nvmrc`; lockfile install succeeded.
- `npm run check`, `npm run build:next`, `npm run build` and `git diff --check` pass
  on final implementation. The first sandboxed Next build was denied a build-worker
  port; rerunning with the required permission passed. No dependency workaround.
- Production audit retains four baseline findings: Next critical, Sharp high,
  nanoid high and baseline-browser-mapping moderate. No audit fix was applied.
- Browser DOM checks cover all eight routes at effective widths 320, 390, 768,
  1024 and 1440: one H1, expected canonicals, no horizontal overflow or missing alt.
- Local production HTTP inspection passes eight pages, 38 assets, internal links
  and anchors, and eight unique sitemap URLs. Initial product HTML has no iframe.
- Tutorial tests exercise all ten module jumps, branch choices, keyboard disclosure,
  deep link selection, complete-guide mode and original-image links. True disabled
  JavaScript leaves all ten modules readable and the video fallback message visible.
- Keyboard checks include skip-link focus, visible navigation focus, video activation
  and focus restoration after Close. Reduced-motion emulation yields auto scrolling
  and zero transition duration. Temporary browser settings are restored afterwards.
- Fresh BotSquad Network inspection shows zero matching YouTube/Google/ytimg/
  advertising requests before activation and provider requests only after Load.
  The corrected English embed loads and visibly advances; the Motion native player
  loads and starts. A local frame-blocking proxy confirms the external fallback
  remains usable. No browser privacy protection was disabled to force playback.
- All three legacy root fragments reach Sport; new plural products and company
  contact remain on Labs. Source and production-bundle privacy scans return no
  private filesystem, secret-material, private sports-reference or old-video match.
- Structured comparison proves Motion product facts, tutorial content/media, Support,
  Sport story, approach and close are unchanged. Only privacy website, website-media
  and policy-history sections differ. Every pre-existing public asset is unchanged.
- Read-only app Settings code/tests confirm exact www privacy/support destinations.
- Production preflight confirms clean main at the preceding release, active service,
  known running build identity, no competing build, and bounded staging capacity.
  Production compilation/activation/live verification follow the pushed archive;
  this pre-release journal does not claim their future success.

## Repository state after implementation commit

Website main at `42f9994909bbf0d34d37027cbd2b956b85d9662d`, one commit ahead of
origin/main before this archive. Initial and precommit fetch checks matched the
clean baseline `850536ccca2be0fdbc444c2423fcaa5bfbd41ada`. No unrelated work staged.
No branch, worktree or pull request was created. Generated build/test output stays
outside tracked source. The next step is archive commit, push and staged release.

## Implementation commits

- Website: `42f9994909bbf0d34d37027cbd2b956b85d9662d` — feat: introduce Labs portfolio and preserve Motion release resources.
- Separate BotSquad license task: `effba60f349778d82a37fbbb44bf4047a931d875` — docs: license BotSquad under MIT; committed/pushed and verified recognized as MIT.

## Archive commit

`docs: journal Labs portfolio redesign and Motion link continuity`

## Lessons learned

Keep app release resources independent of company marketing changes. Source
availability alone is not an open-source license. Product videos need explicit
language/version review and cannot establish current capability. Responsive
viewport checks must inspect effective CSS width; smooth-scroll and lazy-loading
artifacts in automated captures must not be mistaken for layout defects. Preserve
an entire previous release when routing/source/public inputs change together.

## Follow-up ideas

Dependency remediation and host lifecycle maintenance remain separate reviewed work.
Future Motion availability and BotSquad web/mobile claims require fresh evidence.
No date, public Store link or hosted-service launch is committed by this redesign.
