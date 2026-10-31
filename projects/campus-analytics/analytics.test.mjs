import "./loader.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID, createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const { createAnalyticsStore, newVisitorToken, sourceDetails } = await import("./store.ts");
const { playEvent, deletionScope } = await import("./model.ts");
const { handleAnalytics, requestBody, createRateLimiter, guardOrigin, privacyAllowsCollection } = await import("./http.ts");
const exec = promisify(execFile), initialTime = Date.parse("2026-10-01T12:00:00.000Z"), source = { ip: "192.0.2.41", userAgent: "TestBrowser/1.0" };
const event = (sessionId, name, seq) => ({ sessionId, event: name, seq });
const fails = (status) => (e) => e?.status === status;
async function fixture(t, options = {}) { const directory = await mkdtemp(join(tmpdir(), "campus-analytics-test-")); t.after(() => rm(directory, { recursive: true, force: true })); return { directory, store: createAnalyticsStore(directory, options) }; }
function request(method, value, cookie = "", headers = {}) {
  return new Request("https://asymmetri.co/labs/campus-analytics-api/ubc", { method, headers: { origin: "https://asymmetri.co", "content-type": "application/json", "x-real-ip": source.ip, "user-agent": source.userAgent, ...(cookie ? { cookie } : {}), ...headers }, ...(value === undefined ? {} : { body: JSON.stringify(value) }) });
}

test("events accept only a UUID, supported action and sequence; clients cannot claim identity or elapsed duration", () => {
  const valid = event(randomUUID(), "start", 0); assert.deepEqual(playEvent(valid), valid);
  for (const change of [{ visitorId: randomUUID() }, { activeMs: 86400000 }, { timestamp: initialTime }, { event: "view" }, { seq: -1 }, { seq: 0.1 }, { sessionId: "not-a-uuid" }]) assert.throws(() => playEvent({ ...valid, ...change }), fails(400));
  assert.equal(deletionScope({}), "campus"); assert.equal(deletionScope({ scope: "all" }), "all"); assert.throws(() => deletionScope({ visitorHash: "somebody" }), fails(400));
  assert.deepEqual(sourceDetails("192.0.2.4, 127.0.0.1", "X\nY"), { ip: null, userAgent: "X Y" }); assert.equal(sourceDetails("::1", "x".repeat(500)).userAgent.length, 256);
});

test("server-clock duration handles active, paused, resumed, ended, duplicate and out-of-order events", async (t) => {
  let now = initialTime; const { store } = await fixture(t, { now: () => now }), token = newVisitorToken(), id = randomUUID();
  await store.event("ubc", token, event(id, "start", 0), source);
  now += 15000; await store.event("ubc", token, event(id, "heartbeat", 1), source);
  now += 5000; await store.event("ubc", token, event(id, "pause", 2), source);
  now += 50000; await store.event("ubc", token, event(id, "heartbeat", 3), source); // paused heartbeat does not resume
  now += 10000; await store.event("ubc", token, event(id, "start", 4), source);
  now += 15000; await store.event("ubc", token, event(id, "heartbeat", 5), source);
  now += 1000; await store.event("ubc", token, event(id, "heartbeat", 5), source);
  now += 1000; await store.event("ubc", token, event(id, "pause", 2), source);
  now += 3000; await store.event("ubc", token, event(id, "end", 6), source);
  now += 10000; await store.event("ubc", token, event(id, "start", 7), source); // end is terminal
  const report = await store.report("ubc", 1, true);
  assert.equal(report.totalActiveSeconds, 40); assert.equal(report.uniqueBrowsers, 1); assert.equal(report.sessions, 1); assert.equal(report.sessionDetails[0].state, "ended");
});

test("missed-heartbeat gaps are conservatively capped, suspended gaps contribute zero, backward clock cannot create time", async (t) => {
  let now = initialTime; const { store } = await fixture(t, { now: () => now }), token = newVisitorToken(), id = randomUUID();
  await store.event("ubc", token, event(id, "start", 0), source);
  now += 40000; await store.event("ubc", token, event(id, "heartbeat", 1), source); // 35 not40
  now += 46000; await store.event("ubc", token, event(id, "heartbeat", 2), source); // 0
  now -= 1000; await store.event("ubc", token, event(id, "heartbeat", 3), source); // 0
  now += 16000; await store.event("ubc", token, event(id, "pause", 4), source); // 15
  assert.equal((await store.report("ubc", 1)).totalActiveSeconds, 50);
});

