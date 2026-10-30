# Prompt 128: Vancouver V0.4 production release

- Date: 2026-10-30
- Scope: deployment
- Goal: Publish the verified Beyond the Loop release while preserving server capacity, peer services and complete recovery.

## Original user request

> Proceed autonomously with V0.4. Implement, test and deploy if safe.

This is the release phase of the owner's Vancouver V0.4 — Beyond the Loop brief.
Journal 127 preserves the complete decision-oriented request and implementation
acceptance. The owner explicitly authorized implementation, tests, commits, main
push and deployment, with at least three additional manually driven routes,
bounded/licensed geographic improvement, honest mobile/performance evidence,
optional bridge work and mandatory production safeguards. The full prior runtime,
192 MiB available-memory floor and 6 GiB free-disk floor must remain intact.
No unrelated service, OS, Nginx, DNS or TLS changes are authorized by this release.

## Scope

Exact-source Linux artifact verification, independent application-owned candidate,
private acceptance, website-only activation, apex/www and browser checks, complete
rollback retention, release documentation and owner-held evidence. The coordinated
GIS Apps grouping is included and Surrey V0.2 is preserved. No Richmond work or
shared game-module extraction is part of this release.

## Decisions

- Use the final implementation journal SHA 313dba3 as the exact build/source
  identity; CI success supplements rather than replaces production checks.
- Re-read the actual live baseline: Surrey V0.2 at 52f4451, rather than assuming
  the preceding website is still the original Vancouver V0.3 release.
- Keep one deployment owner while the GIS task independently verifies the public
  result. Preserve both original city URLs and the Vancouver in Progress card.
- Archive only the older inactive V0.3 runtime after verified owner storage,
  hash/gzip checks and complete remote tar comparison; retain the immediate live
  and rollback trees in full. Do not lower capacity thresholds.
- Use a complete-directory runtime swap with automatic restoration on activation
  failure. Do not copy Mac dependencies or compile inside the serving tree.
- Keep release evidence separate from later documentation-only commits. The
  production runtime remains the verified 313dba3 build after these docs are pushed.

## Implementation

The successful Linux CI run 41110651124 / job 124251878146 produced artifact
13003008184 for source 313dba357ecc00f1de28b8db5d2c326ec9d1125e.
ZIP and runtime tar hashes, source SHA, Node v22.23.1, safe archive paths and build
identity were verified before extraction into an independent checkout. The native
Linux candidate passed private route/content/data/image checks and stopped cleanly.

Activation completed at 18:59:32 UTC with Next build Zaa4FN3iARR31Yquw4Cij.
The preceding full runtime is retained at
`/var/www/asymmetri-rollback-before-v04-20261030`, source
52f4451752c2995a7f397a022090a42a821b31a0, build kpnCoQ9y6YEz8nDG63G0n.
Only asymmetri.service was restarted. No rollback was required.

The public city rendered, accepted manual input and showed all three additional
routes. GIS Apps links reached both original city URLs. Before/after and manual
route screenshots, browser metrics, artifact checksums and root-owned release
receipts are retained in owner storage. Temporary test viewport overrides were
reset and only the task's verified local port-3104 server was stopped.

## Engineering impact

The released behavior, data provenance, manual-route limitations and mobile gaps
are documented in journal 127 and the V0.4 release report. This phase changes no
application source, dependencies, schemas or public assets. Public checks confirm
continuity for protected Motion resources, BotSquad content, Surrey and published
Vancouver snapshots. Capacity safeguards and existing administrative boundaries
remain unchanged. The full rollback would also restore the preceding navigation,
so recovery is a whole-website operation rather than a partial game-data switch.

## Files changed

- V0.4 release report: exact CI/source/build/artifact identities, candidate/public
  verification, capacity measurements, recovery procedure, evidence and V0.5 priorities.
- Deployment guide: current release pointer and updated Vancouver release history.

## Documentation updated

