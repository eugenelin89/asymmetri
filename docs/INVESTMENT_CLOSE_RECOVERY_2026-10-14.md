# October 14 prospective close amendment

The owner requested a fresh investment decision using retained research and
explicitly clarified “I want paper trade.” Ask remains paused and disabled.
The website packet consumes the HQ-owned optional v1 amendment; it neither
dispatches employees nor grants financial, market-data or Ask authority.

## Contract and accounting

The one-session `inv-real-close-recovery-v1` extension binds the original run's
configuration hash, approval reference and immutable amendment identity. Its
schema fixes October 14, 2026: decision/review/order lock before 19:30 UTC, CLOSE
at 20:00, evidence collection no earlier than 20:05, accounting no earlier than
20:20, and expiry at 23:30. The missed morning OPEN remains missed.

Only a decision and order bound to the prior amendment can use `regular_close`.
The first order record establishes immutable `lockedAt`; reviews and locks must
precede the cutoff. Legacy orders retain their OPEN rule. Existing signature,
scope, configuration, journal hash, decimal accounting, order revision and
idempotency checks remain in place. No migration or portfolio reset is required.

The benchmark preserves a cash phase followed by a qualified close allocation.
Its exact observation, units, cash and accounting time remain in subsequent
snapshot proofs. Initial allocation arithmetic and reported holdings agree;
later base benchmark rules remain the producer's responsibility. The receiver
does not fetch an exchange calendar or independently establish source accuracy.
HQ verifies its retained exchange calendar before emitting the fixed amendment.

Each amended decision, order and snapshot includes an exact `supports` reference
to the amendment event. Existing dependency links propagate withdrawals to
financial and evidence views. `PublicStatus.executionAmendment` projects that
immutable event independently of event pagination and later statuses. Withholding
the amendment makes status unavailable rather than implying a return to the
original methodology.

## Public reading

The showcase and evidence/methodology pages display the amendment, its clocks,
skipped opening, benchmark convention and retained usage-accounting gap. The
original frozen settings remain labelled and inspectable. Journal references
continue to show the actual observation field and separate market, retrieval and
accounting clocks. Decision rationale, risks, independent review and dissent
remain linked. Complete and incomplete valuation qualifications remain visible,
with expandable benchmark allocation evidence. Configured archive pages require
a current status witness before rendering record or methodology content; an
unavailable or withheld amendment cannot briefly expose an unverified method.

The notice states that adopting a method does not establish a completed fill or
complete valuation. No employee activity, usage, cost or financial result is
invented. Employee portraits and exact-run navigation remain intact.

## Verification and release boundary

The authored receiver fixture covers a valid close chain and unchanged legacy
OPEN, negative timing/identity/evidence/allocation cases, preservation of the
existing prefix, restart, more than 100 events, later status updates and withdrawal
propagation. These fixtures establish software behavior, not real employee or
market execution. Production must consume the final matching canonical manifest
only after both repositories' checks pass. Deployment evidence and the exact
source pin are recorded after verification; implementation alone does not imply
activation or a published trade.

### Recorded validation attempts

Validation uses the separately reserved Linux build stage with the approved
Node 22.23.1 production runtime. The Mac's free disk headroom does not admit a
new heavy build; no compiler runs on the constrained website host. Each Linux
run keeps at least 384 MiB available RAM and 6 GiB free disk, and checks that HQ
and Nginx process identities do not change. Dependencies are reused from the
previous verified stage; no new installation or package change is required.

The first focused pass verified the exact nine-file contract and generated
TypeScript, receiver check/build, all 27 close-recovery tests and website check.
The broader native run passed 276 of 277 cases. The unchanged large-download
timeout case failed its initial assertion that a paused client had established
an active stalled response; it did not reach its deadline assertion. The failed
run is retained. Subsequent socket acceptance must establish the intended stall
without relaxing the assertion or modifying production download behavior.
Capability regression checks passed 4/4, website helpers 21/21, and Vinext built.

The default Next/Turbopack attempt compiled but was terminated by the resource
guard during TypeScript when available RAM fell to 387,088 KiB, below the
393,216 KiB threshold. This is a stopped build, not a pass. The final attempt
uses the supported `--webpack` build option and a 384 MiB Node heap under the
same guard, without disabling type checking or changing repository settings.
The final visibility safeguard requires both website targets to be rebuilt.

Pre-release production checks retained 112 route observations: 104 verified
HTTP reads, four pre-existing IPv6 TLS failures with unchanged fingerprints,
and four fallback certificate fingerprints. Both hosts' 48 tutorial original
image reads, canonical links and fragment links are retained. Ask remains
closed with empty private tables and unchanged configuration/process identity;
existing investment records, financial journal and publisher scope are captured
privately for exact preservation checks. These are baseline observations, not
post-release acceptance.

### Final consumer build and browser checks

The final receiver build and 27 close tests passed again. Website TypeScript and
ESLint passed with only the existing tutorial navigation warning. Both Vinext and
`npm run build:next -- --webpack` passed; Next build ID is
`8OlCVsyW02asPY8CIxRly`. Both production dependency audits report zero findings.
The guarded final packet's minimum available RAM was 973,836 KiB and minimum
free disk was 24,430,845,952 bytes; HQ and Nginx identities were unchanged.

