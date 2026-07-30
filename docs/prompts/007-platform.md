# Prompt 007 — Restore binary compatibility

- Date: 2026-07-30
- Scope: platform
- Goal: Make the approved Asymmetri Labs pull-request diff compatible with a text-only review system without changing the site.

## Original user request

> The implementation is complete, but pull-request creation is blocked by: “Binary files are not supported.” Fix only the binary-file compatibility problem. Preserve the approved site design, content, page structure, company rename to Asymmetri Labs, and all functional changes.

The attached instructions required a full binary diff audit; byte-for-byte restoration of modified binaries; removal of newly added binaries; preservation of intentional deletions; plain UTF-8 vector-only SVG brand/social assets; unchanged existing storytelling images; accurate asset documentation; status, stat, numstat, whitespace, check, and Next.js build validation; explicit checks for embedded raster data and remote image references; a correction commit; and a pull-request retry. The attached prior PR description and diff identified the completed site implementation that must remain unchanged.

## Scope

Only binary compatibility and the corresponding asset-manifest clarification were addressed. Site design, copy, routes, metadata, SVG composition, and behavior were not changed.

## Decisions

- Restored the two modified documentation preview PNGs from the task base commit byte-for-byte.
- Preserved the intentional deletion of two unused WebP images from the approved simplification.
- Kept the three rendered storytelling images and all retained icons byte-for-byte identical to the base.
- Kept the existing plain UTF-8 `public/og.svg`; no new SVG was necessary.

## Implementation

Restored both preview PNGs to their base bytes and expanded the asset manifest to state that retained binary assets are unchanged, image reduction is compositional, the two WebP deletions are intentional, and the rendered lockup/social preview are vector-based.

## Engineering impact

The complete task diff now contains no added or modified binary file. Its only binary changes are two intentional deletions. Runtime output is unchanged.

## Files changed

The correction commit restores the desktop and mobile documentation preview PNGs and updates the text asset manifest.

## Documentation updated

`docs/ASSET_MANIFEST.md` now explicitly records the binary compatibility guarantees and differentiates unchanged retained assets, no-longer-rendered assets, and intentional deletions.

## Git diff summary

The correction commit changes three files: eight documentation lines added, four removed, and two PNGs restored to their base bytes. Across the full task diff, the restored PNGs disappear from the diff and only the two intentional WebP deletions remain binary changes.

## Verification

Git status, stat, numstat, whitespace validation, TypeScript/ESLint checks, and the standard Next.js production build passed. SHA-256 comparisons confirmed all retained storytelling images, raster icons, the unused social PNG, and restored documentation previews match the base. SVG scans found no embedded raster data, image elements, base64 data, or remote image references.

## Repository state after implementation commit

Branch: work. Correction implementation commit: `127afbf4958eb908dbaa97399b388dc7e28ddf67`. The worktree was clean before this journal record was created.

## Implementation commits

- `127afbf4958eb908dbaa97399b388dc7e28ddf67` — Restore binary previews for PR compatibility

## Archive commit

Archive prompt 007 for binary compatibility

## Lessons learned

Generated review screenshots should not be committed when a pull-request system accepts only text changes; responsive verification can remain a reported check while base screenshots stay byte-identical.

## Follow-up ideas

None.
