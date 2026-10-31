import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { registerHooks } from "node:module";
registerHooks({
  resolve(s, c, n) {
    try {
      return n(s, c);
    } catch (e) {
      if (s.startsWith(".") && !s.endsWith(".ts")) return n(s + ".ts", c);
      throw e;
    }
  },
});
const { createSimulation } = await import("./simulation.ts"),
  { createWorld, distance, point } = await import("./world.ts"),
  { parseSave, writeSave, readSave, SAVE_KEY } = await import("./save.ts"),
  { interiorFor, interiorFits } = await import("./interiors.ts"),
  { createCamera } = await import("./camera.ts"),
  { missions } = await import("./story.ts"),
  { validateCity } = await import("./data.ts");
const root = new URL("../../public/richmond/v0.1-2026-10-30/", import.meta.url),
  city = validateCity(JSON.parse(readFileSync(new URL("city.json", root)))),
  world = createWorld(city);
const pos = (p) => ({ x: p[0], z: p[1], y: 0, yaw: Math.PI });
function indoor(s, id, p) {
  const place = s.places.get(id);
  s.state.interior = { place: id, entrance: place.entrance };
  s.state.locomotion = "walk";
  s.state.player = pos(p);
}
function pickup(s) {
  const p = s.places.get(s.state.active.pickup);
  indoor(s, p.id, interiorFor(p).pickup);
  s.interact();
  assert.equal(s.state.active.stage, "collected");
}
function handover(s) {
  const p = s.places.get(s.state.active.destination);
  if (p.interior) indoor(s, p.id, interiorFor(p).customer);
  else {
    s.state.interior = null;
    s.state.locomotion = "walk";
    s.state.player = pos(p.entrance);
  }
  s.interact();
}
test("immutable geography, licensing and required city/airport anchors", () => {
  const m = JSON.parse(readFileSync(new URL("manifest.json", root)));
  assert.match(m.licence, /odbl/);
  for (const f of m.outputs) {
    const b = readFileSync(new URL(f.path, root));
    assert.equal(b.length, f.bytes, f.path);
    assert.equal(
      createHash("sha256").update(b).digest("hex"),
      f.sha256,
      f.path,
    );
  }
  assert.ok(city.roads.filter((r) => r.class === "runway").length >= 3);
  assert.ok(city.tiles.length > 10);
  assert.ok(m.rawSources.length > 10);
  for (const id of [
    "yvr",
    "richmond-centre",
    "steveston",
    "terra-nova",
    "ikea",
    "no6",
    "knight",
    "hamilton",
  ])
    assert.ok(
      city.places.some((p) => p.id === id),
      id,
    );
});
test("viable starting budget, supplies and safe full-body placement", () => {
  const s = createSimulation(city);
  assert.equal(s.state.cash, 20);
  assert.equal(s.state.health, 100);
  assert.equal(s.state.stamina, 100);
  assert.equal(s.state.inventory.bag, 1);
  assert.ok(world.fits(s.state.car, false));
  assert.ok(world.walkFits(point(s.state.player), s.state.player.y, false));
  assert.equal(s.state.locomotion, "walk");
});
test("final walking guidance uses the entrance approach rather than a one-way vehicle loop", () => {
  for (const place of city.places) {
    const route = world.entranceRoute(pos(place.parking), place);
    assert.deepEqual(route.at(-1), place.entrance, place.id);
    assert.ok(route.length <= 3, place.id);
    for (let i = 1; i < route.length; i++)
      assert.ok(world.clear(route[i - 1], route[i]), place.id);
  }
  const yvr = city.places.find((p) => p.id === "yvr");
  const s = createSimulation(city);
  s.state.car = { ...s.state.car, ...pos(yvr.parking) };
  assert.equal(
    s.quote(missions.find((m) => m.id === "airport-lunch")).approachDistance,
    0,
  );
  const from = pos([-2717.31, -3128.8]);
  const route = world.entranceRoute(from, yvr);
  assert.deepEqual(route[0], point(from));
  assert.ok(
    route.reduce((n, p, i) => n + (i ? distance(route[i - 1], p) : 0), 0) < 200,
  );
});
test("every mission has directed connected road routing and walking time", () => {
  const s = createSimulation(city);
  for (const m of missions) {
    const q = s.quote(m);
    assert.ok(q, m.id);
    assert.ok(q.duration > q.distance / 10 + 250, m.id);
    assert.ok(q.basePay >= 8);
  }
});
test("required anchors connect through source node topology", () => {
  const start = city.places.find((p) => p.id === "richmond-centre");
  for (const id of [
    "steveston",
    "terra-nova",
    "ikea",
    "yvr",
    "no6",
    "knight",
    "hamilton",
  ]) {
    const end = city.places.find((p) => p.id === id);
    assert.ok(world.route(start.parking, end.roadNode).length > 1, id);
  }
  for (const e of city.edges) {
    const r = city.roads[e.road];
    assert.ok(r.nodes.includes(e.a) && r.nodes.includes(e.b));
  }
});
test("entrances, full-body parking and approaches clear buildings and water", () => {
  for (const p of city.places) {
    assert.ok(world.walkFits(p.entrance, 0, false), "entrance " + p.id);
    assert.ok(
      world.clear(p.parking, p.entrance, 0, false, true),
      "approach " + p.id,
    );
    const pose = world.poseNear(p.parking);
    assert.ok(world.fits(pose, false), "parking " + p.id);
    assert.ok(world.exit(pose, false), "exit " + p.id);
  }
});
test("each regional delivery gates correct inventory and pays once", () => {
  for (const m of missions) {
    const s = createSimulation(city);
    s.accept(m.id);
    assert.ok(s.state.active, m.id);
    const cash = s.state.cash;
    handover(s);
    assert.equal(s.state.cash, cash);
    pickup(s);
    const id = s.state.active.id;
    pickup(s);
    assert.equal(s.state.inventory[id], 1);
    handover(s);
    assert.equal(s.state.active, null);
    assert.ok(s.state.cash > cash);
    const paid = s.state.cash;
    s.interact();
    assert.equal(s.state.cash, paid);
    assert.equal(
      s.state.ledger.filter((k) => k === "delivery:" + id).length,
      1,
    );
  }
});
test("save/reload retains parked car, collected order and settled transactions", () => {
  const s = createSimulation(city);
  s.accept("terminal");
  pickup(s);
  const car = { ...s.state.car },
    restored = parseSave(JSON.stringify(s.state), city);
  assert.ok(restored);
  assert.deepEqual(restored.car, car);
  assert.equal(restored.active.stage, "collected");
  const next = createSimulation(city, restored);
  handover(next);
  const cash = next.state.cash,
    again = createSimulation(city, parseSave(JSON.stringify(next.state), city));
  again.interact();
  assert.equal(again.state.cash, cash);
  assert.equal(again.state.history.length, 1);
  assert.equal(SAVE_KEY, "asymmetri.richmond.save.v1");
});
test("bad saves, forged receipts, wrong versions and unavailable storage fail safely", () => {
  const s = createSimulation(city);
  assert.equal(parseSave("broken", city), null);
  for (const edit of [
    (s) => (s.cash = -1),
    (s) => (s.player.x = Infinity),
    (s) => (s.version = 99),
    (s) => (s.settings.density = 100),
    (s) => (s.inventory.malware = 1),
  ]) {
    const v = structuredClone(s.state);
    edit(v);
    assert.equal(parseSave(JSON.stringify(v), city), null);
  }
  s.accept("first-day");
  s.state.ledger.push("delivery:" + s.state.active.id);
  assert.equal(parseSave(JSON.stringify(s.state), city), null);
  const store = {
    getItem() {
      throw Error("denied");
    },
    setItem() {
      throw Error("full");
    },
    removeItem() {},
  };
  assert.equal(writeSave(store, s.state), false);
  assert.equal(readSave(store, city).state, null);
});
test("mall, terminal and office shops debit cash and prevent duplicate equipment", () => {
  for (const id of ["richmond-centre", "yvr", "airport-office"]) {
    const s = createSimulation(city),
      p = s.places.get(id),
      l = interiorFor(p);
    indoor(s, id, l.shops[0].point);
    s.interact();
    assert.equal(s.state.shopping, true);
    s.buy("medkit");
    assert.equal(s.state.cash, 11);
    assert.equal(s.state.inventory.medkit, 1);
    s.state.health = 30;
    s.use("medkit");
    assert.equal(s.state.health, 85);
    s.buy("insulation");
    assert.equal(s.state.cash, 11);
    s.state.cash = 100;
    s.buy("insulation");
    s.buy("insulation");
    assert.equal(s.state.cash, 72);
    assert.equal(s.state.inventory.insulation, 1);
  }
});
test("four cameras preserve progression; aerial and pause freeze every gameplay clock", () => {
  const s = createSimulation(city);
  s.accept("airport-lunch");
  const cam = createCamera(city),
    b = structuredClone(s.state);
  for (const mode of ["third", "first", "top", "aerial"]) {
    s.camera(mode);
    assert.ok(cam.pose(s.state).position.every(Number.isFinite));
    assert.deepEqual(s.state.car, b.car);
    assert.deepEqual(s.state.player, b.player);
    assert.deepEqual(s.state.active, b.active);
    assert.equal(s.state.cash, b.cash);
  }
  s.step(60, new Set(["forward"]), 0);
  assert.equal(s.state.elapsed, b.elapsed);
  assert.equal(s.state.active.remaining, b.active.remaining);
  cam.focus([10000, 10000]);
  assert.deepEqual(s.state.player, b.player);
  s.camera("third");
  s.pause(true);
  s.step(10, new Set(["forward"]), 0);
  assert.equal(s.state.elapsed, b.elapsed);
});
test("enter/exit validates stopping and preserves car state", () => {
  const s = createSimulation(city),
    car = { ...s.state.car };
  s.state.player = world.exit(s.state.car, false);
  s.vehicle();
  assert.equal(s.state.locomotion, "drive");
  s.state.car.speed = 6;
  s.vehicle();
  assert.equal(s.state.locomotion, "drive");
  s.state.car.speed = 0;
  s.vehicle();
  assert.equal(s.state.locomotion, "walk");
  assert.equal(s.state.car.x, car.x);
  assert.equal(s.state.car.condition, car.condition);
});
test("interior interaction targets fit actual floor geometry", () => {
  for (const p of city.places.filter((p) => p.interior)) {
    const l = interiorFor(p);
    for (const q of [
      l.spawn,
      l.exit,
      l.pickup,
      l.customer,
      ...l.shops.map((s) => s.point),
    ])
      assert.ok(interiorFits(q, l), p.id + " " + q);
    assert.equal(interiorFits([l.width, 0], l), false);
  }
});
test("Gentle Streets, bounded encounter costs and recovery prevent debt/health traps", () => {
  const s = createSimulation(city);
  s.state.cooldown = 0;
  s.state.settings.gentle = true;
  for (let i = 0; i < 100; i++) s.step(0.1, new Set(), 0);
  assert.equal(s.state.encounter, null);
  const cash = s.state.cash;
  s.state.encounter = {
    id: "event-1",
    kind: "robbery",
    origin: point(s.state.player),
    remaining: 12,
    warning: "test",
  };
  s.resolve("give");
  assert.equal(s.state.cash, Math.max(0, cash - 8));
  assert.equal(s.state.encounter, null);
  assert.ok(s.state.cooldown >= 90);
  s.state.health = 0;
  s.state.car.condition = 0;
  s.recover();
  assert.ok(s.state.health >= 60);
  assert.ok(s.state.car.condition >= 40);
  assert.ok(s.state.cash >= 0);
});
test("runway surface is gated from ordinary road vehicles", () => {
  const r = city.roads.find((r) => r.class === "runway"),
    a = r.points[0],
    b = r.points[r.points.length - 1],
    mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  assert.equal(world.support(mid, 0, false), null);
  assert.notEqual(world.support(mid, 0, true), null);
  const s = createSimulation(city);
  s.airfield(true);
  assert.equal(s.state.airfield, true);
  assert.equal(s.state.cash, 20);
});
test("long stalls are capped instead of tunnelling or applying unseen hours", () => {
  const s = createSimulation(city);
  s.state.player = world.exit(s.state.car, false);
  s.vehicle();
  const start = point(s.state.car);
  s.step(600, new Set(["forward"]), 0);
  assert.ok(distance(start, point(s.state.car)) < 2);
  assert.ok(s.state.elapsed <= 0.1);
});

