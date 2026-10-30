import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { registerHooks } from "node:module";
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
});
const { createWorld, move, route, distance } = await import("./world.ts");
const { createSimulation, seeded } = await import("./simulation.ts");
const { validateCity, loadCity, DATA_URL } = await import("./data.ts");
const directory = new URL(
    "../../public/surrey/v0.1-2026-10-30/",
    import.meta.url,
  ),
  bytes = readFileSync(new URL("city.json", directory)),
  city = validateCity(JSON.parse(bytes)),
  manifest = JSON.parse(readFileSync(new URL("manifest.json", directory))),
  world = createWorld(city);
const pose = (p) => ({
  x: p[0],
  z: p[1],
  yaw: 0,
  moving: false,
  running: false,
  blocked: false,
});
function walk(sim, target) {
  const path = route(
    sim.world,
    [sim.state.player.x, sim.state.player.z],
    target,
  );
  assert.ok(path.length > 1, "Reachable destination " + target);
  for (const dest of path.slice(1)) {
    for (let i = 0; i < 2000; i++) {
      const p = sim.state.player,
        dx = dest[0] - p.x,
        dz = dest[1] - p.z;
      if (Math.hypot(dx, dz) < 0.2) break;
      sim.tick(1 / 60, dx, dz, true);
      assert.ok(sim.world.fits([sim.state.player.x, sim.state.player.z]));
    }
    assert.ok(
      distance([sim.state.player.x, sim.state.player.z], dest) < 0.3,
      "Arrived via collision movement",
    );
  }
}
test("immutable Surrey snapshot has complete source receipts and bounded independent geography", () => {
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    manifest.sha256,
  );
  assert.equal(bytes.length, manifest.bytes);
  assert.ok(bytes.length < 3_000_000);
  assert.equal(manifest.sources.length, 7);
  assert.ok(
    manifest.sources.every(
      (s) => s.features < 2000 && /^[a-f0-9]{64}$/.test(s.sha256),
    ),
  );
  assert.equal(city.buildings.length, 786);
  assert.ok(city.roads.some((r) => /104/.test(r.name)));
  assert.ok(city.roads.some((r) => /KING GEORGE/i.test(r.name)));
  assert.ok(city.parks.some((p) => p.name === "Holland Park"));
  assert.ok(manifest.attribution.includes("City of Surrey"));
  assert.ok(!JSON.stringify(manifest).includes("opendata.vancouver"));
});
test("safe station spawn and all mission actors fit the full-body surface", () => {
  for (const [name, p] of Object.entries(city.anchors))
    assert.ok(world.fits(p), name);
  const p = city.anchors.spawn;
  assert.ok(distance(p, [0, 0]) < 60);
});
test("building interiors and map boundaries block movement", () => {
  let count = 0;
  for (const b of city.buildings) {
    const r = b.shape[0],
      p = [
        r.reduce((s, p) => s + p[0], 0) / r.length,
        r.reduce((s, p) => s + p[1], 0) / r.length,
      ];
    if (!world.fits(p)) count++;
  }
  assert.ok(count > 650);
  assert.equal(world.fits([city.bounds[0] - 1, 0]), false);
  assert.equal(world.fits([0, city.bounds[3] + 1]), false);
  assert.equal(world.fits([NaN, 0]), false);
});
test("walk, sprint, diagonal normalization and collision substeps", () => {
  const open = { fits: ([x, z]) => x < 2 && Math.abs(z) < 100 };
  const p = pose([0, 0]);
  assert.ok(move(p, 1, 0, 3.6, 0.1, open).x < move(p, 1, 0, 6.8, 0.1, open).x);
  const d = move(p, 1, 1, 3.6, 0.1, open);
  assert.ok(Math.abs(Math.hypot(d.x, d.z) - 0.36) < 1e-6);
  const wall = { fits: ([x]) => x < 0.3 || x > 0.5 };
  assert.ok(move(p, 1, 0, 6.8, 20, wall).x < 0.3);
  assert.ok(move(p, 1, 0, 6.8, 20, open).x <= 0.681);
});
test("all mission legs have clearance and real movement can follow them", () => {
  const sim = createSimulation(city);
  for (const name of [
    "owner",
    "clue",
    "thief",
    "escape",
    "community",
    "mystery",
    "owner",
  ])
    walk(sim, city.anchors[name]);
});
test("complete introductory mission through walking, clue, pursuit, recovery and return", () => {
  const sim = createSimulation(city);
  walk(sim, city.anchors.owner);
  sim.interact();
  assert.equal(sim.state.dialogue.action, "Take the case");
  sim.dismiss();
  assert.equal(sim.state.stage, "clue");
  walk(sim, city.anchors.clue);
  sim.interact();
  assert.equal(sim.state.stage, "chase");
  sim.dismiss();
  for (
    let i = 0;
    i < 12 &&
    distance([sim.state.player.x, sim.state.player.z], sim.state.thief) > 4;
    i++
  )
    walk(sim, sim.state.thief);
  sim.interact();
  assert.equal(sim.state.stage, "return");
  assert.ok(sim.state.inventory.includes("Alex’s backpack"));
  sim.dismiss();
  walk(sim, city.anchors.owner);
  sim.interact();
  assert.equal(sim.state.stage, "completed");
  assert.equal(sim.state.money, 55);
  sim.dismiss();
  sim.interact();
  assert.equal(sim.state.money, 55, "No repeat reward");
});
test("community dialogue provides a non-chase solution without stereotyping", () => {
  const sim = createSimulation(city);
  walk(sim, city.anchors.owner);
  sim.interact();
  sim.dismiss();
  walk(sim, city.anchors.clue);
  sim.interact();
  sim.dismiss();
  walk(sim, city.anchors.community);
  sim.interact();
  assert.ok(sim.state.dialogue.text.includes("shelter"));
  sim.dismiss();
  walk(sim, sim.state.thief);
  sim.interact();
  assert.equal(sim.state.stage, "return");
});
test("interactions cannot skip mission stages or pass through walls", () => {
  const sim = createSimulation(city);
  sim.interact();
  assert.equal(sim.state.stage, "available");
  assert.equal(sim.state.dialogue, null);
  sim.state.player = pose(city.anchors.escape);
  sim.interact();
  assert.equal(sim.state.stage, "available");
  assert.equal(sim.state.money, 20);
});
test("failure has a clear retry and recovery preserves completed progress", () => {
  const sim = createSimulation(city);
  sim.state.stage = "chase";
  for (let i = 0; i < 1802; i++) sim.tick(0.1);
  assert.equal(sim.state.stage, "failed");
  sim.recover();
  assert.ok(world.fits([sim.state.player.x, sim.state.player.z]));
  walk(sim, city.anchors.owner);
  sim.interact();
  sim.dismiss();
  assert.equal(sim.state.stage, "clue");
  sim.state.stage = "completed";
  sim.state.money = 55;
  sim.state.player.x = 99999;
  sim.recover();
  assert.equal(sim.state.stage, "completed");
  assert.equal(sim.state.money, 55);
});
test("deterministic optional danger activates, can be evaded, and has a cooldown", () => {
  function encounter(seed) {
    const sim = createSimulation(city, seed);
    sim.state.player = pose(city.anchors.danger);
    for (let i = 0; i < 1200 && !sim.state.danger.active; i++) sim.tick(0.1);
    return sim;
  }
  const a = encounter(42),
    b = encounter(42);
  assert.ok(a.state.danger.active);
  assert.deepEqual(a.state, b.state);
  a.interact();
  assert.equal(a.state.danger.active, false);
  assert.equal(a.state.money, 20);
  for (let i = 0; i < 200; i++) a.tick(0.1);
  assert.equal(a.state.danger.active, false);
  const c = encounter(42);
  c.state.player = pose(city.anchors.spawn);
  c.tick(0.1);
  assert.equal(c.state.danger.active, false);
});
test("gentle mode suppresses encounters and restores intercepted money", () => {
  const sim = createSimulation(city, 42);
  sim.calm(true);
  sim.state.player = pose(city.anchors.danger);
  for (let i = 0; i < 2000; i++) sim.tick(0.1);
  assert.equal(sim.state.danger.active, false);
  assert.equal(sim.state.health, 100);
  assert.equal(sim.state.money, 20);
});
test("dialogue pauses mission clock, movement and stamina; exhaustion recovers", () => {
  const sim = createSimulation(city);
  sim.state.player = pose(city.anchors.owner);
  sim.interact();
  const before = structuredClone(sim.state);
  sim.tick(0.1, 1, 0, true);
  assert.deepEqual(sim.state, before);
  sim.dismiss();
  sim.state.stamina = 10;
  for (let i = 0; i < 100; i++) sim.tick(0.1, 0, 1, true);
  assert.ok(sim.state.stamina >= 0);
  for (let i = 0; i < 100; i++) sim.tick(0.1);
  assert.equal(sim.state.stamina, 100);
});
test("second mystery is an explicitly future hook and collects just one clue", () => {
  const sim = createSimulation(city);
  sim.state.player = pose(city.anchors.mystery);
  sim.interact();
  assert.ok(sim.state.dialogue.text.includes("future chapter"));
  sim.dismiss();
  sim.interact();
  assert.equal(sim.state.inventory.length, 1);
});
test("asset loader fails safely for HTTP, stale, malformed and cancelled responses", async () => {
  assert.throws(() => validateCity({ version: "wrong" }));
  assert.throws(() => validateCity({ ...city, anchors: {} }));
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response("", { status: 404 });
    await assert.rejects(
      loadCity(new AbortController().signal),
      /could not be loaded/,
    );
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ ...city, version: "old" }));
    await assert.rejects(loadCity(new AbortController().signal), /incomplete/);
    globalThis.fetch = async () => new Response(bytes);
    const abort = new AbortController();
    abort.abort();
    await assert.rejects(loadCity(abort.signal));
    assert.ok(DATA_URL.startsWith("/surrey/"));
  } finally {
    globalThis.fetch = original;
  }
});
test("random generator is repeatable and bounded", () => {
  const a = seeded(9),
    b = seeded(9);
  for (let i = 0; i < 100; i++) {
    const n = a();
    assert.equal(n, b());
    assert.ok(n >= 0 && n < 1);
  }
});
test("an empty wallet cannot turn one pickpocket encounter into repeated damage", () => {
  const sim = createSimulation(city, 42);
  sim.state.money = 0;
  sim.state.player = pose(city.anchors.danger);
  for (let i = 0; i < 600; i++) sim.tick(0.1);
  assert.equal(sim.state.health, 92);
  assert.equal(sim.state.money, 0);
});
test("render frame rates preserve walking distance", () => {
  const samples = [];
  for (const hz of [15, 30, 60, 120]) {
    let p = pose(city.anchors.spawn);
    for (let i = 0; i < hz * 4; i++) p = move(p, 0, -1, 3.6, 1 / hz, world);
    samples.push(p);
  }
  assert.ok(
    samples.every(
      (p) => distance([p.x, p.z], [samples[0].x, samples[0].z]) < 0.02,
    ),
  );
});
