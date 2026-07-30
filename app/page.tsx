import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";

export default function HomePage() {
  return <div className="site">
    <SiteHeader tone="dark" />
    <main id="main-content">
      <section className="hero"><div className="shell hero__grid">
        <div className="hero__copy"><p className="eyebrow eyebrow--light">{site.hero.eyebrow}</p><h1>{site.hero.headline}</h1><p className="hero__support">{site.hero.support}</p>
          <div className="button-row"><Link className="button button--clay" href="/work">See what we’re building</Link><a className="text-link text-link--light" href="#why">Why Asymmetrico</a></div>
        </div>
        <figure className="hero__figure"><Image src={site.images.running.src} alt={site.images.running.alt} fill sizes="(max-width: 760px) 100vw, 52vw" priority /></figure>
      </div></section>

      <section className="section problem"><div className="shell split"><p className="eyebrow">The access gap</p><div><h2>Most athletes do not lack effort. They lack access.</h2><p className="lede">The most sophisticated training tools are often concentrated in professional organizations, private academies, and expensive facilities. Talent is not.</p><p className="lede">Better training should not require a professional budget.</p></div></div></section>

      <section className="section section--soft mission"><div className="shell mission__grid"><div><p className="eyebrow">Our mission</p><h2>{site.mission.headline}</h2><p className="lede">{site.mission.body}</p></div><figure><Image src={site.images.pitcher.src} alt={site.images.pitcher.alt} fill sizes="(max-width: 760px) 100vw, 46vw" /></figure></div></section>

      <section className="section baseball"><div className="shell"><div className="section-heading"><p className="eyebrow">Baseball is where we begin</p><h2>A first proving ground for accessible sports technology.</h2><p className="lede">Baseball inspired the company and gives us a demanding place to build and test: a sport shaped by observation, repetition, measurement, and conversation.</p></div><div className="work-grid">{site.work.map((item) => <article key={item.title}><p className="eyebrow">{item.status}</p><h3>{item.title}</h3><p>{item.body}</p></article>)}</div><Link className="text-link" href="/work">Explore our work</Link></div></section>

      <section className="section section--ink name" id="why"><div className="shell split"><p className="eyebrow eyebrow--light">Why Asymmetrico</p><div><h2>{site.nameStory.headline}</h2><p className="lede lede--light">{site.nameStory.body}</p></div></div></section>

      <section className="section closing"><div className="shell closing__inner"><p className="eyebrow">Get in touch</p><h2>{site.closing.headline}</h2><p className="lede">{site.closing.body}</p><Link className="button button--ink" href="/contact">Start a conversation</Link></div></section>
    </main><SiteFooter />
  </div>;
}
