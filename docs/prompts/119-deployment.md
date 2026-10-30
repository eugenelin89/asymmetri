# Prompt 119: Complete the Vancouver V0.2 public release

- Date: 2026-10-30
- Scope: deployment
- Goal: Publish the validated city update while preserving existing services and recovery.

## Original user request

> Proceed autonomously with Vancouver V0.2. Implement, inspect, improve, test, and deploy if safe. Do not wait for further instructions.

This completes the detailed owner mission summarized in prompt 118: preserve
Vancouver's identity/URL/menu, verify browser behavior, immutable data/licensing,
protected website routes and infrastructure, use the approved isolated Linux/SSH
workflow, keep capacity and rollback gates, and report actual results honestly.

## Scope

Exact-source Linux candidate transfer, guarded acceptance/activation, verified
older-runtime retention, public/peer checks, screenshots and release evidence.
No OS, Nginx, TLS, DNS, runtime-binary or unrelated-service changes.

## Decisions

Retain 192 MiB available memory and 6 GiB free disk floors. Keep current and
immediate rollback complete on-server. Archive only proven inactive historical
website trees with full metadata/content comparison before removing redundant
uncompressed copies. Shared hardlinks made apparent directory sizes misleading;
retain the nine-runtime bundle as a whole for complete restoration.

Use the successful exact-SHA Linux artifact, an independent app-owned checkout,
matching digests and native dependencies. Validate the loopback server before a
whole-directory activation. Move provenance receipts outside the Git tree so
the candidate remains clean. Retain complete V0.1 for immediate rollback.

## Implementation

V0.2 activated at 10:24:16 UTC / 03:24 PDT, source
7990eabe022aed0ed28b477b07bc2d9ad457e1d6, Next build LgdQfEvDuIcwEAl6_yxWS.
The public URL is https://asymmetri.co/labs/vancouver. Final documentation records
features/fixes, geography/rights, tests/performance, exact identities, production
health, screenshots, archive custody/recovery and V0.3 priorities.

## Engineering impact

Only the website service restarted. The new process is active and has zero
automatic restarts or post-activation error entries. The old wrapper's intended
SIGTERM produced its known exit-143 shutdown warning. Five peer service
identities, 55 configuration hashes, 13 other vhost baselines and Node binary
remain unchanged. Recovery assets changed storage form only after verification.

## Files changed

One new V0.2 release record and a current-release link in the deployment guide.
Private scripts, checksums, complete archives and screenshot evidence remain
outside Git.

## Documentation updated

The release record connects improvements to exact verification and honest
limitations, and explains immediate rollback plus historical bundle restoration.

## Git diff summary

2 files changed, 183 insertions in the release-documentation implementation.

## Verification

Exact-source CI passed checks, 13 Vancouver tests, production audit and Linux
Next build. Local Next/Vinext builds, seven investment tests and browser
acceptance passed during implementation. Candidate and public checks returned
200 on 13 routes; protected content/canonicals, 124 tutorial IDs and 24 asset
hashes remain intact. Native image optimization returned 200. Twenty-two further
public checks covered apex/www, redirects and both dataset versions.

Public browser: scene/keyboard/held controls/reset, expansion/Escape, 320/390/768px
layout, actual route exit/return, correct submenu and clean error/warning logs.
Desktop samples were about 60 FPS at 80 draw calls/DPR 1.6. These are desktop
viewport checks, not physical-phone or hardware multi-touch validation. Forced
WebGL loss and OS reduced-motion emulation were not performed.

Final health at 10:27:26 UTC: 385,852 KiB available memory, 6,892,527,616 bytes free
disk, active/enabled service, zero restarts. Candidate guard minima remained
above required floors. Complete prior V0.1 and pre-Vancouver runtimes are intact;
automatic restoration exists, but no production rollback was needed/rehearsed.

## Repository state after implementation commit

Main at the implementation below, clean before this journal, ahead of origin.
The compiled production source remains 7990eab; these documentation-only commits
require no redeployment. Implementation and journal are pushed normally.

## Implementation commits

- 5b200cbee15adc1498c5316cb994c45b1ce3bece — Document the verified Vancouver V0.2 release and recovery

The feature implementation 38c48ed and its 7990eab journal are recorded in prompt
118 and form the deployed source. This record completes their authorized release.

## Archive commit

Record Vancouver V0.2 deployment completion

## Lessons learned

Verify real runtime storage capacity rather than summing hardlinked directory
sizes. Keep archive custody and complete comparison evidence. Record sampled
browser performance separately from physical-device and sustained benchmarks.

## Follow-up ideas

Physical-phone/touch profiling, continuous junction driving and clearer collision
feedback, current footprints/measured heights, then separately modelled bridges.
