# Prompt 010 — Player-focused story and direct-main workflow

- Date: 2026-07-30
- Scope: platform
- Goal: Remove family-specific founder language and private attachment paths while making direct-to-main work the repository default.

## Original user request

> Correct the prompt-journal privacy issue, restore the direct-to-main Codex
> workflow, and rewrite the founder story to discuss players rather than “my
> son.”

The user supplied a focused local correction brief covering public founder
copy, current documentation, prompt-journal privacy, repository operating rules,
validation, and a two-commit direct-to-main workflow. The task explicitly
excluded redesign, binary changes, branches, worktrees, pull requests, and all
deployment or hosted-preview actions.

## Scope

Included the founder-story copy in `content/site.ts`, current brand/content/site
strategy guidance, minimal sanitization of historical prompt wrappers containing
private Codex attachment plumbing, and `AGENTS.md` Git and release defaults.

Excluded layout, typography, color, spacing, navigation, footer, images, image
processing, routes, redirects, metadata, social artwork, dependencies, package
scripts, build architecture, deployment configuration, publication, and release
work.

## Decisions

- Reframed the founder origin around a baseball coach and division coordinator
  working with pitchers and players.
- Preserved the first-person process: smartphone slow motion, frame-by-frame
  comparison, movement and timing review, small adjustments, repeated recording,
  later affordable sensors, and the difficulty of extracting useful evidence.
- Removed the family relationship, injury context, and individual velocity
  outcome instead of generalizing one result into an unsupported multi-player
  claim.
- Kept parents in the wider company audience as informed supporters while
  removing them from the founder origin.
- Replaced only the private attachment wrapper in Prompt 009 and retained its
  historical decisions, verification, commit SHA, and repository-state account.
- Sanitized the same pre-existing private attachment wrapper in Prompt 001 so
  the repository-wide privacy scan could return no matches; its historical
  implementation summary remained unchanged.
- Established `main` as the default working branch and made branches, worktrees,
  pull requests, merges, deployments, releases, and hosted previews opt-in.
- Preserved the two-commit engineering-journal workflow and direct push to
  `origin/main`.

## Implementation

Replaced the four founder-story paragraphs with player-focused copy that keeps
coaching judgment central and describes no family relationship, injury, or
performance outcome. Updated only the stale founder-origin passages in the
current brand, content, and site-strategy documents.

Added `Default Git and Release Workflow` to `AGENTS.md` and reconciled its prompt
archive language with the direct-main and attachment-privacy rules. Replaced
private Codex attachment wrappers in Prompts 001 and 009 with safe, concise
user-visible requests.

## Engineering impact

The correction changes copy, privacy guidance, and repository operating policy
only. It introduces no runtime behavior, layout, dependency, binary, metadata,
route, packaging, or deployment change. Future tasks now default to clean,
fast-forwarded `main`, retain the two-commit journal policy, and require explicit
authorization for alternate Git workflows or publication.

## Files changed

- Updated founder copy in `content/site.ts`.
- Corrected current founder-origin guidance in `docs/BRAND_STRATEGY.md`,
  `docs/CONTENT_GUIDE.md`, and `docs/SITE_STRATEGY.md`.
- Added and reconciled direct-main, release, and attachment-privacy rules in
  `AGENTS.md`.
- Sanitized only the private request wrappers in `docs/prompts/001-design.md`
  and `docs/prompts/009-design.md`.

## Documentation updated

Current brand, content, and site-strategy guidance now describes a coach and
division coordinator working with players. `AGENTS.md` now documents the
personal-repository workflow. Historical prompt substance was preserved; only
private attachment plumbing was removed.

## Git diff summary

The implementation commit changed seven text files with 77 insertions and 58
deletions. No binary file changed.

## Verification

- Preflight confirmed a clean `main` branch, then
  `git pull --ff-only origin main` reported that it was already current.
- Node v24.10.0 matched the `.nvmrc` major version; nvm was unavailable.
- `npm ci` completed successfully.
- The ignored `.next` build output was removed before validation.
- `npm run check` passed TypeScript and ESLint.
- `npm run build:next` passed and statically generated the expected routes.
- `npm run build` passed the Vinext production build. It emitted only the known
  Tailwind no-utility-class warning because the site uses semantic CSS.
- `npm audit --omit=dev` reported zero production vulnerabilities.
- `git diff --check` passed.
- Targeted current-source searches found no family-specific founder wording.
- Repository-wide searches found no private Codex attachment path or generated
  attachment filename.
- The hero, approach, and closing retained appropriate parent references.
- Prompt 009 retained its historical branch, implementation SHA, and
  post-implementation repository-state wording.
- Browser checks at 1440×1000 and 320×800 confirmed the unchanged design, no
  horizontal overflow, player-focused story copy, one unchanged image, and no
  console errors or warnings.
- `git diff --numstat` confirmed zero binary changes.
- No branch, worktree, pull request, deployment, release, or hosted preview was
  created.

## Repository state after implementation commit

Branch: `main`

Implementation commit: `2218379ff985b9a52cd4733cd8824b4339f78b0f`

The worktree was clean after the implementation commit. `main` was one commit
ahead of `origin/main` and had not yet been pushed when this record was created.

## Implementation commits

- `2218379ff985b9a52cd4733cd8824b4339f78b0f` — Refine founder story and direct-main workflow

## Archive commit

`docs: archive player-focused story and workflow correction`

## Lessons learned

Public origin stories can remain personal without exposing family relationships
or relying on an individual outcome. Prompt journals should preserve historical
decisions while stripping transport-specific private paths, and repository
workflow defaults should match the owner’s actual collaboration model.

## Follow-up ideas

None committed.
