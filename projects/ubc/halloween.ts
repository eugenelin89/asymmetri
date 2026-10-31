// SPDX-License-Identifier: MIT — original seasonal geometry; no external assets.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Anchors, CampusData, Point, Pose, Settings } from "./types";
import { floorAt, global, inPolygon, type Interior } from "./spatial";

export const halloweenInteriors = ["rose", "bookstore", "nest", "sauder", "hennings", "war-memorial", "beaty", "irving", "orchard"] as const;
type Decoration = { building: string; point: Point; y: number; phase: number };
export const halloweenMonsterKinds = ["werewolf", "lizard", "jiangshi", "zombie", "vampire", "ghost"] as const;
export type HalloweenMonsterKind = typeof halloweenMonsterKinds[number];
export const halloweenPopulationLimits = { low: 24, medium: 48, auto: 60, high: 72, ultra: 84 } as const;
type Monster = { id: string; routeId: string; route: [Point, Point]; point: Point; length: number; distance: number; direction: number; speed: number; pause: number; kind: HalloweenMonsterKind; phase: number; stride: number };
const random = (n: number) => { const value = Math.sin(n * 93.73 + 71.17) * 43758.54; return value - Math.floor(value); };
const inside = (p: Point, b: { minX: number; maxX: number; minZ: number; maxZ: number }, pad = 0) =>
  p[0] >= b.minX - pad && p[0] <= b.maxX + pad && p[1] >= b.minZ - pad && p[1] <= b.maxZ + pad;

function model(kind: "pumpkin" | "ghost" | "web", low = false) {
  const parts: THREE.BufferGeometry[] = [];
  const add = (geometry: THREE.BufferGeometry, colour: number, x = 0, y = 0, z = 0) => {
    geometry.translate(x, y, z);
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    if (g !== geometry) geometry.dispose();
    g.deleteAttribute("uv");
    const c = new THREE.Color(colour), values = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < g.attributes.position.count; i++) c.toArray(values, i * 3);
    g.setAttribute("color", new THREE.BufferAttribute(values, 3)); parts.push(g);
  };
  const orb = (colour: number, x: number, y: number, z: number, sx: number, sy: number, sz: number) =>
    add(new THREE.SphereGeometry(1, low ? 6 : 12, low ? 4 : 8).scale(sx, sy, sz), colour, x, y, z);
  const bar = (a: THREE.Vector3, b: THREE.Vector3, radius: number, colour: number) => {
    const delta = b.clone().sub(a), g = new THREE.CylinderGeometry(radius, radius, delta.length(), 4);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()));
    const mid = a.clone().add(b).multiplyScalar(0.5); add(g, colour, mid.x, mid.y, mid.z);
  };
  if (kind === "pumpkin") {
    for (let i = 0; i < 9; i++) {
      const a = i * Math.PI * 2 / 9;
      orb(i % 2 ? 0xc96b20 : 0xde8124, Math.cos(a) * 0.1, 0.27, Math.sin(a) * 0.1, 0.21, 0.25, 0.21);
    }
    add(new THREE.CylinderGeometry(0.035, 0.055, 0.16, 7), 0x516040, 0, 0.56, 0);
    for (const x of [-0.095, 0.095]) add(new THREE.ConeGeometry(0.065, 0.025, 3).rotateX(Math.PI / 2), 0x35282a, x, 0.31, 0.304);
    add(new THREE.BoxGeometry(0.15, 0.045, 0.025), 0x35282a, 0, 0.19, 0.31);
  } else if (kind === "web") {
    const n = 10;
    for (let i = 0; i < n; i++) {
      const a = i * Math.PI * 2 / n;
      bar(new THREE.Vector3(), new THREE.Vector3(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0), 0.006, 0xaeb8b1);
    }
    for (const r of [0.16, 0.31, 0.46, 0.6]) for (let i = 0; i < n; i++) {
      const a = i * Math.PI * 2 / n, b = (i + 1) * Math.PI * 2 / n;
      bar(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0), new THREE.Vector3(Math.cos(b) * r, Math.sin(b) * r, 0), 0.004, 0xaeb8b1);
    }
  } else {
    const pale = 0xd9e5dd;
    orb(pale, 0, 0.66, 0, 0.35, 0.52, 0.29);
    for (const x of [-0.25, 0, 0.25]) orb(pale, x, 0.27, 0, 0.14, 0.2, 0.22);
    for (const x of [-0.12, 0.12]) orb(0x233442, x, 0.8, 0.272, 0.045, 0.065, 0.025);
    orb(0x3c4652, 0, 0.61, 0.285, 0.037, 0.045, 0.018);
  }
  const geometry = mergeGeometries(parts)!;
  parts.forEach((g) => g.dispose()); geometry.computeBoundingSphere(); return geometry;
}

