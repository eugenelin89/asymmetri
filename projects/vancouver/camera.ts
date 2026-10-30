import type { Point2 } from "./types";

/** Keep the complete horizontal sight line clear, including a lagged camera. */
export function fitDrivingCamera(origin: Point2, desired: Point2, clear: (point: Point2) => boolean) {
  const dx = desired[0] - origin[0], dz = desired[1] - origin[1], distance = Math.hypot(dx, dz);
  const steps = Math.max(1, Math.ceil(distance / 1.5));
  let fraction = 0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, x = origin[0] + dx * t, z = origin[1] + dz * t;
    // A small margin keeps the near plane outside facades too.
    if (!clear([x, z]) || !clear([x + .35, z + .35]) || !clear([x - .35, z - .35])) break;
    fraction = t;
  }
  return { x: origin[0] + dx * fraction, z: origin[1] + dz * fraction, fraction };
}
