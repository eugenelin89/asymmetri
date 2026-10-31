import { uniform, sphere, material } from "./props";
import * as THREE from "three";
import type { Appearance } from "./appearance";
import type { Anchors, CampusData, Point, Character } from "./types";
import { characters } from "./registry";
import { global, segmentDistance } from "./spatial";
import { random } from "./scenery";
import type { Gesture } from "./conversation";
export const namedActorLimits = { university: 10, community: 2 } as const;
export type Actor = {
  id: string;
  group: THREE.Group;
  route: Point[];
  target: number;
  pause: number;
  speed: number;
  legs: THREE.Group[];
  arms: THREE.Group[];
  head: THREE.Group;
  named: boolean;
  waiting?: number;
};
export function person(
  id: string,
  n: number,
  named: boolean,
  color?: string,
  appearance?: Appearance,
) {
  const student = id.startsWith("student-");
  const g = new THREE.Group();
  g.userData.info = id;
  const skin = new THREE.MeshStandardMaterial({
    color:
      appearance?.skin ||
      new THREE.Color().setHSL(0.065, 0.24, 0.35 + random(n + 2) * 0.4),
    roughness: 0.9,
  });
  const shirt = new THREE.MeshStandardMaterial({
    color:
      appearance?.shirt ||
      color ||
      (student
        ? {
            "student-science": 0x507d7b,
            "student-engineering": 0xb18b51,
            "student-business": 0x985f4d,
          }[id] || 0x537574
        : named
          ? id === "werker"
            ? 0x49545f
            : 0x243e4e
          : new THREE.Color().setHSL(
              random(n) * 0.9,
              0.22,
              0.24 + random(n + 3) * 0.28,
            )),
    roughness: 0.9,
  });
  const pants = new THREE.MeshStandardMaterial({
    color: appearance?.trousers || 0x333e43,
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
  const torso = mesh(
    new THREE.CapsuleGeometry(0.22, 0.44, 3, 7),
    shirt,
    g,
    0,
    1.12,
    0,
  );
  torso.scale.x =
    appearance?.presentation === "Feminine"
      ? 0.86
      : appearance?.presentation === "Masculine"
        ? 1.08
        : 1;
  const shoeMaterial = new THREE.MeshStandardMaterial({
    color: appearance?.shoes || 0x273039,
    roughness: 0.8,
  });
  const hairMaterial = new THREE.MeshStandardMaterial({
    color: appearance?.hair || (named && !student ? 0x7d7a70 : 0x3f352f),
  });
  if (appearance?.outfit === "Hoodie")
    mesh(new THREE.SphereGeometry(0.2, 10, 8), shirt, g, 0, 1.38, -0.08);
  if (appearance?.outfit === "Jacket")
    mesh(new THREE.BoxGeometry(0.018, 0.5, 0.015), pants, g, 0, 1.12, 0.222);
  const head = new THREE.Group();
  head.position.y = 1.63;
  g.add(head);
  mesh(new THREE.SphereGeometry(0.145, 10, 8), skin, head, 0, 0, 0);
  if (appearance?.hairstyle !== "Bald")
    mesh(
      new THREE.SphereGeometry(0.149, 10, 7, 0, Math.PI * 2, 0, 1.4),
      hairMaterial,
      head,
      0,
      0.03,
      0,
    );
  if (appearance?.hairstyle === "Long")
    mesh(
      new THREE.CapsuleGeometry(0.14, 0.28, 3, 9),
      hairMaterial,
      head,
      0,
      -0.15,
      -0.09,
    );
  if (appearance?.hairstyle === "Curly")
    for (let i = 0; i < 10; i++)
      mesh(
        new THREE.SphereGeometry(0.07, 6, 5),
        hairMaterial,
        head,
        Math.cos(i * 2.4) * 0.13,
        0.08 + Math.sin(i * 1.7) * 0.055,
        Math.sin(i * 2.4) * 0.13,
      );
  const legs: THREE.Group[] = [],
    arms: THREE.Group[] = [];
  for (const x of [-0.115, 0.115]) {
    const leg = new THREE.Group();
    leg.position.set(x, 0.83, 0);
    mesh(new THREE.CapsuleGeometry(0.075, 0.6, 2, 6), pants, leg, 0, -0.32, 0);
    mesh(
      new THREE.BoxGeometry(
        0.16,
        appearance?.footwear === "Boots" ? 0.18 : 0.09,
        0.27,
      ),
      shoeMaterial,
      leg,
      0,
      appearance?.footwear === "Boots" ? -0.71 : -0.76,
      0.04,
    );
    g.add(leg);
    legs.push(leg);
    const arm = new THREE.Group();
    arm.position.set(Math.sign(x) * 0.275, 1.35, 0);
    mesh(new THREE.CapsuleGeometry(0.058, 0.43, 2, 6), shirt, arm, 0, -0.22, 0);
    mesh(new THREE.SphereGeometry(0.065, 6, 5), skin, arm, 0, -0.5, 0);
    g.add(arm);
    arms.push(arm);
  }
  if ((!named || student) && !appearance)
    mesh(
      new THREE.BoxGeometry(0.3, 0.42, 0.17),
      new THREE.MeshStandardMaterial({ color: 0x897660 }),
      g,
      0,
      1.16,
      -0.23,
    );
  if (named && !student) {
    mesh(
      new THREE.BoxGeometry(0.06, 0.35, 0.025),
      new THREE.MeshStandardMaterial({ color: 0xa87a53 }),
      g,
      0,
      1.2,
      0.225,
    );
  }
  return { group: g, legs, arms, head };
}
export function createPeople(
  data: CampusData,
  anchors: Anchors,
  isBlocked: (p: Point, y: number) => boolean,
) {
  const group = new THREE.Group(),
    actors: Actor[] = [];
  function hash(value: string) {
    let n = 2166136261;
    for (const ch of value) n = Math.imul(n ^ ch.charCodeAt(0), 16777619);
    return n >>> 0;
  }
  const routeCache = new Map<
    string,
    { a: Point; b: Point; distance: number }[]
  >();
  function networkRoute(c: Character): Point[] {
    const a = anchors[c.zone];
    if (!a) return [];
    const segments = routeCache.get(c.zone) || [];
    if (!routeCache.has(c.zone)) {
      for (const r of data.routes)
        for (let i = 1; i < r.points.length; i++) {
          const p = r.points[i - 1],
            q = r.points[i],
            distance = Math.hypot(
              (p[0] + q[0]) / 2 - a.x,
              (p[1] + q[1]) / 2 - a.z,
            );
          if (
            distance < 175 &&
            Math.hypot(p[0] - q[0], p[1] - q[1]) > 5 &&
            !isBlocked(p, 0) &&
            !isBlocked(q, 0)
          ) {
            let clear = true;
            const length = Math.hypot(p[0] - q[0], p[1] - q[1]);
            for (let t = 0; t <= 1; t += Math.min(1, 1 / length))
              if (
                isBlocked(
                  [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t],
                  0,
                )
              ) {
                clear = false;
                break;
              }
            if (clear) segments.push({ a: p, b: q, distance });
          }
        }
      segments.sort((a, b) => a.distance - b.distance);
      routeCache.set(c.zone, segments);
    }
    if (!segments.length) return [];
    const seed = hash(c.id),
      segment = segments[seed % Math.min(60, segments.length)],
      t = 0.1 + ((seed % 1009) / 1009) * 0.8;
    const start: Point = [
      segment.a[0] + (segment.b[0] - segment.a[0]) * t,
      segment.a[1] + (segment.b[1] - segment.a[1]) * t,
    ];
    return [start, segment.b, segment.a];
  }
  let streamed = characters
    .filter((c) => c.routeSpace === "network")
    .map((c) => ({ c, route: networkRoute(c) }))
    .filter((c) => c.route.length);
  function release(actor: Actor) {
    group.remove(actor.group);
    const materials = new Set<THREE.Material>();
    actor.group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
          materials.add(m),
        );
      }
    });
    materials.forEach((m) => {
      if (m instanceof THREE.MeshStandardMaterial) m.map?.dispose();
      m.dispose();
    });
    actors.splice(actors.indexOf(actor), 1);
  }
  function addCharacter(c: Character, index: number, prepared?: Point[]) {
    const a = anchors[c.zone];
    if (!a) return;
    const entry = a.entry || global([0, a.depth / 2 + 3], a);
    const floor = c.floor || 0;
    let route =
      prepared ||
      c.route
        .map((p) =>
          c.routeSpace === "interior"
            ? global(p, a)
            : ([entry[0] + p[0], entry[1] + p[1]] as Point),
        )
        .filter((p) => !isBlocked(p, floor));
    if (!route.length) route = [entry];
    const model = person(
      c.id,
      c.id === "werker"
        ? 22
        : c.category === "fictional"
          ? 80 + index * 17
          : 51,
      true,
      c.color,
      c.appearance,
    );
    if (c.uniform) uniform(model, c.uniform, c.color, c.jerseyNumber);
    if (c.beard)
      sphere(
        model.head,
        material(0x553e2e),
        0,
        -0.07,
        0.085,
        0.112,
        [1, 0.7, 0.75],
      );
    if (c.height) {
      const bounds = new THREE.Box3().setFromObject(model.group);
      model.group.scale.setScalar(c.height / (bounds.max.y - bounds.min.y));
    }
    model.group.position.set(route[0][0], floor, route[0][1]);
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
  characters.filter(c => c.routeSpace !== "network").forEach((c, i) => addCharacter(c, i));
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
    const segment = Math.floor(random(i + 89) * (route.length - 1));
    const fraction = 0.15 + random(i + 132) * 0.7;
    const start: Point = [
      route[segment][0] +
        (route[segment + 1][0] - route[segment][0]) * fraction,
      route[segment][1] +
        (route[segment + 1][1] - route[segment][1]) * fraction,
    ];
    if (
      isBlocked(start, 0) ||
      actors.some(
        (a) =>
          Math.hypot(
            a.group.position.x - start[0],
            a.group.position.z - start[1],
          ) < 4,
      )
    )
      continue;
    const model = person(`visitor-${i}`, i, false);
    delete model.group.userData.info;
    model.group.position.set(start[0], 0, start[1]);
    group.add(model.group);
    actors.push({
      id: `visitor-${i}`,
      ...model,
      route,
      target: segment + 1,
      pause: random(i) * 2,
      speed: i % 5 === 0 ? 2.7 : 0.95 + random(i + 2) * 0.5,
      named: false,
    });
  }
  // Representative shoppers and students use checked public circulation lanes.
  for (const [kind, count] of [
    ["kelvin-smith", 7],
    ["tinkham-veale", 10],
    ["peter-lewis", 4],
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
      delete model.group.userData.info;
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
  let streamTimer = 0;
  const reactions = new Map<string, { gesture: Gesture; elapsed: number }>();
  function react(id: string, gesture: Gesture) {
    if (!actors.some((a) => a.id === id && a.named)) return false;
    reactions.set(id, { gesture, elapsed: 0 });
    return true;
  }
  function update(
    dt: number,
    time: number,
    focus: Point,
    hour: number,
    population: boolean,
    active: string | null,
    reduced: boolean,
    reactionDt = dt,
  ) {
    streamTimer -= dt;
    if (streamTimer <= 0) {
      streamTimer = 0.6;
      const cohort = Math.floor(time / 90);
      const nearby = streamed
        .map((s) => ({
          s,
          rank: hash(s.c.id + cohort) % 45,
          d: Math.hypot(s.route[0][0] - focus[0], s.route[0][1] - focus[1]),
        }))
        .filter((x) => x.d < 125)
        .sort((a, b) => (a.d + a.rank) - (b.d + b.rank));
      const streamedIds = new Set(streamed.map((s) => s.c.id));
      // Keep already encountered actors stable; do not replace the nearest crowd every tick.
      for (const actor of [...actors])
        if (
          streamedIds.has(actor.id) &&
          actor.id !== active &&
          Math.hypot(
            actor.group.position.x - focus[0],
            actor.group.position.z - focus[1],
          ) > 180
        )
          release(actor);
      // Reserve room for player profiles even with hundreds of university entries.
      const communityIds = new Set(streamed.filter(s => s.c.category === "community").map(s => s.c.id));
      let universityCount = actors.filter(a => streamedIds.has(a.id) && !communityIds.has(a.id)).length;
      let communityCount = actors.filter(a => communityIds.has(a.id)).length;
      for (const { s, d } of nearby) {
        const community = s.c.category === "community";
        if (community ? communityCount >= namedActorLimits.community : universityCount >= namedActorLimits.university) continue;
        if (d < 9 || actors.some((a) => a.id === s.c.id)) continue;
        const start = s.route[0];
        const neighbours = actors.filter(
          (a) => Math.abs(a.group.position.y - (s.c.floor || 0)) < 1,
        );
        // Natural spacing along verified paths, rather than a row of nearest roster entries.
        if (
          neighbours.some(
            (a) =>
              Math.hypot(
                a.group.position.x - start[0],
                a.group.position.z - start[1],
              ) < 8,
          )
        )
          continue;
        if (
          neighbours.filter(
            (a) =>
              Math.hypot(
                a.group.position.x - start[0],
                a.group.position.z - start[1],
              ) < 18,
          ).length >= 2
        )
          continue;
        addCharacter(s.c, hash(s.c.id), s.route);
        if (community) communityCount++; else universityCount++;
      }
    }
    for (const a of actors) {
      const p = a.group.position;
      const dist = Math.hypot(p.x - focus[0], p.z - focus[1]);
      a.group.visible =
        (a.named && dist < 160) ||
        (population &&
          dist < 220 &&
          ((hour > 6 && hour < 22) || Number(a.id.split("-")[1]) % 5 === 0));
      const reaction = reactions.get(a.id);
      if (reaction || active === a.id) {
        a.legs.forEach((limb) => limb.rotation.set(0, 0, 0));
        a.arms.forEach((limb) => limb.rotation.set(0, 0, 0));
        a.head.rotation.set(0, 0, 0);
        if (active !== a.id || reduced || !a.group.visible)
          reactions.delete(a.id);
        if (active === a.id) {
          a.group.rotation.y = Math.atan2(focus[0] - p.x, focus[1] - p.z);
          if (reaction && !reduced) {
            reaction.elapsed += Math.max(0, Math.min(reactionDt, 0.1));
            const t = reaction.elapsed;
            const fade = Math.min(1, t * 5, Math.max(0, (2.4 - t) * 5));
            if (reaction.gesture === "wave")
              a.arms[0].rotation.z = (-2.15 + Math.sin(t * 11) * 0.22) * fade;
            else if (reaction.gesture === "nod")
              a.head.rotation.x = Math.sin(t * 7) * 0.15 * fade;
            else a.arms[1].rotation.x = (-0.3 + Math.sin(t * 5) * 0.12) * fade;
            if (t >= 2.4) reactions.delete(a.id);
          }
          continue;
        }
      }
      if (!a.group.visible || reduced) continue;
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
        a.pause = 0.25 + random(hash(a.id) + a.target) * 0.9;
        continue;
      }
      const step = Math.min(d, dt * a.speed),
        ux = dx / d,
        uz = dz / d;
      const clearStep = (point: Point) =>
        !isBlocked(point, p.y) &&
        (Math.hypot(point[0] - focus[0], point[1] - focus[1]) >= 1.1 ||
          Math.hypot(point[0] - focus[0], point[1] - focus[1]) > dist) &&
        !actors.some(
          (b) =>
            b !== a &&
            b.group.visible &&
            Math.abs(b.group.position.y - p.y) < 1 &&
            Math.hypot(
              b.group.position.x - point[0],
              b.group.position.z - point[1],
            ) < 0.85,
        );
      const forward: Point = [p.x + ux * step, p.z + uz * step];
      const candidates: Point[] = [
        forward,
        [
          p.x + (ux * 0.55 + uz * 0.83) * step,
          p.z + (uz * 0.55 - ux * 0.83) * step,
        ],
        [p.x + uz * step, p.z - ux * step],
        [
          p.x + (ux * 0.55 - uz * 0.83) * step,
          p.z + (uz * 0.55 + ux * 0.83) * step,
        ],
        [p.x - uz * step, p.z + ux * step],
      ];
      const next = candidates.find(
        (point, i) =>
          clearStep(point) &&
          (i === 0 ||
            a.route.some(
              (v, n) =>
                n > 0 && segmentDistance(point, a.route[n - 1], v) <= 0.8,
            )),
      );
      if (next) {
        a.waiting = 0;
        a.group.rotation.y = Math.atan2(next[0] - p.x, next[1] - p.z);
        p.x = next[0];
        p.z = next[1];
        a.legs.forEach(
          (l, i) =>
            (l.rotation.x =
              Math.sin(time * (a.speed > 2 ? 9 : 5) + i * Math.PI) *
              (a.speed > 2 ? 0.65 : 0.35)),
        );
        a.arms.forEach(
          (l, i) =>
            (l.rotation.x =
              -Math.sin(time * (a.speed > 2 ? 9 : 5) + i * Math.PI) *
              (a.speed > 2 ? 0.5 : 0.22)),
        );
      } else {
        a.legs.forEach((limb) => (limb.rotation.x = 0));
        a.arms.forEach((limb) => (limb.rotation.x = 0));
        a.waiting = (a.waiting || 0) + dt;
        if (a.waiting > 1.5) {
          a.target = (a.target + 1) % a.route.length;
          a.waiting = 0;
          a.pause = 0.2 + random(hash(a.id)) * 0.5;
        }
      }
    }
  }
  function setCommunity(values: Character[]) {
    // Update only changed/deleted profiles; unchanged actors keep position and animation.
    const prior = new Map(
      streamed
        .filter((s) => s.c.category === "community")
        .map((s) => [s.c.id, JSON.stringify(s.c)]),
    );
    for (const actor of [...actors])
      if (
        actor.id.startsWith("community-") &&
        (!values.some((c) => c.id === actor.id) ||
          JSON.stringify(values.find((c) => c.id === actor.id)) !==
            prior.get(actor.id))
      )
        release(actor);
    streamed = streamed.filter((s) => s.c.category !== "community");
    streamed.push(
      ...values
        .map((c) => ({ c, route: networkRoute(c) }))
        .filter((s) => s.route.length),
    );
    streamTimer = 0;
  }
  return { group, actors, update, setCommunity, react };
}
