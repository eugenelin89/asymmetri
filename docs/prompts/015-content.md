# Prompt 015: Publish Motion Privacy and Support

- Date: 2026-09-16
- Scope: content
- Goal: Publish source-audited Motion Privacy and Support utility pages through the existing DigitalOcean website deployment.

## Original user request

> ASYMMETRI.CO — PUBLISH ASYMMETRI MOTION PRIVACY + SUPPORT PAGES

The large attached request specified website-only work. This safe title and the
complete decision-oriented summary below replace the private attachment path,
generated filename and repeated brief.

The owner requested a read-only website preflight (branch, exact local/remote
HEADs, ahead/behind, worktree, architecture, concurrent activity, Mac disk and
blockers), followed by autonomous implementation unless a real owner-only or
production-safety blocker arose. The accepted Motion source and five release
privacy/support documents had to be read through GitHub, preserving bounded app
facts and reporting material discrepancies without changing that repository.

The website audit had to cover cookies, analytics, ads/trackers/pixels, forms,
APIs, databases, authentication, profiling/storage, external fonts/scripts/embeds,
request logs/retention, hosting, and support mailbox processing/retention/deletion.
Verified facts, bounded infrastructure disclosure and unknown facts had to remain
separate. The owner supplied Asymmetri Labs, info@asymmetri.co, no sale of personal
information, email-only support and an audience including youth athletes; no
Kids classification, age gate, territory, certification or invented retention
promise was authorized.

The two pages needed accurate local video/profile/marks/2D analysis/evidence,
permissions, microphone/import distinctions, Photos/iCloud/backups/sharing,
retention/deletion/cleanup limits, SDK/upload limits, minors, policy updates and
contact wording. Support needed the real seven-step V1 flow, iPhone/iOS 17 and
120/240-fps hardware caveats, permission/import/recording/Photos/storage/result
troubleshooting, optional authorized support material, minor-footage permission,
and warnings before deletion/reinstallation. No SLA or support form was wanted.

Integration was limited to readable utility pages, footer links, metadata,
indexing/sitemap, working mutual/email links and necessary homepage-anchor fixes.
Homepage marketing, product launch, pricing, assets, app ReleaseLinks, TestFlight
and Apple submission were excluded. No analytics, tracking, advertising, banner,
form, backend, database, auth, helpdesk, new dependency or custom client JS was
needed. Existing redirects and the visual system had to remain.

The request required npm ci, type/lint, Next.js and other applicable builds,
whitespace, responsive/browser/accessibility/privacy checks, current documentation,
two commits and a normal main push. Deployment was explicitly authorized only
after local validation and push, using the existing DigitalOcean procedure:
inspect production without discarding unexpected work, deploy the exact pushed
commit, build before restart, inspect service health, and verify real unauthenticated
HTTPS articles, homepage, links, sitemap and robots. No forced push, destructive
reset to force compliance, alternate hosting or unrelated infrastructure changes.
The final report must include repository/production commits, live URLs, exact
privacy-audit findings, validation, scope exclusions and real remaining actions.

During execution, the owner clarified the existing access method:

> previoulsy I believe I used the web console on DO to access the server, and I do a git pull on the server to update the site. do you have a better way?

The owner signed into the existing DigitalOcean console. After inspection exposed
Node 22.23.1 versus `.nvmrc` 24, the owner expressly approved:

> Use existing Node 22 for this deployment

## Scope

Only this website repository is changed. The Motion repository was read through
GitHub at `314783401897c73fdb7c20a60e6ce3030b92e053`; it was never modified or built.
No homepage copy, public media, dependency, OS package, DNS, TLS, Nginx or service
configuration was changed. Production synchronization/build/restart is a later
step after this archive and successful push, with results in the task report.

## Decisions

- Preserve the audited Motion claims and exact UI terminology. Add only the
  owner-authorized audience/no-sale position and verified website facts.
- Separate app, platform copies, website and email disclosures. Do not equate
  absent app uploads with data never leaving the device or complete deletion.
- Keep the existing apex canonical origin while verifying both requested `www`
  publication URLs. Keep footer links secondary and header labels unchanged.
- Use typed copy in `content/site.ts`, one small server-rendered article component,
  route files and a metadata helper. Keep normal HTML links and semantic lists.
- Preserve logging uncertainty: live Nginx enables access/error logs; daily/14
  rotation config is not proof of total retention or provider-backup deletion.
- MX records establish forwarding routing, not the final support mailbox/provider
  or an adopted correspondence retention/deletion policy. No email was sent.
- Use the existing web console and the expressly approved Node 22 production
  exception. Retain Node 24 locally and the normal Next.js/systemd architecture.
- Document safe fast-forward production synchronization instead of destructive
  reset. Never overwrite unexpected production work.

## Implementation

