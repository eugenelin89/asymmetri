import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import ts from "typescript";

// Three's asset builder uses parameter properties; compile TS exactly as the
// application does, while keeping these physical navigation tests DOM-free.
registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (error) {
      if (specifier.startsWith(".") && !specifier.endsWith(".ts"))
        return next(specifier + ".ts", context);
      throw error;
    }
  },
  load(url, context, next) {
    if (url.endsWith(".ts"))
      return {
        format: "module",
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
          compilerOptions: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.ESNext,
          },
        }).outputText,
      };
    return next(url, context);
  },
});

const { architectureEnvelope, buildArchitecture } =
  await import("./architecture.ts");
const { createCollision, floorAt, global, local } =
  await import("./spatial.ts");
const { createRoutes } = await import("./spatial.ts");
const { buildStadium } = await import("./stadium.ts");
const { createPeople } = await import("./people.ts");
const empty = {
  origin: [0, 0],
  buildings: [],
  surfaces: [],
  trees: [],
  routes: [],
  entrances: [],
};

test("stadium: walk field, mound, dugout, bullpen and grandstand, then exit", () => {
  const architecture = buildStadium(),
    anchor = {
      id: "stadium",
      x: 333.95,
      z: 433.32,
      yaw: 2.8467355,
      width: 170,
      depth: 150,
    };
  const turf = architecture.group.children.find(
    (mesh) => mesh.material?.color?.getHex() === 0x447957,
  );
  assert.ok(turf, "Rendered turf exists");
  for (let i = 0; i < turf.geometry.attributes.normal.count; i++)
    assert.ok(
      turf.geometry.attributes.normal.getY(i) > 0.99,
      "Field surfaces face upward for lighting",
    );
  assert.equal(
    turf.castShadow,
    false,
    "Layered turf avoids self-shadow striping",
  );
  const collision = createCollision(
      empty,
      [{ anchor, ...architecture }],
      new Set(),
    ),
    start = global(architecture.entry, anchor);
  const f = {
    architecture,
    anchor,
    collision,
    pose: { x: start[0], z: start[1], y: 0, yaw: 0, pitch: 0 },
  };
  walkTo(f, [31, 0]);
  walkTo(f, [0, 0]);
  walkTo(f, [0, -18.44], 0.12);
  walkTo(f, [0, -22], 0);
  walkTo(f, [0, -6]);
  walkTo(f, [26, -6]);
  walkTo(f, [26, -9.5]);
  walkTo(f, [26, -7]);
  walkTo(f, [35, -6]);
  walkTo(f, [72, -50]);
  walkTo(f, [35, 5]);
  walkTo(f, [23.5, 10]);
  walkTo(f, [23.5, 24], 3.62);
  walkTo(f, [10, 25], 3.62);
  walkTo(f, [23.5, 24], 3.62);
  walkTo(f, [23.5, 9], 0);
  walkTo(f, [31, 9], 0);
  walkTo(f, architecture.entry, 0);
});

