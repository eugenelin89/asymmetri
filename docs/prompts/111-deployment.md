# Prompt 111: Deploy the direct Motion video player

- Date: 2026-10-22
- Scope: deployment
- Goal: Publish the direct Motion video player and corresponding privacy disclosure.

## Original user request

> is it deployed? if not, then deploy it

This follows Prompt 110, which implemented and pushed the change without deployment.

## Scope

Deploy the approved source through the existing DigitalOcean workflow, verify
public behavior and preserve rollback. No dependency remediation, app release,
receiver activation, infrastructure change or unrelated cleanup.

## Decisions

- Use the standing Node 22 approval and review the retained-host exception.
- Build on the reserved Linux host as its staging application owner using the
  verified production Node executable and native compiler, with resource guards.
- Use the documented unchanged-dependency copy-only model on production because
  routes, public asset bytes, packages and runtime configuration are unchanged.
  Reuse dependencies through hard links without installation or modification.
- Preserve the previous source, Git and build for recovery; restart only the
  website after private candidate checks pass.
- Keep deployed source identity separate from later documentation commits.

## Implementation

Source `228b04d81be11c57bf76ce7eb88695527ed7ea1c`, build
`teqbPSsBXS18D5heaFJcf`, was activated October 22 at 19:40:46 Vancouver.
Both hosts now show the native YouTube preview and Play button directly with no
autoplay. Updated media/privacy disclosures are live. The preceding source
`c4cefd9` and build `W4Yg_XIBAR3DSU1bd-kJJ` are retained at
`/var/tmp/asymmetri-direct-video-rollback-20261022`.

## Engineering impact

Only the website service restarted. Shared configuration and peer services are
unchanged. No dependencies were installed or changed. The existing critical
Next.js audit finding recorded in Prompt 110 remains a separate remediation
issue; this release makes no clean-audit or OS-support claim.

## Files changed

- Added a release receipt describing exact source/build identity, resource
  checks, live acceptance and rollback.
- Linked the receipt from the deployment guide.

## Documentation updated

`docs/MOTION_VIDEO_RELEASE_2026-10-22.md` records the accepted release;
`docs/DEPLOYMENT.md` links it. Operational scripts, logs, artifacts and screenshots
remain in private release storage outside tracked source.

## Git diff summary

Two documentation files changed, 103 insertions. No application source or
dependency file changed during deployment. This journal is excluded from that total.

## Verification

- Local `main` was clean and the fast-forward pull succeeded. Production was
  clean at the October 21 access release; incoming source and configuration
  equality were reviewed before staging.
- Previous local validation remains in Prompt 110. Linux `npm run check` and
  `npm run build:next -- --webpack` passed with only existing lint/Browserslist
  notices. Node/native compiler hashes matched production. All 458 source hashes
  and the build artifact hash/size matched across the transfer chain.
- Builder and production guards retained their existing memory/disk floors.
  Peer identities remained unchanged during preparation, building and smoke tests.
- Candidate: 12 routes, eight protected host/route combinations, both access
  redirects, 24 tutorial assets and 124 retained tutorial IDs passed. Support,
  Tutorial, Trade and closed Ask main content matched the predecessor.
- Public: 18 route/host checks passed. Both domains serve the direct iframe,
  correct video, no custom Load gate or autoplay, updated disclosure and policy,
  unchanged TestFlight access redirects, protected footer links and tutorial
  canonical. All 24 tutorial original asset bytes matched.
- Browser: the live native thumbnail and Play control appeared directly. Actual
  390, 768 and 1440 CSS-pixel widths had no overflow or missing alt attributes;
  focus remained on the body and no console errors were observed. Temporary
  viewport overrides were reset and the live page was left open for review.
- All 13 other virtual-host response baselines and 55 configuration fingerprints
  were preserved. Production is enabled, active, clean at the exact source/build,
  with zero automatic restarts and a successful bounded startup log.
- Rollback was retained without deleting an older release. Verified artifacts,
  source manifest, operational receipts, logs and browser evidence are saved
  outside Git. The task-owned Linux builder was removed after evidence retention,
  restoring free disk to 8,117,211,136 bytes.
- `git diff --check` passed. Documentation-only receipt changes need no rebuild.

## Repository state after implementation commit

Clean `main` at `7d1a4be0e9a0de202fadb95df9f7f058c31ec105`, one documentation
commit ahead of origin. Production remains clean at compiled source `228b04d`.
The journal is committed separately and both documentation commits are pushed.
No feature branch, worktree, PR or merge was created.

## Implementation commits

- `7d1a4be0e9a0de202fadb95df9f7f058c31ec105` — Record direct Motion video deployment

## Archive commit

`Record direct Motion video deployment journal`

## Lessons learned

Direct media loading needs matching live disclosure. Preserve the verified source
and build identity across Linux compilation and activation. Hard-linked dependency
reuse is appropriate only while the package graph and its installed files remain
unchanged; neither retained tree may be modified in place.
