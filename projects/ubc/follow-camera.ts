import * as THREE from "three";
import type { Pose } from "./types";
import { defaultAppearance, type Appearance } from "./appearance";
import { person } from "./people";

/** Five clearance rays keep the camera's near plane on this side of scenery. */
export function createFollowCamera(obstacles: THREE.Object3D[]) {
  const ray = new THREE.Raycaster(),
    origin = new THREE.Vector3(),
    target = new THREE.Vector3(),
    desired = new THREE.Vector3(),
    direction = new THREE.Vector3(),
    right = new THREE.Vector3();
  const meshes: THREE.Object3D[] = [];
  return (camera: THREE.PerspectiveCamera, pose: Pose) => {
    target.set(pose.x, pose.y + 1.45, pose.z);
    const pitch = THREE.MathUtils.clamp(pose.pitch, -1.05, 1.05);
    desired.set(
      Math.sin(pose.yaw) * Math.cos(pitch) * 4.2,
      Math.max(-1.15, 0.85 - Math.sin(pitch) * 4.2),
      Math.cos(pose.yaw) * Math.cos(pitch) * 4.2,
    );
    let distance = desired.length();
    direction.copy(desired).normalize();
    right.set(Math.cos(pose.yaw), 0, -Math.sin(pose.yaw));
    meshes.length = 0;
    for (const root of obstacles) {
      root.updateWorldMatrix(true, true);
      root.traverseVisible((object) => {
        if (object instanceof THREE.Mesh) meshes.push(object);
      });
    }
    ray.near = 0;
    ray.far = distance + 0.2;
    for (const [x, y] of [
      [0, 0],
      [-0.18, 0],
      [0.18, 0],
      [0, -0.18],
      [0, 0.18],
    ]) {
      origin.copy(target).addScaledVector(right, x);
      origin.y += y;
      ray.set(origin, direction);
      const hit = ray.intersectObjects(meshes, false)[0];
      if (hit) distance = Math.min(distance, Math.max(0, hit.distance - 0.23));
    }
    camera.position.copy(target).addScaledVector(direction, distance);
    // At zero clearance, retain a valid forward view without crossing the wall.
    if (distance < 0.05) camera.rotation.set(pose.pitch, pose.yaw, 0, "YXZ");
    else camera.lookAt(target);
    return distance;
  };
}

export function createVisitor() {
  let model = person(
    "campus-explorer",
    94,
    false,
    undefined,
    defaultAppearance,
  );
  const root = new THREE.Group();
  root.add(model.group);
  delete model.group.userData.info;
  let stride = 0;
  return {
    group: root,
    appearance(value: Appearance) {
      root.remove(model.group);
      const materials = new Set<THREE.Material>();
      model.group.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            materials.add(m),
          );
        }
      });
      materials.forEach((m) => m.dispose());
      model = person("campus-explorer", 94, false, undefined, value);
      delete model.group.userData.info;
      root.add(model.group);
    },
    update(
      pose: Pose,
      distance: number,
      visible: boolean,
      reducedMotion: boolean,
    ) {
      root.position.set(pose.x, pose.y + 0.035, pose.z);
      root.rotation.y = pose.yaw + Math.PI;
      root.visible = visible;
      stride += distance * 5;
      const swing =
        !reducedMotion && distance > 0.0001 ? Math.sin(stride) * 0.5 : 0;
      model.legs.forEach((leg, i) => {
        leg.rotation.x = swing * (i ? -1 : 1);
      });
      model.arms.forEach((arm, i) => {
        arm.rotation.x = swing * (i ? 0.6 : -0.6);
      });
    },
  };
}
