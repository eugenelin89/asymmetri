// Original procedural public sports precinct. No real players or live occupancy.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Anchors, CampusData, Point, Pose, Settings } from "./types";
import { global, local, type Box, type Floor, type Interior, type Ramp } from "./spatial";
import { athleticsAnchors, soccerFields, trackBoundary, trackLayout, trackPoint } from "./athletics-layout";
import { person } from "./people";
import { uniform } from "./props";
import { appearanceOptions, defaultAppearance } from "./appearance";

type P = [number, number, number];
type Person = ReturnType<typeof person>;
const groundLayers = { surface: 1, infield: 2, stripe: 3, marking: 4, label: 5 } as const;
const colours = {
  grass: 0x46734b, stripe: 0x3f6944, line: 0xf0eee0,
  concrete: 0x9da19b, navy: 0x193b60, yellow: 0xd6b54c,
  steel: 0x929c9b, rubber: 0x914e44, fence: 0x4c5a54,
};

class SportsBuilder {
  group = new THREE.Group();
  colliders: Box[] = [];
  floors: Floor[] = [];
  ramps: Ramp[] = [];
  batches = new Map<THREE.MeshStandardMaterial, THREE.BufferGeometry[]>();
  materials = new Map<string, THREE.MeshStandardMaterial>();
  mat(colour: number, layer = 0) {
    const key = `${colour}:${layer}`;
    if (!this.materials.has(key)) {
      // Centimetre height offsets alone fall below depth-buffer precision in
      // aerial views. Distinct decal layers preserve turf/paint ordering while
      // leaving ordinary solid architecture and collision elevations intact.
      const material = new THREE.MeshStandardMaterial({ color: colour, roughness: 0.88,
        polygonOffset: layer > 0, polygonOffsetFactor: -layer, polygonOffsetUnits: -layer });
      material.name = layer ? `sports-ground-layer-${layer}` : "sports-solid";
      material.userData.groundLayer = layer;
      if (layer === groundLayers.marking) {
        // Preserve real paint width nearby, but prevent subpixel lane markings
        // from breaking into dots at aerial distances. Widen the render ribbon
        // on its ground plane before projection, so its depth slope continues
        // to match the turf below; changing screen XY alone would break that.
        const viewport = new THREE.Vector2(1024, 768);
        material.userData.paintViewport = viewport;
        material.onBeforeCompile = (shader) => {
          shader.uniforms.sportsPaintViewport = { value: viewport };
          shader.vertexShader = `attribute vec3 paintCenter;\nuniform vec2 sportsPaintViewport;\n${shader.vertexShader}`;
          shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", `
            vec4 sportsEdgeClip = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
            vec4 sportsCenterClip = projectionMatrix * modelViewMatrix * vec4(paintCenter, 1.0);
            if (cameraPosition.y > 20.0 && sportsEdgeClip.w > 0.0 && sportsCenterClip.w > 0.0) {
              vec2 sportsCenterNdc = sportsCenterClip.xy / sportsCenterClip.w;
              vec2 sportsPixelOffset = (sportsEdgeClip.xy / sportsEdgeClip.w - sportsCenterNdc) * sportsPaintViewport * 0.5;
              float sportsHalfWidth = length(sportsPixelOffset);
              if (sportsHalfWidth > 0.00001 && sportsHalfWidth < 0.55) {
                vec3 sportsWorldOffset = transformed - paintCenter;
                float sportsScale = min(0.55 / sportsHalfWidth, 0.75 / max(length(sportsWorldOffset), 0.00001));
                transformed = paintCenter + sportsWorldOffset * sportsScale;
              }
            }
            #include <project_vertex>
          `);
        };
        material.customProgramCacheKey = () => "sports-ground-paint-minimum-pixel-width-v2";
      }
      this.materials.set(key, material);
    }
    return this.materials.get(key)!;
  }
  add(g: THREE.BufferGeometry, colour: number, layer = 0) {
    const geo = g.index ? g.toNonIndexed() : g;
    if (geo !== g) g.dispose();
    geo.deleteAttribute("uv");
    const material = this.mat(colour, layer);
    this.batches.set(material, [...(this.batches.get(material) || []), geo]);
  }
  box(x: number, y: number, z: number, w: number, h: number, d: number, colour: number, solid = false) {
    const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y + h / 2, z); this.add(g, colour);
    if (solid) this.colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, minY: y, maxY: y + h });
  }
  beam(a: P, b: P, radius: number, colour: number) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b), delta = end.clone().sub(start);
    const g = new THREE.CylinderGeometry(radius, radius, delta.length(), 7);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()));
    g.translate(...start.add(end).multiplyScalar(0.5).toArray()); this.add(g, colour);
  }
  surface(points: Point[], colour: number, y = 0.065, layer: number = groundLayers.surface) {
    const shape = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
    const g = new THREE.ShapeGeometry(shape); g.rotateX(-Math.PI / 2); g.translate(0, y, 0); this.add(g, colour, layer);
  }
  decal(x: number, z: number, width: number, depth: number, colour: number, y: number, layer: number = groundLayers.stripe) {
    const g = new THREE.PlaneGeometry(width, depth); g.rotateX(-Math.PI / 2); g.translate(x, y, z); this.add(g, colour, layer);
  }
  paint(a: Point, b: Point, colour = colours.line, width = 0.12, y = 0.087) {
    const dx = b[0] - a[0], dz = b[1] - a[1], length = Math.hypot(dx, dz);
    const g = new THREE.PlaneGeometry(width, length + width * 0.15); g.rotateX(-Math.PI / 2);
    g.rotateY(Math.atan2(dx, dz)); g.translate((a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2);
    const positions = g.attributes.position, centers = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      centers[i * 3] = positions.getX(i) - side * width / 2 * dz / length;
      centers[i * 3 + 1] = positions.getY(i);
      centers[i * 3 + 2] = positions.getZ(i) + side * width / 2 * dx / length;
    }
    g.setAttribute("paintCenter", new THREE.BufferAttribute(centers, 3));
    this.add(g, colour, groundLayers.marking);
  }
  loop(points: Point[], colour = colours.line, width = 0.12, y = 0.087) {
    for (let i = 1; i < points.length; i++) this.paint(points[i - 1], points[i], colour, width, y);
  }
  rect(x: number, z: number, w: number, d: number, colour = colours.line) {
    this.loop([[x - w / 2, z - d / 2], [x + w / 2, z - d / 2], [x + w / 2, z + d / 2], [x - w / 2, z + d / 2], [x - w / 2, z - d / 2]], colour);
  }
  circle(x: number, z: number, radius: number, colour = colours.line, from = 0, to = Math.PI * 2) {
    this.loop(Array.from({ length: 65 }, (_, i) => [x + Math.cos(from + (to - from) * i / 64) * radius, z + Math.sin(from + (to - from) * i / 64) * radius] as Point), colour);
  }
  finish() {
    for (const [material, geometries] of this.batches) {
      const g = mergeGeometries(geometries); geometries.forEach((x) => x.dispose());
      if (g) {
        const mesh = new THREE.Mesh(g, material), layer = material.userData.groundLayer as number;
        mesh.name = material.name; mesh.castShadow = layer === 0; mesh.receiveShadow = true;
        if (layer === groundLayers.marking) mesh.onBeforeRender = (renderer) => renderer.getDrawingBufferSize(material.userData.paintViewport as THREE.Vector2);
        mesh.renderOrder = layer ? -10 + layer : 0; this.group.add(mesh);
      }
    }
    this.batches.clear(); return this.group;
  }
}

/** Canvas uses the browser's system typeface, not a third-party font or logo. */
function text(text: string, width: number, height: number, colour = "#f3f0df") {
  if (typeof document === "undefined") return new THREE.Group();
  const canvas = document.createElement("canvas"); canvas.width = 1024; canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 1024, 128); ctx.fillStyle = colour; ctx.font = "bold 88px Arial"; ctx.textBaseline = "middle"; ctx.textAlign = "center"; ctx.fillText(text, 512, 64, 1000);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.25, side: THREE.DoubleSide, depthWrite: false }));
}
function groundText(b: SportsBuilder, label: string, x: number, z: number, width: number, height: number, yaw = 0) {
  const mesh = text(label, width, height);
  if (mesh instanceof THREE.Mesh) {
    const material = mesh.material as THREE.MeshBasicMaterial;
    material.polygonOffset = true; material.polygonOffsetFactor = -groundLayers.label; material.polygonOffsetUnits = -groundLayers.label;
    material.name = "sports-ground-label"; material.userData.groundLayer = groundLayers.label;
  }
  mesh.rotation.set(-Math.PI / 2, 0, yaw); mesh.position.set(x, 0.11, z); b.group.add(mesh);
}
function goal(b: SportsBuilder, z: number, direction: number, x = 0, width = 7.32, height = 2.44) {
  const left = x - width / 2, right = x + width / 2, back = z + direction * 2.1;
  b.beam([left, 0, z], [left, height, z], 0.06, colours.line); b.beam([right, 0, z], [right, height, z], 0.06, colours.line); b.beam([left, height, z], [right, height, z], 0.06, colours.line);
  for (const edge of [left, right]) {
    b.beam([edge, height, z], [edge, height * 0.72, back], 0.035, colours.steel); b.beam([edge, 0, z], [edge, 0, back], 0.035, colours.steel); b.beam([edge, 0, back], [edge, height * 0.72, back], 0.035, colours.steel);
    b.colliders.push({ minX: edge - 0.07, maxX: edge + 0.07, minZ: z - 0.07, maxZ: z + 0.07, minY: 0, maxY: height });
  }
  for (let sx = left; sx <= right + 0.01; sx += 0.3) {
    b.beam([sx, 0.03, back], [sx, height * 0.72, back], 0.009, 0xd3d9ce);
    b.beam([sx, height * 0.72, back], [sx, height, z], 0.009, 0xd3d9ce);
  }
  for (let y = 0.05; y < height * 0.72; y += 0.3) b.beam([left, y, back], [right, y, back], 0.009, 0xd3d9ce);
  for (const edge of [left, right]) for (let t = 0; t <= 1; t += 0.2) b.beam([edge, 0.03, z + (back - z) * t], [edge, height * (1 - t * 0.28), z + (back - z) * t], 0.009, 0xd3d9ce);
}
function fence(b: SportsBuilder, a: Point, end: Point, height = 2.5) {
  const length = Math.hypot(end[0] - a[0], end[1] - a[1]), count = Math.ceil(length / 3);
  for (let i = 0; i <= count; i++) {
    const x = a[0] + (end[0] - a[0]) * i / count, z = a[1] + (end[1] - a[1]) * i / count;
    b.beam([x, 0, z], [x, height, z], 0.035, colours.fence);
  }
  for (let y = 0.15; y <= height; y += 0.38) b.beam([a[0], y, a[1]], [end[0], y, end[1]], 0.009, colours.fence);
  for (let i = 0; i < length / 0.5; i++) {
    const t = i / (length / 0.5), x = a[0] + (end[0] - a[0]) * t, z = a[1] + (end[1] - a[1]) * t;
    b.beam([x, 0.15, z], [x, height, z], 0.007, colours.fence);
  }
  b.colliders.push({ minX: Math.min(a[0], end[0]) - 0.04, maxX: Math.max(a[0], end[0]) + 0.04, minZ: Math.min(a[1], end[1]) - 0.04, maxZ: Math.max(a[1], end[1]) + 0.04, minY: 0, maxY: height });
}
function bleachers(b: SportsBuilder, x: number, z: number, rows: number, width: number, facing = 1) {
  for (let i = 0; i < rows; i++) {
    const sx = x + facing * i * 0.8, y = 0.45 + i * 0.37;
    b.box(sx, y, z, 0.4, 0.075, width, colours.steel, true);
    b.box(sx + facing * 0.23, y + 0.08, z, 0.07, 0.3, width, colours.steel, true);
    for (const sz of [-width / 2 + 0.5, width / 2 - 0.5]) b.beam([sx, 0, z + sz], [sx, y, z + sz], 0.045, colours.steel);
  }
}
function coveredBench(b: SportsBuilder, x: number, z: number) {
  b.box(x, 0.45, z, 0.5, 0.09, 8, colours.navy, true);
  b.box(x + 0.8, 0, z, 0.1, 2.2, 8.5, colours.steel, true);
  b.box(x, 2.2, z, 2, 0.13, 8.8, colours.navy);
  for (const dz of [-4.2, 4.2]) b.box(x, 0, z + dz, 2, 2.2, 0.08, colours.steel, true);
}
function floodPole(b: SportsBuilder, x: number, z: number, height: number) {
  b.beam([x, 0, z], [x, height, z], 0.11, colours.steel);
  b.box(x, height, z, 3.1, 0.25, 0.4, colours.steel);
  for (let i = 0; i < 5; i++) b.box(x - 1.3 + i * 0.65, height - 0.08, z + 0.26, 0.5, 0.34, 0.1, 0xe4e2c6);
}
function footballUpright(b: SportsBuilder, z: number) {
  b.beam([0, 0, z], [0, 3.05, z], 0.11, colours.yellow);
  b.beam([-2.82, 3.05, z], [2.82, 3.05, z], 0.075, colours.yellow);
  for (const x of [-2.82, 2.82]) b.beam([x, 3.05, z], [x, 8.4, z], 0.07, colours.yellow);
  b.box(0, 0, z, 0.55, 1.7, 0.55, colours.navy, true);
}
function runPose(p: Person, x: number, z: number, yaw: number, phase: number, running: boolean) {
  p.group.position.set(x, 0.08 + (running ? Math.abs(Math.sin(phase * 9)) * 0.045 : 0), z); p.group.rotation.y = yaw;
  p.legs.forEach((leg, i) => leg.rotation.x = running ? Math.sin(phase * 9 + i * Math.PI) * 0.68 : 0);
  p.arms.forEach((arm, i) => { arm.rotation.x = running ? -Math.sin(phase * 9 + i * Math.PI) * 0.48 - 0.15 : 0; });
}

/** Keep six articulated parts near the visitor and one quiet silhouette farther
 * away. Colours are baked into vertices; individual garments need no draw call.
 * The source person helper is shared with campus activity, not modified here.
 */
function athleteLOD(p: Person, material: THREE.MeshStandardMaterial) {
  const moving = new Set<THREE.Object3D>([p.head, ...p.legs, ...p.arms]);
  const oldMaterials = new Set<THREE.Material>();
  const tinted = (mesh: THREE.Mesh, transform: THREE.Matrix4) => {
    const m = mesh.material as THREE.MeshStandardMaterial;
    if (Array.isArray(mesh.material) || m.map || !m.color) return undefined;
    const geometry = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
    geometry.applyMatrix4(transform); geometry.deleteAttribute("uv");
    const colour = new Float32Array(geometry.attributes.position.count * 3);
    for (let i = 0; i < colour.length; i += 3) { colour[i] = m.color.r; colour[i + 1] = m.color.g; colour[i + 2] = m.color.b; }
    geometry.setAttribute("color", new THREE.BufferAttribute(colour, 3)); return geometry;
  };
  p.group.updateMatrixWorld(true);
  for (const root of [p.group, ...moving]) {
    const geometries: THREE.BufferGeometry[] = [], remove: THREE.Mesh[] = [], inverse = root.matrixWorld.clone().invert();
    const collect = (node: THREE.Object3D) => {
      for (const child of node.children) {
        if (moving.has(child)) continue;
        if (child instanceof THREE.Mesh) {
          const geometry = tinted(child, inverse.clone().multiply(child.matrixWorld));
          if (geometry) { geometries.push(geometry); remove.push(child); oldMaterials.add(child.material as THREE.Material); }
        } else collect(child);
      }
    };
    collect(root);
    const geometry = mergeGeometries(geometries);
    geometries.forEach((g) => g.dispose());
    if (geometry) {
      const mesh = new THREE.Mesh(geometry, material); mesh.castShadow = mesh.receiveShadow = true; root.add(mesh);
      remove.forEach((object) => { object.geometry.dispose(); object.removeFromParent(); });
    }
  }
  oldMaterials.forEach((m) => m.dispose());
  p.group.updateMatrixWorld(true);
  const inverse = p.group.matrixWorld.clone().invert(), geometries: THREE.BufferGeometry[] = [];
  p.group.traverse((mesh) => {
    if (!(mesh instanceof THREE.Mesh) || mesh.material !== material) return;
    geometries.push(mesh.geometry.clone().applyMatrix4(inverse.clone().multiply(mesh.matrixWorld)));
  });
  const far = new THREE.Mesh(mergeGeometries(geometries)!, material);
  geometries.forEach((g) => g.dispose()); far.name = "athlete-distant-silhouette"; far.castShadow = true;
  const near = [...p.group.children]; far.visible = false; p.group.add(far);
  return (distance: number) => {
    const detailed = distance < 55;
    near.forEach((object) => object.visible = detailed); far.visible = !detailed;
  };
}

export function createAthletics(data: CampusData, anchors: Anchors, blocked: (p: Point, y: number) => boolean) {
  const group = new THREE.Group(); group.name = "thunderbird-athletics-precinct";
  const interiors: Interior[] = [], venues: { id: string; group: THREE.Group; lights: THREE.PointLight[] }[] = [];
  const players: { person: Person; venue: string; base: Point; phase: number; index: number; lod: (distance: number) => void }[] = [];
  const soccer: { id: string; crowd: THREE.Group; ball: THREE.Mesh; width: number; length: number }[] = [];
  const joggers: { person: Person; lane: number; distance: number; speed: number; phase: number; lod: (distance: number) => void }[] = [];
  const athleteMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
  const attach = (id: string, b: SportsBuilder, entry: Point) => {
    const anchor = anchors[id] || athleticsAnchors[id];
    b.finish(); b.group.position.set(anchor.x, 0, anchor.z); b.group.rotation.y = anchor.yaw; b.group.userData.info = id;
    group.add(b.group);
    interiors.push({ anchor, colliders: b.colliders, floors: b.floors, ramps: b.ramps, entry });
    const lights = [-1, 1].map((sign) => {
      const light = new THREE.PointLight(0xffead1, 0, 190, 2); light.visible = false; light.position.set(sign * 35, 16, 0); b.group.add(light); return light;
    });
    venues.push({ id, group: b.group, lights }); return b.group;
  };

  for (const f of soccerFields) {
    const b = new SportsBuilder(), w = f.width, l = f.length;
    const surface = data.surfaces.find((s) => s.id === f.surfaceId);
    if (!surface) throw new Error(`Missing source field ${f.surfaceId}`);
    const anchor = anchors[f.id] || athleticsAnchors[f.id];
    b.surface(surface.rings[0].map((p) => local(p, anchor)), colours.grass);
    for (let i = 0; i < 14; i += 2) b.decal(0, -l / 2 + l / 14 * (i + 0.5), w, l / 14, colours.stripe, 0.073);
    b.rect(0, 0, w, l); b.paint([-w / 2, 0], [w / 2, 0]); b.circle(0, 0, 9.15); b.circle(0, 0, 0.14);
    for (const sign of [-1, 1]) {
      b.rect(0, sign * (l / 2 - 16.5 / 2), 40.32, 16.5); b.rect(0, sign * (l / 2 - 5.5 / 2), 18.32, 5.5);
      b.circle(0, sign * (l / 2 - 11), 0.13); goal(b, sign * l / 2, sign);
      for (const x of [-w / 2, w / 2]) { b.beam([x, 0, sign * l / 2], [x, 1.45, sign * l / 2], 0.018, colours.line); b.box(x + 0.15, 1.12, sign * l / 2, 0.3, 0.28, 0.015, colours.yellow); }
      const fx = f.sourceWidth / 2 - 0.3, fz = f.sourceLength / 2 - 0.3;
      const gate = sign < 0 && f.entryLocal[0] < 0 ? f.entryLocal[1] : 0;
      fence(b, [sign * fx, -fz], [sign * fx, gate - 3]); fence(b, [sign * fx, gate + 3], [sign * fx, fz]);
      fence(b, [-fx, sign * fz], [-3, sign * fz]); fence(b, [3, sign * fz], [fx, sign * fz]);
      for (const sx of [-1, 1]) floodPole(b, sx * (fx + 1.4), sign * (l / 2 - 12), 18);
    }
    coveredBench(b, w / 2 + 2, -13); coveredBench(b, w / 2 + 2, 13);
    if (f.id === "ken-woods") {
      bleachers(b, -w / 2 - 4.2, 0, 5, 20, -1);
      b.box(-w / 2 - 4, 3, -l / 2 + 5, 0.35, 3.3, 6, colours.navy);
      const score = text("KEN WOODS  •  SOCCER", 5.6, 0.45); score.position.set(-w / 2 - 3.8, 5.8, -l / 2 + 5); score.rotation.y = Math.PI / 2; b.group.add(score);
    }
    const sign = text(f.name.toUpperCase(), 7, 0.6); sign.position.set(w / 2 + 3, 1.9, 0); sign.rotation.y = Math.PI / 2; b.group.add(sign);
    const field = attach(f.id, b, [...f.entryLocal]);
    const crowd = new THREE.Group(); crowd.name = `${f.id}-fictional-practice`; field.add(crowd);
    for (let i = 0; i < 8; i++) {
      const colour = i < 4 ? "#244f79" : "#dfca6d";
      const p = person(`practice-${f.id}-${i}`, Math.floor(f.x) + i * 19, false, colour, { ...defaultAppearance, presentation: i % 3 === 0 ? "Feminine" : "Androgynous", skin: appearanceOptions.skin[i % appearanceOptions.skin.length], hair: appearanceOptions.hair[i % 6], hairstyle: i % 4 === 0 ? "Long" : "Short", outfit: "T-shirt", shirt: colour });
      delete p.group.userData.info; uniform(p, "soccer", i < 4 ? "#244f79" : "#dfca6d", String(i + 1));
      const base: Point = [((i % 4) - 1.5) * w * 0.18, (i < 4 ? -1 : 1) * (l * 0.2 + (i % 2) * l * 0.14)];
      runPose(p, base[0], base[1], i < 4 ? 0 : Math.PI, i, false); crowd.add(p.group);
      players.push({ person: p, venue: f.id, base, phase: i * 1.7, index: i, lod: athleteLOD(p, athleteMaterial) });
    }
    const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.115, 1), new THREE.MeshStandardMaterial({ color: 0xece8db, roughness: 0.76 })); ball.name = `${f.id}-practice-ball`; ball.castShadow = true; ball.position.set(-w * 0.27, 0.15, -l * 0.2 + 0.5); crowd.add(ball);
    soccer.push({ id: f.id, crowd, ball, width: w, length: l });
  }

  const track = new SportsBuilder(), ta = anchors["dhillon-track"] || athleticsAnchors["dhillon-track"];
  const outer = trackLayout.innerRadius + trackLayout.lanes * trackLayout.laneWidth;
  const trackSurface = data.surfaces.find((s) => s.id === trackLayout.surfaceId), infield = data.surfaces.find((s) => s.id === trackLayout.infieldId);
  if (!trackSurface || !infield) throw new Error("Missing official Dhillon track surfaces");
  track.surface(trackSurface.rings[0].map((p) => local(p, ta)), colours.rubber);
  track.surface(infield.rings[0].map((p) => local(p, ta)), colours.grass, 0.072, groundLayers.infield);
  for (let lane = 0; lane <= 8; lane++) track.loop(trackBoundary(trackLayout.innerRadius + lane * trackLayout.laneWidth), colours.line, 0.055, 0.092);
  const finishZ = trackLayout.straightLength / 2 - 7;
  track.paint([trackLayout.innerRadius, finishZ], [outer, finishZ], colours.line, 0.16);
  for (let lane = 1; lane <= 8; lane++) {
    const x = trackLayout.innerRadius + (lane - 0.5) * trackLayout.laneWidth;
    groundText(track, String(lane), x, finishZ + 3, 0.75, 1.45, 0);
    track.paint([x - 0.5, -18 + lane * 1.85], [x + 0.5, -18 + lane * 1.85], colours.yellow, 0.055);
  }
  // Publicly documented event facilities, interpreted positions within the
  // source track apron rather than an assertion of an exact meet configuration.
  track.decal(49.3, -18, 1.22, 40, 0x984e45, 0.085); track.decal(49.3, 7, 3.2, 8, 0xc2ad83, 0.105); track.rect(49.3, 7, 3.2, 8);
  track.circle(0, -77, 1.0675); track.box(0, 0.12, -75.9, 1.2, 0.14, 0.18, colours.line);
  track.decal(-31.5, -46, 3.66, 3.66, 0x668f9a, 0.08); track.beam([-33.33, 0.76, -47.7], [-29.67, 0.76, -47.7], 0.08, colours.line);
  bleachers(track, -outer - 3, 0, 7, 24, -1);
  const trackSign = text("RASHPAL DHILLON TRACK & FIELD", 12, 0.7); trackSign.rotation.y = Math.PI / 2; trackSign.position.set(-outer - 3, 2.5, 0); track.group.add(trackSign);
  for (const x of [-outer - 3, outer + 3]) for (const z of [-55, 55]) floodPole(track, x, z, 18);
  goal(track, 58, 1); goal(track, -45, -1);
  const trackGroup = attach("dhillon-track", track, [-outer - 3, -18]);
  const runners = new THREE.Group(); runners.name = "dhillon-fictional-joggers"; trackGroup.add(runners);
  for (let i = 0; i < 12; i++) {
    const colour = ["#9b5549", "#5c7c75", "#38567c", "#cfb871"][i % 4];
    const p = person(`track-jogger-${i}`, 330 + i * 13, false, colour, { ...defaultAppearance, presentation: i % 2 ? "Feminine" : "Masculine", skin: appearanceOptions.skin[i % appearanceOptions.skin.length], hair: appearanceOptions.hair[i % 6], hairstyle: i % 3 === 0 ? "Long" : "Short", outfit: "T-shirt", shirt: colour }); delete p.group.userData.info;
    // The shared phase starts one passing runner within the west arrival's
    // forward view; the golden-ratio offsets still spread the whole population.
    const lane = 2 + i % 6, distance = 14 + trackPoint(0, lane).length * ((i * 0.381966) % 1), point = trackPoint(distance, lane);
    runPose(p, point.x, point.z, point.yaw, i, false); runners.add(p.group);
    joggers.push({ person: p, lane, distance, speed: 2.3 + (i % 5) * 0.21, phase: i * 1.4, lod: athleteLOD(p, athleteMaterial) });
  }

  // Existing 1967 stadium, not the proposed replacement. Field and grandstand
  // share the source-aligned long axis; seating/fascia details are interpreted.
  const stadium = new SportsBuilder(), sw = 74.5, sl = 150, yard = 0.9144, gameLength = 110 * yard, gameWidth = 65 * yard;
  stadium.decal(0, 0, sw, sl, colours.grass, 0.072, groundLayers.surface);
  for (let i = 0; i < 22; i += 2) stadium.decal(0, -gameLength / 2 + (i + 0.5) * 5 * yard, gameWidth, 5 * yard, colours.stripe, 0.081);
  for (const side of [-1, 1]) {
    stadium.decal(0, side * (gameLength / 2 + 10 * yard), gameWidth, 20 * yard, colours.navy, 0.085);
    groundText(stadium, "THUNDERBIRDS", 0, side * (gameLength / 2 + 10 * yard), 43, 4.5, side < 0 ? 0 : Math.PI);
    footballUpright(stadium, side * gameLength / 2);
    goal(stadium, side * 52.5, side);
  }
  stadium.rect(0, 0, gameWidth, gameLength + 40 * yard);
  for (let i = 0; i <= 22; i++) {
    const z = -gameLength / 2 + i * 5 * yard; stadium.paint([-gameWidth / 2, z], [gameWidth / 2, z]);
    if (i > 0 && i < 22 && i % 2 === 0) for (const x of [-gameWidth / 2 + 6, gameWidth / 2 - 6]) groundText(stadium, String(Math.min(i * 5, 110 - i * 5)), x, z, 2.7, 1.7, x < 0 ? Math.PI / 2 : -Math.PI / 2);
  }
  for (let i = 1; i < 110; i++) for (const x of [-gameWidth / 2 + 0.65, -7.8, 7.8, gameWidth / 2 - 0.65]) stadium.paint([x - 0.4, -gameLength / 2 + i * yard], [x + 0.4, -gameLength / 2 + i * yard], colours.line, 0.08);
  stadium.rect(0, 0, 68, 105, colours.yellow); stadium.circle(0, 0, 9.15, colours.yellow); stadium.paint([-34, 0], [34, 0], colours.yellow);
  // Grandstand is on the east side; the public source footprint centre maps to
  // x≈66.6m in these local field coordinates.
  const aisles = [-40, -20, 0, 20, 40], sections: [number, number][] = [[-49, -41.2], [-38.8, -21.2], [-18.8, -1.2], [1.2, 18.8], [21.2, 38.8], [41.2, 49]];
  for (let row = 0; row < 24; row++) {
    const x = 50 + row, y = (x - 45) * 0.3;
    stadium.box(x + 0.5, 0, 0, 1, y, 100, colours.concrete);
    stadium.floors.push({ minX: x, maxX: x + 1, minZ: -50, maxZ: 50, y });
    for (const [a, b] of sections) {
      stadium.box(x + 0.65, y + 0.27, (a + b) / 2, 0.38, 0.075, b - a, row < 6 && Math.abs(a + b) < 40 ? 0x315e8d : 0x737f85, true);
      stadium.box(x + 0.82, y + 0.35, (a + b) / 2, 0.055, 0.27, b - a, 0x6c7c85);
    }
  }
  for (const z of aisles) {
    stadium.ramps.push({ minX: 45, maxX: 74, minZ: z - 1.15, maxZ: z + 1.15, fromY: 0, toY: 8.7, axis: "x" });
    for (let step = 0; step < 58; step++) stadium.box(45 + step * 0.5 + 0.25, 0, z, 0.5, (step + 1) * 0.15, 2.1, colours.concrete);
    for (let i = 0; i < 6; i++) stadium.beam([47 + i * 4.8, (2 + i * 4.8) * 0.3 + 0.15, z - 1], [47 + i * 4.8, (2 + i * 4.8) * 0.3 + 1.1, z - 1], 0.025, colours.steel);
    stadium.beam([46, 1.4, z - 1], [74, 9.8, z - 1], 0.03, colours.steel);
  }
  stadium.box(77, 8.55, 0, 6, 0.15, 104, colours.concrete); stadium.floors.push({ minX: 74, maxX: 80, minZ: -52, maxZ: 52, y: 8.7 });
  stadium.box(80, 8.7, 0, 0.35, 3.2, 104, colours.yellow, true);
  stadium.box(62, 12.4, 0, 39, 0.65, 107, colours.concrete);
  for (let z = -49; z <= 49; z += 8.16) {
    stadium.box(77.5, 0, z, 0.55, 12.4, 0.55, colours.concrete, true);
    stadium.beam([77.5, 11.8, z], [43.2, 12.25, z], 0.22, 0x535c58);
    stadium.box(77.5, 13, z, 0.35, 6.4, 0.35, 0xb7b2a4);
    // Abstract caps preserve the silhouette without reproducing carved artwork.
    stadium.box(77.5, 19.4, z, 0.65, 0.25, 0.55, 0x5b625c);
  }
  stadium.box(78, 8.7, 0, 3.6, 2.5, 16, 0x737b78, true);
  stadium.box(76.15, 9.5, 0, 0.05, 1.2, 15, 0x63828a);
  for (const z of [-48, 48]) stadium.box(62, 0, z, 32, 1.45, 0.22, colours.navy, true);
  const standName = text("UBC THUNDERBIRD STADIUM", 38, 1.2); standName.rotation.y = -Math.PI / 2; standName.position.set(42.45, 12.7, 0); stadium.group.add(standName);
  // Source-documented western grass embankment, with a traversable slope.
  const slope = new THREE.Shape([new THREE.Vector2(-85, 0), new THREE.Vector2(-85, 5), new THREE.Vector2(-70, 5), new THREE.Vector2(-42, 0)]);
  const bank = new THREE.ExtrudeGeometry(slope, { depth: 150, bevelEnabled: false, steps: 1 }); bank.translate(0, 0, -75); stadium.add(bank, 0x72824e);
  stadium.ramps.push({ minX: -70, maxX: -42, minZ: -75, maxZ: 75, fromY: 5, toY: 0, axis: "x" }); stadium.floors.push({ minX: -85, maxX: -70, minZ: -75, maxZ: 75, y: 5 });
  stadium.box(-57, 4.2, -78, 8.5, 4, 0.6, colours.navy); const board = text("UBC  •  THUNDERBIRDS", 7.6, 0.55); board.position.set(-57, 7.5, -77.65); stadium.group.add(board);
  for (const x of [-60, 42]) for (const z of [-67, 0, 67]) floodPole(stadium, x, z, 24);
  attach("thunderbird-stadium", stadium, [45, 0]);

  let time = 0;
  function update(dt: number, settings: Settings, pose: Pose) {
    const step = Math.max(0, Math.min(0.1, dt));
    if (!settings.reducedMotion) time += step;
    const night = settings.hour < 7 || settings.hour > 19.5;
    const range = settings.quality === "low" ? 120 : 230;
    for (const venue of venues) {
      const a = anchors[venue.id] || athleticsAnchors[venue.id], near = Math.hypot(pose.x - a.x, pose.z - a.z) < 230;
      venue.lights.forEach((light) => { light.visible = night && near; light.intensity = light.visible ? 2400 : 0; });
    }
    for (const field of soccer) {
      const a = anchors[field.id] || athleticsAnchors[field.id];
      field.crowd.visible = settings.population && Math.hypot(pose.x - a.x, pose.z - a.z) < range;
      if (!field.crowd.visible) continue;
      const team = players.filter((p) => p.venue === field.id);
      for (const actor of team) {
        const p = global([actor.person.group.position.x, actor.person.group.position.z], a);
        actor.lod(Math.hypot(pose.x - p[0], pose.z - p[1]));
      }
      if (settings.reducedMotion) continue;
      const phase = (time / 5) % 4, start = Math.floor(phase), t = phase - start;
      const from = team[start].person.group.position, to = team[(start + 1) % 4].person.group.position;
      field.ball.position.set(from.x + (to.x - from.x) * t, 0.15 + Math.sin(t * Math.PI) * 0.5, from.z + (to.z - from.z) * t + 0.5); field.ball.rotation.x = time * 4;
      for (const actor of team) {
        const x = actor.base[0] + Math.sin(time * 0.27 + actor.phase) * 2.2, z = actor.base[1] + Math.sin(time * 0.38 + actor.phase) * 3;
        const wp = global([x, z], a), moving = Math.hypot(pose.x - wp[0], pose.z - wp[1]) > 1.3 && !blocked(wp, 0);
        if (moving) runPose(actor.person, x, z, Math.atan2(field.ball.position.x - x, field.ball.position.z - z), time + actor.phase, true);
        else runPose(actor.person, actor.person.group.position.x, actor.person.group.position.z, actor.person.group.rotation.y, time, false);
        if (actor.index === start && t < 0.12) actor.person.legs[0].rotation.x = -Math.sin(t / 0.12 * Math.PI) * 1.15;
      }
    }
    runners.visible = settings.population && Math.hypot(pose.x - ta.x, pose.z - ta.z) < range + 60;
    if (runners.visible) for (const runner of joggers) {
      const p = trackPoint(runner.distance, runner.lane), wp = global([p.x, p.z], ta);
      runner.lod(Math.hypot(pose.x - wp[0], pose.z - wp[1]));
      const moving = !settings.reducedMotion && Math.hypot(pose.x - wp[0], pose.z - wp[1]) > 1.3 && !blocked(wp, 0);
      if (moving) runner.distance += step * runner.speed;
      const next = trackPoint(runner.distance, runner.lane);
      if (!settings.reducedMotion) runPose(runner.person, next.x, next.z, next.yaw, time + runner.phase, moving);
    }
  }
  return { group, interiors, venues, joggers, players, soccer, update };
}
