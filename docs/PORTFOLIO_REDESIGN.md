# Portfolio redesign decisions and evidence

Review date: September 28, 2026. This document records source authority and bounded
claims for the Labs portfolio redesign. It is not a scientific validation, security
certification or release announcement for either product.

## Product source authority

### BotSquad

The public repository is `https://github.com/eugenelin89/bot_messenger`. Product
review used revision `c5712ca9b544105b9303aab76d2e4860c3d6be13`, including README,
package metadata, `docs/operations/CURRENT_STATE.md`, `docs/product/PROJECT_VISION.md`,
`docs/product/ROADMAP.md` and the prompt-05 general-project/independent-audit records.
Current completed implementation and validation take precedence over roadmap intent.

The reviewed state supports logical worker identities, durable tasks/messages and
artifacts, resumable Codex execution, bounded concurrency and scoped reviewed
software-project work. It does not support calling models continuously running,
unlimited-memory or perfect-security workers. Current browser access uses a tunnel;
authenticated standard web access and mobile interaction remain in development.
The illustrative research handoff is explicitly synthetic, not a verified customer
result. No new workers were run and no BotSquad production data was accessed.

The repository initially lacked a license. The owner explicitly selected MIT and
Eugene Lin as copyright holder. A separate BotSquad commit,
`effba60f349778d82a37fbbb44bf4047a931d875`, added the standard LICENSE, README pointer
and package/lockfile license metadata. It was pushed and GitHub recognized MIT.
The website can therefore accurately say open source and MIT licensed. No runtime
or dependency behavior changed in that repository.

### Motion

The existing public workflow follows `MOTION_PRODUCT_REVIEW.md` and tutorial source
records. A fresh read-only product review at
`7293ba8415c72af7fdc85a2c5ead01f81e1abe56` confirmed current product/release documents:
V1.1 is accepted as the first release candidate; TestFlight/App Store availability
is not established. “Preparing for release” remains appropriate. More recent
implementation does not justify silently expanding this marketing task into a
new-feature campaign. Developer-only/experimental measurements, Mechanics Lab,
reference datasets and future scientific interpretation are not current promises.

The owner-supplied Explorer design README identifies a design proposal. Selected
home and saved-question concepts are labelled synthetic and not current captures.
Detailed plot concepts were excluded. Original design files remain untouched.

## Structural decisions

- Labs owns `/`: approved company hero, two-product portfolio and company contact.
- Asymmetri Sport owns `/sport`: preserved photograph, central headings, founder
  paragraphs, approach, Motion introduction and coaching close in their original order.
- `/motion` retains its depth; optional video immediately follows the hero.
- `/botsquad` explains the real access/runtime model, persistence, handoffs and limits.
- `/about` becomes a real philosophy page. `/work` redirects to `/#products`;
  `/why-asymmetrico` to `/about`; the old named-platform route to `/sport`.
- Three old root fragments migrate to Sport. Plural `#products` and root contact
  remain Labs destinations. No-JavaScript links preserve access to moved sections.
- Tutorial modules, branches, hashes, original assets and exact www canonical remain.
- The owner explicitly reaffirmed Motion app/App Store page continuity. Current
  app code references the www privacy/support URLs; these and the tutorial/product
  pages remain real pages with stable links. AGENTS and the content/testing guides
  record them as protected dependencies for future work.
- Shared copy stays centralized in typed exports in `content/site.ts`, including
  Labs/BotSquad/About, Sport navigation, concept images and approved video details.

The singular Sport brand was retained after the owner's wording question. Use
“sports technology” as the descriptive category.

## Media and privacy decisions

The owner corrected BotSquad's initial selection to the English introduction:
`https://youtu.be/E5r_lOecC-M`. Motion uses `https://youtu.be/kaSatKC8HBg`.
The user-selected videos explain the products but do not override current source
claims. Local posters avoid pre-activation external requests. A deliberate button
creates a privacy-enhanced iframe with no autoplay and an origin referrer. Native
controls/fullscreen and an external fallback remain available. No API SDK or
persistent permission state is used.

The September 28 policy update discloses optional website videos and Google
processing. It preserves approved Motion/app, Apple and support-retention meaning
and explicitly does not claim to be BotSquad's application privacy policy.
Existing approved assets remain byte-identical; new provenance is in the manifest.

## Validation and operational scope

Local validation uses Node 24 and both Next.js and Vinext builds. No dependencies
or packaging configuration are changed. The pre-existing audit reports four
findings (one critical, two high, one moderate); remediation is a separate reviewed
maintenance task. A complete staged release is required for the route changes,
with production checks/build on the approved existing Node 22 and full-directory
rollback. See `TESTING.md` and `DEPLOYMENT.md`; the journal records actual results
and the external release receipt records post-activation evidence.
