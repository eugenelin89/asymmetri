# Prompt 032: Motion V1.2 privacy and support publication

- Date: 2026-10-06
- Scope: content
- Goal: Reconcile the protected Motion Privacy and Support pages with the accepted V1.2 candidate before App Review.

## Original user request

The owner supplied the V1.2-05 TestFlight / App Store first-public-release execution request. Its website instruction is:

> Before public App Review submission, verify live:
> - Privacy Policy URL;
> - Support URL.
>
> Apply the prepared V1.2 policy/support additions if they have not yet been published, including accurate descriptions of:
> - Notes;
> - Pitch Context;
> - References;
> - local Files import;
> - Saved Comparisons;
> - PDF/original-video sharing behavior.
>
> Do not overstate data retention or collection.
>
> If website publication lives outside this repository, follow the documented owner deployment path rather than editing an unrelated repository blindly.
>
> Verify live pages return successfully after publication.

Decision-oriented summary of the broader request: distribute only the accepted Motion release/1.2 source `8a2f5e57836ee9ca981ef70fcc0845d3b38e13fd`, version 1.2 (2), preserving bundle/team and retained data. Resolve authenticated Apple history/signing, upload to owner-only TestFlight, perform physical smoke, prepare genuine screenshots and accurate listing/privacy/commercial declarations. No features, external beta or public link. Final Submit for Review needs separate explicit owner authorization; shipped tag follows actual availability. Private credentials, trader/contact and financial details stay in Apple's UI. This website work satisfies only the public-page component and does not establish app distribution or public availability.

## Scope and decisions

Follow existing website main/two-commit workflow and DigitalOcean deployment route. Only utility-page copy changes; existing anchors, routes, shared layout, app availability wording, dependencies and website/Gmail/Apple practices remain intact. Effective policy date becomes October 6, 2026. Reuse the source-audited V1.2 policy handoff; no new data handling or retention promise is introduced.

## Implementation and engineering impact

Privacy identifies local Notes/Context/Reference/saved comparison records, Files copies, explicit PDF/original sharing and source-independent deletion. Support explains Notes/Context/sharing, Reference Study and explicit clip-time comparison, plus missing-source recovery without destructive reinstallation. Personal analysis remains separate from Reference content. No API, collection mechanism, dependency or runtime change.

## Files changed and documentation

- `content/site.ts`: protected policy/support articles and metadata.
- `docs/CONTENT_GUIDE.md`: candidate-specific truth and unchanged service-handling boundaries.

## Git diff summary

Implementation: two files, 38 insertions and six deletions. Additive product disclosure and focused replacement of outdated copy; no raw diff embedded.

## Verification

Initial public Privacy/Support GETs return 200 and lack the prepared V1.2 disclosures. Clean local/remote and production source were `c8908b144c7e26aa737f0a74ed92b6fa08fc1309`. Production service active, 8.1 GiB free at preflight.

Local nvm is absent; installed Node v24.10.0 matches `.nvmrc`. Initial check fails because dependencies are missing (`tsc` unavailable). `npm ci` restores the unchanged lockfile, then `npm run check`, `npm run build` and `NEXT_TELEMETRY_DISABLED=1 npm run build:next` pass. Local native browser verifies the changed policy/support text and mutual link. Full diff and `git diff --check` pass. No layout/assets changed, so no broad viewport campaign.

`npm audit --omit=dev` runs and exits 1: five inherited advisories (one moderate, three high, one critical), involving baseline-browser-mapping, nanoid, Next.js, sharp and source-map-js. This is not a clean audit or proof of exploitability. Package/lockfile/configuration are byte-unchanged; this copy-only task does not silently upgrade runtime dependencies. Browserslist also reports old data; no unrelated update performed.

Deployment is authorized by the request above and proceeds after this journal commit/push through isolated copy-only staging, application-owned build and preserved rollback. Exact activation/build and live-content receipts belong to the external release evidence and Motion V1.2-05 distribution ledger; this predeployment journal does not claim success ahead of observation.

## Repository state after implementation commit

Clean main at `5dea32d4b7ca21cc2fb49af142a7a2d94efef9c5`, one implementation commit ahead of origin/main before this separate journal commit. No unrelated work present.

## Implementation commits

- `5dea32d4b7ca21cc2fb49af142a7a2d94efef9c5` — Document Motion 1.2 local records and sharing on public support pages.

## Archive commit

Record Motion V1.2 public policy and support request.

## Lessons learned and follow-up

App privacy disclosure and external website/support handling require distinct boundaries. Build success does not imply a clean dependency audit. The inherited dependency advisories remain a separate website maintenance concern; no expanded implementation is committed here.
