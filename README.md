# Asymmetri

Asymmetri builds technology that gives people and small teams more capability
with the resources they already have.

```text
Asymmetri.co
├── Asymmetri Sports
│   └── Asymmetri Motion
└── Asymmetri Labs
    └── BotSquad
        ├── BotSquad Research
        │   └── BotSquad Investment
        └── Ask BotSquad
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
| `/botsquad/research` | Research hub within BotSquad, linking to BotSquad Investment |
| `/botsquad/investment` | Live configured paper portfolio, actual roster and initial journal; market results remain unavailable |
| `/botsquad/ask` | Closed public Q&A page; availability and reviewed-disclosure gated visitor client |
| `/about` | Company philosophy and founder's sports origin |
| `/tutorial` | Protected Motion guide: why and how to build history, with stable hashes and original-image links |
| `/privacy`, `/support` | Protected Motion policy and support articles |
| `/sport`, `/work` | Permanent compatibility redirects to `/sports`, `/labs` |

The root homepage introduces Asymmetri and routes visitors directly to Sports and
Labs without repeating division or product content. Contact opens the shared mailbox;
legacy contact URLs still reach the footer email.

The ten main canonical pages are indexable. Investment and Ask retain their existing noindex policy. Tutorial retains exactly
`https://www.asymmetri.co/tutorial`; other pages use the apex canonical.
Protected Motion routes serve actual content on both hosts. Legacy fragments
and route mappings are documented in [Architecture](docs/ARCHITECTURE.md).

Current BotSquad page hierarchy: [October 13 navigation decision](docs/BOTSQUAD_HIERARCHY_2026-10-13.md).

Company decision, source review and verified pre-change rollback marker:
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
investment development. [INFRA-02](docs/INFRA-02-RECEIVER-DEPLOYMENT.md) records the initial stopped receiver installation. The [October 13 ingress release](docs/INGRESS_RELEASE_2026-10-13.md) started the empty investment and disabled-intake Ask listeners with verified shared HTTPS. The subsequent [investment activation](docs/INV-REAL-01-WEBSITE.md) installs a finite real publisher and connects the initial records. Historical preparation and test
records remain available through the cancellation record.

Next.js App Router, React, TypeScript, Tailwind CSS, Next.js image and metadata
APIs, and Vinext/Cloudflare Workers packaging for OpenAI Sites. The
`asymmetri.co` production site uses the standard Next.js build and server behind
Nginx and systemd on a DigitalOcean Ubuntu Droplet. The website adds no analytics, form
backend or application-owned visitor tracking. A separate, default-disabled
investment archive receiver has its own SQLite/signature boundary. INV-03 adds
exact artifact/discussion pages behind an explicit loopback read configuration;
the installed receiver now accepts the exact finite HQ publisher scope and serves the initial configured portfolio. The investment
website is public; see the [current release receipt](docs/INV-REAL-01-WEBSITE.md) and
[receiver runbook](docs/INVESTMENT_RECEIVER.md). Optional
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

## BotSquad investment showcase (INV-04 / INV-REAL-01)

**Repository ownership and handoff.** This repository owns the Asymmetri website, investment REST receiver and public artifact/archive views. [BotSquad HQ](https://github.com/eugenelin89/bot_messenger) owns workers, the planned paper simulator (INV-05), free-source adapter (INV-06), trusted HQ publisher (INV-07) and later employee operation. BotSquad also owns the [canonical version 1.0 contract](https://github.com/eugenelin89/bot_messenger/tree/9ff8cc984954f2e822ec191de60dcd39607ea1a7/contracts/investment/v1); this repository vendors its nine matching files in `receiver/vendor/investment/v1/`. Follow the [authoritative investment roadmap](https://github.com/eugenelin89/bot_messenger/blob/main/docs/experiments/investment/ROADMAP.md) for milestone dependencies and status, and the [cross-repository integration map](docs/BOTSQUAD_INTEGRATION.md) for ownership and release coordination.


The source-level [investment showcase](docs/INV-04-VALIDATION.md) adds the team,
discussion desk, research, decisions, portfolio, holdings and transaction journal
at `/botsquad/investment`, exact-run pages at `/botsquad/investment/runs/[runId]`,
decision pages, methodology, and a disabled `/botsquad/ask` preview. Existing exact
artifact, discussion and record URLs remain available. These routes are noindex
and are not added to the public sitemap. The website was released on October 13; see the release receipt below.

Production reads now expose the official configured portfolio, actual Atlas/Maya
roster and USD 100,000 initialization journal. No market observation, employee turn
or completed investment result is established yet. Unconfigured environments
still render their truthful empty state. See [local development](docs/LOCAL_DEVELOPMENT.md)
for the explicitly invoked disposable synthetic preview and [receiver boundaries](docs/INVESTMENT_RECEIVER.md).

Current observed-paper website semantics, source acceptance, release status and remaining
integration are recorded in [INV-REAL-01 website handoff](docs/INV-REAL-01-WEBSITE.md).

Private Ask receiver source and recovery commands are documented in
[ASK-01 private boundary](docs/ASK-01-PRIVATE-RECEIVER.md). The public Ask page
remains disabled; this source milestone does not activate visitor intake or HQ.

Shared-apex HTTPS is installed and verified; [the release receipt](docs/INGRESS_RELEASE_2026-10-13.md) records exact sources, confinement, renewal and all-host preservation. Ask intake remains disabled. HQ reports repaired private authentication; initial signed investment publication and public reads are verified in the current handoff. The [synthetic interoperability launcher](docs/ASK-01-INTEROPERABILITY.md) provides a separate temporary HTTPS fixture for typed-client acceptance.

## Dormant Ask visitor interface

[Ask UI boundaries and local acceptance](docs/ASK-03-WEBSITE-UI.md) cover the
production visitor path and isolated synthetic acceptance. Genuine intake remains
disabled through the absent reviewed disclosure and disabled receiver. No production
configuration enables the local fixture. See [readiness and remaining gates](docs/ASK-04-READINESS.md).

The [closed Ask production-path release](docs/ASK-04-RELEASE_2026-10-13.md) records
its current public deployment and unchanged private-service boundaries.

The subsequent [closed Ask receiver rollout](docs/ASK-04-RECEIVER-RELEASE_2026-10-13.md)
installs its reviewed recovery/availability fixes with intake still disabled,
236 passing Linux receiver tests and independent rollback evidence.

The [Ask operational safeguards](docs/ASK-04-OPERATIONS_2026-10-13.md) add verified
zero-swap/core-memory limits and isolated recovery acceptance while keeping intake
closed and preserving the live investment.

## October 13 navigation and closed contract release

The [current release receipt](docs/BOTSQUAD-NAVIGATION-RELEASE_2026-10-13.md) records the BotSquad Research hub,
shared navigation, neutral investment introduction and installed closed Ask
activity-contract source. It supersedes earlier runtime identities while preserving
live investment records, protected Motion pages and unchanged service configuration.
Public Ask remains closed; the later configuration-read amendment is separate.
