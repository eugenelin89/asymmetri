# Prompt 222: Show OpenMP3's pending review status

- Date: 2026-11-15 (Vancouver; November 16 UTC)
- Scope: content and deployment
- Goal: Clearly show that the iPhone app is awaiting App Store review.

## Original user request

> Somewhere on this page: [https://asymmetri.co/mymusic/openmp3](https://asymmetri.co/mymusic/openmp3)
> Indicate that the iPhone App is pending review.

## Scope

Update the existing availability line in the product overview, together with the already authorized My Music copy-removal deployment.

## Decisions

Use “App Store review pending” in the central `openMP3.availability` field, already rendered prominently beneath pricing. Do not claim approval or public App Store availability.

## Implementation

Changed the single availability label and aligned README/Content Guide.

## Engineering impact

Copy only. Existing layout, routes, links, styles, dependencies, policies and behavior remain unchanged.

## Files changed

Central site content, README and Content Guide.

## Documentation updated

Onboarding and content guidance now distinguish submitted/pending review from public availability.

## Git diff summary

3 files changed, 5 insertions and 2 deletions.

## Verification

Exact source/label check and whitespace validation passed. The unchanged Linux workflow supplies final build/check/audit gates; no additional local dependency installation or broad tests for this small copy change. Live verification follows deployment.

## Repository state after implementation commit

Main at `1c9e2bf`, clean before this journal. The copy-removal preparation is `02513ec`; one successor deployment includes both requests.

## Implementation commits

- `1c9e2bf` Mark OpenMP3 as pending App Store review

## Archive commit

Record OpenMP3 pending-review label preparation

## Lessons learned

Use the existing availability field for truthful release status without adding another page section.

## Follow-up ideas

Replace pending status only after verified Apple publication.

## Final readiness and approval blocker

The exact-source Linux workflow for preparation `bf1b35e` passed. The requested
copy changes are not live: automatic review rejected archival/duplicate retirement
of older recovery directories pending explicit owner approval. No retention script
ran and no recovery files were changed. A post-attempt read-only audit verified
live/rollback/peer health; zero bytes were reclaimed during this follow-up. Exact
storage inventory remains private because public issue publication of those details
was separately rejected; a sanitized issue status was accepted.

Additional documentation commit `2d09940` — Record copy release readiness and
pending storage approval (2 files changed, 52 insertions). See the
[readiness note](../MYMUSIC_COPY_RELEASE_READINESS_2026-11-16.md) for validation,
public/private evidence boundaries and the remaining authorized release sequence.
The serving website remains the successful earlier sharing/autoplay release.

Final archive commit message: `Record final copy status and coordinated submission outcome`.
Main was clean after the readiness commit before this archive update.

## Approved deployment completion

The owner subsequently approved the specific older-copy archival. The verified
procedure, final activation, live browser acceptance, independent immediate rollback
and post-release cleanup all passed. See prompt 223 and the updated completion
receipt. Exact operational measurements/recovery identities remain private. The
requested copy changes are now live; the previously recorded blocker is resolved.
