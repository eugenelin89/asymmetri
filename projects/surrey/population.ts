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
export type Pedestrian = { pose: Pose; path: Point[]; target: number; pause: number };
export function stepPedestrians(people: Pedestrian[], player: Point, threat: Point | null, dt: number, world: World) {
  const positions = people.map(p => [p.pose.x, p.pose.z] as Point);
  people.forEach((p, i) => {
    p.pause = Math.max(0, p.pause - dt);
    if (p.pause > 0) { p.pose.moving = false; return; }
    const dest = p.path[p.target], here = positions[i];
    if (distance(here, dest) < 1) { p.target = 1 - p.target; p.pause = 2 + i % 4; p.pose.moving = false; return; }
    let dx = dest[0] - here[0], dz = dest[1] - here[1];
    const len = Math.hypot(dx, dz); dx /= len; dz /= len;
    for (const q of [...positions.filter((_, j) => i !== j), player]) {
      const d = distance(here, q);
      if (d > .05 && d < 2.2) { dx += (here[0] - q[0]) / d * (2.2 - d); dz += (here[1] - q[1]) / d * (2.2 - d); }
    }
    const fleeing = threat && distance(here, threat) < 12;
    if (fleeing) { dx += (here[0] - threat[0]) / 5; dz += (here[1] - threat[1]) / 5; }
    p.pose = move(p.pose, dx, dz, fleeing ? 2.2 : 1.15, dt, world);
    if (p.pose.blocked) { p.target = 1 - p.target; p.pause = 1; }
  });
}
