# Prompt 183: Remove the Play privacy panel everywhere

- Date: 2026-10-31 (Vancouver)
- Scope: design
- Goal: Remove the unwanted privacy card from every UBC surface and the shared article, with other campus owners handling their own pages.

## Original user request

> i don't want to show this

The attached screenshot showed the Play privacy card, recording checkbox and privacy-details link. The user then clarified:

> i don't want it anywhere

The standing instruction is to message other campus threads and keep each thread focused on its own campus. Existing authorization to deploy remains in effect.

## Decisions

Remove the card rather than move it to Project information. UBC's landing and information panel no longer mount CampusPrivacyPreferences. The shared privacy article also removes the card, checkbox and deletion button, and stops referring to nonexistent controls. A standard Privacy link remains in the UBC notes; it opens the factual article separately without resetting exploration. No replacement banner is introduced.

Private measurement was requested earlier and remains unchanged. GPC/DNT and prior saved opt-outs continue to be honoured. The backend deletion endpoint remains implemented; the article describes browser signals and contact/removal information accurately. The unused compatibility export is retained while separately owned integrations remove their imports.

CWRU and Stanford owners received the clarification, removed their own panels, validated and committed those changes. This workstream does not edit or stage their campus files. CWRU owns the coordinated shared-site deployment after the final immutable source is built; each campus owner owns its live acceptance.

## Implementation and engineering impact

Three UBC/shared TSX files change rendering and explanatory text. There are no dependencies, schema, API, tracking, store, cookie or retention changes. Existing movement, reviews, named encounters and profile publishing remain outside this change. The root source commit follows CWRU's182 and Stanford's184 commits on shared main.

## Files changed

- `README.md`
- `app/labs/ubc/page.tsx`
- `projects/ubc/Campus.tsx`
- `app/labs/campus-privacy/page.tsx`
- `projects/campus-analytics/CLIENT.md`
- `projects/campus-analytics/README.md`
- `docs/ARCHITECTURE.md`
- `docs/ASSET_MANIFEST.md`
- `docs/CONTENT_GUIDE.md`
- `docs/TESTING.md`
- `docs/UBC_PRIVACY_UI_2026-10-31.md`
- `docs/validation/ubc-privacy-ui/README.md`
- `docs/validation/ubc-privacy-ui/welcome-desktop.jpg`
- `docs/validation/ubc-privacy-ui/welcome-mobile.jpg`
- `docs/validation/ubc-privacy-ui/about-mobile.jpg`
- `docs/validation/ubc-privacy-ui/plain-privacy-mobile.jpg`

## Documentation updated

The module guides and root architecture/content/testing references describe the removed UI without advertising absent controls. The UBC follow-up report and four unretouched screenshots distinguish local preview proof from deployment. Older704 release screenshots remain explicitly historical evidence of that accepted runtime.

## Git diff summary

16 files changed,95 insertions and37 deletions, including four binary screenshots. This excludes the current journal. Only root-owned UBC/shared/documentation paths were staged.

## Verification

- Scoped ESLint and the integrated strict check passed on Node24.10.0. Existing tutorial-navigation/build advisory warnings remained.
- All511 automatic prebuild tests passed. The initial Next compilation then failed with local ENOSPC while separate campus builds were active. Only obsolete root-generated cache/build outputs were cleared; source, dependencies, CI artifacts and all retained recovery archives were preserved. Other owners cleaned only their own outputs.
- Next webpack compilation passed on retry, without repeating successful tests. Vinext also passed. No source changes were made to bypass the disk failure.
- Desktop1280×720 and phone390×844 welcome/info checks passed. The card and recording checkbox are absent; there is no horizontal overflow. The plain article opens in a separate tab and its413×598 viewport also has no checkbox/card or overflow.
- The 3D scene loads; closing Project information restores CANVAS focus. Console inspection returned no errors. Viewport overrides, temporary tabs and isolated preview server were cleaned up. No production test review or synthetic production session was created.
- All three runtime-file hashes match the validated snapshot. The snapshot is based on d93828d plus root's three TSX files; other-campus removals were validated by their owners. Final committed-source Linux CI and coordinated live rollout remain separate gates.
- No markup-mirroring tests were added and no physical-device certification is claimed.

## Repository state after implementation commit

Implementation committed as `f88730fdbbfc15ce644800326fa89eb81b71781b` on shared main after Stanford789d375. The index was empty before staging; all16 staged paths were explicit. Other-campus source and pre-existing generated next-env.d.ts were excluded. The implementation and this journal are pushed together; the resulting journal SHA identifies the combined CI candidate. No server action is part of this commit.

## Implementation commits

- `f88730fdbbfc15ce644800326fa89eb81b71781b` — `fix(ubc): remove play privacy panels from all screens`

## Archive commit

`docs: archive UBC privacy panel removal`

## Lessons learned

Interpret “not anywhere” as removal from secondary information screens as well as the landing page. Keep current policy prose consistent with the actual controls. Coordinate a single immutable candidate after all campus owners finish their scoped changes, and avoid overlapping build-output growth on a space-constrained local machine.

## Follow-up

CWRU owns exact-source CI and the guarded coordinated rollout; root verifies live UBC and Stanford verifies its own campus. Production acceptance must confirm the removed UI stays absent on both public hostnames and the shared article.
