# Prompt 188: Deploy UBC Silent Mode audio and record device feedback

- Date: 2026-10-31 (Vancouver)
- Scope: deployment
- Goal: Deploy the tested UBC audio routing fix promptly and distinguish runtime health from actual iPhone behavior.

## Original user request

> deploy sound fix now!

> switch to live now

After activation, the user answered the Silent Mode test:

> I had to turn off sound and turn back sound (by pressing the button) to make the sound work

## Scope and decisions

Release the immutable UBC-only source 7026bda420dc2c9f877f7fd64033403af3b95f42 without waiting for the other campuses' audio changes. CWRU remains the sole server deployment owner; UBC owns its implementation and acceptance. Keep the working deployed version live while correcting the newly demonstrated initial-entry gap. Do not treat a passing health check or mocked Audio Session test as proof of physical acoustic output.

## Implementation and engineering impact

Build eG9hULP6XuiJ4gThLtuif activated at 00:51:08 UTC on November 1 (October 31 Vancouver). The exact package passed guarded staging, startup and activation, with the complete prior b360 runtime retained for rollback. Private stores, configuration, peer sites, retention maintenance and all twelve retained archives were preserved. No synthetic production play or review was created for this follow-up.

The user confirmed that Silent Mode playback works after toggling Sound off and on. Initial entry is not yet accepted. Source review identified an initial 400 ms suspension path and an early engine-default settings snapshot that can cancel playback intent. The required correction will apply the chosen UI settings before gesture resume and preserve them through asset loading. That runtime correction belongs to the separate journal 191; it is not included in this documentation commit.

## Files changed and documentation updated

The UBC audio report now records local browser checks, exact production CI and artifact identity, activation, final health and the user's qualified device feedback. It also records that the test browser's temporary opt-out could not be restored after the preserved old control tab closed. Restoration is not claimed; production defaults remain unchanged.

## Git diff summary

One documentation file changed, 50 insertions and 9 deletions. This journal is excluded from its own totals. No runtime, dependency or other-campus source changes are included.

## Verification

- Local check, all 151 UBC tests, 14 focused audio tests and Vinext build passed before release; independent lifecycle review passed.
- Local browser entry, mute/re-enable, zero then 35% volume, edition off/on and focus restoration passed, with no console errors.
- Linux workflow 41257541348/job 124703801506 passed all 592 tests, production audit with zero vulnerabilities, Next compilation and artifact upload. Artifact 13064240261 matches source 7026bda and the recorded build.
- Final health passed at 00:53:53 UTC: loopback/apex/www each passed 18 pages, 800 public assets and 40 static assets. Fifteen peer hosts, twelve archives, all stores/configuration and the retention timer passed; no new process errors occurred. Minimum available memory was 269,880 KiB and free disk was 9,045,274,624 bytes.
- The live landing page hydrated to Halloween with Scary soundscape enabled, reviews loaded and no console errors. No production gameplay was started in this browser check. A real screenshot is retained with the private release evidence.
- Physical iPhone Silent Mode output was heard after an extra toggle; first-entry startup still requires correction. Other physical lifecycle behavior is not claimed as tested.
- Documentation diff check passed. No repeated application tests were needed for this documentation-only update.

## Repository state after implementation commit

Main at b3ee375ea4376a17775559a9076a825a655748e2, following the separately committed Stanford and CWRU audio changes. Only the UBC report was staged. Generated next-env and any in-progress startup correction remain outside this commit. The two documentation commits are pushed without changing the frozen live 7026 artifact.

## Implementation commits

- b3ee375ea4376a17775559a9076a825a655748e2 — docs(ubc): record live audio release and iPhone startup feedback

## Archive commit

docs: archive UBC audio deployment and device feedback

## Lessons learned

Test the entire initial entry and asset-loading interval, not only the final category value. A controller can report running while an early default setting has restored the ambient session. Preserve explicit user choices independently from stale renderer telemetry.

## Follow-up

Complete and deploy the confined startup correction in the next combined source. The owner-requested other-campus audio changes are independently implemented by their respective threads. Keep the working off/on workaround available until the correction is verified.
