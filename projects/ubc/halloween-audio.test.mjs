import test, { after } from "node:test";
import assert from "node:assert/strict";
import "./test-loader.mjs";
const { createHalloweenAudio, ghostProximity, createCueSchedule, planHalloweenCue } = await import("./halloween-audio.ts");

const pose = { x: 0, y: 0, z: 0, yaw: 0 };
const settings = { halloween: true, halloweenAudio: true, halloweenVolume: 0.35 };
const ghosts = [{ point: [3, 0], y: 0 }];
const controllers = [];
after(() => controllers.forEach((audio) => audio.dispose()));
class Param {
  value = 0; events = [];
  setValueAtTime(value, time) { assert.ok(Number.isFinite(value)); this.value = value; this.events.push(["set", value, time]); return this; }
  linearRampToValueAtTime(value, time) { assert.ok(Number.isFinite(value)); this.value = value; this.events.push(["linear", value, time]); return this; }
  exponentialRampToValueAtTime(value, time) { assert.ok(Number.isFinite(value) && value > 0); this.value = value; this.events.push(["exponential", value, time]); return this; }
  cancelAndHoldAtTime(time) { this.events.push(["hold", this.value, time]); return this; }
  cancelScheduledValues(time) { this.events.push(["cancel", this.value, time]); return this; }
}
class Node {
  constructor(context, kind) { this.context = context; this.kind = kind; this.connections = []; this.disconnects = 0; context.nodes.push(this); }
  connect(node) { this.connections.push(node); return node; }
  disconnect() { this.connections = []; this.disconnects++; }
}
class Source extends Node {
  constructor(context, kind) { super(context, kind); this.frequency = new Param(); this.stopAt = Infinity; this.ended = false; this.onended = null; }
  start(time = 0) { assert.equal(this.started, undefined, "Sources start only once"); this.started = time; }
  stop(time = this.context.currentTime) { this.stopAt = time; }
}
class Context {
  state = "suspended"; currentTime = 0; sampleRate = 8000; nodes = []; resumeCalls = 0; suspendCalls = 0; closeCalls = 0; rejectResume = false;
  destination = { kind: "destination" };
  async resume() { this.resumeCalls++; if (this.rejectResume) throw new Error("Autoplay blocked"); this.state = "running"; }
  async suspend() { this.suspendCalls++; this.state = "suspended"; }
  async close() { this.closeCalls++; this.state = "closed"; }
  createGain() { const node = new Node(this, "gain"); node.gain = new Param(); return node; }
  createDynamicsCompressor() { const node = new Node(this, "compressor"); for (const key of ["threshold", "knee", "ratio", "attack", "release"]) node[key] = new Param(); return node; }
  createOscillator() { return new Source(this, "oscillator"); }
  createBufferSource() { return new Source(this, "buffer"); }
  createBiquadFilter() { const node = new Node(this, "filter"); node.frequency = new Param(); node.Q = new Param(); return node; }
  createStereoPanner() { const node = new Node(this, "panner"); node.pan = new Param(); return node; }
  createBuffer(channels, length) { assert.equal(channels, 1); const samples = new Float32Array(length); return { getChannelData: () => samples }; }
  advance(time) {
    this.currentTime = time;
    for (const node of this.nodes) if (node instanceof Source && !node.ended && node.stopAt <= time) { node.ended = true; node.onended?.(); }
  }
  playing() { return this.nodes.filter((node) => node instanceof Source && node.started !== undefined && !node.ended && node.stopAt > this.currentTime); }
}
class Visibility {
  hidden = false; listeners = new Set();
  addEventListener(name, fn) { assert.equal(name, "visibilitychange"); this.listeners.add(fn); }
  removeEventListener(name, fn) { assert.equal(name, "visibilitychange"); this.listeners.delete(fn); }
  set(hidden) { this.hidden = hidden; this.listeners.forEach((fn) => fn()); }
}
function fixture() {
  const context = new Context(), visibility = new Visibility();
  const audio = createHalloweenAudio({ createContext: () => context, visibility, random: () => 0 });
  controllers.push(audio); return { audio, context, visibility };
}

