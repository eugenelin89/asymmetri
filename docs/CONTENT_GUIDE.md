# Content guide

## Source of truth

Shared public content is centralized in `content/`. `site.ts` owns shared identity,
Motion and the preserved Sports narrative. Update it for:

- company name and positioning;
- canonical URL and public contact mailbox;
- navigation and footer links;
- page title and description;
- founder story, pitching focus, and current product positioning;
- the `motion` product structure, release state, platform, workflow, limitations,
  privacy summary, icon and social image;
- typed `tutorial` modules/steps, troubleshooting and `tutorialMedia` labels/captions;
- approved image paths and alt text;
- closing calls to action;
- Motion Privacy Policy and Support content in `motionPages`, including the
  effective date, section IDs, metadata, contact labels and mutual links.

Exports `home`, `sports`, `labs`, `about`, `divisions`, `motionFamily` and
`productStatusLabels` make the umbrella, peer divisions and product states explicit.
`labs.projects` uses the small `LabsProject` type: name, short description, status,
optional source/detail links and optional established license link. Actual projects
retain source links; a category uses its detail link without a fictitious source.
BotSquad reuses its existing name/status/source/license URL; never assume MIT for
future entries. Concept captions, videos and URLs stay centralized.

Labs is a playground for open-source experiments. “Everything we build in Labs is
open source” is an owner decision covering current and future Labs projects, not
all Sports products. Keep Labs to its introduction, current projects and one short
closing. Use curious, informal copy; detailed project explanations belong on their
own pages, not in replacement approach or principles sections.

Page files under `app/` own narrative sequence and route-specific connective
copy. Components should focus on presentation and should not quietly introduce
new product claims.

## Product truth states

Every product or research statement must fit one of these categories:

### Current verified product capability

Motion v1.2 behavior verified in the accepted release source and decisions:
iPhone/iOS 17, conditional HFR capture, Photos import, Back/Side guides, optional
Recording Setups, human-confirmed exact-frame marking, supported projected 2D
results, saved evidence, local history and descriptive comparison. Capability
being implemented does not establish App Store availability or scientific
validation. Current release wording is “Preparing for release.”

### Research and experimental interpretation

Camera geometry, landmark estimation, event marking and measurement uncertainty
limit interpretation. Projected 2D measurements are not anatomical 3D biomechanics.
A recorded difference is not proof of improvement or a causal training effect.
Sensor experiments belong to the founder/company history, not current Motion V1.

### Release preparation, development and roadmap

The October 21 review verifies Motion 1.2 (4) in owner-only TestFlight testing,
with public App Store release still pending. Keep Pitching **Preparing for release**;
private testing does not authorize an App Store link or establish external beta
availability. The owner separately authorized an access-request form on October
21. Use **Request TestFlight access**, not a download or immediate-access promise.
Actual invitations still depend on a suitable available beta build.
Hitting is **In development**, with implemented review workflows but experimental
measurements and remaining real-media/scientific/release gates. Team is **Planned**.
`productStatusLabels` supports all four states; future changes require new evidence.
Update `motionFamily` names/statuses centrally. Its Pitching detail also supplies
`motion.releaseStatement` so Sports, Motion and the family share one release fact.

Team is one professional app with Pitching/Hitting/Baseball entitlements over the
same account, organization, roster, Athlete identities and Cloud data. Team requires
Cloud with finite quota-aware storage; the local-first pitching policy does not
cover that future service. Enterprise and deeper Mechanics Lab follow Hitting/Team.
Dual View with a primary-controlled Companion iPhone is planned outside v1.2;
it does not establish current dual-camera capture or 3D reconstruction.
No launch dates, prices, quotas or unimplemented science are advertised.

Current V1.2 marketing includes Notes, manually entered context, Reference Study,
Compare With My Pitch and explicit review sharing. These do not infer Reference
measurements or improved performance. Saved Comparisons reopen paused and need
deliberate alignment; linked source time is not physical recording synchronization.
New Explorer investigations and Reset View use All saved history. Saved Views retain
their chosen ranges and filters. See the current `MOTION_PRODUCT_REVIEW.md` audit.

Current code/tests take precedence, followed by accepted decisions, current
product/release documentation, roadmaps and dated white papers. Decision 93
promotes the two existing Side Trunk Tilt endpoints and establishes eight normal
view/event results in v1.2; older six-result and all-eleven inventories are historical. Read
`MOTION_PRODUCT_REVIEW.md` for the dated audit and maintenance rules.

## Motion tracking story and terminology

Lead `/motion` and the tutorial with **Measure. Track. Compare. Learn.** Explain
one observation, repeated measurement and history before the detailed controls.
Keep Explorer, descriptive period comparisons, manual performance context and
returning to original evidence central. The governing philosophy is: **Measure
changes. Preserve the evidence. Investigate relationships. Humans interpret.**
A relationship does not prove causation; consistency of recording is something to
inspect, not a validated repeatability promise.

`motionMeasurements` centralizes eight owner-approved public entries by view/event
and supplies both the product section and tutorial Analyze lists. Side View uses
Stride Length at Front Foot Contact, plus separate Front Leg Block and Trunk Tilt
results at Front Foot Contact and Ball Release. Back View uses 2D Lateral Trunk Lean
at Front Foot Contact and the unchanged shoulder/upper-arm and shoulder/wrist names
at Ball Release. Do not rename either arm result Arm Slot or merge view/event results.

