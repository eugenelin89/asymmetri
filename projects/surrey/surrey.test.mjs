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
    const maxFrames = Math.ceil(distance([sim.state.player.x, sim.state.player.z], dest) / 3.6 * 60) + 120;
    for (let i = 0; i < maxFrames; i++) {
      const p = sim.state.player,
        dx = dest[0] - p.x,
        dz = dest[1] - p.z;
      if (Math.hypot(dx, dz) < 0.2) break;
      sim.tick(1 / 60, dx, dz, true);
      assert.ok(sim.world.fits([sim.state.player.x, sim.state.player.z]));
    }
    assert.ok(
      distance([sim.state.player.x, sim.state.player.z], dest) < 0.3,
      `Arrived via collision movement target=${dest} position=${sim.state.player.x},${sim.state.player.z} dialogue=${JSON.stringify(sim.state.dialogue)}`,
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
test("mystery discovery opens a playable investigation and deduplicates its watch", () => {
  const sim = createSimulation(city);
  sim.state.player = pose(city.anchors.mystery);
  sim.interact();
  assert.equal(sim.state.investigation.stage, "active");
  assert.match(sim.state.objective, /Surrey Central Mystery/);
  assert.ok(sim.state.dialogue.text.includes("Nina"));
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

const { createAerial } = await import("./camera.ts");
const { encounters } = await import("./encounters.ts");
const { parseSave, readSave, writeSave, SAVE_KEY } = await import("./save.ts");
const { pedestrianRoutes, stepPedestrians } = await import("./population.ts");

test("aerial orbit, pan, bounds, zoom and return-to-player preserve an independent camera target", () => {
  const player = [...city.anchors.spawn], a = createAerial(city.bounds, player), before = a.pose();
  a.orbit(80, -30); assert.notDeepEqual(a.pose().position, before.position); assert.deepEqual(a.state.target, player);
  a.pan(160, 40); assert.equal(a.state.follow, false); assert.notDeepEqual(a.state.target, player);
  a.pan(1e7, 1e7); assert.ok(a.state.target[0] >= city.bounds[0] && a.state.target[0] <= city.bounds[2]);
  for (let i = 0; i < 20; i++) a.zoom(-1000); assert.equal(a.state.distance, 65);
  for (let i = 0; i < 20; i++) a.zoom(1000); assert.equal(a.state.distance, 1700);
  a.orbit(0, 1e5); assert.equal(a.state.pitch, 1.42);
  a.focus(player); assert.equal(a.state.follow, true); assert.deepEqual(a.state.target, player); assert.deepEqual(player, city.anchors.spawn);
});

test("repeated aerial switches freeze character, mission, danger, encounter clocks and RNG", () => {
  const sim = createSimulation(city, 42); sim.state.stage = "chase";
  sim.state.encounter = { id: "robbery", phase: "pursuit", position: [...city.anchors.spawn], seconds: 12, hit: false, variant: false };
  for (let cycle = 0; cycle < 30; cycle++) {
    sim.mode("aerial"); const before = sim.serialize();
    for (let i = 0; i < 100; i++) sim.tick(.1, 1, 1, true);
    const after = sim.serialize(); assert.deepEqual(after.state, before.state); assert.deepEqual(after.runtime, before.runtime);
    sim.mode("ground"); assert.deepEqual([sim.state.player.x, sim.state.player.z], city.anchors.spawn);
  }
  sim.tick(.1); assert.ok(sim.state.elapsed > 0); assert.ok(sim.state.encounter.seconds < 12);
});

function investigation(sim) {
  sim.calm(true);
  walk(sim, sim.story.scene); sim.interact(); sim.dismiss();
  for (const id of ["tag", "nina", "idris", "receipt", "rowan", "paint", "clock"]) {
    walk(sim, sim.story[id]); sim.interact();
    assert.ok(sim.state.dialogue, id + " has a reachable interaction"); sim.dismiss();
  }
  walk(sim, sim.story.scene); sim.interact();
}
test("complete the mystery through collision movement, five clues, three witnesses and a reasoned conclusion", () => {
  const sim = createSimulation(city); investigation(sim);
  assert.equal(sim.state.investigation.evidence.length, 5); assert.equal(sim.state.investigation.witnesses.length, 3);
  const before = sim.state.money; assert.equal(sim.state.dialogue.context, "conclusion"); sim.choose("mara");
  assert.equal(sim.state.investigation.stage, "closed"); assert.equal(sim.state.money, before + 75);
  sim.dismiss(); sim.interact(); sim.dismiss(); sim.choose("mara"); assert.equal(sim.state.money, before + 75);
});
test("misleading paint and weak accusation lead to an inconclusive outcome; resubmission cannot farm rewards", () => {
  const sim = createSimulation(city); investigation(sim); const before = sim.state.money;
  sim.choose("rowan"); assert.equal(sim.state.investigation.stage, "inconclusive"); assert.equal(sim.state.money, before + 10);
  sim.dismiss(); sim.interact(); sim.choose("rowan"); assert.equal(sim.state.money, before + 10);
  sim.dismiss(); sim.interact(); sim.choose("mara"); assert.equal(sim.state.investigation.stage, "closed"); assert.equal(sim.state.money, before + 75);
});
test("evidence gate, explicit choices and Mission 1 retry preserve independent evidence", () => {
  const sim = createSimulation(city); sim.state.player = pose(sim.story.scene); sim.interact(); sim.dismiss(); sim.interact();
  assert.deepEqual(sim.state.dialogue.choices.map(c => c.id), ["leave"]);
  sim.choose("mara"); assert.equal(sim.state.investigation.stage, "active"); sim.dismiss(); assert.ok(sim.state.dialogue, "E cannot choose an accusation");
  sim.choose("leave"); sim.state.player = pose(city.anchors.owner); sim.interact(); sim.dismiss();
  assert.ok(sim.state.inventory.includes("Case 02: stopped watch")); assert.equal(sim.state.stage, "clue");
});
function trigger(id, seed = 91) {
  const sim = createSimulation(city, seed); sim.mature(true); if (["dealer", "solicitation", "community"].includes(id)) sim.calm(true);
  sim.state.player = pose(sim.locations[id]);
  for (let i = 0; i < 900 && sim.state.encounter?.id !== id; i++) {
    sim.tick(.1);
    if (sim.state.danger.active) sim.interact();
  }
  assert.equal(sim.state.encounter?.id, id); sim.interact(); assert.ok(sim.state.dialogue?.choices?.length >= 3); return sim;
}
test("all six authored encounter types have seeded playable choices and outcomes", () => {
  for (const [id, choice] of [["robbery", "help"], ["theft", "witness"], ["solicitation", "question"], ["dealer", "report"], ["scam", "question"], ["community", "directions"]]) {
    const a = trigger(id), b = trigger(id); assert.deepEqual(a.state, b.state);
    a.choose(choice); assert.equal(a.state.encounter, null); assert.ok(a.state.resolved.includes(id)); assert.ok(a.state.dialogue.text.length > 35);
  }
});
test("robbery choices support bounded loss, escape, single damage and recovery protection", () => {
  const pay = trigger("robbery"); pay.choose("pay"); assert.equal(pay.state.money, 8);
  const run = trigger("robbery"); run.choose("refuse"); assert.equal(run.state.encounter.phase, "pursuit");
  for (let i = 0; i < 80; i++) run.tick(.1); assert.equal(run.state.health, 94);
  run.recover(); for (let i = 0; i < 300; i++) run.tick(.1); assert.equal(run.state.encounter, null); assert.equal(run.state.health, 100);
});
test("theft pursuit is reachable, bounded, recoverable and pays once", () => {
  const sim = trigger("theft"); sim.choose("chase"); assert.equal(sim.state.encounter.phase, "chase");
  for (let i = 0; i < 150; i++) sim.tick(.1);
  walk(sim, sim.state.encounter.position); sim.interact(); assert.equal(sim.state.encounter, null); assert.equal(sim.state.money, 40);
});
test("Gentle Streets and mature reduction suppress only their relevant encounters", () => {
  const sim = createSimulation(city); sim.calm(true);
  for (const def of encounters.filter(e => e.threatening || e.mature)) {
    sim.state.player = pose(sim.locations[def.id]); for (let i = 0; i < 700; i++) sim.tick(.1);
    assert.ok(!sim.state.encounter || !encounters.find(e => e.id === sim.state.encounter.id).threatening && !encounters.find(e => e.id === sim.state.encounter.id).mature);
  }
  const mature = trigger("solicitation"); mature.mature(false); assert.equal(mature.state.encounter, null); assert.equal(mature.state.dialogue, null);
});
test("versioned save restores missions, evidence, settings, seeded timers and safe positions without trusting UI dialogue", () => {
  const sim = createSimulation(city); investigation(sim); sim.choose("mara"); sim.dismiss(); sim.mature(true); sim.mode("aerial");
  sim.state.stage = "completed"; sim.state.money = 140; sim.state.health = 78; sim.state.stamina = 42;
  const value = sim.serialize("low"), parsed = parseSave(JSON.stringify(value)); assert.ok(parsed);
  const restored = createSimulation(city); restored.restore(parsed);
  for (const key of ["stage", "money", "health", "stamina", "inventory", "investigation", "calm", "mature", "mode"]) assert.deepEqual(restored.state[key], sim.state[key], key);
  assert.equal(restored.state.dialogue, null); assert.deepEqual(restored.serialize().runtime, sim.serialize().runtime);
  value.state.player.x = 99999; value.state.player.z = -99999;
  restored.restore(parseSave(JSON.stringify(value))); assert.ok(world.fits([restored.state.player.x, restored.state.player.z]));
});
test("save storage and corrupt, incompatible or malicious fields fail safely", () => {
  const valid = createSimulation(city).serialize(), encoded = JSON.stringify(valid), memory = new Map();
  const storage = { getItem: k => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v), removeItem: k => memory.delete(k) };
  assert.ok(writeSave(storage, valid)); assert.ok(readSave(storage).save); assert.equal(memory.has(SAVE_KEY), true);
  for (const raw of ["{", "null", JSON.stringify({ ...valid, version: 1 }), JSON.stringify({ ...valid, map: "other" }), encoded.replace('"money":20', '"money":-5'), encoded.replace('"stage":"available"', '"stage":"invented"'), "x".repeat(50001)]) assert.equal(parseSave(raw), null);
  const blocked = { getItem() { throw Error("blocked"); }, setItem() { throw Error("quota"); }, removeItem() {} };
  assert.equal(readSave(blocked).save, null); assert.equal(writeSave(blocked, valid), false);
  memory.set(SAVE_KEY, "broken"); assert.equal(readSave(storage).save, null); assert.equal(memory.get(SAVE_KEY), "broken", "Invalid save is not silently erased");
});
test("pedestrians follow source-parallel clear routes, pause, avoid obstacles and separate", () => {
  const paths = pedestrianRoutes(city, world); assert.ok(paths.length > 15);
  for (const path of paths) assert.ok(world.clear(...path));
  const path = paths[0], p = path[0];
  const people = [{ pose: pose(p), path, target: 1, pause: 0 }, { pose: pose([p[0] + .2, p[1] + .2]), path, target: 1, pause: 0 }];
  for (let i = 0; i < 600; i++) stepPedestrians(people, city.anchors.spawn, null, 1 / 60, world);
  assert.ok(people.every(p => world.fits([p.pose.x, p.pose.z])));
  assert.ok(distance([people[0].pose.x, people[0].pose.z], [people[1].pose.x, people[1].pose.z]) > .6);
});
