import "./loader.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, writeFile, mkdir, stat, readdir, chmod } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
const { createReviewStore, newOwnerToken } = await import("./store.ts");
const { reviewDraft, reviewQuery, reportDraft } = await import("./model.ts");
const { createRateLimiter, guardOrigin, requestBody, handleReviews, handleReport } = await import("./http.ts");
const exec = promisify(execFile), draft = { name: "Campus visitor", rating: 4, comment: "Enjoyed the walking routes.", website: "" };
async function fixture(t) { const directory = await mkdtemp(join(tmpdir(), "campus-reviews-test-")); t.after(() => rm(directory, { recursive: true, force: true })); return { directory, store: createReviewStore(directory) }; }
const fails = (status) => (e) => e?.status === status;
function request(method = "GET", cookie = "", data, extra = {}) {
  return new Request("https://asymmetri.co/labs/campus-reviews-api/ubc", { method, headers: { origin: "https://asymmetri.co", "content-type": "application/json", "x-real-ip": "192.0.2.5", ...(cookie ? { cookie } : {}), ...extra }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) });
}

test("plain text validation permits stars-only comments, normalizes text, rejects unsupported or dangerous control input", () => {
  assert.deepEqual(reviewDraft({ ...draft, name: "  Visitor  ", comment: "" }), { name: "Visitor", rating: 4, comment: "" });
  assert.equal(reviewDraft({ ...draft, comment: "One\r\ntwo" }).comment, "One\ntwo");
  assert.equal(reviewDraft({ ...draft, comment: "<script>alert(1)</script>" }).comment, "<script>alert(1)</script>"); // React renders text, never HTML.
  for (const change of [{ rating: 0 }, { rating: 6 }, { rating: 1.2 }, { rating: "5" }, { name: "" }, { name: "x".repeat(61) }, { comment: "x".repeat(2001) }, { name: "x\nX" }, { comment: "\u202e" }, { website: "https://spam.example" }, { ownerHash: "injected" }]) assert.throws(() => reviewDraft({ ...draft, ...change }), fails(400));
  assert.throws(() => reviewDraft([]), fails(400));
  assert.throws(() => reviewQuery(new URL("https://test/?offset=-1")), fails(400));
  assert.throws(() => reviewQuery(new URL("https://test/?sort=highest&sort=lowest")), fails(400));
  assert.throws(() => reportDraft({ reviewId: randomUUID(), reason: "arbitrary" }), fails(400));
});

test("publication, edit and removal are isolated by anonymous browser and campus and survive restart", async (t) => {
  const { directory, store } = await fixture(t), owner = newOwnerToken(), stranger = newOwnerToken();
  const created = await store.save("ubc", owner, draft); assert.equal(created.created, true);
  await store.save("cwru", owner, { ...draft, rating: 2 });
  const edited = await store.save("ubc", owner, { ...draft, comment: "Updated" });
  assert.equal(edited.review.id, created.review.id); assert.equal(edited.created, false); assert.equal(edited.review.createdAt, created.review.createdAt);
  await assert.rejects(store.save("ubc", stranger, draft, true), fails(404));
  await assert.rejects(store.remove("ubc", stranger), fails(404));
  assert.equal((await store.list("ubc", stranger)).viewerReview, null);
  const fresh = createReviewStore(directory), page = await fresh.list("ubc", owner);
  assert.equal(page.viewerReview.comment, "Updated"); assert.equal(page.summary.total, 1); assert.equal(page.viewerReviewStatus, "published");
  assert.equal((await fresh.list("cwru", owner)).viewerReview.rating, 2); assert.equal((await fresh.list("stanford", owner)).summary.total, 0);
  const raw = await readFile(join(directory, "reviews.json"), "utf8"); assert.ok(!raw.includes(owner)); assert.ok(!raw.includes(stranger));
  assert.ok(!JSON.stringify(page).includes("ownerHash")); assert.ok(!JSON.stringify(page).includes("reports"));
  await fresh.remove("ubc", owner); assert.equal((await fresh.list("ubc", owner)).summary.total, 0); assert.equal((await fresh.list("cwru", owner)).summary.total, 1);
  assert.equal((await stat(directory)).mode & 0o077, 0); assert.equal((await stat(join(directory, "reviews.json"))).mode & 0o077, 0);
  assert.deepEqual(await readdir(directory), ["reviews.json"]);
});

