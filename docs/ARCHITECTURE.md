# Architecture

## Overview

The Asymmetrico website is a typed Next.js App Router application. React server
components render the public routes, local assets provide the site imagery, and
Vinext packages the application as a Cloudflare Worker for OpenAI Sites.

The application has no database, authentication, API routes, analytics,
third-party runtime scripts, form backend, uploads, or client-owned application
state.

## Directory responsibilities

| Path | Responsibility |
| --- | --- |
| `app/` | Routes, route composition, global styles, layout metadata, JSON-LD, sitemap, and robots rules |
| `components/` | Shared header, footer, logo, page framing, calls to action, product reconstructions, and diagrams |
| `content/site.ts` | Typed public copy, navigation, product facts, contact values, image descriptions, and truth-state disclosures |
| `lib/site-metadata.ts` | Reusable per-route canonical, Open Graph, and X metadata |
| `public/brand/` | Logo sources, lockups, app icon, and favicon fallbacks |
| `public/images/` | Approved sports and research imagery |
| `docs/` | Strategy, identity, provenance, development, testing, deployment, and engineering journals |
| `build/sites-vite-plugin.ts` | Sites deployment-manifest generation |
| `vite.config.ts` | Vinext, Cloudflare Vite, and local `ASSETS`/`IMAGES` binding configuration |
| `worker/index.ts` | Cloudflare Worker entry point |
| `.openai/hosting.json` | Opaque Sites project identity and supported logical bindings |

## Routes

The application currently exposes:

- `/`
- `/work`
- `/work/asymmetrico-platform`
- `/why-asymmetrico`
- `/about`
- `/contact`
- `/robots.txt`
- `/sitemap.xml`

Page files own route sequence and route-specific explanation. Shared navigation,
contact values, image descriptions, and verified product facts come from
`content/site.ts`.

## Rendering and data flow

Most components are server components. There is no client-side data fetching or
runtime content service.

```text
content/site.ts
      ↓
app route composition ──→ shared components
      ↓
Next.js metadata and rendered HTML
      ↓
Vinext/Vite Worker bundle
      ↓
OpenAI Sites / Cloudflare
```

Local public assets are referenced through Next.js image handling where
responsive optimization is useful. SVG logo variants and favicon files keep
stable public paths.

Vinext routes optimized image requests through `/_vinext/image`.
`vite.config.ts` declares the Cloudflare `ASSETS` and `IMAGES` bindings so the
same Worker handler can fetch local source files and transform them during
development. OpenAI Sites supplies the corresponding production bindings.

## Metadata

`app/layout.tsx` owns site-wide metadata, icons, the default social image, and
Organization JSON-LD. `lib/site-metadata.ts` creates route-specific title,
description, canonical, Open Graph, and X values. The Platform case study adds
SoftwareApplication JSON-LD.

The canonical URL and public mailbox are centralized in `content/site.ts` and
must be confirmed before a public domain migration.

## Styling

`app/globals.css` contains the token layer, editorial layouts, component styles,
responsive rules, visible focus treatment, and reduced-motion behavior.
`tailwind.config.ts` mirrors the brand palette and type families for utility use.

The design is intentionally editorial rather than a generic dashboard. Product
reconstructions use a quieter interface language while sharing the same tokens.

## Privacy boundary

The public application contains only synthetic product-interface data. It does
not import private application screenshots or source-system content. Public
claims are limited to capabilities verified during the source audit and are
classified as deployed, emerging, or future.

The asset provenance and privacy decisions live in
`docs/ASSET_MANIFEST.md`. That record is internal repository documentation and
does not surface source-organization identity on the rendered site.

## Deployment boundary

`npm run build` invokes Vinext and produces a Worker-compatible bundle under
`dist/`. The Sites packaging helper stages that output with the generated
hosting manifest. OpenAI Sites manages production versions, access policy, and
the Cloudflare deployment.

The optional `npm run build:next` command verifies compatibility with the
standard Next.js compiler; it is not the Sites deployment artifact.
