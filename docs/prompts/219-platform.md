# Prompt 219: Shareable My Music folders

- Date: 2026-11-15 (Vancouver; November 16 UTC)
- Scope: platform and deployment
- Goal: Load a Drive folder from the address and update that address after manual loading.

## Original user request

> for asymmetri.co/mymusic, if include folder URL as part of a parameter, the page will load the folder automatically.

> no need to test too rigorously. just check basic cases and commit and deploy at once.

> when loading a folder by pasting into the UI, once the folder is loaded, the page URL should include the folder URL as a parameter so I can easily share that URL with others. Again, no need to rigoursly test. Deploy at once.

## Scope

My Music folder loading and sharing. Explicit immediate deployment requested, with focused functional checks. Existing source, including separately prepared OpenMP3 resources, is preserved. No branches, worktrees or PRs.

## Decisions

Use `folder` containing the encoded complete Drive folder URL. Reuse manual validation and cancellable recursive scanning. On successful completion, replace the address without navigation or a new history entry, retaining unrelated parameters and fragment. Resource keys stay inside the encoded folder URL. Invalid, failed and cancelled loads do not replace the previous shareable address. Audio still waits for Play.

## Implementation

Shared callback serves mount-time and form-triggered loading; mount setup is deferred with cancellable cleanup. Abort is checked before publishing scan results or the address. Centralized instructions and privacy copy describe automatic loading, sharing and URL visibility in history/logs.

## Engineering impact

Client behavior only; no dependency, server endpoint, account, storage or asset additions. Existing validation and public-folder sharing requirements remain.

## Files changed

Player component, centralized site copy and architecture/content/local-development/testing guides.

## Documentation updated

Guides specify query syntax, successful-load address replacement, error behavior and focused acceptance cases.

## Git diff summary

Implementation: 6 files changed, 55 insertions and 11 deletions.

## Verification

Node 24.10.0 matches `.nvmrc`; nvm is unavailable. TypeScript and ESLint passed with one existing tutorial warning. Eight existing music regressions, Next webpack build, Vinext build, production audit (zero vulnerabilities) and whitespace checks passed. Basic browser acceptance against a disposable synthetic folder fixture verified manual loading, address replacement, nested resource-key preservation, unrelated parameters/fragment, automatic reload without autoplay, missing-parameter manual entry, invalid links and failed-load address preservation. No private music data was used. The existing Linux build workflow remains the production artifact path; broad local regression testing was not repeated.

## Storage and deployment preparation

Opening local free space: 46,211,878,912 bytes (df). Initial du estimates: dependencies 808,808,448 bytes, Next output 52,232,192 bytes and Vinext output 133,799,936 bytes. One canonical checkout. These remain active during validation. Opening production free space: 7,034,249,216 bytes. A separately authorized OpenMP3 release is using the same host; live changes wait for a safe release handoff. Final activation, rollback and cleanup evidence will be recorded in the release receipt.

## Repository state after implementation commit

Main at `d2666a0`, clean implementation state before this journal. Push and deployment pending coordinated release availability.

## Implementation commits

- `d2666a0` Add shareable folder links to My Music

## Archive commit

Record My Music folder sharing preparation

## Lessons learned

Encoding the entire nested URL preserves Drive query parameters. Updating history only after a successful scan avoids sharing a failed or cancelled replacement folder.

## Follow-up ideas

None beyond the requested deployment and release receipt.

## Completed combined release

The owner explicitly authorized coordinating both website chats. Final source
`a2080a4d99cae617fe3dab3cdea5d5c67bdf19d1`, build `sJUaqd9JvJTL_VHz-vUbr`, was
activated at 2026-11-16T04:50:52Z. The final Linux workflow passed. Private and
apex/www checks preserved existing protected routes, 803 prior assets, 62 config
fingerprints, 15 peers and five stores. The complete `e476ee0` predecessor passed
independent startup. OpenMP3's three pages and sole existing-page entry were
preserved. Live browser checks verified query handling and the OpenMP3 page at
390px with no overflow and its icon loaded.

[Release and cleanup receipt](../MYMUSIC_SHARING_RELEASE_2026-11-16.md) documents
exact identities, retained older archives, guard floors, before/after free space,
du estimates, cleanup eligibility and final health. Measured cleanup recovered
1,533,739,008 bytes locally and 386,486,272 bytes on the server. No new blockers;
source, public assets, private configuration/data, evidence and complete immediate
rollback remain. No deployment or retention safeguard was weakened.

Additional implementation/documentation commit: `4a24984` — Record combined My
Music and OpenMP3 release (2 files changed, 150 insertions and 1 deletion).
Main was clean after that receipt commit and before the final journal/log update.
Final archive commit message: `Finalize music sharing journals and interaction log`.
The initial sharing behavior's Play requirement was superseded by the explicitly
requested autoplay follow-up documented in prompt 220.
