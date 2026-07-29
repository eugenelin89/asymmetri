import { PageIntro } from "@/components/page-intro";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata, site } from "@/content/site";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(pageMetadata.contact, "/contact");

const reasons = [
  "Community sports + athlete-development organizations",
  "Coaches + program directors",
  "Sports-science + research collaborators",
  "Technical + product collaborators",
];

export default function ContactPage() {
  return (
    <div className="site">
      <PageIntro
        eyebrow="Contact"
        title="Let’s make better tools more accessible."
        summary="If you are working on athlete development with real constraints—or researching a better way to measure, preserve, or understand progress—we should talk."
      />
      <main id="main-content">
        <section className="contact-body">
          <div className="shell contact-body__grid">
            <div>
              <p className="eyebrow">Start a conversation</p>
              <a className="contact-email" href={`mailto:${site.company.contactEmail}`}>
                {site.company.contactEmail}
                <span aria-hidden="true">↗</span>
              </a>
              <p className="lede">
                A direct email is the simplest contact experience. No account, no
                unnecessary form, no personal details collected by this site.
              </p>
            </div>
            <div className="contact-reasons">
              <p className="eyebrow">Especially interested in</p>
              {reasons.map((reason, index) => (
                <div key={reason}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{reason}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
