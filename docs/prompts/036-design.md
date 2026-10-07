# Prompt 036: Local dark visual theme exploration

- Date: 2026-10-07
- Scope: design
- Goal: Compare three coherent visual alternatives on the unchanged current website.

## Original user request

> Create several **local-only visual theme prototypes** for the current Asymmetri.co website so the owner can compare them before choosing a new production visual identity.

The large request called for Graphite + Cobalt, Graphite + Teal and Graphite +
Signal using the same current content, company hierarchy, layouts, fonts, approved
media, routes and product status. It asked for an immutable baseline, an isolated
design branch/worktree, local switching, consistent desktop/mobile captures,
responsive/accessibility checks, commits, and a recommendation without selection
or deployment. It explicitly prohibited production changes and merging to main.

## Scope

Three themes across all current pages, local comparison tooling, 36 captures and
review documentation. Optional A2 was omitted to keep the core comparison focused.
No new product claims, assets, architecture, fonts, dependencies or public routes.

## Decisions

Reused the existing annotated production tag at exact current main rather than
creating another. The explicit experimental branch/worktree request overrides the
repository's normal main-only workflow. One shared semantic stylesheet and three
palettes preserve layout and Motion's teal product identity. A standalone local
proxy keeps the comparison outside both production build entry points. Cobalt is
recommended for umbrella separation; the owner still chooses.

## Implementation

Recovered and completed the three themes, using ports 4311–4313, comparison 4310
and unchanged baseline 4314. Dark framing alternates with readable light sections;
Labs/BotSquad stay more predominantly dark. Captures cover Home/Sports/Labs/Motion/
BotSquad desktop/full-page, mobile home and baseline references.

## Engineering impact

Application routes, content, metadata, public assets, typography, product truth,
privacy behavior and dependencies remain byte-identical to the tagged baseline.
The loopback-only review tool adds no production import, visitor storage or hosted
preview. No production access, deployment, merge, service restart or tag movement
occurred. Production visual-identity authority remains unchanged.

## Files changed

The experiment comprises eight standalone review/theme files, 36 intentional JPEG
captures under the preview documentation, and onboarding/architecture/development/
testing/asset notes. Completion changes only the three Sports full-page captures
and two documentation files. No runtime junk or unrelated work is committed.

## Documentation updated

`DARK_THEME_EXPLORATION.md` holds palettes, comparison URLs, tradeoffs, startup,
validation provenance and pending owner choice. README and the architecture, local
development, testing and asset guides describe only the isolated experiment.

## Git diff summary

Checkpoint: 50 files, 672 insertions, including 36 binary images.
Completion: five files, 77 insertions and 10 deletions, including three corrected
binary captures. Cumulative implementation: 50 files and 739 insertions relative
to the baseline. These totals exclude the separate prompt journals.

## Verification

Original evidence: successful check/Next/Vinext builds, zero production audit
vulnerabilities, 162 rendered cases and 33 HTTP parity comparisons. First recovery:
check/Next/Vinext/audit passed again; 81 cases across nine routes, three themes and
320/768/1440 CSS pixels found no overflow, visible clipping, missing alt text,
broken loaded images or text-contrast failures; minimum measured contrast 5.12:1.
Keyboard/menu/focus checks passed in all themes. One existing tutorial lint warning
and existing Vinext/Browserslist notices remain. Reduced-motion rules were inspected,
not OS-emulated. See the handoff for bounded claims and exact coverage.

Final completion preserved those results rather than rerunning the broad matrices
or builds. Gallery desktop/mobile/full-page and live theme/route smoke checks passed
without browser warnings/errors. All three corrected Sports captures show the hero
photograph and complete footer at 1440×4789. All 36 delivery copies match. Other 33
captures remain unchanged. `git diff --check` passed; main/baseline and protected
source trees remained unchanged.

## Repository state after implementation commit

Branch: `design/dark-theme-exploration-20261007`, isolated managed worktree.
Implementation HEAD: `3d5459c8f25ca2747b86035344871864cd58c14d`, clean before journals.
Checkpoint already pushed to origin; completion and journal are to be pushed
normally together. Main and baseline remain `c35ed81cd71bcfa0a96fd510e74046cff1a92386`.
Tag: `website-visual-identity-update-2026-10-07`.

## Implementation commits

- `36be16902110ec4a48481f6345a7020f624aa9a1` — Checkpoint dark theme exploration.
- `3d5459c8f25ca2747b86035344871864cd58c14d` — Finish dark theme screenshots and handoff.

## Archive commit

`docs: archive dark theme exploration and recovery requests`

## Lessons learned

Checkpoint recoverable work before further polish. Loaded-image DOM status does not
prove the exported screenshot contains the image: inspect saved pixels and actual
viewport dimensions. Fresh tabs and explicit viewport sizing resolved the Sports
export defect. Keep broad validation evidence separate from final smoke checks.

## Follow-up ideas

Owner selection remains pending. Any production implementation is a separate,
explicitly authorized task; do not merge or deploy the review branch automatically.
