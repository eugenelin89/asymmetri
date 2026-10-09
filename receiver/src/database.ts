import Database from 'better-sqlite3';
import { randomUUID, createPublicKey } from 'node:crypto';
import { readFileSync, lstatSync, chmodSync } from 'node:fs';
import { join } from 'node:path';
import type { Config } from './config.js';
import type { Event, PublisherScope, RecordRef, Watermark, ReceivedEvent } from '../vendor/investment/v1/types.js';
import { canonicalHash, requireContract as need, sha256, validate } from './schema.js';
import { recordKeys } from './publication.js';

type SQL = string | number | bigint | Buffer | null;
export interface EventRow { receiver_sequence: number; experiment_id: string; run_id: string; event_id: string; event_type: string; body_json: string; event_hash: string; received_at: string; receipt_id: string }
export interface Meta { epoch: string; visibility_epoch: number; revision: number }
export interface KeyRow { key_id: string; publisher_id: string; public_key: string; not_before: number; not_after: number; revoked: number; scope_json: string; generation: string }
export interface KeyInput { publicKey: string; notBefore: number; notAfter: number }
export const eventFrom = (row: EventRow): Event => JSON.parse(row.body_json) as Event;
export function received(row: EventRow): ReceivedEvent {
  return validate('ReceivedEvent', { event: eventFrom(row), receiverSequence: String(row.receiver_sequence), receivedAt: row.received_at, eventHash: row.event_hash, receiptId: row.receipt_id });
}
export function references(value: unknown): RecordRef[] {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) return value.flatMap(references);
  const v = value as Record<string, unknown>;
  if ('kind' in v && 'id' in v && 'version' in v && 'relation' in v) return [v as unknown as RecordRef];
  return Object.values(v).flatMap(references);
}
export class Archive {
  readonly db: Database.Database;
  constructor(readonly config: Config) {
    const path = join(config.dataDir, 'archive.sqlite');
    for (const file of [path, path + '-wal', path + '-shm']) {
      try { const s = lstatSync(file); need(s.isFile() && !s.isSymbolicLink() && s.nlink === 1, 'UNAVAILABLE'); }
      catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; }
    }
    this.db = new Database(path, { timeout: 1000 });
    chmodSync(path, 0o600);
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = FULL');
    this.db.pragma('wal_autocheckpoint = 256');
    this.db.pragma('journal_size_limit = 4194304');
    this.db.pragma(`max_page_count = ${Math.ceil(config.maxArchiveBytes * 4 / 4096)}`);
    this.migrate();
  }
  get<T>(sql: string, ...params: SQL[]): T | undefined { return this.db.prepare<SQL[], T>(sql).get(...params); }
  all<T>(sql: string, ...params: SQL[]): T[] { return this.db.prepare<SQL[], T>(sql).all(...params); }
  run(sql: string, ...params: SQL[]): Database.RunResult { return this.db.prepare(sql).run(...params); }
  atomic<T>(fn: () => T): T { return this.db.transaction(fn).immediate(); }
  migrate(): void {
    const sql = readFileSync(new URL('../../migrations/001-archive.sql', import.meta.url), 'utf8');
    this.atomic(() => {
      this.db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, digest TEXT NOT NULL)');
      const migrations = this.all<{version: number; digest: string}>('SELECT * FROM schema_migrations ORDER BY version');
      need(migrations.length <= 1 && (!migrations[0] || migrations[0].version === 1 && migrations[0].digest === sha256(sql)), 'UNAVAILABLE');
      if (!migrations.length) {
        this.db.exec(sql);
        this.run('INSERT INTO archive_meta(id,epoch) VALUES(1,?)', randomUUID());
        this.run('INSERT INTO schema_migrations VALUES(1,?)', sha256(sql));
      }
    });
  }
  /** Leave physical DB headroom for nonce-protected reconciliation and diagnostics. */
  admitWrite(estimatedBytes: number): void {
    const size=Number(this.db.pragma('page_size',{simple:true}));
    const used=(Number(this.db.pragma('page_count',{simple:true}))-Number(this.db.pragma('freelist_count',{simple:true})))*size;
    const maximum=Number(this.db.pragma('max_page_count',{simple:true}))*size;
    const reserve=Math.max(4194304,Math.min(16777216,Math.floor(maximum/8)));
    need(used+estimatedBytes+reserve<=maximum,'BUDGET_EXHAUSTED');
  }
  meta(): Meta { return this.get<Meta>('SELECT * FROM archive_meta WHERE id=1')!; }
  touch(): void { this.run('UPDATE archive_meta SET revision=revision+1 WHERE id=1'); }
  key(id: string): KeyRow | undefined { return this.get<KeyRow>('SELECT k.*,p.scope_json,p.generation FROM publisher_keys k JOIN publishers p USING(publisher_id) WHERE key_id=?', id); }
  /** Explicit local administrative operation. Never called by migration/startup/HTTP. */
  authorize(scope: PublisherScope, key: KeyInput, now: string): void {
    validate('PublisherScope', scope);
    const publicObject=createPublicKey(key.publicKey);
    need(publicObject.asymmetricKeyType === 'ed25519');
    const publicKey=publicObject.export({type:'spki',format:'pem'}).toString();
    need(Number.isSafeInteger(key.notBefore) && Number.isSafeInteger(key.notAfter) && key.notBefore < key.notAfter);
    this.atomic(() => {
      const old = this.get<{experiment_id:string;run_id:string;generation:string}>('SELECT * FROM publishers WHERE publisher_id=?', scope.publisherId);
      if (old) need(old.experiment_id === scope.experimentId && old.run_id === scope.runId && BigInt(scope.generation) >= BigInt(old.generation), 'CONFLICT');
      const oldKey = this.key(scope.keyId);
      if (oldKey) need(oldKey.publisher_id === scope.publisherId && oldKey.public_key === publicKey && !oldKey.revoked && oldKey.not_before === key.notBefore && oldKey.not_after === key.notAfter, 'CONFLICT');
      this.run('INSERT INTO publishers VALUES(?,?,?,?,?) ON CONFLICT(publisher_id) DO UPDATE SET generation=excluded.generation,scope_json=excluded.scope_json', scope.publisherId, scope.experimentId, scope.runId, scope.generation, JSON.stringify(scope));
      this.run('INSERT OR IGNORE INTO publisher_keys VALUES(?,?,?,?,?,0)', scope.keyId, scope.publisherId, publicKey, key.notBefore, key.notAfter);
      this.run('INSERT INTO authority_audit(recorded_at,publisher_id,action) VALUES(?,?,?)', now, scope.publisherId, 'scope/key configured');
      this.touch();
    });
  }
  revokeKey(keyId: string, now: string): void {
    this.atomic(() => { const key = this.key(keyId); need(key, 'NOT_FOUND'); this.run('UPDATE publisher_keys SET revoked=1 WHERE key_id=?', keyId); this.run('INSERT INTO authority_audit(recorded_at,publisher_id,action) VALUES(?,?,?)', now, key.publisher_id, 'key revoked'); this.touch(); });
  }
  history(experiment: string, run: string): EventRow[] { return this.all<EventRow>('SELECT * FROM events WHERE experiment_id=? AND run_id=? ORDER BY receiver_sequence', experiment, run); }
  watermark(experiment: string, run: string): Watermark {
    const count = this.get<{n:number}>('SELECT count(*) n FROM events WHERE experiment_id=? AND run_id=?', experiment, run)!.n;
    const source = this.get<{source_sequence:string}>('SELECT source_sequence FROM events WHERE experiment_id=? AND run_id=? ORDER BY length(source_sequence) DESC,source_sequence DESC LIMIT 1', experiment, run);
    const journal = this.get<{sequence:string;journal_hash:string}>('SELECT sequence,journal_hash FROM financial_journal WHERE experiment_id=? AND run_id=? ORDER BY length(sequence) DESC,sequence DESC LIMIT 1', experiment, run);
    return validate('Watermark', { sourceSequence: source?.source_sequence ?? null, journalSequence: journal?.sequence ?? null, journalHash: journal?.journal_hash ?? null, sourceGaps: source ? BigInt(source.source_sequence) !== BigInt(count) : false });
  }
  /** Include semantic scalar references as well as explicit RecordRef objects. */
  dependencies(event: Event): RecordRef[] {
    const refs=references(event), add=(kind:RecordRef['kind'],id:string,version=1)=>refs.push({kind,id,version,relation:'supports'});
    const journal=(sequence:string)=>{const row=this.get<{event_id:string}>('SELECT event_id FROM financial_journal WHERE experiment_id=? AND run_id=? AND sequence=?',event.experimentId,event.runId,sequence);need(row,'DEPENDENCY_NOT_READY');add('event',row.event_id);};
    if(event.actor.kind==='worker'||['worker.activity','discussion.opened','decision.published'].includes(event.type)) {
      const roster=this.history(event.experimentId,event.runId).map(eventFrom).filter(x=>x.type==='team.published'&&BigInt(x.sourceSequence)<=BigInt(event.sourceSequence)).sort((a,b)=>BigInt(a.sourceSequence)<BigInt(b.sourceSequence)?-1:1).at(-1);
      need(roster,'DEPENDENCY_NOT_READY');add('event',roster.eventId);
    }
    switch(event.type) {
      case 'discussion.contribution':add('discussion',event.payload.discussionId);if(event.payload.replyTo)add('contribution',event.payload.replyTo);break;
      case 'discussion.closed':add('discussion',event.payload.discussionId);break;
      case 'artifact.published':add('artifact',event.payload.artifactId,0);break;
      case 'paper.order': {
        const p=event.payload;add('decision',p.decisionId,p.decisionRevision);if(p.previousEventId)add('event',p.previousEventId);
        if(p.status==='filled'){const fill=this.history(event.experimentId,event.runId).map(eventFrom).find(x=>x.type==='paper.ledger_transaction'&&x.payload.fill?.orderId===p.orderId&&x.payload.fill.orderRevision===p.revision-1);need(fill,'DEPENDENCY_NOT_READY');add('event',fill.eventId);}break;
      }
      case 'paper.ledger_transaction': {
        const p=event.payload;if(BigInt(p.journalSequence)>1n)journal(String(BigInt(p.journalSequence)-1n));
        if(p.fill){add('order',p.fill.orderId,p.fill.orderRevision);add('decision',p.fill.decisionId,p.fill.decisionRevision);}break;
      }
      case 'portfolio.snapshot': {
        journal(event.payload.journalSequence);
        const history=this.history(event.experimentId,event.runId).map(eventFrom);
        for(const holding of event.payload.holdings){
          const update=history.filter(x=>x.type==='instrument.updated'&&x.payload.instrument.instrumentId===holding.instrumentId&&Date.parse(x.payload.effectiveAt)<=Date.parse(event.payload.valuationAsOf)).sort((a,b)=>a.type==='instrument.updated'&&b.type==='instrument.updated'?Date.parse(a.payload.effectiveAt)-Date.parse(b.payload.effectiveAt)||a.payload.version-b.payload.version:0).at(-1);
          if(update)add('event',update.eventId);
        }
        break;
      }
    }
    return refs;
  }
  insertEvent(event: Event, time: string, receipt: string): void {
    const e = event.experimentId, r = event.runId;
    this.run('INSERT INTO events(experiment_id,run_id,event_id,source_sequence,event_type,event_hash,body_json,received_at,receipt_id) VALUES(?,?,?,?,?,?,?,?,?)',e,r,event.eventId,event.sourceSequence,event.type,canonicalHash(event),JSON.stringify(event),time,receipt);
    for (const key of recordKeys(event)) {
      const [kind,id,version] = key.split(':');
      this.run('INSERT INTO records VALUES(?,?,?,?,?,?)',e,r,kind!,id!,Number(version),event.eventId);
    }
    for (const ref of this.dependencies(event)) this.run('INSERT OR IGNORE INTO record_links VALUES(?,?,?,?,?,?,?)',e,r,event.eventId,ref.kind,ref.id,ref.version,ref.relation);
    const project = (kind:string,id:string):void => {
      const prior=this.get<{source_sequence:string}>('SELECT source_sequence FROM projections p JOIN events e ON e.experiment_id=p.experiment_id AND e.run_id=p.run_id AND e.event_id=p.event_id WHERE p.experiment_id=? AND p.run_id=? AND projection=? AND identity=?',e,r,kind,id);
      const current=this.get<{body_json:string}>('SELECT e.body_json FROM projections p JOIN events e ON e.experiment_id=p.experiment_id AND e.run_id=p.run_id AND e.event_id=p.event_id WHERE p.experiment_id=? AND p.run_id=? AND projection=? AND identity=?',e,r,kind,id);
      const old=current?JSON.parse(current.body_json) as Event:undefined;
      const newer=event.type==='decision.published'&&old?.type==='decision.published'?event.payload.proposal.revision>old.payload.proposal.revision:event.type==='portfolio.snapshot'&&old?.type==='portfolio.snapshot'?event.payload.revision>old.payload.revision:event.type==='paper.order'&&old?.type==='paper.order'?event.payload.revision>old.payload.revision:!prior||BigInt(event.sourceSequence)>BigInt(prior.source_sequence);
      if(newer)this.run('INSERT INTO projections VALUES(?,?,?,?,?) ON CONFLICT(experiment_id,run_id,projection,identity) DO UPDATE SET event_id=excluded.event_id',e,r,kind,id,event.eventId);
    };
    switch(event.type) {
      case 'run.status': project('run_status','current'); break;
      case 'team.published': project('team','current'); break;
      case 'worker.activity': project('worker_activity',event.payload.workerId); break;
      case 'discussion.opened': project('discussion',event.payload.discussionId); break;
      case 'discussion.closed': project('discussion_closure',event.payload.discussionId); break;
      case 'discussion.contribution': this.run('INSERT INTO discussion_ordinals VALUES(?,?,?,?,?,?)',e,r,event.payload.discussionId,event.payload.ordinal,event.payload.contributionId,event.eventId); break;
      case 'decision.published': project('decision',event.payload.proposal.decisionId); break;
      case 'review.published': project('review',event.payload.reviewId); break;
      case 'paper.order': {
        const o=event.payload;
        this.run('INSERT OR IGNORE INTO order_identities VALUES(?,?,?,?,?,?)',e,r,o.orderId,o.decisionId,o.decisionRevision,o.orderIndex);
        project('order',o.orderId); break;
      }
      case 'paper.ledger_transaction': this.run('INSERT INTO financial_journal VALUES(?,?,?,?,?,?)',e,r,event.payload.journalSequence,event.payload.sourceOperationId,event.payload.journalHash,event.eventId); break;
      case 'portfolio.snapshot': {
        const s=event.payload;
        this.run('INSERT OR IGNORE INTO valuations VALUES(?,?,?,?)',e,r,s.valuationId,s.valuationSequence);
        this.run('INSERT INTO snapshots VALUES(?,?,?,?,?,?)',e,r,s.valuationId,s.revision,s.journalSequence,event.eventId);
        project('valuation',s.valuationId); break;
      }
      case 'artifact.registered': project('artifact_registry',event.payload.artifactId); break;
      case 'artifact.published': this.run('INSERT INTO artifact_versions VALUES(?,?,?,?,?,?,?)',e,r,event.payload.artifactId,event.payload.version,event.payload.sha256,event.payload.contentType,event.eventId); break;
    }

  }
  /** Private operator-only foundation; public/publisher routes cannot invoke withdrawal. */
  hide(experiment: string, run: string, eventId: string, visibility: 'withheld'|'withdrawn', now: string): void {
    this.atomic(() => {
      need(this.get('SELECT 1 FROM events WHERE experiment_id=? AND run_id=? AND event_id=?',experiment,run,eventId),'NOT_FOUND');
      this.run('INSERT INTO visibility_actions(experiment_id,run_id,event_id,visibility,recorded_at) VALUES(?,?,?,?,?)',experiment,run,eventId,visibility,now);
      this.run('UPDATE archive_meta SET visibility_epoch=visibility_epoch+1,revision=revision+1 WHERE id=1');
    });
  }
  fenceRestore(now: string): void {
    this.atomic(()=>{
      for(const p of this.all<{publisher_id:string;scope_json:string;generation:string}>('SELECT * FROM publishers')) {
        const scope=JSON.parse(p.scope_json) as PublisherScope;scope.enabled=false;
        scope.generation=String(BigInt(p.generation)+1n);
        this.run('UPDATE publishers SET scope_json=?,generation=? WHERE publisher_id=?',JSON.stringify(scope),scope.generation,p.publisher_id);
        this.run('INSERT INTO authority_audit(recorded_at,publisher_id,action) VALUES(?,?,?)',now,p.publisher_id,'restore fenced; reconcile before new keys');
      }
      this.run('UPDATE publisher_keys SET revoked=1');this.run('DELETE FROM publication_approvals');this.resetEpoch();
    });
  }
  resetEpoch(): void { this.atomic(() => { this.run('UPDATE archive_meta SET epoch=?,revision=revision+1 WHERE id=1',randomUUID()); this.run('DELETE FROM cursors'); }); }
  close(): void { this.db.close(); }
}
