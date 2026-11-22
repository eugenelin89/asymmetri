# Court Damage website release, November 22, 2026

The [iPhone support page](https://asymmetri.co/court-damage/support) and [privacy policy](https://asymmetri.co/court-damage/privacy) are live. Both use the company contact mailbox and link to each other. The privacy policy covers offline matches, the locally saved voice preference, Apple diagnostics controlled by the player, support email and website requests.

## Source and deployment

The deployed source is `5eec469916155f005e55c06805945ab37690a580`, build `IOlMhedexCbQcTDJyBohe`, from [website PR #18](https://github.com/eugenelin89/asymmetri/pull/18). The owner authorized the standalone pages, the Next.js security update and verified archival of the older inactive rollback. The release updated Next.js and its ESLint configuration package to 16.4.6. Website publication is a separate milestone from [the iPhone release](https://github.com/eugenelin89/CourtDamage/issues/17).

## Verification

- The [exact-source Linux candidate](https://github.com/eugenelin89/asymmetri/actions/runs/45005114343) passed type and lint checks, Vancouver regressions, the production dependency audit, the Next production build and packaging. The received archive matched its SHA-256 before extraction.
- Both pages returned HTTP 200 on apex and `www`. Their canonical URLs resolve to apex, their metadata includes `noindex`, their support email is present, and each page links to both resources. The homepage and sitemap on both hosts omit the Court Damage paths.
- Candidate and live checks exercised the existing route baseline, including protected Motion pages, My Music and campus services. Post-activation checks verified 804 public assets, 62 configuration fingerprints and 15 virtual-host baselines. Private configuration and persistent stores passed their preservation checks.
- The complete preceding runtime, source `bf1b35ef629b585b63b059d37990b6bc7d871e1e`, build `WLdvYhQk6e_xmMSuHhT2Z`, started independently and passed its route and bundle checks. Temporary deployment files were cleaned up after rollback verification. Private storage and recovery details are retained with the deployment evidence.
