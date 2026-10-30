import type { CarState } from "../physics";

/** Local, bounded diagnostics. Never changes controls or transmits measurements. */
export function createDrivingEvidence() {
  let seconds = 0, frames = 0, peakSpeed = 0, presses = 0, corrections = 0;
  let direction = 0, lastDirection = 0, lastPress = -Infinity;
  let releaseSeconds = 0, releaseDegrees = 0, maxReleaseDegrees = 0;
  const frameBuckets = new Uint32Array(201);
  const contacts: { x: number; z: number; yaw: number; seconds: number }[] = [];
  return {
    step(before: CarState, after: CarState, steering: number, dt: number, frameMs: number) {
      if (!dt) return;
      seconds += dt; frames++; peakSpeed = Math.max(peakSpeed, Math.abs(after.speed));
      frameBuckets[Math.min(200, Math.round(frameMs))]++;
      const next = Math.sign(steering);
      if (next && next !== direction) {
        presses++;
        // A measurable proxy, not a claim that every opposite press is a mistake.
        if (lastDirection && next !== lastDirection && seconds - lastPress < 3) corrections++;
        lastDirection = next; lastPress = seconds;
      }
      if (!next && direction) { releaseSeconds = .3; releaseDegrees = 0; }
      if (!next && releaseSeconds > 0) {
        releaseDegrees += Math.abs(after.yaw - before.yaw) * 180 / Math.PI;
        releaseSeconds -= dt; maxReleaseDegrees = Math.max(maxReleaseDegrees, releaseDegrees);
      } else if (next) releaseSeconds = 0;
      direction = next;
      if (after.blocked && !before.blocked && contacts.length < 100) contacts.push({ x: after.x, z: after.z, yaw: after.yaw, seconds });
    },
    read() {
      let count = 0, p95 = 0;
      for (let ms = 0; ms < frameBuckets.length; ms++) { count += frameBuckets[ms]; if (count >= frames * .95) { p95 = ms; break; } }
      return { steeringPresses: presses, rapidOppositePresses: corrections, maxReleaseDegrees: +maxReleaseDegrees.toFixed(2),
        peakKmh: +(peakSpeed * 3.6).toFixed(1), frameP95Ms: p95, frames, contacts };
    },
  };
}
