// Original procedural ambience. No recordings, external assets or voice likenesses.
import type { Point, Pose, Settings } from "./types";

export type HalloweenAudioStatus = "running" | "suspended" | "unsupported" | "closed";
/** y is the supporting floor elevation, rather than the floating model centre. */
export type AudioGhost = { point: Point; y?: number };
export type AudioPose = Pick<Pose, "x" | "y" | "z" | "yaw">;
export type AudioSettings = Pick<Settings, "halloween" | "halloweenAudio" | "halloweenVolume">;
export type GhostProximity = { distance: number; pan: number; strength: number };
export type AudioCue = { kind: "howl" | "cry" | "scream"; pan: number; strength: number; duration: number };
export type CueSchedule = { nextHowl: number; nextGhost: number; nextScream: number; quietUntil: number };
type VisibilitySource = Pick<Document, "hidden" | "addEventListener" | "removeEventListener">;
type PlaybackSession = { type: string };
type AudioOptions = { createContext?: () => AudioContext | null; visibility?: VisibilitySource | null; random?: () => number; audioSession?: () => PlaybackSession | null };
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
const chance = (random: () => number) => { const value = random(); return Number.isFinite(value) ? clamp(value, 0, 1) : 0.5; };

/** Same-floor proximity and listener-relative stereo positioning. No tracking. */
export function ghostProximity(pose: AudioPose, ghosts: readonly AudioGhost[]): GhostProximity | null {
  let closest: GhostProximity | null = null;
  for (const ghost of ghosts) {
    if (!Number.isFinite(ghost.point[0]) || !Number.isFinite(ghost.point[1]) || Math.abs((ghost.y || 0) - pose.y) > 1.5) continue;
    const dx = ghost.point[0] - pose.x, dz = ghost.point[1] - pose.z, distance = Math.hypot(dx, dz);
    if (distance >= 28 || (closest && distance >= closest.distance)) continue;
    closest = { distance, pan: clamp((dx * Math.cos(pose.yaw) - dz * Math.sin(pose.yaw)) / Math.max(1, distance), -0.85, 0.85),
      strength: (1 - distance / 28) ** 1.2 };
  }
  return closest;
}

export function createCueSchedule(now: number, random: () => number = Math.random): CueSchedule {
  return { nextHowl: now + 18 + chance(random) * 8, nextGhost: now + 8 + chance(random) * 5, nextScream: now + 45, quietUntil: now + 6 };
}

/** Pure, bounded scheduler: one event followed by silence, never a backlog. */
export function planHalloweenCue(now: number, schedule: CueSchedule, ghost: GhostProximity | null, random: () => number = Math.random): { schedule: CueSchedule; cue: AudioCue | null } {
  if (!Number.isFinite(now) || now < schedule.quietUntil) return { schedule, cue: null };
  if (ghost && now >= schedule.nextGhost) {
    const scream = ghost.strength > 0.6 && now >= schedule.nextScream && chance(random) < 0.25;
    const cue: AudioCue = { kind: scream ? "scream" : "cry", pan: ghost.pan, strength: ghost.strength, duration: scream ? 1.25 : 3.4 };
    return { cue, schedule: { ...schedule, nextGhost: now + 19 + chance(random) * 14,
      nextHowl: Math.max(schedule.nextHowl, now + 10), nextScream: scream ? now + 55 : schedule.nextScream, quietUntil: now + cue.duration + 6 } };
  }
  if (now >= schedule.nextHowl) {
    const cue: AudioCue = { kind: "howl", pan: (chance(random) - 0.5) * 1.4, strength: 0.65, duration: 4.6 };
    return { cue, schedule: { ...schedule, nextHowl: now + 30 + chance(random) * 17, quietUntil: now + cue.duration + 7 } };
  }
  return { schedule, cue: null };
}

function browserAudioContext() {
  if (typeof window === "undefined") return null;
  const BrowserContext = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return BrowserContext ? new BrowserContext() : null;
}

function browserAudioSession(): PlaybackSession | null {
  return typeof navigator === "undefined" ? null : (navigator as Navigator & { audioSession?: PlaybackSession }).audioSession || null;
}

/** Construct/resume directly in an entry or Sound-button gesture. Browser audio
 * policy remains authoritative; a rejected resume resolves false, never throws.
 */
