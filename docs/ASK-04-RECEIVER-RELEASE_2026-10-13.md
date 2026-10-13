# Closed Ask receiver rollout — October 13, 2026

The separate Ask runtime now includes authenticated session-response recovery and
truthful busy-queue availability. Public intake remains closed. No operational
session, conversation, question, answer, claim, key, roster member or authority
was created. HQ remains account-401 held. The website was not redeployed.

## Installed identity and boundary

| Item | Verified value |
| --- | --- |
| Installed Ask source | `4daa713cd848f3798b87169ed3694bf2be0332f7` |
| Runtime implementation | `73276d4bb6d893b52173b27f1942f4e0313a1d30` |
| Previous Ask source | `fcc95225213f21edfa939ec24977ad31264efd29` |
| Service | `asymmetri-ask`, PID 2384365, active since 19:38:30 UTC |
| Runtime | Node 22.23.1; existing production approval |
| Live code | `/opt/asymmetri-ask/receiver`, root-owned and read-only |
| Service identity | UID/GID 995; no capabilities; NoNewPrivileges |
| Root configuration | `/etc/asymmetri-ask/config.json`, root:995, 0640 |
| Configuration SHA-256 | `ae4a0bb70ac41a58f28c0d5d9bc5c44fae6869ad5afdc43b4ba3081f75913e5c` |

Both tracked-source and compiled-runtime comparisons were performed. Only
`dist/src/ask/http.js` and `dist/src/ask/visitors.js` differ from the old compiled
runtime. Dependencies, Ask migration, configuration parser, authority, recovery
generation and service unit are unchanged. Other ingress deployment files present
in the source package were not installed into the ingress service or renewal hook.

The listener remains enabled solely for availability. Admission, claims and
delivery remain false; the roster is empty, archive origin unset, and limits
remain explicitly synthetic-only. The production disclosure registry is empty.
No fixture configuration was promoted. Consumer generation remains `0`, with
unchanged epoch, expiry, held flag and revision. No restore or reconciliation
command ran against the operational store.

All visitor/content/authority tables remained empty. HTTP protection counters
are separate short-lived metadata: health requests create and increment them,
and normal cleanup expires them. Three quota rows existed at activation. They
were validated and preserved, never deleted to manufacture a zero-count result.
SQLite integrity and foreign-key checks passed.

## Linux acceptance and bounded resource observation

The exact committed archive was extracted into a separate candidate owned by the
Ask identity. Locked dependencies were installed without lifecycle scripts; the
bundled Linux x64 SQLite binary matched the installed binary exactly. Strict
TypeScript check, build, nine-file canonical verification and all **236 receiver
tests** passed on actual Linux/Node 22.23.1. Production dependency audit found zero
vulnerabilities. No website dependency or build changed.

Tests ran serially with disposable authored data, private temporary storage and
production trees masked. Ephemeral fixture authority remained inside those tests.
The test service used a 96-MiB JavaScript heap, 192-MiB memory ceiling, 32-MiB swap
ceiling, 25% CPU quota and ten-minute maximum runtime. Its temporary service ended
successfully; no operational signing material or authored data was installed.

| Observation | Result |
| --- | --- |
| Wall observation / samples | 259.08 seconds / 234 |
| Candidate peak sampled memory | 114.28 MiB |
| Minimum available host RAM / swap | 343.97 MiB / 1,852.61 MiB |
| Minimum free disk | 9.63 GiB |
| Concurrent verified public checks | 94/94 HTTP 200 |
| Sampled public latency, median / p95 / maximum | 89.11 / 120.31 / 161.04 ms |
| Observed OOM kills | Zero |

The existing website, disabled receivers, ingress and Nginx stayed running during
this observation. Website sampled memory peaked at 70.63 MiB. These are finite
test observations on the shared host, not an operational visitor-count guarantee.
No real HQ/model workload ran, and combined genuine-workload capacity remains
unverified. Motion's Mac native work and retained evidence were untouched; this
packet used no Mac heavy-build slot.

## Failed attempt, recovery and corrected activation

The first attempt at 19:32 UTC used an overly short six-second readiness check.
It stopped the candidate before readiness and restored verified old code. A second
overly strict check compared every table count, including HTTP rate counters,
with the earlier zero baseline and left the restored listener stopped. No
configuration, authority or visitor data changed. The prior listener was safely
restarted after checking those invariants and preserving the counters; its actual
startup took 7.31 seconds and disabled availability was restored at 19:33:32 UTC.

