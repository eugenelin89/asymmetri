# Prompt 154: Deploy and verify UBC campus life

- Date: 2026-10-31
- Scope: deployment
- Goal: Publish the verified campus-life update with working public profiles and preserve existing services.

## Original user request

> ok I am going to bed. you are authorized to make any decision. deploy it right away when you are done.

> I am going to bed. you are authorized to make decision. please complete the project without me. good night

This continues the master project and follow-up scope summarized in journal 152.
The public profile routing correction is recorded in journal 153.

## Scope

Exact-source Linux deployment, persistent UBC profile storage, protected-route and
peer checks, real browser validation, production receipt and current documentation.
The full photorealistic campus master plan remains incomplete; the release is an
explicitly labelled research preview with seven reconstructed public interiors.

## Decisions

Use the existing Node 22 deployment authorization and independent candidate workflow.
Preserve the 192 MiB memory/6 GiB disk guards, shared ingress authority, unrelated
services and complete predecessor runtime. Store profiles outside release trees.
The first public API failure triggered restoration of V0.2; the corrected ordinary
website path passed public HTTPS recovery and ownership checks on both hostnames.

## Implementation

Runtime source `cdc2ba3d8e86566633119658151108689dc21cae`, Linux build
`gRKOgO5gYIKwm9Z0g4amq`, activated 10:36:03 UTC. Exact artifact hash and successful
workflow are in the release receipt. Christopher Lin's authorized profile persists
privately; no recovery credentials are published. Final screenshots show rendered
third-person exploration, enabled profile form and walking guidance.

## Engineering impact

Only Asymmetri restarted. The original 55 configuration files stayed unchanged;
one scoped profile-directory environment drop-in was added before the corrected
56-file baseline. Peer service identities, 13 virtual hosts and Node stayed intact.
Rollback remains complete and independent from persistent community data.

## Files changed

Production receipt, root onboarding, deployment/testing/asset documentation, current
V0.3 implementation status and the 22-image validation gallery (one corrected image,
two added public captures).

## Documentation updated

Exact runtime/artifact/rollback identities, public validation and observed limits;
profile-test payload and rate-limit behavior; source/build versus later documentation
commits; incomplete coverage and five highest-value next improvements.

## Git diff summary

10 files changed, 142 insertions and 11 deletions, including one new release receipt,
two PNGs and replacement of a paused-background screenshot with the rendered scene.

## Verification

- 199 application tests, TypeScript/lint, Vinext/Next builds and zero-vulnerability
  production audit pass. Existing tutorial lint warning remains.
- Private candidate: 17 routes, eight protected-host checks, 24 tutorial images,
  124 tutorial IDs, image optimization, 688 Richmond outputs and six UBC assets.
- Public apex/www: 17 routes and 24 images each, protected-content comparisons,
  plus 64 extra asset/copy/redirect checks.
- Profile public projection, anonymous isolation, CSRF, valid-body ownership
  rejection, recovery POST, owner GET and secure scoped cookies pass. Malformed
  writes return 400; repeated invalid creates reach the expected 429 rate limit.
- Browser: live rendered scene, third person, run/turn, enabled profile form,
  map guidance/distance and safe immediate travel; zero console errors/warnings.
- Final server: active/running/enabled, no automatic restarts, no post-activation
  errors; complete rollback, 56 unchanged config hashes and 13 unchanged peer hosts.
- Documentation links, image count, credential scan and diff check pass. Local
  preview servers stopped; no further application change after validated artifact.

## Repository state after implementation commit

Main at c519ed8e0a8868c9301ca8b019c29ec4295b23ec, clean before this journal. Production remains the exact runtime
source above; later receipt commits do not silently change it. Push both doc commits.

## Implementation commits

- c519ed8e0a8868c9301ca8b019c29ec4295b23ec — Record verified UBC campus life production release

## Archive commit

`Record UBC campus life deployment journal`

## Lessons learned

Validate actual public ingress, not only private candidate responses. Send valid
payloads when testing authorization, and retain rate limits when repeated test
requests exhaust them. A hidden browser can deliberately pause WebGL; verify the
rendered screenshot before using it as visual evidence.

## Follow-up ideas

Measured PBR/terrain assets, complete faculty coverage with refreshed rosters,
expanded Sauder/residence interiors, animation/performance on physical devices,
and continuous surrounding pedestrian geography remain the five priorities.
