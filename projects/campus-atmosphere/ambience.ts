import type { Weather } from "./calendar";

export type SoundScene = { christmas?: boolean; weather?: Weather; windKph?: number; intensity?: number; reducedMotion?: boolean };
export type ListenerMix = { indoor: boolean; proximity: number; pan: number };
const arrival: ListenerMix = { indoor: false, proximity: 0.8, pan: 0 };

type WeatherSound = "snow" | "wind";

// Original music-box carol in 6/8. Each bar has a low bell and six eighth-note
// positions in MIDI pitch. Zero leaves room for the preceding bell to ring.
const carol = [
  { bass: 60, melody: [67, 0, 69, 72, 0, 0] },
  { bass: 57, melody: [76, 0, 74, 72, 0, 0] },
  { bass: 53, melody: [69, 0, 72, 67, 0, 65] },
  { bass: 55, melody: [67, 0, 0, 0, 0, 0] },
  { bass: 60, melody: [67, 0, 69, 72, 0, 76] },
  { bass: 53, melody: [77, 0, 76, 72, 0, 69] },
  { bass: 55, melody: [71, 0, 74, 67, 0, 71] },
  { bass: 60, melody: [72, 0, 0, 0, 0, 0] },
];
const eighthNote = 0.34;
const pitchHz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

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

/** Weather, music and display chimes share the campus's gesture-unlocked master. */
export function createAmbience(context: AudioContext, master: AudioNode) {
  const snow = weatherTrack(context, master, "snow");
  const wind = weatherTrack(context, master, "wind");
  let nextPhrase = 0, phrase = 0;
  let nextBar = 0, barIndex = 0;
  type BellBus = { gain: GainNode; notes: Map<OscillatorNode, { start: number; nodes: AudioNode[] }> };
  let festive: BellBus | undefined;
  const buses = new Set<BellBus>();
  function releaseBus(bus: BellBus) {
    if (bus !== festive && !bus.notes.size && buses.delete(bus)) bus.gain.disconnect();
  }
  function releaseNote(bus: BellBus, tone: OscillatorNode) {
    const note = bus.notes.get(tone);
    if (!note) return;
    tone.onended = null;
    tone.disconnect();
    for (const node of note.nodes) node.disconnect();
    bus.notes.delete(tone);
    releaseBus(bus);
  }
  function stopBells(bus: BellBus, fade: boolean) {
    const now = context.currentTime, end = now + 0.12;
    if (fade) {
      bus.gain.gain.setValueAtTime(1, now);
      bus.gain.gain.linearRampToValueAtTime(0, end);
    }
    for (const [tone, note] of bus.notes) {
      if (fade && note.start <= now) tone.stop(end);
      else {
        tone.stop();
        releaseNote(bus, tone);
      }
    }
    releaseBus(bus);
  }
  function bell(bus: BellBus, hz: number, start: number, strength: number, pan: number, decay = 1.9) {
    const tone = context.createOscillator(), gain = context.createGain();
    const stereo = context.createStereoPanner();
    stereo.pan.value = pan;
    tone.frequency.value = hz;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, strength), start + 0.024);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + decay);
    tone.connect(gain); gain.connect(stereo); stereo.connect(bus.gain);
    bus.notes.set(tone, { start, nodes: [gain, stereo] });
    tone.onended = () => releaseNote(bus, tone);
    tone.start(start); tone.stop(start + decay + 0.1);
  }
  function playCarolBar(bus: BellBus, start: number) {
    const { bass, melody } = carol[barIndex];
    bell(bus, pitchHz(bass), start, 0.027, -0.12, 2.1);
    for (const [beat, pitch] of melody.entries()) {
      if (!pitch) continue;
      const at = start + beat * eighthNote;
      const hz = pitchHz(pitch);
      bell(bus, hz, at, beat % 3 === 0 ? 0.057 : 0.044, 0.08, 1.55);
      bell(bus, hz * 2.76, at, 0.011, 0.08, 0.32);
    }
    barIndex = (barIndex + 1) % carol.length;
    // Leave two quiet bars after the final cadence.
    nextBar = start + eighthNote * (barIndex === 0 ? 18 : 6);
  }
  function update(scene: SoundScene, mix: ListenerMix = arrival) {
    const now = context.currentTime;
    snow.update(snowLevel(scene), mix.indoor);
    wind.update(windLevel(scene), mix.indoor);
    if (!scene.christmas) {
      if (festive) {
        const outgoing = festive;
        festive = undefined;
        stopBells(outgoing, true);
      }
      return;
    }
    if (!festive) {
      festive = { gain: context.createGain(), notes: new Map() };
      festive.gain.connect(master);
      buses.add(festive);
      nextPhrase = now;
      barIndex = 0;
      nextBar = now + 3; // Let the spatial arrival chime ring first.
    }
    if (now + 0.12 >= nextBar) playCarolBar(festive, Math.max(now, nextBar));
    if (mix.proximity < 0.015 || now < nextPhrase) return;
    // Original short major-pentatonic replies, with quieter activity in the distance.
    const melody = [[523.25, 659.25, 783.99], [587.33, 783.99, 659.25], [783.99, 880, 659.25]][phrase++ % 3];
    for (const [i, hz] of melody.entries()) {
      const start = now + i * 0.47;
      bell(festive, hz, start, 0.14 * mix.proximity, mix.pan);
      bell(festive, hz * 2.01, start, 0.022 * mix.proximity, mix.pan);
    }
    bell(festive, 196, now + 2.4, 0.015 * mix.proximity, -mix.pan);
    nextPhrase = now + (scene.reducedMotion ? 24 : 14) + (phrase % 4) * 1.4;
  }
  function dispose() {
    festive = undefined;
    for (const bus of buses) stopBells(bus, false);
    snow.stop(); wind.stop();
  }
  return { update, dispose };
}