test("moderation hides from aggregate/public data, persists on edit attempts, erases content on removal and permits explicit admin restore", async (t) => {
  const { directory, store } = await fixture(t), owner = newOwnerToken();
  const { review } = await store.save("ubc", owner, draft);
  await store.moderate("ubc", review.id, "hide");
  const hidden = await store.list("ubc", owner); assert.equal(hidden.reviews.length, 0); assert.equal(hidden.summary.average, null); assert.equal(hidden.summary.counts[4], 0); assert.equal(hidden.viewerReviewStatus, "hidden");
  for (const patch of [false, true]) await assert.rejects(store.save("ubc", owner, draft, patch), fails(403));
  await store.moderate("ubc", review.id, "restore"); assert.equal((await store.list("ubc")).summary.total, 1);
  await store.moderate("ubc", review.id, "hide"); await store.remove("ubc", owner);
  assert.ok(!(await readFile(join(directory, "reviews.json"), "utf8")).includes(draft.comment));
  await assert.rejects(createReviewStore(directory).save("ubc", owner, draft), fails(403));
  const removedByModeration = await createReviewStore(directory).list("ubc", owner);
  assert.equal(removedByModeration.viewerReview, null); assert.equal(removedByModeration.viewerReviewStatus, "hidden");
  assert.equal((await store.list("cwru", owner)).viewerReviewStatus, null);
  assert.deepEqual(await store.moderate("ubc", review.id, "restore"), { restored: false, unblocked: true });
  const again = await store.save("ubc", owner, draft); assert.notEqual(again.review.id, review.id);
  await store.moderate("ubc", again.review.id, "remove"); await assert.rejects(store.save("ubc", owner, draft), fails(403));
});

test("reports deduplicate durably, stay campus scoped, never auto-hide and resolve through moderation", async (t) => {
  const { directory, store } = await fixture(t), owner = newOwnerToken(), reporter = newOwnerToken();
  const { review } = await store.save("ubc", owner, draft);
  await store.report("ubc", reporter, review.id, "privacy"); await createReviewStore(directory).report("ubc", reporter, review.id, "spam");
  assert.equal((await store.reports()).length, 1); assert.equal((await store.list("ubc")).summary.total, 1);
  assert.ok(!JSON.stringify(await store.reports()).includes("reporterHash"));
  await assert.rejects(store.report("cwru", reporter, review.id, "other"), fails(404));
  await store.moderate("ubc", review.id, "hide"); assert.equal((await store.reports()).length, 0); assert.equal((await store.reports("ubc", true)).length, 1);
  await assert.rejects(store.report("ubc", newOwnerToken(), review.id, "other"), fails(404));
  await store.remove("ubc", owner); assert.equal((await store.reports("ubc", true)).length, 0);
});

test("report retention prunes expired metadata while preserving public reviews and current reports", async (t) => {
  const { directory } = await fixture(t); let time = Date.parse("2026-01-01T00:00:00.000Z");
  const store = createReviewStore(directory, { now: () => new Date(time) });
  const { review } = await store.save("ubc", newOwnerToken(), draft);
  await store.report("ubc", newOwnerToken(), review.id, "spam");
  time += 91 * 86400000;
  await store.report("ubc", newOwnerToken(), review.id, "privacy");
  const reports = await store.reports(); assert.equal(reports.length, 1); assert.equal(reports[0].reason, "privacy");
  assert.equal((await store.list("ubc")).summary.total, 1);
});

test("pagination and rating sorts use all published reviews for summary, preserving original review date after edit", async (t) => {
  const { directory } = await fixture(t); let time = Date.parse("2026-10-01T00:00:00.000Z");
  const store = createReviewStore(directory, { now: () => new Date(time += 1000) }), tokens = Array.from({ length: 23 }, newOwnerToken);
  for (let i = 0; i < tokens.length; i++) await store.save("ubc", tokens[i], { ...draft, name: `Visitor ${i}`, rating: i % 5 + 1 });
  const newest = await store.list("ubc"), rest = await store.list("ubc", "", "newest", newest.nextOffset);
  assert.equal(newest.reviews.length, 20); assert.equal(rest.reviews.length, 3); assert.equal(rest.nextOffset, null); assert.equal(newest.summary.total, 23); assert.equal(newest.summary.average, 2.9);
  assert.equal(new Set([...newest.reviews, ...rest.reviews].map((r) => r.id)).size, 23);
  assert.equal((await store.list("ubc", "", "highest")).reviews[0].rating, 5); assert.equal((await store.list("ubc", "", "lowest")).reviews[0].rating, 1);
  await store.save("ubc", tokens[0], { ...draft, rating: 5 }); assert.equal((await store.list("ubc")).reviews[0].name, "Visitor 22");
});

