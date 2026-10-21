# Prompt 107: Use the owner's selected Motion introduction

- Date: 2026-10-21
- Scope: content
- Goal: Replace Motion's video with the exact official-channel upload selected by the owner and deploy the follow-up.

## Original user request

> use this video instead: https://www.youtube.com/watch?v=nEv9nJO83NM

This corrects the video selection in Prompt 106 and continues its explicit
"And deploy at once" instruction.

## Scope

Change Motion's video ID, corresponding external link and local text poster;
synchronize the current asset/content/testing guidance. Keep the existing
deliberate-load player, product facts, BotSquad channel link and protected routes.

## Decisions

Use the exact requested ID, `nEv9nJO83NM`. YouTube's public oEmbed response confirms
the title "Asymmetri Motion | Every Pitch, Together", author "Asymmetri", and author
URL `https://www.youtube.com/@Asymmetri`. This supersedes the previous
official-channel selection `KM4TESEzXxA`; both publisher and owner's choice are now
verified. Promotional media remains separate from product capability evidence.

## Implementation

The embed and Watch on YouTube fallback use the selected video. The first-party
HTML/CSS poster reads "Every pitch, together." No image download or remote
thumbnail was added. Current guidance and provenance name the same video.

## Engineering impact

Content only: no dependencies, player behavior, CSS, routes, redirects, privacy
terms, app availability, infrastructure or receiver changes. The unchanged player
retains no autoplay, optional loading, privacy notice, external fallback and
close/focus restoration.

## Files changed

- `content/site.ts`: selected video, fallback and matching poster line.
- Asset manifest, content guide and testing guide: current selection and retained
  provenance of the superseded choices.

## Documentation updated

The three directly affected guides remain aligned with the public configuration.
Historical prompt/release records retain their original evidence. Existing
deployment procedures still apply; final operational receipts are retained
privately outside Git.

## Git diff summary

Four files changed, with 18 insertions and 11 deletions. This journal is excluded
from those totals.

## Verification

- Clean `main`; fast-forward synchronization succeeded before editing.
- Exact YouTube publisher metadata verified for the supplied URL.
- Node v24.10.0 matches `.nvmrc`; nvm is unavailable. `npm run check` and
  `npm run build` passed, with the existing tutorial navigation lint warning.
  `npm audit --omit=dev` reported zero vulnerabilities; `git diff --check` passed.
- Production was clean at `41dc0ab`, with sufficient disk headroom. Captured fresh
  service/configuration fingerprints, eighteen public route/domain baselines and
  thirteen shared virtual-host responses. The isolated builder reuses unchanged
  dependencies and the verified production Node/native compiler binaries.
- Linux production checks/build, candidate smoke, actual playback and post-release
  route checks follow this implementation/journal push. Their completion is
  recorded in the private deployment receipt, not presumed by this pre-deploy record.

## Repository state after implementation commit

Clean `main` at `ed05c471841493a514a57bde353343bb988d0629`, one commit ahead of origin
before this journal. Push both commits before the authorized follow-up deployment.

## Implementation commits

- `ed05c471841493a514a57bde353343bb988d0629` — Use the selected Every Pitch Together Motion video

## Archive commit

Record the selected Motion video update journal

## Lessons learned

When the owner supplies an exact official upload, keep its embed, fallback,
poster and maintenance guidance synchronized. Preserve the optional-player
privacy boundary while changing media.

## Follow-up ideas

None scheduled.
