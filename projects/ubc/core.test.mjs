import test from "node:test";
import assert from "node:assert/strict";
import "./test-loader.mjs";
const { safeExternalUrl, characters, places, displays, answerQuestion } =
  await import("./registry.ts");
import { solarPosition, normalizeSettings, defaults } from "./environment.ts";
import {
  createCollision,
  createRoutes,
  global,
  local,
  inPolygon,
} from "./spatial.ts";
const empty = {
  origin: [-123.245, 49.26],
  buildings: [],
  surfaces: [],
  trees: [],
  routes: [],
  entrances: [],
};

test("all visitor links use approved HTTPS destinations; hostile and deceptive URLs fail closed", () => {
  const links = [
    ...places.flatMap((p) => p.links),
    ...characters.flatMap((c) => [
      ...c.sources,
      ...c.topics.flatMap((t) => t.sources),
    ]),
    ...Object.values(displays).flatMap((d) => d.links),
  ];
  for (const l of links) assert.ok(safeExternalUrl(l.url), l.url);
  for (const u of [
    "javascript:alert(1)",
    "data:text/html,x",
    "https://ubc.ca.evil.test",
    "https://user:secret@ubc.ca",
    "http://ubc.ca",
    "//ubc.ca",
    "https://evil.test/ubc.ca",
  ])
    assert.equal(safeExternalUrl(u), null);
});
test("both named simulations have complete sourcing and grounded topic lookup with safe refusal", () => {
  assert.equal(characters.filter((c) => c.category === "named").length, 2);
  for (const c of characters) {
    assert.ok(c.verified && c.disclaimer && c.permissions && c.sources.length);
    assert.ok(c.topics.length >= 5);
    assert.equal(answerQuestion(c, "What is your private opinion?"), null);
    assert.equal(answerQuestion(c, "Where are you live right now?"), null);
    assert.equal(answerQuestion(c, "Promise that I will be admitted"), null);
    assert.equal(answerQuestion(c, "Unrelated question 9183"), null);
  }
  assert.match(characters[0].title, /Student Experience/);
  assert.equal(
    answerQuestion(characters[0], "What is operations research?").id,
    "or",
  );
  assert.equal(
    answerQuestion(characters[0], "How does healthcare optimization work?").id,
    "health",
  );
});
test("Vancouver sun calculation reflects seasons and civil-time daylight", () => {
  const summer = solarPosition("summer", 13),
    winter = solarPosition("winter", 12);
  assert.ok(
    summer.sunset - summer.sunrise > 15 && summer.sunset - summer.sunrise < 17,
  );
  assert.ok(
    winter.sunset - winter.sunrise > 8 && winter.sunset - winter.sunrise < 10,
  );
  assert.ok(summer.altitude > winter.altitude);
  assert.ok(solarPosition("summer", 0).altitude < 0);
  assert.ok(solarPosition("winter", 12).altitude > 0);
  assert.equal(
    normalizeSettings({ ...defaults, season: "summer", weather: "snow" })
      .weather,
    "clear",
  );
  assert.equal(
    normalizeSettings({ ...defaults, season: "winter", weather: "snow" })
      .weather,
    "snow",
  );
});
test("rotated metre-space coordinate transforms round-trip", () => {
  for (const yaw of [0, 0.46, -2.3, Math.PI]) {
    const a = { x: 400, z: -710, yaw };
    const p = [15.7, -24.2],
      q = local(global(p, a), a);
    assert.ok(Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-10);
  }
});
test("collision preserves polygon courtyards and blocks large-step wall tunnelling", () => {
  const ring = [
      [-10, -10],
      [10, -10],
      [10, 10],
      [-10, 10],
      [-10, -10],
    ],
    hole = [
      [-3, -3],
      [-3, 3],
      [3, 3],
      [3, -3],
      [-3, -3],
    ];
  assert.equal(inPolygon([0, 0], [ring, hole]), false);
  assert.equal(inPolygon([8, 8], [ring, hole]), true);
  const collision = createCollision(
    {
      ...empty,
      buildings: [
        { id: "test", name: "Test", height: 20, rings: [ring, hole] },
      ],
    },
    [],
    new Set(),
  );
  const p = collision.move({ x: 0, y: 0, z: 15, yaw: 0, pitch: 0 }, 0, -30);
  assert.ok(p.z > 10.2);
  assert.equal(collision.blocked([0, 0], 0), false);
});
test("walking routes follow connected source edges and reject disconnected destinations", () => {
  const routes = createRoutes({
    ...empty,
    routes: [
      {
        id: "a",
        points: [
          [0, 0],
          [10, 0],
          [10, 10],
        ],
      },
      {
        id: "b",
        points: [
          [10, 10],
          [20, 10],
        ],
      },
      {
        id: "c",
        points: [
          [200, 200],
          [210, 200],
        ],
      },
    ],
  });
  assert.deepEqual(routes.find([0, 0], [20, 10]), [
    [0, 0],
    [10, 0],
    [10, 10],
    [20, 10],
  ]);
  assert.equal(routes.find([0, 0], [210, 200]), null);
  assert.equal(routes.find([-500, -500], [0, 0]), null);
});
