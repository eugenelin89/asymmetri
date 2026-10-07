# Asymmetri local visual theme study

Date: October 7, 2026. Status: experimental, local only. Owner selection pending.

## Baseline and isolation

- Baseline tag: `website-visual-identity-update-2026-10-07`.
- Baseline SHA: `c35ed81cd71bcfa0a96fd510e74046cff1a92386`.
- The existing annotated production-release tag already marks current main. Its
  peeled remote target was verified, so no duplicate tag was created or moved.
- Latest origin/main equals this SHA. The primary checkout was clean, with no
  untracked files; no concurrent active website task or other worktree existed.
- Branch: `design/dark-theme-exploration-20261007`, separate managed worktree.
- Production unchanged: **YES**. No SSH, deployment, hosted preview, main commit,
  merge, service restart, infrastructure edit or production asset change.
- Preservation: two local commits, implementation followed by prompt journal.
  The experimental branch is intentionally not pushed. The baseline tag is already
  preserved on origin. No additional user choice is required to review the themes.

## Open the study

From the experimental worktree, after following `.nvmrc` and `npm ci`:

```bash
npm run build:next
node exploration/review.mjs
```

The current task leaves this server running. Open <http://127.0.0.1:4310> for a
three-column screenshot comparison, page/capture selector and live theme viewer.
The live viewer also includes About, Privacy, Support and Tutorial. Open a full
window to judge your actual screen size. No browser state is saved.

| Option | Homepage | Sports | Labs |
| --- | --- | --- | --- |
| A / Cobalt | <http://127.0.0.1:4311/> | <http://127.0.0.1:4311/sports> | <http://127.0.0.1:4311/labs> |
| B / Teal | <http://127.0.0.1:4312/> | <http://127.0.0.1:4312/sports> | <http://127.0.0.1:4312/labs> |
| C / Signal | <http://127.0.0.1:4313/> | <http://127.0.0.1:4313/sports> | <http://127.0.0.1:4313/labs> |
| Current baseline | <http://127.0.0.1:4314/> | <http://127.0.0.1:4314/sports> | <http://127.0.0.1:4314/labs> |

Append `/motion`, `/botsquad`, `/about`, `/privacy`, `/support` or `/tutorial` to
any theme origin. Theme identity follows normal navigation by port. Reload after
editing CSS. Stop the review tool with Ctrl+C. Ports 4310–4314 are loopback only.

## A — Graphite + Cobalt

Clean, premium, technical and energetic. Base `#0D1113`, raised `#151A1D`, soft
`#1B2124`, off-white `#F6F6F3`, main text `#F4F5F2`, accent `#315CFF`.
Accessible dark-surface links use `#A1B4FF`; light-surface links use `#193BB8`.

The clearest independent umbrella identity. Cobalt actions and short rules connect
Sports and Labs; authentic photography and diagrams distinguish the divisions.
Light Motion panels retain original teal artwork. Its weakness is that blue is
familiar in technology; the existing typography, composition and evidence need to
carry the distinctiveness. Bright `#4771FF` remains an accent token rather than
white small-text button fill; a deeper `#264AD6` hover preserves contrast.

Screenshots: [`cobalt-home-desktop.jpg`](previews/dark-themes/cobalt-home-desktop.jpg),
[`cobalt-sports-desktop.jpg`](previews/dark-themes/cobalt-sports-desktop.jpg),
[`cobalt-labs-desktop.jpg`](previews/dark-themes/cobalt-labs-desktop.jpg).
Also included: Motion/BotSquad desktop, five full pages, and homepage mobile.

## B — Graphite + Teal

Precise, scientific and connected to Motion. Base `#0C1111`, raised `#141B1A`,
soft `#1A2321`, light `#F5F7F5`, main text `#F3F6F4`, accent `#00A99D`.
Dark-surface links and hover use `#29C7B9`; readable light-surface teal is `#006D66`.

The most natural evolution of the existing product lineage. Dark graphite prevents
teal from becoming a pale institutional wash. Buttons on dark surfaces use dark
text for accessible contrast; actions on light surfaces use deep teal and white.
The weakness is less visual separation between Asymmetri and Motion, and a less
pronounced departure from the prior identity.

Screenshots: [`teal-home-desktop.jpg`](previews/dark-themes/teal-home-desktop.jpg),
[`teal-sports-desktop.jpg`](previews/dark-themes/teal-sports-desktop.jpg),
[`teal-labs-desktop.jpg`](previews/dark-themes/teal-labs-desktop.jpg).
Also included: Motion/BotSquad desktop, five full pages, and homepage mobile.

## C — Graphite + Signal

