"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { CampusId, Review, ReviewPage, ReviewSort } from "./model";
import styles from "./reviews.module.css";

const ratingLabels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
const reportReasons = { spam: "Spam or advertising", offensive: "Abusive or inappropriate content", privacy: "Personal or private information", other: "Another concern" } as const;
type ReportReason = keyof typeof reportReasons;

function Stars({ rating }: { rating: number }) {
  return <span className={styles.stars} role="img" aria-label={rating ? `${rating} out of 5 stars` : "No ratings yet"}>
    <span aria-hidden="true" className={styles.unfilled}>★★★★★</span><span aria-hidden="true" className={styles.filledStars} style={{ width: `${Math.max(0, Math.min(5, rating)) * 20}%` }}>★★★★★</span>
  </span>;
}
function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => Array.from(part)[0] || "").join("").toUpperCase();
}
function dateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Vancouver" });
}
async function jsonResponse(response: Response) {
  const value = await response.json().catch(() => null);
  if (!response.ok) throw new Error(value?.error || "Reviews are temporarily unavailable. Please try again.");
  if (!value) throw new Error("Reviews could not be loaded. Please try again.");
  return value;
}

export function ReviewSection({ campus, campusName }: { campus: CampusId; campusName: string }) {
  const id = useId(), formRef = useRef<HTMLFormElement>(null), writeButton = useRef<HTMLButtonElement>(null), requestSerial = useRef(0), heading = useRef<HTMLHeadingElement>(null), restoreFocus = useRef(false);
  const [page, setPage] = useState<ReviewPage | null>(null), [sort, setSort] = useState<ReviewSort>("newest"), [loadedSort, setLoadedSort] = useState<ReviewSort | null>(null);
  const [loading, setLoading] = useState(true), [saving, setSaving] = useState(false);
  const [error, setError] = useState(""), [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false), [name, setName] = useState(""), [rating, setRating] = useState(0), [comment, setComment] = useState(""), [website, setWebsite] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set()), [confirmRemove, setConfirmRemove] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null), [reportReason, setReportReason] = useState<ReportReason>("spam");
  const endpoint = `/labs/campus-reviews-api/${campus}`;
  const load = useCallback(async (offset = 0, signal?: AbortSignal) => {
    const serial = ++requestSerial.current;
    setLoading(true); setError("");
    try {
      const result = await jsonResponse(await fetch(`${endpoint}?sort=${sort}&offset=${offset}`, { cache: "no-store", credentials: "same-origin", signal })) as ReviewPage;
      if (signal?.aborted || serial !== requestSerial.current) return false;
      setPage((previous) => ({ ...result, reviews: offset && previous
        ? [...previous.reviews, ...result.reviews.filter((review) => !previous.reviews.some((old) => old.id === review.id))]
        : result.reviews }));
      setLoadedSort(sort);
      return true;
    } catch (failure) {
      if (!signal?.aborted && serial === requestSerial.current) setError(failure instanceof Error ? failure.message : "Reviews could not be loaded.");
      return false;
    } finally { if (!signal?.aborted && serial === requestSerial.current) setLoading(false); }
  }, [endpoint, sort]);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => { void load(0, controller.signal); }, 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [load]);
  useEffect(() => { if (formOpen) formRef.current?.focus({ preventScroll: true }); }, [formOpen]);
  useEffect(() => {
    if (restoreFocus.current && !saving && !loading && !formOpen) {
      restoreFocus.current = false;
      (writeButton.current && !writeButton.current.disabled ? writeButton.current : heading.current)?.focus({ preventScroll: true });
    }
  }, [formOpen, saving, loading]);
  const openForm = () => {
    const own = page?.viewerReview;
    setName(own?.name || ""); setRating(own?.rating || 0); setComment(own?.comment || "");
    setWebsite(""); setError(""); setMessage(""); setFormOpen(true); setConfirmRemove(false);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "auto", block: "nearest" }));
  };
  const closeForm = () => { restoreFocus.current = true; setFormOpen(false); };
  async function mutate(method: string, body?: unknown) {
    return jsonResponse(await fetch(endpoint, { method, credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) }));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !page) return;
    if (!rating) { setError("Choose a star rating before posting your review."); return; }
    setSaving(true); setError(""); setMessage("");
    try {
      await mutate(page.viewerReview ? "PATCH" : "POST", { name, rating, comment, website });
      // The mutation is authoritative even if the follow-up GET fails. Discard
      // the old list and ownership so a removed or outdated record stays unusable.
      setPage(null); setLoadedSort(null);
      const refreshed = await load(); closeForm();
      setMessage((page.viewerReview ? "Your review has been updated." : "Thank you. Your review is now public.") + (refreshed ? "" : " Refresh the reviews to see the latest list."));
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Your review could not be saved."); }
    finally { setSaving(false); }
  }
  async function remove() {
    if (saving) return;
    setSaving(true); setError(""); setMessage("");
    try {
      await mutate("DELETE"); setConfirmRemove(false); closeForm();
      setPage(null); setLoadedSort(null);
      const refreshed = await load();
      setMessage("Your review has been removed." + (refreshed ? "" : " Refresh the reviews to see the latest list."));
    }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Your review could not be removed."); }
    finally { setSaving(false); }
  }
  async function report(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!reportId || saving) return;
    setSaving(true); setError(""); setMessage("");
    try {
      await jsonResponse(await fetch(`${endpoint}/report`, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reviewId: reportId, reason: reportReason }) }));
      restoreFocus.current = true; setReportId(null); setMessage("Report received. Thank you for helping keep reviews useful.");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "The report could not be sent."); }
    finally { setSaving(false); }
  }
  const summary = page?.summary, hidden = page?.viewerReviewStatus === "hidden";
  const ownId = page?.viewerReview?.id;
  const list = loadedSort === sort ? page?.reviews || [] : [];
  const busy = saving || loading;
  const reviewCard = (review: Review) => {
    const own = review.id === ownId, long = review.comment.length > 440, showAll = expanded.has(review.id);
    return <article key={review.id} className={styles.card} aria-label={`Review by ${review.name}`}>
      <div className={styles.person}>
        <span className={styles.avatar} aria-hidden="true">{initials(review.name)}</span>
        <div><strong>{review.name}</strong><small>{own ? "Your review" : "Campus visitor"}</small></div>
      </div>
      <div className={styles.reviewMeta}><Stars rating={review.rating} /><time dateTime={review.createdAt}>{dateLabel(review.createdAt)}</time>{review.updatedAt !== review.createdAt && <span className={styles.muted}>Edited</span>}</div>
      {review.comment && <p className={styles.reviewText}>{long && !showAll ? `${review.comment.slice(0, 440)}…` : review.comment}</p>}
      <div className={styles.cardActions}>
        {long && <button className={styles.textButton} aria-expanded={showAll} onClick={() => setExpanded((before) => { const next = new Set(before); if (next.has(review.id)) next.delete(review.id); else next.add(review.id); return next; })}>{showAll ? "Show less" : "Read more"}</button>}
        {own ? <><button className={styles.textButton} onClick={openForm} disabled={busy}>Edit review</button><button className={`${styles.textButton} ${styles.danger}`} onClick={() => setConfirmRemove(true)} disabled={busy}>Remove</button></>
          : <button className={styles.textButton} aria-expanded={reportId === review.id} onClick={() => { setReportId(reportId === review.id ? null : review.id); setReportReason("spam"); }} disabled={busy}>Report</button>}
      </div>
      {own && confirmRemove && <div className={styles.report}><p>Remove your public review?</p><div className={styles.reportActions}><button className={styles.secondary} onClick={() => void remove()} disabled={saving}>Yes, remove</button><button className={styles.textButton} onClick={() => setConfirmRemove(false)}>Keep review</button></div></div>}
      {reportId === review.id && <form className={styles.report} onSubmit={report}><label>What is the concern?<select value={reportReason} onChange={(event) => setReportReason(event.target.value as ReportReason)}>{Object.entries(reportReasons).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><div className={styles.reportActions}><button className={styles.secondary} type="submit" disabled={saving}>{saving ? "Sending…" : "Send report"}</button><button className={styles.textButton} type="button" onClick={() => setReportId(null)}>Cancel</button></div></form>}
    </article>;
  };
  return <section className={styles.section} aria-labelledby={`${id}-heading`} id={`reviews-${campus}`}>
    <div className={styles.header}>
      <div><span className={styles.eyebrow}>Campus voices</span><h2 ref={heading} tabIndex={-1} id={`${id}-heading`}>How was your visit?</h2><p>Reviews of the {campusName} virtual experience.</p></div>
      <button ref={writeButton} className={styles.primary} onClick={openForm} disabled={!page || busy || hidden}><span aria-hidden="true">✎</span> {ownId ? "Edit your review" : "Write a review"}</button>
    </div>
    <div className={styles.summary} aria-label="Visitor rating summary">
      <div><div className={styles.score}>{summary?.total && summary.average !== null ? summary.average.toFixed(1) : "—"}</div><div className={styles.scoreStars}><Stars rating={summary?.average || 0} /></div><div className={styles.scoreCaption}>{page ? `${summary!.total.toLocaleString()} ${summary!.total === 1 ? "review" : "reviews"}` : "Loading ratings…"}</div></div>
      <div className={styles.distribution}>{([5, 4, 3, 2, 1] as const).map((value) => { const count = summary?.counts[value] || 0; return <div key={value} className={styles.barRow} aria-label={`${value} stars: ${count} reviews`}><span aria-hidden="true">{value}</span><div className={styles.track} aria-hidden="true"><span style={{ width: `${summary?.total ? count / summary.total * 100 : 0}%` }} /></div><span aria-hidden="true">{count}</span></div>; })}</div>
      <div className={styles.summaryNote}><strong>A better campus, together.</strong>Share a favourite discovery, a helpful tip, or something we could improve. These ratings are for this independent virtual campus.</div>
    </div>
    {message && <p className={styles.status} role="status">{message}</p>}
    {error && <div className={`${styles.status} ${styles.error}`} role="alert">{error} {!saving && <button className={styles.textButton} onClick={() => void load()}>Try again</button>}</div>}
    {hidden && <div className={styles.status}><p>Your review is hidden following moderation. For help, contact <a href="mailto:info@asymmetri.co">info@asymmetri.co</a>.</p>{ownId && <><button className={styles.textButton} onClick={() => setConfirmRemove(true)}>Remove my review</button>{confirmRemove && <div className={styles.reportActions}><button className={styles.secondary} disabled={saving} onClick={() => void remove()}>Confirm removal</button><button className={styles.textButton} onClick={() => setConfirmRemove(false)}>Cancel</button></div>}</>}</div>}
    {formOpen && <form ref={formRef} tabIndex={-1} className={styles.form} onSubmit={submit} aria-labelledby={`${id}-form-title`}>
      <div className={styles.formHeading}><div><h3 id={`${id}-form-title`}>{ownId ? "Update your review" : "Tell us about your visit"}</h3><p className={styles.muted}>Your display name, rating and comments will be public.</p></div><button type="button" className={styles.close} aria-label="Close review form" disabled={saving} onClick={closeForm}>×</button></div>
      <fieldset className={styles.ratingField}><legend>Your overall rating</legend><div className={styles.ratingChoices}>{([1, 2, 3, 4, 5] as const).map((value) => <label key={value} className={`${styles.ratingChoice} ${rating >= value ? styles.ratingSelected : ""}`}><input type="radio" name={`${id}-rating`} value={value} checked={rating === value} onChange={() => setRating(value)} required /><span aria-hidden="true">★</span><span className={styles.honeypot}>{value} {value === 1 ? "star" : "stars"} · {ratingLabels[value]}</span></label>)}<span className={styles.ratingHint}>{rating ? ratingLabels[rating] : "Select a rating"}</span></div></fieldset>
      <div className={styles.fields}><label className={styles.field}><span>Display name</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={60} required autoComplete="nickname" placeholder="How should we call you?" /><small>A first name or nickname is fine.</small></label><label className={styles.field}><span>Your review <span className={styles.muted}>(optional)</span></span><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={2000} placeholder="What did you enjoy? What could be better?" /><small>{comment.length.toLocaleString()} / 2,000 characters</small></label></div>
      <label className={styles.honeypot} aria-hidden="true">Leave this field empty<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} name="website" /></label>
      <div className={styles.formFooter}><p>Keep it about your visit. Please leave out private information. You can edit or remove your review from this browser.</p><button type="submit" className={styles.primary} disabled={busy || !page || hidden}>{saving ? "Publishing…" : ownId ? "Save changes" : "Post review"}</button></div>
      {ownId && <div className={styles.cardActions}><button type="button" className={`${styles.textButton} ${styles.danger}`} onClick={() => setConfirmRemove(true)} disabled={busy}>Remove my review</button>{confirmRemove && <><button type="button" className={styles.secondary} onClick={() => void remove()} disabled={saving}>Confirm removal</button><button type="button" className={styles.textButton} onClick={() => setConfirmRemove(false)}>Keep review</button></>}</div>}
    </form>}
    <div className={styles.toolbar}><h3>Visitor reviews</h3><label className={styles.sort}>Sort by<select value={sort} onChange={(event) => setSort(event.target.value as ReviewSort)} disabled={saving}><option value="newest">Most recent</option><option value="highest">Highest rated</option><option value="lowest">Lowest rated</option></select></label></div>
    <div aria-busy={loading}>
      {list.length ? <div className={styles.cards}>{list.map(reviewCard)}</div> : <div className={styles.empty}><span className={styles.emptyIcon} aria-hidden="true">☆</span><strong>{loading ? "Loading visitor reviews…" : error && (!page || loadedSort !== sort) ? "Reviews are taking a moment" : "Be the first to share your experience"}</strong><p>{loading ? "Fetching the latest campus feedback." : error && (!page || loadedSort !== sort) ? "Try again in a moment to read and post reviews." : "Your discoveries can help the next visitor find their way."}</p></div>}
    </div>
    {loadedSort === sort && page?.nextOffset !== null && page?.nextOffset !== undefined && <div className={styles.loadMore}><button className={styles.secondary} onClick={() => void load(page.nextOffset!)} disabled={busy}>{loading ? "Loading…" : "More reviews"}</button></div>}
  </section>;
}