The October 8 owner decision superseded the earlier website-only gate. The October 21
review confirms the same public names in accepted 1.2 (4). Presentation does not change
scientific identities, formulas or persisted records. The exact mapping is in
`MOTION_PRODUCT_REVIEW.md`; detailed methods remain at Settings → About → Measurements.
Write positive descriptions of what/when someone tracks and why repeat observations
help. Keep one short general technical note below the measurement section, rather
than caveats in every entry. Retained screenshots can show earlier labels; describe
them accurately and bridge the names in captions without altering captured evidence.

Tutorial additions belong within the existing ten modules; preserve every existing
hash and image link. Inspect Evidence teaches opt-in Pitch Review sharing, Saved
Pitches teaches Athlete/Pitch Notes, and Explore History teaches Reference Study
and Compare after personal history. Retained screenshots are earlier-build examples;
current written instructions govern labels and the All default.
Only supported manually recorded velocity/type/location/result are taught as
performance context. Reference Study/Compare remains deeper investigation after
the personal longitudinal story. Hitting inherits the philosophy, never guessed
hitting-specific events or measurements.

## Motion utility-page facts

October 6, 2026: the utility pages cover the accepted Motion 1.2 candidate's
Notes, manually entered Pitch Context, local Files/Reference acquisition, study
records, Saved Comparisons and explicit PDF/original-video sharing. This update
does not establish public App Store availability. Reference content remains
separate from personal analysis and sharing. Existing Apple, Gmail and website
handling and their retention limits remain unchanged.

`/privacy` and `/support` follow the source-audited Motion V1 drafts, with the
website/support audit recorded in `docs/WEBSITE_PRIVACY_AUDIT.md`. The marketing pages now describe the same current V1 product, with release
availability stated separately. Preserve these audited articles substantively. Preserve
the distinction between local app records, Apple/Photos/iCloud/backups/sharing,
website technical requests, external TestFlight access requests and support email. Never strengthen bounded app
claims into "data never leaves the device," secure erasure, or remote deletion.

Support is email-only through the central mailbox, using owner-confirmed Gmail
with the owner as the only human operator. The adopted policy is support/debugging
only: delete attachments within 30 days after resolution and threads within 90 days;
honor verified sender deletion requests. Necessary authorized athlete video is not
permission for public reuse. Preserve the provider/backup/sender-copy limits and
attachment-bearing-message handling in the approved text. Apple-provided reporting
is for operation/debugging/improvement, with no added app analytics/crash SDK,
advertising or profiling. Website logs are separate and their total retention
remains unknown. No SLA, embedded support form, tracking, cookie banner, account
or website database is needed. Do not invent broader deletion guarantees. Reaudit when behavior changes
and revise the effective date when the policy changes.

## Motion access link

Keep the public signup destination and all CTA wording in `motion.access`. Share
`https://asymmetri.co/motion/try`, which temporarily redirects to Google Forms;
the browser address changes after navigation. Keep the provider notice visible
and the iPhone/iOS requirement beside all three access buttons. Preserve product
learning links and the existing release statement. Do not add the redirect to the
sitemap or silently turn it into a permanent redirect.

The form requires first/last name, email, iPhone model/iOS and contact consent;
baseball role is optional. It is for invitations and beta follow-up, not marketing.
Responses stay in Google Forms and a private Google Sheet; names/email go to
Apple when an invitation is issued. Keep `/privacy#testflight-access` aligned with
that handling. Do not publish sheet/editor URLs, submit test personal data, or
activate outreach as part of a website link change. The October 21 policy update
adds this boundary without changing local app or support-retention practices.

## Voice

Use concise, observant, technically credible language.

Prefer:

- concrete sports-development situations;
- human outcomes before technology features;
- technology as an amplifier of coaching judgment;
- clear distinctions among observation, measurement, interpretation, and
  inference;
- claims supported by the repository audit.

Avoid:

- “revolutionary,” “game-changing,” or “unlock your potential”;
- generic “AI-powered” phrasing;
- inflated startup or enterprise language;
- claims that software replaces coaches;
- invented customers, partnerships, measurements, adoption, or outcomes;
- militaristic framing;
- em dashes and en dashes in public-facing copy. Prefer shorter sentences,
  commas with conjunctions, or colons where appropriate. Preserve normal
  hyphens in established compound words.

## Founder story and role clarity

Tell the public origin in first person where appropriate: a baseball coach and
division coordinator working with developing pitchers; slow-motion smartphone
video as the first experiment; frame-by-frame comparison of movement and timing;
small adjustments followed by repeated recording; and later affordable-sensor
experiments. Focus on evidence supporting coaching conversations and tracking
change over time. Do not turn an individual outcome into a broader performance
claim.

Motion uses phone video and on-device pose analysis to create inspectable
observations. Sensor experiments remain historical research. Coaches supply
judgment, context, experience and human understanding. Pitchers gain insight into their work. Parents receive appropriate
context so they can support development, never override or substitute for
coaches. Baseball and pitching development are the current public focus.

## Privacy and anonymity

Never name the private source sports organization in public content, metadata,
alt text, structured data, image filenames, product reconstructions, or URLs.

Do not publish:

- real athlete names, profiles, or histories;
- evaluation responses or coach notes;
- team, division, account, coach, or deployment identifiers;
- direct private-application screenshots;
- source repository names or application domains;
- unapproved photographs of identifiable groups or minors.

Do not publish family relationships or private circumstances as part of the
public founder story. Describe the work with players and pitchers without
identifying any individual.