/** Original storybook silhouettes, with no likeness or borrowed character assets.
 * Each type has one shared torso, one shared swinging leg and a small far model.
 * Jiangshi keep both arms extended and hop; no real religious text is reproduced.
 */
function monsterModel(kind: HalloweenMonsterKind, detail: boolean, leg = false) {
  if (kind === "ghost") return model("ghost", !detail);
  const pieces: THREE.BufferGeometry[] = [];
  const add = (geometry: THREE.BufferGeometry, colour: number, x = 0, y = 0, z = 0) => {
    geometry.translate(x, y, z);
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    if (g !== geometry) geometry.dispose();
    g.deleteAttribute("uv");
    const c = new THREE.Color(colour), values = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < g.attributes.position.count; i++) c.toArray(values, i * 3);
    g.setAttribute("color", new THREE.BufferAttribute(values, 3)); pieces.push(g);
  };
  const box = (colour: number, x: number, y: number, z: number, w: number, h: number, d: number) =>
    add(new THREE.BoxGeometry(w, h, d), colour, x, y, z);
  const orb = (colour: number, x: number, y: number, z: number, w: number, h: number, d: number) =>
    add(new THREE.SphereGeometry(1, detail ? 9 : 5, detail ? 6 : 3).scale(w, h, d), colour, x, y, z);
  const link = (colour: number, a: [number, number, number], b: [number, number, number], radius: number) => {
    const from = new THREE.Vector3(...a), to = new THREE.Vector3(...b), delta = to.clone().sub(from);
    const g = new THREE.CylinderGeometry(radius * 0.8, radius, delta.length(), detail ? 7 : 4);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()));
    const mid = from.add(to).multiplyScalar(0.5); add(g, colour, mid.x, mid.y, mid.z);
  };
  const skin = kind === "werewolf" ? 0x815e49 : kind === "lizard" ? 0x729c48 : kind === "zombie" ? 0x91a282 : 0xd2d4bc;
  const clothes = kind === "werewolf" ? 0x514442 : kind === "lizard" ? 0x537b36 : kind === "jiangshi" ? 0x203b66 : kind === "zombie" ? 0x788080 : 0x29263a;
  if (leg) {
    // Origin at the hip; the foot stays close to ground during the bounded stride.
    link(clothes, [0, 0, 0], [0, -0.69, 0.015], 0.105);
    box(kind === "lizard" || kind === "werewolf" ? skin : 0x272932, 0, -0.72, 0.095, 0.22, 0.15, 0.36);
  } else {
    orb(clothes, 0, 1.22, 0, kind === "werewolf" ? 0.36 : 0.29, 0.44, 0.21);
    orb(skin, 0, 1.85, kind === "zombie" ? 0.12 : 0, 0.215, 0.26, 0.20);
    if (!detail) {
      box(clothes, -0.15, 0.47, 0, 0.18, 0.88, 0.20); box(clothes, 0.15, 0.47, 0, 0.18, 0.88, 0.20);
    }
    if (kind === "jiangshi") {
      add(new THREE.CylinderGeometry(0.25, 0.39, 0.7, detail ? 9 : 5), clothes, 0, 0.95, 0);
      for (const x of [-0.37, 0.37]) {
        link(clothes, [x, 1.48, 0], [x, 1.48, 0.56], 0.12);
        box(skin, x, 1.48, 0.64, 0.14, 0.10, 0.20);
      }
      add(new THREE.CylinderGeometry(0.24, 0.26, 0.19, 8), 0x182943, 0, 2.12, 0);
      add(new THREE.CylinderGeometry(0.29, 0.29, 0.055, 10), 0x182943, 0, 2.03, 0);
      orb(0xab4b45, 0, 2.24, 0, 0.055, 0.045, 0.055);
      box(0xe2c878, 0, 1.94, 0.214, 0.105, 0.35, 0.013);
      if (detail) for (let i = 0; i < 3; i++) box(0x965044, i % 2 ? 0.012 : -0.012, 2.04 - i * 0.08, 0.225, 0.065, 0.014, 0.006);
    } else {
      for (const sign of [-1, 1]) {
        const reaching = kind === "zombie";
        link(clothes, [sign * 0.29, 1.48, 0], [sign * 0.42, reaching ? 1.32 : 1.03, reaching ? 0.35 : 0.06], 0.10);
        orb(skin, sign * 0.43, reaching ? 1.29 : 0.95, reaching ? 0.43 : 0.08, 0.095, 0.12, 0.10);
      }
    }
    if (kind === "werewolf") {
      orb(0xa08160, 0, 1.79, 0.22, 0.16, 0.12, 0.20);
      orb(0x292c2d, 0, 1.81, 0.395, 0.07, 0.05, 0.045);
      for (const x of [-0.16, 0.16]) add(new THREE.ConeGeometry(0.12, 0.34, 4), skin, x, 2.12, -0.015);
      if (detail) for (const sign of [-1, 1]) for (let n = 0; n < 3; n++)
        add(new THREE.ConeGeometry(0.018, 0.10, 4).rotateX(Math.PI), 0xd8cbb5, sign * 0.43 + (n - 1) * 0.04, 0.86, 0.12);
    } else if (kind === "lizard") {
      orb(0x93ad5d, 0, 1.78, 0.17, 0.23, 0.13, 0.24);
      link(skin, [0, 0.92, -0.12], [0, 0.55, -0.54], 0.14);
      link(skin, [0, 0.55, -0.54], [0, 0.31, -0.80], 0.075);
      for (let n = 0; n < (detail ? 5 : 3); n++) add(new THREE.ConeGeometry(0.09, 0.22, 4).rotateX(-0.8), 0xb9b862, 0, 1.65 - n * 0.2, -0.22 - Math.max(0, n - 2) * 0.09);
    } else if (kind === "vampire") {
      const cape = new THREE.BufferGeometry();
      cape.setAttribute("position", new THREE.Float32BufferAttribute([
        -0.25,1.61,-0.18, -0.57,0.18,-0.32, 0.57,0.18,-0.32,
        -0.25,1.61,-0.18, 0.57,0.18,-0.32, 0.25,1.61,-0.18,
        -0.25,1.61,-0.18, 0.25,1.61,-0.18, 0.57,0.18,-0.32,
        -0.25,1.61,-0.18, 0.57,0.18,-0.32, -0.57,0.18,-0.32,
      ], 3)); cape.computeVertexNormals(); add(cape, 0x722e42);
      for (const x of [-0.25, 0.25]) add(new THREE.ConeGeometry(0.16, 0.37, 3), 0x792f45, x, 1.73, -0.12);
      orb(0x282934, 0, 2.02, -0.035, 0.22, 0.12, 0.19);
      box(0xc7b99d, 0, 1.39, 0.20, 0.10, 0.38, 0.025);
      if (detail) for (const x of [-0.065, 0.065]) add(new THREE.ConeGeometry(0.022, 0.085, 4).rotateX(Math.PI), 0xf0e7d2, x, 1.73, 0.196);
    } else if (kind === "zombie") {
      box(0x4c535d, -0.11, 1.22, 0.20, 0.14, 0.16, 0.035);
      box(0xb1a38c, 0.15, 1.38, 0.20, 0.11, 0.24, 0.035);
      if (detail) for (const x of [-0.16, 0.06, 0.18]) add(new THREE.ConeGeometry(0.08, 0.19, 3).rotateX(Math.PI), clothes, x, 0.91, 0.12);
    }
    if (detail) for (const x of [-0.085, 0.085]) {
      orb(0x293031, x, 1.9, kind === "zombie" ? 0.31 : 0.19, 0.047, 0.042, 0.025);
      orb(kind === "werewolf" || kind === "lizard" ? 0xe3c66b : 0xb8d5c5, x, 1.9, kind === "zombie" ? 0.335 : 0.215, 0.018, 0.022, 0.008);
    }
  }
  const geometry = mergeGeometries(pieces)!;
  pieces.forEach((g) => g.dispose()); geometry.computeBoundingSphere(); return geometry;
}

