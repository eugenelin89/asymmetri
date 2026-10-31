import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import "./test-loader.mjs";

const { createAthletics } = await import("./athletics.ts");
const { athleticsAnchors, soccerFields, trackLayout, trackPoint } = await import("./athletics-layout.ts");
const { createCollision, createRoutes, inPolygon, global, local } = await import("./spatial.ts");
const { gatewaySpawn } = await import("./gateway-layout.ts");
const data = JSON.parse(readFileSync(new URL("../../public/ubc/v0.1-2026-10-30/data.json", import.meta.url)));
const settings = { quality: "high", population: true, reducedMotion: false, hour: 12, season: "summer", weather: "clear", markers: true };
const poseAt = (a) => ({ x: a.x, z: a.z, y: 0, yaw: 0, pitch: 0 });
function fixture() {
  let collision;
  const sports = createAthletics(data, athleticsAnchors, (p, y) => collision?.blocked(p, y) || false);
  collision = createCollision(data, sports.interiors, new Set(["VBL10214"]));
  return { sports, collision };
}
function dispose(group) {
  const resources = new Set();
  group.traverse((object) => {
    if (object.geometry) resources.add(object.geometry);
    for (const material of object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : []) {
      resources.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
    }
  });
  resources.forEach((resource) => resource.dispose());
}
function walk(collision, anchor, from, target, targetY = 0) {
  let pose = { ...poseAt(anchor), x: from.x, z: from.z, y: from.y };
  const [x, z] = global(target, anchor);
  for (let i = 0; i < 2000 && Math.hypot(x - pose.x, z - pose.z) > 0.02; i++) {
    const d = Math.hypot(x - pose.x, z - pose.z), step = Math.min(0.09, d), previousY = pose.y;
    pose = collision.move(pose, (x - pose.x) * step / d, (z - pose.z) * step / d);
    assert.ok(Math.abs(pose.y - previousY) < 0.1, "Steps and slopes transition continuously");
    assert.equal(collision.blocked([pose.x, pose.z], pose.y), false);
  }
  assert.ok(Math.hypot(x - pose.x, z - pose.z) < 0.025, `Walk reaches ${target}; stopped ${local([pose.x, pose.z], anchor)}`);
  assert.ok(Math.abs(pose.y - targetY) < 0.025, `Floor ${targetY}; actual ${pose.y}`);
  return pose;
}

test("three named soccer pitches fit their real GIS turf and preserve documented dimensions", () => {
  assert.equal(soccerFields[0].length, 120 * 0.9144);
  assert.equal(soccerFields[1].width, 71 * 0.9144);
  assert.equal(soccerFields[2].measuredDimensions, false, "South Turf dimensions are explicitly an interpretation");
  for (const field of soccerFields) {
    const source = data.surfaces.find((surface) => surface.id === field.surfaceId), anchor = athleticsAnchors[field.id];
    assert.equal(source?.kind, "Field");
    assert.ok(inPolygon([anchor.x, anchor.z], source.rings));
    for (const x of [-field.width / 2, field.width / 2]) for (const z of [-field.length / 2, field.length / 2])
      assert.ok(inPolygon(global([x, z], anchor), source.rings), `${field.name} touchlines fit the source surface`);
  }
  const stadium = data.buildings.find((building) => building.id === "VBL10214"), anchor = athleticsAnchors["thunderbird-stadium"];
  const points = stadium.rings[0].map((p) => local(p, anchor));
  const stand = [0, 1].map((axis) => (Math.min(...points.map((p) => p[axis])) + Math.max(...points.map((p) => p[axis]))) / 2);
  assert.ok(stand[0] > 45 && stand[0] < 85 && Math.abs(stand[1]) < 5, "Covered stand is on the source footprint's east side");
});

test("eight constant-speed track lanes follow straight sections and true arcs inside official track paving", () => {
  const { innerRadius, measurementOffset, straightLength } = trackLayout;
  assert.ok(Math.abs(2 * straightLength + 2 * Math.PI * (innerRadius + measurementOffset) - 400) < 1e-9);
  const outer = data.surfaces.find((surface) => surface.id === trackLayout.surfaceId);
  const inner = data.surfaces.find((surface) => surface.id === trackLayout.infieldId);
  const anchor = athleticsAnchors["dhillon-track"], f = fixture();
  try {
    for (let lane = 1; lane <= 8; lane++) {
      const length = trackPoint(0, lane).length;
      for (let d = 0; d < length; d += 0.5) {
        const p = trackPoint(d, lane), next = trackPoint(d + 0.1, lane), world = global([p.x, p.z], anchor);
        assert.ok(inPolygon(world, outer.rings), `Lane ${lane} remains on sourced rubber surface`);
        assert.equal(inPolygon(world, inner.rings), false, `Lane ${lane} does not run through the grass infield`);
        assert.equal(f.collision.blocked(world, 0), false, `Lane ${lane} is clear of furniture and buildings`);
        assert.ok(Math.abs(Math.hypot(next.x - p.x, next.z - p.z) - 0.1) < 0.00002, "Motion is continuous and arc-length parameterized");
      }
      const start = trackPoint(0, lane), finish = trackPoint(length, lane);
      assert.ok(Math.hypot(start.x - finish.x, start.z - finish.z) < 1e-8);
    }
  } finally { dispose(f.sports.group); }
});

