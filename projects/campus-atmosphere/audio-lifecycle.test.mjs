import test from "node:test";
import assert from "node:assert/strict";
import "../ubc/test-loader.mjs";
const { createCampusSound } = await import("../stanford/sound.ts");
const { createHalloweenAudio: ubcSound } = await import("../ubc/halloween-audio.ts");
const { createHalloweenAudio: cwruSound } = await import("../cwru/halloween-audio.ts");

const pose = { x: 0, y: 0, z: 0, yaw: 0 };
const campuses = {
  ubc() {
    const sound = ubcSound();
    return { enter: sound.resume, configure: sound.configure, frame: (s, mix) => sound.update(s, pose, [], mix), dispose: sound.dispose };
  },
  stanford() {
    const sound = createCampusSound();
    return { enter: sound.resume, configure: sound.configure, frame: (s, mix) => sound.update(.1, s, pose, [], mix), dispose: sound.dispose };
  },
  cwru() {
    const sound = cwruSound();
    return { enter: settings => { sound.configure(settings); return sound.unlock(); }, configure: sound.configure, frame: (_s, mix) => sound.update(.1, pose, [], false, mix), dispose: sound.dispose };
  },
};
const regular = {
  halloween: false, christmas: false, weather: "clear", windKph: 0, intensity: 0,
  sound: true, soundVolume: .4, halloweenAudio: true, halloweenSound: true, halloweenVolume: .4,
};

// Inspect the graph at the Web Audio boundary. A running source must reach the
// destination over a nonzero gain path to count as audible. Reverb can ring out
// independently of the voices that fed it.
const flushAudio = () => new Promise(resolve => setImmediate(resolve));

function audioDevice(t) {
  const downloads = [];
  const fetch = async url => {
    downloads.push(url);
    return { ok: true, arrayBuffer: async () => new ArrayBuffer(32) };
  };
  const session = { type: "ambient" }, document = new EventTarget();
  document.hidden = false;
  const parameter = () => ({
    value: 1,
    setValueAtTime(v) { this.value = v; }, setTargetAtTime(v) { this.value = v; },
    exponentialRampToValueAtTime(v) { this.value = v; }, linearRampToValueAtTime(v, at) { this.ramp = { value: v, at }; this.value = v; },
    cancelAndHoldAtTime() {}, cancelScheduledValues() {},
  });
  class Node {
    outputs = new Set();
    connect(node) { this.outputs.add(node); return node; }
    disconnect() { this.outputs.clear(); }
  }
  class Source extends Node {
    frequency = parameter(); detune = parameter(); running = false;
    start(at = 0) { this.startAt = at; this.running = true; }
    stop(at = 0) { this.stopAt = at; if (at <= 0) this.running = false; }
  }
  const devices = [];
  class Context {
    constructor() { devices.push(this); }
    currentTime = 0; sampleRate = 64; state = "suspended"; destination = new Node();
    sources = []; reverbs = [];
    async resume() { this.state = "running"; }
    async suspend() { this.state = "suspended"; }
    async close() { this.state = "closed"; }
    async decodeAudioData() { return { recordedMusic: true }; }
    createGain() { return Object.assign(new Node(), { gain: parameter() }); }
    createDynamicsCompressor() { return Object.assign(new Node(), Object.fromEntries(["threshold","knee","ratio","attack","release"].map(key => [key, parameter()]))); }
    createBuffer(channels, length) { const samples = Array.from({ length: channels }, () => new Float32Array(length)); return { getChannelData: index => samples[index] }; }
    createBiquadFilter() { return Object.assign(new Node(), { frequency: parameter(), Q: parameter() }); }
    createStereoPanner() { return Object.assign(new Node(), { pan: parameter() }); }
    createConvolver() { const node = new Node(); this.reverbs.push(node); return node; }
    createOscillator() { const node = new Source(); this.sources.push(node); return node; }
    createBufferSource() { const source = this.createOscillator(); source.isBuffer = true; return source; }
    connected(node) {
      if (node === this.destination) return true;
      if (node.gain?.value === 0) return false;
      return [...node.outputs ?? []].some(target => this.connected(target));
    }
    audible() { return this.sources.filter(source => source.running && this.connected(source)); }
  }
  for (const [key, value] of Object.entries({ document, fetch, AudioContext: Context, window: { AudioContext: Context }, navigator: { audioSession: session } })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => original ? Object.defineProperty(globalThis, key, original) : delete globalThis[key]);
  }
  return { session, downloads, visibility(hidden) { document.hidden = hidden; document.dispatchEvent(new Event("visibilitychange")); }, get context() { return devices[0]; } };
}

