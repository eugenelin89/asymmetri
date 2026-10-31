import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
const { createWorld, distance, projection } = await import("./world.ts");
const { driveCar } = await import("./vehicle.ts");
const { createSimulation } = await import("./simulation.ts");
const { missions } = await import("./story.ts");
const { interiorFor, interiorFits, interiorRoute } = await import(
  "./interiors.ts"
);
const city = JSON.parse(
    readFileSync(
      new URL(
        "../../public/richmond/v0.1-2026-10-30/city.json",
        import.meta.url,
      ),
    ),
  ),
  world = createWorld(city);

// A test driver sends digital steering/throttle through the shipped integrator.
// It never changes position, yaw or elevation to escape a collision. The start
// pose is a fixture; every subsequent metre uses the same body collision as play.
function drive(route, airfield = false) {
  route = route.filter((p, i) => i === 0 || distance(p, route[i - 1]) > 0.03);
  let car = {
    x: route[0][0],
    z: route[0][1],
    y: 0,
    yaw: Math.atan2(route[1][0] - route[0][0], route[1][1] - route[0][1]),
    speed: 0,
    steer: 0,
    blocked: false,
    condition: 100,
  };
  let index = 0,
    stuck = 0,
    t = 0;
  for (; t < 5000; t += 0.05) {
    const pos = [car.x, car.z];
    while (index < route.length - 2 && distance(pos, route[index + 1]) < 3)
      index++;
    const a = route[index],
      b = route[index + 1],
      q = projection(pos, a, b);
    let target = q.p,
      look = 4.2,
      k = index,
      left = distance(q.p, b);
    if (left >= look)
      target = [
        q.p[0] + ((b[0] - q.p[0]) * look) / left,
        q.p[1] + ((b[1] - q.p[1]) * look) / left,
      ];
    else {
      look -= left;
      target = b;
      while (k < route.length - 2 && look > 0) {
        k++;
        const len = distance(route[k], route[k + 1]),
          f = Math.min(1, look / len);
        target = [
          route[k][0] + (route[k + 1][0] - route[k][0]) * f,
          route[k][1] + (route[k + 1][1] - route[k][1]) * f,
        ];
        look -= len;
      }
    }
    const yaw = Math.atan2(target[0] - car.x, target[1] - car.z),
      err = Math.atan2(Math.sin(yaw - car.yaw), Math.cos(yaw - car.yaw));
    const steering = err > 0.06 ? 1 : err < -0.06 ? -1 : 0,
      speed = Math.abs(err) > 0.15 || left < 12 ? 3 : 6;
    const held = new Set();
    if (car.speed < speed) held.add("forward");
    if (steering > 0) held.add("left");
    if (steering < 0) held.add("right");
    if (car.speed > speed + 1) held.add("brake");
    const next = driveCar(car, held, 0.05, world, airfield, []).car;
    car = next;
    stuck = next.blocked ? stuck + 1 : 0;
    assert.ok(stuck <= 20, `Blocked at ${car.x},${car.z}; segment ${index}`);
    if (
      distance([car.x, car.z], route.at(-1)) < 2.5 &&
      index > route.length - 4
    )
      return { car, seconds: t };
  }
  assert.fail("Driver did not reach the route end");
}

test("drive every required region through solid roads and real bridge connections", () => {
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
    const end = city.places.find((p) => p.id === id),
      route = world.route(start.parking, end.roadNode);
    assert.ok(route.length > 2, id);
    route.push(end.parking);
    const result = drive(route);
    assert.ok(distance([result.car.x, result.car.z], end.parking) < 2.5, id);
  }
});

test("every included runway drives its full length in the fictional airfield", () => {
  for (const road of city.roads.filter((r) => r.class === "runway")) {
    const result = drive(road.points, true);
    assert.ok(result.seconds > 10, road.id);
    assert.ok(
      world.exit(result.car, true),
      road.id + " permits walking and re-entry",
    );
  }
  const gate = city.airportGate;
  assert.ok(
    world.clear(gate.road, gate.apron, 0, true, false),
    "fictional connection is solid",
  );
  for (const road of city.roads.filter((r) => r.kind === "airfield"))
    for (let i = 1; i < road.points.length; i++)
      assert.ok(
        world.clear(road.points[i - 1], road.points[i], 0, true, false),
        road.id + " connected surface",
      );
});

test("every authored delivery can drive from pickup parking to customer parking", () => {
  for (const mission of missions) {
    const start = city.places.find((p) => p.id === mission.pickup),
      end = city.places.find((p) => p.id === mission.destination),
      route = world.route(start.parking, end.roadNode);
    route.push(end.parking);
    const result = drive(route);
    assert.ok(
      distance([result.car.x, result.car.z], end.parking) < 2.5,
      mission.id,
    );
  }
});