function decorationPoints(interior: Interior, all: Interior[], blocked: (p: Point, y: number) => boolean): Decoration[] {
  const candidates: { point: Point; y: number; score: number }[] = [];
  for (const f of interior.floors) {
    if (f.maxX - f.minX < 1.6 || f.maxZ - f.minZ < 1.6) continue;
    for (const tx of [0.08, 0.25, 0.75, 0.92]) for (const tz of [0.08, 0.25, 0.75, 0.92]) {
      const q: Point = [f.minX + 0.7 + (f.maxX - f.minX - 1.4) * tx, f.minZ + 0.7 + (f.maxZ - f.minZ - 1.4) * tz];
      if (Math.abs(q[0]) > interior.anchor.width / 2 - 0.5 || Math.abs(q[1]) > interior.anchor.depth / 2 - 0.5) continue;
      if (Math.hypot(q[0] - interior.entry[0], q[1] - interior.entry[1]) < 3.3) continue;
      if (interior.ramps.some((r) => inside(q, r, 0.9))) continue;
      // Leave room above the floating figure, including the Beaty lower level.
      if (interior.floors.some((above) => above.y > f.y + 0.1 && above.y < f.y + 2.7 && inside(q, above))) continue;
      const p = global(q, interior.anchor);
      if (Math.abs(floorAt(p, f.y, all) - f.y) > 0.08) continue;
      const clear = [p, ...Array.from({ length: 8 }, (_, i): Point => [p[0] + Math.cos(i * Math.PI / 4) * 0.65, p[1] + Math.sin(i * Math.PI / 4) * 0.65])]
        .every((point) => !blocked(point, f.y) && !blocked(point, f.y + 0.9));
      if (clear) candidates.push({ point: p, y: f.y, score: Math.hypot(q[0] - interior.entry[0], q[1] - interior.entry[1]) + Math.abs(f.y) * 5 });
    }
  }
  candidates.sort((a, b) => a.score - b.score);
  const selected: typeof candidates = [],
    maximum = interior.anchor.id === "irving" || interior.anchor.id === "orchard" ? 4 : 3;
  const spaced = (candidate: typeof candidates[number]) => selected.every((other) =>
    Math.abs(candidate.y - other.y) >= 2.8 || Math.hypot(candidate.point[0] - other.point[0], candidate.point[1] - other.point[1]) >= 8);
  // Give each supported storey a set before filling a second spot on the same
  // floor. Tiny floor offsets (court/turf layers) are not separate storeys.
  const levels = [...new Set(candidates.map((c) => Math.round(c.y * 2)))].sort((a, b) => Math.abs(a) - Math.abs(b));
  for (const level of levels) {
    const candidate = candidates.find((c) => Math.round(c.y * 2) === level && spaced(c));
    if (candidate) selected.push(candidate);
    if (selected.length === maximum) break;
  }
  for (const candidate of candidates) {
    if (selected.length === maximum) break;
    if (spaced(candidate)) selected.push(candidate);
  }
  return selected.map((candidate) => ({ building: interior.anchor.id, point: candidate.point, y: candidate.y, phase: random(candidate.point[0]) * 6 }));
}