for (const [campus, create] of Object.entries(campuses)) {
  test(`${campus} unlocks calm Regular quietly and follows subsequently reported weather without another gesture`, async t => {
    const device = audioDevice(t), sound = create();
    try {
      await sound.enter(regular);
      assert.equal(device.context.state, "running");
      assert.equal(device.session.type, "ambient", "calm Regular has no playback role");
      assert.equal(device.context.sources.length, 0, "a quiet arrival starts no transport");
      sound.configure({ ...regular, weather: "neutral" });
      assert.equal(device.session.type, "ambient", "unavailable weather stays quiet");
      sound.configure({ ...regular, windKph: 17 });
      assert.equal(device.session.type, "playback", "new wind is audible even under clear skies");
      assert.ok(device.context.audible().length > 0);
      sound.configure(regular);
      assert.equal(device.session.type, "ambient");
      assert.equal(device.context.audible().length, 0);
      sound.configure({ ...regular, weather: "snow", intensity: .7 });
      assert.equal(device.session.type, "playback");
      assert.ok(device.context.audible().length > 0);
    } finally { sound.dispose(); }
  });
}

for (const [campus, create] of Object.entries(campuses)) {
  test(`${campus} plays the same licensed loop indoors and outdoors and releases it on exit`, async t => {
    const device = audioDevice(t), sound = create();
    const christmas = { ...regular, christmas: true, weather: "rain", windKph: 28 };
    try {
      await sound.enter(christmas);
      await flushAudio();
      const context = device.context;
      const music = context.audible().find(source => source.buffer?.recordedMusic);
      const wind = context.audible().find(source => source !== music);
      assert.ok(music?.loop && wind);
      const [filter] = wind.outputs, [weatherBus] = filter.outputs;
      const outsideLevel = weatherBus.gain.value;
      context.currentTime = 30;
      sound.frame(christmas, { indoor: true, proximity: .5, pan: -.75 });
      assert.deepEqual(context.audible(), [wind, music], "doorways keep the same recording");
      assert.ok(weatherBus.gain.value < outsideLevel);
      assert.deepEqual(device.downloads, ["/campus-audio/winter-wonderland-fb595967.m4a"]);
      sound.configure({ ...christmas, christmas: false });
      assert.deepEqual(context.audible(), [wind]);
    } finally { sound.dispose(); }
  });
  test(`${campus} stops Halloween transport and reverb on entering Christmas`, async t => {
    const device = audioDevice(t), sound = create(), halloween = { ...regular, halloween: true };
    try {
      await sound.enter(halloween);
      sound.frame(halloween);
      const context = device.context, oldSources = context.sources.filter(source => source.running);
      assert.ok(oldSources.length > 0);
      sound.configure({ ...regular, christmas: true });
      assert.equal(context.reverbs.some(node => context.connected(node)), false, "a Halloween reverb tail cannot reach the new edition");
      assert.equal(oldSources.some(source => source.running), false, "the Halloween transport stops");
      await flushAudio();
      assert.ok(context.audible().length > 0, "Christmas starts without an additional gesture");
    } finally { sound.dispose(); }
  });
  test(`${campus} resumes previously unlocked sound after a hidden muted tab returns and receives an unmute`, async t => {
    const device = audioDevice(t), sound = create();
    try {
      await sound.enter(regular);
      device.visibility(true);
      const windy = { ...regular, windKph: 24 };
      sound.configure({ ...windy, sound: false, halloweenSound: false, halloweenAudio: false });
      await new Promise(resolve => setTimeout(resolve, 450));
      device.visibility(false);
      assert.equal(device.session.type, "ambient");
      sound.configure(windy);
      await Promise.resolve();
      assert.equal(device.context.state, "running");
      assert.equal(device.session.type, "playback");
      assert.ok(device.context.audible().length > 0);
    } finally { sound.dispose(); }
  });
}

