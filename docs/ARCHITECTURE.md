# Architecture

## Overview

The Asymmetri Labs website is a typed Next.js App Router application. React server
components render one public landing page, one local image provides the hero
photograph, and Vinext packages the application as a Cloudflare Worker for
OpenAI Sites. It has no database, authentication, API routes, analytics,
third-party scripts, form backend, uploads, or client-owned state.

## Responsibilities

| Path | Responsibility |
| --- | --- |
| `app/` | Routes, composition, styles, metadata, JSON-LD, sitemap, and robots |
| `components/` | Shared header, footer, and logo |
| `content/site.ts` | Typed shared copy, navigation, contact values, and image descriptions |
| `public/` | Approved local brand, social, and storytelling assets |
| `docs/` | Strategy, identity, provenance, development, testing, and journals |
| `build/`, `vite.config.ts`, `worker/` | Sites and Cloudflare packaging |

## Routes and data flow

Public content is `/`, plus generated robots and sitemap routes. `/story`,
`/contact`, `/about`, `/work`, `/why-asymmetrico`, and the former named-product
URL permanently redirect to the relevant homepage anchor or `/` through
`next.config.ts`. The sitemap indexes only the homepage.

`content/site.ts` feeds server-rendered route composition and shared components.
`app/layout.tsx` owns global metadata, icons, social image, and Organization
JSON-LD. The canonical URL and mailbox remain centralized.

## Design and privacy

`app/globals.css` provides the modern sans-serif token system, responsive layouts,
focus styles, and reduced-motion behavior. The one-page architecture removes
secondary page framing, product visuals, feature grids, and research-page
structures. No private application data or source organization information enters
the public application.

## Deployment

`npm run build` produces the Worker-compatible `dist/` bundle. OpenAI Sites manages
production versions and Cloudflare deployment. `npm run build:next` remains the
optional standard Next.js compatibility check.
