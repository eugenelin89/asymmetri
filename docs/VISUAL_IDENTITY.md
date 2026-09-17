# Asymmetri Labs visual identity

## Identity

The existing asymmetric mark remains unchanged. The rendered lockup pairs it
with the public name, Asymmetri Labs. The open, interrupted “A” uses unequal
forms to express asymmetry, leverage, motion, and balance without a literal
baseball symbol.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| Ink | `#0E1110` | Dominant dark surface and text |
| Ink Soft | `#171D1A` | Secondary dark surface |
| Paper | `#F5F6F2` | Primary light surface |
| White | `#FFFFFF` | High-contrast type and closing surface |
| Accent Orange | `#F47743` | Primary action and limited emphasis |
| Accent Dark | `#A43C1A` | Accessible accent text on light surfaces |
| Focus Blue | `#267D9F` | Visible keyboard focus |

Near-black and white dominate. Orange remains the company brand accent.
Motion-specific teal/mineral cues are
nested inside product sections; blue is reserved for keyboard focus.

## Typography and layout

Display and body type both use a bold modern system sans-serif stack led by
Avenir Next. Large concise headlines, tight hierarchy, thin dividers, generous
space, and a restrained technical grid create the startup-oriented presentation.

Supporting typography uses a fluid scale rather than fixed small labels. On wide
screens, navigation and button labels settle near 15 to 16 pixels, eyebrow labels
near 13 to 14 pixels, primary supporting copy near 20 to 21 pixels, and footer
text near 14 to 15 pixels. Mobile copy remains compact but does not fall below a
practical reading size. The closing section gives its supporting column more
width and uses a slightly smaller display maximum so the headline and action read
as one composition.

The system avoids serif editorial styling, floating statistics, badges, pill
collections, fake interfaces, decorative research graphics, and visual clutter.
Motion is limited to small hover responses and removed when reduced motion is
requested.

## Utility pages

Privacy and Support reuse the system font, paper/ink palette, header, footer and
focus rings. Their article measure is capped at 70ch, body text scales from 16 to
18px, and modest headings replace marketing hero typography. Underlined links
and a section index support reading and keyboard navigation. Footer links stay
secondary to the marketing navigation. No new image or visual asset is used.

## Photography and interface imagery

The public site renders one authentic pitching-delivery photograph in the hero.
It uses a restrained, slightly desaturated grade. Its owner-approved cap logo
and uniform lettering remain visible without localized softening. The approved
Motion pitcher-family windup icon appears in the product introduction and
product hero. No research imagery or fake metric is rendered. The separate tutorial includes
authorized app captures and original instructional imagery described below. Future additions must earn a distinct narrative role and remain within the privacy and
evidence rules in `docs/ASSET_MANIFEST.md`.

## Accessibility

Ink/Paper and White/Ink are the primary contrast pairs. Accent Dark carries small
text on light backgrounds, and Focus Blue supplies a visible focus ring.
Controls remain touch-friendly, content does not depend on colour or hover,
mobile ordering matches reading order, and animation respects
`prefers-reduced-motion`.

## Motion product presentation

Keep the Labs header, typography, orange calls to action, paper/ink surfaces and
closing principle. Motion uses `--motion-teal` (#006B64), `--motion-mineral`
(#E8EFED), `--motion-text` (#152A27) and `--motion-line` (#CFDAD6). The icon retains
its original illustration and palette; CSS supplies corner masking only. Use the
packaged default PNG, not the historical A Release SVG. The mineral-white pitcher
and asymmetric teal arc are illustrative identity, not a coaching diagram.

The product page uses a typographic hero and icon panel, numbered workflow rows,
a semantic evidence-chain ordered list, and divided history/limits prose.
The chain has six columns on large screens, three on tablet and a vertical
sequence on mobile. It contains no fabricated numerical result or app interface.
The existing small-screen header accommodates four links without a menu script.
Reduced motion removes both transitions and hover translation.

Focus Blue is 4.65:1 against white and 4.08:1 against ink. The September 16
product pass darkened the existing blue ring for visibility on both surfaces.


## Tutorial reading system

The tutorial keeps the existing header/footer, font, focus and Motion color tokens.
A modest mineral hero introduces the task. Numbered modules and thin dividers carry
the hierarchy; no decorative dashboards or fabricated app frames are used. Desktop
pairs prose with screenshots and uses a sticky module index. At 700px and below,
the index becomes two columns and all content becomes one reading column. Body copy
is 16px; controls have at least 44px targets. Radio labels wrap rather than overflow.
At tablet widths screenshots follow their associated prose. Figures keep their full
proportions, captions and source labels; original files open in a new tab.

The physical setup artwork is flat editorial teal/mineral illustration with generic
adult figures and abstract screens. Guide geometry is a rectangle plus a dashed
centre line, following source proportions; it must never imply calibration.
Screenshot crops retain original UI/evidence pixels. Do not recolor, replace labels,
change measurements, trace a fake screen or disguise a generated asset as a capture.
All instructions are also readable text. Native details and anchors, focus rings,
reduced motion and no-JavaScript access are part of the design.
