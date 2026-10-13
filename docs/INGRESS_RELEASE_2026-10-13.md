# Shared HTTPS and private receiver release — October 13, 2026

The authorized shared-apex cutover completed at **17:19:42 UTC**. Strict HTTPS
transport is live. Investment publishing and public Ask remain inactive: there
are no publisher grants, approved/official runs, Ask service keys or visitor data.
HQ's account-401 hold remains in force. This is infrastructure acceptance, not
evidence of genuine employee execution, market collection or a completed trial.

The later [website-only Ask page release](ASK-03-RELEASE_2026-10-13.md) changes
the website source/build while preserving this ingress and private receiver state.
The identities below describe the original 17:19 cutover.

## Installed identities

| Component | Recorded source | Runtime at final verification |
| --- | --- | --- |
| Website | `97b4087b79c5f0f1472fd71dde86765489273400` | PID 2369353; started 15:04:43 UTC; build `kcKfT0zA-jDnr0xVy1Suy` |
| Investment receiver | `c2edfd50ed12ba576c06e6991091090b9ced3e31` | PID 2376449; started 17:18:09 UTC; static unit, explicitly started |
| Private Ask runtime | `fcc95225213f21edfa939ec24977ad31264efd29` | PID 2374802; started 17:05:04 UTC; static unit, explicitly started |
| TLS/raw-router runtime | `fcc95225213f21edfa939ec24977ad31264efd29` | PID 2375255; started 17:08:43 UTC; boot enabled |
| Installed TLS unit and renewal hook | `8a539d1dc48caeab35364e187830e2a9bca853d8` | Includes startup-readiness fix `2c0951720a8edc67ab59d5563f661f57414a765b` |

Runtime sources are recorded beside `/opt/asymmetri-receiver`,
`/opt/asymmetri-ask` and `/opt/asymmetri-ingress`; the final deployment source is
also `/etc/asymmetri-ingress/DEPLOYMENT_SOURCE_COMMIT`. PIDs are observations,
not stable service identifiers. Nginx master PID 826 remained unchanged through
graceful reload. The website source, service start and build did not change.

The canonical nine-file manifest remains
`7ec71b39d7a25c7067ade8b26d37f1a58552b2dbfd14e9b6d7aa827ccc867e31`.
The running website has no archive read configuration. The later native loopback
Host helper is validated source, not part of that running website build; a future
read activation must deploy compatible website source and exact run settings.

## Installed boundary

Nginx stream owns IPv4/IPv6 public 443. Apex SNI reaches the loopback TLS bridge
on 3103, then the raw first-line router on 3100. Exact investment/Ask API prefixes
reach 3101/3102 without HTTP reconstruction or a PROXY preamble. Ordinary apex
web requests reach trusted Nginx on 3080. Other SNI retains ordinary Nginx TLS on
8443/8444 with its original separate IPv4/IPv6 virtual-host and default selection.
Port 80 and existing certificate challenges remain available.

Dedicated identities are `asymmetri-ingress` (UID/GID 996) and `asymmetri-ask`
(995). Runtime/config/certificate trees are root-owned and read-only to services;
Ask alone writes its private 0700 store. The empty archive-reference bind permits
path-separation checks without exposing the public SQLite/content tree. Both
services have no capabilities, NoNewPrivileges and loopback-only network access.
Same-unit probes verified eleven unrelated paths inaccessible, runtime/config
writes denied, intended Ask write/fsync/rename and TLS certificate reads allowed,
and public-host egress blocked while loopback worked. Probe units were removed.

Ask has `enabled:true` solely to serve its listener; `admissionEnabled`,
`claimsEnabled` and `deliveryEnabled` are false. Roster/keys are empty, generation
is zero and effective authority is false. Synthetic-only example limits are not
real-use approval. Investment contains zero events, batches, nonces, content
objects and publishers. Ask contains zero sessions, questions, answers, keys,
nonces and claims. SQLite integrity and foreign-key checks pass. No run approval
or official selection was performed.

## Verification receipts

- Local Node 24.10.0 and actual Linux Node 22.23.1 passed 230/230 receiver tests.
  Shared Linux ingress passed 68/68 checks with the separately scoped 480-request
  workload recorded in [the ingress runbook](INV-03-INGRESS.md).
- Isolated all-host rehearsal passed 64 checks in each baseline/shared/rollback
  phase. Actual cutover passed **112** before/after comparisons: 15 host baselines,
  IPv4/IPv6/default selection, 28 Asymmetri route checks, exact www tutorial
  canonical, 54 tutorial hash links and 48 original-image URL/content checks.
  Existing draft 502 and two relay 410 responses remained unchanged.
- Public verified-TLS read-back: Ask availability 200/disabled/private-no-store;
  session creation 503 with no cookie; duplicate original Connection 401;
  unconfigured investment run 404; encoded API aliases 404. Browser read-back
  shows unconfigured archive and disabled Ask, with protected footer links intact.
- Immediate installed-service startup/reload passed after the readiness fix.
  Certbot staging renewal with deploy hooks passed both before and after cutover;
  persistent Nginx configuration hashes were unchanged by each dry run. The hook
  validates and atomically installs the active lineage, then verifies live TLS
  with normal CA/hostname checks. Private key contents never enter source/output.

## Recovery and remaining work

Root-only `/var/lib/asymmetri-ingress-rollback-20261013` retains original and
candidate Nginx definitions, fingerprints, 112-check baseline/activated receipts,
the post-cutover receipt, original receiver config and an offline empty archive
copy. `/var/tmp/asymmetri-cutover.py rollback` restores those exact original
listener files, removes the two added includes, checks Nginx syntax, reloads and
compares the original 112 checks. Inspect current state before using this specific
rollback; it is not a general deployment command. It restores ingress configuration,
not unrelated future changes or receiver authority.

The website rollback stays `/var/www/asymmetri-rollback-20261013-745a92c`;
receiver rollback stays `/opt/asymmetri-receiver/rollback-20261013-inv-real`.
Pre/post Certbot logs are root-only `/var/tmp/asymmetri-certbot-precutover.log`
and `/var/tmp/asymmetri-certbot-postcutover.log`. Temporary rehearsal certificate
copies were deleted. Documentation commits do not change installed identities.

Remaining real-use work includes healthy HQ authentication and genuine provenance,
exact publication/key reconciliation, operational retention and independent backup
custody, Ask producer interoperability, budgets/eligible roster and visitor
UI/privacy copy. [The disposable interoperability fixture](ASK-01-INTEROPERABILITY.md)
tests authored transport only. HQ control acknowledgement does not establish
physical body purge or restoration; retain those separate unverified states.
Ubuntu 22.10 remains the existing accepted exception; OS migration is separate.


The subsequent [closed Ask production-path release](ASK-04-RELEASE_2026-10-13.md)
installs website d0c4543 and verifies all 112 preservation checks again. The Ask,
ingress, investment and Nginx identities above are unchanged. Receiver source fixes
in that packet are explicitly separate from the installed private-service source.
