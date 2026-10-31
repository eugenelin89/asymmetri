// SPDX-License-Identifier: MIT
// Original, source-informed CWRU architectural interpretations. Public floor
// plans inform room relationships, but these are not measured as-built models.
import * as THREE from "three";
import { Builder, type Architecture, type MaterialName } from "./builder";
import { residenceLift } from "./residence-layout";
import type { Anchor } from "./types";

export type ArchitectureKind = string;
// Local source-OBB coordinates of conservative public interior cores. Derived
// from the pinned OSM polygons, with a one-metre clearance sampling margin.
// The caller retains the complete source outline for the surrounding wings.
export const interiorCoreBounds: Record<string, [number, number, number, number]> = {
  "kelvin-smith": [-1.5, -12, 53, 34], "tinkham-veale": [-13, 34.5, 40, 25],
  "peter-lewis": [-2.5, 0, 59, 38], adelbert: [0, -0.5, 38, 23],
  "amasa-stone": [-0.5, 0.5, 41, 13], thinkbox: [-3.5, -9.5, 17, 43],
  strosacker: [2, -1.5, 36, 23], veale: [5.5, -66.5, 105, 25],
  clarke: [0, 0.5, 16, 17], "mather-house": [1, 0, 40, 8],
  law: [-31, 0, 30, 54], nursing: [0, 0.5, 158, 97],
  medicine: [-2, -1.5, 26, 65], dental: [-2, 3.5, 42, 67],
  mandel: [2, -13.5, 36, 11], village: [3, -6, 42, 12],
  "village-clocktower": [25, -3, 9, 10],
};
export function architectureEnvelope(kind: string, anchor: Anchor): Anchor {
  const core = interiorCoreBounds[kind];
  if (!core) return { ...anchor };
  const [x, z, width, depth] = core, c = Math.cos(anchor.yaw), s = Math.sin(anchor.yaw);
  return { ...anchor, x: anchor.x + x * c + z * s, z: anchor.z - x * s + z * c, width, depth, yaw: anchor.yaw + (kind === "tinkham-veale" ? Math.PI : 0) };
}

const STOREY = 4.2;
const titles: Record<string, string> = {
  "kelvin-smith": "KELVIN SMITH LIBRARY", "tinkham-veale": "TINKHAM VEALE UNIVERSITY CENTER",
  "peter-lewis": "PETER B. LEWIS BUILDING", adelbert: "ADELBERT HALL",
  "amasa-stone": "AMASA STONE CHAPEL", thinkbox: "SEARS think[box]",
  strosacker: "STROSACKER AUDITORIUM", veale: "VEALE CENTER · HORSBURGH GYM",
  clarke: "CLARKE TOWER", village: "THE VILLAGE AT 115", "village-clocktower": "VILLAGE HOUSE 3A", "mather-house": "MATHER HOUSE", law: "GUND HALL · SCHOOL OF LAW",
  nursing: "FRANCES PAYNE BOLTON SCHOOL OF NURSING", medicine: "SCHOOL OF MEDICINE",
  dental: "SCHOOL OF DENTAL MEDICINE", mandel: "MANDEL SCHOOL",
};

function wall(b: Builder, material: MaterialName, x: number, z: number, w: number, d: number, y: number, h: number) {
  b.box(material, x, y + h / 2, z, w, h, d, true);
}

function window(b: Builder, x: number, y: number, z: number, w: number, h: number, side = false) {
  b.box("metal", x, y, z, side ? 0.12 : w + 0.16, h + 0.16, side ? w + 0.16 : 0.12);
  b.box("glass", x + (side ? 0.08 : 0), y, z + (side ? 0 : 0.08), side ? 0.05 : w, h, side ? w : 0.05);
  b.box("stone", x, y - h / 2 - 0.11, z, side ? 0.38 : w + 0.4, 0.16, side ? w + 0.4 : 0.38);
  b.box("metal", x, y, z + (side ? 0 : 0.12), side ? 0.09 : 0.06, h, side ? 0.06 : 0.09);
}

/** Open central entrance, window bays, plinths and cornices. */
function shell(b: Builder, floors: number, material: MaterialName = "stone", curtain = false, height?: number) {
  const w = b.width, d = b.depth, h = height ?? floors * STOREY, gap = 4.4;
  b.floor(-w / 2, w / 2, -d / 2, d / 2, 0, "stone");
  wall(b, material, 0, -d / 2, w, 0.35, 0, h);
  for (const x of [-w / 2, w / 2]) wall(b, material, x, 0, 0.35, d, 0, h);
  for (const side of [-1, 1]) {
    const span = (w - gap) / 2;
    wall(b, curtain ? "glass" : material, side * (gap / 2 + span / 2), d / 2, span, 0.3, 0, h);
    b.box("metal", side * gap / 2, 1.7, d / 2, 0.12, 3.4, 0.35, true);
    b.box("glass", side * (gap / 2 + 0.1), 1.6, d / 2 - 0.8, 0.06, 3.2, 1.6);
  }
  wall(b, material, 0, d / 2, gap, 0.3, 3.4, h - 3.4);
  b.box("metal", 0, 3.35, d / 2, gap, 0.12, 0.45);
  b.floor(-3, 3, d / 2, d / 2 + 3, 0, "concrete");
  for (let floor = 0; floor < floors; floor++) {
    const y = floor * STOREY;
    for (let x = -w / 2 + 2.5; x < w / 2 - 1; x += 4.3) {
      if (floor > 0 || Math.abs(x) > 4) window(b, x, y + 2.1, d / 2 + 0.2, 1.7, 2.2);
      window(b, x, y + 2.1, -d / 2 - 0.25, 1.7, 2.2);
    }
    for (let z = -d / 2 + 2.7; z < d / 2 - 1; z += 4.2)
      for (const x of [-w / 2 - 0.22, w / 2 + 0.22]) window(b, x, y + 2.1, z, 1.7, 2.2, true);
    b.box(material === "clay" ? "stone" : "concrete", 0, y + STOREY - 0.12, d / 2 + 0.22, w + 0.6, 0.24, 0.45);
  }
  b.box("roof", 0, h + 0.15, 0, w + 0.5, 0.3, d + 0.5);
}

