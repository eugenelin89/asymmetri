import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { investmentArchive } from "@/content/site";
import { sourceUrl } from "@/lib/investment-archive";
import type { Actor, RecordRef, Source, Mode } from "@/receiver/vendor/investment/v1/types";
export const artifactHref = (id: string, version: number) => `/botsquad/investment/artifacts/${id}/versions/${version}`;
export function recordHref(ref: RecordRef): string {
    if (ref.kind === 'artifact' && ref.version > 0)
        return artifactHref(ref.id, ref.version);
    if (ref.kind === 'discussion')
        return '/botsquad/investment/discussions/' + ref.id;
    return `/botsquad/investment/records/${ref.kind}/${ref.id}/versions/${ref.version}`;
}
export const author = (actor: Actor) => actor.kind === 'worker' ? actor.workerId : actor.kind === 'owner' ? 'Owner contribution' : 'System event';
export function ArchiveShell({ title, children, mode }: {
    title: string;
    children: ReactNode;
    mode?: Mode;
}) {
    return <div className="site"><SiteHeader /><main id="main-content" tabIndex={-1} className="archive shell"><nav aria-label="Archive navigation"><a href="/botsquad">BotSquad</a><a href="/botsquad/investment">Evidence archive</a></nav><p className="eyebrow">BotSquad / Investment</p><h1>{title}</h1>{(mode === 'synthetic_fixture' || process.env.ASYMMETRI_INVESTMENT_EVIDENCE_MODE === 'synthetic_fixture') && <p className="archive-notice" role="note">{investmentArchive.synthetic}</p>}{children}<aside className="archive-notice">{investmentArchive.notice} Visitor questions are not enabled.</aside></main><SiteFooter /></div>;
}
export function Links({ refs }: {
    refs: RecordRef[];
}) { return refs.length ? <ul>{refs.map((ref, i) => <li key={i}><a href={recordHref(ref)}>{ref.relation.replaceAll('_', ' ')} · {ref.kind} {ref.id} · version {ref.version}</a></li>)}</ul> : <p>No related public records.</p>; }
export function Sources({ sources }: {
    sources: Source[];
}) { return <section><h2>Sources and rights</h2>{sources.length ? <ul>{sources.map(s => <li key={s.sourceId}>{sourceUrl(s.url) ? <a href={sourceUrl(s.url)!} rel="noreferrer noopener">{s.title}</a> : s.title}<p>{s.publisher} · {s.rights.replaceAll('_', ' ')} · Retrieved {s.retrievedAt}</p><p>Published: {s.publishedAt ?? 'Unknown'}</p></li>)}</ul> : <p>No external sources supplied.</p>}</section>; }
function inline(text: string): ReactNode[] {
    const parts: ReactNode[] = [];
    let last = 0;
    for (const m of text.matchAll(/\[([^\]\n]+)\]\(([^)\s]+)\)/g)) {
        parts.push(text.slice(last, m.index));
        const href = sourceUrl(m[2]!);
        parts.push(href ? <a key={m.index} href={href} rel="noreferrer noopener">{m[1]}</a> : m[0]);
        last = m.index! + m[0].length;
    }
    parts.push(text.slice(last));
    return parts;
}
/** Deliberately small Markdown subset. All content is React text; no raw HTML/images. */
export function Markdown({ text }: {
    text: string;
}) { return <div className="archive-body">{text.split(/\n\s*\n/).map((p, i) => /^#{1,6} /.test(p) ? <h3 key={i}>{inline(p.replace(/^#{1,6} /, ''))}</h3> : <p key={i}>{inline(p)}</p>)}</div>; }
export function Content({ text, type }: {
    text: string;
    type: string;
}) {
    if (type === 'text/markdown')
        return <Markdown text={text}/>;
    if (type === 'application/json') {
        let formatted: string;
        try {
            formatted = JSON.stringify(JSON.parse(text), null, 2);
        }
        catch {
            formatted = 'Content could not be verified.';
        }
        return <pre className="archive-body">{formatted}</pre>;
    }
    return <pre className="archive-body">{text}</pre>;
}
