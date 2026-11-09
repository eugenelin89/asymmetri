# Physical iPhone Christmas walk measurements

All 18 matched walks reached their interior destinations on a physical iPhone 16 running iOS and Safari 26.5.2 (OS build 23F84). The phone loaded local optimized Next build `vVptuSIL-xqgMyRAbl_mu` on November 9, 2026 UTC. The SafariDriver session used a 320 × 553 CSS-pixel viewport. Safari reported device pixel ratio 3 and viewport scale 1. The UBC Low-quality WebGL drawing buffer measured 240 × 414 pixels. Device power mode, display refresh rate and thermal state were unrecorded.

## Frame times

Each p95 cell gives the three full-route values in milliseconds followed by their median. The delta compares the Christmas median with Regular. Each FPS cell summarizes three runs with the median of their mean FPS followed by the median of their frame-based median FPS.

| Route | Regular p95 (ms) | Christmas p95 (ms) | Change | Regular mean / median FPS | Christmas mean / median FPS |
| --- | --- | --- | ---: | ---: | ---: |
| CWRU · Tinkham Veale University Center | 48, 47, 47 → **47** | 49, 50, 49 → **49** | +4.3% | 43.9 / 50.0 | 41.5 / 47.6 |
| UBC · AMS Student Nest | 50, 31, 51 → **50** | 52, 51, 51 → **51** | +2.0% | 38.5 / 43.5 | 34.1 / 40.0 |
| Stanford · Green Library | 60, 84, 89 → **84** | 69, 83, 86 → **83** | -1.2% | 44.8 / 58.8 | 43.6 / 58.8 |

All three Christmas median p95 changes were within the 10% review threshold. All 18 walks met the 30 FPS mean target, with run means from 32.1 to 50.7 FPS. Frame intervals varied within each walk. The longest interval was 154 ms during Stanford Christmas run 1. The per-run data includes duration, interval count, p50, p95, p99, maximum, intervals over 50 ms, mean and median FPS, welcome activation, audio states and final location. [Per-run measurements](iphone-runs.csv)

One additional Stanford Regular attempt stalled at the Main Quad obstacle near (62.26, 21.81). The follower canceled after 64.773 seconds while approaching waypoint 9. The partial trace recorded 2,631 intervals, p50 17 ms, p95 101 ms, p99 110 ms, maximum 132 ms, 249 intervals over 50 ms and 40.62 mean FPS. A fresh run with identical inputs and settings completed in 138.142 seconds. The comparison includes the three completed Regular traversals. The tablet walkthrough also records this obstacle. [Gallery and tablet evidence](README.md)

## Touch entry

For each Christmas destination, the runner walked backward across the entrance and released the backward key. SafariDriver then held the visible forward touch button until the visitor reached the interior viewpoint. On all three routes Safari recorded trusted `pointerdown` and `pointerup` events with `pointerType=touch` on the forward button, and the HUD changed as follows.

| Campus | Outside | Inside |
| --- | --- | --- |
| CWRU | Tinkham Veale University Center | Tinkham Veale University Center · Level 1 · Reconstructed |
| UBC | AMS Student Nest · Blue Chip & Great Hall | AMS Student Nest · Blue Chip & Great Hall · Level 1 · Reconstructed |
| Stanford | Cecil H. Green Library · East Wing | Cecil H. Green Library · East Wing · Level 1 · Reconstructed |

## First-tap sound in Silent Mode

On the same iPhone, the listener confirmed Silent Mode was on and heard sound through the phone. In ordinary Mobile Safari they tapped each Christmas welcome once on local build `pk8nW65AUxxEwM0mjrQy9`. A temporary same-origin page presented the actual campus routes in sequence. The handset reported a trusted touch-down followed by a trusted click on the welcome button for each campus. The Web Audio context was running and the audio session reported `playback` before the harness selected simulated rain.

| Campus | First human entry, UTC on November 9 | Audio context / session |
| --- | --- | --- |
| UBC | 01:02:00 | running / playback |
| Stanford | 01:02:43 | running / playback |
| CWRU | 01:03:06 | running / playback |

The listener confirmed hearing the sound and requested silent rain. Build `vVptuSIL-xqgMyRAbl_mu` removes rain audio and retains the Christmas chimes. Speaker listening applies to the build and first taps above. The measured runs have separate welcome-activation data in the CSV because SafariDriver required its keyboard fallback after touching the welcome.

## Reproduce the measurement

Use the checkout’s Node version and a local optimized Next build. Pair a physical iPhone with the Mac, enable Safari Web Inspector and Remote Automation, and start SafariDriver. The phone must be able to reach the build. Set `SITE_ORIGIN` to its reachable origin, `SAFARIDRIVER_URL` to the local driver origin, `BUILD_ID` to the tested build ID, and `RESULTS_FILE` to a new local JSON file. The runner requests a real iOS Safari session. To reuse a connected session, set `SAFARI_SESSION_ID` privately.

```sh
node projects/campus-atmosphere/tools/measure-iphone.mjs ubc stanford cwru
```

Within each campus the runner alternates Regular then Christmas for each pair. It restores Low quality, sound at 42%, contextual markers and campus visitors on, with reduced motion off. It selects winter, Midday and Rain in Simulated atmosphere, checks the selections, closes the panel, then waits five seconds. The timed walks follow the published metre coordinates using forward, run and turn key events dispatched to the public canvas. Progress and heading come from a read-only reference to the mounted explorer. On CWRU the last straight uses walking speed so the full sample exceeds 30 seconds. Every run ends at the interior viewpoint, with the named Level 1 HUD checked separately. [Measurement runner](../../../projects/campus-atmosphere/tools/measure-iphone.mjs)

The sampler records consecutive `requestAnimationFrame` intervals in first-person mode, where the engine draws once per callback. Hidden or resized windows and WebGL context loss invalidate the run. The p95 is the ascending interval at rank `ceil(0.95 × frames)`. Mean FPS is the number of intervals divided by their elapsed seconds. Median FPS is the reciprocal of the median interval. The edition comparison uses each edition’s median of its three run p95s. Re-running the command resumes completed walks for the same build and output file.

SafariDriver on this phone offset pointer coordinates when the welcome page scrolled. The harness temporarily scrolls the body within a viewport-height scroll area for the welcome button and restores the page’s styles on entry, before staging conditions or timing. It records trusted input events and the Web Audio context and audio-session states. A separate check backs out of each Christmas doorway and holds the visible forward touch control into the room. Phone speaker audibility and Silent Mode require a listener.
