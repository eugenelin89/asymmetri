# CWRU running controls — October 31, 2026

The player could already run, but the previous nine-pixel movement hint made that difficult to discover. The owner asked for clearer instructions and specifically larger words.

## Change

- Both welcome editions now show a prominent “Want to move faster?” card, a Shift/WASD key combination, and instructions to hold Run with a movement arrow on touch screens.
- The desktop walking hint emphasizes “Hold Shift to run” at 17px instead of the previous 9px line. A dark opaque background and highlighted keycap improve contrast. Camera controls and interaction prompts have additional clearance from the taller hint.
- The mobile Run button uses a light contrasting background, an 18px RUN label and 88px target width. Its accessible name explains that the player must hold it together with a movement arrow.
- Help gives Run a separate entry, including release-to-walk behavior. Welcome panels have enough height for the larger instructions.

This changes presentation and wording only. Movement speed, held-key/pointer behavior, collisions, themes, profiles and other campuses are unchanged.

## Validation and status

Node 24.10.0 matches `.nvmrc`. `npm run check` passed TypeScript and ESLint with only the existing tutorial-navigation warning. Browser validation used an isolated CWRU export at `127.0.0.1:3031`: 1280×720 desktop, 820×1180 tablet and 390×844 phone emulation. The instruction sizes were verified from rendered styles; the mobile Run target measured 88px. No horizontal overflow occurred at the checked widths. Regular welcome content remained above its footer, and the desktop camera dock cleared the taller status strip. Help displayed the separate Run instructions and closing it restored CANVAS focus. Final browser console errors were empty. Viewport emulation was reset.

Both the Vinext/Cloudflare build and standard Next webpack build passed with the final CSS. `npm audit --omit=dev` reported zero vulnerabilities; `git diff --check` passed. No new unit tests are needed for this copy/style-only change; held-input logic was not altered. This is local validation, not physical-device performance certification.

The running instructions are verified live in source `b3601b3`, build `xMZDEUQlNPy6b48OwpOC3`, activated November 1 at 00:28:14 UTC (October 31 in Vancouver). Live desktop and phone checks reconfirmed 17px desktop text, 18px RUN text and the 88px touch target. See the [production receipt](CWRU_COMMUNITY_RELEASE_2026-10-31.md). Journal 179 retains the scoped implementation record.
