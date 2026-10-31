"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { currentPlayPrivacy, serverPlayPrivacy, setPlayRecording, stopPlayRequests, subscribePlayPrivacy, withPlayPrivacyLock } from "./analytics-client";
import styles from "./privacy.module.css";

export function CampusPrivacyPreferences({ compact = false, privacyHref = "/labs/campus-privacy" }: { compact?: boolean; privacyHref?: string }) {
  const id = useId();
  const preference = useSyncExternalStore(subscribePlayPrivacy, currentPlayPrivacy, serverPlayPrivacy);
  const [deleting, setDeleting] = useState(false), [message, setMessage] = useState("");
  async function erase() {
    if (deleting) return;
    setDeleting(true); setMessage(""); setPlayRecording(false);
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      await stopPlayRequests();
      const response = await withPlayPrivacyLock(() => {
        timeout = setTimeout(() => controller.abort(), 8000);
        return fetch("/labs/campus-analytics-api/ubc", {
          method: "DELETE", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scope: "all" }),
          signal: controller.signal,
        });
      }, true);
      if (!response.ok) throw new Error("Your deletion request could not be completed. Recording is off; please try again.");
      setMessage("This browser’s play records were deleted for all campuses at this website address. Recording is off.");
    } catch { setMessage("Your deletion request could not be completed. Recording is off; please try again."); }
    finally { if (timeout) clearTimeout(timeout); setDeleting(false); }
  }
  return <aside className={`${styles.notice} ${compact ? styles.compact : ""}`} aria-label="Campus play privacy">
    <div className={styles.copy}>
      <strong>Play privacy</strong>
      <p id={`${id}-notice`}>During active play, we privately record your IP address, a random browser identifier, basic browser information and play time. These records are separate from public profiles and reviews.</p>
    </div>
    <div className={styles.controls}>
      <label className={styles.choice}>
        <input type="checkbox" checked={preference === "on"} disabled={preference === "pending" || preference === "browser" || preference === "unsupported" || deleting} aria-describedby={`${id}-notice ${id}-status`} onChange={(event) => { setPlayRecording(event.target.checked); setMessage(""); }} />
        <span>Record my active play</span>
      </label>
      <small id={`${id}-status`}>{preference === "browser" ? "Off — your browser’s privacy signal is respected." : preference === "off" ? "Off for all campuses at this website address." : preference === "unsupported" ? "Off — safe shared browser storage is unavailable." : preference === "pending" ? "Checking this browser’s preference…" : "You can turn this off at any time."}</small>
      <div className={styles.links}>
        <a href={privacyHref} target="_blank" rel="noopener noreferrer">Privacy details<span className={styles.visuallyHidden}> (opens in a new tab)</span></a>
        {!compact && <button type="button" disabled={deleting || preference === "pending"} onClick={() => void erase()}>{deleting ? "Deleting…" : "Delete play history & stop recording"}</button>}
      </div>
    </div>
    {message && <p className={styles.status} role="status">{message}</p>}
  </aside>;
}
