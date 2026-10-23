# Prompt 112: Newest Trading Desk events first

- Date: 2026-10-23
- Scope: design
- Goal: Show the most recent Live Trading Desk events at the top.

## Original user request

> can you sort the live trading desk events reverse time stamp

## Scope

The public Trade desk's display ordering and following behavior.

## Decisions

Sort by descending original event time, with descending exact receiver sequence
for ties. Following and Jump to latest target the top. Downward scrolling, wheel
and keyboard navigation pause following. Archive pagination keeps its existing
cursors. Synthetic playback reveals events chronologically, newest revealed first.

## Implementation

Updated the sort, scroll target, pause directions, replay slice and visible
ordering explanation. No dependencies, receiver contracts or financial records changed.

## Engineering impact

Keyboard and live-update behavior now match the newest-first reading direction.

## Files changed

The investment desk component and architecture guide.

## Documentation updated

Architecture records ordering, ties, following, pagination and replay behavior.

## Git diff summary

Two files changed: 10 insertions and 5 deletions.

## Verification

Node 24 type checking, ESLint and the standard Next.js webpack build passed.
Existing tutorial-navigation lint and Browserslist age warnings remain.
`git diff --check` passed. The unchanged dependency audit reports one previously
documented critical Next.js finding. Live release checks are recorded separately.

## Repository state after implementation commit

Clean main at `5afa8dc473c0b4449bdb70c51d7d780426b46dac`, one commit ahead of origin/main.

## Implementation commits

- `5afa8dc473c0b4449bdb70c51d7d780426b46dac` — Show newest Trading Desk events first.

## Archive commit

Record newest-first Trading Desk implementation

## Lessons learned

Feed order determines the follow target and the direction that pauses following.

## Follow-up ideas

None added.
