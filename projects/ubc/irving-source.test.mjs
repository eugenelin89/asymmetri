import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import "./test-loader.mjs";

const { buildArchitecture } = await import("./architecture.ts");
const { createCollision, global, local, inPolygon } = await import("./spatial.ts");
const data = JSON.parse(readFileSync(new URL("../../public/ubc/v0.1-2026-10-30/data.json", import.meta.url)));
const anchors = JSON.parse(readFileSync(new URL("../../public/ubc/v0.1-2026-10-30/anchors.json", import.meta.url)));

function fixture() {
  const anchor = anchors.irving;
  const source = data.buildings.find((building) => building.id === anchor.buildingId);
  const architecture = buildArchitecture("irving", anchor.width, anchor.depth, source.height);
  // Only the actual Irving footprint is replaced. Every other source building
  // remains solid, including buildings around the Main Mall heritage approach.
  const collision = createCollision(data, [{ anchor, ...architecture }], new Set([source.id]));
  const entry = global(architecture.entry, anchor);
  let pose = { x: entry[0], z: entry[1], y: 0, yaw: 0, pitch: 0 };
  function walk(point, expectedY) {
    const [x, z] = global(point, anchor);
    for (let i = 0; i < 3500 && Math.hypot(x - pose.x, z - pose.z) > 0.015; i++) {
      const distance = Math.hypot(x - pose.x, z - pose.z), step = Math.min(0.06, distance), before = pose.y;
      pose = collision.move(pose, (x - pose.x) * step / distance, (z - pose.z) * step / distance);
      assert.ok(Math.abs(pose.y - before) < 0.12, "Stairs preserve continuous visitor height");
      assert.equal(collision.blocked([pose.x, pose.z], pose.y), false);
    }
    assert.ok(Math.hypot(x - pose.x, z - pose.z) < 0.025,
      `Reached ${point}; actual local ${local([pose.x, pose.z], anchor)} at ${pose.y}m`);
    assert.ok(Math.abs(pose.y - expectedY) < 0.2, `Floor ${expectedY}, actual ${pose.y}`);
  }
  function dispose() {
    const resources = new Set();
    architecture.group.traverse((object) => {
      if (object.geometry) resources.add(object.geometry);
      for (const material of object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : []) {
        resources.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
      }
    });
    for (const resource of resources) resource.dispose();
  }
  return { anchor, source, architecture, collision, walk, dispose, pose: () => pose };
}

test("Irving actual GIS placement permits East Mall entry, every public stair level, Chapman and a normal exit", () => {
  const f = fixture();
  try {
    assert.equal(f.source.id, "VBL10080");
    assert.equal(f.collision.blocked(global(f.architecture.entry, f.anchor), 0), false);
    f.walk([-12.32, 23], 0);
    assert.ok(inPolygon([f.pose().x, f.pose().z], f.source.rings));
    f.walk([-18, 23], 0);
    f.walk([-18, 17], 0);
    f.walk([-18, 3], 5);
    for (const y of [5, 10]) {
      f.walk([-22, 3], y);
      f.walk([-22, 23], y);
      f.walk([-18, 23], y);
      f.walk([-18, 17], y);
      f.walk([-18, 3], y + 5);
    }
    f.walk([-2, 3], 15);
    f.walk([30, 3], 15);
    f.walk([59, 3], 15);
    f.walk([-18, 3], 15);
    for (const y of [10, 5, 0]) {
      f.walk([-18, 17], y);
      f.walk([-18, 23], y);
      if (y) {
        f.walk([-22, 23], y);
        f.walk([-22, 3], y);
        if (y === 10) {
          f.walk([-11.6, 3], 10);
          f.walk([-11.6, -22], 10);
          f.walk([-11.6, 3], 10);
        }
        f.walk([-18, 3], y);
      }
    }
    f.walk([-12.32, 23], 0);
    f.walk(f.architecture.entry, 0);
    assert.equal(inPolygon([f.pose().x, f.pose().z], f.source.rings), false);
  } finally { f.dispose(); }
});

test("Irving heritage doorway and exterior stairs remain reachable with adjacent source buildings solid", () => {
  const f = fixture();
  try {
    f.walk([-12.32, 23], 0);
    f.walk([-18, 23], 0);
    f.walk([-18, 17], 0);
    f.walk([-18, 3], 5);
    f.walk([-11.6, 3], 5);
    f.walk([-11.6, -30], 5);
    f.walk([-11.6, -31.89], 5);
    f.walk([-11.6, -44.89], 0);
    assert.equal(inPolygon([f.pose().x, f.pose().z], f.source.rings), false, "Reached the Main Mall exterior approach");
    f.walk([-11.6, -31.89], 5);
    f.walk([-11.6, 3], 5);
    f.walk([-18, 3], 5);
    f.walk([-18, 17], 0);
    f.walk([-18, 23], 0);
    f.walk([-12.32, 23], 0);
    f.walk(f.architecture.entry, 0);
  } finally { f.dispose(); }
});
