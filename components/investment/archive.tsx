import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { investmentArchive } from "@/content/site";
import { VisibilityBoundary } from "./visibility-boundary";
import { sourceUrl, archiveRead } from "@/lib/investment-archive";
import type { RecordRef, Source, Mode } from "@/receiver/vendor/investment/v1/types";
import { artifactHref, recordHref, actorName, inRun } from "@/lib/investment-links";
export { artifactHref, recordHref };
export const author = actorName;
export async function ArchiveShell({ title, children, mode, run, witness, staticContent=false }: {
    title: string;
    children: ReactNode;
    mode?: Mode;
    run?: string;
    witness?: string;
    staticContent?: boolean;
}) {
    const status=staticContent?{data:null,fingerprint:undefined}:await archiveRead<import("@/receiver/vendor/investment/v1/types").PublicStatus>("status",run);
    const verified=!witness || status.data&&status.fingerprint===witness;
    return <div className="site"><SiteHeader />{(mode === 'synthetic_fixture' || process.env.ASYMMETRI_INVESTMENT_EVIDENCE_MODE === 'synthetic_fixture') && <div className="inv-synthetic" role="note"><span className="shell">{investmentArchive.synthetic}</span></div>}<main id="main-content" tabIndex={-1} className="archive shell"><nav aria-label="Archive navigation"><a href="/botsquad">BotSquad</a><a href={run?"/botsquad/investment/runs/"+run:"/botsquad/investment"}>Investment showcase</a><a href={inRun("/botsquad/investment/methodology",run)}>Methodology</a></nav><p className="eyebrow">BotSquad / Investment</p><VisibilityBoundary revision={status.data?status.fingerprint:undefined} run={run} enabled={!staticContent&&!!process.env.ASYMMETRI_INVESTMENT_READ_ORIGIN}><h1>{verified?title:"Archive visibility changed"}</h1>{(mode === 'synthetic_fixture' || process.env.ASYMMETRI_INVESTMENT_EVIDENCE_MODE === 'synthetic_fixture') && <p className="archive-notice" role="note">{investmentArchive.synthetic}</p>}{verified?children:<p role="status">Records changed during this read. Refresh to verify current content.</p>}</VisibilityBoundary><aside className="archive-notice">{investmentArchive.notice} Visitor questions are not enabled.</aside></main><SiteFooter /></div>;
}
export function Links({ refs, run }: {
    refs: RecordRef[];
    run?: string;
}) { return refs.length ? <ul>{refs.map((ref, i) => <li key={i}><a href={recordHref(ref,run)}>{ref.relation.replaceAll('_', ' ')} · {ref.kind} {ref.id} · version {ref.version}</a></li>)}</ul> : <p>No related public records.</p>; }
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
