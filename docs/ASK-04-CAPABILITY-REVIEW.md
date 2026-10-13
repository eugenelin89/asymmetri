# Ask subscription capability consumer review

October 13, 2026. The repository now adopts merged HQ PR 86 at
`9ff8cc984954f2e822ec191de60dcd39607ea1a7`, reviewed source
`b2f3de2612e71acf8ebda60af7d2ccc701bf1ab5`, with manifest
`27f73af2099dc086ebf1893bb2613c5a8f18200b752d8d48960107386cb40264`.
It is byte-identical to the previously accepted candidate below. This permits
validation of the explicit mode; it creates no runtime enforcement or admission
claim. Live configuration and the empty approved privacy registry stay unchanged.

## Accepted shape and compatibility

HQ added `activity_capped_subscription` to
`AskLimits.monetaryEnforcement`. That mode requires `dailyBudgetUsd:null`,
zero router/research executions and a closed `subscriptionActivityPolicy` object
with these exact values:

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

## Consumer implementation and remaining integration

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

There is no website design objection to the explicit variant. The accepted hash closes package identity; operational acceptance still
needs the producer enforcement/usage evidence above.
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

## Historical frozen candidate acceptance

HQ supplied a frozen, still-unmerged candidate on October 13. The nine-file package
and every manifest member were independently hashed. Candidate identities:

| File | SHA-256 |
| --- | --- |
| Manifest | `27f73af2099dc086ebf1893bb2613c5a8f18200b752d8d48960107386cb40264` |
| Schema | `101f9cd1e2d7ff4e40d5885360185f2e51a2735ca717ec972e03eba0ed281a62` |
| Protocol | `4ac790a5b4b1f08659828a0a63c7558a3fe1d59c5f05618c45a00f203f245b93` |
| Types | `ecbb999ceea4058825fdb86d438aad0da839147896978b3434e253ef68592f0b` |

Only `AskLimits` and the new nested `AskSubscriptionActivityPolicy` definition
change in the schema. The catalogue, goldens, OpenAPI, response examples and
signature vector remain byte-identical. The nested policy is not a new endpoint
or independently admitted public root. All existing investment definitions and
signatures remain unchanged. The protocol explicitly requires zero optional
router/research work and describes durable holds, complete usage preservation,
unknown costs and window accounting as HQ responsibilities.

The candidate was copied only into a disposable receiver staging tree, with an
explicit `UNMERGED-CANDIDATE-NOT-A-RELEASE` source marker. The repository and live
vendor directories were not replaced. Exact-package/type-regeneration checks,
TypeScript build and all 236 existing receiver tests passed on local Node 24.10.0.
All 15 existing browser-logic tests passed against the candidate schema in the
same separate tree. The previous pinned consumer was independently confirmed to
reject the new mode with `INVALID_SCHEMA`, as intended.

`receiver/deploy/ask-capability-acceptance.test.mjs` provides four additional
consumer cases against an explicitly selected compiled runtime. They pass for:

- null cost preserved with all activation flags still false;
- mixed numeric budget/router/research combinations, missing/extra/wrong policy
  fields and changed policy constants rejected;
- both strict shapes preserved, subscription policy forbidden there, and the
  receiver's positive verified-budget rule retained;
- unchanged owner-approval, non-null approval record and roster requirements for
  each operational flag. Parsing a synthetic approved object starts no listener.

The existing `askConfig` validates the complete canonical object and preserves it;
no duplicate website-owned conditional parser is needed. The browser's canonical
validator accepts unchanged public DTOs. This candidate adds no public limits or
usage endpoint, so visitor limits/cost disclosure still needs reviewed fixed copy
for the actual service/privacy pair, with clear monitored-threshold and unavailable
cost wording. No notice is published from candidate test results.

The merged package was independently compared with the candidate, then adopted
byte-for-byte with the merged source pin. The four capability cases now run in
`npm run receiver:test` after the existing receiver suite. Canonical validation
and existing owner/roster/strict-budget guards require no duplicate runtime parser.
The closed page describes the planned monitored mode, unknown operator cost,
possible retry overshoot and hold conditions. This is advance disclosure, not
consent for a configured live provider; the approved notice registry stays empty.

HQ reports 396 affected passes, zero failures and one optional unconfigured
interoperability skip, plus 32/32 expanded authority cases, build/typecheck/contract
checks, 424 source hashes and 15 retained logs. GitHub checks/statuses/reviews were
empty; no CI success is inferred. These are producer-reported source results.
Actual AskService/Dispatcher/ephemeral employee/outbox integration and genuine
operational acceptance remain the next HQ packet. The preceding deployment
receipts identify the installed source until a separate rollout is verified.


## Accepted consumer source verification

The adopted merged package passed the exact nine-file/generated-types check,
236 existing receiver tests, four capability acceptance groups and fifteen UI
logic tests on Node 24.10.0. Website TypeScript/ESLint passed with the existing
tutorial navigation warning; standard Next webpack and Vinext production builds
passed. Both production dependency audits reported zero vulnerabilities. Initial
sandbox socket/DNS denial was retained separately; approved reruns passed.

The closed production build was checked in a desktop browser engine at
390/768/1440 CSS pixels: no composer, horizontal overflow, broken images or console
errors, and a 3px keyboard focus outline. This is responsive browser evidence,
not physical-device or genuine model acceptance. No styling, animation or asset
changed. The changed public copy was reviewed for private organization, athlete,
credential and prohibited product references; it introduces none.

Two independent read-only reviews accepted the canonical compatibility and
closed UI/consent boundary. They reviewed base b25cb43 and initial binary-diff
SHA-256 e28c756dab14d00c9c2f990016465eae6d275f4d973ef19bf786fb59c6f26e9a.
Their stale architecture/readiness documentation findings were corrected before
commit; no runtime finding remained. Production stays at website d0c4543 and
Ask receiver 4daa713 until the separately verified release. Investment generation
one and its runtime read configuration remain independent and must be preserved.
