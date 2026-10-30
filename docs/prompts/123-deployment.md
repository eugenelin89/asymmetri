# Prompt 123: Surrey Adventure V0.1 verified production deployment

- Date: 2026-10-30
- Scope: deployment
- Goal: Release the tested Surrey adventure while preserving Vancouver and the running site's recovery path.

## Original user request

> Prepare and, where the existing authorized workflow and verification permit, deploy to production using `docs/DEPLOYMENT.md` and `docs/CLI_ACCESS.md`.

The supplied Surrey brief explicitly asks for a dedicated feature branch, coherent
commits, local/production verification and deployment when existing safeguards
pass. Preserve the running website, Vancouver and rollback capability; change no
unrelated infrastructure or services. If blocked, retain the candidate and report
the exact blocker. Journal 122 records the complete development scope and decisions.

## Scope

Exact-source Linux artifact, capacity preparation, isolated server acceptance,
main synchronization, whole-directory activation, public/browser verification
and release/recovery documentation. No application code changed after the tested
implementation; no infrastructure, dependency or credential change was needed.

## Decisions

Use the existing read-only GitHub Actions workflow and approved Node 22 runtime.
Run Surrey tests through the existing Next build hook. Keep the 192 MiB memory
and 6 GiB disk floors. Preserve full current and all Vancouver rollback trees.

Archive four older inactive runtimes only after owner-held lossless copies,
matching SHA-256, gzip verification, full remote tar comparison and a fresh
inactivity/source/build/config-reference audit. Shared hard links made the first
archive recover only about 65 MiB, so verify and archive the three remaining older
copies together. Do not count apparent directory size as unique disk recovery.

Main concurrently received Vancouver's final deployment journal. Its untracked
local file matched the published blob exactly; retain an external copy and merge
the published commit without changing its bytes. Merge `34dabb3` adds only that
journal to Surrey's tested source. Keep production at exact artifact `883ebfe`,
verify it is an ancestor of main and allow only that known documentation difference.
No branch history was rewritten or force-pushed.

## Implementation

Activated `883ebfe5d81a191b9d73e6fd183ec2d589d88be6`, Linux build
`Ph1NW42c_br8k4AmOXJQ4`, on October 30 at 16:52:39 UTC / 09:52 PDT.
Successful workflow `41091571023`, artifact `12994736532`; runtime tar SHA-256
`666d4154966b676835c1de0902b3da739e4878e042c51b04679b485573a6220c`.
The feature branch and main contain the implementation. Subsequent release
documentation is not a new production runtime identity.

## Engineering impact

Surrey is publicly playable with the complete first mission, optional danger,
NPCs, mini-map, HUD and keyboard/touch controls. Only the website process was
stopped and started. The preceding V0.3 source/build/dependencies remain whole;
V0.2, final V0.1 and pre-Vancouver recovery are also retained. No rollback was
needed or claimed as a completed drill. Source/runtime/configuration boundaries
remain as documented before this task.

## Files changed

The release record captures exact identities, measured acceptance, archived
runtime hashes, recovery procedure and known limitations. Deployment and Surrey
project guides link to the completed record and public game.

## Documentation updated

`docs/SURREY_RELEASE_2026-10-30.md`, `docs/DEPLOYMENT.md` and
`projects/surrey/README.md`. Private operational evidence and screenshots remain
outside Git; no credentials, private attachment locations or logs are published.

## Git diff summary

Release documentation: three files, 128 insertions. Earlier implementation:
28 files, 4005 insertions and five deletions. The synchronization merge preserves
the unrelated 119-line Vancouver journal, with no application changes.

## Verification

Local TypeScript/ESLint, 17 Surrey tests, 25 Vancouver tests, seven investment
tests, zero-vulnerability production audit, Next/Vinext builds and diff checks
passed. Exact-SHA Linux checks, Surrey/Vancouver tests, audit and build passed.
Isolated production-owner smoke checks verified protected routes, 124 tutorial
IDs, 24 tutorial assets, native image optimization, source/build identity,
Surrey assets and every published Vancouver snapshot.

Public apex and www each passed 13-route and protected-content comparisons;
Surrey/Vancouver hashes, Labs/sitemap and Motion redirects passed. Five peer
service identities, 55 config hashes, 13 unrelated virtual hosts and Node binary
were unchanged. Guarded preparation stayed above 289.1 MiB available memory and
6.398 GiB free disk. The website was enabled/running with zero restarts and no
post-activation errors; the old shutdown's expected exit-143 entry is distinguished.

The entire live backpack mission was played with normal keyboard controls,
ending in CASE CLOSED and $55 after the $35 reward. Observed rendering was about
60 FPS, with one canvas and no application console errors. Local responsive
checks covered five viewport sizes, held touch movement, camera, Lite, map,
pause/resume and route cleanup. Physical-phone, thermal/multi-touch, forced
GPU-loss and long-session acceptance remain limitations, not claimed tests.

## Repository state after implementation commit

Release documentation commit `ac02eec` is on `codex/surrey-adventure-v01` after
merge `34dabb3`; the working tree was clean. Main and the feature branch were
already at the synchronized implementation before these final records. Push both
normally after this journal. Production intentionally stays at tested `883ebfe`.

## Implementation commits

- `22ded9f` — feat(surrey): add playable City Centre adventure and introductory mission
- `34dabb3` — merge the already published Vancouver journal without runtime changes
- `ac02eec` — docs(surrey): record verified V0.1 production release

## Archive commit

`docs(journal): record Surrey Adventure V0.1 production deployment`

## Lessons learned

Keep exact artifact provenance distinct from later documentation commits. Recheck
main immediately before publication and preserve concurrent work. Retain verified
complete archives before reclaiming inactive runtimes; hard-link accounting and
private loopback acceptance both matter on a small shared server.

## Follow-up ideas

Richer source-backed landmarks/street detail, physical-phone input/performance
acceptance, then a second complete investigation and stronger NPC avoidance.
