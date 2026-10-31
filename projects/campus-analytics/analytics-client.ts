/** Browser-side scheduling only. The server measures bounded elapsed intervals;
 * no input content, coordinates, names or client-claimed duration is transmitted. */
export type AnalyticsCampus = "ubc" | "cwru" | "stanford";
export type PlayEvent = "start" | "heartbeat" | "pause" | "end";
export type PlayPayload = { sessionId: string; event: PlayEvent; seq: number };
export const playIdleMs = 90_000;
export const playHeartbeatMs = 15_000;
export const analyticsPreferenceKey = "asymmetri-campus-play-privacy-v1";
export type PlayPrivacy = "on" | "off" | "browser" | "pending" | "unsupported";

export function playPrivacy(signals: { globalPrivacyControl?: boolean; doNotTrack?: string | null; msDoNotTrack?: string | null }, saved: string | null): Exclude<PlayPrivacy, "pending"> {
  if (signals.globalPrivacyControl === true || signals.doNotTrack === "1" || signals.doNotTrack === "yes" || signals.msDoNotTrack === "1") return "browser";
  return saved === "off" ? "off" : "on";
}

export function createActivityGate() {
  let state = { playing: false, visible: false, inView: false, allowed: false };
  let lastActivity = -Infinity;
  return {
    configure(next: Partial<typeof state>) {
      state = { ...state, ...next };
      if (!state.playing || !state.visible || !state.inView || !state.allowed) lastActivity = -Infinity;
    },
    activity(now: number) {
      if (state.playing && state.visible && state.inView && state.allowed && Number.isFinite(now)) lastActivity = now;
    },
    active(now: number) {
      return state.playing && state.visible && state.inView && state.allowed && now >= lastActivity && now - lastActivity < playIdleMs;
    },
  };
}

type TransportOptions = {
  sessionId: string;
  now: () => number;
  request: (payload: PlayPayload, stillCurrent: () => boolean) => Promise<{ ok: boolean; status: number; cancelled?: boolean }>;
  beacon?: (payload: PlayPayload) => boolean;
};
export type PlayTransport = {
  setActive: (active: boolean) => void;
  tick: () => void;
  end: () => void;
  stop: () => Promise<void>;
  settled: () => Promise<void>;
};

/** One in-flight request plus one desired state, never an unbounded event queue.
 * Starts complete before heartbeats or beacons. Transient retries reuse their
 * sequence number; permission/rate failures stop instead of retrying forever. */
