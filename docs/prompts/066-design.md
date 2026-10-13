# Prompt 066: Dormant Ask visitor interface

- Date: 2026-10-13
- Scope: design
- Goal: Implement and verify the visitor interface while genuine public Ask remains closed.

## Original user request

> i will be away. you are authorized for everything you need.

Continued the already authorized website/receiver/Ask integration and coordination
with the HQ and Motion chats. The accepted scope permits a truthful unavailable
production page and interactive local synthetic acceptance. Actual provider
execution, service authority, retention disclosures and public intake remain
separate acceptance work; broad authorization does not manufacture that evidence.

## Scope

Added the general/contextual Ask page, dormant local client, focused tests and
documentation. No receiver, canonical contract, deployment service, dependency,
asset, real visitor data or operational authority changed. HQ remains account-401
held. This implementation commit did not deploy a website or activate Ask.

## Decisions

- Hard-gate the client to development and the explicit synthetic fixture mode.
  Production offers no switch to enable intake.
- Keep future privacy disclosures conditional; preserve Motion's product policy.
- Use the canonical DTO schema and same-origin browser paths. Render plain text
  with worker/routing attribution, timestamps and exact evidence references.
- Freeze request identity/input before admission and keep it through uncertain
  transport. Confirm owned question ID, hash and input before clearing it.
- Preserve privacy-control identity, hide bodies during uncertainty and distinguish
  suppression receipts from physical deletion/provider purge claims.
- Store bounded tab metadata and pending input only; fetch answers again. Honor
  one active question and eight answered turns while permitting declined history.

## Implementation

The public server page explains that questions are not open, accepts only exact
public record-reference parameters and exposes no form or session. The local
synthetic client supports consent, explicit send, attributed replies, follow-up,
same-request retry, manual/visible polling, cancellation, deletion and session
recovery. It holds unknown outcomes, suppresses stale/unverified answers and
announces replies without moving the reader's position.

## Engineering impact

Added one focused client hook, rendering component, schema/transport helpers and
token-based CSS. No new library or server state. Independent review corrected
historical-input false confirmation, aggregate history limits, service/hash
binding, paused retries, lost initial session recovery, storage-failure messaging,
stronger expiry receipts, context labels and repeated-answer announcements.

## Files changed

- Ask route/style, conversation components and investment contextual entry link.
- Central public/synthetic copy, browser contract/transport helpers and tests.
- README and architecture/content/development/testing/deployment guidance, plus
  the detailed Ask UI boundary and acceptance record.

## Documentation updated

`docs/ASK-03-WEBSITE-UI.md` records privacy/storage/retry behavior, local-only
configuration, browser test limits and remaining real-use work. Existing guides
now distinguish unavailable production from implemented synthetic interface.
No asset manifest update was needed because no public asset changed.

## Git diff summary

Implementation: 15 files changed, 709 insertions and 10 deletions. Most additions
are the client, focused regression tests and acceptance documentation. This
journal is excluded from those totals.

## Verification

- Nine focused Node tests passed, including mismatched admission hash/input,
  repeated pagination, unsafe links, foreign service and stronger suppression.
- TypeScript/ESLint passed with the existing tutorial navigation warning.
- Next webpack production and retained Vinext builds passed. The default
  Turbopack build encountered the documented local socket-permission error;
  the supported webpack fallback completed. Production audit found zero issues.
- Browser fixture exercised authored answers, consent, lost question response,
  refresh and paused replay without increasing the two-question count, expired
  cancellation, deletion/no restoration, lost session recovery, contextual
  references and outcome-unknown hold. No employee/model ran. HTML-like authored
  content was rejected by the receiver before delivery.
- The local HTTP cookie adapter is not production Secure-cookie proof. Verified
  TLS acceptance remains separately recorded in the preceding packet.
- Built production remained form-free with the synthetic flag present. It rejected
  unsupported query fields. Actual iframe viewport widths 390/768/1440 showed no
  overflow; direct viewport overrides were ignored. Keyboard focus was visible,
  completed fixture flow had no console errors, and no images were broken.
  No new motion was added; existing reduced-motion rules remain.
- New public copy/source reviewed for privacy and prohibited references; credential
  pattern scans and `git diff --check` passed. Assets and nine vendored files are
  unchanged. Next-generated unrelated instruction/type changes were removed or
  restored by production generation.
- All temporary browser fixture trees, keys and local preview processes were
  removed/stopped. Final production-preview fixture counts were all zero.
  Mac heavy slot was explicitly released to Motion after serial validation.

## Repository state after implementation commit

On `main`, clean after implementation, one commit ahead of `origin/main` before
this journal. The packet began from clean, fast-forwarded `d1ddbe6`. No branch,
worktree or PR was created. Push follows the separate journal commit.

## Implementation commits

- `0b803a4` — Add dormant Ask visitor interface and synthetic acceptance coverage

## Archive commit

Record dormant Ask interface engineering journal

## Lessons learned

Input equality cannot identify a submission. Bind the admission and owned read
to exact immutable identity while preserving retries through paused admission.
Verify actual viewport dimensions instead of assuming a successful browser API
call resized the page. Keep synthetic transport acceptance separate from genuine
provider execution and operational privacy guarantees.

## Follow-up ideas

Finish producer typed-client interoperability, verified provider/retention and
purge/restore acceptance, eligible roster/budgets and genuine execution before
designing a production enable path. These are not completed by this packet.
