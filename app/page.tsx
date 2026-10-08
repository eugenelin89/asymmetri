import { HomeCapability } from "@/components/home-capability";
import { LegacyHomeFragments } from "@/components/legacy-home-fragments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { home } from "@/content/site";

import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(home.metadata, "/", "/images/home-social.png");

export default function HomePage() {
  return (
    <div className="site home-page">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <LegacyHomeFragments />
        <section className="home-hero">
          <div className="shell home-hero__grid">
            <div className="home-hero__copy">
              <p className="eyebrow eyebrow--light">{home.hero.eyebrow}</p>
              <h1>{home.hero.headline}</h1>
              <p className="hero__support">{home.hero.support}</p>
              <div className="button-row">
                <a
                  className="text-link text-link--light"
                  href={home.hero.about.href}
                >
                  {home.hero.about.label} <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <HomeCapability />
          </div>
        </section>
        <noscript>
          <nav className="shell legacy-links" aria-label="Moved Sports sections">
            <span id="story">
              <a href="/sports#story">Sports story</a>
            </span>
            <span id="approach">
              <a href="/sports#approach">Sports approach</a>
            </span>
            <span id="product">
              <a href="/sports#product">Sports product</a>
            </span>
          </nav>
        </noscript>
      </main>
      <SiteFooter contactId="contact" />
    </div>
  );
}
