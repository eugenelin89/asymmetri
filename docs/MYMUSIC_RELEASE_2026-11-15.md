# My Music release — November 15, 2026 UTC

The owner requested a minimal unlisted `/mymusic` page, public Drive folder input,
recursive audio playback and immediate deployment without a PR. A later instruction
confirmed this is for personal use and asked to avoid further rigorous testing.
Feature acceptance was already complete; remaining work was the existing Linux
build and production activation/health/rollback safeguards.

## Behavior and boundaries

The page accepts an arbitrary public Drive folder URL, discovers audio through
nested folders, and offers native controls, previous/next and automatic advance.
It starts with an empty input, has no navigation/sitemap entry, and carries noindex
metadata. It is publicly accessible. No account, API credentials, database,
recording storage, dependency or public asset was added. Existing routes, Motion
resources, tutorial canonical/anchors/assets, redirects and peer services remain
protected. The keyless adapter depends on Google's public folder HTML and download
availability; codec restrictions and Google limits are reported in the UI.

## Source and acceptance

Implementation `b8020f3`; preparation journal/deployed source
`b0b40d63b0941bf4be91fe90c325d91d8aee562a`. Both were pushed directly to main.
[Exact-source Linux build](https://github.com/eugenelin89/asymmetri/actions/runs/43661964376).

Local Node 24.10.0 matched `.nvmrc`; nvm was unavailable. TypeScript/ESLint,
572 prebuild regressions, five new synthetic tests, Next webpack and Vinext builds,
production audit and whitespace checks passed. One pre-existing tutorial lint
warning remains; production dependency audit found zero vulnerabilities.
The supplied acceptance folder yielded 27 tracks. Browser checks confirmed actual
playback progress, seeking, next/previous and automatic advance, with no overflow
at CSS widths 320, 767 and 1440 and visible keyboard focus. Invalid/unavailable
folders reported errors. A byte-range request returned exactly 1024 requested
bytes with HTTP 206. Owner URLs and filenames are excluded from public records.

## Activation and recovery

Activated at **2026-11-15T01:24:28.836752Z** (17:24 November 14 Vancouver).
Production Node **22.23.1**, build **`K5uU0ihPv4IdxvodDcxwn`**. Artifact size
**256,948,951 bytes**, SHA-256
`7944352cb54ec3472d027e1ef49086efec8a30aae06be43c1b1d4d14ec15f741`. Source/runtime identity and checksum matched before extraction
and again on the host. No production build ran in the serving tree.

The independent candidate preserved all 29 existing route contracts and passed
My Music page/input checks. Loopback, apex and www passed after activation. A fresh
public browser visit loaded the same 27-track nested queue, streamed an actual
track past eight seconds, and left it paused for the owner. The old stopped local
preview tab could not be reused after viewport reset; a fresh public tab succeeded.
This was a browser handoff issue, not a production outage.

All 803 public-asset digests, 62 configuration fingerprints, 15 peer-domain baselines
and five persistent stores were preserved. The prune timer resumed active/enabled.
The website process reported zero errors and zero warnings after cleanup. All guard
phases passed without intervention: minimum available memory **265,552 KiB** and
minimum free disk **7,262,060,544 bytes**, above the unchanged 192 MiB/6 GiB floors.

The complete independent immediate rollback is
`/var/www/asymmetri-rollback-before-mymusic-20261115`, source
`4ee0a2651e9b6dafc34d9fe5cd460ebef9d71927`, build `E2OJu4pokkUqFe7kdJQ7W`.
Its separate loopback startup passed 29 route and 45 bundle checks. Restore with
the documented whole-directory swap after draining the website and prune timer;
retain the current tree, restore this predecessor, restart, verify both hosts and
resume pruning. Older rollbacks and retained archives remain unchanged.

## Cleanup audit

Opening Mac free space was 64,344,924,160 bytes; opening production free space was
8,838,152,192 bytes. One canonical local checkout was present; local build and
dependency trees were created solely for this task's validation.

After the owned preview stopped, tracked-file and open-handle checks preceded
removal of local `node_modules`, `.next`, `dist`, `tsconfig.tsbuildinfo` and
`.wrangler/deploy`. Their du estimates were respectively 807,120,896; 558,448,640;
133,001,216; 331,776; and 4,096 bytes. Measured filesystem free space rose from
62,384,943,104 to 63,910,088,704 bytes: 1,525,145,600 bytes recovered. The public
lockfile, source and successful builds establish reproducibility. Canonical source,
existing Wrangler state and unrelated caches remain.

After successful activation and independent rollback verification, checksum and
inactivity checks preceded removal of the server transfer and empty fixtures/staging
parent. Server free space rose from **7,262,060,544** to **7,519,043,584 bytes**:
**256,983,040 bytes recovered**. Post-cleanup service, peer and rollback checks passed;
final measured production free space was **7,519,023,104 bytes**.

The verified local CI download and temporary folder/audio-response samples were
also removed after inactivity checks. That second local cleanup raised free space
from **63,638,372,352** to **63,895,322,624 bytes**:
**256,950,272 bytes recovered**. The artifact's du estimate was
256,958,464 bytes. Total measured gains across the two local
cleanup windows were **1,782,095,872 bytes**. These are filesystem changes, not sums
of du estimates; overall session capacity also reflects installations and concurrent
filesystem activity.

The serving runtime (1,318,297,600 bytes by du), complete immediate rollback
(1,317,728,256 bytes by du), three older complete rollbacks, retained archives,
configuration, persistent stores and private release evidence remain. No new cleanup
blocker or owner retention decision arose. Historical scratch/custody questions stay
under [Issue #5](https://github.com/eugenelin89/asymmetri/issues/5) and the existing
[storage audit](WEBSITE_STORAGE_AUDIT_2026-11-09.md); none was deleted incidentally.
