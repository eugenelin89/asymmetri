# Asymmetri Labs

Asymmetri Labs is a sports technology startup exploring how smartphone cameras,
everyday sensors, software, data, and AI can help athletes, coaches, and parents
understand development more clearly. Baseball is where we begin.

## Website purpose

This repository contains the official company website. Its compact, story-first
experience explains the access gap, the mission, and an exploratory technical
direction without presenting a settled product roadmap or named flagship product.
Technology supports human coaching; it does not replace it.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Six-section company story |
| `/story` | Personal origin, baseball starting point, and exploration stage |
| `/contact` | Direct, privacy-conscious invitation for athletes, coaches, parents, organizations, researchers, and collaborators |

Former `/work`, `/about`, `/why-asymmetrico`, and named-product URLs permanently
redirect to `/story`. Next.js also generates `/robots.txt` and `/sitemap.xml`.

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

Primary public copy, metadata, contact details, and three selected image
descriptions live in `content/site.ts`. See `docs/ASSET_MANIFEST.md` before
changing public assets.
