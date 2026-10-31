import { palmCrownGeometry } from "./palms";
import { segmentDistance } from "./spatial";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { CampusData, Settings, Point, Building } from "./types";
import { subtractGroundOpenings } from "./ground-openings";
export function shape(rings: Point[][]) {
  const s = new THREE.Shape(
    rings[0].map((p) => new THREE.Vector2(p[0], -p[1])),
  );
  for (const ring of rings.slice(1))
    s.holes.push(
      new THREE.Path(ring.map((p) => new THREE.Vector2(p[0], -p[1]))),
    );
  return s;
}
export const random = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
function noiseTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!,
    data = ctx.createImageData(128, 128);
  for (let i = 0; i < 128 * 128; i++) {
    const v = 205 + random(i) * 40;
    data.data.set([v, v, v, 255], i * 4);
  }
  ctx.putImageData(data, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(200, 200);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
export async function buildLandscape(
  data: CampusData,
  excluded: Set<string>,
  groundOpenings: Point[][] = [],
  progress: (message:string)=>void = () => {},
) {
  const group = new THREE.Group(),
    chunks: THREE.Group[] = [],
    buildingMeshes: THREE.Object3D[] = [];
  const ground = new THREE.MeshStandardMaterial({
    color: 0x66784f,
    roughness: 1,
    map: noiseTexture(),
  });
  // Clip only the interpreted below-grade interior footprint. Nearby source
  // paving and lawns retain their measured shapes; no GIS records are edited.
  const cutGround = (geometry: THREE.BufferGeometry) => {
    if (!groundOpenings.length) return geometry;
    const cut = subtractGroundOpenings(geometry, groundOpenings);
    geometry.dispose();
    return cut;
  };
  const baseGeometry = new THREE.PlaneGeometry(28000, 28000);
  baseGeometry.rotateX(-Math.PI / 2);
  baseGeometry.translate(0, -0.065, 0);
  const base = new THREE.Mesh(cutGround(baseGeometry), ground);
  base.receiveShadow = true;
  group.add(base);
  const lawn = new THREE.MeshStandardMaterial({
    color: 0x718957,
    roughness: 0.96,
  });
  const road = new THREE.MeshStandardMaterial({
    color: 0x575a57,
    roughness: 0.92,
  });
  const path = new THREE.MeshStandardMaterial({
    color: 0xbebbb0,
    roughness: 0.86,
  });
  const bed = new THREE.MeshStandardMaterial({ color: 0x6c7050, roughness: 1 });
  const water = new THREE.MeshStandardMaterial({
    color: 0x547c80,
    roughness: 0.3,
    metalness: 0.18,
  });
  const surfaces = new Map<THREE.Material, THREE.BufferGeometry[]>();
  let surfaceCount=0;
  for (const s of data.surfaces) {
    if(++surfaceCount%500===0){progress(`Laying campus paths and gardens · ${Math.round(surfaceCount/data.surfaces.length*100)}%`);await new Promise<void>(resolve=>setTimeout(resolve,0));}
    if (!s.rings[0]?.length) continue;
    const k = s.kind.toLowerCase(),
      m = /road|parking|drive|asphalt/.test(k)
        ? road
        : /lawn|grass|field|turf/.test(k)
          ? lawn
          : /water/.test(k)
            ? water
            : /plant|forest|shrub|bed|wild|garden|farm/.test(k)
              ? bed
              : path;
    const g = new THREE.ShapeGeometry(shape(s.rings));
    g.rotateX(-Math.PI / 2);
    g.translate(0, m === road ? 0.002 : m === path ? 0.012 : 0.006, 0);
    const geometries=surfaces.get(m)||[];geometries.push(cutGround(g));surfaces.set(m,geometries);
  }
  for (const [m, geos] of surfaces) {
    const g = mergeGeometries(geos);
    geos.forEach((g) => g.dispose());
    if (g) {
      const mesh = new THREE.Mesh(g, m);
      mesh.receiveShadow = true;
      group.add(mesh);
    }
  }
  // Centre lines follow sourced roads; dash spacing and lane markings are illustrative.
  const markings: THREE.BufferGeometry[] = [];
  for (const r of data.roads || [])
    for (let i = 1; i < r.points.length; i++) {
      const p = r.points[i - 1],
        q = r.points[i],
        dx = q[0] - p[0],
        dz = q[1] - p[1],
        length = Math.hypot(dx, dz);
      for (let t = 5; t < length - 5; t += 9) {
        const g = new THREE.PlaneGeometry(0.11, Math.min(3, length - t - 4));
        g.rotateX(-Math.PI / 2);
        g.rotateY(Math.atan2(dx, dz));
        g.translate(
          p[0] + (dx * (t + 1.5)) / length,
          0.022,
          p[1] + (dz * (t + 1.5)) / length,
        );
        markings.push(g);
      }
    }
  if (markings.length) {
    const g = mergeGeometries(markings);
    markings.forEach((g) => g.dispose());
    if (g)
      group.add(
        new THREE.Mesh(
          g,
          new THREE.MeshStandardMaterial({ color: 0xd9c88f, roughness: 0.9 }),
        ),
      );
  }
  const windowCanvas = document.createElement("canvas");
  windowCanvas.width = 128;
  windowCanvas.height = 128;
  const ctx = windowCanvas.getContext("2d")!;
  ctx.fillStyle = "#ccc9bd";
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = "#607980";
  ctx.fillRect(18, 19, 92, 70);
  ctx.fillStyle = "#a5b6b5";
  ctx.fillRect(20, 21, 42, 30);
  ctx.fillStyle = "#e0dfd3";
  ctx.fillRect(61, 18, 4, 74);
  ctx.fillRect(17, 52, 94, 3);
  ctx.fillStyle = "#aaa89f";
  ctx.fillRect(14, 91, 100, 5);
  const tex = new THREE.CanvasTexture(windowCanvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(0.22, 0.22);
  tex.colorSpace = THREE.SRGBColorSpace;
  const walls = new THREE.MeshStandardMaterial({
    color: 0xe5e1d5,
    map: tex,
    roughness: 0.85,
  });
  const roof = new THREE.MeshStandardMaterial({
    color: 0xa56c50,
    roughness: 1,
  });
  let buildingCount=0;
  for (const b of data.buildings) {
    if(++buildingCount%200===0){progress(`Building the campus skyline · ${Math.round(buildingCount/data.buildings.length*100)}%`);await new Promise<void>(resolve=>setTimeout(resolve,0));}
    if (excluded.has(b.id) || !b.rings[0]?.length) continue;
    const g = new THREE.ExtrudeGeometry(shape(b.rings), {
      depth: b.height || 12,
      bevelEnabled: false,
      steps: 1,
    });
    g.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(g, [roof, walls]);
    mesh.userData.info = b.id;
    mesh.userData.center = buildingCenter(b);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    buildingMeshes.push(mesh);
  }
  // GPS tree positions and species remain intact. Six lobe canopies are instanced by geographic tile.
  const treesByTile = new Map<string, CampusData["trees"]>();
  for (const t of data.trees) {
    const key = `${Math.floor(t.x / 180)},${Math.floor(t.z / 180)}`;
    treesByTile.set(key, [...(treesByTile.get(key) || []), t]);
  }
  const deciduous = new THREE.MeshStandardMaterial({
    color: 0xb27735,
    roughness: 1,
  });
  const evergreen = new THREE.MeshStandardMaterial({
    color: 0x344f3d,
    roughness: 1,
  });
  const trunk = new THREE.MeshStandardMaterial({
    color: 0x615447,
    roughness: 1,
  });
  const leafGeo = new THREE.IcosahedronGeometry(1, 1),
    coneGeo = new THREE.ConeGeometry(1, 1, 9),
    trunkGeo = new THREE.CylinderGeometry(0.13, 0.2, 1, 6),
    matrix = new THREE.Matrix4(),
    quat = new THREE.Quaternion();
  const palmRoads = data.roads?.filter(r => /palm drive/i.test(r.name)) || [];
  const isPalm = (t: CampusData["trees"][number]) => /palm|phoenix|washingtonia|arecaceae/i.test(t.species) ||
    (/unspecified|unknown/i.test(t.species) && palmRoads.some(r=>r.points.some((p,i)=>i>0 && segmentDistance([t.x,t.z],r.points[i-1],p)<18)));
  const palmGeometry = palmCrownGeometry(), palmMaterial = new THREE.MeshStandardMaterial({color:0x49633c,roughness:.96,side:THREE.DoubleSide});
  let n = 0;
  for (const trees of treesByTile.values()) {
    const tile = new THREE.Group();
    tile.userData.center = [trees[0].x, trees[0].z];
    const palms = trees.filter(isPalm), broad = trees.filter((t) => !t.evergreen && !isPalm(t)),
      conifers = trees.filter((t) => t.evergreen && !isPalm(t));
    const logs = new THREE.InstancedMesh(trunkGeo, trunk, trees.length);
    trees.forEach((t, i) => {
      const h = Math.max(4, Math.min(25, t.height || 10));
      matrix.compose(
        new THREE.Vector3(t.x, h * (isPalm(t) ? .47 : .3), t.z),
        quat,
        new THREE.Vector3(isPalm(t) ? 2 : 1, h * (isPalm(t) ? .94 : .6), isPalm(t) ? 2 : 1),
      );
      logs.setMatrixAt(i, matrix);
    });
    logs.castShadow = true;
    tile.add(logs);
    if(palms.length) {
      const crowns=new THREE.InstancedMesh(palmGeometry,palmMaterial,palms.length*2);
      palms.forEach((t,i)=>{
        const h=Math.max(7,Math.min(25,t.height||12));
        for(let layer=0;layer<2;layer++) {
          const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),i*1.3+layer*.25);
          matrix.compose(new THREE.Vector3(t.x,h*.94+layer*.15,t.z),q,new THREE.Vector3(3.3-layer*.7,3.5,3.3-layer*.7));crowns.setMatrixAt(i*2+layer,matrix);
        }
      });
      crowns.castShadow=true;crowns.receiveShadow=true;tile.add(crowns);
    }
    for (const [list, g, m] of [
      [broad, leafGeo, deciduous],
      [conifers, coneGeo, evergreen],
    ] as const) {
      if (!list.length) continue;
      const inst = new THREE.InstancedMesh(g, m, list.length * 5);
      inst.userData.deciduous = m === deciduous;
      let index = 0;
      for (const t of list) {
        const h = Math.max(4, Math.min(25, t.height || 10)),
          r = h * (t.evergreen ? 0.18 : 0.24);
        for (let j = 0; j < 5; j++) {
          const a = j * 2.4,
            jitter = random(n++);
          matrix.compose(
            new THREE.Vector3(
              t.x + Math.sin(a) * r * 0.45,
              t.evergreen ? h * (0.38 + j * 0.1) : h * (0.64 + jitter * 0.15),
              t.z + Math.cos(a) * r * 0.45,
            ),
            quat,
            new THREE.Vector3(
              r * (t.evergreen ? 1 - j * 0.13 : 0.72),
              h * (t.evergreen ? 0.43 : 0.22),
              r * (t.evergreen ? 1 - j * 0.13 : 0.72),
            ),
          );
          inst.setMatrixAt(index, matrix);
          inst.setColorAt(
            index++,
            new THREE.Color().setHSL(
              t.evergreen ? 0.32 : 0.08 + random(n) * 0.07,
              0.2 + random(n + 1) * 0.25,
              0.65 + random(n + 2) * 0.2,
            ),
          );
        }
      }
      inst.castShadow = true;
      inst.receiveShadow = true;
      tile.add(inst);
    }
    group.add(tile);
    chunks.push(tile);
  }
  // Small instanced leaves are decorative, located under sourced deciduous trees.
  const selected = data.trees.filter((t) => !t.evergreen).slice(0, 450),
    leaves = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(0.18, 0.09),
      new THREE.MeshStandardMaterial({
        color: 0xac6b2a,
        side: THREE.DoubleSide,
        roughness: 1,
      }),
      selected.length * 6,
    );
  selected.forEach((t, i) => {
    for (let j = 0; j < 6; j++) {
      quat.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, random(i + j) * 6));
      matrix.compose(
        new THREE.Vector3(
          t.x + (random(i * 13 + j) - 0.5) * 5,
          0.04,
          t.z + (random(i * 7 + j + 91) - 0.5) * 5,
        ),
        quat,
        new THREE.Vector3(1, 1, 1),
      );
      leaves.setMatrixAt(i * 6 + j, matrix);
    }
  });
  group.add(leaves);
  function update(s: Settings, focus: Point) {
    const snow = s.weather === "snow";
    ground.color.set(
      snow ? 0xd9e2df : s.season === "winter" ? 0x5f7055 : 0x66784f,
    );
    lawn.color.set(
      snow
        ? 0xe8ece7
        : s.season === "summer"
          ? 0x718d59
          : s.season === "winter"
            ? 0x73816a
            : 0x7c885b,
    );
    roof.color.set(snow ? 0xd8e1de : 0xa56c50);
    deciduous.color.set(
      snow
        ? 0xd8dfda
        : s.season === "spring"
          ? 0x96ac67
          : s.season === "summer"
            ? 0x5d864d
            : s.season === "autumn"
              ? 0xcb873f
              : 0x737963,
    );
    evergreen.color.set(snow ? 0xa0b4a6 : 0x344f3d);
    road.roughness = s.weather === "rain" ? 0.25 : 0.92;
    path.roughness = s.weather === "rain" ? 0.3 : 0.86;
    leaves.visible = s.season === "autumn";
    const buildingRange = s.quality === "low" ? 600 : s.quality === "medium" || s.quality === "auto" ? 950 : s.quality === "high" ? 1600 : 2400;
    for(const mesh of buildingMeshes) {
      const p=mesh.userData.center as Point;
      mesh.visible=Math.hypot(p[0]-focus[0],p[1]-focus[1])<buildingRange;
    }
    for (const c of chunks) {
      const [x, z] = c.userData.center;
      c.visible =
        Math.hypot(x - focus[0], z - focus[1]) <
        (s.quality === "low" ? 450 : s.quality === "medium" || s.quality === "auto" ? 850 : s.quality === "high" ? 1400 : 2000);
    }
  }
  return {
    group,
    buildingMeshes,
    update,
    chunks,
    materials: { ground, lawn, road, path, roof },
  };
}
export function buildingCenter(b: Building): Point {
  const ps = b.rings[0];
  return [
    ps.reduce((s, p) => s + p[0], 0) / ps.length,
    ps.reduce((s, p) => s + p[1], 0) / ps.length,
  ];
}
