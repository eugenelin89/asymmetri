"use client";

import { useEffect } from "react";

/** Only the three moved Sport fragments need browser-side route compatibility. */
export function LegacyHomeFragments() {
  useEffect(() => {
    const migrate = () => {
      if (
        window.location.pathname === "/" &&
        ["#story", "#approach", "#product"].includes(window.location.hash)
      ) {
        window.location.replace(`/sport${window.location.hash}`);
      }
    };
    migrate();
    window.addEventListener("hashchange", migrate);
    return () => window.removeEventListener("hashchange", migrate);
  }, []);
  return null;
}
