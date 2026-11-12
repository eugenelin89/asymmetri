# Prompt 214: Publish Motion's App Store availability

- Date: 2026-11-11 (Vancouver; work began November 12 UTC)
- Scope: content and deployment
- Goal: Replace beta-only availability with the live Apple App Store release and deploy the website.

## Original user request

> asymmetri.co update.
> The app, Asymmetri Motion is no longer in Beta. It is live in the Apple App Store: https://apps.apple.com/us/app/asymmetri-motion/id6825059131
> Update the website and deploy at once.

## Scope

Motion availability, shared Sports/Motion calls to action, tutorial disclosure, prior-request privacy disclosure and the compatibility redirect. The user explicitly authorized production deployment. No app binary, Hitting/Team implementation, public assets, dependencies, private form responses or peer-service configuration changed.

## Decisions

- Owner confirmation and Apple's public listing establish availability; retain the iPhone/iOS 17 requirement without adding regional prices.
- Centralize the Store destination in `motion.access.appStoreUrl`; all three existing buttons link directly to Apple.
- Preserve `/motion/try` as HTTP 307 to Apple, all protected routes, tutorial hashes/original media and its exact www canonical.
- Retain previous TestFlight-request disclosure and deletion contact without asserting deletion or closing the external form.
- Use the existing DigitalOcean independent Linux candidate, whole-directory activation and complete rollback procedure; preserve Node 22 and the reviewed retained-host boundary.

## Implementation

Shared family status is Available now. Motion, Sports, metadata, tutorial and introduction-video text reflect public availability. The three CTAs say Download on the App Store. Hitting remains In development and Team remains Planned. The privacy effective date is November 11, 2026.

## Engineering impact

Content and outbound navigation only. No dependency, new asset, analytics or data-model changes. Existing semantic anchors, descriptions, focus styles and reduced-motion rules remain in use.

## Files changed

Shared copy, the reusable access component and redirect configuration; README and architecture, brand, content, product-evidence, privacy-audit and testing guidance.

## Documentation updated

Current guides state public availability; dated prior evidence remains historical. [Verified deployment and cleanup](../MOTION_APP_STORE_RELEASE_2026-11-11.md) records activation, exact build, independent rollback, protected routes, assets, peer/configuration preservation and measured storage results. The deployment guide identifies the current runtime and immediate rollback.

## Git diff summary

Runtime implementation: 10 files changed, 62 insertions and 61 deletions. Release receipt and deployment guide: 2 files changed, 50 insertions. These totals exclude this journal and interaction log.

## Verification

- Node 24.10.0 matches `.nvmrc`; nvm is unavailable. Locked dependency installation succeeded.
- TypeScript/ESLint passed with one existing tutorial-reader navigation warning.
- 572 prebuild regression tests, standard Next webpack build, Vinext build and whitespace checks passed. Production dependency audit: zero vulnerabilities.
- Browser checks at 390, 768 and 1440 pixels found no horizontal overflow; Motion imagery and alt text were intact. Keyboard focus remained visible and the Sports action opened the correct Apple listing. No Motion console errors/warnings were observed. Reduced-motion styles were inspected, not emulated on a physical device.
- Browser review found and corrected one additional video-introduction pre-release sentence; final source was rebuilt and locally checked.
- Final local HTTP acceptance passed Motion, Sports, privacy, support, tutorial canonical and exact 307 destination. Added-content privacy/prohibited-reference review passed; no new personal records or assets.

## Storage and cleanup

Opening Mac free space: 65,659,752,448 bytes (`df`, not `du`). Only the canonical checkout is registered. Initially no `.next`, `dist` or `node_modules` directories existed. Installed dependencies and generated builds are temporary candidates for cleanup after validation. Production preflight free space: 11,558,912,000 bytes; serving runtime about 700,048 KiB and previous rollback about 690,428 KiB (`du`). The current runtime, complete rollback, retained archives, private stores and configuration are protected. Historical archive custody and unproven October scratch remain documented in the November 9 audit and Issue #5; no broad cleanup is authorized.

The local cleanup windows recovered **1,743,892,480 bytes**; final free space was **65,204,457,472 bytes**. Server staging cleanup recovered **256,942,080 bytes**; final free space was **10,251,710,464 bytes**. Full before/after readings, exact removed paths, retained runtime sizes and recovery limitations are in the release receipt. No new cleanup blockers remain. Historical custody remains the already-recorded Issue #5 follow-up.

## Deployment acceptance

Activated November 12 at 01:48 UTC (November 11 Vancouver). Linux validation passed 646 tests and zero production vulnerabilities. Exact tar checksum/source/runtime matched before unpacking. Candidate and public acceptance preserved 22 route contracts, 803 public assets, 38 build files, 15 peer host baselines, 62 configuration files and five private stores/settings. The old runtime independently booted on loopback. Fresh live browser visits and 14 off-host checks passed. Post-cleanup service logs had no current-process errors or warnings. The 192 MiB/6 GiB floors held throughout sampled guarded operations.

## Repository state after implementation commit

Runtime source and its preparation archive were pushed on main; deployed source is `17dc03f957723ac95de6d42405dab1f9a24b2de2`, build `GJigN8VBK-fezdQvZSZsm`. Receipt commit `fb63c8a` contains documentation only. This journal finalization and the complete final-response log are committed separately and pushed to main. The production checkout remains clean at its verified runtime source.

## Implementation commits

768702fc7effad450b49a5f4feeaeae918b2b473 — Publish Asymmetri Motion App Store availability.

fb63c8abffd4b37714130063d3fa7c8c00f653ec — Record verified Motion App Store website deployment.

## Archive commit

Initial archive: Journal 214 — record Motion App Store release preparation

Finalization: Journal 214 — finalize live release and interaction log

## Lessons learned

Availability copy also lives in video descriptions and tutorial disclosures. Check rendered pages as well as status fields. Keep prior privacy request handling available after replacing signup links.

## Follow-up ideas

No additional product work committed.
