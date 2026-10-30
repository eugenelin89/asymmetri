// Original procedural models. Dimensions and architectural details are illustrative.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { inPolygon, segmentDistance } from "./physics";
import { pointAt } from "./navigation";
import { places } from "./places";
import type { City, DriveRoute, Point2, Polygon2 } from "./types";

export function shapeOf(polygon: Polygon2) {
  const shape = new THREE.Shape(polygon[0].map(([x, z]) => new THREE.Vector2(x, -z)));
  shape.holes = polygon.slice(1).map((hole) => new THREE.Path(hole.map(([x, z]) => new THREE.Vector2(x, -z))));
  return shape;
}
const random = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

export function buildScenery(scene: THREE.Scene, city: City, coarse: boolean) {
  const materials: THREE.Material[] = [], textures: THREE.Texture[] = [];
  const palette = new Map<number, THREE.MeshStandardMaterial>();
  function material(color: number) {
    if (!palette.has(color)) { const m = new THREE.MeshStandardMaterial({ color, roughness: 0.83 }); materials.push(m); palette.set(color, m); }
    return palette.get(color)!;
  }
  function mesh(g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D = scene) {
    const object = new THREE.Mesh(g, m); object.receiveShadow = true; parent.add(object); return object;
  }
  function flat(polygons: Polygon2[], m: THREE.Material, height: number) {
    const geo = new THREE.ShapeGeometry(polygons.map(shapeOf)); geo.rotateX(-Math.PI / 2);
    const object = mesh(geo, m); object.position.y = height; return object;
  }
  function box(w: number, h: number, d: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number) {
    const object = mesh(new THREE.BoxGeometry(w, h, d), m, parent); object.position.set(x, y, z); return object;
  }
  function batch(geometries: THREE.BufferGeometry[], m: THREE.Material, shadows = false) {
    if (!geometries.length) return;
    const combined = mergeGeometries(geometries); geometries.forEach((g) => g.dispose());
    if (combined) { const object = mesh(combined, m); object.castShadow = shadows; return object; }
  }
  function beam(a: THREE.Vector3, b: THREE.Vector3, width: number, depth = width) {
    const g = new THREE.BoxGeometry(width, depth, a.distanceTo(b));
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), b.clone().sub(a).normalize());
    g.applyQuaternion(q); g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2); return g;
  }
  const cream = material(0xe5dcc8), trim = material(0xe9ede4), charcoal = material(0x263f43);
  const green = material(0x679978), teal = material(0x057b77), road = material(0x45545a);
  const board = new THREE.ExtrudeGeometry(city.land.map(shapeOf), { depth: 10, bevelEnabled: false, curveSegments: 1 });
  board.rotateX(-Math.PI / 2); board.translate(0, -10, 0); mesh(board, material(0xaeb7a6));
  flat(city.land, material(0xc8c5b3), 0.02);
  flat(city.parks.map((p) => p.shape), material(0x83a986), .08);
  flat(city.promenade, cream, .13);
  flat(city.sidewalks, material(0xd9d5c8), .17);
  flat(city.pavement, road, .2);
  const waterMaterial = new THREE.MeshPhongMaterial({ color: 0x267e8a, specular: 0x89b9b8, shininess: 70 }); materials.push(waterMaterial);
  flat(city.water, waterMaterial, -0.5);
  const waterLines: THREE.Vector3[] = [];
  for (let i = 0; i < 280; i++) {
    const x = random(i + 700) * 1700 - 850, z = random(i + 1800) * 1100 - 550;
    if (city.water.some((p) => inPolygon([x, z], p))) waterLines.push(new THREE.Vector3(x, -.38, z), new THREE.Vector3(x + 5 + random(i) * 10, -.38, z + 1));
  }
  const shimmerMaterial = new THREE.LineBasicMaterial({ color: 0xb4d4cc, transparent: true, opacity: .22 }); materials.push(shimmerMaterial);
  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(waterLines), shimmerMaterial));

  // One small original repeating texture gives walls a readable human scale.
  const tile = document.createElement("canvas"); tile.width = 128; tile.height = 128;
  const ctx = tile.getContext("2d")!;
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = "#637f88"; ctx.fillRect(21, 28, 84, 66);
  ctx.fillStyle = "#96acb2"; ctx.fillRect(24, 30, 37, 28);
  ctx.fillStyle = "#d7e2e0"; ctx.fillRect(61, 27, 4, 68); ctx.fillRect(20, 59, 86, 3);
  ctx.fillStyle = "#b5beb9"; ctx.fillRect(18, 95, 91, 4);
  const facade = new THREE.CanvasTexture(tile); facade.colorSpace = THREE.SRGBColorSpace;
  facade.wrapS = facade.wrapT = THREE.RepeatWrapping; facade.anisotropy = 2; textures.push(facade);
  const wallMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, map: facade, roughness: .78 }); materials.push(wallMaterial);
  const buildings: THREE.BufferGeometry[] = [], rooftops: THREE.BufferGeometry[] = [];
  const colors = [0xd7dbd3, 0xb8c8c9, 0xe1dac8, 0xc9ccbd, 0xb0c6c4, 0xaabec5, 0xc59d83, 0xdadbd6];
  const buildingBounds = city.buildings.map((b) => ({ ...b, minX: Math.min(...b.shape[0].map((p) => p[0])), maxX: Math.max(...b.shape[0].map((p) => p[0])), minZ: Math.min(...b.shape[0].map((p) => p[1])), maxZ: Math.max(...b.shape[0].map((p) => p[1])) }));
  const isBuilding = (p: Point2) => buildingBounds.some((b) => p[0] >= b.minX && p[0] <= b.maxX && p[1] >= b.minZ && p[1] <= b.maxZ && inPolygon(p, b.shape));
  buildingBounds.forEach((b, index) => {
    const g = new THREE.ExtrudeGeometry(shapeOf(b.shape), { depth: b.height, bevelEnabled: false, curveSegments: 1 });
    const uv = g.getAttribute("uv");
    const color = new THREE.Color(colors[index % colors.length]);
    const roofColor = new THREE.Color((b.landmark === "creekside" || index % 5 === 0) ? 0x86a392 : 0xd6d8ce);
    const rgb = new Float32Array(g.getAttribute("position").count * 3);
    for (const group of g.groups) for (let i = group.start; i < group.start + group.count; i++) {
      if (group.materialIndex === 0) { uv.setXY(i, .02, .02); roofColor.toArray(rgb, i * 3); }
      else { uv.setXY(i, uv.getX(i) / 4, uv.getY(i) / 3.3); color.toArray(rgb, i * 3); }
    }
    g.setAttribute("color", new THREE.BufferAttribute(rgb, 3)); g.clearGroups(); g.rotateX(-Math.PI / 2); buildings.push(g);
    const x = (b.minX + b.maxX) / 2, z = (b.minZ + b.maxZ) / 2;
    if (b.height > 12 && b.maxX - b.minX > 15 && b.maxZ - b.minZ > 15 && [[x - 4, z - 4], [x + 4, z + 4]].every((p) => inPolygon(p as Point2, b.shape))) {
      const roof = new THREE.BoxGeometry(6, 2.5, 5); roof.translate(x, b.height + 1.25, z); rooftops.push(roof);
    }
    if (b.maxX - b.minX > 180 && b.maxZ - b.minZ > 180 && b.height === 24) {
      // A light tensile-roof silhouette and radial masts evoke BC Place.
      const rx = (b.maxX - b.minX) * .46, rz = (b.maxZ - b.minZ) * .46;
      const stadium = mesh(new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), trim);
      stadium.scale.set(rx, 14, rz); stadium.position.set(x, 24, z);
      const masts: THREE.BufferGeometry[] = [];
      for (let i = 0; i < 18; i++) {
        const a = i / 18 * Math.PI * 2, px = x + Math.cos(a) * rx, pz = z + Math.sin(a) * rz;
        masts.push(beam(new THREE.Vector3(px, 21, pz), new THREE.Vector3(px, 55, pz), 1.5));
        masts.push(beam(new THREE.Vector3(px, 53, pz), new THREE.Vector3(x + Math.cos(a) * rx * .55, 35, z + Math.sin(a) * rz * .55), .6));
      }
      batch(masts, trim);
    }
  });
  batch(buildings, wallMaterial, !coarse); batch(rooftops, material(0x849b99), !coarse);

  const paint: THREE.BufferGeometry[] = [], bridgeDecks: THREE.BufferGeometry[] = [], bridgeRails: THREE.BufferGeometry[] = [], piers: THREE.BufferGeometry[] = [];
  const lightPositions: THREE.Vector3[] = [];
  function bridgeHeight(x: number, z: number, name: string) {
    if (!name.includes("CAMBIE")) return 12;
    if (city.water.some((p) => inPolygon([x, z], p))) return 15;
    let distance = Infinity;
    for (const p of city.water) for (const ring of p) for (let i = 1; i < ring.length; i++) distance = Math.min(distance, segmentDistance([x, z], ring[i - 1], ring[i]));
    const t = Math.max(0, 1 - distance / 180);
    return .7 + 14.3 * t * t * (3 - 2 * t);
  }
  for (const r of city.roads) for (let i = 1; i < r.points.length; i++) {
    const [ax, az] = r.points[i - 1], [bx, bz] = r.points[i], dx = bx - ax, dz = bz - az, length = Math.hypot(dx, dz);
    if (length < 1) continue;
    const nx = dz / length, nz = -dx / length;
    if (r.bridge) {
      // Sample the entire deck so a long water span stays level instead of
      // interpolating a diagonal from one low approach to the other shore.
      const slices = Math.ceil(length / 18);
      for (let j = 0; j < slices; j++) {
        const x0 = ax + dx * j / slices, z0 = az + dz * j / slices;
        const x1 = ax + dx * (j + 1) / slices, z1 = az + dz * (j + 1) / slices;
        const ay = bridgeHeight(x0, z0, r.name), by = bridgeHeight(x1, z1, r.name);
        bridgeDecks.push(beam(new THREE.Vector3(x0, ay, z0), new THREE.Vector3(x1, by, z1), r.width, 1.7));
        for (const side of [-1, 1]) bridgeRails.push(beam(new THREE.Vector3(x0 + nx * r.width * .48 * side, ay + 1.3, z0 + nz * r.width * .48 * side), new THREE.Vector3(x1 + nx * r.width * .48 * side, by + 1.3, z1 + nz * r.width * .48 * side), .4, 1.1));
      }
      for (let t = 25; t < length; t += 60) {
        const x = ax + dx * t / length, z = az + dz * t / length, y = bridgeHeight(x, z, r.name);
        if (city.water.some((p) => inPolygon([x, z], p))) { const g = new THREE.CylinderGeometry(1.4, 2.1, y, 6); g.translate(x, y / 2 - 1, z); piers.push(g); }
      }
      continue;
    }
    for (let t = 9; t < length - 7; t += 12) {
      const x = ax + dx * t / length, z = az + dz * t / length;
      if (!city.land.some((p) => inPolygon([x, z], p))) continue;
      const g = new THREE.BoxGeometry(.22, .025, 4); g.rotateY(Math.atan2(dx, dz)); g.translate(x, .24, z); paint.push(g);
    }
    // Crosswalks sit back from intersections. All marks are artistic road detail.
    if (length > 55 && !r.name.includes("UNNAMED")) for (const t of [6, length - 6]) for (let k = -3; k <= 3; k++) {
      const x = ax + dx * t / length + nx * k * 1.1, z = az + dz * t / length + nz * k * 1.1;
      if (city.land.some((p) => inPolygon([x, z], p))) { const g = new THREE.BoxGeometry(.55, .03, 2.8); g.rotateY(Math.atan2(dx, dz)); g.translate(x, .245, z); paint.push(g); }
    }
    if (!coarse) for (let t = 20; t < length; t += 65) {
      const x = ax + dx * t / length + nx * (r.width / 2 + 1.3), z = az + dz * t / length + nz * (r.width / 2 + 1.3);
      if (city.land.some((p) => inPolygon([x, z], p)) && !isBuilding([x, z])) lightPositions.push(new THREE.Vector3(x, 3.5, z));
    }
  }
  batch(paint, material(0xe3ddbc)); batch(bridgeDecks, material(0x7e8c89), !coarse); batch(bridgeRails, trim); batch(piers, material(0xb4b9ae));
  const matrix = new THREE.Matrix4();
  function instances(g: THREE.BufferGeometry, m: THREE.Material, positions: THREE.Vector3[], scale?: (i: number) => THREE.Vector3) {
    const object = new THREE.InstancedMesh(g, m, positions.length); object.castShadow = !coarse; object.receiveShadow = true;
    positions.forEach((p, i) => { matrix.compose(p, new THREE.Quaternion(), scale?.(i) ?? new THREE.Vector3(1, 1, 1)); object.setMatrixAt(i, matrix); }); scene.add(object); return object;
  }
  instances(new THREE.CylinderGeometry(.13, .18, 7, 5), charcoal, lightPositions);
  instances(new THREE.BoxGeometry(1.5, .25, .8), trim, lightPositions.map((p) => p.clone().add(new THREE.Vector3(.45, 3.5, 0))));
  const trees: THREE.Vector3[] = [];
  for (const park of city.parks) {
    const xs = park.shape[0].map((p) => p[0]), zs = park.shape[0].map((p) => p[1]);
    for (let x = Math.min(...xs) + 7; x < Math.max(...xs); x += 16) for (let z = Math.min(...zs) + 7; z < Math.max(...zs); z += 16) {
      const seed = x * 3 + z * 5, px = x + random(seed) * 8 - 4, pz = z + random(seed + 1) * 8 - 4;
      if (((px - city.anchors["hinge-park"][0]) / 12) ** 2 + ((pz - city.anchors["hinge-park"][1]) / 26) ** 2 > 1 && inPolygon([px, pz], park.shape) && !isBuilding([px, pz]) && !city.sidewalks.some((p) => inPolygon([px, pz], p)) && trees.length < 950) trees.push(new THREE.Vector3(px, 6, pz));
    }
  }
  const deciduous = trees.filter((_, i) => i % 3 !== 0), firs = trees.filter((_, i) => i % 3 === 0);
  instances(new THREE.CylinderGeometry(.45, .7, 5, 5), material(0x7e7359), trees.map((p) => new THREE.Vector3(p.x, 2.5, p.z)));
  const crowns = instances(new THREE.IcosahedronGeometry(3.6, 0), green, deciduous, (i) => new THREE.Vector3(1, 1.1 + random(i) * .7, 1));
  deciduous.forEach((_, i) => crowns.setColorAt(i, new THREE.Color().setHSL(.28 + random(i) * .07, .16, .68 + random(i + 5) * .2)));
  instances(new THREE.ConeGeometry(3.2, 12, 7), material(0x39685b), firs.map((p) => new THREE.Vector3(p.x, 7, p.z)));

  // Landmark models and details retain source-based positions, not surveyed dimensions.
  const [sx, sz] = city.anchors["science-world"];
  const science = new THREE.Group(); science.position.set(sx, 0, sz); scene.add(science);
  const plinth = mesh(new THREE.CylinderGeometry(32, 35, 3, 48), cream, science); plinth.position.y = 3;
  const glazing = mesh(new THREE.CylinderGeometry(27.5, 28.5, 8, 48), material(0x4b7d88), science); glazing.position.y = 8;
  const rim = mesh(new THREE.CylinderGeometry(29, 29, 1.2, 48), trim, science); rim.position.y = 12.4;
  const domeGeometry = new THREE.IcosahedronGeometry(23, 3);
  const dome = mesh(domeGeometry, material(0xb5cbd0), science); dome.position.y = 29; dome.castShadow = !coarse;
  const latticeMaterial = new THREE.LineBasicMaterial({ color: 0xf3e9d2 }); materials.push(latticeMaterial);
  const lattice = new THREE.LineSegments(new THREE.EdgesGeometry(domeGeometry, .1), latticeMaterial); lattice.position.y = 29; science.add(lattice);
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; box(.8, 9, .8, trim, science, Math.cos(a) * 28, 8, Math.sin(a) * 28); }
  box(34, 8, 22, charcoal, science, 25, 4.5, 13); box(38, 1, 26, green, science, 25, 9, 13);
  const [cx, cz] = city.anchors.creekside;
  const creekside = new THREE.Group(); creekside.position.set(cx, 0, cz); scene.add(creekside);
  box(41, 9, 24, material(0x628e97), creekside, 0, 5, 0);
  box(44, 1.1, 27, green, creekside, 0, 10, 0);
  for (let x = -18; x <= 18; x += 6) box(.65, 9, 25, trim, creekside, x, 5, 0);
  box(18, 3, 10, cream, creekside, 10, 12, 3);
  const dock = box(8, .6, 24, material(0x9d8770), scene, cx - 3, .3, cz - 29); dock.rotation.y = .2;
  const [hx, hz] = city.anchors["hinge-park"];
  const pond = mesh(new THREE.CircleGeometry(1, 24), waterMaterial); pond.rotation.x = -Math.PI / 2; pond.scale.set(10, 24, 1); pond.position.set(hx, .16, hz);
  const smallBridge = box(25, .65, 4, material(0xb79c77), scene, hx, 1.3, hz); smallBridge.rotation.y = -.25;
  const [ix, iz] = city.anchors["habitat-island"];
  const rocks: THREE.Vector3[] = [];
  for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2; const p: Point2 = [ix + Math.cos(a) * 25, iz + Math.sin(a) * 16]; if (city.land.some((land) => inPolygon(p, land))) rocks.push(new THREE.Vector3(p[0], .7, p[1])); }
  instances(new THREE.IcosahedronGeometry(1.7, 0), material(0x8d9692), rocks, (i) => new THREE.Vector3(1 + random(i), .6, 1));

  const markers = new THREE.Group(); scene.add(markers);
  const pickTargets: THREE.Object3D[] = [];
  const labels = new Map<string, THREE.Sprite>(), numberLabels = new Map<string, THREE.Sprite>();
  const invisible = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }); materials.push(invisible);
  const markerGeometry = new THREE.OctahedronGeometry(5);
  for (const place of places) {
    const [x, z] = city.anchors[place.id], y = place.id === "science-world" ? 72 : 56;
    const marker = mesh(markerGeometry, teal, markers); marker.position.set(x, y, z);
    const c = document.createElement("canvas"); c.width = 512; c.height = 80;
    const context = c.getContext("2d")!; context.fillStyle = "#103c3beb"; context.beginPath(); context.roundRect(0, 0, 512, 80, 12); context.fill();
    context.fillStyle = "#6cdbbf"; context.font = "600 26px system-ui"; context.fillText(place.number, 18, 50);
    context.fillStyle = "#ffffff"; context.font = "500 25px system-ui"; context.fillText(place.name, 66, 50, 426);
    const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture);
    const m = new THREE.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false }); materials.push(m);
    const label = new THREE.Sprite(m); label.position.set(x, y, z); label.center.set(.5, -.65); label.scale.set(133, 21, 1); label.renderOrder = 5; labels.set(place.id, label); markers.add(label);
    const badge = document.createElement("canvas"); badge.width = badge.height = 96;
    const badgeContext = badge.getContext("2d")!;
    badgeContext.fillStyle = "#0a665c"; badgeContext.beginPath(); badgeContext.arc(48, 48, 43, 0, Math.PI * 2); badgeContext.fill();
    badgeContext.strokeStyle = "#ecf4df"; badgeContext.lineWidth = 5; badgeContext.stroke();
    badgeContext.fillStyle = "#ffffff"; badgeContext.font = "600 35px system-ui"; badgeContext.textAlign = "center"; badgeContext.fillText(place.number, 48, 61);
    const badgeTexture = new THREE.CanvasTexture(badge); badgeTexture.colorSpace = THREE.SRGBColorSpace; textures.push(badgeTexture);
    const badgeMaterial = new THREE.SpriteMaterial({ map: badgeTexture, depthTest: false, depthWrite: false }); materials.push(badgeMaterial);
    const numberLabel = new THREE.Sprite(badgeMaterial); numberLabel.position.set(x, y, z); numberLabel.userData.place = place.id; numberLabel.renderOrder = 5; markers.add(numberLabel); numberLabels.set(place.id, numberLabel); pickTargets.push(numberLabel);
    const pick = mesh(new THREE.SphereGeometry(18, 8, 6), invisible, markers); pick.position.set(x, y, z); pick.userData.place = place.id; label.userData.place = place.id; pickTargets.push(pick, label);
  }
  const highlight = mesh(new THREE.RingGeometry(30, 32, 64), new THREE.MeshBasicMaterial({ color: 0x00b89c, transparent: true, opacity: .8, depthWrite: false })); materials.push(highlight.material as THREE.Material); highlight.rotation.x = -Math.PI / 2; highlight.position.set(sx, .35, sz);

  const car = new THREE.Group(); scene.add(car);
  const body = new THREE.Group(); car.add(body);
  box(1.9, .6, 4, material(0x12a398), body, 0, .8, 0);
  box(1.72, .55, 1.85, material(0x294c5c), body, 0, 1.37, -.25);
  box(1.78, .16, 1.9, teal, body, 0, 1.69, -.25);
  box(1.88, .13, .3, trim, body, 0, .53, -2);
  box(1.88, .13, .3, trim, body, 0, .53, 2);
  for (const x of [-.65, .65]) box(.48, .2, .1, material(0xf1e8bc), body, x, .86, 2.03);
  const brakeMaterial = new THREE.MeshStandardMaterial({ color: 0xbb3e36, emissive: 0xff2519, emissiveIntensity: 0, roughness: .6 }); materials.push(brakeMaterial);
  for (const x of [-.66, .66]) box(.45, .22, .1, brakeMaterial, body, x, .88, -2.03);
  const wheels: THREE.Group[] = [], frontWheels: THREE.Group[] = [];
  const wheelGeometry = new THREE.CylinderGeometry(.36, .36, .3, 12); wheelGeometry.rotateZ(Math.PI / 2);
  for (const x of [-.95, .95]) for (const z of [-1.3, 1.3]) {
    const holder = new THREE.Group(); holder.position.set(x, .4, z); car.add(holder);
    const wheel = new THREE.Group(); holder.add(wheel); mesh(wheelGeometry, material(0x253137), wheel); box(.32, .5, .12, material(0x9caeaf), wheel, 0, 0, 0); wheels.push(wheel); if (z > 0) frontWheels.push(holder);
  }
  const shadowMaterial = new THREE.MeshBasicMaterial({ color: 0x102724, transparent: true, opacity: .25, depthWrite: false }); materials.push(shadowMaterial);
  const carShadow = mesh(new THREE.CircleGeometry(1, 24), shadowMaterial, car); carShadow.rotation.x = -Math.PI / 2; carShadow.scale.set(1.7, 2.8, 1); carShadow.position.y = .27;
  const routeGuide = new THREE.Group(); scene.add(routeGuide);
  const routeMaterial = new THREE.MeshBasicMaterial({ color: 0xf5c568, side: THREE.DoubleSide }); materials.push(routeMaterial);
  function setRoute(route: DriveRoute | null) {
    for (const child of [...routeGuide.children]) {
      if (child instanceof THREE.InstancedMesh) { child.geometry.dispose(); child.dispose(); }
      routeGuide.remove(child);
    }
    if (!route) return;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([-.7, 0, -.7, 0, 0, 1.2, .7, 0, -.7], 3)); g.computeVertexNormals();
    const count = Math.ceil(route.length / 14), arrows = new THREE.InstancedMesh(g, routeMaterial, count);
    const q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), size = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < count; i++) {
      const p = pointAt(route, i * 14), next = pointAt(route, i * 14 + 1);
      q.setFromAxisAngle(up, Math.atan2(next[0] - p[0], next[1] - p[1]));
      matrix.compose(new THREE.Vector3(p[0], .28, p[1]), q, size); arrows.setMatrixAt(i, matrix);
    }
    routeGuide.add(arrows);
  }
  return { setRoute, materials, textures, car, body, wheels, frontWheels, brakeMaterial, markers, pickTargets, labels, numberLabels, highlight, shimmerMaterial };
}
