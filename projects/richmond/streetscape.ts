// SPDX-License-Identifier: MIT — original, bounded local street furniture.
import * as THREE from "three";
import type { Point } from "./types";
import { distance, type World } from "./world";
import type { Resources } from "./scenery";
export function streetFurniture(r: Resources, world: World) {
  const group = new THREE.Group(),
    cube = r.geometry(new THREE.BoxGeometry(1, 1, 1));
  const make = (geometry: THREE.BufferGeometry, color: number, max = 160) => {
    const mesh = new THREE.InstancedMesh(geometry, r.material(color), max);
    mesh.count = 0;
    group.add(mesh);
    return mesh;
  };
  const trunks = make(cube, 0x806c52),
    crowns = make(r.geometry(new THREE.IcosahedronGeometry(1, 1)), 0x567f50),
    poles = make(cube, 0x536661),
    lamps = make(cube, 0xf0d7a3),
    benches = make(cube, 0xb88c59),
    paint = make(cube, 0xf0ead5, 320),
    signals = make(cube, 0xffffff);
  const dummy = new THREE.Object3D(),
    lights: { point: Point; edge: number }[] = [];
  const degree = new Map<number, number>(),
    edgeIds = new Map<string, number>();
  world.city.edges.forEach((e, i) => {
    if (world.city.roads[e.road].kind !== "road") return;
    degree.set(e.b, (degree.get(e.b) ?? 0) + 1);
    degree.set(e.a, (degree.get(e.a) ?? 0) + 1);
    edgeIds.set(world.city.roads[e.road].id + ":" + e.b, i);
  });
  let centre: Point = [Infinity, Infinity],
    phase = -1;
  const put = (
    mesh: THREE.InstancedMesh,
    p: Point,
    y: number,
    scale: [number, number, number],
    yaw = 0,
  ) => {
    if (mesh.count >= mesh.instanceMatrix.count) return;
    dummy.position.set(p[0], y, p[1]);
    dummy.rotation.set(0, yaw, 0);
    dummy.scale.set(...scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(mesh.count++, dummy.matrix);
  };
  function update(p: Point, time: number) {
    if (distance(p, centre) > 110) {
      centre = [...p];
      for (const m of [trunks, crowns, poles, lamps, benches, paint, signals])
        m.count = 0;
      lights.length = 0;
      const seen = new Set<string>();
      for (const s of world.segments) {
        if (
          s.road.kind !== "road" ||
          s.road.bridge ||
          s.ya > 0.2 ||
          s.yb > 0.2 ||
          distance(s.a, s.b) < 22 ||
          Math.min(distance(s.a, p), distance(s.b, p)) > 230
        )
          continue;
        const dx = s.b[0] - s.a[0],
          dz = s.b[1] - s.a[1],
          len = Math.hypot(dx, dz),
          yaw = Math.atan2(dx, dz),
          offset = s.road.width / 2 + 1.1;
        for (const side of [-1, 1]) {
          const pos: Point = [
            (s.a[0] + s.b[0]) / 2 - (dz / len) * offset * side,
            (s.a[1] + s.b[1]) / 2 + (dx / len) * offset * side,
          ];
          if (!world.walkFits(pos, 0, false) || world.building(pos, 0))
            continue;
          if (side === 1) {
            put(trunks, pos, 1.5, [0.3, 3, 0.3]);
            put(crowns, pos, 4.1, [1.5, 2.3, 1.5]);
          } else {
            put(poles, pos, 3, [0.15, 6, 0.15]);
            put(lamps, pos, 6, [0.8, 0.15, 0.5]);
            if (benches.count % 3 === 0)
              put(
                benches,
                [pos[0] + (dx / len) * 3, pos[1] + (dz / len) * 3],
                0.5,
                [1.8, 1, 0.65],
                yaw,
              );
            else
              put(
                benches,
                [pos[0] + (dx / len) * 3, pos[1] + (dz / len) * 3],
                0.45,
                [0.45, 0.9, 0.45],
              );
          }
        }
        const node = s.road.nodes[s.index + 1],
          id = s.road.id + ":" + node;
        if (
          (degree.get(node) ?? 0) < 3 ||
          seen.has(id) ||
          s.road.class === "service"
        )
          continue;
        seen.add(id);
        const at: Point = [s.b[0] - (dx / len) * 7, s.b[1] - (dz / len) * 7];
        for (let x = -s.road.width / 2 + 1; x < s.road.width / 2 - 1; x += 1.5)
          put(
            paint,
            [at[0] - (dz / len) * x, at[1] + (dx / len) * x],
            0.105,
            [0.75, 0.02, 3],
            yaw,
          );
        const light: Point = [
          at[0] - (dz / len) * offset,
          at[1] + (dx / len) * offset,
        ];
        if (world.walkFits(light, 0, false)) {
          put(poles, light, 2, [0.14, 4, 0.14]);
          put(signals, light, 4, [0.5, 0.8, 0.45]);
          lights.push({ point: light, edge: edgeIds.get(id) ?? 0 });
        }
      }
      for (const m of [trunks, crowns, poles, lamps, benches, paint, signals]) {
        m.instanceMatrix.needsUpdate = true;
        m.computeBoundingSphere();
      }
      phase = -1;
    }
    const next = Math.floor(time / 9) % 2;
    if (next !== phase) {
      lights.forEach((l, i) =>
        signals.setColorAt(
          i,
          new THREE.Color(next === l.edge % 2 ? 0xdf7653 : 0x74b89c),
        ),
      );
      if (signals.instanceColor) signals.instanceColor.needsUpdate = true;
      phase = next;
    }
  }
  return { group, update };
}