test("every sports arrival connects to the sourced campus route network and its gate admits a visitor", () => {
  const f = fixture(), routes = createRoutes(data, f.collision.blocked);
  try {
    for (const [id, anchor] of Object.entries(athleticsAnchors)) {
      assert.equal(f.collision.blocked(anchor.entry, 0), false, `${id} arrival is clear`);
      assert.ok(routes.find(gatewaySpawn, anchor.entry)?.length > 1, `${id} has directions from the new UBC entrance spawn`);
    }
    for (const field of soccerFields) {
      const anchor = athleticsAnchors[field.id];
      let pose = { ...poseAt(anchor), x: anchor.entry[0], z: anchor.entry[1] };
      pose = walk(f.collision, anchor, pose, [0, field.entryLocal[1]]);
      pose = walk(f.collision, anchor, pose, [0, 0]);
      assert.equal(inPolygon([pose.x, pose.z], data.surfaces.find((surface) => surface.id === field.surfaceId).rings), true);
      const fence = global([field.sourceWidth / 2 - 0.3, 30], anchor);
      assert.equal(f.collision.blocked(fence, 0), true, "Fence remains solid away from gates");
      const bench = global([field.width / 2 + 2, 13], anchor);
      assert.equal(f.collision.blocked(bench, 0), true, "Covered player bench is solid");
    }
  } finally { dispose(f.sports.group); }
});

test("Thunderbird Stadium's stand stairs, upper concourse, and west grass bank are walkable", () => {
  const f = fixture(), anchor = athleticsAnchors["thunderbird-stadium"];
  try {
    let pose = { ...poseAt(anchor), x: anchor.entry[0], z: anchor.entry[1] };
    pose = walk(f.collision, anchor, pose, [45, 0]);
    pose = walk(f.collision, anchor, pose, [75, 0], 8.7);
    pose = walk(f.collision, anchor, pose, [75, 20], 8.7);
    pose = walk(f.collision, anchor, pose, [76, 20], 8.7);
    pose = walk(f.collision, anchor, pose, [74, 20], 8.7);
    pose = walk(f.collision, anchor, pose, [45, 20]);
    pose = walk(f.collision, anchor, pose, [-42, 20]);
    pose = walk(f.collision, anchor, pose, [-72, 20], 5);
    pose = walk(f.collision, anchor, pose, [-42, 20]);
    walk(f.collision, anchor, pose, [0, 0]);
    assert.equal(f.collision.blocked(global([78, 0], anchor), 8.7), true, "Media booth is solid, not an invented private interior");
    assert.equal(f.collision.blocked(global([80, 30], anchor), 8.7), true, "Rear concourse wall is solid");
  } finally { dispose(f.sports.group); }
});

test("fictional practice and jogging actors are spread out, animate, yield to the visitor and honor population/reduced motion", () => {
  const f = fixture(), track = athleticsAnchors["dhillon-track"], visitor = poseAt(track);
  try {
    assert.equal(f.sports.players.length, 24);
    assert.equal(f.sports.joggers.length, 12);
    for (const field of soccerFields) {
      const team = f.sports.players.filter((p) => p.venue === field.id);
      assert.equal(team.length, 8);
      for (let i = 0; i < team.length; i++) for (let j = i + 1; j < team.length; j++)
        assert.ok(team[i].person.group.position.distanceTo(team[j].person.group.position) > 8, "Practice players are distributed across the field");
    }
    for (let i = 0; i < f.sports.joggers.length; i++) for (let j = i + 1; j < f.sports.joggers.length; j++)
      assert.ok(f.sports.joggers[i].person.group.position.distanceTo(f.sports.joggers[j].person.group.position) > 5, "Joggers start at separated phases around the track");
    const runner = f.sports.joggers[0], start = runner.distance;
    f.sports.update(0.1, settings, visitor);
    assert.ok(Math.abs(runner.distance - start - runner.speed * 0.1) < 1e-8);
    assert.ok(runner.person.legs.some((leg) => Math.abs(leg.rotation.x) > 0.1));
    const at = global([runner.person.group.position.x, runner.person.group.position.z], track), stopped = runner.distance;
    f.sports.update(0.1, settings, { ...visitor, x: at[0], z: at[1] });
    assert.equal(runner.distance, stopped, "Runner yields near the visitor");
    f.sports.update(0.1, { ...settings, reducedMotion: true }, visitor);
    assert.equal(runner.distance, stopped);
    f.sports.update(0.1, { ...settings, population: false }, visitor);
    assert.equal(f.sports.group.getObjectByName("dhillon-fictional-joggers").visible, false);
    f.sports.soccer.forEach((field) => assert.equal(field.crowd.visible, false));
    for (const actor of [...f.sports.players, ...f.sports.joggers]) assert.equal(actor.person.group.userData.info, undefined, "Activity actors do not impersonate named people or appear in the directory");
  } finally { dispose(f.sports.group); }
});

