# Prompt 042: BotSquad public-copy cleanup

- Date: 2026-10-07
- Scope: content
- Goal: Remove the owner-selected public caveats, preserve the BotSquad presentation, and deploy through the existing production process.

## Original user request

> ASYMMETRI.CO — BOTSQUAD COPY CLEANUP
>
> Update and deploy the public BotSquad page: https://asymmetri.co/botsquad
>
> This is a focused editorial cleanup. Do not redesign the page.

The supplied request specified eight editorial decisions: remove the saved-history/model
memory and idle-worker caveat; use exactly “Meet BotSquad”; remove the validated-reference
organization paragraph and diagram disclaimer; remove the workflow-validation disclaimer;
remove the entire Current limits passage; remove the Hitting-workflow disclaimer; and
remove the video description. Do not replace the deleted passages with equivalent caveats.

Preserve the experimental/open-source/self-hosted status, source/white-paper/setup/roadmap
links, goal, vision, capabilities, team diagram, Asymmetri uses, illustrative Hitting
workflow, human-control section, video, deliberate loading, and YouTube privacy disclosure.
Keep Graphite + Teal, routes, navigation, product truth, functionality, technical
documentation, Labs and Motion unchanged. Delete unused content fields and empty markup;
adjust only spacing/columns/styles made obsolete by those removals.

Use the latest clean main, inspect exact local and production revisions/recent commits,
and protect verified production with an immutable pushed rollback tag before editing.
Run check, Next build, Vinext build, production audit and diff check without audit fix.
Inspect responsive layout, headings, links, overflow, keyboard focus and console output;
smoke-test Labs/home. Commit, journal and push main without force, then use the documented
application-owned staged deployment with successful build before service activation.
Verify source SHA, service, loopback and public routes/content; only then annotate and
push the release tag. Report every editorial decision, checks, Git identities, health,
rollback marker and remaining issues. Provide initial ETA and progress updates.

## Scope

Six website source files contain the editorial/rendering cleanup. No assets, dependency
versions, lockfile, routes, metadata, navigation, technical documents, product source,
infrastructure or other hosted sites change. This record documents the owner decisions;
the post-deployment receipt stays outside tracked source to avoid claiming future results.

## Decisions

- Verified clean local and production main at `43d65c3c2880587b8b2033e28abd864671bfbd9d`.
  The live build ID was `vUGtGGGeqWj2b0tkAeQdP`; service and routes were healthy.
- Created and remotely verified annotated
  `website-pre-botsquad-copy-cleanup-2026-10-07` at that exact revision. Existing tags
  remain unchanged.
- Preserved “A Codex session can stop or be replaced without replacing the worker.”
  Only its following requested caveat was removed. Renamed its field to `continuity`.
- Deleted unused team introduction/caption, capabilities introduction/limits, example
  caption and BotSquad video description fields, along with their rendering elements.
- Retained the example's “Illustrative workflow” label and every workflow step, without
  adding any claim of completed Hitting development.
- Kept the inferred introduction union type. The shared video component renders a
  description only when present; Motion's existing description and layout remain intact.
- Removed the obsolete team-heading column and caption selectors. A video heading with
  one child spans the existing grid. The still-used evidence and pilot styling remain.
- Production uses the unchanged-dependency copy-only deployment with a source archive,
  Git metadata and prior build retained. No install runs in linked server dependencies.
- Audit findings are reported, not remediated in this owner-scoped copy change.

## Implementation

All seven requested passages are absent and the heading is exactly “Meet BotSquad”.
The original section order, team hierarchy, example, public links and privacy controls
remain. No empty paragraphs/captions or new explanatory copy replace the removals.

## Engineering impact

Small server-rendered copy and markup reduction; no new dependency or browser behavior.
The shared video condition accommodates the absence of BotSquad's description without
changing Motion. Semantic hierarchy, accessible diagram name, keyboard controls and
privacy disclosure remain. Publication requires the existing staged Next/systemd flow.

## Files changed

- Central content and BotSquad route: delete requested fields/passages and rename heading.
- Team/example components: remove discarded captions while preserving their contents.
- Video component and global stylesheet: omit absent descriptions and remove obsolete
  column/caption styling without changing palette or surrounding section layout.

## Documentation updated

This journal records the editorial decisions. Technical documentation remains unchanged
as expressly requested; deeper limits and evidence remain available there. No command,
dependency, route, asset, architecture or deployment-procedure documentation needs revision.

## Git diff summary

Implementation: 6 files changed, 11 insertions and 22 deletions. Changes are the specified
copy removals, heading/field rename, conditional video paragraph and minimal unused-UI
cleanup. This record is excluded from those totals.

## Verification

- Local Node 24.10.0 matches `.nvmrc`; nvm is unavailable in both conventional locations.
- `npm run check`: passed; existing tutorial navigation lint warning, no errors.
- `npm run build:next`: passed. An initial sandbox port-binding failure was cached;
  preserving the generated directory and running a fresh build outside the sandbox resolved it.
- `npm run build`: passed; existing Vinext route-classification and Browserslist notices.
- `npm audit --omit=dev`: reports one high-severity Next.js dependency finding, exit 1.
  Installed Next.js remains 16.3.6; package/lockfile are byte-identical to the live baseline.
  No audit fix or dependency changes. Full audit evidence is in the external receipt folder.
- `git diff --check`: passed. Added-source credential/private-reference/obsolete-branding
  scans passed; only new visible wording is “Meet BotSquad”, plus the retained sentence.
- Browser widths 320, 390, 768, 1024, 1440 and 1920: no horizontal overflow, clipped main
  descendants, missing local anchors, missing alt attributes or broken BotSquad images.
  Desktop/tablet/mobile views confirm intentional spacing, hierarchy and workflow layout.
- All seven workers, the nested Turing reports, all seven example steps and status remain.
  No empty paragraph, figcaption or list item; all required removed strings are absent.
- Keyboard video load/close works, with a visible 3px focus outline and focus restoration.
  The player is absent before activation; no Google/YouTube media/preconnect elements are
  present. After activation, the approved privacy-enhanced iframe loads without autoplay.
  Network request logging is not claimed; reduced-motion rules were inspected unchanged.
- Browser console has no warnings/errors. Labs/home smoke checks pass.
- Local built HTML checks: all nine routes and six redirects pass. Homepage, Labs and
  all four protected Motion routes have exact matching main HTML against live baselines.
  Canonicals/footer links and all 24 tutorial original-image URLs pass.
- GitHub, setup, white paper, roadmap, video and Google privacy links return HTTP 200.
- Production preflight: clean main equal to origin/main, Node 22.23.1, active service,
  and HTTP 200 for homepage/Labs/BotSquad and protected Motion routes on loopback/apex/www.

## Repository state after implementation commit

Main at `4aedb3b83485eeef91d59b20350579bc77a46b96`, clean, one implementation commit ahead
of origin/main. No unrelated changes were present or included. This journal is committed
separately, then both commits are pushed before the production candidate is built.

## Implementation commits

- `4aedb3b83485eeef91d59b20350579bc77a46b96` — Tighten BotSquad public copy

## Archive commit

`Record BotSquad copy cleanup and release journal`

## Lessons learned

Public editorial simplification can preserve product truth without repeating the entire
technical validation inventory. Shared media components must tolerate omitted prose
without emitting empty elements or altering the other product's layout. Audit results
can change even when a release changes no dependency, so always report the fresh result.

## Follow-up ideas

Review the reported Next.js advisories in a separate dependency-maintenance task. No
upgrade, schedule or other follow-up implementation is included in this request.
