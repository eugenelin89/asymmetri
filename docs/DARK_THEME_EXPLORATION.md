# Asymmetri local visual theme study

Date: October 7, 2026. Status: experimental, local only. Owner selection pending.

## Baseline and isolation

- Baseline tag: `website-visual-identity-update-2026-10-07`.
- Baseline SHA: `c35ed81cd71bcfa0a96fd510e74046cff1a92386`.
- The existing annotated production-release tag already marks current main. Its
  peeled remote target was verified, so no duplicate tag was created or moved.
- At initial setup, origin/main equalled this SHA and the primary checkout was
  clean. Recovery confirmed the same local/remote main and the existing design
  worktree; no unrelated work was changed.
- Branch: `design/dark-theme-exploration-20261007`, separate managed worktree.
- Production unchanged: **YES**. No SSH, deployment, hosted preview, main commit,
  merge, service restart, infrastructure edit or production asset change.
- Preservation checkpoint: `36be16902110ec4a48481f6345a7020f624aa9a1`
  (`Checkpoint dark theme exploration`), pushed immediately to
  `origin/design/dark-theme-exploration-20261007` before further browser work.
- Completion commit: `Finish dark theme screenshots and handoff`; its SHA and the
  implementation history are recorded in the [completion journal](prompts/038-design.md).
  Prompt journals follow in a separate documentation commit. The branch remains
  experimental: pushing it is preservation, not publication or a production release.

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

## Recovered validation evidence

These results were completed before the final checkpoint request. They were
retained rather than presented as newly rerun checks.

### Original exploration

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
  checked for dimensions and page coverage. Recovery subsequently found and repaired
  missing photograph pixels in the three Sports full-page exports; see below.
- Reduced-motion CSS removes smooth scrolling, transitions and animations in every
  theme. Rules were inspected; OS-level reduced-motion emulation was not performed.
  Existing player/tutorial behavior remains source-identical.

Browser matrix, HTTP parity and interaction receipts are also saved with the owner's
local screenshot delivery. No production release was performed.


### First recovery, before checkpoint

- Re-ran `npm run check`, `npm run build:next`, `npm run build`, and
  `npm audit --omit=dev`: passed. The same existing tutorial lint warning and
  Vinext/Browserslist notices remain; production audit reports zero vulnerabilities.
- Ran **81 additional rendered checks**, all three themes × all nine routes ×
  320, 768 and 1440 actual CSS pixels. No overflow, visible clipping, missing alt
  text, broken loaded images or measured text-contrast failures. Minimum: **5.12:1**.
  No browser warnings/errors in the verification tab.
- Repeated 320px keyboard checks in all themes: Enter and Space open menus;
  Tab reaches 48px menu links with visible 3px focus outlines; Escape closes and
  restores summary focus; outside clicks dismiss. These are inherited recovery
  results, not another matrix run during completion.
- Exercised desktop/mobile/full-page gallery selection and live theme/route changes,
  including the protected Tutorial page. Motion's light panels and original teal,
  BotSquad diagrams, captions, footer and utility readability were included in
  the route checks and visual review.

## Final checkpoint and completion checks

Only screenshots and documentation changed after the checkpoint. No application,
review-tool, theme CSS, dependency or build configuration changed. Accordingly,
full builds and the 162/81-case matrices were **not repeated**.

- Replaced only `cobalt-sports-full.jpg`, `teal-sports-full.jpg`, and
  `signal-sports-full.jpg`. All three are **1440 × 4789**, with the actual hero
  photograph, product icon, complete page width and footer visually confirmed.
  Fresh tabs resolved an intermittent browser-export omission despite loaded-image
  DOM status. No photograph was composited or recolored. The other 33 captures
  remain byte-identical to the checkpoint.
- Repository and delivery copies of all 36 screenshots match byte for byte.
- Short comparison smoke test: Home/Sports/Labs desktop selectors load all three
  themes; mobile loads 390px captures and disables the page selector; full-page
  mode loads all three corrected Sports files at 1440 × 4789.
- Live selectors render Cobalt/Home, Teal/Sports and Signal/Labs with the expected
  headings, frame URLs and matching full-window links. No console warnings/errors.
- `git diff --check`: passed. `docs/VISUAL_IDENTITY.md`, application sources,
  product facts, public assets and dependencies remain identical to the baseline.
- Production deployment performed: **NO**. Main merged: **NO**. Production service
  restarted: **NO**. Production source changed: **NO**. Owner decision: **pending**.

## Screenshot delivery

The repository's authoritative set is `docs/previews/dark-themes/`. The synchronized
owner delivery is `/Users/eugenelin/Desktop/Asymmetri/dark-theme-exploration-2026-10-07/`.
Files use `{cobalt,teal,signal}-{home,sports,labs,motion,botsquad}-{desktop,full}.jpg`,
plus each theme's `home-mobile.jpg` and three `baseline-*-desktop.jpg` references.
Browser matrices, interaction checks and the final smoke receipt remain in the
local delivery directory; no logs, caches or browser profiles are committed.
