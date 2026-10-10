'use client';
import {useState} from 'react';
import type {PublicExperiment} from '@/receiver/vendor/investment/v1/types';
import type {ArchiveResponse} from '@/lib/investment-archive';
import {publicRead} from './desk';
export function RunHistory({initial}:{initial:ArchiveResponse<PublicExperiment>}){
 const [page,setPage]=useState(initial),[busy,setBusy]=useState(false);
 async function load(after?:string){setBusy(true);try{setPage(await publicRead<PublicExperiment>('experiment'+(after?'?after='+encodeURIComponent(after):'')));}catch{setPage({data:null,error:'Run history unavailable.'});}finally{setBusy(false);}}
 return <details><summary>Retained run history</summary>{page.data?<><p>Official run: {page.data.officialRunId??'Not selected'}. The selected run is never silently replaced.</p><ul>{page.data.runs.map(r=><li key={r.runId}><a href={'/botsquad/investment/runs/'+r.runId}>{r.runId}</a> · {r.kind} · {r.state}</li>)}</ul></>:<p>{page.error}</p>}<div className="inv-actions"><button disabled={busy} onClick={()=>void load()}>Refresh run history</button>{page.data?.nextCursor&&<button disabled={busy} onClick={()=>void load(page.data!.nextCursor!)}>Next runs</button>}</div></details>;
}
