/** Isolated development proof, not a reconstruction of Cambie Bridge. */
import type { CarState, stepCar } from "./physics";
import type { Point2 } from "./types";

export type ElevatedPoint = { x: number; z: number; y: number };
export type RoadSurface = {
  id: string; start: string; end: string; width: number;
  role: "ground" | "ramp" | "deck";
  from: ElevatedPoint; to: ElevatedPoint;
};
export type ElevatedCar = CarState & { y: number; pitch: number; surface: string };

/** C1 ramp ends: zero grade where a ramp joins a flat deck/ground surface. */
export function surfaceSample(surface: RoadSurface, point: Point2) {
  const dx = surface.to.x - surface.from.x, dz = surface.to.z - surface.from.z;
  const length = Math.hypot(dx, dz);
  if (!length || surface.width <= 0) return null;
  const t = ((point[0] - surface.from.x) * dx + (point[1] - surface.from.z) * dz) / (length * length);
  const across = Math.abs((point[0] - surface.from.x) * dz - (point[1] - surface.from.z) * dx) / length;
  if (t < -1e-8 || t > 1 + 1e-8 || across > surface.width / 2) return null;
  const u = Math.max(0, Math.min(1, t)), rise = surface.to.y - surface.from.y;
  return { y: surface.from.y + rise * u * u * (3 - 2 * u), grade: rise * 6 * u * (1 - u) / length, direction: Math.atan2(dx, dz) };
}

export function createElevatedWorld(surfaces: RoadSurface[], groundAllowed: (point: Point2) => boolean) {
  const byId = new Map(surfaces.map((surface) => [surface.id, surface]));
  if (byId.size !== surfaces.length) throw new Error("Duplicate road surface");
  const nodes = new Map<string, ElevatedPoint>();
  for (const surface of surfaces) {
    if (Math.hypot(surface.to.x - surface.from.x, surface.to.z - surface.from.z) < 4 || surface.width < 3) throw new Error("Invalid road surface");
    for (const [id, point] of [[surface.start, surface.from], [surface.end, surface.to]] as const) {
      const prior = nodes.get(id);
      if (prior && Math.hypot(prior.x - point.x, prior.y - point.y, prior.z - point.z) > .001) throw new Error("Connected road endpoints must meet in three dimensions");
      nodes.set(id, point);
    }
  }
  const neighbours = new Map(surfaces.map((surface) => [surface.id, surfaces.filter((other) => other.id === surface.id || [surface.start, surface.end].some((node) => node === other.start || node === other.end))]));
  function sample(point: Point2, current: string) {
    // XY crossings are deliberately not connectivity. A surface is reachable
    // only through an explicitly shared endpoint with the same XYZ position.
    for (const surface of neighbours.get(current) ?? []) {
      const value = surfaceSample(surface, point);
      if (value && (surface.role !== "ground" || groundAllowed(point))) return { ...value, id: surface.id };
    }
    return null;
  }
  function step(integrate: typeof stepCar, initial: ElevatedCar, throttle: number, steering: number, brake: boolean, delta: number): ElevatedCar {
    const duration = Math.max(0, Math.min(delta, .1)), count = Math.max(1, Math.ceil(duration * 120)), dt = duration / count;
    let car = initial;
    for (let i = 0; i < count; i++) {
      const centre = sample([car.x, car.z], car.surface);
      if (!centre || Math.abs(centre.y - car.y) > .05) return { ...car, speed: 0, blocked: true };
      const next = integrate(car, throttle, steering, brake, dt, (point) => {
        const support = sample(point, car.surface);
        // Full body probes must stay supported by the same connected deck/ramp.
        return !!support && Math.abs(support.y - car.y) <= .8;
      });
      const support = sample([next.x, next.z], car.surface), travelled = Math.hypot(next.x - car.x, next.z - car.z);
      if (!support || Math.abs(support.y - car.y) > travelled * .3 + .005) return { ...car, speed: 0, blocked: true };
      car = { ...next, y: support.y, pitch: Math.atan(support.grade * Math.cos(next.yaw - support.direction)), surface: support.id };
    }
    return car;
  }
  function route(from: string, to: string): string[] | null {
    const queue: string[][] = [[from]], visited = new Set([from]);
    if (!byId.has(from) || !byId.has(to)) return null;
    for (let i = 0; i < queue.length; i++) {
      const path = queue[i], end = path[path.length - 1];
      if (end === to) return path;
      for (const next of neighbours.get(end) ?? []) if (!visited.has(next.id)) { visited.add(next.id); queue.push([...path, next.id]); }
    }
    return null;
  }
  return { sample, step, route };
}

/** A 480m synthetic corridor and a disconnected road underneath its deck. */
export const elevationFixture: RoadSurface[] = [
  { id: "south", start: "s0", end: "s1", width: 12, role: "ground", from: { x: 0, z: 0, y: 0 }, to: { x: 0, z: 60, y: 0 } },
  { id: "up", start: "s1", end: "s2", width: 12, role: "ramp", from: { x: 0, z: 60, y: 0 }, to: { x: 0, z: 180, y: 8 } },
  { id: "deck", start: "s2", end: "s3", width: 12, role: "deck", from: { x: 0, z: 180, y: 8 }, to: { x: 0, z: 300, y: 8 } },
  { id: "down", start: "s3", end: "s4", width: 12, role: "ramp", from: { x: 0, z: 300, y: 8 }, to: { x: 0, z: 420, y: 0 } },
  { id: "north", start: "s4", end: "s5", width: 12, role: "ground", from: { x: 0, z: 420, y: 0 }, to: { x: 0, z: 480, y: 0 } },
  { id: "underpass", start: "u0", end: "u1", width: 10, role: "ground", from: { x: -60, z: 190, y: 0 }, to: { x: 60, z: 190, y: 0 } },
];
export const fixtureGround = ([, z]: Point2) => z <= 215 || z >= 275;

export function elevatedCameraTarget(car: ElevatedCar, distance = 16, height = 9) {
  return { x: car.x - Math.sin(car.yaw) * distance, y: car.y + height, z: car.z - Math.cos(car.yaw) * distance, aimY: car.y + 1.5 };
}
