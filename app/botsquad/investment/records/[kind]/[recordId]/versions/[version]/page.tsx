import { ArchiveShell,author } from "@/components/investment/archive";
import { archiveId,archiveRead } from "@/lib/investment-archive";
import {RecordDetail as EvidenceDetail} from "@/components/investment/record-detail";
import type { RecordDetail } from "@/receiver/vendor/investment/v1/types";
export const dynamic="force-dynamic";
export const metadata={title:"Exact evidence record · BotSquad",robots:{index:false,follow:false}};
export default async function Page({params,searchParams}:{params:Promise<{kind:string;recordId:string;version:string}>;searchParams:Promise<{run?:string}>}){
 const {kind,recordId:id,version}=await params,{run}=await searchParams;
 const result=archiveId(kind)&&archiveId(id)&&/^\d{1,7}$/.test(version)?await archiveRead<RecordDetail>(`records/${kind}/${id}/versions/${version}`,run):{data:null,error:'Invalid record identity.'};
 const d=result.data,event=d?.event?.event;
 return <ArchiveShell title={`Evidence record · ${kind}`} mode={event?.evidenceMode} run={run} witness={result.data?result.fingerprint:undefined}>{event?<><p>{author(event.actor)} · <time>{event.occurredAt}</time> · Exact version {version}</p><p>Publication: {d?.event?.receivedAt} · Receipt: {d?.event?.receiptId}</p><EvidenceDetail event={event} record={d!.record} run={run}/></>:<p role="status">{d?.safeReason??result.error}</p>}</ArchiveShell>;
}
