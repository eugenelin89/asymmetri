/** Node-only private telemetry. There is no public read API or cross-feature identity. */
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, unlink, rmdir, lstat, realpath } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import { isIP } from "node:net";
import { AnalyticsError, campusId, campuses, playEvent, reportDays, validSessionId, type Campus, type Source } from "./model";

type Detail = { firstIp: string | null; lastIp: string | null; firstUserAgent: string; lastUserAgent: string };
type Session = { id: string; campus: Campus; visitorHash: string; startedAt: number; lastAt: number; endedAt: number | null; active: boolean; seq: number; activeMs: number; days: Record<string, number>; detail: Detail | null };
type State = { version: 1; sessions: Session[] };
const dayMs = 86400000, rawRetention = 30 * dayMs, summaryRetention = 90 * dayMs, maxBytes = 32 * 1024 * 1024;
export const newVisitorToken = () => randomBytes(32).toString("base64url");
export const validVisitorToken = (token: unknown): token is string => typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token);
function visitorHash(token: string) { if (!validVisitorToken(token)) throw new AnalyticsError("Visitor cookie is missing.", 401); return createHash("sha256").update(token).digest("hex"); }
const validHash = (v: unknown) => typeof v === "string" && /^[0-9a-f]{64}$/.test(v);
const validTime = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v >= 0 && v <= 8640000000000000;
const day = (time: number) => new Date(time).toISOString().slice(0, 10);
const validUa = (v: unknown): v is string => typeof v === "string" && v.length <= 256 && !/[\x00-\x1f\x7f-\x9f]/.test(v);
export function sourceDetails(ip: unknown, userAgent: unknown): Source {
  return { ip: typeof ip === "string" && ip.length <= 45 && isIP(ip) ? ip : null, userAgent: typeof userAgent === "string" ? userAgent.replace(/[\x00-\x1f\x7f-\x9f]/g, " ").slice(0, 256) : "" };
}
function validate(value: unknown): State {
  const s = value as State;
  if (!s || s.version !== 1 || !Array.isArray(s.sessions) || s.sessions.length > 20000 || Object.keys(s).some((k) => !["version", "sessions"].includes(k))) throw new Error("Invalid analytics store; preserve it for inspection.");
  const ids = new Set<string>();
  for (const r of s.sessions) {
    const key = `${r?.campus}:${r?.id}`;
    if (!r || !validSessionId(r.id) || !campuses.includes(r.campus) || !validHash(r.visitorHash) || ids.has(key) || !validTime(r.startedAt) || !validTime(r.lastAt) || r.lastAt < r.startedAt || (r.endedAt !== null && (!validTime(r.endedAt) || r.endedAt < r.startedAt || r.endedAt > r.lastAt)) || typeof r.active !== "boolean" || (r.active && r.endedAt !== null) || !Number.isInteger(r.seq) || r.seq < 0 || r.seq > 10000000 || !Number.isSafeInteger(r.activeMs) || r.activeMs < 0 || !r.days || typeof r.days !== "object" || Array.isArray(r.days) || Object.keys(r.days).length > 91) throw new Error("Invalid analytics session.");
    let sum = 0;
    for (const [date, ms] of Object.entries(r.days)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isSafeInteger(ms) || ms < 0 || ms > dayMs || date < day(r.startedAt) || date > day(r.lastAt)) throw new Error("Invalid analytics duration.");
      sum += ms;
    }
    if (sum !== r.activeMs || r.activeMs > r.lastAt - r.startedAt) throw new Error("Invalid analytics total.");
    if (r.detail !== null && (!r.detail || ![r.detail.firstIp, r.detail.lastIp].every((ip) => ip === null || typeof ip === "string" && isIP(ip)) || !validUa(r.detail.firstUserAgent) || !validUa(r.detail.lastUserAgent))) throw new Error("Invalid analytics source detail.");
    ids.add(key);
  }
  return s;
}
function pruneState(s: State, now: number) {
  const before = s.sessions.length; s.sessions = s.sessions.filter((r) => now - r.startedAt < summaryRetention);
  let redactedSessions = 0;
  for (const r of s.sessions) if (r.detail && now - r.startedAt >= rawRetention) { r.detail = null; redactedSessions++; }
  return { removedSessions: before - s.sessions.length, redactedSessions };
}
function credit(r: Session, end: number) {
  const elapsed = end - r.lastAt;
  if (!r.active || elapsed <= 0 || elapsed > 45000) return;
  const ms = Math.min(elapsed, 35000); let start = end - ms;
  while (start < end) {
    const boundary = (Math.floor(start / dayMs) + 1) * dayMs, amount = Math.min(end, boundary) - start, key = day(start);
    r.days[key] = (r.days[key] || 0) + amount; r.activeMs += amount; start += amount;
  }
}
export function createAnalyticsStore(directory: string, options: { now?: () => number; lockTimeoutMs?: number } = {}) {
  if (!isAbsolute(directory)) throw new Error("Analytics require an absolute private directory.");
  const inside = (root: string, dest: string) => { const p = relative(root, dest); return !p || (p !== ".." && !p.startsWith(`..${sep}`) && !isAbsolute(p)); };
  if (inside(resolve(process.cwd()), resolve(directory))) throw new Error("Analytics must be stored outside the checkout.");
  const path = join(directory, "analytics.json"), lock = join(directory, ".analytics-write-lock"), clock = () => Math.trunc(options.now?.() ?? Date.now());
  async function prepare() {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const info = await lstat(directory);
    if (!info.isDirectory() || info.isSymbolicLink() || (info.mode & 0o077) || inside(await realpath(process.cwd()), await realpath(directory))) throw new Error("Analytics directory must be private and outside the checkout.");
  }
  async function read(): Promise<State> {
    await prepare();
    try { const info = await lstat(path); if (!info.isFile() || info.isSymbolicLink() || (info.mode & 0o077) || info.size > maxBytes) throw new Error("Invalid private analytics file."); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return { version: 1, sessions: [] }; throw error; }
    return validate(JSON.parse(await readFile(path, "utf8")));
  }
  async function transaction<T>(change: (s: State, now: number) => T): Promise<T> {
    await prepare(); const deadline = Date.now() + Math.max(0, Math.min(5000, options.lockTimeoutMs ?? 1500));
    while (true) {
      try { await mkdir(lock, { mode: 0o700 }); break; }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error; if (Date.now() >= deadline) throw new AnalyticsError("Play statistics are busy.", 503); await wait(20); }
    }
    const temporary = join(directory, `.analytics-${randomUUID()}.tmp`);
    try {
      const s = await read(), now = clock(); if (!validTime(now)) throw new Error("Invalid server clock.");
      const result = change(s, now); validate(s); const data = Buffer.from(JSON.stringify(s));
      if (data.byteLength > maxBytes) throw new AnalyticsError("Play statistics capacity is full.", 503);
      const file = await open(temporary, "wx", 0o600);
      try { await file.writeFile(data); await file.sync(); } finally { await file.close(); }
      await rename(temporary, path);
      const folder = await open(directory, "r"); try { await folder.sync(); } finally { await folder.close(); }
      return result;
    } finally { try { await unlink(temporary).catch((e) => { if (e.code !== "ENOENT") throw e; }); } finally { await rmdir(lock); } }
  }
  return {
    async event(campusValue: Campus, token: string, value: unknown, source: Source) {
      const campus = campusId(campusValue), hash = visitorHash(token), event = playEvent(value), detail = sourceDetails(source.ip, source.userAgent);
      return transaction((s, now) => {
        pruneState(s, now);
        let r = s.sessions.find((r) => r.campus === campus && r.id === event.sessionId);
        if (!r) {
          if (event.event !== "start" || event.seq !== 0) throw new AnalyticsError("Begin a new play session first.", 404);
          if (s.sessions.length >= 20000) throw new AnalyticsError("Play statistics capacity is full.", 503);
          r = { id: event.sessionId, campus, visitorHash: hash, startedAt: now, lastAt: now, endedAt: null, active: true, seq: 0, activeMs: 0, days: {}, detail: { firstIp: detail.ip, lastIp: detail.ip, firstUserAgent: detail.userAgent, lastUserAgent: detail.userAgent } };
          s.sessions.push(r); return { accepted: true as const };
        }
        if (r.visitorHash !== hash) throw new AnalyticsError("That session belongs to another browser.", 403);
        if (event.seq <= r.seq || r.endedAt !== null) return { accepted: true as const };
        const effectiveNow = Math.max(now, r.lastAt);
        credit(r, effectiveNow); r.seq = event.seq; r.lastAt = effectiveNow;
        if (r.detail) { r.detail.lastIp = detail.ip; r.detail.lastUserAgent = detail.userAgent; }
        if (event.event === "start") r.active = true;
        if (event.event === "pause" || event.event === "end") r.active = false;
        if (event.event === "end") r.endedAt = effectiveNow;
        return { accepted: true as const };
      });
    },
    async remove(campusValue: Campus, token: string, all = false) {
      const campus = campusId(campusValue), hash = visitorHash(token);
      return transaction((s, now) => { pruneState(s, now); s.sessions = s.sessions.filter((r) => r.visitorHash !== hash || (!all && r.campus !== campus)); return { removed: true as const }; });
    },
    async prune() { return transaction((s, now) => pruneState(s, now)); },
    async report(campusValue?: Campus, daysValue = 30, includeSessions = false) {
      const campus = campusValue === undefined ? undefined : campusId(campusValue), days = reportDays(daysValue);
      return transaction((s, now) => {
        pruneState(s, now);
        const startDay = day(Math.floor(now / dayMs) * dayMs - (days - 1) * dayMs), startMs = Date.parse(`${startDay}T00:00:00.000Z`);
        const sessions = s.sessions.filter((r) => (!campus || r.campus === campus) && (r.startedAt >= startMs || Object.entries(r.days).some(([date, ms]) => date >= startDay && ms > 0)));
        const periodMs = (r: Session) => Object.entries(r.days).reduce((sum, [date, ms]) => sum + (date >= startDay ? ms : 0), 0);
        const daily = Array.from({ length: days }, (_, i) => {
          const date = day(startMs + i * dayMs), records = sessions.filter((r) => day(r.startedAt) === date || (r.days[date] || 0) > 0);
          return { date, sessions: records.length, uniqueBrowsers: new Set(records.map((r) => r.visitorHash)).size, totalActiveSeconds: records.reduce((sum, r) => sum + (r.days[date] || 0), 0) / 1000 };
        });
        return { campus: campus || "all", periodStart: `${startDay}T00:00:00.000Z`, generatedAt: new Date(now).toISOString(), periodDays: days, sessions: sessions.length, uniqueBrowsers: new Set(sessions.map((r) => r.visitorHash)).size, totalActiveSeconds: sessions.reduce((sum, r) => sum + periodMs(r), 0) / 1000, daily,
          ...(includeSessions ? { sessionDetails: sessions.map((r) => ({ sessionId: r.id, campus: r.campus, startedAt: new Date(r.startedAt).toISOString(), lastAt: new Date(r.lastAt).toISOString(), endedAt: r.endedAt === null ? null : new Date(r.endedAt).toISOString(), state: r.endedAt !== null ? "ended" : r.active ? now - r.lastAt > 45000 ? "inactive" : "active" : "paused", totalActiveSeconds: r.activeMs / 1000, periodActiveSeconds: periodMs(r) / 1000, source: r.detail })) } : {}) };
      });
    },
  };
}
