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
The [release receipt](../MYMUSIC_PLAYBACK_MODES_RELEASE_2026-11-15.md) captures
activation, retained recovery and measured cleanup.

## Git diff summary

Implementation: 9 files changed, 109 insertions and 14 deletions. Release
documentation: 2 files changed, 120 insertions and 2 deletions. Journal/log changes
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

One canonical checkout; local dependencies/builds were recreated for this task,
then removed after preview shutdown and tracked/open-handle checks. Opening Mac
free space was 63,884,795,904 bytes. Local cleanup recovered 1,753,493,504 bytes
across validation-output and verified-transfer cleanup windows. Exact before/after
and du estimates are in the release receipt.

Production opening free space was 7,518,990,336 bytes. A verified lossless archive
preserves one older inactive runtime; the serving runtime and immediate rollback
remained complete throughout. Gzip integrity, full tar comparison and checksum
preceded content retirement; root removed the verified empty parent after its
root-owned parent prevented application-owner rmdir. No recovery data was lost.
Post-activation cleanup recovered 256,987,136 bytes; final production free space
was 7,049,035,776 bytes. Retained archive identities and restoration instructions
are recorded in the release receipt. No new cleanup blocker arose.

## Repository state after implementation commit

Main implementation `a122f41` and preparation journal `e476ee0` were pushed
together. That exact source passed Linux CI and was activated at
2026-11-15T01:44:48.758993Z, build `Z1m4fuMWS4SYDNJKPZb6U`. Release
documentation is committed at `28f2d5b`; the tree was clean before this final
journal/interaction update.

## Implementation commits

- `a122f41` — Add shuffle and repeat modes to My Music.
- `28f2d5b` — Record My Music playback mode deployment and retention.

## Archive commit

Preparation: `docs: archive My Music playback mode implementation` (`e476ee0`).

Final: `docs: finalize My Music playback mode journal`

## Lessons learned

Keep queue order separate from track identity so shuffle changes do not reload
playing audio. Native single-track looping and explicit queue wrapping keep the
control behavior simple while failed-track exclusion prevents repeat error loops.

## Follow-up ideas

None beyond the requested release.

## Final release outcome

Shuffle, Repeat 1 and Repeat All are live on both hosts. The public browser loaded
the 27-track acceptance queue and verified mode-state cycling. The independent
immediate rollback passed its startup/route/bundle check. Protected pages, original
assets, configuration, persistent stores and peer services were preserved. Current
process logs showed zero errors/warnings after cleanup.
