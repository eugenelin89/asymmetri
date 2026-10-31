import test from "node:test";
import assert from "node:assert/strict";
import "../ubc/test-loader.mjs";
const { createActivityGate, createPlayTransport, playPrivacy, cookieConfirmedRequest, postPlayEvent, withPlayPrivacyLock, analyticsPreferenceKey, currentPlayPrivacy } = await import("./analytics-client.ts");
const tick = () => new Promise((resolve) => setImmediate(resolve));

test("recording requires gameplay, foreground visibility, on-screen region, permission and recent input", () => {
  const gate = createActivityGate();
  gate.activity(0);
  assert.equal(gate.active(0), false);
  gate.configure({ playing: true, visible: true, inView: true, allowed: true });
  assert.equal(gate.active(0), false, "configuration alone does not manufacture input");
  gate.activity(0);
  assert.equal(gate.active(89_999), true);
  assert.equal(gate.active(90_000), false);
  gate.activity(95_000);
  assert.equal(gate.active(95_001), true);
  for (const flag of ["playing", "visible", "inView", "allowed"]) {
    gate.configure({ [flag]: false });
    assert.equal(gate.active(95_002), false);
    gate.activity(95_003);
    gate.configure({ [flag]: true });
    assert.equal(gate.active(95_004), false, `${flag} restoration requires fresh interaction`);
    gate.activity(96_000);
  }
});

test("privacy signals override an on preference; a shared off preference persists without overriding browser signals", () => {
  assert.equal(playPrivacy({}, null), "on");
  assert.equal(playPrivacy({}, "off"), "off");
  assert.equal(playPrivacy({}, "invalid"), "on");
  assert.equal(playPrivacy({ globalPrivacyControl: true }, "on"), "browser");
  assert.equal(playPrivacy({ doNotTrack: "1" }, "on"), "browser");
  assert.equal(playPrivacy({ doNotTrack: "yes" }, null), "browser");
  assert.equal(playPrivacy({ msDoNotTrack: "1" }, null), "browser");
  assert.equal(playPrivacy({ doNotTrack: "0" }, "off"), "off");
});

test("transport does not start until activity and serialises its first acknowledgement before heartbeats or end beacon", async () => {
  let now = 0, resolveStart;
  const calls = [], beacons = [];
  const transport = createPlayTransport({ sessionId: "session", now: () => now,
    request: async (payload) => { calls.push(payload); return new Promise((resolve) => { resolveStart = resolve; }); },
    beacon: (payload) => { beacons.push(payload); return true; },
  });
  transport.tick(); await tick(); assert.equal(calls.length, 0);
  transport.setActive(true); await tick();
  assert.deepEqual(calls, [{ sessionId: "session", event: "start", seq: 0 }]);
  now = 30_000; transport.tick(); transport.end(); await tick();
  assert.equal(calls.length, 1); assert.equal(beacons.length, 0);
  resolveStart({ ok: true, status: 200 }); await tick();
  assert.deepEqual(beacons, [{ sessionId: "session", event: "end", seq: 1 }]);
  now = 90_000; transport.tick(); assert.equal(calls.length, 1);
});

test("15-second heartbeat, pause, resume and end transmit only a random session ID, event and increasing sequence", async () => {
  let now = 0;
  const calls = [];
  const transport = createPlayTransport({ sessionId: "session", now: () => now, request: async (payload) => { calls.push(payload); return { ok: true, status: 200 }; } });
  transport.setActive(true); await tick();
  now = 14_999; transport.tick(); await tick(); assert.equal(calls.length, 1);
  now = 15_000; transport.tick(); await tick();
  transport.setActive(false); await tick();
  now = 120_000; transport.tick(); await tick(); assert.equal(calls.length, 3);
  transport.setActive(true); await tick();
  transport.end(); await tick();
  assert.deepEqual(calls.map((payload) => payload.event), ["start", "heartbeat", "pause", "start", "end"]);
  assert.deepEqual(calls.map((payload) => payload.seq), [0, 1, 2, 3, 4]);
  for (const payload of calls) assert.deepEqual(Object.keys(payload).sort(), ["event", "seq", "sessionId"]);
});

