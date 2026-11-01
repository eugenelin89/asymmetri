# Stanford iPhone audio — production release acceptance

Stanford’s optional Silent Mode playback update is deployed on [apex](https://asymmetri.co/labs/stanford) and [www](https://www.asymmetri.co/labs/stanford). Automated and live acceptance passed, and the owner confirmed audio starts on entry on their iPhone with Silent Mode enabled, without toggling Sound.

## Release identity

Released source `33e4b65b979a4070f2210a79759c790b1ce147ba` contains Stanford implementation `2bc1abb68409a5124d93b47b7265bd2485309f5e` and journal `605feaa413a4903f3c80f171255ce7f03ae29101`. CWRU owns coordinated activation and common preservation; Stanford owns this acceptance. The previously deployed UBC-only `7026bda` did not include this Stanford fix. The later UBC initial-entry correction is separate.

CWRU reports activation at **01:03:01 UTC on November 1, 2026** (October 31 at 18:03:01 Vancouver), build `25l0J7p1X18xCpT0DdKZ1`. Shared final health passed at **01:09:16 UTC**. Stanford HTTP acceptance passed at 01:03:27 UTC and browser acceptance at 01:04:06 UTC.

## Validation before deployment

[Exact-source Linux workflow 41258434238](https://github.com/eugenelin89/asymmetri/actions/runs/41258434238), job 124706473747, passed all 616 tests: 74 Vancouver, 69 Surrey, 27 Richmond, 151 UBC, 98 CWRU, 13 reviews, 29 analytics and 155 Stanford. TypeScript/ESLint, zero-vulnerability production audit, Next webpack build and artifact packaging passed. The unrelated existing tutorial lint warning remains.

Artifact 13063669057 is 256,894,823 ZIP bytes, SHA256 `0edf3ad64131febd5293d5da03c4d8b1c49bfd3eff4fd635142d6c8cefb8574e`. Stanford independently reread the existing owner-held runtime tar without downloading a duplicate. Its SHA256 is `59dda25c51de940da0ba6d36f4952744a2e82d77c4a46c3681874f3f666619fd` (256,894,386 bytes); embedded source and build identity matched. The packaged Stanford page and audio bundle expectations were saved and matched against the live public responses. Authenticated transfer and shared activation are covered by the coordinated owner's verified receipts.

Local validation passed 155 Stanford tests, including 15 audio lifecycle/race fixtures, type/lint, production audit, Vinext and Next webpack. A fresh 15-fixture pass followed the owner's report that UBC required a Sound toggle. Stanford's controller receives the effective entry choice before scene loading, ignores stale scene audio preferences and has no initial-disabled 400 ms suspension timer. Runtime SHA256: Campus.tsx `05ba8b7f922747c3a14707ca5deb074f2530550da2c9140bfbb2ac3ee07fa28f`; sound.ts `751e332a3f49637d46cfe22cccd79940b8b45bf202dcc42eac540677c5975604`.

The isolated local browser passed entry, mute/re-enable, zero volume, restored 45% volume, Base and automatic Halloween controls. A separate fresh 1280×720 entry used one Enter gesture and no Sound, volume or theme changes; visible diagnostics reported a running context and two atmospheric cues. Console errors were empty and no horizontal overflow occurred. Both temporary previews were closed without changing the shared viewport. These observations concern desktop Web Audio and do not establish physical iPhone speaker output.

## Live acceptance and limits

Both apex and www returned HTTP 200 and exact artifact byte matches: Stanford HTML SHA256 `c1639f9d323a4f023c8844396658d18248e0a44bce4c3b26cf4a44a894254c23`; the 2,394,286-byte Stanford audio/page bundle `page-3195988076669554.js` SHA256 `5a128317ec8d4cffc1b2b5a8a4daf893a4dc2ef5fbf8fcd949c661941b3f3e93`. The packaged code contains the optional playback-session implementation. The byte match verifies that the new implementation is served.

A fresh live desktop browser at 1280×720 hydrated to automatic Halloween, loaded the empty reviews section and omitted the removed privacy panel. No overflow, sampled broken images or console errors were observed. No game canvas was created and no gameplay was entered. The DOM script-tag inventory did not retain the route chunk and was not used to infer script execution; the independent HTTP byte comparison is the source-delivery evidence. Both temporary inspection tabs were closed without changing the viewport or browser preferences. Original screenshots and HTTP/browser/source receipts remain privately retained with the Stanford release evidence.

No production gameplay or synthetic review/play-session submission was performed. The prior QA opt-out cannot be re-established through supported UI after the older control tab disappeared. No hidden-state workaround was used. The live check covers landing/source/console acceptance, using the exact-source local gameplay/audio evidence above. The agent did not perform a physical-device speaker audition or production gameplay test. After the new deployment, the owner answered “Audio starts on entry” to the explicit iPhone/Silent Mode ON/fresh refresh/no Sound toggle question. That is positive first-entry feedback for their phone; its model, iOS version and browser version were not collected, and broader device coverage is not claimed.

## Preservation and recovery

CWRU’s final health receipt passed at 01:09:16 UTC with SHA256 `a84376a553af5d8e48d4648dc128df5bd74bf9fa730a51d145ef50f5bf03cebe`. Loopback, apex and www each passed 18 routes, 800 public asset checks and 40 static assets. All three private profile stores, shared review/analytics stores and existing configuration were preserved. Retention pruning succeeded and its enabled, active timer was restored. Fifteen peer hosts and 12 retained owner archives passed verification. The new process had zero errors and warnings. Final-health minimums were 291,208 KiB available RAM and 7,770,652,672 free bytes, above the established floors. No synthetic production review or play session was created.

The first health sweep stopped on a TLS connection EOF before reaching the application. Its failure evidence was retained; an unchanged retry passed. No application correction, rollback or security-setting change was needed. CWRU’s private shared receipts are retained under `deployment-retention/2026-10-31/cwru-audio/coordinated-rollout`; Stanford’s independent evidence and owner feedback are under `deployment-retention/2026-10-31/stanford-community/iphone-audio`.

The complete predecessor is source `7026bda`, build `eG9hULP6XuiJ4gThLtuif`, at `/var/www/asymmetri-rollback-before-cwru-audio-20261031`. Recovery must drain website and retention writers, preserve current legitimate submissions and configuration, and verify the complete rollback before swapping runtimes. This Stanford workstream made no server or private-store mutations.

Original campus and reviews releases remain documented separately. All source-informed reconstruction and affiliation limits remain unchanged. The audio change adds no external audio, microphone access or dependency. Optional Audio Session playback is feature detected and prior ownership is preserved on mute, Base, zero volume, visibility changes and disposal.
