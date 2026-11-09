# Prompt 206 — Deploy Christmas to the three virtual campuses

- Date: 2026-11-09 UTC, November 8 in Vancouver
- Scope: deployment
- Goal: Put the completed Christmas campus work in production and verify recovery.

## Original user request

> deploy

## Scope and decisions

The owner authorized the DigitalOcean website release after asking about its deployment status, silent rain and snow-covered ground. Use the successful independent Linux artifact for source `8cb6504`, which includes the owner’s final rain decision. Only transcript commits followed that build. Preserve the live data, the previous complete runtime, and the two older expanded rollbacks.

## Implementation and engineering impact

Staged the checksummed artifact in an independent application-owner checkout, served it with isolated writable stores and swapped it into production. Stopped and resumed the website's prune timer around the swap. Public campus welcomes now open in the scheduled Christmas edition. The three weather endpoints returned nearby station readings in production. The website, receiver and peer configuration remained intact. [Release, rollback and cleanup receipt](../CAMPUS_CHRISTMAS_RELEASE_2026-11-08.md)

## Files changed and documentation updated

The release receipt records the deployed build, production acceptance, rollback startup, cleanup and historical archive discrepancy. The README, deployment guide and campus acceptance guide point readers to the receipt.

## Git diff summary

Four documentation files changed, with 54 insertions and 10 deletions. The new receipt accounts for 39 of the added lines.

## Verification

- Matched checksums before staging and after transfer. Exact-source type/lint, Vancouver tests, production audit and Linux build passed in CI.
- Checked loopback and both public domains, including the four protected Motion routes, 800 public files and 38 static bundles per origin. The 18 public browser checks covered keyboard focus, viewport fit, current weather, Automatic and end of replay.
- Started the previous full build independently after activation. Checked the four protected Motion routes and three former campus pages on it. After cleanup, 15 peer-host baselines, 62 configuration files, the five live store settings, the prune timer, site health and new-process journal passed.
- Cleanup recovered 256,933,888 measured bytes on production and 539,828,224 measured bytes on the Mac. Actual before/after readings and retained runtimes are in the receipt. The 12 older archives remain unverified at their recorded owner-held locations.

## Repository state after implementation commit

The canonical checkout was clean on `main`, one release-receipt commit ahead of `origin/main` at `25add21`. The deployed build identifies its original source `8cb6504`.

## Implementation commits

- `742e5d385861d72409ac4e3c91f7429932daa91f` — Record the live three-campus Christmas release and rollback

## Archive commit

Journal 206 — record production deployment of campus Christmas

## Lessons learned

Boot a retained runtime against isolated stores to establish recovery readiness. For older archives, check the files at their recorded location before relying on a previous custody receipt.
