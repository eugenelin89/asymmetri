# Prompt 017: Refresh Motion artwork

- Date: 2026-09-16
- Scope: design
- Goal: Make the website's Motion identity match the app's current approved artwork.

## Original user request

> the artwork on the app changed. please update the website accordingly.

## Scope

Motion artwork on the homepage, product hero and product social metadata, plus
alt text and affected current documentation. This corrects the website update
published earlier in the same conversation. The existing DigitalOcean deployment
authorization and owner-approved use of production Node 22 remain applicable.
The Motion repository remains a read-only reference.

## Decisions

Current Motion Decision 52 and release-brand documentation supersede the previous
A Release icon. Adopt the packaged default PNG: an illustrated high-knee windup
pitcher and asymmetric teal arc. It is generated raster artwork, not editable
vector geometry. No model call, product build or export was performed.

Use a new public filename for both page placements and social metadata, avoiding
the old artwork's cache key. Retain the former SVG/PNG as unreferenced historical
identity variants. The app's Back/Side capture-card images have no existing
website placement and are not added speculatively.

## Implementation

Copied the app's default 1024-square icon byte-for-byte to
`public/brand/motion-pitcher.png`; updated the central image URL, description and
social-image URL. Existing page composition and CSS handle the new image.

## Engineering impact

No component, layout, dependency, runtime, product capability, navigation or
privacy-policy change. Next.js supplies optimized page images; social consumers
receive the packaged PNG. No new client JavaScript, collection or private media.

## Files changed

- Shared content: current icon, descriptive alt text and social preview path.
- Public assets: new packaged pitcher-family icon; original variants retained.
- Current guidance: asset manifest, architecture, content guide, product review,
  site strategy and visual identity updated for the current raster artwork.

## Documentation updated

The asset manifest records exact source/master paths, accepted decision, source
snapshot, generation provenance, dimensions, processing, hash and publication
assessment. Other current documents now distinguish the pitcher family from the
superseded A Release artwork. Historical prompt records remain unchanged.

## Git diff summary

Implementation: 8 files changed, 49 insertions and 14 deletions, plus a
1,022,578-byte PNG included in those eight files. No application layout or
dependency files changed. This journal is excluded from the totals.

## Verification

- Clean `main` at `b6d737c5bd6430524377235b11c8e948b37ff791`; fast-forward pull
  succeeded before edits. Node 24.10.0 matches `.nvmrc`; nvm unavailable.
- TypeScript/ESLint, standard Next.js build, Vinext build and whitespace checks
  pass. Existing Vinext static-classification notice remains informational.
- Copied asset matches the source and its manifest SHA256 exactly:
  `d0a00a3991990aefd499a50c6cf0d69d51e1ef9d52a2fc3820c0cb321b98aa56`.
- Local production HTTP checks pass for all four pages, internal links/anchors,
  metadata, social image, assets, sitemap, robots and legacy redirects. The
  optimized 256px image returns 200 and is 12,789 bytes in the inspected response.
- Mobile, tablet and desktop browser review confirms loaded artwork, square
  proportions, unchanged corner masking, alt text and no horizontal overflow at
  supported widths. Product hero and small homepage placement reviewed visually.
  No browser console errors. Skip link focuses main; visible focus remains.
  Existing reduced-motion CSS is unchanged and reviewed.
- Privacy/prohibited-reference scans pass. Utility content is byte-identical to
  its preceding committed export. Company photograph, logo, favicon and public
  product claims are unchanged. No Motion source file was modified.
- Production dependency audit retains four existing findings: one critical,
  two high and one moderate. No dependency remediation is included.

## Repository state after implementation commit

`main` at `ebb28314023e27bea5df620aa93fffe600b4a61e`, clean before creating this
record and one commit ahead of `origin/main`. No unrelated changes, new branch,
worktree or pull request. Deployment follows the two commits; final production
verification is reported in the conversation after it occurs.

## Implementation commits

- `ebb28314023e27bea5df620aa93fffe600b4a61e` — Refresh Motion website artwork to match the app.

## Archive commit

`Record Motion artwork refresh journal`

## Lessons learned

An old source SVG can remain in the app repository after the packaged identity
changes. Check current accepted decisions and catalog exports before selecting
artwork, and update provenance when the source changes from vector to raster.

## Follow-up ideas

Existing release and dependency follow-ups remain separate. No additional
artwork or product feature is proposed by this correction.
