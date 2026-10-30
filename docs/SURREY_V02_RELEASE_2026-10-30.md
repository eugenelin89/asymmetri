# Surrey Adventure V0.2 — Dangerous Streets

Live at [asymmetri.co/labs/surrey](https://asymmetri.co/labs/surrey). The guarded
activation completed October 30, 2026 at **18:40:46 UTC / 11:40 PDT**.

## Scope

Dedicated branch `codex/surrey-adventure-v02`, based on V0.1 repository head
`14f6e7f67898e080ac3c4a0efe7f622dd83f8627`. The route stays `/labs/surrey` and the
Labs submenu remains **Surrey Adventure**. All Vancouver code and geographic
snapshots, the immutable Surrey V0.1 snapshot, dependencies, workflows, services
and unrelated public routes remain unchanged.

One shared Three.js scene now supports ground adventure and smooth aerial orbit,
pan, zoom, follow/free exploration, exact YOU marker and landmark/lead waypoints.
Aerial pauses street simulation. Six authored encounter types supplement the
pickpocket, with mature dialogue off by default and Gentle Streets suppressing
threats. The mystery has five clues, three witnesses, a misleading clue, gated
conclusions and capped rewards. Local saves validate version, map, data and safe
position. Rounded shared people, sidewalk routes and source-backed landmark cues
improve the city without new runtime dependencies.

## Local acceptance

Node 24.10.0. TypeScript/ESLint pass (one pre-existing tutorial navigation warning).
29 Surrey, 25 Vancouver and 7 investment tests pass; production audit reports zero
vulnerabilities. Both standard Next.js (webpack) and Vinext builds pass. The local
production preview serves 13 checked routes; protected page content and all 24
tutorial assets match the live baseline. Linux identity is recorded after completion. Privacy/source review found only same-origin map fetch and local game
storage; no upload, tracking, real-crime data or external runtime service added.

Ordinary Brave keyboard/button play-through, without debug teleport or state injection:

- Collected all five mystery clues and interviewed Nina, Idris and Rowan using
  collision movement. Submitted an inconclusive report ($20 → $30), then the
  corroborated conclusion ($30 → $95), confirming the $75 total reward cap.
- Completed Rae's optional adult dialogue with the non-criminal boundary response,
  Dev's wallet return (+$8), and Cleo's portfolio pursuit/recovery (+$20).
- Paused the active portfolio pursuit in aerial mode: player `-5.75,-12.54` and
  simulation elapsed `903.58` stayed fixed; ground resume recovered the portfolio.
- Completed the original backpack pursuit, recovered the dropped bag and returned
  it to Alex (+$35). Reload/Continue restored both cases closed, five evidence
  entries, three resolved encounter types and $158.
- Verified orbit drag, WASD pan, visible zoom, F/Return to Player and Holland Park
  waypoint selection without moving the player. Twenty mode switches retained one
  canvas and stable geometry/texture counts after warm-up (48/15 in that run).
- New Game showed a replacement confirmation; Keep my save retained progress.
  Journal Shift+Tab wrapped within the modal. Route exit removed the canvas;
  returning offered Continue and restored progress. Browser error log was empty.
- Responsive checks read actual CSS viewport widths (browser zoom accounted for):
  320×740, 390×844, 767×1024 and 844×390, plus the normal desktop view. No horizontal
  overflow. Held touch-direction button panned aerial while position/clock stayed
  fixed. This is viewport/input emulation, not a physical-phone certification.
- Typical desktop ground/aerial frame rate was near 60 fps in bounded checks.
  Shared geometry reduced the V0.1 geometry count; far aerial NPC culling reduced
  the initial whole-city view to roughly 124–143 draw calls. Location-dependent
  counts varied. This is not a long-session heap or phone thermal benchmark.

Screenshots and machine receipts are retained in owner storage outside Git.
Reduced-motion branches, storage failure/corruption and renderer disposal are
covered by code review and automated/pure-state cases where applicable; no claim
of hardware-level GPU allocation tracing is made.

## Release safeguards and status

Production baseline: source `883ebfe5d81a191b9d73e6fd183ec2d589d88be6`, build
`Ph1NW42c_br8k4AmOXJQ4`, Node 22.23.1, Next 16.4.3, Three 0.186.1.
The full live Surrey V0.1 runtime must remain available for immediate rollback.

An older inactive Vancouver V0.2 runtime (source `7990eabe022aed0ed28b477b07bc2d9ad457e1d6`,
build `LgdQfEvDuIcwEAl6_yxWS`) was streamed to owner storage, SHA-256/gzip checked
and fully compared against its remote tar before retiring that directory. Archive
SHA-256: `0afe8651a31dc2f060adeac44bee51e419a24a7a5069ddffa42a91b91b15d3a2`;
276,377,600 compressed bytes. No active process/config reference; recovery freed
1,024,753,664 bytes. Current runtime and complete Vancouver V0.3 remain on server.
Baseline/retention guards preserved six service identities and 55 configuration
hashes, above 192 MiB available RAM and 6 GiB disk free.

The isolated candidate passed before the whole-directory swap. No rollback was
needed. Production remains at the exact tested source below; the final release
receipt and journal are documentation-only commits, not another runtime deployment.

## Verified Linux candidate

[Workflow run 41107855489](https://github.com/eugenelin89/asymmetri/actions/runs/41107855489)
completed successfully for exact source `52f4451752c2995a7f397a022090a42a821b31a0`.
Artifact `13003215702` contains Node `v22.23.1`, Next 16.4.3 and
Three 0.186.1; Next build ID `kpnCoQ9y6YEz8nDG63G0n`. The downloaded ZIP matched
GitHub's digest, the inner tar matched its checksum, and archive paths/symlinks
were inspected before extraction. Runtime tar: 254,106,189 bytes compressed,
896,061,487 uncompressed file bytes; SHA-256
`75a31ab792fed582682ad1d18ef366be3be9dbcd2aa8716e80ecb0947c9cb69d`. No live-tree install or build was performed.

## Production acceptance and capacity

- Staged candidate: 12 baseline routes, eight protected host/path checks, 124
  tutorial IDs, 24 tutorial assets, native Sharp HTTP 200, Motion video/form and
  Ask/Trade behavior, Surrey page/data/sitemap and unchanged Vancouver content.
- Public apex and www: 13 routes each returned HTTP 200. Protected content, IDs,
  links, canonicals and 24 tutorial assets matched the pre-release baseline.
  Surrey's two data files and all six published Vancouver data files matched
  committed hashes on each host; the Motion access redirect and image optimizer passed.
- Live browser: V0.2 content and default-off mature setting, Play, aerial pan/F
  return, SFU waypoint without teleport, reload/Continue restoring mode/waypoint,
  ground walking and return to aerial all passed. The final YOU marker and camera
  centre matched `25.80,29.43`; one canvas, 46 geometries, 14 textures and no console
  errors. Warm sampled aerial rendering was 60 fps at adaptive DPR 0.75 with 124
  draw calls. Startup frame rate varied; no fixed hardware-independent rate is promised.
- All seven preparation guards exited successfully. Minimum available memory was
  **250.5 MiB**, and free disk **6.522 GiB**, above 192 MiB / 6 GiB throughout.
  The activation monitor sampled 25 times, with minimum 371.1 MiB available memory
  and 6.522 GiB disk. Five peer services and 55 configuration hashes stayed unchanged.
- Final health: website active/running/enabled, zero restarts, no post-activation
  error entries, about 406.3 MiB available memory and 6.522 GiB free disk. The old
  process's intentional shutdown exit-143 entry is accounted for separately.
  Thirteen unrelated virtual-host responses and the Node executable were unchanged.

The implementation is `b171541`; tested/deployed source is
`52f4451752c2995a7f397a022090a42a821b31a0`. The feature branch and `main` were pushed
normally, with no force push. Parallel GIS Apps navigation work was told to use an
isolated clone and wait for activation, then integrate this released source. That
separate task is not included in the deployed runtime or this release's claims.

## Full recovery retained

The immediately preceding Surrey V0.1 runtime is intact at
`/var/www/asymmetri-rollback-surrey-v01-20261030-883ebfe`, including its executable
Linux dependencies, source `883ebfe5d81a191b9d73e6fd183ec2d589d88be6` and build
`Ph1NW42c_br8k4AmOXJQ4`. The complete preceding Vancouver V0.3 and pre-Vancouver
runtimes also remain. The older archived V0.2 runtime is recoverable from the
verified owner-held archive described above.

Activation automatically restored the whole prior runtime on acceptance failure;
that fallback was not needed, and a deliberate rollback drill was not performed.
For a later rollback, verify current/previous source/build, clean trees, executable
dependencies, capacity and peer/configuration fingerprints. Stop only
`asymmetri.service`, rename the current tree to a new retained failure location,
rename the verified Surrey V0.1 directory to `/var/www/asymmetri`, start that service
and repeat protected-route/public/peer checks. Never overwrite a retained runtime,
reset its Git tree or change a database/receiver for a website rollback.

Remote receipts: `/var/lib/asymmetri-surrey-v02-release-20261030`.
Owner-held artifacts/archives/receipts/screenshots: `deployment-retention/2026-10-30/surrey-v02/`
outside Git. Both owned local preview servers were stopped. CI artifact expiry is
transport retention only; the verified Linux artifact and rollback archive are retained.

## Limits and next three improvements

Architecture and heights remain stylized, source dates/units have limits, and the
flat map has decorative furniture without full prop collision. No interiors,
vehicles, combat or transit boarding. Saves are browser-local, per origin, and can
be cleared by the browser. Physical phones, multi-touch, thermal/battery endurance
and long-session heap/GPU behavior remain separate acceptance work.

1. Physical iOS/Android input and sustained performance acceptance.
2. Recurring-character errands, schedules and richer branching consequences.
3. Verified paths, terrain and transit traversal before expanding geography.
