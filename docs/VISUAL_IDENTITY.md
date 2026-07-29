# Asymmetrico visual identity

## Company name

The company name is **Asymmetrico**. The initial product is **Asymmetrico Platform**.

## Logo concept

The symbol is an open, interrupted “A” built from two unequal forms.

- The larger Ink form establishes the constraint: the field, system, or resource
  imbalance.
- The smaller Clay form moves first and completes the direction of travel.
- The open centre suggests an opportunity rather than a closed enclosure.
- The offset geometry creates balance without symmetry.
- At small sizes the mark remains an “A”; at large sizes it reveals leverage,
  motion, and two perspectives moving toward one direction.

The wordmark keeps “Asymmetri” neutral and gives “co” one restrained Clay
intervention. This highlights collaboration and collective development without
creating a forced word origin.

## Logo files

| Variant | File | Use |
| --- | --- | --- |
| Primary horizontal | `public/brand/asymmetrico-horizontal.svg` | Canvas and light surfaces |
| Horizontal light | `public/brand/asymmetrico-horizontal-light.svg` | Ink and dark surfaces |
| Stacked | `public/brand/asymmetrico-stacked.svg` | Square/editorial applications |
| Wordmark | `public/brand/asymmetrico-wordmark.svg` | Wide, low-height applications |
| Standalone symbol | `public/brand/asymmetrico-mark.svg` | Icons and compact branding |
| Standalone light | `public/brand/asymmetrico-mark-light.svg` | Dark surfaces |
| Monochrome dark | `public/brand/asymmetrico-mark-mono-dark.svg` | One-colour light applications |
| Monochrome light | `public/brand/asymmetrico-mark-mono-light.svg` | One-colour dark applications |
| Application icon | `public/brand/asymmetrico-app-icon.png` | 512-pixel application use |
| Favicon sources | `public/favicon.svg`, `public/brand/asymmetrico-favicon-*.png` | Browser icons |

## Clear space and minimum size

Use the width of the smaller Clay form as the minimum clear space on every side of the
symbol. For the horizontal logo, use the symbol’s internal opening as minimum clear
space.

- Standalone symbol: minimum 16 CSS pixels.
- Horizontal logo: minimum 132 CSS pixels wide.
- Stacked logo: minimum 96 CSS pixels wide.
- Do not reproduce the Clay form below 2 device pixels wide.

The 16, 32, and 48 pixel PNG favicons are exported from the same source and should be
checked on both light and dark browser chrome.

## Color system

| Token | Value | Role |
| --- | --- | --- |
| Asymmetrico Ink | `#0B1020` | Primary dark background, navigation, footer |
| Canvas | `#F3EFE6` | Warm editorial background |
| Soft White | `#FAF8F3` | Elevated light surface |
| Clay | `#C86D45` | Emotional emphasis and intervention |
| Clay Dark | `#9E4E2F` | Accessible Clay text on light surfaces |
| Signal Green | `#3F8068` | Development and progress |
| Signal Green Dark | `#2C6652` | Accessible progress text/lines on light surfaces |
| Data Blue | `#68B7D6` | Information and focus |
| Data Blue Dark | `#22708F` | Accessible analytical text/lines on light surfaces |
| Warm Grey | `#B9B3A8` | Quiet neutral |
| Slate | `#657080` | Secondary light-surface text |
| Dark Surface | `#131A2B` | Dark cards and chapter transitions |
| Elevated Dark | `#192238` | Product and diagram surfaces |
| Light Border | `#D9D3C7` | Light dividers |
| Dark Border | `#29344A` | Dark dividers |
| Error | `#B33A3A` | True error state, distinct from Clay |

Ink and Canvas dominate. Clay identifies action or a decisive shift. Signal Green
means progress. Data Blue means information or analysis. Error red is reserved for
actual failure.

## Contrast

Primary text combinations are Ink on Canvas/Soft White and Soft White on Ink. Clay
Dark, Signal Green Dark, and Data Blue Dark are used when an accent must carry text on
a light surface. Data Blue is the visible focus ring. Accent colour is never the only
carrier of state; labels and structure remain present.

## Typography

- Display: Iowan Old Style, Palatino, Georgia fallback stack
- Interface/body: Avenir Next, Segoe UI, Helvetica, Arial fallback stack
- Technical labels: SFMono, Consolas, Liberation Mono, Menlo fallback stack

The display face supplies editorial character. The sans serif keeps body copy and the
product interface practical. Monospace labels are short and never used for long
paragraphs.

## Photography

- Preserve natural skin, field, and equipment colour.
- Use modest saturation control rather than one heavy filter.
- Prefer authentic action, measurement, and workbench imagery.
- Use Ink overlays only to support text or chapter transitions.
- Do not publish team photos with many identifiable minors.
- Do not imply partnerships through captions or naming.

## Technical diagrams

- Use HTML/CSS diagrams so text remains responsive and accessible.
- Data Blue shows information flow.
- Clay shows the key intervention.
- Signal Green shows a development outcome.
- Provide a descriptive heading and adjacent explanation.
- Never rely on colour alone.

## Product-interface guidance

Product surfaces use Soft White, restrained Ink navigation, thin neutral borders,
compact sans-serif type, and monospace labels. Editorial-scale display type should not
enter dense workflow interfaces.

Public product visuals must use synthetic data and identify themselves as
reconstructions.

## Incorrect use

Do not:

- stretch, rotate, outline, glow, or add a drop shadow to the logo;
- recolour the two primary forms arbitrarily;
- place the Clay form in error contexts;
- use every accent in one section without semantic need;
- use large blue-purple gradients, neon, or glass effects;
- place the mark inside a generic circle or shield;
- add sports equipment, military, cryptocurrency, sparkle, or betting motifs;
- reduce clear space or use the detailed horizontal lockup below its minimum size.

## Source references

Design tokens are defined in `app/globals.css` and `tailwind.config.ts`. The shared
React lockup is implemented in `components/logo.tsx`. Source SVG files are in
`public/brand/`.
