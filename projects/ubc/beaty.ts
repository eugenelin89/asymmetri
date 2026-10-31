// SPDX-License-Identifier: MIT — original public-space reconstruction; not a specimen scan.
import * as THREE from "three";
import type { Builder } from "./architecture";
import { buildBlueWhale } from "./whale-model";
import { beatyLowerLevel as lower, beatyGallery as gallery } from "./beaty-layout";

export function beaty(b: Builder) {
  const w = b.width, d = b.depth, roof = 5.8;
  b.materials.concrete.color.setHex(0xb3b4ae);
  b.materials.metal.color.setHex(0x566268);
  b.materials.glass.color.setHex(0xd7e8e6);
  b.materials.glass.opacity = 0.085;
  b.materials.glass.metalness = 0.06;
  b.materials.glass.roughness = 0.12;
  b.materials.darkWood.color.setHex(0x34393b);
  // Northern public doorway and southern cafe terrace. Lower gallery sits below grade.
  b.floor(-w / 2, w / 2, 21, d / 2, 0, "concrete");
  b.floor(-w / 2, w / 2, -d / 2, -17, 0, "concrete");
  b.floor(-2.4, 2.4, d / 2, d / 2 + 4, 0, "concrete");
  b.floor(-6.4, 6.4, -17, 21, lower, "concrete");
  b.floor(gallery.minX, gallery.maxX, gallery.minZ, gallery.maxZ, lower, "concrete");
  // Retaining walls below the lantern. East wall has a broad opening into collections.
  b.box("concrete", w / 2, lower / 2, 2, 0.3, -lower, d, true);
  b.box("concrete", -w / 2, lower / 2, -21.9, 0.3, -lower, 11.5, true);
  b.box("concrete", -w / 2, lower / 2, 23, 0.3, -lower, 9.3, true);
  for (const z of [-d / 2, d / 2]) b.box("concrete", 0, lower / 2, z, w, -lower, 0.3, true);
  // Fine steel curtain-wall mullions keep the full skeleton visible from Main Mall.
  for (const x of [-w / 2, w / 2]) {
    b.box("glass", x, roof / 2, 0, 0.035, roof, d, true);
    for (let z = -d / 2; z < d / 2 + 0.1; z += d / 20) {
      b.box("metal", x, roof / 2, z, 0.085, roof, 0.085);
    }
    for (const y of [0.16, 2.5, roof - 0.08]) b.box("metal", x, y, 0, 0.1, 0.09, d);
  }
  // The north entrance is an actual walk-through gap with open glass leaves.
  const doorGap = 3.5;
  for (const side of [-1, 1]) {
    b.box("glass", side * (w + doorGap) / 4, roof / 2, d / 2,
      (w - doorGap) / 2, roof, 0.035, true);
    b.box("metal", side * doorGap / 2, 1.45, d / 2, 0.09, 2.9, 0.13);
    b.box("glass", side * (doorGap / 2 + 0.35), 1.4, d / 2 + 0.5,
      0.035, 2.8, 1.1);
  }
  b.box("glass", 0, 4.3, d / 2, doorGap, 2.8, 0.035);
  b.box("metal", 0, 2.9, d / 2, doorGap, 0.12, 0.14);
  b.box("glass", 0, roof / 2, -d / 2, w, roof, 0.035, true);
  for (let x = -w / 2; x <= w / 2; x += w / 6) {
    b.box("metal", x, roof / 2, -d / 2, 0.08, roof, 0.1);
  }
  // Thin overhanging roof, exposed cross beams and metal ceiling slats.
  b.box("roof", 0, roof, 0, w + 1.8, 0.22, d + 1.5);
  for (let z = -d / 2; z <= d / 2; z += 3) b.box("metal", 0, roof - 0.23, z, w, 0.24, 0.13);
  for (let x = -w / 2; x <= w / 2; x += 0.45) b.box("metal", x, roof - 0.12, 0, 0.045, 0.05, d);
  for (const x of [-6.45, 6.45]) for (let z = -24; z <= 24; z += 12) b.box("concrete", x, roof / 2, z, 0.24, roof, 0.24, true);
  // Two continuous ramp flights, as documented on the west side of the atrium.
  const ramp = (minX: number, maxX: number, fromY: number, toY: number) => {
    const minZ = -15, maxZ = 21;
    b.ramps.push({ minX, maxX, minZ, maxZ, fromY, toY, axis: "z" });
    const length = maxZ - minZ, rise = toY - fromY;
    const slab = new THREE.Mesh(new THREE.BoxGeometry(maxX - minX, 0.16, Math.hypot(length, rise)), b.materials.concrete);
    slab.rotation.x = -Math.atan2(rise, length);
    slab.position.set((minX + maxX) / 2, (fromY + toY) / 2 - 0.08, (minZ + maxZ) / 2);
    slab.receiveShadow = true; b.group.add(slab);
    for (const x of [minX, maxX]) {
      b.beam("metal", new THREE.Vector3(x, fromY + 1.05, minZ), new THREE.Vector3(x, toY + 1.05, maxZ), 0.045);
      for (let z = minZ; z <= maxZ; z += 2.4) {
        const y = fromY + rise * (z - minZ) / length;
        b.box("metal", x, y + 0.5, z, 0.035, 1.05, 0.035);
      }
      // Solid low curb follows each ramp, preventing a sideways fall across levels.
      for (let z = minZ; z < maxZ; z += 0.6) {
        const y = fromY + rise * (z + 0.3 - minZ) / length;
        b.box("concrete", x, y + 0.16, z + 0.3, 0.075, 0.32, 0.6, true);
      }
    }
  };
  ramp(4.5, 6.18, -1.7, 0);
  ramp(2.62, 4.3, -1.7, lower);
  b.floor(2.62, 6.18, -17, -15, -1.7, "concrete");
  b.floor(-6.4, 4.3, 20.9, 23.2, lower, "concrete");
  // Landing guards leave the west ramp entrance open.
  b.rail(-6.35, 21, 4.45, 21, 0);
  b.rail(-6.35, -17, 6.25, -17, 0);
  b.rail(2.62, -17, 6.18, -17, -1.7);
  // Original 26 m lunge-feeding reconstruction: head SSE, tail toward north entry.
  const whale = buildBlueWhale();
  whale.rotation.y = Math.PI;
  whale.position.set(-0.55, 2.45, 2.2);
  whale.userData.info = "beaty-whale";
  b.group.add(whale);
  for (const z of [-9, -3, 4, 10, 15]) for (const x of [-1.25, 1.25]) {
    b.beam("metal", new THREE.Vector3(x, roof - 0.2, z), new THREE.Vector3(x * 0.5, 2.7, z), 0.012);
  }
  // Below-courtyard public collection gallery; representative fixtures, not copied specimens.
  const gx = (gallery.minX + gallery.maxX) / 2, gz = (gallery.minZ + gallery.maxZ) / 2;
  b.box("concrete", gx, -0.15, gz, gallery.maxX - gallery.minX, 0.3, gallery.maxZ - gallery.minZ);
  b.box("concrete", gallery.minX, lower / 2, gz, 0.3, -lower, gallery.maxZ - gallery.minZ, true);
  for (const z of [gallery.minZ, gallery.maxZ]) b.box("concrete", gx, lower / 2, z, gallery.maxX - gallery.minX, -lower, 0.3, true);
  const labels = ["PLANTS", "INSECTS", "FISHES", "BIRDS", "FOSSILS", "MARINE LIFE"];
  for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) {
    const x = -10 - col * 5.5, z = -10 + row * 10;
    b.box("darkWood", x, lower + 0.5, z, 3.6, 1, 2, true);
    b.box("glass", x, lower + 1.15, z, 3.6, 0.3, 2);
    for (let n = 0; n < 5; n++) {
      b.box("stone", x - 1.2 + n * 0.55, lower + 1.03, z, 0.28, 0.13, 0.4);
    }
    b.sign(labels[(row * 4 + col) % labels.length], x, lower + 0.8, z + 1.02, 2.7, 0.23);
  }
  for (let x = -28; x < -7; x += 7) for (const z of [-13, -2, 12]) b.box("concrete", x, lower / 2, z, 0.26, -lower, 0.26, true);
  b.sign("COLLECTIONS · EXPLORE BIODIVERSITY", -6.45, lower + 2.1, 7, 7.2, 0.5, Math.PI / 2);
  b.display("beaty-whale", "MEET BIG BLUE", -3.8, 23.5);
  b.display("beaty-collections", "BIODIVERSITY COLLECTIONS", -9, 16, lower);
  b.sign("BEATY BIODIVERSITY MUSEUM", 0, 3.4, d / 2 + 0.08, 10.4, 0.52);
  b.sign("DJAVAD MOWAFAGHIAN ATRIUM", -5.65, 1.35, 24.5, 3.5, 0.35);
  b.sign("WHALE & COLLECTIONS →", 2.2, 0.78, 21.25, 2.6, 0.26);
  // Cafe and admissions remain public-space interpretations; no ticket/payment workflow.
  for (const x of [-3, 1.3]) for (const z of [-24, -20]) b.table(x, z);
  b.box("timber", -3.4, 0.55, 25.3, 3.6, 1.1, 1.1, true);
  for (const z of [-8, 4, 16]) b.light(-0.5, 5.25, z, 110);
  for (const x of [-12, -25]) for (const z of [-9, 10]) b.light(x, -0.4, z, 90);
}