function stairSlot(b: Builder) {
  const length = Math.min(15, b.width - 6), z = -b.depth / 2 + 3.3;
  return { minX: -length / 2, maxX: length / 2, minZ: z - 1.35, maxZ: z + 1.35 };
}

/** Stacked visible stairs have matching ramp support and genuine slab openings. */
function levels(b: Builder, count: number, material: MaterialName = "stone", lift = false) {
  const s = stairSlot(b), w = b.width, d = b.depth;
  const floor = (minX:number,maxX:number,minZ:number,maxZ:number,y:number,m:MaterialName) => {
    const h=residenceLift;
    if(!lift||maxX<=h.minX||minX>=h.maxX||maxZ<=h.minZ||minZ>=h.maxZ){b.floor(minX,maxX,minZ,maxZ,y,m);return;}
    const x1=Math.max(minX,h.minX),x2=Math.min(maxX,h.maxX),z1=Math.max(minZ,h.minZ),z2=Math.min(maxZ,h.maxZ);
    for(const [a,c,d,e] of [[minX,maxX,minZ,z1],[minX,maxX,z2,maxZ],[minX,x1,z1,z2],[x2,maxX,z1,z2]])
      if(c>a&&e>d)b.floor(a,c,d,e,y,m);
  };
  for (let level = 1; level < count; level++) {
    const y = level * STOREY, y0 = y - STOREY;
    floor(-w / 2, w / 2, -d / 2, s.minZ, y, material);
    floor(-w / 2, s.minX, s.minZ, s.maxZ, y, material);
    floor(s.maxX, w / 2, s.minZ, s.maxZ, y, material);
    floor(-w / 2, w / 2, s.maxZ, d / 2, y, material);
    b.ramps.push({ ...s, fromY: y0, toY: y, axis: "x" });
    const steps = 28, length = s.maxX - s.minX;
    for (let i = 0; i < steps; i++) {
      const x = s.minX + length * (i + 0.5) / steps;
      const rise = STOREY * (i + 1) / steps;
      b.box("concrete", x, y0 + rise - 0.07, (s.minZ + s.maxZ) / 2, length / steps + 0.01, 0.14, s.maxZ - s.minZ);
      if (i % 3 === 0) for (const z of [s.minZ, s.maxZ]) {
        b.box("metal", x, y0 + rise + 0.53, z, 0.045, 1.06, 0.045);
        b.colliders.push({ minX: x - length / steps, maxX: x + length / steps, minZ: z - 0.07, maxZ: z + 0.07, minY: y0 + rise, maxY: y0 + rise + 1.1 });
      }
    }
    for (const z of [s.minZ, s.maxZ]) b.beam("metal", new THREE.Vector3(s.minX, y0 + 1.05, z), new THREE.Vector3(s.maxX, y + 1.05, z), 0.055);
    b.rail(s.minX, s.maxZ + 0.1, s.maxX - 1.2, s.maxZ + 0.1, y);
    b.sign(`LEVEL ${level + 1}`, s.maxX + 1.1, y + 1.8, s.maxZ + 0.3, 2, 0.45);
  }
}

function pitchedRoof(b: Builder, h: number, rise: number) {
  const w = b.width + 0.8, d = b.depth + 0.8;
  for (const side of [-1, 1]) {
    const geometry = new THREE.BufferGeometry();
    const v = [-w / 2, h, side * d / 2, w / 2, h, side * d / 2, w / 2, h + rise, 0, -w / 2, h + rise, 0];
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
    geometry.setIndex(side > 0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]);
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, b.materials.roof); mesh.castShadow = true; mesh.userData.roof = true; b.group.add(mesh);
  }
  b.beam("metal", new THREE.Vector3(-w / 2, h + rise, 0), new THREE.Vector3(w / 2, h + rise, 0), 0.15);
}

function bookcase(b: Builder, x: number, z: number, y = 0, width = 3) {
  b.box("darkWood", x, y + 1.1, z, width, 2.2, 0.5, true);
  for (let shelf = 0; shelf < 5; shelf++) {
    b.box("timber", x, y + 0.15 + shelf * 0.42, z + 0.32, width, 0.06, 0.62);
    for (let i = 0; i < Math.floor(width / 0.13); i++) {
      const m: MaterialName[] = ["redBook", "goldBook", "blueBook", "whiteBook", "greenBook"];
      b.box(m[(i + shelf * 3) % 5], x - width / 2 + 0.1 + i * 0.13, y + 0.33 + shelf * 0.42, z + 0.34, 0.1, 0.28 + (i % 3) * 0.03, 0.23);
    }
  }
}

function desk(b: Builder, x: number, z: number, y = 0, computer = false) {
  b.table(x, z, y, false); b.chair(x, z + 0.85, y);
  if (computer) { b.box("metal", x, y + 1.15, z - 0.12, 0.65, 0.4, 0.07); b.box("blue", x, y + 1.15, z - 0.07, 0.58, 0.32, 0.015); b.box("metal", x, y + 0.88, z - 0.1, 0.07, 0.28, 0.06); b.box("white", x, y + 0.81, z + 0.2, 0.5, 0.025, 0.2); }
}

function sofa(b: Builder, x: number, z: number, y = 0, width = 2.8) {
  b.box("fabric", x, y + 0.37, z, width, 0.55, 0.95, true);
  b.box("fabric", x, y + 0.76, z - 0.43, width, 0.65, 0.17);
  for (const side of [-1, 1]) b.box("fabric", x + side * width / 2, y + 0.58, z, 0.16, 0.65, 0.96);
  b.box("darkWood", x, y + 0.39, z + 1.55, width * 0.62, 0.09, 0.8, true);
}

function roomWall(b: Builder, x: number, z: number, width: number, y = 0, material: MaterialName = "white") {
  const gap = 1.8, part = (width - gap) / 2;
  for (const sign of [-1, 1]) wall(b, material, x + sign * (gap + part) / 2, z, part, 0.16, y, 3.5);
  b.box(material, x, y + 3.15, z, gap, 0.7, 0.16, true);
  b.box("darkWood", x + gap / 2, y + 1.3, z - 0.65, 0.07, 2.6, 1.3);
}

