import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Box, Floor, Ramp } from "./spatial";
/** Original architectural interpretation; local origin is home plate, outfield is -Z. */
export function buildStadium() {
  const group = new THREE.Group(),
    colliders: Box[] = [],
    floors: Floor[] = [],
    ramps: Ramp[] = [];
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const mat = (c: number, r = 0.8) =>
    new THREE.MeshStandardMaterial({
      color: c,
      roughness: r,
      side: THREE.DoubleSide,
    });
  const turf = mat(0x447957),
    stripe = mat(0x3c704e),
    clay = mat(0x9e6248),
    white = mat(0xf7f3df),
    navy = mat(0x193b49),
    steel = mat(0x8e9b9a, 0.4),
    concrete = mat(0xaba99a),
    seat = mat(0x395968),
    timber = mat(0x8c7257);
  function add(g: THREE.BufferGeometry, m: THREE.Material) {
    batches.set(m, [...(batches.get(m) || []), g]);
  }
  function box(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    m: THREE.Material,
    solid = false,
  ) {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(x, y + h / 2, z);
    add(g, m);
    if (solid)
      colliders.push({
        minX: x - w / 2,
        maxX: x + w / 2,
        minZ: z - d / 2,
        maxZ: z + d / 2,
        minY: y,
        maxY: y + h,
      });
  }
  function line(
    a: THREE.Vector3,
    b: THREE.Vector3,
    r: number,
    m: THREE.Material,
  ) {
    const d = b.clone().sub(a),
      g = new THREE.CylinderGeometry(r, r, d.length(), 6);
    g.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        d.normalize(),
      ),
    );
    g.translate(...a.clone().add(b).multiplyScalar(0.5).toArray());
    add(g, m);
  }
  function disk(x: number, z: number, r: number, m: THREE.Material, y = 0.04) {
    const g = new THREE.CircleGeometry(r, 48);
    g.rotateX(-Math.PI / 2);
    g.translate(x, y, z);
    add(g, m);
  }
  const fan = new THREE.Shape();
  fan.moveTo(-14, 10);
  fan.lineTo(-14, -10);
  for (let i = 0; i <= 50; i++) {
    const a = -Math.PI / 4 + ((i / 50) * Math.PI) / 2;
    fan.lineTo(Math.sin(a) * 108, -Math.cos(a) * 108);
  }
  fan.lineTo(14, 10);
  fan.closePath();
  const fg = new THREE.ShapeGeometry(fan);
  fg.rotateX(Math.PI / 2);
  fg.translate(0, 0.025, 0);
  add(fg, turf);
  // Broad subtle mowing bands within the playable fan.
  for (let r = 36; r < 107; r += 12) {
    const g = new THREE.RingGeometry(r, r + 6, 64, 1, Math.PI / 4, Math.PI / 2);
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0.035, 0);
    add(g, stripe);
  }
  disk(0, -19.4, 29, clay);
  const diamond = new THREE.Shape();
  diamond.moveTo(0, -1);
  diamond.lineTo(18.5, -19.4);
  diamond.lineTo(0, -37.8);
  diamond.lineTo(-18.5, -19.4);
  diamond.closePath();
  const dg = new THREE.ShapeGeometry(diamond);
  dg.rotateX(Math.PI / 2);
  dg.translate(0, 0.05, 0);
  add(dg, turf);
  disk(0, -18.44, 2.75, clay, 0.12);
  box(0, 0.14, -18.44, 0.61, 0.04, 0.15, white);
  disk(0, 0, 4.5, clay, 0.07);
  floors.push({ minX: -1.8, maxX: 1.8, minZ: -20.24, maxZ: -16.64, y: 0.12 });
  for (const [x, z] of [
    [19.4, -19.4],
    [0, -38.8],
    [-19.4, -19.4],
  ])
    box(x, 0.08, z, 0.42, 0.08, 0.42, white);
  const plate = new THREE.Shape();
  plate.moveTo(-0.22, -0.22);
  plate.lineTo(0.22, -0.22);
  plate.lineTo(0.22, 0.05);
  plate.lineTo(0, 0.26);
  plate.lineTo(-0.22, 0.05);
  plate.closePath();
  const pg = new THREE.ShapeGeometry(plate);
  pg.rotateX(Math.PI / 2);
  pg.translate(0, 0.09, 0);
  add(pg, white);
  for (const side of [-1, 1]) {
    line(
      new THREE.Vector3(side * 0.3, 0.1, -0.3),
      new THREE.Vector3(side * 76, 0.1, -76),
      0.045,
      white,
    );
    for (const x of [side * 0.8, side * 2.05])
      line(
        new THREE.Vector3(x, 0.1, -1.3),
        new THREE.Vector3(x, 0.1, 1.2),
        0.035,
        white,
      );
    line(
      new THREE.Vector3(side * 0.8, 0.1, -1.3),
      new THREE.Vector3(side * 2.05, 0.1, -1.3),
      0.035,
      white,
    );
    line(
      new THREE.Vector3(side * 0.8, 0.1, 1.2),
      new THREE.Vector3(side * 2.05, 0.1, 1.2),
      0.035,
      white,
    );
    // Covered dugout with open face; circulation intentionally accessible in this simulation.
    box(side * 26, 0, -10, 12, 0.16, 4, concrete);
    box(side * 26, 0, -12, 12, 2.6, 0.22, navy, true);
    box(side * 26, 2.65, -10, 13, 0.22, 4.6, navy);
    for (const x of [side * 26 - 6, side * 26 + 6])
      box(x, 0, -10, 0.18, 2.6, 4, steel, true);
    box(side * 26, 0.45, -11.25, 10, 0.12, 0.65, timber, true);
    // Bullpen equipment follows the documented two-outfield-bullpen arrangement.
    box(side * 72, 0.05, -54, 5, 0.04, 16, clay);
    disk(side * 72, -56, 1.2, clay, 0.1);
    box(side * 72, 0.12, -56, 0.6, 0.05, 0.15, white);
    for (const z of [-62, -46])
      for (const x of [side * 72 - 3, side * 72 + 3])
        box(x, 0, z, 0.09, 2.8, 0.09, steel);
  }
  // Padded outfield wall with continuous rails and readable distances.
  for (let i = 0; i < 40; i++) {
    const a = -Math.PI / 4 + ((i / 40) * Math.PI) / 2,
      b = -Math.PI / 4 + (((i + 1) / 40) * Math.PI) / 2;
    const p = new THREE.Vector3(Math.sin(a) * 108, 0, -Math.cos(a) * 108),
      q = new THREE.Vector3(Math.sin(b) * 108, 0, -Math.cos(b) * 108),
      mid = p.clone().add(q).multiplyScalar(0.5);
    const g = new THREE.BoxGeometry(p.distanceTo(q) + 0.04, 2.5, 0.22);
    g.rotateY(-Math.atan2(q.z - p.z, q.x - p.x));
    g.translate(mid.x, 1.25, mid.z);
    add(g, navy);
    line(p.clone().setY(2.65), q.clone().setY(2.65), 0.05, steel);
    colliders.push({
      minX: Math.min(p.x, q.x) - 0.12,
      maxX: Math.max(p.x, q.x) + 0.12,
      minZ: Math.min(p.z, q.z) - 0.12,
      maxZ: Math.max(p.z, q.z) + 0.12,
      minY: 0,
      maxY: 2.7,
    });
  }
  box(0, 3, -109, 18, 4, 0.25, navy);
  box(20, 5, -103, 13, 5, 0.4, navy);
  const board = label("TOURMALINE WEST\nUBC BASEBALL", 840, 220);
  board.scale.set(12, 3.15, 1);
  board.position.set(20, 7.7, -102.7);
  group.add(board);
  // Ten interpreted tiers provide 480 seats; the exact real row layout is unverified.
  for (let row = 0; row < 10; row++) {
    const y = row * 0.36,
      z = 12 + row * 1.15;
    box(0, 0, z, 44, y + 0.18, 1.18, concrete);
    floors.push({
      minX: -22,
      maxX: 22,
      minZ: z - 0.58,
      maxZ: z + 0.58,
      y: y + 0.18,
    });
    for (let col = 0; col < 50; col++) {
      if (col === 24 || col === 25) continue;
      const x = (col - 24.5) * 0.82;
      box(x, y + 0.4, z, 0.54, 0.08, 0.5, seat);
      box(x, y + 0.48, z + 0.22, 0.54, 0.48, 0.08, seat);
    }
  }
  for (const x of [-23.5, 23.5]) {
    ramps.push({
      minX: x - 1.2,
      maxX: x + 1.2,
      minZ: 10,
      maxZ: 24,
      fromY: 0,
      toY: 3.62,
      axis: "z",
    });
    for (let i = 0; i < 22; i++)
      box(
        x,
        0,
        10 + i * (14 / 22),
        2.3,
        (i + 1) * (3.62 / 22),
        14 / 22,
        concrete,
      );
  }
  box(0, 3.42, 25, 50, 0.2, 3, concrete);
  floors.push({ minX: -25, maxX: 25, minZ: 23.5, maxZ: 26.5, y: 3.62 });
  box(0, 3.62, 29, 12, 2.8, 5, navy, true);
  box(
    0,
    4.72,
    26.4,
    10,
    1.3,
    0.08,
    new THREE.MeshStandardMaterial({
      color: 0x8fadb4,
      metalness: 0.35,
      roughness: 0.2,
    }),
  );
  box(0, 6.52, 29, 13, 0.2, 6, steel);
  for (let x = -24; x <= 24; x += 3)
    box(x, 3.62, 26.5, 0.05, 1.05, 0.05, steel);
  line(
    new THREE.Vector3(-25, 4.72, 26.5),
    new THREE.Vector3(25, 4.72, 26.5),
    0.035,
    steel,
  );
  colliders.push({
    minX: -25,
    maxX: 25,
    minZ: 26.45,
    maxZ: 26.6,
    minY: 3.62,
    maxY: 4.82,
  });
  // Transparent backstop netting, not a texture backdrop.
  const netPoints: THREE.Vector3[] = [];
  for (let x = -17; x <= 17; x += 0.65)
    netPoints.push(new THREE.Vector3(x, 0.2, 8), new THREE.Vector3(x, 10, 8));
  for (let y = 0.2; y <= 10; y += 0.65)
    netPoints.push(new THREE.Vector3(-17, y, 8), new THREE.Vector3(17, y, 8));
  const net = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(netPoints),
    new THREE.LineBasicMaterial({
      color: 0x48524c,
      transparent: true,
      opacity: 0.35,
    }),
  );
  group.add(net);
  colliders.push({
    minX: -17,
    maxX: 17,
    minZ: 7.98,
    maxZ: 8.02,
    minY: 0,
    maxY: 10,
  });
  for (const x of [-17, 0, 17]) box(x, 0, 8, 0.12, 10, 0.12, steel);
  const floodlights: THREE.SpotLight[] = [];
  for (const [x, z] of [
    [-46, 12],
    [46, 12],
    [-85, -66],
    [85, -66],
  ]) {
    box(x, 0, z, 0.28, 21, 0.28, steel);
    box(x, 21, z, 4, 0.45, 0.7, steel);
    for (let n = 0; n < 5; n++)
      box(
        x - 1.6 + n * 0.8,
        21,
        z + 0.38,
        0.5,
        0.3,
        0.04,
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffe8bd,
          emissiveIntensity: 0.4,
        }),
      );
    const l = new THREE.SpotLight(0xffebc9, 0, 175, 0.8, 0.6, 1.2);
    l.position.set(x, 21, z);
    l.target.position.set(0, 0, -40);
    group.add(l, l.target);
    floodlights.push(l);
  }
  const sign = label("TOURMALINE WEST\nBASEBALL STADIUM", 800, 220);
  sign.scale.set(7, 1.92, 1);
  sign.position.set(31, 3.6, 23);
  group.add(sign);
  box(31, 0, 23, 0.2, 3.1, 0.2, steel);
  for (const [m, gs] of batches) {
    const merged = mergeGeometries(gs, false);
    gs.forEach((g) => g.dispose());
    if (merged) {
      const mesh = new THREE.Mesh(merged, m);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
  }
  return {
    group,
    colliders,
    floors,
    ramps,
    entry: [31, 30] as [number, number],
    floodlights,
  };
}
export function label(text: string, w = 768, h = 160) {
  if (typeof document === "undefined")
    return new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 0x173438, side: THREE.DoubleSide }),
    );
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#173438";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#e9eee4";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = text.split("\n");
  ctx.font = `500 ${h / (lines.length * 2.4)}px sans-serif`;
  lines.forEach((line, i) =>
    ctx.fillText(line, w / 2, (h / (lines.length + 1)) * (i + 1), w - 32),
  );
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide }),
  );
}
