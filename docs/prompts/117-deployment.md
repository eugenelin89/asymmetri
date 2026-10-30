# Prompt 117: Complete the overnight Vancouver release

- Date: 2026-10-30
- Scope: deployment
- Goal: Leave a publicly shareable Vancouver V0.1 with verified recovery.

## Original user request

> I am going to bed. You are authorized to make decisions. Please make sure it gets deployed so in the morning i can share this with friends.

This continues the explicit implementation and DigitalOcean public-release
approval summarized in prompt 113. Subsequent submenu wording requests and their
implementation journals are recorded in prompts 114–116; the final requested
wording is Vancouver in Progress.

## Scope

Complete guarded Linux deployment, safe recovery-asset retention, public and
shared-host validation, screenshots, release documentation and normal main push.
No OS, Nginx, DNS, TLS, Node binary or unrelated service changes.

## Decisions

Build off-host with the approved Node version; keep all production capacity
floors. Retain three older inactive runtimes as verified lossless owner-held
archives, preserving live and immediate rollback on-server. Activate complete
app-owned directories only after checks. Hold revised menu candidates until the
latest wording is built and verified. No additional user decision was required.

## Implementation

The first Vancouver release activated at 01:24 PDT. The final submenu update
activated at 01:49 PDT, source e909c8da9121f9f9179dfb3d71d78e0621805a85 and build
At28nruWgLtaH0vOlV-pM. The public URL is https://asymmetri.co/labs/vancouver.
Both the preceding Vancouver runtime and complete pre-Vancouver runtime remain
available for rollback. Release documentation records exact identity, evidence,
limits, licensing and recovery steps.

## Engineering impact

The 3D experience runs client-side within the existing website. Production
activation restarted only the website service. Resource guards, peer-service
identity and configuration hashes remained satisfied. The old wrapper's intended
SIGTERM produced exit 143; the new process has no subsequent error entries or
automatic restarts. No broad infrastructure maintenance was bundled.

## Files changed

A release record and a deployment-guide link. Private checksums, archives,
validation scripts and screenshots are retained outside Git.

## Documentation updated

The release record explains features, bounded City data, Linux artifact identity,
public/desktop/mobile checks, capacity, verified rollback assets, rights, known
limitations and V0.2 priorities.

## Git diff summary

2 files changed, 137 insertions in the release-documentation implementation commit.

## Verification

Exact-source Linux CI passed checks, six Vancouver tests, production audit and
Next build. Local Next/Vinext builds and seven investment tests passed earlier.
All 13 public page checks returned 200; protected content/canonicals and 24
tutorial asset hashes matched. Apex/www checks, legacy redirects, city/manifest
hashes and Linux native image optimization passed. The final label renders at
320/390 pixels and desktop with no horizontal overflow. Public driving, scene,
source panels and paused text work; browser error/warning logs were empty.
Five peer services, 55 configuration hashes and 13 other vhost responses were
unchanged. Final disk space was about 6.74 GiB with 406 MiB available memory.
Physical phones and forced WebGL loss remain untested; no production rollback
was needed. See the release record for exact measurements and limits.

## Repository state after implementation commit

Main at the implementation SHA below. Release documentation is newer than the
compiled production source; it requires no runtime redeployment. The tree was
clean before this journal. Implementation and journal push normally, without
force, branches or worktrees.

## Implementation commits

- bc81106b1245d092929e60a21ba8a088c6bbd800 — Document the Vancouver V0.1 public release and recovery

Earlier implementation and wording commits are preserved in prompts 113–116.
Their separate archive commits are a27af820d842d05aee1fcd7d1fe21d9c89bd1d69,
64eabb5c39a623675275c5419ee2c7f00682e57d,
28b9ecf1d7ae5daa8f9b17c985570e3fa15e0388 and
e909c8da9121f9f9179dfb3d71d78e0621805a85.

## Archive commit

Record Vancouver production release completion

## Lessons learned

Separate artifact provenance files from the Git source tree before enforcing a
clean candidate check. Validate archive contents and custody before changing the
storage form of old recovery assets. Avoid shared-host builds when off-host
artifacts preserve operational headroom.

## Follow-up ideas

Road/bridge continuity, measured heights, improved landmark models, physical-phone
profiling and bounded geographic expansion; these are not part of V0.1.
