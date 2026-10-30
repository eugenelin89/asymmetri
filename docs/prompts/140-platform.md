# Prompt 140: Surrey V0.4 final keyboard acceptance

- Date: 2026-10-30
- Scope: platform
- Goal: Complete accessible overlay acceptance before the authorized Living Surrey release.

## Original user request

> Inspect the current project, implement substantial playable improvements, validate them, and ship the strongest safe V0.4 release possible.

This continues the V0.4 brief recorded in journal139, including compact mobile
controls, keyboard access, preserved saves and guarded Linux deployment.

## Decisions and implementation

Final browser testing found that settings actions returned focus to the game
canvas. Keep focus inside active panels; disable perspective changes while Map or
Help pauses the simulation. Map and Help focus their dismissal button, constrain
Tab within the open overlay and close directly with Escape. Closing restores the
canvas focus through the existing overlay lifecycle.

## Engineering impact and files changed

Adventure.tsx owns the focus/keyboard boundary. MiniMap.tsx and ViewControls.tsx
focus their dismiss buttons. The release record includes the observed acceptance.
Four files changed,19 insertions and9 deletions. No simulation, save schema,
geographic data, dependency or unrelated product behavior changed.

## Verification

Production-browser settings retain focus; Map opens with Close map focused and
Escape closes it; Help opens with Got it focused, Tab stays inside and Escape
closes it. Canvas focus resumes and no console errors were recorded. TypeScript,
lint and Next/Vinext production builds pass, with the existing tutorial navigation
warning. Build prechecks retain44 passing Surrey tests. Diff whitespace is clean.
The earlier completed mission, migration, phone sizing and regression acceptance
remains recorded in journal139 and the release record.

## Repository state

The isolated feature branch advances approved main55cc153. Richmond and Vancouver
remain isolated while Surrey owns the bounded release window. Production remains
44654b3; the superseded55cc153 Linux artifact will not be activated. A new exact
candidate is required for these fixes. No server restart has occurred.

## Implementation commits

- `f1254e0` — Keep Surrey keyboard focus inside open game panels.

## Archive commit

Record Surrey V0.4 final keyboard acceptance

## Lessons learned and follow-up

Opening an overlay from a menu removes its triggering element; explicitly focus
the new overlay before relying on bubbling keyboard events. Complete exact Linux
candidate checks and protected-route verification before claiming deployment.
Physical phone multi-touch and sustained thermal acceptance remain outstanding.
