import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import "./test-loader.mjs";

const { createHalloweenSky } = await import("./halloween-sky.ts");
const { defaults, setHalloween } = await import("./environment.ts");
const enabled = setHalloween({ ...defaults }, true).settings;
function fixture() {
  const sky = createHalloweenSky(), scene = new THREE.Scene();
  scene.add(sky.group);
  const visible = () => {
    const objects = [];
    scene.traverseVisible((object) => objects.push(object));
    return objects;
  };
  function dispose() {
    const resources = new Set();
    sky.group.traverse((object) => {
      if (object.geometry) resources.add(object.geometry);
      for (const material of object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : []) {
        resources.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
      }
    });
    for (const resource of resources) resource.dispose();
  }
  return { ...sky, scene, visible, dispose };
}

test("Halloween moon and cloud canopy contain finite original geometry and procedural texture data", () => {
  const sky = fixture();
  try {
    for (const mesh of [sky.moon, sky.clouds]) {
      const { position, normal } = mesh.geometry.attributes;
      assert.ok(position.count > 0 && normal.count === position.count);
      assert.ok(Array.from(position.array).every(Number.isFinite));
      assert.ok(Array.from(normal.array).every(Number.isFinite));
      mesh.geometry.computeBoundingSphere();
      assert.ok(Number.isFinite(mesh.geometry.boundingSphere.radius));
      assert.ok(mesh.geometry.boundingSphere.radius > 0);
    }
    const image = sky.moon.material.map.image;
    assert.equal(image.data.length, image.width * image.height * 4);
    assert.ok(new Set(Array.from(image.data).filter((_, i) => i % 4 === 0)).size > 30,
      "Moon has varied generated crater tones rather than an empty texture");
    for (let i = 3; i < image.data.length; i += 4) assert.equal(image.data[i], 255);
    assert.equal(sky.clouds.material.side, THREE.BackSide);
    assert.equal(sky.clouds.material.depthWrite, false, "Cloud alpha does not write an opaque sky-depth shell");
  } finally { sky.dispose(); }
});

test("disabling Halloween removes both sky geometry and moonlight from visible scene traversal", () => {
  const sky = fixture();
  const camera = new THREE.Vector3(-46.9, 1.68, -700);
  try {
    assert.equal(sky.group.visible, false);
    assert.equal(sky.visible().filter((object) => object.isLight).length, 0);
    sky.update(0.1, enabled, camera);
    assert.ok(sky.visible().includes(sky.moon) && sky.visible().includes(sky.clouds));
    const lights = sky.visible().filter((object) => object.isLight);
    assert.equal(lights.length, 1);
    assert.ok(lights[0].intensity > 0);
    const time = sky.clouds.material.uniforms.time.value, position = sky.group.position.clone();
    sky.update(10, { ...enabled, halloween: false }, new THREE.Vector3(900, 300, 200));
    assert.equal(sky.visible().filter((object) => object.isMesh || object.isLight).length, 0,
      "A hidden ancestor excludes moonlight as well as meshes from rendering");
    assert.equal(sky.clouds.material.uniforms.time.value, time);
    assert.ok(sky.group.position.equals(position), "Disabled sky performs no camera/animation updates");
  } finally { sky.dispose(); }
});

test("moon and cloud shell stay camera-relative in walking, below-grade and high aerial views", () => {
  const sky = fixture();
  try {
    let moonOffset, moonlightDirection;
    for (const camera of [new THREE.Vector3(-46.9, 1.68, -700), new THREE.Vector3(-430, -1.72, -360), new THREE.Vector3(430, 900, 310)]) {
      sky.update(0, enabled, camera);
      sky.scene.updateMatrixWorld(true);
      const cloudCentre = sky.clouds.getWorldPosition(new THREE.Vector3());
      assert.ok(cloudCentre.distanceTo(camera) < 1e-8, "Camera remains at the cloud shell centre at every elevation");
      const offset = sky.moon.getWorldPosition(new THREE.Vector3()).sub(camera);
      assert.ok(offset.y > 200, "Moon remains above the viewer in aerial mode");
      if (moonOffset) assert.ok(offset.distanceTo(moonOffset) < 1e-8, "Travel does not shift the moon across the sky");
      moonOffset = offset;
      const light = sky.visible().find((object) => object.isDirectionalLight),
        direction = light.getWorldPosition(new THREE.Vector3()).sub(light.target.getWorldPosition(new THREE.Vector3())).normalize();
      if (moonlightDirection) assert.ok(direction.distanceTo(moonlightDirection) < 1e-8, "Moonlight direction is stable across camera modes");
      moonlightDirection = direction;
    }
  } finally { sky.dispose(); }
});

test("cloud motion honors reduced motion, disabled time and bounded frame deltas without resetting toggles", () => {
  const sky = fixture(), camera = new THREE.Vector3(10, 1.68, 20);
  try {
    sky.update(0.04, enabled, camera);
    assert.ok(Math.abs(sky.clouds.material.uniforms.time.value - 0.04) < 1e-12);
    sky.update(300, enabled, camera);
    assert.ok(Math.abs(sky.clouds.material.uniforms.time.value - 0.14) < 1e-12, "Background-tab delta is bounded");
    const time = sky.clouds.material.uniforms.time.value;
    sky.update(-2, enabled, camera);
    sky.update(3, { ...enabled, reducedMotion: true }, new THREE.Vector3(50, 30, 40));
    assert.equal(sky.clouds.material.uniforms.time.value, time);
    assert.equal(sky.group.position.x, 50, "Camera following remains active with reduced motion");
    const children = sky.group.children.map((child) => child.uuid);
    for (let i = 0; i < 30; i++) sky.update(0, { ...enabled, halloween: !!(i % 2) }, camera);
    assert.deepEqual(sky.group.children.map((child) => child.uuid), children, "Toggles allocate no replacement objects");
    assert.equal(sky.clouds.material.uniforms.time.value, time);
    sky.update(0.03, enabled, camera);
    assert.ok(Math.abs(sky.clouds.material.uniforms.time.value - time - 0.03) < 1e-12, "Animation resumes from its saved phase");
  } finally { sky.dispose(); }
});
