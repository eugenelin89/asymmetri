# Prompt 156: Deploy homepage division links

- Date: 2026-10-31
- Scope: deployment
- Goal: Publish the Sports/Labs homepage correction with existing URLs intact.

## Original user request

> on the home page, under each Sports and Labs, should just link to the page, not have Motion or BotSquad because there are more projects under each than just Motion or BotSquad now.

The earlier explicit request to deploy and verify existing city links continues to
apply to this website follow-up. The screenshot supplied visual context only.

## Scope

Deploy journal 155’s homepage action/metadata change, preserve all existing
product/city/UBC pages and record exact acceptance and recovery evidence.

## Decisions

Use the established copy-only deployment because the only runtime changes are
homepage presentation/copy. App routes, other components, public assets, package
lockfile and runtime configuration are identical to the serving UBC V0.3 source.
Use the successful exact-source Linux artifact, preserved prior build and existing
Node 22 approval. Coordinate the main/server window with Greater Vancouver GTA;
do not incorporate isolated, unaccepted city candidates or UBC work in progress.

## Implementation

Activated source `5eb3c8abf2b34b33ab9af298933bcb7174c81a82`, build
`fZHe4ybZDxYLvvS2CwwLm`, at 16:30:04 UTC / 09:30:04 PDT. Both card headings and
actions lead to their division page. Product access elsewhere is retained.
Added the release receipt and updated the deployment guide’s current-runtime
pointer, preserving earlier UBC release history.

## Engineering impact

Only the website restarted. No URL, asset, dependency, city gameplay, community
store, backend, Node, proxy, DNS or peer-service change occurred. The previous
`.next` remains available for application-owned recovery; clean main advanced by
fast-forward. No private input screenshot, credential or profile data was archived.

## Files changed

Homepage release receipt and the deployment guide’s current-release pointer.
The earlier component/content/guidance edits are recorded in journal 155.

## Documentation updated

The receipt separates running source/build from later documentation commits and
records guarded acceptance, the sitemap-check correction and copy-only rollback.

## Git diff summary

Release documentation: two files changed, 94 insertions and one deletion.
Earlier implementation: five files changed, 14 insertions and seven deletions.

## Verification

- Local code checks, both builds, 125 city/UBC prerequisites and audit passed;
  production dependencies have zero known vulnerabilities.
- Exact-source Linux run 41219314652 passed all checks, Vancouver tests, audit
  and standard Next build with the existing prebuild gates. Artifact 13049048287
  matches its published ZIP digest, runtime checksum and embedded source/build.
- Guarded preparation and transfer passed; only verified Linux build files moved.
- First private smoke stopped on a generated sitemap timestamp comparison before
  activation. Unchanged sitemap source confirms `lastModified: new Date()`; the
  comparison now checks every entry/value except that timestamp. Full guarded
  repeat passed; first-failure evidence remains outside Git.
- Private: 17 routes, eight protected-host checks and 735 assets. All main text,
  IDs and canonicals preserved after intended homepage label substitutions.
- Public apex/www: 32 pages, 100 asset/hash checks and six legacy redirects.
  Same-suffix Trade query compatibility, city URLs and Motion continuity passed.
- Local 320/768/1440 CSS-pixel checks and live click-through verified card labels,
  correct destinations, preserved product links and new homepage metadata. No
  horizontal overflow, clipped cards or console errors; keyboard focus is visible.
- Final clean production source/build, active/running service, zero restarts and
  service errors; five peer services, 13 unrelated vhost responses, 56 config
  fingerprints and Node executable unchanged. UBC community store untouched.
- Successful smoke minimum: 211236 KiB available RAM and 6709993472 free bytes;
  final health: 339444 KiB and 6709268480 bytes, above 192 MiB / 6 GiB floors.
- `git diff --check` passed. Docs-only receipt commits need no second deployment.

## Repository state after implementation commit

Clean main, one release-documentation commit ahead of origin. Push the receipt
and this journal together; runtime remains the verified source/build above.
No unrelated user work is included.

## Implementation commits

- `faa3768` — Link homepage cards to their Sports and Labs divisions (journal 155).
- `1fc1ee5f49690df853e9d08ed0ab1005ee88ccc0` — Record deployed homepage division links and continuity checks.

## Archive commit

`Record homepage division-link deployment journal`

## Lessons learned

Check navigation targets independently of URL identity. Compare sitemap entries
while allowing their documented generated timestamps to change between builds.

## Follow-up ideas

None for this request. Independent city releases retain their own acceptance,
integration and complete-runtime/capacity requirements.
