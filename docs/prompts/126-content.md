# Prompt 126: Group the city experiments under GIS Apps

- Date: 2026-10-30
- Scope: content
- Goal: Add a GIS Apps category and reconstruction explanation while preserving every existing URL.

## Original user request

> Do not change any URL as it may break the links. However, I want to rearrange Asymmetri Labs a little.
> I want "Vancouver In Progress", "Surrey Adventure" be under the category of "GIS Apps". So there should be a GIS Apps page, and in GIS Apps there is cards for Vancouver and Surrey. In the GIS Apps page, there should be discussion on "How do we reconstruct the streets and buildings". In the Labs menu, instead of menus to Vancouver and Surrey, just a menu for GIS Apps.
> Please coordinate with "Vancouver GTA" project to make sure no page, page link is broken.

Follow-up:

> Note I've change the project name from "Vancouver GTA" to "Greater Vancouver GTA"

## Scope

Added the category hub, discovery/navigation changes, shared cards, sitemap entry
and corresponding documentation. No existing route, canonical, fragment, public
asset, geographic snapshot, game implementation, redirect or dependency changed.
No website deployment, hosted preview, infrastructure operation or new service.

## Decisions

- Use the new `/labs/gis` route solely as a category hub. Keep `/labs/vancouver`
  and `/labs/surrey` as the city destinations without redirects or nested aliases.
- Replace the two city entries in the Labs menu with GIS Apps. Replace their
  top-level Labs cards with one category card. Keep direct footer city shortcuts
  and add GIS Apps there, preserving Motion resources and BotSquad navigation.
- Reuse `vancouver` and `surrey` facts for the GIS cards. The Vancouver card uses
  the established `navLabel`; project identity and metadata stay unchanged.
- Explain public geographic layers, metre coordinates, street surfaces, footprint
  extrusion, historical/source heights, procedural scenery and geometry checks.
  Keep flat terrain, approximate widths, historical measurements, artistic
  architecture, view-only Vancouver bridges and fictional Surrey stories explicit.
- Coordinate directly with the Vancouver and Surrey chats in the renamed
  Greater Vancouver GTA project. Vancouver confirmed its stable route/data paths
  and reconstruction caveats; Surrey confirmed its unchanged route/snapshot and
  V0.2 fiction/stylization boundaries. Cards inherit future project fact updates.
- The shared checkout was dirty on Surrey's release branch. Work used an ordinary
  isolated clone on `main`, without changing that checkout, creating a feature
  branch or creating a worktree. Waited through Surrey's guarded activation, then
  fast-forwarded to its released source and final documentation before committing.
  Preserved its V0.2 facts while resolving one overlapping README route-table edit.
- Surrey reserved journal 125; this task reserved 126 and informed Vancouver to
  avoid conflicting shared-content pushes and prompt numbering.

## Implementation

`gisApps` centralizes the hub identity, metadata, cards and reconstruction copy.
The static server page uses the established graphite/teal identity, breadcrumb,
two city cards, four reconstruction steps and city-specific limitations.
`LabsProjectCards` shares the existing article markup between Labs and GIS Apps.
Category cards may omit a source link, avoiding an invented category repository
or licence. Actual project cards retain their source and licence links.

## Engineering impact

The hub adds no client component, city engine import, geographic data request,
backend, tracking, persistence or dependency. Native anchors and server-rendered
content work without JavaScript. Existing focus and reduced-motion styles remain
in effect; scoped CSS stacks the reconstruction sections on small screens.
The GIS page reuses the existing Labs social image; no public asset was created,
replaced, edited or removed.

## Files changed

- Labs content and sitemap: category definition, shared facts and discovery links.
- Labs page and shared card component: consistent category/project rendering.
- New GIS page and scoped stylesheet: city cards and reconstruction discussion.
- README, architecture, content and testing guides: hierarchy, ownership and
  compatibility expectations.

## Documentation updated

README records the category hierarchy and added route. Architecture records the
server-only hub and shared cards. Content guidance records the unchanged URL
contract and evidence limits. Testing guidance covers the menu, card destinations,
no-JavaScript content, sitemap, resource isolation and compatibility checks.
Setup, runtime, deployment and asset instructions needed no change.

## Git diff summary

Implementation: 10 files changed, 267 insertions and 49 deletions. Most additions
are the hub's content/page/styles; existing card markup moved into a small shared
component. No city implementation or data diff.

## Verification

- Node 24.10.0 matches `.nvmrc`; nvm was unavailable. Clean lockfile installation.
- `npm run check`: passed; retained the existing tutorial-reader navigation lint
  warning, with no errors.
- `npm run build:next -- --webpack`: passed, including all 29 Surrey tests after
  integrating V0.2; the new GIS page is statically generated.
- `npm run build`: passed. Existing Browserslist age and large-chunk warnings remain.
- `npm audit --omit=dev`: zero vulnerabilities. No dependency edits.
- `git diff --check`: passed.
- Compared all 100 pre-existing content URLs: every one remains, with `/labs/gis`
  the sole addition. City identity/status/metadata definitions stayed unchanged
  relative to the integrated baseline. Public/project/config/dependency files
  have no task diff.
- Local production-server checks: eight routes and exact canonicals passed,
  including Motion's exact www tutorial canonical; 24 internal destinations,
  geographic paths and fragments passed; all four GIS source/licence links
  returned success. Sitemap retains both cities and adds GIS Apps.
- Server HTML contains both city cards and the full discussion. No city snapshot
  paths occur in the hub HTML; the hub imports no game client components.
- Browser: Labs → GIS Apps → both original city routes works. Labs keyboard
  disclosure opens/closes with Enter/Escape and displays a visible teal focus
  outline. No console errors observed on the hub.
- Responsive DOM checks passed at 320, 390, 768, 1024, 1440 and 1920 CSS pixels
  with no horizontal overflow. Browser zoom required adjusted viewport overrides;
  screenshot cropping limited capture quality, so exact CSS measurements were
  used for width acceptance. Viewport overrides were reset afterward.
- Reduced-motion verification was source review: the hub adds no animation and
  retains the existing global reduced-motion override. No new images require alt
  text; the new page reported no broken images.
- Prohibited/private-reference and credential-pattern scans passed for affected
  public content. Historical height and fictional-story boundaries remain explicit.

## Repository state after implementation commit

`main`, implementation `de88c45`, clean working tree. The isolated clone was one
commit ahead of `origin/main` at Surrey release journal `36dd589`. The original
shared checkout and production were not modified by this task at this checkpoint.
The normal second journal commit and main push follow.

## Implementation commits

- `de88c45` — `feat(labs): group city experiments under GIS Apps`

## Archive commit

`docs(journal): record GIS Apps grouping and URL verification`

## Lessons learned

Category hierarchy does not require moving product URLs. Reusing the project facts
lets concurrent city updates propagate into the hub without duplicating release
claims. Coordinate exact-source deployment windows and journal numbers before
pushing shared navigation changes.

## Follow-up ideas

Publish only through a separately authorized website release. Continue to keep
reconstruction claims aligned with each project's versioned source evidence.