Restrained, editorial and distinctive. Base `#0B0D0F`, raised `#14171A`, soft
`#1C2024`, off-white `#F7F7F4`, main text `#F5F5F2`, signal `#FF4D3D`.
Most actions and links remain neutral. Red appears in the logo accent, small
arrows/nodes and short interrupted rules; lighter `#FF796D` is used on dark surfaces.

The strongest photographic contrast and least dependence on colored panels. The
neutral hierarchy makes red punctuation rather than a page color. Its weakness is
a more austere technical experience, with less color guidance through Labs. The
90/8/2 brief is treated as a direction for restraint, not a measured pixel ratio;
Motion's preserved teal product context remains an intentional exception.

Screenshots: [`signal-home-desktop.jpg`](previews/dark-themes/signal-home-desktop.jpg),
[`signal-sports-desktop.jpg`](previews/dark-themes/signal-sports-desktop.jpg),
[`signal-labs-desktop.jpg`](previews/dark-themes/signal-labs-desktop.jpg).
Also included: Motion/BotSquad desktop, five full pages, and homepage mobile.

## Recommendation

**A / Graphite + Cobalt.** It gives the umbrella a recognizable accent without
absorbing Motion's teal identity, and works coherently across photography and
technical diagrams. C is the strongest alternative if restraint and photographic
presence matter more than a prominent brand accent. B is the continuity choice.
No theme is selected automatically. A2 was omitted to keep the comparison focused
on the three requested directions.

## Preservation and implementation

All application sources, public assets, content, routes, metadata, product claims,
font stacks, responsive grids and player/tutorial components are unchanged.
`exploration/themes/shared.css` reassigns existing semantic tokens and supplies
mixed-surface contexts; the three small palette files define the differences.
A fine offset rule, shared division borders and restrained diagram nodes extend
existing graphic vocabulary. No new animation, font, dependency or public image.

The standalone review server injects only a stylesheet into normal theme HTML.
The comparison page never enters the app sitemap or metadata. Source scans of
both build outputs find no experimental stylesheet reference or theme token.
Deleting `exploration/` and its review documentation/captures removes the experiment;
there is no production feature flag or application component to untangle.
A future chosen theme should be deliberately integrated as a separate owner-approved
implementation, not by deploying this review tool or merging the whole branch.

## Verification

- Node 24.10.0 matches `.nvmrc` major 24; nvm is unavailable. Unchanged lockfile
  installed with `npm ci`; no dependency changes or audit fix.
- `npm run check`: pass, one pre-existing tutorial navigation lint warning.
- `npm run build:next`: pass, all nine pages statically rendered.
- `npm run build`: pass, retained Vinext/Cloudflare output. Existing stale
  Browserslist and route-classification notices remain.
- `npm audit --omit=dev`: zero production vulnerabilities. `git diff --check`: pass.
- 162 rendered checks: three themes × nine pages × 320, 390, 768, 1024, 1440,
  1920 effective CSS pixels. No document overflow, visible clipped descendants,
  missing alt text, broken loaded images or measured text-contrast failures.
  Minimum measured text contrast: **5.12:1**. This is a targeted rendered audit,
  not a claim of complete WCAG certification.
- At 320px, all themes pass Enter/Space disclosure opening, Tab to 48px menu links,
  visible focus, Escape close/focus restoration, exclusive menus and outside-click
  dismissal. Client navigation back from About preserves the theme stylesheet.
- 33 HTTP comparisons: nine pages plus sitemap/robots in three themes exactly match
  the unmodified local baseline after removing the single stylesheet link. This
  preserves copy, IDs, canonical values, original-image URLs, links and initial
  server content for no-JavaScript reading.
- Review origins carry `noindex, nofollow`, reject non-local Host headers, and bind
  loopback. The unmodified Next server returns 404 for review-only endpoints.
- Normal preview adds no JavaScript, storage, cookies or tracker. Optional capture
  mode eagerly loads existing local images only; videos still require activation.
- Motion media, original tutorial assets, product status and protected route contents
  are byte-identical to baseline. No new public copy requires a new product claim.
- Responsive screenshots: 15 desktop at 1440×1000, 15 full pages at 1440px wide,
  three homepage mobile at 390×844, three baseline desktop. Full-page captures were
  checked for complete image loading and far-right/footer coverage.
- Reduced-motion rules remove smooth scrolling, transitions and animations in every
  theme. Existing player/tutorial behavior remains source-identical; see additional
  interaction checks in the completion receipt for exercised actions.

Browser matrix, HTTP parity and interaction receipts are also saved with the owner's
local screenshot delivery. No production release was performed.
