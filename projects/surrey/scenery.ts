// SPDX-License-Identifier: MIT — original procedural models; illustrative architectural detail.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

import { distance } from "./world";
import { seeded } from "./simulation";
import { landmarks } from "./landmarks";
import { storyLocations, witnesses, evidence as evidenceData } from "./story";
import type { City, Point, Polygon, Pose } from "./types";
import type { World } from "./world";

function shapeOf(polygon: Polygon) {
  const s = new THREE.Shape(
    polygon[0].map(([x, z]) => new THREE.Vector2(x, -z)),
  );
  s.holes = polygon
    .slice(1)
    .map((r) => new THREE.Path(r.map(([x, z]) => new THREE.Vector2(x, -z))));
  return s;
}
export function createPeople() {
  const geometry = {
    torso: new THREE.CylinderGeometry(.32, .38, .8, 8), head: new THREE.SphereGeometry(.27, 10, 7),
    hair: new THREE.SphereGeometry(.285, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2),
    limb: new THREE.CapsuleGeometry(.105, .5, 3, 6), foot: new THREE.BoxGeometry(.25, .14, .4),
    bag: new THREE.BoxGeometry(.56, .63, .28), eye: new THREE.BoxGeometry(.07, .055, .025),
  };
  const materials = new Map<number, THREE.MeshStandardMaterial>();
  const material = (color: number) => { if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .8 })); return materials.get(color)!; };
  return function person(color: number, backpack = false) {
    const group = new THREE.Group();
    function part(g: THREE.BufferGeometry, color: number, x: number, y: number, z: number) {
      const p = new THREE.Mesh(g, material(color)); p.position.set(x, y, z); p.castShadow = true; group.add(p); return p;
    }
    const skin = [0xc89673, 0x966948, 0xe1b99c, 0x714e3a][color % 4];
    part(geometry.torso, color, 0, 1.3, 0);
    part(geometry.head, skin, 0, 1.98, .015); part(geometry.hair, 0x273135, 0, 2.03, .01);
    part(geometry.eye, 0x253132, -.10, 2.02, .268); part(geometry.eye, 0x253132, .10, 2.02, .268);
    const legs = [-.18, .18].map(x => part(geometry.limb, 0x2d3c4b, x, .53, 0));
    const arms = [-.45, .45].map(x => part(geometry.limb, color, x, 1.28, 0));
    [-.18, .18].forEach(x => part(geometry.foot, 0xe0dfcf, x, .12, .065));
    const bag = part(geometry.bag, 0xed8d40, 0, 1.3, -.35); bag.visible = backpack;
    return { group, bag, animate(pose: Pick<Pose, "x" | "z" | "yaw" | "moving" | "running">, time: number, reduced = false) {
      group.position.set(pose.x, pose.moving && !reduced ? Math.abs(Math.sin(time * (pose.running ? 13 : 8))) * .045 : 0, pose.z); group.rotation.y = pose.yaw;
      const swing = pose.moving && !reduced ? Math.sin(time * (pose.running ? 13 : 8)) * (pose.running ? .7 : .4) : 0;
      legs[0].rotation.x = swing; legs[1].rotation.x = -swing; arms[0].rotation.x = -swing; arms[1].rotation.x = swing;
    } };
  };
}
export function buildScenery(scene: THREE.Scene, city: City, world: World) {
  const makePerson = createPeople();
  const rand = seeded(713),
    materials = new Map<number, THREE.MeshStandardMaterial>();
  const material = (color: number) => {
    if (!materials.has(color))
      materials.set(
        color,
        new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
      );
    return materials.get(color)!;
  };
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material) => {
    const o = new THREE.Mesh(g, m);
    o.receiveShadow = true;
    scene.add(o);
    return o;
  };
  const batch = (
    gs: THREE.BufferGeometry[],
    m: THREE.Material,
    shadow = false,
  ) => {
    if (!gs.length) return;
    const merged = mergeGeometries(gs);
    gs.forEach((g) => g.dispose());
    if (merged) {
      const o = mesh(merged, m);
      o.castShadow = shadow;
    }
  };
  function flat(polys: Polygon[], color: number, y: number) {
    if (!polys.length) return;
    const g = new THREE.ShapeGeometry(polys.map(shapeOf));
    g.rotateX(-Math.PI / 2);
    const o = mesh(g, material(color));
    o.position.y = y;
  }
  const [x0, z0, x1, z1] = city.bounds;
  const ground = mesh(
    new THREE.PlaneGeometry(x1 - x0, z1 - z0),
    material(0xa9b7a3),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set((x0 + x1) / 2, -0.04, (z0 + z1) / 2);
  flat(
    city.parks.map((p) => p.shape),
    0x6fa066,
    0.012,
  );
  flat(city.plazas, 0xcec6b4, 0.025);
  flat(city.pavement, 0x414f59, 0.04);
  flat(city.sidewalks, 0xddd4bf, 0.065);
  const windowCanvas = document.createElement("canvas");
  windowCanvas.width = 128;
  windowCanvas.height = 128;
  const ctx = windowCanvas.getContext("2d")!;
  ctx.fillStyle = "#ebeadf";
  ctx.fillRect(0, 0, 128, 128);
  for (let y = 6; y < 128; y += 32)
    for (let x = 6; x < 128; x += 32) {
      ctx.fillStyle = (x + y) % 3 ? "#69969f" : "#eedbac";
      ctx.fillRect(x, y, 19, 21);
      ctx.fillStyle = "#d0d7cd";
      ctx.fillRect(x + 9, y, 2, 21);
    }
  const windows = new THREE.CanvasTexture(windowCanvas);
  windows.wrapS = windows.wrapT = THREE.RepeatWrapping;
  windows.repeat.set(0.13, 0.13);
  windows.colorSpace = THREE.SRGBColorSpace;
  const palette = [0xd4d4bf, 0xd4b99b, 0x93b8c3, 0xaebfc6, 0xd3ab93, 0x8faaa5],
    buildings = palette.map(() => [] as THREE.BufferGeometry[]),
    roofs: THREE.BufferGeometry[] = [];
  city.buildings.forEach((b, i) => {
    const height = String(b.id) === "1665" ? 16 : b.height;
    const g = new THREE.ExtrudeGeometry(shapeOf(b.shape), {
      depth: height,
      bevelEnabled: false,
      steps: 1,
    });
    g.rotateX(-Math.PI / 2);
    buildings[i % palette.length].push(g);
    const roof = new THREE.ShapeGeometry(shapeOf(b.shape));
    roof.rotateX(-Math.PI / 2);
    roof.translate(0, height + 0.03, 0);
    roofs.push(roof);
  });
  buildings.forEach((gs, i) =>
    batch(
      gs,
      new THREE.MeshStandardMaterial({
        color: palette[i],
        map: windows,
        roughness: 0.7,
      }),
      true,
    ),
  );
  batch(roofs, material(0xb1c2bd));
  function box(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    yaw = 0,
  ) {
    const g = new THREE.BoxGeometry(w, h, d);
    g.rotateY(yaw);
    g.translate(x, y, z);
    return g;
  }
  function beam(a: Point, b: Point, y: number, width: number, height: number) {
    const dx = b[0] - a[0],
      dz = b[1] - a[1];
    return box(
      width,
      height,
      Math.hypot(dx, dz),
      (a[0] + b[0]) / 2,
      y,
      (a[1] + b[1]) / 2,
      Math.atan2(dx, dz),
    );
  }
  const markings: THREE.BufferGeometry[] = [],
    rails: THREE.BufferGeometry[] = [],
    pillars: THREE.BufferGeometry[] = [],
    lampPosts: THREE.BufferGeometry[] = [],
    lampHeads: THREE.BufferGeometry[] = [];
  for (const line of city.rail)
    for (let i = 1; i < line.length; i++) {
      rails.push(beam(line[i - 1], line[i], 8.2, 7, 1));
      if (i % 3 === 0)
        pillars.push(box(1.3, 8, 1.3, line[i][0], 4, line[i][1]));
    }
  batch(rails, material(0xc4c6bd), true);
  batch(pillars, material(0x9caaa4), true);
  const trees: Point[] = [];
  for (const road of city.roads)
    for (let i = 1; i < road.points.length; i++) {
      const a = road.points[i - 1],
        b = road.points[i],
        len = distance(a, b),
        dx = (b[0] - a[0]) / len,
        dz = (b[1] - a[1]) / len;
      for (let d = 6; d < len; d += 12)
        markings.push(
          beam(
            [a[0] + dx * d, a[1] + dz * d],
            [
              a[0] + dx * Math.min(d + 4, len),
              a[1] + dz * Math.min(d + 4, len),
            ],
            0.08,
            0.14,
            0.025,
          ),
        );
      for (let d = 12; d < len; d += 36) {
        const x = a[0] + dx * d - dz * (road.width / 2 + 4),
          z = a[1] + dz * d + dx * (road.width / 2 + 4);
        if (
          !world.fits([x, z]) ||
          Object.values(city.anchors).some((p) => distance(p, [x, z]) < 8)
        )
          continue;
        lampPosts.push(box(0.18, 5, 0.18, x, 2.5, z));
        lampHeads.push(box(1.2, 0.18, 0.4, x, 0.0 + 5, z));
        trees.push([x - dz * 3, z + dx * 3]);
      }
    }
  batch(markings, material(0xe4c571));
  batch(lampPosts, material(0x34444a));
  batch(lampHeads, material(0xf0dbb6));
  const crossings: THREE.BufferGeometry[] = [],
    signalPosts: THREE.BufferGeometry[] = [],
    signalLights: THREE.BufferGeometry[] = [];
  city.signals.forEach((p) => {
    signalPosts.push(box(0.2, 4, 0.2, p[0], 2, p[1]));
    signalPosts.push(box(0.45, 1.2, 0.4, p[0], 4, p[1]));
    signalLights.push(box(0.26, 0.26, 0.42, p[0], 4.2, p[1]));
    for (let i = -4; i <= 4; i++)
      crossings.push(box(1, 0.02, 3, p[0] + i * 1.8, 0.1, p[1] + 3));
  });
  batch(crossings, material(0xeee8d8));
  batch(signalPosts, material(0x2f4148));
  batch(signalLights, material(0xeaa65e));
  city.parks.forEach((p) => {
    const r = p.shape[0];
    for (let i = 0; i < r.length; i += 3)
      if (world.fits(r[i])) trees.push(r[i]);
  });
  const trunks = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.22, 0.33, 3, 5),
      material(0x826448),
      trees.length,
    ),
    leaves = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(2.6, 0),
      material(0x49865f),
      trees.length,
    );
  const dummy = new THREE.Object3D();
  trees.forEach((p, i) => {
    const s = 0.75 + rand() * 0.6;
    dummy.position.set(p[0], 1.5, p[1]);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    trunks.setMatrixAt(i, dummy.matrix);
    dummy.position.y = 4.4;
    dummy.scale.set(s, s * 1.15, s);
    dummy.updateMatrix();
    leaves.setMatrixAt(i, dummy.matrix);
    leaves.setColorAt(
      i,
      new THREE.Color().setHSL(
        0.22 + rand() * 0.12,
        0.28,
        0.38 + rand() * 0.16,
      ),
    );
  });
  trunks.castShadow = leaves.castShadow = true;
  scene.add(trunks, leaves);
  const labels: THREE.Sprite[] = [];
  function label(text: string, p: Point, y = 8, color = "#ecf0e3", width = 26) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 96;
    const cx = c.getContext("2d")!;
    cx.fillStyle = "#142c32";
    cx.fillRect(0, 0, 512, 96);
    cx.fillStyle = color;
    cx.font = "bold 30px sans-serif";
    cx.textAlign = "center";
    cx.fillText(text, 256, 59);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const o = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: t, depthTest: true }),
    );
    o.position.set(p[0], y, p[1]);
    o.scale.set(width, (width * 96) / 512, 1);
    scene.add(o);
    labels.push(o);
  }
  for (const place of landmarks(city)) label(place.name.toUpperCase(), place.point, place.height, "#e6efdf", 28);
  // Original geometric interpretations from cited public architecture references; no footprint edits.
  const glass = new THREE.MeshStandardMaterial({ color: 0x6097a8, roughness: .28, metalness: .25 });
  const tower = mesh(new THREE.CylinderGeometry(19, 21, 95, 18), glass);
  tower.scale.set(1, 1, .72); tower.position.set(37, 63.5, 180); tower.castShadow = true;
  const pale: THREE.BufferGeometry[] = [], dark: THREE.BufferGeometry[] = [], timber: THREE.BufferGeometry[] = [], blue: THREE.BufferGeometry[] = [];
  for (let y = 18; y < 110; y += 4.5) {
    const ring = new THREE.CylinderGeometry(19.2, 19.2, .35, 18); ring.scale(1, 1, .72); ring.translate(37, y, 180); pale.push(ring);
  }
  // Curved glazed atrium on the retained SFU podium, with timber-supported canopy.
  for (let i = 0; i < 14; i++) {
    const x = -114 + i * 12, z = 139 + Math.sin(i / 13 * Math.PI) * 8;
    blue.push(box(11, 12, .5, x, 7, z)); timber.push(box(.5, 13, .55, x, 6.5, z - .6));
    pale.push(box(12, .5, 6, x, 8, z - 1));
  }
  dark.push(box(130, .8, 67, -24, 35.1, -195));
  blue.push(box(112, 18, .6, -24, 13, -164.9));
  for (let y = 5; y < 22; y += 5) pale.push(box(55, .65, 78, -30, y, -128));
  for (let i = 0; i < 4; i++) { const rooflight = box(7, 2, 28, -45 + i * 10, 21, -123); pale.push(rooflight); }
  // Station platform, transparent-looking glazed hall, stair runs and open canopy.
  pale.push(box(12, .6, 70, 80, 8.9, 0));
  blue.push(box(16, .65, 66, 80, 13, 0));
  blue.push(box(.4, 10, 48, 74, 6, 0), box(.4, 10, 48, 86, 6, 0));
  for (let i = 0; i < 16; i++) pale.push(box(4, .55, 1, 70, .4 + i * .52, 20 - i));
  for (const z of [-28, -12, 12, 28]) dark.push(box(.4, 12, .4, 73, 6, z), box(.4, 12, .4, 87, 6, z));
  // Illustrative furniture and parked vehicles are kept away from quest interaction points.
  const seats: THREE.BufferGeometry[] = [], bins: THREE.BufferGeometry[] = [], cars: THREE.BufferGeometry[] = [], tires: THREE.BufferGeometry[] = [];
  const protectedPoints = [...Object.values(city.anchors), ...Object.values(storyLocations(city, world))];
  for (let i = 0; i < Math.min(trees.length, 100); i += 4) {
    const p = [trees[i][0] + 3, trees[i][1] + 2] as Point;
    if (!world.fits(p) || protectedPoints.some(q => distance(q, p) < 9)) continue;
    seats.push(box(2.2, .15, .65, p[0], .65, p[1]), box(2.2, .75, .14, p[0], 1, p[1] - .3));
    bins.push(box(.65, .9, .65, p[0] + 2, .45, p[1]));
    if (i % 12 === 0) {
      cars.push(box(1.8, .7, 4, p[0] - 6, .8, p[1]), box(1.6, .65, 2, p[0] - 6, 1.4, p[1]));
      for (const x of [-.9, .9]) for (const z of [-1.3, 1.3]) tires.push(box(.25, .6, .6, p[0] - 6 + x, .4, p[1] + z));
    }
  }
  // Bus loop: stationary generic buses and shelters, not branded replicas.
  for (const x of [30, 50]) {
    pale.push(box(2.8, 2.7, 11, x, 1.7, 72)); blue.push(box(2.85, 1, 8, x, 2.3, 72));
    dark.push(box(5, .3, 2.3, x, 3.3, 86), box(.12, 3, .12, x - 2, 1.5, 86), box(.12, 3, .12, x + 2, 1.5, 86));
  }
  label("BUS LOOP", [38, 76], 6, "#b8e7d3", 18);
  label("C17 · FICTIONAL EXHIBITION", [-75, 130], 7, "#f5cb83", 23);
  const holland = landmarks(city).find(p => p.id === "holland")!.point;
  const fountain = mesh(new THREE.CylinderGeometry(13, 14, .6, 24), material(0xbbbdae)); fountain.position.set(holland[0], .35, holland[1]);
  const water = mesh(new THREE.CircleGeometry(11.5, 24), material(0x65afbe)); water.rotation.x = -Math.PI / 2; water.position.set(holland[0], .67, holland[1]);
  for (let i = 0; i < 3; i++) { const ring = new THREE.TorusGeometry(19 + i * 3, .7, 4, 28, Math.PI); ring.rotateX(Math.PI / 2); ring.translate(holland[0], 1 + i * .35, holland[1] + 12); pale.push(ring); }
  const barriers: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 7; i++) barriers.push(box(2.5, 1, .35, -160 + i * 3.1, .6, -240));
  batch(pale, material(0xdadbd0), true); batch(dark, material(0x304950)); batch(timber, material(0xb18c5c)); batch(blue, glass, true);
  batch(seats, material(0x9f7f53)); batch(bins, material(0x405750)); batch(cars, material(0xb87e5e), true); batch(tires, material(0x263238)); batch(barriers, material(0xef9d52));
  const player = makePerson(0x2eaaa0),
    owner = makePerson(0xe5bc56),
    thief = makePerson(0x8d599a, true),
    sam = makePerson(0x9d7595),
    jo = makePerson(0x4b96b0),
    pickpocket = makePerson(0xb96352);
  [player, owner, thief, sam, jo, pickpocket].forEach((p) =>
    scene.add(p.group),
  );
  owner.group.position.set(
    ...([city.anchors.owner[0], 0, city.anchors.owner[1]] as [
      number,
      number,
      number,
    ]),
  );
  sam.group.position.set(
    city.anchors.community[0],
    0,
    city.anchors.community[1],
  );
  const joPoint = world.safe([
    city.anchors.community[0] - 2,
    city.anchors.community[1],
  ]);
  jo.group.position.set(joPoint[0], 0, joPoint[1]);
  const marker = mesh(
    new THREE.OctahedronGeometry(0.8),
    new THREE.MeshBasicMaterial({ color: 0xffcd65, depthTest: false }),
  );
  marker.renderOrder = 5;
  const ring = mesh(
    new THREE.RingGeometry(1.4, 1.7, 32),
    new THREE.MeshBasicMaterial({ color: 0xffcd65, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  const communityMarker = mesh(
    new THREE.OctahedronGeometry(0.6),
    material(0x60d9de),
  );
  communityMarker.position.set(
    city.anchors.community[0],
    3.4,
    city.anchors.community[1],
  );
  const clue = mesh(new THREE.BoxGeometry(0.55, 0.05, 0.7), material(0xffdc6b));
  clue.position.set(city.anchors.clue[0], 0.15, city.anchors.clue[1]);
  const mystery = mesh(
    new THREE.BoxGeometry(0.8, 0.65, 0.6),
    material(0x4e6579),
  );
  mystery.position.set(city.anchors.mystery[0], 0.4, city.anchors.mystery[1]);
  const youCanvas = document.createElement("canvas"); youCanvas.width = youCanvas.height = 128;
  const youContext = youCanvas.getContext("2d")!; youContext.fillStyle = "#f8f4db"; youContext.beginPath(); youContext.arc(64, 64, 58, 0, Math.PI * 2); youContext.fill();
  youContext.fillStyle = "#186c87"; youContext.beginPath(); youContext.arc(64, 64, 48, 0, Math.PI * 2); youContext.fill();
  youContext.fillStyle = "white"; youContext.font = "bold 29px sans-serif"; youContext.textAlign = "center"; youContext.fillText("YOU", 64, 74);
  const youTexture = new THREE.CanvasTexture(youCanvas); youTexture.colorSpace = THREE.SRGBColorSpace;
  const you = new THREE.Sprite(new THREE.SpriteMaterial({ map: youTexture, depthTest: false, depthWrite: false })); you.renderOrder = 10; scene.add(you);
  const waypoint = mesh(new THREE.OctahedronGeometry(.7), new THREE.MeshBasicMaterial({ color: 0x78e3ef, depthTest: false })); waypoint.visible = false;
  const encounter = makePerson(0xce8a72, true); scene.add(encounter.group); encounter.group.visible = false;
  const encounterMarker = mesh(new THREE.OctahedronGeometry(.5), new THREE.MeshBasicMaterial({ color: 0xf69b8c, depthTest: false })); encounterMarker.visible = false;
  const story = storyLocations(city, world), evidence = new Map<string, THREE.Mesh>(), witnessMarkers: THREE.Mesh[] = [];
  witnesses.forEach((w, i) => {
    const actor = makePerson([0x8e85c7, 0x4c8c8a, 0xd99c62][i]); actor.group.position.set(story[w.id][0], 0, story[w.id][1]); scene.add(actor.group);
    const marker = mesh(new THREE.OctahedronGeometry(.42), new THREE.MeshBasicMaterial({ color: 0xcfadef, depthTest: false })); marker.position.set(story[w.id][0], 3, story[w.id][1]); witnessMarkers.push(marker);
  });
  evidenceData.forEach(e => { if (e.id === "watch") return; const p = story[e.id]; const object = mesh(new THREE.BoxGeometry(.7, .2, .55), material(e.id === "paint" ? 0xb5584e : 0xe8d496)); object.position.set(p[0], .22, p[1]); evidence.set(e.id, object); });
  const sceneRing = mesh(new THREE.RingGeometry(2.4, 2.7, 24), new THREE.MeshBasicMaterial({ color: 0xc8a2ed, side: THREE.DoubleSide })); sceneRing.rotation.x = -Math.PI / 2; sceneRing.position.set(story.scene[0], .13, story.scene[1]);
  return { player, owner, thief, pickpocket, marker, ring, labels, makePerson, you, waypoint, encounter, encounterMarker, evidence, witnessMarkers };
}
