# Asymmetri Labs

Asymmetri Labs explores how everyday cameras and sensors can give athletes,
coaches, and parents clearer evidence for better development. It grew from a
founder’s experience as a baseball coach, division coordinator, and parent using
slow-motion smartphone video, then affordable sensors, to support an iterative
pitching-development process. Baseball is where we begin.

## Website purpose

This repository contains the official company website. Its compact, story-first
experience explains the access gap, the mission, and an exploratory technical
direction without presenting a settled product roadmap or named flagship product.
Evidence helps guide changes and measure whether they work. AI may make that
evidence easier to use, but technology supports human coaching; it does not
replace it.

## Routes

| Route      | Purpose                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `/`        | Six-section company story                                                                                          |
| `/story`   | Personal origin, baseball starting point, and exploration stage                                                    |
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
