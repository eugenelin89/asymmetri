# Prompt 109: Deploy Motion TestFlight access

- Date: 2026-10-21
- Scope: deployment
- Goal: Publish the approved clean signup URL, access actions and privacy disclosure on the existing website.

## Original user request

> deploy

This follows Prompt 108, which implemented and pushed `/motion/try`, three
Request TestFlight access actions and the external-form privacy disclosure.

## Scope

Deploy committed website source, verify live behavior, preserve rollback and
document acceptance. No app distribution, Google Form changes, response edits,
outreach, receiver activation, infrastructure change or unrelated cleanup.

## Decisions

- Use the existing DigitalOcean deployment route and standing Node 22 approval.
  Review the retained-host exception without changing the operating system.
- Use an independent complete candidate for the redirect change. Copy unchanged
  dependencies independently and compile on the reserved Linux builder with the
  exact production Node executable and native compiler.
- Restore required capacity by preserving one older inactive rollback as a fully
  verified archive in private durable owner storage, then retiring its duplicate
  server directory. Keep the current and recent complete runtimes intact.
- Preserve production source/build identity separately from later receipt and
  journal commits. No second restart is needed for documentation.

## Implementation

Activated source `c4cefd9d0cfea154c7dc0fc3064c982c866049bc` with build
`W4Yg_XIBAR3DSU1bd-kJJ` at 21:34:54 UTC / 14:34:54 Vancouver. The website now
serves both temporary access redirects, the two Motion and one Sports CTA, and
the October 21 policy extension. The preceding `88ba5ab` runtime is complete at
`/var/www/asymmetri-rollback-20261021-88ba5ab`. No rollback was required.

## Engineering impact

Only the website service restarted. Other services, all 55 configuration
fingerprints, receiver data/authority, Google data and app release state remain
unchanged. The website still describes private TestFlight testing and pending
public App Store availability. Requests are distinct from sent invitations.

## Files changed

- Added the deployment receipt with exact source/build, capacity, archival,
  public acceptance and rollback evidence.
- Linked that receipt from the deployment guide.

## Documentation updated

`docs/MOTION_ACCESS_RELEASE_2026-10-21.md` is the release receipt;
`docs/DEPLOYMENT.md` points to it. No application or deployment procedure changes
were needed during activation. Private scripts, logs and artifact receipts stay
outside tracked source.

## Git diff summary

Two documentation files changed, 144 insertions. These record the accepted
deployment without including generated artifacts or this journal in the totals.

## Verification

- Clean local `main`; fast-forward pull succeeded. Production was clean at
  `88ba5ab`; the exact incoming range matched the access implementation/journal.
- Prior local TypeScript, lint, Next.js fallback build, Vinext, zero-vulnerability
  audit and six-width UI checks remain recorded in Prompt 108. No dependencies or
  application source changed during this deployment.
- Linux production-profile `npm run check` and webpack Next.js build passed.
  Existing tutorial lint/Browserslist notices remain. All 455 source hashes and
  the transferred artifact hash matched through the build/install chain.
- Builder and production resource guards passed without lowering their floors.
  Independent dependency copies and guarded loopback smoke preceded activation.
- Candidate: twelve routes, eight protected host/route checks, both 307 targets,
  all three CTA placements, policy date and 24 tutorial assets passed. All 124
  previous tutorial IDs were retained. Support, tutorial, Trade and closed Ask
  main content matched the predecessor.
- Public: eighteen route/domain checks, 27 asset byte comparisons and six legacy
  redirect checks passed. Both apex and www clean signup URLs return the exact
  published Google Form with HTTP 307. Canonicals/context links remain correct.
- Browser: live Motion/Sports at mobile, tablet and desktop widths showed no
  overflow, broken loaded images or website console errors. Existing per-site
  zoom required checking actual CSS widths (390, approximately 768 and 1440).
  Keyboard focus, live privacy disclosure and navigation to the published form
  passed; no response was submitted. Viewport overrides were reset.
- Thirteen other virtual-host response baselines, all 55 configuration hashes
  and peer-service identities were preserved. Website ownership, source/build,
  clean state and zero automatic restarts passed. The old process's stop exit
  143 was distinguished from the successful new startup. The log collector's
  initial timestamp format was corrected for the host; final log review passed.
- The older `d0c4543` rollback archive passed sync/gzip, server/local size and hash
  equality, and full GNU tar content/metadata comparison before its duplicate
  directory was retired. The exact archive remains privately available.
- The task-owned disposable Linux builder was removed after receipts were
  retained; no live or prior builder directory was removed. The complete current
  and immediately preceding website runtimes remain on production.
- `git diff --check` and staged checks passed. Receipt-only changes do not require
  repeating application builds.

## Repository state after implementation commit

Clean `main` at `7bd190b061d5824e98bdda2d069336c86c2b6a8b`, one documentation commit
ahead of origin before this journal. Production is clean at compiled source
`c4cefd9`. The normal push follows the separate journal commit. No feature branch,
Git worktree, PR or merge was created.

## Implementation commits

- `7bd190b061d5824e98bdda2d069336c86c2b6a8b` — Record the Motion access website deployment

## Archive commit

`Record the Motion access deployment journal`

## Lessons learned

Keep independent staging and the required resource floors when redirects change.
Verified archival can preserve old recovery material while restoring capacity.
Record the serving build separately from post-release documentation, and continue
to distinguish a public signup route from beta availability and app publication.
