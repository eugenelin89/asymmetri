// SPDX-License-Identifier: MIT
import * as THREE from "three";
import type { Anchors, Point } from "../ubc/types";
import { christmasWalks, type ChristmasWalk } from "./christmas-walks";

function spruceTier() {
  // Overlapping whorls with a scalloped silhouette; no billboard turns toward the camera.
  const vertices: number[] = [], indices: number[] = [], sides = 32;
  for (const [level, radius] of [[0, .88], [.09, 1], [.42, .64], [1, .02]]) {
    for (let i = 0; i < sides; i++) {
      const angle = i * Math.PI * 2 / sides;
      const tip = i % 2;
      const r = radius * (1 - tip * .13);
      vertices.push(Math.sin(angle) * r, level + tip * .09 * (1 - level), Math.cos(angle) * r);
    }
  }
  for (let ring = 0; ring < 3; ring++) {
    for (let i = 0; i < sides; i++) {
      const a = ring * sides + i, b = ring * sides + (i + 1) % sides;
      indices.push(a, b, a + sides, b, b + sides, a + sides);
    }
  }
  for (let i = 1; i < sides - 1; i++) indices.push(0, i + 1, i);
  const shape = new THREE.BufferGeometry();
  shape.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  shape.setIndex(indices);
  shape.computeVertexNormals();
  return shape;
}

function treeStar() {
  const vertices: number[] = [];
  for (let i = 0; i < 10; i++) {
    const tip = (j: number, z: number) => {
      const angle = j * Math.PI / 5, r = j % 2 ? .43 : 1;
      return [Math.sin(angle) * r, Math.cos(angle) * r, z];
    };
    vertices.push(0, 0, .23, ...tip(i + 1, 0), ...tip(i, 0), 0, 0, -.23, ...tip(i, 0), ...tip(i + 1, 0));
  }
  const shape = new THREE.BufferGeometry();
  shape.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  shape.computeVertexNormals();
  return shape;
}

