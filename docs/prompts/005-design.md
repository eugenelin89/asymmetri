# Prompt 005 — Remove binary PR obstruction

- Date: 2026-07-30
- Scope: design
- Goal: Preserve the simplified website while making its task diff compatible with Cloud Codex’s text-only pull-request workflow.

## Original user request

> The implementation is correct, but Cloud Codex cannot create the pull request because the task contains added or modified binary files.
>
> Make the smallest possible corrective update so the Cloud Codex “Create PR” workflow can publish the work without losing the design.

The request required a complete task-diff audit for binary changes; restoration of
any modified pre-existing binary; replacement of the modified social PNG with a
1200×630 text-only SVG using the Asymmetrico identity, palette, specified headline,
and baseball support line; updates to every active social-preview reference and the
asset manifest; full builds, XML, route, redirect, metadata, privacy, and binary-diff
validation; and one minimal corrective implementation commit.

## Scope

Only the social-preview asset, its active references, and directly affected asset,
testing, and onboarding documentation changed. The website simplification, content,
routes, redirects, layout, metadata semantics, accessibility, styling, photography,
and intentionally removed research image were preserved.

## Decisions

- Restored `public/og.png` byte-for-byte from the task base and left it unused.
- Added `public/og.svg` as plain UTF-8 XML with no embedded raster or remote resource.
- Retained the intentional deletion of the obsolete temporal-attention WebP because
  binary deletions are supported and it was part of the approved simplification.
- Pointed Open Graph, Twitter/X, documentation, and route checks to `/og.svg`.

## Implementation

Created a 1200×630 vector social card using Ink, Canvas, Clay, the Asymmetrico mark
and wordmark, “Better tools for an uneven playing field.”, and “Sports technology.
Starting with baseball.” Updated all active references and documented why the SVG
keeps the PR text-only.

## Engineering impact

No runtime code path, dependency, public route, or raster photograph changed. The
final task diff has one supported binary deletion and no binary addition or
modification. The new SVG is served as `image/svg+xml`.

## Files changed

- Social metadata and metadata helper.
- Text-only SVG social card and restored, unused historical PNG.
- README, testing route list, and asset provenance documentation.

## Documentation updated

`README.md`, `docs/TESTING.md`, and `docs/ASSET_MANIFEST.md` now reference the SVG,
record unchanged raster photography and the restored unused PNG, and explain the
Cloud Codex-compatible vector approach.

## Git diff summary

Implementation commit `963549c` changed seven files with 31 text insertions and ten
text deletions, added one text SVG, and restored the prior PNG bytes. Relative to the
task base, the PNG no longer appears in the diff.

## Verification

- `npm run check`, `npm run build`, `npm run build:next`, and `git diff --check`
  passed after dependencies were installed under the `.nvmrc` Node version.
- All four public routes and `/og.svg` returned HTTP 200.
- Both legacy routes returned HTTP 308 to their documented destinations.
- XML parsing confirmed a valid SVG with 1200×630 dimensions.
- Rendered metadata referenced only `og.svg`; public privacy scans were clear.
- SHA-256 comparison confirmed `public/og.png` exactly matches the task base.
- Task-base `git diff --numstat` showed no binary additions or modifications.

## Repository state after implementation commit

Branch `work`, implementation commit `963549c`, with only this journal record
uncommitted. The checkout has no configured Git remote.

## Implementation commits

- `963549c` — Replace raster social preview with SVG

## Archive commit

`docs: archive SVG social preview correction`

## Lessons learned

When a delivery path rejects binary modifications, preserve established raster assets
and express brand-only social artwork as source-controlled SVG markup.
