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

Current guides state public availability; dated prior evidence remains historical. Deployment evidence will be added after public acceptance and cleanup.

## Git diff summary

10 files changed, 62 insertions and 61 deletions: bounded availability/link edits and matching documentation.

## Verification

- Node 24.10.0 matches `.nvmrc`; nvm is unavailable. Locked dependency installation succeeded.
- TypeScript/ESLint passed with one existing tutorial-reader navigation warning.
- 572 prebuild regression tests, standard Next webpack build, Vinext build and whitespace checks passed. Production dependency audit: zero vulnerabilities.
- Browser checks at 390, 768 and 1440 pixels found no horizontal overflow; Motion imagery and alt text were intact. Keyboard focus remained visible and the Sports action opened the correct Apple listing. No Motion console errors/warnings were observed. Reduced-motion styles were inspected, not emulated on a physical device.
- Browser review found and corrected one additional video-introduction pre-release sentence; final source was rebuilt and locally checked.
- Final local HTTP acceptance passed Motion, Sports, privacy, support, tutorial canonical and exact 307 destination. Added-content privacy/prohibited-reference review passed; no new personal records or assets.

## Storage and cleanup

Opening Mac free space: 65,659,752,448 bytes (`df`, not `du`). Only the canonical checkout is registered. Initially no `.next`, `dist` or `node_modules` directories existed. Installed dependencies and generated builds are temporary candidates for cleanup after validation. Production preflight free space: 11,558,912,000 bytes; serving runtime about 700,048 KiB and previous rollback about 690,428 KiB (`du`). The current runtime, complete rollback, retained archives, private stores and configuration are protected. Historical archive custody and unproven October scratch remain documented in the November 9 audit and Issue #5; no broad cleanup is authorized.

## Repository state after implementation commit

Clean main after the implementation commit; the journal is committed separately before pushing. Deployment remains pending at this preparation point.

## Implementation commits

768702fc7effad450b49a5f4feeaeae918b2b473 — Publish Asymmetri Motion App Store availability.

## Archive commit

Journal 214 — record Motion App Store release preparation

## Lessons learned

Availability copy also lives in video descriptions and tutorial disclosures. Check rendered pages as well as status fields. Keep prior privacy request handling available after replacing signup links.

## Follow-up ideas

No additional product work committed.