test("shipped campus: spawn, connected source routes, real entrances and moving named guides", () => {
  const data = JSON.parse(
    readFileSync(
      new URL("../../public/ubc/v0.1-2026-10-30/data.json", import.meta.url),
    ),
  );
  const anchors = JSON.parse(
    readFileSync(
      new URL("../../public/ubc/v0.1-2026-10-30/anchors.json", import.meta.url),
    ),
  );
  const kinds = ["rose", "bookstore", "nest", "sauder"];
  const interiors = kinds.map((kind) => {
    anchors[kind] = architectureEnvelope(kind, anchors[kind]);
    const a = anchors[kind],
      height = data.buildings.find((b) => b.id === a.buildingId).height;
    const asset = buildArchitecture(kind, a.width, a.depth, height);
    a.entry = global(asset.entry, a);
    return { anchor: a, ...asset };
  });
  const stadium = buildStadium();
  anchors.stadium.entry = global(stadium.entry, anchors.stadium);
  interiors.push({ anchor: anchors.stadium, ...stadium });
  const collision = createCollision(
    data,
    interiors,
    new Set(kinds.map((k) => anchors[k].buildingId)),
  );
  const spawn = [anchors.spawn.x, anchors.spawn.z];
  assert.equal(
    collision.blocked(spawn, 0),
    false,
    "Official sidewalk spawn is unobstructed",
  );
  const routes = createRoutes(data, collision.blocked);
  for (const kind of [...kinds, "stadium"]) {
    const a = anchors[kind],
      path = routes.find(spawn, a.entry);
    assert.ok(path && path.length > 1, `Source route to ${kind}`);
    let pose = { x: path[0][0], z: path[0][1], y: 0, yaw: 0, pitch: 0 };
    for (const p of path.slice(1)) {
      const dx = p[0] - pose.x,
        dz = p[1] - pose.z;
      pose = collision.move(pose, dx, dz);
      assert.ok(
        Math.hypot(pose.x - p[0], pose.z - p[1]) < 0.06,
        `Continuous source route clearance: ${kind}`,
      );
    }
    assert.equal(collision.blocked(a.entry, 0), false, `${kind} approach`);
    if (kind !== "stadium") {
      const approach = global([0, a.depth / 2 + 6], a);
      assert.equal(
        collision.blocked(approach, 0),
        false,
        `${kind} exterior arrival`,
      );
      const f = {
        anchor: a,
        architecture: interiors.find((i) => i.anchor.id === kind),
        collision,
        pose: { x: a.entry[0], z: a.entry[1], y: 0, yaw: 0, pitch: 0 },
      };
      walkTo(f, [0, a.depth / 2 - 2]);
      walkTo(f, f.architecture.entry);
      if (kind === "nest") {
        const ramp = f.architecture.ramps[0],
          x = (ramp.minX + ramp.maxX) / 2;
        walkTo(f, [0, a.depth / 2 - 10]);
        walkTo(f, [x, a.depth / 2 - 10]);
        walkTo(f, [x, ramp.maxZ + 0.8]);
        walkTo(f, [x, ramp.minZ - 0.5], 5);
        walkTo(f, [x, ramp.maxZ + 0.8], 0);
      }
    }
  }
  const population = createPeople(data, anchors, collision.blocked),
    named = population.actors.filter((a) => a.named);
  assert.deepEqual(named.map((a) => a.id).sort(), ["bacon", "werker"]);
  const positions = named.map((a) => a.group.position.clone());
  let travelled = 0;
  for (let i = 0; i < 600; i++) {
    population.update(1 / 30, i / 30, spawn, 12, true, null, false);
    for (const a of named)
      assert.equal(
        collision.blocked([a.group.position.x, a.group.position.z], 0),
        false,
        "Named guide stays out of walls",
      );
  }
  named.forEach(
    (a, i) => (travelled += a.group.position.distanceTo(positions[i])),
  );
  assert.ok(travelled > 1, "Named simulations move on their virtual routes");
  for (const actor of named) {
    const before = actor.group.position.clone();
    for (let i = 0; i < 300; i++)
      population.update(
        1 / 30,
        i / 30,
        [before.x, before.z + 3],
        12,
        true,
        null,
        false,
      );
    assert.equal(
      actor.group.position.distanceTo(before),
      0,
      "Nearby guides wait for conversation",
    );
  }
});

function fixture(kind, width, depth, yaw = 0.46) {
  const sourceHeights = {
    rose: 9.83845,
    bookstore: 20.98,
    nest: 30.15,
    sauder: 31.27,
  };
  const architecture = buildArchitecture(
    kind,
    width,
    depth,
    sourceHeights[kind],
  );
  const anchor = { id: kind, x: 143, z: -317, width, depth, yaw };
  const interior = { anchor, ...architecture };
  const collision = createCollision(empty, [interior], new Set());
  const start = global(architecture.entry, anchor);
  return {
    architecture,
    anchor,
    interior,
    collision,
    pose: { x: start[0], z: start[1], y: 0, yaw: 0, pitch: 0 },
  };
}

