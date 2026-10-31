/** Node-only private persistence. API and moderator CLI share the same lock. */
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { mkdir, open, readFile, rename, unlink, rmdir, lstat, realpath } from "node:fs/promises";
import { isAbsolute, join, resolve, relative, sep } from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import { campusId, campusIds, reviewDraft, reviewPageSize, reportReasons, validReviewId, ReviewError, type CampusId, type Review, type ReviewDraft, type ReviewPage, type ReviewSort, type ReportReason } from "./model";

type StoredReview = Review & { campus: CampusId; ownerHash: string; hidden: boolean };
type StoredReport = { id: string; campus: CampusId; reviewId: string; reason: ReportReason; reporterHash: string; createdAt: string; resolvedAt: string | null };
type Block = { id: string; campus: CampusId; ownerHash: string; createdAt: string };
type State = { version: 1; reviews: StoredReview[]; reports: StoredReport[]; blocks: Block[] };
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export const newOwnerToken = () => randomBytes(32).toString("base64url");
export const validOwnerToken = (token: unknown): token is string => typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token);
const ownerHash = (token: string) => { if (!validOwnerToken(token)) throw new ReviewError("Your review ownership cookie is missing. Reload this page.", 401); return hash(token); };
const publicReview = (r: StoredReview): Review => ({ id: r.id, name: r.name, rating: r.rating, comment: r.comment, createdAt: r.createdAt, updatedAt: r.updatedAt });
const validHash = (v: unknown) => typeof v === "string" && /^[0-9a-f]{64}$/.test(v);
const validDate = (v: unknown) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v) && Number.isFinite(Date.parse(v));
const maximumBytes = 48 * 1024 * 1024;
function validateState(value: unknown): State {
  const s = value as State;
  if (!s || s.version !== 1 || !Array.isArray(s.reviews) || !Array.isArray(s.reports) || !Array.isArray(s.blocks) || Object.keys(s).some((k) => !["version", "reviews", "reports", "blocks"].includes(k)) || s.reviews.length > 5000 || s.reports.length > 10000 || s.blocks.length > 10000) throw new Error("Invalid review store; preserve it for inspection.");
  const ids = new Set<string>(), owners = new Set<string>();
  for (const r of s.reviews) {
    if (!r || !validReviewId(r.id) || ids.has(r.id) || !campusIds.includes(r.campus) || !validHash(r.ownerHash) || typeof r.hidden !== "boolean" || !validDate(r.createdAt) || !validDate(r.updatedAt)) throw new Error("Invalid stored review.");
    const draft = reviewDraft({ name: r.name, rating: r.rating, comment: r.comment });
    if (draft.name !== r.name || draft.comment !== r.comment) throw new Error("Invalid stored text.");
    const key = `${r.campus}:${r.ownerHash}`; if (owners.has(key)) throw new Error("Duplicate review owner."); owners.add(key); ids.add(r.id);
  }
  for (const b of s.blocks) {
    if (!b || !validReviewId(b.id) || !campusIds.includes(b.campus) || !validHash(b.ownerHash) || !validDate(b.createdAt) || ids.has(b.id) || owners.has(`${b.campus}:${b.ownerHash}`)) throw new Error("Invalid moderation record.");
    owners.add(`${b.campus}:${b.ownerHash}`); ids.add(b.id);
  }
  const reports = new Set<string>(), reporters = new Set<string>();
  const reviewCampuses = new Map(s.reviews.map((r) => [r.id, r.campus]));
  for (const r of s.reports) {
    const key = `${r?.reviewId}:${r?.reporterHash}`;
    if (!r || !validReviewId(r.id) || reports.has(r.id) || !validReviewId(r.reviewId) || !campusIds.includes(r.campus) || !reportReasons.includes(r.reason) || !validHash(r.reporterHash) || !validDate(r.createdAt) || (r.resolvedAt !== null && !validDate(r.resolvedAt)) || reporters.has(key) || reviewCampuses.get(r.reviewId) !== r.campus) throw new Error("Invalid stored report.");
    reports.add(r.id); reporters.add(key);
  }
  return s;
}
export function createReviewStore(directory: string, options: { lockTimeoutMs?: number; now?: () => Date } = {}) {
  if (!isAbsolute(directory)) throw new Error("Reviews require an absolute private data directory.");
  const inside = (root: string, destination: string) => { const r = relative(root, destination); return !r || (r !== ".." && !r.startsWith(`..${sep}`) && !isAbsolute(r)); };
  if (inside(resolve(process.cwd()), resolve(directory))) throw new Error("Review storage must be outside the application checkout.");
  const path = join(directory, "reviews.json"), lock = join(directory, ".reviews-write-lock"), now = () => (options.now?.() || new Date()).toISOString();
  async function prepare() {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const info = await lstat(directory); if (!info.isDirectory() || info.isSymbolicLink() || (info.mode & 0o077)) throw new Error("Review directory must be private (0700).");
    if (inside(await realpath(process.cwd()), await realpath(directory))) throw new Error("Review storage must be outside the application checkout.");
  }
  async function read(): Promise<State> {
    await prepare();
    try { const info = await lstat(path); if (!info.isFile() || info.isSymbolicLink() || info.size > maximumBytes || (info.mode & 0o077)) throw new Error("Invalid private review file."); }
    catch (e) { if ((e as NodeJS.ErrnoException).code === "ENOENT") return { version: 1, reviews: [], reports: [], blocks: [] }; throw e; }
    return validateState(JSON.parse(await readFile(path, "utf8")));
  }
  async function transaction<T>(change: (s: State) => T): Promise<T> {
    await prepare(); const deadline = Date.now() + Math.max(0, Math.min(5000, options.lockTimeoutMs ?? 1500));
    while (true) {
      try { await mkdir(lock, { mode: 0o700 }); break; }
      catch (e) { if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e; if (Date.now() >= deadline) throw new ReviewError("Reviews are busy. Please try again shortly.", 503); await wait(20); }
    }
    const temporary = join(directory, `.reviews-${randomUUID()}.tmp`);
    try {
      const state = await read(), result = change(state); validateState(state);
      const bytes = Buffer.from(JSON.stringify(state)); if (bytes.byteLength > maximumBytes) throw new ReviewError("Review storage is full. Please try later.", 503);
      const file = await open(temporary, "wx", 0o600);
      try { await file.writeFile(bytes); await file.sync(); } finally { await file.close(); }
      await rename(temporary, path);
      const folder = await open(directory, "r"); try { await folder.sync(); } finally { await folder.close(); }
      return result;
    } finally {
      try { await unlink(temporary).catch((e) => { if (e.code !== "ENOENT") throw e; }); }
      finally { await rmdir(lock); }
    }
  }
  const findOwn = (s: State, campus: CampusId, token: string) => { const key = ownerHash(token); return s.reviews.find((r) => r.campus === campus && r.ownerHash === key); };
  function rejectModerated(s: State, campus: CampusId, key: string) { if (s.blocks.some((b) => b.campus === campus && b.ownerHash === key)) throw new ReviewError("This review was removed by moderation and cannot be republished from this browser.", 403); }
  return {
    async list(campusValue: CampusId, token = "", sort: ReviewSort = "newest", offset = 0): Promise<ReviewPage> {
      const campus = campusId(campusValue), s = await read(), published = s.reviews.filter((r) => r.campus === campus && !r.hidden);
      if (!["newest", "highest", "lowest"].includes(sort) || !Number.isInteger(offset) || offset < 0 || offset > 10000) throw new ReviewError("Invalid review page.");
      published.sort((a, b) => (sort === "highest" ? b.rating - a.rating : sort === "lowest" ? a.rating - b.rating : 0) || b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
      const counts: ReviewPage["summary"]["counts"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; let sum = 0;
      for (const r of published) { counts[r.rating]++; sum += r.rating; }
      const mine = validOwnerToken(token) ? findOwn(s, campus, token) : undefined;
      const moderated = validOwnerToken(token) && s.blocks.some((b) => b.campus === campus && b.ownerHash === ownerHash(token));
      return { reviews: published.slice(offset, offset + reviewPageSize).map(publicReview), summary: { total: published.length, average: published.length ? Math.round(sum / published.length * 10) / 10 : null, counts }, viewerReview: mine ? publicReview(mine) : null, viewerReviewStatus: mine ? mine.hidden ? "hidden" : "published" : moderated ? "hidden" : null, nextOffset: offset + reviewPageSize < published.length ? offset + reviewPageSize : null };
    },
    async save(campusValue: CampusId, token: string, value: unknown, mustExist = false) {
      const campus = campusId(campusValue), key = ownerHash(token), draft = reviewDraft(value);
      return transaction((s) => {
        rejectModerated(s, campus, key); const existing = findOwn(s, campus, token);
        if (existing?.hidden) throw new ReviewError("This review is hidden by moderation. You can remove it, but cannot republish it.", 403);
        if (mustExist && !existing) throw new ReviewError("Your review was not found in this browser.", 404);
        const time = now();
        if (existing) { Object.assign(existing, draft, { updatedAt: time }); return { review: publicReview(existing), viewerReviewStatus: "published" as const, created: false }; }
        if (s.reviews.length >= 5000) throw new ReviewError("Review capacity has been reached. Please try later.", 503);
        const review: StoredReview = { ...draft, id: randomUUID(), campus, ownerHash: key, hidden: false, createdAt: time, updatedAt: time };
        s.reviews.push(review); return { review: publicReview(review), viewerReviewStatus: "published" as const, created: true };
      });
    },
    async remove(campusValue: CampusId, token: string) {
      const campus = campusId(campusValue); ownerHash(token);
      return transaction((s) => { const r = findOwn(s, campus, token); if (!r) throw new ReviewError("Your review was not found in this browser.", 404);
        if (r.hidden) { if (s.blocks.length >= 10000) throw new ReviewError("Moderation storage is busy.", 503); s.blocks.push({ id: r.id, campus, ownerHash: r.ownerHash, createdAt: now() }); }
        s.reviews = s.reviews.filter((p) => p.id !== r.id); s.reports = s.reports.filter((report) => report.reviewId !== r.id); return { removed: true as const };
      });
    },
    async report(campusValue: CampusId, token: string, id: string, reason: ReportReason) {
      const campus = campusId(campusValue), reporterHash = ownerHash(token);
      if (!validReviewId(id) || !reportReasons.includes(reason)) throw new ReviewError("Choose a review and report reason.");
      return transaction((s) => {
        if (!s.reviews.some((r) => r.id === id && r.campus === campus && !r.hidden)) throw new ReviewError("That review is no longer public.", 404);
        const cutoff = Date.parse(now()) - 90 * 86400000; s.reports = s.reports.filter((r) => Date.parse(r.createdAt) >= cutoff);
        if (!s.reports.some((r) => r.reviewId === id && r.reporterHash === reporterHash)) {
          if (s.reports.length >= 10000) throw new ReviewError("Reports are busy. Please try later.", 503);
          s.reports.push({ id: randomUUID(), campus, reviewId: id, reason, reporterHash, createdAt: now(), resolvedAt: null });
        }
        return { reported: true as const };
      });
    },
    async reports(campusValue?: CampusId, includeResolved = false) {
      const campus = campusValue === undefined ? undefined : campusId(campusValue), s = await read();
      return s.reports.filter((r) => (!campus || r.campus === campus) && (includeResolved || r.resolvedAt === null)).map(({ id, campus, reviewId, reason, createdAt, resolvedAt }) => {
        const review = s.reviews.find((r) => r.id === reviewId)!;
        return { id, campus, reviewId, reason, createdAt, resolvedAt, review: publicReview(review), hidden: review.hidden };
      });
    },
    async moderate(campusValue: CampusId, id: string, action: "hide" | "restore" | "remove") {
      const campus = campusId(campusValue); if (!validReviewId(id) || !["hide", "restore", "remove"].includes(action)) throw new ReviewError("Invalid moderation action.");
      return transaction((s) => {
        const r = s.reviews.find((r) => r.campus === campus && r.id === id), block = s.blocks.find((b) => b.campus === campus && b.id === id);
        if (!r && action === "restore" && block) { s.blocks = s.blocks.filter((b) => b !== block); return { restored: false, unblocked: true }; }
        if (!r) throw new ReviewError("Review not found.", 404);
        if (action === "remove") {
          if (s.blocks.length >= 10000) throw new ReviewError("Moderation storage is busy.", 503);
          s.blocks.push({ id, campus, ownerHash: r.ownerHash, createdAt: now() }); s.reviews = s.reviews.filter((p) => p !== r); s.reports = s.reports.filter((p) => p.reviewId !== id);
        } else { r.hidden = action === "hide"; for (const report of s.reports) if (report.reviewId === id && !report.resolvedAt) report.resolvedAt = now(); }
        return { moderated: true, action };
      });
    },
  };
}
export type ReviewStore = ReturnType<typeof createReviewStore>;
export type { ReviewDraft };
