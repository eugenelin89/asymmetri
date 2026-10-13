# Investment employee portraits — October 13, 2026

The owner requested the employee images on Investment team cards and authorized
direct production deployment. The existing approved Atlas and Maya illustrations
now render at 96×96 CSS pixels, keyed by their exact published worker identities.
The source assets and roster facts are unchanged. Unknown identities retain
initials. [Journal 081](prompts/081-design.md) records the implementation and local
verification; the [asset manifest](ASSET_MANIFEST.md) records this reuse.

## Installed release

Website source `da09185945788a7949a1b66e722c25e49c103fdd` includes implementation
`c83f3cb9464f543cab9b3bba5e175ae1aaa71e86` and journal 081. Build ID is
`FdEnXJuqbkzmiTgfwl60i`; PID 2397461 started at 22:44:58 UTC and guarded activation
completed at 22:45:00 UTC. Production Node22.23.1 remains standing-approved.
The Linux check, Next.js build and production audit passed with zero vulnerabilities.
Local check, Next.js, Vinext, six investment tests and six responsive widths passed;
the pre-existing tutorial lint warning remains.

The candidate passed nine route checks before manifest preparation. The first
activation guard refused before stopping production because normal requests had
created ten new 404 route-cache entries in the live tree. Read-only comparison
verified that every difference was additive under `.next/server/route-cache/`,
with no candidate, source, dependency or build change. The original manifest and
refusal evidence were retained. Only those ten observed entries were admitted to
the old runtime manifest; the unchanged complete activation guard then passed.

## Public acceptance and preservation

Both portraits loaded in the production browser at 96×96 with meaningful alt text
and no console error. Eight original/optimized image requests passed across apex
and www, plus six hierarchy route checks. All 112 baseline observations were
preserved: 104 verified HTTP responses, four unchanged pre-existing IPv6 TLS
failures and four fallback certificate fingerprints. The 48 original tutorial
image responses, tutorial canonical/fragment links and protected Motion main
content on both hosts are unchanged.

Ask remains closed on unchanged receiver source
`08d36f33f53fee53e3838f9785dd86eab2ee15d3`, PID 2394995. Its configuration,
generation zero, metadata and empty authority/content tables are unchanged.
Investment PID 2385469, finite publisher/key scope, official experiment/run and
all prior immutable records are preserved; independent publisher appends remain
allowed. Ingress, Nginx, gunicorn, TLS settings and unrelated hosted sites were
unchanged. No receiver restart, new authority or model execution occurred.

## Rollback and evidence

The complete prior website runtime is retained at
`/var/www/asymmetri-rollback-20261013-8e67412`. The root-held
`asymmetri-contract-activate.py website rollback` verifies the exact release and
prior runtime manifest, stops the target, restores code only, then verifies
preservation and health. It never restores older private data or configuration.
The earlier [navigation release](BOTSQUAD-NAVIGATION-RELEASE_2026-10-13.md) remains
the receipt for the unchanged Ask receiver and hierarchy implementation.

Private evidence is at `/var/lib/asymmetri-portraits-release-20261013`, directories
0700 and files 0600. Its 17-file manifest SHA-256 is
`59a74e11f31f2794cc8ab41613b63d992ab85d59935214da88254b2c7d2980db`.
It includes build, candidate, preservation, refusal, activation and image receipts.
Local preview processes and the candidate unit are stopped. Browser viewport
overrides are reset. Subsequent documentation commits do not rebuild this runtime.
