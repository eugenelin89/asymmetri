# Prompt 076: Frozen Ask subscription candidate consumer acceptance

- Date: 2026-10-13
- Scope: platform
- Goal: Prepare verified consumer acceptance for HQ's frozen candidate without adopting an unmerged contract or opening Ask.

## Original user request

> i will be away. you are authorized for everything you need.

Authorized HQ coordination supplied a frozen canonical package with manifest
27f73af2099dc086ebf1893bb2613c5a8f18200b752d8d48960107386cb40264 and requested
review/preparation of config validation, truthful limits/cost disclosure and
mixed-mode negative tests. The final repository pin must wait for the merged HQ
source. HQ also relayed the owner's question about why first collection is
scheduled for tomorrow: document the prospective session timing rather than
implying a Yahoo restriction or postponing integration tests. This record omits
the private local producer checkout path.

## Scope

Read-only candidate inspection, isolated staging acceptance, a reusable explicit
consumer test harness, review/test documentation and the timing clarification.
No canonical repository/live pin, production code/config, authority, market clock,
portfolio, public privacy registry or deployment changed.

## Decisions

- Verify every candidate hash and generated declaration before testing.
- Keep the unmerged package only in a disposable staging tree, explicitly marked
  UNMERGED-CANDIDATE-NOT-A-RELEASE. Preserve the old tracked/vendor pin.
- Reuse canonical object validation rather than duplicating a conditional parser.
  Existing receiver config preserves the complete validated limits and retains
  strict budget and activation checks.
- Activity mode requires null cost, zero router/research executions and the exact
  closed policy. Unknown cost must never become zero; monitored thresholds and
  internal retries can overshoot. Genuine usage/hold enforcement remains HQ work.
- Keep the test harness explicit because the old pinned runtime must reject the
  candidate mode. Do not add a knowingly failing case to the default old suite.

## Implementation

Added four candidate consumer cases with multiple negative mutations covering
policy constants, missing/extra fields, mixed modes, numeric cost, optional work,
strict-mode compatibility and unchanged owner/roster activation requirements.
All stores are disposable directories; parsing starts no listener or execution.

Expanded the capability review with exact frozen identities, unchanged investment
wire files, candidate acceptance and the final merged-pin adoption procedure.
Clarified that the October 14 first full prospective paper session follows the
October 13 close/decision cutoff; independent diagnostics and integration can
continue without backdating or broadening finite authority.

## Engineering impact

No runtime or dependency behavior changed. The candidate's only changed schema
definitions are AskLimits and nested AskSubscriptionActivityPolicy. Catalogue,
goldens, OpenAPI, response examples and signature vector are byte-identical. The
existing browser DTO boundary requires no new endpoint or fabricated capability.
Reviewed actual service/privacy disclosure and HQ eligibility remain open.

## Files changed

- Explicit Ask capability acceptance harness.
- Capability review, investment timing handoff and testing instructions.

## Documentation updated

Recorded exact candidate manifest/schema/protocol/types, direct consumer evidence,
old-consumer rejection, future adoption sequence, current pin preservation and
truthful disclosure requirements. The timing clarification changes no schedule
or public investment result.

## Git diff summary

4 files changed, 144 insertions and 2 deletions. Changes are a 75-line acceptance
harness and focused review/testing/timing documentation. No candidate package,
generated staging files, raw test logs or current prompt record is in this total.

## Verification

- Clean main and successful fast-forward pull before new edits.
- Candidate exact nine-file membership, all member hashes and generated types
  verified. TypeScript build passed in the isolated staging tree.
- All 236 existing receiver tests passed against the candidate (18.8 seconds).
- All 15 existing browser-logic tests passed against its schema.
- Four new consumer cases passed, including repeated mixed-mode mutations and
  preservation of the existing strict positive monetary-budget check.
- Current repository-pinned consumer rejected the new mode with INVALID_SCHEMA.
- Local Node 24.10.0 matches `.nvmrc`; nvm absent. Syntax, TypeScript/ESLint and
  whitespace checks passed with only the existing tutorial navigation warning.
- No vendor or source-pin diff, production operation or public intake change.

## Repository state after implementation commit

Main at 6bd06b048106baa471cdd77f9083bb51cde63aa7, clean before this record and one commit ahead of pushed
104b22f. Only this task's preparation is included. Commit the journal separately
and push both commits. Final canonical adoption remains conditional on HQ's
accepted merged source; a passing candidate is not a production release.

## Implementation commits

- `6bd06b048106baa471cdd77f9083bb51cde63aa7` — Prepare isolated Ask subscription capability acceptance.

## Archive commit

`Record frozen Ask capability consumer acceptance journal`

## Lessons learned

A wire extension can preserve old payloads while remaining incompatible with old
pinned consumers. Separate candidate compatibility from runtime enforcement and
public eligibility, and preserve explicit unknown-cost semantics throughout.

## Follow-up ideas

When HQ supplies the accepted merge, compare exact bytes, vendor/pin that commit
and run the committed consumer acceptance against it. Repeat affected checks if
candidate bytes change. Keep genuine execution, custody, combined capacity and
reviewed disclosure as distinct admission gates.
