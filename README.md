# Asymmetri Labs

Asymmetri Labs builds baseball technology that helps pitchers, coaches and parents
see pitching development more clearly. Its first product, Asymmetri Motion, is an
iPhone pitching-video and projected 2D analysis app preparing for release. Better
evidence strengthens coaching without replacing it.

## Website purpose

This repository contains the official company website. The landing page
preserves the company hero and authentic pitching photograph, follows with the
founder story and Capture / Understand / Improve approach, then presents the
Product section before the human-coaching close and direct contact. The Product
menu link targets `/#product`; its Explore button opens `/motion`. That page explains the
current workflow, inspectable evidence, history, scientific limits and local-first
architecture. Verified V1 capability is distinct from public release availability.

## Routes

`/` is the company marketing page and `/motion` is the detailed product page.
`/privacy` and `/support` provide the Asymmetri Motion Privacy Policy and Support guidance, with quiet footer links and mutual
links. All four routes are indexable and included in the sitemap. The former
`/story`, `/contact`,
`/about`, `/work`, `/why-asymmetrico`, and named-product routes permanently
redirect to the relevant homepage section or the homepage itself. Next.js also
generates `/robots.txt` and `/sitemap.xml`.

## Technology

Next.js App Router, React, TypeScript, Tailwind CSS, Next.js image and metadata
APIs, and Vinext/Cloudflare Workers packaging for OpenAI Sites. The
`asymmetri.co` production site uses the standard Next.js build and server behind
Nginx and systemd on a DigitalOcean Ubuntu Droplet. There is no analytics, form
backend, database, authentication, or public athlete data.

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
npm run build:next
npm run build
npm audit --omit=dev
git diff --check
```

Primary public copy, metadata, contact details, and the selected hero-image
description live in `content/site.ts`. See `docs/ASSET_MANIFEST.md` before
changing public assets.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [DigitalOcean deployment and rollback](docs/DEPLOYMENT.md)
- [Local development](docs/LOCAL_DEVELOPMENT.md)
- [Testing](docs/TESTING.md)
- [Content guide](docs/CONTENT_GUIDE.md)
- [Motion product claims and source review](docs/MOTION_PRODUCT_REVIEW.md)
- [Website privacy audit](docs/WEBSITE_PRIVACY_AUDIT.md)
- [Asset manifest](docs/ASSET_MANIFEST.md)
