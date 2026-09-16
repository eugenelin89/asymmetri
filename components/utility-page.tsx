import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site, type UtilityPageContent } from "@/content/site";

export function UtilityPage({ page }: { page: UtilityPageContent }) {
  return (
    <div className="site">
      <SiteHeader />
      <main id="main-content" className="utility-page" tabIndex={-1}>
        <article className="utility-page__body">
          <header className="utility-page__header">
            <h1>{page.title}</h1>
            {page.effectiveDate && (
              <p className="utility-page__date">
                Effective date: {" "}
                <time dateTime={page.effectiveDate.value}>
                  {page.effectiveDate.label}
                </time>
              </p>
            )}
            {page.introduction.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              {page.contactLabel}: {" "}
              <a href={`mailto:${site.company.contactEmail}`}>
                {site.company.contactEmail}
              </a>
            </p>
            <p><a href={page.related.href}>{page.related.label}</a></p>
          </header>
          <nav className="utility-page__contents" aria-label="On this page">
            <p>On this page</p>
            <ul>
              {page.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.heading}</a>
                </li>
              ))}
            </ul>
          </nav>
          {page.sections.map((section) => {
            const List = section.ordered ? "ol" : "ul";
            return (
              <section key={section.id} aria-labelledby={section.id}>
                <h2 id={section.id}>{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items && (
                  <List>
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </List>
                )}
                {section.closing?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.link && (
                  <p><a href={section.link.href}>{section.link.label}</a></p>
                )}
              </section>
            );
          })}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
