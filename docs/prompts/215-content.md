# Prompt 215: Remove BotSquad discovery links while preserving its pages

- Date: 2026-11-14
- Scope: content and deployment
- Goal: Remove BotSquad from global menus and the Labs index, retain all pages and URLs, and deploy the update.

## Original user request

> now, update asymmetri.co. I don't want you to remove any page. but I want you to remove the menus that links to Botsquad. As well, update this page so it does not have Botsquad: https://asymmetri.co/labs

> deploy at once and merge into repo

## Scope

Global header/footer navigation and the Labs project index and metadata. Direct BotSquad pages, their internal navigation, all routes, assets, redirects and private service boundaries remain intact. The owner explicitly authorized deployment and repository publication; the standing main-only workflow applies without a feature branch or PR.

## Decisions

Remove only the global discovery links and Labs project entry. Keep product definitions and all direct BotSquad URLs. The existing social artwork contains BotSquad lettering, so Labs now uses text-only social metadata; preserve the image bytes and URLs for other pages. No dependency, style, runtime configuration or infrastructure change is needed.

## Implementation

Shared navigation omits BotSquad. Labs features Virtual Worlds and has a BotSquad-free description and social preview. Eight source/documentation files changed.

## Engineering impact

Content and navigation only, using the existing semantic menus and focus behavior. No page, asset, backend, receiver or persistent data was removed or altered.

## Files changed

Central content and Labs metadata composition; README, architecture, content, asset usage, hierarchy and testing guidance.

## Documentation updated

Current guides describe the new discovery policy while retaining the historical hierarchy and compatibility contract. The asset manifest records removal of the Labs preview reference without deleting the shared artwork. The [release receipt](../LABS_NAVIGATION_RELEASE_2026-11-14.md) records the verified production result, independent rollback, guarded capacity recovery and measured cleanup.

## Git diff summary

Implementation: 8 files changed, 53 insertions and 24 deletions. Release receipt and deployment guide: 2 files changed, 50 insertions. These totals exclude the journal and interaction log.

## Verification

Node 24.10.0 matches .nvmrc; nvm is unavailable. Locked install, TypeScript/ESLint, Next webpack and Vinext builds, production dependency audit and whitespace review passed. Production audit reports zero vulnerabilities. One pre-existing tutorial-reader lint warning remains; development dependencies have audit findings outside this unchanged-dependency task.

Browser checks covered exact CSS widths 320, 390, 768, 1024, 1440 and 1920 with no horizontal overflow. Labs has no BotSquad text or global links; menus support Tab, visible focus and Escape focus restoration. No site-origin console errors were observed; browser-extension warnings were excluded. Existing reduced-motion CSS remains unchanged; OS-level reduced-motion and physical-device checks were not performed. Local direct BotSquad pages and protected Motion resources returned HTTP 200, and the tutorial retains its exact www canonical. Added content passed the bounded secret/private-reference scan.

## Production acceptance and cleanup

Exact-source Linux CI passed for deployed source 4ee0a2651e9b6dafc34d9fe5cd460ebef9d71927. Activated November 14 at 23:22:20 UTC, build E2OJu4pokkUqFe7kdJQ7W. All 29 route/redirect/metadata checks, 803 asset hashes, 62 configuration hashes, 15 peer-host baselines, five persistent stores and independent immediate-rollback startup passed. Both public hosts and 24 off-host route/menu/compatibility checks passed. The first memory guard halted safely; a bounded website-only cgroup reclaim restored headroom with the original process and configuration unchanged. A verification-parser correction preserved internal BotSquad article links while excluding them from global-navigation assertions. No guard threshold was lowered.

Cleanup removed only verified inactive generated outputs, downloaded runtime transport and empty fixtures. Measured reclamation was 1,730,224,128 bytes locally and 256,856,064 bytes on the server. Free-space windows, exact paths/categories, rebuild proof, retained large runtime/rollback sizes, older recovery limitations and post-cleanup health are in the release receipt. Existing unrelated log-only commits from a concurrent chat were preserved.

## Repository state after implementation commit

Clean main at 87b273d before this journal. That initial preparation checkpoint preceded deployment; the completed production acceptance is recorded above. The serving source remains the exact 4ee0a26 Linux artifact; subsequent documentation commits do not change the runtime.

## Implementation commits

- 87b273d — Remove BotSquad from global navigation and Labs index.
- 81a5dc0 — Record verified Labs navigation deployment and cleanup.

## Archive commit

`docs: finalize Labs navigation release journal`

## Lessons learned

A shared social-preview image can still advertise a removed project even after its text and menu entry are gone. Preserve direct route and asset compatibility separately from global discovery.

## Follow-up ideas

None added to scope. The existing historical archive-custody follow-up remains in Issue #5; no new cleanup blocker or retention decision arose.
