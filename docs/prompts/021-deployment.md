# Prompt 021: Approved Motion Privacy and Support publication

- Date: 2026-09-19
- Scope: deployment
- Goal: Publish the approved REL-13 policy copy through the existing DigitalOcean workflow.

## Original user request

> console ready

Material follow-up:

> always approve node 22 runtime. don't ask me again.

This resumes the owner's explicit request to compare live Privacy/Support against
Motion's approved reconciliation, update and deploy only that wording when the
established workflow is available, verify successful URLs and exact displayed
copy, and record sanitized evidence. The owner made the authenticated Droplet
console available. The other release-readiness work is already prepared in
Motion's `release/1.0`; no Apple polling, case duplication, app upload, public
submission or device operation belongs to this website deployment.

## Scope

Apply six approved paragraphs and the September 19 effective date to existing
Privacy/Support sections. Preserve all other copy, design, assets, configuration
and dependencies. Follow this repository's main/two-commit workflow.

## Decisions

- Use the owner-approved authority at Motion release commit
  `2cf98747a062c1d5d265504d22a14ce1682ae5c1`,
  `docs/release/public-pages/REL13_POLICY_RECONCILIATION.md`.
- Keep Gmail support, Apple-provided reporting, local app records and website
  infrastructure logs distinct. Infrastructure total retention remains unknown.
- Record standing production Node 22 approval; retain local `.nvmrc` Node 24.
  Do not ask the owner again for the existing runtime.
- With unchanged dependencies, compile in a temporary directory using installed
  hard-linked dependencies; preserve the serving build until production checks
  succeed, then use the existing Next/systemd deployment. Never install into the
  hard-linked dependencies or delete the live build during compilation.

## Implementation

Replaced generic support email paragraphs with the three approved Gmail,
support-use and bounded retention/deletion paragraphs. Added approved Apple
reporting, website use/log retention and Support summary paragraphs. Updated the
policy date and affected operating documentation.

## Engineering impact

Copy-only public change; no new collector, tracking, form, dependency, asset,
layout, runtime installation, server-log setting or application feature. A
production build and restart remain required to publish this committed source.
The dependency audit's four existing findings are not fixed by this change.

## Files changed

- Shared content: the four approved policy locations and effective date.
- Repository/deployment instructions: standing Node 22 approval and safe
  copy-only build/swap sequence.
- Content guide/privacy audit: current adopted policy and evidence boundaries.

## Documentation updated

Updated AGENTS, Deployment, Content Guide and Website Privacy Audit. Reviewed
README, architecture, asset and testing guidance; no changed product structure,
asset or test command required updates there. Motion's release evidence ledger
will receive actual deployment and rendered public-verification receipts.

## Git diff summary

Five files; 113 insertions and 19 deletions. Only `content/site.ts` changes
public source; the other four files describe policy and deployment operations.

## Verification

- Clean local/origin main and production source at `d5b32d8` before edits;
  fast-forward pull succeeded; no discovered competing website writer.
- Local Node 24.10.0: `npm run check`, `npm run build:next` and `npm run build`
  passed. The Vinext route-classification warning is unchanged.
- All six exact authority paragraphs are present in source and generated route
  HTML, with September 19 date, mailto and mutual Privacy/Support links.
- Changed-path and added-text review: no private account/host/contact details,
  new dependencies, design/assets, forms, embeds or tracking; full diff and
  `git diff --check` pass.
- `npm audit --omit=dev`: existing one critical (Next), two high (sharp/nanoid)
  and one moderate (baseline-browser-mapping) findings remain. No audit fix or
  dependency upgrade is included in the approved copy scope.
- Production preflight: active service, clean expected source, Node 22.23.1,
  npm 10.9.8, approximately 1.6 GiB disk free and 1.9 GiB swap free. Production
  check/build, controlled swap and public desktop/mobile verification follow
  this journal/push; this record does not preclaim their success. Final results
  belong to Motion's `docs/validation/rel13_distribution_readiness.md` and the
  task completion receipt.

## Repository state after implementation commit

Clean main at `17536e86862d1b4a79357d8070977d9a52f1195b`, one commit ahead of
origin before this journal. No unrelated work included. Both commits will be
pushed normally and their exact source deployed; no force-push.

## Implementation commits

- `17536e86862d1b4a79357d8070977d9a52f1195b`
  (parent `d5b32d8b595515e5104950c7251b3cc97bd73394`): approved policy copy and
  operating documentation. Reproduce with `git show 17536e8` or
  `git diff d5b32d8 17536e8`.

## Archive commit

`docs: record prompt 021 policy publication preparation`

## Lessons learned

Runtime consent persists across deployments. Successful local builds and pushes
are preparation evidence; only observed production checks and exact public copy
establish publication. Keep rollback builds outside the serving directory until
verified and never expose private console details in documentation.

## Follow-up ideas

Address the pre-existing dependency audit in a separately scoped update. Apple
membership and App Store execution remain in the Motion release task.