Synthetic product visuals must remain clearly described as reconstructions.
The tutorial is an explicit, bounded owner-authorized exception for current Motion
pitching media within genuine screenshots. It does not authorize publishing profile
identity, unrelated Photos, system UI or screenshots from the private source app.

## Routes and navigation

Asymmetri `/` is a concise umbrella gateway: positioning, equal Sports/Labs division
cards and “Why Asymmetri” to About. Each card's heading and action open its division
page; the cards do not single out Motion or BotSquad. Product access remains in the
shared navigation/footer and division pages. `home` owns the hero and
division heading; the shared About origin label remains in use. Do not restore
product previews, philosophy, common-thread or contact sections here. Contact uses
the centralized mailbox; legacy `/#contact` reaches the footer email. Link to `/`
instead of the removed product-showcase fragment.
Sports `/sports` preserves story/approach/product/contact hashes and Motion access.
Labs `/labs` hosts open-source experiments; `botsquad` owns current implementation,
MIT/self-hosting/access facts. Sports/Labs disclosures expose direct product links.
About is the company page. Footer Motion labels remain explicit. `/sport` and
`/work` permanently redirect to `/sports` and `/labs`; old root fragments migrate
to Sports. Complete mappings live in `ARCHITECTURE.md`.

When adding or removing a
public route:

1. update the route under `app/`;
2. update navigation in `content/site.ts` if appropriate;
3. update redirects and `app/sitemap.ts`;
4. update metadata when appropriate;
5. update `README.md`, `docs/ARCHITECTURE.md`, and `docs/SITE_STRATEGY.md`;
6. verify the route at relevant responsive widths.

## Links and contact details

Do not duplicate the canonical URL or mailbox. Use the values exported from
`content/site.ts`. Confirm ownership and intent before changing either value.

External links must use secure HTTPS where available. Email links should use the
central public company mailbox; do not add personal contact information unless
the user explicitly requests it.

## Images and alt text

Use approved local assets and record provenance in `docs/ASSET_MANIFEST.md`.
Sports retains the privacy-reviewed pitching photograph and the
owner-approved Motion pitcher-family icon. The tutorial also renders the specifically owner-authorized current Motion
app captures and clearly labelled original instructional illustrations. Alt text
should describe the visible action and purpose without adding identity,
affiliation, or performance claims.

Decorative images should use empty alt text. Interface reconstructions need an
adjacent explanation and should not rely only on embedded image text.

## Editing checklist

- The statement is supported and assigned the right truth state.
- Shared values are centralized.
- The voice matches `docs/BRAND_STRATEGY.md`.
- Privacy and source anonymity are preserved.
- Metadata and structured data match visible content.
- Links, alt text, and route documentation are updated.
- Relevant checks in `docs/TESTING.md` have been run.


## Tutorial maintenance

Keep the ten stable module hashes and individual step IDs in `tutorial` stable when
editing prose. The footer, Support getting-started section and Motion workflow link
to `/tutorial`; it does not add primary-header clutter. The exact tutorial canonical
is `https://www.asymmetri.co/tutorial`; other route canonicals are unchanged.

Use authentic app screenshots for safely reachable software states. Use clearly
instructional generated illustrations for real-world physical actions that should
not be recreated solely for tutorial capture. Never generate fake controls, Results
screens or values. Crops may remove unrelated private content, but must not retouch
UI or evidence. Label every image with its source type and keep essential directions
in real page text. Profile fields can be taught without showing a private profile.

Normal public teaching uses the eight owner-approved view/event entries above,
with scientific limits separate from presentation. Side descriptors retain their
existing experimental scientific status. Preserve conditional HFR,
manual event confirmation, spatial subject selection, image-relative geometry,
non-calibrating setups/profile, descriptive history and local-data caveats. Match
new wording against current source and explicit owner decisions, including the
October 8 public naming override, not an old screenshot.
The coverage matrix and rationale for omitted dedicated screenshots are in
`TUTORIAL_REVIEW.md`; generation prompts and asset processing are in
`TUTORIAL_MEDIA.md`. The September 28 website-media disclosure is separate from these unchanged app
and tutorial facts.


## BotSquad and introduction videos

The `botsquad` content object owns the goal, worker model, reference team, current
capabilities, design principles, illustrative workflow, Asymmetri uses, setup steps,
technical facts, roadmap, human control and source links. Keep this small project-specific
structure; do not move product facts into JSX or turn it into a generic CMS.

Each `botsquad.team` worker includes a `portrait` with its local path, intrinsic
dimensions and alt text. The eight faces are fictional AI-worker illustrations,
not human staff photos. Keep names, roles and reporting relationships independent
of portrait appearance. See [the portrait generation record](BOTSQUAD_PORTRAITS.md)
and asset manifest when replacing or adding artwork.

Nix is the DevOps worker reporting directly to Atlas. The role and relationship
are verified in BotSquad `src/control/company.ts` and `src/runtime/codex.ts` at
`cb2fd43b8ffbec274df294f483d242a90385765e`. His card describes coordination with
human approval, without implying unrestricted infrastructure access. The four
Atlas branches use a desktop grid and a nested single column at 1100px and below.

`/botsquad` explains an open-source experiment in persistent AI teams. README/current
state/validation establish capability, the roadmap and Decision 026 establish current
focus and deferred ideas, and the white paper supplies design philosophy. Its older
status/numbering passages are superseded. The dated evidence map is
[BOTSQUAD_PAGE_REVIEW_2026-10-07.md](BOTSQUAD_PAGE_REVIEW_2026-10-07.md).

