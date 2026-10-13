# Prompt 067: Release the unavailable Ask page

- Date: 2026-10-13
- Scope: deployment
- Goal: Publish the reviewed unavailable Ask page while preserving private-service and Motion boundaries.

## Original user request

> i will be away. you are authorized for everything you need.

Continuation of the owner's standing explicit instruction to proceed to deployment
and public release when ready without asking again. HQ coordination confirmed
release of the reviewed unavailable page under that authority. Genuine Ask
execution and visitor intake remain unready and were not activated.

## Scope

Built and deployed website source `d51288fc52b0faa4401848ec9d009ad3cc3ae87b`,
then documented exact release, preservation, rollback and producer-reported typed
synthetic interoperability. No receiver authority/runtime/configuration, shared
ingress, OS, DNS, certificate, dependency, asset or operational archive changed.

## Decisions

- Stage an independent application-owned complete candidate; never build in the
  serving directory. Check lockfile equality before copying dependencies.
- Preserve the entire prior 97b4087 release as immediate rollback. Stop/start only
  the existing website service for the directory swap.
- Keep production free of synthetic configuration and an Ask conversation client.
  The public page has no input/form and makes no Ask requests through that client.
- Report the provider's typed-client acceptance as synthetic and producer-owned,
  without equating transport/control acknowledgment with physical purge or genuine
  employee execution.
- Review the retained unsupported-OS exception and keep independent recovery and
  real-use capacity limits explicit. No migration or new expense is implied.

## Implementation

Activated at 18:24:52 UTC: source d51288f, build `vEx_G48mhinsBJBGK839J`, website
PID 2378322, service start 18:24:51 UTC. Live clean source matches the reviewed
candidate. The complete predecessor remains at
`/var/www/asymmetri-rollback-20261013-97b4087`, with source
`97b4087b79c5f0f1472fd71dde86765489273400` and build `kcKfT0zA-jDnr0xVy1Suy`.

The root-only release receipt directory records before/after routes, configuration
fingerprints, service identities, private counts and activation identity. A guarded
rollback script preserves the failed candidate and restores the complete predecessor.
No rollback was needed. Temporary candidate preview was stopped before activation.

## Engineering impact

The public website now explains Ask's unavailable status and prerequisites clearly.
Investment remains unconfigured. There is no visitor session, provider call or
new service authority. The deployed functional client cannot mount in production.
Documentation now distinguishes this running release from the historical initial
investment release and from source-only or synthetic acceptance.

## Files changed

- New dated Ask release receipt with exact identities, validation and recovery.
- Ask UI and interoperability guides, integration map, initial investment/ingress
  historical pointers, deployment guide and README.
- No application or receiver source changed in this documentation packet.

## Documentation updated

Independent review found stale “current” 97b4087 references and already-completed
helper/synthetic UI/interoperability work presented as future. These were updated
to d51288f or labelled historical while preserving remaining real-use gates.

## Git diff summary

Eight files changed, 140 insertions and 14 deletions in the implementation commit.
This journal is excluded. Changes record verified release evidence and reconcile
current versus historical status; no raw logs, diffs or private records are copied.

## Verification

- Exact independent Linux candidate, Node 22.23.1, check and standard Next
  Turbopack build passed. Existing tutorial warning only; production audit zero.
- Thirty-four live/candidate route and redirect checks passed before activation.
- Fresh 112-check before/after comparison preserved all 15 hosts, IPv4/IPv6/default
  TLS behavior, 28 routes, exact www tutorial canonical, 54 hash links and 48
  original-image URL/content checks. Existing unrelated error/retired responses
  were retained. All 16 Nginx file hashes and recorded other service PIDs stayed
  unchanged.
- Public Ask apex/www 200 with unavailable copy, no form/textarea. Browser confirms
  noindex/nofollow, no-referrer, Motion footer links, no overflow/console errors.
- Availability 200/disabled/private-no-store; correct advertised privacy version
  produces session 503/UNAVAILABLE with no cookie. The initial smoke request used
  the fixture version and was corrected. Encoded API alias 404 and duplicated
  original Connection header 401 confirm retained strict routing behavior.
- Final investment and Ask counts are zero. Ask admission, claims and delivery
  remain false, roster empty. Canonical manifest unchanged. Recent logs show the
  intentional predecessor termination and a successful new startup.
- HQ reports one passing typed-client test against pinned fixture d1ddbe6: 16 HTTPS
  requests, one durable deletion suppression, owned read 404, final empty barrier
  and complete fixture cleanup. Producer implementation 9a1eb5c is separately
  owned. Model calls zero; content purge and restoration remain unverified.
- Local documentation links and diff whitespace checks passed. Mac heavy work
  remained released to Motion; deployment builds ran remotely only.

## Repository state after implementation commit

Clean `main` at `33d9a07`, one commit ahead of origin before this journal. The
packet began from clean, fast-forwarded d51288f. Production deliberately remains
pinned to d51288f; these documentation commits do not replace its tested build.
No feature branch, worktree, PR, merge or force push was used.

## Implementation commits

- `33d9a07` — Record unavailable Ask page release and typed interoperability receipt

## Archive commit

Record unavailable Ask public release engineering journal

## Lessons learned

Use advertised API contract values in production smoke checks, not fixture values.
Retain exact running source/build identity even as documentation advances. A public
unavailable page can be delivered without manufacturing genuine service readiness.

## Follow-up ideas

HQ owns private content custody, finite budgets, healthy authentication and actual
employee execution. Provider disclosures, physical purge/restore, independent backup
custody and real-use activation remain separate work. No recurring task was created.
