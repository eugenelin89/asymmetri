# Prompt 187: CWRU audio through iPhone Silent Mode

- Date: 2026-10-31
- Scope: platform
- Goal: Support Halloween sound through Silent Mode when the browser provides Audio Session playback, while preserving player controls and other audio owners.

## Original user request

> deploy asap

The owner requested the same Silent Mode audio fix for UBC, Stanford and Case Western in the UBC chat and explicitly asked that each college's chat implement its own change. The coordinating chat verified the direct request and assigned CWRU audio to this workstream. This is a separate follow-up to the already-live community/running-control release; repeated deployment urgency gives the first passing UBC artifact priority without waiting for other campus source.

## Scope and decisions

CWRU audio engine, gesture wiring, regression fixtures and documentation only. Feature-detect the optional Audio Session API using WebKit's documented playback category. Do not add silent HTML audio, network audio assets, microphone access or user-agent sniffing. Keep the existing synthesized score, creatures and volume controls. Preserve all other campuses' work and deployed artifacts.

## Implementation

Configure the intended current/next settings synchronously before gesture unlock, then acquire playback before awaiting AudioContext resume. Regular mode, mute, zero volume and hidden entry do not construct or acquire audio. Remember the prior category only when this engine changes it. Release on mute, zero volume, holiday-off, hiding and disposal; preserve pre-existing playback and intervening media-category choices. Unsupported, throwing, ignored and readonly APIs retain ordinary Web Audio behavior. Guard overlapping/rejected resumes and disposal during an outstanding resume.

The audio engine owns visibility from the initial gesture, including asset loading, and removes its listener on disposal. Retained gesture authorization allows the selected edition to recover after the scene's initial default settings without holding playback while disabled. The wolf-preview control is disabled at zero volume. Browser physical output remains subject to platform support and volume.

## Engineering impact and files changed

The CWRU explorer passes explicit settings at Start, edition, sound and preview gestures. Its audio module adds guarded playback ownership and visibility cleanup. The test file retains source/cue/voice checks and adds nine Audio Session groups. The project README and new iPhone audio report describe supported behavior and limits. The prior CWRU deployment receipt is corrected to state that restoring the test browser's temporary opt-out could not complete after its old control tab disappeared; no restoration or hidden-state workaround is claimed.

## Documentation updated

`docs/CWRU_IPHONE_AUDIO_2026-10-31.md` cites WebKit issue 237322/comment 6, records implementation, local validation and pending exact-source/live deployment. The project guide links to it. The previous release record preserves truthful QA preference cleanup status. No public asset was added; screenshots remain private verification evidence.

## Git diff summary

Six files changed, 191 insertions and 17 deletions. This journal is excluded from its own diff summary.

## Verification

Node 24.10.0 matches `.nvmrc`. An isolated export passed TypeScript/ESLint (only the existing tutorial warning), all 98 CWRU tests including 13 audio tests, and Vinext packaging. Runtime hashes match that export. Phone 390×844 UI smoke exercised Start, mute/re-enable, volume 0 disabling preview, volume 35 restoring preview, wolf preview and Regular/Automatic transitions. Rendering observations reported Audio: running; closing the panel restored CANVAS focus. No overflow or console errors occurred. The temporary tab and local preview were closed and viewport reset. The configured localhost origin resolved a development-only origin rejection without changing application/security settings.

No physical iPhone or audible-output verification is claimed. Mock session/category tests and desktop browser state are not acoustic evidence. Exact-source Linux CI and production acceptance remain required. UBC 7026 is already frozen and transferring independently, so this commit does not alter or delay it.

## Repository state after implementation commit

Main at `e4aabe5ca5cfa640559c91e6cd566549389df39b`, following Stanford's scoped audio 186. Only the six reviewed CWRU files were staged. The generated next-env change remains excluded. Commit this journal separately, push without force and freeze the resulting source for the later CWRU/Stanford audio rollout. No branch, worktree, PR or merge is created.

## Implementation commits

- `e4aabe5ca5cfa640559c91e6cd566549389df39b` — fix(cwru): support Halloween audio through iPhone Silent Mode

## Archive commit

`docs: archive CWRU iPhone audio validation`

## Lessons learned

Treat playback category as a reversible, gesture-authorized resource. Account for asynchronous resume and pre-scene visibility, and configure the intended audio settings before unlocking. Keep physical-device claims distinct from fixture/browser checks and preserve exact source during concurrent releases.

## Follow-up ideas

Required: consume successful exact-source Linux CI/artifact, deploy through the existing guarded runtime process after the urgent UBC audio release, and complete CWRU live acceptance. Keep ten-minute ETA updates active until every requested CWRU follow-up is verified live.
