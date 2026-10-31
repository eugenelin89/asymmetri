# Homepage division links — production release

The homepage cards now use **Explore Sports** → `/sports` and **Explore Labs** →
`/labs`. Card headings point to the same division pages. Homepage metadata describes
the two divisions. Motion and BotSquad remain available through the shared
navigation/footer and their division pages; every existing product/city URL stays
unchanged. Card structure, styling, imagery and division descriptions are preserved.

## Authorization and coordination

The owner requested this correction using a screenshot of the existing cards.
The earlier explicit deployment and link-verification request continues through
this website follow-up. Greater Vancouver GTA chats were notified of the bounded
main/server window and journals 155/156. Vancouver, Surrey and Richmond confirmed
no competing window. UBC was notified before source push and activation. Live
source/build, remote main and service fingerprints were rechecked throughout;
no unpublished city candidate or UBC working change was incorporated.

## Exact release identity

- Implementation `faa3768`; engineering journal `5eb3c8a`.
- Deployed source: `5eb3c8abf2b34b33ab9af298933bcb7174c81a82`.
- Next build: `fZHe4ybZDxYLvvS2CwwLm`; unchanged Node `v22.23.1`.
- [Successful Linux workflow](https://github.com/eugenelin89/asymmetri/actions/runs/41219314652), artifact `13049048287`.
- ZIP SHA-256: `545a450c4fbdec1d99cf4482464f6520c258f0e756340ec3f8a10de76d13019a`.
- Runtime tar SHA-256: `72e0ab6801ca30be8aab85bfbf3bd84653509cb58944e3d94c5e197ea43995c9`.
- Verified build-transfer SHA-256: `971945bf860d5e08c0ed4daec365b661e5778b050c97258e11348c70994a70a1`.
- Activated **October 31, 2026 at 16:30:04 UTC / 09:30:04 PDT**.
  Website service started at 16:29:56 UTC.

## Verification

Local Node 24 checks, Next webpack and Vinext builds, 125 build-prerequisite tests
(Surrey 54, Richmond 27, UBC 44) and production audit passed. The exact-source Linux
workflow also passed Vancouver tests. Audit reports zero vulnerabilities. Existing
tutorial lint, Browserslist-age and Vinext warnings remain non-blocking.

Browser checks at 320/768/1440 CSS pixels found no clipped cards or horizontal
overflow. Keyboard focus remains visible. Local and live navigation followed both
actions to their intended division pages; live homepage metadata and retained
footer product links were inspected. No console errors were observed.

Private Linux smoke verified 17 routes, eight protected-host checks and all
**735 tutorial/geographic assets**. Main text, IDs and canonicals matched the
previous runtime after only the intended homepage action substitutions. Robots and
sitemap entries were preserved. The first smoke stopped before activation because
its byte-for-byte sitemap comparison included the generated `lastModified` value.
The unchanged sitemap source uses `new Date()` for the homepage entry. The check
was corrected to compare all entries/values except that generated timestamp, and
the complete guarded suite passed. Original failure evidence is retained.

Public apex/www acceptance passed **32 pages, 100 asset/hash checks and six legacy
redirects**, including same-suffix Trade compatibility with query preservation.
Vancouver, Surrey, Richmond, UBC, BotSquad and protected Motion routes remain intact.
The 100 public asset checks include all tutorial originals and city/UBC metadata,
with two Richmond tile samples; private acceptance covered every published tile.
This homepage release does not claim new gameplay or community-profile acceptance.

The private candidate used an 80 MiB old-space limit and 1 MiB semi-space limit.
Successful smoke minima were **211236 KiB available memory** and **6709993472 bytes
free disk**, above the unchanged 192 MiB / 6 GiB floors. Final inspection at
16:31:11 UTC recorded 339444 KiB available memory and 6709268480 bytes free disk,
clean main, the expected build, active/running service and zero restarts/errors.
Five peer service identities, 13 unrelated vhost responses, 56 configuration
fingerprints and the Node executable stayed unchanged.

## Recovery and evidence

This uses the documented copy-only path. The only runtime files changed are the
homepage component and its centralized copy. App routes, all other components,
public assets, dependencies and runtime configuration were verified identical.
The exact Linux `.next` build was staged separately with unchanged hard-linked
dependencies; no install or compilation touched live or linked dependencies.
Only the website service restarted; source advanced by fast-forward.

The immediately preceding UBC V0.3 runtime is source
`cdc2ba3d8e86566633119658151108689dc21cae`, build `gRKOgO5gYIKwm9Z0g4amq`.
Its `.next` is retained at `/var/tmp/asymmetri-home-divisions-20261031/previous.next`.
To recover this copy-only release, stop only the website service, preserve the
replacement build, restore that previous `.next` as `django-user`, and restart.
Verify prior build/content; preserve advanced source rather than resetting it.
Previous complete-runtime rollbacks and the external UBC community store remain
untouched. Future route/asset/dependency changes need complete-runtime recovery.

Sanitized receipts are outside Git at `deployment-retention/2026-10-31/home-divisions/`
and `/var/lib/asymmetri-home-divisions-release-20261031`. Documentation/journal
commits after activation do not change the running source/build identity.
