# Prompt 208 — Deploy the Christmas bell carol

- Date: 2026-11-09 UTC, November 8 in Vancouver
- Scope: deployment
- Goal: Release the tested Christmas music to UBC, Stanford and CWRU.

## Original user request

> deploy

## Scope and decisions

The preceding turn added the original bell carol and gave the owner a listening sample. The owner then authorized production deployment. The successful Linux candidate at `ba6528b` contained that implementation. The only later commit at staging updated the interaction log. The existing production runtime, five persistent stores and earlier recovery copies were included in the preflight inventory.

## Implementation and engineering impact

Compared the artifact checksum with GitHub, checked the embedded build and source, verified the runtime tar after transfer, and started an independent application-owner checkout with isolated stores. The whole-runtime swap preserved the previous Christmas build and resumed the website's prune timer. No runtime code or service configuration changed during deployment. [Release receipt and rollback procedure](../CAMPUS_BELL_CAROL_RELEASE_2026-11-08.md)

## Files changed and documentation updated

The release receipt records the public audio measurements, route and asset checks, archive status, storage measurements and tested immediate rollback. The README, deployment guide and Christmas acceptance guide identify the public music release.

## Git diff summary

Four documentation files changed, with 48 insertions and three deletions. The receipt added 38 lines.

## Verification

- The exact-source Linux audit, tests, type/lint checks and optimized build passed. All 800 public files and 38 referenced bundles matched on three origins.
- All six browser visits entered the public Christmas welcome, detected the carol's first two bars and measured audio output. Regular stopped the festive notes. Initial transport failures cleared on repeat. No write requests occurred.
- A separate loopback port served the previous build's four protected Motion pages, three campus pages, static bundle and weather endpoint. After cleanup, 15 peer baselines, 62 configuration files, the five private-store settings, the prune timer and new-process journal passed.
- Production had 10,061,078,528 bytes free at the start and 8,758,140,928 at final health. Staging cleanup recovered 256,946,176 measured bytes. The Mac recovered 539,770,880 measured bytes from reproducible scratch. The complete runtime trees, compact evidence and existing archive-custody follow-up are itemized in the receipt.

## Repository state after implementation commit

The canonical worktree was clean on `main`, one receipt commit ahead of `origin/main` at `bd888d4`. The server identifies build `cgSIggsF1IJPAlAAHHgXb` from `ba6528b`.

## Implementation commits

- `aa2c265e438bddb0ccff9bff942ce2de94447a58` — Record the live Christmas bell carol and verified rollback

## Archive commit

Journal 208 — record the Christmas music deployment

## Lessons learned

Playback verification needs the ordinary entry gesture and enough time for the music to begin. Measuring the master output alongside the first two bars distinguishes a working public audio path from a successful page load.