test("ghost cues use closest same-floor proximity and listener-relative stereo direction", () => {
  const right = ghostProximity(pose, ghosts);
  assert.equal(right.distance, 3); assert.equal(right.pan, 0.85); assert.ok(right.strength > 0.8);
  assert.equal(ghostProximity(pose, [{ point: [-3, 0] }]).pan, -0.85);
  assert.equal(ghostProximity({ ...pose, yaw: Math.PI / 2 }, [{ point: [0, -3] }]).pan, 0.85);
  assert.equal(ghostProximity(pose, [{ point: [29, 0] }, { point: [1, 0], y: 8 }, { point: [NaN, 1] }]), null);
  assert.equal(ghostProximity(pose, [{ point: [20, 0] }, ...ghosts]).distance, 3);
  assert.equal(ghostProximity(pose, []), null);
});

test("ghosts on adjacent Orchard and academic floors cannot trigger a cue through the ceiling", () => {
  for (const height of [3.412, 5]) {
    const upper = { ...pose, y: height };
    assert.equal(ghostProximity(upper, [{ point: [0, 0], y: 0 }]), null);
    assert.equal(ghostProximity(pose, [{ point: [0, 0], y: height }]), null);
    const sameFloor = ghostProximity(upper, [{ point: [3, 0], y: height }]);
    assert.equal(sameFloor.distance, 3);
    assert.ok(sameFloor.strength > 0.8);
  }
});

test("scheduler leaves quiet gaps, bounds screams and never accumulates missed events", () => {
  const close = ghostProximity(pose, [{ point: [1, 0] }]);
  let schedule = createCueSchedule(0, () => 0), lastEnd = -Infinity;
  const before = { ...schedule }, events = [];
  assert.equal(planHalloweenCue(7, schedule, close, () => 0).cue, null);
  assert.deepEqual(schedule, before, "Planning is pure");
  for (let now = 0; now < 300; now += 0.25) {
    const next = planHalloweenCue(now, schedule, close, () => 0); schedule = next.schedule;
    if (!next.cue) continue;
    assert.ok(now >= lastEnd + 6, "No overlapping or back-to-back cacophony");
    lastEnd = now + next.cue.duration; events.push({ ...next.cue, now });
  }
  assert.ok(events.some((event) => event.kind === "cry") && events.some((event) => event.kind === "howl") && events.some((event) => event.kind === "scream"));
  const screams = events.filter((event) => event.kind === "scream");
  for (let i = 1; i < screams.length; i++) assert.ok(screams[i].now - screams[i - 1].now >= 55);
  assert.ok(events.length < 25);
  const missed = planHalloweenCue(10000, schedule, null, () => 0);
  assert.equal(missed.cue.kind, "howl");
  assert.equal(planHalloweenCue(10000, missed.schedule, close, () => 0).cue, null);
  assert.equal(planHalloweenCue(NaN, schedule, close).cue, null);
});

test("procedural bed and timed cues have bounded sources, stereo panning and smooth finite gain", async () => {
  const { audio, context } = fixture(); assert.equal(await audio.resume(), true);
  audio.update(settings, pose, ghosts);
  assert.equal(audio.status(), "running");
  const master = context.nodes[0];
  assert.equal(master.gain.events.at(-1)[0], "linear");
  assert.equal(master.gain.value, 0.35 * 0.65);
  const bedCount = context.playing().length; assert.equal(bedCount, 6);
  let maxPlaying = bedCount;
  for (let now = 0.25; now < 180; now += 0.25) {
    context.advance(now); audio.update(settings, pose, ghosts);
    maxPlaying = Math.max(maxPlaying, context.playing().length);
  }
  assert.equal(maxPlaying, bedCount + 4, "Only one four-source event can accompany the reusable ambience bed");
  assert.ok(context.nodes.some((node) => node.kind === "panner" && node.pan.value === 0.85));
  const envelopes = context.nodes.filter((node) => node.kind === "gain" && node !== master && node.gain.events.length);
  assert.ok(envelopes.length > 1);
  for (const envelope of envelopes) {
    assert.equal(envelope.gain.events[0][1], 0, "Every cue starts silently");
    assert.ok(envelope.gain.events.every((event) => event[1] >= 0 && event[1] <= 0.22), "Cue peaks stay bounded");
    assert.equal(envelope.gain.events.at(-1)[1], 0, "Every cue fades out");
  }
  audio.update({ ...settings, halloweenVolume: 99 }, pose, ghosts); assert.equal(master.gain.value, 0.65);
  audio.update({ ...settings, halloweenVolume: NaN }, pose, ghosts); assert.equal(master.gain.value, 0.35 * 0.65);
  audio.dispose();
});

