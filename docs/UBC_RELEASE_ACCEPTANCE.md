# UBC release acceptance

Adopted November 1, 2026. Applies to UBC V0.5 onward under the owner's flagship
roadmap. This is standing authorization to deploy each completed, validated
milestone immediately; do not wait for a later version or ask for renewed routine
deployment permission. Failed critical checks retain the healthy live runtime.

Workflow: **Research → Implement → Test → Visual Compare → Commit → Build →
Deploy → Verify Live → Document**. Local iteration may build earlier for QA;
the release artifact must still match the final committed source exactly.

## Milestone ledger

These are flagship planning identifiers. The existing public badge already reads
“V0.5 — Campus community”; follow [version alignment](UBC_ROADMAP.md) and map a
completed milestone to a distinct next-unused public release identifier before
activation. Do not replace that badge with an incomplete foundation claim.

| Milestone | Required outcome | Status |
| --- | --- | --- |
| V0.5 | Reproducible measurements, accepted limited terrain prototype, existing behavior preserved | In progress: instrumentation and initial fixed-view baseline; terrain and full acceptance pending |
| V0.6 | Stadium and Rose reference comparisons, walking and performance acceptance; optional baseball tour | Planned |
| V0.7 | Recognizable Ladner, Koerner, IKB and entrance/Main Mall; both libraries enterable | Planned |
| V0.8 | Public academic/student-life spaces, differentiated residences, reliable information | Planned |
| V0.9 | Continuous landscaped visitor routes and respectful source/rights-supported cultural coverage | Planned |
| V1.0 | Three usable tours, onboarding, access and actual first-time visitor acceptance | Planned |
| V1.1+ | Further accuracy, partnership/research and presentation options | Future opportunities, not release commitments |

A tooling increment or roadmap commit does not satisfy V0.5. Record development
progress without advancing the live version. The most recent documented live
source remains `38d432685765161347cff7b74c2f3dddd14af378`; re-read actual
production identity before a deployment because other applications share it.

## Required evidence for each release

- [ ] Written bounded scope, version identity and acceptance criteria; unresolved limitations listed.
- [ ] Sources checked, rights recorded, B/C reconstruction disclosures preserved; immutable GIS snapshots/manifests verified.
- [ ] Relevant UBC tests, `npm run check`, applicable city/campus/shared-service regression suites, production dependency audit and both required build paths pass. Capture existing warnings separately.
- [ ] Actual affected-view screenshots; architectural changes compared with authentic, usable references; no generated image substituted for a browser capture.
- [ ] Representative performance results with device/browser/preset, raw frame intervals, three repetitions and declared deviations; physical mobile acceptance where claimed.
- [ ] Walking/third-person/aerial/map, source-path travel, entrance/exit, stairs/ramps, Orchard doors/lift, encounter/conversation, audio and optional edition behavior preserved.
- [ ] Relevant desktop/tablet/phone layouts, keyboard/touch focus, reduced motion, console/network errors and broken images/links checked.
- [ ] Protected Motion `/privacy`, `/support`, `/tutorial`, `/motion` behavior on apex and www; existing tutorial canonical/hashes/assets; all peer city/campus/BotSquad applications preserved.
- [ ] Commit source; follow the repository's separate engineering-journal commit and push workflow. Do not include unrelated work.
- [ ] Exact-source Node 22 Linux candidate passes existing workflow; record artifact ID, archive hash and Next build ID. Mac dependencies are never production artifacts.
- [ ] Existing application-owner SSH workflow, production resource safeguards, configuration, persistent stores and peer services preserved. No build in the live checkout.
- [ ] Keep at least 192 MiB available memory and 6 GiB free disk throughout preparation and activation, following [deployment](DEPLOYMENT.md); re-check current runbook if it changes.
- [ ] Verified complete immediate rollback retained; no destructive cleanup or rollback mutation to make a gate pass.
- [ ] Private candidate health/browser checks pass; deploy the completed version immediately using the existing guarded activation procedure.
- [ ] Verify exact live source/build on loopback/apex/www, affected visitor journey and all required asset/peer/store/error checks. Roll back a critical failure.
- [ ] Publish a repository receipt identifying source, milestone, URL, evidence, rollback identity and remaining limits. A Git push or successful CI job alone is not deployment.

Use [CLI access](CLI_ACCESS.md), [deployment](DEPLOYMENT.md), and the latest
production receipt for concrete commands. This document does not replace server
runbooks, lower resource floors, or authorize unrelated infrastructure changes.
No public production reviews or synthetic analytics records are needed for QA.

## Additional V0.5 gates

- [ ] Stadium, Orchard, Nest, IKB, busy outdoors and Halloween measured with reproducible camera/settings; Rose included for the next visual milestone.
- [ ] CPU update and render submission distinguished from RAF intervals; GPU time/memory unavailable fields remain explicitly unknown.
- [ ] Name the largest measured bottlenecks and prioritize targeted changes before broad engine refactoring.
- [ ] Select an elevation tile with documented UBC coverage, horizontal/vertical datum, units, acquisition date, license, source URL and checksum.
- [ ] Build isolated terrain patch and align roads/sidewalks/entrances/building bases/collision to one shared elevation sample; handle no-data and boundary joins.
- [ ] Walk patch seams and sloped entrances in both directions at slow/fast movement; test stairs, below-grade Beaty, camera clearance and return to flat area.
- [ ] Controlled prototype verified visually and against source heights; campus-wide migration remains gated. Synthetic hills do not establish geographic accuracy.
- [ ] End-to-end regressions and required physical-device checks pass; disclose any unresolved performance target before acceptance.

## V1.0 visitor acceptance

Record participant consent, tested source/device, task instructions, successful
steps, confusion/dead ends and feedback without unnecessary personal data. Test
Discover UBC, Study and Live, and Athletics using first-time visitors or prospective
students. Automated coverage and feature counts do not replace this gate.