function lighting(b: Builder, floors: number, intensity = 260) {
  for (let i = 0; i < floors; i++) {
    for (const x of [-b.width * 0.23, b.width * 0.23]) b.light(x, i * STOREY + 3.55, 0, intensity);
    for (let x = -b.width / 2 + 3; x < b.width / 2; x += 5)
      b.box("light", x, i * STOREY + 3.8, b.depth * 0.2, 1.2, 0.04, 0.35);
  }
}

function library(b: Builder) {
  b.materials.stone.color.setHex(0xd7cbb2); shell(b, 3); levels(b, 3);
  const w = b.width, d = b.depth, h = 3 * STOREY;
  // Curving limestone entrance colonnade: the source library's signature wing.
  // Each bay is original geometry; the central bay is kept physically open.
  const radius = Math.max(18, w * 0.7), angle = Math.asin(Math.min(0.85, w / 2 / radius));
  const baseZ = d / 2 - radius;
  for (let i = 0; i <= 18; i++) {
    const a = -angle + 2 * angle * i / 18, x = radius * Math.sin(a), z = baseZ + radius * Math.cos(a);
    if (Math.abs(x) > 3) b.cylinder("stone", x, h / 2, z + 1, 0.38, h, true);
    if (i < 18) {
      const a2 = -angle + 2 * angle * (i + 1) / 18;
      b.beam("stone", new THREE.Vector3(x, h + 0.35, z + 1), new THREE.Vector3(radius * Math.sin(a2), h + 0.35, baseZ + radius * Math.cos(a2) + 1), 0.72);
    }
  }
  b.sign(titles["kelvin-smith"], 0, 3.8, d / 2 + 0.36, Math.min(w * 0.7, 18), 0.75);
  b.box("timber", 4.2, 0.58, d * 0.24, 5, 1.15, 1.25, true);
  b.sign("SERVICE CENTER", 4.2, 1.5, d * 0.24 + 0.66, 3.7, 0.4);
  for (let z = -d * 0.3; z < d * 0.25; z += 3.2) {
    bookcase(b, -w * 0.35, z, 0, Math.min(8, w * 0.22));
    bookcase(b, -w * 0.35, z, 2 * STOREY, Math.min(8, w * 0.22));
  }
  for (let x = w * 0.1; x < w * 0.42; x += 3.5)
    for (let z = -d * 0.22; z < d * 0.25; z += 4) desk(b, x, z, 2 * STOREY);
  roomWall(b, -w * 0.24, 0, w * 0.4, STOREY); b.sign("DAMPEER ROOM", -w * 0.24, STOREY + 2.3, 0.1, 4, 0.5);
  for (let x = -w * 0.4; x < -w * 0.1; x += 3.2) for (const z of [-d * 0.2, -d * 0.08]) desk(b, x, z, STOREY);
  roomWall(b, w * 0.23, -d * 0.05, w * 0.4, STOREY); b.sign("CLASSROOM 215", w * 0.23, STOREY + 2.3, -d * 0.05 + 0.1, 4, 0.5);
  for (let x = w * 0.07; x < w * 0.4; x += 2.7) for (const z of [-d * 0.24, -d * 0.14]) desk(b, x, z, STOREY);
  for (const x of [-w * 0.22, w * 0.22]) { sofa(b, x, d * 0.25, STOREY); desk(b, x, d * 0.05, 0, true); }
  b.sign("QUIET READING ROOM", 0, 2 * STOREY + 2.4, d / 2 - 0.4, 7, 0.55, Math.PI);
  b.sign("KNOWLEDGE & CREATIVITY COMMONS", -w * 0.2, 2.5, d * 0.15, 7, 0.5);
  b.sign("CRAMELOT CAFÉ", w * 0.32, 2.5, d / 2 - 1, 5, 0.5, Math.PI);
  b.box("timber", w * 0.32, 0.6, d * 0.35, w * 0.2, 1.2, 1.3, true);
  lighting(b, 3);
}

function tinkham(b: Builder) {
  const w = b.width, d = b.depth; b.materials.stone.color.setHex(0xe0dfd2); shell(b, 2, "glass", true); levels(b, 2);
  // Green roof rises away from the entrance, as in the architect's project.
  const roof = new THREE.PlaneGeometry(w + 0.8, d + 0.8, 1, 1); roof.rotateX(-Math.PI / 2);
  const pos = roof.getAttribute("position"); for (let i = 0; i < pos.count; i++) pos.setY(i, STOREY * 2 + (pos.getZ(i) + d / 2) / d * 2.4);
  roof.computeVertexNormals(); const mesh = new THREE.Mesh(roof, b.materials.turf); mesh.receiveShadow = true; mesh.userData.roof = true; b.group.add(mesh);
  for (let x = -w / 2 + 1; x <= w / 2; x += 2.2) b.box("white", x, STOREY, d / 2 + 0.19, 0.11, STOREY * 2, 0.2);
  b.sign(titles["tinkham-veale"], 0, 3.9, d / 2 + 0.27, Math.min(24, w - 4), 0.7);
  b.box("blue", -w * 0.3, 2, -d * 0.22, w * 0.24, 3, 0.18);
  b.sign("MEDIA WALL · SMITH COMMONS", -w * 0.3, 2.1, -d * 0.22 + 0.13, w * 0.22, 0.6);
  for (let x = -w * 0.37; x < w * 0.38; x += 5.3) {
    if (Math.abs(x) < 4) continue;
    sofa(b, x, d * 0.18); b.table(x, -d * 0.04);
    b.table(x, d * 0.13, STOREY); b.table(x, -d * 0.12, STOREY);
  }
  b.box("timber", w * 0.34, 0.65, -d * 0.28, w * 0.22, 1.3, 1.5, true);
  b.sign("DINING · UNIVERSITY CENTER", w * 0.29, 2.8, -d * 0.28 + 0.8, 7, 0.5);
  roomWall(b, 0, d * 0.32, w - 4, STOREY, "glass");
  b.sign("GRAND BALLROOM", 0, STOREY + 2.6, d * 0.32 + 0.13, 8, 0.6);
  b.box("darkWood", 0, STOREY + 0.18, d * 0.42, w * 0.45, 0.36, 3);
  lighting(b, 2, 330);
}