export function createPlayTransport(options: TransportOptions): PlayTransport {
  let desired: "active" | "paused" | "ended" | "stopped" = "paused";
  let acknowledged: "none" | "active" | "paused" | "ended" = "none";
  let sequence = 0, lastAck = -Infinity, retryAfter = 0;
  let pending: Promise<void> | null = null;
  let retry: PlayPayload | null = null;
  let endingWithBeacon = false;
  function failed(payload: PlayPayload) {
    if (desired === "stopped") return;
    if (acknowledged !== "none" && desired === "ended" && payload.event !== "end") {
      retry = null; retryAfter = 0; return;
    }
    if (acknowledged !== "none" && desired === "paused" && (payload.event === "heartbeat" || payload.event === "start")) {
      acknowledged = "active"; retry = null; retryAfter = 0; return;
    }
    if (desired === "active" && payload.event === "pause") {
      acknowledged = "paused"; retry = null; retryAfter = 0; return;
    }
    retry = payload; retryAfter = options.now() + playHeartbeatMs;
  }
  function pump() {
    if (pending || desired === "stopped" || acknowledged === "ended" || options.now() < retryAfter) return;
    if (acknowledged === "none" && desired !== "active") { retry = null; return; }
    let event: PlayEvent | null = null;
    if (retry) event = retry.event;
    else if (acknowledged === "none" || (acknowledged === "paused" && desired === "active")) event = "start";
    else if (desired === "ended") event = "end";
    else if (acknowledged === "active" && desired === "paused") event = "pause";
    else if (acknowledged === "active" && desired === "active" && options.now() - lastAck >= playHeartbeatMs) event = "heartbeat";
    if (!event) return;
    const payload = retry ?? { sessionId: options.sessionId, event, seq: sequence++ };
    if (event === "end" && endingWithBeacon && options.beacon?.(payload)) {
      acknowledged = "ended"; retry = null; return;
    }
    const request = Promise.resolve().then(() => {
      // Avoid a request for a component that unmounted before its first task
      // ran (including React's development effect-lifecycle verification).
      if (desired === "stopped" || (acknowledged === "none" && desired !== "active")) return { ok: false, status: 499, cancelled: false };
      return options.request(payload, () => desired !== "stopped" &&
        (payload.event === "start" || payload.event === "heartbeat" ? desired === "active" : payload.event === "pause" ? desired === "paused" : desired === "ended"));
    }).then((response) => {
      if (desired === "stopped") return;
      if (response.cancelled) failed(payload);
      else if (response.ok) {
        acknowledged = payload.event === "end" ? "ended" : payload.event === "pause" ? "paused" : "active";
        lastAck = options.now(); retry = null; retryAfter = 0;
      } else if (response.status === 403 || response.status === 429 || (response.status >= 400 && response.status < 500)) {
        desired = "stopped"; retry = null;
      } else {
        failed(payload);
      }
    }).catch(() => {
      failed(payload);
    }).finally(() => {
      pending = null;
      // Flush only a state transition after an acknowledgement, not another
      // heartbeat. A pending pagehide end remains a single bounded intent.
      if (desired === "ended" || desired === "paused" || (desired === "active" && acknowledged === "paused")) pump();
    });
    pending = request;
  }
  return {
    setActive(active) {
      if (desired === "ended" || desired === "stopped") return;
      const next = active ? "active" : "paused";
      if (desired !== next && retry && acknowledged !== "none") {
        // A failed old heartbeat must not be retried after hiding/going idle.
        // A failed pause may already have reached the server, so resume with
        // an explicit start instead of assuming it is still active there.
        if (active && retry.event === "pause") acknowledged = "paused";
        retry = null; retryAfter = 0;
      }
      desired = next; pump();
    },
    tick: pump,
    end() {
      if (desired === "stopped") return;
      desired = "ended"; endingWithBeacon = true;
      if (acknowledged !== "none") { retry = null; retryAfter = 0; }
      pump();
    },
    stop() { desired = "stopped"; retry = null; return pending ?? Promise.resolve(); },
    settled() { return pending ?? Promise.resolve(); },
  };
}