for (const [campus, create] of Object.entries(campuses)) {
  test(`${campus} starts Halloween when switching from an already audible Christmas`, async t => {
    const device = audioDevice(t), sound = create();
    try {
      await sound.enter({ ...regular, christmas: true });
      await flushAudio();
      assert.ok(device.context.audible().length > 0);
      const halloween = { ...regular, halloween: true };
      sound.configure(halloween);
      sound.frame(halloween);
      assert.ok(device.context.audible().length > 0);
      assert.equal(device.session.type, "playback");
    } finally { sound.dispose(); }
  });
}


for (const [campus, create] of Object.entries(campuses)) {
  test(`${campus} cancels a pending Christmas start and can immediately re-enter during a fade`, async t => {
    const device = audioDevice(t), sound = create(), christmas = { ...regular, christmas: true };
    try {
      await sound.enter(regular);
      sound.configure(christmas);
      sound.configure(regular);
      await flushAudio();
      const context = device.context;
      assert.equal(context.audible().length, 0, "a late download cannot restart Christmas");
      sound.configure(christmas);
      await flushAudio();
      const [first] = context.audible();
      assert.ok(first.buffer.recordedMusic);
      context.currentTime = 1;
      sound.configure(regular);
      assert.equal(first.stopAt, 1.12);
      assert.deepEqual([...first.outputs][0].gain.ramp, {value: 0, at: 1.12});
      sound.configure(christmas);
      await flushAudio();
      const [next] = context.audible();
      assert.ok(next && next !== first);
      assert.equal(device.downloads.length, 1);
      sound.dispose();
      assert.ok(context.sources.every(source => !source.running));
    } finally { sound.dispose(); }
  });
}

for (const [campus, create] of Object.entries(campuses)) {
  test(`${campus} keeps rain alone silent in Regular and plays only the Christmas bells beside a display`, async t => {
    const device = audioDevice(t), sound = create();
    const rain = { ...regular, weather: "rain", intensity: 1 };
    try {
      await sound.enter(rain);
      const context = device.context;
      assert.equal(context.state, "running", "the entry gesture unlocks later weather and editions");
      assert.equal(device.session.type, "ambient");
      assert.equal(context.sources.length, 0);
      sound.configure({ ...rain, christmas: true });
      assert.equal(device.session.type, "playback");
      await flushAudio();
      assert.ok(context.audible()[0]?.buffer?.recordedMusic);
      assert.equal(context.audible().length, 1, "rain adds no second sound");
      sound.configure(rain);
      assert.equal(device.session.type, "ambient", "rain alone releases the playback role on leaving Christmas");
    } finally { sound.dispose(); }
  });
}

test("snow and wind have independent outdoor sounds with quiet intervals", async t => {
  const device = audioDevice(t), sound = campuses.ubc();
  const snowy = { ...regular, weather: "snow", intensity: .5 };
  try {
    await sound.enter(snowy);
    const context = device.context, [snow] = context.audible();
    function silentFraction(source) {
      const samples = source.buffer.getChannelData(0);
      assert.ok(samples.some(sample => Math.abs(sample) > .01), "the buffer carries an audible signal");
      return samples.reduce((count, sample) => count + (sample === 0 ? 1 : 0), 0) / samples.length;
    }
    assert.ok(silentFraction(snow) > .80, "snow has sparse soft taps");
    sound.configure({ ...snowy, windKph: 28 });
    const gust = context.audible().find(source => source !== snow);
    assert.ok(gust, "wind can accompany the snow");
    assert.ok(silentFraction(gust) > .15, "gusts settle into quiet");
    const wind = gust.buffer.getChannelData(0);
    let energy = 0, change = 0;
    for (let i = 1; i < wind.length; i++) {
      energy += wind[i] ** 2;
      change += (wind[i] - wind[i - 1]) ** 2;
    }
    assert.ok(change < energy * .05, "pressure changes smoothly even within a gust");
    const sourceCount = context.sources.length;
    sound.configure({ ...snowy, intensity: 1, windKph: 35 });
    assert.equal(context.sources.length, sourceCount, "intensity and wind updates keep their transports");
    sound.configure({ ...regular, weather: "rain", intensity: 1, windKph: 28 });
    assert.equal(snow.running, false);
    assert.deepEqual(context.audible(), [gust], "reported wind continues independently through rain");
    sound.configure({ ...regular, windKph: 2 });
    assert.equal(context.audible().length, 0, "light air has no weather noise");
    assert.equal(device.session.type, "ambient");
  } finally { sound.dispose(); }
});
