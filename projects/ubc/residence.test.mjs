import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import "./test-loader.mjs";
const { buildResidence } = await import("./residence.ts");
const { createDoors } = await import("./doors.ts");
const { createCollision, createRoutes, global, local, inPolygon } =
  await import("./spatial.ts");
const {
  orchardAnchor: anchor,
  orchardRooms,
  orchardBathrooms,
  residenceFloor: level,
  roomEntry,
} = await import("./residence-layout.ts");
const { defaults } = await import("./environment.ts");
const { characters, displays, safeExternalUrl, answerQuestion } =
  await import("./registry.ts");
const { createPeople } = await import("./people.ts");
const data = JSON.parse(
  readFileSync(
    new URL("../../public/ubc/v0.1-2026-10-30/data.json", import.meta.url),
  ),
);
const geography = JSON.parse(
  readFileSync(
    new URL(
      "../../public/ubc/orchard-v0.2-2026-10-31/geography.json",
      import.meta.url,
    ),
  ),
);
function fixture() {
  const asset = buildResidence();
  const rings = geography.footprintParts.map((b) =>
    b.rings.map((r) => r.map((p) => local(p, anchor))),
  );
  const boundary = {
    anchor: { ...anchor, width: 220, depth: 180 },
    colliders: [],
    floors: [],
    ramps: [],
    entry: [0, 12],
    dynamicBlocked(p) {
      if (Math.abs(p[0]) <= 17.9 && Math.abs(p[1]) <= 8.9) return false;
      if (Math.abs(p[0]) <= 1.6 && p[1] >= 8.7 && p[1] <= 12.3) return false;
      return rings.some((r) => inPolygon(p, r));
    },
  };
  const collision = createCollision(
    data,
    [{ ...asset, anchor }, boundary],
    new Set(["VBL10013", "VBL10013-part1"]),
  );
  const entry = global([0, 16], anchor);
  return {
    asset,
    collision,
    pose: { x: entry[0], z: entry[1], y: 0, yaw: 0, pitch: 0 },
  };
}
function walk(f, destination, y = f.pose.y) {
  const target = global(destination, anchor);
  const n = Math.ceil(
    Math.hypot(target[0] - f.pose.x, target[1] - f.pose.z) / 0.08,
  );
  for (let i = 0; i < n; i++) {
    const p = local([f.pose.x, f.pose.z], anchor);
    f.pose.y += f.asset.update(1 / 60, p, f.pose.y, defaults);
    const dx = target[0] - f.pose.x,
      dz = target[1] - f.pose.z,
      length = Math.hypot(dx, dz);
    f.pose = f.collision.move(
      f.pose,
      (dx / length) * Math.min(0.08, length),
      (dz / length) * Math.min(0.08, length),
    );
  }
  assert.ok(
    Math.hypot(f.pose.x - target[0], f.pose.z - target[1]) < 0.13,
    `Walk ${destination}: stopped at ${local([f.pose.x, f.pose.z], anchor)} y=${f.pose.y}`,
  );
  assert.ok(
    Math.abs(f.pose.y - y) < 0.1,
    `Floor at ${destination}: ${f.pose.y} expected ${y}`,
  );
}
function open(f, id) {
  assert.equal(f.asset.interact(id), true);
  const p = local([f.pose.x, f.pose.z], anchor);
  for (let i = 0; i < 90; i++) f.asset.update(1 / 60, p, f.pose.y, defaults);
  const door = f.asset.doors.doors.find((d) => d.id === id);
  assert.ok(
    Math.abs(door.angleNow - door.angle) > 1.5,
    `${id} fully open; waiting=${door.waiting}`,
  );
}
function upstairs(f) {
  walk(f, [0, 7]);
  walk(f, [9.4, 7]);
  walk(f, [9.4, 5.05]);
  walk(f, [10, 5.05]);
  walk(f, [17.35, 5.05], level);
  walk(f, [17.35, 0]);
}
test("Orchard geographic anchor, source approach and supported envelope preserve both real footprints", () => {
  assert.equal(geography.entrance.id, "{05735B81-F14A-4C57-9377-4E083CFF6BCF}");
  const entry = global([0, 12], anchor);
  assert.ok(
    Math.hypot(
      entry[0] - geography.entrance.x,
      entry[1] - geography.entrance.z,
    ) < 0.001,
  );
  const source = data.buildings.find((b) => b.id === "VBL10013-part1");
  for (let x = -18; x <= 18; x += 1)
    for (let z = -9; z <= 9; z++)
      assert.ok(inPolygon(global([x, z], anchor), source.rings));
  const f = fixture(),
    routes = createRoutes(data, f.collision.blocked);
  assert.ok(routes.find([-464.09, -36.8], entry));
  for (const part of geography.footprintParts)
    assert.deepEqual(
      part.rings,
      data.buildings.find((b) => b.id === part.id).rings,
    );
});
test("Orchard continuous entrance, staircase, corridor, all eight doors/bedrooms, lounge, study and exit", () => {
  const f = fixture();
  upstairs(f);
  for (const room of orchardRooms) {
    const entry = roomEntry(room);
    walk(f, [entry[0], 0]);
    const stopped = f.collision.move(
      f.pose,
      ...(() => {
        const q = global([entry[0], room.side * 2.5], anchor);
        return [q[0] - f.pose.x, q[1] - f.pose.z];
      })(),
    );
    assert.ok(
      Math.abs(local([stopped.x, stopped.z], anchor)[1]) < 1.1,
      `${room.id} closed door blocks entry`,
    );
    open(f, `door-room-${room.id}`);
    walk(f, [entry[0], room.side * 3.1]);
    walk(f, [entry[0], room.side * 5.2]);
    walk(f, [entry[0], 0]);
    f.asset.interact(`door-room-${room.id}`);
  }
  walk(f, [5, 0]);
  walk(f, [8.8, 2.4]);
  walk(f, [8.8, 7]);
  walk(f, [8.8, 0]);
  walk(f, [5, 0]);
  walk(f, [5, -3]);
  walk(f, [5, -7]);
  walk(f, [5, 0]);
  walk(f, [17.35, 0]);
  walk(f, [17.35, 5.05]);
  walk(f, [10, 5.05], 0);
  walk(f, [9.4, 5.05]);
  walk(f, [9.4, 7]);
  walk(f, [0, 7]);
  walk(f, [0, 16]);
});
test("three connected pairs have traversable shared bathrooms; doubles have individual shared-private bathrooms", () => {
  const f = fixture();
  upstairs(f);
  assert.equal(orchardRooms.filter((r) => r.beds === 1).length, 6);
  assert.equal(orchardRooms.filter((r) => r.beds === 2).length, 2);
  for (const bath of orchardBathrooms) {
    const first = orchardRooms.find((r) => r.id === bath.rooms[0]),
      entry = roomEntry(first);
    walk(f, [entry[0], 0]);
    open(f, `door-room-${first.id}`);
    if (bath.rooms.length === 2) {
      const z = (bath.minZ + bath.maxZ) / 2;
      walk(f, [entry[0], z]);
      open(f, `door-bath-${bath.id}-0`);
      walk(f, [(bath.minX + bath.maxX) / 2, z]);
      open(f, `door-bath-${bath.id}-1`);
      const second = orchardRooms.find((r) => r.id === bath.rooms[1]);
      walk(f, [roomEntry(second)[0], z]);
      walk(f, [roomEntry(second)[0], second.side * 3.0]);
      open(f, `door-room-${second.id}`);
      walk(f, [roomEntry(second)[0], 0]);
    } else {
      walk(f, [entry[0], -5.6]);
      const centre = (bath.minX + bath.maxX) / 2;
      walk(f, [centre, -5.6]);
      open(f, `door-bath-${bath.id}`);
      walk(f, [centre, -6.8]);
      walk(f, [centre, -5.6]);
      walk(f, [entry[0], -5.6]);
      walk(f, [entry[0], 0]);
    }
  }
});
test("moving platform lift carries visitor up and down, protects absent-cabin entry and does not teleport", () => {
  const f = fixture();
  walk(f, [0, 0]);
  walk(f, [13.65, 0]);
  walk(f, [13.65, -3.5]);
  for (const target of [level, 0]) {
    f.asset.interact("lift-ride");
    let last = f.pose.y;
    for (let i = 0; i < 260; i++) {
      f.pose.y += f.asset.update(
        1 / 60,
        local([f.pose.x, f.pose.z], anchor),
        f.pose.y,
        defaults,
      );
      assert.ok(Math.abs(f.pose.y - last) <= 0.016);
      last = f.pose.y;
    }
    assert.ok(Math.abs(f.pose.y - target) < 0.001);
  }
  walk(f, [13.65, 0]);
  f.asset.interact("lift-upper");
  for (let i = 0; i < 260; i++) f.asset.update(1 / 60, [13.65, 0], 0, defaults);
  assert.equal(f.asset.dynamicBlocked([13.65, -2.3], 0), true);
});
test("lift arrives at an occupied upper landing, allows boarding and carries through the collision loop", () => {
  const f = fixture();
  upstairs(f);
  walk(f, [13.65, 0]);
  walk(f, [13.65, -1.8]);
  f.asset.interact("lift-upper");
  // Reproduce the browser approach while the platform is still arriving.
  for (let i = 0; i < 280; i++) {
    const p = local([f.pose.x, f.pose.z], anchor);
    f.pose.y += f.asset.update(1 / 60, p, f.pose.y, defaults);
    const target = global([13.65, -3.5], anchor);
    const d = Math.hypot(target[0] - f.pose.x, target[1] - f.pose.z);
    if (d > 0.025)
      f.pose = f.collision.move(
        f.pose,
        ((target[0] - f.pose.x) / d) * 0.024,
        ((target[1] - f.pose.z) / d) * 0.024,
      );
  }
  assert.ok(Math.abs(f.asset.liftFloor.y - level) < 0.001);
  walk(f, [13.65, -3.5]);
  f.asset.update(1 / 60, [13.65, -3.5], f.pose.y, defaults);
  assert.ok(f.asset.interactions().some((a) => a.id === "lift-ride"));
  f.asset.interact("lift-ride");
  for (let i = 0; i < 260; i++) {
    f.pose.y += f.asset.update(
      1 / 60,
      local([f.pose.x, f.pose.z], anchor),
      f.pose.y,
      defaults,
    );
    f.pose = f.collision.move(f.pose, 0, 0);
  }
  assert.ok(f.pose.y < 0.001);
  walk(f, [13.65, 0]);
  f.asset.update(1 / 60, [13.65, 0], 0, defaults);
  assert.ok(
    !f.asset.interactions().some((a) => a.id === "lift-ride"),
    "ride control requires boarding",
  );
});
test("hinged doors use swept collision, hold on obstruction and remain operable from either side", () => {
  const system = createDoors([
    {
      id: "test",
      name: "test",
      hinge: [0, 0],
      y: 0,
      width: 1.1,
      angle: 0,
      swing: 1,
    },
  ]);
  assert.ok(system.blocked([0.55, 0], 0));
  system.toggle("test");
  system.update(1, [0.7, 0.6], 0, true);
  assert.equal(
    system.doors[0].angleNow,
    0,
    "Reduced-motion opening checks whole sweep",
  );
  system.update(1, [2, 2], 0, true);
  assert.ok(Math.abs(system.doors[0].angleNow - Math.PI / 2) < 0.001);
  assert.equal(system.blocked([0.6, 0], 0), false);
  system.toggle("test");
  system.update(1, [0.7, 0.6], 0, true);
  assert.equal(system.doors[0].waiting, true);
  system.update(1, [2, 2], 0, true);
  assert.equal(system.doors[0].angleNow, 0);
});
test("three fictional students have sourced topics, supported floors and moving collision-safe routes", () => {
  const f = fixture(),
    students = characters.filter((c) => c.category === "fictional");
  assert.equal(students.length, 3);
  const population = createPeople(
    data,
    { orchard: anchor },
    f.collision.blocked,
  );
  const actors = population.actors.filter((a) => a.named);
  assert.equal(actors.length, 3);
  for (const c of students) {
    assert.match(c.disclaimer, /Fictional student/);
    assert.ok(c.topics.length >= 5);
    assert.equal(answerQuestion(c, "What is your private opinion?"), null);
    for (const topic of c.topics)
      for (const source of topic.sources)
        assert.ok(safeExternalUrl(source.url));
  }
  for (let frame = 0; frame < 300; frame++) {
    population.update(1 / 30, frame / 30, [0, 100], 12, true, null, false);
    for (const actor of actors)
      assert.equal(
        f.collision.blocked(
          [actor.group.position.x, actor.group.position.z],
          actor.group.position.y,
        ),
        false,
      );
  }
  assert.equal(
    Object.values(displays).filter((d) => d.building === "orchard").length,
    3,
  );
});
test("room furniture loads near the floor, unloads far away and preserves deterministic collision", () => {
  const f = fixture();
  assert.equal(f.asset.rooms.size, 0);
  f.asset.update(0, [-15, 0], level, defaults);
  assert.ok(f.asset.rooms.size > 0);
  const count = f.asset.colliders.length;
  f.asset.update(0, [200, 200], 0, defaults);
  assert.equal(f.asset.rooms.size, 0);
  f.asset.update(0, [-15, 0], level, {
    ...defaults,
    season: "winter",
    weather: "snow",
    hour: 0,
    quality: "low",
  });
  assert.equal(
    f.asset.colliders.length,
    count,
    "Reload does not duplicate physics",
  );
});

test("residence prompts cannot see students or doors through room walls", () => {
  const f = fixture();
  assert.equal(f.asset.canSee([-1.6, -3.2], [2.1, -3], level + 1.6), false);
  assert.equal(f.asset.canSee([5, -2], [2.1, -3], level + 1.6), true);
  assert.equal(f.asset.canSee([-1.6, 0], [-1.6, -1.35], level + 1.6), true);
});
