# Court Damage Web release · November 26, 2026

[Play Court Damage](https://asymmetri.co/court-damage/play). Choose **Play now**, then **Let’s Play** inside the game. The existing four-character doubles match runs entirely in the browser.

| Release component | Verified identity |
| --- | --- |
| Website | [PR #19](https://github.com/eugenelin89/asymmetri/pull/19), source `14db474eefc76aeeab1f7ffb41c4b375ce6db962`, Next build `MhN5hp2ZqaQr1-7fIdL4s` |
| Linux candidate | [Merged-source CI](https://github.com/eugenelin89/asymmetri/actions/runs/45900241340), archive SHA-256 `9199319072787afb096cbbf3f7cf6f53407e80e3222495c560cc5d1c7de998c0` |
| Game | Unity 6000.3.28f1, source `a117297e21c7fafa44ad6cce8da382a2e75f43f2`, five files totaling 22,146,995 bytes |
| Game integrity | [Per-file hashes and sizes](https://asymmetri.co/court-damage/builds/a117297e21c7fafa44ad6cce8da382a2e75f43f2/manifest.json). Manifest SHA-256 `ffc60f0436bbfb159a82b23e8c6d154440a2bcb168fb6752025f4d07989fa4a8` |

## Live acceptance

Brave 1.100.59 on macOS loaded the illustrated menu, accepted simultaneous movement and shot controls, showed a scoring rally and reached a 1–5 final. Rematch reset the scoreboard to 0–0 and displayed “Your serve.” Pause and Resume worked. Captions remained visible with Voice off. The Web Audio output meter detected sound during play, silence with master mute and signal after unmuting. The match recorded zero browser runtime or request errors.

A separate fresh Brave profile downloaded the versioned resources only after Play. It reached the menu again on a warm reload with zero game-resource bytes retransferred. A single cold/warm measurement was 25.875 s and 0.442 s. The page showed its poster and launch button without horizontal overflow at 1440 × 1000, 390 × 844 and 768 × 820. The phone and tablet views used Brave device emulation.

## Deployment and rollback

The staged candidate used the exact Linux CI output and compiled player. Its independent shallow checkout included the complete application and project data. Historical PNG and JPG evidence under `docs/` remained in Git and in the owner’s complete offline source bundle. The loopback candidate and both public HTTPS hosts passed game file checksum, MIME, gzip, immutable caching, support/privacy and route checks. The release preserved 804 existing assets, the two separately provisioned recordings, protected Motion and campus routes, persistent stores and peer services.

The complete immediate rollback is `/var/www/asymmetri-rollback-before-court-web-20261126`, website `5eec469916155f005e55c06805945ab37690a580`, build `IOlMhedexCbQcTDJyBohe`. It started independently and passed 29 route and 45 bundle checks. The owner-held recovery receipt contains the protected rollback procedure. The disk and memory guards held throughout staging, activation, rollback verification and cleanup.

## Regression checks and retrospective

The website passed its lint and type checks, 74 Vancouver tests, its production dependency audit and the Linux build. The shared game passed 47 Edit Mode and 11 graphical Play Mode tests. The iOS development export also compiled in Xcode for a generic iPhone with signing disabled.

An early integrated match exposed a missing canvas name and a keyboard-focus race. Real input also exposed a held action crossing Resume. The released launcher preserves external keyboard focus, and the game clears interrupted input. Testing a truncated compressed file caught an export validation defect before deployment. A future release could automate the same Brave play-through and hidden-tab checks against each assembled candidate. Physical phone controls and Safari remain unverified.