/** Additive, non-solid Halloween overlay. The parent owns sky and lighting. */
export function createHalloween(data: CampusData, anchors: Anchors, interiors: Interior[], blocked: (p: Point, y: number) => boolean) {
  const group = new THREE.Group(); group.name = "halloween-seasonal-overlay"; group.visible = false;
  const decorations: Decoration[] = [];
  for (const id of halloweenInteriors) {
    const interior = interiors.find((i) => i.anchor.id === id);
    if (!interior) continue;
    decorations.push(...decorationPoints(interior, interiors, blocked));
  }
  const gatewayPumpkins: Point[] = [], gateway = anchors["entrance-letters"];
  if (gateway) {
    const pad = data.surfaces.find((surface) => surface.id === "LSHARD_TYPE-642-0");
    for (const x of [-2.4, 2.4]) {
      const p = global([x, 1.3], gateway);
      const clear = Array.from({ length: 8 }, (_, i): Point => [p[0] + Math.cos(i * Math.PI / 4) * 0.35, p[1] + Math.sin(i * Math.PI / 4) * 0.35]);
      if (pad && clear.every((q) => inPolygon(q, pad.rings) && !blocked(q, 0))) gatewayPumpkins.push(p);
    }
  }
  const materials = {
    solid: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }),
    pumpkin: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, emissive: 0x682702, emissiveIntensity: 0.45 }),
    ghost: new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.6, depthWrite: false, roughness: 0.9 }),
    web: new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.48, depthWrite: false }),
  };
  const geometry = { pumpkin: model("pumpkin"), ghost: model("ghost"), web: model("web") };
  const instance = (name: string, g: THREE.BufferGeometry, m: THREE.Material, count: number) => {
    const mesh = new THREE.InstancedMesh(g, m, count); mesh.name = name;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false; group.add(mesh); return mesh;
  };
  const pumpkins = instance("halloween-pumpkins", geometry.pumpkin, materials.pumpkin, decorations.length + gatewayPumpkins.length),
    ghosts = instance("halloween-interior-ghosts", geometry.ghost, materials.ghost, decorations.length),
    webs = instance("halloween-interior-cobwebs", geometry.web, materials.web, decorations.length);
  const monsters: Monster[] = [];
  const routes = data.routes.flatMap((r) => r.points.slice(1).map((b, i) => ({ id: r.id, key: `${r.id}:${i}`, a: r.points[i], b })))
    .filter((r) => Math.hypot(r.b[0] - r.a[0], r.b[1] - r.a[1]) >= 20);
  const buildingBounds = data.buildings.filter((b) => b.rings[0]?.length).map((building) => ({
    building,
    minX: Math.min(...building.rings[0].map((p) => p[0])), maxX: Math.max(...building.rings[0].map((p) => p[0])),
    minZ: Math.min(...building.rings[0].map((p) => p[1])), maxZ: Math.max(...building.rings[0].map((p) => p[1])),
  }));
  // Round-robin campus zones provide variety without creating a crowd at arrival.
  // Cache clearance because different zones can propose the same source segment.
  const zones = [gateway, ...halloweenInteriors.map((id) => anchors[id])].filter(Boolean);
  const ordered = zones.map((zone) => routes.map((r) => ({ ...r, distance: Math.hypot((r.a[0] + r.b[0]) / 2 - zone.x, (r.a[1] + r.b[1]) / 2 - zone.z) }))
    .filter((r) => r.distance < 280).sort((a, b) => a.distance - b.distance));
  const clearance = new Map<string, boolean>();
  for (let pass = 0; pass < 12 && monsters.length < halloweenPopulationLimits.ultra; pass++) for (const choices of ordered) {
    if (monsters.length === halloweenPopulationLimits.ultra) break;
    for (const r of choices) {
      const length = Math.hypot(r.b[0] - r.a[0], r.b[1] - r.a[1]);
      const fraction = 0.35 + random(r.a[0] + r.b[1]) * 0.3;
      const point: Point = [r.a[0] + (r.b[0] - r.a[0]) * fraction, r.a[1] + (r.b[1] - r.a[1]) * fraction];
      if (monsters.some((m) => Math.hypot(m.point[0] - point[0], m.point[1] - point[1]) < 18)) continue;
      if (!clearance.has(r.key)) {
        const steps = Math.ceil(length / 0.8), dx = (r.b[0] - r.a[0]) / length, dz = (r.b[1] - r.a[1]) / length;
        const nearbyBuildings = buildingBounds.filter((b) => b.maxX >= Math.min(r.a[0], r.b[0]) - 0.65 && b.minX <= Math.max(r.a[0], r.b[0]) + 0.65 && b.maxZ >= Math.min(r.a[1], r.b[1]) - 0.65 && b.minZ <= Math.max(r.a[1], r.b[1]) + 0.65);
        let clear = true;
        for (let n = 0; n <= steps && clear; n++) {
          const centre: Point = [r.a[0] + (r.b[0] - r.a[0]) * n / steps, r.a[1] + (r.b[1] - r.a[1]) * n / steps];
          // Shoulder/cape/tail clearance as well as the route centre. Source
          // buildings remain excluded even when a custom model opens its doors.
          for (const [ox, oz] of [[0, 0], [-dz * 0.6, dx * 0.6], [dz * 0.6, -dx * 0.6], [dx * 0.6, dz * 0.6], [-dx * 0.6, -dz * 0.6]]) {
            const p: Point = [centre[0] + ox, centre[1] + oz];
            if (blocked(p, 0) || Math.abs(floorAt(p, 0, interiors)) > 0.05 || nearbyBuildings.some(({ building }) => inPolygon(p, building.rings))) { clear = false; break; }
          }
        }
        clearance.set(r.key, clear);
      }
      if (!clearance.get(r.key)) continue;
      const i = monsters.length, kind = halloweenMonsterKinds[i % halloweenMonsterKinds.length];
      monsters.push({ id: `halloween-${kind}-${i}`, routeId: r.id, route: [[...r.a], [...r.b]], point, length, distance: length * fraction,
        direction: i % 2 ? -1 : 1, speed: (kind === "zombie" ? 0.45 : kind === "jiangshi" ? 0.58 : 0.75) + random(i) * 0.35,
        pause: i % 4, kind, phase: random(i + 20) * 6, stride: 0 });
      break;
    }
  }
  const creatures = halloweenMonsterKinds.map((kind) => {
    const count = monsters.filter((m) => m.kind === kind).length, material = kind === "ghost" ? materials.ghost : materials.solid;
    const body = instance(`halloween-${kind}-near`, monsterModel(kind, true), material, count);
    const far = instance(`halloween-${kind}-far`, monsterModel(kind, false), material, count);
    const legs = kind === "ghost" ? null : instance(`halloween-${kind}-legs`, monsterModel(kind, true, true), material, count * 2);
    return { kind, body, far, legs };
  });
  const creatureMeshes = creatures.flatMap(({ body, far, legs }) => legs ? [body, far, legs] : [body, far]);
  const matrix = new THREE.Matrix4(), position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(), axisY = new THREE.Vector3(0, 1, 0), axisX = new THREE.Vector3(1, 0, 0), tilt = new THREE.Quaternion();
  const place = (mesh: THREE.InstancedMesh, i: number, x: number, y: number, z: number, yaw: number, size: number, pitch = 0) => {
    quaternion.setFromAxisAngle(axisY, yaw).multiply(tilt.setFromAxisAngle(axisX, pitch));
    matrix.compose(position.set(x, y, z), quaternion, scale.setScalar(size)); mesh.setMatrixAt(i, matrix);
  };
  let time = 0;
  function update(dt: number, settings: Settings, pose: Pick<Pose, "x" | "y" | "z">, peers: readonly { point: Point }[] = []) {
    group.visible = settings.halloween;
    if (!settings.halloween) return;
    const step = settings.reducedMotion ? 0 : Math.max(0, Math.min(0.1, dt)); time += step;
    const range = settings.quality === "low" ? 100 : 230;
    decorations.forEach((d, i) => {
      const distance = Math.hypot(d.point[0] - pose.x, d.point[1] - pose.z), visible = distance < range;
      const yaw = anchors[d.building]?.yaw || 0;
      place(pumpkins, i, d.point[0], d.y + 0.04, d.point[1], yaw, visible ? 1 : 0);
      place(ghosts, i, d.point[0], d.y + 1.14 + Math.sin(time * 0.7 + d.phase) * 0.09, d.point[1], yaw, visible ? 0.76 : 0);
      place(webs, i, d.point[0], d.y + 2.24, d.point[1], yaw, visible ? 0.64 : 0);
    });
    gatewayPumpkins.forEach((p, i) => place(pumpkins, decorations.length + i, p[0], 0.04, p[1], gateway.yaw,
      Math.hypot(p[0] - pose.x, p[1] - pose.z) < range ? 1.25 : 0));
    for (const mesh of creatureMeshes) mesh.count = 0;
    const populationLimit = halloweenPopulationLimits[settings.quality];
    const nearby = settings.population ? monsters.map((m) => ({ m, distance: Math.hypot(m.point[0] - pose.x, m.point[1] - pose.z) }))
      .filter(({ distance }) => distance < range).sort((a, b) => a.distance - b.distance).slice(0, populationLimit) : [];
    for (const { m, distance } of nearby) {
      if (step) {
        if (m.pause > 0) m.pause = Math.max(0, m.pause - step);
        else {
          const next = Math.max(1, Math.min(m.length - 1, m.distance + m.direction * m.speed * step)),
            p: Point = [m.route[0][0] + (m.route[1][0] - m.route[0][0]) * next / m.length, m.route[0][1] + (m.route[1][1] - m.route[0][1]) * next / m.length];
          const visitorNear = Math.abs(pose.y) < 2.5 && Math.hypot(p[0] - pose.x, p[1] - pose.z) < 2;
          if (!blocked(p, 0) && !visitorNear && !monsters.some((other) => other !== m && Math.hypot(p[0] - other.point[0], p[1] - other.point[1]) < 2.1) && !peers.some((other) => Math.hypot(p[0] - other.point[0], p[1] - other.point[1]) < 2.3)) {
            m.stride += Math.abs(next - m.distance) * (m.kind === "jiangshi" ? 5.5 : 4.1); m.distance = next; m.point = p;
          }
          if (next <= 1 || next >= m.length - 1) { m.direction *= -1; m.pause = 1.5 + random(m.phase) * 2; }
        }
      }
      const yaw = Math.atan2((m.route[1][0] - m.route[0][0]) * m.direction, (m.route[1][1] - m.route[0][1]) * m.direction);
      const batch = creatures[halloweenMonsterKinds.indexOf(m.kind)];
      const near = distance < (settings.quality === "low" ? 26 : settings.quality === "medium" ? 38 : 55);
      const hover = m.kind === "ghost" ? 0.22 + Math.sin(time * 1.2 + m.phase) * 0.08 :
        m.kind === "jiangshi" ? Math.abs(Math.sin(m.stride)) * 0.19 : Math.abs(Math.sin(m.stride)) * 0.018;
      const body = near ? batch.body : batch.far;
      place(body, body.count++, m.point[0], 0.025 + hover, m.point[1], yaw, m.kind === "ghost" ? 1.35 : 1,
        m.kind === "zombie" ? 0.065 + Math.sin(m.stride * 0.5) * 0.025 : 0);
      if (near && batch.legs) for (const sign of [-1, 1]) {
        const x = m.point[0] + Math.cos(yaw) * sign * 0.14, z = m.point[1] - Math.sin(yaw) * sign * 0.14;
        place(batch.legs, batch.legs.count++, x, 0.86 + hover, z, yaw, 1,
          m.kind === "jiangshi" ? 0 : Math.sin(m.stride) * sign * 0.32);
      }
      // Walking phase changes only with accepted movement; stopped figures do not
      // run in place. All phase/matrices remain stable when reduced motion is on.
    }
    for (const mesh of [pumpkins, ghosts, webs, ...creatureMeshes]) mesh.instanceMatrix.needsUpdate = true;
  }
  return { group, decorations, gatewayPumpkins, monsters, update };
}
