# My Music sharing, autoplay and OpenMP3 — November 16, 2026 UTC

Activated at **2026-11-16T04:50:52Z** (20:50 November 15 Vancouver), source
**`a2080a4d99cae617fe3dab3cdea5d5c67bdf19d1`**, build **`sJUaqd9JvJTL_VHz-vUbr`**,
Node **22.23.1**. Both apex and www passed public checks.

## Delivered behavior

`/mymusic?folder=` accepts the URL-encoded complete Google Drive folder URL,
including its resource key. Opening it fills the form, loads the queue and attempts
to start its first track. Browser autoplay policy can require a gesture; native
audio controls remain visible with a Play prompt. Manual folder loads update the
address only after success, preserving unrelated parameters and the fragment.
Copy that address to share the folder. Failed/cancelled loads do not replace the
previous address; manual form loads still wait for Play. Public help and privacy
copy explain sharing and URL visibility in history/server logs.

The coordinated release also publishes the already prepared OpenMP3 overview,
support and privacy pages at `/mymusic/openmp3`, its `/support` and `/privacy`
children, plus the approved icon. My Music remains their sole entry from an
existing page. Global menus and sitemap remain unchanged; these resources are
noindex. This website release does not establish Apple approval or availability.

## Authorization and coordination

The owner requested minimal basic checks and immediate deployment, then added
shareable address updates and autoplay. The owner explicitly approved coordinating
with the concurrent OpenMP3 App Store chat. That chat handed website activation to
this task and continued native submission. Its original candidate checkout stopped
when main advanced; the final release used a new exact-source isolated checkout.
No deployment guard was weakened, no stale candidate was activated, and no private
music URL or filename was committed. The owner-authorized retained-host/Node 22
exception and existing infrastructure remain unchanged.

Implementation commits: `d2666a0` (sharing), `60061ec` (autoplay); preparation
journals: `92f4348` and `a2080a4`. Prior OpenMP3 implementation is `ce4a9ae`, journal
`e043208`. The canonical main checkout was used, with no branch, worktree or PR.

## Validation and artifact

Node 24.10.0 matches local `.nvmrc`; nvm was unavailable. TypeScript/ESLint, eight
existing music regressions, Next webpack builds, the initial sharing Vinext build,
production audit (zero vulnerabilities) and whitespace checks passed. One existing
tutorial lint warning remains. The small autoplay follow-up passed Next build and
checks; Vinext was not repeated after that follow-up.

Basic local browser checks used disposable synthetic folder/audio fixtures:
manual loading and address update, resource-key round trip, unrelated parameters
and fragment, automatic reload, invalid links, failure preserving the old address,
selected first track, blocked-autoplay prompt and working native Play fallback.
The browser blocked audible autoplay; it was not bypassed. No additional broad
local test suite was added. The unchanged Linux workflow ran its normal gates.