The unchanged stalled-download case passed separately (1/1, no skips) after
establishing its intended stalled socket in a disposable network namespace with
TCP receive/send bounds `4096 16384 65536`. Its original 500 ms admission and
15.5-second deadline assertions were not changed. Host TCP settings were
verified identical before and after; no live networking or receiver behavior
changed. This resolves the case in the intended environment; it does not erase
the earlier failed full-suite attempt or claim that that attempt passed 277/277.
The isolated test retained at least 1,450,620 KiB available RAM and unchanged
services. All heavy jobs were confirmed stopped before returning the shared slot.

A loopback-only authored preview used the actual amendment, original settings
and portfolio components with the final production CSS. Browser checks at 390,
768 and 1440 px showed matching document widths, readable UTC clocks and no
page-level horizontal overflow. Keyboard navigation showed a 3 px visible teal
focus outline; Enter expanded original settings and benchmark allocation proof.
The amendment link retained its exact event version and run query. Market,
availability, retrieval and accounting clocks remained separate. Console errors
and warnings were absent. Existing reduced-motion CSS was present and no element
was animated; the browser's motion preference was not emulated. No new image or
external-link behavior is introduced by this packet.

| Verified build artifact | SHA-256 |
| --- | --- |
| Next production output | `a9c2ff856b925568353d1a33b073d8b2d858d3f6b9cb075c5050192906eb67ee` |
| Receiver compiled output | `ff9a82c9f0c75b9c32f69f501fdeccea95fcdfb296997d5098bab4183b56112f` |
| Build and test evidence | `637b1d5a9412ca57737d3464e33d702f5011e9b6605dfc151d93be2717be8de9` |

The original stopped/failed logs are included in the evidence package. These
artifacts do not authorize activation before the final canonical source pin and
producer-projected interoperability checks are available and accepted.

### Producer interoperability

Both actual authored producer projections passed the consumer's strict publication
validator using the SHA-verified final compiled modules and exact vendor package.
The lightweight local run used Node 24.10.0, matching `.nvmrc`'s major version,
with a 128 MiB heap. No dependency installation or native compilation occurred.

| Authored projection | Events | SHA-256 |
| --- | --- | --- |
| Filled | 19 | `e4fc4f9d4a983207bfbc58cc9b6bf04767e5649be17c70e028dd4b8b45ed3a61` |
| Rejected | 18 | `459b4cb753868b6fd52298f9651089013767c2ef4ceb7c21415ff908300ebf93` |

Each exact vector passed as a complete batch and as individual incremental
batches, retaining every event hash. Duplicate complete-batch receipts replayed
without new acceptance. The filled projection retained exactly one fill and a
filled order; the rejected projection retained no fill and a rejected order.
These projections were authored by tests with no actual employee-model or market
calls. Producer end-to-end and consumer interoperability results establish
software behavior, not a live decision or trade. Native signed HTTP acceptance
for the authored receiver fixture is covered by the 27-case packet above;
these producer vectors have separately passed the pure consumer validator.

The same exact producer vectors subsequently passed native signed HTTP/SQLite
acceptance on Node 22.23.1: 2/2, zero failures, cancellations or skips. Each batch
returned 201; an idempotent signed retry returned 200 with the identical receipt.
Every stored event hash matched the vector. Status exposed the exact immutable
amendment before and after restart. Withholding the amendment made status return
503 and the dependent decision return withheld, while every stored event remained
unchanged. The resource guard retained at least 1,511,756 KiB available RAM and
23,581,974,528 bytes free disk, with unchanged HQ/Nginx identities. The shared
slot was released after verified process quiescence. No production archive,
authority or service was used by these tests.

HQ separately reported both full nine-instrument flows passing (2/2), its final
32-file regression passing 640 cases with five conditional skips, and those exact
five cases then passing against this receiver under Node 22.23.1. The original
conditional skips remain recorded; they are not rewritten into the initial run.

### Final canonical source

The consumer's nine files are byte-identical to merged HQ commit
`fbd26f520e7403a469643ed350df5e08bbc1ec2b` (PR 95; reviewed implementation
`6b0a3f06a48dae9ade69e3d45814c3d4fa0c2a4c`). Manifest SHA-256 remains
`ff9c457580475583614541b76d9f0267ac2a15afff0f87f955acdff5f063e081`.
The final metadata pin was applied after the build; `receiver/vendor/source.json`
is read only by the offline provenance checker and is not compiled into either
runtime. All other 246 source/runtime manifest entries still match the final
verified build inputs. The source manifest records the final pin separately from
the retained original build-input manifest. Independent type generation is
rechecked with this final metadata before committing.

Producer activation waits for the receiver and website release to finish. HQ
keeps its loop held and does not publish amended records during the compatibility
transition. The website release changes no publisher scope, key generation,
approval, original event or financial posting, and does not open Ask.