test("atomic store serializes competing processes and same-owner concurrent submissions", async (t) => {
  const { directory, store } = await fixture(t), token = newOwnerToken();
  await Promise.all(Array.from({ length: 8 }, (_, i) => store.save("ubc", token, { ...draft, comment: `Version ${i}` })));
  assert.equal((await store.list("ubc")).summary.total, 1);
  const source = 'import {createReviewStore,newOwnerToken} from "./projects/campus-reviews/store.ts"; await createReviewStore(process.argv[1],{lockTimeoutMs:5000}).save("ubc",newOwnerToken(),{name:"Concurrent visitor",rating:5,comment:"Real process persistence test"});';
  await Promise.all(Array.from({ length: 5 }, () => exec(process.execPath, ["--import", "./projects/campus-reviews/loader.mjs", "--input-type=module", "-e", source, directory])));
  assert.equal((await createReviewStore(directory).list("ubc")).summary.total, 6); assert.deepEqual(await readdir(directory), ["reviews.json"]);
});

test("corrupt or public storage is preserved and rejected; abandoned lock fails closed without deleting another writer's lock", async (t) => {
  const { directory, store } = await fixture(t), token = newOwnerToken();
  await writeFile(join(directory, "reviews.json"), '{"version":99}', { mode: 0o600 });
  await assert.rejects(store.list("ubc")); await assert.rejects(store.save("ubc", token, draft)); assert.equal(await readFile(join(directory, "reviews.json"), "utf8"), '{"version":99}');
  await rm(join(directory, "reviews.json")); await mkdir(join(directory, ".reviews-write-lock"), { mode: 0o700 });
  await assert.rejects(createReviewStore(directory, { lockTimeoutMs: 25 }).save("ubc", token, draft), fails(503)); assert.ok((await stat(join(directory, ".reviews-write-lock"))).isDirectory());
  await rm(join(directory, ".reviews-write-lock"), { recursive: true }); await chmod(directory, 0o755); await assert.rejects(store.list("ubc"));
  assert.throws(() => createReviewStore("relative/path")); assert.throws(() => createReviewStore(join(process.cwd(), "public/private-reviews")));
  assert.throws(() => createReviewStore(join(process.cwd(), "..private-reviews")));
});

test("same-origin mutations match the real request host and reject cross-site, spoofed forwarding and absent origins", () => {
  assert.doesNotThrow(() => guardOrigin(request("POST")));
  assert.doesNotThrow(() => guardOrigin(new Request("http://localhost:3026/labs/campus-reviews-api/ubc", { headers: { origin: "http://localhost:3026" } })));
  for (const headers of [{ origin: "https://evil.example" }, { origin: "https://www.asymmetri.co" }, { origin: "null" }, { origin: "" }, { "sec-fetch-site": "cross-site" }, { origin: "https://evil.example", "x-forwarded-host": "evil.example" }]) assert.throws(() => guardOrigin(request("POST", "", undefined, headers)), fails(403));
});

test("request body checks actual stream bytes, UTF-8, media type and JSON shape", async () => {
  assert.deepEqual(await requestBody(request("POST", "", draft)), draft);
  await assert.rejects(requestBody(request("POST", "", draft, { "content-type": "text/plain" })), fails(415));
  await assert.rejects(requestBody(request("POST", "", draft, { "content-length": "9000" })), fails(413));
  await assert.rejects(requestBody(request("POST", "", { comment: "x".repeat(9000) })), fails(413));
  await assert.rejects(requestBody(new Request("http://localhost/", { method: "POST", headers: { "content-type": "application/json" }, body: "[1,2]" })), fails(400));
  await assert.rejects(requestBody(new Request("http://localhost/", { method: "POST", headers: { "content-type": "application/json" }, body: new Uint8Array([0xff]) })), fails(400));
});

