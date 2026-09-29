# Asymmetri Labs

Asymmetri Labs creates technologies that give individuals and small teams outsized
capability. The public portfolio introduces BotSquad and Asymmetri Motion, with
Asymmetri Work for software/AI coordination and the baseball founder story
preserved under Asymmetri Sport.

## Website purpose

The company homepage introduces two products in plain language, shows their current
status and connects the work to the founder’s coaching experience. The visual
system uses warm paper surfaces, readable system typography and approved real media.
BotSquad coordinates persistent logical AI workers in a self-hosted workspace;
current browser access uses a tunnel, while standard web access and mobile remain
in development. Asymmetri Motion creates inspectable pitching evidence on iPhone
and is preparing for release. Neither implementation nor promotional media proves
scientific validation or public App Store availability.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Labs philosophy, product portfolio and company contact |
| `/work` | Work philosophy, individual capability, coordinated AI and BotSquad introduction |
| `/sport` | Preserved pitching photograph, founder story, approach and Motion introduction |
| `/motion` | Detailed product workflow, evidence, limitations and introduction video |
| `/botsquad` | Source-grounded product explanation, introduction video and GitHub access |
| `/about` | Company philosophy and origins |
| `/tutorial` | Complete progressive Motion guide with original-image links |
| `/privacy` | Motion policy, support/hosting disclosures and optional website videos |
| `/support` | Motion support guidance |

Motion policy, support, tutorial and product pages are protected app/release
resources and must remain available; see the continuity rules in `AGENTS.md` and
[Content guide](docs/CONTENT_GUIDE.md).

All nine pages are indexable. The tutorial retains the exact canonical
`https://www.asymmetri.co/tutorial`; other pages use the apex origin. Legacy routes
and the three moved homepage fragments retain useful destinations. See
[Architecture](docs/ARCHITECTURE.md) for the complete mapping.

## Technology

Next.js App Router, React, TypeScript, Tailwind CSS, Next.js image and metadata
APIs, and Vinext/Cloudflare Workers packaging for OpenAI Sites. The
`asymmetri.co` production site uses the standard Next.js build and server behind
Nginx and systemd on a DigitalOcean Ubuntu Droplet. The website adds no analytics, form
backend, database, authentication or application-owned visitor tracking. Optional
YouTube players connect to Google only after explicit activation; local posters
and normal external links are available beforehand. Tutorial screenshots contain only the
owner-authorized retained pitching media described in the asset manifest.

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

Shared identity, navigation, product copy, contact details, concept captions and
approved video IDs/disclosures live in typed exports in `content/site.ts`. See `docs/ASSET_MANIFEST.md` before
changing public assets.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [DigitalOcean deployment and rollback](docs/DEPLOYMENT.md)
- [SSH and CLI deployment access](docs/CLI_ACCESS.md)
- [Server storage maintenance](docs/SERVER_MAINTENANCE.md)
- [Local development](docs/LOCAL_DEVELOPMENT.md)
- [Testing](docs/TESTING.md)
- [Content guide](docs/CONTENT_GUIDE.md)
- [Motion product claims and source review](docs/MOTION_PRODUCT_REVIEW.md)
- [Website privacy audit](docs/WEBSITE_PRIVACY_AUDIT.md)
- [Asset manifest](docs/ASSET_MANIFEST.md)
- [Tutorial coverage and source review](docs/TUTORIAL_REVIEW.md)
- [Tutorial media and generation prompts](docs/TUTORIAL_MEDIA.md)

- [Portfolio decisions and product evidence](docs/PORTFOLIO_REDESIGN.md)
