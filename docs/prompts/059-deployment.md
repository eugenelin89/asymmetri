# Prompt 059: Release the observed-paper website

- Date: 2026-10-13
- Scope: deployment
- Goal: Publish the accepted website and verify protected routes and shared-host continuity.

## Original user request

> just proceed to deployment and public release when ready. no need to ask me for approval.

> i will be away. you are authorized for everything you need.

The owner authorized continued website work coordinated with the BotSquad chat.
Journal 058 records the implementation intent and accepted website source.

## Scope

Release exact website source `97b4087b79c5f0f1472fd71dde86765489273400` through
the existing DigitalOcean service. Record actual production checks and rollback.
Receiver, publisher and Ask activation remain separate work.

## Decisions

Use a complete isolated application-owned candidate; keep the serving release
intact through validation. Preserve the approved Node 22 runtime, existing service,
Nginx and unrelated sites. Production npm 10 rejected the reviewed lockfile, so use
pinned one-shot npm 11.6.0 matching successful local installation. Do not modify
the lockfile or global package manager during deployment.

## Implementation

Candidate checks and Next build passed. At 15:04:43 UTC the existing website service
switched to the validated complete directory. Build is `kcKfT0zA-jDnr0xVy1Suy`.
Previous source `745a92c676bcbe85c3aa675a1099d26321f1c1e2` and build
`Ic-zxi4WHpmgjiSDnsJCw` remain in an independent complete rollback directory.
The temporary loopback candidate listener was stopped after activation.

## Engineering impact

Investment, methodology and disabled Ask pages are public. The investment page
explicitly has no configured public archive. No synthetic run, genuine employee
activity, publisher authority or financial result is inferred. Motion continuity
and the shared server's configuration are preserved.

## Files changed

Three operational documents record the public release, replace stale undeployed
descriptions and explain the candidate-only package-manager compatibility step.

## Documentation updated

`INV-REAL-01-WEBSITE.md` contains source/build identity, rollback location, verification
and remaining integration. `DEPLOYMENT.md` reflects the current release and pinned
npm procedure. `BOTSQUAD_INTEGRATION.md` separates public website from inactive data
and visitor services. Historical journals and acceptance records stay unchanged.

## Git diff summary

3 files changed, 44 insertions and 8 deletions; documentation only. The running
release remains pinned to `97b4087`; these later docs do not alter its build identity.

## Verification

Production check and Next build pass with the existing tutorial lint warning.
All 28 public route checks return 200 across apex/www. Tutorial exact www canonical,
anchor IDs and image URL sets match baseline; all 48 image requests return image/200.
A concurrent Mac image probe hit a TLS timeout; the complete server-side public HTTPS
probe passed. All 15 discovered shared-host health results and Nginx configuration
hashes match baseline, including existing draft 502 and two relay 410 responses.
Website/Nginx active; no release-window service errors. Public desktop/mobile checks
show no overflow, broken images or console errors. Temporary viewport reset.
Sanitized baselines and screenshots retained outside source. Documentation whitespace
check passes; no redundant application rebuild for documentation-only changes.

## Repository state after implementation commit

Main at `ef5f93b`; three documentation changes committed, journal pending. Clean
main was refreshed with successful fast-forward-only pull before editing. No branch,
worktree, PR, forced update or unrelated-file changes.

## Implementation commits

- `ef5f93bdf6f5ba180edf9f3b839eb238395ecbce` — Record verified investment website production release.

## Archive commit

`Journal the verified investment website release`

## Lessons learned

Treat source SHA, built artifact, serving process and live content as separate
release evidence. An incompatible deployment package manager can be isolated
without changing source or the server's global runtime. Public availability does
not establish genuine producer readiness.

## Follow-up ideas

Complete receiver operational controls, strict ingress and private Ask source.
Keep actual observed publication held until producer account access is repaired
and accepted end-to-end records exist.
