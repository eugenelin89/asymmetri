/** Node-only route helpers; private data is never bundled into a campus scene. */
import { createHmac, randomBytes } from "node:crypto";
import { isIP } from "node:net";
import { campusId, object, reportDraft, reviewQuery, ReviewError } from "./model";
import { createReviewStore, newOwnerToken, validOwnerToken } from "./store";

const cookieName = "campus_reviews_owner";
const cookiePath = "/labs/campus-reviews-api";
export function configuredStore() {
  const directory = process.env.CAMPUS_REVIEWS_DATA_DIR;
  if (!directory) throw new ReviewError("Reviews are not enabled on this host yet.", 503);
  return createReviewStore(directory);
}
export function ownerToken(request: Request) {
  const values = (request.headers.get("cookie") || "").split(";").map((v) => v.trim()).filter((v) => v.startsWith(`${cookieName}=`));
  // Ambiguous duplicate cookies cannot choose somebody else's capability.
  if (values.length !== 1) return "";
  const token = values[0].slice(cookieName.length + 1);
  return validOwnerToken(token) ? token : "";
}
function response(value: unknown, status = 200, token?: string, retryAfter?: number) {
  const headers: Record<string, string> = { "Cache-Control": "private, no-store", Vary: "Cookie", "X-Content-Type-Options": "nosniff" };
  if (token) headers["Set-Cookie"] = `${cookieName}=${token}; Path=${cookiePath}; HttpOnly; SameSite=Strict; Max-Age=31536000${process.env.NODE_ENV === "development" ? "" : "; Secure"}`;
  if (retryAfter) headers["Retry-After"] = String(retryAfter);
  return Response.json(value, { status, headers });
}
function failure(error: unknown) {
  return error instanceof ReviewError
    ? response({ error: error.message }, error.status, undefined, error.retryAfter)
    : response({ error: "Reviews are temporarily unavailable. Please try again." }, 503);
}
function requestHost(request: Request) { return request.headers.get("host") || new URL(request.url).host; }
export function guardOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || request.headers.get("sec-fetch-site") === "cross-site") throw new ReviewError("Use the review form on this website.", 403);
  let url: URL;
  try { url = new URL(origin); } catch { throw new ReviewError("Use the review form on this website.", 403); }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  const production = ["https://asymmetri.co", "https://www.asymmetri.co"].includes(url.origin);
  if (origin !== url.origin || url.host !== requestHost(request) || (!production && !(local && ["http:", "https:"].includes(url.protocol)))) throw new ReviewError("Use the review form on this website.", 403);
}
function mayEstablishOwner(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true; // Same-origin browser GETs normally omit Origin.
  try { return new URL(origin).host === requestHost(request) && origin === new URL(origin).origin; } catch { return false; }
}

/** Bounded, per-process protection. IP addresses and random salt never reach disk. */
export function createRateLimiter(now = Date.now, maximumBuckets = 4096) {
  const salt = randomBytes(32), buckets = new Map<string, { count: number; until: number }>();
  function guard(request: Request, action: "read" | "write" | "report") {
    const time = now();
    for (const [key, bucket] of buckets) if (bucket.until <= time) buckets.delete(key);
    // The production proxy overwrites X-Real-IP. Never use an arbitrary forwarded chain.
    const candidate = request.headers.get("x-real-ip") || "";
    const ip = candidate.length <= 45 && isIP(candidate) ? candidate : "unavailable";
    const identity = createHmac("sha256", salt).update(ip).digest("hex");
    const perClient = action === "read" ? 120 : action === "write" ? 20 : 10;
    const interval = action === "read" ? 60000 : 3600000;
    const globalLimit = action === "read" ? 3000 : action === "write" ? 120 : 120;
    const entries = [[`${action}:${identity}`, perClient, interval], [`global:${action}`, globalLimit, 60000]] as const;
    if (buckets.size + entries.filter(([key]) => !buckets.has(key)).length > maximumBuckets) throw new ReviewError("Reviews are busy. Please try again shortly.", 429, 60);
    for (const [key, limit, duration] of entries) {
      const bucket = buckets.get(key) || { count: 0, until: time + duration };
      if (bucket.count >= limit) throw new ReviewError("Too many requests. Please try again later.", 429, Math.max(1, Math.ceil((bucket.until - time) / 1000)));
    }
    for (const [key, , duration] of entries) {
      const bucket = buckets.get(key) || { count: 0, until: time + duration };
      bucket.count++; buckets.set(key, bucket);
    }
  }
  return { guard, get size() { return buckets.size; } };
}
const limiter = createRateLimiter();
export async function requestBody(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new ReviewError("Use a JSON review request.", 415);
  const declared = request.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > 8192)) throw new ReviewError("Request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new ReviewError("Missing review request.");
  const chunks: Uint8Array[] = []; let length = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const expiry = new Promise<never>((_, reject) => { timeout = setTimeout(() => { void reader.cancel().catch(() => {}); reject(new ReviewError("Request took too long. Please try again.", 408)); }, 10000); timeout.unref?.(); });
  try {
    while (true) {
      const { value, done } = await Promise.race([reader.read(), expiry]);
      if (done) break;
      length += value.byteLength;
      if (length > 8192) { void reader.cancel().catch(() => {}); throw new ReviewError("Request is too large.", 413); }
      chunks.push(value);
    }
    try { return object(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)))); }
    catch { throw new ReviewError("Invalid review request."); }
  } finally { clearTimeout(timeout); reader.releaseLock(); }
}
export async function handleReviews(request: Request, campusValue: string) {
  try {
    const campus = campusId(campusValue), store = configuredStore();
    if (request.method === "GET") {
      limiter.guard(request, "read"); const { sort, offset } = reviewQuery(new URL(request.url));
      const existing = ownerToken(request), token = existing || (mayEstablishOwner(request) ? newOwnerToken() : "");
      return response(await store.list(campus, token, sort, offset), 200, token && !existing ? token : undefined);
    }
    if (!["POST", "PATCH", "DELETE"].includes(request.method)) return response({ error: "Method not allowed." }, 405);
    guardOrigin(request); limiter.guard(request, "write");
    const token = ownerToken(request);
    if (!token) throw new ReviewError("Reload this page to enable your review ownership cookie.", 401);
    if (request.method === "DELETE") return response(await store.remove(campus, token));
    const result = await store.save(campus, token, await requestBody(request), request.method === "PATCH");
    return response(result, result.created ? 201 : 200);
  } catch (error) { return failure(error); }
}
export async function handleReport(request: Request, campusValue: string) {
  try {
    const campus = campusId(campusValue), store = configuredStore();
    if (request.method !== "POST") return response({ error: "Method not allowed." }, 405);
    guardOrigin(request); limiter.guard(request, "report");
    const token = ownerToken(request); if (!token) throw new ReviewError("Reload this page to enable reporting.", 401);
    const { reviewId, reason } = reportDraft(await requestBody(request));
    return response(await store.report(campus, token, reviewId, reason));
  } catch (error) { return failure(error); }
}
