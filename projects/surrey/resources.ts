// SPDX-License-Identifier: MIT — dispose shared scene resources exactly once.
import * as THREE from "three";
export function disposeScene(scene: THREE.Scene, renderer: Pick<THREE.WebGLRenderer, "dispose" | "forceContextLoss">, shadowMap: Pick<THREE.RenderTarget, "dispose"> | null, canvas: Pick<HTMLCanvasElement, "remove">) {
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
  scene.traverse(object => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Sprite || object instanceof THREE.Line) {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line) geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
      }
    }
    if (object instanceof THREE.InstancedMesh) object.dispose();
  });
  geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
  shadowMap?.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
}
