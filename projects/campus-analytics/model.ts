/** The browser supplies events, never a claimed duration or identity. */
export const campuses = ["ubc", "cwru", "stanford"] as const;
export type Campus = typeof campuses[number];
export const eventNames = ["start", "heartbeat", "pause", "end"] as const;
export type EventName = typeof eventNames[number];
export type PlayEvent = { sessionId: string; event: EventName; seq: number };
export type Source = { ip: string | null; userAgent: string };
export class AnalyticsError extends Error {
  constructor(message: string, public status = 400, public retryAfter?: number) { super(message); this.name = "AnalyticsError"; }
}
export function campusId(value: unknown): Campus {
  if (typeof value !== "string" || !campuses.includes(value as Campus)) throw new AnalyticsError("Campus not found.", 404);
  return value as Campus;
}
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new AnalyticsError("Use an event object.");
  return value as Record<string, unknown>;
}
export const validSessionId = (id: unknown): id is string => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
export function playEvent(value: unknown): PlayEvent {
  const v = object(value);
  if (Object.keys(v).some((key) => !["sessionId", "event", "seq"].includes(key)) || !validSessionId(v.sessionId) || !eventNames.includes(v.event as EventName) || typeof v.seq !== "number" || !Number.isSafeInteger(v.seq) || v.seq < 0 || v.seq > 10000000) throw new AnalyticsError("Invalid play event.");
  return { sessionId: v.sessionId, event: v.event as EventName, seq: v.seq };
}
export function deletionScope(value: unknown): "campus" | "all" {
  const v = object(value);
  if (Object.keys(v).some((key) => key !== "scope") || (v.scope !== undefined && !["all", "campus"].includes(v.scope as string))) throw new AnalyticsError("Choose a supported deletion scope.");
  return v.scope === "all" ? "all" : "campus";
}
export function reportDays(value: unknown): number {
  const days = Number(value);
  if (!Number.isInteger(days) || days < 1 || days > 90) throw new AnalyticsError("Choose 1–90 days.");
  return days;
}
