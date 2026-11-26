# Prompt 226 — Bring Court Damage to the waterfront arcade

- Date — November 26, 2026
- Scope — deployment
- Goal — Let a visitor play the existing doubles game through Rematch on the company website.

## Original user request

> @goal
>
> use brave browser

The attached brief requested the full development and deployment cycle for a beautifully art-directed browser edition. The owner authorized scoped branches, PRs, reviewed merges, activation on the established infrastructure, rollback and a live match. The source game, existing app resources and all protected website services must survive the release. The owner keeps the personal playtest and feedback decision. Private attachment details are omitted.

## Scope and decisions

Publish the marquee and launcher at `/court-damage/play`. The original illustrated poster introduces Mercer Yard. Play now begins real download progress, followed by the game's illustrated Let’s Play control. The site supplies keyboard guidance, touch and audio help, fullscreen, orientation, interruption and retry states. The existing game owns rallies, scoring, chaos and Rematch. The support and privacy URLs retain their native-app information and describe Web hosting, local preference and cache behavior.

## Implementation and engineering impact

The server-rendered page and page-specific styling use the shared brand assets. A small client launcher loads the pinned release, scopes input to the canvas, interrupts the game on focus loss and restores play only on Resume. Versioned files receive content-specific MIME, gzip and cache headers. Deployment requires the retained compiled game package alongside the exact website candidate. The browser needs no account, marketing form or new service.

## Files changed and documentation

Changes cover the Court Damage route family, poster, launcher, scoped styles, serving configuration and ignored release directory. The README, architecture, testing, content, deployment and asset documentation explain discovery, integration, verification and provenance.

## Git diff summary

From the website baseline through implementation: 20 files changed, 564 insertions, 16 deletions. Most additions implement the launcher, page design and resource guidance.

## Verification

Brave rendered the desktop, phone and tablet page without horizontal overflow. Local browser play reached a 1–5 result, Rematch and a fresh 0–0 serve. A real loader failure offered Retry and a successful second load. The interruption check captured an unchanged court in a hidden-tab test and restored it through explicit Resume. Emulated touch cancellation, fullscreen, focus navigation, voice-off captions and game audio were exercised. The website check reported zero errors and one existing tutorial warning; all 74 Vancouver checks passed and the production dependency audit returned zero vulnerabilities. The exact Linux candidate, public verification and immediate rollback have separate release receipts.

## Repository state after implementation

Scoped branch `codex/court-damage-web-page` started at `243ec77`. The reviewed game package is provisioned outside website Git. A generated Next development typing file is excluded. The complete implementation before this journal is at `0c47c80`.

## Implementation commits

- `5d2c096` — waterfront page and artifact integration
- `f1269a4` — Unity canvas event target
- `0926b56` — preserve external keyboard focus
- `05479db` — reuse immutable game data
- `0c47c80` — short-landscape viewport framing

## Archive commit

Record the Court Damage Web delivery journal

## Lessons learned

Exercise the compiled game inside the actual launcher early. Its keyboard backend requires a named canvas. Test tab navigation with genuine browser input and verify both compressed transfer bytes and a warm load. Retain the compiled release independently of source and framework build caches.
