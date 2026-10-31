# Prompt 179: Make CWRU running controls easier to read

- Date: 2026-10-31
- Scope: design
- Goal: Make the existing run action obvious with larger instructions on desktop and touch layouts.

## Original user request

> can the player run?

> not very clear... maybe need to make it more clear for player

> like make the words bigger

## Scope

CWRU welcome text, movement hint, touch Run button, Help and supporting documentation. Running speed/input behavior and other campuses are unchanged. The separately requested shared review/usage integration is prepared independently and is not part of this implementation.

## Decisions

Increased the desktop run hint from 9px to 17px and emphasized its Shift key on an opaque dark background. Added the same discovery cue to both welcome editions. The touch button now reads “Hold to RUN,” with an 18px action label and 88px width; its accessible name explains simultaneous directional input. Kept running as an existing held control. Adjusted welcome height and bottom control spacing to prevent overlap.

## Implementation

A prominent welcome card explains Shift plus WASD and touch Run plus an arrow. The in-game hint remains visible in walking views, with camera controls above it. Help separates Move and Run and explains releasing Shift to walk. The phone Run action has a contrasting light background.

## Engineering impact

Presentation and copy only; no dependency, movement, collision, persistence, privacy or theme changes. Existing panel dismissal returns focus to the canvas. Changes stay within the CWRU project. The live core remains intact until the next authorized CWRU rollout.

## Files changed

CWRU explorer JSX and CSS; its project README; a focused running-controls report. No shared site/package/Stanford/UBC hunk is staged. Original browser evidence is retained in the owner's local validation workspace, not added as public assets.

## Documentation updated

`docs/CWRU_RUN_CONTROLS_2026-10-31.md` records font/target sizes, responsive verification and pending release status. The project guide points to the new visible instructions.

## Git diff summary

4 files changed, 106 insertions and 14 deletions. These changes add the instruction card, larger key hint, touch styling, Help entry and validation report. This archive is excluded from its own summary.

## Verification

- Node 24.10.0 matches `.nvmrc`.
- `npm run check` passed TypeScript/ESLint with only the existing tutorial-navigation warning.
- Final Vinext and Next webpack builds passed; audit found zero vulnerabilities; diff whitespace check passed.
- Browser emulation at 1280×720, 820×1180 and 390×844 showed no horizontal overflow. Rendered styles measured the 17px desktop instruction, 18px mobile RUN and 88px target.
- Regular/Halloween welcome guidance was visible; regular copy cleared its footer and the desktop dock cleared the taller status strip. Help displayed Run separately, and closing it restored CANVAS focus. Final console-error list was empty. Viewport reset and task-owned preview stopped after validation.
- No new tests mirror this copy/style change. Existing movement logic is unchanged. Local emulation is not a physical-device certification or live-deployment claim.

## Repository state after implementation commit

Branch `main`, implementation `dae4d675e81244a4d76c76ffc35a1f51d1aba6e6`. Root's exact 704a9b3 checkout was frozen before main was explicitly released for 179. Stanford documentation was already committed; its new integration drafts and generated `next-env.d.ts` remain untouched. Main is pushed after this separate journal commit without force. No branch, worktree, PR or merge was created.

## Implementation commits

- `dae4d675e81244a4d76c76ffc35a1f51d1aba6e6` — fix(cwru): make running instructions larger and clearer

## Archive commit

`docs: archive CWRU running control clarity`

## Lessons learned

A control can work correctly and still be undiscoverable when its instruction is too small. Verify actual rendered size, contrast and neighboring controls across layouts. Keep shared release ordering explicit so small UI changes do not enter another campus's frozen artifact.

## Follow-up ideas

Ship this validated change with the separately prepared CWRU review/privacy integration after the shared backend handoff and exact-source release checks.
