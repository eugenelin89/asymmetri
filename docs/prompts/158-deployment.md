# Prompt 158: UBC encounter refinements production release

- Date: 2026-10-31
- Scope: deployment
- Goal: Deploy the tested encounter, crowd, directory and arrival-control fixes with verified recovery.

## Original user request

> ok I am going to bed. you are authorized to make any decision. deploy it right away when you are done.

> can you fix all that looks like duplicates?

> Also, I find that when I jump to a location, I need to grab the scene before I can walk. I think that is a little unintuitive. Do you know what I mean?

The same release includes the preceding requests for selectable conversational
actions and responses, and naturally dispersed campus pedestrians. Journal 157
records implementation decisions and their validation.

## Scope

Release the exact tested website source, verify protected pages and retained public
data, preserve profile persistence and all unrelated services, retain complete
immediate rollback, and record actual deployment evidence. No new campus coverage,
dependency, profile schema, runtime version, proxy or peer-service change.

## Decisions

- Refresh and preserve the concurrent homepage Sports/Labs work. Serialize the
  shared main/server window with Surrey; reserve 157/158 here and 159/160 there.
- Use the existing exact-SHA Linux artifact workflow and independent application-
  owned runtime. Keep the established memory/disk floors and continuous guards.
- Preserve the complete immediate predecessor. Archive two older inactive
  runtimes only after durable local storage and full GNU tar comparison; keep
  checksum-verified copies on both the Mac and server. Record the changed recovery
  form rather than claiming their original directories remain expanded.
- Use read-only public-profile acceptance for this frontend release. Publish no
  test profile and preserve the public community route correction.
- Correct the gallery extensions/dimensions to match actual JPEG bytes, refresh
  the directory from production and the path view from the compiled preview.

## Implementation

Activated source `526213d283cba5e70b192cc295e8ccdd3271467c`, Linux build
`ujW5iepUV_ni0g_OH7ONo`, at 16:51:18 UTC. Both public hosts passed acceptance.
The immediate predecessor is retained at
`/var/www/asymmetri-rollback-before-ubc-v032-encounters-20261031`.
The release receipt records artifact hashes, safeguards, archive identities,
recovery, public/browser evidence and limitations.

## Engineering impact

The deployed client now provides action-and-response encounters, less clustered
pedestrians, one directory result per source building and automatic keyboard focus
after travel. Only the website service was restarted. Five peer services, 56
configuration fingerprints, 13 unrelated virtual hosts, Node and private profile
storage remained intact. This documentation commit changes no runtime behavior.

## Files changed

- Production receipt and deployment guide describe exact release and recovery.
- UBC implementation/project documentation links verified production status.
- Gallery and asset manifest correct format, dimensions and capture provenance.
- Four browser evidence files use JPEG extensions; two captures were refreshed.

## Documentation updated

Deployment, UBC project README, encounter implementation report, asset manifest,
validation gallery and a dedicated production receipt. Historical journal 157
was not rewritten; the receipt explicitly corrects its initial PNG description.

## Git diff summary

Release-documentation implementation commit: 12 files changed, 164 insertions and
14 deletions, plus image replacements/renames. The changes describe completed
deployment and correct engineering evidence; no application or dataset edits.

## Verification

- Previously passed local suites: UBC 53, Vancouver 74, Surrey 54, Richmond 27;
  208 total. TypeScript/ESLint, Vinext/Next builds, dependency audit and diff checks
  passed with one existing unrelated lint warning.
- Linux workflow 41220693298 succeeded; artifact 13050355584 was checksum verified
  locally and after transfer. Candidate source/build matched the reviewed commit.
- Private acceptance passed 17 routes, protected content, 24 tutorial images,
  legacy anchors, native image optimization, 688 Richmond outputs and six UBC assets.
- Public acceptance passed all 17 routes/24 tutorial assets on both hosts and 64
  additional asset/copy/redirect checks. Profile reads and anonymous ownership
  returned expected results with no-store; no profile was changed.
- Production browser showed the single Crescent West result, canvas focus and
  movement/turning immediately after travel, and the action-choice encounter.
  Browser automation became unavailable during the next introduction recheck;
  the complete dialogue sequence was validated locally before release.
- Final health: active/enabled service, zero automatic restarts and zero errors
  after activation; unchanged peers/configuration/Node/profile permissions.
  Available memory 401,452 KiB; free disk 7,004,205,056 bytes. Complete immediate
  rollback and both older runtime archive hashes verified.
- Screenshots inspected; actual JPEG dimensions verified. No physical-device,
  sustained performance or full screen-reader audit claimed.

## Repository state after implementation commit

Main at `f8dba3b`, clean before this journal was created, one documentation commit
ahead of the already-pushed runtime source `526213d`. Push the receipt and this
journal together, then hand the shared release window to Surrey. Later docs-only
commits do not alter the deployed Linux source/build identity.

## Implementation commits

- `797237c` — UBC encounter, crowd, directory and arrival-focus implementation,
  documented separately in journal 157.
- `f8dba3b` — Record verified UBC encounter release and correct screenshot evidence.

## Archive commit

Record UBC encounter production deployment journal

## Lessons learned

Focus restoration from a closing dialog must yield to explicit travel intent.
Source identity, not matching display names, is the reliable directory grouping
key. Browser image bytes must be inspected before assigning an extension or
recording dimensions. Capacity planning should preserve recovery in a documented,
verified form before staging another independent runtime.

## Follow-up ideas

Measure sustained crowd performance and physical-device usability. Improve
architectural and character fidelity through the separately scoped campus roadmap.
