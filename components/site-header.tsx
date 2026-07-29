import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "@/components/logo";

export function SiteHeader({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <header className={`site-header ${dark ? "site-header--dark" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand">
          <Logo tone={dark ? "canvas" : "ink"} />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {site.navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            {site.navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
