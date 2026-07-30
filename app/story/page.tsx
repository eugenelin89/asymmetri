import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata, site } from "@/content/site";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(pageMetadata.story, "/story");

export default function StoryPage() {
  return (
    <div className="site">
      <PageIntro
        eyebrow="Our story"
        title={site.story.introTitle}
        summary={site.story.introSummary}
      />
      <main id="main-content">
        <section className="section">
          <div className="shell story-pair">
            <div>
              <p className="eyebrow">Where it began</p>
              <h2>A simple experiment, repeated carefully.</h2>
            </div>
            <div>
              <p className="lede">
                After my son experienced a pitching injury, I began paying
                closer attention to his mechanics. The first experiment was
                simple: record his deliveries in slow motion with a smartphone,
                compare the videos frame by frame, and look for differences in
                movement and timing.
              </p>
              <p className="lede">
                We identified possible areas for improvement, made a small
                adjustment, recorded again, and compared the results. Later, we
                experimented with affordable wearable sensors to capture
                evidence that video alone could not show as clearly.
              </p>
              <p className="lede">
                By combining video and sensor evidence with coaching, training,
                repeated experimentation, and measurement, we improved his
                mechanics and helped him repeatedly reach new personal bests in
                pitching velocity. No tool did that work alone; evidence helped
                us guide adjustments and understand whether they were working.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--soft">
          <div className="shell origin">
            <figure className="origin__figure">
              <Image
                src={site.images.workbench.src}
                alt={site.images.workbench.alt}
                fill
                sizes="(max-width: 760px) 100vw, 42vw"
              />
              <figcaption>
                Physical experiments and hands-on engineering remain part of how
                we test ideas against the real world.
              </figcaption>
            </figure>
            <div>
              <p className="eyebrow">The question</p>
              <h2>Useful evidence should not be this difficult to obtain.</h2>
              <p className="lede">
                The process worked, but it demanded hours of manual review,
                technical knowledge, and careful interpretation. It revealed
                both how useful objective evidence can be and how inaccessible
                the process remains.
              </p>
              <p className="lede">
                Could AI use the cameras and sensors already available in
                everyday devices to make this kind of analysis faster, clearer,
                and more accessible to athletes, coaches, and parents—while
                keeping coaches at the centre of development? That is the
                question behind Asymmetri Labs.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell story-pair">
            <div>
              <p className="eyebrow">What the experience taught me</p>
              <h2>Evidence supports judgment. It does not replace it.</h2>
            </div>
            <div>
              <p className="lede">
                Cameras and sensors capture evidence. AI can help identify
                patterns, recognize strengths, compare performance over time,
                and highlight areas that deserve attention. Coaches provide the
                judgment, context, experience, and human understanding needed to
                decide what those patterns mean and what an athlete should do
                next.
              </p>
              <p className="lede">
                Athletes gain clearer insight into what they are working on and
                why. Parents gain more objective context about progress and
                priorities so they can support development appropriately—not
                replace or override a coach. AI can help identify patterns.
                Coaches provide the judgment that turns evidence into progress.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--soft">
          <div className="shell lessons">
            <p className="eyebrow">What we have learned so far</p>
            <ul>
              {site.story.lessons.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--ink">
          <div className="shell split">
            <p className="eyebrow eyebrow--light">
              What we are building toward
            </p>
            <div>
              <h2>Start with baseball. Learn in the open questions.</h2>
              <p className="lede lede--light">
                We are building, testing, and learning how devices people
                already own can capture movement and how AI can surface
                meaningful patterns while coaches remain at the centre of
                development. The roadmap is not settled, and not every
                experiment will become a product.
              </p>
              <p className="lede lede--light">
                Baseball is our first proving ground, not our permanent
                boundary. The broader possibility is clearer, better-informed
                development across sport.
              </p>
              <Link className="button button--clay" href="/contact">
                Start a conversation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
