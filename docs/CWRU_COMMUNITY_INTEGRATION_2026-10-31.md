# CWRU reviews and private play reporting — October 31, 2026

## Implementation

CWRU now integrates the shared modules introduced at `704a9b3bfc2a3eafcac0360f490af01aafbf56ff`. This records source preparation and local acceptance; consult the separate production receipt before treating the follow-up as live.

The CWRU page places visitor reviews immediately above the footer. The shared interface provides star ratings, comments, distribution, sorting, owner edit/removal and reporting. It labels reviews as feedback about the independent virtual experience. There are no seeded ratings or testimonials.

A play-privacy notice appears before entry and inside the explorer's information panel. Measurement mounts against the game section only and activates when the visitor has started, graphics are ready and no graphics error is present. The shared activity gate additionally requires a visible, on-screen game and recent interaction. Opt-out, browser privacy signals and browser-owned history deletion use the shared controls; privacy details open separately so visitors can retain their game position.

The private service records connection IP, bounded basic browser information, a random browser capability, session timestamps and approximate active duration. It counts browsers, not verified people. It does not join public profiles, review identities or characters, and does not collect typed content, conversations, coordinates or fingerprints. The backend contract removes source details after 30 days and session summaries after 90 days through operation-time pruning and the separately installed daily maintenance job; its actual activation is a deployment check.

CWRU's existing profile endpoints, ownership cookie and private profile directory are unchanged. The larger running instructions from journal 179 remain in place. Shared backend implementation and other campus integrations are outside this scoped change.

## Local validation

Node 24.10.0 matches `.nvmrc`. An isolated export of committed shared source plus the running-instruction change and this integration passed TypeScript/ESLint, all 131 scoped tests (89 CWRU, 13 reviews, 29 analytics), Vinext/Cloudflare packaging and the standard Next webpack build. The only lint warning is the pre-existing tutorial navigation warning; ordinary browser-data age/chunk-size build advisories remain non-blocking. Runtime files are hashed against the validated export before staging.

Browser checks verified:

- A disposable local CWRU review could be published, edited and removed, with rating totals updating accordingly. The final review list was empty.
- No play session was stored on the welcome screen. Entering the ready explorer produced one CWRU session and 31.355 seconds of approximate active duration during the check.
- In-game opt-out left the store unchanged beyond a heartbeat interval. The privacy page reflected the same choice; browser-owned deletion returned the local session store to zero.
- The 390×844 phone review form and in-game privacy panel had no horizontal overflow. Desktop disclosure and existing run hints remained visible. Closing the information panel restored CANVAS focus. Final console-error checks were empty and viewport emulation was reset.

The development server refreshed the page once when compiling another route; this pass does not claim production-session continuity. Browser emulation is not physical-device certification. All synthetic records were removed, and the local preview was stopped. [Local screenshots and limitations](validation/cwru-community/README.md) preserve the UI evidence without private telemetry.

## Release and operations

The shared backend owner deploys and verifies the private review/analytics stores and daily retention timer first. CWRU then uses an exact-source Linux artifact and separately verifies its public page, reviews, privacy controls, play lifecycle and existing profile flow. Those live checks remain pending.

Use the [review operations](CAMPUS_REVIEWS_OPERATIONS.md), [analytics operations](../projects/campus-analytics/README.md) and [CWRU profile operations](CWRU_COMMUNITY_OPERATIONS.md). Preserve all three campuses' profile stores and service dropins, shared data, current rollback and archive custody. Stop/drain shared analytics maintenance during whole-runtime swaps and resume it against a compatible healthy runtime. Never restore an empty store over real submissions. Authorized disk cleanup moved historical server archives to verified owner custody; future gates use those receipts rather than assume retired server paths still exist.