Always distinguish implemented workflows, current Personal Operator / Daily Driver work,
future possibilities and illustrative scenarios. The Hitting example has not been
performed; Hitting is now in development, and bounded Node engineering does not establish
Motion iOS build support. Asymmetri uses are reference experiments, not automatic external
authority. The actual pilot proved one supervised document action and scheduled review,
not app development, a merged release or business improvement.

BotSquad is MIT licensed and self-hosted. Worker identity/history outlives model sessions;
context is bounded and idle workers do not call models. Browser work requires explicit
grants and isolated environments; write acceptance is fixture-only. Current access uses
an SSH tunnel. Coordination state stays on the operator's host, while configured model
services may receive bounded context. No hosted login, native iOS or offline inference claim.

Only embed uploads published by `https://www.youtube.com/@Asymmetri`, centralized
as `youtubeChannel`. Motion uses the owner's selected `nEv9nJO83NM`
("Every Pitch, Together"), replacing the earlier official-channel selection
`KM4TESEzXxA` ("See Your Pitch More Clearly"). The selected publisher was
verified through YouTube's public publisher metadata on October 21, 2026. The
original Motion (`kaSatKC8HBg`) and BotSquad (`E5r_lOecC-M`) embeds belonged to the
personal channel and are removed.
No BotSquad introduction was visible on the official channel at that review;
`/botsquad#introduction-video` now provides a plain official-channel link. Verify
publisher identity before adding a replacement; do not substitute an unrelated
Motion video for BotSquad. A video is explanatory media, not authority for release/capability
claims. Motion displays its native player directly without autoplay; keep the
external fallback link and visible Google privacy notice. Embedding uses
`youtube-nocookie.com` and connects on page load, before Play; never describe it
as tracking-free. `/privacy#website-media` explains the boundary
and is not a general BotSquad privacy policy. Video coverage was introduced on
September 28, 2026; the October 22 policy date also reflects direct player
loading and retains the October 21 access form extension. Approved Motion/app and support-retention disclosures retain their meaning.

The two small Explorer images are synthetic design concepts, not current software
captures or a new-feature announcement. Preserve that distinction in alt text,
captions and adjacent prose. Never promote their mock values to product evidence.


## Protected Motion app and App Store resources

The owner explicitly requires these pages and links to survive company redesigns
and later website work. The redesign preserves every existing route unchanged:

| Resource | Stable URL | Dependency |
| --- | --- | --- |
| Motion Privacy Policy | `https://www.asymmetri.co/privacy` | Current iPhone Settings release link and App Store policy destination |
| Motion Support | `https://www.asymmetri.co/support` | Current iPhone Settings release link and release support resource |
| Motion tutorial | `https://www.asymmetri.co/tutorial` | Public product guide, stable modules/steps and original-image URLs |
| Motion product page | `https://asymmetri.co/motion` | Product information, tutorial and policy/support discovery |

Read-only review of the app's `Features/Settings/ReleaseLinks.swift` and
`ReleaseLinksTests.swift` confirmed the two exact www policy/support URLs on
September 28, 2026. No app source or App Store configuration was changed here.
Both apex and www must serve real policy/support pages. Footer links remain
explicitly labelled Motion resources, and contextual/mutual links remain intact.
Future approved moves must preserve compatibility for installed app versions;
coordinating a new app link alone does not retire the old destination safely.



## October 7 authority

[Company architecture and source review](COMPANY_ARCHITECTURE_2026-10-07.md)
supersedes older Labs-parent/Work/singular-Sport assumptions. BotSquad is an
experimental Asymmetri Labs project, not hosted SaaS. At that review, Investment/Ask were design-only and absent from public copy. INV-03
now implements a disabled experimental archive in source; the public site is unchanged
and Ask remains closed to public intake. Current umbrella name
references in Motion policy are updated to Asymmetri without changing handling,
retention, scientific or privacy commitments or the October 6 policy date.


## Division presentation

`divisions.*.label` provides the short Sports/Labs heading under the shared
Asymmetri name. `divisions.*.actionLabel` supplies the homepage's Explore Sports /
Explore Labs actions, each using `divisions.*.path`. Homepage metadata describes
both divisions without presenting one project as their complete portfolio.
Full names, direct product links elsewhere and statuses retain their
authority. Do not encode release status only in color. Sports and Labs share
the Graphite + Teal umbrella palette in CSS; Motion retains its product identity.
`site.metadata.themeColor` mirrors the graphite canvas for browser chrome.
Existing social exports and all public copy retain their approved contents.

## Investment evidence archive

`content/site.ts` owns `investmentArchive` copy. Exact version pages and discussion
records live under `/botsquad/trade`; these are experimental evidence views,
not a claim of live investment operations. Keep synthetic labels on unavailable
fixture states, sources/rights/limitations visible on permitted records, and safe
tombstones free of withdrawn titles/authors/content. Ask is not enabled. No published
experiment is the default until trusted server read configuration is explicitly set.

## Investment showcase copy and evidence

The HQ companion at `/botsquad/trade/hq-guide` begins with current UX-01
navigation and the supplied-text first-task exercise, then explains how an
operator examines schedules, work sessions, usage, decisions and publication.
`hqUxGuideFigures` owns five actual interface captures with isolated authored
sample records and fake-runtime responses. Each image identifies that boundary;
none establishes live employee or investment outcomes. The seven original
October 15 captures and incident remain clearly historical, with stable URLs
and source links. See [the synchronization inventory](BOTSQUAD_HQ_UX01_2026-10-16.md). Its
shared labels and metadata live in `hqGuide`; route-specific prose lives in its
article component. The two guides cross-link, with direct HQ-guide links from
the Trade introduction and archive/methodology navigation. Preserve ordered
investigation steps, code field names and the keyboard-scrollable record chain
and incident-note template.

