/** Shared plain-text review contract. No account, email or verified-identity claim. */
export const campusIds = ["ubc", "cwru", "stanford"] as const;
export type CampusId = typeof campusIds[number];
export const reviewSorts = ["newest", "highest", "lowest"] as const;
export type ReviewSort = typeof reviewSorts[number];
export type Rating = 1 | 2 | 3 | 4 | 5;
export type Review = { id: string; name: string; rating: Rating; comment: string; createdAt: string; updatedAt: string };
export type ReviewDraft = Pick<Review, "name" | "rating" | "comment">;
export type ReviewPage = {
  reviews: Review[];
  summary: { total: number; average: number | null; counts: Record<Rating, number> };
  viewerReview: Review | null;
  viewerReviewStatus: "published" | "hidden" | null;
  nextOffset: number | null;
};
export const reportReasons = ["spam", "offensive", "privacy", "other"] as const;
export type ReportReason = typeof reportReasons[number];
export const reviewPageSize = 20;
export class ReviewError extends Error {
  constructor(message: string, public status = 400, public retryAfter?: number) { super(message); this.name = "ReviewError"; }
}
export function campusId(value: unknown): CampusId {
  if (typeof value !== "string" || !campusIds.includes(value as CampusId)) throw new ReviewError("Campus not found.", 404);
  return value as CampusId;
}
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ReviewError("Use a review object.");
  return value as Record<string, unknown>;
}
export function reviewDraft(value: unknown): ReviewDraft {
  const v = object(value);
  if (Object.keys(v).some((key) => !["name", "rating", "comment", "website"].includes(key))) throw new ReviewError("Unexpected review field.");
  if (v.website !== undefined && v.website !== "") throw new ReviewError("Unable to accept this submission.");
  const plain = (key: "name" | "comment", max: number) => {
    if (typeof v[key] !== "string") throw new ReviewError(`Check your ${key}.`);
    const text = v[key].replace(/\r\n?/g, "\n").trim().normalize("NFC");
    if (text.length > max || (key === "name" && !text.length) || [...text].some((c) => {
      const n = c.codePointAt(0)!;
      return (n < 32 && !(key === "comment" && (n === 9 || n === 10))) || (n >= 127 && n <= 159) || (n >= 0x202a && n <= 0x202e) || (n >= 0x2066 && n <= 0x2069);
    })) throw new ReviewError(`Use ${key === "name" ? "1–60" : "0–2000"} plain-text characters for your ${key}.`);
    return text;
  };
  if (typeof v.rating !== "number" || !Number.isInteger(v.rating) || v.rating < 1 || v.rating > 5) throw new ReviewError("Choose a rating from 1 to 5 stars.");
  return { name: plain("name", 60), rating: v.rating as Rating, comment: plain("comment", 2000) };
}
export const validReviewId = (id: unknown): id is string => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
export function reportDraft(value: unknown): { reviewId: string; reason: ReportReason } {
  const v = object(value);
  if (Object.keys(v).some((key) => !["reviewId", "reason"].includes(key)) || !validReviewId(v.reviewId) || !reportReasons.includes(v.reason as ReportReason)) throw new ReviewError("Choose a review and a report reason.");
  return { reviewId: v.reviewId, reason: v.reason as ReportReason };
}
export function reviewQuery(url: URL): { sort: ReviewSort; offset: number } {
  const sort = url.searchParams.get("sort") || "newest", offset = url.searchParams.get("offset") || "0";
  if (!reviewSorts.includes(sort as ReviewSort) || !/^(0|[1-9]\d{0,4})$/.test(offset) || Number(offset) > 10000 || url.searchParams.getAll("sort").length > 1 || url.searchParams.getAll("offset").length > 1) throw new ReviewError("Choose a supported review sort and page.");
  return { sort: sort as ReviewSort, offset: Number(offset) };
}
