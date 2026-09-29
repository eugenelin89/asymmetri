# Prompt 029: Restore page levels and section structure

- Date: 2026-09-29
- Scope: design
- Goal: Restore the earlier hierarchy and page sequence while keeping the approved human wording and colors.

## Original user request

> The color and wordings are ok. but I like how the pages and their levels were structured in the previous version.

Asked whether this meant the Labs → Work/Sport → product hierarchy, the section
layouts within pages, or both, the owner replied:

> Both

The ongoing review follows the owner's preceding instruction:

> just deploy. i will see how i like in prod

## Scope

Compare the pre-editorial release with the current site and restore both structural
layers. Preserve the current palette, typography and conversational copy, product
facts, public routes and protected Motion resources. Continue the same production
review workflow after validation. No dependency or infrastructure changes.

## Decisions

- Restore the homepage sequence: company introduction, company principle, two
  distinct product panels, common principles and contact.
- Make company/domain/product levels explicit through nested navigation based on
  the existing shared Work/Sport overview and product links. Products remain
  directly accessible and show current availability.
- Keep the founder narrative on Sport and About; restore About's company-first
  introduction before principles and the founder account.
- Restore Work's split hero and approach outline. Use current principle wording
  rather than returning to the old slogans or decorative diagram.
- Put BotSquad's full example back after its detailed workflow. A compact ordered
  outline serves the hero and homepage without repeating the full example.
- Keep the paper/ink/mineral palette, system type, current headings and disclosure
  behavior. Existing source copy is unchanged except centralizing a heading that
  was already rendered directly by the BotSquad page.

## Implementation

Homepage navigation now visibly nests Work → BotSquad and Sport → Motion under
Labs. Earlier section boundaries and product panels are restored. Company-level
sections reuse current About principles; deeper origin and example content return
to their corresponding pages. Work again pairs its introduction with a three-step
outline. About leads with the existing explanation of the name and keeps the
existing first-person paragraphs in its later origin section. BotSquad has a
separate example with a split introduction and three handoff columns.

## Engineering impact

All new structure is semantic server-rendered HTML/CSS. WorkerFlow is a small
shared presentational component; WorkerExample retains synthetic-example disclosure.
No new interaction, JavaScript dependency, external resource, route, backend,
tracking or product claim. Motion, Sport, tutorial, policy/support route sources,
navigation behavior, public asset bytes and packaging remain unchanged.

## Files changed

- Homepage, Work, About and BotSquad composition; scoped global layout rules.
- Shared compact workflow and standalone worked-example presentation.
- One centralized existing heading in the shared content source.
- README and architecture, strategy, content, visual, asset and testing documents.

## Documentation updated

Current documentation describes the restored hierarchy and section sequences.
The asset manifest records the pitching photo's return to a Sport-only role and
the semantic outline visuals. Historical prompt records remain intact.

## Git diff summary

16 files changed, 220 insertions and 97 deletions. Most changes restore page
composition, responsive panel/outline presentation and accompanying documentation.
This journal is excluded from its own summary.

## Verification

- Clean main and successful git pull --ff-only before editing.
- Active Node 24.10.0 matches .nvmrc; nvm was unavailable.
- npm run check passed after correcting optional navigation-child typing.
- npm run build passed; Vinext retains its existing route-classification notice.
- npm run build:next passed with the process/port access required by Turbopack.
- npm audit --omit=dev reported the unchanged four findings: one critical, two
  high and one moderate. No dependency remediation belongs to this revision.
- git diff --check and staged diff check passed.
- All nine routes at 320, 390, 768, 1024 and 1440 effective CSS pixels: no
  horizontal overflow, missing image alt, broken loaded image or extra H1.
- Browser console checks returned no warnings or errors. Visual inspection covered
  the homepage hierarchy, desktop Work split and phone BotSquad example.
- Keyboard activation of the nested Work link reached /work. Enter opened the
  native Work disclosure; Escape closed it and restored visible focus. Existing
  reduced-motion CSS was reviewed and unchanged.
- Local production HTTP checks passed all nine pages, 37 image/static URLs, four
  compatibility redirects, canonicals, nine sitemap entries and ten tutorial
  modules. Internal fragments and protected resource/footer links passed.
- Shared content compared byte-identical with the prior release after excluding
  the newly centralized existing heading. Public assets, protected route sources,
  navigation/footer logic, package files and redirects compared unchanged.
- Public reference/credential scans passed; no new imagery, private identity,
  fabricated result or product capability was introduced.
- Production deployment follows these commits using the existing staged release
  procedure. Exact source/build/rollback identities and post-activation results
  belong in the external task release receipt.

## Repository state after implementation commit

Clean main at c87cdf5c483474df54e8585c90c465fe148511b1, one commit ahead of the
last observed origin/main. Journal and push follow. No branch, worktree or PR.

## Implementation commits

- c87cdf5c483474df54e8585c90c465fe148511b1 — Restore page hierarchy and section structure with the current visual style.

## Archive commit

`docs: journal restored site hierarchy and layouts`

## Lessons learned

Tone, color and information structure are separate decisions. Preserve a working
hierarchy when softening the visual style, and keep company, domain and product
content at recognizable levels. Reuse approved language when restoring structure.

## Follow-up ideas

Further refinements depend on the owner's production review.
