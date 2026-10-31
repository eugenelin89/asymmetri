// SPDX-License-Identifier: MIT — original procedural assets, no third-party meshes/logos.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
export function material(
  color: THREE.ColorRepresentation,
  roughness = 0.65,
  metalness = 0,
) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}
export function box(
  g: THREE.Object3D,
  m: THREE.Material,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  g.add(mesh);
  return mesh;
}
export function sphere(
  g: THREE.Object3D,
  m: THREE.Material,
  x: number,
  y: number,
  z: number,
  radius: number,
  scale: [number, number, number] = [1, 1, 1],
) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 10, 7), m);
  mesh.position.set(x, y, z);
  mesh.scale.set(...scale);
  g.add(mesh);
  return mesh;
}
export function beam(
  g: THREE.Object3D,
  m: THREE.Material,
  a: THREE.Vector3,
  b: THREE.Vector3,
  radius = 0.025,
) {
  const delta = b.clone().sub(a),
    mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, delta.length(), 7),
      m,
    );
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    delta.normalize(),
  );
  g.add(mesh);
  return mesh;
}
export function lettering(
  text: string,
  width: number,
  height: number,
  foreground = "#f9c447",
  background = "#17252a",
) {
  if (typeof document === "undefined") return new THREE.Group();
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 128;
  const c = canvas.getContext("2d")!;
  c.fillStyle = background;
  c.fillRect(0, 0, 1024, 128);
  c.fillStyle = foreground;
  c.font = "bold 74px monospace";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(text, 512, 67, 990);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({
      map,
      emissive: 0xffffff,
      emissiveMap: map,
      emissiveIntensity: 0.45,
      roughness: 0.5,
    }),
  );
}
/** Small flying bird silhouette drawn from three original geometric strokes. */
export function birdMark(g: THREE.Object3D, y = 1.2, z = 0.235) {
  const gold = material(0xd3b15d),
    mark = new THREE.Group();
  for (const side of [-1, 1]) {
    const wing = box(mark, gold, side * 0.055, 0, 0, 0.13, 0.028, 0.014);
    wing.rotation.z = side * 0.45;
  }
  sphere(mark, gold, 0, -0.025, 0.006, 0.025, [0.6, 1.4, 0.5]);
  mark.position.set(0, y, z);
  g.add(mark);
}
export function uniform(
  model: { group: THREE.Group; legs: THREE.Group[] },
  sport: string,
  color = "#234d81",
  number = "",
) {
  const shirt = material(color),
    gold = material(0xd4b461),
    white = material(0xe7e4da),
    dark = material(0x263546);
  const torso = model.group.children[0];
  if (torso instanceof THREE.Mesh) torso.material = shirt;
  // Sport-specific outer garments: shorts/socks, baseball cap/pants, hockey/football padding.
  const lower = sport.toLowerCase(),
    baseball = /baseball|softball/.test(lower),
    hockey = /hockey/.test(lower) && !lower.includes("field"),
    football = lower.includes("football");
  for (const leg of model.legs) {
    const limb = leg.children[0];
    if (limb instanceof THREE.Mesh) limb.material = baseball ? white : dark;
    if (!baseball && !hockey && !football) {
      box(leg, shirt, 0, -0.14, 0, 0.18, 0.33, 0.18);
      box(leg, white, 0, -0.58, 0, 0.14, 0.23, 0.15);
    }
  }
  if (baseball) {
    sphere(model.group, shirt, 0, 1.72, 0, 0.16, [1, 0.55, 1]);
    box(model.group, shirt, 0, 1.7, 0.16, 0.27, 0.025, 0.2);
    box(model.group, dark, 0, 0.86, 0.17, 0.4, 0.045, 0.03);
  }
  if (hockey || football) {
    sphere(model.group, shirt, 0, 1.65, 0, 0.18, [1, 1, 1.1]);
    box(model.group, white, 0, 1.58, 0.17, 0.29, 0.055, 0.03);
    for (const side of [-1, 1])
      sphere(model.group, shirt, side * 0.25, 1.32, 0, 0.15, [1.1, 0.8, 1]);
  }
  if (/golf/.test(lower))
    box(model.group, white, 0, 1.41, 0.17, 0.18, 0.06, 0.09);
  if (/swim|rowing/.test(lower))
    box(model.group, gold, 0, 0.96, 0.215, 0.4, 0.04, 0.025);
  birdMark(model.group);
  if (number) {
    const label = lettering(number, 0.2, 0.13, "#f0df9b", color);
    label.position.set(0, 1.05, 0.238);
    model.group.add(label);
  }
}
export function bicycle(color = 0x476a79) {
  const g = new THREE.Group(),
    frame = material(color, 0.4, 0.6),
    rubber = material(0x262b29),
    silver = material(0xb3b9b9, 0.3, 0.8),
    wheels: THREE.Mesh[] = [];
  for (const z of [-0.61, 0.61]) {
    const wheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.036, 7, 24),
      rubber,
    );
    wheel.rotation.y = Math.PI / 2;
    wheel.position.set(0, 0.36, z);
    g.add(wheel);
    wheels.push(wheel);
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      beam(
        wheel,
        silver,
        new THREE.Vector3(),
        new THREE.Vector3(Math.cos(a) * 0.31, Math.sin(a) * 0.31, 0),
        0.005,
      );
    }
  }
  const points = [
    [0, 0.36, -0.61],
    [0, 0.4, 0],
    [0, 0.92, -0.22],
    [0, 0.36, -0.61],
    [0, 0.4, 0],
    [0, 0.94, 0.4],
    [0, 0.92, -0.22],
    [0, 0.94, 0.4],
    [0, 0.36, 0.61],
  ];
  for (let i = 1; i < points.length; i++)
    beam(
      g,
      frame,
      new THREE.Vector3(...(points[i - 1] as [number, number, number])),
      new THREE.Vector3(...(points[i] as [number, number, number])),
      0.025,
    );
  box(g, rubber, 0, 1.02, -0.22, 0.23, 0.055, 0.3);
  beam(
    g,
    silver,
    new THREE.Vector3(0, 0.9, 0.4),
    new THREE.Vector3(0, 1.15, 0.45),
  );
  box(g, rubber, 0, 1.15, 0.45, 0.65, 0.04, 0.06);
  return { group: g, wheels };
}

/** Collapse static direct-child meshes into material batches; retain animated groups. */
export function batchStatic(
  root: THREE.Group,
  moving = new Set<THREE.Object3D>(),
) {
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  for (const child of [...root.children]) {
    if (
      !(child instanceof THREE.Mesh) ||
      moving.has(child) ||
      Array.isArray(child.material)
    )
      continue;
    child.updateMatrix();
    const geometry = child.geometry.clone().applyMatrix4(child.matrix);
    const list = batches.get(child.material) || [];
    list.push(geometry);
    batches.set(child.material, list);
    child.geometry.dispose();
    root.remove(child);
  }
  for (const [material, geometries] of batches) {
    const geometry = mergeGeometries(geometries);
    geometries.forEach((g) => g.dispose());
    if (!geometry) continue;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = mesh.receiveShadow = true;
    root.add(mesh);
  }
}
