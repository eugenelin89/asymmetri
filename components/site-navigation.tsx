"use client";

import { useEffect, useRef } from "react";
import type { PrimaryNavItem } from "@/content/site";

export function SiteNavigation({ items }: { items: readonly PrimaryNavItem[] }) {
  const navigation = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (event: PointerEvent | KeyboardEvent) => {
      const nav = navigation.current;
      if (!nav) return;
      const escape = event instanceof KeyboardEvent && event.key === "Escape";
      const outside = event instanceof PointerEvent && !nav.contains(event.target as Node);
      if (!escape && !outside) return;

      nav.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((menu) => {
        if (escape && menu.contains(document.activeElement)) {
          menu.querySelector("summary")?.focus();
        }
        menu.open = false;
      });
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <nav className="primary-nav" aria-label="Primary navigation" ref={navigation}>
      {items.map((item) => item.children ? (
        <details className="nav-domain" name="site-domains" key={item.href}>
          <summary>{item.label}<span aria-hidden="true">⌄</span></summary>
          <div className="nav-domain__links">
            {item.children.map((child) => (
              <a href={child.href} key={child.href}>{child.label}</a>
            ))}
          </div>
        </details>
      ) : (
        <a key={item.href} href={item.href}>{item.label}</a>
      ))}
    </nav>
  );
}
