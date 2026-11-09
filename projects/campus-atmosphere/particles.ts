import * as THREE from "three";
import type { Weather } from "./calendar";

type ParticleSettings = { weather: Weather; windKph?: number; intensity?: number; reducedMotion: boolean; quality: string };

/** One reusable buffer for falling rain, snowflakes or loose specks carried by measured wind. */
export function createWeatherParticles() {
  const positions = new Float32Array(900 * 3);
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - 0.5) * 70;
    positions[i + 1] = Math.random() * 28;
    positions[i + 2] = (Math.random() - 0.5) * 70;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ size: 0.07, transparent: true, opacity: 0.65, depthWrite: false });
  const group = new THREE.Points(geometry, material);
  group.name = "nearby-weather";
  group.visible = false;
  group.frustumCulled = false;
  function update(dt: number, settings: ParticleSettings, camera: THREE.Vector3, indoor: boolean) {
    const rain = settings.weather === "rain", snow = settings.weather === "snow";
    const wind = Math.min(15, (settings.windKph ?? 0) / 3.6);
    group.visible = !indoor && (rain || snow || wind >= 2.5);
    if (!group.visible) return;
    const drifting = !rain && !snow;
    const density = drifting ? Math.min(0.14, wind / 80) : 0.15 + 0.85 * (settings.intensity ?? 0.65);
    const count = Math.ceil((settings.quality === "low" ? 390 : 900) * density);
    geometry.setDrawRange(0, count);
    material.size = snow ? 0.15 : rain ? 0.05 : 0.085;
    material.color.setHex(drifting ? 0xcfb891 : 0xe4eeee);
    group.position.set(camera.x, camera.y - 4, camera.z);
    if (settings.reducedMotion) return;
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] += dt * wind;
      if (positions[i] > 35) positions[i] -= 70;
      positions[i + 1] -= dt * (rain ? 18 : snow ? 1.6 : 0.18);
      if (positions[i + 1] < 0) positions[i + 1] += 28;
    }
    geometry.attributes.position.needsUpdate = true;
  }
  return { group, update, dispose() { geometry.dispose(); material.dispose(); } };
}