test("credited intervals split across UTC days and browser counts deduplicate visits without calling them people", async (t) => {
  let now = Date.parse("2026-10-01T23:59:50.000Z"); const { store } = await fixture(t, { now: () => now }), token = newVisitorToken(), second = newVisitorToken();
  const id = randomUUID(); await store.event("ubc", token, event(id, "start", 0), source);
  now += 30000; await store.event("ubc", token, event(id, "end", 1), source);
  await store.event("ubc", token, event(randomUUID(), "start", 0), source);
  await store.event("cwru", token, event(randomUUID(), "start", 0), source);
  await store.event("stanford", second, event(randomUUID(), "start", 0), source);
  const report = await store.report("ubc", 2); assert.equal(report.sessions, 2); assert.equal(report.uniqueBrowsers, 1); assert.equal(report.totalActiveSeconds, 30);
  assert.deepEqual(report.daily.map((d) => d.totalActiveSeconds), [10, 20]);
  const all = await store.report(undefined, 2); assert.equal(all.sessions, 4); assert.equal(all.uniqueBrowsers, 2);
  assert.ok(!JSON.stringify(all).includes("people")); assert.ok(!JSON.stringify(all).includes(source.ip)); assert.ok(!JSON.stringify(all).includes(source.userAgent));
});

test("ownership and campus scoping prevent another browser writing or deleting a session", async (t) => {
  let now = initialTime; const { directory, store } = await fixture(t, { now: () => now }), token = newVisitorToken(), stranger = newVisitorToken(), id = randomUUID();
  await store.event("ubc", token, event(id, "start", 0), source);
  await assert.rejects(store.event("ubc", stranger, event(id, "heartbeat", 1), source), fails(403));
  await assert.rejects(store.event("cwru", token, event(id, "heartbeat", 1), source), fails(404));
  await store.event("cwru", token, event(randomUUID(), "start", 0), source);
  await store.event("stanford", stranger, event(randomUUID(), "start", 0), source);
  await store.remove("ubc", stranger); assert.equal((await store.report("ubc", 1)).sessions, 1);
  await store.remove("ubc", token); assert.equal((await store.report("ubc", 1)).sessions, 0); assert.equal((await store.report("cwru", 1)).sessions, 1);
  await store.remove("ubc", token, true); const remaining = await createAnalyticsStore(directory, { now: () => now }).report(undefined, 1); assert.equal(remaining.sessions, 1); assert.equal(remaining.uniqueBrowsers, 1);
  const raw = await readFile(join(directory, "analytics.json"), "utf8"); assert.ok(!raw.includes(token)); assert.ok(!raw.includes(stranger));
  assert.equal((await stat(directory)).mode & 0o077, 0); assert.equal((await stat(join(directory, "analytics.json"))).mode & 0o077, 0);
});

test("source details preserve first/last source only for30 days; prune removes90-day sessions and is safe to repeat", async (t) => {
  let now = initialTime; const { directory, store } = await fixture(t, { now: () => now }), token = newVisitorToken(), id = randomUUID();
  await store.event("ubc", token, event(id, "start", 0), source);
  now += 15000; await store.event("ubc", token, event(id, "heartbeat", 1), { ip: "192.0.2.42", userAgent: "SecondBrowser/2" });
  let detail = (await store.report("ubc", 1, true)).sessionDetails[0].source;
  assert.deepEqual(detail, { firstIp: source.ip, lastIp: "192.0.2.42", firstUserAgent: source.userAgent, lastUserAgent: "SecondBrowser/2" });
  now = initialTime + 30 * 86400000; assert.deepEqual(await store.prune(), { removedSessions: 0, redactedSessions: 1 });
  detail = (await store.report("ubc", 90, true)).sessionDetails[0].source; assert.equal(detail, null);
  assert.ok(!(await readFile(join(directory, "analytics.json"), "utf8")).includes(source.ip));
  await store.event("ubc", token, event(id, "heartbeat", 2), source); assert.equal((await store.report("ubc", 90, true)).sessionDetails[0].source, null);
  now = initialTime + 90 * 86400000; assert.deepEqual(await store.prune(), { removedSessions: 1, redactedSessions: 0 });
  assert.deepEqual(await store.prune(), { removedSessions: 0, redactedSessions: 0 }); assert.equal((await store.report(undefined, 90)).sessions, 0);
});