The corrected guard uses a monotonic 30-second startup budget, validates bounded
HTTP protection metadata separately, and retains strict equality for all other
private tables and generation metadata. Rollback restores verified old code even
when a preservation check fails; an unsafe private boundary leaves it stopped
without overwriting data or configuration. Independent read-only review accepted
the corrected activation and final verifier.

The second activation succeeded with the same tested candidate, also taking
7.31 seconds to reach readiness. Final verification binds the successful receipt
to the exact nonzero live PID/start identity, checks active state, then performs
verified apex TLS API requests and checks identity again. Availability returned
200/`disabled`; advertised-version session creation returned 503/`UNAVAILABLE`;
both were private/no-store and issued no cookie. An unowned loopback conversation
read returned 404. Final installed-process inspection verified read-only runtime,
root-held configuration, private writable store and empty archive-reference mount.
The unchanged limits are 192 MiB memory, 32 MiB swap, 25% CPU and 32 tasks.

## Preservation and existing TLS exceptions

All 112 before/after observations were preserved across fifteen virtual hosts:
**104 verified HTTP observations, four default-certificate fingerprints, and four
explicitly failing IPv6 TLS observations**. Sixteen Nginx configuration hashes
matched. Protected Motion routes on apex/www, exact www tutorial canonical,
fragment links and 48 original-image responses retained their prior behavior.
Existing draft 502 and relay 410 responses were preserved.

IPv6 SNI for `buildclub.org`, `www.buildclub.org`, `relay.buildclub.org` and
`relay.christopherlin.ca` already selected a certificate without those names.
Original curl 60/HTTP 000 failures, exact certificate/error fingerprints and
separately labelled unverified HTTP read-throughs were preserved. These are not
healthy HTTPS results. This clarifies earlier shorthand describing 112 successful
preservation comparisons; it must not be interpreted as 112 healthy TLS endpoints.
No unrelated virtual-host or certificate repair was attempted.

Website source remains `d0c454314d646b74895f4d9e3e4a014c63c666a6`, build
`P7LP4PKXMUyZ96RJnAgcz`, PID 2379577. Ingress remains source `fcc9522`, PID 2375255;
investment remains source `c2edfd50ed12ba576c06e6991091090b9ced3e31`, PID 2376449;
Nginx master remains PID 826. Their start identities also matched. Investment
events, batches, nonces, content objects and publishers remained zero.

## Independent rollback and evidence

Root-only `/var/lib/asymmetri-ask-receiver-release-20261013` retains exact before/
after identity, configuration, route, private-count, process, resource and API
receipts, source/runtime manifests, test/build evidence, scripts and the first
failed-attempt record. Its 22-file evidence manifest SHA-256 is
`71bd71968f9f332a3e60e0c98b2dd5865f616515e03e40436e28bd942ab41712`.
The full test-log SHA-256 is
`07e89e98ba5bc8700d60487379ba9c1ab5e860605697a00486627d9c75feb4b7`.
Independent Ask code/dependencies remain at
`/opt/asymmetri-ask-rollback-20261013-fcc9522`; the exact displaced live tree is
`/opt/asymmetri-ask-displaced-20261013-fcc9522`. The first failed candidate remains
`/opt/asymmetri-ask-failed-20261013-4daa713` for diagnosis.

After inspecting current identities, the guarded command is:

```bash
sudo -n python3 /var/lib/asymmetri-ask-receiver-release-20261013/asymmetri-ask-receiver-activate.py rollback
```

It restores only Ask code, retaining current private data, configuration and
protection counters. It preserves a displaced new runtime separately and fails
closed on unexpected private-state drift. It is specific to this closed release,
not a general future data-recovery command.

The receipt directory also holds independent ingress code/config/unit snapshots.
Existing ingress rollback material remains intact. Complete website rollback stays
at `/var/www/asymmetri-rollback-20261013-d51288f`; its source/build and the separate
website rollback command are unchanged. The empty pre-release database snapshot is
protected recovery evidence, not permission to restore stale operational state or
a claim of encrypted off-host custody.

Real-use disclosure, finite employee authority, fresh control barriers, actual HQ
integration/custody and combined workload capacity remain separate gates in
[ASK-04 readiness](ASK-04-READINESS.md). The new receiver source does not satisfy
those gates by itself.
