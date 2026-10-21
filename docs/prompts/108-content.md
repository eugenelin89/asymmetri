# Prompt 108: Motion TestFlight access link

- Date: 2026-10-21
- Scope: content
- Goal: Connect the Motion and Sports pages to the approved access-request form through a stable branded URL.

## Original user request

> proceed

The immediately preceding user question was:

> Should I put a link to the form on the website? Should there be a page dedicated to this form perhaps thru redirection so I have a cleaner URL?

The approved proposal was a temporary `/motion/try` redirect to the already-created
Google Form, with Request TestFlight access buttons near the top and bottom of
Motion and in the Sports product section. The earlier form request called for
professional presentation, the Asymmetri Sports website and the official Motion
video, and required details for later TestFlight invitations. The form and private
response workbook were created separately; their editor and private storage URLs
are intentionally absent from this public repository.

## Scope

Website redirect, three access actions, provider/eligibility notices, privacy
disclosure and documentation. No website deployment, new landing page, invitation,
outreach automation, App Store claim, backend, dependency or public asset change.
The Motion app and distribution settings were not modified.

## Decisions

- Use HTTP 307 so the branded URL can later point to another signup destination.
  The browser address changes to Google Forms after navigation.
- Keep route, public form URL and CTA wording centralized in `motion.access`.
- Use a small server component and normal anchors, with no JavaScript requirement
  or form prefetch. The redirect is not a canonical content page or sitemap entry.
- Retain private-testing/preparing-for-release status. Requesting access does not
  establish external beta availability or issue an invitation.
- Explain Google Forms, private response storage, invitation/follow-up use and
  Apple handoff in the policy, effective October 21. Existing app-local and
  support-email practices retain their meaning.

## Implementation

`next.config.ts` reads the destination from shared content. `MotionAccess` renders
the existing themed button, iPhone/iOS eligibility and a Google Forms notice,
connected with `aria-describedby`. Motion retains how-it-works and family links;
Sports retains the full product-detail link. The closing Motion section keeps
its contact, tutorial, privacy and support links.

## Engineering impact

No server-owned visitor state or form handler is introduced. Google receives the
form navigation after the visitor follows the link. Names, emails and responses
are never stored in this website. Existing theme/focus/reduced-motion rules apply;
new styles only space and size the shared notice and adjacent actions. Obsolete
family-link margin rules were removed when that link moved into a button row.

## Files changed

- Motion and Sports pages plus `components/motion-access.tsx`: the three actions.
- Shared content, global styles and Next config: copy, presentation, policy and
  temporary redirect.
- README and five guides/reviews: route inventory, maintenance, verification and
  privacy/release boundaries.

## Documentation updated

README, Architecture, Content Guide, Testing, Motion Product Review and Website
Privacy Audit document the implemented path and external collection. Older dated
review records remain historical evidence. No asset, dependency, runtime command
or deployment procedure changed, so their documents needed no revision.

## Git diff summary

Implementation: 12 files changed, 178 insertions and 20 deletions. The change adds
one reusable component, a temporary redirect, three placements and the associated
copy/documentation. No generated output or media is committed.

## Verification

- Preflight: clean `main`; required fast-forward pull succeeded after allowing Git
  metadata writes. Node v24.10.0 matches `.nvmrc` major 24; nvm is unavailable.
- `npm run check`: passes with the existing tutorial `window.location.assign`
  lint warning, no new errors or warnings.
- Default `npm run build:next` hit the documented Turbopack CSS-worker socket
  permission restriction, including a permission-enabled retry. The documented
  `npm run build:next -- --webpack` fallback passes. `npm run build` passes Vinext.
  Existing Browserslist age and Vinext route-classification notices remain.
- `npm audit --omit=dev`: zero vulnerabilities after allowing registry access.
  `git diff --check` and staged diff checks pass.
- Browser: Motion, Sports and Privacy checked at actual 320, 390, 768, 1024, 1440
  and 1920 CSS pixels. Existing browser zoom required compensating viewport sizes;
  actual DOM widths were verified. No horizontal overflow or clipped access
  buttons. Desktop, tablet and mobile screenshots inspected; keyboard focus uses
  the existing visible 3px outline on both dark and light surfaces.
- Keyboard activation of the closing Motion action reached the published form.
  Title, required contact/device/consent fields and official video were verified;
  no form response was submitted. All three website actions share the same path.
- Initial Motion DOM has no form, iframe or external script/image/preconnect
  resource. No website console errors were observed; browser-extension warnings
  were excluded. Reduced-motion CSS was inspected, not OS-emulated; the new code
  introduces no animation or client behavior.
- Local HTTP: home, Sports, Motion, Privacy, Support and tutorial return 200 with
  correct canonicals, one H1, retained footer links and valid local fragments.
  Both apex/www Host variants retain the protected routes and exact 307 target.
  Legacy Sport/Work/Investment 308s remain; the redirect is absent from sitemap.
  Thirty-one rendered-image/original URLs return 200 with image alt text present.
  No response Set-Cookie header was observed on the checked pages.
- Content comparisons preserve family, measurements, tutorial and support data.
  Added public copy was scanned/reviewed for private identifiers, credentials,
  source-organization/athlete references, superseded branding and tracking code.
  No public asset changes. Private response/editor identifiers are absent.
- Cleanup: owned local preview stopped, browser test tab closed and viewport
  override reset. Screenshot evidence remains outside the repository.

## Repository state after implementation commit

Clean website `main`, one commit ahead of `origin/main`. No branch, worktree, PR,
merge or deployment. The prompt journal is a separate commit, followed by the
repository-required push of both commits.

## Implementation commits

- `db53ada9eaad1beeefb7609d1181588d8b3459f6` — Add Motion TestFlight access request links

## Archive commit

`Document Motion access link implementation`

## Lessons learned

Keep access requests distinct from binary availability and sent invitations.
Preserve the branded path when changing providers, and update the actual data-use
disclosure with any onboarding change. A successful push does not publish the
redirect; production activation requires a separate explicit deployment request.
