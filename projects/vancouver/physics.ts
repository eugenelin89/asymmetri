// Original, deliberately bounded arcade movement. All distances are metres.
import type { Point2, Polygon2 } from "./types";

export function inRing([x, z]: Point2, ring: Point2[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, az] = ring[i], [bx, bz] = ring[j];
    if ((az > z) !== (bz > z) && x < ((bx - ax) * (z - az)) / (bz - az) + ax) inside = !inside;
  }
  return inside;
}

export function inPolygon(p: Point2, polygon: Polygon2): boolean {
  return inRing(p, polygon[0]) && !polygon.slice(1).some((hole) => inRing(p, hole));
}

export function segmentDistance(p: Point2, a: Point2, b: Point2): number {
  const dx = b[0] - a[0], dz = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / (dx * dx + dz * dz || 1)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dz);
}

export type CarState = { x: number; z: number; yaw: number; speed: number };
export function stepCar(car: CarState, throttle: number, steering: number, brake: boolean, delta: number, allowed: (p: Point2) => boolean): CarState {
  const dt = Math.min(Math.max(delta, 0), 0.05);
  let speed = Math.max(-7, Math.min(22, car.speed + throttle * 12 * dt));
  speed *= Math.exp(-(brake ? 9 : throttle ? 0.3 : 1.7) * dt);
  const yaw = car.yaw + steering * Math.min(1.5, Math.abs(speed) / 8) * Math.sign(speed) * dt;
  const distance = speed * dt;
  const steps = Math.max(1, Math.ceil(Math.abs(distance) / 0.5));
  let { x, z } = car;
  for (let i = 0; i < steps; i++) {
    const nx = x + Math.sin(yaw) * distance / steps;
    const nz = z + Math.cos(yaw) * distance / steps;
    const radius = 1.2;
    if (![[nx, nz], [nx + radius, nz], [nx - radius, nz], [nx, nz + radius], [nx, nz - radius]].every((p) => allowed(p as Point2))) {
      speed = 0;
      break;
    }
    x = nx; z = nz;
  }
  return { x, z, yaw, speed };
}
