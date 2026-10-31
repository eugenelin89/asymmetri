// SPDX-License-Identifier: MIT — original procedural anatomical interpretation.
// Reference photographs inform the silhouette and lunge-feeding pose. This is
// neither a scan nor a bone-by-bone measured replica of the museum specimen.
import * as THREE from "three";
import { ConvexGeometry } from "three/addons/geometries/ConvexGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

type P = [number, number, number];
type Part = "skull" | "mandibles" | "vertebrae" | "ribs" | "flippers" | "joints";
const v = (p: P) => new THREE.Vector3(...p);

/** A 26 m reference skeleton. Head is +Z, tail −Z; spine is near local y=0. */
export function buildBlueWhale(): THREE.Group {
  const group = new THREE.Group();
  group.name = "beaty-blue-whale-skeleton";
  const batches = new Map<Part, THREE.BufferGeometry[]>();
  function add(part: Part, geometry: THREE.BufferGeometry) {
    // Shared non-indexed format allows tubes, convex plates and joint surfaces
    // to be merged without creating a separate draw call for each bone.
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    if (g !== geometry) geometry.dispose();
    g.deleteAttribute("uv");
    const points = g.getAttribute("position");
    const colors = new Float32Array(points.count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < points.count; i++) {
      const grain = Math.sin(points.getX(i) * 11.7 + points.getY(i) * 9.3 + points.getZ(i) * 16.9);
      color.setRGB(1 - grain * 0.015, 1 - grain * 0.02, 1 - grain * 0.025);
      color.toArray(colors, i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    batches.set(part, [...(batches.get(part) || []), g]);
  }
  function ellipsoid(part: Part, p: P, radii: P, rotation?: THREE.Quaternion) {
    const g = new THREE.SphereGeometry(1, 10, 7);
    g.scale(...radii);
    if (rotation) g.applyQuaternion(rotation);
    g.translate(...p);
    add(part, g);
  }
  function beam(part: Part, a: P, b: P, r1: number, r2 = r1) {
    const start = v(a), end = v(b), delta = end.clone().sub(start);
    const g = new THREE.CylinderGeometry(r2, r1, delta.length(), 9, 1);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()));
    g.translate(...start.add(end).multiplyScalar(0.5).toArray());
    add(part, g);
  }
  function curved(part: Part, points: P[], radius: number | ((t: number) => number), steps = 20, radial = 8) {
    const curve = new THREE.CatmullRomCurve3(points.map(v));
    const geometry = new THREE.TubeGeometry(curve, steps, 1, radial, false);
    const position = geometry.getAttribute("position");
    for (let ring = 0; ring <= steps; ring++) {
      const t = ring / steps, centre = curve.getPointAt(t);
      const r = typeof radius === "number" ? radius : radius(t);
      for (let side = 0; side <= radial; side++) {
        const i = ring * (radial + 1) + side;
        position.setXYZ(i,
          centre.x + (position.getX(i) - centre.x) * r,
          centre.y + (position.getY(i) - centre.y) * r,
          centre.z + (position.getZ(i) - centre.z) * r,
        );
      }
    }
    geometry.computeVertexNormals();
    add(part, geometry);
  }
  function plate(part: Part, points: P[]) {
    add(part, new ConvexGeometry(points.map(v)));
  }
  function spine(z: number): P {
    const tail = Math.max(0, Math.min(1, (-z - 5) / 8));
    return [
      0.09 * Math.sin(z * 0.37) - 0.45 * tail * tail,
      0.1 * Math.sin(z * 0.22) - 0.78 * Math.exp(-(((z + 10.3) / 2) ** 2)) + 0.54 * Math.exp(-(((z + 13) / 0.8) ** 2)),
      z,
    ];
  }

  // Close cervical discs lead into separated thoracic/lumbar centra and a
  // progressively smaller, gently curling tail. Exposed dorsal processes and
  // neural arches are crucial to the recognizable suspended-skeleton profile.
  const stations = [
    ...Array.from({ length: 7 }, (_, i) => ({ z: 5.08 - i * 0.12, spacing: 0.12, radius: 0.25, section: "neck" })),
    ...Array.from({ length: 15 }, (_, i) => ({ z: 4.15 - i * 0.55, spacing: 0.55, radius: 0.33 + 0.08 * Math.sin(i / 14 * Math.PI), section: "thorax" })),
    ...Array.from({ length: 15 }, (_, i) => ({ z: -3.95 - i * 0.3, spacing: 0.3, radius: 0.4 - i * 0.009, section: "lumbar" })),
    ...Array.from({ length: 24 }, (_, i) => ({ z: -8.38 - i * 0.2, spacing: 0.2, radius: 0.265 - i * 0.0091, section: "tail" })),
  ];
  stations.forEach(({ z, spacing, radius, section }, index) => {
    const centre = spine(z);
    const direction = v(spine(z + 0.02)).sub(v(spine(z - 0.02))).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
    const world = (p: P): P => v(p).applyQuaternion(q).add(v(centre)).toArray() as P;
    const centrum = new THREE.CylinderGeometry(radius * 0.92, radius, spacing * 0.69, 12, 1);
    centrum.rotateX(Math.PI / 2);
    centrum.applyQuaternion(q);
    centrum.translate(...centre);
    add("vertebrae", centrum);
    ellipsoid("joints", world([0, 0, -spacing * 0.44]), [radius * 0.87, radius * 0.87, spacing * 0.09], q);

    if (section === "neck") {
      curved("vertebrae", [world([-0.22, 0.05, 0]), world([-0.2, 0.35, 0]), world([0, 0.43, 0]), world([0.2, 0.35, 0]), world([0.22, 0.05, 0])], 0.06, 8, 6);
      return;
    }
    const taper = section === "tail" ? radius / 0.27 : 1;
    const top = section === "thorax" ? 1.08 : section === "lumbar" ? 0.88 : taper * 0.78;
    curved("vertebrae", [world([-radius * 0.64, 0.12, 0]), world([-radius * 0.6, radius + 0.22 * taper, 0]), world([0, radius + 0.31 * taper, 0]), world([radius * 0.6, radius + 0.22 * taper, 0]), world([radius * 0.64, 0.12, 0])], 0.068 * taper, 10, 6);
    plate("vertebrae", [
      world([-0.08 * taper, radius + 0.2 * taper, spacing * 0.19]),
      world([0.08 * taper, radius + 0.2 * taper, spacing * 0.19]),
      world([-0.06 * taper, top, -spacing * 0.21]),
      world([0.06 * taper, top, -spacing * 0.21]),
      world([-0.065 * taper, top * 0.95, -spacing * 0.53]),
      world([0.065 * taper, top * 0.95, -spacing * 0.53]),
      world([-0.09 * taper, radius + 0.14 * taper, -spacing * 0.25]),
      world([0.09 * taper, radius + 0.14 * taper, -spacing * 0.25]),
    ]);
    const reach = (section === "lumbar" ? 0.95 : 0.72) * taper;
    for (const sign of [-1, 1]) {
      curved("vertebrae", [world([sign * radius * 0.75, 0, 0]), world([sign * reach * 0.67, -0.05, -spacing * 0.12]), world([sign * reach, -0.12 * taper, -spacing * 0.28])], (t) => (0.105 - 0.055 * t) * taper, 7, 6);
    }
    if (section === "tail" && index < stations.length - 5) {
      curved("vertebrae", [world([-radius * 0.55, -radius * 0.6, 0]), world([-radius * 0.4, -radius - 0.15 * taper, -0.04]), world([0, -radius - 0.45 * taper, -0.07]), world([radius * 0.4, -radius - 0.15 * taper, -0.04]), world([radius * 0.55, -radius * 0.6, 0])], 0.048 * taper, 9, 6);
    }
  });

  // Baleen-whale ribs are separate curved bones, not continuous rings. Their
  // ventral ends remain open around the short anterior sternum.
  for (let i = 0; i < 15; i++) {
    const t = i / 14, z = 4.15 - i * 0.55, c = spine(z);
    const width = 1.08 + 1.04 * Math.sin(Math.PI * (0.08 + 0.86 * t));
    const drop = 1.95 + 0.97 * Math.sin(Math.PI * t);
    for (const sign of [-1, 1]) {
      const points: P[] = [
        [c[0] + sign * 0.42, c[1] - 0.08, z],
        [c[0] + sign * 0.85, c[1] - 0.43, z - 0.06],
        [c[0] + sign * width, c[1] - drop * 0.47, z - 0.26],
        [c[0] + sign * width * 0.89, c[1] - drop * 0.84, z - 0.51],
        [c[0] + sign * width * 0.36, c[1] - drop, z - 0.72],
      ];
      curved("ribs", points, (u) => 0.105 - 0.035 * u + 0.02 * Math.sin(u * Math.PI), 24, 9);
      ellipsoid("joints", points[0], [0.14, 0.12, 0.13]);
      ellipsoid("ribs", points[points.length - 1], [0.083, 0.1, 0.09]);
    }
  }
  plate("ribs", [[-0.28, -1.94, 3.66], [0.28, -1.94, 3.66], [-0.18, -2.08, 2.8], [0.18, -2.08, 2.8], [-0.18, -2.14, 3.52], [0.18, -2.14, 3.52]]);

  // Broad posterior cranial bones and paired long, shallow rostral plates.
  // The skull remains open underneath; there is no filled-in whale body.
  plate("skull", [[0, 0.94, 4.94], [-1.37, 0.09, 5.38], [1.37, 0.09, 5.38], [0, 0.44, 6.82], [0, -0.24, 5.1], [-1.15, -0.25, 5.65], [1.15, -0.25, 5.65]]);
  ellipsoid("skull", [0, 0.12, 5.24], [0.92, 0.6, 0.72]);
  const sections = [
    { z: 5.68, width: 1.3, y: 0.19, depth: 0.24 },
    { z: 6.9, width: 1.75, y: 0.4, depth: 0.16 },
    { z: 8.8, width: 1.23, y: 0.55, depth: 0.115 },
    { z: 11.1, width: 0.63, y: 0.58, depth: 0.075 },
    { z: 13.03, width: 0.045, y: 0.44, depth: 0.025 },
  ];
  for (const sign of [-1, 1]) {
    for (let i = 1; i < sections.length; i++) {
      const a = sections[i - 1], b = sections[i];
      plate("skull", [
        [sign * 0.02, a.y + 0.11, a.z], [sign * a.width, a.y - 0.06, a.z],
        [sign * 0.02, b.y + 0.11, b.z], [sign * b.width, b.y - 0.06, b.z],
        [sign * 0.02, a.y - a.depth, a.z], [sign * a.width, a.y - a.depth - 0.06, a.z],
        [sign * 0.02, b.y - b.depth, b.z], [sign * b.width, b.y - b.depth - 0.06, b.z],
      ]);
    }
    curved("skull", [[sign * 0.17, 0.8, 5.35], [sign * 0.26, 0.72, 6.3], [sign * 0.16, 0.75, 7.5], [sign * 0.035, 0.58, 11.8]], (t) => 0.12 * (1 - t) + 0.025, 26, 8);
    // Orbital/zygomatic arches frame empty sockets beside the skull.
    curved("skull", [[sign * 0.95, 0.15, 5.15], [sign * 1.65, -0.1, 5.1], [sign * 1.88, -0.65, 5.7], [sign * 1.55, -0.92, 6.1], [sign * 1.05, -0.4, 6.3]], (t) => 0.15 + 0.035 * Math.sin(t * Math.PI), 22, 9);
    curved("skull", [[sign * 0.5, -0.33, 5.24], [sign * 0.9, -0.66, 5.6], [sign * 0.68, -0.82, 6.2]], 0.14, 14, 8);
    ellipsoid("joints", [sign * 1.61, -0.64, 5.39], [0.29, 0.3, 0.32]);
    // Two long bowed mandibles, held below the rostrum in a feeding gape.
    curved("mandibles", [[sign * 1.65, -0.7, 5.38], [sign * 2.3, -1.14, 6.68], [sign * 2.54, -1.78, 8.45], [sign * 2.12, -2.4, 10.5], [sign * 1.02, -2.92, 12.16], [sign * 0.09, -3.04, 12.78]], (t) => 0.245 - 0.13 * t + 0.03 * Math.sin(t * Math.PI), 48, 12);
    ellipsoid("mandibles", [sign * 0.1, -3.04, 12.77], [0.13, 0.13, 0.18]);
  }

  for (const sign of [-1, 1]) {
    const p = (x: number, y: number, z: number): P => [sign * x, y, z];
    // Thin fan-shaped scapula with a raised ridge, not a skin-covered flipper.
    plate("flippers", [p(1.11, 0.18, 4.3), p(2.27, -0.25, 4.32), p(2.04, -1.23, 3.62), p(1.58, -1.32, 3.9), p(1.06, 0.02, 4.36), p(2.16, -0.32, 4.36)]);
    curved("flippers", [p(1.22, 0.04, 4.32), p(1.74, -0.63, 4.18), p(1.73, -1.26, 3.87)], 0.105, 15, 8);
    ellipsoid("joints", p(1.77, -1.31, 3.85), [0.27, 0.26, 0.28]);
    beam("flippers", p(1.8, -1.35, 3.83), p(2.24, -1.88, 3.4), 0.22, 0.17);
    ellipsoid("flippers", p(2.24, -1.88, 3.4), [0.23, 0.2, 0.22]);
    beam("flippers", p(2.17, -1.91, 3.34), p(2.75, -2.35, 2.57), 0.13, 0.095);
    curved("flippers", [p(2.34, -1.81, 3.45), p(2.72, -2.08, 3.1), p(2.96, -2.3, 2.63)], (t) => 0.15 - 0.05 * t, 14, 8);
    for (let row = 0; row < 2; row++) for (let bone = 0; bone < 3; bone++) {
      ellipsoid("flippers", p(2.68 + bone * 0.16 + row * 0.07, -2.35 - row * 0.09, 2.56 - row * 0.16), [0.11, 0.095, 0.12]);
    }
    for (let digit = 0; digit < 4; digit++) {
      // The public source notes left-flipper damage; distal lengths here are
      // interpreted, rather than an assertion of the preserved specimen's bones.
      const count = sign < 0 ? [3, 5, 5, 3][digit] : [4, 6, 6, 4][digit];
      const direction = new THREE.Vector3(sign * (0.22 + digit * 0.12), -0.2 - digit * 0.025, -1).normalize();
      let a = v(p(2.69 + digit * 0.17, -2.48, 2.24));
      for (let phalanx = 0; phalanx < count; phalanx++) {
        const length = (0.4 - phalanx * 0.035) * (digit === 0 || digit === 3 ? 0.88 : 1);
        const b = a.clone().addScaledVector(direction, length);
        const r = 0.085 - phalanx * 0.009;
        beam("flippers", a.toArray() as P, b.toArray() as P, r, r * 0.82);
        ellipsoid("joints", a.toArray() as P, [r * 1.2, r * 1.12, r * 1.2]);
        a = b.addScaledVector(direction, 0.035);
      }
      ellipsoid("flippers", a.toArray() as P, [0.06, 0.05, 0.08]);
    }
  }

  const bone = new THREE.MeshStandardMaterial({
    name: "whale-original-warm-bone", color: 0xe8ddbd,
    roughness: 0.84, metalness: 0, vertexColors: true,
  });
  const joint = new THREE.MeshStandardMaterial({
    name: "whale-original-joint-shading", color: 0xc8b99d,
    roughness: 0.94, metalness: 0, vertexColors: true,
  });
  for (const [part, geometries] of batches) {
    const geometry = mergeGeometries(geometries);
    geometries.forEach((g) => g.dispose());
    if (!geometry) continue;
    const mesh = new THREE.Mesh(geometry, part === "joints" ? joint : bone);
    mesh.name = `whale-${part}`;
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
  }
  // Match the documented overall specimen length while keeping all dimensions
  // internally consistent and the model's head/tail centred on the caller's axis.
  const bounds = new THREE.Box3().setFromObject(group);
  const centreZ = (bounds.min.z + bounds.max.z) / 2;
  const zScale = 26 / (bounds.max.z - bounds.min.z);
  group.children.forEach((object) => {
    const mesh = object as THREE.Mesh;
    mesh.geometry.translate(0, 0, -centreZ);
    mesh.geometry.scale(1, 1, zScale);
  });
  group.userData.reconstruction = "Original reference-based skeleton; not an anatomical scan.";
  group.userData.lengthMetres = 26;
  return group;
}
