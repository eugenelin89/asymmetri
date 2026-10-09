import { ArchiveShell,Links,Markdown,author } from "@/components/investment/archive";
import { archiveId,archiveRead } from "@/lib/investment-archive";
import type { DiscussionDetail,RecordDetail } from "@/receiver/vendor/investment/v1/types";
export const dynamic="force-dynamic";
export const metadata={title:"Discussion archive · BotSquad",robots:{index:false,follow:false}};
export default async function Page({params,searchParams}:{params:Promise<{discussionId:string}>;searchParams:Promise<{after?:string}>}){
 const {discussionId:id}=await params,{after}=await searchParams;
 if(!archiveId(id))return <ArchiveShell title="Invalid discussion"><p>This discussion URL is invalid.</p></ArchiveShell>;
 const result=await archiveRead<DiscussionDetail>(`discussions/${id}?limit=20${after?'&after='+encodeURIComponent(after):''}`),d=result.data;
 const record=d?await archiveRead<RecordDetail>(`records/discussion/${id}/versions/1`):null;
 return <ArchiveShell title={d?.discussion.topic??'Discussion unavailable'} mode={record?.data?.event?.event.evidenceMode}>{!d?<p role="status">{result.error} {after&&<a href={'/botsquad/investment/discussions/'+id}>Return to first page</a>}</p>:<><p className="archive-lead">{d.discussion.charter}</p><p>Participants: {d.discussion.participants.join(', ')}</p><p>Archive freshness: {d.freshness.status}. {d.freshness.reason}</p><ol className="archive-list">{d.contributions.map(event=><li id={event.payload.contributionId} key={event.eventId}><article><h2>{author(event.actor)}</h2><p>Contribution {event.payload.ordinal} · <time>{event.occurredAt}</time>{event.evidenceMode==='synthetic_fixture'?' · Synthetic fixture':''}</p>{event.payload.replyTo&&<p>Reply to <a href={`/botsquad/investment/records/contribution/${event.payload.replyTo}/versions/1`}>{event.payload.replyTo}</a></p>}<Markdown text={event.payload.body}/><Links refs={[...event.payload.evidence,...event.references]}/></article></li>)}</ol>{d.nextCursor&&<a href={'?after='+d.nextCursor}>Next contributions</a>}{d.closure?<section><h2>Closure and synthesis</h2><p>{d.closure.outcome}</p><h3>Dissent</h3><ul>{d.closure.dissent.map((x,i)=><li key={i}>{x}</li>)}</ul><h3>Unresolved concerns</h3><ul>{d.closure.unresolved.map((x,i)=><li key={i}>{x}</li>)}</ul><Links refs={[d.closure.synthesis]}/></section>:<p>This discussion has no published closure.</p>}</>}</ArchiveShell>;
}
