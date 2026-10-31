// SPDX-License-Identifier: MIT
// One representative open-house floor. Never actual student rooms or assignments.
import * as THREE from "three";
import { ResidenceMesh } from "./residence-mesh";
import { createDoors } from "./doors";
import {
  orchardRooms,
  orchardBathrooms,
  orchardDoorDefinitions,
  residenceFloor as level,
  roomEntry,
  type ResidenceRoom,
} from "./residence-layout";
import type { Point, Settings } from "./types";
import type { Floor } from "./spatial";

function disposeGroup(group: THREE.Group) {
  const geometries = new Set<THREE.BufferGeometry>(),
    materials = new Set<THREE.Material>(),
    textures = new Set<THREE.Texture>();
  group.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      geometries.add(o.geometry);
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        materials.add(m);
        for (const v of Object.values(m))
          if (v instanceof THREE.Texture) textures.add(v);
      }
    }
  });
  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
  textures.forEach((t) => t.dispose());
  group.removeFromParent();
}
function furnishRoom(room: ResidenceRoom, seed: number) {
  const b = new ResidenceMesh(),
    centre = (room.minX + room.maxX) / 2,
    s = room.side;
  if (room.beds === 1) {
    b.bed(room.minX + 0.68, s * 6.7, level, room.colour);
    b.desk(room.maxX - 0.75, s * 7.9, level, room.colour);
    b.wardrobe(room.maxX - 0.6, s * 2.2, level);
    b.books(room.minX + 0.55, s * 2.4, level, seed);
  } else {
    for (const [i, x] of [room.minX + 0.65, room.maxX - 0.65].entries()) {
      b.bed(x, -4.1, level, i ? "ochre" : room.colour);
      b.desk(x + (i ? -0.08 : 0.08), -2.02, level, i ? "ochre" : room.colour);
    }
    b.wardrobe(room.maxX - 0.62, -7.8, level);
  }
  b.box(
    "wood",
    centre,
    level + 2.55,
    s * 8.36,
    room.maxX - room.minX - 0.35,
    0.1,
    0.16,
  );
  for (let i = 0; i < 14; i++)
    b.box(
      "linen",
      room.minX + 0.3 + (i * (room.maxX - room.minX - 0.6)) / 14,
      level + 1.6,
      s * 8.37,
      0.08,
      1.75,
      0.06,
    );
  b.box(room.colour, centre, level + 0.015, s * 4.8, 1.25, 0.025, 1.55);
  b.box(
    room.colour,
    room.maxX - 0.35,
    level + 0.26,
    s * 5.5,
    0.29,
    0.5,
    0.22,
    true,
  );
  b.round("metal", room.maxX - 0.35, level + 0.12, s * 5.18, 0.08, 0.23);
  // Original educational prints and deterministic props; no brands or real student data.
  const poster = b.sign(
    [
      "SCIENCE\nASK · TEST · LEARN",
      "ENGINEERING\nDESIGN · BUILD · REFINE",
      "BUSINESS\nIDEAS INTO ACTION",
      "COMPUTER SCIENCE\nCREATE · DEBUG · EXPLORE",
      "STUDENT ATHLETE\nPRACTICE & RECOVERY",
      "MUSIC\nLISTEN · COMPOSE · PLAY",
      "SHARED SPACE\nYOUR SIDE / MY SIDE",
      "ROOMMATES\nMAKE ROOM FOR EACH OTHER",
    ][seed],
    room.minX + 0.07,
    level + 1.75,
    s * 6,
    0.85,
    0.65,
    Math.PI / 2,
  );
  poster.userData.representative = true;
  if (room.id === "b")
    for (const dx of [-0.14, 0.14])
      b.box(
        "ochre",
        room.maxX - 0.75 + dx,
        level + 1,
        s * 7.9 + 0.12,
        0.1,
        0.35,
        0.1,
      );
  if (room.id === "e") {
    b.cushion("wood", centre, level + 0.2, -7.6, 0.28, 0.25, 0.27);
    b.box("navy", centre + 0.45, level + 0.16, -7.6, 0.55, 0.3, 0.28);
  }
  if (room.id === "f") {
    b.box("black", centre, level + 0.8, -6, 0.9, 0.06, 0.24);
    for (let k = 0; k < 16; k++)
      b.box(
        "linen",
        centre - 0.41 + k * 0.054,
        level + 0.84,
        -5.98,
        0.045,
        0.015,
        0.18,
      );
  }
  b.light(centre, s * 5.6, level + 2.68, true);
  return b.finish();
}
export function buildResidence() {
  const b = new ResidenceMesh(),
    doors = createDoors(orchardDoorDefinitions());
  const floor = level;
  // Envelope remains inside the GIS Bartlett section. Only the courtyard vestibule extends to the source entrance.
  b.floor(-18, 18, -9, 9, 0, "tile");
  b.floor(-1.7, 1.7, 9, 12.25, 0, "tile");
  for (const x of [-1.7, 1.7]) b.wall(x, 10.6, 0.12, 3.2, 0, 3.2);
  b.box("wood", 0, 3.15, 10.6, 3.5, 0.15, 3.2);
  // Floor slab leaves independent openings for the stairs and moving lift.
  b.floor(-18, 10, -9, 9, floor);
  b.floor(10, 18, -9, -4.8, floor);
  b.floor(10, 12.3, -4.8, 3.6, floor);
  b.floor(15, 18, -4.8, 3.6, floor);
  b.floor(12.3, 15, -2.3, 3.6, floor);
  b.floor(10, 18, 6.5, 9, floor);
  b.floor(17, 18, 3.6, 6.5, floor);
  // Perimeter glazing and a solid guard below each window.
  for (const y of [0, floor]) {
    for (const z of [-9, 9]) {
      const ranges =
        y === 0 && z === 9
          ? [
              [-18, -1.7],
              [1.7, 18],
            ]
          : [[-18, 18]];
      for (const [x1, x2] of ranges) {
        b.wall((x1 + x2) / 2, z, x2 - x1, 0.16, y, 0.7, "concrete");
        b.wall((x1 + x2) / 2, z, x2 - x1, 0.16, y + 2.4, 0.65);
        for (let x = x1 + 1.5; x < x2; x += 3)
          b.window(x, z, Math.min(2.9, x2 - x + 1.4), y);
        // Full-height invisible barrier matches the solid glass, without opaque window infill.
        b.colliders.push({
          minX: x1,
          maxX: x2,
          minZ: z - 0.09,
          maxZ: z + 0.09,
          minY: y,
          maxY: y + 3.1,
        });
      }
    }
    for (const x of [-18, 18]) {
      b.wall(x, 0, 0.16, 18, y, 3.1);
    }
  }
  b.box("plaster", 0, floor + 3, 0, 36, 0.18, 18);
  b.box("plaster", -4, 3.1, 0, 28, 0.13, 18);
  // Lobby: source confirms a front desk, but this foyer's arrangement is illustrative.
  b.box("wood", -5, 0.55, 6, 3.2, 1.1, 0.8, true);
  b.box("oak", -5, 1.13, 6, 3.35, 0.06, 0.9);
  b.box("black", -5.6, 1.36, 6, 0.5, 0.36, 0.04);
  b.sign("WELCOME TO ORCHARD", -5, 1.8, 5.9, 3.4, 0.42);
  b.sign(
    "REPRESENTATIVE OPEN HOUSE\nEight bedrooms · Lounge · Study · Shared bathrooms",
    3.8,
    1.6,
    7.8,
    3,
    0.75,
    0,
    "orchard-life",
  );
  b.sign("LIFT & STAIRS →", 8.2, 2.45, 2.8, 2.6, 0.4);
  b.sign("EXIT TO COURTYARD", 0, 2.65, 8.85, 2.8, 0.32, Math.PI);
  b.sofa(-10, 4, 0);
  b.sofa(-10, 0, 0, "rust");
  b.box("oak", -10, 0.42, 2, 1.4, 0.08, 0.75, true);
  for (const x of [-15, -11, -7, -3, 1, 5, 9])
    for (const z of [-6, 1, 7]) b.light(x, z, 2.9, false);
  for (const x of [-10, 7]) b.light(x, 5, 2.9, true);
  // Short internal public tour stair; not an assertion of the actual floor assignment.
  const ramp = {
    minX: 10,
    maxX: 17,
    minZ: 3.85,
    maxZ: 6.25,
    fromY: 0,
    toY: floor,
    axis: "x" as const,
  };
  b.ramps.push(ramp);
  for (let i = 0; i < 20; i++)
    b.box(
      "wood",
      10 + ((i + 0.5) * 7) / 20,
      ((i + 1) * floor) / 20 - 0.08,
      5.05,
      7 / 20 + 0.015,
      0.16,
      2.4,
    );
  for (const z of [3.7, 6.4]) {
    for (let i = 0; i < 20; i++)
      b.box(
        "metal",
        10 + (i * 7) / 19,
        (floor * i) / 19 + 0.52,
        z,
        0.035,
        1.04,
        0.035,
      );
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, Math.hypot(7, floor), 8),
      b.materials.metal,
    );
    rail.position.set(13.5, floor / 2 + 1.05, z);
    rail.rotation.z = -Math.atan2(7, floor);
    b.group.add(rail);
    // Side guard prevents stepping laterally off the ramp.
    b.colliders.push({
      minX: 9.85,
      maxX: 16.7,
      minZ: z - 0.03,
      maxZ: z + 0.03,
      minY: 0,
      maxY: floor + 1.1,
    });
  }
  b.sign(
    "DEMONSTRATION FLOOR\nRooms A–H ←   Lounge & Study ←",
    16.9,
    floor + 1.7,
    7.8,
    2.5,
    0.6,
  );
  // Corridor entrance doors: every labelled bedroom and bathroom leaf operates.
  for (const room of orchardRooms) {
    const entry = roomEntry(room),
      z = room.side * 1.35;
    b.wall(
      (room.minX + entry[0] - 0.55) / 2,
      z,
      entry[0] - 0.55 - room.minX,
      0.14,
      floor,
    );
    b.wall(
      (room.maxX + entry[0] + 0.55) / 2,
      z,
      room.maxX - entry[0] - 0.55,
      0.14,
      floor,
    );
    b.wall(entry[0], z, 1.12, 0.14, floor + 2.13, 0.67);
    b.sign(
      `${room.name} · ${room.interest}`,
      entry[0],
      floor + 2.46,
      z - room.side * 0.09,
      2.5,
      0.26,
      room.side === 1 ? Math.PI : 0,
    );
    const low = room.side === 1 ? 1.35 : -8.6,
      high = room.side === 1 ? 8.6 : -1.35;
    for (const x of [room.minX, room.maxX]) {
      const bath = orchardBathrooms.find(
        (bath) =>
          bath.rooms.length === 2 &&
          bath.rooms.includes(room.id) &&
          (Math.abs(bath.minX - x) < 0.01 || Math.abs(bath.maxX - x) < 0.01),
      );
      if (bath) {
        const mid = (bath.minZ + bath.maxZ) / 2;
        b.wall(x, (low + mid - 0.5) / 2, 0.13, mid - 0.5 - low, floor);
        b.wall(x, (high + mid + 0.5) / 2, 0.13, high - mid - 0.5, floor);
        b.wall(x, mid, 0.13, 1, floor + 2.13, 0.67);
      } else b.wall(x, (low + high) / 2, 0.13, high - low, floor);
    }
    b.wall(entry[0], room.side * 8.6, room.maxX - room.minX, 0.14, floor, 0.7);
    b.wall(
      entry[0],
      room.side * 8.6,
      room.maxX - room.minX,
      0.14,
      floor + 2.4,
      0.4,
    );
    b.window(entry[0], room.side * 8.6, room.maxX - room.minX - 0.25, floor);
    b.floor(room.minX, room.maxX, low, high, floor + 0.012, "wood");
    b.light(entry[0], room.side * 2.4, floor + 2.7);
  }
  for (const bath of orchardBathrooms) {
    const cx = (bath.minX + bath.maxX) / 2,
      cz = (bath.minZ + bath.maxZ) / 2;
    b.floor(bath.minX, bath.maxX, bath.minZ, bath.maxZ, floor + 0.018, "tile");
    for (const z of [bath.minZ, bath.maxZ]) {
      if (bath.rooms.length === 1 && z === bath.maxZ) {
        b.wall(
          (bath.minX + cx - 0.5) / 2,
          z,
          cx - 0.5 - bath.minX,
          0.12,
          floor,
        );
        b.wall(
          (bath.maxX + cx + 0.5) / 2,
          z,
          bath.maxX - cx - 0.5,
          0.12,
          floor,
        );
        b.wall(cx, z, 1, 0.12, floor + 2.13, 0.67);
      } else b.wall(cx, z, bath.maxX - bath.minX, 0.12, floor);
    }
    if (bath.rooms.length === 1)
      b.wall(bath.maxX, cz, 0.12, bath.maxZ - bath.minZ, floor);
    // Shower tray, screen, sanitary fixtures and mirror: room relationships are explicit.
    b.box(
      "linen",
      bath.minX + 0.47,
      floor + 0.08,
      bath.minZ + 0.5,
      0.78,
      0.15,
      0.86,
      true,
    );
    b.box(
      "glass",
      bath.minX + 0.88,
      floor + 1.03,
      bath.minZ + 0.5,
      0.025,
      1.9,
      0.85,
    );
    b.round(
      "metal",
      bath.minX + 0.25,
      floor + 1.95,
      bath.minZ + 0.17,
      0.09,
      0.025,
    );
    b.box(
      "linen",
      bath.maxX - 0.36,
      floor + 0.42,
      bath.minZ + 0.65,
      0.46,
      0.8,
      0.3,
      true,
    );
    b.cushion(
      "linen",
      bath.maxX - 0.36,
      floor + 0.42,
      bath.minZ + 0.95,
      0.48,
      0.12,
      0.65,
    );
    const sinkX = bath.rooms.length === 1 ? bath.maxX - 0.27 : cx;
    const sinkZ = bath.maxZ - 0.35;
    const sinkWidth = bath.rooms.length === 1 ? 0.45 : 0.7;
    b.box("oak", sinkX, floor + 0.42, sinkZ, sinkWidth, 0.8, 0.38, true);
    b.cushion("linen", sinkX, floor + 0.85, sinkZ, sinkWidth + 0.02, 0.1, 0.43);
    b.box("glass", sinkX, floor + 1.5, bath.maxZ - 0.08, sinkWidth, 0.65, 0.02);
    b.light(cx, cz, floor + 2.68);
    b.sign(
      bath.rooms.length === 2
        ? `SHARED BY ${bath.rooms.join(" & ").toUpperCase()}`
        : `ROOM ${bath.id.toUpperCase()} · SHARED PRIVATE BATH`,
      cx,
      floor + 2.35,
      bath.maxZ - 0.08,
      1.5,
      0.24,
      Math.PI,
    );
    if (bath.rooms.length === 2) {
      // Seal unused service-width bays, not decorative extra room doors.
      const s = bath.minZ > 0 ? 1 : -1;
      b.wall(cx, s * 1.35, bath.maxX - bath.minX, 0.14, floor);
    }
  }
  // End lounge with snack kitchen, generous glazing, timber slats and a separate study area.
  b.sofa(4, 6, floor);
  b.sofa(7, 6, floor, "rust");
  b.box("oak", 5.5, floor + 0.4, 4.5, 2, 0.08, 0.8, true);
  b.box("ochre", 5.5, floor + 0.01, 4.8, 5.6, 0.025, 3.7);
  b.box("wood", 3.5, floor + 0.47, 8.15, 4.8, 0.9, 0.65, true);
  b.box("tile", 3.5, floor + 0.96, 8.15, 4.9, 0.07, 0.7);
  b.box("metal", 1.6, floor + 1.2, 8.15, 0.66, 0.42, 0.48);
  b.box("black", 1.6, floor + 1.2, 7.9, 0.52, 0.26, 0.015);
  b.box("linen", 6.4, floor + 0.85, 8.1, 0.7, 1.7, 0.7, true);
  b.round("metal", 4.5, floor + 1.1, 8.1, 0.02, 0.28);
  b.box("metal", 4.5, floor + 0.99, 8.1, 0.6, 0.03, 0.4);
  for (let x = 1; x < 10; x += 0.22)
    b.box("wood", x, floor + 2.86, 5, 0.075, 0.1, 7.7);
  b.sign(
    "FLOOR LOUNGE · SNACK KITCHEN",
    5.4,
    floor + 2.35,
    8.5,
    5.4,
    0.4,
    0,
    "orchard-facilities",
  );
  for (const x of [3, 7]) {
    b.box("oak", x, floor + 0.75, -5, 1.65, 0.07, 1.1, true);
    for (const dx of [-0.65, 0.65])
      for (const dz of [-0.4, 0.4])
        b.box("metal", x + dx, floor + 0.36, -5 + dz, 0.045, 0.72, 0.045);
    b.chair(x, -4, floor);
    b.chair(x, -6, floor, Math.PI);
    b.box("navy", x + 0.35, floor + 0.81, -5, 0.24, 0.03, 0.33);
  }
  b.books(3, -8.25, floor, 3);
  b.books(6, -8.25, floor, 6);
  b.sign(
    "STUDY TOGETHER",
    5.5,
    floor + 2.3,
    -8.5,
    3.7,
    0.5,
    0,
    "orchard-study",
  );
  for (const x of [-15, -9, -3, 5, 15])
    b.light(x, 0, floor + 2.7, x === -9 || x === 5);
  b.light(5, 5, floor + 2.75, true);
  b.light(5, -5, floor + 2.75, true);
  b.sign("A–D →\nE–H →", -17.8, floor + 1.8, 0, 1, 0.6, Math.PI / 2);
  b.sign(
    "ROOMS A–H ←\nLOUNGE & STUDY ←",
    10,
    floor + 1.8,
    0,
    1.5,
    0.6,
    -Math.PI / 2,
  );
  // Compact platform lift. Movement is continuous and carries a standing visitor.
  const liftGroup = new THREE.Group(),
    liftFloor: Floor = { minX: 12.4, maxX: 14.9, minZ: -4.7, maxZ: -2.3, y: 0 };
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.12, 2.4),
    b.materials.tile,
  );
  platform.position.set(13.65, -0.06, -3.5);
  liftGroup.add(platform);
  for (const x of [12.4, 14.9])
    b.wall(x, -3.5, 0.12, 2.6, 0, floor + 2.8, "glass");
  b.wall(13.65, -4.75, 2.6, 0.12, 0, floor + 2.8, "glass");
  for (const y of [0, floor])
    b.sign(
      "CALL LIFT",
      15.3,
      y + 1.1,
      -2.2,
      0.65,
      0.4,
      0,
      y ? "lift-upper" : "lift-lobby",
    );
  const liftButton = b.sign(
    "RIDE LIFT",
    13.65,
    1.15,
    -4.65,
    0.9,
    0.45,
    0,
    "lift-ride",
  );
  liftGroup.attach(liftButton);
  b.group.add(liftGroup);
  b.floors.push(liftFloor);
  b.group.add(doors.group);
  b.finish();
  let liftTarget = 0,
    liftY = 0;
  let liftThresholdOccupied = false,
    liftRider = false;
  const rooms = new Map<string, ReturnType<typeof furnishRoom>>(),
    registered = new Set<string>();
  function ensureRoom(id: string) {
    if (rooms.has(id)) return;
    const index = orchardRooms.findIndex((r) => r.id === id);
    if (index < 0) return;
    const asset = furnishRoom(orchardRooms[index], index);
    rooms.set(id, asset);
    b.group.add(asset.group);
    if (!registered.has(id)) {
      b.colliders.push(...asset.colliders);
      registered.add(id);
    }
  }
  function interact(id: string) {
    if (id === "lift-lobby") liftTarget = 0;
    else if (id === "lift-upper") liftTarget = floor;
    else if (id === "lift-ride") liftTarget = liftTarget > 0 ? 0 : floor;
    else {
      const d = doors.doors.find((d) => d.id === id);
      if (!d) return false;
      if (id.startsWith("door-room-")) ensureRoom(id.slice(10));
      doors.toggle(id);
    }
    return true;
  }
  const onLift = (p: Point) =>
    p[0] > 12.65 && p[0] < 14.65 && p[1] > -4.45 && p[1] < -2.7;
  function update(dt: number, p: Point, y: number, settings: Settings) {
    doors.update(dt, p, y, settings.reducedMotion);
    const before = liftY,
      rider = onLift(p) && Math.abs(y - before) < 0.15;
    liftRider = rider;
    const entering =
      p[0] > 12.1 &&
      p[0] < 15.2 &&
      p[1] > -2.65 &&
      p[1] < -1.85 &&
      Math.abs(y - before) < 0.2 &&
      Math.abs(liftTarget - y) > 0.2;
    // Arriving at an occupied landing must complete. Departing waits for the
    // threshold to clear, with the gate open so the visitor can board or retreat.
    liftThresholdOccupied = entering;
    if (!entering)
      liftY +=
        Math.sign(liftTarget - liftY) *
        Math.min(Math.abs(liftTarget - liftY), dt * 0.9);
    liftFloor.y = liftY;
    liftGroup.position.y = liftY;
    for (const room of orchardRooms) {
      const distance = Math.hypot(
        p[0] - roomEntry(room)[0],
        p[1] - roomEntry(room)[1],
      );
      if (distance < 12 && Math.abs(y - floor) < 1) ensureRoom(room.id);
      const asset = rooms.get(room.id);
      if (asset) {
        asset.group.visible =
          distance < (settings.quality === "low" ? 16 : 30) && y > 2;
        if (distance > 90) {
          disposeGroup(asset.group);
          rooms.delete(room.id);
        }
      }
    }
    const lights: THREE.PointLight[] = [];
    b.group.traverse((o) => {
      if (o instanceof THREE.PointLight) lights.push(o);
    });
    const nearest = lights
      .map((light) => ({
        light,
        d: Math.hypot(
          light.position.x - p[0],
          light.position.y - y - 1.6,
          light.position.z - p[1],
        ),
      }))
      .sort((a, b) => a.d - b.d);
    nearest.forEach(({ light, d }, i) => {
      light.visible = i < (settings.quality === "low" ? 2 : 4) && d < 14;
    });
    return rider ? liftY - before : 0;
  }
  function dynamicBlocked(p: Point, y: number) {
    if (doors.blocked(p, y)) return true;
    // Lift entrance closes while travelling or when the cabin is on the other floor.
    if (
      p[0] > 12.1 &&
      p[0] < 15.2 &&
      p[1] > -2.6 &&
      p[1] < -2 &&
      !liftThresholdOccupied &&
      (Math.abs(liftY - y) > 0.15 || Math.abs(liftY - liftTarget) > 0.01)
    )
      return true;
    return false;
  }
  function interactions() {
    return [
      ...doors.interactions(),
      {
        id: "lift-lobby",
        name: "Call lift to lobby",
        x: 15.3,
        y: 1.1,
        z: -2.2,
      },
      {
        id: "lift-upper",
        name: "Call lift to demonstration floor",
        x: 15.3,
        y: floor + 1.1,
        z: -2.2,
      },
      ...(liftRider
        ? [
            {
              id: "lift-ride",
              name:
                liftTarget > 0
                  ? "Ride lift to lobby"
                  : "Ride lift to demonstration floor",
              x: 13.65,
              y: liftY + 1.15,
              z: -4.65,
            },
          ]
        : []),
    ];
  }
  function location(p: Point, y: number) {
    if (y < 2) return "Orchard Commons · Lobby · Representative reconstruction";
    const room = orchardRooms.find(
      (r) => p[0] > r.minX && p[0] < r.maxX && p[1] * r.side > 1.35,
    );
    if (room)
      return `${room.name} · ${room.type === "shared-double" ? "Shared double" : "Connected single"} · Fictional demonstration`;
    return "Orchard Commons · Demonstration floor · Rooms A–H";
  }
  function canSee(from: Point, to: Point, eyeY: number) {
    const distance = Math.hypot(to[0] - from[0], to[1] - from[1]);
    for (let d = 0.3; d < distance - 0.55; d += 0.15) {
      const x = from[0] + ((to[0] - from[0]) * d) / distance;
      const z = from[1] + ((to[1] - from[1]) * d) / distance;
      if (
        b.colliders.some(
          (c) =>
            eyeY > c.minY &&
            eyeY < c.maxY &&
            x > c.minX &&
            x < c.maxX &&
            z > c.minZ &&
            z < c.maxZ,
        )
      )
        return false;
      if (doors.blocked([x, z], eyeY - 1.65)) return false;
    }
    return true;
  }
  return {
    ...b,
    doors,
    entry: [0, 12] as Point,
    update,
    interact,
    interactions,
    dynamicBlocked,
    location,
    canSee,
    ensureRoom,
    rooms,
    liftFloor,
  };
}
