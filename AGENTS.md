# Asymmetrico Agent Instructions

## Scope

These instructions apply to the entire repository. Keep changes scoped to the
user's request, avoid speculative features, and preserve existing behavior and
user-created content unless a task explicitly changes it. Do not revert,
overwrite, stage, or commit unrelated user work. Do not perform broad cleanup
during an unrelated task.

Before changing architecture, behavior, tooling, content organization, commands,
dependencies, brand assets, or deployment procedures, read the relevant
documentation in `README.md` and `docs/`. Update affected documentation in the
same implementation commit.

## Project Purpose

This repository contains the official Asymmetri Labs company website. Labs builds
technology that gives individuals and small teams outsized capability. Asymmetri
Work covers software and coordinated AI, starting with BotSquad. Asymmetri Sport
covers sports technology, starting with Asymmetri Motion. Preserve this domain
hierarchy while keeping both products directly accessible.

The site should communicate asymmetric advantage through credible evidence,
clear product truth states, and a privacy-conscious account of work originating
in community sport. It should not feel like a generic SaaS landing page, sports
advertisement, inflated startup pitch, or legacy robotics/AI company site.

## Architecture Boundaries

- `app/` owns routes, route metadata, page composition, sitemap, robots rules,
  and global styles.
- `components/` owns shared site structure and reusable editorial or product
  visuals.
- `content/site.ts` owns primary editable copy, navigation, product facts,
  contact details, metadata values, image descriptions, and research
  disclosures.
- `lib/` owns small shared implementation helpers such as metadata generation.
- `public/brand/` owns final logo and icon assets.
- `public/images/` owns approved sports and research imagery with stable public
  URLs.
- `docs/` owns brand, architecture, content, development, asset, testing,
  deployment, and prompt-history documentation.
- `build/`, `vite.config.ts`, and `worker/` own OpenAI Sites and Cloudflare
  Worker packaging. Do not mix product content into deployment code.
- `.openai/hosting.json` stores only the opaque Sites project identifier and any
  supported logical resource bindings. Never store credentials or runtime
  secrets there.

## Content, Evidence, and Privacy Rules

Keep shared public copy and external URLs centralized in `content/site.ts`. Page
components may own route-specific connective prose, but do not duplicate
product facts or contact details across components.

Use factual, plain-language summaries. Do not invent customers, partners,
awards, measurements, adoption figures, outcomes, affiliations, research
findings, or product capabilities. Keep these truth states visibly distinct:

- **Current verified product capability:** Asymmetri Motion V1 behavior verified
  in current implementation and accepted decisions. Implementation does not imply
  public App Store availability or scientific validation of interpretation.
- **Emerging or experimental:** biomechanics, sensing, movement-signal,
  machine-learning, and physical-system research.
- **Future direction:** ideas that are not yet presented as deployed products.

Do not name or imply the identity of the private source sports organization. Do
not publish real athlete names, evaluation content, coach notes, account
details, deployment URLs, repository identifiers, or direct screenshots from a
private application. Public product reconstructions must use synthetic data and
identify themselves as reconstructions.

Maintain the voice defined in `docs/BRAND_STRATEGY.md`: confident, concise,
human, technically credible, and quietly unconventional. Avoid vague
“AI-powered” language, militaristic framing, generic SaaS claims, and language
that suggests technology replaces coaches.

## Motion App Store and app-link continuity

The owner explicitly requires Motion's website resources to remain available
through company redesigns (September 28, 2026). Treat `/privacy`, `/support`,
`/tutorial` and `/motion` as protected product routes. Do not delete their pages,
remove navigation to them, or turn the Motion policy/support content into generic
company articles. The iPhone app currently references
`https://www.asymmetri.co/privacy` and `https://www.asymmetri.co/support`.

Preserve working pages on both apex and `www`, the tutorial's exact `www`
canonical, tutorial hashes and original-image URLs. A future owner-approved URL
migration must retain useful compatibility redirects and coordinate with the app
release; do not assume every installed app immediately updates. Verify these URLs
and footer/context links before and after every website release.

