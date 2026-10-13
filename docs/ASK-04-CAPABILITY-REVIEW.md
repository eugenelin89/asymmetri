# Ask subscription capability consumer review

October 13, 2026. This is a source implementation plan for HQ's proposed canonical
amendment, not an accepted manifest, runtime capability or admission authorization.
The website still vendors producer ba3dd74 and manifest
`7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`.
No vendored file, live configuration or approved privacy notice changes here.

## Proposed shape and compatibility

HQ proposes adding `activity_capped_subscription` to
`AskLimits.monetaryEnforcement`. That mode requires `dailyBudgetUsd:null` and a
closed `subscriptionActivityPolicy` object with these exact values:

| Property | Required value |
| --- | --- |
| `version` | `1` |
| `tokenLimits` | `monitored_thresholds` |
| `actualCost` | `unavailable` |
| `overshoot` | `possible` |
| `internalRetries` | `possible` |
| `onMissingUsage` | `hold` |
| `onThresholdViolation` | `hold` |

The policy must be absent from both existing modes. Keep their exact existing
validation, especially the positive verified monetary budget requirement. Null is
unknown/unavailable, never a measured zero charge. This addition can preserve old
valid payloads, but old pinned validators cannot accept the new mode. Coordinate
consumer/producer pin updates before using it; a `1.0` label does not make different
manifest bytes interchangeable.

HQ reports Codex 0.157 provides neither an included-only selector nor hard
`turn/start` output-token enforcement. The website cannot manufacture those
capabilities. An 8,000-character published answer bound is enforceable locally;
it is distinct from provider generation tokens, internal retries and billing.

## Consumer implementation after an accepted canonical hash

1. Verify HQ's accepted commit, manifest, all nine file hashes, generated types,
   examples and protocol text; vendor the exact package through the existing
   verification workflow. Do not create a website-only DTO or endpoint extension.
2. Let canonical validation enforce the conditional shape in
   `receiver/src/ask/config.ts`; retain its existing strict mode and activation
   checks. Add focused rejection cases for a non-null activity budget, absent or
   extra policy fields, changed constants, and policy supplied to strict modes.
   Do not infer approval or availability from the new enum alone.
3. HQ must prove durable finite authority, pre-wire reservations, complete real
   usage accounting and admission holds on missing usage or exceeded thresholds.
   Monitored thresholds can overshoot in the completing turn or provider retries.
   Receiver queue/request limits do not prove provider token or dollar caps.
   Cancellation is not a promise that already-submitted provider work stops.
4. Review the canonical validation imported by `lib/ask-client.ts` and existing
   `components/ask/use-ask-chat.ts` gates. Current availability has no cost/usage
   state, and limits are not a public readiness endpoint. If new runtime evidence
   must cross that boundary, HQ must define and authenticate it canonically,
   including expiry and control-generation binding. Do not infer evidence from
   text, a login result or an unverified flag.
5. Add the actual service/privacy pair to `approvedAskPrivacyNotices` in
   `content/site.ts` only with reviewed operational facts: operator and HQ access,
   provider/research recipients, retention and recovery exclusions, unavailable
   actual cost, monitored limits, overshoot/retry possibility and deletion limits.
   The registry remains empty now. Keep owned reads, deletion/cancellation and
   receipt recovery available while new admission is held where existing safety
   bounds permit.
6. Test old strict examples unchanged; new positive/negative goldens; unknown cost
   never becoming zero; missing usage and threshold-breach holds; duplicate,
   cancellation and restored attempts never resetting daily accounting; uncertain
   provider outcomes never authorizing an automatic retry; and mismatched privacy
   versions preventing consent/admission. Run existing receiver and browser tests
   against the exact accepted package before any release.

## Blockers and owner intent

There is no website design objection to the explicit variant. Acceptance still
needs the canonical hash and the producer enforcement/usage evidence above.
Public-service account eligibility remains a factual evidence requirement, not an
invented provider API flag. Operational HQ custody/restore, genuine employee
execution, actual privacy disclosure and combined workload capacity remain open.
There is no new purchase, reload, paid-account fallback or owner-approval request
for preparing this source work. The owner already authorized proceeding.

HQ PR 85 merged at `705ff3102c41cdfa51eec6c2789602e52401c8b7`; the local producer
checkout independently resolves that commit. HQ reports 385/385 affected checks,
424 source hashes, four reviews and retained raw logs. It adds dormant finite Ask
authority and pre-wire attempt custody, without a runtime caller, dispatcher,
contract change or public admission. It is not the deployment of this proposal;
recorded running HQ remains d262a8d. Preserve the exact live investment IDs and
receiver process throughout this later Ask work.
