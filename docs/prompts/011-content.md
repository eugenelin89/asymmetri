# Prompt 011: Public copy punctuation cleanup

- Date: 2026-07-30
- Scope: content
- Goal: Remove em dashes and en dashes from current public copy and establish the same preference for future writing.

## Original user request

> Remove or replace the dashes in the website content. Rewrite the affected
> sentences naturally and update the writing guidance so future public copy
> avoids em dashes and en dashes.

The user supplied a focused local brief requiring a manual review of current
public copy, metadata, social-preview text, and writing guidance. It required
natural sentence-level revisions, preservation of ordinary compound-word
hyphens, clean local builds, browser checks, two commits directly on `main`, and
no branch, worktree, pull request, preview, or deployment.

## Scope

Included current public text in `content/site.ts`, Open Graph image alternative
text, vector social-preview text, one current brand-guidance sentence, the
content writing rule, and punctuation in the prompt-journal template.

Excluded historical prompt records 001 through 010, positioning, facts, layout,
navigation, routes, typography, color, spacing, photography, binary assets,
dependencies, scripts, packaging, hosting, release, and deployment work.

## Decisions

- Rewrote each sentence manually instead of applying a mechanical character
  replacement.
- Changed the social support line to “Smartphone video, sensors, and AI that
  support better coaching.”
- Split the founder-story explanation into shorter sentences so the rhythm
  remained natural.
- Removed the dash before the coaching clause in the founder question by
  integrating “while keeping coaches” directly into the sentence.
- Used a colon in the Open Graph image alternative text and SVG title.
- Rephrased the parent-support guidance as “support the process without
  overriding it.”
- Added a concise rule against em dashes and en dashes in public-facing copy,
  while explicitly preserving normal hyphens in established compound words.
- Updated the journal template punctuation so new records follow the rule.
- Preserved grammatical hyphens in terms such as `slow-motion`,
  `frame-by-frame`, `public-facing`, and `social-preview`, as well as commands,
  identifiers, CSS syntax, filenames, and flags.

## Implementation

Updated the social support string, two founder-story paragraphs, Open Graph
image alternative text, and the matching vector social-preview title,
description, and support line. Rephrased one current brand-guidance sentence,
added the writing rule to the content guide, and replaced dash punctuation in
the engineering-journal template with colons.

## Engineering impact

The change affects copy and text guidance only. Public meaning, facts, audience
roles, metadata meaning, SVG layout, page structure, visual design, runtime
behavior, dependencies, binaries, and deployment architecture remain unchanged.

## Files changed

- Updated public and social copy in `content/site.ts`, `app/layout.tsx`, and
  `public/og.svg`.
- Updated current guidance in `docs/BRAND_STRATEGY.md` and
  `docs/CONTENT_GUIDE.md`.
- Updated punctuation examples in `docs/prompts/README.md`.

## Documentation updated

The content guide now tells future writers to avoid em dashes and en dashes in
public-facing copy, prefer shorter sentences or other natural punctuation, and
retain normal compound-word hyphens. The brand strategy received only the one
sentence-level correction required by the preference.

## Git diff summary

The implementation commit changed six text files with 18 insertions and 14
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
- The required current-source scan found no em dash or en dash characters.
- Browser checks at 1440×1000 and 320×800 found no dash characters or
  double-hyphen substitutes in rendered copy or inspected metadata, no
  horizontal overflow, and no console errors or warnings.
- Desktop and mobile wrapping remained natural, and the page stayed at four
  sections with the same image and design.
- `git diff --numstat` confirmed zero binary changes.
- Historical prompt records 001 through 010 remained unchanged.
- No branch, worktree, pull request, deployment, release, or hosted preview was
  created.

## Repository state after implementation commit

Branch: `main`

Implementation commit: `4d5369c845bbc781f086bd1823dd595f5f02bcf2`

The worktree was clean after the implementation commit. `main` was one commit
ahead of `origin/main` and had not yet been pushed when this record was created.

## Implementation commits

- `4d5369c845bbc781f086bd1823dd595f5f02bcf2` Remove dashes from public website copy

## Archive commit

`docs: archive public copy punctuation cleanup`

## Lessons learned

Punctuation preferences work best when they are expressed as a writing rule
rather than a mechanical character ban. Shorter sentences improved the founder
story while preserving its meaning, and ordinary compound-word hyphens remain
important for clarity.

## Follow-up ideas

None committed.
