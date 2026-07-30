# Asymmetrico

Asymmetrico is a sports technology company building accessible tools for athletes
and coaches who want to compete beyond the limits of their resources. Baseball is
the first proving ground.

## Website purpose

This repository contains the official company website. The site leads with the
company mission rather than a named software product, presents deployed work and
experimental research with distinct truth states, and explains asymmetric
advantage without hostile or militaristic framing.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Six-section company story |
| `/work` | Built technology, experimental research, and direction |
| `/about` | Mission, technical origin, and baseball starting point |
| `/contact` | Direct, privacy-conscious contact invitation |

Legacy URLs `/why-asymmetrico` and `/work/asymmetrico-platform` permanently
redirect to `/about#why-asymmetrico` and `/work`, respectively. Next.js also
generates `/robots.txt` and `/sitemap.xml`.

## Technology

Next.js App Router, React, TypeScript, Tailwind CSS, Next.js image and metadata
APIs, and Vinext/Cloudflare Workers packaging for OpenAI Sites. Server components
are the default. There is no analytics, form backend, database, authentication, or
public athlete data.

## Local development

Use the Node version in `.nvmrc`.

```bash
nvm install
nvm use
npm install
npm run dev
```

## Verification

```bash
npm run check
npm run build
npm audit --omit=dev
git diff --check
```

Primary public copy, contact details, metadata, and image descriptions live in
`content/site.ts`. Routes are composed in `app/`, shared structure in
`components/`, and the visual system in `app/globals.css`.

Brand assets are in `public/brand/`, selected sports and research imagery in
`public/images/`, and the social preview at `public/og.svg`. See
`docs/ASSET_MANIFEST.md` before changing public assets.
