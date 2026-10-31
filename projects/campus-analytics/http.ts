/** Private telemetry collection only; no HTTP analytics read/admin endpoint. */
import { createHmac, randomBytes } from "node:crypto";
import { isIP } from "node:net";
import { AnalyticsError, campusId, deletionScope, object, playEvent } from "./model";
import { createAnalyticsStore, newVisitorToken, sourceDetails, validVisitorToken } from "./store";
const cookieName = "campus_analytics_visitor", cookiePath = "/labs/campus-analytics-api";
export function configuredStore() {
  const directory = process.env.CAMPUS_ANALYTICS_DATA_DIR;
  if (!directory) throw new AnalyticsError("Play statistics are not enabled on this host.", 503);
  return createAnalyticsStore(directory);
}
export function visitorToken(request: Request) {
  const matches = (request.headers.get("cookie") || "").split(";").map((s) => s.trim()).filter((s) => s.startsWith(`${cookieName}=`));
  if (matches.length !== 1) return "";
  const token = matches[0].slice(cookieName.length + 1); return validVisitorToken(token) ? token : "";
}
function response(value: unknown, status = 200, token?: string, retryAfter?: number) {
  const headers: Record<string, string> = { "Cache-Control": "private, no-store", Vary: "Cookie", "X-Content-Type-Options": "nosniff" };
  if (token !== undefined) headers["Set-Cookie"] = `${cookieName}=${token}; Path=${cookiePath}; HttpOnly; SameSite=Strict; Max-Age=${token ? 31536000 : 0}${process.env.NODE_ENV === "development" ? "" : "; Secure"}`;
  if (retryAfter) headers["Retry-After"] = String(retryAfter);
  return Response.json(value, { status, headers });
}
function failure(error: unknown) {
  return error instanceof AnalyticsError ? response({ error: error.message }, error.status, undefined, error.retryAfter)
    : response({ error: "Play statistics are temporarily unavailable." }, 503);
}
export function guardOrigin(request: Request) {
  const origin = request.headers.get("origin"), host = request.headers.get("host") || new URL(request.url).host;
  if (!origin || request.headers.get("sec-fetch-site") === "cross-site") throw new AnalyticsError("Use this website for play statistics.", 403);
  let url: URL; try { url = new URL(origin); } catch { throw new AnalyticsError("Invalid origin.", 403); }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) && ["http:", "https:"].includes(url.protocol);
  if (origin !== url.origin || url.host !== host || (!local && !["https://asymmetri.co", "https://www.asymmetri.co"].includes(origin))) throw new AnalyticsError("Use this website for play statistics.", 403);
}
export function privacyAllowsCollection(request: Request) {
  return request.headers.get("sec-gpc")?.trim() !== "1" && request.headers.get("dnt")?.trim() !== "1";
}
export function createRateLimiter(now = Date.now, maximumBuckets = 4096) {
  const salt = randomBytes(32), buckets = new Map<string, { count: number; until: number }>();
  return {
    get size() { return buckets.size; },
    guard(request: Request, action: "event" | "delete") {
      const time = now(); for (const [key, bucket] of buckets) if (bucket.until <= time) buckets.delete(key);
      const candidate = request.headers.get("x-real-ip") || "";
      const ip = candidate.length <= 45 && isIP(candidate) ? candidate : "unavailable";
      const hash = createHmac("sha256", salt).update(ip).digest("hex");
      const entries = [[`${action}:${hash}`, action === "event" ? 240 : 20], [`global:${action}`, action === "event" ? 3000 : 120]] as const;
      if (buckets.size + entries.filter(([key]) => !buckets.has(key)).length > maximumBuckets) throw new AnalyticsError("Play statistics are busy.", 429, 60);
      for (const [key, limit] of entries) { const b = buckets.get(key); if (b && b.count >= limit) throw new AnalyticsError("Too many requests.", 429, Math.max(1, Math.ceil((b.until - time) / 1000))); }
      for (const [key] of entries) { const b = buckets.get(key) || { count: 0, until: time + 60000 }; b.count++; buckets.set(key, b); }
    },
  };
}
const limiter = createRateLimiter();
export async function requestBody(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new AnalyticsError("Use a JSON event.", 415);
  const declared = request.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > 1024)) throw new AnalyticsError("Event is too large.", 413);
  const reader = request.body?.getReader(); if (!reader) throw new AnalyticsError("Missing event.");
  const chunks: Uint8Array[] = []; let length = 0; let timeout: ReturnType<typeof setTimeout> | undefined;
  const expiry = new Promise<never>((_, reject) => { timeout = setTimeout(() => { void reader.cancel().catch(() => {}); reject(new AnalyticsError("Event took too long.", 408)); }, 10000); timeout.unref?.(); });
  try {
    while (true) { const { value, done } = await Promise.race([reader.read(), expiry]); if (done) break; length += value.byteLength; if (length > 1024) { void reader.cancel().catch(() => {}); throw new AnalyticsError("Event is too large.", 413); } chunks.push(value); }
    try { return object(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)))); } catch { throw new AnalyticsError("Invalid event."); }
  } finally { clearTimeout(timeout); reader.releaseLock(); }
}
export async function handleAnalytics(request: Request, campusValue: string) {
  try {
    const campus = campusId(campusValue);
    if (!["POST", "DELETE"].includes(request.method)) return response({ error: "Method not allowed." }, 405);
    guardOrigin(request);
    if (request.method === "POST" && !privacyAllowsCollection(request)) throw new AnalyticsError("Play statistics are disabled by your privacy preference.", 403);
    limiter.guard(request, request.method === "POST" ? "event" : "delete");
    const existing = visitorToken(request);
    if (request.method === "DELETE") {
      const scope = deletionScope(request.body ? await requestBody(request) : {});
      if (existing) await configuredStore().remove(campus, existing, scope === "all");
      return response({ removed: true }, 200, scope === "all" ? "" : undefined);
    }
    const event = playEvent(await requestBody(request));
    if (!existing && (event.event !== "start" || event.seq !== 0)) throw new AnalyticsError("Begin a play session first.", 401);
    if (!existing) {
      // Prove that the browser received the capability before storing any IP,
      // user-agent or session. A lost response or blocked cookie leaves no record.
      configuredStore();
      return response({ accepted: false, initialized: true }, 200, newVisitorToken());
    }
    const result = await configuredStore().event(campus, existing, event, sourceDetails(request.headers.get("x-real-ip"), request.headers.get("user-agent")));
    return response(result);
  } catch (error) { return failure(error); }
}