export function createHalloweenAudio(options: AudioOptions = {}) {
  const visibility = options.visibility === undefined ? (typeof document === "undefined" ? null : document) : options.visibility;
  const random = options.random || Math.random;
  let context: AudioContext | null = null;
  try { context = (options.createContext || browserAudioContext)(); } catch { /* Browser audio is unavailable. */ }
  let disposed = false, enabled = false, volume = 0.35, target = -1, bedReady = false;
  let playbackIntent = false, settingsSeen = false, resumeAttempt = 0;
  let sessionLease: { session: PlaybackSession; previous: string; active: boolean } | null = null;
  function claimPlaybackSession() {
    if (!playbackIntent || !context || disposed || visibility?.hidden || (settingsSeen && volume <= 0)) return;
    try {
      const session = (options.audioSession || browserAudioSession)();
      if (!session) return;
      if (sessionLease) {
        // Do not take over an intervening owner's choice on visibility return.
        if (sessionLease.session !== session || sessionLease.active || session.type !== sessionLease.previous) return;
        session.type = "playback";
        sessionLease.active = session.type === "playback";
        return;
      }
      const previous = session.type;
      if (typeof previous !== "string" || previous === "playback") return;
      // WebKit supports media playback through Silent Mode via this API on iOS17+.
      // https://bugs.webkit.org/show_bug.cgi?id=237322#c6
      session.type = "playback";
      if (session.type === "playback") sessionLease = { session, previous, active: true };
    } catch { /* Optional, experimental API: Web Audio remains usable without it. */ }
  }
  function releasePlaybackSession() {
    if (!sessionLease?.active) return;
    sessionLease.active = false;
    try {
      if (sessionLease.session.type === "playback") sessionLease.session.type = sessionLease.previous;
    } catch { /* Unsupported or readonly session; never break mute/disposal. */ }
  }
  let schedule = createCueSchedule(0, random), suspendTimer: ReturnType<typeof setTimeout> | undefined;
  const nodes = new Set<AudioNode>(), sources = new Set<AudioScheduledSourceNode>();
  type Voice = { sources: AudioScheduledSourceNode[]; nodes: AudioNode[]; gain: GainNode; end: number; released: boolean };
  const voices = new Set<Voice>();
  const keep = <T extends AudioNode>(node: T): T => { nodes.add(node); return node; };
  const source = <T extends AudioScheduledSourceNode>(node: T): T => { keep(node); sources.add(node); return node; };
  const master = context ? keep(context.createGain()) : null;
  const limiter = context ? keep(context.createDynamicsCompressor()) : null;
  if (context && master && limiter) {
    master.gain.value = 0;
    limiter.threshold.value = -16; limiter.knee.value = 12; limiter.ratio.value = 8;
    limiter.attack.value = 0.008; limiter.release.value = 0.25;
    master.connect(limiter); limiter.connect(context.destination);
  }
  let noiseBuffer: AudioBuffer | null = null;
  function noise() {
    if (!context) return null;
    if (!noiseBuffer) {
      noiseBuffer = context.createBuffer(1, Math.ceil(context.sampleRate * 2.5), context.sampleRate);
      const samples = noiseBuffer.getChannelData(0);
      let brown = 0, seed = 18731;
      for (let i = 0; i < samples.length; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        brown = (brown + (seed / 4294967296 * 2 - 1) * 0.035) / 1.015;
        samples[i] = clamp(brown * 3.5, -0.7, 0.7);
      }
    }
    return noiseBuffer;
  }
  function startBed() {
    if (!context || !master || bedReady || disposed) return;
    bedReady = true;
    const now = context.currentTime;
    const drone = keep(context.createGain()); drone.gain.value = 0.027; drone.connect(master);
    for (const [frequency, type] of [[49, "sine"], [65.4, "sine"], [98.1, "triangle"]] as const) {
      const oscillator = source(context.createOscillator()); oscillator.type = type; oscillator.frequency.value = frequency;
      oscillator.connect(drone); oscillator.start(now);
    }
    const pulse = source(context.createOscillator()), pulseDepth = keep(context.createGain());
    pulse.frequency.value = 0.16; pulseDepth.gain.value = 0.008; pulse.connect(pulseDepth); pulseDepth.connect(drone.gain); pulse.start(now);
    const wind = source(context.createBufferSource()), filter = keep(context.createBiquadFilter()), windGain = keep(context.createGain());
    wind.buffer = noise(); wind.loop = true; filter.type = "lowpass"; filter.frequency.value = 780; filter.Q.value = 0.35;
    windGain.gain.value = 0.045; wind.connect(filter); filter.connect(windGain); windGain.connect(master); wind.start(now);
    const breeze = source(context.createOscillator()), breezeDepth = keep(context.createGain());
    breeze.frequency.value = 0.055; breezeDepth.gain.value = 0.012; breeze.connect(breezeDepth); breezeDepth.connect(windGain.gain); breeze.start(now);
  }
  function releaseVoice(voice: Voice) {
    if (voice.released) return;
    voice.released = true; voices.delete(voice);
    for (const node of voice.sources) { node.onended = null; sources.delete(node); }
    for (const node of voice.nodes) { node.disconnect(); nodes.delete(node); }
  }
  function fade(param: AudioParam, value: number, seconds: number) {
    if (!context) return;
    const now = context.currentTime;
    if (typeof param.cancelAndHoldAtTime === "function") param.cancelAndHoldAtTime(now);
    else { param.cancelScheduledValues(now); param.setValueAtTime(param.value, now); }
    param.linearRampToValueAtTime(value, now + seconds);
  }
  function stopVoices() {
    if (!context) return;
    for (const voice of voices) {
      fade(voice.gain.gain, 0, 0.18); voice.end = Math.min(voice.end, context.currentTime + 0.2);
      for (const oscillator of voice.sources) try { oscillator.stop(voice.end); } catch { /* Already stopped. */ }
    }
  }
  function play(cue: AudioCue) {
    if (!context || !master || voices.size || disposed || context.state !== "running") return;
    const now = context.currentTime, voiceNodes: AudioNode[] = [], voiceSources: AudioScheduledSourceNode[] = [];
    const own = <T extends AudioNode>(node: T): T => { voiceNodes.push(keep(node)); return node; };
    const oscillator = (frequency: number, type: OscillatorType = "sine") => {
      const node = own(context!.createOscillator()); sources.add(node); voiceSources.push(node);
      node.type = type; node.frequency.value = frequency; return node;
    };
    const gain = own(context.createGain()), filter = own(context.createBiquadFilter());
    const panner = typeof context.createStereoPanner === "function" ? own(context.createStereoPanner()) : own(context.createGain());
    if ("pan" in panner) panner.pan.value = cue.pan;
    filter.type = "bandpass"; filter.frequency.value = cue.kind === "howl" ? 720 : cue.kind === "cry" ? 1100 : 1800; filter.Q.value = cue.kind === "scream" ? 2 : 0.7;
    filter.connect(gain); gain.connect(panner); panner.connect(master);
    const base = cue.kind === "howl" ? 210 : cue.kind === "cry" ? 340 : 620;
    const tone = oscillator(base, cue.kind === "scream" ? "triangle" : "sine"); tone.connect(filter);
    tone.frequency.setValueAtTime(base, now);
    tone.frequency.exponentialRampToValueAtTime(base * (cue.kind === "howl" ? 1.65 : 1.23), now + cue.duration * 0.4);
    tone.frequency.exponentialRampToValueAtTime(base * 0.82, now + cue.duration);
    const vibrato = oscillator(cue.kind === "howl" ? 4.1 : 5.6), depth = own(context.createGain());
    depth.gain.value = cue.kind === "scream" ? 33 : 11; vibrato.connect(depth); depth.connect(tone.frequency);
    const overtone = oscillator(base * 2.03), overtoneGain = own(context.createGain());
    overtoneGain.gain.value = 0.22; overtone.connect(overtoneGain); overtoneGain.connect(filter);
    const breath = own(context.createBufferSource()); breath.buffer = noise(); breath.loop = true;
    sources.add(breath); voiceSources.push(breath);
    const breathGain = own(context.createGain()); breathGain.gain.value = cue.kind === "scream" ? 0.3 : 0.13;
    breath.connect(breathGain); breathGain.connect(filter);
    const peak = (cue.kind === "scream" ? 0.14 : cue.kind === "cry" ? 0.19 : 0.22) * (0.4 + 0.6 * cue.strength);
    gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(peak, now + (cue.kind === "scream" ? 0.2 : 0.8));
    gain.gain.linearRampToValueAtTime(peak * 0.62, now + cue.duration * 0.65); gain.gain.linearRampToValueAtTime(0, now + cue.duration);
    const voice: Voice = { sources: voiceSources, nodes: voiceNodes, gain, end: now + cue.duration + 0.05, released: false };
    voices.add(voice); tone.onended = () => releaseVoice(voice);
    for (const node of voiceSources) { node.start(now); node.stop(voice.end); }
  }
  function applyGate(force = false) {
    if (!context || !master || disposed) return;
    const active = enabled && !visibility?.hidden, next = active ? volume * 0.65 : 0;
    if (!force && next === target) return;
    const wasSilent = target <= 0; target = next;
    if (suspendTimer !== undefined) { clearTimeout(suspendTimer); suspendTimer = undefined; }
    fade(master.gain, next, active ? 0.6 : 0.3);
    if (active) {
      if (wasSilent) schedule = createCueSchedule(context.currentTime, random);
      startBed();
      if (context.state === "suspended") void context.resume().catch(() => {});
    } else {
      stopVoices();
      suspendTimer = setTimeout(() => {
        suspendTimer = undefined;
        if (!disposed && context && (!enabled || visibility?.hidden)) {
          // A quick enable/cancel may never produce enabled telemetry. Release
          // its silent lease after the existing fade; first scene load is exempt.
          if (settingsSeen && !enabled) releasePlaybackSession();
          void context.suspend().catch(() => {});
        }
      }, 400);
    }
  }
  function status(): HalloweenAudioStatus {
    if (disposed) return "closed";
    if (!context) return "unsupported";
    return context.state === "running" ? "running" : context.state === "closed" ? "closed" : "suspended";
  }
  async function resume() {
    if (!context || disposed || context.state === "closed" || visibility?.hidden) return false;
    const attempt = ++resumeAttempt;
    playbackIntent = true;
    if (sessionLease && !sessionLease.active) sessionLease = null;
    claimPlaybackSession(); // Synchronous, before awaiting the user-gesture resume.
    try { await context.resume(); applyGate(true); return !disposed && context.state === "running"; }
    catch {
      if (attempt === resumeAttempt) { playbackIntent = false; releasePlaybackSession(); }
      return false;
    }
  }
  function update(settings: AudioSettings, pose: AudioPose, ghosts: readonly AudioGhost[]) {
    if (!context || disposed) return;
    const wasEnabled = enabled;
    volume = Number.isFinite(settings.halloweenVolume) ? clamp(settings.halloweenVolume, 0, 1) : 0.35;
    enabled = settings.halloween && settings.halloweenAudio && volume > 0;
    if (!enabled && (wasEnabled || !settingsSeen)) {
      releasePlaybackSession();
      if (!settings.halloween || !settings.halloweenAudio) playbackIntent = false;
    }
    settingsSeen = true;
    if (enabled && !wasEnabled) claimPlaybackSession();
    applyGate();
    for (const voice of voices) if (context.currentTime >= voice.end) releaseVoice(voice);
    if (!enabled || visibility?.hidden || context.state !== "running" || voices.size) return;
    const next = planHalloweenCue(context.currentTime, schedule, ghostProximity(pose, ghosts), random);
    schedule = next.schedule;
    if (next.cue) play(next.cue);
  }
  const onVisibility = () => {
    if (visibility?.hidden) releasePlaybackSession();
    else if (enabled) claimPlaybackSession();
    applyGate();
  };
  visibility?.addEventListener("visibilitychange", onVisibility);
  function dispose() {
    if (disposed) return;
    playbackIntent = false; releasePlaybackSession();
    disposed = true; visibility?.removeEventListener("visibilitychange", onVisibility);
    if (suspendTimer !== undefined) clearTimeout(suspendTimer);
    if (master && context) { master.gain.cancelScheduledValues(context.currentTime); master.gain.setValueAtTime(0, context.currentTime); }
    for (const node of sources) { node.onended = null; try { node.stop(); } catch { /* Ended source. */ } }
    for (const node of nodes) node.disconnect();
    voices.clear(); sources.clear(); nodes.clear(); noiseBuffer = null;
    if (context && context.state !== "closed") void context.close().catch(() => {});
  }
  // Start is a trusted gesture, but its browser may still decline audio.
  void resume();
  return { update, resume, status, dispose };
}
