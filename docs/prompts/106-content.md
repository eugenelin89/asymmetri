# Prompt 106: Use only the official Asymmetri YouTube channel

- Date: 2026-10-21
- Scope: content
- Goal: Replace off-channel website videos with verified official-channel media and deploy the accepted result.

## Original user request

> Make sure the embedded youtube videos come from this channel: https://www.youtube.com/@Asymmetri
> And deploy at once.

## Scope

Review every configured website embed and fallback link, update product pages and
affected documentation, validate locally and deploy through the existing guarded
DigitalOcean procedure. No YouTube account, upload, private receiver or infrastructure
change is needed.

## Decisions

YouTube oEmbed reports both previous video IDs (`E5r_lOecC-M` and `kaSatKC8HBg`)
under the personal channel `@christopherlinbaseball`. The requested official channel
showed three Motion videos, with no visible BotSquad introduction. The replacement
`KM4TESEzXxA` is titled "Asymmetri Motion | See Your Pitch More Clearly"; its public
publisher metadata reports "Asymmetri" and the exact requested channel URL.

Use that matching Motion introduction. Remove the off-channel BotSquad player and
fallback rather than inventing a corresponding official upload or substituting a
Motion video. Preserve `#introduction-video` as an official-channel section and
make its hero link accurately describe the destination.

## Implementation

Centralized the channel URL and link copy in `youtubeChannel`. Motion's embed and
external fallback now use the verified official upload. BotSquad renders a plain
channel link with its historical anchor intact. The privacy page's website-media
sentence now correctly names Motion as the page with a player; data-handling terms
and the policy's effective date are unchanged.

## Engineering impact

No dependencies, local media bytes, styles, routes, redirects or player mechanics
changed. The existing click-to-load privacy boundary, no autoplay, accessible title,
origin referrer, external fallback and close/focus behavior remain. BotSquad no
longer loads a third-party player. Product availability claims remain unchanged.

## Files changed

- Shared content and BotSquad composition: official Motion video, centralized
  channel, preserved section and truthful website-media coverage.
- README, architecture, content, local-development and testing guidance: current
  embed scope and official-publisher verification requirement.
- Asset manifest: provenance, replaced/removed IDs, observed official alternatives,
  selection reasoning and unchanged local assets/rights.

## Documentation updated

Current instructions now require publisher verification against `@Asymmetri`.
Historical prompt/release records retain their original evidence. The prior
deployment's production Node binary, native packages, resource guards and rollback
procedure remain applicable; a fresh production baseline was captured for this
release. Final operational receipts are retained privately outside Git.

## Git diff summary

Eight files changed, with 66 insertions and 34 deletions. This record is excluded
from those totals.

## Verification

- Clean local `main`; `git pull --ff-only origin main` succeeded before editing.
- Inspected the actual official channel and independently checked YouTube oEmbed
  publisher metadata for both previous IDs and the two official full-length Motion
  uploads. Search indexing did not provide usable evidence; channel UI and public
  metadata supplied the verification.
- Node v24.10.0 matches `.nvmrc`; nvm is unavailable. `npm run check` and
  `npm run build` passed. One existing tutorial navigation lint warning remains.
  `npm audit --omit=dev` passed with zero vulnerabilities after registry access was
  enabled; the initial sandboxed audit could not resolve the registry.
- Browser: before Load, no iframe or remote YouTube/Google media resource element;
  after Load, exactly `youtube-nocookie.com/embed/KM4TESEzXxA` with the existing
  title/referrer/permissions; Close removes the iframe and restores button focus.
  The normal fallback points to the same official video. No native playback claim
  is inferred from the parent iframe checks.
- BotSquad at 390/768/1440 px: correct official channel, no iframe, no old video
  links, no horizontal overflow and no browser console errors. Its legacy section
  remains reachable. The temporary preview was stopped and browser overrides reset.
- Runtime source scans found neither retired video ID in application/content files.
  No private source information, new athlete media or unrelated changes were added.
- `git diff --check` passed. Linux production checks/build, candidate smoke and live
  verification follow the required implementation/journal push and precede final
  deployment acceptance; they are not claimed complete by this pre-deploy record.

## Repository state after implementation commit

Clean `main` at `8726aa2712094f16003c6c23efdbf5f5ef67e4c1`, one commit ahead of origin
before this journal. Production was still clean at `d910b33` during preflight.
Both commits are pushed before the authorized production activation.

## Implementation commits

- `8726aa2712094f16003c6c23efdbf5f5ef67e4c1` — Use only the official Asymmetri YouTube channel

## Archive commit

Record the official YouTube channel update journal

## Lessons learned

An owner-selected video title does not establish its publisher. Verify both the
video ID and channel identity, and keep fallback links synchronized. An absent
matching upload should not become an unrelated embedded product video.

## Follow-up ideas

If an official BotSquad introduction is supplied later, verify its publisher and
restore the existing deliberate-load player at the retained anchor. None scheduled.
