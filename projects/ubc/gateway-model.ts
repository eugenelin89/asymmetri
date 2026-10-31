// SPDX-License-Identifier: MIT
// Original reference-based geometry, not imported university lettering or a font.
// The dimensions are modelling estimates, not an as-built measurement.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Box } from "./spatial";

const letterHeight = 2.5;
const baseline = 0.3;
const depth = 0.45;

function uOutline() {
  const s = new THREE.Shape();
  s.moveTo(0, letterHeight);
  s.lineTo(0.51, letterHeight);
  s.lineTo(0.51, 1.01);
  s.bezierCurveTo(0.51, 0.66, 0.67, 0.47, 1.01, 0.47);
  s.bezierCurveTo(1.35, 0.47, 1.51, 0.66, 1.51, 1.01);
  s.lineTo(1.51, letterHeight);
  s.lineTo(2.02, letterHeight);
  s.lineTo(2.02, 0.99);
  s.bezierCurveTo(2.02, 0.33, 1.65, 0, 1.01, 0);
  s.bezierCurveTo(0.37, 0, 0, 0.33, 0, 0.99);
  s.closePath();
  return s;
}

function bOutline() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(0, letterHeight);
  s.lineTo(1.02, letterHeight);
  s.bezierCurveTo(1.61, 2.5, 1.89, 2.26, 1.89, 1.87);
  s.bezierCurveTo(1.89, 1.59, 1.73, 1.38, 1.48, 1.29);
  s.bezierCurveTo(1.81, 1.22, 1.98, 0.99, 1.98, 0.68);
  s.bezierCurveTo(1.98, 0.25, 1.64, 0, 1.02, 0);
  s.closePath();

  const upper = new THREE.Path();
  upper.moveTo(0.51, 2.04);
  upper.lineTo(0.99, 2.04);
  upper.bezierCurveTo(1.25, 2.04, 1.37, 1.94, 1.37, 1.77);
  upper.bezierCurveTo(1.37, 1.6, 1.25, 1.51, 0.99, 1.51);
  upper.lineTo(0.51, 1.51);
  upper.closePath();
  const lower = new THREE.Path();
  lower.moveTo(0.51, 1.06);
  lower.lineTo(1.04, 1.06);
  lower.bezierCurveTo(1.33, 1.06, 1.45, 0.96, 1.45, 0.76);
  lower.bezierCurveTo(1.45, 0.56, 1.3, 0.46, 1.04, 0.46);
  lower.lineTo(0.51, 0.46);
  lower.closePath();
  s.holes.push(upper, lower);
  return s;
}

function cOutline() {
  const s = new THREE.Shape();
  // The open terminals and continuous curved wall remain true 3D geometry.
  const angle = Math.PI / 5;
  const outerX = 1.04, outerY = 1.25;
  const innerX = 0.52, innerY = 0.76;
  s.absellipse(outerX, outerY, outerX, outerY, angle, 2 * Math.PI - angle, false, 0);
  s.lineTo(
    outerX + innerX * Math.cos(2 * Math.PI - angle),
    outerY + innerY * Math.sin(2 * Math.PI - angle),
  );
  s.absellipse(outerX, outerY, innerX, innerY, 2 * Math.PI - angle, angle, true, 0);
  s.closePath();
  return s;
}

function brushedRoughness() {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    const stripe = Math.sin(y * 137.17 + 23.8) * 43758.5453;
    for (let x = 0; x < size; x++) {
      const fine = Math.sin(x * 41.13 + y * 91.7) * 19283.751;
      const value = 188 + Math.floor((stripe - Math.floor(stripe)) * 32 + (fine - Math.floor(fine)) * 10);
      data.set([value, value, value, 255], (y * size + x) * 4);
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.name = "gateway-original-brushed-roughness";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.repeat.set(3, 14);
  texture.needsUpdate = true;
  return texture;
}

/** Local front is +Z. Site placement, orientation and pedestrian arrival are separate. */
export function buildGatewayLetters(): { group: THREE.Group; colliders: Box[] } {
  const group = new THREE.Group();
  group.name = "ubc-entrance-letters";
  const roughnessMap = brushedRoughness();
  const face = new THREE.MeshStandardMaterial({
    name: "gateway-satin-metal-face",
    color: 0xc7cbcc,
    // A diffuse contribution approximates sky reflections without a global HDR map.
    metalness: 0.18,
    roughness: 0.44,
    roughnessMap,
    envMapIntensity: 1.15,
  });
  const edge = new THREE.MeshStandardMaterial({
    name: "gateway-satin-metal-edge",
    color: 0x9da6a8,
    metalness: 0.35,
    roughness: 0.48,
    roughnessMap,
    envMapIntensity: 1.05,
  });
  for (const [name, shape, x] of [
    ["U", uOutline(), -3.2],
    ["B", bOutline(), -1.03],
    ["C", cOutline(), 1.12],
  ] as const) {
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.018,
      bevelSegments: 3,
      curveSegments: 24,
    });
    geometry.translate(x, baseline, -depth / 2);
    const mesh = new THREE.Mesh(geometry, [face, edge]);
    mesh.name = `gateway-letter-${name}`;
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
  }

  // A low concrete plinth and short steel supports are visible in public photos.
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(6.7, 0.18, 0.95),
    new THREE.MeshStandardMaterial({ color: 0x656761, roughness: 0.92 }),
  );
  plinth.name = "gateway-concrete-plinth";
  plinth.position.y = 0.09;
  plinth.castShadow = plinth.receiveShadow = true;
  group.add(plinth);

  const supports = [-2.19, -0.76, 0.27, 2.16].map((x) => {
    const g = new THREE.BoxGeometry(0.24, 0.16, 0.28);
    g.translate(x, 0.24, 0);
    return g;
  });
  const supportGeometry = mergeGeometries(supports);
  supports.forEach((g) => g.dispose());
  if (supportGeometry) {
    const mesh = new THREE.Mesh(supportGeometry, edge);
    mesh.name = "gateway-steel-supports";
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
  }

  // Visitors can walk all around the landmark but not through its solid base.
  const colliders: Box[] = [{
    minX: -3.35, maxX: 3.35,
    minZ: -0.475, maxZ: 0.475,
    minY: 0, maxY: baseline + letterHeight + 0.018,
  }];
  return { group, colliders };
}
