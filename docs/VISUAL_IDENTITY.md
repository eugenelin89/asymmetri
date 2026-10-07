# Asymmetri visual identity

## Identity

The existing asymmetric mark remains unchanged. The rendered lockup pairs it
with the public umbrella name, Asymmetri. The open, interrupted “A” uses unequal
forms to express asymmetry, leverage, motion, and balance without a literal
baseball symbol.

## Palette

The October 7 visual refinement replaces warm paper/orange with a cool mineral
umbrella and two related division palettes. It preserves the company architecture,
typography, authentic media, product facts and deliberate video loading.

| CSS token | Value | Role |
| --- | --- | --- |
| `--surface-base` | `#EEF3F2` | Mineral company canvas and article background |
| `--surface-raised` | `#F8FAF9` | Interior surfaces, diagram panels and readable light type |
| `--surface-muted` | `#E2EAE7` | Reserved subdued neutral surface |
| `--ink` | `#10201D` | Primary type and deep umbrella emphasis/footer |
| `--ink-secondary` | `#52615D` | Secondary text |
| `--ink-body` | `#354641` | Long-form body text |
| `--line` | `#CBD6D2` | Neutral dividers |
| `--brand-primary` / `--brand-deep` | `#007A70` / `#005D57` | Company actions, links and hover states |
| `--brand-bright` / `--brand-surface` | `#45C5B5` / `#DEEEEA` | Selection/dark-surface accents and soft company field |
| `--sports-primary` / `--sports-surface` / `--sports-deep` | `#006B64` / `#E4EFEC` / `#133B37` | Sports and Motion |
| `--labs-primary` / `--labs-surface` / `--labs-deep` | `#35465E` / `#E8EDF3` / `#202C3D` | Labs and BotSquad |
| `--focus` | `#267D9F` | Keyboard focus |

Division scopes assign `--theme-primary`, `--theme-deep`, `--theme-surface` and
`--theme-line` to shared controls and components. The header retains the umbrella
identity on every route. Motion tokens alias Sports, preserving `#006B64`.
Tailwind colors reference these CSS tokens rather than a second literal palette.
The browser theme color lives in `site.metadata.themeColor`; static SVG social
sources and the SVG favicon have matching explicit export colors.

Orange is retired from active page styles, the rendered mark, SVG favicon and
current social previews. Historical source logos and raster icon fallbacks retain
their bytes and may retain their original orange; these are preservation assets,
not a second company action color. Do not recolor genuine screenshots or photos.

## Typography and layout

Display and body use the local Avenir Next system sans-serif stack. Headlines
use moderate weight and a maximum near 80px, with section headings near 48px.
The 76rem reading grid gives pages quieter proportions. Paragraphs use familiar
sentence structure, comfortable line spacing and restrained dark-gray text.
Small section labels use sentence case instead of tracked uppercase.

Light, solid mineral surfaces and near-white interiors dominate. Product panels
use teal and slate fields with the same proportions and type. Underlined links,
filled division actions and fine rules connect the system. The header uses the
mineral background and established mark geometry with a teal accent. Deep green
anchors the shared-thinking section and footer; BotSquad uses deep slate for its
review section and poster. Avoid excessive alternating fields. Keep the local font stack; no remote fonts, fabricated
handwriting, stock photography, fake testimonials or invented product screens.
Animation remains limited to small existing hover responses and is removed for
reduced motion.

## Utility pages

Privacy and Support reuse the system font, mineral/ink palette, header, footer and
focus rings. Their article measure is capped at 70ch, body text scales from 16 to
18px, and modest headings replace marketing hero typography. Underlined links
and a section index support reading and keyboard navigation. Footer links stay
secondary to the marketing navigation. No new image or visual asset is used.

## Photography and interface imagery

