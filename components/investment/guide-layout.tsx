import Image from 'next/image';
import type { ReactNode } from 'react';
import { BotSquadNavigation } from '@/components/botsquad-navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { tradeGuide, type SiteImage } from '@/content/site';

export type GuideContents = readonly { id: string; title: string }[];
export type GuideImage = SiteImage & {
  caption: string;
  source: string;
  capturedAt: string;
};

function ContentsLinks({ contents }: { contents: GuideContents }) {
  return <ol>{contents.map(({ id, title }) => <li key={id}><a href={'#' + id}>{title}</a></li>)}</ol>;
}

export function TradeGuideLayout({ contents, children }: { contents: GuideContents; children: ReactNode }) {
  return (
    <div className="site trade-guide">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <div className="shell"><BotSquadNavigation current="investment" detail={tradeGuide.navLabel} /></div>
        <header className="guide-hero shell" id="guide-top">
          <p className="eyebrow">{tradeGuide.eyebrow}</p>
          <h1>{tradeGuide.title}</h1>
          <p className="guide-introduction">{tradeGuide.introduction}</p>
          <p className="guide-date">Evidence reviewed <time dateTime={tradeGuide.date}>{tradeGuide.dateLabel}</time></p>
          <nav className="guide-related" aria-label="Trade resources">
            <a href="/botsquad/investment">Open the trading desk →</a>
            <a href="/botsquad/investment/methodology">Methodology &amp; limitations →</a>
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
            <article className="guide-article" aria-label={tradeGuide.title}>
              {children}
              <nav className="guide-end" aria-label="Continue exploring">
                <a href="#guide-top">Back to the top ↑</a>
                <a href="/botsquad/investment">Return to the trading desk →</a>
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
  return (
    <figure className="guide-figure">
      <a className="guide-image-link" href={figure.src} style={{ maxWidth: Math.min(figure.width, 512) }} aria-label={'Open full-size screenshot: ' + figure.alt}>
        <Image src={figure.src} width={figure.width} height={figure.height} alt={figure.alt} sizes="(max-width: 600px) 90vw, 512px" />
      </a>
      <figcaption><p>{figure.caption}</p><p className="guide-image-source"><a href={figure.source}>View the public page</a> · Captured <time dateTime={figure.capturedAt}>{tradeGuide.dateLabel}</time> · <a href={figure.src}>Full-size screenshot</a></p></figcaption>
    </figure>
  );
}

export function GuideTable({ caption, headings, rows }: { caption: string; headings: readonly string[]; rows: readonly (readonly ReactNode[])[] }) {
  return <div className="guide-table-group"><p className="guide-table-hint">Scroll sideways for more columns.</p><div className={'guide-table' + (headings.length >= 4 ? ' guide-table-wide' : '')} tabIndex={0} role="region" aria-label={caption}><table><caption>{caption}</caption><thead><tr>{headings.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, column) => column === 0 ? <th scope="row" key={column}>{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div></div>;
}

export function GuideFlow({ caption, steps }: { caption: string; steps: readonly { title: string; body: string }[] }) {
  return <figure className="guide-flow"><figcaption>{caption}</figcaption><ol>{steps.map((step, index) => <li key={step.title}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol></figure>;
}
