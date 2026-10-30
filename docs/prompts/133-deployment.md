# Prompt 133: Deploy the simplified Labs submenu

- Date: 2026-10-30
- Scope: deployment
- Goal: Publish the Labs menu correction while preserving every BotSquad destination.

## Original user request

> BotSquad Research, BotSquad Trade, and Ask BotSquad should be removed from sub-menu as they should be just under BotSquad

Earlier authorization in this chat:

> Please deploy it and verify that the existing Vancouver and Surrey links still work.

## Scope

Complete the deployment for journal 132’s menu correction. Preserve BotSquad’s
internal hierarchy and navigation, GIS city names/URLs and protected Motion pages.

## Decisions

Use the exact-source Linux workflow and established copy-only build swap because
route/component files, public assets, dependencies and runtime configuration are
unchanged. Keep the previous build for recovery and advance clean main only by
fast-forward. Serialize shared-file/main/server work with the Greater Vancouver
GTA city chats. No city feature deployment or receiver operation is included.

## Implementation

Activated source `17a24b4bc2568a40973de2fd2a8fdd497d7a9ea2`, build
`Njs40iFKI-ZTrJ7cLD-h9`, at 19:42:02 UTC / 12:42:02 PDT. The live Labs menu has
Asymmetri Labs, BotSquad and GIS Apps. BotSquad retains its Research, Trade and
Ask links and pages. Added a release receipt, updated the deployment pointer and
clarified one remaining current-guide reference to BotSquad area labels.

## Engineering impact

Only the website service restarted. Source/build and artifact identity, guarded
resource measurements, public comparisons and recovery locations are recorded.
Prior builds remain intact. No Node, proxy, DNS, receiver, Ask-intake, gameplay,
public asset, save, dependency, URL or privacy change occurred.

## Files changed

Release receipt, deployment guide’s current-release pointer and a content-guide
sentence distinguishing BotSquad area labels from global navigation.

## Documentation updated

The receipt records exact source/build identity, acceptance and copy-only recovery.
It distinguishes deployed source from subsequent documentation-only commits.

## Git diff summary

Release documentation: three files changed, 89 insertions and four deletions.
Earlier implementation: three files changed, seven insertions and seven deletions,
as recorded in journal 132.

## Verification

- Exact-source Linux run 41116705197 succeeded; downloaded artifact 13006352318
  matches its published digest and embedded source/runtime identity.
- Local and Linux checks/builds passed, including Surrey build prerequisites and
  Linux Vancouver tests. Production dependency audit: zero vulnerabilities.
- Guarded preparation, transfer and private smoke checks passed above the 192 MiB
  memory and 6 GiB disk floors. No live or linked dependency install/build occurred.
- Public apex/www checks: 24 pages, 68 unchanged asset hashes and six preserved
  redirects, including a legacy Trade path/query. Page main text and IDs match the
  baseline; canonical/sitemap and protected Motion continuity hold.
- Live browser verified Labs → BotSquad and all three area links. Local responsive,
  keyboard and console checks passed. Existing city names and destinations remain.
- Final production: clean main and expected build, active/running, zero restarts
  and zero service errors. Five peer services, 13 unrelated vhost responses,
  55 config fingerprints and Node executable unchanged.
- Final capacity: 404148 KiB available memory; 6885584896 bytes free disk.
- `git diff --check` passed. Receipt-only edits require no second activation.

## Repository state after implementation commit

Clean main, one release-documentation commit ahead of origin. This journal and
receipt will be pushed together; production remains on the verified source/build.
No unrelated work is included.

## Implementation commits

- `eff2c72` — Keep BotSquad areas within BotSquad navigation (journal 132).
- `55636798098f6bbfda5a15a2a3f49722bd9be9a0` — Record deployed Labs menu and preserved BotSquad links.

## Archive commit

`Record Labs menu deployment engineering journal`

## Lessons learned

Validate the absent global shortcuts and the retained internal links separately.
A menu simplification should leave public destinations, context and hierarchy intact.

## Follow-up ideas

None for this request. Separately authorized city feature releases retain their
own integration, capacity and complete-runtime deployment requirements.
