# Prompt 190: CWRU audio deployment and physical-device acceptance

- Date: 2026-10-31
- Scope: deployment
- Goal: Deploy and verify the prepared CWRU iPhone audio fix while preserving the other campuses and existing production data.

## Original user request

> deploy asap

The owner requested the Silent Mode fix for each campus through its respective chat and repeated the request to deploy. In this CWRU chat, after the live release, the owner answered **“Yes, it plays immediately”** when asked whether a fresh reload and Start with Halloween sound enabled played audio with iPhone Silent Mode on. The core campus, larger running instructions and community follow-up were already live; this release addresses the remaining CWRU audio request.

## Scope and decisions

Deploy immutable source `33e4b65b979a4070f2210a79759c790b1ce147ba`, containing the independently owned CWRU 187 and Stanford 186 audio changes. Keep the UBC runtime from 7026 while its separate initial-entry correction completes its own validation. The user explicitly prioritized getting the ready CWRU/Stanford fixes live without waiting for another UBC CI cycle. Retain one deployment operator and the existing guarded release order.

## Implementation

Verified Linux artifact 13063669057 and build `25l0J7p1X18xCpT0DdKZ1` were deployed at 01:03:01 UTC on November 1, 2026, October 31 in Vancouver. The operator used a fresh independent application-owned checkout, authenticated artifact transfer, isolated smoke and guarded whole-runtime activation. All existing service configuration, private profile/review/analytics stores and the prune timer were preserved. No dependencies, runtime source or public assets changed during deployment.

## Engineering impact

CWRU configures selected audio settings before the explicit gesture unlock and requests supported playback routing through Silent Mode. The complete previous 7026 runtime remains available for rollback, along with earlier retained runtimes and 12 owner-held archives. No archive or rollback tree was deleted. The 192 MiB available-memory and 6 GiB free-disk floors were unchanged. Private deployment scripts and receipts remain outside Git.

## Files changed and documentation updated

The CWRU iPhone audio report now records the immutable artifact, local and Linux validation, live browser and server acceptance, the owner's physical-iPhone result, recovery custody and remaining limits. This journal records the separate deployment decision. Other owners' documentation and generated next-env changes remain untouched.

## Git diff summary

One documentation file changed, 16 insertions and 2 deletions. This journal is excluded from its own diff summary.

## Verification

Exact-source Linux CI 41258434238 passed all 616 tests, TypeScript/ESLint, production audit with zero vulnerabilities and the Next webpack build on Node 22.23.1. Local CWRU checks had passed 98 tests including 13 audio tests, Vinext and phone gameplay controls. An additional private 550 ms asset-delay regression confirmed one resume, no suspend calls and score startup without another gesture.

Final health passed at 01:09:16 UTC: 18 pages, 800 public assets and 40 static assets per loopback/apex/www, 15 peer hosts, all private stores/configuration/timer and 12 archives. The new process had no errors or warnings. Minimum observed available memory was 291,208 KiB and free disk 7,770,652,672 bytes. A first attempt stopped on a TLS handshake EOF in a nonpublishing analytics readiness request; its failure evidence was preserved, process/build and monitors were healthy, and the unchanged full check passed on retry. No broader POST retry or application change was introduced.

CWRU live landing checks at 390×844 and 1280×720 passed Halloween, larger running instructions, review hydration, removed-panel absence, no overflow/broken images and no console errors. UBC and Stanford owners supplied independent landing acceptance. No synthetic production play session or review was created. The prior QA browser recording preference remains unverified because its old visible control tab disappeared; restoration is not claimed and no hidden-state workaround was used. Temporary CWRU tabs were closed and viewport reset.

The owner directly confirmed immediate CWRU audio after reload and Start with iPhone Silent Mode on. This verifies that initial-entry scenario on the owner's device, not every OS, browser, background transition or output route. The final-health receipt SHA-256 is `a84376a553af5d8e48d4648dc128df5bd74bf9fa730a51d145ef50f5bf03cebe`.

## Repository state after implementation commit

Main at `88db3e9b889ddb6fa8a975edb59ebf9511e76562`, descending from frozen UBC 191 source. Only the CWRU audio report was staged. Stanford/UBC documentation and generated next-env changes remain outside these commits. Push the separate journal without force. Later documentation does not change the deployed source or pending frozen UBC candidate. No branch, worktree, PR or merge was created.

## Implementation commits

- `88db3e9b889ddb6fa8a975edb59ebf9511e76562` — docs(cwru): record live iPhone audio acceptance

## Archive commit

`docs: archive CWRU audio deployment acceptance`

## Lessons learned

Distinguish deployment and source-delivery evidence from physical-device audio. Preserve transport failures and rerun bounded, unchanged nonpublishing checks instead of conflating them with application faults. Keep independent campus fixes moving while maintaining exact-source deployment and shared-data custody.

## Follow-up ideas

CWRU's requested follow-ups are complete. Stop its ETA automation after this record is pushed. The separately authorized UBC 191 correction remains a coordinated deployment under the same operator; its campus owner supplies its own acceptance and release record.