function gehryRibbon(b: Builder, xCenter: number, zCenter: number, width: number, depth: number, h: number, phase: number) {
  const vertices: number[] = [], uvs: number[] = [], indices: number[] = [], nx = 42, nz = 12;
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= nz; j++) {
    const u = i / nx, v = j / nz;
    const x = xCenter + (u - 0.5) * width;
    const z = zCenter + (v - 0.5) * depth + Math.sin(u * Math.PI * 2 + phase) * depth * 0.2;
    const y = h + Math.sin(u * Math.PI + phase) * 3.2 + Math.sin(v * Math.PI) * 2.5 + u * 1.2;
    vertices.push(x, y, z); uvs.push(u * 9, v * 3);
    if (i < nx && j < nz) { const a = i * (nz + 1) + j; indices.push(a, a + nz + 1, a + 1, a + 1, a + nz + 1, a + nz + 2); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2)); g.setIndex(indices); g.computeVertexNormals();
  const material = b.materials.roof.clone(); material.color.setHex(0xbbc3c4); material.metalness = 0.82; material.roughness = 0.32; material.side = THREE.DoubleSide;
  const mesh = new THREE.Mesh(g, material); mesh.castShadow = mesh.receiveShadow = true; mesh.userData.roof = true; b.group.add(mesh);
  // Parallel panel seams make the metallic skin legible at pedestrian scale.
  for (let i = 1; i < nx; i += 3) {
    const u = i / nx, x = xCenter + (u - 0.5) * width;
    for (let j = 0; j < nz; j++) {
      const point = (v: number) => new THREE.Vector3(x, h + Math.sin(u * Math.PI + phase) * 3.2 + Math.sin(v * Math.PI) * 2.5 + u * 1.2 + 0.03, zCenter + (v - 0.5) * depth + Math.sin(u * Math.PI * 2 + phase) * depth * 0.2);
      b.beam("metal", point(j / nz), point((j + 1) / nz), 0.018);
    }
  }
}

function lewis(b: Builder) {
  const w = b.width, d = b.depth; b.materials.clay.color.setHex(0xb45f41); b.materials.white.color.setHex(0xf4eee1);
  shell(b, 3, "clay"); levels(b, 3, "timber");
  gehryRibbon(b, -w * 0.19, d * 0.15, w * 0.7, d * 0.58, 13.1, -0.4);
  gehryRibbon(b, w * 0.26, -d * 0.08, w * 0.45, d * 0.9, 14.5, 0.75);
  gehryRibbon(b, -w * 0.26, -d * 0.27, w * 0.55, d * 0.35, 13.7, 1.4);
  b.sign(titles["peter-lewis"], 0, 3.8, d / 2 + 0.36, Math.min(w * 0.7, 16), 0.7);
  for (let floor = 0; floor < 3; floor++) {
    const y = floor * STOREY;
    for (const side of [-1, 1]) {
      const cx = side * w * 0.26, rw = w * 0.38;
      roomWall(b, cx, -d * 0.08, rw, y);
      b.sign(floor ? "SEMINAR ROOM" : "WEATHERHEAD CLASSROOM", cx, y + 2.7, -d * 0.08 + 0.1, Math.min(rw - 1, 6), 0.45);
      for (let x = cx - rw * 0.32; x <= cx + rw * 0.32; x += 2.6) for (let z = -d * 0.28; z < -d * 0.12; z += 2.8) desk(b, x, z, y);
      b.box("white", cx, y + 2.1, -d * 0.34, rw * 0.7, 1.45, 0.12);
      sofa(b, cx, d * 0.2, y);
    }
  }
  lighting(b, 3);
}

function adelbert(b: Builder) {
  const w = b.width, d = b.depth; shell(b, 3); levels(b, 3); pitchedRoof(b, 12.9, 4.5);
  b.materials.stone.color.setHex(0xc3b394); b.materials.roof.color.setHex(0x4b4e4b);
  for (const y of [0.7, 4.15, 8.35, 12.55]) b.box("clay", 0, y, d / 2 + 0.23, w + 0.3, 0.32, 0.3);
  // Central square tower, pyramidal cap and stone entrance porch.
  const tw = Math.min(w * 0.19, 9); b.box("stone", 0, 16, d * 0.3, tw, 7, tw);
  for (const x of [-tw * 0.26, tw * 0.26]) window(b, x, 17.2, d * 0.3 + tw / 2 + 0.1, tw * 0.18, 2.5);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(tw * 0.83, 5.2, 4), b.materials.roof); cap.rotation.y = Math.PI / 4; cap.position.set(0, 22, d * 0.3); cap.castShadow = true; cap.userData.roof = true; b.group.add(cap);
  for (let x = -w * 0.36; x <= w * 0.36; x += w * 0.18) {
    if (Math.abs(x) < tw / 2) continue;
    b.box("stone", x, 14, d * 0.25, 2.5, 2.5, 3); window(b, x, 14, d * 0.25 + 1.6, 1.25, 1.7);
  }
  for (const x of [-3.6, 3.6]) b.cylinder("stone", x, 1.8, d / 2 + 1.8, 0.3, 3.6, true);
  b.box("stone", 0, 3.8, d / 2 + 1.5, 8.2, 0.5, 4.5); b.sign(titles.adelbert, 0, 3.8, d / 2 + 3.8, 6, 0.5);
  for (let floor = 0; floor < 3; floor++) {
    const y = floor * STOREY;
    for (const side of [-1, 1]) { roomWall(b, side * w * 0.28, 0, w * 0.37, y, "stone"); sofa(b, side * w * 0.27, d * 0.2, y); }
    b.sign(floor ? "PUBLIC GALLERY" : "WELCOME TO CASE WESTERN RESERVE", 0, y + 2.8, -d * 0.18, Math.min(12, w * 0.5), 0.6);
  }
  lighting(b, 3);
}

function pointedArch(b: Builder, x: number, z: number, baseY: number, width: number, height: number, material: MaterialName = "stone") {
  const half = width / 2;
  for (const side of [-1, 1]) {
    b.beam(material, new THREE.Vector3(x + side * half, baseY, z), new THREE.Vector3(x + side * half, baseY + height * 0.58, z), 0.22);
    b.beam(material, new THREE.Vector3(x + side * half, baseY + height * 0.58, z), new THREE.Vector3(x, baseY + height, z), 0.22);
  }
}

