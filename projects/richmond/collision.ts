// SPDX-License-Identifier: MIT — Richmond actor contacts; dimensions match the shared car.
import type { Pose, Point } from "./types";
export type ContactActor = Pose & { id?: number; vehicle?: boolean };
export const halfWidth = 1.02,
  halfLength = 2.08;
export function bodyLocal(car: Pose, p: Point): Point {
  const dx = p[0] - car.x,
    dz = p[1] - car.z;
  return [
    dx * Math.cos(car.yaw) - dz * Math.sin(car.yaw),
    dx * Math.sin(car.yaw) + dz * Math.cos(car.yaw),
  ];
}
export function bodyCorners(car: Pose): Point[] {
  return [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ].map(([x, z]) => [
    car.x +
      x * halfWidth * Math.cos(car.yaw) +
      z * halfLength * Math.sin(car.yaw),
    car.z -
      x * halfWidth * Math.sin(car.yaw) +
      z * halfLength * Math.cos(car.yaw),
  ]);
}
export function segmentsCross(a: Point, b: Point, c: Point, d: Point) {
  const cross = (p: Point, q: Point, r: Point) =>
    (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  return (
    cross(a, b, c) * cross(a, b, d) <= 0 &&
    cross(c, d, a) * cross(c, d, b) <= 0 &&
    Math.max(a[0], b[0]) >= Math.min(c[0], d[0]) &&
    Math.max(c[0], d[0]) >= Math.min(a[0], b[0]) &&
    Math.max(a[1], b[1]) >= Math.min(c[1], d[1]) &&
    Math.max(c[1], d[1]) >= Math.min(a[1], b[1])
  );
}
/** Signed penetration in metres. Separating axes include both rotated bodies;
 * a small person between the old nine sample points is still solid. */
export function penetration(car: Pose, actor: ContactActor, margin = 0.15) {
  if (Math.abs(car.y - actor.y) > 2) return 0;
  if (!actor.vehicle) {
    const [x, z] = bodyLocal(car, [actor.x, actor.z]);
    const qx = Math.abs(x) - halfWidth,
      qz = Math.abs(z) - halfLength;
    return Math.max(
      0,
      0.45 +
        margin -
        (Math.hypot(Math.max(0, qx), Math.max(0, qz)) +
          Math.min(0, Math.max(qx, qz))),
    );
  }
  let depth = Infinity;
  for (const yaw of [car.yaw, actor.yaw])
    for (const axis of [
      [Math.cos(yaw), -Math.sin(yaw)],
      [Math.sin(yaw), Math.cos(yaw)],
    ]) {
      const radius = (angle: number, w: number, l: number) =>
        Math.abs(axis[0] * Math.cos(angle) - axis[1] * Math.sin(angle)) * w +
        Math.abs(axis[0] * Math.sin(angle) + axis[1] * Math.cos(angle)) * l;
      const overlap =
        radius(car.yaw, halfWidth, halfLength) +
        radius(actor.yaw, 1.05 + margin, 2.1 + margin) -
        Math.abs((car.x - actor.x) * axis[0] + (car.z - actor.z) * axis[1]);
      if (overlap <= 0) return 0;
      depth = Math.min(depth, overlap);
    }
  return depth;
}
export function contactAllows(before: Pose, after: Pose, actor: ContactActor) {
  const previous = penetration(before, actor),
    next = penetration(after, actor);
  // An existing overlap may slide/separate, but may never deepen. Fresh contact
  // remains solid. Re-evaluate from each accepted substep, not the frame start.
  return next <= 1e-7 || (previous > 0 && next <= previous + 1e-7);
}