test("local population moves on valid public surfaces without parking in narrow lanes", async () => {
  const { createPopulation } = await import("./population.ts");
  const p = city.places.find((p) => p.id === "richmond-centre").parking;
  const pop = createPopulation(city, world);
  pop.configure(p, 1, null);
  assert.ok(pop.pedestrians.length > 20);
  assert.ok(pop.traffic.length > 3);
  for (const actor of pop.traffic) {
    assert.ok(world.fits(actor, false));
    assert.equal(city.roads[city.edges[actor.edge].road].kind, "road");
    if (actor.wait > 20)
      assert.ok(city.roads[city.edges[actor.edge].road].width >= 8);
  }
  const people = new Map(pop.pedestrians.map((a) => [a.id, point(a)]));
  const cars = new Map(pop.traffic.map((a) => [a.id, point(a)]));
  const hero = pos(p);
  for (let i = 0; i < 300; i++) pop.step(0.05, i * 0.05, hero, hero);
  assert.ok(
    pop.pedestrians.filter((a) => distance(point(a), people.get(a.id)) > 2)
      .length > 5,
  );
  assert.ok(pop.traffic.some((a) => distance(point(a), cars.get(a.id)) > 5));
  assert.ok(pop.traffic.every((a) => world.fits(a, false)));
});