test("transient retries are bounded, reuse sequence and are superseded immediately by pause or end", async () => {
  let now = 0, fail = false;
  const calls = [], beacons = [];
  const transport = createPlayTransport({ sessionId: "session", now: () => now,
    request: async (payload) => { calls.push(payload); return { ok: !fail, status: fail ? 503 : 200 }; },
    beacon: (payload) => { beacons.push(payload); return true; },
  });
  transport.setActive(true); await tick();
  fail = true; now = 15_000; transport.tick(); await tick();
  now = 29_000; transport.tick(); await tick(); assert.equal(calls.length, 2);
  now = 30_000; transport.tick(); await tick();
  assert.equal(calls[2].seq, calls[1].seq);
  fail = false; now = 31_000; transport.setActive(false); await tick();
  assert.equal(calls.at(-1).event, "pause", "hidden time does not wait for a failed heartbeat's retry deadline");
  transport.setActive(true); await tick();
  fail = true; now = 46_000; transport.tick(); await tick();
  transport.end(); await tick();
  assert.equal(beacons.at(-1).event, "end");
  assert.ok(beacons.at(-1).seq > calls.at(-1).seq);
});

test("opt-out stops all later posts, including a queued pause/end, and waits for an initial cookie response before deletion", async () => {
  let resolveStart;
  const calls = [], beacons = [];
  const transport = createPlayTransport({ sessionId: "session", now: () => 0,
    request: async (payload) => { calls.push(payload); return new Promise((resolve) => { resolveStart = resolve; }); },
    beacon: (payload) => { beacons.push(payload); return true; },
  });
  transport.setActive(true); await tick();
  let drained = false;
  const draining = transport.stop().then(() => { drained = true; });
  transport.end(); transport.setActive(true); transport.tick(); await tick();
  assert.equal(drained, false);
  resolveStart({ ok: true, status: 200 }); await draining; await tick();
  assert.equal(drained, true); assert.equal(calls.length, 1); assert.equal(beacons.length, 0);
});

test("permission and rate-limit rejections stop silently instead of repeatedly posting", async () => {
  for (const status of [400, 403, 429]) {
    let now = 0, calls = 0;
    const transport = createPlayTransport({ sessionId: "session", now: () => now, request: async () => { calls++; return { ok: false, status }; } });
    transport.setActive(true); await tick();
    now = 90_000; transport.tick(); transport.setActive(true); transport.end(); await tick();
    assert.equal(calls, 1);
  }
});

test("mount cleanup before dispatch never sends a phantom start or queues an end", async () => {
  let calls = 0;
  const transport = createPlayTransport({ sessionId: "session", now: () => 0, request: async () => { calls++; return { ok: true, status: 200 }; }, beacon: () => { calls++; return true; } });
  transport.setActive(true); transport.end(); await tick();
  assert.equal(calls, 0);
});

test("a heartbeat that fails while in flight after hiding is replaced by pause, never retried as active time", async () => {
  let now = 0, rejectHeartbeat;
  const calls = [];
  const transport = createPlayTransport({ sessionId: "session", now: () => now, request: async (payload) => {
    calls.push(payload);
    if (payload.event === "heartbeat") return new Promise((resolve) => { rejectHeartbeat = () => resolve({ ok: false, status: 503 }); });
    return { ok: true, status: 200 };
  } });
  transport.setActive(true); await tick();
  now = 15_000; transport.tick(); await tick();
  transport.setActive(false); rejectHeartbeat(); await tick(); await tick();
  assert.deepEqual(calls.map((payload) => payload.event), ["start", "heartbeat", "pause"]);
  now = 50_000; transport.tick(); await tick();
  assert.equal(calls.length, 3);
});

test("a pause that fails after input resumes reconciles with an explicit start", async () => {
  let resolvePause;
  const calls = [];
  const transport = createPlayTransport({ sessionId: "session", now: () => 0, request: async (payload) => {
    calls.push(payload);
    if (payload.event === "pause") return new Promise((resolve) => { resolvePause = resolve; });
    return { ok: true, status: 200 };
  } });
  transport.setActive(true); await tick();
  transport.setActive(false); await tick();
  transport.setActive(true); resolvePause({ ok: false, status: 503 }); await tick(); await tick();
  assert.deepEqual(calls.map((payload) => payload.event), ["start", "pause", "start"]);
  assert.deepEqual(calls.map((payload) => payload.seq), [0, 1, 2]);
});

