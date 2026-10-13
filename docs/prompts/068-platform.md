# Prompt 068: Prepare genuine Ask visitor recovery while keeping intake closed

- Date: 2026-10-13
- Scope: platform
- Goal: Complete website-side INV-ASK-03/04 readiness without enabling operational questions.

## Original user request

> i will be away. you are authorized for everything you need.

Within the owner's authorized cross-chat workflow, HQ requested independent
INV-ASK-03/04 readiness: prepare the genuine production visitor path using
advertised availability/privacy version; remove raw text from browser storage;
preserve private ownership, uncertainty, idempotency and privacy controls; cover
unavailability, restart/restore, races and bounded capacity with isolated fixtures;
return exact receipts and unresolved HQ gates. Safe disabled-state release was
already authorized. Genuine employee/model activity and authority remained held.

## Scope

Website client, focused private receiver corrections, tests and documentation.
No canonical DTO, dependency, public asset, protected Motion content, deployment
configuration, key, roster, provider, account or financial activity changed in
this implementation commit. Receiver source rollout is separate from the website
release. Motion's native slot and physical-device evidence were preserved.

## Decisions

- Mount a genuine production client that can read same-origin apex availability.
  Require an approved disclosure matching service/privacy version and explicit
  consent before admission. The production disclosure list remains empty.
- Keep text and answers in memory. Persist only allowlisted ownership/request
  metadata, admission IDs/hashes and control IDs. Migrate old raw-text storage
  through an in-place content-free intermediate before adding the new key.
- A known admission reconciles through an exact owned ID/hash. An unknown
  admission after reload remains held until verified conversation-wide suppression;
  canonical v1 supplies no visitor lookup by submission key. Never guess from text.
- Keep read/delete independent of availability and roster. Bind session-create
  request IDs to their original privacy version. Retire unresolved bodies after
  privacy actions, invalidate reads on local reset, and bound displayed bodies
  independently of ordinary polling backoff.
- Recover an existing authenticated session receipt before new-admission checks.
  Report actual queue saturation as busy. Preserve held, cookie, expiry and
  receiver authority checks for every action.

## Implementation

The closed production page now has a real visitor path and an apex handoff on
other hosts. Pending work survives reload without raw question storage. Reserved
privacy controls remain usable during pause and ordinary capacity exhaustion.
The readiness document distinguishes current source evidence from operational
HQ custody, authority, disclosure, capacity and receiver rollout gates.

## Engineering impact

No dependencies or contract files changed. Same-origin credentials, bounded reads,
no-referrer links, text-only answer rendering and accessible status/controls
remain. Closed pages poll every five minutes; owned views use bounded retry-aware
polling. Displayed bodies expire after thirty seconds, checked every five seconds.
No source result is relabelled as actual model execution or provider deletion.

## Files changed

Eighteen implementation files: Ask route/client/helpers/copy; two receiver source
files; focused UI, receiver and recovery tests; README and architecture, content,
local-development, testing and Ask boundary/readiness guides.

## Documentation updated

ASK-03 now describes the production path and metadata-only recovery. ASK-04 records
producer receipts, focused acceptance, remaining gates and source/deployment
boundaries. Related onboarding and workflow guides were aligned. Existing release
receipts remain historical until a separately recorded activation.

## Git diff summary

18 files changed, 601 insertions and 198 deletions. Most changes implement private
recovery and its tests, with corresponding documentation and a new gap matrix.

## Verification

- Node 24.10.0; TypeScript/ESLint passed, retaining one unrelated tutorial warning.
- Fifteen UI logic tests and twenty-six focused Ask receiver tests passed.
  The enhanced three-test restore file passed again after stronger HTTP assertions.
- Next webpack production build and Vinext build passed. Both production
  dependency audits reported zero vulnerabilities; canonical nine-file check passed.
- Browser: dropped admission, reload uncertainty, cancellation holding that marker,
  deletion during pause, clean reload and subsequent authored answer; no model call.
  Effective 390/768/1440 widths had no overflow, focus was 3px and no console error
  appeared in the completed flow. Physical-device testing is not claimed.
- Thirty-seven local production route/image checks passed, including exact tutorial
  canonical and all 24 original images. Synthetic flag did not enable a production
  form. Off-apex browser showed a useful apex link.
- Source/privacy scan, unchanged public assets/contracts and diff whitespace passed.
  Existing public GitHub project links were correctly excluded from a broad initial
  private-reference pattern. The development server's generated AGENTS appendix
  was removed, restoring the original instruction file.
- Initial sandbox listener denial was resolved with approved isolated listener
  access. Three initial new test failures were fixture errors (status projection,
  missing control acknowledgment and signature expiry), corrected and rerun.
- Independent visitor and receiver read-only reviews drove recovery, race and
  storage fixes. Final visitor review found no blocking defects.
- Temporary synthetic receiver data and preview processes were removed/stopped;
  Motion received the heavy Mac slot back. Production was not changed by this commit.

## Repository state after implementation commit

Main at 73276d4bb6d893b52173b27f1942f4e0313a1d30, clean and one commit ahead
of origin before this separate journal. No unrelated work was staged.

## Implementation commits

- 73276d4bb6d893b52173b27f1942f4e0313a1d30 — Prepare private Ask visitor recovery and disclosure gates.

## Archive commit

Record prompt 068 Ask visitor readiness journal

## Lessons learned

An idempotency key is not a recovery credential or proof of admission. Preserve
uncertainty until an authoritative owned receipt resolves it. Admission availability
must not determine access to existing privacy controls or answer freshness.

## Follow-up ideas

Complete the separately owned HQ custody/authority evidence and measured real-host
capacity; publish only verified real privacy facts; roll out receiver fixes with
an independent service receipt. None of these is implied by a closed website release.