test("mute, holiday-off and hidden tabs fade out and suspend; returning never queues a scream", async () => {
  const { audio, context, visibility } = fixture(); await audio.resume();
  audio.update(settings, pose, ghosts); context.advance(9); audio.update(settings, pose, ghosts);
  const originalSources = context.nodes.filter((node) => node instanceof Source).length;
  for (const patch of [{ halloweenAudio: false }, { halloween: false }, { halloweenVolume: 0 }]) {
    audio.update({ ...settings, ...patch }, pose, ghosts);
    assert.equal(context.nodes[0].gain.value, 0);
    context.advance(context.currentTime + 0.3); audio.update(settings, pose, ghosts);
  }
  visibility.set(true);
  assert.equal(context.nodes[0].gain.value, 0);
  await new Promise((resolve) => setTimeout(resolve, 450));
  assert.equal(context.state, "suspended"); assert.equal(await audio.resume(), false);
  context.advance(80); audio.update(settings, pose, ghosts);
  assert.equal(context.nodes.filter((node) => node instanceof Source).length, originalSources);
  visibility.set(false); await Promise.resolve(); audio.update(settings, pose, ghosts);
  assert.equal(context.state, "running");
  assert.equal(context.nodes.filter((node) => node instanceof Source).length, originalSources, "Visibility restoration has a fresh quiet interval");
  audio.dispose();
});

test("browser autoplay rejection stays recoverable and disposal disconnects every node exactly once", async () => {
  const context = new Context(); context.rejectResume = true;
  const visibility = new Visibility(), audio = createHalloweenAudio({ createContext: () => context, visibility, random: () => 0 });
  controllers.push(audio);
  assert.equal(await audio.resume(), false); assert.equal(audio.status(), "suspended");
  audio.update(settings, pose, ghosts); await Promise.resolve();
  context.rejectResume = false; assert.equal(await audio.resume(), true);
  context.advance(10); audio.update(settings, pose, ghosts);
  context.advance(14); audio.update(settings, pose, ghosts);
  audio.dispose(); audio.dispose();
  assert.equal(audio.status(), "closed"); assert.equal(context.closeCalls, 1); assert.equal(visibility.listeners.size, 0);
  assert.ok(context.nodes.every((node) => node.disconnects === 1));
  assert.ok(context.nodes.filter((node) => node instanceof Source).every((node) => node.onended === null && Number.isFinite(node.stopAt)));
  const count = context.nodes.length; audio.update(settings, pose, ghosts); assert.equal(context.nodes.length, count);
  assert.equal(await audio.resume(), false);
});

test("unsupported or unavailable audio leaves the campus API usable without DOM or external assets", async () => {
  for (const createContext of [() => null, () => { throw new Error("Disabled"); }]) {
    const audio = createHalloweenAudio({ createContext, visibility: null }); controllers.push(audio);
    assert.equal(audio.status(), "unsupported"); assert.equal(await audio.resume(), false);
    assert.doesNotThrow(() => audio.update(settings, pose, ghosts)); audio.dispose();
    assert.equal(audio.status(), "closed");
  }
});
