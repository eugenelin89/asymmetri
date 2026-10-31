// SPDX-License-Identifier: MIT — original procedural seasonal illustration.
import * as THREE from "three";
import type { Settings } from "./types";

/** Art-directed full moon, not an astronomical claim about this year's phase. */
export function createHalloweenSky() {
  const group = new THREE.Group();
  group.name = "halloween-moon-and-clouds";
  group.visible = false;
  const size = 128, pixels = new Uint8Array(size * size * 4);
  const craters = Array.from({ length: 28 }, (_, i) => ({
    x: ((Math.sin(i * 71.71 + 8) * 13983.1) % 1 + 1) % 1,
    y: ((Math.sin(i * 31.13 + 9) * 7583.9) % 1 + 1) % 1,
    r: 0.015 + (i % 7) * 0.006,
  }));
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let value = 214 + Math.sin(x * 0.17) * Math.cos(y * 0.11) * 12;
    for (const c of craters) {
      const d = Math.hypot(x / size - c.x, y / size - c.y) / c.r;
      if (d < 1) value -= (1 - d) * 56;
      else if (d < 1.15) value += 8;
    }
    pixels.set([value, value, value * 0.9, 255], (y * size + x) * 4);
  }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  const moon = new THREE.Mesh(new THREE.SphereGeometry(35, 32, 20),
    new THREE.MeshBasicMaterial({ map: texture, color: 0xdce7ed, fog: false }));
  moon.name = "halloween-full-moon";
  moon.position.set(-560, 330, 110);
  group.add(moon);

  // A translucent noise canopy gives broad cloud banks rather than solid blobs.
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide, transparent: true, depthWrite: false, fog: false,
    uniforms: { time: { value: 0 } },
    vertexShader: `varying vec3 direction;
      void main(){direction=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `precision highp float;
      varying vec3 direction; uniform float time;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      void main(){vec3 d=normalize(direction);vec2 p=d.xz/(0.2+max(d.y,0.0))*2.4+vec2(time*0.007,0);
        float n=noise(p)*0.55+noise(p*2.1)*0.28+noise(p*4.2)*0.12+noise(p*8.3)*0.05;
        float cloud=smoothstep(0.40,0.65,n)*smoothstep(0.02,0.2,d.y);
        vec3 colour=mix(vec3(0.035,0.046,0.075),vec3(0.11,0.13,0.18),n);
        gl_FragColor=vec4(colour,cloud*0.88);}`,
  });
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), material);
  clouds.name = "halloween-dark-cloud-canopy";
  clouds.renderOrder = 3;
  group.add(clouds);
  const light = new THREE.DirectionalLight(0x9caed8, 0.85);
  light.name = "halloween-moonlight";
  light.position.copy(moon.position);
  group.add(light, light.target);
  let elapsed = 0;
  function update(dt: number, settings: Settings, camera: THREE.Vector3) {
    group.visible = settings.halloween;
    if (!settings.halloween) return;
    group.position.copy(camera);
    if (!settings.reducedMotion) elapsed += Math.max(0, Math.min(0.1, dt));
    material.uniforms.time.value = elapsed;
  }
  return { group, moon, clouds, update };
}
