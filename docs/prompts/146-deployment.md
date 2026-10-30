# Prompt 146: Surrey V0.5 live browser acceptance

- Date: 2026-10-30
- Scope: deployment
- Goal: Close the outstanding live visual recheck and preserve truthful device-testing limits.

## Original user request

> Perform an actual browser driving playthrough using normal controls.
>
> Repeat checks in narrow mobile and landscape layouts.
>
> Physical iPhone testing remains necessary. If no physical device is available, report that limitation explicitly rather than claiming it passed.

Continuation of the V0.5 request summarized in journal 144 and the production
release in journal 145. The complete local driving delivery already passed. The
live visual recheck was interrupted by browser connectivity after deployment;
Vancouver's coordination message identified the browser restart and restored
verification access. This receipt completes that remaining browser check.

## Scope

Deployed apex game, ordinary controls, existing site save, responsive views,
console inspection and documentation. No game, infrastructure or runtime change.

## Decisions

Reconnect to a fresh browser tab and verify the actual deployed game. Keep its
origin-specific save separate from the local completed delivery save. Record the
new result without rewriting journals 144 or 145. Vancouver reserved journal 146
for this short main-only receipt window and will use 147 or the next unused ID.

## Implementation

Replaced the outstanding live-browser status in the release receipt and deployment
guide with completed acceptance evidence. Retained physical iPhone/Android testing
as outstanding. Saved live portrait and landscape proof outside Git with the
deployment evidence. Paused the game and restored the normal browser viewport.

## Engineering impact

No behavior, dependency, asset, save-schema or service change. Production remains
source `fcd2b900b512652a94af07571b841e823c61d2de`, Linux build
`VaAKfIoEAK5LbGri4K8V8`. The complete immediate rollback remains
`/var/www/asymmetri-rollback-before-surrey-v05-20261030`. No new deployment occurred.

## Files changed

Two documentation files: Surrey V0.5 release receipt and deployment guide.

## Documentation updated

The release receipt records live control, aerial freeze, save/reload, layout and
console evidence. The guide now links that completed acceptance and retains the
physical-device limitation.

## Git diff summary

2 files changed, 27 insertions and 11 deletions. Superseded the temporary browser
interruption with the verified live result; runtime identities remain unchanged.

## Verification

- By 23:35 UTC, continued the existing apex save, walked to the car and entered.
- Held acceleration moved the car from (20.00, -68.25) to (26.39, -68.25);
  Handbrake stopped it. Held landscape reverse moved it back to (24.99, -68.25),
  followed by a successful stop. Held controls did not scroll the page.
- Aerial Explore froze car pose, speed, elapsed 220.93 and city time 1372.97
  exactly. Street Adventure resumed correctly.
- Reload and Continue retained occupied position (24.99, -68.25), heading 1.571
  and speed 0. All four cases remained available; $20, health 100, stamina 100
  and empty inventory matched this site's save. No save injection or reset.
- Live CSS sizes 390×844, 320×567 and 844×390 showed one canvas, contained
  controls and no horizontal overflow. Screenshots retained outside Git.
- No page console errors; observed warnings originated in a browser extension.
- Viewport reset confirmed at 1800×915. Game paused before ending verification.
- `git diff --check` passes. No tests/builds repeated for documentation-only
  changes; the deployed candidate's 147 tests and build evidence remain in the
  release receipt. The full delivery was completed locally, not repeated live.
- Physical iPhone/Android, thermal and real multi-touch acceptance remain open.

## Repository state after implementation commit

Isolated branch `codex/surrey-adventure-v05`, commit
`57827edfe9bc41994aa9135b3860fd734c0933ee`; working tree clean before this journal.
Approved remote main was `1ce3b1e5f518d219d461ae6952927270a7f85f2c`.
The receipt and this separate archive are pushed together without rewriting history.
The brief main window then returns to coordinated city development.

## Implementation commits

- `866f2feed06a83016707e46bcc89b2a08136259b` — Surrey driving implementation.
- `2f00a769b783834f21458abdd31ae9e6a995f754` — Record Surrey V0.5 production release and complete Richmond rollback.
- `57827edfe9bc41994aa9135b3860fd734c0933ee` — Record Surrey V0.5 live browser acceptance.

## Archive commit

`Archive Surrey V0.5 live browser acceptance`

## Lessons learned

Keep local full-mission, deployed browser and physical-device acceptance distinct.
A browser restart can invalidate automation handles without indicating a game
failure. Reconnect and record observed results instead of leaving a resolved
verification gap in the current release guide.
