"use client";

import { useEffect, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

/** A browser history snapshot may retain the document. End the campus visit
 * before freezing so Back starts at welcome with fresh renderer/audio state. */
export function CampusVisitBoundary({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const depart = () => flushSync(() => setActive(false));
    const returnToPage = () => setActive(true);
    window.addEventListener("pagehide", depart);
    window.addEventListener("pageshow", returnToPage);
    return () => {
      window.removeEventListener("pagehide", depart);
      window.removeEventListener("pageshow", returnToPage);
    };
  }, []);
  return active ? children : null;
}
