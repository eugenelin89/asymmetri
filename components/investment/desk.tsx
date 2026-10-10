'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { EventPage, ReceivedEvent, Worker, DiscussionOpened } from '@/receiver/vendor/investment/v1/types';
import type { ArchiveResponse } from '@/lib/investment-archive';
import { actorName, compareSequence, displayTime, inRun, recordHref } from '@/lib/investment-links';
export const pollDelay = (failures:number,hidden:boolean) => hidden ? 60000 : Math.min(12000 * 2 ** Math.min(failures,3),96000);
export async function publicRead<T>(resource:string,run?:string,signal?:AbortSignal):Promise<ArchiveResponse<T>> {
  const response=await fetch(inRun('/botsquad/investment/read?resource='+encodeURIComponent(resource),run),{cache:'no-store',signal:signal?AbortSignal.any([signal,AbortSignal.timeout(10000)]):AbortSignal.timeout(10000)});
  return await response.json() as ArchiveResponse<T>;
}
export function Desk({initial,run,workers,topics,synthetic}:{initial:ArchiveResponse<EventPage>;run?:string;workers:Worker[];topics:DiscussionOpened[];synthetic:boolean}) {
  const [page,setPage]=useState(initial),[topic,setTopic]=useState(''),[worker,setWorker]=useState(''),[following,setFollowing]=useState(true),[pending,setPending]=useState(0),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[compact,setCompact]=useState(false),[replay,setReplay]=useState<number|null>(null);
  const panel=useRef<HTMLDivElement>(null), failures=useRef(0),inflight=useRef(false),mounted=useRef(true),follow=useRef(true),seen=useRef(new Set(initial.data?.items.map(x=>x.event.eventId))),lastScroll=useRef(0),controller=useRef<AbortController|null>(null),revision=useRef(initial.fingerprint);
  const load=useCallback(async (after?:string,reset=false,passive=false)=>{
    if(inflight.current)return;
    const abort=new AbortController();controller.current=abort;inflight.current=true;setBusy(true);
    try {
      let result=await publicRead<EventPage>('events?limit=100'+(after&&after!=='first'?'&after='+encodeURIComponent(after):''),run,abort.signal);
      // The receiver supplies a standard cursor to the last bounded window, within its read transaction.
      // No recursive catch-up or invented contract query is needed, even with a very large history.
      if(!after&&result.data&&result.tailCursor)result=await publicRead<EventPage>('events?limit=100&after='+encodeURIComponent(result.tailCursor),run,abort.signal);
      if(!mounted.current||abort.signal.aborted)return;
      if(result.code==='CURSOR_RESET'){
        setPage({data:null,error:'Archive visibility or cursor changed. Resynchronizing.',code:'CURSOR_RESET'});setPending(0);seen.current.clear();
        await Promise.all([publicRead('status',run,abort.signal),publicRead('snapshot',run,abort.signal)]);
        result=await publicRead<EventPage>('events?limit=100',run,abort.signal);
        if(result.data&&result.tailCursor)result=await publicRead<EventPage>('events?limit=100&after='+encodeURIComponent(result.tailCursor),run,abort.signal);
        if(!mounted.current||abort.signal.aborted)return;
        setMessage('Cursor reset. Cached contributions cleared and the latest bounded window verified.');
      }
      if(!result.data){failures.current++;setPage(result);setMessage('Connection unavailable. Cached contributions are hidden until visibility can be verified.');return;}
      const changed=revision.current!==result.fingerprint;
      revision.current=result.fingerprint;
      const fresh=result.data.items.filter(x=>!seen.current.has(x.event.eventId)).length;
      if(!after)seen.current=new Set(result.data.items.map(x=>x.event.eventId));failures.current=0;
      if(!passive||follow.current||changed)setPage(result);
      if(!after)setPending(n=>follow.current?0:n+fresh);if(reset)setMessage('Refreshed verified public records.');
      if(follow.current)requestAnimationFrame(()=>{if(panel.current)panel.current.scrollTop=panel.current.scrollHeight;});
    }catch{if(mounted.current&&!abort.signal.aborted){failures.current++;setPage({data:null,error:'Connection lost. Retrying with bounded backoff.'});setMessage('Connection lost. No current worker activity can be verified.');}}
    finally{if(controller.current===abort){inflight.current=false;if(mounted.current)setBusy(false);}}
  },[run]);
  useEffect(()=>{
    mounted.current=true;let stopped=false,timer:ReturnType<typeof setTimeout>;
    const schedule=()=>{if(stopped)return;timer=setTimeout(async()=>{if(!document.hidden)await load(undefined,false,true);schedule();},pollDelay(failures.current,document.hidden)+Math.floor(Math.random()*1000));};
    if(initial.data?.nextCursor)timer=setTimeout(()=>{void load().then(schedule);},0);else schedule();
    const visibility=()=>{clearTimeout(timer);schedule();};document.addEventListener('visibilitychange',visibility);
    return()=>{stopped=true;mounted.current=false;controller.current?.abort();inflight.current=false;clearTimeout(timer);document.removeEventListener('visibilitychange',visibility);};
  },[load,initial.data?.nextCursor]);
  function pause(){follow.current=false;setFollowing(false);}
  function latest(){follow.current=true;setFollowing(true);setPending(0);void load(undefined,true);}
  const all=page.data?.items.filter(({event:e})=>['discussion.contribution','discussion.closed','worker.activity','publication.notice','decision.published','review.published'].includes(e.type))??[];
  const visible=all.filter(({event:e})=>(!worker||e.actor.kind==='worker'&&e.actor.workerId===worker||e.type==='worker.activity'&&e.payload.workerId===worker)&&(!topic||(e.type==='discussion.contribution'||e.type==='discussion.closed')&&e.payload.discussionId===topic)).sort((a,b)=>Date.parse(a.event.occurredAt)-Date.parse(b.event.occurredAt)||compareSequence(a.receiverSequence,b.receiverSequence));
  const displayed=replay===null?visible:visible.slice(0,replay);
  return <div className="inv-desk"><div className="inv-toolbar"><label>Topic<select value={topic} onChange={e=>{setTopic(e.target.value);setReplay(null);}}><option value="">All topics in this window</option>{topics.map(t=><option key={t.discussionId} value={t.discussionId}>{t.topic}</option>)}</select></label><label>Contributor<select value={worker} onChange={e=>setWorker(e.target.value)}><option value="">Everyone & system</option>{workers.map(w=><option key={w.workerId} value={w.workerId}>{w.name}</option>)}</select></label><label className="inv-check"><input type="checkbox" checked={compact} onChange={e=>setCompact(e.target.checked)}/>Compact view</label></div>
    <div className="inv-desk-bar"><p><span className="inv-dot" aria-hidden="true"/>{synthetic?'Recorded demonstration':'Public archive'} · {page.data?.freshness.status??'unknown'}</p><button onClick={()=>void load(undefined,true)} disabled={busy}>{busy?'Loading…':'Refresh records'}</button></div>
    <p className="inv-meta">{page.data?.freshness.reason??'No recent activity can be verified.'} No typing or presence is inferred.</p>
    {synthetic&&<div className="inv-replay"><span>Simulated playback · no model execution</span><button onClick={()=>{setReplay(replay===null?1:null);pause();}}>{replay===null?'Step through example':'Show all recorded updates'}</button>{replay!==null&&<button disabled={replay>=visible.length} onClick={()=>setReplay(n=>(n??0)+1)}>Next recorded update ({Math.min(replay,visible.length)}/{visible.length})</button>}</div>}
    <div ref={panel} className={'inv-thread'+(compact?' inv-thread--compact':'')} tabIndex={0} role="region" aria-label="Investment desk contributions" aria-busy={busy} onScroll={()=>{const top=panel.current?.scrollTop??0;if(top<lastScroll.current-3)pause();lastScroll.current=top;}} onWheel={e=>{if(e.deltaY<0)pause();}} onKeyDown={e=>{if(['ArrowUp','PageUp','Home'].includes(e.key))pause();}}>
      {!page.data?<p className="inv-empty" role="status">{page.error}</p>:displayed.length?<ol>{displayed.map(record=><DeskMessage key={record.event.eventId} record={record} run={run} workers={workers}/>)}</ol>:<p className="inv-empty">No public contributions match this view. Quiet periods do not create worker activity.</p>}
    </div><div className="inv-desk-bar"><span role="status" aria-live="polite">{following?'Following latest records':`Following paused · ${pending} new updates`}</span><button onClick={following?pause:latest}>{following?'Pause following':'Jump to latest'}</button></div>
    <p className="inv-meta" role="status">{message}</p><div className="inv-actions"><button onClick={()=>{pause();void load('first',true);}} disabled={busy}>First event page</button>{page.data?.nextCursor&&<button disabled={busy} onClick={()=>{pause();void load(page.data!.nextCursor!);}}>Next event page</button>}</div><p className="inv-meta">A bounded window of up to 100 records. Filters apply to this window. Pagination follows publication order; contributions are shown by original time. Polling checks the latest bounded window; paused reading stays in place until you refresh or jump to latest. First/next controls browse stable archive pages. Visible polling: about 12 seconds, with bounded backoff; hidden tabs pause.</p>
  </div>;
}
function DeskMessage({record,run,workers}:{record:ReceivedEvent;run?:string;workers:Worker[]}) {
  const e=record.event,contribution=e.type==='discussion.contribution'?e.payload:null;
  const body=contribution?.body??(e.type==='worker.activity'?e.payload.summary:e.type==='discussion.closed'?e.payload.outcome:e.type==='publication.notice'?e.payload.reason:e.type==='decision.published'?e.payload.proposal.rationale:e.type==='review.published'?e.payload.interpretation:'');
  const refs=[...e.references,...(contribution?.evidence??[]),...(e.type==='discussion.closed'?[e.payload.synthesis]:[])];
  return <li className={'inv-message inv-message--'+e.actor.kind}><article><div className="inv-message-head"><span className="inv-avatar" aria-hidden="true">{e.actor.kind==='system'?'◇':e.actor.kind==='owner'?'O':'E'}</span><div><strong>{actorName(e.actor,workers)}</strong><span className="inv-meta">{e.type.replaceAll('.',' / ').replaceAll('_',' ')}</span></div></div><p>{body}</p><p className="inv-meta">Original: <time dateTime={e.occurredAt}>{displayTime(e.occurredAt)}</time><br/>Published: <time dateTime={record.receivedAt}>{displayTime(record.receivedAt)}</time></p>{contribution?.replyTo&&<a href={recordHref({kind:'contribution',id:contribution.replyTo,version:1,relation:'supports'},run)}>Reply to {contribution.replyTo} ↗</a>}{e.type==='discussion.closed'&&<><p><strong>Dissent:</strong> {e.payload.dissent.join(' ')||'None published.'}</p><p><strong>Unresolved:</strong> {e.payload.unresolved.join(' ')||'None published.'}</p></>}{refs.length>0&&<ul className="inv-evidence">{refs.map((r,i)=><li key={i}><a href={recordHref(r,run)}>{r.relation.replaceAll('_',' ')} · {r.kind} · v{r.version} ↗</a></li>)}</ul>}{e.type==='decision.published'&&<a href={inRun('/botsquad/investment/decisions/'+e.payload.proposal.decisionId,run)}>Inspect {e.payload.proposal.action} decision →</a>}{e.type==='review.published'&&<a href={recordHref({kind:'review',id:e.payload.reviewId,version:1,relation:'reviews'},run)}>Read outcome review →</a>}</article></li>;
}
