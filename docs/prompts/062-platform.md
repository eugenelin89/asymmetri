# Prompt 062: Shared-apex TLS transport and trusted archive reads

- Date: 2026-10-13
- Scope: platform
- Goal: Preserve strict signed API requests on the existing website authority while preparing a reversible shared-host deployment.

## Original user request

> i will be away. you are authorized for everything you need.

This continues the authorized INV-REAL-01 investment/Ask integration and deployment.
The coordinating HQ chat requested exact-source interoperability, preserved strict
same-apex transport and actual Linux proof. Existing authority does not make a
failed HQ account healthy or turn synthetic records into genuine employee work.

## Scope

Add the disabled shared-apex TLS/router source, actual isolated Linux acceptance,
a server-owned loopback Host mapping, and affected operational documentation.
Do not activate public API authority, visitor intake, HQ execution or publication
in this source milestone. Preserve all website content, protected Motion URLs,
assets, canonical contract files, package versions and lockfiles.

## Decisions

- The installed normalizing Nginx HTTP proxy remains rejected: original duplicate
  headers, HTTP version and pipeline boundaries cannot be recovered afterward.
- A prototype using stream real-IP failed because the installed stream module
  lacks that optional feature. Use the installed SNI/PROXY dispatcher plus Node's
  documented TLS-over-Duplex API; add no proxy dependency or OS package.
- Route only on the first raw request line after TLS. Keep one chosen upstream
  per connection, byte-preserving piping, bounded deadlines and backpressure.
- Forward the trusted PROXY preamble only to ordinary Nginx. Strict API services
  receive their original HTTP bytes without forwarding metadata injection.
- Website forwarding must set trusted Host, HTTPS, port and client metadata and
  clear forged Forwarded values. Deny normalized API paths and extra requests on
  the ordinary connection so a website-first pipeline cannot bypass API routing.
- Bound TLS starts with an aggregate 64-token burst/32-per-second refill, plus
  32 pending handshakes/five-second timeout. Store no client identifiers in this
  budget. Keep separate total/API connection and request-line/time limits.
- Validate certificate SAN, current validity and matching key before swapping
  contexts. Invalid reload retains the working certificate; test a different
  valid certificate as well as malformed/wrong-host failures.
- Node fetch ignored the Host override in an actual loopback test. Use native
  Node HTTP only when the server-owned archive authority is explicitly set;
  preserve the default fetch path and Sites packaging.

## Implementation

A combined CLI starts the loopback raw router and apex TLS endpoint only from an
explicit enabled configuration. TERM/INT closes both; HUP reloads a validated
certificate context. The example remains disabled. Native archive reads retain
bounded bodies, timeouts and existing DTO/digest/visibility verification.

## Engineering impact

No dependency, canonical wire contract, public asset or content change. The new
transport is independent of Next.js. Synthetic tests create disposable keys,
certificates and private storage. Production listener, service and authority
state remained unchanged throughout this implementation milestone.

## Files changed

- Receiver TLS, raw routing and combined CLI plus disabled configuration example.
- Receiver unit and actual Nginx acceptance tests, including optional load probe.
- Website archive read transport and focused loopback authority test.
- README and architecture, development, testing, ingress, deployment, Ask and
  INV-REAL handoff documentation.

## Documentation updated

Record the failed optional-module prototype, trusted forwarding requirements,
certificate reload behavior, transport bounds, current Linux proof and exact
remaining production/renewal/rollback checks. Correct stale source-only website
status to the already completed October 13 website release.

## Git diff summary

18 files changed, 629 insertions and 38 deletions. Added bounded transport and
focused acceptance coverage; updated current operational facts without rewriting
historical prompt journals.

## Verification

- Node 24.10.0 matches `.nvmrc`; nvm absent. No dependency installation required.
- Exact nine-file canonical manifest and generated types pass unchanged.
- Root check and receiver TypeScript check pass. Root lint retains one existing
  tutorial navigation warning; no errors.
- Complete receiver suite: 230/230 local and 230/230 actual Linux Node 22.23.1.
- Website helper tests: 6/6, including real Host delivery and input restrictions.
- Actual Linux shared-apex acceptance: 68/68, including signed investment and Ask,
  protected-header/framing/pipeline rejection, ordinary backend HTTPS/Host/client
  identity, forwarding spoof rejection and other-SNI client IP continuity.
- TLS certificate rotation, wrong-host/malformed reload retention, ALPN policy,
  raw duplicate-header preservation and handshake budget exhaustion/recovery pass.
- Optional isolated workload: 480 TLS requests over 59.99 seconds at concurrency
  eight, p50 76 ms, p95 118 ms, maximum 160 ms; combined fixture Node peak RSS
  111,677,440 bytes and CPU 5,416 ms. This excludes production Next/full writes.
- Both Next and Sites production builds pass, serially after native build-slot
  release with a 15 GiB free-space floor. Both dependency audits report zero.
- Two independent read-only reviewers found no remaining source blocker after
  certificate and forwarding corrections. They did not rerun the full suites.
- Diff whitespace and targeted credential/private-attachment scans pass.
- The initial shared prototype failed the installed Nginx stream-real-IP syntax
  check. One SSH test invocation used an unsupported direct sudo target identity;
  the documented root runuser route completed it. Neither was an approval denial.

## Repository state after implementation commit

Main at `a437f6902b2bccdf26d5bc719618cb3e5ca4d833`, clean before this journal,
one implementation commit ahead of origin. Both commits will be pushed together.
No branch, worktree, PR, force push or unrelated change.

## Implementation commits

- `a437f6902b2bccdf26d5bc719618cb3e5ca4d833` — Add bounded shared-apex TLS routing and trusted archive reads.

## Archive commit

Record shared-apex transport engineering journal

## Lessons learned

Test module availability and actual HTTP authority delivery on the installed
runtime. A static website success does not prove trusted framework metadata.
Keep protocol, capacity, deployment, certificate renewal and genuine operational
activity as separately evidenced results.

## Follow-up ideas

Complete the authorized all-vhost/IPv4/IPv6 rehearsal, renewal/rollback acceptance,
private Ask installation and HQ typed interoperability before relevant production
activation. Keep genuine employee work held while the HQ account remains unavailable.