function walkIndoor(sim, target) {
  const l = interiorFor(sim.places.get(sim.state.interior.place));
  const start = [sim.state.player.x, sim.state.player.z],
    step = 2;
  const key = (p) => p.join(",");
  const goal = [Math.round(target[0] / step), Math.round(target[1] / step)],
    first = [Math.round(start[0] / step), Math.round(start[1] / step)];
  const queue = [first],
    prev = new Map([[key(first), null]]);
  let found = null;
  for (let i = 0; i < queue.length; i++) {
    const cur = queue[i];
    if (distance(cur, goal) < 1) {
      found = cur;
      break;
    }
    for (const d of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const q = [cur[0] + d[0], cur[1] + d[1]];
      if (
        !prev.has(key(q)) &&
        interiorFits([q[0] * step, q[1] * step], l, 0.7)
      ) {
        prev.set(key(q), cur);
        queue.push(q);
      }
    }
  }
  assert.ok(found, "walkable corridor to " + target);
  const path = [];
  for (let p = found; p; p = prev.get(key(p)))
    path.push([p[0] * step, p[1] * step]);
  path.reverse();
  path.push(target);
  for (const p of path) {
    let steps = 0;
    while (distance([sim.state.player.x, sim.state.player.z], p) > 0.25) {
      const yaw = Math.atan2(
        p[0] - sim.state.player.x,
        p[1] - sim.state.player.z,
      );
      sim.step(0.05, new Set(["forward"]), yaw);
      assert.ok(++steps < 300, "indoor movement blocked");
    }
  }
}

test("walk mall and airport corridors, collect, shop, exit and retain the parked car", () => {
  for (const id of ["richmond-centre", "yvr", "airport-office"]) {
    const sim = createSimulation(city),
      p = sim.places.get(id),
      l = interiorFor(p),
      car = { ...sim.state.car };
    sim.state.settings.gentle = true;
    if (id === "richmond-centre") sim.accept("mall");
    if (id === "yvr") sim.accept("airport-lunch");
    sim.state.player = { x: p.entrance[0], z: p.entrance[1], y: 0, yaw: 0 };
    sim.interact();
    assert.equal(sim.state.interior?.place, id);
    walkIndoor(sim, l.pickup);
    if (sim.state.active) {
      sim.interact();
      assert.equal(sim.state.active.stage, "collected");
    }
    walkIndoor(sim, l.shops[0].point);
    sim.interact();
    sim.buy("medkit");
    assert.equal(sim.state.cash, 11);
    assert.equal(sim.state.inventory.medkit, 1);
    sim.state.shopping = false;
    walkIndoor(sim, l.exit);
    sim.interact();
    assert.equal(sim.state.interior, null);
    assert.deepEqual(sim.state.car, car);
  }
});

test("both mall entrances connect to distinct usable exits", () => {
  const sim = createSimulation(city),
    mall = sim.places.get("richmond-centre"),
    l = interiorFor(mall);
  assert.equal(mall.entrances.length, 2);
  for (const entry of mall.entrances) {
    assert.ok(world.walkFits(entry.point, 0, false));
    assert.ok(world.clear(entry.parking, entry.point));
  }
  sim.state.player = {
    x: mall.entrances[0].point[0],
    z: mall.entrances[0].point[1],
    y: 0,
    yaw: 0,
  };
  sim.interact();
  walkIndoor(sim, l.alternateExit);
  sim.interact();
  assert.equal(sim.state.interior, null);
  assert.deepEqual(
    [sim.state.player.x, sim.state.player.z],
    mall.entrances[1].point,
  );
  sim.interact();
  assert.equal(sim.state.interior.place, mall.id);
  walkIndoor(sim, l.exit);
  sim.interact();
  assert.deepEqual(
    [sim.state.player.x, sim.state.player.z],
    mall.entrances[0].point,
  );
});

test("interior guidance follows clear corridors to counters, shops and both exits", () => {
  for (const id of ["richmond-centre", "yvr", "airport-office", "brighouse"]) {
    const layout = interiorFor(city.places.find((p) => p.id === id));
    const goals = [
      layout.pickup,
      layout.customer,
      ...layout.shops.map((s) => s.point),
      layout.alternateExit,
    ].filter(Boolean);
    for (const goal of goals) {
      const route = interiorRoute(layout.exit, goal, layout);
      assert.ok(route.length >= 2, `${id} route to ${goal}`);
      assert.deepEqual(route[0], layout.exit);
      assert.deepEqual(route.at(-1), goal);
      for (let i = 1; i < route.length; i++) {
        const a = route[i - 1],
          b = route[i],
          length = distance(a, b);
        for (let d = 0; d < length; d += 0.2)
          assert.ok(
            interiorFits(
              [
                a[0] + ((b[0] - a[0]) * d) / length,
                a[1] + ((b[1] - a[1]) * d) / length,
              ],
              layout,
            ),
            `${id} route crosses furniture`,
          );
      }
    }
  }
});
