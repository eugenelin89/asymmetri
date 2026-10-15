# Prompt 095: Publish the HQ investigation companion

- Date: 2026-10-15
- Scope: content
- Goal: Publish an illustrated guide to investigating BotSquad Trade through HQ.

## Original user request

> Can you also document, how we can use BotSquad HQ to examine or investigate or troubleshoot. Also include screenshot using computer use. Same level of detail and language as the above documentation.

The owner requested this companion in the BotSquad coordination chat after the
Trade technical guide and authorized coordination with the Asymmetri website chat
and web publication. Standing instructions permit direct commits and deployment.
The direct human request was verified in the source chat before integration.

## Scope

A static public companion at `/botsquad/investment/hq-guide`, seven reviewed actual
HQ screenshot crops, reciprocal links to the Trade guide, and entry points from
the showcase and archive/methodology. No HQ controls, grants, execution, source
collection, model calls, experiment recovery, receiver behavior or Ask activation.
The website release alone is authorized by this implementation.

## Decisions

BotSquad owns technical accuracy and source screenshots; the website owns layout,
accessibility, public privacy review and release. Integrate the cleared final
source with SHA-256
`f1a501d391be1000b3ad2892a0a80d93c9639d0addadc9756de1f94f4ed4f86c`.
The content is pinned to HQ revision139a1c5 and the October15 observation window.
Preserve its distinctions among reachability, execution, usage settlement,
authority, accounting and publication. Explain the historical review failure and
current evidence limits without implying a new recovery or trading outcome.

Use the existing server-rendered guide layout and a light reading surface. Keep
17 anchored sections, two numbered procedures and two code-style record blocks.
Use keyboard-focusable horizontal scrolling for wide evidence tables and blocks.
Keep screenshot crops byte-identical, dated and captioned; display the private
source as a plain label with no access URL. Full-size links point only to approved
public crops. Actual private HQ imagery was specifically authorized for this
reviewed guide; that does not authorize future private captures automatically.

## Implementation

Added the article, metadata and seven images. Generalized the existing layout's
copy and companion link, added accessible code blocks and optional wide tables,
and allowed screenshots to fill the reading column without enlarging narrow
crops beyond their native dimensions. Both guides retain their noindex policy,
BotSquad hierarchy and links to the trading desk and methodology.

## Engineering impact

Static content and presentation only. No dependencies, client state, APIs or
configuration changes. Existing exact-run archive context, portraits, approved
Trade wording and protected Motion resources remain intact. An older inactive
website rollback was retained losslessly outside Git to provide candidate staging
capacity; current and immediate rollback directories remained on production.

## Files changed

- New HQ article/route and seven reviewed screenshot crops.
- Shared guide layout/style and centralized metadata/image descriptions.
- Showcase and archive navigation.
- Onboarding, architecture, content, testing, asset and deployment documentation.

## Documentation updated

README, ARCHITECTURE, CONTENT_GUIDE and TESTING document the companion and its
navigation/accessibility requirements. ASSET_MANIFEST records crop provenance,
privacy review, dimensions, dates, alt text and hashes. DEPLOYMENT and the dated
October15 retention record explain verified streaming retention when production
cannot hold both an archive and its original above the disk floor.

## Git diff summary

21 implementation files changed,596 insertions and19 deletions, including seven
new JPEG assets. The journal itself is excluded from these totals.

## Verification

- Local Node24.10.0 matches .nvmrc; nvm unavailable. TypeScript/ESLint passed with
  the existing tutorial navigation warning; existing Ask/archive tests21/21;
  production dependency audit reported zero vulnerabilities.
- Independent Computer Use preview review at1280×720 passed all17 sections,
  seven loaded images, two numbered lists, two code blocks and every anchor.
- Responsive checks at320/375/768/1024/1440 found no page overflow. Mobile contents
  disclosure and guide/desk cross-links work; record-block keyboard scrolling and
  visible focus pass. Existing Trade guide checks at320/768/1440 pass. All images
  have alt text; private screenshot sources have no links. No browser console
  errors. Existing reduced-motion rules remain intact.
- All14 external citations ultimately returned HTTP200; one transient TLS timeout
  passed on a targeted retry. Approved-source hash, public privacy/prohibited
  reference scan and git diff --check pass.
- Reserved Linux Node22.23.1 check,21 regression tests, Sites build and Next
  webpack build pass. All265 input hashes match after compilation. Build
  `OJ0MY_5DIani0Uzmuw9SK`; artifact SHA-256 `86d03bb41832fc86a05583ee861e1b174061c9f45237a407742241649de42198`.
  Guard minima1027640KiB availableRAM and19599966208bytes free disk; HQ/Nginx
  service identities unchanged. The shared build slot was released afterward.
- Older rollback archive341985280bytes passed sync, checksum, gzip integrity and
  full GNU tar comparison before the exact redundant directory was removed.
  Retention SHA/source/build and recovery procedure are documented separately.
- Fresh production preservation baseline126 observations:118 verifiedHTTP,
  four known unrelated IPv6 TLS failures and four fallback certificate fingerprints,
  including60 original-image observations. Ask remains closed/empty; existing
  investment records/scope and service identities are captured privately.
- Activation and post-release readback occur after both commits are pushed;
  their actual result belongs in the external release receipt and completion report.

## Repository state after implementation commit

main at`7d8743e8794701f432130916cda790b488937313`, clean and one commit ahead of origin/main. Commit this journal
separately and push both before candidate preparation.

## Implementation commits

- 7d8743e8794701f432130916cda790b488937313 — Publish illustrated BotSquad HQ investigation guide

## Archive commit

Record HQ investigation guide publication journal

## Lessons learned

Private-interface documentation needs explicit capture authorization, scoped crops
and plain source labels. Preserve blank lines inside record-chain diagrams during
conversion. Resource guards and streaming manifests allow a small production host
to retain rollback integrity without compiling in the live checkout.

## Follow-up ideas

The authorized BotSquad coordinator independently verifies the live companion after
publication. Future HQ interface changes require a fresh evidence review before
updating screenshots or explanations; no monitoring automation is created here.
