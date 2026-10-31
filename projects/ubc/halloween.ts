// SPDX-License-Identifier: MIT — original seasonal geometry; no external assets.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Anchors, CampusData, Point, Pose, Settings } from "./types";
import { floorAt, global, inPolygon, type Interior } from "./spatial";

export const halloweenInteriors = ["rose", "bookstore", "nest", "sauder", "hennings", "war-memorial", "beaty", "irving", "orchard"] as const;
type Decoration = { building: string; point: Point; y: number; phase: number };
type Monster = { id: string; routeId: string; route: [Point, Point]; point: Point; length: number; distance: number; direction: number; speed: number; pause: number; kind: number; phase: number };
const random = (n: number) => { const value = Math.sin(n * 93.73 + 71.17) * 43758.54; return value - Math.floor(value); };
const inside = (p: Point, b: { minX: number; maxX: number; minZ: number; maxZ: number }, pad = 0) =>
  p[0] >= b.minX - pad && p[0] <= b.maxX + pad && p[1] >= b.minZ - pad && p[1] <= b.maxZ + pad;

function model(kind: "pumpkin" | "ghost" | "web" | "moss") {
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
    add(new THREE.SphereGeometry(1, 12, 8).scale(sx, sy, sz), colour, x, y, z);
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
    const pale = kind === "ghost" ? 0xd9e5dd : 0x91a580;
    orb(pale, 0, 0.66, 0, 0.35, 0.52, 0.29);
    for (const x of [-0.25, 0, 0.25]) orb(pale, x, 0.27, 0, 0.14, 0.2, 0.22);
    for (const x of [-0.12, 0.12]) orb(0x233442, x, 0.8, 0.272, 0.045, 0.065, 0.025);
    orb(0x3c4652, 0, 0.61, 0.285, 0.037, 0.045, 0.018);
    if (kind === "moss") for (const x of [-0.22, 0.22])
      add(new THREE.ConeGeometry(0.09, 0.24, 7), 0xc5b88f, x, 1.16, 0);
  }
  const geometry = mergeGeometries(parts)!;
  parts.forEach((g) => g.dispose()); geometry.computeBoundingSphere(); return geometry;
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
  const geometry = { pumpkin: model("pumpkin"), ghost: model("ghost"), web: model("web"), moss: model("moss") };
  const instance = (name: string, g: THREE.BufferGeometry, m: THREE.Material, count: number) => {
    const mesh = new THREE.InstancedMesh(g, m, count); mesh.name = name;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false; group.add(mesh); return mesh;
  };
  const pumpkins = instance("halloween-pumpkins", geometry.pumpkin, materials.pumpkin, decorations.length + gatewayPumpkins.length),
    ghosts = instance("halloween-interior-ghosts", geometry.ghost, materials.ghost, decorations.length),
    webs = instance("halloween-interior-cobwebs", geometry.web, materials.web, decorations.length);
  const monsters: Monster[] = [];
  const routes = data.routes.flatMap((r) => r.points.slice(1).map((b, i) => ({ id: r.id, a: r.points[i], b })))
    .filter((r) => Math.hypot(r.b[0] - r.a[0], r.b[1] - r.a[1]) >= 20);
  const buildingBounds = data.buildings.filter((b) => b.rings[0]?.length).map((building) => ({
    building,
    minX: Math.min(...building.rings[0].map((p) => p[0])), maxX: Math.max(...building.rings[0].map((p) => p[0])),
    minZ: Math.min(...building.rings[0].map((p) => p[1])), maxZ: Math.max(...building.rings[0].map((p) => p[1])),
  }));
  // Visit different parts of campus rather than filling one nearby route.
  const zones = [gateway, ...halloweenInteriors.map((id) => anchors[id])].filter(Boolean);
  for (let pass = 0; pass < 2; pass++) for (const zone of zones) {
    if (pass && zone.id === "entrance-letters") continue;
    const ordered = routes.map((r) => ({ ...r, distance: Math.hypot((r.a[0] + r.b[0]) / 2 - zone.x, (r.a[1] + r.b[1]) / 2 - zone.z) }))
      .filter((r) => r.distance < 180).sort((a, b) => a.distance - b.distance);
    for (const r of ordered) {
      const point: Point = [(r.a[0] + r.b[0]) / 2, (r.a[1] + r.b[1]) / 2];
      if (monsters.some((m) => Math.hypot(m.point[0] - point[0], m.point[1] - point[1]) < 24)) continue;
      const length = Math.hypot(r.b[0] - r.a[0], r.b[1] - r.a[1]);
      const steps = Math.ceil(length / 0.5);
      const nearbyBuildings = buildingBounds.filter((b) => b.maxX >= Math.min(r.a[0], r.b[0]) && b.minX <= Math.max(r.a[0], r.b[0]) && b.maxZ >= Math.min(r.a[1], r.b[1]) && b.minZ <= Math.max(r.a[1], r.b[1]));
      let clear = true;
      for (let n = 0; n <= steps; n++) {
        const p: Point = [r.a[0] + (r.b[0] - r.a[0]) * n / steps, r.a[1] + (r.b[1] - r.a[1]) * n / steps];
        if (blocked(p, 0) || Math.abs(floorAt(p, 0, interiors)) > 0.05 || nearbyBuildings.some(({ building }) => inPolygon(p, building.rings))) { clear = false; break; }
      }
      if (!clear) continue;
      const i = monsters.length;
      monsters.push({ id: `halloween-creature-${i}`, routeId: r.id, route: [[...r.a], [...r.b]], point, length, distance: length / 2, direction: i % 2 ? -1 : 1, speed: 0.65 + random(i) * 0.45, pause: i % 4, kind: i % 3, phase: random(i + 20) * 6 });
      break;
    }
  }
  const creatures = [
    instance("halloween-roaming-ghosts", geometry.ghost, materials.ghost, monsters.length),
    instance("halloween-pumpkin-sprites", geometry.pumpkin, materials.pumpkin, monsters.length),
    instance("halloween-moss-creatures", geometry.moss, materials.solid, monsters.length),
  ];
  const matrix = new THREE.Matrix4(), position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3();
  const place = (mesh: THREE.InstancedMesh, i: number, x: number, y: number, z: number, yaw: number, size: number) => {
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    matrix.compose(position.set(x, y, z), quaternion, scale.setScalar(size)); mesh.setMatrixAt(i, matrix);
  };
  let time = 0;
  function update(dt: number, settings: Settings, pose: Pick<Pose, "x" | "y" | "z">) {
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
    monsters.forEach((m, i) => {
      const visible = settings.population && Math.hypot(m.point[0] - pose.x, m.point[1] - pose.z) < range;
      if (visible && step) {
        if (m.pause > 0) m.pause -= step;
        else {
          const next = Math.max(0.65, Math.min(m.length - 0.65, m.distance + m.direction * m.speed * step)),
            p: Point = [m.route[0][0] + (m.route[1][0] - m.route[0][0]) * next / m.length, m.route[0][1] + (m.route[1][1] - m.route[0][1]) * next / m.length];
          if (!blocked(p, 0) && Math.hypot(p[0] - pose.x, p[1] - pose.z) > 1.8 && !monsters.some((other) => other !== m && Math.hypot(p[0] - other.point[0], p[1] - other.point[1]) < 1.6)) {
            m.distance = next; m.point = p;
          }
          if (next <= 0.65 || next >= m.length - 0.65) { m.direction *= -1; m.pause = 1.5 + random(i + 3) * 2; }
        }
      }
      const yaw = Math.atan2((m.route[1][0] - m.route[0][0]) * m.direction, (m.route[1][1] - m.route[0][1]) * m.direction);
      creatures.forEach((mesh, kind) => place(mesh, i, m.point[0], 0.18 + Math.sin(time * 1.2 + m.phase) * 0.08, m.point[1], yaw, visible && kind === m.kind ? (kind === 1 ? 1.65 : 1) : 0));
    });
    for (const mesh of [pumpkins, ghosts, webs, ...creatures]) mesh.instanceMatrix.needsUpdate = true;
  }
  return { group, decorations, gatewayPumpkins, monsters, update };
}