function chapel(b: Builder) {
  const w = b.width, d = b.depth, h = 10; b.materials.stone.color.setHex(0xbcb6a8); shell(b, 1, "stone", false, h); pitchedRoof(b, h, 5.85);
  b.materials.roof.color.setHex(0x515551); b.materials.darkWood.color.setHex(0x65442d);
  const aisle = 2.2, pewW = d * 0.25;
  // The long axis follows the 145-foot nave, perpendicular to the side entry.
  for (let x = -w * 0.29; x < w * 0.38; x += 1.55) for (const side of [-1, 1]) {
    if (Math.abs(x) < 2.5) continue; // cross aisle from the source-facing door
    const z = side * (aisle / 2 + pewW / 2);
    b.box("darkWood", x, 0.48, z, 0.65, 0.13, pewW, true);
    b.box("darkWood", x + 0.28, 0.8, z, 0.07, 0.55, pewW);
    for (const dz of [-pewW * 0.35, pewW * 0.35]) b.box("timber", x, 0.23, z + dz, 0.5, 0.46, 0.12);
  }
  for (let x = -w * 0.38; x < w * 0.43; x += 5.8) {
    for (const side of [-1, 1]) {
      b.cylinder("stone", x, 3.6, side * d * 0.36, 0.26, 7.2, true);
      b.box("blueBook", x, 7.8, side * (d / 2 - 0.21), 1.7, 3.8, 0.05);
      for (const dx of [-0.5, 0, 0.5]) b.box("goldBook", x + dx, 7.8, side * (d / 2 - 0.25), 0.07, 3.7, 0.055);
      b.beam("stone", new THREE.Vector3(x, 7.2, side * d * 0.36), new THREE.Vector3(x, 11.3, 0), 0.2);
    }
    b.beam("darkWood", new THREE.Vector3(x, 10, -d / 2), new THREE.Vector3(x, 15.7, 0), 0.22);
    b.beam("darkWood", new THREE.Vector3(x, 10, d / 2), new THREE.Vector3(x, 15.7, 0), 0.22);
  }
  b.box("darkWood", -w * 0.4, 0.28, 0, w * 0.15, 0.56, d * 0.7);
  b.box("stone", -w * 0.42, 1, 0, 1.5, 1, Math.min(5, d * 0.45), true);
  const stained = new THREE.Group();
  for (let col = -2; col <= 2; col++) for (let row = 0; row < 8; row++) b.box((["blueBook", "redBook", "goldBook", "greenBook"] as MaterialName[])[(row + col + 8) % 4], -w / 2 + 0.2, 5 + row * 0.58, col * 0.75, 0.1, 0.5, 0.68);
  stained.name = "original-stained-glass-colour-study"; b.group.add(stained);
  // The iconic corner tower, four pinnacles and lancet belfry openings.
  const tw = Math.min(w * 0.29, 7.62), tx = -w / 2 + tw / 2, tz = d / 2 - tw / 2;
  b.box("stone", tx, 21, tz, tw, 24, tw);
  for (const dx of [-tw * 0.39, tw * 0.39]) for (const dz of [-tw * 0.39, tw * 0.39]) {
    b.box("stone", tx + dx, 33.5, tz + dz, 0.8, 3, 0.8);
    const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.1, 4), b.materials.stone); pinnacle.position.set(tx + dx, 35.85, tz + dz); pinnacle.rotation.y = Math.PI / 4; b.group.add(pinnacle);
  }
  for (const dx of [-tw * 0.2, tw * 0.2]) { b.box("darkWood", tx + dx, 29.5, tz + tw / 2 + 0.04, tw * 0.18, 4.8, 0.08); pointedArch(b, tx + dx, tz + tw / 2 + 0.14, 27, tw * 0.23, 5.4); }
  pointedArch(b, 0, d / 2 + 0.22, 0, 4.8, 6); b.sign(titles["amasa-stone"], 0, 3.6, d / 2 + 0.35, 6, 0.5);
  b.light(0, 8, 0, 500); b.light(-w * 0.3, 8, 0, 250);
}

function makerspace(b: Builder) {
  const w = b.width, d = b.depth; shell(b, 7, "clay"); levels(b, 7, "concrete");
  b.materials.clay.color.setHex(0xa06543); b.materials.roof.color.setHex(0x676b68);
  const names = ["COMMUNITY", "COLLABORATION", "PROTOTYPING", "FABRICATION", "PROJECT SPACE", "ENTREPRENEURSHIP", "INCUBATOR"];
  b.sign("think[box]", 0, 26.2, d / 2 + 0.35, Math.min(w - 3, 13), 2);
  for (let floor = 0; floor < 7; floor++) {
    const y = floor * STOREY;
    b.sign(`${floor + 1} · ${names[floor]}`, 0, y + 2.6, -d * 0.18, Math.min(10, w * 0.55), 0.5);
    for (const x of [-w * 0.28, w * 0.28]) {
      for (const z of [-d * 0.1, d * 0.2]) {
        if (floor === 0 || floor === 1 || floor > 4) { b.table(x, z, y); continue; }
        b.box("metal", x, y + 0.48, z, 2.2, 0.9, 1.2, true); b.box("timber", x, y + 0.98, z, 2.4, 0.12, 1.4);
        if (floor === 2) {
          b.box("white", x, y + 1.47, z, 0.9, 0.9, 0.8); b.box("glass", x, y + 1.5, z + 0.42, 0.72, 0.65, 0.035);
          b.box("blue", x, y + 1.36, z + 0.25, 0.15, 0.3, 0.15); b.sign("PROTOTYPING", x, y + 1.93, z + 0.42, 1.1, 0.2);
        } else if (floor === 3) {
          b.box("blue", x, y + 1.3, z, 1.1, 0.6, 0.75); b.cylinder("metal", x + 0.4, y + 1.95, z, 0.18, 1.1);
        } else { b.box("metal", x, y + 1.4, z, 0.4, 0.8, 0.4); b.cylinder("clay", x + 0.55, y + 1.4, z, 0.35, 0.2); }
      }
    }
    if (floor === 1) for (const side of [-1, 1]) b.box("white", side * (w / 2 - 0.6), y + 1.8, 0, 0.1, 1.6, d * 0.4);
  }
  lighting(b, 7, 160);
}

