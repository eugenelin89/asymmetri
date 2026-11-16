# Prompt 221: Shorten the My Music page

- Date: 2026-11-15 (Vancouver; November 16 UTC)
- Scope: content and deployment
- Goal: Remove the requested extended help and data-handling paragraphs.

## Original user request

> Remove:"Add ?folder= followed by the URL-encoded folder link to this page’s address to load it automatically. After loading, copy this page’s address to share the folder. Shared folder links try to start playback automatically; press Play if your browser blocks it. Use Shuffle for a random order. Repeat cycles through Off, 1 track, and All tracks. Format support depends on your browser."
> "Your queue stays in this tab. Asymmetri reads public folder listings and streams audio from Google without saving the music or connecting to your Google account. Folder links in the page address may appear in browser history and server request logs; logs may also include streamed file identifiers."

## Scope

Remove exactly the requested player copy, retaining the public-folder sharing requirement. Continue the already authorized immediate deployment workflow.

## Decisions

Keep the short sharing requirement associated with the URL field. Remove the data-handling element and its unused content property. Remove the now-stale OpenMP3 privacy-page sentence claiming that the browser player displays its own notice; native policy scope remains explicit and unchanged. Folder sharing/autoplay and all controls remain intact.

## Implementation

Centralized copy shortened and one paragraph removed from the player. Content Guide reflects the intentionally minimal page.

## Engineering impact

Copy/markup only; no interaction, endpoint, route, dependency, asset or data-handling changes.

## Files changed

My Music player and content, one stale reference in OpenMP3 privacy, and Content Guide.

## Documentation updated

Content Guide describes the short help and omitted paragraphs. Existing architecture/development docs retain the technical behavior for maintainers.

## Git diff summary

4 files changed, 8 insertions and 10 deletions.

## Verification

Exact text/reference checks and whitespace validation passed. Existing feature checks are recorded in prompts 219–220. No extra local suite or dependency installation for this copy-only change; the exact-source Linux pipeline supplies TypeScript, ESLint, production audit and build gates before activation. Public rendered-text checks and cleanup follow deployment.

## Repository state after implementation commit

Main at `7596007`, clean before this journal. The prior combined release is live at source `a2080a4`, build `sJUaqd9JvJTL_VHz-vUbr`.

## Implementation commits

- `7596007` Shorten My Music help and remove the data-handling paragraph

## Archive commit

Record My Music copy simplification preparation

## Lessons learned

When removing a notice, also remove statements elsewhere that claim the notice is displayed.

## Follow-up ideas

Complete the authorized release with independent rollback and measured cleanup.

## Final readiness and approval blocker

The exact-source Linux workflow for preparation `bf1b35e` passed. The requested
copy changes are not live: automatic review rejected archival/duplicate retirement
of older recovery directories pending explicit owner approval. No retention script
ran and no recovery files were changed. A post-attempt read-only audit verified
live/rollback/peer health; zero bytes were reclaimed during this follow-up. Exact
storage inventory remains private because public issue publication of those details
was separately rejected; a sanitized issue status was accepted.

Additional documentation commit `2d09940` — Record copy release readiness and
pending storage approval (2 files changed, 52 insertions). See the
[readiness note](../MYMUSIC_COPY_RELEASE_READINESS_2026-11-16.md) for validation,
public/private evidence boundaries and the remaining authorized release sequence.
The serving website remains the successful earlier sharing/autoplay release.

Final archive commit message: `Record final copy status and coordinated submission outcome`.
Main was clean after the readiness commit before this archive update.
