# Prompt 135: Complete Surrey landscape touch layout

- Date: 2026-10-30
- Scope: design
- Goal: Keep the same usable touch controls in short landscape and portrait views.

## Original user request

> I find on the iPhone, the main playing view is blocked by multiple sub views...

Continuation of the V0.3 acceptance and release requested in journal 134.

## Scope

One Surrey CSS media-query refinement and updated performance acceptance detail.

## Decisions

The compact HUD already activated in short landscape windows, but the inherited
directional grid styles only applied to narrow widths or coarse pointers. Extend
that grid's media condition to the same short landscape case. This makes layout
consistent with the displayed touch instructions, including desktop emulation.

## Implementation

Directional arrows retain their two-row 46 px grid and edge placement when the
window is short and wide. No game state, data snapshot or desktop-wide layout
changes. The release record includes the final repeated-switch resource sample.

## Engineering impact

CSS-only runtime change. Existing actual coarse-pointer phone styles are retained;
short-wide fine-pointer views now use the same complete control layout.

## Files changed

Surrey module CSS and V0.3 release acceptance record.

## Documentation updated

The release record reports 82 geometries/29 textures after warm-up and bounded
36–60 fps switching samples on a shared desktop GPU, without a phone endurance
claim.

## Git diff summary

Two files, five insertions and two deletions: one media condition and additional
measured acceptance context.

## Verification

Production build, its 35-test Surrey prebuild, and the final landscape browser
layout were checked before this journal was committed. The 844×390 CSS viewport
shows the four directional controls at the lower-left edge with full-size targets.
No horizontal overflow. Other suites passed as recorded in journal 134.

## Repository state after implementation commit

Dedicated `codex/surrey-adventure-v03` branch, continuing the reserved release
window. Implementation `0cd0817` passed verification; only this journal remained untracked.

## Implementation commits

- `0cd0817` — Keep Surrey touch controls usable in short landscape views.

## Archive commit

Record Surrey landscape acceptance journal

## Lessons learned

Responsive control visibility and control layout need the same breakpoint logic;
checking only whether a button exists misses zero-position layout failures.

## Follow-up ideas

Physical phone touch and endurance testing remains separate.