test("summary report and explicit session-detail CLI share private persistence; default report never prints IP/UA", async (t) => {
  const { directory, store } = await fixture(t), token = newVisitorToken(), id = randomUUID();
  await store.event("ubc", token, event(id, "start", 0), source);
  const cli = (...args) => exec(process.execPath, ["--import", "./projects/campus-analytics/loader.mjs", "projects/campus-analytics/admin.mjs", ...args], { env: { ...process.env, CAMPUS_ANALYTICS_DATA_DIR: directory } });
  const summary = (await cli("report", "ubc", "30")).stdout; assert.equal(JSON.parse(summary).uniqueBrowsers, 1); assert.ok(!summary.includes(source.ip)); assert.ok(!summary.includes(source.userAgent)); assert.ok(!summary.includes("visitorHash"));
  const detail = JSON.parse((await cli("report", "ubc", "30", "--sessions")).stdout); assert.equal(detail.sessionDetails[0].source.firstIp, source.ip); assert.ok(!JSON.stringify(detail).includes(token)); assert.ok(!JSON.stringify(detail).includes("visitorHash"));
  assert.deepEqual(JSON.parse((await cli("prune")).stdout), { removedSessions: 0, redactedSessions: 0 });
});

test("cross-process writers serialize without lost sessions and duplicate sequenced events never double-count", async (t) => {
  const { directory, store } = await fixture(t);
  const script = 'import {createAnalyticsStore,newVisitorToken} from "./projects/campus-analytics/store.ts"; import {randomUUID} from "node:crypto"; await createAnalyticsStore(process.argv[1],{lockTimeoutMs:5000}).event("ubc",newVisitorToken(),{sessionId:randomUUID(),event:"start",seq:0},{ip:null,userAgent:"Concurrent test"});';
  await Promise.all(Array.from({ length: 5 }, () => exec(process.execPath, ["--import", "./projects/campus-analytics/loader.mjs", "--input-type=module", "-e", script, directory])));
  assert.equal((await store.report("ubc", 1)).sessions, 5); assert.deepEqual(await readdir(directory), ["analytics.json"]);
  let now = Date.now(); const same = createAnalyticsStore(directory, { now: () => now }), id = randomUUID(), token = newVisitorToken();
  await same.event("ubc", token, event(id, "start", 0), source); now += 15000;
  await Promise.all(Array.from({ length: 6 }, () => same.event("ubc", token, event(id, "heartbeat", 1), source)));
  assert.equal((await same.report("ubc", 1)).totalActiveSeconds, 15);
});

test("unknown or malformed stores are preserved; stale locks fail closed and private paths cannot be inside the app", async (t) => {
  const { directory, store } = await fixture(t);
  await writeFile(join(directory, "analytics.json"), '{"version":99}', { mode: 0o600 });
  await assert.rejects(store.prune()); assert.equal(await readFile(join(directory, "analytics.json"), "utf8"), '{"version":99}');
  await rm(join(directory, "analytics.json")); await mkdir(join(directory, ".analytics-write-lock"), { mode: 0o700 });
  await assert.rejects(createAnalyticsStore(directory, { lockTimeoutMs: 20 }).prune(), fails(503)); assert.ok((await stat(join(directory, ".analytics-write-lock"))).isDirectory());
  assert.throws(() => createAnalyticsStore(join(process.cwd(), "public/analytics"))); assert.throws(() => createAnalyticsStore(join(process.cwd(), "..analytics"))); assert.throws(() => createAnalyticsStore("relative"));
});

test("the persistent session cap rejects excess records without overwriting accepted history", async (t) => {
  const { directory, store } = await fixture(t, { now: () => initialTime });
  const hash = createHash("sha256").update(newVisitorToken()).digest("hex");
  const sessions = Array.from({ length: 20000 }, () => ({ id: randomUUID(), campus: "ubc", visitorHash: hash, startedAt: initialTime, lastAt: initialTime, endedAt: initialTime, active: false, seq: 0, activeMs: 0, days: {}, detail: null }));
  const original = JSON.stringify({ version: 1, sessions });
  await writeFile(join(directory, "analytics.json"), original, { mode: 0o600 });
  await assert.rejects(store.event("ubc", newVisitorToken(), event(randomUUID(), "start", 0), source), fails(503));
  assert.equal(await readFile(join(directory, "analytics.json"), "utf8"), original);
  assert.deepEqual(await readdir(directory), ["analytics.json"]);
});

