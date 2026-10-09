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

Sports builds products for athletes, coaches and teams. Labs is a playground for
open-source experiments, starting with BotSquad. Everything built in Labs is open
source; this rule does not apply to every Sports product. The two remain peers
under Asymmetri, without claiming a common codebase.

Motion's current pitching V1.2 candidate is preparing for release. Separate
individual Hitting and one professional Cloud-backed Team app remain planned.
Team Pitching/Hitting/Baseball are entitlements within that one Team app.
BotSquad is experimental, MIT licensed and self-hosted on an operator-controlled
Ubuntu HQ, accessed through a private SSH-tunnel browser. Native mobile is deferred.
The [BotSquad public-story review](docs/BOTSQUAD_PAGE_REVIEW_2026-10-07.md) records
current evidence, engineering limits and the illustrative Motion workflow.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Concise umbrella gateway to Sports, Labs and their products |
| `/sports` | Sports division, authentic baseball origin, Motion and product family |
| `/labs` | Open-source playground and current experiments |
| `/motion` | Measure, track, compare and learn: pitching history, recorded performance context, evidence and family |
| `/botsquad` | Persistent AI-team experiment, current capabilities, reference team, Asymmetri uses, setup and roadmap |
| `/about` | Company philosophy and founder's sports origin |
| `/tutorial` | Protected Motion guide: why and how to build history, with stable hashes and original-image links |
| `/privacy`, `/support` | Protected Motion policy and support articles |
| `/sport`, `/work` | Permanent compatibility redirects to `/sports`, `/labs` |

The root homepage introduces Asymmetri and routes visitors directly to Sports and
Labs without repeating division or product content. Contact opens the shared mailbox;
legacy contact URLs still reach the footer email.

The nine canonical pages are indexable. Tutorial retains exactly
`https://www.asymmetri.co/tutorial`; other pages use the apex canonical.
Protected Motion routes serve actual content on both hosts. Legacy fragments
and route mappings are documented in [Architecture](docs/ARCHITECTURE.md).

Current decision, source review and verified pre-change rollback marker:
[October 7 company architecture](docs/COMPANY_ARCHITECTURE_2026-10-07.md).
The September portfolio record and prompt journals remain historical evidence.

The selected Graphite + Teal identity gives Sports and Labs one shared dark
umbrella system, with neutral light reading sections. Motion retains its own teal
and all existing assets. Shared CSS tokens control surfaces, actions and diagrams. See [Visual identity](docs/VISUAL_IDENTITY.md).

Motion’s public philosophy is **Measure changes. Preserve the evidence. Investigate
relationships. Humans interpret.** The [current product review](docs/MOTION_PRODUCT_REVIEW.md)
records the owner-approved baseball-first public names and their unchanged
scientific measurement mappings.

## Technology

The owner [cancelled/deferred INFRA-01](docs/INFRA-01-CANCELLATION.md) and retained
Ubuntu 22.10 on the original Droplet/IP. The temporary migration snapshot was deleted
after verified off-server recovery checks. A later owner-approved Mac cleanup deleted
those backup copies and keys; independent recovery custody is currently unverified. Django and all other
sites/services remain unchanged. The unsupported-OS exception requires review before
future deployment/public exposure; migration is no automatic prerequisite to local
investment development. [INFRA-02](docs/INFRA-02-RECEIVER-DEPLOYMENT.md) installs and privately validates the receiver, leaving it stopped and public publishing disabled. Historical preparation and test
records remain available through the cancellation record.

Next.js App Router, React, TypeScript, Tailwind CSS, Next.js image and metadata
APIs, and Vinext/Cloudflare Workers packaging for OpenAI Sites. The
`asymmetri.co` production site uses the standard Next.js build and server behind
Nginx and systemd on a DigitalOcean Ubuntu Droplet. The website adds no analytics, form
backend or application-owned visitor tracking. A separate, default-disabled
investment archive receiver has its own SQLite/signature boundary. INV-03 adds
exact artifact/discussion pages behind an explicit loopback read configuration;
the independent private installation remains stopped/default disabled and the public
website is unchanged. See [INV-03 acceptance](docs/INV-03-VALIDATION.md). See [receiver runbook](docs/INVESTMENT_RECEIVER.md). Optional
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
