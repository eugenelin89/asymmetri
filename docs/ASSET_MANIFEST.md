# Asymmetrico asset manifest

Date: 2026-07-29

This is an internal provenance record. The rendered website does not identify the
private athlete-development source organization.

## Selected assets

| Final path | Source repository | Original path | Original / final dimensions | Processing and public role | Alt text | Provenance assessment |
| --- | --- | --- | --- | --- | --- | --- |
| `public/images/sports/baseball-running-action.webp` | ChristopherLin.ca reference | `public/images/baseball/christopher-lin-running-after-contact-1400.webp` | 1400×933 / 1400×933 | Renamed; Next.js supplies responsive renditions. Homepage hero for authentic effort and motion. No source-organization identity. | A baseball player accelerating out of the batter’s box as clay lifts from the ground. | First-party image already intentionally public in the reference portfolio. Reuse remains subject to repository-owner confirmation. |
| `public/images/sports/baseball-pitching-mound.webp` | ChristopherLin.ca reference | `public/images/baseball/christopher-lin-pitching-mound-1400.webp` | 1400×933 / 1400×933 | Renamed; responsive runtime delivery. Human-outcome chapter. | A pitcher pauses on the mound and looks toward home plate before the next delivery. | First-party image already intentionally public. No source-organization mark; incidental uniform branding is not named or presented as a partnership. |
| `public/images/research/wearable-sensor-prototype.webp` | ChristopherLin.ca reference | `public/images/projects/pitching-biomechanics/sensor-data-collection.webp` | 946×1842 / 946×1842 | Renamed; portrait crop handled in CSS. Used only as emerging research. | A baseball player testing wired motion sensors on the arm and waist during an early prototype session. | Public first-party research image. The subject is already intentionally public in the reference project; no performance or product claim is attached. |
| `public/images/research/motion-signal-plot.webp` | ChristopherLin.ca reference | `public/images/projects/pitching-biomechanics/motion-signal-plot.webp` | 1486×734 / 1486×734 | Renamed; preserved at source ratio. Research artifact for movement signals. | Two line plots showing hip acceleration and angular velocity across a recorded pitching motion. | Source-backed technical artifact. Labels are legible and no private athlete identity is present. |
| `public/images/research/temporal-attention-map.webp` | ChristopherLin.ca reference | `public/images/projects/pitching-biomechanics/attention-weighted-sensor-data.webp` | 1271×590 / 1271×590 | Renamed and reserved for future research storytelling; not currently rendered. | Temporal attention heatmap over a recorded pitching sensor sequence. | Verified research artifact, held in reserve to avoid overloading the current story. |
| `public/images/research/systems-workbench.webp` | ChristopherLin.ca reference | `public/images/profile/christopher-building-swarm-robot-1080.webp` | 1080×1440 / 1080×1440 | Renamed. About-page engineering-origin and Work-page physical-prototyping visual. | A workbench with small tracked robots, electronics, and prototyping tools. | First-party image already intentionally public. Presented as engineering origin, not as the company’s current product. |
| `public/brand/asymmetrico-*.svg` | Primary Asymmetrico repository | New original identity | Vector | New symbol, wordmark, horizontal, stacked, light, and monochrome sources. | Variant-specific embedded SVG title. | Original work created for Asymmetrico. |
| `public/brand/asymmetrico-app-icon.png` | Primary Asymmetrico repository | `public/favicon.svg` | Vector / 512×512 | High-resolution PNG application icon rendered from the final mark. | Decorative/icon context. | Original work created for Asymmetrico. |
| `public/brand/asymmetrico-favicon-{16,32,48}.png` | Primary Asymmetrico repository | `public/favicon.svg` | Vector / named sizes | Browser-size PNG fallbacks. | Decorative/icon context. | Original work created for Asymmetrico. |
| `public/og.png` | Primary Asymmetrico repository | Purpose-built social card | 1200×630 / 1200×630 | Final brand palette, headline, lockup, and site visual combined for link unfurls. | Asymmetrico — Talent is everywhere. The tools aren’t. | Original generated composition for Asymmetrico; text and imagery manually reviewed before use. |

No hotlinked image is used. Next.js generates responsive image renditions at runtime
from the local source assets.

### Social-preview generation record

