# Prompt 027: Make the website feel more human

- Date: 2026-09-29
- Scope: design
- Goal: Replace the generic AI/startup presentation with clear product explanations, a personal coaching story and a calmer visual system across the site.

## Original user request

> A comment I got is that the website "Looks so AI". Can you go thru the web and make the whole site more "human". Proceed.

## Scope

Reviewed the current public homepage, all nine route sources, shared components,
copy, approved assets and relevant project documentation. Updated the company,
Work, Sport, About and product presentation, including shared styles inherited
by the utility pages and tutorial. No deployment, hosted preview, dependency
upgrade, new feature, backend or external publication was requested or performed.

## Decisions

- The repeated slogans, oversized headings, dark technical grids and abstract
  diagrams gave the site a generic startup character. Replace them with specific
  explanations, smaller headings, warm paper surfaces and simple links.
- Lead with what the two products do and their actual availability. Keep the
  Labs / Work / Sport hierarchy and direct product navigation.
- Bring the existing first-person coaching origin and approved authentic photo
  onto the homepage. Rewrite the Sport story more conversationally while keeping
  the same events, anonymity and coaching role. About opens with that experience
  before explaining the company name.
- Describe a concrete, explicitly made-up BotSquad task in prose. Remove the
  generic capability diagram, Work direction diagram and duplicated example
  section. Keep early/self-hosted/tunnel access and future web/mobile distinctions.
- Retain Motion's exact-frame, conditional HFR, projected 2D, interpretation,
  storage and release limits. Keep both synthetic design concepts labelled.
- Preserve policy/support/tutorial content byte-for-byte. No invented personal
  history, customer, measurement, quotation or product capability was added.
- Use existing authentic media and system fonts. No stock images, generated
  people, external fonts, new visual dependencies or analytics.

## Implementation

The homepage now has a plain introduction, linked product statuses, divided
product rows, a founder/photo section and a direct contact invitation. Work
explains the everyday coordination problem. About and Sport use the coaching
origin and less formulaic language. Product headings explain what visitors can
do and what they need to know before using a result.

Shared styling uses light solid surfaces, a 76rem maximum content shell,
moderate heading weights, sentence-case labels, underlined touch-friendly links,
and a paper header with the original ink logo. Dark grids, gradients, photo
shadow/overlay treatments and decorative video geometry are removed. The dark
footer, orange action color and Motion mineral/teal palette remain.

`WorkerExample` replaces the old worker diagram with a written brief and ordered
handoff. The Labs social SVG/PNG matches the new palette and headline. Video
posters use restrained typography and grow vertically when needed on narrow
screens, while the loaded player retains 16:9.

Browser review exposed an existing duplicate React-key warning: tutorial headers
and content slots had the same key when inserted as siblings. Distinct header
and content key suffixes remove that warning without changing DOM IDs, hashes,
content, branch choices or navigation behavior.

## Engineering impact

Server component boundaries, routes, metadata canonicals, packaging and runtime
requirements are preserved. No dependency or lockfile changes. Existing optional
video consent/loading behavior, keyboard focus, reduced-motion CSS and native
navigation disclosures remain. Removed two obsolete diagram components and their
presentation rules rather than layering a second visual system on top.

## Files changed

- Homepage and Work/Sport/About/BotSquad route composition; two tutorial React keys.
- Shared header, video poster and new written worker example; retired diagrams.
- Global styles and centralized marketing copy.
- Labs social SVG source and raster PNG.
- README and architecture, asset, brand, content, strategy, testing and visual docs.

## Documentation updated

README describes the revised homepage. Brand, content, site strategy and visual
identity document the personal editorial direction. Architecture records the
new example and tutorial key distinction. The asset manifest records unchanged
photo reuse, social-image replacement and retired CSS/HTML visuals. Testing adds
checks for the new light header, status index, photo section and written example.
Historical prompt records remain unchanged.

## Git diff summary

Implementation: 23 files changed, 474 insertions and 1,013 deletions, including the
social-image binary replacement. Most deletions remove abstract diagram markup,
decorative styling and repeated homepage sections. This record is excluded.

## Verification

- Started on clean `main`; `git pull --ff-only origin main` succeeded and found
  the branch current. NVM was unavailable; active Node 24.10.0 matches `.nvmrc` 24.
- `npm run check`: passed TypeScript and ESLint.
- `npm run build:next`: passed after granting the local process/port access
  required by Turbopack. Rebuilt after the tutorial key fix.
- `npm run build`: passed, including the final tutorial key fix. Vinext retains
  its existing informational static-route classification limitation.
- `git diff --check` and staged diff check: passed.
- `npm audit --omit=dev`: completed with four existing findings (one critical,
  two high, one moderate), consistent with the recorded baseline. Dependencies
  were unchanged; this task does not resolve those advisories.
- Browser layout checks at effective 320, 390, 768, 1024 and 1440 CSS pixels
  covered all nine pages: no horizontal overflow or out-of-bounds main text,
  images or buttons. Desktop checks found one H1 per page, complete footer links,
  correct canonicals, no missing alt text and no broken loaded images.
- Visual spot checks covered desktop, tablet and phone views, product heroes,
  About/Work prose, tutorial content, homepage photo and Labs social image.
- Local production HTTP checks: nine routes and 39 asset/metadata URLs returned
  successfully. Internal fragments resolved, all ten tutorial modules appeared
  in initial server HTML, the exact www tutorial canonical remained and the
  policy date was unchanged.
- Policy/support/tutorial exports compared equal with the pre-change source;
  tutorial original-image URLs and all related public asset bytes were preserved.
- Tutorial module navigation, Import branch filtering, complete-guide mode and a
  fresh Side View step deep link worked. The duplicate-key warning was absent
  in a fresh development tab after the fix.
- Keyboard Enter opened Work; Escape closed it and restored focus. A solid focus
  outline was present. The skip link focused main content. Native disclosure and
  server-rendered no-JavaScript structure, plus reduced-motion rules, were reviewed
  in source; browser JavaScript/media-preference emulation was not available.
- Both optional videos had no initial iframe, loaded the approved privacy-enhanced
  URL, closed correctly and returned focus to the load button. External fallback
  links remain. This verifies the wrapper, not end-to-end third-party playback.
- Public source scans returned zero local filesystem paths, credential literals,
  private-key material, legacy product-name combinations or em/en dashes. Reviewed
  changed copy and asset reuse for private identities and ungrounded claims.
- No production configuration, URL, app release resource or live service changed.

## Repository state after implementation commit

`main` at `cb343357b5cf813f035cd005ca279dc0292e3be2`, with a clean working tree and
one commit ahead of `origin/main`. This journal is created after that commit.
The implementation and journal are to be pushed together under the default workflow.

## Implementation commits

- `cb343357b5cf813f035cd005ca279dc0292e3be2` — Make the site more personal and grounded

## Archive commit

`Record the human editorial redesign in prompt journal`

## Lessons learned

Concrete work and an honest origin story communicate the company more clearly
than repeated statements about capability. Preserve product limits and useful
technical instructions while removing the surrounding marketing ceremony.
Lightening a page also requires checking navigation and accent contrast, not
just changing its background.

## Follow-up ideas

The existing dependency advisories need a separate compatibility-reviewed update.
Deployment remains a separate explicit owner request.
