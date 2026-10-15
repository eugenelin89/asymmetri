# Prompt 094: Publish the illustrated Trade technical guide

- Date: 2026-10-15
- Scope: content
- Goal: Explain the full Trade experiment, its BotSquad architecture and daily operation in a public illustrated technical guide.

## Original user request

> maybe i still don't quite understand... Perhaps you can help me write comprehensive documentation, with screenshot using Computer Use to explain in technical details but explaining to someone with college CS degree. Communicate with "asymmetri.co" thread and put the documentation on the web. Not just explaining why i can't rerun, but explain the full "Trade" experiment, how it uses BotSquad to do it, and how it is run everyday.

The human request was verified in the coordinating BotSquad chat. That chat owned
technical authoring, genuine public Computer Use captures and technical/privacy
review. This website chat owned integration, presentation checks and publication.
The owner's existing direct-commit and production-release authorization applies.

## Scope

Add a public technical guide and discovery links. Preserve the live archive,
exact-run URLs, receivers, Ask closure, employee portraits and protected Motion
resources. No experiment restart, new authority, source/model invocation,
automation, operational control, dependency or private transcript publication.

## Decisions

Use a static server-rendered article at `/botsquad/investment/guide`, with the
existing brand tokens, a desktop contents sidebar and native mobile disclosure.
Keep Trade's noindex policy and the existing sitemap. Use semantic HTML diagrams,
labelled tables with local scrolling, a glossary and full-size screenshot links.

Distinguish implemented behavior, intended schedule and actual October 15 evidence.
The reviewed technical checkpoint is 17:40 UTC. A proposal is not an approved
submission; benchmark allocation is not a portfolio trade; a prevention repair is
not historical recovery. Retain precise finite-budget, timing and evidence limits.

The reviewed source digest is
`fb5895a6ed592228ed49776e66ed3f6f418d1711e182a36275520ae72abc1533`.
Six public captures remain byte-identical. Private workplans and review receipts
are excluded. Source citations are pinned where appropriate.

## Implementation

Publish sixteen explanatory sections plus an introduction, three structured
architecture/workflow figures, six screenshots and a glossary. Add entry links
from Trade, the archive/methodology, Research and the BotSquad overview. Centralize
shared guide metadata and image descriptions in `content/site.ts`.

## Engineering impact

The article requires no receiver access, runtime Markdown parser or new API.
Existing site navigation remains available. Tables retain readable clock values
and scroll within a keyboard-focusable region. The mobile table issue found in
independent Computer Use review was corrected before the final build.

## Files changed

- New guide route, article, responsive styles and reusable article components.
- Shared copy and four discovery/navigation surfaces.
- Six original public JPEG captures with complete provenance records.
- README, architecture, content, testing and asset documentation.

## Documentation updated

Document the route, static architecture, editing ownership, dated evidence rules,
image provenance and guide-specific visual/accessibility checks. Existing release
procedures remain applicable; exact private deployment receipts remain outside Git.

## Git diff summary

Implementation: 20 files changed, 692 insertions and 9 deletions, including six
binary image additions. Most new text is the technical article and its asset
provenance; existing application behavior is unchanged.

## Verification

- Local Node 24.10.0 matches `.nvmrc`; TypeScript and ESLint pass with one existing
  unrelated tutorial navigation warning. Existing regression suite: 21/21.
- Production dependency audit: zero vulnerabilities. Whitespace and public-content
  privacy/prohibited-reference scans pass; no new dependency or lockfile change.
- Independent content/privacy review and Computer Use presentation review clear.
- Browser widths 320, 390, 768, 1024, 1440 and 1920: no horizontal page overflow;
  all 17 contents anchors resolve, native mobile contents work, tables support
  keyboard scrolling and visible focus, and console is clear. Print and reduced
  motion styles were reviewed in source; no print-emulation claim is made.
- All 20 external source links return HTTP 200. All six screenshot files match
  their reviewed hashes and retain alt text, captions and original-image links.
- Isolated Linux Node 22.23.1: check, 21/21 regressions, Sites build and Next.js
  webpack build pass. All 256 build-input hashes match. Build ID:
  `gkOHnKuNAK-A1fWdazX-_`; artifact SHA-256:
  `487c748aba3692dd9473e38f9b7ee161b253f889f589eacbb6e861a9ef4c7a7e`.
- Linux resource guard passed: minimum available memory 1,019,304 KiB, minimum
  disk free 21,180,715,008 bytes, HQ and Nginx service identities unchanged.
- Production baseline captured: 112 observations, including 104 verified HTTP
  results, four previously documented IPv6 TLS failures and four fallback
  fingerprints; 48 protected tutorial-original observations retained. This is
  not a claim that all 112 observations have healthy verified HTTPS.
- Candidate smoke, activation, exact public readback and baseline comparison are
  the remaining authorized release steps after this journal commit and push.

## Repository state after implementation commit

On `main`, implementation commit `1844bc28958dc21c1b021a8f414d5e5e302ef83a`, one
commit ahead of the fetched remote. The tree was clean before this journal.
Framework-generated development-only files were restored after stopping preview.

## Implementation commits

- `1844bc28958dc21c1b021a8f414d5e5e302ef83a` — Publish illustrated BotSquad Trade technical guide.

## Archive commit

`Record Trade technical guide publication journal`

## Lessons learned

Check narrow tables using real browser rendering, not just page-overflow metrics.
Keep source, model execution, formal decision, accounting and public publication
separate in both the explanation and release verification.

## Follow-up ideas

Update the guide with a clearly dated new checkpoint when genuine completed
review/submission evidence or a supported recovery operation changes the record.
