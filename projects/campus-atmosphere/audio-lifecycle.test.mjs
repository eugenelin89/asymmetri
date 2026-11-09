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
function audioDevice(t) {
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
  for (const [key, value] of Object.entries({ document, AudioContext: Context, window: { AudioContext: Context }, navigator: { audioSession: session } })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => original ? Object.defineProperty(globalThis, key, original) : delete globalThis[key]);
  }
  return { session, visibility(hidden) { document.hidden = hidden; document.dispatchEvent(new Event("visibilitychange")); }, get context() { return devices[0]; } };
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
  test(`${campus} plays a brief sleigh-bell shake with quiet gaps, including away from displays`, async t => {
    const device = audioDevice(t), sound = create();
    const christmas = { ...regular, christmas: true, weather: "rain" };
    const away = { indoor: false, proximity: 0, pan: 0 };
    try {
      await sound.enter(christmas);
      const context = device.context;
      function checkShake(notes, start) {
        const impacts = [...new Set(notes.map(note => note.startAt))];
        assert.ok(impacts.length >= 2 && impacts.at(-1) - start < .2);
        const modes = at => notes.filter(note => note.startAt === at).map(note => note.frequency.value);
        assert.ok(modes(start).length >= 3);
        for (const at of impacts) assert.deepEqual(modes(at), modes(start), "each impact excites the same shell");
        assert.ok(notes.every(note => !note.isBuffer && note.frequency.value > 1000 && note.stopAt < start + .4));
      }
      checkShake(context.sources, 0);
      const count = context.sources.length;
      for (const time of [1, 3, 5.04, 7.99]) {
        context.currentTime = time;
        sound.frame(christmas, away);
        assert.equal(context.sources.length, count, "the gaps stay quiet");
      }
      context.currentTime = 12;
      sound.frame(christmas, away);
      checkShake(context.sources.slice(count), 12);
      const afterShake = context.sources.length;
      sound.frame(christmas, { ...away, indoor: true });
      assert.equal(context.sources.length, afterShake, "crossing a doorway does not retrigger the shake");
    } finally { sound.dispose(); }
  });

  test(`${campus} plays a first-gesture jingle, positions the next indoors and retains reported wind on exit`, async t => {
    const device = audioDevice(t), sound = create();
    const christmas = { ...regular, christmas: true, weather: "rain", intensity: .7, windKph: 28 };
    try {
      const entered = sound.enter(christmas), context = device.context;
      const bell = context.audible().find(source => source.frequency.value === 1367);
      assert.ok(bell, "entry schedules the first bell before loading finishes");
      const wind = context.audible().find(source => source.isBuffer);
      assert.ok(wind);
      const [filter] = wind.outputs, [weatherBus] = filter.outputs;
      const outsideLevel = weatherBus.gain.value;
      await entered;
      context.currentTime = 30;
      const firstIndoor = context.sources.length;
      sound.frame(christmas, { indoor: true, proximity: .5, pan: -.75 });
      const nextBell = context.sources.slice(firstIndoor).find(source => source.frequency.value === 1367);
      assert.ok(nextBell, "another jingle plays beside the indoor display");
      const [envelope] = nextBell.outputs, [panner] = envelope.outputs;
      assert.equal(panner.pan.value, -.75);
      assert.ok(weatherBus.gain.value > 0 && weatherBus.gain.value < outsideLevel);
      sound.configure({ ...christmas, christmas: false });
      assert.deepEqual(context.audible(), [wind], "the same wind continues without a festive tail");
      assert.equal(device.session.type, "playback");
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
  test(`${campus} fades ringing Christmas notes, cancels future notes and can replay during the fade`, async t => {
    const device = audioDevice(t), sound = create();
    try {
      const christmas = { ...regular, christmas: true };
      await sound.enter(christmas);
      const context = device.context, initial = context.sources.slice();
      context.currentTime = .05;
      const ringing = initial.filter(source => source.startAt <= context.currentTime);
      const scheduled = initial.filter(source => source.startAt > context.currentTime);
      assert.ok(ringing.length && scheduled.length);
      sound.configure(regular);
      assert.equal(device.session.type, "ambient");
      for (const source of ringing) {
        assert.ok(source.stopAt > .05 && source.stopAt <= .25, "a ringing note has a short audible tail");
        const [envelope] = source.outputs, [stereo] = envelope.outputs, [bus] = stereo.outputs;
        assert.deepEqual(bus.gain.ramp, { value: 0, at: source.stopAt });
      }
      assert.ok(scheduled.every(source => source.outputs.size === 0));
      context.currentTime = .08;
      sound.configure(christmas);
      assert.ok(context.audible().some(source => !initial.includes(source)), "new bells have an independent audible bus");
      for (const source of ringing) {
        const [envelope] = source.outputs, [stereo] = envelope.outputs, [outgoing] = stereo.outputs;
        assert.equal(outgoing.gain.value, 0, "the old fade keeps its silent endpoint");
      }
      sound.dispose();
      assert.ok(context.sources.every(source => !source.running), "disposal cancels the remaining fade immediately");
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
      assert.ok(context.audible().some(source => source.frequency.value === 1367));
      assert.equal(context.sources.some(source => source.isBuffer), false, "rain adds no sound beside the chimes");
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
