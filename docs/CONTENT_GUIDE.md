# Content guide

## Source of truth

Shared public content lives in `content/site.ts`. Update that file for:

- company name and positioning;
- canonical URL and public contact mailbox;
- navigation and footer links;
- page titles and descriptions;
- company mission and exploration themes;
- approved image paths and alt text;
- research disclosures;
- closing calls to action.

Page files under `app/` own narrative sequence and route-specific connective
copy. Components should focus on presentation and should not quietly introduce
new product claims.

## Product truth states

Every product or research statement must fit one of these categories:

### Emerging or experimental

Work that has credible technical evidence but is not presented as a mature
commercial product. This includes affordable sensing, pitching biomechanics,
movement-signal analysis, and physical-system prototyping.

### Future direction

Ideas or intended areas that are not presented as shipped capabilities, such as
broader video-derived information, cross-source profiles, intelligent
development support, and additional sports.

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
- militaristic framing.

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

Synthetic product visuals must remain clearly described as reconstructions.

## Routes and navigation

When adding or removing a public route:

1. update the route under `app/`;
2. update navigation in `content/site.ts` if appropriate;
3. update `app/sitemap.ts`;
4. add route-specific metadata;
5. update `README.md`, `docs/ARCHITECTURE.md`, and `docs/SITE_STRATEGY.md`;
6. verify the route at relevant responsive widths.

## Links and contact details

Do not duplicate the canonical URL or mailbox. Use the values exported from
`content/site.ts`. Confirm ownership and intent before changing either value.

External links must use secure HTTPS where available. Email links should use the
central public company mailbox; do not add personal contact information unless
the user explicitly requests it.

## Images and alt text

Use approved local assets and record provenance in
`docs/ASSET_MANIFEST.md`. Alt text should describe the relevant visible content
and purpose without adding identity, affiliation, or performance claims.

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
