# UBC audio and iPhone Silent Mode

The owner confirmed that disabling iPhone Silent Mode restored the existing
Halloween soundscape, then asked whether sound could work while Silent Mode
remains enabled. This source follow-up adds optional Audio Session playback
support for UBC. It is separate from the privacy-card removal release and does
not change CWRU or Stanford audio.

## Browser evidence

[WebKit issue 237322, comment 6](https://bugs.webkit.org/show_bug.cgi?id=237322#c6)
documents `navigator.audioSession.type = "playback"` for iOS 17 and later to
allow Web Audio through Silent Mode. The
[W3C Audio Session working draft](https://www.w3.org/TR/audio-session/)
describes the optional API, its `auto` default and Web Audio's ambient default
category. Playback can affect other media playback, so this implementation
requests it only following the existing entry or sound-enable gesture.
Both sources were checked on October 31, 2026. API availability is detected
directly; no browser-name or iOS-version sniffing is used.

## First-release implementation

`halloween-audio.ts` records an explicit playback intent independently of the
first engine settings update. This protected the pending playback category and
handled old muted settings briefly arriving during an unmute. The later phone
test exposed additional initial-context and engine-default races described below.
A rapid enable then cancel releases any silent playback category through the
existing 400 ms fade/suspend callback; a first scene still loading is exempt.

When the API exists and is writable, the module remembers the prior session
type and requests `playback` synchronously before awaiting AudioContext resume.
Mute, edition-off, zero volume, hidden pages and disposal release its owned
setting. Returning to a visible page can reacquire it only with retained sound
intent and enabled audio. A pre-existing playback category is never owned or
restored by this module; an intervening different category is preserved.

Missing, throwing or readonly session APIs leave ordinary Web Audio behavior
unchanged. No silent HTML audio loop, external audio asset or microphone access
is added. Master gain, bounded cue scheduling, user volume, hidden-page
suspension and node cleanup remain in place. The entry gesture now initializes
Halloween audio only when both the Halloween edition and its audio setting are
enabled, avoiding playback-category takeover during ordinary campus entry.

## First-release validation

The focused audio suite contains 14 passing tests, including existing audio
limits and new cases for delayed settings, mute then resume, zero volume,
hidden/visible state, another media owner's category, unavailable APIs, rejected
resume, rapid enable/cancel and disposal during a pending resume. These tests use AudioContext and
Audio Session fixtures; they do not establish physical iPhone behavior.
Scoped ESLint and targeted strict TypeScript checks also passed on Node 24.10.0.
An independent source and lifecycle review accepted the final implementation,
including a reproduction confirming that rapid enable/cancel restores the
previous category while delayed first-scene initialization retains playback.

An isolated snapshot of `b3601b31fa5bfe296496046a1f6f911e5f16e4df`
with only the five UBC audio follow-up files passed `npm run check`, all 151
UBC tests and `npm run build` (Vinext) on Node 24.10.0. Other tracked source
files were verified byte-for-byte against that base; existing dependencies were
reused without installation. The check reported only the existing tutorial
ESLint warning. Exact source and log hashes are retained in the private local
validation manifest. A local preview returned HTTP 200 at
`http://127.0.0.1:3038/labs/ubc`, using temporary data stores.

The local browser check passed explicit Halloween entry, mute/re-enable,
volume zero then 35%, edition off/on and CANVAS focus restoration after closing
the panel. Console inspection returned no errors. The temporary browser tab and
preview listener were closed afterward. These checks verify the interface and
browser lifecycle; they do not establish audible output on an iPhone.

Exact source `7026bda420dc2c9f877f7fd64033403af3b95f42` passed Linux
workflow `41257541348`, job `124703801506`: all 592 tests passed, production
dependency audit reported zero vulnerabilities, and the Next.js production
build and artifact upload succeeded. The immutable artifact is `13064240261`,
build `eG9hULP6XuiJ4gThLtuif`. UBC is released independently to satisfy the
owner's urgent deployment instruction; Stanford and CWRU own their separately
reviewed audio changes.

The owner tested the deployed fix with iPhone Silent Mode enabled and reported
that sound worked after turning Sound off and back on. This confirms audible
Silent Mode playback on that device but does not accept first-entry startup.
Source review found two startup paths requiring correction: the initial disabled
audio state can suspend the context before assets finish loading, and an early
engine-default snapshot can clear playback intent before the chosen UI settings
arrive. A separate follow-up makes the explicit UI choice authoritative and
starts the audio graph in the entry gesture. Other physical lifecycle checks
remain unconfirmed. Unsupported browsers may still require Silent Mode to be
disabled.

## First production release

Source `7026bda420dc2c9f877f7fd64033403af3b95f42`, build
`eG9hULP6XuiJ4gThLtuif`, activated at 00:51:08 UTC on November 1
(October 31 in Vancouver). The deployment owner verified the exact artifact,
isolated startup checks, guarded activation and loopback pages. The previous
`b3601b31fa5bfe296496046a1f6f911e5f16e4df` runtime remains available
whole for rollback. Existing private stores and configuration were preserved.

Final health passed at 00:53:53 UTC: loopback, apex and www each passed 18
pages, 800 public assets and 40 static assets. All 15 peer hosts, 12 retained
archives, private stores, configuration and retention timer passed preservation
checks. The new process logged no errors. Minimum observed available memory
was 269,880 KiB and free disk was 9,045,274,624 bytes. This accepts the deployed
runtime's health, not the unresolved initial-entry audio behavior.

The live UBC landing page hydrated successfully with the Halloween soundscape
control enabled and no console errors. No production test review or synthetic
play was submitted for this follow-up. The earlier test browser's temporary
analytics opt-out could not be restored because its preserved old control tab
closed; restoration is not claimed. This does not change production defaults.
The owner's physical-device result above is recorded separately from these
server and browser checks. The initial-start correction below has since been
deployed; its physical first-entry retest remains pending.

## Initial-entry correction

The follow-up makes the visitor's selected settings authoritative from the
entry gesture. Campus keeps those settings in a ref that is updated immediately
by entry, sound, volume and edition controls. Renderer callbacks provide
position and ghost proximity but no longer override that choice with their
temporary default settings. Real mute, zero volume and edition-off configure
the audio controller immediately, including while scene data is loading.

The controller's `resume(settings)` applies the desired settings and starts the
existing sound graph synchronously before awaiting AudioContext resume. Creating
the controller alone no longer resumes audio or claims a playback category.
A pending initial unlock is not suspended merely because the scene has not yet
provided a callback. Actual hidden, muted and disposed states retain their
existing cleanup and category restoration.

All 17 focused audio tests and all 154 UBC tests passed, along with scoped lint
and strict TypeScript. The new regression permits only the initial gesture,
waits longer than 400 ms without scene callbacks and verifies a running context,
no suspend calls and a started sound graph. Another test exercises the actual
Campus callback with engine defaults while the visitor has enabled Halloween;
that callback preserves the selected sound, and a later real mute still wins.
Independent review and a separate 17-test run accepted the correction. These
checks do not replace a new physical iPhone test after deployment.

The exact three runtime/test files also passed an isolated Vinext build with
existing dependencies and the committed shared-site source. A fresh local
browser entered once, completed scene loading with Sound on without a second
activation, then passed mute/re-enable and console checks. The saved initial
frame precedes those later toggles. This confirms the visible integration;
the unit regressions cover session category and context state, and physical
first-entry output remains a separate acceptance step. No production test play
or review was created.

The corrected immutable source is
`38d432685765161347cff7b74c2f3dddd14af378`. Linux workflow
`41259302295`, job `124709037317`, passed all 619 tests, the production
dependency audit with zero vulnerabilities, and the Next.js production build.
Artifact `13064662276` has ZIP SHA-256
`cec84a467a3623fb84ddc0eefa396b62528a7346e33c520a0289a7ea1074645f`.
This candidate includes the separately reviewed Stanford and CWRU audio fixes;
those fixes were already activated in the preceding 33e4 release and the owner
reported both campuses working well.

## Corrected production release

Corrected source `38d432685765161347cff7b74c2f3dddd14af378`, build
`4JfgZCh6OpnpuPeTAjb1A`, activated at 01:17:48.648575 UTC on November 1,
2026 (October 31 in Vancouver). Final health passed on its first attempt at
01:20:48.780416 UTC. The exact tested artifact passed staged startup checks
before guarded activation; the preceding complete 33e4 runtime was preserved
for rollback. Stanford and CWRU runtime code was unchanged by this correction.

Loopback, apex and www each passed 18 pages, 800 public assets and 40 static
assets. All 15 peer hosts, 12 retained archives, three profile stores, shared
review and analytics stores, configuration and retention timer passed their
checks. There were no new application errors. Minimum observed available
memory was 312,176 KiB and free disk was 6,487,830,528 bytes. No cleanup or
synthetic production play/review was performed. The private final-health
receipt has SHA-256
`b76d68b15d0cf3e567ab1273408c52cc70d21357c3e2fa44e2c9641651af209b`.

A fresh production browser loaded the Halloween welcome with Scary soundscape
enabled, reviews loaded, no removed privacy control, no horizontal overflow and
no console errors. A real welcome screenshot was saved. The live browser check
did not enter gameplay. First-entry audible playback on a physical iPhone with
Silent Mode enabled remains unconfirmed; the earlier successful Sound off/on
test applies to the preceding implementation. The owner has been asked to
refresh and enter once without toggling Sound.
