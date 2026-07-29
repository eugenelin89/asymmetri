import Image from "next/image";
import Link from "next/link";
import { ClosingCta } from "@/components/editorial/closing-cta";
import { PlatformVisual } from "@/components/editorial/platform-visual";
import { PageIntro } from "@/components/page-intro";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata, site } from "@/content/site";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(pageMetadata.work, "/work");

export default function WorkPage() {
  return (
    <div className="site">
      <PageIntro
        eyebrow="Work"
        title="Systems for seeing development more clearly."
        summary="One deployed platform. A focused set of emerging research directions. No imaginary product catalogue."
      />
      <main id="main-content">
        <section className="chapter chapter--soft work-feature">
          <div className="shell">
            <div className="work-feature__heading">
              <div>
                <p className="eyebrow">{site.platform.status}</p>
                <h2>{site.platform.name}</h2>
              </div>
              <div>
                <p className="lede">{site.platform.descriptor}</p>
                <Link className="button button--ink" href="/work/asymmetrico-platform">
                  Read the case study <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
            <PlatformVisual compact />
            <div className="capability-list">
              {site.platform.verifiedCapabilities.map((capability, index) => (
                <div key={capability}>
                  <span>0{index + 1}</span>
                  <p>{capability}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter chapter--canvas">
          <div className="shell">
            <div className="chapter-heading chapter-heading--split">
              <div>
                <p className="eyebrow">Emerging work + research</p>
                <h2>The same accessibility thesis, moving into measurement.</h2>
              </div>
              <p className="lede">
                These are verified technical foundations and future directions—not
                mature commercial products.
              </p>
            </div>
            <div className="emerging-grid">
              <article>
                <figure>
                  <Image
                    src="/images/research/wearable-sensor-prototype.webp"
                    alt="A baseball player tests affordable motion sensors during a prototype session."
                    fill
                    sizes="(max-width: 760px) 100vw, 32vw"
                  />
                </figure>
                <p className="eyebrow">Research foundation</p>
                <h3>Pitching biomechanics</h3>
                <p>
                  Low-cost inertial sensing, wireless throw data, and sequence
                  modelling used to study pitching motion.
                </p>
              </article>
              <article>
                <figure>
                  <Image
                    src="/images/research/motion-signal-plot.webp"
                    alt="Acceleration and angular-velocity signals captured during a pitching motion."
                    fill
                    sizes="(max-width: 760px) 100vw, 32vw"
                  />
                </figure>
                <p className="eyebrow">Research artifact</p>
                <h3>Movement signals</h3>
                <p>
                  Exploring how raw movement traces can become understandable without
                  overstating what the measurement proves.
                </p>
              </article>
              <article>
                <figure>
                  <Image
                    src="/images/research/systems-workbench.webp"
                    alt="A workbench with small tracked robots, electronics, and prototyping tools."
                    fill
                    sizes="(max-width: 760px) 100vw, 32vw"
                  />
                </figure>
                <p className="eyebrow">Engineering DNA</p>
                <h3>Physical-system prototyping</h3>
                <p>
                  Experience moving systems from simulation into noisy, constrained
                  hardware informs how Asymmetrico designs for the real world.
                </p>
              </article>
            </div>
          </div>
        </section>
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
