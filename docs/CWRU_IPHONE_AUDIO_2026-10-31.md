# CWRU audio and iPhone Silent Mode

The owner asked for the Halloween sound fix across all campuses and deployment as soon as possible. This CWRU-only follow-up is separate from the verified b360 community/running-control release.

[WebKit issue 237322, comment 6](https://bugs.webkit.org/show_bug.cgi?id=237322#c6) documents requesting `navigator.audioSession.type = "playback"` for Web Audio through Silent Mode on supported iOS browsers. The source was checked on October 31, 2026. API feature detection is used; there is no version sniffing, silent audio loop, external asset or microphone access. Unsupported browsers may still require Silent Mode off.

## Behavior

The explicit Start, edition, sound or preview gesture configures its current/chosen audio settings before unlock. Regular mode, mute, zero volume and hidden entry do not create an AudioContext or acquire playback. With eligible sound, the optional category is requested synchronously before awaiting context resume. The prior category is remembered only when this engine actually changes it.

Mute, Regular mode, zero volume, hiding and disposal release the owned category; an existing playback category or an intervening different media category is preserved. Missing, throwing, ignored and readonly APIs fall back to ordinary Web Audio. A rejected resume releases the category, a stale failed resume cannot revoke a later successful gesture, and disposal during an outstanding resume cannot reacquire it. The wolf-preview control is disabled at zero volume.

The audio module owns its visibility listener from the initial gesture, including before campus assets finish loading, and removes it on disposal. Gesture authorization is retained while the engine lives. This accommodates delayed assets and the engine's initial default-settings configuration before React supplies the selected edition. It does not keep playback acquired while sound is disabled or hidden. Re-enabling configured sound or returning to visibility can reacquire only after a prior successful gesture attempt, and never overrides an intervening different category automatically. Existing synthesized music, creatures, proximity mixing and volume behavior remain.

## Validation and status

Thirteen focused audio tests pass, including the existing placement/cue/voice-lifecycle checks and nine new Audio Session groups covering gesture timing, delayed configuration, inactive modes, category ownership, unsupported APIs and resume races, plus visibility handling before assets load. Fixtures model the browser APIs; they do not prove physical-iPhone output. An isolated Node 24.10.0 export passed TypeScript/ESLint (only the existing tutorial-navigation warning), all 98 CWRU tests and Vinext packaging. Phone 390×844 browser smoke verified Start through a real gesture, mute/re-enable, volume 0 disabling preview, volume 35 restoring it, wolf preview, Regular/Automatic transitions, visible Audio: running, CANVAS focus restoration, no horizontal overflow and no console errors. The first 127.0.0.1 preview origin was rejected for development-only resources; using the configured localhost origin resolved hydration without changing application/security settings. The temporary tab was closed and viewport reset. Exact-source Linux CI and live deployment remain pending.

Physical-device verification remains a limitation: enable Halloween sound with Silent Mode on, listen, adjust volume, mute, background/return and switch to Regular. Do not infer audible physical-device success from a mock Audio Session or desktop browser. The previously verified production artifact b360 does not contain this change.
