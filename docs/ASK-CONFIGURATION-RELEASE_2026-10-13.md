# Closed Ask configuration endpoint release — October 13, 2026

The [reviewed source packet](ASK-CONFIGURATION-READ_2026-10-13.md) is installed in
the independent Ask receiver. Public intake remains disabled, with no service keys,
approved disclosure, visitor data or model execution. This owner-authorized release
changes only receiver code; it does not establish public-service account eligibility.

## Installed identity and checks

Ask source `2b630150e17c629729ac87026f0df0ab1d30e959` includes implementation
`a9b1ec5548a1672a5a87537e218dc1926eb55db1` and journal 083. PID 2399905 started
at 23:01:56 UTC; guarded activation completed at 23:02:05 UTC. Canonical HQ pin is
`00d9e82668dcfd39b25294d9a05a7f97e4d28295`, nine-file manifest
`5396443e475d3fe69825ef8af4e916a408b39452182e9c4828fa17b7faf37a84`.
The existing Node22.23.1 production runtime is standing-approved.

The candidate was checked, canonically validated, built and audited as the Ask
application owner; production audit reported zero vulnerabilities. Existing locked
dependencies were copied unchanged. Its 91 committed source files were independently
compared byte-for-byte against the Git archive with no unexpected source files;
archive SHA-256 is
`8ad8dedd29eb1d8273d9b29d9e1458b271622e73fb5f60c89ecf8a29cfac4085`.
The prepare helper writes a source label rather than authenticating that label
itself, so this independent comparison is required provenance evidence.

All **254/254** Linux cases passed: 247 receiver, three confined readiness and four
capability cases. The fixture used the Ask UID, 192 MiB memory, 96 MiB Node heap,
25% CPU, 32 tasks, zero swap/core memory, masked live stores/configuration and a
600-second deadline. Its writable PrivateTmp copy was byte-compared before running.
Observed duration was 299.8 seconds, with 393 resource samples, peak measured memory
201,220,096 bytes, zero measured swap and minimum available host memory 310,036 KiB.
All 59 public health checks passed; live service identities stayed unchanged during
validation. The fixture and temporary unit were removed after successful completion.
These are synthetic bounded results, not genuine employee or combined model capacity.
Test log SHA-256:
`0a4e93e4f2a4afc3866a7fd88a081dde8c5237b254932e69241e4a25cc1b65f3`.

Independent review found no material scope/rollback defect in the reused guard,
now restricted to Ask. It requires fixture `Result=success`, exit zero, all 254
cases and preserved services. The fixture monitor's inherited exceptional path
does not itself remove its unit; an operator must stop/remove that task-owned unit
if monitoring throws, while RuntimeMaxSec provides the outer deadline. This run
completed normally and removed it. Reviewed guard SHA-256:
`5950f48dcebfad793bd7afa17fc4c85c733c24e806a5afc481471a346e5110b1`.

## Actual public behavior and preservation

Anonymous configuration GET on the canonical apex returns 401 `UNAUTHENTICATED`,
private/no-store, without a cookie. The established www API boundary remains 404;
the website itself remains available on both hosts. The first acceptance script
incorrectly expected a JSON API response on www and failed parsing its HTML 404.
The original script and failure explanation are retained. Correcting the test
to match the documented apex-only API passed without changing production routing.

Availability remains 200 `disabled`; session creation returns 503 `UNAVAILABLE`
without a cookie. Ask pages contain no composer. Portraits remain present on both
public Investment pages. All 112 baseline observations are preserved, including
104 verified HTTP responses, four unchanged pre-existing IPv6 TLS failures and
four fallback certificate fingerprints. The 48 original tutorial images, exact
www tutorial canonical, fragment links and protected Motion content are unchanged.

Website source remains `da09185945788a7949a1b66e722c25e49c103fdd`, build
`FdEnXJuqbkzmiTgfwl60i`, PID 2397461. Investment PID 2385469, finite publisher/key
scope, official experiment/run and prior immutable records are unchanged; normal
independent publisher appends remain allowed. Ingress, Nginx, gunicorn and unrelated
sites did not restart. Ask generation zero, metadata hash, empty authority/content
tables and configuration hash
`ae4a0bb70ac41a58f28c0d5d9bc5c44fae6869ad5afdc43b4ba3081f75913e5c`
remain unchanged. Volatile HTTP quota counters are excluded from equality checks.
Actual process core filter is `00000000`, core limits are zero and cgroup swap is
zero. No genuine authenticated production read is claimed: no Ask key is installed.

## Rollback, custody and remaining integration

The complete prior receiver is retained at
`/opt/asymmetri-ask-rollback-20261013-08d36f3`. The root-held
`asymmetri-contract-activate.py ask rollback` stops the target, verifies exact old
source and full runtime manifest, restores code only, and checks preservation before
starting. A failed rollback guard keeps the target stopped. Never restore older
private data or configuration along with old code. No database migration was added.

To satisfy the existing 8 GiB validation disk floor, two inactive older website
rollback trees were converted to complete verified archives. The current website,
latest rollback trees, receiver data and unrelated sites were untouched. The
[retention receipt](WEBSITE-ROLLBACK-ARCHIVES_2026-10-13.md) records hashes, full
comparison, freed space and restoration instructions. This is local runtime
retention, not off-host private-data custody.

Root-only evidence is at `/var/lib/asymmetri-ask-configuration-release-20261013`,
directories 0700 and files 0600. Its 25-file manifest SHA-256 is
`1820cd19108a8393997e47efd8bd984fad094a741f34a23cf14e2321d4b3e19f`.
It retains source/provenance, build, isolated resource/test/health, full runtime,
activation, public-access, preservation and archive-custody receipts. No credentials,
private keys, cookies or genuine visitor text are included in repository records.

HQ's true client/runtime interoperability, public-service eligibility, finite
authority, approved provider/privacy facts and genuine execution/custody/capacity
remain separate gates. HQ received the exact source/archive for disposable tests;
that handoff does not open production intake. Documentation-only follow-ups do not
rebuild or restart this installed receiver.
