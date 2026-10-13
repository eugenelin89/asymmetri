import { AskStore } from './database.js';
import { AskAuthority, type AskAuth } from './auth.js';
import { requireContract as need, sha256, validate } from '../schema.js';

export class AskTransport {
  constructor(readonly store: AskStore, readonly now: () => number, readonly authority: AskAuthority) {}
  id(auth: AskAuth): string { return validate('Id', new Map(auth.message.headers).get('idempotency-key')); }
  prior<T>(auth: AskAuth): T | undefined {
    this.authority.recheck(auth);
    const row = this.store.get<{digest:string;response_json:string|null}>(
      'SELECT digest,response_json FROM transport_receipts WHERE generation=? AND target=? AND request_id=?',
      auth.scope.consumerGeneration, auth.message.method + ' ' + auth.message.path, this.id(auth));
    if (!row) return undefined;
    need(row.digest === sha256(auth.message.body), 'CONFLICT');
    need(row.response_json, 'EXPIRED');
    return JSON.parse(row.response_json) as T;
  }
  save(auth: AskAuth, questionId: string | null, result: unknown): void {
    this.authority.recheck(auth);
    const count = this.store.get<{n:number}>('SELECT count(*) n FROM transport_receipts')!.n;
    const reconcile = auth.permission === 'control_sync' || auth.permission === 'receipt' ||
      (typeof result === 'object' && result !== null && 'answerDigest' in result && 'receiptId' in result);
    need(count < (reconcile ? 50000 : 40000), 'BUDGET_EXHAUSTED');
    this.store.space(Buffer.byteLength(JSON.stringify(result)) + 4096, reconcile);
    this.store.run('INSERT INTO transport_receipts VALUES(?,?,?,?,?,?,?,?)', auth.key.key_id,
      auth.scope.consumerGeneration, auth.message.method + ' ' + auth.message.path, this.id(auth),
      sha256(auth.message.body), questionId, JSON.stringify(result), this.now() + this.store.config.limits.suppressionRetentionSeconds);
  }
}
