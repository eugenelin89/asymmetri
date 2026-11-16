# Prompt 218: OpenMP3 App Store review resources

- Date: 2026-11-15 (America/Vancouver)
- Scope: deployment
- Goal: Prepare and publish the website resources needed for the free OpenMP3 iPhone submission.

## Original user request

> Deploy OpenMP3 to app store for review and deployment. Try to answer every questions yourself. Use information you had from before. Use Asymmetri.co/mymusic as entry point. Create any page you need in order to satisfy submission and review requirements. Do not reference the product page from othther existing pages other than mymusic. Create icons, images, screenshots as you see fit. Goal is to get it in the appstore asap. This is going to be a free app.

## Scope

Website product, support and privacy resources for the native iPhone app. Apple submission and native source are handled in the separate OpenMP3 repository. Personal contact details and personal music are excluded from this public journal.

## Decisions

Use `/mymusic/openmp3` with nested support/privacy pages. The existing browser player is the sole existing-page entry. Keep global navigation and sitemap unchanged and set noindex metadata. Distinguish native direct Google streaming from the browser player. Explicitly describe Google access and discovery limitations. Availability remains in preparation until verified Apple publication.

## Implementation

Added three server-rendered pages, scoped responsive styles, shared product facts, one My Music link and a generated app icon. Existing Motion resources and site architecture are preserved.

## Engineering impact

No runtime dependencies, API endpoints, user tracking, storage or account systems added. The pages support keyboard focus, wrapping text and mobile layout without animation.

## Files changed

The OpenMP3 route family, My Music entry component, centralized site content, app icon and relevant README/content/asset documentation.

## Documentation updated

README describes routes and availability; Content Guide records entry/privacy boundaries; Asset Manifest records provenance and dimensions.

## Git diff summary

11 files changed, 129 insertions and 1 deletion. Product resources are additive; the only existing page link change is My Music.

## Verification

TypeScript, ESLint (one existing tutorial warning), Vinext build, production audit (zero vulnerabilities), and whitespace checks passed. Desktop browser rendering and image loading observed. Further responsive acceptance, exact-source Linux build and guarded production deployment continue after this preparation commit. No deployment claimed here.

## Repository state after implementation commit

Main, implementation `ce4a9ae`, clean source. Publication pending this journal commit.

## Implementation commits

- `ce4a9ae` Add OpenMP3 product and App Store review resources

## Archive commit

Record OpenMP3 website release preparation

## Lessons learned

The native player and browser utility have different network paths; their privacy statements must stay separate. App Store availability must follow actual Apple status.

## Follow-up ideas

Add the verified App Store link after approval. Record final activation, rollback, capacity and cleanup evidence in a release receipt.

## Coordinated completion report

The owner explicitly authorized coordination with the My Music website chat.
The three OpenMP3 website pages and approved icon were published in the
[combined release](../MYMUSIC_SHARING_RELEASE_2026-11-16.md); overview/support/privacy
passed public checks, and the sole entry from an existing page remains My Music.
The native submission chat reports OpenMP3 1.0 build 1 successfully submitted,
Waiting for Review, free and configured for automatic release after approval.
Apple approval/public availability remain pending. The native workflow owns its
signed artifact, submission evidence and sample audio; private paths, review
identifiers and owner folder links are omitted from this public record.

The owner's subsequent request for the explicit pending-review label is prepared
in prompt 222; that copy-only follow-up remains pending the storage approval
recorded in its readiness note. No new native implementation is recorded here.
