# Prompt 217: My Music shuffle and repeat modes

- Date: 2026-11-14 (Vancouver; November 15 UTC)
- Scope: platform and deployment
- Goal: Add shuffle, Repeat 1 and Repeat All, and deploy immediately.

## Original user request

> Add a shuffle function, repeat 1 function, and repeat all function. Deploy at once.

## Scope

Playback controls and queue behavior on `/mymusic`. The existing personal-use,
minimal-interface and immediate-deployment preferences remain applicable.
No additional account, persistence, dependency, asset or navigation feature.

## Decisions

Shuffle randomizes the visible queue without interrupting the current track;
disabling it restores folder/name order. Repeat cycles Off → 1 → All → Off.
Repeat 1 uses native audio looping. Repeat All wraps the current queue, including
shuffle order. Manual next/previous follow the queue and bypass Repeat 1. Failed
tracks remain excluded from automatic playback until retried or a new folder is
loaded; an all-failed queue stops rather than looping endlessly.

## Implementation

Two accessible buttons with explicit labels and pressed states, a small playback
order helper, and updated queue rendering. Modes remain in the current tab and
continue across folder loads. Public folder listing and audio transport are unchanged.

## Engineering impact

Client behavior only; no backend, runtime configuration, dependency or asset changes.
Focus styling and wrapped touch controls reuse existing tokens.

## Files changed

Player component/styles, playback-order helper, centralized help, focused regression
cases and README/architecture/content/testing documentation.

## Documentation updated

The guides document shuffle ordering, repeat cycling and failed-track behavior.
The release receipt will capture activation, retained recovery and measured cleanup.

## Git diff summary

Implementation: 9 files changed, 109 insertions and 14 deletions. Journal/log changes
are excluded.

## Verification

Node 24.10.0 matches `.nvmrc`; nvm remains unavailable. Locked install, TypeScript,
ESLint, Next webpack and Vinext builds, eight focused synthetic tests and production
audit passed. One pre-existing tutorial lint warning remains; audit reports zero
production vulnerabilities. The broad prebuild suite was not repeated locally;
the existing Linux CI workflow remains the production build path. Browser checking
was limited to the requested modes using the previously authorized acceptance folder.
Its URL and all filenames remain excluded from public records.

## Storage and release preparation

One canonical checkout; local dependencies/builds were absent and recreated for this
task. Production still serves source `b0b40d6`, build `K5uU0ihPv4IdxvodDcxwn`.
The documented lossless archive procedure is being used for one older inactive
rollback to provide candidate capacity while preserving the serving runtime and
complete immediate rollback. Exact checksums, sizes and before/after measurements
will be captured in the completed release receipt. Reproducible local outputs and
the CI transfer are cleanup candidates after their active use ends.

## Repository state after implementation commit

Main at `a122f41`; clean before this preparation journal. Implementation and archive
are pushed together; deployment waits for the exact-source Linux artifact.

## Implementation commits

- `a122f41` — Add shuffle and repeat modes to My Music.

## Archive commit

`docs: archive My Music playback mode implementation`

## Lessons learned

Keep queue order separate from track identity so shuffle changes do not reload
playing audio. Native single-track looping and explicit queue wrapping keep the
control behavior simple while failed-track exclusion prevents repeat error loops.

## Follow-up ideas

None beyond the requested release.