function auditorium(b: Builder) {
  const w = b.width, d = b.depth; shell(b, 2, "clay", false, 9.8); b.materials.clay.color.setHex(0x9d6e54);
  b.sign(titles.strosacker, 0, 3.8, d / 2 + 0.35, Math.min(w * 0.7, 15), 0.7);
  const rows = 13, minZ = -d * 0.2, maxZ = d * 0.25, tier = 0.16;
  for (let row = 0; row < rows; row++) {
    const z = minZ + (maxZ - minZ) * row / (rows - 1), y = row * tier;
    const spacing = (maxZ - minZ) / (rows - 1);
    b.floor(-w / 2 + 1, w / 2 - 1, z - spacing / 2, z + spacing / 2, y, "fabric");
    for (let x = -w * 0.4; x <= w * 0.4; x += 0.85) { if (Math.abs(x) < 1.4 || Math.abs(Math.abs(x) - w * 0.24) < 0.8) continue; b.chair(x, z, y, Math.PI); }
  }
  b.ramps.push({ minX: -1.25, maxX: 1.25, minZ: minZ - 0.45, maxZ: maxZ + 0.45, fromY: 0, toY: (rows - 1) * tier, axis: "z" });
  // Return aisle descends from the rear tier to the entrance lobby.
  b.ramps.push({ minX: -1.25, maxX: 1.25, minZ: maxZ + 0.45, maxZ: d / 2 - 1, fromY: (rows - 1) * tier, toY: 0, axis: "z" });
  for (let step = 0; step < 16; step++) {
    const length = d / 2 - 1 - maxZ - 0.45, z = maxZ + 0.45 + length * (step + 0.5) / 16, y = (rows - 1) * tier * (1 - (step + 1) / 16);
    b.box("fabric", 0, y - 0.08, z, 2.5, 0.16, length / 16 + 0.02);
  }
  b.box("darkWood", 0, 0.22, -d * 0.38, w * 0.7, 0.44, d * 0.16);
  for (const side of [-1, 1]) b.box("white", side * w * 0.21, 4.5, -d / 2 + 0.4, w * 0.29, 3.5, 0.12);
  b.box("turf", 0, 1.8, -d / 2 + 0.5, w * 0.53, 1.5, 0.15);
  b.box("darkWood", -w * 0.26, 0.85, -d * 0.34, 1.1, 1.25, 0.75, true);
  b.sign("LECTURE HALL · FILM SOCIETY", 0, 8.1, -d / 2 + 0.4, w * 0.55, 0.6);
  b.light(0, 8.5, 0, 520);
}

function gym(b: Builder) {
  const w = b.width, d = b.depth; shell(b, 1, "clay", false, 12); b.materials.clay.color.setHex(0x9c6b51);
  b.floor(-w * 0.42, w * 0.42, -d * 0.38, d * 0.38, 0.02, "timber");
  const cw = Math.min(w * 0.7, 28.65), cd = Math.min(d * 0.62, 15.24);
  for (const x of [-cw / 2, cw / 2]) b.box("white", x, 0.055, 0, 0.07, 0.018, cd);
  for (const z of [-cd / 2, cd / 2]) b.box("white", 0, 0.055, z, cw, 0.018, 0.07);
  b.box("white", 0, 0.055, 0, 0.07, 0.018, cd);
  const circle = new THREE.Mesh(new THREE.RingGeometry(1.77, 1.83, 64), b.materials.white); circle.rotation.x = -Math.PI / 2; circle.position.y = 0.06; b.group.add(circle);
  for (const side of [-1, 1]) {
    const x = side * cw / 2;
    b.box("metal", x + side * 0.9, 2.3, 0, 0.2, 4.6, 0.2, true);
    b.box("white", x, 3.5, 0, 0.12, 1.05, 1.8);
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.025, 8, 24), b.materials.clay); hoop.rotation.x = Math.PI / 2; hoop.position.set(x - side * 0.36, 3.05, 0); b.group.add(hoop);
    for (let row = 0; row < 4; row++) {
      const z = side * (cd / 2 + 1.5 + row * 0.8);
      b.box("concrete", 0, row * 0.38 + 0.15, z, cw * 0.8, 0.3, 0.8);
      b.box("blue", 0, row * 0.38 + 0.5, z, cw * 0.8, 0.2, 0.45);
    }
  }
  b.sign("SPARTANS", 0, 5.2, -d / 2 + 0.4, Math.min(14, w * 0.5), 2);
  b.sign(titles.veale, 0, 3.8, d / 2 + 0.3, Math.min(w - 3, 18), 0.65);
  for (let x = -w * 0.4; x <= w * 0.4; x += 4) b.beam("white", new THREE.Vector3(x, 11, -d / 2), new THREE.Vector3(x, 11, d / 2), 0.24);
  b.light(-w * 0.2, 10.5, 0, 650); b.light(w * 0.2, 10.5, 0, 650);
}

function bed(b: Builder, x: number, z: number, y: number) {
  b.box("timber", x, y + 0.35, z, 1.0, 0.25, 2.05, true); b.box("white", x, y + 0.55, z, 1.0, 0.2, 2.05);
  b.box("blueBook", x, y + 0.68, z + 0.2, 1.01, 0.08, 1.6); b.box("white", x, y + 0.72, z - 0.68, 0.72, 0.14, 0.42);
  b.box("timber", x, y + 0.65, z - 1.0, 1.1, 1.0, 0.1);
}