The owner-requested `#tail-logs` section distinguishes the systemd service journal
from append-only employee audit records in SQLite. Preserve the SSH-alias
prerequisite, exact read-only commands, Ctrl+C behavior, UTC/local-time explanation,
and the difference between process readiness, stage progress and accepted decision
evidence. The October 15 renewal helper is an incident-specific operator utility,
not a permanent product command or a guarantee of current availability. Its dated
path and logical SSH alias are approved command examples; do not publish private
endpoints, keys, execution IDs, receipts, tokens or prompt text. Keep this later
addition separate from the screenshots' historical observation checkpoint.

The owner explicitly requested real Computer Use screenshots of HQ for this
public companion. Publish only reviewed crops that exclude private identifiers,
transcripts, credentials and access endpoints. Keep source labels as plain text,
not private links; disclose actual cropping and capture dates. These seven historical images show the actual former interface and its dated
operational checkpoint. The separately approved UX-01 captures show the actual
redesigned interface with explicitly authored sample data; do not confuse these
two evidence sources. Do not generalize
this approval to future raw HQ screenshots or expanded private receipts.

The technical guide at `/botsquad/trade/guide` explains the full Trade
experiment for readers with undergraduate computer-science knowledge. Shared
metadata and navigation labels live in `tradeGuide` in `content/site.ts`; the
article owns its route-specific explanation. Its contents links, glossary,
semantic diagrams and tables must remain useful without client JavaScript.
Trade, methodology/evidence, Research and the BotSquad overview link to the guide.
The guide follows Trade's noindex policy and does not change exact-run URLs.

Distinguish implemented architecture, the intended daily schedule and dated actual
outcomes. A completed discussion is not a submitted decision; a proposed HOLD is
not an independently reviewed and submitted HOLD. A benchmark allocation is not
a portfolio trade. Do not imply reliable daily autonomous trading from authored
tests, one completed valuation or a healthy server. Keep historical usage gaps,
spent attempts and missed deadlines visible in the explanation without publishing
private transcripts, credentials, operational identifiers or access instructions.

Guide screenshots are actual Computer Use captures of the public interface,
dated in their captions and recorded in `ASSET_MANIFEST.md`. Preserve their image
content and aspect ratios. Captures illustrate the recorded state; they are not
live status widgets. Never fill an empty public discussion with invented employee
contributions. Explain that private work and approved public publication are
different records. Keep the public guide independent of operational controls and
Ask activation.

`investmentShowcase` in `content/site.ts` owns the introduction, discovery link,
process explanation, methodology and disabled Ask copy. The October 14 owner request
removes the introductory “The team is the experiment” side panel and its supporting
paragraphs. Keep the opening headline, introduction and desk/methodology links in
a single column. The main Trade landing page uses a compact **Experiment Status**
summary: run state, data freshness, last publication and next published review.
Its status cannot establish current employee or trading activity. Retained-run
history, frozen settings and the close-amendment panel remain on exact-run pages
and evidence routes; they are omitted from the landing page without a replacement
disclosure panel. The portfolio shortens only the exact, known historical close
amendment limitation into its benchmark comparison convention and omits the
benchmark allocation details on this landing page. Other quality limitations,
financial values, raw exports, calculations and exact-run presentation stay intact.
Keep verified run status, unconfigured reads, verification failure and synthetic
demonstrations distinct. Do
not call an unavailable archive “not started.” Synthetic identities, prose,
financial values and content live only in `receiver/test/showcase-fixture.ts`; do
not copy them into operational content or label them as actual worker output.

Every public read is contract typed and scoped to an exact run. Artifact links use
verified versions; historical decision references remain historical after correction.
Unknown monetary values say “Unavailable”. Derived benchmark drawdown requires a
complete contiguous loaded series from valuation sequence 1 and usable benchmark
marks; missing peaks suppress that comparison. Source freshness never follows from
transport connectivity. On the main page, canonical freshness values map to
Current, Stale, Unknown and Market closed. A failed or unconfigured read says
“Unavailable”, including its dates. A verified status with no published date says
“Not published”; it does not imply an unconfigured private schedule. Summary dates
use readable UTC dates and times; exact evidence retains timestamp precision.
Detailed exact-run status still separates archive freshness from publisher
heartbeat receipt and retains the original reasons and context.
Snapshot session dates identify the session a record describes, not proof that a
market observation occurred. Null financial values and unknown activity remain
unchanged. Production Ask displays an exact ContextRef as a reference, not proof of current
visibility. It currently has no question form or visitor intake. `askExperience`
owns public status and synthetic disclosure copy; `approvedAskPrivacyNotices` is
empty until real disclosure facts are verified. Private ownership controls remain
separate from new-question availability. Keep provider/retention
promises conditional until actual configuration is verified.

INV-REAL-01 adds published run purpose/objective and frozen settings, explicit
observed-paper labels, owner-reported Yahoo confirmation and prospective OPEN
methodology. Describe market as-of, availability/retrieval and accounting times
separately. Show published source/valuation limitations; never turn nulls or a
missing valuation sequence into a result. The signed publisher supplies public
summaries; do not copy private transcripts or raw source bodies into the site.
See [the current handoff](INV-REAL-01-WEBSITE.md) for acceptance and release status.

