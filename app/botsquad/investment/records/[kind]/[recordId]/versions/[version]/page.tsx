import { ArchiveShell,Links,author } from "@/components/investment/archive";
import { archiveId,archiveRead } from "@/lib/investment-archive";
import type { RecordDetail } from "@/receiver/vendor/investment/v1/types";
export const dynamic="force-dynamic";
export const metadata={title:"Exact evidence record · BotSquad",robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{kind:string;recordId:string;version:string}>}){
 const {kind,recordId:id,version}=await params;
 const result=archiveId(kind)&&archiveId(id)&&/^\d{1,7}$/.test(version)?await archiveRead<RecordDetail>(`records/${kind}/${id}/versions/${version}`):{data:null,error:'Invalid record identity.'};
 const d=result.data,event=d?.event?.event;
 return <ArchiveShell title={`Evidence record · ${kind}`} mode={event?.evidenceMode}>{event?<><p>{author(event.actor)} · <time>{event.occurredAt}</time> · Exact version {version}</p><pre className="archive-body">{JSON.stringify(event.payload,null,2)}</pre><Links refs={event.references}/></>:<p role="status">{d?.safeReason??result.error}</p>}</ArchiveShell>;
}
