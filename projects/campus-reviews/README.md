# Shared virtual-campus reviews

A reusable review section and private Node backend for UBC, Case Western Reserve University and Stanford virtual campuses. This implementation is prepared locally; this document does not claim production deployment.

This release wires the section into UBC. CWRU and Stanford page integration belongs to their respective project workstreams; the shared API already supports all three.

`ReviewSection.tsx` renders visitor star ratings, comments, rating distribution, sorting, pagination, a review form, owner edit/removal and reporting. Campus pages pass `campus` (`ubc`, `cwru` or `stanford`) and `campusName`. Reviews describe the independent virtual experience, not the university itself. Text is rendered through React text nodes, never as HTML. There are no seeded reviews or fabricated ratings.

`model.ts` is the shared public contract. `http.ts` validates requests and protects ownership. `store.ts` persists reviews and moderation under a private directory outside the checkout. The two Next route handlers use the Node runtime. `admin.mjs` provides private host moderation, and `loader.mjs` uses the existing TypeScript dependency for tests and CLI execution. This module does not use or alter the UBC public-profile store.

## API contract

Base URL: `/labs/campus-reviews-api/{campus}`. All responses are private and `no-store`. The supported campuses are `ubc`, `cwru` and `stanford`.

| Request | Result |
| --- | --- |
| `GET ?sort=newest&offset=0` | `ReviewPage`, with up to 20 public reviews, aggregate statistics, this browser's own review/status and `nextOffset` |
| `POST` with `{name, rating, comment, website: ""}` | Creates or updates this browser's review for this campus; `{review, viewerReviewStatus: "published", created}`; HTTP 201 on create, 200 on update |
| `PATCH` with the same complete fields | Updates an existing review owned by this browser; same result, HTTP 200 |
| `DELETE` | Removes this browser's review; `{removed: true}` |
| `POST /report` with `{reviewId, reason}` | Queues a report and returns `{reported: true}`, including a repeated report by the same browser |

A public `Review` contains only `id`, `name`, `rating`, `comment`, `createdAt` and `updatedAt`. Dates are ISO UTC strings. Names contain 1–60 JavaScript string characters after trimming and NFC normalization. Comments contain 0–2,000 characters; a rating without a written comment is allowed. `rating` must be an integer from 1 through 5. The hidden `website` field must be empty when supplied. Unknown fields and unsafe control characters are rejected.

`ReviewPage` contains:

```ts
{
  reviews: Review[];
  summary: {
    total: number;
    average: number | null; // rounded to one decimal, null when empty
    counts: Record<1 | 2 | 3 | 4 | 5, number>;
  };
  viewerReview: Review | null;
  viewerReviewStatus: "published" | "hidden" | null;
  nextOffset: number | null;
}
```

The aggregate covers all published reviews for that campus, not just the current page. Supported sorts are `newest`, `highest` and `lowest`, with creation time and ID as stable secondary ordering. Editing does not change creation time. Offset must be an integer from 0 through 10,000. Pagination is offset based: concurrent publication/removal can move page boundaries; the component deduplicates displayed IDs.

A hidden review is excluded from public lists and aggregates. Its owner can still receive their own review with `viewerReviewStatus: "hidden"` and remove it. After a moderator removes the record, or the owner removes a hidden record, the owner receives `viewerReview: null` and `viewerReviewStatus: "hidden"`; a private tombstone prevents the same browser capability from republishing. Editing cannot bypass moderation. The UI disables publication in either hidden state.

Report reasons are `spam`, `offensive`, `privacy` and `other`. Reports do not automatically hide reviews. Private moderation is required.

Errors return `{error: string}`. Expected statuses include 400 (validation), 401 (missing owner cookie), 403 (origin or moderation), 404 (campus/review), 405 (method), 408 (body timeout), 413 (body size), 415 (media type), 429 (rate limit) and 503 (unavailable private storage). Rate-limit responses include `Retry-After`.

## Browser ownership and UI behavior

A same-origin initial GET establishes `campus_reviews_owner`, an opaque random 256-bit capability. It is HttpOnly, SameSite Strict, scoped to `/labs/campus-reviews-api`, lasts one year and is Secure outside `NODE_ENV=development`. Cross-site GETs do not establish or replace it. The interface waits for its first successful GET before allowing submission and serializes mutations. Mutations require the cookie and a matching allowed Origin. Public GET data does not expose ownership hashes or report metadata.

There is one review per browser capability per campus, not one verified review per human. Clearing cookies, using another browser/profile or switching between apex and `www` can establish a separate capability. There is no account, email collection, identity verification or recovery key. The same token scopes ownership across the three campuses, but a review in one campus cannot edit or remove another campus's record.

After a successful mutation the component discards stale list/ownership data before reloading. If refresh fails, it reports the successful change and offers a retry. Sorting does not append pages from a different sort. Keyboard focus returns after forms close and loading finishes. Production browser and physical-device validation must be reported separately from the automated backend tests.

## Local tests and operations

Use the repository's configured Node version. No additional package is required.

```sh
node --test projects/campus-reviews/reviews.test.mjs
```

The 13 tests cover validation, ownership and campus isolation, restart persistence, moderation and tombstones, report deduplication/retention, pagination and statistics, actual concurrent Node writers, failure-safe storage, CSRF, bounded request bodies/rate limits, HTTP cookie behavior and the private CLI. They use disposable temporary directories, not production records.

Before starting a local server, set `CAMPUS_REVIEWS_DATA_DIR` to an absolute, private directory outside the checkout. Without it the API returns 503; it never silently falls back to ephemeral storage. See [Campus reviews operations](../../docs/CAMPUS_REVIEWS_OPERATIONS.md) for setup, moderation, backup and safe lock recovery.