## Dormant Ask visitor interface

[Ask copy and privacy boundaries](ASK-03-WEBSITE-UI.md) keep public availability,
future disclosures and local synthetic consent distinct. Exact record links are
references until visibility is checked. Do not put private question/session
identities in URLs or treat Motion privacy as an Ask policy.

## Ask subscription limits disclosure

`askExperience.privacy` describes the planned activity-capped subscription mode:
unknown operator cost, no verified dollar cap, monitored token thresholds that
can overshoot through provider retries, and admission holds for missing usage or
threshold breach. It does not state that the live receiver selected the mode.
`approvedAskPrivacyNotices` remains empty until actual provider/custody/retention
facts and genuine integration are reviewed for the advertised service/version.


## BotSquad areas and research hierarchy

Use Asymmetri Labs → BotSquad → BotSquad Research → BotSquad Trade.
Ask BotSquad belongs directly to BotSquad alongside Research and supports general
or contextual questions. `botsquadStructure` centralizes area labels and URLs;
`botsquadResearch` and `botsquadDirectory` own hub and overview copy. Add future
areas only when the owner defines them; do not invent placeholder projects.

The Labs card and global Labs menu open BotSquad. The menu contains Asymmetri Labs,
BotSquad and Campus and City; Research, Trade and Ask are reached within BotSquad.
Its area directory opens Research and Ask; Research opens Trade. Shared BotSquad
breadcrumbs and area links allow direct movement between them. Retain investment record URLs, exact-run links
and Ask context parameters. The hub describes research organization, not verified
worker activity or financial results; existing archive truth states still apply.

### Investment employee portraits

`investmentWorkerPortraits` in `content/site.ts` binds exact public roster worker
IDs to approved local `SiteImage` values. Atlas and Maya reuse the overview's
portrait objects. Add future mappings only for verified public worker identities
and approved assets, updating the asset manifest. Unknown IDs retain initials;
never derive an image URL from a worker name or trust a publisher-supplied URL.

## Investment method amendments

`investmentRecovery` centralizes the close-recovery explanation. Show a dated
amendment only from verified `PublicStatus.executionAmendment`, including on
methodology and evidence pages. Keep original frozen settings labelled separately.
Do not infer a completed trade from an amendment, present the missed OPEN as
executed, or reconstruct missing historical employee usage/cost. Decisions keep
their own rationale/review; valuations keep limitations and benchmark allocation
proof. See the [October 14 packet](INVESTMENT_CLOSE_RECOVERY_2026-10-14.md).

## BotSquad Trade naming

Use **BotSquad Trade** for the project and **Live Trading Desk** for its desk
heading. `botsquadStructure` supplies BotSquad's area navigation and breadcrumb labels;
`investmentShowcase.deskTitle` supplies the exact desk heading. Use trade/trading
in website-authored descriptions and accessible labels. Preserve existing
`/botsquad/investment` URLs and technical identifiers. Do not rewrite immutable
publisher-authored records, titles or evidence to match a marketing rename.


## Trade URL compatibility

The October15 owner-approved migration makes `/botsquad/trade` canonical for the
whole public page/read/download family. Author new navigation and Ask evidence
links with that prefix. Preserve `/botsquad/investment` links through permanent
same-suffix redirects, including exact-run query values and browser fragments.
Keep dated screenshot `source` URLs and immutable archived Markdown/bytes as
recorded; they remain valid through redirects. API namespaces, image URLs and
technical investment identifiers are unchanged. See the [migration contract and
rollback plan](BOTSQUAD_TRADE_URL_MIGRATION_2026-10-15.md).

## GIS Apps

Asymmetri Labs groups Vancouver, City in Progress; Surrey, City of Adventure; and Richmond Learns to Drive under **GIS Apps**.
`gisApps` in `content/site.ts` owns `/labs/gis`, its metadata, city cards and
reconstruction explanation. The Labs submenu uses **Campus and City** for the
unchanged `/labs/gis` destination. The hub title, Labs category card and footer
retain **GIS Apps**. The Labs menu and Labs category card open this hub;
city cards reuse the existing project names, statuses, descriptions, source and
licence links. Footer city shortcuts remain available alongside GIS Apps.
City display names, GIS descriptions and limitation headings derive from the
shared identity fields. Surrey metadata and game accessibility labels reuse its
shared name; the shorter Play Surrey action avoids repeating the full title.
Naming corrections do not change paths, versioned data, save keys or game behavior.

This is a navigation grouping, not a URL migration. Keep `/labs/vancouver`,
`/labs/surrey`, their canonical URLs, hashes, source links and versioned public
data/asset paths unchanged. No redirects or nested replacement city routes.

Explain public GIS layers, local metre coordinates, pavement construction,
footprint extrusion, height provenance, original procedural scenery and geometry
checks. Keep historical/illustrative heights, flat terrain, stylized architecture,
view-only Vancouver bridges and Surrey fiction visible. The project READMEs and
source manifests are the evidence; do not imply a current survey, exact replica,
real-world routing, City affiliation or real crime data. Coordinate shared-copy
changes with the Greater Vancouver GTA project's Vancouver and Surrey work.

## Vancouver

