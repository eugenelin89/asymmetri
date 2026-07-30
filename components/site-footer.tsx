import { site } from "@/content/site";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div className="site-footer__brand">
          <Logo tone="canvas" />
          <p>{site.company.descriptor}</p>
        </div>
        <div className="site-footer__meta">
          <a href={`mailto:${site.company.contactEmail}`}>
            {site.company.contactEmail}
          </a>
          <span>
            © {new Date().getFullYear()} {site.company.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
