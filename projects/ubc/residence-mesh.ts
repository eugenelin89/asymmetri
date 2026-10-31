// SPDX-License-Identifier: MIT
// Original deterministic furniture and finishes; no downloaded imagery or models.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { label } from "./stadium";
import type { Box, Floor, Ramp } from "./spatial";

export type Finish =
  | "plaster"
  | "wood"
  | "oak"
  | "carpet"
  | "tile"
  | "metal"
  | "glass"
  | "linen"
  | "teal"
  | "ochre"
  | "rust"
  | "navy"
  | "black"
  | "light"
  | "concrete"
  | "screen";
function texture(fabric: boolean) {
  const bytes = new Uint8Array(128 * 128 * 4);
  let seed = 773;
  for (let y = 0; y < 128; y++)
    for (let x = 0; x < 128; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const grain = fabric
        ? ((x % 2) + (y % 2)) * 5
        : Math.sin(x * 0.48 + Math.sin(y * 0.12)) * 9;
      const value = 215 + (seed >>> 28) + grain;
      bytes.set([value, value, value, 255], (y * 128 + x) * 4);
    }
  const map = new THREE.DataTexture(bytes, 128, 128);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(fabric ? 5 : 2, fabric ? 5 : 1);
  map.colorSpace = THREE.SRGBColorSpace;
  map.magFilter = THREE.LinearFilter;
  map.needsUpdate = true;
  return map;
}
export class ResidenceMesh {
  group = new THREE.Group();
  colliders: Box[] = [];
  floors: Floor[] = [];
  ramps: Ramp[] = [];
  materials: Record<Finish, THREE.MeshStandardMaterial>;
  private buckets = new Map<Finish, THREE.BufferGeometry[]>();
  constructor() {
    const material = (color: number, roughness = 0.8, metalness = 0) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });
    this.materials = {
      plaster: material(0xe9e5dc),
      wood: material(0xa7845c),
      oak: material(0xdbc49c),
      carpet: material(0x787f78, 1),
      tile: material(0xbabbb2, 0.45),
      metal: material(0x4a5050, 0.32, 0.65),
      glass: new THREE.MeshStandardMaterial({
        color: 0xbedde3,
        transparent: true,
        opacity: 0.18,
        roughness: 0.15,
        metalness: 0.15,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      linen: material(0xe8e4d8, 1),
      teal: material(0x507d7b, 0.95),
      ochre: material(0xbe9b5e, 0.95),
      rust: material(0x985f4d, 0.95),
      navy: material(0x425973, 0.95),
      black: material(0x242b2d),
      light: new THREE.MeshStandardMaterial({
        color: 0xffeed3,
        emissive: 0xffe4b8,
        emissiveIntensity: 1.5,
      }),
      concrete: material(0xb5b3aa),
      screen: new THREE.MeshStandardMaterial({
        color: 0x2f5361,
        emissive: 0x2f5361,
        emissiveIntensity: 0.2,
      }),
    };
    this.materials.wood.map = texture(false);
    this.materials.oak.map = this.materials.wood.map;
    this.materials.carpet.map = texture(true);
    this.materials.linen.map = this.materials.carpet.map;
  }
  add(finish: Finish, geometry: THREE.BufferGeometry) {
    const bucket = this.buckets.get(finish) || [];
    bucket.push(geometry);
    this.buckets.set(finish, bucket);
  }
  box(
    m: Finish,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    solid = false,
    yaw = 0,
  ) {
    if (Math.min(w, h, d) <= 0) return;
    const g = new THREE.BoxGeometry(w, h, d);
    g.rotateY(yaw);
    g.translate(x, y, z);
    this.add(m, g);
    if (solid)
      this.colliders.push({
        minX: x - w / 2,
        maxX: x + w / 2,
        minY: y - h / 2,
        maxY: y + h / 2,
        minZ: z - d / 2,
        maxZ: z + d / 2,
      });
  }
  round(
    m: Finish,
    x: number,
    y: number,
    z: number,
    radius: number,
    height: number,
  ) {
    const g = new THREE.CylinderGeometry(radius, radius, height, 16);
    g.translate(x, y, z);
    this.add(m, g);
  }
  cushion(
    m: Finish,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
  ) {
    const g = new THREE.SphereGeometry(1, 12, 8);
    g.scale(w / 2, h / 2, d / 2);
    g.translate(x, y, z);
    this.add(m, g);
  }
  sign(
    text: string,
    x: number,
    y: number,
    z: number,
    w: number,
    h = 0.35,
    yaw = 0,
    info?: string,
  ) {
    const mesh = label(text, 1024, Math.max(160, Math.round((h / w) * 1024)));
    mesh.position.set(x, y, z);
    mesh.rotation.y = yaw;
    mesh.scale.set(w, h, 1);
    if (info) mesh.userData.info = info;
    const material = mesh.material as THREE.Material;
    material.side = THREE.FrontSide;
    const back = new THREE.Mesh(mesh.geometry, material);
    back.rotation.y = Math.PI;
    back.position.z = -0.002;
    mesh.add(back);
    this.group.add(mesh);
    return mesh;
  }
  floor(
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number,
    y: number,
    m: Finish = "carpet",
  ) {
    this.box(
      m,
      (minX + maxX) / 2,
      y - 0.09,
      (minZ + maxZ) / 2,
      maxX - minX,
      0.18,
      maxZ - minZ,
    );
    this.floors.push({ minX, maxX, minZ, maxZ, y });
  }
  wall(
    x: number,
    z: number,
    w: number,
    d: number,
    y: number,
    h = 2.8,
    m: Finish = "plaster",
  ) {
    this.box(m, x, y + h / 2, z, w, h, d, true);
    this.box("oak", x, y + 0.06, z, w + 0.015, 0.12, d + 0.015);
  }
  window(x: number, z: number, w: number, y: number, yaw = 0) {
    this.box("glass", x, y + 1.55, z, w, 1.65, 0.035, false, yaw);
    for (const dx of [-w / 2, 0, w / 2])
      this.box(
        "metal",
        x + dx * Math.cos(yaw),
        y + 1.55,
        z - dx * Math.sin(yaw),
        0.045,
        1.75,
        0.1,
        false,
        yaw,
      );
    for (const dy of [0.7, 2.4])
      this.box("metal", x, y + dy, z, w + 0.1, 0.055, 0.16, false, yaw);
  }

  chair(x: number, z: number, y: number, yaw = 0) {
    this.box("teal", x, y + 0.46, z, 0.46, 0.09, 0.46, true);
    this.box(
      "wood",
      x + Math.sin(yaw) * 0.2,
      y + 0.73,
      z + Math.cos(yaw) * 0.2,
      0.45,
      0.5,
      0.06,
      false,
      yaw,
    );
    for (const dx of [-0.18, 0.18])
      for (const dz of [-0.18, 0.18])
        this.box("metal", x + dx, y + 0.23, z + dz, 0.035, 0.45, 0.035);
  }
  desk(x: number, z: number, y: number, colour: Finish = "teal") {
    this.box("oak", x, y + 0.75, z, 1.22, 0.055, 0.6, true);
    for (const dx of [-0.52, 0.52])
      this.box("wood", x + dx, y + 0.38, z, 0.045, 0.73, 0.53);
    this.box("wood", x + 0.34, y + 0.48, z, 0.4, 0.46, 0.5);
    for (const dy of [0.34, 0.5, 0.66])
      this.box("metal", x + 0.34, y + dy, z + 0.26, 0.17, 0.012, 0.02);
    this.box("black", x - 0.15, y + 0.8, z, 0.43, 0.025, 0.29);
    this.box("black", x - 0.15, y + 0.96, z - 0.11, 0.44, 0.29, 0.02);
    this.box("screen", x - 0.15, y + 0.96, z - 0.095, 0.4, 0.25, 0.008);
    this.box(colour, x + 0.4, y + 0.8, z + 0.05, 0.22, 0.028, 0.3);
    this.round("metal", x - 0.49, y + 0.8, z - 0.12, 0.07, 0.03);
    this.round("metal", x - 0.49, y + 1.02, z - 0.12, 0.012, 0.43);
    this.round("linen", x - 0.49, y + 1.22, z - 0.12, 0.12, 0.12);
    this.chair(x - 0.1, z + 0.65, y);
  }
  bed(x: number, z: number, y: number, colour: Finish) {
    this.box("wood", x, y + 0.3, z, 1.04, 0.25, 2.08, true);
    this.box("wood", x, y + 0.7, z - 1.02, 1.08, 0.85, 0.07);
    this.cushion("linen", x, y + 0.51, z, 1.06, 0.28, 2.06);
    this.box(colour, x, y + 0.62, z + 0.28, 1.04, 0.055, 1.48);
    for (let k = 0; k < 7; k++)
      this.box("linen", x, y + 0.65, z + 0.85 - k * 0.09, 1.045, 0.008, 0.009);
    this.cushion("linen", x, y + 0.7, z - 0.65, 0.72, 0.15, 0.42);
    for (const dx of [-0.42, 0.42])
      for (const dz of [-0.88, 0.88])
        this.box("wood", x + dx, y + 0.13, z + dz, 0.075, 0.25, 0.075);
  }
  wardrobe(x: number, z: number, y: number) {
    this.box("oak", x, y + 1, z, 1, 2, 0.57, true);
    this.box("wood", x, y + 1, z + 0.295, 0.015, 1.95, 0.02);
    for (const dx of [-0.08, 0.08])
      this.box("metal", x + dx, y + 1, z + 0.32, 0.018, 0.25, 0.025);
  }
  books(x: number, z: number, y: number, seed: number) {
    this.box("oak", x, y + 1.15, z, 0.9, 1.3, 0.25);
    for (const level of [0.65, 1, 1.35, 1.7]) {
      this.box("wood", x, y + level, z + 0.02, 0.93, 0.035, 0.32);
      for (let i = 0; i < 7; i++)
        this.box(
          (["teal", "ochre", "rust", "navy", "linen"] as Finish[])[
            (i + seed) % 5
          ],
          x - 0.34 + i * 0.1,
          y + level + 0.14,
          z + 0.12,
          0.055 + (i % 2) * 0.02,
          0.22 + (i % 3) * 0.025,
          0.16,
        );
    }
  }
  sofa(x: number, z: number, y: number, colour: Finish = "teal") {
    this.box("wood", x, y + 0.17, z, 2.15, 0.25, 0.82, true);
    this.box(colour, x, y + 0.43, z, 1.88, 0.25, 0.79);
    this.box(colour, x, y + 0.75, z - 0.35, 2.1, 0.65, 0.2);
    for (const dx of [-1, 1]) {
      this.box(colour, x + dx, y + 0.55, z, 0.2, 0.45, 0.9);
      this.cushion("ochre", x + dx * 0.72, y + 0.64, z - 0.18, 0.36, 0.4, 0.16);
    }
  }
  light(x: number, z: number, y: number, real = false) {
    this.round("linen", x, y, z, 0.21, 0.07);
    this.round("light", x, y - 0.04, z, 0.17, 0.01);
    if (real) {
      const light = new THREE.PointLight(0xffedcf, 18, 12, 1.6);
      light.position.set(x, y - 0.15, z);
      this.group.add(light);
    }
  }
  finish() {
    for (const [name, geometries] of this.buckets) {
      const merged = mergeGeometries(geometries);
      geometries.forEach((g) => g.dispose());
      if (merged) {
        const mesh = new THREE.Mesh(merged, this.materials[name]);
        mesh.castShadow = name !== "glass" && name !== "light";
        mesh.receiveShadow = true;
        this.group.add(mesh);
      }
    }
    this.buckets.clear();
    return this;
  }
}
