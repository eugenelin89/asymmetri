# Asymmetri visual identity

## Current authority: Graphite + Teal

The selected October 7 identity is Theme B from the local exploration at
`cc5998fc49fe0071c2d3c44a8ba462dba58a4c87` on
`design/dark-theme-exploration-20261007`. That branch remains historical evidence.
Production uses ordinary CSS tokens, without selectors, query switching, comparison
routes or review scripts. Earlier palette records are historical, not current authority.

Asymmetri is the umbrella over peer divisions Sports and Labs. Both use the same
graphite and teal system. Their names, content and circle/square hierarchy markers
supply differentiation. Motion retains its separate product teal and original imagery.
The asymmetric mark geometry, typography, layout, copy and product truth are unchanged.

## Palette and surface contexts

`app/globals.css` is the palette authority. Tailwind references its semantic tokens.

| Token | Value | Role |
| --- | --- | --- |
| `--graphite` | `#0C1111` | Main canvas, header, heroes and footer |
| `--graphite-raised` | `#141B1A` | Division panels and raised dark sections |
| `--graphite-soft` | `#1A2321` | Soft dark details and BotSquad video poster |
| `--on-dark` | `#F3F6F4` | Primary light text |
| `--on-dark-secondary` | `#A5B2AE` | Secondary text on dark surfaces |
| `--line-dark` | `#293633` | Dark surface dividers |
| `--light-surface` / `--light-raised` | `#F5F7F5` / `#FFFFFF` | Neutral reading surfaces |
| `--light-ink` / `--light-secondary` | `#101514` / `#4F605A` | Text on light surfaces |
| `--light-line` | `#C7D3CE` | Light surface dividers |
| `--brand-primary` | `#00A99D` | Primary accent, rules and dark-context actions |
| `--brand-bright` | `#29C7B9` | Dark-context links, hover and focus |
| `--brand-deep` / `--brand-surface` | `#00766F` / `#DDF4F0` | Reserved deep/soft brand colors; not broad page washes |
| `--brand-on-light` / `--brand-on-light-hover` | `#006D66` / `#005851` | Accessible light-context links and filled actions |
| `--motion-teal` / `--motion-mineral` | `#006B64` / `#E4EFEC` | Preserved Motion product identity |
| `--motion-text` / `--motion-line` | `#133B37` / `#BDD2CA` | Motion poster/type and dividers |

The default `--surface-*`, `--ink*`, `--line`, `--theme-*` and action aliases describe
dark contexts. Explicit light reading contexts reassign those aliases and declare
`color-scheme: light`. Division aliases share the umbrella palette; Motion tokens
are independent literals so future umbrella changes cannot silently recolor it.
The browser theme color in `site.metadata.themeColor` is `#0C1111`.

Teal is an accent. Home is a single graphite gateway with equal division panels.
Neutral light sections interrupt the graphite shell on Sports, Motion and About;
Privacy, Support and Tutorial retain light reading areas.
Labs and BotSquad are predominantly graphite. Keep pale teal limited to established
Motion areas, rather than adding institutional-looking teal washes. Motion's poster
keeps deep product teal. Dark/light transitions retain the selected palette.
Labs uses a brief open hero, one project-list section and a simple closing line with generous space; the removed
approach/principles panels are not replaced with decoration.

## Typography, hierarchy and interaction

Use the local Avenir Next system sans-serif stack. Headlines remain near 80px,
section headings near 48px, on the existing 76rem grid. Small labels use sentence
case. Keep underlined links, fine rules, restrained filled actions and native
Sports/Labs disclosure menus with direct overview/product links. The homepage's
peer division panels have equal emphasis under their shared umbrella connector.

Motion's family section retains Individual and Professional columns and explicit
status labels; Team entitlements remain subordinate to the one Team product.
At 700px the family becomes one reading column. Do not create empty product routes,
fabricated capabilities or simulated app interfaces to decorate the identity.

No remote fonts, UI kits, new animation or browser theme-switching code is needed.
Reduced motion removes smooth scrolling, transitions and hover movement.

## Accessibility

Use bright teal on dark surfaces and the deeper `--brand-on-light` on light ones.
Dark-context buttons use dark text on primary teal; light-context buttons use white
text on the deeper teal. Recheck rendered normal text at 4.5:1 and large text/focus
at 3:1. Never use bright teal as small text on a light background.

Focus uses a visible 3px outline appropriate to its surface; filled actions also
have a separating dark ring. Video posters, dark bars and footer keep bright focus.
Check effective viewport width and clipped descendants as well as page overflow.
Keep at least 44px targets, meaningful labels, underlines and DOM reading order.

## Product imagery and utility reading

All existing public asset bytes remain unchanged in this promotion, including
Motion icons, genuine screenshots, tutorial crops/originals, authentic Sports
photography, brand source variants, favicons and social exports. The rendered SVG
mark uses CSS for its accent; its geometry is unchanged. Retained social exports
and favicon files may show the preceding palette and are not current CSS authority.
See `ASSET_MANIFEST.md` for provenance and privacy boundaries.

The Sports pitching photograph retains its approved grade and owner-approved cap
logo/uniform lettering. Motion's packaged default windup PNG retains its original
illustration and palette. Explorer concepts stay explicitly synthetic, separate
from current app captures and evidence. Do not recolor screenshots or photographs.

Privacy and Support remain Motion resources with readable 70ch articles, 16–18px
body copy, modest headings and section navigation. The tutorial retains its exact
www canonical, hashes, source labels and original-image links. Its desktop module
index, mobile reading order, radio labels, print/no-JavaScript access and full
screenshot proportions remain unchanged. Physical setup illustrations retain
generic adult figures and do not imply calibration.

Video posters remain local typography. No third-party player loads until the user
chooses Load video; preserve Google disclosure, approved IDs, no autoplay, close
and focus restoration, and the external fallback. Product privacy behavior is
independent of the selected visual identity.
