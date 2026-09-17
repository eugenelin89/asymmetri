# Website and support privacy audit

Audit date: September 16, 2026. This record separates source-backed facts,
bounded infrastructure disclosure and unknown operational facts. It is not a
legal certification or a claim that every platform/provider copy can be deleted.

## Motion source of truth

Read-only GitHub reference: the Motion repository's accepted `main` at
`314783401897c73fdb7c20a60e6ce3030b92e053`. Reviewed:

- `docs/release/public-pages/privacy.md`;
- `docs/release/public-pages/support.md`;
- `docs/release/public-pages/PUBLICATION_REVIEW.md`;
- `docs/release/PRIVACY_AUDIT.md`;
- `docs/release/PUBLIC_PAGES_REQUIREMENTS.md`;
- the current source/build and morning iPhone-only decision in
  `docs/validation/v1_release_preparation.md`.

The published copy preserves the audited app meaning: local video/profile/marks,
pose landmarks/confidence, projected 2D results/history/evidence and preferences;
on-device Apple Vision; bounded absence of app-owned upload, sync, ads, tracking,
analytics/crash SDKs; direct video-only recording; original imports that may
include audio/metadata; independent Photos/iCloud/backups/sharing; deletion and
Try Cleanup Again limits. No app behavior discrepancy was found. Support adds
explicit unavailable-result guidance already required by the source packet and
an injury-diagnosis limitation; it does not add a measurement capability.

Owner directions establish Asymmetri Labs, the central support mailbox,
no sale of personal information, email-only support, and an audience including
pitchers, coaches, parents and youth athletes. No Kids category, age gate,
territory, medical or regulatory certification is inferred. The Motion repository
was read through GitHub only and was not modified.

## Verified website source facts

The audit covered all application routes, components, shared content, root
metadata/JSON-LD, styles, Next.js redirects, dependencies/lockfile, Worker/Vite
packaging and current architecture/deployment/content documentation. It did not
infer absence from a single file. Public HTTP and local rendered-page checks
supplement the source inspection.

| Subject | Established state and evidence |
| --- | --- |
| Cookies | No application cookie read/write or session integration. Checked local page/asset/metadata responses and the initial public homepage returned no `Set-Cookie` header. |
| Analytics | No analytics library, SDK, endpoint, script or custom analytics code. Next.js build telemetry is distinct from visitor analytics. |
| Advertising/marketing/profiling | No advertising, marketing tracker, profiling integration or related browser storage code. |
| Tracking pixels | None in source or rendered page assets. The only homepage photograph is a local approved WebP. |
| Forms | No contact/support form, upload input, form handler or form backend. Contact/support actions are normal `mailto:` links. |
| APIs receiving submitted visitor data | No app API routes, Server Actions or visitor-submission endpoints. Framework navigation/image requests still reach the server. |
| Database | No website database, database client or reads/writes. Retained Worker configuration has empty D1/R2 binding lists. |
| Authentication | No visitor login, account or authentication implementation. |
| Third-party scripts/fonts/embeds | None. System fonts, local assets, same-origin framework JavaScript and inline Organization JSON-LD. The schema.org identifier is not an external script request. |
| Browser storage | No application localStorage, sessionStorage or IndexedDB code, including tracking/profiling storage. This is a source finding, not an exhaustive browser-forensics claim. |
| Public athlete data | No new athlete records, footage, screenshots or identifying data. Existing approved imagery is unchanged. |
| Hosting | DigitalOcean control panel and authenticated console confirm the documented Ubuntu 22.10 Droplet. Public response headers identify Nginx on Ubuntu and Next.js. |
| Reverse proxy/runtime | Live website Nginx configuration and systemd properties confirm the proxy to `127.0.0.1:3001`, standard Next.js, `asymmetri.service`, app owner `django-user`, and checkout `/var/www/asymmetri`. |
| Repository logging evidence | No app request logger or logging retention configuration. The documented proxy forwards Host, client IP and forwarding metadata. systemd journal inspection is documented. No zero-log claim is supported. |
| Support contact | Owner-selected `info@asymmetri.co`; email-only, with no website submission collection or helpdesk. |

## Bounded infrastructure and email disclosure

The policy explains that website hosting/server infrastructure may process IP
addresses, browser/request information, requested URLs and request times to
deliver, operate and protect the site. This is a bounded description of ordinary
HTTP serving, not a claim about exact logged fields, provider practices, location,
retention, or deletion. It does not imply a server receives local app records.

Email necessarily transmits the sender's address, message and chosen attachments
through email services for the support interaction. The public copy avoids
unverified exclusive-use, fixed-retention or guaranteed-deletion promises.
Privacy requests have a contact path, including concerns about a child's
information sent to support. Only optional, necessary, authorized material should
be sent; identifiable minor footage requires parent/guardian authorization.

## Unknown facts and evidence limits

- The repository does not establish exact access-log fields or all hosting/system
  records. Live Nginx configuration enables `/var/log/nginx/access.log` and
  `/var/log/nginx/error.log`; no custom log format or website-specific logging
  override was observed. The proxy forwards client IP/request metadata.
- `/etc/logrotate.d/nginx` configures daily rotation with 14 rotations, compression
  and delayed compression. This is a local configuration fact, not proof of
  actual deletion timing or total retention across journals, snapshots, backups
  and provider records. No fixed retention period is promised publicly.
