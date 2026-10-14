# Prompt 093: Simplify the Trade introduction

- Date: 2026-10-14
- Scope: design
- Goal: Remove the requested introductory panel and correct the experiment wording.

## Original user request

> Remove this section

The screenshot identifies the entire introductory aside beginning “Research →
discussion → decisions” and “The team is the experiment,” including its supporting
paragraphs.

> Should be "This trading experiment"

The second screenshot identifies the opening paragraph’s “This trade experiment.”
Standing owner instructions authorize committing and deploying these changes.

## Scope

The shared Trade showcase and retained-run opening layout, its copy and content
guidance. No API, receiver, run, evidence, permissions, financial behavior or Ask
availability changes. Existing navigation, employee portraits and methodology remain.

## Decisions

Remove the entire aside, not only its heading. Use one introductory column and
remove obsolete responsive grid rules so no empty column remains. Give the desktop
headline a 16-character measure while retaining its mobile measure, typography,
colors and spacing. Change the sentence to “This trading experiment makes their
research, disagreement, decisions and reviews inspectable.”

## Implementation

Removed the aside markup, three unused copy fields and its CSS rules. Simplified
the hero layout, corrected the introduction and documented the new content structure.

## Engineering impact

Presentation only. No dependencies, routes, anchors, public assets or interactive
behavior changed. Existing reduced-motion and focus rules remain intact.

## Files changed

Showcase composition; its stylesheet; shared site content; content guide.

## Documentation updated

CONTENT_GUIDE now describes the single-column introduction and removal of the panel.
Historical prompt records remain unchanged. No asset manifest update is needed.

## Git diff summary

4 implementation files changed, 11 insertions and 16 deletions. The net removal is
limited to the requested panel and its unused styling/copy, plus the wording fix.

## Verification

- Node 24.10.0 matches .nvmrc; nvm is unavailable. Local TypeScript/ESLint pass
  with the existing tutorial navigation warning; existing Ask/archive tests21/21;
  production dependency audit reports zero vulnerabilities.
- Reserved Linux Node22.23.1 check, Vinext and Next webpack builds pass. Shared
  build access was serialized with BotSquad validation and its restart held until
  packaging completed. Available RAM stayed at least951036KiB, disk22985285632bytes,
  and live HQ/Nginx identities stayed unchanged.
- Build L7Kf_x7BQ5EzPAWBXdBxD; all247 source hashes match after compilation.
  Runtime archive SHA256:
  1c12e06deb1cc9744473b74edf67be6a4f6036553d3c8e17f3210011e5a61b06.
- Source checks confirm the aside and its unused fields/styles are absent, the
  corrected sentence is present, and every showcase link expression is retained.
  Public-edit privacy/prohibited-reference checks and git diff --check pass.
- Production baseline retains112 route observations, including48 original tutorial
  images and four known IPv6 TLS failures. Source is committed before deployment;
  actual activation, responsive browser checks and final preservation results are
  recorded in the external release receipt and completion report.

## Repository state after implementation commit

main at385a0df9515df6153edc5a37f68b6e8906ce13a0, clean and one commit ahead of
origin/main. Commit this journal separately and push both before staging production.

## Implementation commits

- 385a0df9515df6153edc5a37f68b6e8906ce13a0 — Simplify Trade introduction and remove experiment aside

## Archive commit

Record Trade introduction simplification journal

## Lessons learned

Remove obsolete layout rules alongside a removed panel. Keep live financial
records and worker evidence independent of website copy changes.

## Follow-up ideas

The already-authorized BotSquad coordinator will independently read back the final
website release. No additional product or infrastructure change is proposed.
