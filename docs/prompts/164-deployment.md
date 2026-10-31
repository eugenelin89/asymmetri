# Prompt 164: Release natural UBC character dialogue

- Date: 2026-10-31
- Scope: deployment
- Goal: Deploy and verify natural character conversations while preserving the shared website.

## Original user request

> For all the characters the interactions need to be more natural .

The preceding message requested a brief first-person introduction such as Mitch
Hodge identifying himself as a UBC Baseball coach, without verification or model
notes in his answer. Standing owner instructions authorize independent decisions
and deployment after completion. Journal 163 records the implementation.

## Scope

Exact Linux build, private candidate acceptance, production activation, fresh
browser acceptance, retained recovery runtime and release documentation. No new
geography, character population, public data, dependency or profile-storage change.

## Decisions

Waited for the completed Surrey handoff, integrated main without conflicts and
built the exact reviewed source. Kept the existing Node 22 binary and resource
floors. Retained the entire immediate runtime for rollback. One older inactive
runtime was converted to two checksum-verified archives before its expanded copy
was retired, using the established lossless retention procedure.

## Implementation

Activated source `f3e5a9fd530ca3acd28f9f8200d6668e79c03273`, build
`UvDOiPq9Ko5YmOkq4aC66`, at 18:31:51 UTC. Both public hosts and a fresh browser
session verified the release. Updated screenshots show the actual live short
introduction, with source/simulation metadata available only on request.

## Engineering impact

All 976 static character records and participant-profile introductions use the
shared natural conversation flow. Participant-written answers and existing
profile data remain intact. Five peer services, 56 configuration fingerprints,
13 unrelated virtual hosts and protected product routes were preserved.

## Files changed

Added the production/recovery receipt; updated deployment, testing, implementation,
asset-provenance and project documentation; refreshed two real browser captures
and their gallery description. No runtime edits followed the reviewed candidate.

## Documentation updated

The release receipt separates source identity from later documentation commits,
records tested behavior and limits, and identifies the complete immediate rollback
and newly archived historical runtime. The implementation report now links to
verified production status rather than a pending build.

## Git diff summary

Release documentation commit: nine files, 140 insertions and 12 deletions, including
two refreshed JPEGs. No generated build/dependency output or private data included.

## Verification

- Exact Linux check/build/audit succeeded, with zero production vulnerabilities.
  UBC 56, Vancouver 74, Surrey 69 and Richmond 27 tests passed (226 total).
- Private smoke passed 17 routes, protected host checks, tutorial IDs/assets,
  native image optimization, all 688 Richmond outputs, six UBC assets and profile
  isolation. Continuous resource guards passed without weakening their floors.
- Both-host before/after comparisons passed for 17 routes and 24 tutorial assets;
  70 additional public checks and four read-only profile checks passed.
- Production browser verified Mitch's button/typed introduction, facility answer,
  optional metadata, thanks, goodbye and scene focus. Phone/desktop evidence was
  refreshed, with no horizontal overflow or warning/error logs observed.
- Final health verified exact clean source/build, active service with no restarts,
  preserved peers/configuration/profile permissions, intact rollback and retained
  archive hashes. No post-activation errors; expected old-process exit 143 only.
- Screenshot formats/dimensions and `git diff --check` passed. No physical-device,
  sustained performance or complete screen-reader testing is claimed. Einstein
  can still be offered a redundant identity topic after introduction.

## Repository state after implementation commit

Branch `main`, release documentation commit `5c5ceed`; working tree clean before
this journal. Two documentation-only commits are to be pushed after the already
published runtime source. No feature branch, worktree, PR or force push.

## Implementation commits

- `d7066ac` — Make UBC character introductions and conversations natural.
- `5c5ceed` — Record verified UBC natural dialogue production release.

## Archive commit

`Archive UBC natural dialogue production verification`

## Lessons learned

Separate conversational content from source/provenance metadata. Preserve exact
runtime identity through integration, artifact transfer and browser acceptance.
Archive inactive runtimes only with verified recovery copies; shared-host capacity
must be measured afresh before each candidate.

## Follow-up ideas

Avoid offering an already answered identity topic and expand curated follow-ups
where verified source material supports them. These are not part of this release.
