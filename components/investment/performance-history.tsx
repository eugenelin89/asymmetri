'use client';
import {useState} from 'react';
import type {PerformancePage,PortfolioSnapshot,RunConfiguration} from '@/receiver/vendor/investment/v1/types';
import type {ArchiveResponse} from '@/lib/investment-archive';
import {Portfolio} from './portfolio';
import {publicRead} from './desk';
export function PerformanceHistory({initial,snapshot,configuration,synthetic,run}:{initial:ArchiveResponse<PerformancePage>;snapshot:PortfolioSnapshot|null;configuration?:RunConfiguration;synthetic:boolean;run?:string}){
 const [page,setPage]=useState(initial),[busy,setBusy]=useState(false),[first,setFirst]=useState(true);
 async function load(after?:string){setBusy(true);try{setPage(await publicRead<PerformancePage>('performance?limit=100'+(after?'&after='+encodeURIComponent(after):''),run));setFirst(!after);}catch{setPage({data:null,error:'Performance unavailable. Current visibility could not be verified.'});}finally{setBusy(false);}}
 return <>{page.error&&<p role="status">{page.error}</p>}<Portfolio snapshot={snapshot} history={page.data?.items??[]} configuration={configuration} synthetic={synthetic} run={run} hasMore={!!page.data?.nextCursor} completeHistory={first&&!page.data?.nextCursor}/><div className="inv-actions"><button disabled={busy} onClick={()=>void load()}>First performance page / refresh</button>{page.data?.nextCursor&&<button disabled={busy} onClick={()=>void load(page.data!.nextCursor!)}>Next performance page</button>}</div></>;
}
