# Prompt 175: Rename the Labs category submenu

- Date: 2026-10-31
- Scope: content
- Goal: Display Campus and City in the Labs submenu while retaining every URL.

## Original user request

> for the submenu "GIS Apps", change to "Campus and City"

Earlier deployment and Greater Vancouver GTA coordination authorization remains
applicable to this related website follow-up.

## Scope

Only the global Labs submenu label and its current content guidance change.
The GIS Apps hub, Labs category card, footer, project names and URLs are preserved.

## Decisions

Set the label directly in centralized `site.navigation`, retaining `gisApps.path`.
A submenu-only request does not rename the category page or its technical identity.
Coordinate the main/release window with the active UBC and campus workstreams.

## Implementation

The global Labs menu reads Asymmetri Labs, BotSquad, and Campus and City. The final
item continues to open `/labs/gis`, whose city and campus links remain intact.

## Engineering impact

Copy only: no route, redirect, asset, CSS, dependency, state, game, profile storage,
accessibility interaction or deployment configuration changes.

## Files changed

Shared site navigation in `content/site.ts` and the current navigation/category
instructions in `docs/CONTENT_GUIDE.md`.

## Documentation updated

The content guide distinguishes the new submenu label from the retained GIS Apps
hub/card/footer name. Historical prompt and release records are unchanged.

## Git diff summary

Two files changed, five insertions and three deletions.

## Verification

- Started with clean main and a successful fast-forward pull; refreshed to
  `9f8abb9` after the UBC release handoff and reapplied only the checked patch.
  Content, dependent Ask types, dependencies and compiler configuration are
  identical to the validated baseline.
- Node 24.10.0 matches `.nvmrc`; nvm is unavailable.
- Focused TypeScript validation using repository compiler options and ESLint passed.
- Executed both the baseline and edited content modules and compared every export
  after normalizing this one label: all other copy, facts and URLs are identical.
- Production dependency audit: zero vulnerabilities. `git diff --check` passed.
- Shared Mac contention caused a redundant broad baseline typecheck to be stopped;
  no full local build is claimed for this copy-only change. Exact-source Linux
  build and production verification remain release steps.
- Changed-copy privacy/reference review: no personal data or external reference.

## Repository state after implementation commit

Clean main after implementation, one commit ahead of origin. The release window
was handed over by UBC after journal 168 at `9f8abb9`; CWRU agreed to hold its
integration. Journals 169–174 remain reserved by other workstreams. The
implementation and this record will be pushed together; unrelated local campus,
review and student work in another checkout is excluded.

## Implementation commits

- `d4c71a65f62aed285133bbabe6eb429cee1ce737` — Rename Labs submenu to Campus and City.

## Archive commit

`Record Campus and City submenu engineering journal`

## Lessons learned

Keep navigation wording independent of stable routes and broader page identities
when the owner requests a menu-only rename. Preserve peers during shared releases.

## Follow-up ideas

Complete the authorized release and verify the visible submenu and preserved links.
