# Stanford reviews and private play reporting

## Scope and truth state

The initial Stanford campus is already [live and verified](STANFORD_RELEASE_2026-10-31.md). This follow-up integrates the shared modules committed by the UBC workstream at `704a9b3`; source integration and validation do not imply production activation. Stanford owns this frontend's testing and deployment. Shared persistence, APIs, privacy page, proxy configuration and scheduled retention are owned by the shared-service release.

## Visitor behavior

The Stanford page shows the shared compact play-privacy notice before the game. Project information inside the explorer provides the full notice, recording toggle, privacy link and explicit deletion of this browser's play history across campuses on the current hostname. The link opens a new tab without replacing the game.

`PlaySession` receives `campus="stanford"`, `playing={started && ready && !error}` and the ref for the explorer section only. The surrounding campus notes, review section and site footer are outside that region. The shared client separately requires document visibility, an on-screen game and recent trusted interaction, respects GPC/DNT and the cross-campus opt-out, serializes requests and bounds retries. No character/profile identifiers, typed text or positions are passed to it. The approximate private counts describe browser capabilities and sessions, not identified people or verified attention.

The shared review section appears at the end of main content above the site footer. It supports ratings, optional comments, sorting, pagination, editing/removal of this browser's own review and reporting. Reviews concern the independent virtual campus experience. There are no seeded reviews or invented ratings. Review ownership, analytics identity and public character profiles are separate.

## Validation and deployment

Use disposable local/private-candidate stores for review mutations and analytics lifecycle checks. Production review acceptance is nonpublishing: reads, form behavior and rejection checks only. Never publish synthetic production reviews. Preserve all existing profile, review and analytics stores through runtime changes. Drain the shared retention service and timer during swaps, then restore and verify their operation as specified by the shared release.

The focused 182-test run passed: 140 Stanford regression tests plus 42 shared review/analytics tests. TypeScript/ESLint passed with the existing tutorial warning, the production dependency audit found zero vulnerabilities, and both supported builds passed again after the final panel-specific styling adjustment. The Next prebuild passed 511 tests, including the expanded UBC suite. The scoped panel styles preserve the privacy checkbox spacing and touch target without changing shared components.

The disposable local production preview passed review creation, editing, removal, sorting and focus restoration. No analytics store existed on the welcome page or while browsing reviews, and none was created when entering the game with recording disabled. Enabling recording inside the ready game created one Stanford session; leaving the game area to the review form paused it, and fresh game interaction resumed it. The explicit deletion control removed that browser's local test session and switched recording off. Local review and analytics stores ended with zero records. Mobile review input had visible keyboard focus and no horizontal overflow at 390×844. The final privacy panel passed mobile/tablet layout checks with no document overflow at 390 or 768 px, no broken images and an empty browser-error list. Full idle/visibility/GPC/DNT/cross-tab sequencing remains covered by the shared automated client tests; only the listed cases were repeated in this browser pass.

The integration passes no identity or form content to analytics. Exact candidate source and production acceptance will be recorded only after the coordinated release.

Contracts and operations: [play client](../projects/campus-analytics/CLIENT.md), [private analytics](../projects/campus-analytics/README.md), [reviews](../projects/campus-reviews/README.md), [review operations](CAMPUS_REVIEWS_OPERATIONS.md).
