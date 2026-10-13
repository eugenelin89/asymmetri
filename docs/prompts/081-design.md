# Prompt 081: Investment employee portraits

- Date: 2026-10-13
- Scope: design
- Goal: Show the existing employee portraits in Investment team cards.

## Original user request

> make sure the images of the employees are in there.

The screenshot showed Atlas and Maya cards displaying initials. The owner's
standing instruction authorizes direct commits and production deployment.

## Scope

Reuse two approved illustrations in the existing roster cards. No new artwork,
identity, activity claim, employee role, financial record or receiver change.

## Decisions

Bind portraits to exact already-published worker IDs, not names. Share the existing
Atlas/Maya image objects with the overview. Keep initials for unknown IDs and use
an own-property lookup so prototype-like IDs cannot select an image accidentally.

## Implementation

Next.js Image renders each mapped portrait at 96×96 CSS pixels with reserved
intrinsic dimensions, responsive source selection and existing illustrated-worker
alt text. Portraits use the existing card style and local optimized images.

## Engineering impact

No new dependencies, files in public, external hotlinks, extra scripts or animation.
The signed roster still determines names, roles and availability; artwork grants
no authority and does not imply recorded activity. Existing URL/navigation behavior
is unchanged.

## Files changed

Investment card composition and CSS, centralized portrait mappings, asset manifest
and content editing guide.

## Documentation updated

Asset provenance, dimensions, unchanged rights assessment, public role and alt text
are documented as reuse. The content guide explains exact-identity mapping and
unknown-worker fallback.

## Git diff summary

Five files changed, 39 insertions, four deletions. The two asset byte streams are
unchanged; shared content objects replace duplicated inline portrait metadata.

## Verification

Node24.10.0 matches .nvmrc; nvm is unavailable. TypeScript/ESLint, Next webpack,
Vinext and all six investment checks passed. The first investment test attempt
hit the sandbox's loopback-listen restriction; the approved rerun passed. Existing
tutorial lint warning remains. Dependencies are unchanged and the preceding
release's production audit was zero. Six-width browser geometry checks found no
overflow; desktop/mobile screenshots verified both portraits loaded at96px with
meaningful alt text and no console error. Layout used the existing public roster
through a temporary read-only HTTPS preview adapter. The deployment SSH account
rejects forwarding, so its attempted tunnel was closed without changing access
settings. Preview processes and temporary viewport overrides were stopped/reset.
Git diff whitespace check passed. Production acceptance will be recorded separately.

## Repository state after implementation commit

Main at c83f3cb9464f543cab9b3bba5e175ae1aaa71e86; only intended portrait changes committed. Implementation and
journal will be pushed together before deployment.

## Implementation commits

- c83f3cb9464f543cab9b3bba5e175ae1aaa71e86 — Show employee portraits on investment team cards.

## Archive commit

Record investment portrait journal

## Lessons learned

Reuse approved identity assets by stable public identity while keeping unknown
roster identities useful with initials. Avoid assigning faces by display-name match.

## Follow-up ideas

Add future employee portraits only with verified identity and approved artwork.
