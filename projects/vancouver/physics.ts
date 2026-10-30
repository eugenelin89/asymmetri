// Original, deliberately bounded arcade movement. All distances are metres.
import type { City, Point2, Polygon2 } from "./types";

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

export type CarState = { x: number; z: number; yaw: number; speed: number; steer?: number; blocked?: boolean };

/** Nine body samples, including all four corners: the car is 1.9m × 4m. */
export function carFits(car: Pick<CarState, "x" | "z" | "yaw">, allowed: (p: Point2) => boolean): boolean {
  const sin = Math.sin(car.yaw), cos = Math.cos(car.yaw);
  for (const x of [-1.02, 0, 1.02]) for (const z of [-2.08, 0, 2.08]) {
    if (!allowed([car.x + x * cos + z * sin, car.z - x * sin + z * cos])) return false;
  }
  return true;
}

export function stepCar(car: CarState, throttle: number, steering: number, brake: boolean, delta: number, allowed: (p: Point2) => boolean): CarState {
  const dt = Math.min(Math.max(delta, 0), 0.05);
  let speed = car.speed;
  // Opposite pedal first brakes to zero; reverse engages on the next step.
  const opposing = throttle && speed * throttle < -0.08;
  if (brake || opposing) {
    const amount = (brake ? 22 : 14) * dt;
    speed = Math.sign(speed) * Math.max(0, Math.abs(speed) - amount);
  } else if (throttle) speed += throttle * (speed < 0 ? 5 : 8) * dt;
  else speed = Math.sign(speed) * Math.max(0, Math.abs(speed) - (1.3 + Math.abs(speed) * 0.32) * dt);
  speed = Math.max(-5.5, Math.min(19, speed));
  const target = steering * 0.58 / (1 + Math.abs(speed) / 14);
  const steer = (car.steer ?? 0) + (target - (car.steer ?? 0)) * (1 - Math.exp(-10 * dt));
  const steps = Math.max(1, Math.ceil(Math.abs(speed * dt) / 0.25));
  let { x, z, yaw } = car;
  let blocked = false;
  for (let i = 0; i < steps; i++) {
    const nextYaw = yaw + speed / 2.65 * Math.tan(steer) * dt / steps;
    const next = { x: x + Math.sin(nextYaw) * speed * dt / steps, z: z + Math.cos(nextYaw) * speed * dt / steps, yaw: nextYaw };
    if (!carFits(next, allowed)) { speed = 0; blocked = true; break; }
    ({ x, z, yaw } = next);
  }
  return { x, z, yaw, speed, steer, blocked };
}

type Segment = { a: Point2; b: Point2; width: number; name: string };
/** Spatial bins keep repeated collision and street-name queries local. */
function bins<T>(items: T[], bounds: (item: T) => [number, number, number, number]) {
  const grid = new Map<string, T[]>();
  for (const item of items) {
    const [x0, z0, x1, z1] = bounds(item);
    for (let x = Math.floor(x0 / 64); x <= Math.floor(x1 / 64); x++) for (let z = Math.floor(z0 / 64); z <= Math.floor(z1 / 64); z++) {
      const key = `${x},${z}`;
      const cell = grid.get(key) ?? []; cell.push(item); grid.set(key, cell);
    }
  }
  return (p: Point2) => grid.get(`${Math.floor(p[0] / 64)},${Math.floor(p[1] / 64)}`) ?? [];
}

export function createDrivingWorld(city: City) {
  const segments: Segment[] = city.roads.filter((r) => !r.bridge).flatMap((r) => r.points.slice(1).map((b, i) => ({ a: r.points[i], b, width: r.width, name: r.name })));
  const localRoads = bins(segments, (s) => [Math.min(s.a[0], s.b[0]) - s.width, Math.min(s.a[1], s.b[1]) - s.width, Math.max(s.a[0], s.b[0]) + s.width, Math.max(s.a[1], s.b[1]) + s.width]);
  const structures = city.buildings.map((b) => b.shape);
  const localBuildings = bins(structures, (p) => [Math.min(...p[0].map((v) => v[0])), Math.min(...p[0].map((v) => v[1])), Math.max(...p[0].map((v) => v[0])), Math.max(...p[0].map((v) => v[1]))]);
  const allowed = (p: Point2) => localRoads(p).some((s) => segmentDistance(p, s.a, s.b) < s.width / 2 - 0.15)
    && city.land.some((land) => inPolygon(p, land)) && !city.water.some((water) => inPolygon(p, water))
    && !localBuildings(p).some((building) => inPolygon(p, building));
  const streetAt = (p: Point2) => {
    let best = Infinity, name = "Eastern False Creek";
    for (const s of localRoads(p)) { const distance = segmentDistance(p, s.a, s.b); if (distance < best) { best = distance; name = s.name; } }
    return name.replace(/^\d+(?:-\d+)?\s+/, "").toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
  };
  const spawns: (CarState & { score: number })[] = [];
  for (const s of segments) {
    const length = Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]);
    if (length < 45) continue;
    for (const sign of [1, -1]) {
      const yaw = Math.atan2(s.b[0] - s.a[0], s.b[1] - s.a[1]) + (sign < 0 ? Math.PI : 0);
      // Begin near one end of a straight, with a safe clear run ahead.
      const t = sign > 0 ? 0.2 : 0.8;
      const candidate = { x: s.a[0] + (s.b[0] - s.a[0]) * t, z: s.a[1] + (s.b[1] - s.a[1]) * t, yaw, speed: 0, steer: 0, score: Math.min(length, 150) };
      if ([0, 5, 10, 20, 30].every((d) => carFits({ x: candidate.x + Math.sin(yaw) * d, z: candidate.z + Math.cos(yaw) * d, yaw }, allowed))) spawns.push(candidate);
    }
  }
  function spawnNear(point: Point2 = city.anchors["olympic-village"]): CarState {
    const candidate = spawns.reduce<(typeof spawns)[number] | undefined>((best, p) => {
      const score = (v: typeof p) => Math.hypot(v.x - point[0], v.z - point[1]) - v.score * 0.7;
      return !best || score(p) < score(best) ? p : best;
    }, undefined);
    if (!candidate) throw new Error("The city data has no safe driving start. Please use Explore mode.");
    return { x: candidate.x, z: candidate.z, yaw: candidate.yaw, speed: 0, steer: 0 };
  }
  return { allowed, streetAt, spawnNear, spawnCount: spawns.length };
}
