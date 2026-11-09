import type { Campus, Weather } from "./calendar";

export type SoundScene = { christmas?: boolean; weather?: Weather; windKph?: number; intensity?: number; reducedMotion?: boolean };
export type ListenerMix = { indoor: boolean; proximity: number; pan: number };
const arrival: ListenerMix = { indoor: false, proximity: 0.8, pan: 0 };

type WeatherSound = "snow" | "wind";

const christmasMusic: Record<Campus, string> = {
  ubc: "/campus-audio/winter-wonderland-fb595967.m4a",
  stanford: "/campus-audio/stanford-jingle-bells-89a074ea.m4a",
  cwru: "/campus-audio/cwru-rudolph-dc9be1f2.m4a",
};

const recordings = new WeakMap<AudioContext, Map<Campus, Promise<AudioBuffer>>>();

function loadChristmasMusic(context: AudioContext, campus: Campus) {
  let cache = recordings.get(context);
  if (!cache) {
    cache = new Map();
    recordings.set(context, cache);
  }
  const existing = cache.get(campus);
  if (existing) return existing;
  const recording = fetch(christmasMusic[campus]).then(async response => {
    if (!response.ok) throw new Error("Christmas music unavailable");
    return context.decodeAudioData(await response.arrayBuffer());
  }).catch(error => {
    cache.delete(campus);
    throw error;
  });
  cache.set(campus, recording);
  return recording;
}

function windLevel(scene: SoundScene) {
  const speed = scene.windKph ?? 0;
  return speed < 8 ? 0 : 0.12 * Math.min(1, (speed - 5) / 40);
}

function snowLevel(scene: SoundScene) {
  return scene.weather === "snow" ? 0.018 * Math.max(0, Math.min(1, scene.intensity ?? 0.6)) : 0;
}

export function hasAmbience(scene: SoundScene) {
  return !!scene.christmas || windLevel(scene) > 0 || snowLevel(scene) > 0;
}

/** Soft snow taps and smooth, low-frequency gusts separated by silence.
 * The browser resamples each small mono loop into the device's audio graph. */
function weatherBuffer(context: AudioContext, kind: WeatherSound) {
  const rate = 8000;
  const duration = kind === "wind" ? 14 : 12;
  const buffer = context.createBuffer(1, rate * duration, rate);
  const samples = buffer.getChannelData(0);
  let seed = kind === "snow" ? 93511 : 482037;
  const random = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 4294967296; };
  if (kind === "wind") {
    for (let at = 0.35; at < duration - 1; ) {
      const length = Math.min(1.6 + random() * 2.4, duration - at - 0.1);
      const start = Math.round(at * rate);
      // Smooth pressure changes at a few hundred Hz, with a gradual gust envelope.
      const stride = Math.round(rate / (220 + random() * 95));
      let from = 0, to = 0;
      for (let i = 0; i < Math.floor(length * rate); i++) {
        if (i % stride === 0) { from = to; to = random() * 2 - 1; }
        const t = (i % stride) / stride;
        const pressure = from + (to - from) * t * t * (3 - 2 * t);
        const envelope = Math.sin(Math.PI * i / (rate * length));
        samples[start + i] = 0.58 * pressure * envelope * envelope;
      }
      at += length + 1.05 + random() * 1.8;
    }
  } else {
    for (let at = 0.08; at < duration - 0.12; ) {
      const length = 0.07, pitch = 140 + random() * 160;
      const strength = 0.24 + random() * 0.48, start = Math.round(at * rate);
      for (let i = 0; i < Math.floor(length * rate); i++) {
        const seconds = i / rate, t = seconds / length;
        const phase = 2 * Math.PI * pitch * seconds * (1 + 0.09 * t);
        const envelope = Math.min(1, seconds / 0.012) * (1 - t) ** 4;
        samples[start + i] += strength * envelope * (0.75 * Math.sin(phase) + 0.25 * Math.sin(2.32 * phase));
      }
      at += 0.85 + random() * 1.65;
    }
  }
  return buffer;
}

