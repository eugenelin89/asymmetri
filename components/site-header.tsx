import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="Asymmetri Labs home">
          <Logo tone="canvas" />
        </Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          {site.navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
