# Prompt 088: Prepare the closed Ask launch

- Date: 2026-10-13
- Scope: platform
- Goal: Complete coordinated Ask admission, reading and disclosure preparation without opening intake.

## Original user request

> make sure the images of the employees are in there.

> any changes just directly commit and deploy to prod.

The owner-authorized HQ coordination continued with ASK-LAUNCH: align admission
with claims/delivery and current consent, prevent healthy reading interruptions,
show source dates/limitations, freeze selected context during submission, prepare
actual custody/configuration evidence and deploy closed. HQ subsequently requested
truthful candidate API privacy wording. Existing portraits and page hierarchy were
already deployed and remain required release checks.

## Scope

Website and independent Ask receiver source, canonical package pin, tests,
documentation and a candidate notice. No provider call, credential provisioning,
spending approval, new service grant, Investment mutation or public intake.

## Decisions

Use one shared admission configuration predicate, while retaining exact receipt
recovery before new-admission gates. Old consent cannot create new conversations
or questions; owned reads and controls remain available. Renew healthy owned views
at 15 seconds before their separate 30-second body deadline; honor server retry
and failure backoff even after submission recovery. Disable context removal while
submitting. Show publication, event and retrieval dates distinctly, including
unknowns and source-specific limitations.

Adopt the exact HQ input-ceiling amendment, not a website-owned DTO change. Prepare
ask-api-privacy-v1 separately from the empty approved notice registry. Proposed
retention and backup facts remain proposals; truthful unknowns do not require a
speculative storage redesign or a promise of physical erasure.

## Implementation

Updated receiver admission/configuration, visitor UI polling and evidence display;
added real HTTP admission/consent tests. Vendored canonical source507f93a,
manifest4b61ab70b60f7660a7c2586b88666c5e00ce5ab9b849fb63295ffb095a5aae76.
Prepared the byte-exact closed receiver configuration and actual custody packet.
Replaced obsolete subscription-preparation copy with the proposed API route and
an official provider data-control link. Added three missing optional WASM lock
entries needed for Linux npm-ci consistency; existing versions were unchanged.

## Engineering impact

New intake now requires admission, claims and delivery configuration plus authority
and current consent. Reading stays stable during healthy renewals while stale
bodies still disappear independently. No new dependency or asset was introduced.
The lock repair adds only previously omitted transitive package metadata. Native
Node22 files remain separate from Node24 staging. Live configuration and all
production services are unchanged at this implementation commit.

## Files changed

Shared copy and Ask components/helper; receiver configuration, visitor/HTTP/HQ
gates, focused test and closed configuration; canonical schema/protocol/manifest
and pin; root lockfile; onboarding, architecture, integration, development,
testing, deployment and Ask documentation.

## Documentation updated

The new closed launch packet records proposed versus actual facts, missing
activation inputs, custody limits, candidate notice, checks and guarded release
sequence. Related guides describe behavior, lock repair and the bounded Linux
artifact-build exception. Historical receipts were not rewritten.

## Git diff summary

25 files changed, 517 insertions and 36 deletions. Most additions are the closed
launch evidence packet, focused real-HTTP tests and complete closed configuration.

## Verification

- Node24.21 Linux check, both builds, receiver check/build, canonical generation,
  helper tests and production audits passed before final refinements.
- Production-matching Node22.23.1/better-sqlite3 13.0.3/SQLite3.53.4 confined full
  native suite passed257/257. All62 public probes passed; peers stayed unchanged.
  Peak196,464,640 bytes, zero swap; minimum host available memory243,564KiB.
- A later website-host compiler was stopped by its resource/public-health guard;
  it was not counted as a pass. Final work moved to the larger serialized host.
  An earlier native install there lacked make; no OS tools were installed.
- Strengthened consent checks passed3/3 on both Linux hosts. Final Node22 receiver
  typecheck/build and actual contract regeneration,21/21 UI/Investment tests,
  minimal lockfile dry run, website check, Vinext and Next builds all passed.
  Both production audits had zero findings. Existing Tutorial lint warning remains.
- Next build3eDBZMdlma5Ug7_iw_ZES;243 runtime/source files matched the local hash
  manifest. Linux guards retained at least1,073,384KiB available memory, and
  unchanged peer identities. Heavy slot released after packaging.
- Authored browser fixture passed general/contextual answers, source dates and
  limitations, worker attribution, fixed context during preflight, same-receipt
  recovery during disabled intake, cancellation/deletion and failed-read hiding.
  Focus and scroll survived37.28seconds across normal renewals. No console errors
  or horizontal overflow at six widths320–1920. Reduced-motion rules inspected;
  browser media emulation was unavailable. Local cookie shim is not TLS proof.
- Read-only independent reviewers' findings were fixed, including post-send
  Retry-After preservation and a test that could mask obsolete-consent rejection.
- Whitespace and prohibited/secret-reference scans passed. No assets changed.

## Repository state after implementation commit

Main at1058b13. Only this separate journal is pending; both commits will be pushed.
Production remains on its prior sources until guarded candidate activation.

## Implementation commits

- 1058b13 — Prepare closed Ask launch with consistent admission and source context.

## Archive commit

Record closed Ask launch preparation journal

## Lessons learned

Use matching native runtime evidence and an isolated larger host rather than
lowering production headroom. Preserve retry deadlines across successful recovery.
Prove obsolete consent without an unrelated outstanding-turn conflict masking it.

## Follow-up ideas

Activation requires exact approved identities, finite spending authority,
operational custody facts and genuine execution acceptance; this release does not
supply them.
