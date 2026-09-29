# Prompt 030: Keep the homepage at the sport level

- Date: 2026-09-29
- Scope: content
- Goal: Remove discipline-specific references from the homepage while preserving its layout and deeper product truth.

## Original user request

> I don't want the mention of baseball or pitching or pitcher in the home page. Just sport.

This continues the owner's production-review workflow from the preceding requests.

## Scope

Homepage copy, accessible content, metadata, social preview and its Sport panel.
Preserve the approved palette, page hierarchy, product links and all deeper pages.

## Decisions

- Give the homepage its own Sport and principle summaries instead of borrowing
  discipline-specific Motion and About copy.
- Remove the homepage Motion icon and evidence capture rather than relabelling
  those accurate images misleadingly. Keep the original assets on deeper pages.
- Keep Motion named as the first Sport product with its platform, release status
  and direct links. Broad company positioning does not imply support for every sport.
- Include search/social metadata, Organization description and social-image text
  in the review so the removed terms do not remain in previews or accessible copy.

## Implementation

The hero introduces Sport as technology for athletes and coaches. The principle
uses a general task/skill example. The Sport panel pairs a short Motion introduction
with a text overview for athletes and coaches. The social support line now reads
“Part of Asymmetri Sport.” Existing section order and product hierarchy remain.

## Engineering impact

Server-rendered copy and scoped presentation only. No dependency, runtime, routing,
privacy, tracking, navigation behavior or product capability changes. Both public
hosts and protected Motion resources retain their existing destinations.

## Files changed

Homepage composition, shared content, scoped panel CSS, Labs social SVG/PNG and
related README/architecture/brand/content/strategy/visual/testing/asset guidance.

## Documentation updated

Current guidance establishes the homepage's sport-level language boundary and
reserves specific product descriptions and imagery for deeper pages. The asset
manifest records social regeneration and removed homepage asset reuse.

## Git diff summary

13 files changed, 72 insertions and 46 deletions, plus the regenerated social PNG.
Removed obsolete homepage image styles and added the text overview. This record
does not include its own changes.

## Verification

- Clean main; git pull --ff-only succeeded. Node 24.10.0 matches .nvmrc; no nvm.
- npm run check, npm run build and npm run build:next passed.
- npm audit --omit=dev returned the unchanged four findings: one critical, two
  high and one moderate. Dependency remediation remains outside this revision.
- Homepage at 320, 390, 768, 1024 and 1440 CSS pixels had one H1, no horizontal
  overflow and no forbidden terms anywhere in the rendered document HTML.
- Browser console returned no warnings or errors. Desktop Sport panel and the
  regenerated 1200×630 social image were visually inspected.
- Local HTTP checks passed nine pages, 35 image/static URLs, four redirects,
  canonical values, nine sitemap entries, ten tutorial modules and internal hashes.
- Exact rendered homepage HTML contained no baseball, pitch, pitches, pitching,
  pitcher or pitchers references, nor either removed image URL.
- Detailed Motion, Work, BotSquad, About and utility/tutorial content exports
  compared unchanged. Protected route sources, public product assets, redirects,
  package files and lockfile were unchanged. Product facts and original alt text
  were preserved; no new private identity or capability was introduced.
- Social SVG text and git diff --check passed. Source SVG was rasterized through
  the existing Sharp dependency without a new tool or external asset.
- Production uses the existing staged-release procedure after these commits.
  Exact release/build/rollback identities and live checks belong in the external
  task receipt.

## Repository state after implementation commit

Clean main at ab39ae0c408552f85cbeff129972272bacbd0bc2, one commit ahead of the
last observed origin/main. Journal and push follow; no branch, worktree or PR.

## Implementation commits

- ab39ae0c408552f85cbeff129972272bacbd0bc2 — Keep the company homepage focused on sport.

## Archive commit

`docs: journal sport-level homepage language`

## Lessons learned

Company positioning needs separate summaries from precise product explanations.
Check metadata, accessible descriptions and image text alongside visible prose.

## Follow-up ideas

Further changes depend on the owner's production review.