- Public MX lookup showed `eforward1` through `eforward5.registrar-servers.com`.
  This identifies domain-level routing only. It does not establish the destination
  mailbox for `info@asymmetri.co`, onward providers, access, AI processing, retention,
  deletion schedules or provider backups. No support email was sent.
- The repository contains no adopted support correspondence retention/deletion
  schedule or guaranteed backup-erasure policy. None is invented in the policy.
- Browser automation exposes DOM/rendering checks; it does not provide an
  exhaustive cookie/storage/network forensic report. Source inspection plus HTTP
  headers establish the scoped application findings above.

## Production inspection and publication

Authenticated DigitalOcean web-console preflight confirmed a clean `main` at
`d826652e8a595b3f2ca2b609f36b5bfffa625ad5`, also the server cached `origin/main`.
This is an ancestor of the starting local `4eb72cd`, behind only two documentation
commits. No tracked edits or untracked files appeared. The expected service was
active/running and boot-enabled; no other build/deploy process appeared. The
host had approximately 1.7 GiB free disk, 491 MiB available RAM and 1.7 GiB free
swap. Existing app dependencies occupied 927 MiB and `.next` 12 MiB.

Live Node is 22.23.1 (npm 10.9.8), while `.nvmrc` specifies 24; no nvm or alternate
Node 24 installation was found. This is an explicit deployment constraint, not
an excuse to change system packages silently. The owner explicitly authorized
using the existing Node 22 runtime for this deployment, contingent on successful
production checks/build before restart. The local build used Node 24.10.0.

The final task report records the exact deployed commit and postdeployment HTTPS
results after successful push/build/restart. This predeployment audit does not
claim those future results.

## Dependency audit caveat

The unchanged lockfile audit on September 16 reports four production-package
findings: Next.js (critical), sharp (high), nanoid (high), and
baseline-browser-mapping (moderate). The Windows-specific Next.js advisory does
not match the documented Ubuntu host. The Next.js/sharp AVIF advisory concerns
untrusted image input: this site has no upload path, remote image allowlist or
AVIF/HEIF assets; its approved optimized image is a local WebP. This bounds the
known input path, but is not a clean security audit or a proof of non-exploitability.
The nanoid dependency is through PostCSS and baseline-browser-mapping is a build
utility; neither has an application visitor-input call site. Dependency remediation
requires a separate reviewed update under the deployment guide; no `npm audit fix`
or package/lockfile change is part of this publication.

References: [Next.js Windows advisory](https://github.com/advisories/GHSA-p293-qw3h-jr36),
[Next.js AVIF advisory](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4),
[sharp advisory](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c).

## Maintenance guardrails

Keep `/privacy` and `/support` static, indexable, linked in the footer and mutually
linked. Keep the established apex canonical origin and verify the requested `www`
URLs as actual articles. Preserve the homepage and legacy redirects. No tracking,
ads, cookie banner, form, database, account, helpdesk or new dependency is needed.
Reaudit before introducing any such behavior or changing hosting/mail processing.
Update the effective date when the policy changes; do not claim future publication
or silently configure the iOS app's release links from a website task.

## Product marketing extension, September 16, 2026

The homepage and new `/motion` page add static product copy, the original approved
Motion icon, a semantic HTML/CSS evidence chain and SoftwareApplication JSON-LD.
No visitor input, third-party resource, network service, tracking/storage code,
form, account or dependency is introduced. The schema.org identifier remains
inline metadata, not an external request. The app privacy summary follows the
bounded existing audit and explicitly separates Photos/iCloud/backups/sharing.

The `motionPages` content export, utility route files and shared article renderer
are byte-identical to the preceding commit. The existing policy effective date
and substantive disclosures remain unchanged. The original approved photograph
is byte-identical; the only added public artwork is the approved generic icon.
No private app screenshot or athlete record is published. Current source/claims
and asset provenance are recorded in `MOTION_PRODUCT_REVIEW.md` and
`ASSET_MANIFEST.md`; internal documentation is not served as a website route.


## Tutorial extension, September 16, 2026

The owner explicitly authorized retained pitching photos/videos visible in current
Motion screenshots for this tutorial. Twenty genuine Mirroring crops expose only
needed workflow context and authorized pitching media. Profile name/DOB/history,
location/time-zone detail, system chrome, notifications and unrelated lower settings
are excluded. No Photos picker contents, private source-organization UI, contact
identity or account details are published. Current captures preserve actual saved
values; generated artwork is clearly instructional and contains no app UI/results.

The tutorial adds ephemeral radio/navigation state and native disclosures, with no
visitor data submission, persistence, tracking or external services. All media are
local. The existing Privacy Policy and effective date are unchanged. Support gains
one getting-started tutorial link. See `TUTORIAL_REVIEW.md` for the device action
scope and `ASSET_MANIFEST.md` for the exact publication set. This dated extension
supersedes only the prior no-screenshot finding for these explicitly approved assets.


The owner's immediate tutorial follow-up replaces nine screenshot crops with
brighter August 27 footage (IMG_7594/IMG_7595). It uses the same explicit public
media authorization and crop-only treatment. System/location/profile details
remain excluded; raw captures stay outside the repository. No app data mutation,
new collection mechanism or policy-copy change accompanies the replacement.
