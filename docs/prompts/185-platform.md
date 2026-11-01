# Prompt 185: iPhone Silent Mode audio playback

- Date: 2026-10-31 (Vancouver)
- Scope: platform
- Goal: Allow explicitly enabled UBC Halloween sound to use supported iPhone media playback while preserving mute and lifecycle controls.

## Original user request

> any way to have sound in silent mode?

> make sure to message the other thread for Stanford and Case Western to do the same

> deploy sound fix now!

The user confirmed the existing sound worked after disabling iPhone Silent Mode. Earlier instructions authorize deployment and require each campus thread to own its own implementation.

## Scope and decisions

UBC alone changes in this implementation. Stanford and CWRU received the same requirement and lifecycle findings; their owners implement and validate their own audio. The already accepted privacy-panel removal release remains independent. The latest request prioritizes the first passing UBC audio artifact without waiting for other campus audio changes.

Use the optional Audio Session playback category documented by WebKit for iOS 17 and later. Detect the API directly and retain ordinary Web Audio behavior when it is absent or throws. Capture and restore the prior category only while owned; do not replace another media owner's choice. No silent media loop, microphone permission, new asset or dependency is introduced.

## Implementation

An explicit entry or sound-enable gesture records playback intent and claims the optional playback session before resuming AudioContext. Delayed first-scene loading and stale muted telemetry do not prematurely discard that intent. Actual mute, zero volume, edition-off, hidden state and disposal release the owned category. Rapid enable/cancel releases an otherwise silent lease through the existing bounded fade/suspend timer. Regular campus entry no longer initializes Halloween audio.

## Engineering impact

Existing volume, cue limits, background suspension and cleanup remain intact. This changes audio routing only; visitor recording, reviews, profiles, campus geometry and other campus source are unchanged. Unsupported browser behavior and physical iPhone confirmation remain explicit limitations.

## Files changed

Five UBC files: the audio controller and lifecycle tests, one entry guard in Campus, the project README and a new source/validation report.

## Documentation updated

The project README links the audio report. The report records primary WebKit/W3C evidence, lifecycle behavior, exact local checks and the separation between simulated tests, browser checks and physical-device output.

## Git diff summary

Five files changed, 241 insertions and 7 deletions. This journal is excluded from those totals.

## Verification

- All 14 focused audio tests passed, including delayed settings, rapid toggles, zero volume, failed resume, hidden pages, disposal and session ownership.
- Independent source review and separate lifecycle reproductions found no remaining material blocker.
- An isolated Node 24.10.0 snapshot of b3601b31fa5bfe296496046a1f6f911e5f16e4df plus the five UBC files passed check, all 151 UBC tests and Vinext build. Other tracked source matched the base byte-for-byte; dependencies were reused. Only the existing tutorial lint warning remained.
- Runtime source hashes still matched the validated snapshot immediately before commit; git diff check passed.
- The isolated preview returned HTTP 200 using temporary local stores. Browser interaction, exact-source Linux production build and deployment are separate release gates, still pending at this commit. Physical iPhone Silent Mode output has not been confirmed.

## Repository state after implementation commit

Main at e92bd6d; only the five explicit UBC paths were committed. Other owners' audio files and the pre-existing generated next-env change remain unstaged. CWRU released the shared index before this commit. No branch, worktree, PR, runtime server mutation or unrelated cleanup was performed.

## Implementation commits

- e92bd6d — fix(ubc): support iPhone Silent Mode audio playback

## Archive commit

docs: archive UBC iPhone audio follow-up

## Lessons learned

Treat the optional audio category as shared document state. Keep user intent separate from asynchronously arriving scene settings, and test rapid cancellation as well as successful startup. Browser mocks verify routing logic, not acoustic output on a physical iPhone.

## Follow-up

Push this exact source for Linux packaging, finish browser smoke while CI runs, and give the artifact to the existing deployment owner. Retain normal user mute controls. The other campus owners independently deliver their requested fixes.
