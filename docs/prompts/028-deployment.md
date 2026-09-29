# Prompt 028: Deploy the human-voice redesign

- Date: 2026-09-29
- Scope: deployment
- Goal: Publish the reviewed redesign to the existing production website for the owner to assess.

## Original user request

> just deploy. i will see how i like in prod

## Scope

Deploy the redesign recorded in prompt 027 to the existing DigitalOcean service.
Validate production, retain a complete rollback and record the result. No further
design changes, dependency remediation, infrastructure changes or Sites publishing.

## Decisions

- Use the existing SSH routes and standing Node 22 approval.
- Build an independent candidate as the application owner while the previous
  release continues serving. Copy unchanged dependencies independently after
  verifying package and lockfile equality; do not share dependency inodes.
- Activate the complete candidate after checks and loopback smoke tests, retaining
  the complete previous application directory for rollback.
- Keep exact server paths and build identities in an external release receipt.
- Preserve all Motion resources and distinguish source HEAD from running build
  identity when subsequent documentation-only commits advance main.

## Implementation

Activated the clean source release 08862c3d439ea007db5dfbb4e657e94c44afb873 at
08:44 UTC. The service serves the new editorial design through both public hosts.
The previous complete release remains available for rollback.

## Engineering impact

Production now serves the design and copy from prompt 027. Existing service,
loopback port, Nginx, DNS, TLS, runtime and dependency versions are unchanged.
Only the Asymmetri service was restarted. No private application data was published.

## Files changed

Deployment documentation adds a dated verification record. Application source and
assets are unchanged by this deployment request.

## Documentation updated

Deployment records the activated source, candidate validation, public checks and
rollback retention. An external receipt preserves precise operational identities.

## Git diff summary

1 file changed, 17 insertions. A concise release record was added to Deployment.
This journal is excluded from its own diff summary.

## Verification

- Local main was clean and its fast-forward pull succeeded before work.
- Production source, branch, runtime, dependency equality and available capacity
  were checked before staging. Existing protected routes passed baseline checks.
- Independent production candidate passed npm run check and npm run build:next.
- Candidate loopback smoke checks passed before activation.
- Activated loopback, apex and www each passed nine pages, 37 image/static URLs,
  four compatibility redirects, canonical values, nine sitemap entries, ten
  tutorial modules, protected product titles, hashes and footer resource links.
- Desktop and mobile public browser checks showed the new design. Mobile homepage,
  Sport and Motion had no horizontal overflow. Homepage images and console passed.
- Motion loaded no iframe before a click, created the expected privacy-enhanced
  YouTube iframe after a click and removed it on Close player. This verifies the
  wrapper, not end-to-end third-party video playback.
- The service is active and enabled on its existing loopback port. Startup reached
  ready state; the prior process's stop exit was expected during the restart.
- git diff --check passed. No application rebuild is needed for receipt-only edits.

## Repository state after implementation commit

Local main at f711300fed0c32540dd68738e4f3b1717b3135d5, clean and one commit ahead
of the last observed origin/main. Production was activated from 08862c3. Journal
commit and push follow, with a documentation-only production fast-forward planned.
No feature branch, worktree or pull request was created.

## Implementation commits

- f711300fed0c32540dd68738e4f3b1717b3135d5 — docs: record editorial redesign production release.

The deployed application changes were already committed and journaled under prompt
027; this task created no additional application implementation commit.

## Archive commit

`docs: journal human redesign deployment`

## Lessons learned

Keep candidate build output separate from the live application and preserve the
complete previous release. Verify protected app links on both public hostnames.
Record source and build identities separately for documentation-only updates.

## Follow-up ideas

The owner will review the live design. Further adjustments depend on that feedback.
