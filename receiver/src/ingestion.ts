import { randomUUID } from 'node:crypto';
import type { EventBatch, PublicationReceipt, Heartbeat, HeartbeatReceipt, ContentReceipt, ContentType } from '../vendor/investment/v1/types.js';
import { Archive, eventFrom } from './database.js';
import { recheck, type Auth } from './auth.js';
import { checkPublicationBatch, type StagedContent } from './publication.js';
import { parseJson, requireContract as need, sha256, validate } from './schema.js';
import { Storage, type Fault } from './storage.js';

export class Ingestion {
  constructor(readonly db: Archive, readonly storage: Storage, readonly now:()=>number, readonly fault:Fault=()=>{}) {}
  request(auth:Auth,id:string,target:string,digest:string):string|undefined {
    const old=this.db.get<{target:string;body_digest:string;response_json:string}>('SELECT * FROM request_receipts WHERE publisher_id=? AND experiment_id=? AND run_id=? AND request_id=?',auth.scope.publisherId,auth.scope.experimentId,auth.scope.runId,id);
    if(old) need(old.target===target&&old.body_digest===digest,'CONFLICT'); return old?.response_json;
  }
  saveRequest(auth:Auth,id:string,target:string,digest:string,response:unknown):void {
    this.db.admitWrite(Buffer.byteLength(JSON.stringify(response))*4+65536);
    need(this.db.get<{n:number}>('SELECT count(*) n FROM request_receipts')!.n<100000,'BUDGET_EXHAUSTED');
    if(!target.endsWith('/events'))need(this.db.get<{n:number}>("SELECT count(*) n FROM request_receipts WHERE target NOT LIKE '%/events'")!.n<50000,'BUDGET_EXHAUSTED');
    this.db.run('INSERT INTO request_receipts VALUES(?,?,?,?,?,?,?)',auth.scope.publisherId,auth.scope.experimentId,auth.scope.runId,id,target,digest,JSON.stringify(response));
  }
  async batch(auth:Auth):Promise<{status:number;body:PublicationReceipt}> {
    const bytes=auth.message.body, digest=sha256(bytes), raw=parseJson(bytes);
    need(raw&&typeof raw==='object'&&(raw as {schemaVersion?:unknown}).schemaVersion==='1.0','UNSUPPORTED_VERSION');
    const batch=validate<EventBatch>('EventBatch',raw);
    const e=auth.scope.experimentId,r=auth.scope.runId,id=new Map(auth.message.headers).get('idempotency-key')!;
    need(batch.batchId===id,'CONFLICT');
    for(let attempt=0;attempt<3;attempt++) {
      const revision=this.db.meta().revision;
      const scope=recheck(this.db,auth,this.now());
      need(batch.experimentId===e&&batch.runId===r&&batch.events.every(x=>x.experimentId===e&&x.runId===r&&scope.eventTypes.includes(x.type)&&x.publicationPolicyVersion===scope.publicationPolicyVersion),'FORBIDDEN');
      const old=this.request(auth,id,auth.message.path,digest);
      if(old) return this.db.atomic(()=>{recheck(this.db,auth,this.now());return {status:200,body:validate<PublicationReceipt>('PublicationReceipt',JSON.parse(old))};});
      const history=this.db.history(e,r).map(eventFrom), content=new Map<string,StagedContent>();
      for(const event of batch.events) if(event.type==='artifact.published'&&!history.some(x=>x.eventId===event.eventId)) {
        const p=event.payload;
        const c=this.db.get<{size_bytes:number}>('SELECT c.size_bytes FROM staged_content s JOIN content_objects c USING(sha256) WHERE experiment_id=? AND run_id=? AND sha256=? AND content_type=?',e,r,p.sha256,p.contentType);
        need(c&&c.size_bytes===p.sizeBytes,'DEPENDENCY_NOT_READY');
        try { await this.storage.read(p.sha256,p.contentType,p.sizeBytes); } catch { need(false,'DEPENDENCY_NOT_READY'); }
        content.set(p.sha256,{sha256:p.sha256,contentType:p.contentType,sizeBytes:p.sizeBytes});
      }
      const result=checkPublicationBatch(bytes,id,{experimentId:e,runId:r,now:new Date(this.now()*1000).toISOString(),scope,history,content,receipts:new Map()});
      const fresh=batch.events.filter(x=>result.acceptedIds.includes(x.eventId));
      const run=fresh.find(x=>x.type==='run.published');
      const runHash=run?.type==='run.published'?run.payload.configurationHash:this.db.get<{config_hash:string}>('SELECT config_hash FROM runs WHERE experiment_id=? AND run_id=?',e,r)?.config_hash;
      if(batch.events.some(x=>x.evidenceMode==='observed_paper')) need(this.db.get('SELECT 1 FROM publication_approvals WHERE experiment_id=? AND run_id=? AND configuration_hash=?',e,r,runHash??''),'FORBIDDEN');
      const extra=fresh.reduce((n,x)=>n+Buffer.byteLength(JSON.stringify(x)),0);
      const currentBytes=this.db.get<{bytes:number}>('SELECT bytes FROM runs WHERE experiment_id=? AND run_id=?',e,r)?.bytes??0;
      need(currentBytes+extra<=this.db.config.maxRunBytes,'BUDGET_EXHAUSTED');
      const total=this.db.get<{n:number}>('SELECT coalesce(sum(bytes),0) n FROM runs')!.n;
      need(total+extra<=this.db.config.maxArchiveBytes,'BUDGET_EXHAUSTED');
      await this.storage.space(extra*4+1048576);
      this.fault('before-batch-commit');
      const committed=this.db.atomic(()=>{
        recheck(this.db,auth,this.now());
        const concurrent=this.request(auth,id,auth.message.path,digest);
        if(concurrent) return {status:200,body:validate<PublicationReceipt>('PublicationReceipt',JSON.parse(concurrent))};
        if(this.db.meta().revision!==revision) return null;
        if(batch.events.some(x=>x.evidenceMode==='observed_paper'))need(this.db.get('SELECT 1 FROM publication_approvals WHERE experiment_id=? AND run_id=? AND configuration_hash=?',e,r,runHash??''),'FORBIDDEN');
        this.db.admitWrite(extra*4+65536);
        const time=new Date(this.now()*1000).toISOString(),receiptId=randomUUID();
        if(run?.type==='run.published') {
          if(run.payload.previousRunId) need(this.db.get('SELECT 1 FROM runs WHERE experiment_id=? AND run_id=?',e,run.payload.previousRunId),'DEPENDENCY_NOT_READY');
          this.db.run('INSERT OR IGNORE INTO experiments(experiment_id,created_at) VALUES(?,?)',e,time);
          this.db.run('INSERT INTO runs VALUES(?,?,?,?,?,0)',e,r,run.payload.configurationHash,JSON.stringify(run.payload),run.evidenceMode);
          // Official selection is an explicit private operator decision, never last-arrival wins.
        }
        for(const event of fresh) { this.db.insertEvent(event,time,receiptId); this.fault('after-event-insert'); }
        this.db.run('UPDATE runs SET bytes=bytes+? WHERE experiment_id=? AND run_id=?',extra,e,r);
        const watermark=this.db.watermark(e,r);
        const last=this.db.get<{n:number}>('SELECT coalesce(max(receiver_sequence),0) n FROM events WHERE experiment_id=? AND run_id=?',e,r)!.n;
        this.db.run('DELETE FROM cursors WHERE expires<?',this.now());
        need(this.db.get<{n:number}>('SELECT count(*) n FROM cursors')!.n<10000,'RATE_LIMITED');
        const token=randomUUID(),meta=this.db.meta();
        this.db.run('INSERT INTO cursors VALUES(?,?,?,?,?,?,?)',token,JSON.stringify({path:auth.message.path,filters:{},limit:50}),meta.epoch,meta.visibility_epoch,last,last,this.now()+900);
        const receipt=validate<PublicationReceipt>('PublicationReceipt',{schemaVersion:'1.0',batchId:id,experimentId:e,runId:r,bodyDigest:digest,receiptId,receivedAt:time,acceptedIds:result.acceptedIds,duplicateIds:result.duplicateIds,receiverCursor:token,watermark});
        this.db.run('INSERT INTO batches VALUES(?,?,?,?,?,?)',scope.publisherId,e,r,id,digest,JSON.stringify(receipt));
        this.saveRequest(auth,id,auth.message.path,digest,receipt);
        this.db.touch(); this.fault('before-sql-commit');
        return {status:201,body:receipt};
      });
      if(committed) {this.fault('after-sql-commit');return committed;}
    }
    need(false,'UNAVAILABLE');
  }
  heartbeat(auth:Auth):HeartbeatReceipt {
    const h=validate<Heartbeat>('Heartbeat',parseJson(auth.message.body,16384)), id=new Map(auth.message.headers).get('idempotency-key')!,digest=sha256(auth.message.body);
    need(h.heartbeatId===id,'CONFLICT');need(h.experimentId===auth.scope.experimentId&&h.runId===auth.scope.runId,'FORBIDDEN');
    need(Date.parse(h.sentAt)<=this.now()*1000+60000,'INVALID_REQUEST');
    return this.db.atomic(()=>{
      recheck(this.db,auth,this.now());const old=this.request(auth,id,auth.message.path,digest);if(old)return validate('HeartbeatReceipt',JSON.parse(old));
      const receivedAt=new Date(this.now()*1000).toISOString();
      const receipt=validate<HeartbeatReceipt>('HeartbeatReceipt',{schemaVersion:'1.0',heartbeatId:id,receivedAt});
      const prior=this.db.get<{sent_at:string}>('SELECT sent_at FROM heartbeats WHERE publisher_id=?',auth.scope.publisherId);
      if(!prior||Date.parse(prior.sent_at)<Date.parse(h.sentAt)) this.db.run('INSERT INTO heartbeats VALUES(?,?,?,?) ON CONFLICT(publisher_id) DO UPDATE SET sent_at=excluded.sent_at,received_at=excluded.received_at,body_json=excluded.body_json',auth.scope.publisherId,h.sentAt,receivedAt,JSON.stringify(h));
      this.saveRequest(auth,id,auth.message.path,digest,receipt);this.db.touch();return receipt;
    });
  }
  async content(auth:Auth,temp:string,type:ContentType,hash:string):Promise<ContentReceipt> {
    const id=new Map(auth.message.headers).get('idempotency-key')!,digest=sha256(auth.message.body),target=auth.message.path+' '+type;
    need(auth.scope.contentTypes.includes(type),'FORBIDDEN');
    const old=this.request(auth,id,target,digest);
    recheck(this.db,auth,this.now());
    await this.storage.install(temp,Buffer.from(auth.message.body),type,hash,this.now());
    return this.db.atomic(()=>{
      recheck(this.db,auth,this.now());const prior=this.request(auth,id,target,digest);
      const receivedAt=new Date(this.now()*1000).toISOString();
      this.db.run('INSERT INTO staged_content VALUES(?,?,?,?,?) ON CONFLICT(experiment_id,run_id,sha256,content_type) DO UPDATE SET touched_at=excluded.touched_at',auth.scope.experimentId,auth.scope.runId,hash,type,this.now());
      // Cleanup may expire unpublished bytes; a same-byte retry restores staging but keeps its original receipt.
      if(prior||old){this.db.touch();return validate('ContentReceipt',JSON.parse(prior??old!));}
      const receipt=validate<ContentReceipt>('ContentReceipt',{schemaVersion:'1.0',uploadId:id,experimentId:auth.scope.experimentId,runId:auth.scope.runId,sha256:hash,contentType:type,sizeBytes:auth.message.body.length,receivedAt,state:'staged_private'});
      this.saveRequest(auth,id,target,digest,receipt);this.db.touch();return receipt;
    });
  }
  receipt(auth:Auth,batchId:string):PublicationReceipt {
    return this.db.atomic(()=>{
      recheck(this.db,auth,this.now());
      const row=this.db.get<{receipt_json:string}>('SELECT receipt_json FROM batches WHERE publisher_id=? AND experiment_id=? AND run_id=? AND batch_id=?',auth.scope.publisherId,auth.scope.experimentId,auth.scope.runId,batchId);
      need(row,'NOT_FOUND');return validate('PublicationReceipt',JSON.parse(row.receipt_json));
    });
  }
}
