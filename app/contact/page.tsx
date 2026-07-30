import { PageIntro } from "@/components/page-intro";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata, site } from "@/content/site";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(pageMetadata.contact, "/contact");

export default function ContactPage() {
  return (
    <div className="site">
      <PageIntro
        eyebrow="Contact"
        title="Let’s make better tools more accessible."
        summary="We welcome conversations with athletes, coaches, parents, sports organizations, researchers, and technical collaborators."
      />
      <main id="main-content">
        <section className="section contact">
          <div className="shell contact__grid">
            <div>
              <p className="eyebrow">Start a conversation</p>
              <h2>Tell us what you are trying to make possible.</h2>
            </div>
            <div>
              <p className="lede">
                If you care about athlete development, coaching, accessible
                measurement, or the future of sports technology, we would like
                to hear from you.
              </p>
              <a
                className="contact__email"
                href={`mailto:${site.company.contactEmail}`}
              >
                {site.company.contactEmail}
                <span aria-hidden="true">↗</span>
              </a>
              <p className="contact__note">
                Email opens in your own mail application. This site does not
                collect form submissions or track visitors.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
