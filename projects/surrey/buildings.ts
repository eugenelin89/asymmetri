// SPDX-License-Identifier: MIT — original shared procedural geometry and canvas materials.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { buildingProfile } from "./architecture";
import { onSurface } from "./surfaces";
import type { City, Polygon, Point } from "./types";

export function footprintShape(polygon: Polygon) {
  const shape = new THREE.Shape(polygon[0].map(([x, z]) => new THREE.Vector2(x, -z)));
  shape.holes = polygon.slice(1).map(r => new THREE.Path(r.map(([x, z]) => new THREE.Vector2(x, -z))));
  return shape;
}
export function buildBuildings(scene: THREE.Scene, city: City) {
  const styles = ["glass", "residential", "apartment", "commercial", "storefront", "civic"] as const;
  const palettes = [0x8daeb6, 0xd4d7ce, 0xd2bda6, 0xc6bca6, 0xb69882, 0xdfdfd1];
  const walls = new Map<string, THREE.BufferGeometry[]>(), tops: THREE.BufferGeometry[] = [], roofItems: THREE.BufferGeometry[] = [];
  const near = new Map<string, { centre: Point; geometry: THREE.BufferGeometry[] }>();
  function detail(p: Point, geometry: THREE.BufferGeometry) {
    const key = `${Math.floor(p[0] / 128)},${Math.floor(p[1] / 128)}`;
    if (!near.has(key)) near.set(key, { centre: [Math.floor(p[0] / 128) * 128 + 64, Math.floor(p[1] / 128) * 128 + 64], geometry: [] });
    near.get(key)!.geometry.push(geometry);
  }
  function box(w: number, h: number, d: number, x: number, y: number, z: number, yaw = 0) {
    const g = new THREE.BoxGeometry(w, h, d); g.rotateY(yaw); g.translate(x, y, z); return g;
  }
  function facade(kind: typeof styles[number], variant: number) {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const glass = kind === "glass" || kind === "civic", residential = kind === "residential" || kind === "apartment";
    ctx.fillStyle = glass ? ["#8badb6", "#739da9", "#99b3b8"][variant] : ["#ebe8db", "#d4cec0", "#e0d7cb"][variant]; ctx.fillRect(0, 0, 128, 128);
    const cell = glass ? 16 : 32;
    for (let y = 0; y < 128; y += 32) {
      for (let x = 0; x < 128; x += cell) {
        ctx.fillStyle = (x / cell + y / 32 + variant) % 7 === 0 ? "#c7d1c1" : ["#547584", "#668992", "#78939a"][((x / cell + y / 32) % 3)];
        ctx.fillRect(x + (glass ? 1 : 6), y + 5, cell - (glass ? 2 : 11), glass ? 25 : 20);
        if (residential) { ctx.fillStyle = "#b6b6ab"; ctx.fillRect(x + 3, y + 25, cell - 6, 3); ctx.fillStyle = "#767f7c"; ctx.fillRect(x + 4, y + 21, cell - 8, 1); }
        if (kind === "storefront") { ctx.fillStyle = "#9a8270"; ctx.fillRect(x, y + 29, cell, 2); }
      }
      ctx.fillStyle = glass ? "#b0c3c0" : "#bcbcb1"; ctx.fillRect(0, y, 128, glass ? 1 : 2);
    }
    const texture = new THREE.CanvasTexture(c); texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(glass ? .065 : .08, .08); texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ color: palettes[styles.indexOf(kind)], map: texture, roughness: glass ? .32 : .82, metalness: glass ? .18 : 0 });
  }
  function extrude(b: City["buildings"][number], height: number, start = 0, scale = 1) {
    const solid = new THREE.ExtrudeGeometry(footprintShape(b.shape), { depth: height, bevelEnabled: false, steps: 1 });
    // Keep walls only. A separate untextured cap avoids window-painted roofs and
    // distant depth-buffer fighting between two nearly coplanar roof surfaces.
    const sides = solid.groups.find(group => group.materialIndex === 1)!;
    const g = new THREE.BufferGeometry();
    for (const name of ["position", "normal", "uv"]) {
      const attribute = solid.getAttribute(name);
      g.setAttribute(name, new THREE.Float32BufferAttribute(attribute.array.slice(sides.start * attribute.itemSize, (sides.start + sides.count) * attribute.itemSize), attribute.itemSize));
    }
    solid.dispose();
    g.rotateX(-Math.PI / 2);
    const profile = buildingProfile(b);
    if (scale !== 1) { g.translate(-profile.centre[0], 0, -profile.centre[1]); g.scale(scale, 1, scale); g.translate(profile.centre[0], 0, profile.centre[1]); }
    g.translate(0, start + b.baseElevation, 0); return g;
  }
  for (const b of city.buildings) {
    const p = buildingProfile(b), key = `${p.kind}:${p.variant}`, height = p.height, bodyHeight = p.roof === "pitched" ? Math.max(2, height - 1.8) : height;
    if (!walls.has(key)) walls.set(key, []);
    if (p.setback) { walls.get(key)!.push(extrude(b, height * .68), extrude(b, height * .32, height * .68, .86)); }
    else walls.get(key)!.push(extrude(b, bodyHeight));
    const roof = new THREE.ShapeGeometry(footprintShape(b.shape)); roof.rotateX(-Math.PI / 2);
    if (p.setback) { roof.translate(-p.centre[0], 0, -p.centre[1]); roof.scale(.86, 1, .86); roof.translate(p.centre[0], 0, p.centre[1]); }
    roof.translate(0, bodyHeight, 0); tops.push(roof);
    if (p.setback) { const terrace = new THREE.ShapeGeometry(footprintShape(b.shape)); terrace.rotateX(-Math.PI / 2); terrace.translate(0, height * .68, 0); tops.push(terrace); }
    if (onSurface(p.centre, [b.shape]) && p.area > 180) {
      const w = Math.min(5, (p.bounds[2] - p.bounds[0]) * .2), d = Math.min(4, (p.bounds[3] - p.bounds[1]) * .2);
      roofItems.push(box(w, 1.4, d, p.centre[0], height + .7, p.centre[1]), box(w * .8, .25, d * .8, p.centre[0], height + 1.5, p.centre[1]));
    }
    if (p.roof === "pitched") {
      // Low gable confined to the existing footprint; no increase beyond source total height.
      const cap = new THREE.ConeGeometry(1, 2, 4); cap.rotateY(Math.PI / 4); cap.scale((p.bounds[2] - p.bounds[0]) * .35, 1, (p.bounds[3] - p.bounds[1]) * .35);
      if (onSurface(p.centre, [b.shape])) { cap.translate(p.centre[0], height - .9, p.centre[1]); roofItems.push(cap); } else cap.dispose();
    }
    const ring = b.shape[0];
    // Door, canopy and balcony details stay on visible walls and share 128m LOD tiles.
    for (let i = 1; i < ring.length; i++) {
      const a = ring[i - 1], c = ring[i], length = Math.hypot(c[0] - a[0], c[1] - a[1]); if (length < 9) continue;
      const dx = (c[0] - a[0]) / length, dz = (c[1] - a[1]) / length, yaw = Math.atan2(dx, dz);
      const x = (a[0] + c[0]) / 2, z = (a[1] + c[1]) / 2;
      detail([x, z], box(.18, 2.7, 1.8, x, 1.35, z, yaw));
      if (p.kind === "storefront" || p.kind === "commercial") detail([x, z], box(1.6, .2, Math.min(6, length * .65), x, 3.1, z, yaw));
      if ((p.kind === "residential" || p.kind === "apartment") && length < 90) {
        for (let y = 6; y < Math.min(height - 2, 55); y += p.floorHeight * 2) {
          detail([x, z], box(1.6, .18, Math.min(7, length * .6), x, y, z, yaw));
          detail([x, z], box(1.7, .9, .08, x + dx * 3, y + .5, z + dz * 3, yaw));
        }
      }
      if (i > 5) break;
    }
    if (b.name === "CITY CENTRE LIBRARY") {
      for (let y = 4.5; y < height; y += 4.6) {
        const ribbon = extrude(b, .45, y, 1.012); tops.push(ribbon);
      }
    }
  }
  function batch(geometry: THREE.BufferGeometry[], material: THREE.Material) {
    if (!geometry.length) return null;
    const normalized = geometry.map(g => g.index ? g.toNonIndexed() : g);
    const merged = mergeGeometries(normalized); new Set([...geometry, ...normalized]).forEach(g => g.dispose());
    if (!merged) return null;
    const mesh = new THREE.Mesh(merged, material); mesh.castShadow = mesh.receiveShadow = true; scene.add(mesh); return mesh;
  }
  for (const [key, gs] of walls) { const [kind, variant] = key.split(":"); batch(gs, facade(kind as typeof styles[number], Number(variant))); }
  batch(tops, new THREE.MeshStandardMaterial({ color: 0xc5c8bd, roughness: .85 }));
  batch(roofItems, new THREE.MeshStandardMaterial({ color: 0x74868a, roughness: .8 }));
  const detailMaterial = new THREE.MeshStandardMaterial({ color: 0x536a6a, roughness: .65 });
  return [...near.values()].flatMap(tile => { const mesh = batch(tile.geometry, detailMaterial); return mesh ? [{ mesh, centre: tile.centre }] : []; });
}