test("Rose: all four batting cages can be reached on foot and exited", () => {
  const f = fixture("rose", 56.48, 21.44);
  walkTo(f, [0, 8.72]);
  for (const target of [
    [-14, -4.7],
    [-14, 4.7],
    [11, -4.7],
    [11, 4.7],
  ])
    walkGroundRoute(f, target);
  walkGroundRoute(f, [0, 9.5]);
  walkTo(f, f.architecture.entry);
});

function walkTo(f, localTarget, expectedY = f.pose.y) {
  const target = global(localTarget, f.anchor);
  for (let step = 0; step < 2500; step++) {
    const dx = target[0] - f.pose.x,
      dz = target[1] - f.pose.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 0.04) break;
    const stride = Math.min(0.08, distance);
    const next = f.collision.move(
      f.pose,
      (dx / distance) * stride,
      (dz / distance) * stride,
    );
    assert.ok(
      Math.hypot(next.x - f.pose.x, next.z - f.pose.z) > 0.0001,
      `Movement blocked at ${JSON.stringify(local([f.pose.x, f.pose.z], f.anchor))}, y=${f.pose.y}; target=${localTarget}`,
    );
    assert.ok(Math.abs(next.y - f.pose.y) < 0.4, "No vertical teleports");
    f.pose = next;
  }
  assert.ok(
    Math.hypot(f.pose.x - target[0], f.pose.z - target[1]) < 0.05,
    "Reached walking destination",
  );
  assert.ok(
    Math.abs(f.pose.y - expectedY) < 0.07,
    `Expected floor ${expectedY}, got ${f.pose.y}`,
  );
}

// Plan only over actual shipped collision shapes. Every accepted path is then
// walked in 8 cm increments through the same swept movement used by the engine.
function walkGroundRoute(f, target) {
  const step = 0.55,
    startLocal = local([f.pose.x, f.pose.z], f.anchor);
  const origin = startLocal;
  const key = (x, z) => `${x},${z}`;
  const points = [[0, 0]],
    predecessor = new Map(),
    visited = new Set([key(0, 0)]);
  let reached = null;
  for (let index = 0; index < points.length && index < 50000; index++) {
    const current = points[index],
      p = [origin[0] + current[0] * step, origin[1] + current[1] * step];
    if (Math.hypot(p[0] - target[0], p[1] - target[1]) < 0.75) {
      reached = current;
      break;
    }
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const q = [current[0] + dx, current[1] + dz],
        id = key(...q);
      if (visited.has(id)) continue;
      visited.add(id);
      const dest = [origin[0] + q[0] * step, origin[1] + q[1] * step];
      if (
        Math.abs(dest[0]) > f.anchor.width / 2 - 0.6 ||
        dest[1] < -f.anchor.depth / 2 + 0.6 ||
        dest[1] > f.anchor.depth / 2 + 2.1
      )
        continue;
      const a = global(p, f.anchor),
        b = global(dest, f.anchor);
      const source = { ...f.pose, x: a[0], z: a[1], y: 0 };
      const moved = f.collision.move(source, b[0] - a[0], b[1] - a[1]);
      if (
        Math.hypot(moved.x - b[0], moved.z - b[1]) > 0.03 ||
        Math.abs(moved.y) > 0.03
      )
        continue;
      predecessor.set(id, current);
      points.push(q);
    }
  }
  assert.ok(reached, `No continuous public route to ${target}`);
  const path = [reached];
  while (predecessor.has(key(...path[0])))
    path.unshift(predecessor.get(key(...path[0])));
  for (const [x, z] of path.slice(1))
    walkTo(f, [origin[0] + x * step, origin[1] + z * step], 0);
}

