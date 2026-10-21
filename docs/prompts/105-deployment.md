# Prompt 105: Deploy the Sports and Motion v1.2 website refresh

- Date: 2026-10-21
- Scope: deployment
- Goal: Publish the accepted Sports/Motion refresh on the existing production website with verified recovery and product-resource continuity.

## Original user request

> deploy

This follows the completed request to update Sports and Motion from Asymmetri
Motion v1.2. Prompt 104 records the content implementation and local checks.

## Scope

Deploy the already committed website refresh to the existing DigitalOcean service.
Verify the candidate, public pages and protected Motion resources; retain rollback
and record acceptance. The iPhone release, receiver services, HQ, private data,
runtime settings and other hosted sites are outside this deployment.

## Decisions

- Use the existing explicit deployment authorization and standing Node 22 approval.
  Keep the documented unsupported-OS exception and existing infrastructure intact.
- Compile on the reserved Linux builder using the exact production Node binary and
  matching native package, then verify artifact and source hashes on production.
- Reuse unchanged dependency files read-only without installing or changing them.
  Keep independent source/build files and retain the entire preceding runtime.
- Restore the required disk headroom by losslessly archiving one older inactive
  rollback to durable private owner storage. Verify integrity, size, checksum and
  complete tar comparison before retiring only that redundant directory.
- Keep deployed source identity separate from later documentation-only commits.
  Website publication continues to state that Motion is in private TestFlight,
  with public App Store availability pending.

## Implementation

Activated clean source `d910b3310ccc29153dcbcd19f694fe1bd18f23a5` with Next.js build
`iB59CwD3RhwJqKcC-I-2o` at 19:22:15 UTC / 12:22:15 Vancouver. Only the website
service restarted. The prior `ff3c5f1` runtime remains complete at
`/var/www/asymmetri-rollback-20261021-ff3c5f1`. No rollback was needed.

## Engineering impact

Sports, Motion, tutorial and support copy now serve the accepted refresh publicly.
No dependency, route, public asset, redirect, infrastructure or authority changes
were introduced by deployment. All 55 configuration fingerprints and unrelated
service identities were preserved. Initial disk capacity was restored without
discarding the archived recovery material.

## Files changed

- Added a release receipt containing source/build identities, resource acceptance,
  verified archival, public/browser checks and rollback instructions.
- Linked the receipt from the deployment guide.

## Documentation updated

`docs/MOTION_V12_RELEASE_2026-10-21.md` records the actual accepted deployment.
`docs/DEPLOYMENT.md` points operators to it and retains the App Store distinction.
No application source changed in this deployment-record commit.

## Git diff summary

Two documentation files changed, with 135 insertions. The release receipt and
deployment entry point contain the complete acceptance summary; this journal is
excluded from those totals.

## Verification

- Local `main` was clean and fast-forward synchronization succeeded. Production
  was clean at the immediately preceding release; package, lockfile, runtime and
  asset equality were checked before staging.
- Linux `npm run check` and Next.js webpack build passed. The existing tutorial
  lint warning and Browserslist data-age advisory remain. Prior local checks,
  both build targets and zero-vulnerability production audit are in Prompt 104.
- All 449 source hashes and the build artifact hash matched across the release
  chain. Builder and production resource guards passed without changing peers.
- Candidate: twelve routes, eight protected route/host checks, 24 tutorial assets,
  116 preserved tutorial DOM IDs and four new step IDs passed. Privacy, Trade and
  closed Ask main content matched the previous serving version.
- Live: sixteen HTTPS route/domain checks and 27 public image/brand byte checks
  passed. Canonicals, context links and protected Motion resources remain useful.
  All thirteen other virtual-host response baselines were unchanged.
- Browser: Sports, Motion and Tutorial passed 390/768/1440 px checks without
  overflow, broken loaded images or console errors. Tutorial deep links and module
  navigation focused visible destinations. Temporary browser state was cleaned up.
- The new website process remained active with zero automatic restarts. The old
  process's deliberate-stop exit 143 was distinguished from successful replacement
  startup. Nginx, Investment, Ask and inactive gunicorn identities were unchanged.
- The archived older rollback passed local sync/gzip, server/local size and SHA
  equality, and full content/metadata comparison before retirement. Receipts and
  a live desktop preview are retained privately outside Git.
- `git diff --check` passed for the documentation. No build repetition is needed
  for the receipt and journal alone.

## Repository state after implementation commit

Clean `main` at `2c809fc7838f1fc33b63ee65f5a23dc07c8fae14`, one documentation commit
ahead of origin before this journal. Production is clean at the separately
recorded compiled source `d910b33`. Push follows the journal commit; no further
production restart is needed.

## Implementation commits

- `2c809fc7838f1fc33b63ee65f5a23dc07c8fae14` — Record the Sports and Motion v1.2 website deployment

## Archive commit

Record the Sports and Motion deployment journal

## Lessons learned

Retained full runtimes consume meaningful capacity on the small host. Preserve
recovery evidence through verified archival instead of lowering resource floors.
Separate build, website publication and App Store availability in both operational
records and public product copy.

## Follow-up ideas

None scheduled. Future releases should continue the documented resource,
compatibility, privacy and rollback checks.