`docs/VANCOUVER_V04_RELEASE_2026-10-30.md` records completed publication and honest
remaining limits. `docs/DEPLOYMENT.md` points to the current runtime receipt and
makes clear that documentation-only pushes do not change the serving identity.

## Git diff summary

The release-documentation implementation commit changes two files with 130
insertions and nine deletions. It replaces pending release language with verified
production evidence and preserves historical release records. The earlier feature
commit contains the application/data implementation and its affected documentation;
its file groups and verification are recorded in journal 127.

## Verification

- Final integrated source: 43 Vancouver, 29 Surrey and seven investment tests;
  Next webpack and Vinext production builds; TypeScript/ESLint; zero production
  audit vulnerabilities; source checksums and immutable snapshots. Existing
  tutorial navigation/build notices are documented, not hidden.
- Linux exact-SHA CI completed successfully. Node/source/build receipts and ZIP/tar
  hashes match after download and server transfer; no production secrets entered CI.
- Candidate: 14 general routes plus Vancouver, all four Vancouver city/manifest
  pairs, all Surrey data hashes, GIS cards/links, native Sharp HTTP 200, eight
  protected-host checks, 124 tutorial IDs and 24 tutorial assets. Separate 14-route
  main-content/canonical/link/hash comparison passed.
- Resource guards all exited zero, with service identities unchanged. Lowest
  candidate available memory 275704 KiB (269.2 MiB); minimum candidate free disk
  6978588672 bytes (6.499 GiB), above unchanged floors.
- Public: 14 routes and 24 tutorial assets on each host; 30 additional HTTPS
  page/redirect/Vancouver-asset checks; live rendering and short manual drive;
  browser GIS links reach both original city URLs.
- Independent GIS verification reported 16 page checks, 68 asset hashes, four
  redirects and Labs→GIS→both city browser navigation passing.
- Health at 19:03:13 UTC: enabled/active/running website, zero restarts and zero
  post-activation journal errors; expected old shutdown exit 143 separated.
  Five peer identities, 13 vhosts, 55 configuration hashes and Node hash unchanged.
  Available memory 411420 KiB; free disk 6978441216 bytes. Rollback and pre-Vancouver
  runtime remain complete and executable.
- No physical phone benchmark is claimed; native tab backgrounding, hardware
  multitouch, thermal and battery tests remain open. Cambie is view-only. Initial
  manual route contacts/recoveries are disclosed; north reverse was collision-free.
- Release documentation whitespace and scoped privacy/secret scans pass. No
  further code build is required for these documentation-only changes.

## Repository state after implementation commit

Main branch in the dedicated ordinary checkout, clean after implementation commit
92cbc4c73bac2b93edcee49ec2c4d13694e84582. This documentation commit is one ahead of remote 313dba3;
the journal is committed separately before the ordinary fast-forward push.
The original shared checkout and other tasks' source are untouched.

## Implementation commits

- `e1b97b6eef9d08d4e3724944bc438e2e0f4c462c` — Vancouver V0.4 implementation and affected documentation.
- `92cbc4c73bac2b93edcee49ec2c4d13694e84582` — completed V0.4 production release receipt and deployment guide.

Earlier implementation journal: `313dba357ecc00f1de28b8db5d2c326ec9d1125e`, the
exact deployed source. GIS grouping was implemented by its separately authorized
task and included as reviewed main ancestry, not rewritten by Vancouver.

## Archive commit

`docs(journal): record Vancouver V0.4 deployment and recovery evidence`

## Lessons learned

Closely spaced website releases require a fresh live baseline and a single
activation owner. Artifact source identity and complete runtime custody matter
more than a clean source commit alone. Browser viewport tests and synthetic input
ownership tests must remain distinct from real-phone acceptance.

## Follow-up ideas

Physical iPhone/Android testing, clearer manual steering feedback, repeatable
collision-free route trials, trustworthy Cambie elevation/grade separation, then
bounded newer geometry and westward coverage. None are claimed as delivered here.