function clarke(b: Builder) {
  const w = b.width, d = b.depth; shell(b, 11, "clay"); levels(b, 2, "stone", true); b.materials.clay.color.setHex(0xb9886b);
  // Eleven exterior storeys; two supported demonstration levels only.
  for (const side of [-1, 1]) b.box("concrete", side * w * 0.22, 23.1, d / 2 + 0.35, 0.65, 46.2, 0.6);
  b.sign(titles.clarke, 0, 3.7, d / 2 + 0.4, 9, 0.6);
  sofa(b, -w * 0.25, d * 0.2); sofa(b, w * 0.25, d * 0.2);
  b.box("turf", w * 0.25, 0.82, -d * 0.1, 2.7, 0.15, 1.52, true);
  b.box("white", w * 0.25, 0.92, -d * 0.1, 2.7, 0.015, 0.025); b.box("net", w * 0.25, 1.04, -d * 0.1, 0.025, 0.2, 1.52);
  b.box("darkWood", -w * 0.3, 0.7, -d * 0.1, 1.6, 1.4, 0.65, true); b.box("white", -w * 0.3, 0.85, -d * 0.1 + 0.4, 1.35, 0.06, 0.35);
  b.sign("LOBBY · PIANO · GAMES", 0, 2.7, -d * 0.22, 8, 0.5);
  const y = STOREY, roomW = 2.925, doorZ = 1.55;
  // The public housing description specifies three doubles and two singles.
  // This furnished demonstration keeps that eight-person capacity; placement
  // is representative, with no real assignments or occupancy information.
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * roomW, double = i < 3;
    const roomD = double ? 5.94 : 3.15, z = doorZ + roomD / 2;
    roomWall(b, x, doorZ, roomW, y);
    wall(b, "white", x - roomW / 2, z, 0.12, roomD, y, 3.3);
    wall(b, "white", x, doorZ + roomD, roomW, 0.12, y, 3.3);
    if (i === 4) wall(b, "white", x + roomW / 2, z, 0.12, roomD, y, 3.3);
    bed(b, x - 0.90, doorZ + 1.65, y);
    if (double) bed(b, x + 0.90, doorZ + 1.65, y);
    desk(b, x + (double ? -0.65 : 0.72), doorZ + roomD - 0.65, y);
    if (double) desk(b, x + 0.65, doorZ + roomD - 0.65, y);
    b.sign(`ROOM ${String.fromCharCode(65+i)} · ${double ? "DOUBLE" : "SINGLE"}`, x, y + 2.7, doorZ - 0.1, 2.35, 0.28);
  }
  // A shared washroom fits beside the stair landing, with an open doorway.
  roomWall(b, -6.7, -1.8, 2.1, y);
  wall(b, "white", -5.65, -3.8, 0.12, 4, y, 3.3);
  b.box("white", -6.6, y + 0.82, -4.1, 0.9, 0.16, 0.55, true);
  b.cylinder("white", -6.6, y + 0.42, -2.8, 0.3, 0.8, true);
  b.box("white", -6.6, y + 0.62, -3.2, 0.56, 0.8, 0.24, true);
  b.box("glass", -6.4, y + 1.15, -5.8, 1.4, 2.3, 0.06);
  b.sign("SHARED BATH", -6.45, y + 2.6, -1.65, 2, 0.27);
  b.box("fabric", 0, y + .37, -1.8, 2.8, .55, .95, true);
  b.box("fabric", 0, y + .76, -2.23, 2.8, .65, .17);
  b.sign("REPRESENTATIVE EIGHT-PERSON SUITE", 0, y + 2.8, -0.1, 9, 0.5);
  lighting(b, 2);
}

function academic(b: Builder, kind: string) {
  const w = b.width, d = b.depth, medical = ["nursing", "medicine", "dental"].includes(kind);
  const publicFloors = d < 18 ? 1 : 2;
  shell(b, 3, kind === "mather-house" ? "clay" : "stone"); levels(b, publicFloors);
  if (kind === "mather-house") pitchedRoof(b, 12.8, 4.2);
  b.sign(titles[kind] ?? "CASE WESTERN RESERVE UNIVERSITY", 0, 3.8, d / 2 + 0.35, Math.min(w - 3, 22), 0.7);
  for (let floor = 0; floor < publicFloors; floor++) {
    const y = floor * STOREY;
    for (const side of [-1, 1]) {
      const x = side * w * 0.26, rw = w * 0.4;
      roomWall(b, x, -d * 0.05, rw, y);
      b.sign(medical ? "TEACHING & LEARNING" : "LECTURE & SEMINAR ROOM", x, y + 2.6, -d * 0.05 + 0.11, Math.min(rw - 1, 7), 0.5);
      b.box("white", x, y + 2, -d * 0.35, rw * 0.75, 1.7, 0.12);
      for (let xx = x - rw * 0.32; xx <= x + rw * 0.32; xx += 2.5) for (let z = -d * 0.27; z <= -d * 0.12; z += 2.9) desk(b, xx, z, y, medical);
      if (d >= 18) sofa(b, x, d * 0.18, y);
    }
  }
  lighting(b, publicFloors);
}

function village(b: Builder) {
  const w = b.width, d = b.depth;
  b.materials.clay.color.setHex(0xa6674b); b.materials.roof.color.setHex(0x696a5d);
  shell(b, 4, "clay"); levels(b, 2, "timber"); pitchedRoof(b, 16.9, 3.8);
  // This anchor is House 4. The complex's clock tower is at a different house
  // and must not be transplanted here merely to make the silhouette familiar.
  b.sign(titles.village, 0, 3.8, d / 2 + 0.35, Math.min(13, w * 0.7), 0.65);
  for (const side of [-1, 1]) sofa(b, side * w * 0.27, d * 0.13);
  b.box("stone", 0, 1.4, -d / 2 + 0.5, 4.5, 2.8, 0.8, true);
  b.box("darkWood", 0, 0.75, -d / 2 + 0.94, 2.5, 1.5, 0.1);
  b.box("timber", 0, 1.9, -d / 2 + 1, 4.8, 0.16, 0.8);
  for (const x of [-w * 0.3, w * 0.3]) b.table(x, -d * 0.23);
  b.sign("COMMON GREAT ROOM", 0, 3.4, -d * 0.25 + 0.5, 7, 0.5);
  const y = STOREY;
  b.box("timber", w * 0.3, y + 0.47, -d * 0.12, w * 0.25, 0.94, 0.65, true);
  b.box("white", w * 0.3, y + 0.98, -d * 0.12, w * 0.26, 0.08, 0.72);
  b.box("white", w * 0.42, y + 1.05, -d * 0.25, 0.85, 2.1, 0.8, true);
  b.box("metal", w * 0.23, y + 1.04, -d * 0.12, 0.55, 0.06, 0.55);
  for (const dx of [-0.15, 0.15]) for (const dz of [-0.15, 0.15]) b.cylinder("darkWood", w * 0.23 + dx, y + 1.08, -d * 0.12 + dz, 0.085, 0.02);
  b.table(w * 0.26, d * 0.06, y); sofa(b, w * 0.26, d * 0.27, y);
  const rw = w * 0.36;
  for (const z of [-d * 0.05, d * 0.28]) {
    const x = -w * 0.28;
    roomWall(b, x, z - d * 0.14, rw, y);
    bed(b, x - rw * 0.23, z, y); desk(b, x + rw * 0.2, z + 0.7, y);
    b.box("timber", x + rw * 0.25, y + 1, z - d * 0.08, 1.1, 2, 0.6, true);
  }
  b.sign("REPRESENTATIVE APARTMENT", 0, y + 2.8, d * 0.1, 7, 0.5);
  lighting(b, 2);
}

