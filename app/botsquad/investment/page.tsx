import { ArchiveShell, artifactHref } from "@/components/investment/archive";
import { archiveRead } from "@/lib/investment-archive";
import { investmentArchive } from "@/content/site";
import type { ArtifactPage,DiscussionPage,RecordDetail } from "@/receiver/vendor/investment/v1/types";
export const dynamic="force-dynamic";
export const metadata={title:"Investment evidence archive",robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{after?:string;discussionAfter?:string}>}){
 const {after,discussionAfter}=await searchParams,query=after?'?limit=20&after='+encodeURIComponent(after):'?limit=20';
 const [artifacts,discussions]=await Promise.all([archiveRead<ArtifactPage>('artifacts'+query),archiveRead<DiscussionPage>('discussions?limit=20'+(discussionAfter?'&after='+encodeURIComponent(discussionAfter):''))]);
 const first=artifacts.data?.items[0];const record=first?await archiveRead<RecordDetail>(`records/artifact/${first.registration.artifactId}/versions/0`):null;
 return <ArchiveShell title={investmentArchive.title} mode={record?.data?.event?.event.evidenceMode}><p className="archive-lead">{investmentArchive.description}</p>{!artifacts.data?<p role="status">{artifacts.error==='No published experiment'?investmentArchive.empty:artifacts.error} {after&&<a href="/botsquad/investment">Return to first page</a>}</p>:<><section><h2>Deliverables</h2><ul className="archive-list">{artifacts.data.items.map(a=><li key={a.registration.artifactId}><h3><a href={artifactHref(a.registration.artifactId,a.currentPublishedVersion??1)}>{a.registration.title}</a></h3><p>{a.status.replaceAll('_',' ')}{a.safeReason?' · '+a.safeReason:''}</p></li>)}</ul>{artifacts.data.nextCursor&&<a href={'?after='+artifacts.data.nextCursor}>Next deliverables</a>}</section><section><h2>Discussions</h2>{discussions.error&&<p role="status">{discussions.error} <a href="/botsquad/investment">Return to first page</a></p>}<ul className="archive-list">{discussions.data?.items.map(d=><li key={d.discussionId}><h3><a href={'/botsquad/investment/discussions/'+d.discussionId}>{d.topic}</a></h3><p>{d.charter}</p></li>)}</ul>{discussions.data?.nextCursor&&<a href={'?discussionAfter='+encodeURIComponent(discussions.data.nextCursor)}>Next discussions</a>}</section></>}</ArchiveShell>;
}
