# Prompt 186: Stanford iPhone Silent Mode audio

- Date: 2026-10-31
- Scope: platform
- Goal: Support explicitly enabled Stanford Halloween playback on compatible iPhones while retaining sound and lifecycle controls.

## Original user request

> any way to have sound in silent mode?

> make sure to message the other thread for Stanford and Case Western to do the same

These user instructions were relayed from the coordinating UBC chat and are also recorded in journal 185. Each campus owns its implementation and acceptance. The later urgent UBC deployment takes priority; Stanford must not delay that frozen artifact.

## Scope

Stanford's audio controller, control integration and tests, with affected documentation. No other campus code, shared backend, dependency, soundtrack asset or production data changes. The already accepted community release remains independent.

## Decisions

Feature-detect the optional Audio Session interface and request playback during an enabled user gesture, using primary WebKit/W3C guidance. Remember the prior role only when this controller changes it and restore only while still owned. Use ordinary Web Audio when the API is absent or restricted. Keep effective preferences owned by controls rather than asynchronously loaded scene frames; two failing regression fixtures demonstrated why the initial approach was insufficient.

## Implementation

Enter, sound, volume and seasonal controls pass the next effective preference directly. Optional playback routing is released by mute, zero volume, Base, hidden state and disposal. Visibility restoration requires previously authorized enabled sound. Resume promises are versioned so stale failures and hidden completions cannot undo newer intent. No silent media loop, microphone permission, user-agent sniffing or downloaded audio is introduced.

## Engineering impact

The existing procedural score, spatial ghost cues, volume and holiday choices are retained. Controls keep the same layout. Another feature's changed audio policy is preserved. Unsupported platforms retain their existing behavior; simulated tests and desktop browser observations do not certify sound from a physical iPhone speaker. Private persistence and retention behavior are unchanged.

## Files changed

Seven files: Stanford sound controller and new focused tests; Campus control integration; project README; campus implementation report; new audio report; and the previous release receipt's explicit QA-browser preference-restoration limitation.

## Documentation updated

The audio report records behavior, primary evidence, exact local checks and remaining CI/deployment/device limitations. The prior release receipt now records the coordinating owner's report that its older control tab disappeared before preference restoration; the QA browser may retain its temporary opt-out. No hidden-state workaround was used and production defaults were not changed.

## Git diff summary

Seven files changed, 252 insertions and 12 deletions. This journal is excluded from its own totals.

## Verification

Isolated b3601b3 export plus owned Stanford changes: all 155 Stanford tests passed, including 15 focused audio fixtures; TypeScript/ESLint passed with the existing tutorial warning; production audit found zero vulnerabilities; Vinext and Next webpack builds passed. The Next compiler ran directly after focused tests, without the full cross-campus prebuild hook. Two initial race fixtures failed before the fix and passed afterward.

Desktop 1280×720 local Next preview passed entry, mute/re-enable, zero volume, restore to 45%, Base and automatic Halloween controls. Visible diagnostics reported running audio and nine atmospheric cues. No horizontal overflow, sampled broken images or console errors were observed. The temporary tab and preview server were closed; no viewport override was used. Runtime hashes match the tested export. No physical-device Silent Mode or subjective speaker audition is claimed. Exact combined Linux CI and live deployment remain required.

## Repository state after implementation commit

Main at 2bc1abb68409a5124d93b47b7265bd2485309f5e. Only seven Stanford-owned paths were committed; CWRU's pending files and generated next-env remain unstaged. This commit and its journal are temporarily held from push while CWRU freezes exact UBC7026 staging, then published without force. The index is released after the journal. No branch, worktree, PR or merge was created.

## Implementation commits

- `2bc1abb68409a5124d93b47b7265bd2485309f5e` — fix(stanford): support iPhone Silent Mode audio playback

## Archive commit

`docs: archive Stanford iPhone audio follow-up`

## Lessons learned

Audio policy must follow effective user intent before the first scene frame. Cover initialization, cancellation and promise races directly; a steady-state playback test alone misses them. Keep urgent immutable releases independent of later prepared features.

## Follow-up ideas

Required: exact-source CI, coordinated audio activation and Stanford live acceptance. Physical iPhone Silent Mode confirmation remains a separate device check. The ten-minute ETA heartbeat stays active until the requested release is accepted.
