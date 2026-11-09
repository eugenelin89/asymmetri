# Prompt 204: Implement the three Christmas campus walks

- Date: 2026-11-08
- Scope: design
- Goal: Deliver the November–December 2026 Christmas edition, live daylight and nearby weather on the three existing campus explorers, with desktop and iPhone acceptance.

## Original user request

> `/implement-spec issue #5`

During physical acceptance the owner heard a continuous outdoor hiss, tried a quieter droplet mix, then asked for silent rain. Rain remains visible on all campuses. The owner also confirmed that the iPhone was unlocked, asked why a website needed a physical phone, and enabled Safari’s developer settings. The parent issue specifies paired on-device frame times and first-tap speaker playback in Silent Mode.

## Scope

Implemented [issue #5](https://github.com/eugenelin89/asymmetri/issues/5) and the behavior specified by tickets #6–#15. [Ticket #16](https://github.com/eugenelin89/asymmetri/issues/16) holds the cross-campus acceptance. The owner’s main-only workflow applied throughout. Production release requires a separate instruction.

## Decisions

- Use a single campus-local calendar and independent Live/Simulated atmosphere. Keep a deliberate seasonal replay in visit memory. Release the visit when the browser freezes a departed page for history navigation.
- Recognize the new, dated Regular choice separately from old Halloween preferences. Let Regular apply within a visit after the 2026 preference expires.
- Query fixed ECCC and NWS stations through the existing website ingress. Bound refresh work by campus, preserve the original observation time and allow exactly 90 minutes of use.
- Reuse existing campus geometry, movement, collision, community interfaces, graphics settings and Web Audio lifecycles. Fit lights and indoor displays to the landmarks. Use original synthesized sound and locally generated meshes.
- Keep the physical performance measurements, browser captures, controlled weather fixtures, live station observations and human listening evidence distinguishable.

## Implementation

Added the three festive walks, localized light and weather, explicit edition/replay and Photo controls, spatial holiday and weather audio, and coverage at the explorer and station endpoint. Tablet testing exposed a collision between the UBC location label and its toolbar. The corrected UBC layout keeps the full Nest label visible. A night capture exposed dark Gateway letters, which now receive a warm wash.

## Engineering impact

The shared station cache lives in the existing site process. A future multi-process deployment would need shared refresh coordination. Visitors supply no location data. Cross-tab sound, motion and volume settings preserve other tabs’ choices. Hidden and departed visits release playback. Regular and Christmas reuse the same community profile, review and movement systems. Dependency versions and the lockfile are unchanged.

## Files changed

- The three Labs pages, campus projects and editable content integrate edition, atmosphere, audio and seasonal-scene lifecycle.
- The shared campus-atmosphere project contains the calendar, solar model, station adapters, controls, scenery, sound, fixtures and repeatable browser/device harnesses. The read-only route lives under the website’s Labs path.
- The gallery and acceptance record distinguish the tested builds, measured results, rights and conditions.
- Package scripts include the new shared suite in the existing production-build preflight.

## Documentation updated

Updated onboarding, architecture, local development, content, deployment verification, testing, the asset manifest and all three campus READMEs. The [acceptance record](../CAMPUS_CHRISTMAS_2026.md), [weather evidence](../CAMPUS_WEATHER.md), [scenery specifications](../CAMPUS_CHRISTMAS_WALKS.md) and [gallery](../validation/campus-christmas/README.md) describe the delivered behavior and how to repeat the checks.

## Git diff summary

79 files changed, with 3,552 insertions and 1,680 deletions. The change replaces the independent date/default paths, adds the station route and shared visitor controls, and includes original seasonal scenes and validation evidence.

## Verification

- Used the checkout’s Node 24.10.0. The eight production prebuild suites passed all 572 cases. The separate Vancouver suite passed all 74 cases. The independent review fix runs also tested the three audio controllers and spatial mix.
- TypeScript and ESLint passed, with one existing navigation warning in the tutorial reader. The Vinext/Cloudflare and optimized Next.js builds passed. Next reported existing file-tracing warnings in community review and analytics storage. The production dependency audit returned zero vulnerabilities. Whitespace and targeted privacy/reference scans passed.
- The final production build `vVptuSIL-xqgMyRAbl_mu` passed the three browser harnesses. Cases covered cross-device and cross-campus Regular isolation, local calendar cutoffs in unrelated browser time zones, a one-millisecond freshness boundary, live visual changes, audio settings, replay, staging, departure and return. The four protected Motion routes and three campus routes returned HTTP 200 locally. The unsupported station identifier returned 404.
- Desktop, tablet and phone-sized browser walks reached every named interior. The 27 first-person frames use staged conditions. Real nearby ECCC and NWS returns were also verified. The desktop graphics checks returned to the Regular resource baseline after repeated replays.
- On the final build the iPhone 16 completed 18 matched runs. Median p95 was 50→51 ms at UBC, 84→83 ms at Stanford and 47→49 ms at CWRU. Each run averaged at least 30 FPS (32.1–50.7). The largest increase was 4.3%. An interrupted Stanford attempt is recorded separately. All three interiors were also entered by trusted touch. The listener heard the chimes in Silent Mode on the preceding build and requested silent rain. [Device receipt](../validation/campus-christmas/iphone.md) · [Listening decisions](205-design.md).
- The filesystem had 68,699,111,424 bytes free at task start, 63,015,493,632 immediately before final cleanup and 64,537,858,048 afterward. The measured gain in that cleanup interval was 1,522,364,416 bytes. Stopped the local site, fixtures and device automation, then removed the task-installed node_modules (821,464 KiB), Next output (502,520 KiB), Vinext output (128,652 KiB), and reviewed issue-specific temporary scripts, browser tooling, captures and raw logs. The total allocated estimate for these final cleanup candidates was 1,505,202,176 bytes. A separate earlier desktop-scratch retirement recovered 25,047,040 measured bytes. Volume changes across the entire session also reflect other filesystem activity. Retained the canonical checkout, tracked public assets (about 90 MiB), docs (about 58 MiB), Git history (about 121 MiB), the existing Wrangler state and incremental TypeScript cache. The old worktree’s path is absent and its branch is published, so no working directory or files were removed there.

## Repository state after implementation commit

Committed on main over `0b6c2c7`. Before publication, the implementation was one commit ahead of the fetched origin/main. The unrelated pre-existing worktree registration points to an absent temporary path. Its feature branch remains reachable on the remote.

## Implementation commits

- `f67ac01a14efb97488e0169fbb15c272bee8d61d` — Implement Christmas walks and live atmosphere on all three campuses.

## Archive commit

`Journal 204–205: record Christmas walks and listening decisions`

## Lessons learned

A reconstructed landmark can be walkable while part of its status label is covered. Traversing the full routes at different widths exposed that detail. A running Web Audio context, a trusted touch event and an audible sound from the speaker are three independently testable observations.
