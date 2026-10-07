import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "@/components/logo";
import { SiteNavigation } from "@/components/site-navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand" aria-label={`${site.company.name} home`}>
          <Logo tone="ink" />
        </Link>
        <SiteNavigation items={site.navigation} />
      </div>
    </header>
  );
}
