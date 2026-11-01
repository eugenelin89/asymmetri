# Prompt 193: Publish UBC flagship development roadmap

- Date: 2026-11-01 (Vancouver)
- Scope: platform
- Goal: Put the agreed UBC Virtual Campus flagship roadmap in the connected Asymmetri repository and make it easy to find.

## Original user request

> put the roadmap in repo

## Scope

Publish the existing 2026–2027-and-beyond UBC roadmap as project documentation and link it from the UBC README. Preserve current UBC, peer-campus, website, data, server, user profile and analytics runtime behavior. No project code changes, new artifact builds or production deployment were requested.

## Decisions

- Publish a living plan at docs/UBC_ROADMAP.md rather than treat the previous chat roadmap as an executable one-shot Codex prompt.
- Keep the version labels V0.5–V1.1+ explicitly **proposed** and subordinate to actual dated release history; do not claim these future releases are implemented.
- Ground the implementation baseline in main at 287c23ea08b19c3e1d6a4ca4692c6728ae748745, the current landmark fidelity registry, Orchard MVR report and existing UBC release notes.
- Prioritize rendering performance and terrain, then baseball landmarks, Clock Tower / Koerner / IKB, campus interiors, environment, and prospective-student visitor acceptance.
- Preserve the owner's standing prompt to deploy each successfully validated release promptly, but explicitly retain production resource, security, peer-service and rollback safeguards.
- Require source provenance, honest reference-reconstruction classifications, real-person/source accuracy, privacy governance and protected artwork review.
- Add one concise link near the top of the UBC README; do not rewrite historical prompts or older release receipts.

## Implementation

Created docs/UBC_ROADMAP.md with project vision, current baseline, sequencing and acceptance gates for proposed V0.5 through V1.1+, per-milestone deliverables, benchmark scorecard, realism and creative tracks, ethics and licensing guardrails, deployment conventions, five immediate priorities and definition of long-term success. Added a direct relative link from projects/ubc/README.md.

## Engineering impact

Documentation-only: no runtime changes, new npm dependencies, GIS transformations, visitor UI changes, backend operations, server or profile data mutations, or deployment. The roadmap is advisory and must be updated as evidence or release priorities change.

## Files changed

- docs/UBC_ROADMAP.md — new standalone flagship roadmap.
- projects/ubc/README.md — top-of-file roadmap discovery link.

## Documentation updated

The UBC README now directs readers to the proposed roadmap, while remaining the source of current application behavior. The landmark fidelity registry, implementation/release reports, testing instructions and deployment documents remain separately owned and were not rewritten.

## Git diff summary

Implementation commit changed 2 files, with 227 insertions and 0 deletions: 224 lines in the roadmap and 3 in the UBC README. This journal is excluded from these totals.

## Verification

- Confirmed the requested roadmap file did not previously exist on main.
- Re-read the new file from main after committing it: 16 numbered sections, including V1.0, technical performance work, release policy and immediate actions.
- Re-read the top of the README and confirmed its relative roadmap link.
- Inspected the actual GitHub commit file list and 227-insertion stats.
- No test suites, production builds or deployment were run; this changes Markdown documentation only.

## Repository state after implementation commit

GitHub main advanced by fast-forward with an expected-head check from 287c23ea08b19c3e1d6a4ca4692c6728ae748745 to 0a969493a67dcb89b050e55218d18341048fcb9c. The edit was made through the authenticated GitHub repository connection; no local checkout/worktree was created or examined. No branch, PR, force-push or production action was used.

## Implementation commits

- 0a969493a67dcb89b050e55218d18341048fcb9c — docs(ubc): add flagship campus development roadmap

## Archive commit

docs: archive UBC flagship roadmap request

## Lessons learned

A flagship roadmap must keep planned scope distinct from current shipped work. Link project plans from the feature README and use source-backed fidelity status and measurable acceptance criteria before declaring photorealism or a digital twin.

## Follow-up ideas

Codex can take V0.5 as the next discrete assignment: establish performance benchmarks and a scoped terrain prototype, then update the landmark fidelity registry with evidence. Any later changes to current milestones should be made through normal repository commits and project journals.
