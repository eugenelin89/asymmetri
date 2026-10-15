# BotSquad Trade URL migration — October 15, 2026

The owner explicitly requested `/botsquad/trade` as the public URL and required
all existing links to keep working. This supersedes the earlier decision to keep
Investment as the public path; technical identifiers and signed APIs stay stable.

## Public route contract

Move the complete App Router family to `app/botsquad/trade/`. The old family gets
an HTTP 308 permanent redirect to the same suffix beneath `/botsquad/trade`:

| Suffix | Purpose |
| --- | --- |
| empty | Trade showcase |
| `/guide`, `/hq-guide`, `/methodology` | Guides and methodology |
| `/runs/[runId]` | Exact retained run |
| `/discussions/[discussionId]` | Discussion and paginated contributions |
| `/decisions/[decisionId]` | Decision and review |
| `/records/[kind]/[recordId]/versions/[version]` | Exact evidence record |
| `/artifacts/[artifactId]/versions/[version]` | Exact artifact version |
| `/artifacts/[artifactId]/versions/[version]/content` | Verified inline image or attachment |
| `/read` | GET-only public read projection |

The wildcard includes the root and all nested suffixes without matching near
prefixes such as `/botsquad/investments`. Redirects preserve query values, including
`run`, `after`, nested encoded `resource`, `display`, empty values and duplicates.
They specify no fragment, so browsers retain existing `#desk`, `#team`, guide
anchors and contribution anchors. Query encoding may be normalized by Next.js;
values and ordering within repeated keys must remain intact. Unknown suffixes
still resolve to a 404, never silently to the showcase.

Normal legacy URLs redirect once. Existing global trailing-slash normalization
can add an initial 308 for a slash-ending legacy URL; this is bounded at two hops.
The migration does not change unrelated routes' slash behavior or host routing.

GET/HEAD behavior, unavailable-content responses, byte hashes, attachment/inline
headers, CSP, no-store and privacy headers remain on the moved handlers. A 308
preserves methods; unsupported writes still end at a 405. `/api/experiments/v1`,
`/api/ask/v1`, signatures, publisher scope, storage and immutable archived bytes
are not renamed. Persisted Markdown/source links can remain historical because
their legacy destinations continue to work. Public image URLs remain unchanged.

Authored navigation, guide sources and Ask evidence links use Trade directly.
Page canonical and Open Graph URLs use the new family, preserving explicit run
context on evidence pages. Trade remains noindex and excluded from the sitemap;
Motion routes, its exact www tutorial canonical and original assets are protected.

## Compatibility fallback and permanent-redirect rollback

A pre-migration website build alone is not a valid long-term rollback after a
308 has been cached or new URLs bookmarked. Prepare a separate compatibility
fallback before switching production. Its source is the old working website plus
one internal `/botsquad/trade/:path*` → `/botsquad/investment/:path*` rewrite. It
has no Investment → Trade redirect, so either namespace serves the old working
pages and handlers without a loop. This fallback intentionally retains the old
navigation and metadata while restoring availability; forward-fix to the canonical
Trade release afterward.

Commit this narrow compatibility configuration before the final migration and
build it serially from that exact Git revision. Record the baseline, compatibility
commit, source manifest, artifact hash and build ID separately. Do not describe a
patched baseline as an unmodified release. The canonical migration replaces the
rewrite with its opposite permanent redirect; never install both directions in
one runtime. The compatibility commit is not published as an intermediate website
release.

Retain the full pre-migration runtime as historical rollback evidence and the
complete tested compatibility fallback as the operational rollback target. On an
activation failure, preserve the failed candidate and activate that compatibility
fallback, then check both URL namespaces and unchanged private service state.
Keep the same resource floors, owner identities and full-runtime manifests. No
Nginx, ingress, receiver, HQ authority or database change is part of this migration.

## Verification

Use the existing disposable showcase fixture for successful archived content and
exact download checks. `TRADE_TEST_ORIGIN=http://127.0.0.1:4327 node --test
tests/trade-routing.test.mjs` tests page families, canonical/OG metadata, queries,
GET/HEAD/unsupported methods, attachment bytes/security headers, near-prefix 404s
and bounded slash redirects. Run it against the canonical production artifact
before activation as well as the local preview. Test the fallback independently:
both namespaces must render directly with identical records and download bytes.

Browser checks cover legacy fragments, guide contents, reciprocal links, actual
record/download navigation, responsive wrapping and console errors. Post-release
checks cover both apex and www, original assets, known unrelated TLS limitations,
protected Motion resources and unchanged Ask/receiver configuration and records.
Exact source/build identities and activation/readback outcomes belong in the
external release receipt and prompt journal, not inferred from a successful build.