const sessions = new Set<PlayTransport>();
let storageChecked = false, storageFailure = false;
const privacyEvent = "campus-play-privacy-change";
export function currentPlayPrivacy(verifyStorageWrite = false): PlayPrivacy {
  if (typeof window === "undefined") return "pending";
  const browser = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const signals = { globalPrivacyControl: browser.globalPrivacyControl, msDoNotTrack: browser.msDoNotTrack, doNotTrack: browser.doNotTrack || (window as Window & { doNotTrack?: string }).doNotTrack };
  if (playPrivacy(signals, null) === "browser") return "browser";
  if (storageFailure) return "unsupported";
  if (typeof globalThis.crypto?.randomUUID !== "function") return "unsupported";
  let stored: string | null;
  try {
    // Always read the shared value, including inside the request lock. A stale
    // tab-local 'on' must not override another tab's opt-out before its event.
    stored = window.localStorage.getItem(analyticsPreferenceKey);
    if (!storageChecked || verifyStorageWrite) {
      // A unique transient key avoids cross-tab set/remove races. Its random
      // suffix is immediately removed and is never sent or used as identity.
      const probe = `${analyticsPreferenceKey}-storage-check-${crypto.randomUUID()}`;
      try {
        window.localStorage.setItem(probe, "ok");
        if (window.localStorage.getItem(probe) !== "ok") throw new Error("Storage unavailable");
      } finally { window.localStorage.removeItem(probe); }
      storageChecked = true;
    }
  } catch { storageFailure = true; return "unsupported"; }
  if (playPrivacy(signals, stored) === "off") return "off";
  return typeof navigator.locks?.request === "function" ? "on" : "unsupported";
}
export const serverPlayPrivacy = (): PlayPrivacy => "pending";
export function subscribePlayPrivacy(listener: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === analyticsPreferenceKey || event.key === null) listener(); };
  window.addEventListener(privacyEvent, listener);
  window.addEventListener("storage", storage);
  window.addEventListener("focus", listener);
  return () => {
    window.removeEventListener(privacyEvent, listener);
    window.removeEventListener("storage", storage);
    window.removeEventListener("focus", listener);
  };
}
export function setPlayRecording(enabled: boolean) {
  try { window.localStorage.setItem(analyticsPreferenceKey, enabled ? "on" : "off"); storageFailure = false; }
  catch { storageFailure = true; }
  if (!enabled) for (const session of sessions) void session.stop();
  window.dispatchEvent(new Event(privacyEvent));
}
export async function withPlayPrivacyLock<T>(operation: () => Promise<T>, allowUnsupported = false, waitMs = 8000): Promise<T> {
  if (typeof navigator.locks?.request === "function") {
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), waitMs);
    try {
      return await navigator.locks.request("campus-analytics-ownership", { mode: "exclusive", signal: controller.signal }, async () => {
        clearTimeout(timeout);
        return operation();
      });
    } finally { clearTimeout(timeout); }
  }
  if (allowUnsupported) return operation(); // Explicit deletion remains available when collection is unsupported.
  throw new Error("Safe play-record coordination is unavailable.");
}

export async function cookieConfirmedRequest(payload: PlayPayload, request: (payload: PlayPayload) => Promise<{ ok: boolean; status: number; cancelled?: boolean; body: { accepted?: boolean; initialized?: boolean } | null }>) {
  let response = await request(payload);
  if (response.ok && response.body?.initialized === true && payload.event === "start") response = await request(payload);
  if (response.cancelled) return { ok: false, status: 0, cancelled: true };
  if (response.ok && response.body?.accepted !== true) return { ok: false, status: response.body?.initialized ? 403 : 503 };
  return { ok: response.ok, status: response.status };
}

export async function postPlayEvent(endpoint: string, payload: PlayPayload, stillCurrent = () => true) {
  if (currentPlayPrivacy() !== "on") return { ok: false, status: 403 };
  return withPlayPrivacyLock(async () => {
    if (currentPlayPrivacy(true) !== "on") return { ok: false, status: 403 };
    if (!stillCurrent()) return { ok: false, status: 0, cancelled: true };
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 8000);
    try {
      return await cookieConfirmedRequest(payload, async (body) => {
        if (currentPlayPrivacy(true) !== "on") return { ok: false, status: 403, body: null };
        if (!stillCurrent()) return { ok: false, status: 0, cancelled: true, body: null };
        const response = await fetch(endpoint, { method: "POST", credentials: "same-origin", cache: "no-store", keepalive: true,
          headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: controller.signal });
        const value = await response.json().catch(() => null) as { accepted?: boolean; initialized?: boolean } | null;
        return { ok: response.ok, status: response.status, body: value };
      });
    } finally { clearTimeout(timeout); }
  });
}
export function registerPlayTransport(transport: PlayTransport) {
  sessions.add(transport);
  return () => { sessions.delete(transport); };
}
export async function stopPlayRequests() {
  // Let a pending start's Set-Cookie settle before an explicit DELETE expires
  // it. Lock acquisition and postPlayEvent fetches each have bounded timeouts.
  await Promise.allSettled([...sessions].map((session) => session.stop()));
}
