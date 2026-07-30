# Content guide

## Source of truth

Shared public content lives in `content/site.ts`. Update that file for:

- company name and positioning;
- canonical URL and public contact mailbox;
- navigation and footer links;
- page title and description;
- founder story, pitching focus, and exploration thesis;
- approved image paths and alt text;
- closing calls to action.

Page files under `app/` own narrative sequence and route-specific connective
copy. Components should focus on presentation and should not quietly introduce
new product claims.

## Product truth states

Every product or research statement must fit one of these categories:

### Emerging or experimental

Work that has credible technical evidence but is not presented as a mature
commercial product. This includes affordable sensing, pitching biomechanics,
movement-signal analysis, smartphone-video comparison, and AI-assisted pattern
identification.

### Future direction

Ideas or intended areas that are not presented as shipped capabilities, such as
more automated pitch comparison and clearer longitudinal development support.

Do not blur the labels or turn future direction into present-tense product
claims.

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

Cameras and sensors capture evidence. AI may identify patterns and surface
relevant information. Coaches supply judgment, context, experience, and human
understanding. Pitchers gain insight into their work. Parents receive appropriate
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

The public narrative is one page with `#story`, `#approach`, and `#contact`
anchors. Former secondary routes redirect permanently. When adding or removing a
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
The current site renders one privacy-reviewed pitching photograph. Alt text
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