`content/site.ts` owns Vancouver identity, metadata, Labs card and navigation links.
The GIS Apps card uses `vancouver.navLabel` ("Vancouver, City in Progress"); the project
name and existing `/labs/vancouver` URL remain Vancouver. The Labs submenu opens GIS Apps.
`projects/vancouver/places.ts` owns the six original, source-backed place summaries
and review labels. The route owns experimental notices, dataset attribution and
no-JavaScript descriptions. Never present illustrative heights, flat terrain, old
footprints or proposed future features as surveyed/current/implemented facts.
Refresh the review date only after checking the sources. Do not reuse source-page
photos or renderings under the code licence. Vancouver is independent of the City
and political parties. BotSquad's nested hierarchy and Sports remain intact.

Vancouver's current status is V0.5 — Experimental. UI controls and help live in
`Explorer.tsx`; the street HUD uses source street names. New data notices must
identify illustrative street widths, clearance trims and the decorative
promenade as well as estimated heights. Expand city view means a full-window
dialog, without a promise of native browser fullscreen. Preserve the project
name, source links and “Vancouver, City in Progress” GIS Apps card wording.

V0.4 distinguishes 18 NRCan February 2013 LiDAR maximum roof heights, 102 City
2009 heights and 316 illustrative heights. None is described as current survey
data; retained footprints are from 2015. Free roam is the primary start, three
additional routes require manual steering, and relaxed pace does not steer.
Scenic-loop and roadside navigation labels describe only the simulation. Cruise is optional and manual
input takes over. Bridges are explicitly view-only in the HUD and minimap.

V0.5 phone copy describes Menu as the place for map/routes/settings; opening it
pauses the car. Pace labels disclose Relaxed 22 km/h and Normal 68 km/h. Playable
area means the bounded False Creek model, not all Vancouver. The elevation proof
is development-only and synthetic. Do not advertise Cambie traversal, physical
mobile acceptance or a measured reduction in curb contacts without evidence.

## Surrey, City of Adventure

`surrey` in `content/site.ts` owns the Labs project entry, label, route, release
status, metadata and source/licence links. Route-specific fiction disclosure stays
visible below the prominent game. Quest dialogue belongs to the pure Surrey
simulation. All incidents/characters are fictional; do not use real crime claims,
attach wrongdoing to actual businesses or treat homelessness as a threat signal.
V0.2 completes the sealed-case mystery and preserves the backpack mission. Story
and encounter data live in `story.ts` and `encounters.ts`. All cast members are
fictional adults. Mature dialogue is optional and off by default; do not imply
sexual acts, drug transactions, real crime data or actual business wrongdoing.
Keep browser-local save/no-upload and stylized architecture disclosures visible.

Surrey V0.3 is **City Reconstructed**, retaining **Surrey, City of Adventure**.
Use **Street Adventure** and **Aerial Explore** consistently. Both buttons remain
visible; mobile Menu reveals status, map, journal, settings and help. Keep touch
guidance primary on phones, with a short first-use explanation that does not reset
progress. Describe source road polygons, active curbs/medians and park paths, but
retain explicit inferred corridors and illustrative crossing stripes. Building
height units are verified as metres; all retained values are source-matched, with
unknown survey dates/methods. Flat terrain is a documented datum-related fallback.
The current source link is `/surrey/v0.3-2026-10-30/manifest.json`; never replace
published V0.1 bytes. Architectural detail is original artistic reconstruction.


## Surrey V0.4 — Living Surrey

Surrey is V0.4 — Living Surrey, with three complete fictional cases, a day/night city and explicitly unresolved terrain datum. Keep its renamed public name and GIS Apps route. Do not describe desktop viewport tests as physical iPhone acceptance. Centralized content remains in `content/site.ts`.

## Richmond Learns to Drive

Use the `richmond` identity in `content/site.ts` for names, tagline, status, route,
source, coverage guide and provenance links. The approved route is `/labs/richmond`,
listed through `gisApps.projects` on Labs and GIS Apps, with the existing category
menu and footer shortcut. Preserve the approved Vancouver and Surrey names/URLs.
V0.1 is a **playable preview**, not a surveyed digital twin or real driving course.

The title concerns the fictional courier learning city driving. Money, people,
customers, businesses used for interactions, incidents and interiors are fictional.
Do not associate threats with demographic identity or real neighbourhood safety.
Traditional Chinese core labels and courtesy lines are authored; longer help is
English. Open Airfield is an immediately available fictional sandbox, not real
airport access or security guidance. Report source footprints separately from
illustrative heights/façades and original interiors. OSM-derived data is ODbL;
original code/procedural models are MIT. Physical-phone performance must not be
claimed from browser viewport emulation.

## Surrey V0.5 copy

`content/site.ts` owns the On the Move status, metadata and manifest link.
`projects/surrey` owns authored Case04 dialogue and controls. State the bounded
Central Avenue / City Parkway driving area and unavailable train boarding; do not
imply citywide routing or measured terrain. Four fictional cases and browser-local
saves are current capabilities. Physical-phone acceptance remains outstanding.

## Surrey V0.6 candidate copy

Open Roads is candidate copy on the isolated feature branch. V0.5 remains public
until acceptance/deployment. Keep **Surrey, City of Adventure**, `/labs/surrey`
and the GIS Apps grouping. The candidate implements 17.0 km of unique connected
road paths, eight roadside destinations and five fictional cases. Describe
roadside stops accurately, with no promise of legal parking or direct landmark
entrance access. Workzones and signal timing are fictional; terrain stays flat,
only one compact footprint is accepted, and train boarding remains unavailable.
The source link points to `/surrey/v0.6-2026-10-30/manifest.json` in this candidate.

## UBC campus information

