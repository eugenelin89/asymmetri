# Surrey Adventure V0.2 — Dangerous Streets

## Candidate scope

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

At this candidate-documentation stage, V0.2 is not yet claimed deployed. Exact
Linux artifact, staged checks, activation and final public receipts follow in a
separate release documentation commit.