function villageClocktower(b: Builder) {
  const w = b.width, d = b.depth, top = 28;
  b.materials.clay.color.setHex(0x98523e); b.materials.stone.color.setHex(0xc8c7ba);
  shell(b, 5, "clay", false, 21);
  b.box("clay", 0, 24.5, 0, w, 7, d);
  // Photo reference: four tall glazed clock stages between brick corner piers,
  // pale limestone framing and flat coping. The tower has no pyramidal cap.
  for (const side of [-1, 1]) {
    b.box("glass", 0, 24, side * (d / 2 + 0.05), w * 0.53, 6, 0.06);
    b.box("glass", side * (w / 2 + 0.05), 24, 0, 0.06, 6, d * 0.53);
    for (const x of [-w * 0.27, 0, w * 0.27]) b.box("stone", x, 24.2, side * (d / 2 + 0.15), 0.18, 7.2, 0.3);
    for (const z of [-d * 0.27, 0, d * 0.27]) b.box("stone", side * (w / 2 + 0.15), 24.2, z, 0.3, 7.2, 0.18);
    for (const y of [20.8, 22, top]) {
      b.box("stone", 0, y, side * (d / 2 + 0.22), w + 0.8, 0.22, 0.55);
      b.box("stone", side * (w / 2 + 0.22), y, 0, 0.55, 0.22, d + 0.8);
    }
  }
  for (const x of [-w * 0.42, w * 0.42]) for (const z of [-d * 0.42, d * 0.42]) {
    b.box("clay", x, top + 0.6, z, w * 0.18, 2.5, d * 0.18);
    b.box("stone", x, top + 1.9, z, w * 0.18 + 0.15, 0.18, d * 0.18 + 0.15);
  }
  const radius = Math.min(w, d) * 0.16;
  for (let side = 0; side < 4; side++) {
    const face = new THREE.Group(), angle = side * Math.PI / 2;
    const point = (x: number, y: number, z = 0.04) => new THREE.Vector3(
      Math.sin(angle) * (w / 2 + 0.27) + x * Math.cos(angle) + z * Math.sin(angle),
      24.1 + y,
      Math.cos(angle) * (d / 2 + 0.27) - x * Math.sin(angle) + z * Math.cos(angle),
    );
    const disk = new THREE.Mesh(new THREE.CircleGeometry(radius, 48), b.materials.white); face.add(disk);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.045, 8, 48), b.materials.metal); face.add(ring);
    for (let tick = 0; tick < 12; tick++) {
      const tickAngle = tick * Math.PI / 6;
      b.beam("darkWood", point(Math.sin(tickAngle) * radius * 0.74, Math.cos(tickAngle) * radius * 0.74), point(Math.sin(tickAngle) * radius * 0.9, Math.cos(tickAngle) * radius * 0.9), 0.045);
    }
    for (const [handAngle, length] of [[-0.6, radius * 0.5], [0.25, radius * 0.76]]) {
      b.beam("darkWood", point(0, 0, 0.07), point(Math.sin(handAngle) * length, Math.cos(handAngle) * length, 0.07), 0.06);
    }
    face.position.set(Math.sin(angle) * (w / 2 + 0.27), 24.1, Math.cos(angle) * (d / 2 + 0.27)); face.rotation.y = angle; b.group.add(face);
  }
  b.box("roof", 0, top + 0.25, 0, w + 0.4, 0.25, d + 0.4);
  b.box("roof", 0, 3.8, d / 2 + 1.1, w + 0.5, 0.18, 2.5);
  b.sign("VILLAGE HOUSE 3A", 0, 3.3, d / 2 + 0.3, Math.min(7.5, w - 1), 0.5);
  b.box("timber", -w * 0.28, 0.6, -d * 0.18, 2.6, 1.2, 0.85, true);
  b.sign("CAFÉ COMMONS", -w * 0.28, 1.7, -d * 0.18 + 0.5, 2.8, 0.3);
  b.table(w * 0.25, -d * 0.2); b.table(w * 0.25, d * 0.2);
  b.light(0, 3.5, 0, 160);
  b.group.userData.clock = "Decorative reference interpretation, not a live time display";
}

export function buildArchitecture(kind: ArchitectureKind, width: number, depth: number, sourceHeight?: number): Architecture {
  if (!Number.isFinite(width) || !Number.isFinite(depth) || width <= 0 || depth <= 0) throw new Error(`Invalid ${kind} model dimensions`);
  const b = new Builder(width, depth, sourceHeight);
  const builders: Record<string, (b: Builder) => void> = {
    "kelvin-smith": library, "tinkham-veale": tinkham, "peter-lewis": lewis,
    adelbert, "amasa-stone": chapel, thinkbox: makerspace,
    strosacker: auditorium, veale: gym, clarke, village, "village-clocktower": villageClocktower,
  };
  if (builders[kind]) builders[kind](b); else academic(b, kind);
  b.group.userData.referenceModel = "Original source-informed reconstruction; approximate dimensions and circulation";
  b.group.userData.sourceManifest = "projects/cwru/architecture-sources.json";
  b.group.userData.supportedLevels = kind === "thinkbox" ? 7 : ["kelvin-smith", "peter-lewis", "adelbert"].includes(kind) ? 3 : ["amasa-stone", "strosacker", "veale", "village-clocktower"].includes(kind) || (!builders[kind] && depth < 18) ? 1 : 2;
  return b.finish(kind);
}
