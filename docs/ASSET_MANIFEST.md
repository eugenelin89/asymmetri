# Asymmetri Labs asset manifest

Last updated: 2026-09-16

This internal provenance record covers public assets. Nothing is hotlinked. The
owner has explicitly approved public visibility of the cap logo and uniform
lettering in the selected hero photograph.

## Owner-supplied baseball photo review

The complete owner-supplied baseball folder was recursively inventoried before
selection. Ninety-six eligible still images were reviewed across eight temporary
contact sheets outside the repository. Source extensions were JPG and PNG; image
decoding encountered JPEG, MPO-encoded JPEG, and PNG content. All 96 files opened
successfully, with no unsupported or unreadable images and no exact binary
duplicates.

Perceptual-hash review identified four near-duplicate groups: one two-image
Baseball IQ screenshot pair, two two-image photography pairs, and one 13-image
practice-calendar screenshot sequence. Near duplicates were not treated as
independent visual candidates.

Five photographs reached the final shortlist:

| Source filename | Why it was considered |
| --- | --- |
| `55403450761_e8025f7edf_o.jpg` | Ball release is visible, the mound reads immediately, and the left side provides unusually strong negative space. |
| `55403627994_46ea9658a7_o.jpg` | Selected: one pitcher, visible ball and follow-through, strong mechanics, clean field background, no bystanders, and flexible desktop/mobile composition. |
| `55421863401_7666a0c7ed_o.jpg` | Powerful full-body stride and clear pitching mechanics, but a bystander, readable uniform identity, and number reduced its privacy suitability. |
| `55422258655_ec6b33d8b1_o.jpg` | Strong full-delivery frame with useful negative space, but a bystander, venue signage, and team marks weakened the public-site fit. |
| `55422258760_926c28586c_o.jpg` | Dynamic follow-through and complete body position, but the background signage, bystander, and less controlled framing added distraction. |

One photograph was selected. A second image was rejected because none added a
distinct slow-motion review, sensor, or coaching moment without introducing
private screens, group context, visible organizations, or redundant pitching
action.

## Selected hero photograph

| Field | Record |
| --- | --- |
| Destination | `public/images/baseball/pitching-delivery.webp` |
| Original source filename | `55403627994_46ea9658a7_o.jpg` |
| Source dimensions | 4608×3072 |
| Output dimensions | 2400×1600 |
| Output format and size | WebP, quality 86, 1,176,976 bytes |
| Processing | Existing restrained desaturation, slight contrast increase, and slight exposure reduction preserved; high-quality Lanczos source resize used to restore the real cap logo and uniform lettering through two localized feathered regions; no privacy blur remains; EXIF and ICC metadata omitted |
| Public role | The only rendered photograph; homepage hero |
| Alt text | A pitcher follows through on the mound as the baseball travels toward the plate. |
| Privacy assessment | One pitcher, no bystanders, no signage, and no private screen or document; cap and uniform marks are visible with explicit owner approval |
| Reason selected | The image communicates pitching mechanics, effort, and development immediately while providing a focused, premium composition that works in a wide desktop panel and a full-width mobile crop |

The source file remained untouched. Temporary thumbnails, contact sheets,
coordinate-review images, and inventories were created outside the repository
and were not committed.

## Brand and social assets

The existing raster favicons, app icon, and unused `public/og.png` remain
unchanged. The rendered brand mark remains the established Asymmetri Labs mark.
The updated plain UTF-8 `public/og.svg` is a 1200×630 vector-only social preview
using the baseball positioning, sans-serif typography, near-black palette, and
single orange accent. It contains no `<image>` element, photograph, base64 data,
remote URL, or external font.

## Retained but no longer rendered

- `public/images/sports/baseball-running-action.webp`
- `public/images/research/wearable-sensor-prototype.webp`
- `public/images/research/systems-workbench.webp`
- `public/og.png`

These existing assets remain unchanged in the repository. Their code references
were removed because the public site now uses one pitching photograph. No
product screenshot, research plot, workbench image, sensor image, team photo, or
second baseball action image is rendered.

## Motion product identity, September 16, 2026

The website introduces only the owner-approved **A Release** artwork. Both files
are byte-for-byte copies from the read-only product reference; no app repository
file was modified and no exporter was run there.

| Public file | Exact source in the Motion reference | Dimensions and processing | Role / alt text / rights |
| --- | --- | --- | --- |
| `public/brand/motion-release.svg` | `docs/design/release-brand/source/A-release-default.svg` | 1024×1024 viewBox; original vector copied unchanged; CSS corner mask in page only | Homepage introduction and `/motion` hero; “Asymmetri Motion icon: an overhand pitcher and released ball on deep teal.” Original task-authored geometry, no stock/private media/font; owner approval in Decision 51 and release-brand README. Approval does not claim trademark clearance. |
| `public/brand/motion-release.png` | `ios/AsymmetriMotion/AsymmetriMotion/Assets.xcassets/AppIcon.appiconset/AppIcon-default.png` | 1024×1024 opaque packaged export, copied unchanged | `/motion` Open Graph/Twitter image; same description and rights as SVG. Raster format for social consumers. |

Source snapshot inspected locally: `c74cfaa30c17a6c4be96502205e6e8a653faf782`.
The source and packaged hashes are respectively:

- SVG SHA256: `0a4d7d23202fa05087c80a0b50170581a698d3dc769e6b1ac3216ecd16bd664e`.
- PNG SHA256: `54d306f9456c954be7609cde4a902b05e1ea4c8ea06e22568a0ff7b0b0faf16a`.

The existing `public/og.svg` remains a 1200×630 local vector social preview.
Only its description/support line changes to introduce Motion and evidence that
supports coaching. Its original geometry and company palette remain intact.
No source photo, remote resource, font dependency or new rights requirement is
introduced. The main hero photograph is byte-identical to the preceding commit.

### Interface/media publication assessment

The V1 visual README and continuation render index identify engineering captures
of generated fixtures; the Store screenshot plan does not grant automatic
marketing approval. Earlier tutorial UI can differ from current V1, including
measurement visibility. The September 10 marketing videos use private real footage
and retained-device captures and remain local. No screenshot or video was copied.
No fixture number is presented as real or validated biomechanics. No private athlete
name, history, team context, notification or identifying app data is published.

`components/evidence-chain.tsx` is semantic HTML/CSS, not an image asset or a
reconstruction of an app screen. Its six steps explain the public workflow with
text and list order; there are no athlete illustrations or invented values.
B/C icon alternatives, dark/tinted variants, Store templates and white-paper files
are not added to the public site. No existing asset is removed.
