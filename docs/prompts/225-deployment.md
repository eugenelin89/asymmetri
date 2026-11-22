# Prompt 225 — Court Damage standalone iPhone resources

- Date: 2026-11-22 UTC
- Scope: deployment
- Goal: Publish game-specific support and privacy resources on the company domain.

## Original user request

> Create required web pages under asymmetri.co

> For web pages, let them be stand alone and no link from home page.

The owner subsequently approved the proposed verified retention and dependency update.

> Inspect and archive if verified

> Include the security update

> merge all PRs for me

These excerpts cover the website portion of the cross-repository iPhone release. Private operational details and unrelated release instructions are omitted.

## Scope and decisions

Provide two publicly reachable pages with shared local navigation and company contact information. Omit homepage and sitemap entries. Patch Next.js and its ESLint configuration for the release audit. The owner initially requested an open PR for review and later authorized merging the release PRs.

## Implementation and engineering impact

The App Router serves two static, noindex routes. The support page explains play and troubleshooting. The policy distinguishes offline play, on-device preferences, Apple diagnostics, voluntary support email and web requests. Site-wide runtime dependencies moved to Next.js 16.4.6. The existing Linux build and release process produced and verified a complete candidate and rollback.

## Files changed and documentation updated

The Court Damage layout, stylesheet and two page components provide the public resources. Package metadata pins the dependency change. The README and content guide identify where to maintain the pages. The deployment guide links to the [release receipt](../COURT_DAMAGE_RESOURCES_RELEASE_2026-11-22.md).

## Git diff summary

The implementation and release documentation together changed ten files, with 116 insertions and 51 deletions relative to `a0eb97c`. The two app routes are the only additions to the production route manifest.

## Verification

The [Linux candidate](https://github.com/eugenelin89/asymmetri/actions/runs/45005114343) passed. An independent HTTPS check on apex and `www` confirmed status 200, apex canonicals, noindex metadata, the support mailbox and reciprocal links. Homepage and sitemap checks found no Court Damage entry on either host. The release receipt records the protected-site checks, successful independent rollback startup and cleanup.

## Repository state after implementation commit

The public website serves `5eec469`. The isolated `codex/court-damage-support` branch includes the subsequent release documentation. [PR #18](https://github.com/eugenelin89/asymmetri/pull/18) was open during preparation of the receipt. The subsequent merge instruction covers the two Court Damage release PRs.

## Implementation commits

- `51c7407` adds the standalone pages.
- `5eec469` updates Next.js and its matching ESLint package.
- `d73af35` records deployment verification and updates the website guides.

## Archive commit

`Record Court Damage website release request and approvals`

## Lessons learned

For standalone product pages, verify direct access and canonical URLs on both hosts alongside the absence of homepage and sitemap entries. Record the deployed runtime revision separately from later documentation commits.
