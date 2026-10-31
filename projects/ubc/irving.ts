// SPDX-License-Identifier: MIT
// Original public-space reconstruction; reference photographs are never assets.
// Sources (reviewed 2026-10-31): UBC's 2019 four-level visitor plan,
// https://wiki.ubc.ca/images/3/34/Irving_K._Barber_Learning_Centre_Map_2019.pdf
// https://www.perkinseastman.com/projects/university-of-british-columbia-irving-k-barber-learning-centre/
// https://www.da-architects.ca/projects/ubc-irving-k-barber-learning-centre/
// https://ikblc.ubc.ca/spaces/building-history-and-highlights/
// GIS VBL10080 supplies envelope/orientation. Interior heights, fixtures and roof
// profiles are interpreted. West Level-2 entry uses exterior stairs because the
// campus-wide vertical datum is not yet reconstructed. No offices/vault access.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Builder } from "./architecture";

type Material = keyof Builder["materials"];

/** Local +X is the north wing; +Z faces East Mall. */
export function irving(b: Builder): void {
  const north = b.width / 2;
  const south = -north;
  const east = b.depth / 2;
  const west = -east + 2;
  const coreX = -11.6;
  const coreLeft = -27.2;
  const coreRight = 4.4;
  const height = b.sourceHeight ?? 26.87;
  const custom = new Map<Material, THREE.BufferGeometry[]>();
  const add = (material: Material, geometry: THREE.BufferGeometry) => {
    const bucket = custom.get(material) ?? [];
    bucket.push(geometry);
    custom.set(material, bucket);
  };
  b.entryX = -12.32;
  Object.assign(b.group.userData, {
    publicSpaces: ["East Mall atrium", "Study concourse", "Chapman Learning Commons", "Ridington reading room and mezzanine"],
    floorHeightInterpretation: "Levels 1–4 use reconstructed elevations 0/5/10/15 metres. West heritage entrance is reached by interpreted exterior stairs; Main Mall's higher real grade is not reproduced.",
    referencePlanDate: "2019",
    restrictedSpaces: "Research offices, archives vaults and automated storage are not reconstructed.",
  });
  b.materials.stone.color.setHex(0xaaa89c);
  b.materials.concrete.color.setHex(0xc6c4ba);
  b.materials.fabric.color.setHex(0x79806a);

  // Floor plates follow the major footprint setbacks, not the bounding rectangle.
  // The north wing's lower archive/storage volume remains closed to visitors.
  for (const y of [0, 5, 10, 15]) {
    b.floor(south + 1, coreLeft, -18.6, 28.6, y, y ? "fabric" : "stone");
    b.floor(coreRight, 58, -18.5, 28.6, y, y ? "fabric" : "stone");
    if (y === 10) b.floor(58, north - 0.5, -3, 13, y, "timber");
    if (y === 15) b.floor(58, 60.7, -3, 13, y, "timber");
    // Atrium is open vertically through all upper storeys. Chapman is a
    // double-height heritage hall, so Level 4 does not seal its timber vault.
    b.floor(coreLeft, -20.5, -14, east - 0.3, y, "stone");
    b.floor(-3.5, coreRight, -14, east - 0.3, y, "stone");
    b.floor(-20.5, -3.5, -1, 4, y, "stone");
    b.floor(-20.5, -3.5, 20, east - 0.3, y, "stone");
    if (y < 15) {
      b.floor(coreLeft, coreRight, west, -1, y, y === 10 ? "timber" : "stone");
      b.floor(-20.5, -15.5, 17, 20, y, "stone");
    }
    if (y === 0) b.floor(-20.5, -3.5, 4, 20, 0, "stone");
  }
  // Block the closed lower north wing at its public circulation boundary.
  b.box("timber", coreRight + 0.2, 4.65, 5, 0.35, 9.3, 47, true);
  b.box("timber", coreX, 2.3, -1.2, 31.6, 4.6, 0.3, true);
  b.sign("LIBRARY COLLECTIONS · UPPER LEVELS", coreRight - 0.02, 2, 7, 6, 0.65, -Math.PI / 2);

  // Two distinct modern wings with recessed glazing, precast piers, deep fins,
  // and lower stone bases. All façade glass has collision, except the entry.
  const glazedFront = (x1: number, x2: number, z: number, top: number) => {
    b.box("concrete", (x1 + x2) / 2, 0.48, z, x2 - x1, 0.96, 0.4, true);
    b.box("glass", (x1 + x2) / 2, (top + 0.96) / 2, z, x2 - x1, top - 0.96, 0.12, true);
    for (let x = x1; x <= x2; x += 3.6) {
      b.box("metal", x, top / 2, z + 0.09, 0.11, top, 0.2);
      b.box("concrete", x, top / 2, z - 0.55, 0.3, top, 1.3);
    }
    for (const y of [5, 10, 15, 19.8])
      if (y < top) b.box("metal", (x1 + x2) / 2, y, z + 0.12, x2 - x1, 0.18, 0.2);
  };
  glazedFront(south + 1, coreLeft, 28.6, 20.6);
  glazedFront(coreRight, 58, 28.6, 21.2);
  for (const [x1, x2, top] of [[south + 1, coreLeft, 20.6], [coreRight, 58, 21.2]]) {
    b.box("concrete", (x1 + x2) / 2, 4.8, -18.6, x2 - x1, 9.6, 0.6, true);
    b.box("glass", (x1 + x2) / 2, (top + 9.6) / 2, -18.65, x2 - x1, top - 9.6, 0.12, true);
    for (let x = x1 + 1.5; x < x2; x += 5.8) {
      b.box("concrete", x, 10.4, -19.2, 0.65, 20.8, 1.3, true);
      b.box("glass", x + 2.7, 4.3, -18.98, 3, 2.6, 0.08);
    }
    b.box("roof", (x1 + x2) / 2, top + 0.15, 5, x2 - x1 + 0.6, 0.3, 47.8);
  }
  // North projecting reading room; southern glazed corner rises independently.
  b.box("concrete", 62, 4.8, 5, 9.5, 9.6, 16, true);
  b.box("glass", north - 0.5, 15.45, 5, 0.12, 11.7, 16, true);
  for (const z of [-3, 1, 5, 9, 13]) {
    b.box("metal", north - 0.4, 15.5, z, 0.18, 12, 0.1);
    b.box("concrete", 58, 5, z, 0.4, 10, 0.4);
  }
  for (const z of [-3, 13]) b.box("glass", 62, 15.4, z, 9.5, 11.6, 0.12, true);
  b.box("roof", 62, 21.4, 5, 10, 0.32, 16.8);
  b.box("concrete", 58, 10.4, 21, 0.45, 20.8, 15, true);
  b.box("concrete", 58, 10.4, -10.8, 0.45, 20.8, 14.7, true);
  b.box("glass", south + 0.6, 10.4, 5, 0.12, 20.8, 47, true);
  for (const y of [5, 10, 15, 20]) b.box("metal", south + 0.5, y, 5, 0.2, 0.18, 47);
  for (let z = -18; z <= 28; z += 3.5) b.box("metal", south + 0.5, 10.4, z, 0.2, 20.8, 0.12);
  b.box("clay", south + 3, 10.1, 25, 4, 20.2, 0.5);

  // The east atrium's three-door opening is at the actual GIS entrance offset.
  const entrance = b.entryX;
  for (const [x1, x2] of [[coreLeft, entrance - 3.2], [entrance + 3.2, coreRight]])
    b.box("glass", (x1 + x2) / 2, 2.2, east, x2 - x1, 4.4, 0.12, true);
  b.box("glass", (coreLeft + coreRight) / 2, 12.5, east, coreRight - coreLeft, 16.2, 0.12, true);
  for (const x of [coreLeft, entrance - 3.2, entrance + 3.2, coreRight])
    b.box("metal", x, 10.4, east + 0.1, 0.14, 20.8, 0.22, true);
  for (const y of [4.4, 10, 15, 20.8]) b.box("metal", coreX, y, east + 0.1, 31.6, 0.17, 0.22);
  b.box("roof", coreX, 21.05, 15.4, 32.5, 0.3, 32.5);
  b.box("metal", entrance, 4.25, east + 1.2, 10, 0.17, 3.2);
  for (const x of [entrance - 3.5, entrance + 3.5]) b.box("glass", x, 1.8, east - 0.75, 0.1, 3.6, 1.5);
  b.floor(entrance - 5, entrance + 5, east - 0.4, east + 5, 0, "concrete");
  b.sign("IRVING K. BARBER LEARNING CENTRE", entrance, 3.85, east + 1.8, 15, 0.65);

  // Stairs share exact walk-support slopes with their visible treads.
  const flight = (x: number, z0: number, z1: number, bottom: number, top: number, width: number, riseToMin = true) => {
    b.ramps.push({ minX: x - width / 2, maxX: x + width / 2, minZ: z0, maxZ: z1,
      fromY: riseToMin ? top : bottom, toY: riseToMin ? bottom : top, axis: "z" });
    const steps = Math.ceil((top - bottom) / 0.17);
    const run = (z1 - z0) / steps;
    for (let n = 0; n < steps; n++) {
      const y = bottom + (top - bottom) * (n + 1) / steps;
      const z = riseToMin ? z1 - (n + 0.5) * run : z0 + (n + 0.5) * run;
      b.box("concrete", x, y - 0.11, z, width, 0.22, run + 0.015);
      for (const side of [-1, 1]) b.colliders.push({ minX: x + side * width / 2 - 0.06, maxX: x + side * width / 2 + 0.06,
        minZ: z - run / 2 - 0.01, maxZ: z + run / 2 + 0.01, minY: y - 0.2, maxY: y + 1.15 });
    }
    for (const side of [-1, 1]) {
      const sx = x + side * width / 2;
      b.beam("metal", new THREE.Vector3(sx, (riseToMin ? top : bottom) + 1.1, z0), new THREE.Vector3(sx, (riseToMin ? bottom : top) + 1.1, z1), 0.065);
      for (let n = 0; n <= 12; n++) {
        const t = n / 12, y = riseToMin ? top + (bottom - top) * t : bottom + (top - bottom) * t;
        b.box("metal", sx, y + 0.53, z0 + (z1 - z0) * t, 0.05, 1.06, 0.05);
      }
    }
  };
  for (const y of [0, 5, 10]) flight(-18, 4, 17, y, y + 5, 4.7);
  for (const y of [5, 10, 15]) {
    b.rail(-20.5, 4, -20.5, 20, y);
    b.rail(-3.5, 4, -3.5, 20, y);
    b.rail(y < 15 ? -15.5 : -20.5, 20, -3.5, 20, y);
    b.rail(-15.5, 4, -3.5, 4, y);
    // Bottom landing has an opening in the front guard for the next flight.
    if (y < 15) b.rail(-15.5, 17, -15.5, 20, y);
  }
  // Original granite Tudor façade and stone surrounds, with genuine arch holes.
  const pointed = (x: number, y: number, w: number, h: number) => {
    const p = new THREE.Path();
    p.moveTo(x - w / 2, y); p.lineTo(x + w / 2, y); p.lineTo(x + w / 2, y + h * 0.66);
    p.quadraticCurveTo(x + w * 0.47, y + h * 0.88, x, y + h);
    p.quadraticCurveTo(x - w * 0.47, y + h * 0.88, x - w / 2, y + h * 0.66); p.closePath();
    return p;
  };
  const facade = new THREE.Shape();
  facade.moveTo(coreLeft, 0); facade.lineTo(coreRight, 0); facade.lineTo(coreRight, 19.8); facade.lineTo(coreLeft, 19.8); facade.closePath();
  facade.holes.push(pointed(coreX, 5, 4.6, 4.5));
  for (const x of [-23, -17.3, -5.9, -0.2]) {
    const opening = pointed(x, 11.3, 3.4, 6.6);
    facade.holes.push(opening);
    const pane = new THREE.Shape(opening.getPoints(16));
    add("glass", new THREE.ShapeGeometry(pane).translate(0, 0, west - 0.03));
    b.box("stone", x, 14.3, west - 0.14, 0.12, 6.1, 0.22);
    b.box("stone", x, 14.7, west - 0.14, 3.4, 0.14, 0.22);
    for (const side of [-1, 1]) b.beam("stone", new THREE.Vector3(x, 16.1, west - 0.15), new THREE.Vector3(x + side * 1.1, 17.1, west - 0.15), 0.13);
  }
  add("stone", new THREE.ExtrudeGeometry(facade, { depth: 0.55, bevelEnabled: false, curveSegments: 10 }).translate(0, 0, west));
  for (const [x1, x2] of [[coreLeft, coreX - 2.3], [coreX + 2.3, coreRight]])
    b.colliders.push({ minX: x1, maxX: x2, minZ: west - 0.05, maxZ: west + 0.55, minY: 0, maxY: 20 });
  b.colliders.push({ minX: coreX - 2.3, maxX: coreX + 2.3, minZ: west - 0.05, maxZ: west + 0.55, minY: 8.3, maxY: 20 });
  b.box("darkWood", coreX - 2.55, 6.7, west + 1, 0.12, 3.4, 1.9);
  b.box("darkWood", coreX + 2.55, 6.7, west + 1, 0.12, 3.4, 1.9);
  for (const x of [coreLeft + 0.5, coreRight - 0.5]) {
    b.box("stone", x, 10, west - 0.7, 1.4, 20, 1.7, true);
    b.box("stone", x, 20.3, west - 0.7, 1.8, 0.6, 2.1);
  }
  for (const x of [coreLeft, coreRight]) b.box("stone", x, 9.8, -21.6, 0.6, 19.6, 15.4, true);
  b.box("stone", coreX, 19.5, west - 0.3, 32.5, 0.5, 1.3);
  for (let x = coreLeft + 1.5; x < coreRight; x += 2.6) b.box("stone", x, 20.15, west - 0.1, 0.8, 0.8, 0.85);
  // Pitched roof and exposed timber ribs are assembled as original geometry.
  const roofShape = new THREE.Shape();
  roofShape.moveTo(coreLeft - 0.8, 19.6); roofShape.lineTo(coreX, height); roofShape.lineTo(coreRight + 0.8, 19.6);
  roofShape.lineTo(coreRight + 0.8, 19.2); roofShape.lineTo(coreX, height - 0.5); roofShape.lineTo(coreLeft - 0.8, 19.2); roofShape.closePath();
  add("roof", new THREE.ExtrudeGeometry(roofShape, { depth: 27.5, bevelEnabled: false }).translate(0, 0, west - 0.8));
  for (let z = west + 2; z < -2; z += 4.1) {
    b.beam("darkWood", new THREE.Vector3(coreLeft + 0.6, 18.9, z), new THREE.Vector3(coreX, height - 1, z), 0.3);
    b.beam("darkWood", new THREE.Vector3(coreX, height - 1, z), new THREE.Vector3(coreRight - 0.6, 18.9, z), 0.3);
    b.beam("timber", new THREE.Vector3(coreLeft + 0.8, 18.7, z), new THREE.Vector3(coreRight - 0.8, 18.7, z), 0.22);
  }
  b.floor(coreX - 3.3, coreX + 3.3, west - 2.6, west + 0.6, 5, "stone");
  flight(coreX, west - 15.6, west - 2.6, 0, 5, 6.6, false);
  b.floor(coreX - 4, coreX + 4, west - 18, west - 15.6, 0, "concrete");
  for (const x of [coreX - 3.3, coreX + 3.3]) b.rail(x, west - 2.6, x, west, 5);
  b.sign("CHAPMAN LEARNING COMMONS · LEVEL 3", coreX, 8.8, west - 0.6, 9, 0.6, Math.PI);

  // Concourse study settings vary between shared tables, window seats and desks.
  for (const y of [0, 5, 10, 15]) {
    for (const x of [-57, -47, -36])
      for (const z of [-10, 1, 17]) b.table(x, z, y);
    for (const z of [-11, 3, 17]) b.bench(south + 4.5, z, 3.4, y);
    for (const x of [18, 31, 44]) {
      if (y < 10) continue;
      for (const z of [-9, 7, 21]) b.table(x, z, y);
    }
    for (const x of [-23, -1]) b.cylinder("white", x, y + 2.4, 24, 0.4, 4.8, true);
  }
  // Chapman keeps a broad central aisle from the atrium to the heritage stairs.
  for (const x of [-21, -2])
    for (const z of [-8, -15, -22]) {
      b.table(x, z, 10);
      b.box("metal", x, 11.25, z, 0.03, 0.45, 0.03);
      b.box("light", x, 11.5, z, 0.48, 0.11, 0.22);
    }
  b.sign("CHAPMAN LEARNING COMMONS", coreX, 13, -1.1, 12, 0.7);
  b.sign("RIDINGTON READING ROOM", 50, 12.3, 4.8, 9, 0.65, -Math.PI / 2);
  b.sign("STUDY CONCOURSE", -45, 2.8, 27.8, 9, 0.65, Math.PI);
  b.sign("IKB · PUBLIC STUDY SPACES", entrance, 2.4, 25.7, 7, 0.65, Math.PI);

  b.display("irving-study", "STUDY AT IKB", -40, 24);
  b.display("irving-chapman", "CHAPMAN LEARNING COMMONS", -27, -28, 10);

  // Ridington's double-height projection and gallery retain a spiral stair.
  // Each rendered tread has matching walk support; exact stair dimensions are
  // reconstructed from the architect's photograph, not measured architectural data.
  b.rail(60.7, -3, 60.7, -1.25, 15);
  b.rail(60.7, 1.25, 60.7, 13, 15);
  b.floor(60.4, 61.6, -0.65, 0.65, 15, "timber");
  const spiralX = 63.05, spiralZ = 0, outer = 2.35, inner = 0.75;
  b.cylinder("metal", spiralX, 12.5, spiralZ, inner - 0.05, 5, true);
  for (let n = 0; n < 36; n++) {
    const a0 = Math.PI + n * Math.PI * 2 / 36;
    const a1 = Math.PI + (n + 1) * Math.PI * 2 / 36;
    const y = 10 + (n + 1) * 5 / 36;
    const vertices = [
      [spiralX + inner * Math.cos(a0), spiralZ + inner * Math.sin(a0)],
      [spiralX + outer * Math.cos(a0), spiralZ + outer * Math.sin(a0)],
      [spiralX + outer * Math.cos(a1), spiralZ + outer * Math.sin(a1)],
      [spiralX + inner * Math.cos(a1), spiralZ + inner * Math.sin(a1)],
    ];
    const shape = new THREE.Shape(vertices.map(([x, z]) => new THREE.Vector2(x, -z)));
    add("timber", new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, y - 0.12, 0));
    // Narrow radial strips keep rectangular support close to the wedge rather
    // than allowing the outer corners to support feet several treads ahead.
    for (let radial = 0; radial < 4; radial++) {
      const r0 = inner + (outer - inner) * radial / 4;
      const r1 = inner + (outer - inner) * (radial + 1) / 4;
      const patch = [a0, a1].flatMap(angle => [r0, r1].map(radius => [
        spiralX + radius * Math.cos(angle), spiralZ + radius * Math.sin(angle),
      ]));
      b.floors.push({ minX: Math.min(...patch.map(v => v[0])), maxX: Math.max(...patch.map(v => v[0])),
        minZ: Math.min(...patch.map(v => v[1])), maxZ: Math.max(...patch.map(v => v[1])), y });
    }
    const ax = spiralX + outer * Math.cos(a0), az = spiralZ + outer * Math.sin(a0);
    const bx = spiralX + outer * Math.cos(a1), bz = spiralZ + outer * Math.sin(a1);
    if (n > 1 && n < 34) {
      b.beam("metal", new THREE.Vector3(ax, y + 1.02, az), new THREE.Vector3(bx, y + 1.16, bz), 0.05);
      b.box("metal", bx, y + 0.56, bz, 0.035, 1.12, 0.035);
      b.colliders.push({ minX: Math.min(ax, bx) - 0.04, maxX: Math.max(ax, bx) + 0.04,
        minZ: Math.min(az, bz) - 0.04, maxZ: Math.max(az, bz) + 0.04, minY: y - 0.15, maxY: y + 1.2 });
    }
  }
  for (const z of [5, 10.5]) {
    b.table(63, z, 10);
    b.box("metal", 63, 11.1, z, 0.035, 0.35, 0.035);
    b.box("light", 63, 11.32, z, 0.46, 0.12, 0.22);
  }
  for (const x of [12, 24, 36, 48]) b.bench(x, -16, 3.2, 10);
  for (const x of [-45, 27]) {
    b.light(x, 4.2, 6, 450);
    b.light(x, 14.2, 6, 450);
  }
  b.light(coreX, 18, -15, 680);
  b.light(61, 20, 5, 450);
  b.light(coreX, 19.8, 12, 550);
  for (const y of [5, 10, 15]) {
    b.box("timber", -3.4, y + 1.8, 12, 0.12, 3.6, 14);
    b.box("metal", -3.35, y + 3.7, 12, 0.2, 0.1, 14);
  }
  for (const [material, geometries] of custom) {
    const geometry = mergeGeometries(geometries, false);
    if (!geometry) throw new Error(`Could not merge Irving ${material}`);
    geometry.computeBoundingSphere();
    const mesh = new THREE.Mesh(geometry, b.materials[material]);
    mesh.name = `irving-custom-${material}`;
    mesh.castShadow = material !== "glass";
    mesh.receiveShadow = material !== "glass";
    if (material === "roof") mesh.userData.roof = true;
    b.group.add(mesh);
    for (const part of geometries) part.dispose();
  }
}
