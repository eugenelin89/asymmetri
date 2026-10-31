// SPDX-License-Identifier: MIT — original seasonal geometry; no external assets.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Anchors, CampusData, Point, Pose, Settings } from "./types";
import { floorAt, global, inPolygon, type Interior } from "./spatial";

import { landmarkIds } from "./layout";
export const halloweenInteriors = landmarkIds;
type Decoration = { building: string; point: Point; y: number; phase: number };
export const halloweenMonsterKinds = [
  "werewolf", "lizard", "jiangshi", "zombie", "vampire", "ghost",
  "skeleton", "witch", "mummy", "pumpkin-knight", "comic-hero",
  "masked-vigilante", "manga-ninja", "manga-swordsman", "robot", "mecha",
] as const;
export type HalloweenMonsterKind = typeof halloweenMonsterKinds[number];
export const halloweenPopulationLimits = { low: 32, medium: 64, auto: 90, high: 110, ultra: 128 } as const;
const monsterGaits: Record<HalloweenMonsterKind, { speed: number; cadence: number; stride: number; spread: number; pitch: number; bob: number }> = {
  werewolf: { speed: 0.95, cadence: 4.4, stride: 0.37, spread: 0.15, pitch: 0.035, bob: 0.025 },
  lizard: { speed: 0.85, cadence: 4.1, stride: 0.30, spread: 0.15, pitch: 0.025, bob: 0.018 },
  jiangshi: { speed: 0.58, cadence: 5.5, stride: 0, spread: 0.14, pitch: 0, bob: 0.19 },
  zombie: { speed: 0.45, cadence: 3.0, stride: 0.20, spread: 0.14, pitch: 0.065, bob: 0.012 },
  vampire: { speed: 0.75, cadence: 3.8, stride: 0.26, spread: 0.14, pitch: -0.015, bob: 0.012 },
  ghost: { speed: 0.70, cadence: 3.0, stride: 0, spread: 0, pitch: 0, bob: 0.08 },
  skeleton: { speed: 0.82, cadence: 4.9, stride: 0.38, spread: 0.14, pitch: 0, bob: 0.035 },
  witch: { speed: 0.66, cadence: 3.7, stride: 0.22, spread: 0.14, pitch: 0.015, bob: 0.012 },
  mummy: { speed: 0.50, cadence: 2.9, stride: 0.16, spread: 0.14, pitch: 0.04, bob: 0.010 },
  "pumpkin-knight": { speed: 0.65, cadence: 3.5, stride: 0.25, spread: 0.16, pitch: 0, bob: 0.022 },
  "comic-hero": { speed: 0.95, cadence: 4.2, stride: 0.38, spread: 0.15, pitch: -0.025, bob: 0.025 },
  "masked-vigilante": { speed: 0.80, cadence: 4.0, stride: 0.30, spread: 0.14, pitch: 0.02, bob: 0.012 },
  "manga-ninja": { speed: 1.10, cadence: 5.8, stride: 0.46, spread: 0.14, pitch: 0.13, bob: 0.028 },
  "manga-swordsman": { speed: 0.88, cadence: 4.3, stride: 0.32, spread: 0.14, pitch: 0.015, bob: 0.018 },
  robot: { speed: 0.62, cadence: 3.2, stride: 0.20, spread: 0.17, pitch: 0, bob: 0.009 },
  mecha: { speed: 0.48, cadence: 2.7, stride: 0.18, spread: 0.22, pitch: 0.018, bob: 0.032 },
};
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
  const palettes: Record<HalloweenMonsterKind, { skin: number; clothes: number; trim: number; boots: number }> = {
    werewolf: { skin: 0x815e49, clothes: 0x514442, trim: 0xc9ab7e, boots: 0x815e49 },
    lizard: { skin: 0x729c48, clothes: 0x537b36, trim: 0xb9b862, boots: 0x729c48 },
    jiangshi: { skin: 0xd2d4bc, clothes: 0x203b66, trim: 0xe2c878, boots: 0x232737 },
    zombie: { skin: 0x91a282, clothes: 0x788080, trim: 0xb1a38c, boots: 0x3c4144 },
    vampire: { skin: 0xd2d4bc, clothes: 0x29263a, trim: 0x722e42, boots: 0x252430 },
    ghost: { skin: 0xd9e5dd, clothes: 0xd9e5dd, trim: 0xffffff, boots: 0xd9e5dd },
    skeleton: { skin: 0xe1dcc7, clothes: 0xe1dcc7, trim: 0x7d837d, boots: 0xe1dcc7 },
    witch: { skin: 0xabb88b, clothes: 0x54365f, trim: 0xdba455, boots: 0x292b38 },
    mummy: { skin: 0xd8cfad, clothes: 0xc6ba96, trim: 0xefe4c4, boots: 0xb4a78a },
    "pumpkin-knight": { skin: 0xe68b2c, clothes: 0x4c6155, trim: 0xcaa45b, boots: 0x44534f },
    "comic-hero": { skin: 0xc79270, clothes: 0x316bb1, trim: 0xeec866, boots: 0xb74349 },
    "masked-vigilante": { skin: 0xa98d78, clothes: 0x292e3d, trim: 0x63b7ae, boots: 0x222735 },
    "manga-ninja": { skin: 0xc59677, clothes: 0x384e69, trim: 0xc85f4e, boots: 0x283749 },
    "manga-swordsman": { skin: 0xd1a17f, clothes: 0x414962, trim: 0xd5b272, boots: 0x353640 },
    robot: { skin: 0xa0b7be, clothes: 0x527d8d, trim: 0x8de9ec, boots: 0x3c5969 },
    mecha: { skin: 0x9cabb6, clothes: 0x465c78, trim: 0xe5ab58, boots: 0x33465e },
  };
  const { skin, clothes, trim, boots } = palettes[kind];
  const mechanical = kind === "robot" || kind === "mecha";
  const cape = (colour: number, width: number, bottom = 0.18, trailing = 0.35) => {
    const g = new THREE.BufferGeometry();
    const a = [-0.25, 1.61, -0.18], b = [-width, bottom, -trailing], c = [width, bottom, -trailing], d = [0.25, 1.61, -0.18];
    g.setAttribute("position", new THREE.Float32BufferAttribute([...a,...b,...c, ...a,...c,...d, ...a,...d,...c, ...a,...c,...b], 3));
    g.computeVertexNormals(); add(g, colour);
  };
  const hairSpikes = (colour: number, height: number, count: number) => {
    orb(colour, 0, 2.02, -0.025, 0.22, 0.13, 0.20);
    for (let i = 0; i < count; i++) {
      const a = i * Math.PI * 2 / count;
      const g = new THREE.ConeGeometry(0.09, height + (i % 2) * 0.06, 4);
      g.rotateZ(-Math.sin(a) * 0.42).rotateX(Math.cos(a) * 0.35);
      add(g, colour, Math.sin(a) * 0.16, 2.13 + (i % 3) * 0.025, Math.cos(a) * 0.13);
    }
  };
  if (leg) {
    // All shared leg assets pivot at the hip, preserving the existing stride API.
    if (mechanical) {
      const armored = kind === "mecha";
      box(clothes, 0, -0.17, 0, armored ? 0.23 : 0.15, 0.30, armored ? 0.25 : 0.15);
      orb(0x313b46, 0, -0.37, 0, armored ? 0.13 : 0.09, 0.10, 0.10);
      box(skin, 0, -0.55, 0.01, armored ? 0.25 : 0.15, 0.29, armored ? 0.25 : 0.15);
      box(trim, 0, -0.40, 0.14, armored ? 0.20 : 0.10, 0.10, 0.04);
      box(boots, 0, -0.73, 0.10, armored ? 0.31 : 0.23, 0.17, armored ? 0.45 : 0.37);
    } else if (kind === "skeleton") {
      link(skin, [0, 0, 0], [0, -0.34, 0], 0.043);
      orb(skin, 0, -0.37, 0, 0.07, 0.065, 0.07);
      for (const x of [-0.025, 0.025]) link(skin, [x, -0.40, 0], [x, -0.69, 0.025], 0.024);
      box(skin, 0, -0.73, 0.09, 0.14, 0.09, 0.30);
    } else {
      link(clothes, [0, 0, 0], [0, -0.69, 0.015], kind === "pumpkin-knight" ? 0.13 : 0.105);
      box(boots, 0, -0.72, 0.095, 0.22, 0.15, 0.36);
      if (kind === "mummy") for (let i = 0; i < (detail ? 7 : 3); i++)
        add(new THREE.CylinderGeometry(0.108, 0.111, 0.047, 7), i % 2 ? trim : skin, 0, -0.07 - i * (detail ? 0.09 : 0.22), 0.01);
      if (kind === "comic-hero") box(boots, 0, -0.56, 0.025, 0.22, 0.27, 0.23);
      if (kind === "manga-ninja") box(trim, 0, -0.41, 0.11, 0.13, 0.075, 0.025);
    }
  } else {
    if (mechanical) {
      const armored = kind === "mecha";
      box(clothes, 0, 1.28, 0, armored ? 0.66 : 0.48, armored ? 0.58 : 0.52, armored ? 0.38 : 0.32);
      box(0x2f3d4d, 0, 0.94, 0, armored ? 0.43 : 0.30, 0.18, 0.27);
      box(skin, 0, 1.84, 0, armored ? 0.40 : 0.38, armored ? 0.36 : 0.34, 0.32);
      box(0x182c3e, 0, 1.86, 0.174, 0.32, 0.21, 0.035);
      box(trim, 0, 1.87, 0.198, armored ? 0.29 : 0.25, armored ? 0.065 : 0.12, 0.018);
      box(trim, 0, 1.32, 0.206, armored ? 0.16 : 0.23, 0.16, 0.025);
      for (const sign of [-1, 1]) {
        box(skin, sign * (armored ? 0.40 : 0.31), 1.50, 0, armored ? 0.27 : 0.17, armored ? 0.30 : 0.19, armored ? 0.36 : 0.22);
        box(clothes, sign * (armored ? 0.45 : 0.35), 1.23, 0.015, armored ? 0.20 : 0.12, 0.27, 0.20);
        orb(0x273744, sign * (armored ? 0.45 : 0.35), 1.08, 0.03, 0.09, 0.08, 0.09);
        box(skin, sign * (armored ? 0.46 : 0.35), 0.91, 0.05, armored ? 0.23 : 0.14, 0.27, 0.23);
        box(boots, sign * (armored ? 0.46 : 0.35), 0.72, 0.08, 0.18, 0.15, 0.22);
        if (armored) {
          add(new THREE.ConeGeometry(0.16, 0.30, 4).rotateZ(sign * -0.7), trim, sign * 0.48, 1.66, -0.02);
          box(clothes, sign * 0.27, 1.29, -0.25, 0.18, 0.56, 0.18);
        }
      }
      if (armored) {
        box(clothes, 0, 2.04, 0, 0.16, 0.12, 0.32);
        box(trim, 0, 2.12, -0.01, 0.055, 0.20, 0.12);
      } else {
        link(skin, [0.13, 2.01, 0], [0.18, 2.24, 0], 0.022);
        orb(trim, 0.18, 2.26, 0, 0.045, 0.045, 0.045);
        if (detail) for (let n = 0; n < 3; n++) box(0x203a47, -0.13 + n * 0.13, 1.11, 0.17, 0.07, 0.025, 0.02);
      }
    } else if (kind === "skeleton") {
      link(skin, [0, 0.88, -0.055], [0, 1.61, -0.055], 0.045);
      link(skin, [-0.27, 1.49, 0], [0.27, 1.49, 0], 0.045);
      for (let rib = 0; rib < 4; rib++) add(new THREE.TorusGeometry(0.23 - Math.abs(rib - 1) * 0.015, 0.025, 5, detail ? 12 : 8, Math.PI).scale(1, 0.65, 1).rotateX(Math.PI / 2), skin, 0, 1.08 + rib * 0.115, -0.04);
      orb(skin, 0, 0.91, 0, 0.23, 0.13, 0.13);
      orb(skin, 0, 1.85, 0, 0.21, 0.25, 0.18);
      box(skin, 0, 1.66, 0.08, 0.22, 0.10, 0.17);
      for (const sign of [-1, 1]) {
        link(skin, [sign * 0.28, 1.48, 0], [sign * 0.38, 1.16, 0.015], 0.04);
        orb(skin, sign * 0.38, 1.15, 0.015, 0.06, 0.06, 0.06);
        link(skin, [sign * 0.38, 1.12, 0.015], [sign * 0.40, 0.87, 0.09], 0.035);
        box(skin, sign * 0.40, 0.82, 0.11, 0.12, 0.12, 0.12);
        orb(0x2d3537, sign * 0.082, 1.9, 0.168, 0.063, 0.067, 0.03);
      }
      box(0x343a3b, 0, 1.78, 0.177, 0.045, 0.067, 0.02);
      if (detail) for (let tooth = 0; tooth < 4; tooth++) box(0x77796f, -0.075 + tooth * 0.05, 1.66, 0.17, 0.014, 0.05, 0.012);
    } else {
      orb(clothes, 0, 1.22, 0, kind === "werewolf" ? 0.36 : 0.29, 0.44, 0.21);
      if (kind !== "pumpkin-knight") orb(skin, 0, 1.85, kind === "zombie" ? 0.12 : 0, 0.215, 0.26, 0.20);
      if (kind === "jiangshi") {
        add(new THREE.CylinderGeometry(0.25, 0.39, 0.7, detail ? 9 : 5), clothes, 0, 0.95, 0);
        for (const x of [-0.37, 0.37]) {
          link(clothes, [x, 1.48, 0], [x, 1.48, 0.56], 0.12);
          box(skin, x, 1.48, 0.64, 0.14, 0.10, 0.20);
        }
        add(new THREE.CylinderGeometry(0.24, 0.26, 0.19, 8), 0x182943, 0, 2.12, 0);
        add(new THREE.CylinderGeometry(0.29, 0.29, 0.055, 10), 0x182943, 0, 2.03, 0);
        orb(0xab4b45, 0, 2.24, 0, 0.055, 0.045, 0.055);
        box(trim, 0, 1.94, 0.214, 0.105, 0.35, 0.013);
        if (detail) for (let i = 0; i < 3; i++) box(0x965044, i % 2 ? 0.012 : -0.012, 2.04 - i * 0.08, 0.225, 0.065, 0.014, 0.006);
      } else {
        for (const sign of [-1, 1]) {
          const reaching = kind === "zombie", swept = kind === "manga-ninja";
          const handZ = reaching ? 0.43 : swept ? -0.32 : 0.08;
          link(clothes, [sign * 0.29, 1.48, 0], [sign * 0.42, reaching ? 1.32 : 1.03, reaching ? 0.35 : swept ? -0.24 : 0.06], 0.10);
          orb(skin, sign * 0.43, reaching ? 1.29 : 0.95, handZ, 0.095, 0.12, 0.10);
        }
      }
      if (kind === "werewolf") {
        orb(0xa08160, 0, 1.79, 0.22, 0.16, 0.12, 0.20);
        orb(0x292c2d, 0, 1.81, 0.395, 0.07, 0.05, 0.045);
        for (const x of [-0.16, 0.16]) add(new THREE.ConeGeometry(0.12, 0.34, 4), skin, x, 2.12, -0.015);
        if (detail) for (const sign of [-1, 1]) for (let n = 0; n < 3; n++) add(new THREE.ConeGeometry(0.018, 0.10, 4).rotateX(Math.PI), 0xd8cbb5, sign * 0.43 + (n - 1) * 0.04, 0.86, 0.12);
      } else if (kind === "lizard") {
        orb(0x93ad5d, 0, 1.78, 0.17, 0.23, 0.13, 0.24);
        link(skin, [0, 0.92, -0.12], [0, 0.55, -0.54], 0.14); link(skin, [0, 0.55, -0.54], [0, 0.31, -0.80], 0.075);
        for (let n = 0; n < (detail ? 5 : 3); n++) add(new THREE.ConeGeometry(0.09, 0.22, 4).rotateX(-0.8), trim, 0, 1.65 - n * 0.2, -0.22 - Math.max(0, n - 2) * 0.09);
      } else if (kind === "vampire") {
        cape(trim, 0.57);
        for (const x of [-0.25, 0.25]) add(new THREE.ConeGeometry(0.16, 0.37, 3), trim, x, 1.73, -0.12);
        orb(0x282934, 0, 2.02, -0.035, 0.22, 0.12, 0.19); box(0xc7b99d, 0, 1.39, 0.20, 0.10, 0.38, 0.025);
        if (detail) for (const x of [-0.065, 0.065]) add(new THREE.ConeGeometry(0.022, 0.085, 4).rotateX(Math.PI), 0xf0e7d2, x, 1.73, 0.196);
      } else if (kind === "zombie") {
        box(0x4c535d, -0.11, 1.22, 0.20, 0.14, 0.16, 0.035); box(trim, 0.15, 1.38, 0.20, 0.11, 0.24, 0.035);
        if (detail) for (const x of [-0.16, 0.06, 0.18]) add(new THREE.ConeGeometry(0.08, 0.19, 3).rotateX(Math.PI), clothes, x, 0.91, 0.12);
      } else if (kind === "witch") {
        add(new THREE.CylinderGeometry(0.23, 0.43, 0.95, detail ? 10 : 6), clothes, 0, 0.91, 0);
        add(new THREE.CylinderGeometry(0.40, 0.41, 0.065, 10), 0x30283c, 0, 2.07, 0);
        add(new THREE.ConeGeometry(0.29, 0.76, 8).rotateZ(-0.13), 0x42304f, -0.045, 2.45, 0);
        add(new THREE.CylinderGeometry(0.275, 0.29, 0.09, 8), trim, 0, 2.14, 0);
        link(0x94704d, [0.48, 0.25, -0.25], [0.48, 1.65, 0.12], 0.035);
        add(new THREE.ConeGeometry(0.19, 0.44, detail ? 9 : 5).rotateZ(Math.PI).rotateX(-0.25), 0xbda06a, 0.48, 0.27, -0.25);
        if (detail) for (const x of [-0.19, 0.19]) link(0xa4afb0, [x, 1.98, -0.04], [x * 1.25, 1.52, -0.02], 0.055);
      } else if (kind === "mummy") {
        for (let wrap = 0; wrap < (detail ? 9 : 5); wrap++) {
          const y = 0.95 + wrap * (detail ? 0.067 : 0.13);
          box(wrap % 2 ? trim : skin, 0, y, 0.207, 0.43 + Math.sin(wrap) * 0.05, 0.045, 0.03);
        }
        for (let wrap = 0; wrap < 5; wrap++) box(wrap % 2 ? trim : clothes, 0, 1.69 + wrap * 0.087, 0.184, 0.34, 0.06, 0.035);
        box(0x393c35, 0, 1.91, 0.21, 0.27, 0.065, 0.025);
        for (const sign of [-1, 1]) for (let wrap = 0; wrap < 4; wrap++) box(trim, sign * (0.31 + wrap * 0.035), 1.4 - wrap * 0.11, 0.09, 0.15, 0.045, 0.10);
        link(trim, [0.19, 1.05, 0.20], [0.36, 0.64, 0.17], 0.035);
      } else if (kind === "pumpkin-knight") {
        for (let lobe = 0; lobe < 7; lobe++) { const a = lobe * Math.PI * 2 / 7; orb(lobe % 2 ? skin : 0xc46c24, Math.cos(a) * 0.08, 1.86, Math.sin(a) * 0.08, 0.19, 0.24, 0.19); }
        add(new THREE.CylinderGeometry(0.035, 0.055, 0.17, 5), 0x586b40, 0, 2.14, 0);
        for (const x of [-0.09, 0.09]) add(new THREE.ConeGeometry(0.067, 0.025, 3).rotateX(Math.PI / 2), 0x302b2b, x, 1.92, 0.255);
        box(0x302b2b, 0, 1.77, 0.265, 0.15, 0.045, 0.022);
        box(trim, 0, 1.3, 0.205, 0.43, 0.30, 0.09);
        for (const x of [-0.34, 0.34]) orb(trim, x, 1.5, 0, 0.20, 0.14, 0.21);
        add(new THREE.CylinderGeometry(0.25, 0.25, 0.07, 6).rotateX(Math.PI / 2), clothes, -0.47, 1.02, 0.19);
        add(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6).rotateX(Math.PI / 2), trim, -0.47, 1.02, 0.23);
      } else if (kind === "comic-hero") {
        cape(0xc24f55, 0.54, 0.32, 0.43);
        box(trim, 0, 0.98, 0.05, 0.52, 0.10, 0.38);
        add(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 6).rotateX(Math.PI / 2), trim, 0, 1.39, 0.222);
        box(0xeff2da, 0, 1.39, 0.252, 0.045, 0.18, 0.012);
        box(0xeff2da, 0, 1.39, 0.252, 0.18, 0.045, 0.012);
        box(0x254a82, 0, 1.91, 0.18, 0.36, 0.105, 0.055); hairSpikes(0x3e353b, 0.13, detail ? 6 : 3);
      } else if (kind === "masked-vigilante") {
        cape(0x222b38, 0.48, 0.20, 0.39);
        orb(0x252d3c, 0, 1.9, -0.025, 0.23, 0.27, 0.215);
        box(skin, 0, 1.77, 0.198, 0.15, 0.10, 0.028);
        box(trim, 0, 1.92, 0.205, 0.30, 0.04, 0.025);
        box(0x776f58, 0, 0.99, 0.06, 0.51, 0.105, 0.35);
        if (detail) for (const x of [-0.18, 0, 0.18]) box(0x95896c, x, 1.0, 0.25, 0.10, 0.14, 0.08);
        link(trim, [-0.15, 1.45, 0.21], [0, 1.3, 0.235], 0.025); link(trim, [0, 1.3, 0.235], [0.15, 1.45, 0.21], 0.025);
      } else if (kind === "manga-ninja") {
        hairSpikes(0x243744, 0.31, detail ? 9 : 5);
        box(0x929f9b, 0, 1.98, 0.197, 0.36, 0.095, 0.035);
        box(trim, 0, 1.59, 0, 0.49, 0.13, 0.43);
        link(trim, [-0.16, 1.58, -0.16], [-0.27, 1.34, -0.48], 0.06);
        box(clothes, 0, 1.78, 0.20, 0.31, 0.19, 0.05);
        box(0x293646, 0, 1.01, 0.025, 0.49, 0.12, 0.38);
      } else if (kind === "manga-swordsman") {
        hairSpikes(0x413b4e, 0.22, detail ? 7 : 4);
        for (const sign of [-1, 1]) {
          box(sign < 0 ? 0x687b83 : 0x82636c, sign * 0.21, 1.04, -0.02, 0.22, 1.08, 0.42);
          box(trim, sign * 0.09, 1.2, 0.22, 0.045, 0.75, 0.025);
          if (detail) for (let stripe = 0; stripe < 3; stripe++) box(trim, sign * 0.24, 0.72 + stripe * 0.23, 0.215, 0.14, 0.035, 0.025);
        }
        box(0xd3c6a0, 0, 1.02, 0.03, 0.52, 0.12, 0.43);
        link(0x393c4e, [-0.32, 1.19, -0.10], [-0.47, 0.25, -0.14], 0.047);
        link(trim, [-0.32, 1.19, -0.10], [-0.28, 1.47, -0.09], 0.035);
        box(0xb5a270, -0.32, 1.20, -0.10, 0.19, 0.045, 0.11);
      }
      if (detail && !["pumpkin-knight", "masked-vigilante"].includes(kind)) for (const x of [-0.085, 0.085]) {
        const faceZ = kind === "zombie" ? 0.31 : kind === "mummy" ? 0.235 : 0.21;
        orb(0x293031, x, 1.9, faceZ, 0.047, 0.042, 0.025);
        orb(kind === "werewolf" || kind === "lizard" ? 0xe3c66b : 0xb8d5c5, x, 1.9, faceZ + 0.025, 0.018, 0.022, 0.008);
      }
    }
    if (!detail) {
      const spread = kind === "mecha" ? 0.22 : mechanical ? 0.17 : 0.15;
      const width = kind === "skeleton" ? 0.07 : kind === "mecha" ? 0.23 : 0.18;
      for (const x of [-spread, spread]) {
        box(clothes, x, 0.47, 0, width, 0.88, mechanical ? 0.23 : 0.20);
        box(boots, x, 0.10, 0.095, kind === "mecha" ? 0.30 : 0.21, 0.15, 0.34);
      }
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
      // Leave room above the floating figure on every supported public level.
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
    maximum = interior.anchor.id === "kelvin-smith" || interior.anchor.id === "clarke" ? 4 : 3;
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
  const gatewayPumpkins: Point[] = [], gateway = anchors["arrival"];
  if (gateway) {
    for (const x of [-2.4, 2.4]) {
      const p = global([x, 1.3], gateway);
      const clear = Array.from({ length: 8 }, (_, i): Point => [p[0] + Math.cos(i * Math.PI / 4) * 0.35, p[1] + Math.sin(i * Math.PI / 4) * 0.35]);
      // CWRU's arrival uses the committed campus geometry, not another campus's
      // landscape-record identifier. Keep the complete decoration on clear ground.
      if ([p, ...clear].every((q) => !blocked(q, 0) && Math.abs(floorAt(q, 0, interiors)) < 0.05 && !data.buildings.some((building) => inPolygon(q, building.rings)))) gatewayPumpkins.push(p);
    }
  }
  const materials = {
    solid: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }),
    mechanical: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.38, metalness: 0.48, emissive: 0x092e38, emissiveIntensity: 0.34 }),
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
  for (let pass = 0; pass < 16 && monsters.length < halloweenPopulationLimits.ultra; pass++) for (const choices of ordered) {
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
        direction: i % 2 ? -1 : 1, speed: monsterGaits[kind].speed + random(i) * 0.30,
        pause: i % 4, kind, phase: random(i + 20) * 6, stride: 0 });
      break;
    }
  }
  const creatures = halloweenMonsterKinds.map((kind) => {
    const count = monsters.filter((m) => m.kind === kind).length, material = kind === "ghost" ? materials.ghost : kind === "robot" || kind === "mecha" ? materials.mechanical : materials.solid;
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
          if (!blocked(p, 0) && !visitorNear && !monsters.some((other) => other !== m && Math.hypot(p[0] - other.point[0], p[1] - other.point[1]) < 2.1)) {
            m.stride += Math.abs(next - m.distance) * monsterGaits[m.kind].cadence; m.distance = next; m.point = p;
          }
          if (next <= 1 || next >= m.length - 1) { m.direction *= -1; m.pause = 1.5 + random(m.phase) * 2; }
        }
      }
      const yaw = Math.atan2((m.route[1][0] - m.route[0][0]) * m.direction, (m.route[1][1] - m.route[0][1]) * m.direction);
      const batch = creatures[halloweenMonsterKinds.indexOf(m.kind)];
      const gait = monsterGaits[m.kind], size = m.kind === "ghost" ? 1.35 : m.kind === "mecha" ? 1.08 : 1;
      const near = distance < (settings.quality === "low" ? 26 : settings.quality === "medium" ? 38 : 55);
      const hover = m.kind === "ghost" ? 0.22 + Math.sin(time * 1.2 + m.phase) * 0.08 :
        Math.abs(Math.sin(m.stride)) * gait.bob;
      const body = near ? batch.body : batch.far;
      place(body, body.count++, m.point[0], 0.025 + hover, m.point[1], yaw, size,
        gait.pitch + (m.kind === "zombie" || m.kind === "mummy" ? Math.sin(m.stride * 0.5) * 0.025 : 0));
      if (near && batch.legs) for (const sign of [-1, 1]) {
        const x = m.point[0] + Math.cos(yaw) * sign * gait.spread * size, z = m.point[1] - Math.sin(yaw) * sign * gait.spread * size;
        place(batch.legs, batch.legs.count++, x, 0.86 * size + hover, z, yaw, size,
          Math.sin(m.stride) * sign * gait.stride);
      }
      // Walking phase changes only with accepted movement; stopped figures do not
      // run in place. All phase/matrices remain stable when reduced motion is on.
    }
    for (const mesh of [pumpkins, ghosts, webs, ...creatureMeshes]) mesh.instanceMatrix.needsUpdate = true;
  }
  return { group, decorations, gatewayPumpkins, monsters, update };
}
