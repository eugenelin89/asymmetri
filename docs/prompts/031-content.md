# Prompt 031: Restore historical homepage content in the current design

- Date: 2026-09-29
- Scope: content
- Goal: Restore the root page's content from the owner's specified commit while retaining the current visual design.

## Original user request

> lets try retaining the design, but for the root page content go back to 0c05c7bacde8dad43701361b8488a113c8a21f87

The owner repeated this request after an interruption. The interrupted attempt had
made no changes. This continues the existing production-review instruction:

> just deploy. i will see how i like in prod

## Scope

Restore homepage content, supporting conceptual/product explanations, approved
Motion imagery and root metadata. Preserve current colors, typography, spacing,
responsive styling, shared navigation and all other routes' copy and previews.

## Decisions

- Treat the explicit commit reference as the authoritative homepage content,
  superseding the intervening sport-only wording for this trial. Explain that its
  Motion-specific language and evidence return with the content restoration.
- Keep historical BotSquad summaries and root metadata within `labs`, so current
  product-page copy and shared metadata defaults remain unchanged.
- Preserve `labs.origin`, which About also reads. Compare all other content exports
  against the pre-task version rather than reverting the shared content file.
- Present the historical conceptual explanation and worker steps with semantic
  lists in the current light design. Do not restore the old dark diagram geometry.
- Give the root page separate social artwork so other page previews do not change.

## Implementation

The homepage again leads with “Build an asymmetric advantage,” followed by the
historical company principle, two product panels, common thread and contact.
Historical product/video and Work/Sport context links return. Motion's original
icon and approved evidence capture retain accurate descriptions and labels.

## Engineering impact

Two small server components and homepage-scoped CSS support the restored content.
No new JavaScript, dependency, runtime, routing, tracking, persistence or product
capability is introduced. Protected Motion routes and shared navigation are unchanged.

## Files changed

Root page composition, homepage content, two explanation components, scoped styles,
and a new root-only SVG/PNG social preview. README and architecture, asset, brand,
content, site strategy, testing and visual guidance describe the resulting state.

## Documentation updated

Current documentation records the requested historical content trial and its scope.
Asset provenance covers the new social preview and unchanged approved image reuse.
Historical journals remain unchanged; deployment procedures and dependencies do
not change.

## Git diff summary

15 files changed, 347 insertions and 142 deletions, including the new social PNG.
The implementation restores content and adds its light presentation while removing
obsolete homepage-only summaries/styles. This record excludes its own changes.

## Verification

- Initial clean main and successful git pull --ff-only; Node 24.10.0 matched .nvmrc.
  nvm was unavailable.
- npm run check, npm run build and npm run build:next passed.
- npm audit --omit=dev returned the unchanged four findings: one critical, two
  high and one moderate. No dependency remediation was included.
- Historical homepage values compared exactly with the requested commit; the
  homepage BotSquad snapshot and metadata also matched. All non-homepage content
  exports and About's origin value compared unchanged.
- Protected route source, other route composition, shared navigation, existing
  brand/product/social assets, dependencies and runtime configuration were unchanged.
- Homepage browser checks at 320, 375, 768, 1024 and 1440 CSS pixels found no overflow,
  broken images or duplicate H1. Desktop hero/product/evidence and mobile hero were
  visually inspected. The remaining eight routes passed the same DOM checks at
  375, 768 and 1440 pixels. Browser console had no warnings or errors.
- Keyboard Enter opened the native Work disclosure and exposed its links; focus
  retained its visible 3px outline. Existing reduced-motion rules were preserved;
  no animation was added.
- Local HTTP checks passed nine pages, 39 image/static URLs, four redirects,
  canonical values, nine sitemap entries, ten tutorial modules and internal hashes.
- Public-copy secret/legacy-reference scans passed. No new private identity or
  image content was introduced. Conceptual/synthetic and projected-2D labels remain.
- The new 1200×630 social PNG was visually inspected; git diff --check passed.
- Production preflight confirmed the expected clean prior release, active/enabled
  service, existing Node 22 runtime and capacity for an independent candidate.
  Production checks/build and live verification follow the two commits and push;
  exact source/build/rollback identities and results belong in the external receipt.

## Repository state after implementation commit

Clean main at af978243a8692c91dc76827a90de1aa08429d40f, one commit ahead of the
last observed origin/main. Journal and push follow; no branch, worktree or PR.

## Implementation commits

- af978243a8692c91dc76827a90de1aa08429d40f — Restore historical homepage content within the current design.

## Archive commit

`docs: journal historical homepage content restoration`

## Lessons learned

Historical content can be restored independently of shared product copy and visual
styles. Scope metadata and social artwork too when a revision concerns only one page.

## Follow-up ideas

Further changes depend on the owner's production review.
