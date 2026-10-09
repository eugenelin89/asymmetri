import { randomUUID } from 'node:crypto';
import type { Event, Freshness, PortfolioSnapshot, RunPublished, RunState, ArtifactRegistryEntry } from '../vendor/investment/v1/types.js';
import { Archive, eventFrom, received, type EventRow } from './database.js';
import { canonicalHash, requireContract as need, validate } from './schema.js';
import { recordKeys } from './publication.js';

export interface PublicResult { name: string; body: unknown; etag: string }
interface Cursor { binding:string; epoch:string; visibility_epoch:number; upper_watermark:number; after_sequence:number; expires:number }
export class PublicReads {
  constructor(readonly db:Archive,readonly now:()=>number) {}
  visible(experiment:string,run:string):{rows:EventRow[];all:EventRow[];hidden:Map<string,'withheld'|'withdrawn'>} {
    const all=this.db.history(experiment,run), hidden=new Map<string,'withheld'|'withdrawn'>();
    for(const row of this.db.all<{event_id:string;visibility:'withheld'|'withdrawn'}>('SELECT event_id,visibility FROM visibility_actions WHERE experiment_id=? AND run_id=? ORDER BY id',experiment,run)) hidden.set(row.event_id,row.visibility);
    const links=this.db.all<{event_id:string;target:string}>('SELECT l.event_id,r.event_id target FROM record_links l JOIN records r ON r.experiment_id=l.experiment_id AND r.run_id=l.run_id AND r.kind=l.kind AND r.record_id=l.record_id AND r.version=l.version WHERE l.experiment_id=? AND l.run_id=?',experiment,run);
    const runEvent=all.find(x=>x.event_type==='run.published');
    if(runEvent&&hidden.has(runEvent.event_id)) for(const row of all) hidden.set(row.event_id,'withdrawn');
    let changed=true;
    while(changed) {changed=false;for(const link of links) if(hidden.has(link.target)&&!hidden.has(link.event_id)){hidden.set(link.event_id,'withheld');changed=true;}}
    return {rows:all.filter(x=>!hidden.has(x.event_id)),all,hidden};
  }
  snapshot(rows:EventRow[],all=rows):PortfolioSnapshot|null {
    const visible=new Set(rows.map(x=>x.event_id));
    const latest=new Map<string,{snapshot:PortfolioSnapshot;visible:boolean}>();
    for(const row of all) {const e=eventFrom(row);if(e.type==='portfolio.snapshot'){const old=latest.get(e.payload.valuationId);if(!old||e.payload.revision>old.snapshot.revision)latest.set(e.payload.valuationId,{snapshot:e.payload,visible:visible.has(row.event_id)});}}
    return [...latest.values()].filter(x=>x.visible).map(x=>x.snapshot).filter(s=>s.quality==='complete').sort((a,b)=>BigInt(a.valuationSequence)<BigInt(b.valuationSequence)?-1:BigInt(a.valuationSequence)>BigInt(b.valuationSequence)?1:a.revision-b.revision).at(-1)??null;
  }
  freshness(experiment:string,run:string,rows:EventRow[],all=rows):Freshness {
    const events=rows.map(eventFrom), published=events.find(e=>e.type==='run.published');
    const activity=events.filter(e=>e.type==='worker.activity').map(e=>e.occurredAt).sort((a,b)=>Date.parse(a)-Date.parse(b)).at(-1)??null;
    const h=this.db.get<{sent_at:string;received_at:string}>('SELECT h.* FROM heartbeats h JOIN publishers p USING(publisher_id) WHERE p.experiment_id=? AND p.run_id=?',experiment,run);
    const snapshot=this.snapshot(rows,all), staleAfter=published?.type==='run.published'?published.payload.configuration.publicationStaleSeconds:180;
    const stale=!!h&&(this.now()*1000-Date.parse(h.sent_at)>staleAfter*1000||this.now()*1000-Date.parse(h.received_at)>staleAfter*1000);
    const oldMarket=snapshot&&this.now()*1000-Date.parse(snapshot.valuationAsOf)>(86400+(published?.type==='run.published'?published.payload.configuration.dataDelaySeconds:0))*1000;
    return validate('Freshness',{lastActivityAt:activity,lastPublicationAt:rows.at(-1)?.received_at??null,lastHeartbeatAt:h?.received_at??null,valuationAsOf:snapshot?.valuationAsOf??null,expectedMarkSession:null,status:stale||oldMarket?'stale':'unknown',reason:stale?'Publisher contact is stale.':oldMarket?'Last complete valuation is old; expected market session is unverified.':'Transport contact does not establish market freshness; no calendar collector is configured.'});
  }
  token(binding:string,upper:number,after:number):string {
    const m=this.db.meta(),now=this.now();
    this.db.run('DELETE FROM cursors WHERE expires<?',now);
    const old=this.db.get<{token:string}>('SELECT token FROM cursors WHERE binding=? AND epoch=? AND visibility_epoch=? AND upper_watermark=? AND after_sequence=? AND expires>? LIMIT 1',binding,m.epoch,m.visibility_epoch,upper,after,now);
    if(old)return old.token;
    need(this.db.get<{n:number}>('SELECT count(*) n FROM cursors')!.n<10000,'RATE_LIMITED');
    this.db.admitWrite(8192);
    const token=randomUUID();this.db.run('INSERT INTO cursors VALUES(?,?,?,?,?,?,?)',token,binding,m.epoch,m.visibility_epoch,upper,after,now+900);return token;
  }
  page<T extends {receiver_sequence:number}>(path:string,query:URLSearchParams,rows:T[],upper:number):{items:T[];nextCursor:string|null} {
    const limit=query.has('limit')?Number(query.get('limit')):50;
    need(Number.isInteger(limit)&&limit>=1&&limit<=100&&(!query.has('limit')||/^[1-9][0-9]{0,2}$/.test(query.get('limit')!)));
    const filters=Object.fromEntries([...query].filter(([k])=>k!=='after'&&k!=='limit').sort(([a],[b])=>a.localeCompare(b)));
    const binding=JSON.stringify({path,filters,limit});let after=0;
    const cursor=query.get('after');
    if(cursor){validate('Id',cursor);const c=this.db.get<Cursor>('SELECT * FROM cursors WHERE token=?',cursor),m=this.db.meta();need(c&&c.binding===binding&&c.epoch===m.epoch&&c.visibility_epoch===m.visibility_epoch&&c.expires>this.now(),'CURSOR_RESET');upper=c.upper_watermark;after=c.after_sequence;}
    const candidates=rows.filter(x=>x.receiver_sequence>after&&x.receiver_sequence<=upper);
    const items:T[]=[];let bytes=0;
    for(const row of candidates) {const n=Buffer.byteLength(JSON.stringify(row));if(items.length>=limit||items.length>0&&bytes+n>1048576)break;items.push(row);bytes+=n;}
    return {items,nextCursor:candidates.length>items.length?this.token(binding,upper,items.at(-1)!.receiver_sequence):null};
  }
  result(name:string,body:unknown):PublicResult {validate(name,body);return {name,body,etag:'"'+canonicalHash({epoch:this.db.meta().visibility_epoch,body})+'"'};}
  state(events:Event[],initial:RunState,all=events,hidden:Map<string,string>=new Map()):RunState {
    const latest=all.filter(e=>e.type==='run.status').sort((a,b)=>BigInt(a.sourceSequence)<BigInt(b.sourceSequence)?-1:1).at(-1);
    need(!latest||!hidden.has(latest.eventId),'UNAVAILABLE');
    return latest?.type==='run.status'?latest.payload.state:initial;
  }
  read(path:string,query:URLSearchParams,e:string,r:string|undefined,tail:string[]):PublicResult {
    // One short read transaction gives a consistent metadata/projection snapshot. No filesystem/network I/O.
    return this.db.atomic(()=>this.project(path,query,e,r,tail));
  }
  project(path:string,query:URLSearchParams,e:string,r:string|undefined,tail:string[]):PublicResult {
    const meta=this.db.meta();void meta;
    if(!r) {
      const rows=this.db.all<{run_id:string;published_json:string;receiver_sequence:number}>('SELECT r.run_id,r.published_json,e.receiver_sequence FROM runs r JOIN events e ON e.experiment_id=r.experiment_id AND e.run_id=r.run_id AND e.event_type=? WHERE r.experiment_id=? ORDER BY e.receiver_sequence','run.published',e).filter(x=>this.visible(e,x.run_id).rows.some(y=>y.event_type==='run.published'));
      need(rows.length,'NOT_FOUND');
      const page=this.page(path,query,rows,rows.at(-1)!.receiver_sequence),first=JSON.parse(rows[0]!.published_json) as RunPublished;
      const pointer=this.db.get<{official_run_id:string|null}>('SELECT official_run_id FROM experiments WHERE experiment_id=?',e)?.official_run_id??null;
      return this.result('PublicExperiment',{schemaVersion:'1.0',experimentId:e,title:first.title,purpose:first.purpose,objective:first.objective,officialRunId:rows.some(x=>x.run_id===pointer)?pointer:null,runs:page.items.map(row=>{const p=JSON.parse(row.published_json) as RunPublished,v=this.visible(e,row.run_id);return {runId:row.run_id,kind:p.runKind,state:this.state(v.rows.map(eventFrom),p.state,v.all.map(eventFrom),v.hidden),methodologyVersion:p.configuration.methodologyVersion};}),nextCursor:page.nextCursor});
    }
    const {rows,all,hidden}=this.visible(e,r),events=rows.map(eventFrom),runEvent=events.find(x=>x.type==='run.published');
    // Exact tombstone reads still work if the enclosing run was withdrawn.
    if(tail[0]==='records') {
      const [,kind,id,,ver]=tail,version=Number(ver);validate('RecordRef',{kind,id,version,relation:'supports'});
      const row=all.find(row=>recordKeys(eventFrom(row)).includes(`${kind}:${id}:${version}`));need(row,'NOT_FOUND');
      return this.result('RecordDetail',{schemaVersion:'1.0',experimentId:e,runId:r,record:{kind,id,version,relation:'supports'},visibility:hidden.get(row.event_id)??'published',event:hidden.has(row.event_id)?null:received(row),safeReason:hidden.has(row.event_id)?'This record is unavailable.':null});
    }
    need(runEvent?.type==='run.published','NOT_FOUND');
    const freshness=this.freshness(e,r,rows,all),watermark=this.db.watermark(e,r),base={schemaVersion:'1.0',experimentId:e,runId:r};
    if(hidden.size)watermark.sourceGaps=true;
    const upper=all.at(-1)?.receiver_sequence??0;
    const page=(source:EventRow[])=>this.page(path,query,source,upper);
    const collection=(name:string,p:{items:unknown[];nextCursor:string|null})=>this.result(name,{...base,...p,watermark,freshness});
    switch(tail[0]) {
      case 'status': return this.result('PublicStatus',{...base,state:this.state(events,runEvent.payload.state,all.map(eventFrom),hidden),watermark,freshness,notices:events.filter(x=>x.type==='publication.notice').slice(-20).map(x=>x.payload)});
      case 'snapshot': return this.result('SnapshotResponse',{...base,snapshot:this.snapshot(rows,all),watermark,freshness});
      case 'events': {const p=page(rows);return collection('EventPage',{...p,items:p.items.map(received)});}
      case 'performance': {
        const p=page(rows.filter(row=>{const ev=eventFrom(row);return ev.type==='portfolio.snapshot'&&(!query.has('from')||ev.payload.session>=query.get('from')!)&&(!query.has('to')||ev.payload.session<=query.get('to')!);}));
        return collection('PerformancePage',{...p,items:p.items.map(x=>eventFrom(x).payload)});
      }
      case 'transactions': {
        const p=page(rows.filter(row=>{const x=eventFrom(row);if(x.type!=='paper.order'&&x.type!=='paper.ledger_transaction')return false;if(query.has('kind')&&(query.get('kind')==='order')!==(x.type==='paper.order'))return false;if(query.has('status')&&(x.type!=='paper.order'||x.payload.status!==query.get('status')))return false;const instrument=x.type==='paper.order'?x.payload.instrumentId:x.payload.fill?.instrumentId??x.payload.corporateAction?.instrumentId;return !query.has('instrumentId')||query.get('instrumentId')===instrument;}));
        return collection('TransactionPage',{...p,items:p.items.map(row=>({kind:row.event_type==='paper.order'?'order':'transaction',event:eventFrom(row)}))});
      }
      case 'discussions': {
        if(tail.length===1){const p=page(rows.filter(x=>x.event_type==='discussion.opened'));return collection('DiscussionPage',{...p,items:p.items.map(x=>eventFrom(x).payload)});}
        const d=events.find(x=>x.type==='discussion.opened'&&x.payload.discussionId===tail[1]);need(d?.type==='discussion.opened','NOT_FOUND');
        const p=page(rows.filter(row=>{const x=eventFrom(row);return x.type==='discussion.contribution'&&x.payload.discussionId===tail[1];}));
        const closure=events.find(x=>x.type==='discussion.closed'&&x.payload.discussionId===tail[1]);
        return this.result('DiscussionDetail',{...base,discussion:d.payload,contributions:p.items.map(eventFrom),closure:closure?.payload??null,nextCursor:p.nextCursor,freshness});
      }
      case 'decisions': {
        const decision=all.map(eventFrom).filter(x=>x.type==='decision.published'&&x.payload.proposal.decisionId===tail[1]).sort((a,b)=>a.type==='decision.published'&&b.type==='decision.published'?a.payload.proposal.revision-b.payload.proposal.revision:0).at(-1);need(decision?.type==='decision.published','NOT_FOUND');need(!hidden.has(decision.eventId),'WITHDRAWN');
        const orders=new Map<string,Event>();for(const row of all){const x=eventFrom(row);if(x.type==='paper.order'&&x.payload.decisionId===tail[1]){const prior=orders.get(x.payload.orderId);if(prior?.type!=='paper.order'||x.payload.revision>prior.payload.revision)orders.set(x.payload.orderId,x);}}
        for(const [id,order]of orders)if(hidden.has(order.eventId))orders.delete(id);
        const transactions=events.filter(x=>x.type==='paper.ledger_transaction'&&x.payload.fill?.decisionId===tail[1]).map(x=>({kind:'transaction',id:x.type==='paper.ledger_transaction'?x.payload.transactionId:'',version:1,relation:'results_in'}));
        const reviews=events.filter(x=>x.type==='review.published'&&x.payload.originalDecisions.some(v=>v.id===tail[1])).map(x=>({kind:'review',id:x.type==='review.published'?x.payload.reviewId:'',version:1,relation:'reviews'}));
        need(orders.size<=50&&transactions.length<=100&&reviews.length<=30,'UNAVAILABLE');
        return this.result('DecisionDetail',{...base,decision,orders:[...orders.values()].map(x=>x.payload),transactions,reviews,freshness});
      }
      case 'artifacts': {
        if(tail.length===1){const p=page(rows.filter(x=>x.event_type==='artifact.registered'));return collection('ArtifactPage',{...p,items:p.items.map(row=>{
          const reg=eventFrom(row);need(reg.type==='artifact.registered');
          const latest=all.map(eventFrom).filter(x=>x.type==='artifact.published'&&x.payload.artifactId===reg.payload.artifactId).sort((a,b)=>a.type==='artifact.published'&&b.type==='artifact.published'?a.payload.version-b.payload.version:0).at(-1);
          if(latest&&hidden.has(latest.eventId))return {registration:reg.payload,status:hidden.get(latest.eventId)!,currentPublishedVersion:null,publishedReference:null,safeReason:'This artifact is unavailable.'} satisfies ArtifactRegistryEntry;
          const version=latest?.type==='artifact.published'?latest.payload.version:null;
          return {registration:reg.payload,status:version?'published':reg.payload.status,currentPublishedVersion:version,publishedReference:version?{kind:'artifact',id:reg.payload.artifactId,version,relation:'supports'}:null,safeReason:version?null:reg.payload.reason} satisfies ArtifactRegistryEntry;
        })});}
        const version=Number(tail[3]);need(Number.isSafeInteger(version)&&version>0&&version<=1000000);
        const row=all.find(row=>{const x=eventFrom(row);return x.type==='artifact.published'&&x.payload.artifactId===tail[1]&&x.payload.version===version;});need(row,'NOT_FOUND');
        if(tail[4]==='content'){need(!hidden.has(row.event_id),'WITHDRAWN');need(false,'UNAVAILABLE');} // INV-03 owns public download/rendering.
        return this.result('ArtifactDetail',{...base,artifactId:tail[1],version,status:hidden.get(row.event_id)??'published',metadata:hidden.has(row.event_id)?null:eventFrom(row).payload,safeReason:hidden.has(row.event_id)?'This artifact is unavailable.':null});
      }
      default: need(false,'NOT_FOUND');
    }
  }
}
