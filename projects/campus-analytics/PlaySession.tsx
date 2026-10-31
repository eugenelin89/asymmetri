"use client";

import { useEffect, type RefObject } from "react";
import { createActivityGate, createPlayTransport, currentPlayPrivacy, postPlayEvent, registerPlayTransport, subscribePlayPrivacy, type AnalyticsCampus, type PlayPayload, type PlayTransport } from "./analytics-client";
export { CampusPrivacyPreferences } from "./PrivacyPreferences";

function intersectsViewport(element: HTMLElement) {
  const box = element.getBoundingClientRect();
  return box.width > 0 && box.height > 0 && box.bottom > 0 && box.right > 0 && box.top < window.innerHeight && box.left < window.innerWidth;
}

/** Mount beside the live canvas; regionRef must enclose the game, not the whole
 * page. Input listeners retain a timestamp only, never a key, text or position. */
export function PlaySession({ campus, playing, regionRef }: {
  campus: AnalyticsCampus;
  playing: boolean;
  regionRef: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!playing) return;
    const region = regionRef.current;
    if (!region) return;
    const gate = createActivityGate();
    const endpoint = `/labs/campus-analytics-api/${campus}`;
    let transport: PlayTransport | null = null;
    let unregister: (() => void) | null = null;
    let disposed = false;
    let inView = intersectsViewport(region);
    const now = () => performance.now();
    const stop = () => {
      const old = transport, remove = unregister;
      transport = null; unregister = null;
      if (old) void old.stop().finally(() => remove?.());
    };
    const makeTransport = () => {
      // A session ID is intentionally unrelated to public profiles, reviews,
      // accounts or the server's separate HttpOnly random visitor identifier.
      if (!globalThis.crypto?.randomUUID) return null;
      const value = createPlayTransport({
        sessionId: crypto.randomUUID(), now,
        request: (payload, stillCurrent) => postPlayEvent(endpoint, payload, stillCurrent),
        beacon(payload: PlayPayload) {
          if (currentPlayPrivacy() !== "on" || !navigator.sendBeacon) return false;
          try { return navigator.sendBeacon(endpoint, new Blob([JSON.stringify(payload)], { type: "application/json" })); }
          catch { return false; }
        },
      });
      unregister = registerPlayTransport(value);
      return value;
    };
    const drive = () => {
      if (disposed) return;
      const permitted = currentPlayPrivacy() === "on";
      gate.configure({ allowed: permitted });
      if (!permitted) { stop(); return; }
      const active = gate.active(now());
      if (active && !transport) transport = makeTransport();
      transport?.setActive(active);
      transport?.tick();
    };
    const activity = (event: Event) => {
      if (!event.isTrusted) return;
      // No event.key, event.code, input value, text, coordinates or event log.
      const wasActive = gate.active(now());
      gate.configure({ allowed: currentPlayPrivacy() === "on" });
      gate.activity(now());
      if (!wasActive) drive();
    };
    const visibility = () => { gate.configure({ visible: document.visibilityState === "visible" }); drive(); };
    const viewport = () => { inView = intersectsViewport(region); gate.configure({ inView }); drive(); };
    const pageHide = () => {
      gate.configure({ visible: false });
      if (currentPlayPrivacy() === "on") transport?.end();
      else stop();
    };
    const pageShow = () => {
      // A page restored from bfcache starts a fresh session on the next input.
      stop(); gate.configure({ visible: document.visibilityState === "visible", inView: intersectsViewport(region) });
    };
    gate.configure({ playing: true, allowed: currentPlayPrivacy() === "on", visible: document.visibilityState === "visible", inView });
    gate.activity(now()); // The explicit Start exploring gesture starts activity.
    for (const type of ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "touchmove"]) region.addEventListener(type, activity, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", pageHide);
    window.addEventListener("pageshow", pageShow);
    window.addEventListener("scroll", viewport, { passive: true });
    window.addEventListener("resize", viewport, { passive: true });
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      inView = !!entry?.isIntersecting && entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0;
      gate.configure({ inView }); drive();
    }, { threshold: 0 });
    observer?.observe(region);
    const unsubscribe = subscribePlayPrivacy(drive);
    const interval = setInterval(drive, 1000);
    drive();
    return () => {
      disposed = true;
      clearInterval(interval); observer?.disconnect(); unsubscribe();
      for (const type of ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "touchmove"]) region.removeEventListener(type, activity);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", pageHide);
      window.removeEventListener("pageshow", pageShow);
      window.removeEventListener("scroll", viewport);
      window.removeEventListener("resize", viewport);
      if (currentPlayPrivacy() === "on") transport?.end();
      else stop();
      const old = transport, remove = unregister;
      if (old) void old.settled().finally(() => remove?.());
    };
  }, [campus, playing, regionRef]);
  return null;
}