## Implementation Style

Prefer Next.js App Router server components. Add client components or browser
JavaScript only when interaction requires them. Prefer semantic HTML and CSS
over JavaScript-driven layout.

Keep components focused and readable. Avoid premature abstraction, monolithic
files, hidden global dependencies, and broad redesigns during unrelated tasks.
Keep TypeScript strict, make shared types explicit, and avoid `any` unless it is
unavoidable and documented.

Do not introduce server-owned state, authentication, APIs, persistence, a CMS,
a database, analytics, visitor tracking, or a form backend unless explicitly
requested. Preserve the existing Vinext and Cloudflare Worker packaging for
OpenAI Sites.

## Styling and Accessibility

Use the design tokens in `app/globals.css` and `tailwind.config.ts`. Use CSS
variables for reusable values and follow `docs/VISUAL_IDENTITY.md`.

Maintain responsive behavior with semantic HTML, grid, flexbox, and fluid
sizing. Keep animation subtle, optional, and compatible with
`prefers-reduced-motion`. Maintain visible keyboard focus, sufficient color
contrast, useful alt text, touch-friendly controls, and interactions that do not
depend only on hover or color.

Do not add external font dependencies, UI kits, CSS-in-JS, heavy animation
libraries, neon/glow treatments, or arbitrary visual systems unless explicitly
requested.

## Asset Rules

Use authentic, approved media only when it adds evidence or human stakes. Do
not replace authentic project media with stock photography. Do not expose team
photos with identifiable minors or assets that imply an unverified
partnership.

Record every added, replaced, generated, reserved, or removed public asset in
`docs/ASSET_MANIFEST.md`, including source, dimensions, processing, public role,
alt text, and rights assessment. Preserve logo source variants and favicon
fallbacks. Do not hotlink production images.

## Dependency and Runtime Rules

Keep dependencies minimal and prefer framework-native or small local
implementations. Explain meaningful dependency additions in the implementation
summary. Keep `package-lock.json` committed and synchronized with
`package.json`.

