// Original ambient scenes. Fictional participants; no real occupancy or game data.
import * as THREE from "three";
import type { Anchors, CampusData, Point } from "./types";
import { inPolygon } from "./spatial";
import { person } from "./people";
import {
  batchStatic,
  bicycle,
  box,
  material,
  sphere,
  uniform,
  beam,
} from "./props";
import { alongPath, pathLength } from "./traffic";
export function arcPoint(
  a: THREE.Vector3,
  b: THREE.Vector3,
  t: number,
  height: number,
) {
  return a
    .clone()
    .lerp(b, t)
    .add(new THREE.Vector3(0, 4 * height * t * (1 - t), 0));
}
export function createActivities(
  data: CampusData,
  anchors: Anchors,
  blocked: (p: Point, y: number) => boolean,
) {
  const group = new THREE.Group(),
    scenes: { group: THREE.Group; update: (time: number) => void }[] = [];
  let time = 0;
  const attach = (
    g: THREE.Group,
    zone: string,
    update: (t: number) => void,
  ) => {
    const a = anchors[zone];
    if (!a) return;
    g.position.set(a.x, 0.05, a.z);
    g.rotation.y = a.yaw;
    group.add(g);
    scenes.push({ group: g, update });
  };
  const athlete = (
    g: THREE.Group,
    i: number,
    sport: string,
    color = "#234d81",
  ) => {
    const p = person(`activity-${sport}-${i}`, i * 17 + 22, false);
    delete p.group.userData.info;
    uniform(p, sport, color, String(i + 1));
    g.add(p.group);
    return p;
  };
  const pose = (
    p: ReturnType<typeof person>,
    x: number,
    z: number,
    t: number,
    yaw: number,
    running = true,
  ) => {
    p.group.position.set(x, 0, z);
    p.group.rotation.y = yaw;
    p.legs.forEach(
      (leg, i) =>
        (leg.rotation.x = running ? Math.sin(t * 9 + i * Math.PI) * 0.7 : 0),
    );
    p.arms.forEach(
      (arm, i) =>
        (arm.rotation.x = running ? -Math.sin(t * 9 + i * Math.PI) * 0.45 : 0),
    );
  };
  // Batting, live pitcher delivery and a fielded fly ball in the stadium's local axes.
  const baseball = new THREE.Group(),
    batter = athlete(baseball, 0, "baseball"),
    pitcher = athlete(baseball, 1, "baseball"),
    catcher = athlete(baseball, 2, "baseball"),
    fielder = athlete(baseball, 3, "baseball"),
    ball = sphere(baseball, material(0xede7d8), 0, 1, -18.44, 0.075);
  const bat = box(
    batter.arms[1],
    material(0xb99c6a),
    0,
    -0.5,
    0.42,
    0.065,
    0.065,
    1,
  );
  bat.rotation.x = 0.5;
  const glove = sphere(
    fielder.arms[0],
    material(0x8c623f),
    0,
    -0.5,
    0.03,
    0.13,
    [1, 0.6, 1.3],
  );
  glove.name = "fly-ball-glove";
  for (let i = 4; i < 9; i++) {
    const p = athlete(baseball, i, "baseball");
    p.group.position.set((i % 2 ? 1 : -1) * (16 + i * 3), 0, -25 - i * 7);
  }
  attach(baseball, "stadium", (t) => {
    const phase = t % 12,
      hit = new THREE.Vector3(-1, 0.9, -0.5),
      landing = new THREE.Vector3(-28, 1.8, -68);
    pose(batter, -1.1, 0.3, t, -Math.PI / 2, false);
    pose(pitcher, 0, -18.44, t, 0, false);
    pitcher.group.position.y = 0.12;
    pose(catcher, 0.3, 2.2, t, Math.PI, false);
    catcher.group.scale.y = 0.72;
    const chase = Math.min(1, Math.max(0, (phase - 1.4) / 3.3)),
      returning = phase > 6 ? (phase - 6) / 6 : 0;
    pose(
      fielder,
      -36 + 8 * chase * (1 - returning),
      -74 + 6 * chase * (1 - returning),
      t,
      Math.atan2(8, 6),
      (phase > 1.4 && phase < 4.7) || phase > 6,
    );
    pitcher.arms[0].rotation.x =
      phase < 1.3 ? -Math.sin((phase / 1.3) * Math.PI) * 2.7 : 0;
    batter.arms[1].rotation.y =
      phase > 1.1 && phase < 1.8
        ? Math.sin(((phase - 1.1) / 0.7) * Math.PI) * 2.6
        : 0;
    if (phase < 1.4)
      ball.position.copy(
        arcPoint(new THREE.Vector3(0, 1.8, -18.44), hit, phase / 1.4, 0.12),
      );
    else if (phase < 4.9)
      ball.position.copy(arcPoint(hit, landing, (phase - 1.4) / 3.5, 17));
    else if (phase < 6.3) {
      fielder.arms[0].rotation.x = -2.6;
      fielder.group.updateMatrixWorld(true);
      glove.getWorldPosition(ball.position);
      baseball.worldToLocal(ball.position);
    } else
      ball.position.copy(
        arcPoint(
          new THREE.Vector3(
            fielder.group.position.x,
            1.5,
            fielder.group.position.z,
          ),
          new THREE.Vector3(0, 1.8, -18.44),
          (phase - 6.3) / 5.7,
          4,
        ),
      );
  });
  // The publicly documented MacInnes Family Field is the multi-use field beside the Nest.
  const soccer = new THREE.Group(),
    centre: Point = [-284.2, -748.41],
    soccerYaw = -1.08;
  soccer.position.set(centre[0], 0.06, centre[1]);
  soccer.rotation.y = soccerYaw;
  group.add(soccer);
  const white = material(0xf0eee3),
    net = material(0xc5c6bb),
    fieldLine = (x: number, z: number, w: number, d: number) =>
      box(soccer, white, x, 0.02, z, w, 0.014, d);
  for (const x of [-44.25, 44.25]) fieldLine(x, 0, 0.07, 44.5);
  for (const z of [-22.25, 22.25]) fieldLine(0, z, 88.5, 0.07);
  fieldLine(0, 0, 0.07, 44.5);
  for (const side of [-1, 1]) {
    const x = side * 44.25;
    for (const z of [-3.66, 3.66])
      beam(
        soccer,
        white,
        new THREE.Vector3(x, 0, z),
        new THREE.Vector3(x, 2.44, z),
        0.055,
      );
    beam(
      soccer,
      white,
      new THREE.Vector3(x, 2.44, -3.66),
      new THREE.Vector3(x, 2.44, 3.66),
      0.055,
    );
    for (let z = -3.66; z <= 3.66; z += 0.22)
      beam(
        soccer,
        net,
        new THREE.Vector3(x, 2.44, z),
        new THREE.Vector3(x + side * 1.6, 0, z),
        0.009,
      );
    for (let y = 0.22; y < 2.44; y += 0.22)
      beam(
        soccer,
        net,
        new THREE.Vector3(x + side * (1 - y / 2.44) * 1.6, y, -3.66),
        new THREE.Vector3(x + side * (1 - y / 2.44) * 1.6, y, 3.66),
        0.009,
      );
  }
  const soccerPlayers = Array.from({ length: 10 }, (_, i) =>
      athlete(soccer, i, "soccer", i < 5 ? "#345f91" : "#d2b15e"),
    ),
    soccerBall = sphere(soccer, white, 0, 0.12, 0, 0.12);
  // Original black patches make the rolling ball legible without image textures.
  for (const x of [-1, 1])
    sphere(soccerBall, material(0x28302e), x * 0.09, 0.02, 0, 0.046);
  const plays: Point[] = [
    [-22, -7],
    [-12, 8],
    [4, 4],
    [18, -9],
    [32, -3],
    [43, 0],
    [20, 6],
    [0, -8],
    [-20, 3],
  ];
  scenes.push({
    group: soccer,
    update: (t) => {
      const index = Math.floor(t / 3) % plays.length,
        phase = (t % 3) / 3,
        a = plays[index],
        b = plays[(index + 1) % plays.length];
      soccerBall.position.copy(
        arcPoint(
          new THREE.Vector3(a[0], 0.12, a[1]),
          new THREE.Vector3(b[0], 0.12, b[1]),
          phase,
          index === 4 ? 1.7 : 0.13,
        ),
      );
      soccerBall.rotation.z = t * 8;
      soccerPlayers.forEach((p, i) => {
        const home = plays[i % plays.length],
          x = home[0] + Math.sin(t * 0.35 + i) * 2.3,
          z = home[1] + Math.cos(t * 0.32 + i) * 2;
        pose(
          p,
          x,
          z,
          t + i,
          Math.atan2(soccerBall.position.x - x, soccerBall.position.z - z),
        );
      });
    },
  });
  // Half-court passing, dribbling and an arcing shot inside War Memorial Gym.
  const basketball = new THREE.Group(),
    players = Array.from({ length: 10 }, (_, i) =>
      athlete(basketball, i, "basketball", i < 5 ? "#245487" : "#d4bc70"),
    ),
    basket = sphere(basketball, material(0xbc6b30), 0, 1, -10, 0.12);
  for (let i = 0; i < 3; i++) {
    const seam = new THREE.Mesh(
      new THREE.TorusGeometry(0.121, 0.006, 5, 18),
      material(0x3c3027),
    );
    seam.rotation.set((i * Math.PI) / 2, ((i % 2) * Math.PI) / 2, 0);
    basket.add(seam);
  }
  attach(basketball, "war-memorial", (t) => {
    const phase = t % 16,
      side = Math.floor(t / 16) % 2 ? 1 : -1;
    const from = new THREE.Vector3(side * 5, 1.4, -7),
      to = new THREE.Vector3(side * 9, 1.6, -12),
      rim = new THREE.Vector3(side * 12.425, 3.05, -10);
    if (phase < 6)
      basket.position.set(
        from.x + Math.sin(phase) * 0.8,
        0.15 + Math.abs(Math.sin(phase * 6)) * 1.05,
        from.z,
      );
    else if (phase < 7.2)
      basket.position.copy(arcPoint(from, to, (phase - 6) / 1.2, 0.25));
    else if (phase < 9)
      basket.position.set(
        to.x,
        0.16 + Math.abs(Math.sin(phase * 6)) * 1.1,
        to.z,
      );
    else if (phase < 11)
      basket.position.copy(arcPoint(to, rim, (phase - 9) / 2, 2.4));
    else if (phase < 12)
      basket.position.set(
        rim.x,
        Math.max(0.15, 3.05 - (phase - 11) * 4),
        rim.z,
      );
    else
      basket.position.copy(
        arcPoint(
          new THREE.Vector3(rim.x, 0.4, rim.z),
          from,
          (phase - 12) / 4,
          0.6,
        ),
      );
    basket.rotation.x = t * 5;
    players.forEach((p, i) => {
      let x = side * (i < 5 ? 3 + i * 1.6 : 5 + (i - 5) * 1.5),
        z = -10 + Math.sin(i * 1.7) * 5;
      if (i === 0) {
        x = from.x;
        z = from.z - 0.45;
      }
      if (i === 1) {
        x = to.x;
        z = to.z - 0.45;
      }
      const motion = i > 1 ? Math.sin(t * 0.6 + i) * 0.8 : 0;
      pose(
        p,
        x + motion,
        z,
        t + i,
        Math.atan2(basket.position.x - x, basket.position.z - z),
        i > 1,
      );
      if (i === 1 && phase >= 9 && phase < 11)
        p.arms.forEach((a) => (a.rotation.x = -2.5));
      if (i === 0 && phase < 6)
        p.arms[1].rotation.x = -0.25 - Math.abs(Math.sin(phase * 6)) * 0.6;
    });
  });
  // Fictional science-fair visitors and café customers, never actual pupils.
  const nestPeople = new THREE.Group();
  const fairVisitors = Array.from({ length: 9 }, (_, i) => {
    const p = athlete(
      nestPeople,
      i + 50,
      "visitor",
      ["#668b7c", "#b79761", "#665a7a"][i % 3],
    );
    const a = anchors.nest,
      left = -a.width / 2 + 0.4;
    p.group.position.set(left + 10 + (i % 3) * 5, 5, 5 + Math.floor(i / 3) * 7);
    p.group.rotation.y = Math.PI;
    return p;
  });
  const cafeVisitors = Array.from({ length: 3 }, (_, i) => {
    const p = athlete(
        nestPeople,
        i + 70,
        "visitor",
        i === 0 ? "#393c3c" : "#737d97",
      ),
      a = anchors.nest;
    p.group.position.set(
      a.width * 0.2 + (i - 1) * 2,
      0,
      -a.depth / 2 + (i === 0 ? 1 : 4.2),
    );
    return p;
  });
  attach(nestPeople, "nest", (t) => {
    [...fairVisitors, ...cafeVisitors].forEach((p, i) => {
      p.arms[0].rotation.x = -0.2 + Math.sin(t * 0.7 + i) * 0.12;
    });
  });
  // Frisbee groups occupy source lawn polygons; no paths or building interiors.
  const lawns = data.surfaces.filter((s) => /lawn|grass/i.test(s.kind));
  let groups = 0;
  for (const lawn of lawns) {
    if (groups >= 4) break;
    const ring = lawn.rings[0],
      c: Point = [
        ring.reduce((s, p) => s + p[0], 0) / ring.length,
        ring.reduce((s, p) => s + p[1], 0) / ring.length,
      ];
    if (
      ![-8, 0, 8].every(
        (x) =>
          inPolygon([c[0] + x, c[1]], lawn.rings) &&
          !blocked([c[0] + x, c[1]], 0),
      )
    )
      continue;
    const g = new THREE.Group();
    g.position.set(c[0], 0.04, c[1]);
    group.add(g);
    const a = athlete(g, 10 + groups, "frisbee", "#69847d"),
      b = athlete(g, 20 + groups, "frisbee", "#b68a5e"),
      disc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.025, 20),
        material(0xe6ce73),
      );
    g.add(disc);
    groups++;
    scenes.push({
      group: g,
      update: (t) => {
        const phase = t % 6,
          forward = phase < 3,
          u = (phase % 3) / 3;
        pose(a, -8, 0, t, Math.PI / 2, false);
        pose(b, 8, 0, t, -Math.PI / 2, false);
        const start = new THREE.Vector3(forward ? -7.6 : 7.6, 1.2, 0),
          end = new THREE.Vector3(forward ? 7.6 : -7.6, 1.2, 0);
        disc.position.copy(arcPoint(start, end, Math.min(1, u * 1.3), 0.7));
        disc.rotation.y = t * 12;
        (forward ? a : b).arms[0].rotation.x =
          u < 0.25 ? -Math.sin(u * 4 * Math.PI) * 1.2 : 0;
      },
    });
  }
  // Small native-looking wildlife; locations are illustrative, checked against lawns.
  const animals: {
    model: THREE.Group;
    origin: Point;
    ring: Point[][];
    phase: number;
    bird: boolean;
  }[] = [];
  for (let i = 0; i < Math.min(24, lawns.length); i++) {
    const lawn = lawns[(i * 17) % lawns.length],
      ring = lawn.rings[0],
      c: Point = [
        ring.reduce((s, p) => s + p[0], 0) / ring.length,
        ring.reduce((s, p) => s + p[1], 0) / ring.length,
      ];
    if (!inPolygon(c, lawn.rings) || blocked(c, 0)) continue;
    const g = new THREE.Group(),
      fur = material(i % 3 === 0 ? 0x343b3d : i % 2 ? 0x9d9180 : 0x776d5a),
      bird = i % 3 === 0;
    sphere(g, fur, 0, 0.22, 0, bird ? 0.12 : 0.19, [1, 1, 1.5]);
    sphere(g, fur, 0, 0.36, 0.15, 0.1);
    if (!bird)
      for (const side of [-1, 1]) {
        sphere(g, fur, side * 0.055, 0.49, 0.15, 0.05, [
          0.65,
          i % 2 ? 2.4 : 1.1,
          0.6,
        ]);
        sphere(g, fur, side * 0.13, 0.08, 0.1, 0.06, [0.7, 0.8, 1.5]);
      }
    if (!bird && i % 2 === 0)
      sphere(g, fur, 0, 0.36, -0.25, 0.12, [0.85, 1.7, 0.8]);
    if (bird)
      for (const side of [-1, 1])
        sphere(g, fur, side * 0.13, 0.25, 0, 0.1, [1.5, 0.3, 1]);
    sphere(g, material(0x151a18), 0.065, 0.39, 0.22, 0.018);
    g.position.set(c[0], 0.04, c[1]);
    group.add(g);
    animals.push({
      model: g,
      origin: c,
      ring: lawn.rings,
      phase: i * 1.7,
      bird,
    });
  }
  const cyclists: {
    model: ReturnType<typeof person>;
    bike: ReturnType<typeof bicycle>;
    route: Point[];
    length: number;
    distance: number;
  }[] = [];
  for (let i = 0; i < data.routes.length && cyclists.length < 14; i += 13) {
    const r = data.routes[i];
    if (
      r.points.length < 2 ||
      pathLength(r.points) < 45 ||
      r.points.some((p) => blocked(p, 0))
    )
      continue;
    const model = person(`cyclist-${i}`, i, false);
    delete model.group.userData.info;
    const bike = bicycle();
    model.group.add(bike.group);
    model.group.children[0].rotation.x = 0.25;
    model.arms.forEach((a) => (a.rotation.x = -1));
    group.add(model.group);
    cyclists.push({
      model,
      bike,
      route: r.points,
      length: pathLength(r.points),
      distance: 0,
    });
  }
  batchStatic(baseball, new Set([ball]));
  batchStatic(soccer, new Set([soccerBall]));
  batchStatic(basketball, new Set([basket]));
  animals.forEach((a) => batchStatic(a.model));
  cyclists.forEach((c) => batchStatic(c.bike.group, new Set(c.bike.wheels)));
  function update(
    dt: number,
    focus: Point,
    enabled: boolean,
    reduced: boolean,
  ) {
    if (!reduced) time += Math.min(dt, 0.05);
    for (const s of scenes) {
      s.group.visible =
        enabled &&
        Math.hypot(
          s.group.position.x - focus[0],
          s.group.position.z - focus[1],
        ) < 220;
      if (s.group.visible) s.update(time);
    }
    for (const a of animals) {
      a.model.visible =
        enabled &&
        Math.hypot(a.origin[0] - focus[0], a.origin[1] - focus[1]) < 95;
      if (!a.model.visible || reduced) continue;
      const phase = (time + a.phase) % 12,
        moving = phase < 5,
        angle = (time + a.phase) * 0.7,
        p: Point = [
          a.origin[0] + Math.cos(angle) * 3,
          a.origin[1] + Math.sin(angle) * 2,
        ];
      if (moving && inPolygon(p, a.ring) && !blocked(p, 0)) {
        a.model.rotation.y = Math.atan2(
          p[0] - a.model.position.x,
          p[1] - a.model.position.z,
        );
        a.model.position.set(
          p[0],
          0.04 + Math.abs(Math.sin(time * 11)) * (a.bird ? 0.025 : 0.08),
          p[1],
        );
      }
    }
    for (const c of cyclists) {
      const p = alongPath(c.route, c.distance);
      const distance = Math.hypot(p.x - focus[0], p.z - focus[1]);
      c.model.group.visible = enabled && distance < 180;
      if (!reduced && distance > 2.5) {
        const next = alongPath(
          c.route,
          Math.min(c.length, c.distance + dt * 3.8),
        );
        if (!blocked([next.x, next.z], 0))
          c.distance = Math.min(c.length, c.distance + dt * 3.8);
      }
      if (c.distance >= c.length && distance > 80) c.distance = 0;
      c.model.group.position.set(p.x, 0.05, p.z);
      c.model.group.rotation.y = p.yaw;
      c.model.legs.forEach(
        (l, i) =>
          (l.rotation.x = -0.55 + Math.sin(time * 7 + i * Math.PI) * 0.5),
      );
      if (!reduced) c.bike.wheels.forEach((w) => w.rotateZ((-dt * 3.8) / 0.34));
    }
  }
  return { group, scenes, animals, cyclists, update };
}
