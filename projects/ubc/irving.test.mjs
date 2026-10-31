import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import "./test-loader.mjs";

const { Builder } = await import("./architecture.ts");
const { irving } = await import("./irving.ts");
const { createCollision } = await import("./spatial.ts");

function fixture() {
  const builder = new Builder(133.58, 62.58, 26.87);
  irving(builder);
  const architecture = builder.finish("irving");
  const anchor = { id: "irving", x: 0, z: 0, yaw: 0, width: 133.58, depth: 62.58 };
  const collision = createCollision(
    { buildings: [], surfaces: [], trees: [], routes: [], entrances: [] },
    [{ anchor, ...architecture }], new Set(),
  );
  let pose = { x: architecture.entry[0], z: architecture.entry[1], y: 0, yaw: 0, pitch: 0 };
  function walk(x, z, expectedY) {
    for (let n = 0; n < 3500; n++) {
      const dx = x - pose.x, dz = z - pose.z, distance = Math.hypot(dx, dz);
      if (distance < 0.02) break;
      const step = Math.min(distance, 0.06);
      pose = collision.move(pose, dx / distance * step, dz / distance * step);
    }
    assert.ok(Math.hypot(x - pose.x, z - pose.z) < 0.08, `Walk to ${x},${z}: ${JSON.stringify(pose)}`);
    if (expectedY !== undefined)
      assert.ok(Math.abs(pose.y - expectedY) < 0.2, `Elevation at ${x},${z}: ${pose.y}, expected ${expectedY}`);
  }
  return { architecture, collision, walk, pose: () => pose };
}

test("Irving: enter, climb all public floors, read in Chapman, descend and exit", () => {
  const f = fixture();
  f.walk(-12.32, 23, 0);
  f.walk(-18, 23, 0);
  f.walk(-18, 17, 0);
  f.walk(-18, 3, 5);
  for (const y of [5, 10]) {
    f.walk(-22, 3, y);
    f.walk(-22, 23, y);
    f.walk(-18, 23, y);
    f.walk(-18, 17, y);
    f.walk(-18, 3, y + 5);
  }
  f.walk(-2, 3, 15);
  f.walk(30, 3, 15);
  f.walk(59, 3, 15);
  f.walk(30, 3, 15);
  f.walk(-18, 3, 15);
  for (const y of [10, 5, 0]) {
    f.walk(-18, 17, y);
    f.walk(-18, 23, y);
    if (y) {
      f.walk(-22, 23, y);
      f.walk(-22, 3, y);
      if (y === 10) {
        f.walk(-11.6, 3, 10);
        f.walk(-11.6, -22, 10);
        f.walk(-11.6, 3, 10);
      }
      f.walk(-18, 3, y);
    }
  }
  f.walk(-12.32, 23, 0);
  f.walk(...f.architecture.entry, 0);
  assert.ok(f.architecture.group.children.filter(child => child.isMesh).length <= 25);
  assert.equal(f.collision.blocked([4.6, 10], 0), true, "Lower archive wing remains closed");
  assert.equal(f.collision.blocked([-3.5, 10], 10), true, "Atrium guard prevents falling");
});

test("Irving: west heritage steps connect to Level 2 and Ridington spiral reaches mezzanine", () => {
  const f = fixture();
  f.walk(-12.32, 23, 0);
  f.walk(-18, 23, 0);
  f.walk(-18, 17, 0);
  f.walk(-18, 3, 5);
  f.walk(-11.6, 3, 5);
  f.walk(-11.6, -30, 5);
  f.walk(-11.6, -31.89, 5);
  f.walk(-11.6, -44.89, 0);
  f.walk(-11.6, -31.89, 5);
  f.walk(-11.6, 3, 5);
  f.walk(-22, 3, 5);
  f.walk(-22, 23, 5);
  f.walk(-18, 23, 5);
  f.walk(-18, 17, 5);
  f.walk(-18, 3, 10);
  f.walk(40, 3, 10);
  f.walk(59, 0, 10);
  f.walk(61.45, 0);
  for (let n = 1; n <= 180; n++) {
    const angle = Math.PI + n * Math.PI * 2 / 180;
    f.walk(63.05 + 1.6 * Math.cos(angle), 1.6 * Math.sin(angle));
    assert.ok(Math.abs(f.pose().y - (10 + n * 5 / 180)) < 0.4, "Spiral feet remain near the visible treads");
  }
  f.walk(59.8, 0, 15);
  f.walk(61.45, 0, 15);
  for (let n = 179; n >= 0; n--) {
    const angle = Math.PI + n * Math.PI * 2 / 180;
    f.walk(63.05 + 1.6 * Math.cos(angle), 1.6 * Math.sin(angle));
  }
  f.walk(59.8, 0, 10);
});

test("Irving: rendered atrium rail openings and Ridington void remain clear", () => {
  const { architecture } = fixture();
  architecture.group.updateMatrixWorld(true);
  const ray = new THREE.Raycaster();
  for (const level of [5, 10]) {
    ray.set(new THREE.Vector3(-18, level + 0.7, 21), new THREE.Vector3(0, 0, -1));
    ray.far = 2.5;
    assert.equal(ray.intersectObjects(architecture.group.children, true).length, 0,
      `No visible glass/rail crosses the Level ${level / 5 + 1} stair entrance`);
  }
  ray.set(new THREE.Vector3(64, 12, 7.5), new THREE.Vector3(0, 1, 0));
  ray.far = 20;
  const overhead = ray.intersectObjects(architecture.group.children, true);
  assert.ok(overhead.length > 0, "Ridington has a roof");
  assert.ok(overhead[0].point.y > 20, "Double-height room is not capped by a Level-4 floor");
  for (let n = 2; n < 35; n++) {
    const angle = Math.PI + (n + 0.5) * Math.PI * 2 / 36;
    const floor = 10 + (n + 1) * 5 / 36;
    ray.set(new THREE.Vector3(63.05 + 1.6 * Math.cos(angle), floor + 0.25, 1.6 * Math.sin(angle)), new THREE.Vector3(0, 1, 0));
    ray.far = 1.55;
    assert.equal(ray.intersectObjects(architecture.group.children, true).length, 0,
      `Spiral tread ${n} has standing headroom`);
  }
});
