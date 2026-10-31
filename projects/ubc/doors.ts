// SPDX-License-Identifier: MIT
// Local metre-space hinged doors. Visual and collision state share one angle.
import * as THREE from "three";
import { segmentDistance } from "./spatial";
import type { Point } from "./types";

export type DoorDefinition = {
  id: string;
  name: string;
  hinge: Point;
  y: number;
  width: number;
  /** Closed leaf direction in the x/z plane; opening is a signed quarter turn. */
  angle: number;
  swing: 1 | -1;
};
export function createDoors(definitions: DoorDefinition[]) {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({
    color: 0xb18b61,
    roughness: 0.68,
  });
  const metal = new THREE.MeshStandardMaterial({
    color: 0xa6ada9,
    metalness: 0.8,
    roughness: 0.28,
  });
  const doors = definitions.map((definition) => {
    const pivot = new THREE.Group();
    pivot.position.set(definition.hinge[0], definition.y, definition.hinge[1]);
    pivot.userData.info = definition.id;
    const leaf = new THREE.Mesh(
      new THREE.BoxGeometry(definition.width, 2.12, 0.055),
      wood,
    );
    leaf.position.set(definition.width / 2, 1.06, 0);
    leaf.castShadow = leaf.receiveShadow = true;
    pivot.add(leaf);
    for (const side of [-1, 1]) {
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(0.065, 0.2, 0.02),
        metal,
      );
      plate.position.set(definition.width - 0.12, 1, side * 0.04);
      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.025, 0.035),
        metal,
      );
      handle.position.set(definition.width - 0.17, 1.02, side * 0.07);
      pivot.add(plate, handle);
    }
    group.add(pivot);
    pivot.rotation.y = -definition.angle;
    return {
      ...definition,
      pivot,
      angleNow: definition.angle,
      open: false,
      waiting: false,
    };
  });
  function end(d: (typeof doors)[number], angle = d.angleNow): Point {
    return [
      d.hinge[0] + Math.cos(angle) * d.width,
      d.hinge[1] + Math.sin(angle) * d.width,
    ];
  }
  function blocked(p: Point, y: number) {
    return doors.some(
      (d) =>
        y + 1.65 > d.y + 0.03 &&
        y < d.y + 2.12 &&
        segmentDistance(p, d.hinge, end(d)) < 0.315,
    );
  }
  function toggle(id: string) {
    const d = doors.find((d) => d.id === id);
    if (!d) return false;
    d.open = !d.open;
    return true;
  }
  function update(dt: number, p: Point, y: number, reduced: boolean) {
    for (const d of doors) {
      const goal = d.angle + (d.open ? (d.swing * Math.PI) / 2 : 0);
      const delta = goal - d.angleNow;
      if (Math.abs(delta) < 0.0001) continue;
      const step =
        Math.sign(delta) *
        Math.min(Math.abs(delta), reduced ? Math.PI / 2 : dt * 1.7);
      // Sweep the entire animated arc, including reduced-motion transitions.
      // A visitor in the sweep pauses the leaf; neither opening nor closing pushes them.
      const sameLevel = y + 1.65 > d.y && y < d.y + 2.12;
      const samples = Math.max(1, Math.ceil(Math.abs(step) / 0.025));
      d.waiting =
        sameLevel &&
        Array.from(
          { length: samples },
          (_, i) =>
            segmentDistance(
              p,
              d.hinge,
              end(d, d.angleNow + (step * (i + 1)) / samples),
            ) < 0.34,
        ).some(Boolean);
      if (!d.waiting) d.angleNow += step;
      d.pivot.rotation.y = -d.angleNow;
    }
  }
  function interactions() {
    return doors.map((d) => ({
      id: d.id,
      name: `${d.open ? "Close" : "Open"} ${d.name}${d.waiting ? " · step clear" : ""}`,
      x: d.hinge[0] + (Math.cos(d.angle) * d.width) / 2,
      z: d.hinge[1] + (Math.sin(d.angle) * d.width) / 2,
      y: d.y + 1.1,
    }));
  }
  return { group, doors, blocked, toggle, update, interactions };
}
