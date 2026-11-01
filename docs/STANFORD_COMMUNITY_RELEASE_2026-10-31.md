# Stanford community release — production acceptance

Stanford's reviews, private usage-reporting integration and requested Play privacy panel removal are live on [apex](https://asymmetri.co/labs/stanford) and [www](https://www.asymmetri.co/labs/stanford). CWRU activated exact source `b3601b31fa5bfe296496046a1f6f911e5f16e4df`, build `xMZDEUQlNPy6b48OwpOC3`, on November 1 at 00:28:14 UTC (October 31 in Vancouver). Shared server acceptance passed at 00:32:19 UTC; Stanford browser acceptance passed at 00:36:18 UTC.

The source includes Stanford integration `c91bf86` and panel removal `8db97b6`. The subsequent iPhone Silent Mode audio request is a separate follow-up, absent from this artifact. The [initial campus release](STANFORD_RELEASE_2026-10-31.md) remains the evidence for core geometry, character/profile features and building traversal.

## Exact-source validation

[Linux workflow 41255821757](https://github.com/eugenelin89/asymmetri/actions/runs/41255821757), job 124698643526, passed 585 tests, TypeScript/ESLint, the production dependency audit with zero vulnerabilities, and the Next webpack build on Node 22.23.1. Stanford contributed 140 tests; reviews and analytics contributed 42. The existing tutorial navigation lint warning remains unrelated.

Artifact 13063731088 has ZIP SHA256 `cd3cee0bbe945d1a82e58a4ce9a561468f151fdedf86fb1a90a4c6edd04aa820` and runtime tar SHA256 `dcdef925358e577ea8360ca85190bbcecd67057079ced65bbf49bbf458d6b50e`. CWRU verified the immutable artifact, independent application-owned checkout, authenticated transfer and exact runtime identity. Stanford did not independently download a duplicate archive. Its local integration/removal tests and disposable-store checks are recorded in the [integration report](STANFORD_COMMUNITY_INTEGRATION_2026-10-31.md).

## Stanford live acceptance

At 00:31:49 UTC, apex and www returned HTTP 200, the expected sourced campus content and review section, without the removed Play privacy heading or recording/deletion controls. Both responses had SHA256 `76d0161f07cc78fa2c258c7d5ba85393d5d12d0a83c68e3713520efa17ca9927`. Runtime source identity comes from the release owner's receipt, not HTML text alone.

Desktop 1280×720 and phone 390×844 browser checks passed. Automatic scheduling hydrated to Halloween, the game loaded, and neither the welcome page nor Project information contained the removed panel. Closing information restored CANVAS focus. Reviews loaded without seeded entries; the empty phone form showed all fields, keyboard navigation reached the comment text area with visible focus, and closing the form returned focus to Write a review. The separate plain privacy policy remained accessible, without recording controls. No horizontal overflow, sampled broken images or console errors were observed.

No review was submitted and no synthetic play API fixture was sent. The release owner's temporary browser opt-out was preserved throughout gameplay; its original preference remains that owner's restoration responsibility. Stanford's temporary production tab was closed and viewport override reset. The reserved owner tab was never touched. These checks do not claim physical-device audio, subjective speaker audition or exhaustive building traversal during this follow-up.

Three original, unretouched screenshots are registered in the [validation gallery](validation/stanford/README.md). Detailed HTTP/browser receipts and original captures are retained privately under `deployment-retention/2026-10-31/stanford-community`, including `combined-live-http.json` and `combined-live-browser.json`.

## Shared preservation and recovery

The [coordinated release receipt](CWRU_COMMUNITY_RELEASE_2026-10-31.md) is the authority for server activation, protected routes, shared-store preservation and rollback. It records loopback/apex/www acceptance of 18 routes, 800 public assets and 40 static assets; preservation of all three profile stores, shared review/analytics stores and existing configuration; successful retention maintenance and timer restoration; 15 peer hosts and unchanged services; and all 12 retained owner archives. No production build or dependency installation ran.

The whole previous 704 runtime remains the immediate rollback. Recovery must preserve legitimate submissions and drain website/retention writers before a runtime swap. Stanford did not mutate shared server configuration, private stores or another campus's source. The later audio follow-up requires its own exact-source CI artifact, coordinated activation and Stanford live acceptance.
