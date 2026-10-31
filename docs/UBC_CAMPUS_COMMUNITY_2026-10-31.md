# UBC campus community update

This update adds supplied student encounters, public visitor reviews and private play statistics. Implementation and local validation are complete; production deployment is pending. The previous After Dark release remains separately verified.

## Student encounters

The supplied public research contains 500 UBC identities across 76 study-program labels. Two already existed as rowing athletes, so the import adds 498 characters and enriches those existing people’s conversations. Students remain encounter-only: neither their names nor simulated positions appear in the destination directory. Their appearances are original, varied generic models; no portrait, contact information or real schedule is imported.

Introductions use ordinary conversation, such as “I’m Anton Afanassiev. I study mathematics at UBC.” Follow-up choices explain the study field, nearby campus areas and the public source. Source context stays in the expandable information section. Eleven records have documented checks, including two search-index checks; the other 489 are clearly marked “Research supplied.” This is not registrar confirmation. One malformed source title, Clement PDF, is corrected to Clement Soubrier with an explicit official-directory reference.

Thirty-seven department anchors derive from the committed GIS footprints. All 498 new characters receive collision-tested routes along actual pedestrian source edges. At most twelve streamed named actors are instantiated, alongside the existing fixed cast and ambient population. Selection favours unseen encounters; long-lived actors rotate only beyond 35 metres, outside the camera frustum, after 90 seconds, while active speakers remain stable. See [student import provenance](UBC_STUDENT_IMPORT_2026-10-31.md).

## Public reviews

The shared review component appears above the footer. It provides 1–5 stars, optional written comments, chosen display names, a rating distribution, sorting, pagination, review cards, editing, removal and reporting. It measures visits to this virtual experience, not the university’s quality. There are no fabricated production reviews.

Publication is immediate. An opaque HttpOnly browser cookie controls one review per campus for that browser. There is no account, email collection or identity verification. Comments render as text. Reports remain private and do not automatically remove content. Private moderation can hide, restore or remove records; moderation cannot be bypassed by editing the same record. [Operations](CAMPUS_REVIEWS_OPERATIONS.md) covers private storage, backups and the moderator CLI.

## Private play reporting

The shared tracker and backend support all three campuses. This release integrates the UBC explorer; CWRU and Stanford integration, testing and deployment belong to their respective threads. It records only after exploration begins, with a random first-party browser identifier, campus session, connection IP, basic browser user-agent information and bounded active-play intervals. It does not capture typed content, conversation text, coordinates or a fingerprint, and does not link usage to reviews or public profiles.

Counts represent browsers and sessions, not verified people. Multiple devices, cleared cookies, separate www/apex identifiers, opted-out browsers and concurrent tabs limit interpretation. The client pauses for hidden/off-screen/idle play; the server validates sequence and elapsed intervals. Operator reporting is private. Players receive a notice, opt-out, browser privacy-signal support and removal controls at the shared [campus privacy page](/labs/campus-privacy).

The intended retention is 30 days for IP/browser detail and 90 days for pseudonymous session identifiers, timestamps and duration records, enforced by request/CLI cleanup and scheduled maintenance. Final deployment must verify the actual schedule before claiming this retention is active.

## Validation and release status

- Isolated TypeScript and lint passed for the student/review integration; only the existing tutorial-navigation warning remained.
- All 144 UBC tests and all 13 review backend tests passed, including real concurrent writers, moderation, campus isolation, route collisions and the twelve-actor limit.
- Local browser review actions passed: post, edit, remove, report, rating sort and persistence across reload. Phone 390×844 and tablet 768×1024 had no horizontal overflow. Synthetic fixtures remain local only.
- Local student conversation verified an unlabelled encounter, natural introduction, study follow-up, safe official links and honest supplied-source metadata.
- The final combined-source validation passed all 592 tests: UBC 144, reviews 13, analytics 29, CWRU 89, Stanford 140, Surrey 69, Richmond 27, Vancouver 74 and investment 7. Other-campus suites are regression checks, not evidence of new frontend integrations. TypeScript/ESLint passed with the existing tutorial warning; production dependency audit reported zero vulnerabilities.
- Browser measurement checks verified no record before exploration, one UBC browser/session, accumulating activity, frozen duration after opt-out, browser-owned removal, CWRU inheriting opt-out with zero records, and cross-tab preference changes. Phone 390×844 and tablet 768×1024 privacy controls had no overflow. Localhost correctly stores no IP without the trusted ingress header.
- Next and Vinext builds passed on the final isolated source, based on the committed Stanford implementation plus the scoped UBC/shared changes. Exact committed-source Linux CI and production release are pending. Physical-device testing has not been performed.

Stanford and CWRU owners received the student file and the shared reviews/usage requirements. Their campus source, routing and deployment remain separately coordinated; this report is not evidence that either campus is deployed.

Following the owner’s instruction to keep campus work in its own thread, the tested two-file CWRU integration draft was handed over as a private patch and removed from this working change. Stanford source was never edited by this workstream. Earlier CWRU browser results above describe that draft, not this release’s active feature coverage. Shared API capability does not mean either campus has enabled its interface or recording.
