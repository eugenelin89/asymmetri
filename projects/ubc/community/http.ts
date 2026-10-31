import { createHmac, randomBytes } from "node:crypto";
import { ProfileError } from "./model";
import { createProfileStore } from "./store";

const COOKIE = "ubc_profile_owner",
  salt = randomBytes(32);
const buckets = new Map<string, { count: number; until: number }>();
export function store() {
  const dir = process.env.UBC_PROFILE_DIR;
  if (!dir)
    throw new ProfileError(
      "Public profiles are not enabled on this host yet.",
      503,
    );
  return createProfileStore(dir);
}
export const token = (request: Request) =>
  request.headers
    .get("cookie")
    ?.split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1) || "";
export function response(
  value: unknown,
  status = 200,
  ownerToken?: string,
  _request?: Request,
) {
  void _request;
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (ownerToken !== undefined)
    headers["Set-Cookie"] =
      `${COOKIE}=${ownerToken}; Path=/api/ubc; HttpOnly; SameSite=Strict; Max-Age=${ownerToken ? 31536000 : 0}${process.env.NODE_ENV !== "development" ? "; Secure" : ""}`;
  return Response.json(value, { status, headers });
}
export function failure(error: unknown) {
  if (error instanceof ProfileError)
    return response({ error: error.message }, error.status);
  return response(
    { error: "Profiles are temporarily unavailable. Please try again." },
    503,
  );
}
export function guard(
  request: Request,
  action: "create" | "edit" | "recover" | "report",
) {
  const origin = request.headers.get("origin"),
    local =
      process.env.NODE_ENV === "development" &&
      origin &&
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
  if (
    !local &&
    !["https://asymmetri.co", "https://www.asymmetri.co"].includes(origin || "")
  )
    throw new ProfileError("Use the profile form on this website.", 403);
  if (request.headers.get("sec-fetch-site") === "cross-site")
    throw new ProfileError("Cross-site changes are not allowed.", 403);
  // The production proxy overwrites X-Real-IP; do not accept forwarded chains.
  const source = request.headers.get("x-real-ip") || "local-shared";
  const identity = createHmac("sha256", salt).update(source).digest("hex");
  const limit =
    action === "create"
      ? 3
      : action === "report"
        ? 10
        : action === "recover"
          ? 6
          : 30;
  const interval = action === "create" || action === "report" ? 3600000 : 60000;
  const now = Date.now();
  for (const [key, b] of buckets) if (b.until <= now) buckets.delete(key);
  if (buckets.size > 5000)
    throw new ProfileError("Profiles are busy. Please try later.", 429);
  for (const [key, maximum, windowMs] of [
    [`${action}:${identity}`, limit, interval],
    ["global", 120, 60000],
  ] as const) {
    const bucket = buckets.get(key) || { count: 0, until: now + windowMs };
    if (++bucket.count > maximum)
      throw new ProfileError("Too many requests. Please try again later.", 429);
    buckets.set(key, bucket);
  }
  return identity;
}
export async function body(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new ProfileError("Use a JSON profile request.", 415);
  if (Number(request.headers.get("content-length")) > 8192)
    throw new ProfileError("Request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new ProfileError("Missing profile request.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 8192) {
      await reader.cancel();
      throw new ProfileError("Request is too large.", 413);
    }
    chunks.push(value);
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error();
    return parsed;
  } catch {
    throw new ProfileError("Invalid profile request.");
  }
}
