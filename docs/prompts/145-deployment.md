# Prompt 145: Surrey V0.5 production acceptance and release handoff

- Date: 2026-10-30
- Scope: deployment
- Goal: Publish the verified Surrey driving release while preserving all peer applications and a complete immediate rollback.

## Original user request

> Follow the existing guarded Linux release procedure.
>
> Preserve the existing public website, Vancouver, Richmond if integrated, Motion, BotSquad, GIS Apps, historic geographic snapshots, existing game saves and complete production rollback.

Continuation of the V0.5 brief archived in journal144. The user authorizes deployment
and coordination after local implementation and acceptance, with explicit limits on
infrastructure changes and truthful physical-phone reporting.

## Scope

Exact-source Linux candidate, independent server staging, protected routes/assets,
capacity/config/service guards, one Asymmetri activation, release documentation and
handoff. No additional game code or peer implementation changes in this receipt.

## Decisions

Richmond handed off approved main2618089 and runtimebe6fc3b. Vancouver confirmed no
competing window. Surrey retained Richmond's prebuild tests and integrated as
implementation866f2fe plus journal144/fcd2b90. CI41143061313 built that exact revision.
No local Mac artifact or production build was substituted. The complete preceding
runtime remains available for immediate whole-tree recovery.

## Implementation

Activated V0.5 at 23:20:24 UTC, sourcefcd2b900b512652a94af07571b841e823c61d2de,
Linux buildVaAKfIoEAK5LbGri4K8V8, Node22.23.1. Complete immediate rollback:
`/var/www/asymmetri-rollback-before-surrey-v05-20261030`, sourcebe6fc3b,
buildgIRztyRG7Pdh1DR3AAHQR (Richmond V0.1 + Vancouver V0.5 + Surrey V0.4).
Artifact SHA2568690e9537824d1039ec70192ba033958d9596f302fe10ebbd82c422f7dc495b5.

## Engineering impact

The public route now serves the tested car/delivery/traffic/train release. Only
Asymmetri restarted. Peer services, 55 configuration hashes, 13 virtual hosts and
the Node binary remained unchanged. No OS, DNS, TLS, database or dependency change.
Existing snapshots and saves remain intact. Documentation commits are later than
and separate from the deployed runtime identity.

## Files changed

Two documentation files: V0.5 release receipt and deployment guide.

## Documentation updated

The release receipt records actual source/build/artifact/rollback identities,
private/public checks, capacity evidence and browser limitations. Deployment guide
points to the current runtime and complete recovery path.

## Git diff summary

2 files changed, 67 insertions and 20 deletions. Replaced candidate-only status with
verified deployment evidence and the exact remaining visual/physical-device limits.

## Verification

- Integrated local147 tests: Surrey54, Richmond27, Vancouver59, investment7.
- Check, audit (zero vulnerabilities), Next webpack and Vinext builds pass.
- Exact Linux CI succeeds; ZIP/tar/source/Node/build identities verified before use.
- Independent checkout/extraction/private smoke guards pass; no resource guard fires.
- Private16 routes,8 protected host checks,24 tutorial assets,124 retained IDs,
  image optimizer,688 Richmond outputs and all Surrey snapshots pass.
- Public apex/www each pass16 routes and24 tutorial-image comparisons;56 additional
  city, immutable-geography and redirect checks pass. Protected content is unchanged.
- Final health23:21:19 UTC:343152KiB available,9619501056 bytes free, active/running/
  enabled,0 automatic restarts and0 post-activation errors. Prior shutdown exit143
  is expected during the controlled swap. Complete immediate rollback verified.
- Actual local browser delivery, aerial freeze, reload and compact held phone controls
  passed as detailed in journal144. Browser requests later timed out; post-deploy
  visual recheck and confirmation of attempted viewport reset remain unavailable.
  Physical iPhone/Android acceptance remains outstanding. No live-browser claim.
- Local preview stopped. Server/local release receipts and valid screenshot evidence
  retained outside Git. Documentation diff check passes; no further build is required
  for these documentation-only receipt changes.

## Repository state after implementation commit

Branch `codex/surrey-adventure-v05`, receipt commit 2f00a769b783834f21458abdd31ae9e6a995f754. Runtime remains
fcd2b90. Implementation and journal144 already pushed to main; this receipt and
journal145 are pushed next without rewriting history. Release window then returns
to coordinated city development; journal146 is the next unused number.

## Implementation commits

- `866f2feed06a83016707e46bcc89b2a08136259b` — Surrey driving implementation.
- `2f00a769b783834f21458abdd31ae9e6a995f754` — Record Surrey V0.5 production release and complete Richmond rollback.

## Archive commit

`Archive Surrey V0.5 production acceptance and handoff`

## Lessons learned

Keep browser-playthrough, exact Linux artifact, public HTTP checks and physical
phone acceptance as distinct evidence. A later browser-connection failure does not
erase a completed local playthrough, and cannot be reported as a passing live visual
check. Whole-runtime rollback preserves the new peer application alongside Surrey.
