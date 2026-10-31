import * as THREE from "three";
import { ResidenceMesh } from "./residence-mesh";
import { shape } from "./scenery";
import { orchardAnchor } from "./residence-layout";
import { local, segmentDistance } from "./spatial";
import type { Building, Point } from "./types";

export type OrchardGeography = {
  footprintParts: Building[];
  subbuildings: {
    id: string;
    name: string;
    ringsLocal: Point[][];
    sourceHeightM: null;
  }[];
};
/** Footprint-conforming low volumes, separately reconstructed slender towers. */
export function buildResidenceExterior(geography: OrchardGeography) {
  const b = new ResidenceMesh();
  for (const section of geography.subbuildings) {
    const academic = section.id === "VSBL10036",
      height = academic ? 16.54 : 7.2;
    const g = new THREE.ExtrudeGeometry(shape(section.ringsLocal), {
      depth: height - 7,
      bevelEnabled: false,
    });
    g.rotateX(-Math.PI / 2);
    g.translate(0, 7, 0);
    const cap = new THREE.Mesh(g, b.materials.concrete);
    cap.castShadow = cap.receiveShadow = true;
    b.group.add(cap);
  }
  for (const part of geography.footprintParts)
    for (const ring of part.rings) {
      const points = ring.map((p) => local(p, orchardAnchor));
      for (let i = 1; i < points.length; i++) {
        const p = points[i - 1],
          q = points[i],
          length = Math.hypot(q[0] - p[0], q[1] - p[1]);
        const yaw = -Math.atan2(q[1] - p[1], q[0] - p[0]);
        const doorEdge = segmentDistance([0, 12], p, q) < 0.3;
        const panels = Math.max(1, Math.ceil(length / 2.6));
        for (let j = 0; j < panels; j++) {
          const t = (j + 0.5) / panels,
            x = p[0] + (q[0] - p[0]) * t,
            z = p[1] + (q[1] - p[1]) * t;
          const opening = doorEdge && Math.hypot(x, z - 12) < 2.5;
          if (!opening) {
            b.box(
              "glass",
              x,
              3.4,
              z,
              length / panels - 0.06,
              6.3,
              0.045,
              false,
              yaw,
            );
            b.box("metal", x, 3.4, z, 0.065, 6.9, 0.13);
          }
          for (const y of opening ? [6.8] : [0.18, 3.3, 6.8])
            b.box("metal", x, y, z, length / panels, 0.1, 0.15, false, yaw);
        }
      }
    }
  function tower(
    cx: number,
    cz: number,
    width: number,
    depth: number,
    roof: number,
    rotate: boolean,
  ) {
    const tower = new ResidenceMesh();
    // Historical permit elevations above its 86 m datum. This is not measured current height.
    tower.box("concrete", 0, (roof + 7.2) / 2, 0, width, roof - 7.2, depth);
    const rows = Math.floor((roof - 7.2) / 2.65),
      columns = Math.floor(width / 2.9);
    for (const side of [-1, 1]) {
      for (let row = 0; row < rows; row++)
        for (let column = 0; column < columns; column++) {
          const x = -width / 2 + ((column + 0.5) * width) / columns;
          const y = 8.5 + row * 2.65;
          tower.box(
            "black",
            x,
            y,
            side * (depth / 2 + 0.035),
            width / columns - 0.22,
            2.3,
            0.065,
          );
          tower.box(
            "glass",
            x,
            y + 0.04,
            side * (depth / 2 + 0.09),
            width / columns - 0.38,
            2.08,
            0.04,
          );
          // Alternating facets suggest the documented sculpted precast surfaces.
          const wave = Math.sin(column * 0.6 + row * 0.23) * 0.14;
          tower.box(
            "plaster",
            x + width / columns / 2 - 0.04,
            y,
            side * (depth / 2 + 0.14 + wave),
            0.23,
            2.65,
            0.28,
            false,
            wave,
          );
          tower.box(
            "plaster",
            x,
            y - 1.22,
            side * (depth / 2 + 0.1),
            width / columns,
            0.22,
            0.21,
          );
        }
    }
    for (const side of [-1, 1]) {
      tower.box(
        "black",
        side * (width / 2 + 0.04),
        (roof + 7.2) / 2,
        0,
        0.12,
        roof - 7.2,
        depth - 0.6,
      );
      tower.box(
        "glass",
        side * (width / 2 + 0.13),
        (roof + 7.2) / 2,
        0,
        0.05,
        roof - 7.4,
        depth - 0.8,
      );
      for (let y = 7.3; y < roof; y += 2.65)
        tower.box(
          "metal",
          side * (width / 2 + 0.2),
          y,
          0,
          0.12,
          0.1,
          depth - 0.7,
        );
      for (let z = -depth / 2 + 0.5; z < depth / 2; z += 2)
        tower.box(
          "metal",
          side * (width / 2 + 0.2),
          (roof + 7.2) / 2,
          z,
          0.12,
          roof - 7.2,
          0.08,
        );
    }
    tower.box("metal", 0, roof + 0.2, 0, width + 0.3, 0.4, depth + 0.3);
    tower.box("concrete", 0, roof + 2.15, 0, width * 0.42, 4.3, depth * 0.7);
    tower.finish();
    tower.group.position.set(cx, 0, cz);
    tower.group.rotation.y = rotate ? Math.PI / 2 : 0;
    b.group.add(tower.group);
  }
  tower(-12, -4.3, 62, 13.6, 57.2, false);
  tower(-67.3, 32, 40, 13.6, 54.55, true);
  b.box("wood", 0, 3.1, 12.5, 5.5, 0.22, 2.5);
  for (const x of [-2.3, 2.3]) b.box("metal", x, 1.5, 13.2, 0.09, 3, 0.09);
  b.sign("ORCHARD COMMONS", 0, 2.75, 13.8, 4.6, 0.5);
  b.sign("BARTLETT · VIRTUAL OPEN HOUSE", 0, 2.17, 12.15, 2.7, 0.25);
  b.finish();
  b.group.userData.info = "orchard";
  return b;
}