For the existing DigitalOcean production deployment, the owner has standing
approval for the Node 22 runtime (September 19, 2026: “always approve node 22
runtime. don't ask me again.”). Do not request renewed runtime-exception approval
for subsequent website deployments. Run production checks/build successfully
before restarting. Local development/validation continues to use `.nvmrc`.

Use the Node version in `.nvmrc`. When nvm is installed but not already loaded,
load it with:

```bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
```

Before installing dependencies or running the complete verification suite, run
`nvm install` and `nvm use` when nvm is available. If nvm is unavailable,
confirm that `node --version` matches `.nvmrc` before proceeding. If npm reports
engine warnings, verify the active version before changing dependencies.

## Quality Checks

For meaningful changes, run as applicable:

```bash
npm run check
npm run build
npm audit --omit=dev
git diff --check
```

`npm run check` owns TypeScript and ESLint validation. Use
`npm run build:next` when changing framework integration or when standard
Next.js compatibility needs verification.

For visual or layout changes, verify affected routes at mobile, tablet, and
desktop widths; keyboard navigation; focus indicators; reduced-motion behavior;
console errors; external links; broken or placeholder images; alt text; and
horizontal overflow. Re-run privacy and prohibited-reference scans after
content, asset, or product-visual changes.

## Documentation Maintenance

Documentation is part of implementation.

- Keep `README.md` accurate as the primary onboarding entry point.
- Keep `docs/LOCAL_DEVELOPMENT.md` aligned with setup, commands, prerequisites,
  ports, troubleshooting, and daily workflows.
- Keep `docs/ARCHITECTURE.md` aligned with directory structure, rendering,
  dependencies, data flow, metadata, and deployment boundaries.
- Keep `docs/CONTENT_GUIDE.md` aligned with editable content, product truth
  states, routes, links, assets, and writing guidance.
- Keep `docs/ASSET_MANIFEST.md` aligned with asset provenance, dimensions,
  responsive use, generation records, rights, and exclusions.
- Keep `docs/DEPLOYMENT.md` aligned with build output, Sites packaging, access,
  versioning, and release procedures.
- Keep `docs/TESTING.md` aligned with actual scripts and required checks.
- Do not document scripts, routes, dependencies, or behavior that do not exist.
- When removing or renaming functionality, update stale documentation
  references.
- Historical prompt records should not be rewritten solely because later
  implementation changes.
- Never store passwords, credentials, private keys, API tokens, or secrets in
  documentation.

## Existing Production CLI Access

The owner has approved persistent SSH deployment access and a separate full-server
administrator route on the existing DigitalOcean instance (September 24, 2026).
See `docs/CLI_ACCESS.md` for verified identities, commands, and boundaries.

- Use `ssh asymmetri` for routine deployments as `webdeploy`. Run application
  commands through the documented root-owned helper as `django-user`; it disables
  privilege elevation while preserving application ownership and Git access.
- Use `ssh webadmin` (alias `asymmetri-admin`) when an authorized administration
  task requires root. `sudo -n` is available for any root command on this instance.
  Do not request renewed setup approval for these existing access permissions.
- This administrator route affects all sites on the instance. Preserve unrelated
  websites and configurations; keep changes within the user's requested scope.
- Run application Git, dependency, and build operations as the application owner,
  not root. Root access does not replace the checks/build/activation/rollback rules.
- Keep private keys in the Mac's `.ssh` directory, outside the repository and all
  prompt records. Never print or copy their contents into tools, logs, or documents.

## Default Git and Release Workflow

This is a personal repository. Unless the user explicitly requests another
workflow:

1. Work directly on the currently checked-out `main` branch.
2. Before editing, confirm that the current branch is `main`, the working tree
   is clean, and `git pull --ff-only origin main` succeeds.
3. Do not create a feature branch.
4. Do not create a Git worktree.
5. Do not create a pull request.
6. Do not merge branches.
7. Do not deploy, release, publish, or create a hosted preview. Deployment or
   publication requires an explicit user request.
8. Build and test locally as required for the change.
9. Continue to use the two-commit prompt-journal workflow: first commit the
   implementation and affected documentation, then commit the prompt archive
   record separately.
10. Push `main` after both commits unless the user explicitly asks to keep the
    work local or the push fails.
11. Never force-push unless explicitly requested.
12. When a large prompt is passed through a Codex attachment, never archive the
    private attachment path or generated attachment filename. Preserve a safe
    user-visible request and a complete decision-oriented summary instead.

## Prompt Archive and Commit Policy

Whenever a user prompt causes files to be created, modified, moved, or deleted,
create a prompt record under `docs/prompts/` using the next unused integer ID,
zero-padded to three digits. Use one of these suffixes:

- `platform` for repository-wide, setup, tooling, or architecture work.
- `content` for copy, metadata, links, or product information.
- `design` for styling, layout, identity, assets, or component work.
- `deployment` for hosting, access, automation, or release work.

Each prompt record is an Engineering Journal. Follow
`docs/prompts/README.md`. Include the user-visible request. When a prompt arrives
as a very large attachment, never record its private attachment path or generated
filename; preserve a safe user-visible request and a complete decision-oriented
summary of the attachment instead of copying thousands of lines into the
repository.

Use two commits when a prompt archive is required:

1. Implementation and affected documentation.
2. The prompt archive record.

The prompt record should list every implementation commit created before the
archive. Record only the archive commit message inside the record; report the
archive commit SHA after it exists. Do not include the current prompt record in
its own diff summary, which would create infinite self-reference.

Do not paste raw unified diffs, dependency-install logs, build logs, terminal
transcripts, or repository snapshots into prompt records. Summarize decisions,
engineering impact, human-readable file changes, verification, repository
state, and lessons learned. Exclude generated and dependency directories such
as `.git/`, `node_modules/`, `dist/`, `.next/`, `.wrangler/`, and `coverage/`.

Do not include unrelated user changes in either commit. Routine Git commands
needed by this workflow are authorized. Push `main` after both commits unless the
user asks to keep the work local or the push fails. Never force-push unless
explicitly requested.