function weatherTrack(context: AudioContext, master: AudioNode, kind: WeatherSound) {
  let buffer: AudioBuffer | undefined;
  let voice: { source: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } | undefined;
  let lastLevel = -1;
  function stop() {
    if (!voice) return;
    voice.source.stop(); voice.source.disconnect(); voice.filter.disconnect(); voice.gain.disconnect();
    voice = undefined;
    lastLevel = -1;
  }
  function update(level: number, indoor: boolean) {
    if (level <= 0) { stop(); return; }
    if (!voice) {
      buffer ??= weatherBuffer(context, kind);
      const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
      source.buffer = buffer; source.loop = true; filter.type = "lowpass"; gain.gain.value = 0;
      source.connect(filter); filter.connect(gain); gain.connect(master); source.start();
      voice = { source, filter, gain };
    }
    const outdoorCutoff = kind === "wind" ? 360 : 620;
    const frequency = indoor ? outdoorCutoff / 2 : outdoorCutoff;
    if (voice.filter.frequency.value !== frequency) voice.filter.frequency.value = frequency;
    const target = indoor ? level * 0.18 : level;
    if (target !== lastLevel) {
      voice.gain.gain.setTargetAtTime(target, context.currentTime, 0.16);
      lastLevel = target;
    }
  }
  return { update, stop };
}

export function displayMix(sources: readonly { x: number; z: number; indoor: boolean }[],
  pose: { x: number; z: number; y: number; yaw: number }, indoor: boolean): ListenerMix {
  let nearest = 62, pan = 0;
  for (const source of sources) {
    if (source.indoor !== indoor) continue;
    const dx = source.x - pose.x, dz = source.z - pose.z;
    const distance = Math.hypot(dx, dz, pose.y);
    if (distance >= nearest) continue;
    nearest = distance;
    pan = Math.min(0.85, Math.max(-0.85, (dx * Math.cos(pose.yaw) - dz * Math.sin(pose.yaw)) / Math.max(1, distance)));
  }
  return { indoor, proximity: (1 - nearest / 62) ** 1.2, pan };
}

/** The recording shares the same gesture-unlocked master as the weather. */
export function createAmbience(context: AudioContext, master: AudioNode, campus: Campus) {
  const snow = weatherTrack(context, master, "snow");
  const wind = weatherTrack(context, master, "wind");
  type Voice = { source: AudioBufferSourceNode; gain: GainNode };
  const voices = new Set<Voice>();
  let voice: Voice | undefined;
  let christmas = false;
  let generation = 0;
  let retryAfter = 0;
  let pending = false;

  function release(v: Voice) {
    if (!voices.delete(v)) return;
    v.source.onended = null;
    v.source.disconnect();
    v.gain.disconnect();
  }

  function play() {
    const requested = generation;
    pending = true;
    void loadChristmasMusic(context, campus).then(buffer => {
      if (requested !== generation) return;
      const source = context.createBufferSource(), gain = context.createGain();
      const v = { source, gain };
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      gain.connect(master);
      voices.add(v);
      voice = v;
      source.onended = () => release(v);
      source.start();
    }).catch(() => {
      if (requested === generation) retryAfter = context.currentTime + 30;
    }).finally(() => {
      if (requested === generation) pending = false;
    });
  }

  function update(scene: SoundScene, mix: ListenerMix = arrival) {
    snow.update(snowLevel(scene), mix.indoor);
    wind.update(windLevel(scene), mix.indoor);
    if (!!scene.christmas !== christmas) {
      christmas = !!scene.christmas;
      generation++;
      pending = false;
      retryAfter = 0;
      if (voice) {
        const outgoing = voice;
        voice = undefined;
        const now = context.currentTime, end = now + .12;
        outgoing.gain.gain.setValueAtTime(1, now);
        outgoing.gain.gain.linearRampToValueAtTime(0, end);
        outgoing.source.stop(end);
      }
    }
    if (christmas && !voice && !pending && context.currentTime >= retryAfter) play();
  }

  function dispose() {
    generation++;
    christmas = false;
    voice = undefined;
    for (const v of voices) {
      v.source.stop();
      release(v);
    }
    snow.stop(); wind.stop();
  }
  return { update, dispose };
}