test("older v1 settings migrate and threat controls stay bounded", () => {
  const s = createSimulation(city);
  delete s.state.settings.encounterRate;
  delete s.state.settings.encounterSeverity;
  const restored = parseSave(JSON.stringify(s.state), city);
  assert.equal(restored.settings.encounterRate, 1);
  assert.equal(restored.settings.encounterSeverity, 1);
  const game = createSimulation(city, restored);
  game.settings({ encounterRate: 100, encounterSeverity: -5 });
  assert.equal(game.state.settings.encounterRate, 1.5);
  assert.equal(game.state.settings.encounterSeverity, 0.5);
});

test("order quotes include travel to the pickup before starting the delivery", () => {
  const sim = createSimulation(city),
    mission = missions.find((m) => m.id === "mall");
  const mall = sim.places.get("richmond-centre"),
    remote = sim.places.get("steveston");
  sim.state.car = { ...sim.state.car, ...pos(mall.parking) };
  const near = sim.quote(mission);
  sim.state.car = { ...sim.state.car, ...pos(remote.parking) };
  const far = sim.quote(mission);
  assert.ok(far.approachDistance > near.approachDistance + 1000);
  assert.ok(far.duration > near.duration + 100);
  assert.equal(far.basePay, near.basePay);
});

test("driving recovery faces the active road route and remains local on the airfield", () => {
  const sim = createSimulation(city),
    restaurant = sim.places.get("alexandra");
  sim.accept("terminal");
  pickup(sim);
  sim.state.interior = null;
  sim.state.locomotion = "drive";
  sim.state.car = {
    ...sim.state.car,
    ...world.poseNear(restaurant.parking, Math.PI),
  };
  const before = point(sim.state.car),
    cash = sim.state.cash;
  sim.recover();
  assert.ok(distance(before, point(sim.state.car)) < 15);
  assert.ok(
    Math.cos(sim.state.car.yaw) > 0.9,
    "faces the southbound departure",
  );
  assert.ok(world.fits(sim.state.car, false));
  assert.equal(sim.state.active.stage, "collected");
  assert.equal(sim.state.cash, cash);
  sim.cancel();
  sim.state.airfield = true;
  const runway = city.roads.find((r) => r.class === "runway");
  const a = runway.points[0],
    b = runway.points[1],
    at = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  sim.state.car = {
    ...sim.state.car,
    ...pos(at),
    yaw: Math.atan2(b[0] - a[0], b[1] - a[1]),
  };
  sim.recover();
  assert.ok(
    distance(at, point(sim.state.car)) < 35,
    "does not jump from runway to a public road",
  );
  assert.ok(world.fits(sim.state.car, true));
});

