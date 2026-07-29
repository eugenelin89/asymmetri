import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

export function PageIntro({
  eyebrow,
  title,
  summary,
  children,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  children?: ReactNode;
}) {
  return (
    <>
      <SiteHeader tone="dark" />
      <section className="page-intro">
        <div className="shell page-intro__grid">
          <div>
            <p className="eyebrow eyebrow--light">{eyebrow}</p>
            <h1>{title}</h1>
          </div>
          <div className="page-intro__aside">
            <p className="lede lede--light">{summary}</p>
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
