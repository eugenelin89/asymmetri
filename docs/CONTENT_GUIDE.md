# Content guide

## Source of truth

Shared public content lives in `content/site.ts`. Update that file for:

- company name and positioning;
- canonical URL and public contact mailbox;
- navigation and footer links;
- page title and description;
- founder story, pitching focus, and current product positioning;
- the `motion` product structure, release state, platform, workflow, limitations,
  privacy summary, icon and social image;
- approved image paths and alt text;
- closing calls to action;
- Motion Privacy Policy and Support content in `motionPages`, including the
  effective date, section IDs, metadata, contact labels and mutual links.

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

### Future direction

Unimplemented concepts such as Cloud/accounts, multi-athlete/team workflows,
companion capture, whole-delivery replay, velocity/outcomes and automated coaching
must not become present-tense claims. No future feature inventory is needed on
the product page.

Current code/tests take precedence, followed by accepted decisions, current
product/release documentation, roadmaps and dated white papers. Decision 50 hides
five stored measurement families from normal V1; use “available projected 2D
measurements” rather than the white paper's older all-eleven claim. Read
`MOTION_PRODUCT_REVIEW.md` for the dated audit and maintenance rules.

## Motion utility-page facts

`/privacy` and `/support` follow the source-audited Motion V1 drafts, with the
website/support audit recorded in `docs/WEBSITE_PRIVACY_AUDIT.md`. The marketing pages now describe the same current V1 product, with release
availability stated separately. Preserve these audited articles substantively. Preserve
the distinction between local app records, Apple/Photos/iCloud/backups/sharing,
website technical requests and support email. Never strengthen bounded app
claims into "data never leaves the device," secure erasure, or remote deletion.

Support is email-only through the central mailbox. No SLA, form, analytics,
tracking, cookie banner, account, or database is needed. Do not invent server-log
or email-retention periods, mailbox providers or deletion guarantees. Reaudit
when behavior changes and revise the effective date when the policy changes.

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

## Routes and navigation

The homepage follows `#story`, `#approach`, `#product`, then `#contact`. Product is
the final substantive section before the contact close, with the eyebrow
“Product” rather than “Our first product.” Primary navigation follows that order
and uses root-relative anchors from every route. `/motion` is the detailed
product page, reached through “Explore Asymmetri Motion” in `#product`.
Privacy and Support are separate indexed utility
pages with quiet footer links, mutual article links and contextual product links. Former secondary routes
redirect permanently. When adding or removing a
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
The current site renders one privacy-reviewed pitching photograph and the
owner-approved Motion pitcher-family icon. No app-interface capture is published. Alt text
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
