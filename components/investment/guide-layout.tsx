import Image from 'next/image';
import type { ReactNode } from 'react';
import { BotSquadNavigation } from '@/components/botsquad-navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { tradeGuide, hqGuide, type SiteImage } from '@/content/site';

export type GuideContents = readonly { id: string; title: string }[];
export type GuideImage = SiteImage & {
  caption: string;
  capturedAt: string;
} & ({ source: string; sourceLabel?: never } | { source?: never; sourceLabel: string });

type GuideCopy = {
  navLabel: string;
  title: string;
  eyebrow: string;
  introduction: string;
  date: string;
  dateLabel: string;
};

function ContentsLinks({ contents }: { contents: GuideContents }) {
  return <ol>{contents.map(({ id, title }) => <li key={id}><a href={'#' + id}>{title}</a></li>)}</ol>;
}

export function TradeGuideLayout({ contents, children, guide = tradeGuide, companion = hqGuide }: { contents: GuideContents; children: ReactNode; guide?: GuideCopy; companion?: { href: string; navLabel: string } }) {
  return (
    <div className="site trade-guide">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <div className="shell"><BotSquadNavigation current="investment" detail={guide.navLabel} /></div>
        <header className="guide-hero shell" id="guide-top">
          <p className="eyebrow">{guide.eyebrow}</p>
          <h1>{guide.title}</h1>
          <p className="guide-introduction">{guide.introduction}</p>
          <p className="guide-date">Evidence reviewed <time dateTime={guide.date}>{guide.dateLabel}</time></p>
          <nav className="guide-related" aria-label="Trade resources">
            <a href={companion.href}>{companion.navLabel} →</a>
            <a href="/botsquad/trade">Open the trading desk →</a>
            <a href="/botsquad/trade/methodology">Methodology &amp; limitations →</a>
          </nav>
        </header>
        <div className="guide-reading">
          <div className="guide-layout shell">
            <aside className="guide-contents">
              <nav className="guide-contents-desktop" aria-label="Guide contents">
                <h2>In this guide</h2>
                <ContentsLinks contents={contents} />
              </nav>
              <details className="guide-contents-mobile">
                <summary>In this guide</summary>
                <nav aria-label="Guide contents"><ContentsLinks contents={contents} /></nav>
              </details>
            </aside>
            <article className="guide-article" aria-label={guide.title}>
              {children}
              <nav className="guide-end" aria-label="Continue exploring">
                <a href="#guide-top">Back to the top ↑</a>
                <a href={companion.href}>{companion.navLabel} →</a>
                <a href="/botsquad/trade">Return to the trading desk →</a>
              </nav>
            </article>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function GuideSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section className="guide-section" id={id} aria-labelledby={id + '-title'}><h2 id={id + '-title'}>{title}</h2>{children}</section>;
}

export function GuideFigure({ figure }: { figure: GuideImage }) {
  const capturedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(figure.capturedAt));
  return (
    <figure className="guide-figure">
      <a className="guide-image-link" href={figure.src} style={{ maxWidth: figure.width }} aria-label={'Open full-size screenshot: ' + figure.alt}>
        <Image src={figure.src} width={figure.width} height={figure.height} alt={figure.alt} sizes="(max-width: 900px) 90vw, 740px" />
      </a>
      <figcaption><p>{figure.caption}</p><p className="guide-image-source">{figure.source ? <a href={figure.source}>View the public page</a> : <span>{figure.sourceLabel}</span>} · Captured <time dateTime={figure.capturedAt}>{capturedDate}</time> · <a href={figure.src}>Full-size screenshot</a></p></figcaption>
    </figure>
  );
}

export function GuideCode({ caption, text, wrap = false }: { caption: string; text: string; wrap?: boolean }) {
  return <figure className="guide-code"><figcaption>{caption}</figcaption>{!wrap && <p className="guide-table-hint">Scroll sideways to read the full block.</p>}<pre className={wrap ? 'guide-code-wrap' : undefined} tabIndex={0} role="region" aria-label={caption}><code>{text}</code></pre></figure>;
}

export function GuideTable({ caption, headings, rows, wide = headings.length >= 4 }: { caption: string; headings: readonly string[]; rows: readonly (readonly ReactNode[])[]; wide?: boolean }) {
  return <div className="guide-table-group"><p className="guide-table-hint">Scroll sideways for more columns.</p><div className={'guide-table' + (wide ? ' guide-table-wide' : '')} tabIndex={0} role="region" aria-label={caption}><table><caption>{caption}</caption><thead><tr>{headings.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, column) => column === 0 ? <th scope="row" key={column}>{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div></div>;
}

export function GuideFlow({ caption, steps }: { caption: string; steps: readonly { title: string; body: string }[] }) {
  return <figure className="guide-flow"><figcaption>{caption}</figcaption><ol>{steps.map((step, index) => <li key={step.title}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol></figure>;
}
