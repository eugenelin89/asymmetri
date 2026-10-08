# Prompt 044: Nix portrait and DevOps card

- Date: 2026-10-08
- Scope: design
- Goal: Add the missing Nix portrait and card to Meet BotSquad in the existing illustrated style.

## Original user request

> Nix does not have an image. Can you create one for Nix

The owner directed the source lookup:

> You can find Nix in the BotSquad repo: [https://github.com/eugenelin89/bot_messenger](https://github.com/eugenelin89/bot_messenger)

The owner refined the portrait through these messages:

> Should Nix be male?
>
> Nix is male
>
> early 20s
>
> asian
>
> short hair buzz cut
>
> ear ring
>
> tatoo
>
> white t-shirt

## Scope

Continue the owner-requested public BotSquad portrait update with Nix. Generate
his portrait, verify his role from public source, add his card, accommodate the
fourth Atlas branch, document provenance and validate before the staged release.
No BotSquad product code, private HQ state, dependencies or unrelated content change.

## Decisions

- Latest clean website main was already current at
  `f572e31254079a493dac98279e161d85172bab29`; it contained seven workers and no Nix.
- Public BotSquad source `cb2fd43b8ffbec274df294f483d242a90385765e`
  confirms Nix is DevOps reporting to Atlas in `initializeNix` and runtime instructions.
  No gender or biography was inferred from the role; appearance follows the owner.
- Used built-in image generation and successive edits to match the existing set.
  Final character: Asian adult man in his early 20s, clean-shaven, black buzz cut,
  small silver hoop, abstract neck tattoo and plain white T-shirt.
- Retained the 1254×1254 PNG outside public source; exported the full composition
  as 384×384 WebP, quality 86 / effort 6, 14,912 bytes, using existing Sharp.
- Added Nix as Atlas's fourth direct report, with an 80px portrait inside the card.
  His description preserves the human-approval boundary for infrastructure work.
- Four desktop columns use the existing connectors. At 1100px and below the
  existing nested-list layout keeps labels and portraits readable.
- Production preflight confirmed the same clean source, active service, prior
  build `-ezttsbM5L6Rj5UUY48zQ`, Node 22.23.1 and healthy protected routes.
  Immutable rollback tag `website-pre-botsquad-nix-2026-10-08` was pushed and
  its peeled target verified at the preceding source SHA.

## Implementation

Nix joins Maya, Turing and Scout under Atlas. Linus, Ada and Grace remain under
Turing. All eight cards use the shared portrait component and local assets.
Nix's final source lineage and edit prompt are retained in the portrait record.

## Engineering impact

One new image and content entry, a small scoped CSS adjustment, and documentation.
No new dependency, runtime configuration, route, client code, tracking or interaction.
All 60 pre-existing public assets remain byte-identical, including the other faces.

## Files changed

- Public BotSquad image assets: final optimized Nix portrait.
- Central content and global CSS: verified DevOps card and four-branch layout.
- Asset manifest, portrait record, content guide and testing guide: provenance,
  generation, source evidence, alt text and expanded hierarchy checks.

## Documentation updated

`ASSET_MANIFEST.md` records the asset source, processing, role, rights assessment
and dimensions. `BOTSQUAD_PORTRAITS.md` records the final design, source lineage
and prompt. `CONTENT_GUIDE.md` and `TESTING.md` describe all eight workers and
the responsive breakpoint. Deployment and architecture procedures are unchanged.

## Git diff summary

Seven implementation files changed, 76 insertions and 10 deletions, including
one new binary image of 14,912 bytes. This journal is excluded from its own summary.

## Verification

- Node 24.10.0 matches `.nvmrc`; the existing local setup has no nvm installation.
- TypeScript and ESLint passed with the existing tutorial-navigation warning.
- Next.js and Vinext builds passed; existing build notices remain.
- Production dependency audit reports the existing one high-severity Next.js
  finding (exit 1). No package, lockfile or dependency mutation was performed.
- Whitespace, added-source private-path, credential and obsolete-brand scans passed.
  Reviewed the generated artwork for the requested appearance and absence of text,
  logos, private product data or real employee identity claims.
- All 60 pre-existing public asset Git hashes match the preceding revision.
  The first binary comparison hit the command buffer limit; Git blob hashing
  completed the check without loading large image bytes into command output.
- Browser measurements at 320, 390, 768, 1024, 1100, 1101, 1440 and 1920px:
  all eight portraits loaded at 80px with useful alt text; no horizontal page
  overflow or overflowing card descendants. Desktop, mobile and tablet inspected.
- Keyboard Labs disclosure Enter/Escape, restored focus and 3px focus outline pass.
  No missing local anchors, browser warnings or console errors. Reduced-motion
  rules and noninteractive card semantics remain unchanged.
- Local HTTP: all nine routes, six redirects, eight direct/optimized portraits
  and 24 tutorial original images passed. Home, Labs and protected Motion main
  content remains identical to the saved baseline; canonicals and footer links pass.
- Production preflight: homepage, Labs, BotSquad and all four protected Motion
  pages returned 200 on loopback, apex and www with expected footer links.
- Exact production candidate, activation and final verification results belong
  in the external release receipt after deployment; they are not claimed here.

## Repository state after implementation commit

Main at `23ce557aa0d88e5b8c086aeeafb8db7829b5d35a`, clean, one commit ahead of
origin/main. Only intended files were committed. This record is committed separately.

## Implementation commits

- `23ce557aa0d88e5b8c086aeeafb8db7829b5d35a` — Add Nix portrait and DevOps team card

## Archive commit

`Record Nix portrait design and verification journal`

## Lessons learned

Verify roster facts in product source before extending a website diagram.
Keep owner-selected character appearance separate from technical roles, and
test both sides of a responsive breakpoint when adding another branch.

## Follow-up ideas

Handle the existing Next.js audit finding in a separate dependency task.
