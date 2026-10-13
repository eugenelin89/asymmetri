# Prompt 085: Explicit synthetic subscription interoperability

- Date: 2026-10-13
- Scope: platform
- Goal: Let HQ test truthful null-cost subscription settlement with the real receiver transport.

## Original user request

> Proceed with implementation, coordinate counterpart work directly where supported, perform verified releases when ready, and provide one unified result.

The authorized BotSquad coordinator requested an explicit test-only subscription
mode for the existing synthetic HTTPS launcher, retaining its original strict mode.
HQ's subscription runtime reports unknown cost; a strict-cap fixture must not
force an invented charge to finish the integration sequence.

## Scope

Test launcher and documentation only. No production code path, configuration,
authority, service restart, public eligibility, visitor intake or model execution.

## Decisions

Add exactly one alternate startup flag. Use the already accepted canonical
subscription policy with null budget and zero router/research executions. Preserve
the original strict limits and all disposable authority/TLS/store/expiry/cleanup.

## Implementation

The launcher accepts --start-synthetic-subscription-interop alongside the unchanged
--start-synthetic-interop. Both require a single exact flag. Documentation adds
signed configuration validation before the independently required control drain.

## Engineering impact

No dependency or canonical package change. Synthetic owner_approved fixture labels
remain explicitly test-only. The installed production receiver remains2b63015 and
closed; a fixture-only commit requires no production restart.

## Files changed

One test launcher, its interoperability guide and testing documentation.

## Documentation updated

Explicit startup commands, mode semantics, separate authority gates and actual
two-mode HTTPS/cleanup evidence.

## Git diff summary

Three files changed, 44 insertions and four deletions.

## Verification

Node24.10 matches .nvmrc; nvm is unavailable. Receiver type-check/build passed.
Both modes passed19-request verified-TLS sequences covering configuration/hash,
paused pre-barrier state, session/CSRF, question, claim/renew/status, answer/retry/
receipt, owned read, deletion and control acknowledgment. Strict limits remained
exact; subscription cost was null with canonical monitored policy. Both passed
SIGINT/SIGTERM startup cancellation and normal shutdown with temporary keys/trees
removed. Three missing/ambiguous flag cases rejected before creating state. Zero
model calls. Independent read-only review found no actionable issue. Whitespace
check passed; unchanged receiver runtime and dependencies reused preceding full
regression/audit evidence without an unnecessary production rollout.

## Repository state after implementation commit

Main, only intended fixture and documentation committed. This separate journal and
implementation commit are pushed together, then an exact source archive is sent
to the authorized coordinator. Public site and receivers remain at verified identities.

## Implementation commits

- 542931694a2eb5d8b68b120a95bc1cde6c2d0bc4 — Add explicit synthetic subscription interop mode.

## Archive commit

Record synthetic subscription interoperability journal

## Lessons learned

Test truthful unavailable cost with an explicit matching fixture mode; never alter
the original strict fixture or invent a charge to force integration acceptance.

## Follow-up ideas

HQ completes and reports its real typed-coordinator transport interoperability
against this pinned disposable fixture. Public Ask remains independently closed.