test("sports geometry is finite, statically batched, and uses a single silhouette for distant athletes", () => {
  const f = fixture();
  try {
    let triangles = 0;
    f.sports.group.traverse((mesh) => {
      if (!mesh.geometry) return;
      for (const name of ["position", "normal"]) assert.ok(Array.from(mesh.geometry.attributes[name].array).every(Number.isFinite));
      triangles += (mesh.geometry.index?.count || mesh.geometry.attributes.position.count) / 3;
    });
    assert.ok(triangles < 300000, `Procedural geometry budget: ${triangles} triangles`);
    const actor = f.sports.players[0]; actor.lod(100);
    let draws = 0; actor.person.group.traverseVisible((mesh) => { if (mesh.isMesh) draws++; });
    assert.equal(draws, 1);
    actor.lod(10); draws = 0;
    actor.person.group.traverseVisible((mesh) => { if (mesh.isMesh) draws++; });
    assert.equal(draws, 6, "Head, torso, two arms and two legs retain their animation pivots");
    f.sports.update(0.1, { ...settings, hour: 22 }, poseAt(athleticsAnchors["thunderbird-stadium"]));
    assert.ok(f.sports.venues.find((venue) => venue.id === "thunderbird-stadium").lights.every((light) => light.intensity > 0));
    f.sports.update(0.1, settings, poseAt(athleticsAnchors["thunderbird-stadium"]));
    assert.ok(f.sports.venues.every((venue) => venue.lights.every((light) => light.intensity === 0)));
  } finally { dispose(f.sports.group); }
});

test("aerial turf and track overlays have ordered depth bias without altering solid props or walk heights", () => {
  const f = fixture();
  try {
    for (const venue of f.sports.venues) {
      const layers = new Map(); let solidCount = 0;
      venue.group.traverse((mesh) => {
        if (!mesh.isMesh || !mesh.material?.name.startsWith("sports-")) return;
        const material = mesh.material, layer = material.userData.groundLayer;
        if (!layer) { assert.equal(material.polygonOffset, false, "Goals, benches and other solid objects are not biased decals"); solidCount++; return; }
        layers.set(layer, material);
        assert.equal(material.polygonOffset, true);
        assert.equal(mesh.castShadow, false, "Paint does not cast a raised edge shadow");
        const normals = mesh.geometry.attributes.normal, positions = mesh.geometry.attributes.position;
        if (layer === 4) {
          const centers = mesh.geometry.attributes.paintCenter;
          assert.equal(centers?.count, positions.count, "Every paint edge has a matching stable projection centre");
          assert.ok(Array.from(centers.array).every(Number.isFinite));
        }
        for (let i = 0; i < normals.count; i++) {
          assert.ok(normals.getY(i) > 0.999, "Ground overlay is an upward-facing plane");
          assert.ok(positions.getY(i) >= 0.06 && positions.getY(i) <= 0.11, "Walkable surface remains near source ground height");
        }
      });
      assert.ok(solidCount > 0);
      assert.ok(layers.has(1) && layers.has(4), `${venue.id} separates source surface and markings`);
      const ordered = [...layers].sort((a, b) => a[0] - b[0]);
      for (let i = 1; i < ordered.length; i++) {
        assert.ok(ordered[i][1].polygonOffsetFactor < ordered[i - 1][1].polygonOffsetFactor);
        assert.ok(ordered[i][1].polygonOffsetUnits < ordered[i - 1][1].polygonOffsetUnits);
      }
    }
  } finally { dispose(f.sports.group); }
});

test("a naturally separated jogger is already visible ahead of the track arrival with articulated LOD", () => {
  const f = fixture(), anchor = athleticsAnchors["dhillon-track"], entry = local(anchor.entry, anchor);
  try {
    f.sports.update(0.016, settings, { ...poseAt(anchor), x: anchor.entry[0], z: anchor.entry[1] });
    const direction = [-entry[0], -entry[1]], length = Math.hypot(...direction);
    const visible = f.sports.joggers.find((runner) => {
      const delta = [runner.person.group.position.x - entry[0], runner.person.group.position.z - entry[1]], distance = Math.hypot(...delta);
      return distance > 3 && distance < 20 && (delta[0] * direction[0] + delta[1] * direction[1]) / (distance * length) > Math.cos(Math.PI / 6);
    });
    assert.ok(visible, "One passer is within the arrival's central 60-degree field of view");
    let draws = 0; visible.person.group.traverseVisible((mesh) => { if (mesh.isMesh) draws++; });
    assert.equal(draws, 6);
    assert.ok(visible.person.legs.some((leg) => Math.abs(leg.rotation.x) > 0.1));
  } finally { dispose(f.sports.group); }
});