The Sports page renders the preserved authentic pitching-delivery photograph in its hero.
It uses a restrained, slightly desaturated grade. Its owner-approved cap logo
and uniform lettering remain visible without localized softening. The approved
Motion pitcher-family windup icon appears in the product introduction and
product hero. Two Explorer design concepts on Motion are explicitly labelled synthetic
and not current app captures; their mock data is never presented as evidence. The separate tutorial includes
authorized app captures and original instructional imagery described below. Future additions must earn a distinct narrative role and remain within the privacy and
evidence rules in `docs/ASSET_MANIFEST.md`.

## Accessibility

Ink/mineral and near-white/deep ink are primary pairs. Measured WCAG ratios:
primary ink on mineral 15.03:1; company teal on mineral 4.66:1; near-white on
company teal 4.99:1; Sports teal on its field 5.43:1; Labs slate on its field
8.15:1. Recheck actual rendered pairs when changing tokens; normal text requires
4.5:1, large text and focus indicators 3:1. Bright teal is reserved for dark
surfaces and selection with dark ink, never small text on a light background.

The blue ring is used on light surfaces; bright teal marks focus on the dark
Sports bar, video posters, shared-thinking sections and footer. Links retain
underlines and controls have at least 44px targets. Text labels, equal hierarchy
and circle/square markers distinguish the divisions beyond color. Mobile order
matches reading order. Reduced motion removes smooth scrolling, hover translation
and transitions. No additional animation or client JavaScript is introduced.

## Motion product presentation

Keep the Asymmetri header, typography, Sports teal calls to action and closing
principle. Motion uses the Sports palette through `--motion-teal`,
`--motion-mineral`, `--motion-text` and `--motion-line`. The hero has a soft teal
field and near-white icon panel; the workflow and evidence chain remain intact. The icon retains
its original illustration and palette; CSS supplies corner masking only. Use the
packaged default PNG, not the historical A Release SVG. The mineral-white pitcher
and asymmetric teal arc are illustrative identity, not a coaching diagram.

The product page uses a light typographic hero and compact icon panel, numbered workflow rows,
a semantic evidence-chain ordered list, and divided history/limits prose.
The chain has six columns on large screens, three on tablet and a vertical
sequence on mobile. It contains no fabricated numerical result or app interface.
The existing small-screen header accommodates four links without a menu script.
Reduced motion removes both transitions and hover translation.

The existing focus blue is retained and checked against the new light and deep
surfaces. Focus must not be hidden by sticky navigation or viewport clipping.


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


## Company, division and product hierarchy

The homepage retains its asymmetric-advantage positioning on mineral. The
adjacent semantic hierarchy uses equal teal/Sports and slate/Labs panels under
one shared rule, each with direct Motion/BotSquad access. The fine connectors
make their peer relationship explicit. On tablets they sit below the headline;
on narrow mobile they stack in the same Sports-then-Labs order. Product panels retain the Motion icon/evidence capture
and BotSquad synthetic handoff. The authentic photo remains on Sports.

The shared Motion family section uses two open columns with rules: Individual
contains two products; Professional contains one Team product with subordinate
entitlement rows. Explicit textual status labels accompany each product. At 700px
it becomes one reading column. No empty product routes or simulated interfaces.

Sports and Labs keep native disclosure menus with 44px summary targets and
explicit overview/product links. Their panels remain within narrow viewports.
Labs evolves the previous Work split hero and ordered approach; About preserves
the founder narrative. Motion Notes/Study/Compare details use the existing type
and divided prose styles. All public copy and status facts remain in `site.ts`.

Social images keep the existing 1200×630 scale and local type with updated fields: umbrella
Sports/Labs hierarchy on Home/About, experimental BotSquad on Labs, and retained
Sports typography/mark geometry in deep green and bright teal. The Sports social
source is vector artwork, not a photograph. No external font,
stock art or new public photo. See the asset manifest.

Video posters remain compact local typography. Loading, Google disclosure,
external fallback, focus restoration and privacy boundaries are unchanged.