function arrange(walk: ChristmasWalk, anchors: Anchors, blocked: (p: Point, y: number) => boolean) {
  const group = new THREE.Group();
  // A single transparent ground pass paints soft pools beneath the lamps.
  // The centre is lit and the outer ring is black for additive blending.
  const pool = new THREE.CircleGeometry(1, 16).rotateX(-Math.PI / 2);
  const spillColors = new Float32Array(pool.attributes.position.count * 3);
  spillColors.fill(1, 0, 3);
  pool.setAttribute("color", new THREE.BufferAttribute(spillColors, 3));
  const spill = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const geometries = { pool,
    fir: spruceTier(), stem: new THREE.CylinderGeometry(1, 1, 1, 8),
    ball: new THREE.SphereGeometry(1, 8, 6), bulb: new THREE.OctahedronGeometry(1),
    wreath: new THREE.TorusGeometry(1, .2, 6, 22), star: treeStar(),
    block: new THREE.BoxGeometry(1, 1, 1),
  };
  const paint = new THREE.MeshStandardMaterial({ roughness: .72 });
  const lamp = new THREE.MeshBasicMaterial();
  const colors = {
    pine: 0x17583c, pineTip: 0x33794e, bark: 0x5b3b2f, brass: 0xcb8f3d,
    red: 0xb32639, wine: 0x8a1932, cream: 0xffdc96, frost: 0xc5f3ff, ink: 0x233d38,
  };
  const transforms = new THREE.Object3D();
  type Part = { matrix: THREE.Matrix4; color: number; detail: boolean };
  type Shape = keyof typeof geometries;
  const parts = new Map<Shape, Part[]>();
  function place(shape: Shape, color: number, x: number, y: number, z: number, width: number, height = width, depth = width, yaw = 0, tilt = 0, detail = false) {
    transforms.position.set(x, y, z);
    transforms.rotation.set(0, yaw, tilt, "YXZ");
    transforms.scale.set(width, height, depth);
    transforms.updateMatrix();
    const part = { color, matrix: transforms.matrix.clone(), detail };
    if (!parts.has(shape)) parts.set(shape, []);
    parts.get(shape)!.push(part);
  }
  function beam(p: THREE.Vector3, q: THREE.Vector3, radius: number, color: number) {
    transforms.position.copy(p).lerp(q, .5);
    transforms.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), q.clone().sub(p).normalize());
    transforms.scale.set(radius, p.distanceTo(q), radius);
    transforms.updateMatrix();
    if (!parts.has("stem")) parts.set("stem", []);
    parts.get("stem")!.push({ color, matrix: transforms.matrix.clone(), detail: false });
  }
  function bow(x: number, y: number, z: number, size: number, yaw: number, detail = false) {
    for (const side of [-1, 1]) {
      const offset = side * size;
      place("ball", colors.red, x + offset * .45 * Math.cos(yaw), y + size * .12, z - offset * .45 * Math.sin(yaw), size * .58, size * .3, size * .16, yaw, side * .3, detail);
      place("block", colors.wine, x + offset * .25 * Math.cos(yaw), y - size * .42, z - offset * .25 * Math.sin(yaw), size * .29, size * .9, size * .1, yaw, side * .36, detail);
    }
    place("ball", colors.brass, x, y, z, size * .19, size * .19, size * .19, 0, 0, detail);
  }
  function tree(x: number, z: number, h: number) {
    const r = h * .225;
    place("pool", colors.cream, x, .12, z, r * 2.5, 1, r * 2.5);
    place("stem", colors.bark, x, h * .1, z, r * .24, h * .2, r * .24);
    place("stem", colors.brass, x, h * .09, z, r * .31, h * .033, r * .31);
    for (let tier = 0; tier < 5; tier++) {
      const radius = r * (1 - tier * .163);
      place("fir", tier % 2 ? colors.pineTip : colors.pine, x, h * (.11 + tier * .144), z, radius, h * (.41 - tier * .03), radius, tier * .41);
    }
    // Three continuous turns of gilt ribbon; scattered crimson baubles fall between them.
    let previous: THREE.Vector3 | undefined;
    for (let i = 0; i <= 72; i++) {
      const t = i / 72, angle = t * Math.PI * 6.4;
      const radius = r * (.98 - .85 * t);
      const p = new THREE.Vector3(x + radius * Math.cos(angle), h * (.2 + .62 * t), z + radius * Math.sin(angle));
      if (previous) beam(previous, p, h * .006, colors.brass);
      previous = p;
      if (i % 2 === 0) place("bulb", i % 6 ? colors.cream : colors.frost, p.x, p.y, p.z, h * .015, h * .021, h * .015, 0, 0, i % 4 !== 0);
      if (i % 5 === 0) place("ball", i % 10 ? colors.red : colors.brass, p.x, p.y - h * .04, p.z, h * .033, h * .033, h * .033, 0, 0, i % 10 !== 0);
    }
    place("star", colors.cream, x, h * .995, z, h * .095, h * .095, h * .095, .35);
  }
  function swag(x: number, z: number, y: number, yaw: number, width: number, sag: number) {
    const n = Math.ceil(width * 1.55);
    let previous: THREE.Vector3 | undefined;
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = width * (t - .5);
      const p = new THREE.Vector3(x + Math.cos(yaw) * u, y - sag * 4 * t * (1 - t), z - Math.sin(yaw) * u);
      if (previous) beam(previous, p, .15, i % 2 ? colors.pine : colors.pineTip);
      place("bulb", i % 4 ? colors.cream : colors.frost, p.x + Math.sin(yaw) * .14, p.y - .14, p.z + Math.cos(yaw) * .14, .087, .11, .087, 0, 0, i % 2 === 1);
      if (i % 5 === 0) place("ball", colors.red, p.x, p.y - .28, p.z, .14);
      if (i === 0 || i === n) bow(p.x, p.y, p.z, .66, yaw);
      previous = p;
    }
  }
  function wreath(x: number, y: number, z: number, radius: number, yaw: number) {
    place("wreath", colors.pine, x, y, z, radius, radius, radius, yaw);
    for (let i = 0; i < 16; i++) {
      const angle = i * Math.PI / 8, u = Math.cos(angle) * radius;
      place("bulb", i % 3 ? colors.cream : colors.frost, x + u * Math.cos(yaw) + .18 * Math.sin(yaw), y + Math.sin(angle) * radius, z - u * Math.sin(yaw) + .18 * Math.cos(yaw), .08, .09, .08, 0, 0, i % 2 === 1);
    }
    bow(x, y - radius * .83, z, radius * .61, yaw);
  }
  for (const item of walk.trees) tree(item.x, item.z, item.height);
  // Both path edges are at least 2.2 metres from the walking line. Stop before the doorway.
  let next = 10, travelled = 0, index = 0;
  for (let i = 1; i < walk.path.length - 1; i++) {
    const [x, z] = walk.path[i - 1], [ex, ez] = walk.path[i];
    const dx = ex - x, dz = ez - z, length = Math.hypot(dx, dz);
    while (next <= travelled + length) {
      const t = (next - travelled) / length;
      for (const side of [-1, 1]) {
        const px = x + dx * t - side * dz / length * 2.65;
        const pz = z + dz * t + side * dx / length * 2.65;
        if (blocked([px, pz], 0) || walk.trees.some(item => Math.hypot(px - item.x, pz - item.z) < item.height * .26)) continue;
        // At Low, keep one lantern at each interval, alternating sides down the path.
        const detail = side === (index % 2 ? -1 : 1);
        place("pool", (index + side) % 3 ? colors.cream : colors.frost, px, .12, pz, 2.8, 1, 2.8, 0, 0, detail);
        place("stem", colors.ink, px, 1.04, pz, .105, 2.08, .105, 0, 0, detail);
        place("stem", colors.brass, px, .17, pz, .23, .32, .23, 0, 0, detail);
        place("block", colors.brass, px, 2.14, pz, .46, .11, .46, .78, 0, detail);
        place("bulb", (index + side) % 3 ? colors.cream : colors.frost, px, 2.4, pz, .3, .43, .3, 0, 0, detail);
        place("fir", colors.ink, px, 2.63, pz, .31, .25, .31, 0, 0, detail);
        bow(px, 1.88, pz, .29, Math.atan2(-dz, dx), detail);
      }
      next += 13;
      index++;
    }
    travelled += length;
  }
  const destination = anchors[walk.destination];
  function onFacade(u: number, v: number): Point {
    const a = destination;
    return [a.x + u * Math.cos(a.yaw) + v * Math.sin(a.yaw), a.z - u * Math.sin(a.yaw) + v * Math.cos(a.yaw)];
  }
  function facadeSwag(u: number, v: number, y: number, width: number, sag: number) {
    const [x, z] = onFacade(u, v);
    swag(x, z, y, destination.yaw, width, sag);
  }
  const front = destination.depth / 2;
  for (const side of [-1, 1]) {
    const u = side * destination.width * .25;
    facadeSwag(u, front + .7, 6.1, destination.width * .43, .8);
    const [x, z] = onFacade(u, front + .9);
    wreath(x, 3.3, z, 1.12, destination.yaw);
  }
  if (walk.destination === "green-library") {
    // Scallops follow two actual runs of the sandstone arcade bordering the central Quad.
    for (const [a, b] of [
      [[-36.41, -40.22], [8.82, -27.98]],
      [[71.79, 18.90], [115.32, 30.73]],
    ]) {
      const dx = b[0] - a[0], dz = b[1] - a[1], length = Math.hypot(dx, dz);
      const yaw = Math.atan2(-dz, dx);
      for (let i = 0; i < 5; i++) {
        const t = (i + .5) / 5;
        swag(a[0] + t * dx, a[1] + t * dz + .3, 5.32, yaw, length / 5, .65);
      }
    }
    // The reading room has a 4.2 m storey: flank the stacks below the ceiling.
    for (const side of [-1, 1]) {
      facadeSwag(side * 11, -.2 * destination.depth, 3.55, 11, .42);
      const [x, z] = onFacade(side * 7, -destination.depth / 2 + .42);
      wreath(x, 2.48, z, .88, destination.yaw);
    }
  }
  if (walk.destination === "tinkham-veale") {
    // A canopy of folded stars under the commons mezzanine, above seating and away from the exit.
    for (const side of [-1, 1]) {
      facadeSwag(side * 10, destination.depth * .12, 3.94, 10, .42);
      for (const u of [5, 9, 13]) {
        const [x, z] = onFacade(side * u, destination.depth * .12);
        place("stem", colors.brass, x, 3.52, z, .014, .56, .014);
        place("star", u === 9 ? colors.frost : colors.cream, x, 3.02, z, .29, .29, .29, destination.yaw);
      }
    }
    const library = anchors["kelvin-smith"];
    if (library.entry) {
      const [x, z] = library.entry;
      // Dress the library's mapped outer entry, in front of the longer source wing.
      for (const side of [-1, 1]) {
        const u = side * 4.35;
        const px = x + u * Math.cos(library.yaw), pz = z - u * Math.sin(library.yaw);
        place("stem", colors.ink, px, 2.5, pz, .11, 5, .11);
      }
      swag(x, z, 5, library.yaw, 8.7, .67);
    }
  }
  // AMS Nest balconies frame the tall atrium on the first upper gallery.
  if (walk.destination === "nest") for (const sign of [-1, 1]) facadeSwag(sign * 8.7, front - 6.4, 5.1, 15.8, .73);
  const meshes: { mesh: THREE.InstancedMesh; count: number; lowCount: number }[] = [];
  for (const [shape, list] of parts) {
    list.sort((a, b) => Number(a.detail) - Number(b.detail));
    const material = shape === "pool" ? spill : shape === "bulb" || shape === "star" ? lamp : paint;
    const mesh = new THREE.InstancedMesh(geometries[shape], material, list.length);
    for (const [i, part] of list.entries()) {
      mesh.setMatrixAt(i, part.matrix);
      mesh.setColorAt(i, new THREE.Color(part.color));
    }
    mesh.computeBoundingSphere();
    group.add(mesh);
    meshes.push({ mesh, count: list.length, lowCount: list.filter(part => !part.detail).length });
  }
  return {
    group,
    illuminate(altitude: number, low: boolean, reducedMotion: boolean) {
      // Fade smoothly from late afternoon (+8°) to the end of civil twilight (−6°).
      const dusk = 1 - THREE.MathUtils.smoothstep(altitude, -.105, .14);
      const twinkle = reducedMotion || !dusk ? 0 : 0.065 * Math.sin(performance.now() / 2100);
      lamp.color.setScalar(.67 + dusk * (3 + twinkle));
      spill.opacity = dusk * .22;
      for (const { mesh, count, lowCount } of meshes) {
        mesh.count = low ? lowCount : count;
        if (mesh.material === spill) mesh.visible = dusk > .01;
      }
    },
    dispose() {
      for (const { mesh } of meshes) mesh.dispose();
      Object.values(geometries).forEach(shape => shape.dispose());
      lamp.dispose();
      spill.dispose();
      paint.dispose();
      group.clear();
    },
  };
}

export function createChristmasWalk(campus: keyof typeof christmasWalks, anchors: Anchors, blocked: (p: Point, y: number) => boolean) {
  const group = new THREE.Group();
  let display: ReturnType<typeof arrange> | undefined;
  function dispose() {
    display?.dispose();
    display = undefined;
    group.clear();
  }
  return {
    group,
    update(active: boolean, altitude: number, low: boolean, reducedMotion = false) {
      if (!active) {
        if (display) dispose();
        return;
      }
      if (!display) {
        display = arrange(christmasWalks[campus], anchors, blocked);
        group.add(display.group);
      }
      display.illuminate(altitude, low, reducedMotion);
    },
    dispose,
  };
}
