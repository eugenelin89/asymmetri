# Prompt 205: Make rain silent after listening on iPhone

- Date: 2026-11-09 UTC
- Scope: design
- Goal: Resolve the outdoor hiss the owner heard during acceptance of issue #5.

## Original user requests

> there is some kind of white noise when walking outdoor

> that white noise is annoying

> yeah heard the sound. but i don't like the rain sound. rain can be silent

## Scope and decisions

These were listening refinements to the [three-campus implementation](204-design.md). The owner heard the outdoor rain during the timed walks. The first implementation generated continuous filtered white noise. A quieter trial used irregular droplets with silent intervals. The owner heard the trial in ordinary Safari and requested silent rain. That decision supersedes the rain-audio example in the original spec. Wind has its own measured input, and visual rain continues in both Live and Simulated atmosphere.

## Implementation and engineering impact

Removed the rain waveform, weather track and rain-only playback trigger from the shared audio module. Entering a rainy Regular campus with calm air leaves the audio playback role available. Christmas chimes remain when walking near a display. Observed wind from 8 km/h produces intermittent gusts. Snow uses quiet, widely spaced cues. All three campuses share this behavior.

## Files changed and documentation

The shared ambience module and audio lifecycle fixtures carry the policy. The asset manifest and campus acceptance guide document the final sound sources. The [physical Safari receipt](../validation/campus-christmas/iphone.md) distinguishes the listening build and final timed build.

## Git diff summary

The sound refinements were incorporated into the same implementation commit as #5. The combined diff totals appear in [Journal 204](204-design.md). The relevant changes remove the continuous weather bed, add separate snow and wind voices and add regressions for rain in Regular and Christmas.

## Verification

A human first tap entered each Christmas campus in ordinary iPhone Safari with Silent Mode on. The listener confirmed hearing sound. The production Web Audio controllers passed focused tests for silent rain, festive chimes, wind continuity, indoor attenuation, visibility and disposal. The final rain-silent build was used for all 18 matched frame-time walks.

## Repository state and implementation commit

- Main over `0b6c2c7`.
- `f67ac01a14efb97488e0169fbb15c272bee8d61d` — Implement Christmas walks and live atmosphere on all three campuses.

## Archive commit

`Journal 204–205: record Christmas walks and listening decisions`

## Lessons learned

Frame timing, activation of a browser audio session and the listener’s experience answer different questions. The owner’s listening feedback changed the rain mix, and the final site reflects that choice.
