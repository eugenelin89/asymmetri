import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { registerHooks } from "node:module";
import ts from "typescript";
registerHooks({
  load(url, context, next) {
    if (url.endsWith(".module.css")) return { format: "module", source: 'export default new Proxy({}, { get: (_, key) => key });', shortCircuit: true };
    if (url.endsWith(".tsx")) return { format: "module", source: ts.transpileModule(readFileSync(new URL(url), "utf8"), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText, shortCircuit: true };
    return next(url, context);
  },
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
const { bodyDistance: walkBodyDistance } = await import("./vehicle.ts");
const { createSimulation, seeded } = await import("./simulation.ts");
const { validateCity, loadCity, DATA_URL } = await import("./data.ts");
const directory = new URL(
    "../../public/surrey/v0.3-2026-10-30/",
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
  const path = route(sim.world, [sim.state.player.x, sim.state.player.z], target);
  assert.ok(path.length > 1, "Reachable destination " + target);
  const pending=path.slice(1);let detours=0,stalled=0,frames=0;
  // A walking test driver must go around stopped cars, just as a player does.
  // Replan only from observed poses and issue normal movement inputs; never move
  // actors, remove collision, change timers or write a player position.
  function aroundTraffic(dest){
    const p=[sim.state.player.x,sim.state.player.z];
    const bodies=[sim.state.vehicle.car,...sim.transport.traffic.map(a=>a.pose)];
    const fits=q=>sim.world.fits(q)&&bodies.every(b=>walkBodyDistance(b,q)>.899);
    const clear=(a,b)=>{
      if(!sim.world.clear(a,b))return false;
      const count=Math.ceil(distance(a,b)/.2);
      for(let i=0;i<=count;i++)if(!fits([a[0]+(b[0]-a[0])*i/(count||1),a[1]+(b[1]-a[1])*i/(count||1)]))return false;
      return true;
    };
    const dynamic={...sim.world,fits,clear,safe:q=>fits(q)?q:sim.world.safe(q)};
    const starts=[];
    for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++){
      const q=[Math.round(p[0]/3)*3+x*3,Math.round(p[1]/3)*3+z*3];if(clear(p,q))starts.push(q);
    }
    starts.sort((a,b)=>distance(a,dest)-distance(b,dest));
    for(const q of starts){const bypass=route(dynamic,q,dest);if(bypass.length>1)return [q,...bypass.slice(1)];}
    return null;
  }
  while(pending.length&&frames++<60000){
    const dest=pending[0],p=sim.state.player,dx=dest[0]-p.x,dz=dest[1]-p.z;
    if(Math.hypot(dx,dz)<.2){pending.shift();stalled=0;continue;}
    const before=[p.x,p.z];sim.tick(1/60,dx,dz,true);assert.ok(sim.world.fits([sim.state.player.x,sim.state.player.z]));
    stalled=distance(before,[sim.state.player.x,sim.state.player.z])<.003?stalled+1:0;
    if(stalled>20){
      assert.ok(detours++<12,`Too many walking obstructions toward ${target}`);
      const bypass=aroundTraffic(dest);assert.ok(bypass,`No foot route around traffic at ${before}`);
      pending.splice(0,1,...bypass);stalled=0;
    }
  }
  assert.ok(distance([sim.state.player.x,sim.state.player.z],target)<.3,`Arrived through collision movement at ${target}`);
}
test("immutable Surrey snapshot has complete source receipts and bounded independent geography", () => {
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    manifest.sha256,
  );
  assert.equal(bytes.length, manifest.bytes);
  assert.ok(bytes.length < 4_000_000);
  assert.equal(manifest.inheritedSources.length, 7);
  assert.equal(manifest.sources.length, 11);
  assert.ok(
    manifest.sources.every(
      (s) => (s.features === null || s.features < 2000) && /^[a-f0-9]{64}$/.test(s.sha256),
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
  const sim = createSimulation(city, seed); sim.mature(true); sim.state.time.minutes = 1260; if (["dealer", "solicitation", "community"].includes(id)) sim.calm(true);
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

const { viewShortcut, needsViewHelp, rememberViewHelp, VIEW_HELP_KEY } = await import('./viewPolicy.ts');
const { ViewControls, ViewHelp, ViewHint } = await import('./ViewControls.tsx');
const { renderToStaticMarkup } = await import('react-dom/server');
const { createElement } = await import('react');
const { groundHeight, onSurface, TRANSIT_DECK_HEIGHT } = await import('./surfaces.ts');
const { buildingProfile } = await import('./architecture.ts');
const legacyBytes = readFileSync(new URL('../../public/surrey/v0.1-2026-10-30/city.json', import.meta.url));
const legacy = JSON.parse(legacyBytes);

test('both persistent view controls expose selected text, pressed semantics and independent actions', () => {
  for (const mode of ['ground', 'aerial']) {
    const selected = [], element = ViewControls({ mode, disabled: false, select: value => selected.push(value) });
    const html = renderToStaticMarkup(element);
    assert.match(html, /Street Adventure/); assert.match(html, /Aerial Explore/);
    assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
    assert.equal((html.match(/✓ Active/g) ?? []).length, 1);
    for (const button of element.props.children) button.props.onClick();
    assert.deepEqual(selected, ['ground', 'aerial']);
  }
  assert.equal((renderToStaticMarkup(createElement(ViewControls, { mode: 'ground', disabled: true, select() {} })).match(/disabled=""/g) ?? []).length, 2);
  assert.match(renderToStaticMarkup(createElement(ViewHint, { mode: 'ground' })), /select Aerial Explore/);
  assert.match(renderToStaticMarkup(createElement(ViewHint, { mode: 'aerial' })), /select Street Adventure/);
  assert.match(renderToStaticMarkup(createElement(ViewHelp, { close() {} })), /Two ways to explore Surrey/);
});
test('V shortcut rejects modals, editable fields, modifiers and repeat; tutorial storage is separate from progress', () => {
  const event = { key: 'V', repeat: false, ctrlKey: false, metaKey: false, altKey: false, defaultPrevented: false };
  assert.equal(viewShortcut(event, false, false), true);
  assert.equal(viewShortcut(event, true, false), false); assert.equal(viewShortcut(event, false, true), false);
  for (const key of ['repeat','ctrlKey','metaKey','altKey','defaultPrevented']) assert.equal(viewShortcut({ ...event, [key]: true }, false, false), false);
  assert.equal(viewShortcut({ ...event, key: 'f' }, false, false), false);
  const data = new Map([[SAVE_KEY, 'existing-progress']]), storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  assert.equal(needsViewHelp(storage), true); rememberViewHelp(storage); assert.equal(needsViewHelp(storage), false);
  assert.equal(data.get(SAVE_KEY), 'existing-progress'); assert.equal(data.get(VIEW_HELP_KEY), 'seen');
  assert.equal(needsViewHelp({ getItem() { throw Error('blocked'); } }), true);
  assert.doesNotThrow(() => rememberViewHelp({ setItem() { throw Error('quota'); } }));
});
test('V0.2 migration retains every gameplay field and runtime timer, relocating only invalid positions', () => {
  const sim = createSimulation(city); investigation(sim); sim.choose('mara'); sim.dismiss();
  sim.state.stage = 'completed'; sim.state.money = 158; sim.state.health = 79; sim.state.stamina = 54;
  sim.state.resolved = ['community']; sim.state.waypoint = { name: 'Library', point: city.anchors.mystery }; sim.mode('aerial'); sim.mature(true);
  const old = { ...sim.serialize('low'), map: legacy.version };
  const migrated = parseSave(JSON.stringify(old)); assert.ok(migrated); assert.equal(migrated.map, city.version); assert.equal(migrated.migratedFrom, legacy.version);
  assert.deepEqual(migrated.state, old.state); assert.deepEqual(migrated.runtime, old.runtime); assert.equal(migrated.quality, 'low');
  const restored = createSimulation(city); restored.restore(migrated);
  for (const key of ['stage','investigation','money','inventory','health','stamina','resolved','waypoint','mode','mature','calm']) assert.deepEqual(restored.state[key], old.state[key], key);
  assert.equal(restored.state.player.x, old.state.player.x); assert.equal(restored.state.player.z, old.state.player.z);
  assert.deepEqual(restored.serialize().runtime, old.runtime);
  migrated.state.player.x = city.bounds[2] + 2; migrated.state.player.z = 0;
  restored.restore(migrated); assert.ok(world.fits([restored.state.player.x, restored.state.player.z]));
  assert.ok(Math.hypot(restored.state.player.x - migrated.state.player.x, restored.state.player.z) < 20, 'relocation stays nearby');
  assert.equal(restored.state.money, 158); assert.deepEqual(restored.state.investigation, old.state.investigation);
});
test('immutable prior geometry, metre-verified height joins and explicit terrain fallback are reproducible', () => {
  assert.equal(createHash('sha256').update(legacyBytes).digest('hex'), 'e40173b2355e695e7117dfeb3fd060417ad14af960408931912fdf3be39bf9ec');
  assert.equal(manifest.inheritedSnapshot.sha256, createHash('sha256').update(legacyBytes).digest('hex'));
  assert.deepEqual(city.anchors, legacy.anchors); assert.deepEqual(city.walkCells, legacy.walkCells);
  assert.deepEqual(city.buildings.map(b=>b.shape), legacy.buildings.map(b=>b.shape));
  assert.ok(city.buildings.every(b => b.heightMethod === 'derived-spatial-match' && b.heightProvenance.unitVerified && b.heightProvenance.nativeMatchResidualM < .2 && b.heightProvenance.surveyDate === null && b.heightProvenance.measurementMethod === null));
  assert.equal(city.buildings.find(b=>b.name === 'KPU (CIVIC PLAZA)').height, 164.04, 'source height is no longer clamped to 160');
  for (const p of Object.values(city.anchors)) { assert.equal(groundHeight(city, p), 0); assert.ok(TRANSIT_DECK_HEIGHT - .5 - groundHeight(city, p) > 7); }
  assert.ok(city.buildings.every(b=>b.baseElevation === 0)); assert.equal(city.terrain.verticalDatum, null);
  assert.match(city.terrain.reason, /unverified/); assert.equal(manifest.terrain.status, 'flat-fallback');
});
test('reconstructed road intersections, active medians, painted crossings and park paths have bounded coherent surfaces', () => {
  assert.equal(manifest.qa.minimumCenterlineCoverage, 1); assert.equal(manifest.qa.intersectionUnionValid, true);
  assert.equal(manifest.qa.sidewalkAsphaltOverlapM2, 0); assert.equal(manifest.qa.medianAsphaltOverlapM2, 0);
  assert.equal(manifest.qa.sourceRoadFeatures, 128); assert.equal(manifest.qa.activeCurbFeatures, 660); assert.equal(manifest.qa.activeMedianFeatures, 92);
  assert.ok(city.roads.some(r=>r.widthMethod === 'derived-paired-curbs')); assert.ok(city.roads.some(r=>r.widthMethod === 'inferred-lane-count'));
  assert.ok(city.paths.length >= 262); assert.ok(city.crossings.length > 150); assert.ok(city.markings.length > 500);
  let painted = 0;
  for (const polygon of city.crossings) {
    const ring = polygon[0].slice(0,-1), centre = [ring.reduce((n,p)=>n+p[0],0)/ring.length, ring.reduce((n,p)=>n+p[1],0)/ring.length];
    if (onSurface(centre, city.pavement)) painted++;
  }
  assert.ok(painted / city.crossings.length > .97, 'clipped crossing paint lies on roads');
  assert.deepEqual(city.bounds, legacy.bounds);
});
test('architectural profiles are stable, varied and preserve source heights and important outlines', () => {
  const profiles = city.buildings.map(buildingProfile);
  assert.deepEqual(profiles, city.buildings.map(buildingProfile));
  assert.ok(new Set(profiles.map(p=>p.kind)).size >= 5); assert.ok(profiles.some(p=>p.setback)); assert.ok(profiles.some(p=>p.roof === 'pitched'));
  assert.equal(buildingProfile(city.buildings.find(b=>b.id === '1665')).height, 16, 'combined SFU footprint stays a podium, with the separate source-height tower');
  assert.ok(profiles.every(p=>Number.isFinite(p.height) && p.height > 0));
});

const { advanceTime, newTime, timePhase, lightLevel, streetlightsOn } = await import('./time.ts');
const { missingReady } = await import('./missing.ts');
const { populationPlan, scheduled } = await import('./population.ts');
const { fitStreetCamera } = await import('./camera.ts');
test('saved city clock crosses midnight, uses four phases, freezes in dialogue/aerial and keeps stable visibility', () => {
  assert.deepEqual(advanceTime({ day: 4, minutes: 1439, rate: 4 }, 1), { day: 5, minutes: 3, rate: 4 });
  assert.deepEqual([480, 780, 1140, 1320].map(timePhase), ['Morning', 'Afternoon', 'Evening', 'Night']);
  assert.equal(streetlightsOn(780), false); assert.equal(streetlightsOn(1320), true);
  assert.equal(lightLevel(1320, true), 1); assert.ok(lightLevel(1320) < lightLevel(780));
  const sim = createSimulation(city); sim.tick(.1); assert.equal(sim.state.time.minutes, 780.1);
  sim.state.dialogue = { speaker: 'Pause', text: 'Pause' }; sim.tick(.1); assert.equal(sim.state.time.minutes, 780.1);
  sim.dismiss(); sim.mode('aerial'); sim.tick(.1); assert.equal(sim.state.time.minutes, 780.1);
  sim.mode('ground'); sim.rest(1260); assert.equal(sim.state.time.minutes, 1260); sim.rest(480); assert.equal(sim.state.time.day, 2);
});
function finishMissing(approach, ending) {
  const sim = createSimulation(city); sim.calm(true);
  walk(sim, sim.missingPoints.tess); sim.interact(); sim.choose(approach);
  assert.equal(sim.state.missing.stage, 'investigating');
  const ids = approach === 'people' ? ['mo', 'notice', 'eden'] : ['notice', 'eden', 'receipt'];
  for (const id of ids) { walk(sim, sim.missingPoints[id]); sim.interact(); sim.dismiss(); }
  assert.equal(missingReady(sim.state.missing), true);
  walk(sim, sim.missingPoints.riley); sim.interact();
  assert.equal(sim.state.dialogue.context, 'missing:ending'); sim.choose(ending); sim.dismiss();
  assert.equal(sim.state.missing.stage, 'return');
  const before = sim.state.money; walk(sim, sim.missingPoints.tess); sim.interact(); sim.dismiss();
  assert.equal(sim.state.missing.stage, 'closed'); assert.equal(sim.state.money - before, ending === 'message' ? 60 : 75);
  sim.interact(); sim.dismiss(); assert.equal(sim.state.money - before, ending === 'message' ? 60 : 75);
  return sim;
}
test('Missing Person: witness route walks all legs, corrects a misleading lead and respects privacy', () => {
  const sim = finishMissing('people', 'message'); assert.equal(sim.state.missing.reward, 60); assert.ok(sim.state.trust > 0);
  const restored = createSimulation(city); restored.restore(parseSave(JSON.stringify(sim.serialize())));
  assert.deepEqual(restored.state.missing, sim.state.missing); assert.deepEqual(restored.state.inventory, sim.state.inventory);
});
test('Missing Person: evidence route supports a consensual reunion without resetting existing cases', () => {
  const sim = finishMissing('trail', 'reunion'); assert.equal(sim.state.missing.reward, 75);
  sim.state.stage = 'completed'; sim.recover(); assert.equal(sim.state.missing.stage, 'closed'); assert.equal(sim.state.stage, 'completed');
});
test('new case requires corroboration, explicit choices and no undiscovered Riley location', () => {
  const sim = createSimulation(city); sim.calm(true);
  sim.state.player = pose(sim.missingPoints.tess); sim.interact(); sim.dismiss(); assert.equal(sim.state.missing.stage, 'available');
  sim.choose('people'); sim.state.player = pose(sim.missingPoints.riley); sim.interact(); assert.equal(sim.state.dialogue, null);
  sim.state.player = pose(sim.missingPoints.mo); sim.interact(); sim.dismiss(); sim.interact(); sim.dismiss();
  assert.deepEqual(sim.state.missing.witnesses, ['mo']); assert.equal(missingReady(sim.state.missing), false);
});
test('v2 saves migrate new fields explicitly while preserving old progress and rejecting malformed v3 records', () => {
  const sim = createSimulation(city); sim.state.money = 158; sim.state.helped = true; sim.state.stage = 'completed'; sim.state.inventory = ['Yellow transit slip']; sim.mature(true);
  const legacy = sim.serialize(); legacy.version = 2;
  for (const key of ['time', 'missing', 'trust', 'stableVisibility', 'volume']) delete legacy.state[key];
  const migrated = parseSave(JSON.stringify(legacy)); assert.ok(migrated); assert.equal(migrated.version, 5); assert.equal(migrated.state.money, 158); assert.equal(migrated.state.trust, 1); assert.deepEqual(migrated.state.time, newTime());
  assert.deepEqual(migrated.state.player, legacy.state.player); assert.equal(migrated.state.mature, true);
  for (const [key, value] of [['time', { day: 0, minutes: 1600, rate: 999 }], ['trust', 1.5], ['volume', 2], ['stableVisibility', 'yes'], ['missing', { ...migrated.state.missing, stage: 'closed', ending: 'reunion', reward: 75 }]]) {
    const invalid = structuredClone(migrated); invalid.state[key] = value; assert.equal(parseSave(JSON.stringify(invalid)), null, key);
  }
});
test('scheduled populations have reachable destinations, bounded night density, threat recovery and distance updates', () => {
  const people = populationPlan(city, world, 24); assert.equal(people.length, 24);
  assert.deepEqual(people, populationPlan(city, world, 24));
  assert.ok(people.some(p => p.crossing));
  for (const p of people) { assert.ok(world.fits([p.pose.x, p.pose.z])); assert.ok(world.clear(p.path[0], p.path[1])); }
  const player = [people[0].pose.x + 4, people[0].pose.z];
  stepPedestrians(people, player, player, .1, world); assert.equal(people[0].activity, 'fleeing');
  for (let i = 0; i < 160; i++) stepPedestrians(people, player, null, .1, world);
  assert.notEqual(people[0].activity, 'fleeing');
  for (const p of people) assert.ok(world.fits([p.pose.x, p.pose.z]));
  stepPedestrians(people, player, null, .1, world, 1320); assert.ok(people.filter(p => p.active).length <= 6);
  assert.equal(scheduled('student', 1320), false); assert.equal(scheduled('student', 600), true);
  stepPedestrians(people, player, null, .1, world, 780, 8); assert.ok(people.filter(p => p.active).length <= 8);
});
test('camera clips a lagged sightline and preserves a clear near plane after a sharp turn', () => {
  const clear = (a, b) => b[0] < 5;
  const p = fitStreetCamera([0, 0], [10, 0], clear); assert.ok(p[0] < 5 && p[0] > 4);
  assert.deepEqual(fitStreetCamera([0, 0], [3, 3], clear), [3, 3]);
});
test('mature encounters require both opt-in and evening/night; trust survives recovery', () => {
  const sim = createSimulation(city); sim.mature(true); sim.calm(true); sim.state.player = pose(sim.locations.solicitation);
  for (let i = 0; i < 500; i++) sim.tick(.1); assert.equal(sim.state.encounter, null);
  sim.rest(1260); for (let i = 0; i < 350 && !sim.state.encounter; i++) sim.tick(.1);
  assert.equal(sim.state.encounter?.id, 'solicitation'); sim.state.trust = 2; sim.recover(); assert.equal(sim.state.trust, 2);
});

test('scene teardown disposes shared geometry, materials and both color/emission textures exactly once', async () => {
  const THREE = await import('three'), {disposeScene} = await import('./resources.ts');
  const scene = new THREE.Scene(), geometry = new THREE.BoxGeometry(), map = new THREE.Texture(), emission = new THREE.Texture();
  const material = new THREE.MeshStandardMaterial({ map, emissiveMap: emission });
  scene.add(new THREE.Mesh(geometry, material), new THREE.Mesh(geometry, material));
  const counts = { geometry:0, material:0, map:0, emission:0, renderer:0, context:0, canvas:0 };
  for (const [id, object] of [['geometry',geometry],['material',material],['map',map],['emission',emission]]) object.addEventListener('dispose',()=>counts[id]++);
  disposeScene(scene, {dispose(){counts.renderer++},forceContextLoss(){counts.context++}}, null, {remove(){counts.canvas++}});
  assert.deepEqual(counts, { geometry:1, material:1, map:1, emission:1, renderer:1, context:1, canvas:1 });
});

const vehicle = await import("./vehicle.ts");
const transport = await import("./transport.ts");
const transportSource = JSON.parse(readFileSync(new URL("../../public/surrey/v0.5-2026-10-30/transport.json",import.meta.url)));
const transportWorld = transport.createTransport(city,world);
const neutral = {throttle:0,steering:0,brake:false};
function driveInputs(sim, frames=18000) {
  let progress=0,contacts=0;
  for(let i=0;i<frames && sim.state.delivery.stage==="accepted";i++) {
    const car=sim.state.vehicle.car,path=sim.transport.route;
    // Read-only route guidance drives only W/S/A/D/Space-equivalent inputs.
    while(progress<path.length && distance([car.x,car.z],[transport.onPath(path,progress).x,transport.onPath(path,progress).z])<6) progress+=.5;
    const target=transport.onPath(path,Math.min(path.length,progress));
    const end=path.points.at(-1), endDistance=distance([car.x,car.z],end);
    const error=Math.atan2(Math.sin(Math.atan2(target.x-car.x,target.z-car.z)-car.yaw),Math.cos(Math.atan2(target.x-car.x,target.z-car.z)-car.yaw));
    const braking=endDistance<5 && sim.state.delivery.checkpoint>=path.points.length-1;
    sim.tick(1/60,0,0,false,{throttle:braking?0:car.speed<4?1:0,steering:braking?0:Math.abs(error)>.018?Math.sign(error):0,brake:braking});
    assert.ok(sim.transport.surface.fits(sim.state.vehicle.car),"Full vehicle stays on validated road");
    if(sim.state.vehicle.car.blocked) contacts++;
    if(contacts>8) break;
  }
  return contacts;
}
test("transport geometry is pinned, excludes closed roads/curbs and supports complete body paths",()=>{
  assert.equal(transportSource.parentSha256,manifest.sha256);
  assert.deepEqual(transportSource.roads.map(r=>r.name),["Central Ave","City Parkway","City Parkway"]);
  assert.deepEqual(transportSource.validation.intersectingClosedSourceIds,[162865,184997]);
  assert.equal(transportSource.driveSurface.length,1);
  for(const path of [transportWorld.route,transport.pathMetrics(transport.transportData.trafficPath)]) {
    for(let d=0;d<=path.length;d+=.1) assert.ok(transportWorld.surface.fits(transport.onPath(path,d)),`Full 4.16×2.04m footprint at ${d}`);
  }
  for(const p of [[0,0],city.anchors.spawn,city.anchors.holland??[0,600],[-100,180]]) assert.equal(transportWorld.surface.allowed(p),false,"Pedestrian ground is not a road");
  assert.equal(transport.transportData.graph.edges.length,transport.transportData.graph.nodes.length-1);
});
test("full-body collision detects tiny enclosed holes, crossed boundaries, rotation and swept walls",()=>{
  const surface=vehicle.createVehicleSurface([[[[-20,-30],[20,-30],[20,30],[-20,30]],[[.3,.3],[.4,.3],[.4,.4],[.3,.4]]]]);
  assert.equal(surface.fits({x:0,z:0,yaw:0}),false,"Interior hole missed by nine sparse body samples");
  const wall=vehicle.createVehicleSurface([[[[-8,-20],[8,-20],[8,0],[-8,0]]],[[[-8,.02],[8,.02],[8,20],[-8,20]]]]);
  const hit=vehicle.stepVehicle({x:0,z:-2.15,yaw:0,speed:13,steer:0,blocked:false},{...neutral,throttle:1},.1,wall.fits);
  assert.ok(hit.blocked);assert.equal(hit.speed,0);assert.ok(wall.fits(hit));assert.ok(hit.z<-2.08);
  assert.equal(wall.fits({x:7,z:-8,yaw:Math.PI/2}),false,"Rotated full body cannot cross edge");
});
test("driving accelerates, brakes, reverses, recentres and is stable across frame rates",()=>{
  const start={x:0,z:0,yaw:0,speed:0,steer:0,blocked:false},allowed=()=>true;
  const run=(hz)=>{let car={...start};for(let i=0;i<hz*3;i++)car=vehicle.stepVehicle(car,{throttle:1,steering:i<hz?0:.4,brake:false},1/hz,allowed);return car;};
  const a=run(30),b=run(60),c=run(120);assert.ok(a.speed>5);assert.ok(distance([a.x,a.z],[b.x,b.z])<.05);assert.ok(distance([a.x,a.z],[c.x,c.z])<.05);
  let car=a;for(let i=0;i<120;i++)car=vehicle.stepVehicle(car,{...neutral,throttle:-1},1/60,allowed);assert.ok(car.speed<0);assert.ok(Math.abs(car.steer)<.001);
  for(let i=0;i<60;i++)car=vehicle.stepVehicle(car,{...neutral,brake:true},1/60,allowed);assert.equal(car.speed,0);
});
test("entry requires proximity, exit requires stopping and clear reachable space; free car persists",()=>{
  const sim=createSimulation(city);const original=structuredClone(sim.state);sim.interact();assert.equal(sim.state.vehicle.occupied,false);
  walk(sim,[20,-65.3]);sim.interact();assert.ok(sim.state.vehicle.occupied);assert.equal(sim.state.inventory.length,original.inventory.length);
  for(let i=0;i<60;i++)sim.tick(1/60,0,0,false,{...neutral,throttle:1});
  sim.interact();assert.ok(sim.state.vehicle.occupied,"Cannot exit while moving");
  for(let i=0;i<60;i++)sim.tick(1/60,0,0,false,{...neutral,brake:true});
  const parked=structuredClone(sim.state.vehicle.car);sim.interact();assert.equal(sim.state.vehicle.occupied,false);assert.ok(world.fits([sim.state.player.x,sim.state.player.z]));assert.ok(vehicle.bodyDistance(parked,[sim.state.player.x,sim.state.player.z])>.5);assert.deepEqual(sim.state.vehicle.car,parked);
  assert.equal(transportWorld.exit(parked,[-1,1].flatMap(side=>[0,-1.5,1.5].map(fore=>({point:[parked.x+side*2*Math.cos(parked.yaw)+fore*Math.sin(parked.yaw),parked.z-side*2*Math.sin(parked.yaw)+fore*Math.cos(parked.yaw)],radius:1})))),null);
});
test("delivery completes with real walk and digital drive inputs, parking, handoff and one reward",()=>{
  const sim=createSimulation(city);sim.calm(true);walk(sim,transport.transportData.giver);sim.interact();assert.equal(sim.state.dialogue.context,"delivery:start");sim.choose("accept");assert.ok(sim.state.inventory.includes(transport.PARCEL));
  walk(sim,[20,-65.3]);sim.interact();assert.ok(sim.state.vehicle.occupied);
  const contacts=driveInputs(sim);assert.equal(contacts,0,"Verified route is driveable with ordinary digital inputs");assert.equal(sim.state.delivery.stage,"arrived");
  const parked=structuredClone(sim.state.vehicle.car);sim.interact();assert.equal(sim.state.vehicle.occupied,false);walk(sim,transport.transportData.recipient);sim.interact();assert.equal(sim.state.delivery.stage,"closed");assert.equal(sim.state.money,75);assert.equal(sim.state.delivery.reward,55);assert.ok(!sim.state.inventory.includes(transport.PARCEL));
  sim.dismiss();sim.interact();assert.equal(sim.state.money,75);assert.deepEqual(sim.state.vehicle.car,parked);assert.equal(sim.state.stage,"available");assert.equal(sim.state.missing.stage,"available");
});
test("car aerial/pause state, recovery and schema3 migration preserve all older progress",()=>{
  const sim=createSimulation(city);sim.state.money=193;sim.state.trust=2;
  const legacy=sim.serialize();legacy.version=3;delete legacy.state.vehicle;delete legacy.state.delivery;delete legacy.state.drivingDistance;
  const migrated=parseSave(JSON.stringify(legacy));assert.ok(migrated);assert.equal(migrated.version,5);assert.equal(migrated.state.money,193);assert.equal(migrated.state.trust,2);assert.deepEqual(migrated.state.time,legacy.state.time);
  const resumed=createSimulation(city);resumed.restore(migrated);walk(resumed,[20,-65.3]);resumed.interact();resumed.tick(.1,0,0,false,{...neutral,throttle:1});
  resumed.mode("aerial");const before=resumed.serialize();resumed.tick(.1,0,0,false,{...neutral,throttle:1,steering:1});assert.deepEqual(resumed.serialize().state,before.state);assert.deepEqual(resumed.serialize().runtime,before.runtime);
  resumed.mode("ground");assert.deepEqual(resumed.state.vehicle.car,before.state.vehicle.car);
  const saved=resumed.serialize();saved.state.vehicle.car.x=600;saved.state.vehicle.car.z=700;saved.state.delivery.stage="accepted";saved.state.inventory.push(transport.PARCEL);
  const restored=createSimulation(city);restored.restore(parseSave(JSON.stringify(saved)));assert.ok(restored.transport.surface.fits(restored.state.vehicle.car));assert.equal(restored.state.vehicle.car.speed,0);assert.equal(restored.state.vehicle.occupied,true);assert.equal(restored.state.delivery.stage,"accepted");assert.equal(restored.state.money,193);assert.equal(restored.state.player.x,restored.state.vehicle.car.x);
  restored.recover();assert.equal(restored.state.delivery.stage,"accepted");assert.equal(restored.state.delivery.checkpoint,0);
  for(const patch of [{speed:NaN},{steer:2},{x:Infinity}]){const bad=structuredClone(saved);Object.assign(bad.state.vehicle.car,patch);assert.equal(parseSave(JSON.stringify(bad)),null);}
  const inconsistent=structuredClone(saved);inconsistent.state.delivery.reward=55;assert.equal(parseSave(JSON.stringify(inconsistent)),null);
});
test("bounded traffic follows the closed loop, yields to bodies/pedestrians and never crosses curbs",()=>{
  const network=transport.createTransport(city,world),travel=Array(6).fill(0);
  for(let i=0;i<1800;i++){const before=network.traffic.map(a=>({...a.pose}));network.tickTraffic(1/60,[-10,-72],[],6);for(const a of network.traffic){assert.ok(network.surface.fits(a.pose));const step=distance([a.pose.x,a.pose.z],[before[a.id].x,before[a.id].z]);assert.ok(step<=.301,"At most a bounded 0.1 second distant update, including the loop seam");travel[a.id]+=step;}}
  assert.ok(travel.every(d=>d>10),JSON.stringify(travel));
  const a=network.traffic[0],stop=[a.pose.x,a.pose.z];network.tickTraffic(.1,stop,[{point:stop,radius:2}],3);for(let i=0;i<30;i++)network.tickTraffic(.1,stop,[{point:stop,radius:2}],3);assert.equal(a.speed,0);
  assert.equal(vehicle.obstacleFree({x:0,z:0,yaw:0},[{point:[0,2.3],radius:.5}]),false);
  assert.equal(vehicle.bodiesOverlap({x:0,z:0,yaw:0},{x:1,z:0,yaw:Math.PI/2}),true);
});
test("train remains on one joined elevated guideway, dwells and reverses without position jumps",()=>{
  assert.deepEqual(transportSource.rail.sourceIndices,[6,15,1,19,7]);const path=transportWorld.rail;
  let last=transport.trainProgress(0,path.length),dwell=0,reverse=false;
  for(let i=1;i<=3600;i++){const next=transport.trainProgress(i/10,path.length);assert.ok(next>=24&&next<=path.length-24);assert.ok(Math.abs(next-last)<1.3);if(next===last)dwell++;if(next<last)reverse=true;last=next;}
  assert.ok(dwell>100);assert.ok(reverse);assert.equal(transportSource.rail.deckCentreY,8.2);assert.equal(transportSource.rail.boarding,false);
});

test('transport models release line and shared car/train GPU resources exactly once', async () => {
  const THREE=await import('three'), {buildTransport}=await import('./transportScene.ts'), {disposeScene}=await import('./resources.ts');
  const scene=new THREE.Scene(), sim=createSimulation(city); buildTransport(scene,sim.transport);
  const resources=new Set(); scene.traverse(o=>{if(o.geometry) resources.add(o.geometry); if(o.material) for(const m of Array.isArray(o.material)?o.material:[o.material]) resources.add(m);});
  const counts=new Map([...resources].map(r=>[r,0])); for(const r of resources) r.addEventListener('dispose',()=>counts.set(r,counts.get(r)+1));
  disposeScene(scene,{dispose(){},forceContextLoss(){}},null,{remove(){}});
  assert.ok(resources.size>15); assert.ok([...counts.values()].every(n=>n===1));
});
test('illustrative rail columns have regular separation and stay clear of paved driving roads', async () => {
  const {railSupports,onSurface}=await import('./surfaces.ts'); const supports=railSupports(city);
  assert.ok(supports.length>0);
  for(let i=0;i<supports.length;i++) {
    assert.equal(onSurface(supports[i],city.pavement),false);
    assert.ok(supports.slice(i+1).every(q=>distance(supports[i],q)>=24));
    for(let d=0;d<transportWorld.route.length;d+=.25) assert.ok(vehicle.bodyDistance(transport.onPath(transportWorld.route,d),supports[i])>1.3);
  }
});

const navigation = await import('./navigation.ts');
const networkSource = JSON.parse(readFileSync(new URL('../../public/surrey/v0.6-2026-10-30/network.json',import.meta.url)));
test('V06 keeps source versions immutable and advertises one connected, branching road component',()=>{
  assert.equal(networkSource.parentSha256,manifest.sha256);
  const sourceManifest=JSON.parse(readFileSync(new URL('../../public/surrey/v0.6-2026-10-30/manifest.json',import.meta.url)));
  const sourceBytes=readFileSync(new URL('../../public/surrey/v0.6-2026-10-30/network.json',import.meta.url));
  assert.equal(createHash('sha256').update(sourceBytes).digest('hex'),sourceManifest.sha256);assert.equal(sourceBytes.length,sourceManifest.bytes);assert.equal(networkSource.driveSurface.length,1);
  assert.equal(networkSource.edges.length,133);assert.equal(new Set(networkSource.edges.map(e=>e.id)).size,133);
  assert.ok(networkSource.validation.uniqueEdgePathLengthM>16000);
  assert.ok(networkSource.validation.uniqueEdgePathLengthM<=networkSource.edges.reduce((sum,e)=>sum+e.lengthM,0)+1);
  assert.equal(networkSource.destinations.length,8);assert.ok(networkSource.validation.sourceJunctions>50);
  const reached=new Set(['r178:0','r178:1']);let grew=true;
  while(grew){grew=false;for(const turn of networkSource.turns){const [a,b]=turn.split('>');if(reached.has(a)&&!reached.has(b)){reached.add(b);grew=true;}}}
  for(const edge of networkSource.edges){assert.ok(reached.has(edge.id+':0')||reached.has(edge.id+':1'));assert.equal(edge.sourceStatus,'Open');assert.notEqual(edge.roadName,'Local street');}
  for(const turn of networkSource.validation.rejectedTurns)assert.ok(!networkSource.turns.includes(turn));
});
test('all eight GPS destinations and their return routes support the full compact and a foot exit',()=>{
  for(const stop of transport.roadNetwork.destinations){
    for(const [car,id] of [[transport.transportData.spawn,stop.id],[{x:stop.point[0],z:stop.point[1],yaw:stop.yaw},'station']]){
      const r=transportWorld.navigator.calculate(car,id);assert.ok(r,`Route to ${id} from ${stop.id}`);
      const path=transport.pathMetrics(r.points);for(let d=0;d<path.length;d+=.5)assert.ok(transportWorld.surface.fits(transport.onPath(path,d)));
    }
    const car={x:stop.point[0],z:stop.point[1],yaw:stop.yaw,speed:0,steer:0,blocked:false};
    assert.ok(transportWorld.surface.fits(car));assert.ok(transportWorld.exit(car));assert.ok(world.fits(stop.foot));
  }
});
test('GPS reroutes after sustained deviation, clears, waits for a stop and never moves the car',()=>{
  const state=navigation.newNavigation(),car={...transport.transportData.spawn,speed:0};
  transportWorld.guidance.select(state,car,'station');const old=state.revision,original=structuredClone(car);
  transportWorld.guidance.tick(state,car,.1);assert.equal(state.revision,old);assert.deepEqual(car,original);
  const hall=transport.roadNetwork.destinations.find(s=>s.id==='hall');Object.assign(car,{x:hall.point[0],z:hall.point[1],yaw:hall.yaw});
  const deviated=structuredClone(car);for(let i=0;i<12;i++)transportWorld.guidance.tick(state,car,.1);
  assert.equal(state.reroutes,1);assert.equal(state.status,'guiding');assert.deepEqual(car,deviated);
  const station=transport.roadNetwork.destinations.find(s=>s.id==='station');Object.assign(car,{x:station.point[0],z:station.point[1],yaw:station.yaw,speed:3});
  transportWorld.guidance.select(state,car,'station');transportWorld.guidance.tick(state,car,.1);assert.notEqual(state.status,'arrived');
  car.speed=0;transportWorld.guidance.tick(state,car,.1);assert.equal(state.status,'arrived');
  transportWorld.guidance.select(state,car,null);assert.equal(state.destination,null);assert.equal(state.route,null);
});
test('unreachable navigation does not repeatedly search while a stopped driver reads the message',()=>{
  let searches=0;const guidance=navigation.createGuidance(transport.roadNetwork,{calculate(){searches++;return null;}});
  const state=navigation.newNavigation(),car={...transport.transportData.spawn,speed:0};guidance.select(state,car,'holland');
  for(let i=0;i<600;i++)guidance.tick(state,car,.1);
  assert.equal(state.status,'unreachable');assert.equal(searches,1);
  car.x+=6;guidance.tick(state,car,.1);assert.equal(searches,2);
});
test('fictional workzone blocks a full body and GPS finds a materially different connected path',()=>{
  const direct=transportWorld.navigator.calculate(transport.transportData.spawn,'central'),alternative=transportWorld.navigator.calculate(transport.transportData.spawn,'central',new Set([transport.roadworks.edgeId]));
  assert.ok(direct.edges.includes(transport.roadworks.edgeId));assert.ok(!alternative.edges.includes(transport.roadworks.edgeId));assert.ok(alternative.length>direct.length+300);
  assert.ok(transport.closureOverlaps({x:transport.roadworks.point[0],z:transport.roadworks.point[1],yaw:transport.roadworks.yaw}));
  const path=transport.pathMetrics(alternative.points);for(let d=0;d<path.length;d+=.25)assert.equal(transport.closureOverlaps(transport.onPath(path,d)),false);
});
test('detour GPS names the outgoing streets and ignores repeated source endpoints',()=>{
  const route=transportWorld.navigator.calculate(transport.transportData.spawn,'central',new Set([transport.roadworks.edgeId]));
  assert.deepEqual(route.turns.map(({direction,street})=>[direction,street]),[
    ['right','City Parkway'],['left','102 Ave'],['right','King George Blvd'],['right','Old Yale Rd'],
  ]);
  assert.ok(Math.abs(route.length-transport.roadReport.detour.alternateM)<.001,'Guidance labels must not change the validated route');
  assert.ok(route.turns.at(-1).at<route.length-100,'A duplicate roadside endpoint must not invent an arrival turn');
});
function driveDetour(sim){
  const path=transport.pathMetrics(sim.state.navigation.route.points);let contacts=0;
  for(let i=0;i<60000&&sim.state.detour.stage==='accepted';i++){
    const car=sim.state.vehicle.car,progress=navigation.projectPath(path.points,[car.x,car.z]).progress,target=transport.onPath(path,Math.min(path.length,progress+4));
    const braking=distance([car.x,car.z],path.points.at(-1))<4;
    const error=Math.atan2(Math.sin(Math.atan2(target.x-car.x,target.z-car.z)-car.yaw),Math.cos(Math.atan2(target.x-car.x,target.z-car.z)-car.yaw));
    sim.tick(1/60,0,0,false,{throttle:braking?0:car.speed<2.8?1:0,steering:braking?0:Math.abs(error)>.018?Math.sign(error):0,brake:braking});
    assert.ok(sim.transport.surface.fits(sim.state.vehicle.car));assert.equal(transport.closureOverlaps(sim.state.vehicle.car),false);
    if(sim.state.vehicle.car.blocked)contacts++;
    assert.ok(contacts<9,`Unexpected obstruction at ${sim.state.vehicle.car.x},${sim.state.vehicle.car.z}`);
  }
  return contacts;
}
test('Case05 completes through ordinary movement inputs, park/exit/handoff, save and one reward',()=>{
  const sim=createSimulation(city);sim.calm(true);walk(sim,transport.detourMission.giver);sim.interact();assert.equal(sim.state.dialogue.context,'detour:start');sim.choose('accept');
  assert.ok(sim.state.inventory.includes(transport.PACKAGE));assert.equal(sim.state.navigation.destination,'central');
  walk(sim,[20,-65.3]);sim.interact();assert.ok(sim.state.vehicle.occupied);
  const resumed=createSimulation(city);resumed.restore(parseSave(JSON.stringify(sim.serialize())));assert.equal(resumed.state.detour.stage,'accepted');assert.equal(resumed.state.navigation.destination,'central');
  assert.equal(driveDetour(resumed),0);assert.equal(resumed.state.detour.stage,'arrived');assert.equal(resumed.state.navigation.status,'arrived');assert.ok(resumed.state.detour.driven>1100);assert.ok(resumed.state.detour.roads.length>=7);
  const parked=structuredClone(resumed.state.vehicle.car);resumed.mode('aerial');const frozen=resumed.serialize();resumed.tick(.1,0,0,false,{throttle:1,steering:1,brake:false});assert.deepEqual(resumed.serialize(),frozen);resumed.mode('ground');
  resumed.interact();assert.equal(resumed.state.vehicle.occupied,false);walk(resumed,transport.detourMission.recipient);resumed.interact();assert.equal(resumed.state.detour.stage,'closed');assert.equal(resumed.state.money,105);assert.equal(resumed.workZoneActive(),false);assert.ok(!resumed.state.inventory.includes(transport.PACKAGE));assert.deepEqual(resumed.state.vehicle.car,parked);
  resumed.dismiss();resumed.interact();assert.equal(resumed.state.money,105);
  const saved=parseSave(JSON.stringify(resumed.serialize()));assert.ok(saved);assert.equal(saved.state.detour.reward,85);assert.equal(saved.state.navigation.route,null);
});
test('V04 saves retain original missions, parked car, clock and money while gaining default free driving',()=>{
  const sim=createSimulation(city);const saved=sim.serialize();saved.version=4;saved.state.money=211;saved.state.vehicle.car={...saved.state.vehicle.car,x:25};
  for(const key of ['navigation','detour','transportVersion','trafficDensity'])delete saved.state[key];
  const migrated=parseSave(JSON.stringify(saved));assert.ok(migrated);assert.equal(migrated.version,5);assert.equal(migrated.state.navigation.destination,null);assert.equal(migrated.state.detour.stage,'available');assert.equal(migrated.state.money,211);assert.deepEqual(migrated.state.vehicle,saved.state.vehicle);assert.deepEqual(migrated.state.time,saved.state.time);
  const bad=sim.serialize();bad.state.detour.stage='closed';bad.state.detour.reward=85;assert.equal(parseSave(JSON.stringify(bad)),null);
  bad.state.detour.stage='available';bad.state.detour.reward=0;bad.state.navigation.destination='imaginary';assert.equal(parseSave(JSON.stringify(bad)),null);
});
test('traffic never initializes on the saved car and Low preserves nearby actors without respawns',()=>{
  const t=transport.createTransport(city,world),parked={...t.traffic[0].pose};t.placeTraffic([{car:parked}]);assert.ok(t.traffic.every(a=>!vehicle.bodiesOverlap(a.pose,parked)));
  const before=t.traffic.map(a=>({...a.pose}));t.tickTraffic(.1,[parked.x,parked.z],[{car:parked}],3,40);
  for(const actor of t.traffic)assert.ok(distance([actor.pose.x,actor.pose.z],[before[actor.id].x,before[actor.id].z])<.31);
});
test('independent touch/keyboard ownership permits steering plus throttle and releases safely',async()=>{
  const {createInputState}=await import('./input.ts'),input=createInputState();input.set('finger1','forward',true);input.set('finger2','left',true);input.set('key:w','forward',true);
  assert.ok(input.has('forward')&&input.has('left'));input.set('finger1','forward',false);assert.ok(input.has('forward'));input.set('finger2','left',false);assert.equal(input.has('left'),false);input.clear();assert.equal(input.has('forward'),false);
});
test('fictional signals give pedestrians only the red interval and cycle consistently',async()=>{
  const {signalState}=await import('./signals.ts');assert.equal(signalState(0).phase,'green');assert.equal(signalState(33).phase,'yellow');assert.equal(signalState(40).phase,'red');assert.equal(signalState(40).pedestrians,true);assert.equal(signalState(33).pedestrians,false);assert.deepEqual(signalState(0),signalState(68));
});
test('accelerated road containment agrees with the original polygon predicate including holes',async()=>{
  const {inPolygon}=await import('../vancouver/physics.ts');let seed=7654321;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
  for(let i=0;i<1500;i++){const p=[city.bounds[0]+rand()*(city.bounds[2]-city.bounds[0]),city.bounds[1]+rand()*(city.bounds[3]-city.bounds[1])];assert.equal(transportWorld.surface.allowed(p),transport.transportData.polygons.some(poly=>inPolygon(p,poly)));}
});
test('NPC cars obey the same signal phase and crossing pedestrians wait for enough red time',()=>{
  const base=transport.createTransport(city,world),a=base.traffic[0].pose,signal=[a.x+Math.sin(a.yaw)*10,a.z+Math.cos(a.yaw)*10];
  const t=transport.createTransport({...city,signals:[signal]},world),before={...t.traffic[0].pose};
  for(let i=0;i<60;i++)t.tickTraffic(1/60,[a.x,a.z],[],6,40);assert.deepEqual(t.traffic[0].pose,before);
  for(let i=0;i<60;i++)t.tickTraffic(1/60,[a.x,a.z],[],6,0);assert.ok(distance([a.x,a.z],[t.traffic[0].pose.x,t.traffic[0].pose.z])>.2);
  const person=populationPlan(city,world,24).find(p=>p.crossing);assert.ok(person);person.pause=0;
  const start=[person.pose.x,person.pose.z],player=[start[0]+10,start[1]+10];
  stepPedestrians([person],player,null,.1,world,780,1,()=>true,0);assert.equal(person.pose.moving,false);
  stepPedestrians([person],player,null,.1,world,780,1,()=>true,65);assert.equal(person.pose.moving,false);
  stepPedestrians([person],player,null,.1,world,780,1,()=>true,36);assert.ok(person.pose.moving);
});
test('GPS route replacement disposes old geometry and preserves one shared scene',async()=>{
  const THREE=await import('three'),{buildTransport}=await import('./transportScene.ts');const scene=new THREE.Scene(),sim=createSimulation(city),visual=buildTransport(scene,sim.transport);visual.update(sim.state);
  const count=scene.children.length,old=visual.gps.geometry;let disposed=0;old.addEventListener('dispose',()=>disposed++);
  sim.navigate('central');visual.update(sim.state);assert.equal(disposed,1);assert.ok(visual.gps.visible);assert.equal(visual.ribbon.visible,false);assert.equal(scene.children.length,count);
  sim.navigate(null);visual.update(sim.state);assert.equal(visual.gps.visible,false);assert.equal(visual.parking.visible,false);assert.equal(scene.children.length,count);
  const {disposeScene}=await import('./resources.ts');disposeScene(scene,{dispose(){},forceContextLoss(){}},null,{remove(){}});
});
