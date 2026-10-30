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
  // Integrate at at most 1/120 s so 15/30/60/120 Hz input produces the same
  // motion. Cap long stalls; each substep moves less than 16 cm at top speed.
  const elapsed = Math.min(Math.max(delta, 0), .1);
  const count = Math.max(1, Math.ceil(elapsed * 120)), dt = elapsed / count;
  let { x, z, yaw, speed } = car, steer = car.steer ?? 0, blocked = !!car.blocked;
  for (let i = 0; i < count; i++) {
    const opposing = throttle && speed * throttle < -.08;
    if (brake || opposing) speed = Math.sign(speed) * Math.max(0, Math.abs(speed) - (brake ? 22 : 14) * dt);
    else if (throttle) speed += throttle * (speed < 0 ? 5 : 8) * dt;
    else speed = Math.sign(speed) * Math.max(0, Math.abs(speed) - (1.3 + Math.abs(speed) * .32) * dt);
    speed = Math.max(-5.5, Math.min(19, speed));
    // Firm steering gently sheds speed, making a held keyboard turn controllable.
    const cornerLimit = 19 - Math.min(1, Math.abs(steering)) * 10;
    if (speed > cornerLimit) speed = Math.max(cornerLimit, speed - 9 * dt);
    const target = steering * .72 / (1 + Math.abs(speed) / 22);
    steer += (target - steer) * (1 - Math.exp(-13 * dt));
    const nextYaw = yaw + speed / 2.65 * Math.tan(steer) * dt;
    const next = { x: x + Math.sin(nextYaw) * speed * dt, z: z + Math.cos(nextYaw) * speed * dt, yaw: nextYaw };
    if (!carFits(next, allowed)) { speed = 0; blocked = true; break; }
    if (Math.hypot(next.x - x, next.z - z) > .00001) blocked = false;
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
  const insideSurface = (p: Point2) => city.roadCells
    ? (city.roadCells[`${Math.floor(p[0] / 64)},${Math.floor(p[1] / 64)}`] ?? []).some((polygon) => inPolygon(p, polygon))
    : localRoads(p).some((s) => segmentDistance(p, s.a, s.b) < s.width / 2 - .15)
      && city.land.some((land) => inPolygon(p, land)) && !city.water.some((water) => inPolygon(p, water));
  const allowed = (p: Point2) => insideSurface(p) && !localBuildings(p).some((building) => inPolygon(p, building));
  const obstruction = (car: CarState) => {
    const nose: Point2 = [car.x + Math.sin(car.yaw) * 3 * (car.speed < 0 ? -1 : 1), car.z + Math.cos(car.yaw) * 3 * (car.speed < 0 ? -1 : 1)];
    if (city.water.some((p) => inPolygon(nose, p))) return "Waterfront edge · reverse or recover";
    if (!city.land.some((p) => inPolygon(nose, p))) return "End of this model · reverse or recover";
    if (localBuildings(nose).some((p) => inPolygon(nose, p))) return "Building ahead · reverse or recover";
    return "Road edge · reverse or recover";
  };
  const cameraClear = (p: Point2) => city.land.some((land) => inPolygon(p, land)) && !localBuildings(p).some((building) => inPolygon(p, building));
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
  function recoverNear(car: CarState): CarState {
    const candidates: (CarState & { distance: number })[] = [];
    for (const segment of localRoads([car.x, car.z])) {
      const [ax, az] = segment.a, dx = segment.b[0] - ax, dz = segment.b[1] - az;
      const length = Math.hypot(dx, dz); if (length < 8) continue;
      const t = Math.max(0, Math.min(1, ((car.x - ax) * dx + (car.z - az) * dz) / (length * length)));
      for (const direction of [1, -1]) for (const offset of [-8, 0, 8]) {
        const d = Math.max(3, Math.min(length - 3, t * length + offset));
        const yaw = Math.atan2(dx, dz) + (direction < 0 ? Math.PI : 0);
        const pose = { x: ax + dx * d / length, z: az + dz * d / length, yaw, speed: 0, steer: 0 };
        if ([0, 4, 8].every((ahead) => carFits({ ...pose, x: pose.x + Math.sin(yaw) * ahead, z: pose.z + Math.cos(yaw) * ahead }, allowed))) {
          const angle = Math.abs(Math.atan2(Math.sin(yaw - car.yaw), Math.cos(yaw - car.yaw)));
          candidates.push({ ...pose, distance: Math.hypot(pose.x - car.x, pose.z - car.z) + angle * 4 });
        }
      }
    }
    candidates.sort((a, b) => a.distance - b.distance);
    return candidates[0] ?? spawnNear([car.x, car.z]);
  }
  return { allowed, cameraClear, streetAt, spawnNear, recoverNear, obstruction, spawnCount: spawns.length };
}
