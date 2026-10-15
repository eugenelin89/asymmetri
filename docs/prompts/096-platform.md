# Prompt 096: Make Trade the canonical BotSquad URL

- Date: 2026-10-15
- Scope: platform
- Goal: Publish BotSquad Trade at `/botsquad/trade` while preserving every legacy route.

## Original user request

> Is it easy to turn "https://asymmetri.co/botsquad/investment" to "https://asymmetri.co/botsquad/trade"? Please work with the asymmetri.co thread on this. Make sure all links will remain working and no broken links.

The direct human request was verified in the BotSquad coordination chat. Standing
instructions authorize direct commits and production deployment. The website chat
owns implementation and release; the coordinator reviews source and browser behavior.

## Scope

The complete public website route family, authored navigation, Ask evidence links,
metadata, compatibility tests and release preparation. Signed API paths, receiver
protocols, immutable evidence, HQ controls, grants and Ask activation are unchanged.
No assets, dependencies or private data are added or modified.

## Decisions

Move the existing App Router directory and use one same-suffix permanent 308 from
Investment to Trade. Keep run context, pagination, nested resource queries, empty
and repeated values, methods and browser fragments. Unknown routes remain 404.
Existing trailing-slash normalization can add a second hop for slash-ending URLs.

A cached permanent redirect makes the unmodified old website insufficient for
rollback. First commit and build a narrow compatibility fallback: old pages with
an internal Trade-to-Investment rewrite and no opposing redirect. Both namespaces
must work directly. Retain that complete build as operational rollback, separately
from the complete historical production runtime. Do not publish the fallback as
an intermediate release.

Keep dated screenshot source URLs at their actual capture locations. Those legacy
links work by redirect; image URLs and bytes remain unchanged. Update canonical
and Open Graph identity for all page families, including explicit run context.
Keep noindex and sitemap exclusion. Use server components and existing styles.

## Implementation

Moved all pages and GET handlers, updated public URL helpers and navigation, and
added centralized Trade metadata. Fixed Ask's relative shared-stylesheet import
after moving its source directory. Added canonical and fallback integration suites
and strengthened existing Ask/archive link assertions. The read/download handlers,
Trade guide article, layout and styles remain byte-identical to the prior release.

## Engineering impact

This changes public routing and metadata, not archive semantics. Existing bookmarks
and embedded historical links retain exact destinations. Protected Motion pages,
tutorial canonical and original images remain within release preservation checks.
Production activation changes only the website service. Linux artifacts are built
serially on the reserved HQ host, under existing memory/disk/service guards.

## Files changed

- Public route family moved from Investment to Trade, plus shared metadata helper.
- Central copy/navigation links, archive/guide components and Ask link generation.
- Redirect configuration, two HTTP integration suites and existing link assertions.
- Current architecture, content, navigation, testing and deployment documentation.

## Documentation updated

README, AGENTS, ARCHITECTURE, CONTENT_GUIDE, LOCAL_DEVELOPMENT, TESTING, DEPLOYMENT
and the BotSquad hierarchy document reflect the canonical route and compatibility.
The dated migration contract records suffixes, queries, methods, provenance and
rollback. TESTING explains the disposable fixture's frozen request-budget clock.
Historical journals and asset provenance remain unchanged.

## Git diff summary

Across both implementation commits: 44 files changed, 419 insertions and 77 deletions,
including route moves, tests and migration documentation. The final implementation
commit alone changes 44 files with 331 insertions and 82 deletions. This journal
is excluded from those totals.

## Verification

- Local Node 24.10.0 matches `.nvmrc`; nvm unavailable. TypeScript/ESLint passed
  with the pre-existing tutorial navigation warning. Archive/Ask tests passed 22/22;
  production dependency audit reported zero vulnerabilities. Diff check passed.
- Reserved Linux Node 22.23.1 checks, regression tests, Sites build and Next webpack
  build passed for both source sets. Canonical input hashes matched 268/268;
  fallback matched 265/265. No dependency-lock or contract changes.
- Canonical build `RBn5hsve7XHveUuiqM8M7`, artifact SHA-256
  `68a48f10f28c1ecb3e314e2a9f88ec93e8d93d75dc3b52ff87cdbfe3420e4d2a`.
  Fallback build `6SZSNzO5931x4yjZR2uUN`, artifact SHA-256
  `3ead516e4ac929835069eb756d09d4bd277e99f0fc07a5e52da82c9012efa4c7`.
- Canonical compiled HTTP suite passed all seven groups: nine page families,
  metadata/run context, query preservation, exact download bytes and security
  headers, method semantics, unknown routes, slash bounds and complete rendered
  internal-link/anchor crawl. Fallback compiled suite passed all three groups.
- Initial crawl discovered the Ask stylesheet path and it was fixed before the
  accepted build. A later artifact download failed closed after the long-lived
  disposable receiver exhausted its frozen 600-request bucket; its direct response
  confirmed 429. Advancing only the documented fixture clock produced a clean full
  seven-group pass against the unchanged artifact. No production guard was relaxed.
- Preview Computer Use verified legacy fragments and actual guide navigation.
  Responsive widths 320, 390, 768, 1024, 1440 and 1920 showed no overflow.
  Independent review verified guide anchors, run context and no browser errors.
  Existing focus/reduced-motion styles are unchanged. Dated figure provenance
  matched the previous source exactly; changed public-source privacy scan passed.
- Canonical build guard minimum: 1043140 KiB available RAM, 16420548608 bytes free.
  Final smoke minimum: 1332664 KiB RAM, 16415596544 bytes free. HQ and Nginx service
  identities remained unchanged. Disposable listener/tunnel stopped after testing.
- Production preservation baseline: 142 observations comprising 134 verified HTTP
  responses, four known unrelated IPv6 TLS failures and four fallback certificate
  fingerprints. Includes 74 original-image observations. Private service/config/
  archive invariants captured separately. Activation and live readback follow push;
  actual outcomes belong in the external release receipt and completion report.

## Repository state after implementation commit

Clean main at `e43f0eed8506e3acc09409aeb9c45716a90ca8a1`, two commits ahead of
origin/main. Commit this journal separately and push all three before preparation.

## Implementation commits

- `2d20cf907b99a1842eb10ded5181aff359b2ef0c` — Prepare Trade URL compatibility fallback for permanent redirects
- `e43f0eed8506e3acc09409aeb9c45716a90ca8a1` — Move BotSquad Trade to canonical public URLs

## Archive commit

Record Trade URL migration engineering journal

## Lessons learned

Permanent redirects require rollback compatibility for cached destinations. Preserve
historical screenshot provenance instead of rewriting it with current navigation.
Broad route crawls can find relative imports missed by absolute-URL searches. A
frozen test clock also freezes rate-limit windows; diagnose test setup before
changing application behavior.

## Follow-up ideas

The authorized coordinator independently verifies live navigation after deployment.
No monitoring automation or separate experiment execution is created by this task.
