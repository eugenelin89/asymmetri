# Prompt 086: Public investment status wording

- Date: 2026-10-13
- Scope: content
- Goal: Describe published status without inferring private scheduling or market observations.

## Original user request

> any changes just directly commit and deploy to prod.

The authorized BotSquad coordinator requested a narrow correction after reviewing
the live Investment page: absent public review times must not assert that private
scheduling is unconfigured; publisher contact must remain separate from market
freshness; a prospective snapshot session date must not imply an observation.
This follows the owner's employee-portrait and easy-navigation requests.

## Scope

Public website copy and the existing status presentation only. No private schedule
is exposed or hardcoded. No protocol, receiver, dependency, data, financial value,
worker activity, authority or Ask gate is changed.

## Decisions

Missing/null review time reads “Not published” with a loaded-record limitation.
The canonical combined freshness label is “Archive freshness”; its unknown value
is preserved. The published heartbeat receipt has a separate label and UTC time.
Only the exact known unknown/null-session receiver reason is translated into
market freshness unavailable in the public archive. Stale and all other reasons
remain verbatim. Snapshot dates identify their described session.

## Implementation

Shared status copy, one narrow reason presenter, status and desk use, and a
portfolio warning wording correction. Existing employee portraits remain intact.

## Engineering impact

No new network reads, state, dependencies or authority. Existing semantic layout
and accessibility controls retained. Receiver source and operational settings
remain unchanged; deployment is website-only after candidate validation.

## Files changed

Six files: status helper, three investment components, centralized copy and
content guidance.

## Documentation updated

Content guide explains archive freshness, heartbeat receipt, unpublished reviews
and snapshot session dates.

## Git diff summary

Six files changed, 35 insertions and four deletions.

## Verification

Node24.10.0 matches .nvmrc; nvm unavailable. TypeScript/lint, Next webpack and
Vinext builds passed. One pre-existing tutorial lint warning. Six investment
tests passed after allowing the sandbox-blocked loopback listener. Production
dependency audit found zero vulnerabilities. Browser checked320/390/768/1024/
1440/1920 widths: no overflow, both portraits loaded, exact UTC heartbeat and
publication times, unknown freshness, Not published review, corrected prospective
snapshot label, no console errors. Viewport reset. Added-copy privacy/credential/
superseded-brand review and whitespace checks passed. Independent read-only review
found no material issue. No new tests for this small presentation correction.

## Repository state after implementation commit

Main at f9696808f3cf224e731c9910faaa530b3a4456df; only intended files committed. This journal is committed
separately and both commits are pushed before candidate preparation.

## Implementation commits

- f9696808f3cf224e731c9910faaa530b3a4456df — Clarify published investment status and snapshot dates.

## Archive commit

Record public investment status wording journal

## Lessons learned

An absent public field establishes a publication limitation, not the private
system's configuration. Preserve separate evidence clocks and unknown values.

## Follow-up ideas

Complete the authorized guarded website-only release and retain its receipt.
