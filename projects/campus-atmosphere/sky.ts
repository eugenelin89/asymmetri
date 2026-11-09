import type { Sky } from "three/examples/jsm/objects/Sky.js";
import type { Weather } from "./calendar";

const clouds: Record<Weather, number> = {
  clear: 0, neutral: 0, cloudy: 0.48, overcast: 1, rain: 0.95, snow: 0.98, fog: 1,
};

export function updateClouds(sky: Sky, settings: { weather: Weather; windKph?: number; reducedMotion: boolean }) {
  const cloud = clouds[settings.weather], uniforms = sky.material.uniforms;
  uniforms.cloudCoverage.value = cloud;
  uniforms.cloudDensity.value = 0.45 + cloud * 0.55;
  uniforms.showSunDisc.value = cloud < 0.9 ? 1 : 0;
  uniforms.turbidity.value = 3 + 5 * cloud;
  if (!settings.reducedMotion) {
    uniforms.time.value = performance.now() / 1000;
    uniforms.cloudSpeed.value = Math.min(settings.windKph ?? 0, 80) * 0.000001;
  }
}