test("bumper overlap can separate without allowing vehicles to pass through actors", () => {
  const runway = city.roads.find((r) => r.class === "runway"),
    a = runway.points[0],
    b = runway.points[1];
  const origin = {
    x: (a[0] + b[0]) / 2,
    z: (a[1] + b[1]) / 2,
    y: 0,
    yaw: Math.atan2(b[0] - a[0], b[1] - a[1]),
  };
  for (const offset of [-3.8, 8]) {
    const sim = createSimulation(city);
    sim.state.airfield = true;
    sim.state.settings.gentle = true;
    sim.state.locomotion = "drive";
    sim.state.car = { ...sim.state.car, ...origin };
    sim.state.player = { ...origin };
    sim.obstacles([
      {
        ...origin,
        x: origin.x + Math.sin(origin.yaw) * offset,
        z: origin.z + Math.cos(origin.yaw) * offset,
        vehicle: true,
      },
    ]);
    for (let i = 0; i < 100; i++)
      sim.step(0.05, new Set(["forward"]), origin.yaw);
    const moved = distance(point(sim.state.car), point(origin));
    if (offset < 0)
      assert.ok(moved > 5, "can pull away from an overlapping rear bumper");
    else assert.ok(moved < 5, "stops before a vehicle ahead");
  }
});