[Final exact-source Linux run](https://github.com/eugenelin89/asymmetri/actions/runs/43805832622)
passed. Runtime archive **256,923,194 bytes**, SHA-256
`fcaacb3659f3ab36c31214faa9bf6cc6768b3a477a4fe09e0f3cd51a4c16cce9`.
The superseded build also passed but was not deployed. After Mac downloads of the
older candidate timed out, the final artifact was transferred directly to isolated
server staging using an in-memory signed URL. The CI checksum, source SHA, Node
version and build ID matched before extraction. The temporary outer ZIP was removed
after verification; no credentials were stored in source or release records.

Candidate and public checks preserved 803 prior assets and verified the new icon,
62 configuration fingerprints, 15 peer-domain baselines and five private stores.
Protected Motion pages, exact tutorial canonical, redirects, campus audio and
existing routes passed. The maintenance timer resumed active/enabled. Live browser
acceptance confirmed My Music query-prefill/validation and current instructions.
OpenMP3 rendered at an actual 390px viewport without horizontal overflow and with
its icon loaded. The other chat completed its desktop page/link checks. Public
copy review found no private folder data or new prohibited references.

## Independent rollback

Complete immediate rollback:
`/var/www/asymmetri-rollback-before-mymusic-links-20261116`, source
`e476ee04ecef52d31bde1e3d3c5be819929f74db`, build `Z1m4fuMWS4SYDNJKPZb6U`.
After activation it independently started and passed 29 route and 45 bundle checks.
Use the documented whole-directory recovery process: drain website/maintenance,
retain the failed runtime, restore the complete predecessor, check both public
hosts and resume maintenance. Serving and rollback dependencies are independent.

Minimum guarded available memory: **222,268 KiB**. Minimum free disk:
**6,586,671,104 bytes**. No failure occurred; the unchanged 192 MiB / 6 GiB floors
were maintained.

## Retention handoff

Production opening free space in this task was **7,034,249,216 bytes**. Before the
handoff, the OpenMP3 task used the documented lossless retention procedure for two
older inactive website runtimes. Gzip integrity, full tar comparison, SHA-256,
source/build identity and inactivity checks preceded removal of expanded duplicates.
Serving and immediate rollback directories stayed complete.

| Original runtime | Retained archive | SHA-256 | Archive bytes |
| --- | --- | --- | ---: |
| before-mymusic-20261115, source `4ee0a2651e9b6dafc34d9fe5cd460ebef9d71927`, build `E2OJu4pokkUqFe7kdJQ7W` | `/var/backups/asymmetri-openmp3-20261116/asymmetri-rollback-before-mymusic-20261115.tar.gz` | `92235a401cfafe436200deb37e4dac6f06b6fc14bb739c553e1f5a7c8156bfd9` | 468,253,185 |
| before-motion-appstore-20261112, source `22074253894a071baff9f2cd26a2147bf83800ab`, build `NuLNmWjI8mCQC6syMWWyY` | `/var/backups/asymmetri-openmp3-20261116/asymmetri-rollback-before-motion-appstore-20261112.tar.gz` | `924616497177e6652b1a31d5d871b425d398544fe55168c4fa0bc99376fe34de` | 304,133,838 |

The first expanded runtime had a 1,317,728,256-byte du estimate; its receipt records
7,883,493,376 bytes free after retention but no standalone before measurement, so no
exact recovered amount is inferred. The second had a 716,849,152-byte du estimate;
free space rose from 7,883,464,704 to 8,296,161,280 bytes, a measured 412,696,576-byte
gain. Recovery requires checksum verification and extraction to an empty,
application-owned staging directory before normal guarded activation. Archives,
checksums and private evidence remain; retention periods were not changed.

## Cleanup and storage

Local opening free space was **46,211,878,912 bytes**. One canonical checkout was
present. While the other chat's development server remained active, dependencies
and Next output were retained; both chats' owned servers were stopped and open
handles checked before final deletion. Removed local categories: inactive Vinext
output, Next output, reproducible dependencies, build metadata, and a zero-byte
superseded transfer. Source, lockfile, public media and private release evidence
remain. No unrelated caches or repositories were cleaned.

| Cleanup window | Free before, bytes | Free after, bytes | Measured recovered bytes |
| --- | ---: | ---: | ---: |
| Local Vinext output | 38,491,217,920 | 38,625,222,656 | 134,004,736 |
| Local inactive Next/dependencies | 36,521,226,240 | 37,920,727,040 | 1,399,500,800 |
| Local generated metadata/empty transfer | 36,430,188,544 | 36,430,422,016 | 233,472 |
| Production verified transfer/empty fixtures | 6,586,671,104 | 6,843,629,568 | 256,958,464 |
| Production superseded source-only clone | 6,843,613,184 | 6,973,140,992 | 129,527,808 |

Local measured cleanup gains total **1,533,739,008 bytes**; production post-release
cleanup gains total **386,486,272 bytes**. These are filesystem free-space changes
within each cleanup window, distinct from du estimates and overall task disk drift.
Other concurrent host activity changed free space between windows. Local final
measured free space: **36,430,422,016 bytes**; production final measurement:
**6,973,108,224 bytes**.

Local removed du estimates: Vinext 133,894,144 bytes, Next 595,689,472 bytes,
dependencies 802,856,960 bytes, TypeScript build metadata 335,872 bytes and Worker
deploy metadata 4,096 bytes. Production removed the exact 256,923,194-byte runtime
transfer, empty fixtures and staging parent after live/rollback checks, then the
129,527,808-byte (du) superseded OpenMP3 source-only clone. The latter contained
only `.git`, no index/stash/runtime/config/data; all refs were reachable from the
deployed source, and process/open-handle checks passed. Private release evidence
from both attempts remains outside runtime directories.

Retained production du estimates: serving runtime 1,322,106,880 bytes; immediate
rollback 1,318,727,680 bytes; older before-mymusic-modes runtime 1,318,379,520 bytes;
older before-campus-carols runtime 706,998,272 bytes. All retained archives,
configuration, secrets, persistent stores and required recovery material remain.
Live/peer health and rollback identity were rechecked after deletion. No new cleanup
blocker or retention decision remains; pre-existing historical custody questions
remain tracked under [Issue #5](https://github.com/eugenelin89/asymmetri/issues/5).
