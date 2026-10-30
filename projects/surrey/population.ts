// SPDX-License-Identifier: MIT — bounded sidewalk-parallel routes with local separation.
import type { City, Point, Pose } from "./types";
import type { World } from "./world";
import { distance, move } from "./world";
export function pedestrianRoutes(city: City, world: World) {
  const paths: Point[][] = [];
  for (const road of city.roads) for (let i = 1; i < road.points.length; i++) {
    const a = road.points[i - 1], b = road.points[i], len = distance(a, b);
    if (len < 12 || len > 140 || distance(a, city.anchors.spawn) > 420) continue;
    for (const sign of [-1, 1]) {
      const ox = -(b[1] - a[1]) / len * (road.width / 2 + 3) * sign, oz = (b[0] - a[0]) / len * (road.width / 2 + 3) * sign;
      const p: Point = [a[0] + ox, a[1] + oz], q: Point = [b[0] + ox, b[1] + oz];
      if (world.fits(p) && world.fits(q) && world.clear(p, q)) paths.push([p, q]);
    }
  }
  return paths;
}
export type Role = "commuter" | "student" | "worker" | "shopper";
export type Activity = "walking" | "waiting" | "talking" | "sitting" | "crossing" | "looking" | "fleeing" | "assisting" | "returning";
export type Pedestrian = { pose: Pose; path: Point[]; target: number; pause: number; role?: Role; activity?: Activity; cooldown?: number; distant?: number; crossing?: boolean; active?: boolean };
export function scheduled(role: Role, minutes: number, index = 0) {
  const hour = minutes / 60;
  if (hour < 6 || hour >= 21) return role === "commuter" && index % 2 === 0;
  if (role === "student") return hour >= 8 && hour < 19;
  if (role === "worker") return hour >= 7 && hour < 19;
  if (role === "shopper") return hour >= 10 && hour < 21;
  return true;
}
export function populationPlan(city: City, world: World, count: number) {
  const paths = pedestrianRoutes(city, world);
  const centres: Record<Role, Point> = { commuter: [70, 0], student: [-80, 145], worker: [20, -155], shopper: [-30, 210] };
  const roles = Object.keys(centres) as Role[];
  const crossingPaths: Point[][] = [];
  for (const shape of city.crossings) {
    const ring = shape[0]; if (ring.length < 4) continue;
    const centre: Point = [ring.reduce((s, p) => s + p[0], 0) / ring.length, ring.reduce((s, p) => s + p[1], 0) / ring.length];
    const edge = ring.slice(1).map((q, i) => ({ a: ring[i], b: q, len: distance(ring[i], q) })).sort((a, b) => b.len - a.len)[0];
    if (edge.len < 2 || distance(centre, city.anchors.spawn) > 420) continue;
    const dx = -(edge.b[1] - edge.a[1]) / edge.len, dz = (edge.b[0] - edge.a[0]) / edge.len;
    const a: Point = [centre[0] - dx * 15, centre[1] - dz * 15], b: Point = [centre[0] + dx * 15, centre[1] + dz * 15];
    if (world.fits(a) && world.fits(b) && world.clear(a, b)) crossingPaths.push([a, b]);
  }
  return Array.from({ length: Math.min(count, paths.length) }, (_, i): Pedestrian => {
    const role = roles[i % 4], centre = centres[role];
    const ranked = [...paths].sort((a, b) => distance(a[0], centre) - distance(b[0], centre));
    const crossing = i % 7 === 0 && crossingPaths.length > 0;
    const path = crossing ? crossingPaths[i % crossingPaths.length] : ranked[(Math.floor(i / 4) * 3) % ranked.length];
    const start = path[i % 2];
    return { role, crossing, activity: "waiting", active: true, path, target: 1 - i % 2, pause: 1 + i % 5, cooldown: 0, distant: 0, pose: { x: start[0], z: start[1], yaw: 0, moving: false, running: false, blocked: false } };
  });
}
export function stepPedestrians(people: Pedestrian[], player: Point, threat: Point | null, dt: number, world: World, minutes = 780, budget = people.length, clear: (point:Point)=>boolean = ()=>true) {
  const positions = people.map(p => [p.pose.x, p.pose.z] as Point);
  people.forEach((p, i) => {
    const here = positions[i];
    p.active = i < budget && (!p.role || scheduled(p.role, minutes, i));
    if (!p.active) { p.pose.moving = false; return; }
    const far = distance(here, player) > 140;
    p.distant = (p.distant ?? 0) + dt;
    if (far && p.distant < .4 && !threat) return;
    // Coarse actors advance one safe capped movement step; no long collision jumps.
    const step = Math.min(.1, p.distant); p.distant = 0;
    p.cooldown = Math.max(0, (p.cooldown ?? 0) - step);
    const fleeing = !!threat && distance(here, threat) < 14;
    if (fleeing) { p.activity = "fleeing"; p.pause = 0; p.cooldown = 3; }
    else if (p.activity === "fleeing") { p.activity = "assisting"; p.pause = 2; }
    p.pause = Math.max(0, p.pause - step);
    if (p.pause > 0) { p.pose.moving = p.pose.running = false; return; }
    const dest = p.path[p.target];
    if (distance(here, dest) < 1 && !fleeing) {
      p.target = 1 - p.target;
      const idle: Activity[] = ["waiting", "talking", "sitting", "looking"];
      p.activity = p.crossing ? "waiting" : idle[i % idle.length];
      p.pause = p.crossing ? 5 : 3 + i % 5; p.pose.moving = p.pose.running = false; return;
    }
    if (!fleeing) p.activity = p.cooldown ? "returning" : p.crossing ? "crossing" : "walking";
    let dx = dest[0] - here[0], dz = dest[1] - here[1];
    const len = Math.hypot(dx, dz) || 1; dx /= len; dz /= len;
    for (const q of [...positions.filter((_, j) => i !== j && people[j].active !== false), player]) {
      const d = distance(here, q);
      if (d > .05 && d < 2.2) { dx += (here[0] - q[0]) / d * (2.2 - d); dz += (here[1] - q[1]) / d * (2.2 - d); }
    }
    if (fleeing && threat) { dx += (here[0] - threat[0]) / 5; dz += (here[1] - threat[1]) / 5; }
    const next = move(p.pose, dx, dz, fleeing ? 2.8 : p.role === "commuter" ? 1.4 : 1.15, step, world);
    if (!clear([next.x,next.z])) { p.pose.moving=false; p.activity="waiting"; p.pause=.25; return; }
    p.pose = next;
    if (p.pose.blocked) { p.target = 1 - p.target; p.pause = .5 + i % 3 * .2; p.activity = "looking"; }
  });
}