test("junction traffic cannot rotate into an otherwise stationary full car", async () => {
  const { createPopulation } = await import("./population.ts");
  const { penetration } = await import("./collision.ts");
  const pop = createPopulation(city, world);
  pop.configure([-1319.23, -1495.8], 1, null);
  const actor = pop.traffic.find((a) => a.id === 202);
  assert.ok(actor, "reproduction actor exists");
  Object.assign(actor, {
    x: -1220.6462771456866,
    z: -1542.2977497142633,
    y: 0,
    yaw: 1.1096178485787758,
    t: 0.999,
    direction: 1,
    edge: 32759,
    wait: 0,
    speed: 7,
  });
  const car = {
    x: -1220.8986660542064,
    z: -1546.4541395020624,
    y: 0,
    yaw: Math.PI * 0.75,
  };
  assert.equal(penetration(car, actor), 0);
  for (let i = 0; i < 60; i++) {
    pop.step(1 / 60, i / 60, car, car);
    assert.equal(penetration(car, actor), 0);
  }
});
test("turning out of an existing actor overlap never deepens contact at 15/30/60/120 Hz", async () => {
  const { penetration } = await import("./collision.ts");
  const r = city.roads.find((r) => r.class === "runway"),
    a = r.points[0],
    b = r.points[1];
  const origin = { x: (a[0] + b[0]) / 2, z: (a[1] + b[1]) / 2, y: 0, yaw: 0 };
  for (const hz of [15, 30, 60, 120]) {
    const s = createSimulation(city);
    Object.assign(s.state.car, origin, { speed: 1, steer: 0.3 });
    s.state.player = { ...s.state.car };
    s.state.airfield = true;
    s.state.locomotion = "drive";
    s.state.settings.gentle = true;
    const actor = {
      x: origin.x + 2.75,
      z: origin.z - 0.5,
      y: 0,
      yaw: (Math.PI * 7) / 8,
      vehicle: true,
    };
    s.obstacles([actor]);
    let prior = penetration(s.state.car, actor);
    for (let i = 0; i < hz; i++) {
      s.step(1 / hz, new Set(["forward", "left"]), 0);
      const next = penetration(s.state.car, actor);
      assert.ok(next <= prior + 1e-6, `${hz}Hz overlap deepened`);
      prior = next;
    }
    // Reverse can separate; no teleport, disappearance, or condition reset.
    const p = point(s.state.car),
      cash = s.state.cash;
    for (let i = 0; i < hz * 3; i++) s.step(1 / hz, new Set(["back"]), 0);
    assert.ok(distance(p, point(s.state.car)) > 2);
    assert.equal(s.state.cash, cash);
  }
});
test("whole-body contacts include small people and preserve grade separation", async () => {
  const { penetration, contactAllows } = await import("./collision.ts");
  const car = { x: 0, z: 0, y: 0, yaw: 0 };
  assert.ok(penetration(car, { x: 0.55, z: 1.1, y: 0, yaw: 0 }) > 0);
  assert.equal(
    penetration(car, { x: 0, z: 0, y: 8, yaw: 0, vehicle: true }),
    0,
  );
  const actor = { x: 0, z: 3.8, y: 0, yaw: 0, vehicle: true };
  assert.equal(contactAllows(car, { ...car, z: 0.1 }, actor), false);
  assert.equal(contactAllows(car, { ...car, z: -0.1 }, actor), true);
});
test("navigation separates walking to pickup, returning to the car, and driving to parking", async () => {
  const { navigationFor } = await import("./navigation.ts");
  const s = createSimulation(city);
  s.accept("first-day");
  let n = navigationFor(s.state, world, s.targetPlace(), s.target());
  assert.equal(n.leg, "Walk to the entrance / meeting point");
  pickup(s);
  s.state.interior = null;
  s.state.player = pos(s.places.get("brighouse").entrance);
  n = navigationFor(s.state, world, s.targetPlace(), s.target());
  assert.equal(n.leg, "Return to your parked car");
  assert.ok(distance(n.target, point(s.state.car)) < 5);
  s.state.locomotion = "drive";
  s.state.player = { ...s.state.car };
  n = navigationFor(s.state, world, s.targetPlace(), s.target());
  assert.deepEqual(n.route.at(-1), s.targetPlace().parking);
});
test("aerial exterior survey from an interior preserves career and pans after follow", () => {
  const s = createSimulation(city);
  indoor(s, "richmond-centre", [0, 48]);
  s.accept("mall-break");
  const before = structuredClone(s.state),
    cam = createCamera(city);
  s.camera("aerial");
  const pose = cam.pose(s.state);
  assert.deepEqual([pose.target[0], pose.target[2]], s.state.interior.entrance);
  cam.pan(0, 0);
  assert.equal(cam.view.follow, true, "idle aerial frames retain Find Me");
  cam.pan(100, -100);
  assert.equal(cam.view.follow, false);
  assert.notDeepEqual(cam.pose(s.state).target, pose.target);
  cam.focus(city.places.find((p) => p.id === "yvr").entrance);
  for (let i = 0; i < 60; i++) s.step(1 / 60, new Set(["forward"]), 0);
  assert.deepEqual(s.state.player, before.player);
  assert.deepEqual(s.state.car, before.car);
  assert.deepEqual(s.state.active, before.active);
  assert.deepEqual(s.state.interior, before.interior);
});

