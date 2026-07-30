# Asymmetri Labs

Asymmetri Labs is a baseball technology startup exploring how smartphone video,
affordable sensors, and AI can help pitchers, coaches, and parents understand
development more clearly. It begins with pitching mechanics and the belief that
better evidence can strengthen good coaching without replacing it.

## Website purpose

This repository contains the official one-page company website. The landing page
combines one central pitch, the founder’s personal origin story, a concise
Capture / Understand / Improve thesis, and direct contact. It presents the
company as early-stage and does not imply that a finished commercial platform
exists.

## Routes

`/` is the only primary indexed content page. The former `/story`, `/contact`,
`/about`, `/work`, `/why-asymmetrico`, and named-product routes permanently
redirect to the relevant homepage section or the homepage itself. Next.js also
generates `/robots.txt` and `/sitemap.xml`.

## Technology

Next.js App Router, React, TypeScript, Tailwind CSS, Next.js image and metadata
APIs, and Vinext/Cloudflare Workers packaging for OpenAI Sites. There is no
analytics, form backend, database, authentication, or public athlete data.

## Local development

Use the Node version in `.nvmrc`.

```bash
nvm install
nvm use
npm ci
npm run dev
```

## Verification

```bash
npm run check
npm run build
npm audit --omit=dev
git diff --check
```

Primary public copy, metadata, contact details, and the selected hero-image
description live in `content/site.ts`. See `docs/ASSET_MANIFEST.md` before
changing public assets.
