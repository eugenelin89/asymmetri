# Prompt 210 — Deploy the approved Winter Wonderland instrumental

- Date: 2026-11-09 UTC
- Scope: deployment
- Goal: Play the exact approved quiet, steady mix on the three Christmas campus walks.

## Original user request

> sure this is good. use this one. deploy at once

The owner approved the final local audition and confirmed the music license covers public campus walks.

## Scope and decisions

The 16.64-second stereo master uses hand-shaken CC0 sleigh bells and a separately recorded soft bell melody. Preserve its balance and cadence. Provision the licensed recording outside the public source repository, verified by SHA-256 before and after activation. Keep weather, edition changes, mute and gesture handling under the existing campus sound controllers.

## Implementation and engineering impact

The shared ambience module fetches and decodes once per AudioContext. A loop spans doorways; edition transitions fade the outgoing voice, handle late downloads and reuse decoded audio. The deployment can omit build-only dependency files from the verified Linux artifact to fit an independent runtime; the candidate smoke test covers the resulting package. No application dependency was added.

## Files and documentation

Thirteen tracked files. They cover the audio controller and lifecycle tests, licensed asset exclusion, project READMEs, audio and asset provenance, test and deployment guides.

## Verification and repository state

The complete local ambience suite passed 33 tests, along with TypeScript, lint (one existing tutorial warning), the Vinext build, production dependency audit and whitespace checks. Main was clean after the implementation commit, ahead of origin by one. The [release receipt](../CAMPUS_WINTER_MUSIC_RELEASE_2026-11-08.md) records public playback, asset hashes, independent rollback and the measured cleanup audit.

## Implementation commits

- `ea8c111b1247543b81cd7635a7d1e7ce08e1311d` — Play the approved instrumental Winter Wonderland during Christmas campus walks

- `2f2067dd93559c73151267a06f2f7fbbd1f2493e` — Record the verified Winter Wonderland production release and cleanup

## Archive commit

Journal 210 — record the approved campus soundtrack

Complete Journal 210 with live playback and verification

## Lessons learned

Approve the final sound by listening to the rendered artifact. Use its file digest to carry the same mix from audition to production.
