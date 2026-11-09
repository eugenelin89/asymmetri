# Prompt 211 — Individual Christmas music for Stanford and CWRU

- Date: 2026-11-09 UTC
- Scope: design
- Goal: Let each Christmas campus choose its own recording, preserving the quiet, steady bell mix.

## Original user requests

> For each school, can we have different music. so for stanford, lets try jingle bells

> and for CWRU, lets do Rudolf the red nose reighndeer

The owner confirmed the music license covers “Rudolph the Red-Nosed Reindeer” in the public CWRU walk.

## Scope and decisions

Stanford uses a new instrumental of “Jingle Bells”; CWRU uses a new instrumental of “Rudolph the Red-Nosed Reindeer.” UBC retains its approved “Winter Wonderland” master. The two preview files are the same bytes consumed by the local walks. The licensed CWRU master has a private recovery copy and is excluded from Git. The new performance of the public-domain Stanford tune is included. This turn prepared and auditioned the recordings; it did not activate a production release.

## Implementation and engineering impact

Each campus controller supplies its typed campus ID to the shared transport. Each audio context caches decoded recordings separately by campus. The streaming, mute, edition, weather and teardown paths continue to use the existing audio system; no dependency was added.

## Files and documentation

The three campus audio entry points and project guides, shared ambience and lifecycle tests, Stanford asset, license exclusion, asset manifest, and local development, testing and deployment guidance describe the track assignments and provisioning.

## Git diff summary

18 files changed, with 57 insertions, 34 deletions and one 376,007-byte audio file.

## Verification

The 33 shared campus tests passed, along with TypeScript, lint (one previously documented tutorial navigation warning), the Vinext build, a production dependency audit and whitespace checks. Three fresh browser visits through ordinary local entrances each requested only the correct asset, matched its SHA-256, produced a nonzero signal at the expected recording duration and stopped music on leaving Christmas. Both new recordings were played locally for audition.

## Cleanup and repository state

Mac free bytes: initial 64,449,609,728; before cleanup 62,906,920,960; after 64,101,466,112; measured recovery 1,194,545,152. Cleanup removed this task’s idle dependencies, build output and scratch after checking open handles. Retained the canonical checkout, track masters, private receipt, previews and the previously documented absent worktree registration. No production transfer or server cleanup was performed. Main was clean after the implementation commit and one commit ahead of origin.

## Implementation commit

- `0fdcb66794f7a47c61a0e0e79457011c0ed71383` — Give each Christmas campus its own instrumental soundtrack

## Archive commit

Journal 211 — record the two school-specific Christmas music previews

## Lessons learned

A route-level playback check verifies the chosen song and catches a shared default that unit tests of a single campus could miss.
