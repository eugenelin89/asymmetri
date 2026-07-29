import Link from "next/link";
import { site } from "@/content/site";

export function ClosingCta() {
  return (
    <section className="closing-cta">
      <div className="shell closing-cta__grid">
        <p className="eyebrow eyebrow--light">A fairer opportunity to improve</p>
        <div>
          <h2>{site.closing.headline}</h2>
          <p>{site.closing.body}</p>
          <Link className="button button--clay" href="/contact">
            Start a conversation <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
