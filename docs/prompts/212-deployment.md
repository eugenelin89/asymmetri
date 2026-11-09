# Prompt 212 — Deploy a different Christmas soundtrack for each school

- Date: 2026-11-09 UTC
- Scope: deployment
- Goal: Make the approved Stanford and CWRU arrangements available to test on the live site while preserving UBC’s soundtrack.

## Original user request

> deploy

## Decisions and implementation

Deployed the previously approved campus recordings at the pinned Linux build for `2207425`. Stanford gets “Jingle Bells”, CWRU gets “Rudolph the Red-Nosed Reindeer” and UBC keeps “Winter Wonderland”. There were no application or dependency edits in the deployment turn. The stage received the two licensed recordings separately; their project-public fingerprints and the Git-tracked Stanford master matched the approved previews.

## Engineering impact, verification and recovery

The active production tree and immediate rollback are independent. Before staging, a full older inactive rollback was archived to durable owner-only storage, synced and checked against its server-side SHA and byte count. Gzip integrity, full server-side GNU tar comparison and renewed identity/inactivity checks passed before only that duplicate was retired.

The new independent candidate passed the applicable exact-source CI and private startup checks. Six public browser visits verified the correct audio bytes, a running loop with nonzero samples on entry, and stop on leaving Christmas. Protected routes and assets, private stores, configuration and peer services passed both the activation and cleanup checks. The preceding release booted separately. The [release receipt](../CAMPUS_CAROLS_RELEASE_2026-11-09.md) records build and rollback identities, all cleanup categories, measured bytes and before/after space, retained recovery assets and the existing custody follow-up.

## Files, documentation and Git diff summary

The README links the live track assignments. The deployment guide identifies the serving build and rollback, and the release receipt preserves release and recovery evidence. Three files changed, with 37 insertions and two deletions. No application code changed; only the already tested source was deployed.

## Repository state after implementation commit

Clean canonical `main` was one commit ahead of `origin/main` after the receipt commit; the remote previously pointed at the deployed source. The separate journal and interaction log are included in the archive commit. The absent historical worktree registration was not touched.

## Implementation commits

- `34b08c7a5572c4331e80ba87f7e13b9735e8ffc0` — Record the verified three-campus soundtrack deployment

## Archive commit

`Journal 212 — record the live campus soundtracks`
