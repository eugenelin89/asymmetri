// SPDX-License-Identifier: MIT — original procedural artwork; façades and interiors are illustrative.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Building, City, Interior, Place, Point, Polygon } from "./types";
import type { Actor } from "./population";
const palette = [
  0xe8d8bc, 0xd6baa0, 0xb6c9c4, 0xd3b0a5, 0xb2c7d4, 0xc7c0a2, 0xe6d0b5,
];
export function shapeOf(p: Polygon) {
  const s = new THREE.Shape(p[0].map(([x, z]) => new THREE.Vector2(x, -z)));
  s.holes = p
    .slice(1)
    .map((r) => new THREE.Path(r.map(([x, z]) => new THREE.Vector2(x, -z))));
  return s;
}
export function resources() {
  const mats = new Map<string, THREE.MeshStandardMaterial>(),
    geometries = new Set<THREE.BufferGeometry>(),
    textures = new Set<THREE.Texture>();
  const material = (color: number, emissive = false) => {
    const key = color + ":" + emissive;
    if (!mats.has(key))
      mats.set(
        key,
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.85,
          emissive: emissive ? color : 0,
          emissiveIntensity: 0.22,
        }),
      );
    return mats.get(key)!;
  };
  const geometry = <T extends THREE.BufferGeometry>(g: T) => {
    geometries.add(g);
    return g;
  };
  const cube = geometry(new THREE.BoxGeometry(1, 1, 1));
  function box(
    group: THREE.Group | THREE.Scene,
    color: number,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
  ) {
    const m = new THREE.Mesh(cube, material(color));
    m.position.set(x, y, z);
    m.scale.set(w, h, d);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  }
  function flat(
    group: THREE.Group | THREE.Scene,
    polys: Polygon[],
    color: number,
    y: number,
  ) {
    if (!polys.length) return;
    const g = geometry(new THREE.ShapeGeometry(polys.map(shapeOf)));
    g.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(g, material(color));
    m.position.y = y;
    m.receiveShadow = true;
    group.add(m);
    return m;
  }
  function label(
    group: THREE.Group | THREE.Scene,
    text: string,
    p: Point,
    y = 6,
    scale = 18,
    color = "#fff6dc",
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 120;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "#163d3a";
    c.fillRect(0, 0, 768, 120);
    c.strokeStyle = "#f0b267";
    c.lineWidth = 5;
    c.strokeRect(3, 3, 762, 114);
    c.fillStyle = color;
    c.font = "600 36px system-ui, sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, 384, 60, 730);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.add(texture);
    const m = new THREE.SpriteMaterial({ map: texture, depthTest: true });
    const sprite = new THREE.Sprite(m);
    sprite.position.set(p[0], y, p[1]);
    sprite.scale.set(scale, scale / 6.4, 1);
    sprite.userData.label = true;
    group.add(sprite);
    return sprite;
  }
  function dispose() {
    geometries.forEach((g) => g.dispose());
    mats.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
  }
  return {
    material,
    geometry,
    box,
    flat,
    label,
    dispose,
    releaseTexture(texture: THREE.Texture) {
      texture.dispose();
      textures.delete(texture);
    },
  };
}
export type Resources = ReturnType<typeof resources>;
function strip(a: Point, b: Point, ya: number, yb: number, width: number) {
  const dx = b[0] - a[0],
    dz = b[1] - a[1],
    l = Math.hypot(dx, dz) || 1,
    nx = ((-dz / l) * width) / 2,
    nz = ((dx / l) * width) / 2;
  const g = new THREE.BufferGeometry();
  g.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [
        a[0] + nx,
        ya,
        a[1] + nz,
        a[0] - nx,
        ya,
        a[1] - nz,
        b[0] + nx,
        yb,
        b[1] + nz,
        b[0] - nx,
        yb,
        b[1] - nz,
      ],
      3,
    ),
  );
  g.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 1, 1], 2),
  );
  g.setIndex([0, 2, 1, 1, 2, 3]);
  g.computeVertexNormals();
  return g;
}
export function buildOverview(city: City, r: Resources) {
  const group = new THREE.Group();
  r.flat(
    group,
    [
      [
        [
          [city.bounds[0] - 2000, city.bounds[1] - 2000],
          [city.bounds[2] + 2000, city.bounds[1] - 2000],
          [city.bounds[2] + 2000, city.bounds[3] + 2000],
          [city.bounds[0] - 2000, city.bounds[3] + 2000],
        ],
      ],
    ],
    0x75b8c0,
    -0.25,
  );
  r.flat(group, city.land, 0x91b18a, -0.1);
  r.flat(group, city.water, 0x75b8c0, 0.0);
  r.flat(
    group,
    city.parks.filter((p) => p.kind !== "farmland").map((p) => p.shape),
    0x71965e,
    0.02,
  );
  r.flat(
    group,
    city.parks.filter((p) => p.kind === "farmland").map((p) => p.shape),
    0xb4ba76,
    0.025,
  );
  r.flat(
    group,
    city.lots.filter((l) => !l.airfield).map((l) => l.shape),
    0xb8b9ad,
    0.04,
  );
  r.flat(
    group,
    city.lots.filter((l) => l.airfield).map((l) => l.shape),
    0x9aaba7,
    0.045,
  );
  r.flat(group, [city.airportGate.shape], 0x8b9590, 0.05);
  const batches = new Map<number, THREE.BufferGeometry[]>();
  const add = (color: number, g: THREE.BufferGeometry) => {
    if (!batches.has(color)) batches.set(color, []);
    batches.get(color)!.push(g);
  };
  for (const road of city.roads) {
    for (let i = 1; i < road.points.length; i++) {
      const a = road.points[i - 1],
        b = road.points[i],
        ya = road.heights[i - 1],
        yb = road.heights[i],
        w = road.width;
      if (road.kind === "road")
        add(0xc9c9b8, strip(a, b, ya + 0.055, yb + 0.055, w + 4));
      add(
        road.kind === "path"
          ? 0xc4b593
          : road.kind === "airfield"
            ? 0x667575
            : 0x4f6261,
        strip(a, b, ya + 0.075, yb + 0.075, w),
      );
      if (road.kind !== "path")
        add(
          road.kind === "airfield" ? 0xf5f3dc : 0xe7cf7a,
          strip(a, b, ya + 0.09, yb + 0.09, 0.17),
        );
      // Broad visible junction disks agree with capsule collision widths.
      if (road.kind === "road") {
        const g = new THREE.CircleGeometry(w / 2, 10);
        g.rotateX(-Math.PI / 2);
        g.translate(b[0], yb + 0.076, b[1]);
        add(0x4f6261, g);
      }
      if (road.bridge && i % 3 === 0) {
        r.box(group, 0x9fa99c, b[0], yb / 2, b[1], 1.3, Math.max(0.1, yb), 1.3);
      }
    }
  }
  for (const [color, gs] of batches) {
    const merged = mergeGeometries(gs);
    gs.forEach((g) => g.dispose());
    if (merged) {
      const mesh = new THREE.Mesh(r.geometry(merged), r.material(color));
      mesh.receiveShadow = true;
      group.add(mesh);
    }
  }
  const geometry = r.geometry(new THREE.BoxGeometry(1, 1, 1)),
    far = new THREE.InstancedMesh(
      geometry,
      r.material(0xc4c5b8),
      city.buildingIndex.length,
    ),
    dummy = new THREE.Object3D();
  city.buildingIndex.forEach((b, i) => {
    const [x, z, X, Z] = b.bounds;
    dummy.position.set((x + X) / 2, b.height / 2, (z + Z) / 2);
    dummy.scale.set(Math.max(2, X - x), b.height, Math.max(2, Z - z));
    dummy.updateMatrix();
    far.setMatrixAt(i, dummy.matrix);
    far.setColorAt(i, new THREE.Color(palette[i % palette.length]));
  });
  far.instanceMatrix.needsUpdate = true;
  group.add(far);
  const labels = new THREE.Group();
  for (const place of city.places) {
    const sign = r.label(
      labels,
      place.name,
      place.entrance,
      place.interior ? 8 : 5,
      12,
    );
    sign.name = place.id;
    if (place.interior)
      for (const entry of place.entrances ?? [{ point: place.entrance }]) {
        const [x, z] = entry.point;
        r.box(group, 0xe6bd72, x, 2.8, z, 4, 0.25, 2);
        r.box(group, 0x357b71, x - 1.8, 1.4, z, 0.15, 2.8, 0.15);
        r.box(group, 0x357b71, x + 1.8, 1.4, z, 0.15, 2.8, 0.15);
        r.flat(
          group,
          [
            [
              [
                [x - 2, z - 2],
                [x + 2, z - 2],
                [x + 2, z + 2],
                [x - 2, z + 2],
              ],
            ],
          ],
          0xe6bd72,
          0.12,
        );
      }
  }
  group.add(labels);
  const edge = new THREE.LineLoop(
    r.geometry(
      new THREE.BufferGeometry().setFromPoints(
        [
          [city.bounds[0], city.bounds[1]],
          [city.bounds[2], city.bounds[1]],
          [city.bounds[2], city.bounds[3]],
          [city.bounds[0], city.bounds[3]],
        ].map((p) => new THREE.Vector3(p[0], 0.3, p[1])),
      ),
    ),
    new THREE.LineBasicMaterial({ color: 0xe6bc7b }),
  );
  group.add(edge);
  // Runway numbers and threshold bands are illustrative markings over source alignments.
  city.roads
    .filter((rd) => rd.class === "runway")
    .forEach((rd) => {
      const a = rd.points[0],
        b = rd.points[rd.points.length - 1],
        angle = Math.atan2(b[0] - a[0], b[1] - a[1]),
        len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      r.label(
        group,
        "OPEN AIRFIELD · " + rd.name,
        [a[0] + (b[0] - a[0]) * 0.08, a[1] + (b[1] - a[1]) * 0.08],
        4,
        65,
      );
      for (let d = 20; d < len; d += 130) {
        const m = r.box(
          group,
          0xf1eee0,
          a[0] + Math.sin(angle) * d,
          0.12,
          a[1] + Math.cos(angle) * d,
          1,
          0.025,
          25,
        );
        m.rotation.y = angle;
      }
    });
  r.label(group, "FICTIONAL AIRFIELD CONNECTION", city.airportGate.road, 8, 40);
  return { group, far, labels, dispose: () => edge.material.dispose() };
}
export function buildTile(buildings: Building[], r: Resources) {
  const group = new THREE.Group(),
    batches = new Map<number, THREE.BufferGeometry[]>();
  const add = (color: number, g: THREE.BufferGeometry) => {
    if (!batches.has(color)) batches.set(color, []);
    batches.get(color)!.push(g);
  };
  buildings.forEach((b, i) => {
    const g = new THREE.ExtrudeGeometry(shapeOf(b.shape), {
      depth: b.height,
      bevelEnabled: false,
    });
    g.rotateX(-Math.PI / 2);
    add(palette[i % palette.length], g);
    const ring = b.shape[0];
    for (let j = 1; j < ring.length; j++) {
      const a = ring[j - 1],
        end = ring[j],
        dx = end[0] - a[0],
        dz = end[1] - a[1],
        l = Math.hypot(dx, dz);
      if (l < 5 || l > 300) continue;
      const count = Math.min(14, Math.floor(l / 4.5)),
        floors = Math.min(12, Math.floor(b.height / 3.2));
      for (let f = 0; f < floors; f++)
        for (let k = 1; k <= count; k++) {
          const window = new THREE.BoxGeometry(
            Math.min(2.1, (l / (count + 1)) * 0.55),
            1.25,
            0.12,
          );
          window.rotateY(-Math.atan2(dz, dx));
          window.translate(
            a[0] + (dx * k) / (count + 1),
            2 + f * 3.2,
            a[1] + (dz * k) / (count + 1),
          );
          add(f % 3 === 0 ? 0x789c9b : 0x547f86, window);
        }
    }
  });
  for (const [color, gs] of batches) {
    const merged = mergeGeometries(gs);
    gs.forEach((g) => g.dispose());
    if (merged) {
      const mesh = new THREE.Mesh(merged, r.material(color));
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
  }
  group.userData.dispose = () =>
    group.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
  return group;
}
export function buildInterior(place: Place, l: Interior, r: Resources) {
  const group = new THREE.Group(),
    w = l.width,
    d = l.depth;
  r.box(group, 0xe6dec8, 0, -0.15, 0, w, 0.3, d);
  r.box(group, 0xc3cfbf, 0, 0.01, 0, 12, 0.04, d - 2);
  r.box(group, 0xe8d7be, -w / 2, 2.5, 0, 0.4, 5, d);
  r.box(group, 0xe8d7be, w / 2, 2.5, 0, 0.4, 5, d);
  r.box(group, 0xe8d7be, 0, 2.5, -d / 2, w, 5, 0.4);
  r.box(group, 0xe8d7be, 0, 2.5, d / 2, w, 5, 0.4);
  l.obstacles.forEach(([a, b, c, e], i) => {
    r.box(
      group,
      i % 2 ? 0x9ead9b : 0xbe9d85,
      (a + c) / 2,
      1.5,
      (b + e) / 2,
      c - a,
      3,
      e - b,
    );
    r.box(
      group,
      0x347d78,
      (a + c) / 2,
      3.1,
      (b + e) / 2,
      c - a + 0.3,
      0.2,
      e - b + 0.3,
    );
  });
  for (const shop of l.shops) {
    const [x, z] = shop.point;
    r.box(group, 0xc79262, x, 1, z - 1.8, 10, 2, 1.7);
    r.box(group, 0xf1d9a4, x, 2.1, z - 1.8, 10.3, 0.15, 2);
    r.label(group, shop.name, [x, z - 3], 4, 17);
    for (let i = 0; i < 5; i++)
      r.box(
        group,
        [0xbc5f4e, 0xdfad54, 0x5a887b][i % 3],
        x - 4 + i * 2,
        2.4,
        z - 1.8,
        0.6,
        0.6,
        0.7,
      );
  }
  l.zones.forEach((z) =>
    r.label(group, z.name, z.point, 5.8, Math.min(28, w * 0.65)),
  );
  r.label(group, "EXIT · 出口", l.exit, 3, 12);
  if (l.alternateExit)
    r.label(group, "EAST EXIT · 東出口", l.alternateExit, 3, 12);
  for (let z = -d * 0.35; z < d * 0.4; z += 15)
    for (const x of [-w * 0.39, w * 0.39]) {
      r.box(group, 0x597a70, x, 0.6, z, 4, 1, 1.3);
      r.box(group, 0xd5b784, x, 1.2, z + 0.6, 4, 0.8, 0.15);
      r.box(group, 0xaac1b4, x, 3.9, z - 4, 0.4, 7.8, 0.4);
    }
  if (place.interior === "terminal") {
    for (const x of [-37, 37]) {
      r.box(group, 0x344e55, x, 0.6, 17, 28, 1.2, 5);
      r.box(group, 0x9eafa9, x, 1.25, 17, 25, 0.15, 3);
      for (let i = 0; i < 6; i++)
        r.box(group, 0x6c665b, x - 10 + i * 4, 1.8, 17, 1, 0.9, 0.7);
    }
    for (let x = -50; x <= 50; x += 12)
      r.box(group, 0x5a9a9e, x, 3, -d / 2 + 0.3, 10, 4, 0.2);
  }
  if (place.interior === "mall") {
    r.box(group, 0x50918a, 0, 0.6, 10, 7, 1.2, 7);
    r.box(group, 0x8ebbc0, 0, 1.24, 10, 6, 0.1, 6);
    for (let x = -30; x <= 30; x += 15) {
      r.box(group, 0xdda86c, x, 0.8, -28, 2, 1.6, 2);
    }
  }
  return group;
}
export function carModel(
  r: Resources,
  color = 0xe8b252,
  variant: "compact" | "sedan" | "van" = "compact",
) {
  const group = new THREE.Group();
  r.box(group, color, 0, 0.7, 0, 1.85, 0.75, 3.9);
  r.box(group, 0x537b85, 0, 1.35, -0.2, 1.55, 0.65, 1.9);
  r.box(
    group,
    color,
    0,
    variant === "sedan" ? 1.58 : 1.72,
    -0.2,
    1.6,
    0.12,
    variant === "sedan" ? 1.7 : 2,
  );
  if (variant === "van") {
    r.box(group, color, 0, 1.55, -0.65, 1.78, 1.5, 2.5);
    r.box(group, 0x587f86, 0, 1.65, 0.66, 1.5, 0.65, 0.12);
  }
  r.box(group, 0xf6e4ac, 0, 0.85, 1.98, 1.4, 0.22, 0.04);
  for (const x of [-0.99, 0.99])
    for (const z of [-1.2, 1.2]) {
      const tire = new THREE.Mesh(
        r.geometry(new THREE.CylinderGeometry(0.36, 0.36, 0.22, 10)),
        r.material(0x293a3a),
      );
      tire.rotation.z = Math.PI / 2;
      tire.position.set(x, 0.36, z);
      group.add(tire);
    }
  return group;
}
export function personModel(r: Resources) {
  const group = new THREE.Group();
  r.box(group, 0xe0964f, 0, 1.1, 0, 0.7, 0.8, 0.4);
  r.box(group, 0xd5a582, 0, 1.78, 0, 0.42, 0.46, 0.4);
  r.box(group, 0x344647, 0, 2.02, -0.04, 0.45, 0.12, 0.4);
  r.box(group, 0x2c5960, 0, 1.1, -0.35, 0.65, 0.7, 0.35);
  for (const x of [-0.2, 0.2])
    r.box(group, 0x294849, x, 0.4, 0, 0.22, 0.8, 0.25);
  return group;
}
export function actorMeshes(r: Resources, max = 240) {
  const group = new THREE.Group(),
    parts = [
      {
        g: r.geometry(new THREE.BoxGeometry(0.65, 0.8, 0.4)),
        y: 1.15,
        color: 0xffffff,
      },
      {
        g: r.geometry(new THREE.SphereGeometry(0.24, 7, 5)),
        y: 1.8,
        color: 0xffffff,
      },
      {
        g: r.geometry(new THREE.BoxGeometry(0.16, 0.7, 0.21)),
        y: 0.4,
        color: 0x38545c,
        x: -0.18,
      },
      {
        g: r.geometry(new THREE.BoxGeometry(0.16, 0.7, 0.21)),
        y: 0.4,
        color: 0x38545c,
        x: 0.18,
      },
      {
        g: r.geometry(new THREE.BoxGeometry(0.5, 0.6, 0.25)),
        y: 1.1,
        color: 0x9d8065,
        z: -0.33,
      },
      {
        g: r.geometry(new THREE.BoxGeometry(0.5, 0.18, 0.44)),
        y: 2,
        color: 0xffffff,
      },
      {
        g: r.geometry(new THREE.BoxGeometry(0.17, 0.7, 0.2)),
        y: 1.12,
        x: -0.44,
        color: 0xffffff,
      },
      {
        g: r.geometry(new THREE.BoxGeometry(0.17, 0.7, 0.2)),
        y: 1.12,
        x: 0.44,
        color: 0xffffff,
      },
    ];
  const meshes = parts.map((p) => {
    const m = new THREE.InstancedMesh(p.g, r.material(p.color), max);
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(m);
    return m;
  });
  const dummy = new THREE.Object3D();
  function update(actors: Actor[], time: number, reduced: boolean) {
    parts.forEach((p, j) => {
      const m = meshes[j];
      m.count = Math.min(max, actors.length);
      actors.slice(0, max).forEach((a, i) => {
        const bob = reduced ? 0 : Math.sin(time * 7 + a.id) * 0.025 * a.speed;
        const seated = a.activity === "sitting" || a.activity === "eating",
          swing = reduced
            ? 0
            : Math.sin(time * 6 + a.phase) * Math.min(1, a.speed) * 0.35;
        const localX = p.x ?? 0,
          localZ = p.z ?? 0;
        dummy.position.set(
          a.x +
            (localX * Math.cos(a.yaw) + localZ * Math.sin(a.yaw)) * a.stature,
          a.y + (p.y + bob - (seated && j < 2 ? 0.35 : 0)) * a.stature,
          a.z +
            (-localX * Math.sin(a.yaw) + localZ * Math.cos(a.yaw)) * a.stature,
        );
        dummy.rotation.set(
          j === 2 || j === 3
            ? seated
              ? Math.PI / 2
              : swing * (j === 2 ? 1 : -1)
            : j > 5
              ? swing * (j === 6 ? -1 : 1)
              : 0,
          a.yaw,
          0,
        );
        const bag = j === 4;
        if (bag && a.activity === "luggage") {
          dummy.position.y = 0.45;
          dummy.position.x += 0.6;
        }
        dummy.scale.setScalar(
          bag && !["shopping", "luggage", "working"].includes(a.activity)
            ? 0
            : a.stature,
        );
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        if (j === 0 || j > 5) m.setColorAt(i, new THREE.Color(a.color));
        else if (j === 1) m.setColorAt(i, new THREE.Color(a.skin));
        else if (j === 5)
          m.setColorAt(
            i,
            new THREE.Color(a.id % 7 === 0 ? 0xa6a99c : 0x3a3835),
          );
      });
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
      m.computeBoundingSphere();
    });
  }
  return { group, update };
}
export function aircraft(r: Resources, city: City) {
  const group = new THREE.Group();
  const aprons = city.lots.filter((l) => l.airfield).slice(0, 8);
  for (const [i, l] of aprons.entries()) {
    const p = l.shape[0][0],
      model = new THREE.Group();
    r.box(model, 0xe4e5dc, 0, 3, 0, 4, 4, 30);
    r.box(model, 0xcad7d4, 0, 2.5, 0, 32, 0.5, 6);
    r.box(model, 0xc69857, 0, 6, -12, 0.6, 8, 5);
    r.box(model, 0x5e8e93, 0, 3, 12, 3, 2, 3);
    model.position.set(p[0] + 20, 0, p[1] + 20);
    model.rotation.y = i;
    group.add(model);
  }
  return group;
}
