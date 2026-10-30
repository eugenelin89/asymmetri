// SPDX-License-Identifier: MIT
// Reuse Vancouver's tested geometry predicates; no Vancouver assets or state are imported.
import { inPolygon, segmentDistance } from "../vancouver/physics";
import type { City, Point, Pose } from "./types";
export const distance = (a: Point, b: Point) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);
export function createWorld(city: City) {
  const pointAllowed = (p: Point) =>
    Number.isFinite(p[0]) &&
    Number.isFinite(p[1]) &&
    p[0] > city.bounds[0] + 1 &&
    p[0] < city.bounds[2] - 1 &&
    p[1] > city.bounds[1] + 1 &&
    p[1] < city.bounds[3] - 1 &&
    (
      city.walkCells[`${Math.floor(p[0] / 64)},${Math.floor(p[1] / 64)}`] ?? []
    ).some((g) => inPolygon(p, g));
  const fits = (p: Point) =>
    pointAllowed(p) &&
    Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4).every((a) =>
      pointAllowed([p[0] + Math.cos(a) * 0.4, p[1] + Math.sin(a) * 0.4]),
    );
  function clear(a: Point, b: Point) {
    const steps = Math.ceil(distance(a, b) / 0.35);
    for (let i = 0; i <= steps; i++)
      if (
        !fits([
          a[0] + ((b[0] - a[0]) * i) / (steps || 1),
          a[1] + ((b[1] - a[1]) * i) / (steps || 1),
        ])
      )
        return false;
    return true;
  }
  function safe(p: Point): Point {
    if (fits(p)) return [...p];
    for (let r = 1; r < 35; r++)
      for (let a = 0; a < 32; a++) {
        const q: Point = [
          p[0] + Math.cos((a * Math.PI) / 16) * r,
          p[1] + Math.sin((a * Math.PI) / 16) * r,
        ];
        if (fits(q)) return q;
      }
    if (fits(city.anchors.spawn)) return [...city.anchors.spawn];
    throw new Error("This map has no safe start. Please reload the city.");
  }
  const segments = city.roads.flatMap((r) =>
    r.points.slice(1).map((b, i) => ({ a: r.points[i], b, name: r.name })),
  );
  const streetAt = (p: Point) => {
    let name = "Surrey City Centre",
      best = 40;
    for (const s of segments) {
      const d = segmentDistance(p, s.a, s.b);
      if (d < best) {
        best = d;
        name = s.name;
      }
    }
    return name;
  };
  return { fits, clear, safe, streetAt };
}
export type World = ReturnType<typeof createWorld>;
export function move(
  player: Pose,
  dx: number,
  dz: number,
  speed: number,
  delta: number,
  world: World,
): Pose {
  const dt = Math.max(0, Math.min(0.1, delta)),
    length = Math.hypot(dx, dz),
    next = { ...player, moving: false, running: speed > 4, blocked: false };
  if (!length) return { ...next, running: false };
  dx /= length;
  dz /= length;
  next.yaw = Math.atan2(dx, dz);
  const steps = Math.max(1, Math.ceil((speed * dt) / 0.15));
  for (let i = 0; i < steps; i++) {
    const x = next.x + (dx * speed * dt) / steps,
      z = next.z + (dz * speed * dt) / steps;
    if (world.fits([x, z])) {
      next.x = x;
      next.z = z;
      next.moving = true;
    } else {
      next.blocked = true;
      if (world.fits([x, next.z])) {
        next.x = x;
        next.moving = true;
      }
      if (world.fits([next.x, z])) {
        next.z = z;
        next.moving = true;
      }
    }
  }
  return next;
}
/** Bounded A* over the same full-body collision surface. Used only when assigning an NPC route. */
export function route(world: World, from: Point, to: Point): Point[] {
  const start = world.safe(from),
    goal = world.safe(to);
  if (world.clear(start, goal)) return [start, goal];
  const step = 3,
    key = (p: Point) => `${p[0]},${p[1]}`;
  const node = (p: Point): Point => [
    Math.round(p[0] / step),
    Math.round(p[1] / step),
  ];
  const pos = (p: Point): Point => [p[0] * step, p[1] * step];
  const first = node(start);
  const open = [{ p: first, g: 0, f: distance(pos(first), goal) }],
    cost = new Map([[key(first), 0]]),
    prev = new Map<string, Point>();
  let end: Point | undefined;
  for (let count = 0; open.length && count < 40000; count++) {
    let best = 0;
    for (let i = 1; i < open.length; i++)
      if (open[i].f < open[best].f) best = i;
    const cur = open.splice(best, 1)[0];
    if (cur.g !== cost.get(key(cur.p))) continue;
    if (distance(pos(cur.p), goal) < 6 && world.clear(pos(cur.p), goal)) {
      end = cur.p;
      break;
    }
    for (const [x, z] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
    ]) {
      const p: Point = [cur.p[0] + x, cur.p[1] + z],
        g = cur.g + Math.hypot(x, z) * step;
      if (
        g > Math.max(700, distance(start, goal) * 2.5 + 100) ||
        g >= (cost.get(key(p)) ?? Infinity) ||
        !world.clear(pos(cur.p), pos(p))
      )
        continue;
      cost.set(key(p), g);
      prev.set(key(p), cur.p);
      open.push({ p, g, f: g + distance(pos(p), goal) });
    }
  }
  if (!end) return [start];
  const points = [goal, pos(end)];
  let p = end;
  while (prev.has(key(p))) {
    p = prev.get(key(p))!;
    points.push(pos(p));
  }
  points.push(start);
  points.reverse();
  if (!points.every((p, i) => !i || world.clear(points[i - 1], p)))
    return [start];
  const smooth = [start];
  let i = 0;
  while (i < points.length - 1) {
    let j = points.length - 1;
    while (j > i + 1 && !world.clear(points[i], points[j])) j--;
    smooth.push(points[j]);
    i = j;
  }
  return smooth;
}
