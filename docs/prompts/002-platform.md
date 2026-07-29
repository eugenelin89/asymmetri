# Prompt 002 — Repository agent workflow

- Date: 2026-07-29
- Scope: platform
- Goal: Adapt the ChristopherLin.ca repository workflow for Asymmetrico and
  bring the completed website work into compliance with it.

## Original user request

> Can you copy over
> [AGENTS.md](https://github.com/titancoder12/christopherlin.ca/blob/main/AGENTS.md)
> as part of this repo, and update it for this repo where appropriate. Then,
> enhance the previous completed task by following the workflow where necessary.

## Scope

Included:

- retrieved the canonical source instructions from the linked GitHub file;
- adapted repository scope, purpose, architecture, content, privacy,
  implementation, styling, asset, dependency, testing, documentation, prompt
  archive, and commit rules;
- added a supported Node.js version and aggregate check command;
- backfilled architecture, content, local-development, testing, and engineering
  journal documentation;
- created a retrospective journal for the original Asymmetrico redesign;
- re-ran the complete applicable verification suite;
- prepared the implementation and archive as separate commits.

Excluded:

- Astro-specific component guidance;
- personal-portfolio voice and application goals;
- Nginx, TLS, static Astro output, and permanent production-server assumptions;
- visual or public-content changes;
- new dependencies;
- a pull request, because this maintenance update follows the source workflow's
  direct configured-remote push policy on the existing `main` branch.

## Decisions

- Preserved the source file's strict scoping, documentation, verification,
  prompt-journal, two-commit, and push principles.
- Replaced Astro boundaries with the repository's actual Next.js App Router,
  typed content, component, Vinext, Worker, and Sites boundaries.
- Added explicit product-truth and privacy rules because source anonymity and
  synthetic athlete data are critical public-site constraints.
- Kept `docs/ASSET_MANIFEST.md` as the asset audit instead of creating a
  duplicate image-audit document.
- Added Node.js major version 24 in `.nvmrc`, matching the working environment.
- Made nvm recommended rather than mandatory after confirming it is not
  installed in this environment; another version manager is acceptable when
  the active Node version matches `.nvmrc`.
- Added `npm run check` as the single TypeScript-plus-ESLint workflow without
  adding a formatting dependency solely to mirror the reference repository.
- Allowed large attached prompts to be summarized decision-by-decision while
  preserving the verbatim user-visible request, avoiding multi-thousand-line
  journal records.

## Implementation

Added a root `AGENTS.md` tailored to Asymmetrico. It now governs architecture,
content truth, source anonymity, accessibility, asset provenance, dependencies,
documentation, testing, engineering journals, commits, and pushes.

Added `.nvmrc`, the `npm run check` script, onboarding links, and four
operational documents covering architecture, content, local development, and
testing. Added the engineering-journal template and a retrospective record for
the completed redesign.

## Engineering impact

- Future agents now have repository-specific rules before making changes.
- The supported runtime and verification entry point are explicit.
- Architecture, content ownership, privacy boundaries, and deployment behavior
  are documented rather than implicit.
- Every future file-changing prompt has a traceable two-commit journal workflow.
- No runtime component, route, asset, dependency, or public page behavior
  changed.

## Files changed

- Added root agent instructions and Node version configuration.
- Added architecture, content, development, testing, and journal documentation.
- Added the prior redesign's retrospective engineering journal.
- Updated README onboarding and documentation links.
- Updated deployment prerequisites and checks.
- Added the aggregate package verification script.

## Documentation updated

Created `docs/ARCHITECTURE.md`, `docs/CONTENT_GUIDE.md`,
`docs/LOCAL_DEVELOPMENT.md`, `docs/TESTING.md`,
`docs/prompts/README.md`, and `docs/prompts/001-design.md`.

Updated `README.md` and `docs/DEPLOYMENT.md` so documented runtime and commands
match the new repository workflow.

## Git diff summary

The implementation commit changed 11 files with 948 insertions and 7 deletions.
It added the adapted repository policy, runtime configuration, four operational
guides, the journal standard, and the retrospective redesign record, while
updating onboarding, deployment, and package scripts.

## Verification

- Active Node.js was `v24.10.0`, matching `.nvmrc` major version 24.
- nvm was not installed; the adapted instructions and development guide now
  document the supported version-manager fallback.
- `npm run check` passed TypeScript and ESLint.
- `npm run build` completed the Vinext production bundle.
- `npm audit --omit=dev` reported zero vulnerabilities.
- `git diff --check` passed.
- No browser testing was necessary because public UI, content, and assets did
  not change.

## Repository state after implementation commit

- Branch: `main`
- Implementation commit:
  `cf5030a2b8c1740d16512fe373403b4e7bd88bd3`
- Worktree: clean before creation of this journal record
- Remote state: local `main` was two commits ahead of `origin/main`, including
  the completed website commit and this workflow implementation

## Implementation commits

- `cf5030a2b8c1740d16512fe373403b4e7bd88bd3` — docs: add Asymmetrico repository workflow

## Archive commit

`docs: archive repository workflow prompt`

## Lessons learned

- Repository instructions should preserve a reference workflow's intent while
  naming the actual framework, deployment surface, content model, and privacy
  risks of the destination project.
- Tool availability should be checked before making one version manager a hard
  prerequisite.
- Backfilling architecture and testing documentation immediately makes an agent
  policy actionable instead of aspirational.
- Retrospective journal records should state their provenance clearly rather
  than pretending they were created in the original commit sequence.

## Follow-up ideas

- Add automated CI for `npm run check` and the standard or Vinext build if the
  repository adopts pull-request-based development.
- Confirm the canonical public domain, mailbox, and image-use permissions before
  changing the Sites deployment from owner-only to public.
