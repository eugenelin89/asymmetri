import test from "node:test";
import assert from "node:assert/strict";
import "./test-loader.mjs";
import * as THREE from "three";
const { footInput, onFoot, walkSpeed, runSpeed } =
  await import("./navigation.ts");
const { createFollowCamera, createVisitor } =
  await import("./follow-camera.ts");
const { createCollision } = await import("./spatial.ts");

const start = () => ({ x: 0, y: 0, z: 0, yaw: 0, pitch: 0 });
test("walking/running are frame-rate independent, diagonals normalized and arrows turn", () => {
  for (const fps of [10, 20, 30, 60, 120]) {
    for (const [keys, speed] of [
      [["w"], walkSpeed],
      [["w", "shift"], runSpeed],
      [["w", "d", "shift"], runSpeed],
    ]) {
      let x = 0,
        z = 0;
      for (let i = 0; i < fps; i++) {
        const d = footInput(start(), keys, 1 / fps);
        x += d.dx;
        z += d.dz;
      }
      assert.ok(Math.abs(Math.hypot(x, z) - speed) < 1e-8);
    }
  }
  assert.ok(footInput(start(), ["arrowleft"], 0.05).yaw > 0);
  assert.ok(footInput(start(), ["arrowright"], 0.05).yaw < 0);
  assert.equal(footInput(start(), ["a"], 0.05).yaw, 0);
  assert.equal(onFoot("third"), true);
  assert.equal(onFoot("aerial"), false);
});
test("running still uses swept collision against a thin closed wall", () => {
  const collision = createCollision(
    { buildings: [] },
    [
      {
        anchor: { x: 0, z: 0, yaw: 0, width: 20, depth: 20 },
        floors: [],
        ramps: [],
        colliders: [
          { minX: -5, maxX: 5, minZ: -2.02, maxZ: -1.98, minY: 0, maxY: 3 },
        ],
      },
    ],
    new Set(),
  );
  let pose = start();
  for (let i = 0; i < 60; i++) {
    const d = footInput(pose, ["w", "shift"], 1 / 30);
    pose = collision.move(pose, d.dx, d.dz);
  }
  assert.ok(pose.z > -1.71 && pose.z < -1.5, pose.z);
});
test("follow camera preserves visitor pose and retracts before walls and low ceilings", () => {
  const root = new THREE.Group(),
    camera = new THREE.PerspectiveCamera(62, 1.5, 0.08, 100);
  const follow = createFollowCamera([root]),
    pose = start(),
    original = { ...pose };
  assert.ok(follow(camera, pose) > 4);
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(8, 4, 0.1),
    new THREE.MeshBasicMaterial(),
  );
  wall.position.set(0, 2, 1.4);
  root.add(wall);
  assert.ok(follow(camera, pose) < 1.4);
  assert.ok(camera.position.z < 1.2);
  wall.visible = false;
  assert.ok(
    follow(camera, pose) > 4,
    "Hidden streamed geometry cannot block the camera",
  );
  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.1, 12),
    new THREE.MeshBasicMaterial(),
  );
  ceiling.position.y = 2.1;
  root.add(ceiling);
  pose.pitch = -0.7;
  follow(camera, pose);
  assert.ok(camera.position.y < 1.9, camera.position.y);
  assert.deepEqual({ ...pose, pitch: 0 }, original);
  wall.geometry.dispose();
  wall.material.dispose();
  ceiling.geometry.dispose();
  ceiling.material.dispose();
});
test("door rotation and visitor turning change camera clearance without moving the visitor", () => {
  const hinge = new THREE.Group(),
    door = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.4, 0.08),
      new THREE.MeshBasicMaterial(),
    );
  hinge.position.set(-0.6, 0, 1.2);
  door.position.set(0.6, 1.2, 0);
  hinge.add(door);
  const camera = new THREE.PerspectiveCamera(),
    follow = createFollowCamera([hinge]),
    pose = start();
  assert.ok(follow(camera, pose) < 1.2);
  hinge.rotation.y = Math.PI / 2;
  assert.ok(follow(camera, pose) > 4);
  pose.yaw = Math.PI;
  follow(camera, pose);
  assert.ok(camera.position.z < -4);
  assert.deepEqual([pose.x, pose.y, pose.z], [0, 0, 0]);
  door.geometry.dispose();
  door.material.dispose();
});
test("visitor follows floor height, animates actual travel and respects reduced motion", () => {
  const visitor = createVisitor(),
    pose = { ...start(), y: 3.4 };
  visitor.update(pose, 0.2, true, false);
  assert.equal(visitor.group.visible, true);
  assert.equal(visitor.group.position.y, 3.435);
  assert.equal(visitor.group.userData.info, undefined);
  visitor.update(pose, 0, false, true);
  assert.equal(visitor.group.visible, false);
  visitor.group.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) o.material.dispose();
  });
});
