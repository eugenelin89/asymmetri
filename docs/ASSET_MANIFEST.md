# Asymmetri Labs asset manifest

Date: 2026-07-30

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
