# Prompt 148: UBC Virtual Campus research implementation

- Date: 2026-10-30
- Scope: platform
- Goal: Implement an independent, geographically sourced UBC campus visitor experience within Asymmetri Labs GIS Apps, with real navigable reconstructions and grounded educational interactions.

## Original user request

> CODEX MASTER PROMPT — UBC VIRTUAL CAMPUS V2
>
> Asymmetri Labs | Greater Vancouver GIS Project Family
>
> Start by auditing existing code and data, then build the highest-quality functional result possible.
>
> Prioritize accurate and beautiful working environments over incomplete mockups.
>
> Do not stop at a planning document.
>
> Proceed with implementation, validation, and an accurate final report.

The full master specification requested a peaceful, unofficial UBC Vancouver
visitor experience, distinct from conventional gameplay. It required inspection
of Vancouver, Surrey, Richmond and the Asymmetri website; real UBC GIS and licensing;
a West 16th sidewalk start; a detailed Tourmaline West stadium and enterable Rose
training centre; Sauder and both Greg Werker/Benoit-Antoine Bacon educational
simulations; enterable Bookstore and multi-level AMS Nest; a reusable character,
dialogue, information and interior architecture; campus search, official hyperlinks,
walk/aerial/map modes, touch/keyboard access, seasonal/weather/solar controls,
photo capture, progressive rendering, website integration and extensive acceptance
testing. It prohibited invented factual claims, fake live data, copied unlicensed
assets, real-person voice imitation, implied endorsements and real-world tracking.
It requested a final A–I report distinguishing implemented coverage, reconstructed
geometry, test evidence, deployment status and the next five priorities.

Browser clarification during work:

> I’m away from computer. Will enable when I get home

This answered the local-browser-access blocker. Implementation continued through
source, geometry, collision, automated validation and builds; browser acceptance
was recorded as pending rather than fabricated.

## Scope

Added `/labs/ubc`, a GIS Apps card, original Three.js models and a pinned PDDL UBC
snapshot. Four interiors, two named educational guides, source-based information,
environment controls, directory and geographic navigation are implemented.
Existing city engines/data and production services are unchanged. Full-campus
architectural fidelity, terrain, production asset streaming, high-quality crowd
animation and physical-device certification remain incomplete.

## Decisions

- Created an independent normal clone on main because the available Richmond and
  Surrey checkouts were active development branches. No worktree, feature branch,
  merge or PR was created. Initial main was clean and synchronized successfully.
- Reused existing Three.js, React, site routing and Surrey resource disposal.
  Avoided importing city gameplay or refactoring unrelated engines.
- Compiled seven licensed UBC source layers with a dependency-free offline Python
  importer, pinned source digests and one metric coordinate system. The approximate
  WGS84/NAD83 treatment and flat terrain remain explicit.
- Derived stadium home/mound orientation from official surface geometry and selected
  the start on an actual source sidewalk. Kept conventional field dimensions labelled
  as reconstruction rather than claiming an independent field survey.
- Classified all custom interiors Level B, and ordinary campus buildings exterior-only.
- Used the current Werker faculty-profile title, Student Experience, while recording
  older leadership-page wording. Used reviewed topics instead of generative impersonation.
- Kept deployment separate from code integration. No production activation was requested
  or performed. Browser use was disabled and the user was away, so visual acceptance
  remains pending.

## Implementation

The scene contains sourced campus context, custom field/grandstand/dugout/bullpen
geometry, four navigable public-space reconstructions, supported Nest stairs and
galleries, stylized guides and visitors, safe official links, search, three camera
modes, touch input, weather/season/time controls and canvas photo export. The public
guide discloses reconstruction and unofficial status. The source snapshot contains
605 building parts, 6,070 landscapes, 9,324 trees, 6,103 outdoor route lines and
1,450 entrances. Six hundred building parts use the source height field.

## Engineering impact

No project dependency, backend, analytics, authentication, payment or live tracking
was added. The renderer imports only after Start exploring. Collision and routing
remain pure and testable; route edges crossing current model obstacles are rejected.
Geographic tree groups, instancing, material batching, distant architecture proxies
and quality controls provide an initial performance foundation. Full asset streaming
and measured frame-rate targets are not claimed.

## Files changed

- UBC route, GIS Apps content and sitemap integration.
- Project-owned renderer, accessible UI, information/character registry, geometry,
  environmental calculations, population, collision and routing.
- Pinned source compiler, data-integrity and continuous-navigation tests.
- Versioned geographic payload, anchor/provenance records and GIS-derived vector preview.
- Project README, licences, data schema and comprehensive implementation/acceptance report.

## Documentation updated

README and architecture, local development, content, asset, testing and deployment
guides describe the new route and its precise limits. The implementation report
contains source evidence, coverage, interior and character status, validation,
outstanding screenshots and five next priorities. Source observations do not imply
visual acceptance or production deployment.

## Git diff summary

Implementation: 35 files changed, 8,700 insertions and 5 deletions. Most additions
are isolated UBC source, tests, documentation and data. Existing city implementation
files are unchanged; the shared scene disposer is consumed without modification.

## Verification

- Seventeen UBC Node tests pass, including actual-model stadium navigation, all
  four entrances and exits, four Rose cages, two Nest stair flights and upper
  galleries, integrated source routing and named-guide movement.
- Five Python GIS-integrity tests pass; source hashes, projection, holes, anchors,
  privacy and route exclusions are checked.
- Existing Vancouver, Surrey and Richmond regression suites pass.
- TypeScript and ESLint pass, retaining one unrelated pre-existing tutorial warning.
- Next and Vinext production builds pass. Large-chunk and old Browserslist-data
  warnings are reported rather than silently remediated outside scope.
- Production dependency audit reports zero vulnerabilities.
- Local route/data/anchor HTTP checks return 200; served geographic bytes match
  the committed snapshot digests.
- `git diff --check` passes.
- Browser interactions, real screenshots, responsive visual checks, real FPS and
  physical-device tests are pending due disabled browser access.

The integrated tests caught a facade column blocking the Bookstore at its actual
orientation; the doorway was corrected. A curated healthcare topic-selection issue
was also corrected. Tests retain actual barriers and follow feasible routes rather
than disabling collision to reach targets.

## Repository state after implementation commit

Branch main, clean after implementation, one commit ahead of the recorded origin/main.
No production changes. The independent checkout preserves concurrent city workstreams.

## Implementation commits

- `bd2b438` — Add UBC Virtual Campus research preview with sourced geography and walkable interiors.

## Archive commit

Document UBC Virtual Campus implementation and acceptance limits in journal 148.

## Lessons learned

Source orientation matters: a layout that passes isolated movement can fail after
geographic rotation and source-derived sizing. Building maximum heights do not
describe roof forms. Public architectural drawings are useful references without
automatically granting image redistribution rights. A passing compiler and geometry
suite do not establish visual quality; preserve that acceptance boundary.

## Follow-up ideas

Resume browser acceptance when the user enables access. Then prioritize elevation,
more faithful landmark envelopes, current public-layout evidence, measured streaming
and improved vegetation/crowd assets. Do not label this candidate the completed
flagship V2 or release it before those gates are reviewed.
