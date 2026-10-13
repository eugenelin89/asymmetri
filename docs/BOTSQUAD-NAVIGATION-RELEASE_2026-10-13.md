# BotSquad navigation and closed contract release — October 13, 2026

The owner authorized direct commit and production deployment of the public
hierarchy and easier navigation. Labs now leads to BotSquad, whose Research area
contains Investment. Ask is alongside Research. The [hierarchy decision](BOTSQUAD_HIERARCHY_2026-10-13.md)
records the routes and browser acceptance. Existing Investment and Ask URLs remain
stable. The investment introduction now directs readers to research, discussion,
decisions and evidence, using the owner's requested neutral wording.

This release also installs the previously accepted subscription-activity contract
into the independent, still-closed Ask receiver. It does not enable visitor intake,
model execution, a new account, or investment authority. The subsequently accepted
HQ configuration-read amendment is a separate increment and is not installed here.

## Installed identity

Website source: `8e67412542391d9fa5a820ef65f593f4b8653c9f`, including hierarchy
implementation `fd69a0c` and journal 079, investment introduction `a73fdd6` and
journal 078, and accepted Ask contract `c5be193` and journal 077.

Ask source: `08d36f33f53fee53e3838f9785dd86eab2ee15d3`, PID 2394995, active
22:18:44 UTC. Canonical HQ pin `9ff8cc984954f2e822ec191de60dcd39607ea1a7`;
nine-file manifest SHA-256
`27f73af2099dc086ebf1893bb2613c5a8f18200b752d8d48960107386cb40264`.
Investment protocol definitions and signed paths are unchanged. Local Node24 and
standing-approved production Node22.23.1 remain the runtime choices. The final
Linux website check, Next.js build and audit passed; build ID
`JfXhLeJ9il1oKr7D-w7ar`. Website PID 2395975 became active at 22:24:43 UTC;
activation completed at 22:24:46 UTC.

## Verification and operational bounds

Local TypeScript/ESLint, Next.js and Vinext builds passed. Fifteen Ask UI and six
investment page tests passed. Six responsive widths, keyboard navigation and the
new breadcrumbs were checked; 11 local routes, 35 image sources and the ten-entry
sitemap passed. The existing tutorial lint warning remains; no dependencies or
public assets changed. Website and receiver production audits reported zero
vulnerabilities.

The Linux receiver candidate passed check, canonical validation and build as the
Ask application owner. Its full confined suite passed **243/243**: 236 receiver
tests, three readiness cases and four capability cases. The test service used the
Ask UID, 192 MiB memory, 96 MiB heap, 25% CPU, 32 tasks, zero swap, actual zero core
filter, masked production stores/configuration and a 600-second deadline. A
byte-identical writable copy in PrivateTmp allowed the deliberately invalid
checkout-directory test to create its own disposable fixture.

The final run took 293.6 seconds observed, with 385 samples, peak measured memory
198,856,704 bytes, zero measured swap and minimum host available memory 297,088 KiB.
All 58 public health probes passed and live service identities stayed unchanged.
These are bounded synthetic verification results, not a genuine model workload or
production concurrency guarantee. Full-suite log SHA-256:
`92c6fce8e0baac54da8106874268ab1937db7c709ea996e03b68f8730acd49ed`.

Earlier staging failures remain in the evidence: Python 3.10 archive API mismatch,
the archive root-member guard, missing candidate-only build dependencies, an
isolated-unit working-directory error, and a read-only fixture checkout that
prevented one recovery test's setup. That second executed fixture passed 242/243;
the corrected final run passed all 243 without changing receiver product code or
weakening production confinement. No failed attempt was treated as acceptance. The first temporary website probe
also stopped before startup because its setting-name allowlist omitted the
existing `ASYMMETRI_` prefix; the corrected probe uses those same existing settings.

The temporary loopback candidate passed nine routes using the exact existing
investment read settings, including Atlas/Maya, the neutral introduction, closed
Ask and four protected Motion routes. The first website activation refused before
stopping production: candidate testing had created 64 new Next.js route-cache
entries after the prepared manifest. Read-only comparison showed no live-tree
change and no source, build or dependency change. The original spec and drift
receipt were retained; only verified new cache entries were added to the candidate
manifest. The unchanged complete guard then passed and activated the website.

## Preservation and rollback

Ask availability remains `disabled` (200), session creation returns 503
`UNAVAILABLE`, and neither sets a cookie. Generation zero, the entire metadata
hash, empty authority/content tables and configuration hash
`ae4a0bb70ac41a58f28c0d5d9bc5c44fae6869ad5afdc43b4ba3081f75913e5c`
are unchanged. Volatile HTTP quota counters are excluded from equality checks.
The approved privacy registry remains empty. Admission, claims and delivery stay
false; the worker roster is empty. Actual core filter `00000000`, zero core limits
and zero cgroup swap were checked after startup.

Investment receiver PID 2385469, finite publisher/key scope, official selection
and all existing immutable records are preserved. Normal independent publisher
appends are allowed; the release never restores an older investment database.
The exact experiment/run remain
`16496aa38732845beeea0a75f4614b93136be792accbb4e0` /
`0f6ea49caee91243f2f028a8ddde55abaa68faaaa2de453c`.
The website's investment read configuration is unchanged. Ingress, Nginx, gunicorn,
TLS configuration and unrelated hosted applications are unchanged.

The guarded swaps retain complete old code, dependencies and website build:
`/opt/asymmetri-ask-rollback-20261013-4daa713` and
`/var/www/asymmetri-rollback-20261013-d0c4543`. The root-held
`asymmetri-contract-activate.py ask rollback` or `website rollback` first checks
exact release identity, stops the target, verifies its complete prior manifest,
restores code only and verifies preservation before starting. Never roll private
data or configuration back with application code. A failed rollback guard leaves
the candidate stopped for inspection. Earlier recovery material is retained.

## Evidence and remaining service work

Root-only evidence is retained at
`/var/lib/asymmetri-ask-contract-release-20261013`, directories 0700 and files 0600.
It includes executed scripts, independent review hashes, all fixture attempts,
resource samples, public health probes, build logs, runtime manifests, exact
before/after data/configuration/service receipts and activation/rollback guards.
No credentials, cookies, private keys or genuine questions are recorded here.

The [readiness](ASK-04-READINESS.md) and [operational safeguards](ASK-04-OPERATIONS_2026-10-13.md)
records still govern genuine HQ execution, custody/restore, truthful service
privacy facts, finite scope, control barriers and combined workload acceptance.
The new hierarchy and contract release do not close those independent gates.

Final public acceptance preserved 112 baseline observations: 104 verified HTTP
responses, four unchanged pre-existing IPv6 certificate failures and four fallback
certificate fingerprints. Forty-eight original tutorial image responses, tutorial
canonical/fragment links and protected Motion main content on apex and www were
unchanged. Six additional public hierarchy probes passed on the two hosts. Browser
navigation Research → Investment → Ask → Research passed, with the correct ancestor
trail, neutral introduction, Atlas/Maya roster, no Ask composer, no overflow and no
console error. Temporary browser dimensions were reset; the local preview and all
isolated test/candidate units were stopped.

The final 50-file private evidence manifest SHA-256 is
`a3533b25f55b491fd8b48645c1eb843b3d49c8330249cdd06c15661cb2d3513e`.
These receipts describe the deployed code above; subsequent documentation commits
do not require rebuilding that unchanged runtime.
