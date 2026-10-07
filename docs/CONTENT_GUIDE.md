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
`labs.projects` reuses BotSquad facts. Concept captions, videos and URLs stay centralized.

Page files under `app/` own narrative sequence and route-specific connective
copy. Components should focus on presentation and should not quietly introduce
new product claims.

## Product truth states

Every product or research statement must fit one of these categories:

### Current verified product capability

Motion V1 behavior verified in current implementation and accepted decisions:
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

Pitching V1.2 is implemented and preparing for distribution, not publicly released.
Hitting and Team are approved roadmap work with no active implementation plan at
the October 7 review. Use Planned, not In development. `productStatusLabels` supports
all four states; future status changes require new evidence. Final Store names are
not fixed by the family roadmap. Update `motionFamily` names/statuses centrally.

Team is one professional app with Pitching/Hitting/Baseball entitlements over the
same account, organization, roster, Athlete identities and Cloud data. Team requires
Cloud with finite quota-aware storage; the local-first pitching policy does not
cover that future service. Enterprise and deeper Mechanics Lab follow Hitting/Team.
No launch dates, prices, quotas or unimplemented science are advertised.

Current V1.2 marketing includes Notes, manually entered context, Reference Study,
Compare With My Pitch and explicit review sharing. These do not infer Reference
measurements or improved performance. See the October 7 source review.

Current code/tests take precedence, followed by accepted decisions, current
product/release documentation, roadmaps and dated white papers. Decision 50 hides
five stored measurement families from normal V1; use “available projected 2D
measurements” rather than the white paper's older all-eleven claim. Read
`MOTION_PRODUCT_REVIEW.md` for the dated audit and maintenance rules.

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
website technical requests and support email. Never strengthen bounded app
claims into "data never leaves the device," secure erasure, or remote deletion.

Support is email-only through the central mailbox, using owner-confirmed Gmail
with the owner as the only human operator. The adopted policy is support/debugging
only: delete attachments within 30 days after resolution and threads within 90 days;
honor verified sender deletion requests. Necessary authorized athlete video is not
permission for public reuse. Preserve the provider/backup/sender-copy limits and
attachment-bearing-message handling in the approved text. Apple-provided reporting
is for operation/debugging/improvement, with no added app analytics/crash SDK,
advertising or profiling. Website logs are separate and their total retention
remains unknown. No SLA, form, tracking, cookie banner, account or database is
needed. Do not invent broader deletion guarantees. Reaudit when behavior changes
and revise the effective date when the policy changes.

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

Asymmetri `/` introduces Sports and Labs, with `#products` and company `#contact`.
Sports `/sports` preserves story/approach/product/contact hashes and Motion access.
Labs `/labs` hosts experimental projects; `botsquad` owns current implementation,
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

Normal V1 teaching enumerates six supported results, with scientific limits separate
from availability. Side descriptors remain experimental. Preserve conditional HFR,
manual event confirmation, spatial subject selection, image-relative geometry,
non-calibrating setups/profile, descriptive history and local-data caveats. Match
new wording against current source and accepted Decision 50, not an old screenshot.
The coverage matrix and rationale for omitted dedicated screenshots are in
`TUTORIAL_REVIEW.md`; generation prompts and asset processing are in
`TUTORIAL_MEDIA.md`. The September 28 website-media disclosure is separate from these unchanged app
and tutorial facts.


## BotSquad and introduction videos

BotSquad is MIT licensed, open source and self-hosted. Persistent logical workers
have durable identity/context and bounded execution, not continuous inference or
unlimited memory. Current browser access uses a tunnel. Native iOS/no-tunnel access is deferred; the current focus is Personal Operator reliability and daily use. Distinguish
host-local coordination state from task context sent to configured model services.
See `PORTFOLIO_REDESIGN.md` for exact reviewed revisions and source precedence.

Use the owner-corrected English BotSquad video `E5r_lOecC-M` and Motion video
`kaSatKC8HBg`. A video is explanatory media, not authority for release/capability
claims. Keep local posters, deliberate loading, external fallback links and the
visible Google privacy notice. Optional embedding uses `youtube-nocookie.com`;
never describe it as tracking-free. `/privacy#website-media` explains the boundary
and is not a general BotSquad privacy policy. The effective date is September 28,
2026; approved Motion/app and support-retention disclosures retain their meaning.

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
experimental Asymmetri Labs project, not hosted SaaS. Investment/Ask BotSquad remain
design-only and are intentionally absent from public copy. Current umbrella name
references in Motion policy are updated to Asymmetri without changing handling,
retention, scientific or privacy commitments or the October 6 policy date.
