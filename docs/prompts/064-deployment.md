# Prompt 064: Verify TLS readiness before certificate reload

- Date: 2026-10-13
- Scope: deployment
- Goal: Fix the startup race found during authorized loopback service installation.

## Original user request

> i will be away. you are authorized for everything you need.

Continuation of the previously authorized deployment and its actual Linux checks.

## Scope

Fix the certificate hook's readiness test and unexpected-exit restart policy.
Public routing, website content and receiver authority remain unchanged.

## Decisions

Systemd Type=simple active state precedes application readiness. Sending HUP while
Node loads modules can terminate it before its handler exists; systemd treats that
signal as a clean exit. Verify the existing live certificate before publishing or
signaling a replacement, with a bounded 15-second window. Restart unexpected TLS
process exits while preserving explicit operator stop behavior.

## Implementation

Added pre-reload live-certificate verification, a time-bounded readiness loop and
Restart=always for the TLS service. Documented the actual-installation finding and
explicit directory modes required under root umask 0077.

## Engineering impact

No contract, Node dependency, website rendering or financial/private data change.
The issue occurred entirely on loopback before public Nginx routing changed.

## Files changed

TLS unit, root certificate hook and ingress operational record.

## Documentation updated

The ingress runbook now distinguishes systemd active from verified TLS readiness
and records the startup race and operator directory-permission correction.

## Git diff summary

3 files changed, 20 insertions and 2 deletions.

## Verification

- The exact prior committed Linux runtime built with its unchanged lockfile,
  passed 230/230 tests and a zero-vulnerability production audit before installation.
- New Ask store initialization: integrity/FKs pass, zero sessions/questions/answers/
  controls/receipts, generation zero and no authority. Admission/claims/delivery
  remain false. The private Ask listener starts successfully.
- First immediate TLS reload reproduced the Type=simple startup race. No public
  traffic reached that service; production Nginx and website were unchanged.
- Updated Python syntax, systemd unit verification and non-mutating real certificate
  source validation pass. Installed-service readiness/renewal read-back follows.
- Diff whitespace passes. No broad TS test rerun is needed for these deployment-only
  edits; the complete Linux build/test result immediately precedes them.

## Repository state after implementation commit

Main at `2c0951720a8edc67ab59d5563f661f57414a765b`, clean before this journal,
one implementation commit ahead of origin. Both commits are pushed together.

## Implementation commits

- `2c0951720a8edc67ab59d5563f661f57414a765b` — Wait for live TLS readiness before certificate reload.

## Archive commit

Record TLS startup readiness correction

## Lessons learned

Readiness is an observed application response, not a process manager state.
Exercise first startup and renewal ordering before redirecting public traffic.

## Follow-up ideas

Finish installed-service readiness, confinement and Certbot dry-run acceptance,
then the authorized shared-443 cutover and read-back. Keep Ask intake and real
publisher/employee authority disabled while HQ remains unavailable.