test("cookie-only initialization repeats the exact start once and stops when cookie echo is blocked", async () => {
  const payload = { sessionId: "session", event: "start", seq: 0 }, calls = [];
  const accepted = await cookieConfirmedRequest(payload, async (value) => { calls.push(value); return { ok: true, status: 200, body: calls.length === 1 ? { accepted: false, initialized: true } : { accepted: true } }; });
  assert.deepEqual(accepted, { ok: true, status: 200 });
  assert.equal(calls.length, 2); assert.equal(calls[0], calls[1]);
  let blockedCalls = 0;
  const blocked = await cookieConfirmedRequest(payload, async () => { blockedCalls++; return { ok: true, status: 200, body: { accepted: false, initialized: true } }; });
  assert.deepEqual(blocked, { ok: false, status: 403 }); assert.equal(blockedCalls, 2);
});

test("shared request lock serialises cookie bootstrap and checks fresh opt-out and active state after waiting", async () => {
  const descriptors = Object.fromEntries(["window", "navigator", "fetch"].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const stored = new Map(), calls = [], lockNames = [];
  let tail = Promise.resolve(), cookie = false, releaseFirst, pauseFirst = true;
  const locks = { request(name, options, operation) {
    lockNames.push(name);
    const next = tail.then(() => { if (options.signal.aborted) throw new DOMException("Aborted", "AbortError"); return operation(); });
    tail = next.catch(() => {}); return next;
  } };
  Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: { getItem: (key) => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value), removeItem: (key) => stored.delete(key) } } });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { locks, doNotTrack: "0" } });
  Object.defineProperty(globalThis, "fetch", { configurable: true, value: async (_url, options) => {
    const body = JSON.parse(options.body); calls.push({ ...body, cookie });
    if (pauseFirst) { pauseFirst = false; await new Promise((resolve) => { releaseFirst = resolve; }); }
    const value = cookie ? { accepted: true } : { accepted: false, initialized: true };
    cookie = true; return { ok: true, status: 200, json: async () => value };
  } });
  try {
    const first = postPlayEvent("/events", { sessionId: "a", event: "start", seq: 0 });
    const second = postPlayEvent("/events", { sessionId: "b", event: "start", seq: 0 });
    await tick(); assert.equal(calls.length, 1, "second tab waits for first cookie response");
    releaseFirst(); await Promise.all([first, second]);
    assert.deepEqual(calls.map((call) => [call.sessionId, call.cookie]), [["a", false], ["a", true], ["b", true]]);
    assert.equal(stored.size, 0, "transient storage checks leave no browser identifier or probe behind");
    let releaseLock;
    const blocker = withPlayPrivacyLock(() => new Promise((resolve) => { releaseLock = resolve; }));
    await tick();
    const queued = postPlayEvent("/events", { sessionId: "b", event: "heartbeat", seq: 1 });
    stored.set(analyticsPreferenceKey, "off"); // No storage event: fresh shared value must still win.
    releaseLock(); await blocker;
    assert.deepEqual(await queued, { ok: false, status: 403 });
    assert.equal(calls.length, 3);
    stored.set(analyticsPreferenceKey, "on");
    const blocker2 = withPlayPrivacyLock(() => new Promise((resolve) => { releaseLock = resolve; }));
    await tick();
    let active = true;
    const stale = postPlayEvent("/events", { sessionId: "b", event: "heartbeat", seq: 2 }, () => active);
    active = false; releaseLock(); await blocker2;
    assert.deepEqual(await stale, { ok: false, status: 0, cancelled: true });
    assert.equal(calls.length, 3);
    assert.ok(lockNames.every((name) => name === "campus-analytics-ownership"));
    delete navigator.locks;
    assert.equal(currentPlayPrivacy(), "unsupported");
    let deletion = false;
    await withPlayPrivacyLock(async () => { deletion = true; }, true);
    assert.equal(deletion, true, "explicit erasure remains possible when collection is unsupported");
  } finally {
    for (const [key, descriptor] of Object.entries(descriptors)) if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key];
  }
});

test("lock acquisition times out instead of leaving deletion or a queued play request waiting forever", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { locks: { request: (_name, options) => new Promise((_resolve, reject) => options.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")))) } } });
  try { await assert.rejects(withPlayPrivacyLock(async () => true, false, 5), { name: "AbortError" }); }
  finally { if (descriptor) Object.defineProperty(globalThis, "navigator", descriptor); else delete globalThis.navigator; }
});
