# Prompt 220: Automatically play shared My Music folders

- Date: 2026-11-15 (Vancouver; November 16 UTC)
- Scope: platform and deployment
- Goal: Attempt playback automatically when a folder URL is supplied in the page address.

## Original user request

> when there is a folder URL in the parameter, the music should auto start

## Scope

Follow-up to prompt 219; preserve sharing and manual entry while adding autoplay to incoming folder links. The owner explicitly authorized coordination with the concurrent OpenMP3 website release; this chat owns one combined deployment and the other chat continues native App Store work.

## Decisions

Load and validate the complete folder first, then select and attempt to play the queue's first track. Use the same audio-start helper as manual playback. Browser autoplay policy remains in control: a rejected automatic attempt leaves native controls visible and asks the visitor to press Play. Manual form loads do not automatically start playback.

## Implementation

A stable audio-start callback is shared by track selection and successful URL-parameter loading. Public help and guides explain the browser fallback. Shareable address behavior is unchanged.

## Engineering impact

No dependencies, backend changes, persistence or assets. Browser policies can prevent audible autoplay, so unconditional playback is not promised.

## Files changed

Player component, centralized copy, README and architecture/content/local-development/testing guides.

## Documentation updated

Updated earlier instructions that required Play for incoming shared links; recorded browser-policy fallback.

## Git diff summary

7 files changed, 34 insertions and 16 deletions.

## Verification

TypeScript/ESLint passed (one existing tutorial warning); eight focused music regressions and the standard Next webpack build passed. Prior sharing validation and Vinext build passed before this small playback follow-up. Browser acceptance with a synthetic audio fixture observed the blocked-autoplay Play prompt, selected first track, visible native controls and successful manual playback (Pause control visible). The browser disallowed autoplay on reload; no claim of overriding that policy. Final exact-source Linux build and combined production release follow this preparation commit.

## Repository state after implementation commit

Main at `60061ec`, clean before this journal. Earlier sharing implementation `d2666a0` and archive `92f4348` are already pushed. OpenMP3 resources remain intact.

## Implementation commits

- `60061ec` Start playback when opening a shared music folder

## Archive commit

Record shared-folder autoplay preparation

## Lessons learned

An automatic play attempt must expose a useful manual recovery path when the browser requires a gesture.

## Follow-up ideas

Complete the authorized combined deployment and record activation/rollback/cleanup evidence.
