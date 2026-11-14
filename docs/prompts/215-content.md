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

Current guides describe the new discovery policy while retaining the historical hierarchy and compatibility contract. The asset manifest records removal of the Labs preview reference without deleting the shared artwork. A deployment receipt will record the observed production result and cleanup.

## Git diff summary

Implementation: 8 files changed, 53 insertions and 24 deletions. This excludes the journal and interaction log.

## Verification

Node 24.10.0 matches .nvmrc; nvm is unavailable. Locked install, TypeScript/ESLint, Next webpack and Vinext builds, production dependency audit and whitespace review passed. Production audit reports zero vulnerabilities. One pre-existing tutorial-reader lint warning remains; development dependencies have audit findings outside this unchanged-dependency task.

Browser checks covered exact CSS widths 320, 390, 768, 1024, 1440 and 1920 with no horizontal overflow. Labs has no BotSquad text or global links; menus support Tab, visible focus and Escape focus restoration. No site-origin console errors were observed; browser-extension warnings were excluded. Existing reduced-motion CSS remains unchanged; OS-level reduced-motion and physical-device checks were not performed. Local direct BotSquad pages and protected Motion resources returned HTTP 200, and the tutorial retains its exact www canonical. Added content passed the bounded secret/private-reference scan.

## Repository state after implementation commit

Clean main at 87b273d before this journal. Deployment and exact-source Linux CI remain pending at this preparation checkpoint; no live success is claimed here.

## Implementation commits

- 87b273d — Remove BotSquad from global navigation and Labs index.

## Archive commit

`docs: archive BotSquad navigation update`

## Lessons learned

A shared social-preview image can still advertise a removed project even after its text and menu entry are gone. Preserve direct route and asset compatibility separately from global discovery.

## Follow-up ideas

None added to scope. Production acceptance and measured cleanup will be recorded after the authorized release.
