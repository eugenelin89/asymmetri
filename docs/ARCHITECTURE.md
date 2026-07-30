# Architecture

## Overview

The Asymmetri Labs website is a typed Next.js App Router application. React server
components render three compact public routes, local assets provide three
storytelling images, and Vinext packages the application as a Cloudflare Worker
for OpenAI Sites. It has no database, authentication, API routes, analytics,
third-party scripts, form backend, uploads, or client-owned state.

## Responsibilities

| Path | Responsibility |
| --- | --- |
| `app/` | Routes, composition, styles, metadata, JSON-LD, sitemap, and robots |
| `components/` | Shared header, footer, logo, and page framing |
| `content/site.ts` | Typed shared copy, navigation, contact values, and image descriptions |
| `lib/site-metadata.ts` | Per-route canonical, Open Graph, and X metadata |
| `public/` | Approved local brand, social, and storytelling assets |
| `docs/` | Strategy, identity, provenance, development, testing, and journals |
| `build/`, `vite.config.ts`, `worker/` | Sites and Cloudflare packaging |

## Routes and data flow

Public content is `/`, `/story`, and `/contact`, plus generated robots and sitemap
routes. Former Work, About, name-story, and named-product URLs permanently redirect
to Story through `next.config.ts`.

`content/site.ts` feeds server-rendered route composition and shared components.
`app/layout.tsx` owns global metadata, icons, social image, and Organization JSON-LD;
`lib/site-metadata.ts` owns route metadata. The canonical URL and mailbox remain
centralized.

## Design and privacy

`app/globals.css` provides the editorial token system, responsive layouts, focus
styles, and reduced-motion behavior. The new architecture removes product visuals,
feature grids, and research-page structures. No private application data or source
organization information enters the public application.

## Deployment

`npm run build` produces the Worker-compatible `dist/` bundle. OpenAI Sites manages
production versions and Cloudflare deployment. `npm run build:next` remains the
optional standard Next.js compatibility check.