test("rate protection has finite memory, expires safely and groups invalid forwarded addresses", () => {
  let now = 0; const limiter = createRateLimiter(() => now, 4);
  for (let i = 0; i < 10; i++) limiter.guard(request("POST"), "report");
  assert.throws(() => limiter.guard(request("POST"), "report"), (e) => e.status === 429 && e.retryAfter === 3600); assert.equal(limiter.size, 2);
  now = 3600001; limiter.guard(request("POST"), "report");
  limiter.guard(request("POST", "", undefined, { "x-real-ip": "192.0.2.6" }), "report");
  limiter.guard(request("POST", "", undefined, { "x-real-ip": "192.0.2.7" }), "report");
  assert.throws(() => limiter.guard(request("POST", "", undefined, { "x-real-ip": "192.0.2.8" }), "report"), fails(429)); assert.equal(limiter.size, 4);
  const fallback = createRateLimiter(() => now);
  for (let i = 0; i < 10; i++) fallback.guard(request("POST", "", undefined, { "x-real-ip": `forged-${i}` }), "report");
  assert.throws(() => fallback.guard(request("POST", "", undefined, { "x-real-ip": "another-forged-chain" }), "report"), fails(429));
});

test("HTTP API establishes protected ownership, publishes exact contract, prevents CSRF and never exposes private storage", async (t) => {
  const { directory } = await fixture(t), previous = process.env.CAMPUS_REVIEWS_DATA_DIR;
  process.env.CAMPUS_REVIEWS_DATA_DIR = directory; t.after(() => { if (previous === undefined) delete process.env.CAMPUS_REVIEWS_DATA_DIR; else process.env.CAMPUS_REVIEWS_DATA_DIR = previous; });
  const first = await handleReviews(request(), "ubc"); assert.equal(first.status, 200);
  const cookie = first.headers.get("set-cookie").split(";")[0]; assert.match(first.headers.get("set-cookie"), /HttpOnly; SameSite=Strict/); assert.match(first.headers.get("set-cookie"), /Path=\/labs\/campus-reviews-api/); assert.match(first.headers.get("set-cookie"), /; Secure$/);
  assert.equal(first.headers.get("cache-control"), "private, no-store"); assert.equal(first.headers.get("vary"), "Cookie");
  assert.equal((await first.json()).summary.average, null);
  assert.equal((await handleReviews(request("POST", "", draft), "ubc")).status, 401);
  const published = await handleReviews(request("POST", cookie, draft), "ubc"); assert.equal(published.status, 201); const value = await published.json(); assert.equal(value.viewerReviewStatus, "published");
  assert.equal((await handleReviews(request("PATCH", cookie, { ...draft, rating: 5 }), "ubc")).status, 200);
  assert.equal((await handleReviews(request("POST", cookie, draft, { origin: "https://evil.example" }), "ubc")).status, 403);
  assert.equal((await handleReviews(request(), "unknown")).status, 404);
  const privatePage = await (await handleReviews(request("GET", cookie), "ubc")).json(); assert.equal(privatePage.viewerReview.id, value.review.id); assert.equal(Object.keys(privatePage.viewerReview).length, 6);
  const crossSite = await handleReviews(request("GET", "", undefined, { origin: "https://evil.example", "sec-fetch-site": "cross-site" }), "ubc"); assert.equal(crossSite.headers.get("set-cookie"), null); assert.equal((await crossSite.json()).viewerReview, null);
  assert.equal((await handleReport(request("POST", cookie, { reviewId: value.review.id, reason: "other" }), "ubc")).status, 200);
  assert.equal((await handleReviews(request("DELETE", cookie), "ubc")).status, 200);
  delete process.env.CAMPUS_REVIEWS_DATA_DIR; assert.equal((await handleReviews(request(), "ubc")).status, 503);
});

test("private CLI reports/hides/restores/removes the same persistent records without an HTTP admin surface", async (t) => {
  const { directory, store } = await fixture(t), owner = newOwnerToken(), { review } = await store.save("stanford", owner, draft);
  await store.report("stanford", newOwnerToken(), review.id, "other");
  const cli = (...args) => exec(process.execPath, ["--import", "./projects/campus-reviews/loader.mjs", "projects/campus-reviews/admin.mjs", ...args], { env: { ...process.env, CAMPUS_REVIEWS_DATA_DIR: directory } });
  const reports = JSON.parse((await cli("reports", "stanford")).stdout); assert.equal(reports.length, 1); assert.ok(!JSON.stringify(reports).includes("reporterHash"));
  await cli("hide", "stanford", review.id); assert.equal((await store.list("stanford", owner)).viewerReviewStatus, "hidden");
  await cli("restore", "stanford", review.id); assert.equal((await store.list("stanford")).summary.total, 1);
  await cli("remove", "stanford", review.id); assert.equal((await store.list("stanford")).summary.total, 0); await assert.rejects(store.save("stanford", owner, draft), fails(403));
});