test("privacy headers and same-origin protection reject collection without storing events", () => {
  const base = request("POST", event(randomUUID(), "start", 0)); assert.equal(privacyAllowsCollection(base), true); assert.doesNotThrow(() => guardOrigin(base));
  assert.equal(privacyAllowsCollection(request("POST", {}, "", { "sec-gpc": "1" })), false); assert.equal(privacyAllowsCollection(request("POST", {}, "", { dnt: "1" })), false);
  for (const headers of [{ origin: "" }, { origin: "https://evil.invalid" }, { origin: "https://www.asymmetri.co" }, { "sec-fetch-site": "cross-site" }]) assert.throws(() => guardOrigin(request("POST", {}, "", headers)), fails(403));
});

test("body and ephemeral rate controls are bounded independently of visitor cookies", async () => {
  await assert.rejects(requestBody(request("POST", { extra: "x".repeat(1100) })), fails(413));
  await assert.rejects(requestBody(request("POST", {}, "", { "content-type": "text/plain" })), fails(415));
  await assert.rejects(requestBody(request("POST", {}, "", { "content-length": "2048" })), fails(413));
  let now = 0; const limiter = createRateLimiter(() => now, 3);
  for (let i = 0; i < 240; i++) limiter.guard(request("POST", {}), "event");
  assert.throws(() => limiter.guard(request("POST", {}, `campus_analytics_visitor=${newVisitorToken()}`), "event"), fails(429));
  limiter.guard(request("POST", {}, "", { "x-real-ip": "192.0.2.42" }), "event");
  assert.throws(() => limiter.guard(request("POST", {}, "", { "x-real-ip": "192.0.2.43" }), "event"), fails(429)); assert.equal(limiter.size, 3);
  now += 60001; limiter.guard(request("POST", {}), "event"); assert.equal(limiter.size, 2);
});

test("HTTP start issues only a scoped private visitor cookie; GPC/DNT block POST but permit complete owner deletion", async (t) => {
  const { directory, store } = await fixture(t), previous = process.env.CAMPUS_ANALYTICS_DATA_DIR;
  process.env.CAMPUS_ANALYTICS_DATA_DIR = directory; t.after(() => { if (previous === undefined) delete process.env.CAMPUS_ANALYTICS_DATA_DIR; else process.env.CAMPUS_ANALYTICS_DATA_DIR = previous; });
  const id = randomUUID();
  for (const headers of [{ "sec-gpc": "1" }, { dnt: "1" }]) { const r = await handleAnalytics(request("POST", event(id, "start", 0), "", headers), "ubc"); assert.equal(r.status, 403); assert.equal(r.headers.get("set-cookie"), null); }
  assert.deepEqual(await readdir(directory), []);
  const start = await handleAnalytics(request("POST", event(id, "start", 0)), "ubc"); assert.equal(start.status, 200); assert.deepEqual(await start.json(), { accepted: false, initialized: true });
  assert.deepEqual(await readdir(directory), []); // Cookie bootstrap stores no IP/UA or session.
  const setCookie = start.headers.get("set-cookie"), cookie = setCookie.split(";")[0]; assert.match(setCookie, /HttpOnly; SameSite=Strict/); assert.match(setCookie, /Path=\/labs\/campus-analytics-api/); assert.match(setCookie, /; Secure$/); assert.equal(start.headers.get("cache-control"), "private, no-store");
  const accepted = await handleAnalytics(request("POST", event(id, "start", 0), cookie), "ubc");
  assert.deepEqual(await accepted.json(), { accepted: true });
  assert.equal((await handleAnalytics(request("POST", event(randomUUID(), "start", 0), cookie), "cwru")).status, 200);
  assert.equal((await handleAnalytics(request("POST", event(randomUUID(), "start", 0), cookie), "stanford")).status, 200);
  assert.equal((await store.report()).sessions, 3);
  assert.equal((await handleAnalytics(request("POST", event(id, "heartbeat", 1)), "ubc")).status, 401);
  assert.equal((await handleAnalytics(request("GET"), "ubc")).status, 405);
  assert.equal((await handleAnalytics(request("POST", event(id, "heartbeat", 1), cookie, { origin: "https://evil.invalid" }), "ubc")).status, 403);
  const deletion = await handleAnalytics(request("DELETE", { scope: "all" }, cookie, { "sec-gpc": "1", dnt: "1" }), "ubc");
  assert.equal(deletion.status, 200); assert.deepEqual(await deletion.json(), { removed: true }); assert.match(deletion.headers.get("set-cookie"), /Max-Age=0/); assert.equal((await store.report()).sessions, 0);
  assert.equal((await handleAnalytics(request("DELETE", { scope: "all" }), "ubc")).status, 200);
  delete process.env.CAMPUS_ANALYTICS_DATA_DIR;
  assert.equal((await handleAnalytics(request("POST", event(randomUUID(), "start", 0)), "ubc")).status, 503);
});


