# Prompt 004 — Simplify and refocus the website

- Date: 2026-07-29
- Scope: design
- Goal: Refocus the public site on Asymmetrico as a sports technology company, with baseball as its first proving ground.

## Original user request

> # Simplify and refocus the Asymmetrico website
>
> You are working in `https://github.com/eugenelin89/asymmetri`.
>
> The repository already contains a redesigned Asymmetrico website. Your task is to revise that existing website—not start over blindly—so that it becomes simpler, clearer, more memorable, and less content-heavy.
>
> The website should tell the world one main thing: Asymmetrico is a sports technology company. The company begins with baseball, but it should have the potential to expand into other sports. Do not make the website feel like a product landing page. Do not make the website revolve around a product called “Asymmetrico Platform.” Do not introduce a replacement formal product name at this stage. The company and its mission are the story.

The attached request further required a six-section homepage centred on access,
mission, baseball, asymmetric advantage, and a concise closing; a four-route site;
removal and redirection of the standalone product and name-explanation pages; a
natural account of built software, experimental sensing/biomechanics work, and
future direction; a concise About and Work structure; strong privacy and source
anonymity; restrained use of the existing identity and authentic assets; revised
metadata and social preview; full documentation updates; dependency installation,
build and accessibility validation; prohibited-reference scans; commits, push, a
pull request, and a detailed final report.

## Scope

Revised all public routes, navigation, central content, metadata, shared styling,
social preview, route redirects, and the documentation affected by those changes.
The existing brand mark, deployment stack, contact model, and strongest approved
baseball/research assets were preserved. No dependencies or server-side features
were added.

## Decisions

- Selected “Better tools for an uneven playing field.” as the single hero headline.
- Selected “Baseball is where we begin” as the clearest starting-point language.
- Reduced the public architecture to Home, Work, About, and Contact.
- Folded the name story into About and the built-software evidence into Work.
- Used Built, Research/experimental, and Direction as explicit truth states.
- Replaced the prior social card while retaining its stable public path.
- Preserved the logo and removed only an unused research asset and obsolete,
  product-heavy components.

## Implementation

The homepage now has six substantial sections and approximately 330 visible words.
Work describes athlete-development software without a formal product identity,
labels its synthetic reconstruction, and distinguishes deployed evidence from
experimental measurement research. About connects the access mission, baseball,
and the company’s practical physical-system origin. Permanent redirects preserve
the two removed URLs. Styling was reduced from a campaign-like chapter system to a
single editorial rhythm with larger imagery, fewer cards, Ink/Canvas dominance, and
restrained Clay accents.

## Engineering impact

The public route count fell from six to four. Four obsolete editorial components and
two route implementations were removed. The site remains server-rendered, typed,
responsive, keyboard accessible, reduced-motion aware, privacy-conscious, and
compatible with both Vinext and standard Next.js builds. No runtime dependency,
tracking, form backend, persistence, or client JavaScript was introduced.

## Files changed

- Public application: homepage, Work, About, Contact, layout metadata, sitemap,
  redirects, shared content, metadata helper, and global styles.
- Removed application code: standalone name page, named-product case study, and four
  product-heavy editorial components.
- Assets: replaced the social card and removed one unused attention-map image.
- Documentation: onboarding, architecture, content, testing, brand, site, visual,
  and asset guidance.

## Documentation updated

`README.md` and the brand, site, visual, asset, architecture, content, and testing
documents now describe the four-page company-first architecture, baseball starting
point, unnamed work, legacy redirects, leaner asset selection, truth states, and
approximately 330-word homepage.

## Git diff summary

Implementation commit `7499bb6` changed 26 files with 282 insertions and 4,270
deletions. It removed two routes, four obsolete components, and one unused image;
then consolidated the public content, visual system, metadata, social preview, and
documentation around the sports-technology positioning.

## Verification

- Installed dependencies under Node 24 from `.nvmrc`.
- `npm run check` passed TypeScript and ESLint without warnings after making image
  alt props explicit.
- `npm run build` passed the Vinext production build.
- `npm run build:next` passed and statically generated all four public routes.
- `npm audit --omit=dev` reported zero production vulnerabilities.
- `git diff --check` passed.
- Local requests returned 200 for all retained routes and assets and 308 for both
  legacy redirects.
- Rendered HTML metadata, homepage word count, and prohibited public references were
  checked. No prohibited reference was found.

## Repository state after implementation commit

Branch `work`, implementation commit `7499bb6`, with only this journal record
uncommitted. The local branch will be pushed after the archive commit.

## Implementation commits

- `7499bb6` — Simplify Asymmetrico around sports technology

## Archive commit

`docs: archive website simplification prompt`

## Lessons learned

The strongest company story emerged by removing product taxonomy and repeated
explanation, then letting one headline, two baseball photographs, and clearly
labelled evidence carry the argument. Future additions should earn their place
within the four-page architecture rather than reintroduce feature-led chapters.