for (const [kind, width, depth] of [
  ["rose", 21, 61],
  ["rose", 56.48, 21.44],
  ["bookstore", 52.46, 57.4],
  ["nest", 121.04, 55.53],
  ["sauder", 94.25, 57.74],
  ["sauder", 57.79, 94.18],
  ["bookstore", 57.37, 52.47],
]) {
  test(`${kind}: enter, reach public information and leave using continuous collision movement`, () => {
    const f = fixture(kind, width, depth);
    assert.equal(f.collision.blocked([f.pose.x, f.pose.z], 0), false);
    walkTo(f, [0, depth / 2 - 2]);
    for (const display of f.architecture.displays) {
      walkGroundRoute(f, [display.x, display.z + 1.25]);
      const relative = local([f.pose.x, f.pose.z], f.anchor);
      assert.ok(
        Math.hypot(relative[0] - display.x, relative[1] - display.z) < 2,
        "A visitor can stand close enough to use a display",
      );
    }
    walkGroundRoute(f, [0, depth / 2 - 1]);
    walkTo(f, f.architecture.entry);
    const wall = global([width / 2, depth / 2 - 1], f.anchor);
    assert.ok(f.collision.blocked(wall, 0), "Exterior walls stop a visitor");
    assert.ok(
      f.architecture.group.children.filter((c) => c.isMesh).length < 100,
      "Draw batches remain bounded",
    );
  });
}

test("Nest: walk from entrance to both upper floors, around galleries, down stairs and outside", () => {
  const f = fixture("nest", 65, 74, 0);
  walkTo(f, [0, 34]);
  const [first, second] = f.architecture.ramps;
  const centre = (r) => (r.minX + r.maxX) / 2;
  walkGroundRoute(f, [centre(first), first.maxZ + 1.2]);
  walkTo(f, [centre(first), first.maxZ + 0.3]);
  walkTo(f, [centre(first), first.minZ - 0.35], 5);
  walkTo(f, [centre(first), -32.5], 5);
  walkTo(f, [centre(first) - 2.3, -32.5], 5);
  walkTo(f, [centre(first) - 2.3, 0], 5);
  walkTo(f, [0, 0], 5);
  walkTo(f, [centre(first) - 2.3, 0], 5);
  walkTo(f, [centre(first) - 2.3, -32.5], 5);
  // Transfer through the rear gallery and along the opposite gallery. Walking
  // onto the second flight from its bottom reaches the third public level.
  walkTo(f, [centre(first), -32.5], 5);
  walkTo(f, [centre(second), -32.5], 5);
  walkTo(f, [centre(second) + 2.3, -32.5], 5);
  walkTo(f, [centre(second) + 2.3, second.maxZ + 1.2], 5);
  walkTo(f, [centre(second), second.maxZ + 1.2], 5);
  walkTo(f, [centre(second), second.minZ - 0.35], 10);
  walkTo(f, [centre(second), -32.5], 10);
  walkTo(f, [0, -32.5], 10);
  const before = { ...f.pose };
  const acrossVoid = f.collision.move(f.pose, 0, 15);
  assert.ok(acrossVoid.z < -30.5, "Atrium railing prevents falls");
  assert.equal(acrossVoid.y, 10);
  f.pose = before;
  walkTo(f, [centre(second), -32.5], 10);
  walkTo(f, [centre(second), second.minZ - 0.35], 10);
  walkTo(f, [centre(second), second.maxZ + 1.2], 5);
  walkTo(f, [centre(second) + 2.3, second.maxZ + 1.2], 5);
  walkTo(f, [centre(second) + 2.3, -32.5], 5);
  walkTo(f, [centre(first), -32.5], 5);
  walkTo(f, [centre(first), first.minZ - 0.35], 5);
  walkTo(f, [centre(first), first.maxZ + 1.2], 0);
  walkGroundRoute(f, [0, 35]);
  walkTo(f, f.architecture.entry, 0);
  assert.equal(floorAt([f.pose.x, f.pose.z], 0, [f.interior]), 0);
});