test("lost or blocked bootstrap cookies leave no orphaned history; serialized first starts share browser ownership", async (t) => {
  const { directory, store } = await fixture(t), previous = process.env.CAMPUS_ANALYTICS_DATA_DIR;
  process.env.CAMPUS_ANALYTICS_DATA_DIR = directory;
  t.after(() => { if (previous === undefined) delete process.env.CAMPUS_ANALYTICS_DATA_DIR; else process.env.CAMPUS_ANALYTICS_DATA_DIR = previous; });
  const id = randomUUID();
  // The first response is deliberately discarded, simulating a lost Set-Cookie.
  await handleAnalytics(request("POST", event(id, "start", 0)), "ubc");
  const retry = await handleAnalytics(request("POST", event(id, "start", 0)), "ubc");
  assert.deepEqual(await retry.json(), { accepted: false, initialized: true });
  assert.deepEqual(await readdir(directory), []);
  const cookie = retry.headers.get("set-cookie").split(";")[0];
  await handleAnalytics(request("POST", event(id, "start", 0), cookie), "ubc");
  // The browser's shared lock completes the first bootstrap before a second
  // tab sends its start; the second request carries the same HttpOnly cookie.
  const second = await handleAnalytics(request("POST", event(randomUUID(), "start", 0), cookie), "cwru");
  assert.deepEqual(await second.json(), { accepted: true }); assert.equal(second.headers.get("set-cookie"), null);
  assert.equal((await store.report()).uniqueBrowsers, 1); assert.equal((await store.report()).sessions, 2);
  await handleAnalytics(request("DELETE", { scope: "all" }, cookie), "ubc");
  assert.equal((await store.report()).sessions, 0);
});

test("parallel cookie-less bootstrap responses never persist sessions before any capability is echoed", async (t) => {
  const { directory, store } = await fixture(t), previous = process.env.CAMPUS_ANALYTICS_DATA_DIR;
  process.env.CAMPUS_ANALYTICS_DATA_DIR = directory;
  t.after(() => { if (previous === undefined) delete process.env.CAMPUS_ANALYTICS_DATA_DIR; else process.env.CAMPUS_ANALYTICS_DATA_DIR = previous; });
  const ids = [randomUUID(), randomUUID()];
  const responses = await Promise.all(ids.map((id) => handleAnalytics(request("POST", event(id, "start", 0)), "ubc")));
  for (const response of responses) assert.deepEqual(await response.json(), { accepted: false, initialized: true });
  assert.deepEqual(await readdir(directory), []);
  // Only an echoed final browser capability can own either actual session.
  // Client Web Locks additionally serialize the bootstrap-and-echo exchange.
  const cookie = responses[1].headers.get("set-cookie").split(";")[0];
  for (const id of ids) assert.deepEqual(await (await handleAnalytics(request("POST", event(id, "start", 0), cookie), "ubc")).json(), { accepted: true });
  const report = await store.report(); assert.equal(report.sessions, 2); assert.equal(report.uniqueBrowsers, 1);
  await handleAnalytics(request("DELETE", { scope: "all" }, cookie), "ubc"); assert.equal((await store.report()).sessions, 0);
});


test("private session detail marks a silent unfinished session inactive without adding duration", async (t) => {
  let now = initialTime; const { store } = await fixture(t, { now: () => now }), token = newVisitorToken(), id = randomUUID();
  await store.event("ubc", token, event(id, "start", 0), source);
  now += 15000; await store.event("ubc", token, event(id, "heartbeat", 1), source);
  assert.equal((await store.report("ubc", 1, true)).sessionDetails[0].state, "active");
  now += 45001;
  const silent = await store.report("ubc", 1, true);
  assert.equal(silent.sessionDetails[0].state, "inactive"); assert.equal(silent.totalActiveSeconds, 15);
});
