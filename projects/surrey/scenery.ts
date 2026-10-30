// SPDX-License-Identifier: MIT — original procedural models; illustrative architectural detail.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

import { distance } from "./world";
import { seeded } from "./simulation";
import type { City, Point, Polygon, Pose } from "./types";
import type { World } from "./world";

function shapeOf(polygon: Polygon) {
  const s = new THREE.Shape(
    polygon[0].map(([x, z]) => new THREE.Vector2(x, -z)),
  );
  s.holes = polygon
    .slice(1)
    .map((r) => new THREE.Path(r.map(([x, z]) => new THREE.Vector2(x, -z))));
  return s;
}
export function person(color: number, backpack = false) {
  const group = new THREE.Group(),
    cloth = new THREE.MeshStandardMaterial({ color, roughness: 0.8 }),
    skin = new THREE.MeshStandardMaterial({ color: 0xc89673 }),
    dark = new THREE.MeshStandardMaterial({ color: 0x23353e }),
    white = new THREE.MeshStandardMaterial({ color: 0xe9e8db });
  function part(
    w: number,
    h: number,
    d: number,
    m: THREE.Material,
    x: number,
    y: number,
    z: number,
  ) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    p.position.set(x, y, z);
    p.castShadow = true;
    group.add(p);
    return p;
  }
  part(0.7, 0.85, 0.4, cloth, 0, 1.4, 0);
  part(0.48, 0.48, 0.46, skin, 0, 2.08, 0);
  part(0.53, 0.13, 0.5, dark, 0, 2.34, 0);
  part(0.1, 0.08, 0.02, dark, -0.13, 2.12, 0.241);
  part(0.1, 0.08, 0.02, dark, 0.13, 2.12, 0.241);
  const legs = [
    part(0.26, 0.75, 0.3, dark, -0.21, 0.56, 0),
    part(0.26, 0.75, 0.3, dark, 0.21, 0.56, 0),
  ];
  const arms = [
    part(0.22, 0.76, 0.24, cloth, -0.49, 1.4, 0),
    part(0.22, 0.76, 0.24, cloth, 0.49, 1.4, 0),
  ];
  part(0.3, 0.16, 0.46, white, -0.21, 0.12, 0.07);
  part(0.3, 0.16, 0.46, white, 0.21, 0.12, 0.07);
  const bag = part(
    0.64,
    0.75,
    0.32,
    new THREE.MeshStandardMaterial({ color: 0xf58b39 }),
    0,
    1.4,
    -0.34,
  );
  bag.visible = backpack;
  return {
    group,
    bag,
    animate(
      pose: Pick<Pose, "x" | "z" | "yaw" | "moving" | "running">,
      time: number,
      reduced = false,
    ) {
      group.position.set(
        pose.x,
        pose.moving && !reduced
          ? Math.abs(Math.sin(time * (pose.running ? 13 : 8))) * 0.07
          : 0,
        pose.z,
      );
      group.rotation.y = pose.yaw;
      const swing =
        pose.moving && !reduced
          ? Math.sin(time * (pose.running ? 13 : 8)) *
            (pose.running ? 0.75 : 0.45)
          : 0;
      legs[0].rotation.x = swing;
      legs[1].rotation.x = -swing;
      arms[0].rotation.x = -swing;
      arms[1].rotation.x = swing;
    },
  };
}
export function buildScenery(scene: THREE.Scene, city: City, world: World) {
  const rand = seeded(713),
    materials = new Map<number, THREE.MeshStandardMaterial>();
  const material = (color: number) => {
    if (!materials.has(color))
      materials.set(
        color,
        new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
      );
    return materials.get(color)!;
  };
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material) => {
    const o = new THREE.Mesh(g, m);
    o.receiveShadow = true;
    scene.add(o);
    return o;
  };
  const batch = (
    gs: THREE.BufferGeometry[],
    m: THREE.Material,
    shadow = false,
  ) => {
    if (!gs.length) return;
    const merged = mergeGeometries(gs);
    gs.forEach((g) => g.dispose());
    if (merged) {
      const o = mesh(merged, m);
      o.castShadow = shadow;
    }
  };
  function flat(polys: Polygon[], color: number, y: number) {
    if (!polys.length) return;
    const g = new THREE.ShapeGeometry(polys.map(shapeOf));
    g.rotateX(-Math.PI / 2);
    const o = mesh(g, material(color));
    o.position.y = y;
  }
  const [x0, z0, x1, z1] = city.bounds;
  const ground = mesh(
    new THREE.PlaneGeometry(x1 - x0, z1 - z0),
    material(0xa9b7a3),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set((x0 + x1) / 2, -0.04, (z0 + z1) / 2);
  flat(
    city.parks.map((p) => p.shape),
    0x6fa066,
    0.012,
  );
  flat(city.plazas, 0xcec6b4, 0.025);
  flat(city.pavement, 0x414f59, 0.04);
  flat(city.sidewalks, 0xddd4bf, 0.065);
  const windowCanvas = document.createElement("canvas");
  windowCanvas.width = 128;
  windowCanvas.height = 128;
  const ctx = windowCanvas.getContext("2d")!;
  ctx.fillStyle = "#ebeadf";
  ctx.fillRect(0, 0, 128, 128);
  for (let y = 6; y < 128; y += 32)
    for (let x = 6; x < 128; x += 32) {
      ctx.fillStyle = (x + y) % 3 ? "#69969f" : "#eedbac";
      ctx.fillRect(x, y, 19, 21);
      ctx.fillStyle = "#d0d7cd";
      ctx.fillRect(x + 9, y, 2, 21);
    }
  const windows = new THREE.CanvasTexture(windowCanvas);
  windows.wrapS = windows.wrapT = THREE.RepeatWrapping;
  windows.repeat.set(0.13, 0.13);
  windows.colorSpace = THREE.SRGBColorSpace;
  const palette = [0xd4d4bf, 0xd4b99b, 0x93b8c3, 0xaebfc6, 0xd3ab93, 0x8faaa5],
    buildings = palette.map(() => [] as THREE.BufferGeometry[]),
    roofs: THREE.BufferGeometry[] = [];
  city.buildings.forEach((b, i) => {
    const g = new THREE.ExtrudeGeometry(shapeOf(b.shape), {
      depth: b.height,
      bevelEnabled: false,
      steps: 1,
    });
    g.rotateX(-Math.PI / 2);
    buildings[i % palette.length].push(g);
    const roof = new THREE.ShapeGeometry(shapeOf(b.shape));
    roof.rotateX(-Math.PI / 2);
    roof.translate(0, b.height + 0.03, 0);
    roofs.push(roof);
  });
  buildings.forEach((gs, i) =>
    batch(
      gs,
      new THREE.MeshStandardMaterial({
        color: palette[i],
        map: windows,
        roughness: 0.7,
      }),
      true,
    ),
  );
  batch(roofs, material(0xb1c2bd));
  function box(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    yaw = 0,
  ) {
    const g = new THREE.BoxGeometry(w, h, d);
    g.rotateY(yaw);
    g.translate(x, y, z);
    return g;
  }
  function beam(a: Point, b: Point, y: number, width: number, height: number) {
    const dx = b[0] - a[0],
      dz = b[1] - a[1];
    return box(
      width,
      height,
      Math.hypot(dx, dz),
      (a[0] + b[0]) / 2,
      y,
      (a[1] + b[1]) / 2,
      Math.atan2(dx, dz),
    );
  }
  const markings: THREE.BufferGeometry[] = [],
    rails: THREE.BufferGeometry[] = [],
    pillars: THREE.BufferGeometry[] = [],
    lampPosts: THREE.BufferGeometry[] = [],
    lampHeads: THREE.BufferGeometry[] = [];
  for (const line of city.rail)
    for (let i = 1; i < line.length; i++) {
      rails.push(beam(line[i - 1], line[i], 8.2, 7, 1));
      if (i % 3 === 0)
        pillars.push(box(1.3, 8, 1.3, line[i][0], 4, line[i][1]));
    }
  batch(rails, material(0xc4c6bd), true);
  batch(pillars, material(0x9caaa4), true);
  const trees: Point[] = [];
  for (const road of city.roads)
    for (let i = 1; i < road.points.length; i++) {
      const a = road.points[i - 1],
        b = road.points[i],
        len = distance(a, b),
        dx = (b[0] - a[0]) / len,
        dz = (b[1] - a[1]) / len;
      for (let d = 6; d < len; d += 12)
        markings.push(
          beam(
            [a[0] + dx * d, a[1] + dz * d],
            [
              a[0] + dx * Math.min(d + 4, len),
              a[1] + dz * Math.min(d + 4, len),
            ],
            0.08,
            0.14,
            0.025,
          ),
        );
      for (let d = 12; d < len; d += 36) {
        const x = a[0] + dx * d - dz * (road.width / 2 + 4),
          z = a[1] + dz * d + dx * (road.width / 2 + 4);
        if (
          !world.fits([x, z]) ||
          Object.values(city.anchors).some((p) => distance(p, [x, z]) < 8)
        )
          continue;
        lampPosts.push(box(0.18, 5, 0.18, x, 2.5, z));
        lampHeads.push(box(1.2, 0.18, 0.4, x, 0.0 + 5, z));
        trees.push([x - dz * 3, z + dx * 3]);
      }
    }
  batch(markings, material(0xe4c571));
  batch(lampPosts, material(0x34444a));
  batch(lampHeads, material(0xf0dbb6));
  const crossings: THREE.BufferGeometry[] = [],
    signalPosts: THREE.BufferGeometry[] = [],
    signalLights: THREE.BufferGeometry[] = [];
  city.signals.forEach((p) => {
    signalPosts.push(box(0.2, 4, 0.2, p[0], 2, p[1]));
    signalPosts.push(box(0.45, 1.2, 0.4, p[0], 4, p[1]));
    signalLights.push(box(0.26, 0.26, 0.42, p[0], 4.2, p[1]));
    for (let i = -4; i <= 4; i++)
      crossings.push(box(1, 0.02, 3, p[0] + i * 1.8, 0.1, p[1] + 3));
  });
  batch(crossings, material(0xeee8d8));
  batch(signalPosts, material(0x2f4148));
  batch(signalLights, material(0xeaa65e));
  city.parks.forEach((p) => {
    const r = p.shape[0];
    for (let i = 0; i < r.length; i += 3)
      if (world.fits(r[i])) trees.push(r[i]);
  });
  const trunks = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.22, 0.33, 3, 5),
      material(0x826448),
      trees.length,
    ),
    leaves = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(2.6, 0),
      material(0x49865f),
      trees.length,
    );
  const dummy = new THREE.Object3D();
  trees.forEach((p, i) => {
    const s = 0.75 + rand() * 0.6;
    dummy.position.set(p[0], 1.5, p[1]);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    trunks.setMatrixAt(i, dummy.matrix);
    dummy.position.y = 4.4;
    dummy.scale.set(s, s * 1.15, s);
    dummy.updateMatrix();
    leaves.setMatrixAt(i, dummy.matrix);
    leaves.setColorAt(
      i,
      new THREE.Color().setHSL(
        0.22 + rand() * 0.12,
        0.28,
        0.38 + rand() * 0.16,
      ),
    );
  });
  trunks.castShadow = leaves.castShadow = true;
  scene.add(trunks, leaves);
  const labels: THREE.Sprite[] = [];
  function label(text: string, p: Point, y = 8, color = "#ecf0e3", width = 26) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 96;
    const cx = c.getContext("2d")!;
    cx.fillStyle = "#142c32";
    cx.fillRect(0, 0, 512, 96);
    cx.fillStyle = color;
    cx.font = "bold 30px sans-serif";
    cx.textAlign = "center";
    cx.fillText(text, 256, 59);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const o = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: t, depthTest: true }),
    );
    o.position.set(p[0], y, p[1]);
    o.scale.set(width, (width * 96) / 512, 1);
    scene.add(o);
    labels.push(o);
  }
  label("SURREY CENTRAL", [80, 0], 12, "#ffd07d", 30);
  label("BUS LOOP", [38, 66], 5, "#a9decb", 18);
  for (const c of city.civic) {
    const names: Record<string, string> = {
      "CITY CENTRE LIBRARY": "CITY CENTRE LIBRARY",
      "SURREY CITY HALL": "CITY HALL",
      "CENTRAL CITY": "CENTRAL CITY",
      SFU: "SFU SURREY",
      "KPU (CIVIC PLAZA)": "CIVIC PLAZA",
    };
    if (c.name && names[c.name])
      label(
        names[c.name],
        c.centre,
        c.name === "SFU" ? 114 : c.name.includes("CIVIC") ? 140 : 20,
      );
  }
  label("104 AVENUE", [-155, -220], 6, "#e2ead3", 22);
  label("KING GEORGE BOULEVARD", [240, -30], 6, "#e2ead3", 34);
  const stationRoof = mesh(
    new THREE.BoxGeometry(15, 0.6, 50),
    material(0x568b9b),
  );
  stationRoof.position.set(80, 12, 0);
  stationRoof.castShadow = true;
  const player = person(0x2eaaa0),
    owner = person(0xe5bc56),
    thief = person(0x8d599a, true),
    sam = person(0x9d7595),
    jo = person(0x4b96b0),
    pickpocket = person(0xb96352);
  [player, owner, thief, sam, jo, pickpocket].forEach((p) =>
    scene.add(p.group),
  );
  owner.group.position.set(
    ...([city.anchors.owner[0], 0, city.anchors.owner[1]] as [
      number,
      number,
      number,
    ]),
  );
  sam.group.position.set(
    city.anchors.community[0],
    0,
    city.anchors.community[1],
  );
  const joPoint = world.safe([
    city.anchors.community[0] - 2,
    city.anchors.community[1],
  ]);
  jo.group.position.set(joPoint[0], 0, joPoint[1]);
  const marker = mesh(
    new THREE.OctahedronGeometry(0.8),
    new THREE.MeshBasicMaterial({ color: 0xffcd65, depthTest: false }),
  );
  marker.renderOrder = 5;
  const ring = mesh(
    new THREE.RingGeometry(1.4, 1.7, 32),
    new THREE.MeshBasicMaterial({ color: 0xffcd65, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  const communityMarker = mesh(
    new THREE.OctahedronGeometry(0.6),
    material(0x60d9de),
  );
  communityMarker.position.set(
    city.anchors.community[0],
    3.4,
    city.anchors.community[1],
  );
  const clue = mesh(new THREE.BoxGeometry(0.55, 0.05, 0.7), material(0xffdc6b));
  clue.position.set(city.anchors.clue[0], 0.15, city.anchors.clue[1]);
  const mystery = mesh(
    new THREE.BoxGeometry(0.8, 0.65, 0.6),
    material(0x4e6579),
  );
  mystery.position.set(city.anchors.mystery[0], 0.4, city.anchors.mystery[1]);
  return { player, owner, thief, pickpocket, marker, ring, labels };
}
