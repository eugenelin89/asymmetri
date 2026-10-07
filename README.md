# Asymmetri

Asymmetri builds technology that gives people and small teams more capability
with the resources they already have.

```text
Asymmetri.co
├── Asymmetri Sports
│   └── Asymmetri Motion
└── Asymmetri Labs
    └── BotSquad
```

Sports builds for athletes, coaches and teams. Labs explores experimental
technology and open-source projects. They share useful capability, inspectable
results and human judgment as principles, without claiming a common codebase.

Motion's current pitching V1.2 candidate is preparing for release. Separate
individual Hitting and one professional Cloud-backed Team app remain planned.
Team Pitching/Hitting/Baseball are entitlements within that one Team app.
BotSquad is experimental, MIT licensed and self-hosted on an operator-controlled
Ubuntu HQ, accessed through a private SSH-tunnel browser. Native mobile is deferred.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Umbrella, two peer divisions, current work and company contact |
| `/sports` | Sports division, authentic baseball origin, Motion and product family |
| `/labs` | Experimental technology division and data-driven project list |
| `/motion` | Current pitching workflow, evidence, Notes/Reference/Compare, limits and family roadmap |
| `/botsquad` | Experimental project, workflow, review, current access, approved video and GitHub |
| `/about` | Company philosophy and founder's sports origin |
| `/tutorial` | Protected Motion guide with stable hashes and original-image links |
| `/privacy`, `/support` | Protected Motion policy and support articles |
| `/sport`, `/work` | Permanent compatibility redirects to `/sports`, `/labs` |

The nine canonical pages are indexable. Tutorial retains exactly
`https://www.asymmetri.co/tutorial`; other pages use the apex canonical.
Protected Motion routes serve actual content on both hosts. Legacy fragments
and route mappings are documented in [Architecture](docs/ARCHITECTURE.md).

Current decision, source review and verified pre-change rollback marker:
[October 7 company architecture](docs/COMPANY_ARCHITECTURE_2026-10-07.md).
The September portfolio record and prompt journals remain historical evidence.

The visual identity uses a cool mineral umbrella, teal Sports/Motion and slate
Labs/BotSquad. Shared CSS tokens control surfaces, actions and diagrams; authentic
product imagery is unchanged. See [Visual identity](docs/VISUAL_IDENTITY.md).

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
- [October 7 dependency security review](docs/DEPENDENCY_SECURITY_2026-10-07.md)
- [Content guide](docs/CONTENT_GUIDE.md)
- [Motion product claims and source review](docs/MOTION_PRODUCT_REVIEW.md)
- [Website privacy audit](docs/WEBSITE_PRIVACY_AUDIT.md)
- [Asset manifest](docs/ASSET_MANIFEST.md)
- [Tutorial coverage and source review](docs/TUTORIAL_REVIEW.md)
- [Tutorial media and generation prompts](docs/TUTORIAL_MEDIA.md)

- [Historical September portfolio decisions](docs/PORTFOLIO_REDESIGN.md)