test("district refresh retains nearby actors and keeps entrances clear", async () => {
  const { createPopulation } = await import("./population.ts");
  const pop = createPopulation(city, world),
    p = city.places.find((p) => p.id === "richmond-centre").parking;
  pop.configure(p, 1, null);
  assert.ok(pop.pedestrians.length > 20);
  for (const actor of pop.pedestrians)
    assert.ok(
      city.places.every((place) => distance(place.entrance, point(actor)) >= 4),
    );
  const next = [p[0] + 135, p[1]],
    keep = pop.traffic.filter((a) => distance(point(a), next) < 85);
  pop.configure(next, 1, null);
  for (const actor of keep)
    assert.ok(
      pop.traffic.includes(actor),
      "keeps the same nearby actor object/pose",
    );
  assert.ok(pop.traffic.length <= 31);
  assert.ok(pop.pedestrians.length <= 106);
});
test("interior camera respects furniture height and solid walls", async () => {
  const { interiorCameraBlocked } = await import("./interiors.ts");
  for (const id of ["richmond-centre", "yvr", "airport-office"]) {
    const l = interiorFor(city.places.find((p) => p.id === id)),
      [a, b, c, d] = l.obstacles[0];
    assert.equal(
      interiorCameraBlocked([(a + c) / 2, 1.7, (b + d) / 2], l),
      true,
    );
    assert.equal(
      interiorCameraBlocked([(a + c) / 2, 6, (b + d) / 2], l),
      false,
    );
    assert.equal(interiorCameraBlocked([l.width / 2, 2, 0], l), true);
  }
});
