import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <Logo tone="canvas" />
          <p className="site-footer__thesis">
            Accessible sports technology for an uneven playing field.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="site-footer__nav">
          {site.navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="site-footer__meta">
          <a href={`mailto:${site.company.contactEmail}`}>
            {site.company.contactEmail}
          </a>
          <span>© {new Date().getFullYear()} Asymmetrico</span>
        </div>
      </div>
    </footer>
  );
}