Shared project identity and the GIS card live in `content/site.ts`. Reviewed UBC
places, displays, biographies, official URLs, verification dates and conversation
topics live in `projects/ubc/registry.ts`. Never duplicate these claims in scene
geometry. Named figures are educational simulations, not quotes, endorsements or
real-time positions. Keep Level B reconstruction and exterior-only coverage labels
visible. Public photographic references are not redistributed assets.

Orchard Housing facts and fictional student dialogue live in
`projects/ubc/residence-content.ts`, imported by the registry. Keep sourced facts
distinct from illustrative rooms. Maya, Leo and Ari are fictional guides, not real
residents, testimonials or live representatives. Refresh official sources/dates
together. The courtyard entry is geographically sourced, not the measured main
front-desk entrance. No live prices, availability, assignments or booking.

## UBC character discovery

Do not publish a character roster in campus search, maps, floor guides or landing
copy. People introduce themselves in a proximity-triggered conversation. Keep
identity/source records and simulation disclaimers inside that conversation,
with no Find or route-to-person action. This supersedes the earlier named-directory
requirement; historical release reports remain evidence of their original builds.

UBC V0.3 distinguishes professional-source summaries, season-specific roster entries,
historical/alumni guests and participant-written self profiles. People are never
listed in the destination directory or map. Preserve encounter-only identity,
source dates and simulation disclosures. Do not describe partial faculty coverage
as all UBC personnel, roster entries as live eligibility, or a reconstructed Nest
fair as the announced 2027 event. Do not copy portraits, logos, student work or
private-room information. [Scope and sources](UBC_CAMPUS_LIFE_V03.md).

UBC conversations now begin with choices, rather than a biography page. Identity
is revealed through the introduction action; biographies, permissions and source
links remain available inside the encounter. Original social scripts are labelled
as simulations, while factual answers remain the reviewed registry text. Public
profile topics remain participant-written and are never represented as live chat.
Multipart building names are grouped by source ID, never by name alone; directory
addresses and footprint counts distinguish legitimate complexes.

Character `introduction` is spoken copy, separate from `title`, `biography`,
`permissions` and `disclaimer`. Use brief first-person factual paraphrases and
natural social replies; these remain explicitly scripted, never authentic quotes.
Do not concatenate provenance or implementation notes into speech. Keep those in
About this simulation with sources/dates. Preserve athlete roster years and user-
authored profile answers; never infer a community member’s university appointment
from an optional interest area. Complete typed greetings/identity questions share
the button actions; unsupported personal claims receive a short honest response.

## UBC gateway, Beaty and Irving coverage

Describe the current supported coverage as nine building interiors, all Level B:
Rose, Bookstore, Nest, Sauder, Hennings, War Memorial Gym, Orchard, Beaty and Irving.
Keep outdoor sports venues separate from this count. The new start is the
University Boulevard/Wesbrook pedestrian island by the silver UBC letters.
`gateway-layout.ts` records its source island and the limits of the interpreted
letter placement; do not describe the model dimensions as surveyed measurements.

Beaty information distinguishes the real approximately 26 m specimen from the
original virtual skeleton. The glass pavilion, north doorway, descending ramps
and lower public gallery are supported; collection cases and bone geometry are
representative. Its runtime anchor follows the pavilion source part, not the
adjacent research wing. Do not imply a complete museum inventory or research-lab
access. Irving copy may describe the public atrium, Chapman hall and Ridington
reading room/mezzanine, with four connected levels. Its 2019 map is reference
material, not confirmation of current room names, assignments or access. Floor
heights, exterior steps and campus grade remain approximate in both additions.
Keep official visitor links and reconstruction notes in `registry.ts`; source
photographs and artworks remain references, not redistributable scene assets.

The outdoor athletics scope is Ken Woods, Harry Warren and South Turf soccer,
Rashpal Dhillon Track and the existing Thunderbird Stadium. Do not describe other
nearby venues as newly detailed. Keep published field measurements separate from
South Turf's estimated markings and reconstructed track/stand fixtures. Practice
players and joggers are fictional; venue information does not indicate live
occupancy, an event schedule or real access. Distinguish the existing stadium from
replacement proposals, and use plain names/original geometry without copied marks
or stadium artwork.

## Case Western Reserve campus

Shared card/metadata copy belongs to `content/site.ts`; the route is `/labs/cwru`. Destination descriptions and source links live in `projects/cwru/registry.ts`; per-building evidence and reconstruction limits live in `architecture-sources.json`. Public-source people records live in `data/people.json`. Preserve the distinction between verified public affiliation and simulated appearance, dialogue and movement. LinkedIn records are indexed excerpts with blocked direct access, not independently verified current enrollment. Do not imply real-time locations, dorm assignments, university endorsement, exact floor plans or photorealistic likenesses. The static roster has 13 faculty, eight retained athlete records and 507 students, plus one fictional guide (528 distinct named public-source people). `data/students.json` contains the 500-row sanitized research import; five existing records are enriched, not duplicated. `data/student-source-audit.json` records public-page checks and fallback roster sources. All supplied names were corroborated; 434 study fields were found on source pages and the remaining 66 retain provided-research attribution. Page presence is not current enrollment verification. Never import the research contact columns. `tools/import_students.py` is the reproducible allowlisted importer; `student-roster.ts` owns simulated study districts, factual study replies and fictional appearance. Player-written public profiles are separately labeled as self-described and unverified. Halloween includes 16 original costume types; spell the hopping Chinese undead creature “jiangshi.”
