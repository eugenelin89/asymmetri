import * as THREE from "three";
import type { Anchors, CampusData, Point } from "./types";
import { characters } from "./registry";
import { global } from "./spatial";
import { random } from "./scenery";
export type Actor = {
  id: string;
  group: THREE.Group;
  route: Point[];
  target: number;
  pause: number;
  speed: number;
  legs: THREE.Group[];
  arms: THREE.Group[];
  named: boolean;
};
function person(id: string, n: number, named: boolean) {
  const g = new THREE.Group();
  g.userData.info = id;
  const skin = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.065, 0.24, 0.35 + random(n + 2) * 0.4),
    roughness: 0.9,
  });
  const shirt = new THREE.MeshStandardMaterial({
    color: named
      ? id === "werker"
        ? 0x49545f
        : 0x243e4e
      : new THREE.Color().setHSL(
          random(n) * 0.9,
          0.22,
          0.24 + random(n + 3) * 0.28,
        ),
    roughness: 0.9,
  });
  const pants = new THREE.MeshStandardMaterial({
    color: 0x333e43,
    roughness: 0.95,
  });
  function mesh(
    geom: THREE.BufferGeometry,
    mat: THREE.Material,
    parent: THREE.Object3D,
    x: number,
    y: number,
    z: number,
  ) {
    const m = new THREE.Mesh(geom, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    parent.add(m);
    return m;
  }
  mesh(new THREE.CapsuleGeometry(0.22, 0.44, 3, 7), shirt, g, 0, 1.12, 0);
  mesh(new THREE.SphereGeometry(0.145, 10, 8), skin, g, 0, 1.63, 0);
  mesh(
    new THREE.SphereGeometry(0.149, 10, 7, 0, Math.PI * 2, 0, 1.4),
    new THREE.MeshStandardMaterial({ color: named ? 0x7d7a70 : 0x3f352f }),
    g,
    0,
    1.66,
    0,
  );
  const legs: THREE.Group[] = [],
    arms: THREE.Group[] = [];
  for (const x of [-0.115, 0.115]) {
    const leg = new THREE.Group();
    leg.position.set(x, 0.83, 0);
    mesh(new THREE.CapsuleGeometry(0.075, 0.6, 2, 6), pants, leg, 0, -0.32, 0);
    mesh(new THREE.BoxGeometry(0.16, 0.09, 0.27), pants, leg, 0, -0.76, 0.04);
    g.add(leg);
    legs.push(leg);
    const arm = new THREE.Group();
    arm.position.set(Math.sign(x) * 0.275, 1.35, 0);
    mesh(new THREE.CapsuleGeometry(0.058, 0.43, 2, 6), shirt, arm, 0, -0.22, 0);
    mesh(new THREE.SphereGeometry(0.065, 6, 5), skin, arm, 0, -0.5, 0);
    g.add(arm);
    arms.push(arm);
  }
  if (!named)
    mesh(
      new THREE.BoxGeometry(0.3, 0.42, 0.17),
      new THREE.MeshStandardMaterial({ color: 0x897660 }),
      g,
      0,
      1.16,
      -0.23,
    );
  if (named) {
    mesh(
      new THREE.BoxGeometry(0.06, 0.35, 0.025),
      new THREE.MeshStandardMaterial({ color: 0xa87a53 }),
      g,
      0,
      1.2,
      0.225,
    );
  }
  return { group: g, legs, arms };
}
export function createPeople(
  data: CampusData,
  anchors: Anchors,
  isBlocked: (p: Point, y: number) => boolean,
) {
  const group = new THREE.Group(),
    actors: Actor[] = [];
  for (const c of characters) {
    const a = anchors[c.zone];
    if (!a) continue;
    const entry = a.entry || global([0, a.depth / 2 + 3], a);
    let route = c.route
      .map((p) => [entry[0] + p[0], entry[1] + p[1]] as Point)
      .filter((p) => !isBlocked(p, 0));
    if (!route.length) route = [entry];
    const model = person(c.id, c.id === "werker" ? 22 : 51, true);
    model.group.position.set(route[0][0], 0, route[0][1]);
    group.add(model.group);
    actors.push({
      id: c.id,
      ...model,
      route,
      target: route.length > 1 ? 1 : 0,
      pause: 2,
      speed: 1.05,
      named: true,
    });
  }
  // Source route segments are used directly; segments crossing collision stop the actor.
  const routes = data.routes.filter(
    (r) =>
      r.points.length >= 2 &&
      Math.hypot(
        r.points[0][0] - r.points.at(-1)![0],
        r.points[0][1] - r.points.at(-1)![1],
      ) > 8,
  );
  for (let i = 0; i < 45 && routes.length; i++) {
    const r = routes[Math.floor(random(i + 11) * routes.length)],
      route = r.points.filter((p) => !isBlocked(p, 0));
    if (route.length < 2) continue;
    const model = person(`visitor-${i}`, i, false);
    model.group.position.set(route[0][0], 0, route[0][1]);
    group.add(model.group);
    actors.push({
      id: `visitor-${i}`,
      ...model,
      route,
      target: 1,
      pause: random(i) * 4,
      speed: 0.95 + random(i + 2) * 0.5,
      named: false,
    });
  }
  // Representative shoppers and students use checked public circulation lanes.
  for (const [kind, count] of [
    ["bookstore", 7],
    ["nest", 10],
    ["sauder", 4],
  ] as const) {
    const a = anchors[kind];
    if (!a) continue;
    for (let n = 0; n < count; n++) {
      const x = (random(n + 67) - 0.5) * a.width * 0.6,
        z = (random(n + 101) - 0.5) * a.depth * 0.55;
      const route = [
        [x, z],
        [x, z + 4],
        [x + 2, z + 4],
        [x + 2, z],
      ]
        .map((p) => global(p as Point, a))
        .filter((p) => !isBlocked(p, 0));
      if (route.length < 2) continue;
      const id = `visitor-${60 + actors.length}`,
        model = person(id, n + 25, false);
      model.group.position.set(route[0][0], 0, route[0][1]);
      group.add(model.group);
      actors.push({
        id,
        ...model,
        route,
        target: 1,
        pause: 2 + n,
        speed: 0.7,
        named: false,
      });
    }
  }
  function update(
    dt: number,
    time: number,
    focus: Point,
    hour: number,
    population: boolean,
    active: string | null,
    reduced: boolean,
  ) {
    for (const a of actors) {
      const p = a.group.position;
      const dist = Math.hypot(p.x - focus[0], p.z - focus[1]);
      a.group.visible =
        a.named ||
        (population &&
          dist < 220 &&
          ((hour > 6 && hour < 22) || Number(a.id.split("-")[1]) % 5 === 0));
      if (!a.group.visible || active === a.id || reduced) continue;
      if (a.pause > 0) {
        a.pause -= dt;
        continue;
      }
      const target = a.route[a.target],
        dx = target[0] - p.x,
        dz = target[1] - p.z,
        d = Math.hypot(dx, dz);
      if (d < 0.5) {
        a.target = (a.target + 1) % a.route.length;
        a.pause = a.named ? 3 : random(a.target) * 2;
        continue;
      }
      const next: Point = [
        p.x + (dx / d) * dt * a.speed,
        p.z + (dz / d) * dt * a.speed,
      ];
      const crowd = actors.some(
        (b) =>
          b !== a &&
          b.group.visible &&
          Math.hypot(
            b.group.position.x - next[0],
            b.group.position.z - next[1],
          ) < 0.7,
      );
      if (!isBlocked(next, 0) && !crowd) {
        p.x = next[0];
        p.z = next[1];
        a.group.rotation.y = Math.atan2(dx, dz);
        a.legs.forEach(
          (l, i) => (l.rotation.x = Math.sin(time * 5 + i * Math.PI) * 0.35),
        );
        a.arms.forEach(
          (l, i) => (l.rotation.x = -Math.sin(time * 5 + i * Math.PI) * 0.22),
        );
      } else {
        a.target = (a.target + 1) % a.route.length;
        a.pause = 0.5;
      }
    }
  }
  return { group, actors, update };
}
