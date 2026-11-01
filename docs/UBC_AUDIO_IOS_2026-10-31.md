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

## Implementation

`halloween-audio.ts` records an explicit playback intent independently of the
first engine settings update. This prevents the initial `enabled=false` state
from undoing a valid sound-enable gesture while assets load, and handles the
old muted settings briefly arriving before React applies an unmute action.
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

## Validation

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
`http://127.0.0.1:3038/labs/ubc`, using temporary data stores. A Next.js
production build has not yet been run for this follow-up.

Physical-device acceptance remains pending: enable Halloween sound from a user
gesture with Silent Mode enabled, verify audible output and volume controls,
then verify mute, background pause, return, edition-off and leaving the campus.
Unsupported browsers may still require Silent Mode to be disabled. Browser
validation and production deployment must be recorded separately by the release
owner; this document does not claim either is complete.
