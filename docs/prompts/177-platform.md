# Prompt 177: Campus reviews, student encounters and private play reporting

- Date: 2026-10-31
- Scope: platform
- Goal: Add sourced UBC student encounters, shared public reviews and private browser-session reporting across the three campuses.

## Original user request

> Above the footer, i want a form that allows players to submit comments and review and it should be publicly visible. It should look very nice that resemble the comment in Google Map. Please also send this requirement to the other campuses.

> include UBC students in this MD file as student characters. Also send the attached to the other campus threads so that they can include their students as student characters.

> update eta to full deploymen every 10 minutes

> In the backend, can you record who (IP Address, and any other identifiable info) have played the game, how many unique person has played the game, and how long each played the game? Same for other colleges .

> for work on the other colleges, don't do it yourself. message the respective thread to do it on their colleges so each thread focuses on its own work.

The supplied research contained 500 rows per campus. Only public names, study fields, explicit completion years and source URLs were imported for UBC; contact columns and private file paths are excluded. CWRU and Stanford owners received the source and shared integration requirements. Earlier instructions authorize autonomous decisions and production deployment after validation.

## Scope

UBC's student registry/population, shared public reviews and private usage recording, UBC integration, reusable three-campus APIs, privacy controls and operator documentation. Existing public profiles remain separate. No identity verification, fingerprinting, account system or third-party analytics service is added.

## Decisions

Five hundred supplied UBC identities produce 498 new records and two enriched existing rowing characters. Thirty-seven GIS department anchors and actual pedestrian graph edges distribute encounters. At most 12 streamed actors are present; unseen identities are prioritised and distant off-camera figures rotate without interrupting conversations. Appearances and routes are fictional. Source confidence remains visible; 489 records are supplied research, not independent current-enrollment confirmation.

Reviews publish immediately with public display name, optional text and 1–5 stars. A separate HttpOnly capability controls one review per browser/campus. Public ratings omit hidden reviews; reporting does not automatically hide content. Private moderation can hide, restore or remove a review.

Usage stores a separate random first-party visitor capability and per-campus session UUID, connection IP and bounded basic user-agent details. Server elapsed intervals determine approximate active duration. Counts are recorded browsers, not verified humans. Browser Web Locks and cookie-only bootstrap prevent concurrent starts/lost responses creating orphan identities. Off-screen, hidden and idle input gates, GPC/DNT, opt-out and browser-owned deletion are supported. www and apex are separate origins. No profile/review identity, text, conversation, coordinates or fingerprint is collected. IP/browser details retain 30 days; pseudonymous session identifiers/timestamps/durations retain 90 days with private cleanup. Deployment must verify the actual timer.

## Implementation

UBC integrates the shared review/privacy components and play-session tracker. The owner subsequently directed each campus thread to own its own changes: the tested CWRU draft was handed over and removed from this release, while Stanford source was never edited here. Shared API capability is not evidence of frontend activation at either campus.

The shared modules provide accessible review cards/forms, private moderation and play-reporting CLIs, strict same-origin APIs, cross-tab browser privacy controls and separate persistent stores. UBC mounts the new interfaces and starts measurement only within its ready explorer. The student registry preserves encounter-only discovery, natural factual responses and source provenance.

## Engineering impact

Two explicitly requested private persistent stores and shared Node route handlers, with fail-closed behavior until configured. No dependency addition. Browser notices and accessible review/privacy controls complement private CLIs. Existing production resource floors, profile custody and rollback procedures remain in force.

## Files changed

New shared review and analytics modules and API routes; a privacy utility page and sitemap entry; UBC page/explorer, registry, conversation and population integration; student source/import/department modules and tests; operator/provenance documentation and four local browser captures. Shared package scripts include both new test suites. No other campus frontend, existing public-profile implementation, dependency lockfile or public asset is changed.

## Documentation updated

Community/student provenance reports, review and analytics operations, module client guide and shared architecture/content/local-development/testing/deployment instructions.

## Git diff summary

59 files changed, 7,271 insertions and 24 deletions. Most inserted lines belong to the sanitized 500-row student source snapshot; the remaining changes add shared service modules, UI, tests and documentation. Four original local browser captures are included.

## Verification

Final isolated validation on Stanford implementation a69cb68 plus the scoped UBC/shared overlay passed 592 tests: UBC 144, reviews 13, analytics 29, CWRU 89, Stanford 140, Surrey 69, Richmond 27, Vancouver 74 and investment 7. TypeScript/ESLint passed with one existing tutorial-navigation warning; production audit found zero vulnerabilities. Both Next webpack and Vinext builds passed. Local browser validation covered review actions and phone/tablet layout, student conversation, measurement start/opt-out/deletion and cross-tab preferences. CWRU preference checks used the subsequently removed integration draft. Exact-source Linux CI and production activation remain subsequent gates. No physical-device test is claimed.

## Repository state after implementation commit

`main`, implementation `6de99d2b2a9f130c2f5fd29d1c9fd19ddcc504f7`, one commit ahead of origin before the separate journal commit. The implementation owns only its 59 scoped files. Unstaged CWRU controls work and generated `next-env.d.ts` remain excluded.

## Implementation commits

`6de99d2b2a9f130c2f5fd29d1c9fd19ddcc504f7` — `feat(ubc): add student encounters, reviews and private play reporting`

## Archive commit

`docs: record campus community implementation in journal177`

## Lessons learned

Confirm browser ownership before persisting first visits. Serialize cookie creation and removal across tabs and recheck privacy after waiting. Preserve truthful source labels and encounter-only discovery. Build exact committed source after coordinated peer releases rather than shipping shared uncommitted work.

## Follow-up ideas

A private operator dashboard could consume the existing reporting model after separate authentication design. Improve source refresh coverage and support larger datasets with a database when measured capacity warrants it. These are not current feature claims.
