import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata, site } from "@/content/site";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(pageMetadata.story, "/story");

export default function StoryPage() {
  return <div className="site"><PageIntro eyebrow="Our story" title="A clearer path should not depend on an elite budget." summary="Asymmetri Labs began with a problem seen in community baseball: ability and effort are everywhere, but useful evidence and continuous development support are not." /><main id="main-content">
    <section className="section"><div className="shell story-pair"><div><p className="eyebrow">Where it became real</p><h2>Baseball made the gap visible.</h2></div><div><p className="lede">Over years of observing athlete development, we saw knowledge scattered across practices, conversations, memories, and seasons. Coaches cared deeply. Athletes worked. Parents wanted to help. But few people had access to the systems that could preserve context and make progress easier to understand.</p><p className="lede">That experience made the mission personal: help athletes and the people around them make better decisions with clearer evidence and accessible technology.</p></div></div></section>
    <section className="section section--soft"><div className="shell origin"><figure><Image src={site.images.workbench.src} alt={site.images.workbench.alt} fill sizes="(max-width: 760px) 100vw, 42vw" /></figure><div><p className="eyebrow">Why now</p><h2>Powerful inputs are becoming ordinary.</h2><p className="lede">Cameras in phones can observe movement. Watches and affordable sensors can capture signals. Software can keep evidence connected. AI can help surface patterns that deserve attention.</p><p className="lede">The technology is promising because it is increasingly available—not because it removes people from the process. Great coaching remains human. Evidence should help coaches ask better questions and help athletes and parents understand the priorities behind the work.</p></div></div></section>
    <section className="section section--ink"><div className="shell split"><p className="eyebrow eyebrow--light">An honest beginning</p><div><h2>We are building, testing, and learning.</h2><p className="lede lede--light">The roadmap is not settled. We are exploring athlete-development software, accessible sensing, video, data, and evidence-based methods. Some ideas will become products. Others will teach us what to build next.</p><p className="lede lede--light">Baseball is the first place we are learning. The broader possibility is better-informed development across sport.</p><Link className="button button--clay" href="/contact">Follow the story</Link></div></div></section>
  </main><SiteFooter /></div>;
}
