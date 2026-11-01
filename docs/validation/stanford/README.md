# Stanford browser evidence

Unretouched screenshots from the local Next webpack preview, 2026-10-31. These are procedural reconstructions and generic avatars, not photographs or likeness evidence.

| Capture | What it verifies |
| --- | --- |
| `welcome-desktop.png` | Desktop entry and edition selection |
| `welcome-mobile.png` | Narrow entry layout |
| `base-third-person.png` | Daytime Quad, third-person avatar and camera controls |
| `church-interior.png` | Walking through Memorial Church into the reconstructed nave |
| `halloween-quad.png` | Night environment and masked pursuit character |
| `halloween-mobile.png` | 390×844 Halloween view with touch controls |
| `map-tablet.png` | 768×1024 source-based campus atlas |
| `profile-mobile.png` | Loaded public-profile form at 390×844 |
| `branner-floor-guide.png` | Virtual residence floor selector |
| `photo-mode.png` | Successful PNG capture preview, 1472×827 image |
| `sound-settings.png` | Halloween scheduling, original sound and volume controls |

Observed: no document overflow at 390, 768 or 1280 px; no broken images in sampled layouts. Search accepts text. Closing Explore returns canvas focus; held W moves immediately in first and third person. Escape also restores canvas focus. Browser sound context reached `running` and scheduled atmospheric cues. Base restored the earlier daytime atmosphere; automatic scheduling selected Halloween on October 31.

The frame-rate figures in settings are observations on a busy shared host, not certified targets. Auto fallback later reached 56 FPS with 224 draw calls in Halloween; a later expanded-roster observation under concurrent host work was 12 FPS with314 draw calls. Reduced-motion selection was confirmed checked, and the final browser console had no errors. Audio was verified through state/cue telemetry and synthesis tests, not subjective speaker audition. Community lifecycle/security and all 32 entrances have automated coverage. The profile form was opened without publishing a real or invented person through the visitor consent flow.

## Initial production acceptance

The exact `a69cb68` Linux build was verified live on October 31. `live-welcome-desktop.jpg` shows automatic Halloween entry; `live-church-interior.jpg` shows actual walking into Memorial Church Level 1; `live-profile-mobile.jpg` shows the public-profile form at 390×844. The first two are 1280×720. These unretouched captures contain no submitted participant data. Live movement/focus, Base/automatic theme switching, mute/volume, mobile map, zero horizontal overflow/broken images and an empty console-error list passed. The synthetic live HTTP profile lifecycle also passed and removed its fixture. See the [release receipt](../../STANFORD_RELEASE_2026-10-31.md).

## Shared-feature follow-up preview before panel removal

The owner subsequently requested removal of the Play privacy panel everywhere. The privacy-panel captures below are retained as historical validation evidence; they do not represent the current Stanford UI.

`followup-privacy-desktop.jpg` shows the notice before entering the game; `followup-review-mobile.jpg` shows the empty mobile form and visible text-area focus; `followup-history-removal-mobile.jpg` shows the corrected in-game privacy layout and deletion confirmation. These local captures are not proof of follow-up deployment. Review create/edit/remove/sort and play opt-out/start/off-screen pause/resume/deletion passed with disposable local stores; both stores finished empty. The final panel styling passed fresh type/lint, Vinext and Next builds (511 Next prebuild tests). The final browser had no errors, no broken images and no document overflow at390 or768px; desktop1280px was also inspected. Full visibility/idle/privacy-signal/cross-tab sequencing has shared automated coverage. See [integration evidence](../../STANFORD_COMMUNITY_INTEGRATION_2026-10-31.md).

## Preview after panel removal

The later owner-requested removal passed fresh 182 focused tests, type/lint, Vinext, Next webpack and the production dependency audit. Browser verification confirmed no Play privacy panel or controls on the landing page or inside Project information, with no overflow at 390, 768 or 1280 px, no sampled broken images and no console errors. Closing the information panel restored canvas focus. The revised desktop landing and mobile information screenshots are retained as private local release evidence rather than replacing the earlier historical captures. This verification covers the Stanford-only removal export; exact combined Linux CI and production acceptance remain separate.

## Community release production acceptance

Exact source `b3601b3` passed live acceptance at 00:36:18 UTC on November 1 (October 31 Vancouver). `community-live-welcome-desktop.jpg` and `community-live-information-desktop.jpg` (1280×720) show the welcome and loaded Halloween information view without the removed privacy panel. `community-live-review-mobile.jpg` (390×844) shows the empty review form and visible keyboard focus. These original, unretouched captures contain no submitted visitor data or private telemetry. Alt descriptions: Stanford Halloween welcome without recording controls; Stanford Project information without the removed panel; empty Stanford visitor review form with focused comment field.

Automatic Halloween, loaded game, canvas/review focus restoration, plain policy access, no overflow, no sampled broken images and no console errors passed. No production review or synthetic play API fixture was submitted. The temporary browser tab was closed and viewport reset; the release owner's reserved tab/preference was preserved. This pass did not repeat held walking or exhaustive interior traversal and does not certify physical-device audio. See the [production receipt](../../STANFORD_COMMUNITY_RELEASE_2026-10-31.md).

## iPhone audio release acceptance

Source `33e4b65` is deployed with Stanford's optional Audio Session playback change. Both public domains delivered the exact packaged Stanford HTML and audio/page bundle. Live desktop landing hydration, automatic Halloween, review loading, panel absence, no overflow, no sampled broken images and no console errors passed. No production game was entered and browser preferences were untouched. Temporary tabs were closed; no viewport override was used.

The separate isolated desktop preview passed a fresh entry with no Sound toggle, showing a running audio context and two atmospheric cues. Mute, volume, Base/automatic controls and 15 lifecycle/race fixtures also passed. Original screenshots and machine-readable evidence remain in the private release-retention directory; no new screenshot asset is published here. The agent’s live check does not establish production gameplay or physical iPhone speaker output. Separately, the owner confirmed that audio starts on entry on their iPhone with Silent Mode ON after refreshing, without toggling Sound; no device or OS version was collected. See the [audio release receipt](../../STANFORD_AUDIO_RELEASE_2026-10-31.md).
