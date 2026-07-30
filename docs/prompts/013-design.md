# Prompt 013: Unblurred hero photograph

- Date: 2026-07-30
- Scope: design
- Goal: Restore the real cap logo and uniform lettering in the existing hero photograph without changing its composition or visual treatment.

## Original user request

> I like the website right now. I like the photos used. But can you remove the
> blurring? Logos and name on the uniform and hat is fine.

## Scope

Included the existing public pitching photograph, its source-backed cap and
uniform detail, asset provenance, photography guidance, and the site privacy
summary.

Excluded page layout, crop behavior, typography, copy, routes, metadata, logos,
other public images, dependencies, scripts, and application behavior.

## Decisions

- Kept the selected photograph, 3:2 composition, 2400 by 1600 dimensions,
  restrained grade, subject placement, and hero usage unchanged.
- Verified that the exact owner-supplied source remained available and matched
  the checksum already recorded in the asset manifest.
- Treated the public visibility of the cap logo and uniform lettering as
  explicitly owner-approved.
- Tested a tightly constrained built-in image edit using the current public
  asset and the exact unblurred source. Rejected that generated output because
  it altered unrelated glove and fabric detail.
- Restored the two softened areas from the authentic source instead. Matched
  the existing public grade and used localized feathered transitions so all
  other image areas remained visually unchanged.
- Preserved the existing filename and URL so no component or content reference
  needed to change.

## Implementation

Replaced `public/images/baseball/pitching-delivery.webp` with a source-backed
derivative that contains the real cap logo and uniform lettering without the
previous localized blur. The existing crop, global grade, output dimensions,
format, and metadata-free delivery were preserved.

Updated the asset manifest, visual identity, and site strategy to record the
owner approval and remove outdated references to privacy softening.

## Engineering impact

The browser loads the same image URL with the same dimensions, aspect ratio,
format, alt text, and layout behavior. No component, content, route, dependency,
script, runtime, or deployment architecture changed.

The public asset now shows owner-approved cap and uniform marks. It still
contains one pitcher, no bystanders, no venue signage, and no private screen or
document.

## Files changed

- Replaced the existing homepage hero WebP with the unblurred source-backed
  derivative.
- Updated asset provenance and privacy approval in
  `docs/ASSET_MANIFEST.md`.
- Updated current photography guidance in `docs/VISUAL_IDENTITY.md`.
- Updated the image privacy summary in `docs/SITE_STRATEGY.md`.

## Documentation updated

The asset manifest now records the restored source detail, 1,176,976 byte output
size, lack of privacy blur, and explicit owner approval. The visual identity and
site strategy now describe the visible cap logo and uniform lettering.

## Git diff summary

The implementation commit changed four files with 17 text insertions, 16 text
deletions, and one replaced WebP. The image changed from 1,194,344 bytes to
1,176,976 bytes.

## Verification

- Preflight confirmed a clean `main` branch synchronized with `origin/main`.
- The original source remained untouched at 4608 by 3072 pixels with SHA-256
  `9c1719b81e8ed9715cdbd03375df241c3e35421cdc6140443ae2afdddc17733e`.
- The replacement WebP is 2400 by 1600 pixels, has no alpha channel or embedded
  color profile, and has SHA-256
  `8f39aa5fe8bed119679c5b3bed12ce762d5e1eab4130a6fa4d6c77be815eb75f`.
- Full-image and close-crop inspection confirmed that the cap logo and uniform
  lettering are sharp, the former blur is absent, and the original composition
  and grade remain intact.
- `npm run check` passed TypeScript and ESLint.
- `npm run build` passed the Vinext production build. It emitted only the known
  Tailwind no-utility-class warning because the site uses semantic CSS.
- `npm audit --omit=dev` reported zero production vulnerabilities.
- `git diff --check` passed.
- The implementation diff introduced no em dash or en dash characters.
- No public copy, component, route, metadata, dependency, or script changed.

## Repository state after implementation commit

Branch: `main`

Implementation commit: `f8edb5cc6138c4ace286d1a12eb829a4d49318be`

The worktree was clean after the implementation commit. `main` was one commit
ahead of `origin/main` and had not yet been pushed when this record was created.

## Implementation commits

- `f8edb5cc6138c4ace286d1a12eb829a4d49318be` Restore unblurred hero photograph

## Archive commit

`docs: archive unblurred hero photograph`

## Lessons learned

When the authentic unblurred source is available, source-backed restoration is
more faithful than generative reconstruction. A generated comparison can still
help confirm the visual target, but it should not replace real image detail when
unrelated pixels drift.

## Follow-up ideas

None committed.
