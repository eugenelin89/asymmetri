# Prompt 110: Display the Motion video directly

- Date: 2026-10-22
- Scope: design
- Goal: Show the native Motion video preview and player without the custom Load video gate.

## Original user request

> for https://www.asymmetri.co/motion, rather than show "Load Video", can it display the video ?

The supplied screenshot showed the existing teal typographic poster and Load
video button. It was visual context, with no additional instructions.

## Scope

Update the Motion introduction component, its obsolete styles and the disclosure
of when the player connects. Preserve the selected video, playback choice,
product claims, protected Motion routes and existing deployment workflow. No
deployment, dependency update or public media replacement was requested.

## Decisions

- Render the approved `nEv9nJO83NM` privacy-enhanced YouTube iframe directly in
  server HTML. The native thumbnail and Play control replace the custom poster.
- Keep autoplay disabled, the origin referrer policy, fullscreen support and
  external Watch on YouTube fallback. Loading no longer moves keyboard focus.
- Remove the client loading/error/close state and unused poster/button CSS.
  Cross-origin failures still have an always-visible external fallback.
- Update the nearby notice and website-media policy to acknowledge Google
  requests on page load, before Play. Advance the policy date to October 22 and
  retain historical updates and app, TestFlight and support commitments.
- Follow the repository's explicit-release rule; this is a source change only.

## Implementation

`IntroductionVideo` is now a server component with a responsive 16:9 iframe.
The approved video ID, source link and introduction copy remain centralized.
The retired poster's unused text field and styles were removed. Documentation
now describes direct loading and the updated privacy boundary.

## Engineering impact

The custom activation step and client JavaScript state are removed. The player
can connect to Google when the page opens; playback remains user-initiated.
Native player accessibility, visible link focus and the fallback are retained.
There are no new dependencies, site storage, APIs or server state. Public asset
bytes and package manifests/lockfile are unchanged.

## Files changed

- Introduction component and global CSS: direct iframe and removal of obsolete
  poster/load/close presentation.
- Central content: current media disclosure, policy date/history and retirement
  of the unused poster line.
- README and seven documentation guides: rendering architecture, media inventory,
  content/privacy truth, local verification, regression checks and visual rules.

## Documentation updated

Updated README, Architecture, Asset Manifest, Content Guide, Local Development,
Testing, Visual Identity and Website Privacy Audit. Historical prompt journals
and dated rollout records retain their original evidence.

## Git diff summary

Implementation: 11 files changed, 86 insertions and 202 deletions. Most removed
lines are the obsolete client loading gate and its CSS. Additions explain the
direct player and corresponding disclosure; no binary assets changed.

## Verification

- Started on clean `main`; fast-forward pull succeeded with no new commits.
- nvm was unavailable at its standard path. Active Node v24.10.0 matches `.nvmrc`
  major 24; no dependency installation was needed.
- `npm run check` passed, with the existing tutorial-reader internal-navigation
  lint warning and no errors.
- `npm run build` passed. Default `npm run build:next` hit the documented
  Turbopack local-process/socket permission error, including its elevated retry.
  The documented `npm run build:next -- --webpack` fallback passed.
- `npm audit --omit=dev` completed after a network-enabled retry and reported
  one critical Next.js dependency finding covering three advisories. Dependencies
  are unchanged; this task does not resolve or claim a clean security audit.
- Local production preview served `/motion`, `/privacy`, `/support`, `/tutorial`
  and `/botsquad` with HTTP 200. Protected footer links, image alt attributes,
  exact tutorial www canonical, policy date/disclosure, approved iframe ID and
  external fallback passed targeted HTML checks. BotSquad has no iframe.
- Initial server HTML contains the iframe without a Load/Close gate and without
  requiring site JavaScript. The frame grants no autoplay permission or parameter.
- Browser checks at actual 320, 390, 768, 1024, 1440 and 1920 CSS-pixel widths
  found no horizontal overflow and retained the 16:9 frame. Browser viewport
  settings were adjusted for the host's existing display scaling.
- The native thumbnail and Play control appeared without activation. Clicking
  Play produced advancing playback; Pause was available. Page loading left
  focus on the body. Keyboard navigation between disclosure links showed a
  visible teal focus outline. Browser console inspection returned no errors.
- Cross-origin keyboard-control automation could not reliably target YouTube's
  changing controls; playback was verified through its native accessible click
  controls. Provider-blocked and fully script-disabled browser scenarios were
  not separately emulated. Their fallback is a permanent server-rendered anchor.
- Reduced-motion CSS is unchanged; the component adds no animation or autoplay.
- Added public copy passed credential, private-identifier and obsolete-brand
  scans, plus manual privacy/product-claim review. No public asset or dependency
  file changed. `git diff --check` passed.

## Repository state after implementation commit

`main` was clean at `6ddf39d3293c65f07f5f5697ecc4c4761624d8db`, one commit ahead
of `origin/main`. The journal is committed separately, followed by the required
push. No branch, worktree, pull request, hosted preview or deployment was created.

## Implementation commits

- `6ddf39d3293c65f07f5f5697ecc4c4761624d8db` — Display Motion introduction video directly

## Archive commit

`Document direct Motion video implementation`

## Lessons learned

Removing a player-loading gate also changes the timing of third-party requests.
Keep visible notices, policy wording and regression instructions aligned with
the actual behavior. Rendering the iframe directly also avoids unnecessary
client state and focus movement.

## Follow-up ideas

Deployment requires a separate explicit request. The Next.js audit finding
requires a separate scoped dependency review and validation.