Added `/privacy` and `/support` with bounded policy wording, practical help,
effective date, section navigation, email links and mutual links. Added footer
navigation and sitemap entries. Made primary homepage anchors root-relative so
they function from utility pages. Added modest article typography, underlined
links, clear list markers and existing visible focus/reduced-motion conventions.

## Engineering impact

All routes remain server components and statically build under Next.js. No new
runtime state, backend, library, tracker, external resource or public asset.
Metadata and copy remain centralized. Existing homepage content and legacy
redirects remain. The build/runtime distinction between DigitalOcean and retained
Vinext/Worker packaging remains intact.

## Files changed

- Route composition, sitemap and metadata helper for the two utility pages.
- Shared article/footer presentation, responsive CSS and centralized page copy.
- Current onboarding, architecture, content, strategy, visual, testing and
  deployment documents, plus a dedicated evidence-based website privacy audit.

## Documentation updated

README and architecture list all three indexed routes. Content/brand/site strategy
permit factual named-app utility copy without changing marketing positioning.
Visual guidance documents readable articles. Testing/deployment instructions add
route/content/accessibility/public verification, production state guards and the
scoped runtime exception. The privacy audit records source evidence, operational
limits, preflight facts and existing dependency advisories. No asset-manifest
change is needed because no public asset was added, replaced or removed.

## Git diff summary

Implementation: 17 files changed, 719 insertions and 40 deletions. Most additions
are the complete public copy, utility renderer/CSS and the internal audit.
This summary excludes the current journal record.

## Verification

- Clean starting main, successful fast-forward-only pull; local and remote
  `4eb72cdd94bd5d7748a2f00d0e41d15401ae0b61`, 0 ahead/behind. About 11 GiB Mac disk
  free; no other local build/deploy process found.
- Node 24.10.0 matched `.nvmrc`; nvm unavailable. npm 11.6.0 `npm ci` succeeded,
  with no lockfile/package change or engine mismatch.
- TypeScript/ESLint, Next.js build, retained Vinext build and git diff --check
  passed. Next.js statically generated both articles.
- HTTP assertions passed for all content/metadata/static routes; exact titles,
  descriptions/canonicals/social titles, mutual/footer/mailto links, no-index
  absence, sitemap/robots and all six permanent redirects were checked.
- Browser checks at 320/768/1440px found no horizontal overflow; readable articles,
  seven numbered steps, visible 3px focus and working skip navigation. Tested
  footer/mutual/homepage links, image loading and alt text, and no console errors.
  Reduced-motion rules were verified in loaded CSS; no OS preference was changed.
- Visual review caught Tailwind's list reset; explicit bullets/decimal markers
  fixed it, followed by successful rebuilt checks and fresh browser verification.
- Text contrast: ink 17.49:1, accent-dark 5.97:1, muted 5.65:1 against paper.
- Source/DOM/response-header scans found no forms, submissions API, cookies,
  tracking integrations, external scripts/fonts or prohibited public identifiers,
  secrets/private athlete details. No new assets; existing approved assets unchanged.
- npm audit --omit=dev reports four pre-existing package findings (one critical,
  two high, one moderate), investigated and recorded in the privacy audit. This
  is explicitly not a clean dependency audit. No automated dependency repair.
- DigitalOcean console preflight: clean main at
  `d826652e8a595b3f2ca2b609f36b5bfffa625ad5`, matching cached origin/main and behind
  only the starting repository's documentation commits. Correct origin, active
  Next.js service as django-user on 127.0.0.1:3001, boot enabled, no concurrent
  build/deploy found. About 1.7 GiB disk and 491 MiB RAM available, with swap.
- Live Nginx and logrotate configuration inspected read-only. Node 22.23.1/npm
  10.9.8 found; owner approved this runtime for this deployment. Public live-page
  acceptance and final deployed SHA follow successful push/build/restart and
  are reported in the final task response, not asserted prospectively here.

## Repository state after implementation commit

Branch main. Implementation commit below. Working tree clean; one commit ahead
of the unchanged origin/main before adding this separate journal. No unrelated
work staged or committed. Both commits will be pushed normally before deployment.

## Implementation commits

- `587ea610413564604d4bfe10fcc67495c59e7f9d` Publish Motion privacy and support pages

## Archive commit

`docs: archive Motion privacy and support publication`

## Lessons learned

Inspect the live runtime and logging configuration instead of treating operations
docs as complete evidence. Keep unknown retention/provider facts visibly unknown.
Verify semantic list presentation after CSS resets. App privacy facts do not settle
website or email practices. Preserve local app deletion/platform-copy boundaries.

## Follow-up ideas

Dependency remediation and aligning the production Node target remain separately
reviewed maintenance work. Establish mailbox retention/deletion facts before
making stronger promises. No iOS release/configuration action is included here.
