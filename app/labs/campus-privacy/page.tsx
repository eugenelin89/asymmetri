import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { CampusPrivacyPreferences } from "@/projects/campus-analytics/PlaySession";

export const metadata = pageMetadata({
  title: "Virtual campus privacy | Asymmetri Labs",
  description: "Visit measurement, public reviews and privacy choices for Asymmetri’s virtual campuses.",
}, "/labs/campus-privacy");

export default function CampusPrivacyPage() {
  return <div className="site">
    <SiteHeader />
    <main id="main-content" className="utility-page" tabIndex={-1}>
      <article className="utility-page__body">
        <header className="utility-page__header">
          <h1>Virtual campus privacy</h1>
          <p>These choices apply to the UBC, Case Western Reserve and Stanford virtual experiences operated by Asymmetri Labs. They are independent simulations, not university services.</p>
          <p><a href="/labs/gis">Return to the campuses</a></p>
        </header>
        <CampusPrivacyPreferences />
        <section aria-labelledby="campus-measurement">
          <h2 id="campus-measurement">Visit measurement</h2>
          <p>When you begin exploring, the campus can record a random browser identifier, session identifier, campus, first and last activity times, active play time, your connection’s IP address and the browser’s basic user-agent information. These records are private to the site operator and help us understand visits and improve the experience.</p>
          <p>Measurement pauses when the game is off screen, the tab is hidden or you have not interacted for 90 seconds. Play time is an estimate based on recent activity; concurrent tabs can overlap. We count recorded browsers, not verified people: multiple devices, cleared cookies and visits on both www.asymmetri.co and asymmetri.co can count the same person more than once. An IP address is a network address, not proof of someone’s identity.</p>
          <p>We do not record the text you type, conversations, exact in-game movements, browsing on other websites or a device fingerprint. Usage records are not linked to public character profiles or reviews. There is no third-party analytics script.</p>
        </section>
        <section aria-labelledby="campus-choices">
          <h2 id="campus-choices">Your choices</h2>
          <p>You can turn visit measurement off without affecting exploration. The preference applies to these campuses in this browser on the current website hostname. Global Privacy Control and Do Not Track signals also disable measurement. The control above removes visit records associated with the identifier this browser still holds on this hostname. The www and non-www sites keep separate identifiers and preferences.</p>
          <p>The identifier is a randomly generated, secure, HttpOnly first-party cookie, not a login or your name. Clearing cookies or using another browser means this browser can no longer identify earlier records for removal. Website hosting may maintain separate operational access and security logs; these controls apply to campus visit measurement.</p>
        </section>
        <section aria-labelledby="campus-retention">
          <h2 id="campus-retention">Retention and access</h2>
          <p>IP addresses and browser information expire after 30 days. Pseudonymous browser and session identifiers, timestamps, active-play totals and daily summaries expire after 90 days. Daily cleanup removes expired records; removal can lag by up to one day, or longer during an outage. These records are stored outside the public website and are accessible through private operator tools.</p>
          <p>Production releases and rollbacks preserve the current visit store. Private backups are handled separately from public site artifacts and must follow the same retention and removal requirements.</p>
        </section>
        <section aria-labelledby="campus-reviews">
          <h2 id="campus-reviews">Public reviews and optional characters</h2>
          <p>If you post a review, your chosen display name, rating, comment and review dates are public. A separate random browser cookie lets you edit or remove your review from the same browser. Reports and moderation records are private. Reviews remain published until removed by you or the operator; hidden reviews do not contribute to ratings.</p>
          <p>Public character profiles are optional and use their own publishing and removal controls. They are separate from visit measurement. Avoid putting private contact information in public reviews or character profiles.</p>
        </section>
        <section aria-labelledby="campus-contact">
          <h2 id="campus-contact">Questions or removal requests</h2>
          <p>Contact <a href={`mailto:${site.company.contactEmail}`}>{site.company.contactEmail}</a>. Please describe the campus and approximate visit period or public review. Do not send passwords or private recovery codes.</p>
        </section>
      </article>
    </main>
    <SiteFooter />
  </div>;
}