The social-preview source was created with the built-in image-generation model in
one request, using the selected running-action photograph and the final app icon as
references. It was then cropped and resized deterministically to 1200×630.

Final prompt:

> Create a production-ready 1200×630 horizontal social-sharing preview card for the
> new sports technology company Asymmetrico, using the attached baseball running
> action photo and attached Asymmetrico app icon as reference assets. Preserve the
> exact Asymmetrico symbol from the icon. Editorial art direction: deep Ink navy
> (#0B1020), warm Canvas (#F3EFE6), Clay (#C86D45), Signal Green (#3F8068), and Data
> Blue (#68B7D6); bold asymmetric composition; restrained, human, credible, premium,
> accessible sports technology rather than flashy sports advertising or a generic
> startup. Feature the runner in motion on the right, with subtle geometric field
> markings and layered data lines, and a quiet tactile grain. On the left, include
> the exact text, letter for letter: “Asymmetrico” and “Talent is everywhere. The
> tools aren’t.” and “Accessible sports technology for an uneven playing field.”
> Keep all text crisp, correctly spelled, comfortably inside safe margins, and highly
> legible at thumbnail size. Do not add any other words, numbers, team names, logos,
> sponsor marks, UI screenshots, or badges. No neon, no purple-blue glow, no crypto
> aesthetic, no fake product claims.

## Athlete-development source repository inventory

Considered:

- Analytics athlete search, profile, comparison, timeline, evaluation, review,
  reporting, command-centre, completion, and assessment templates;
- structured observation, question-set, evaluation-cycle, response, permission,
  comparison, timeline, metrics, review, and reporting implementation;
- public site hero, program, registration, achievement, logo, and social icon files.

Selected:

- no binary image or direct screenshot;
- verified concepts only, represented by the synthetic
  `components/editorial/platform-visual.tsx` reconstruction and the system-flow
  diagram.

Excluded:

- all organization logos and branded public-site images: anonymity requirement;
- direct application screenshots: source identity, account context, team context, and
  possible athlete data;
- achievement images and team imagery: identifying marks, uncertain rights, and no
  direct role in the company story;
- media transcript image: private personal information;
- legacy player-development visuals: product-state ambiguity.

Anonymization work:

- no source screenshot was copied;
- athlete names, counts, notes, statuses, and timelines in the public reconstruction
  are synthetic;
- no team, division, coach, account, deployment, domain, or repository identifier is
  present.

## ChristopherLin.ca reference inventory

Considered:

- pitching and running baseball photography;
- team baseball photography;
- wearable-sensor data collection;
- motion-signal plots;
- temporal-attention heatmaps;
- sequence-model architecture diagram;
- workbench and physical robot photography;
- simulation imagery and scaling-result chart;
- social-card composition and responsive-image patterns.

Selected:

- running action;
- pitcher on mound;
- wearable-sensor prototype;
- motion-signal plot;
- temporal-attention map as a reserved local asset;
- systems workbench.

Excluded or reserved:

- team photograph: many identifiable young people and no essential narrative role;
- model architecture diagram: valid research artifact but too detailed for the current
  public story;
- simulation imagery and scaling chart: would shift the public focus back toward the
  former robotics positioning;
- assembled robot and video covers: redundant with the selected workbench image;
- existing social card: personal branding and copy do not fit Asymmetrico;
- SVG placeholders: generic and not referenced by the finished site;
- research-poster PDFs: useful provenance but too dense and personally attributed for
  the company site.

## Existing Asymmetrico repository inventory

Considered:

- eight legacy raster logo and wordmark variants;
- existing Physical-AI components, visual motifs, metadata, and deployment runbook.

Selected:

- no legacy visual asset.

Excluded:

- legacy neon gradient mark and raster lockups: generic AI/cryptocurrency visual cues,
  blue-purple gradient, glow, weak small-size reproduction, and obsolete company name;
- legacy signal-field and dashboard visuals: unverified product concepts and former
  positioning;
- former blue/cyan grid system: conflicts with the approved Ink, Canvas, Clay, Signal
  Green, and Data Blue identity.

## Rights and consent notes

The selected reference images were already published as first-party evidence in the
owner-supplied public repository. This manifest records that provenance but is not a
legal rights determination. If the repository owner cannot confirm permission for
broader company use, replace the affected image before public launch.
