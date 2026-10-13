import { randomUUID } from 'node:crypto';
import type { AskControlReceipt, AskControlSync, AskControlSyncInput } from '../../vendor/investment/v1/types.js';
import { parseJson, requireContract as need, validate } from '../schema.js';
import { AskStore, time } from './database.js';
import { AskAuthority, type AskAuth } from './auth.js';
import { AskTransport } from './transport.js';

export class AskSync {
  constructor(readonly store: AskStore, readonly now: () => number,
    readonly authority: AskAuthority, readonly transport: AskTransport) {}
  watermark(): number { return this.store.get<{seq:number}>("SELECT seq FROM sqlite_sequence WHERE name='controls'")?.seq ?? 0; }

  sync(auth: AskAuth): AskControlSync {
    const input = validate<AskControlSyncInput>('AskControlSyncInput', parseJson(auth.message.body, 262144));
    need(input.serviceId === auth.scope.serviceId && input.consumerGeneration === auth.scope.consumerGeneration, 'FORBIDDEN');
    need(input.syncId === this.transport.id(auth) && new Set(input.acknowledgedControlIds).size === input.acknowledgedControlIds.length, 'CONFLICT');
    return this.store.atomic(() => {
      const prior = this.transport.prior<AskControlSync>(auth); if (prior) return prior;
      const generation = auth.scope.consumerGeneration, epoch = this.store.meta().epoch, now = this.now();
      let watermark = this.watermark(), after = 0;
      if (input.after) {
        const cursor = this.store.get<{generation:string;epoch:string;watermark:number;after_sequence:number;expires:number}>('SELECT * FROM control_cursors WHERE id=?', input.after);
        need(cursor && cursor.generation === generation && cursor.epoch === epoch && cursor.expires > now, 'CURSOR_RESET');
        watermark = cursor.watermark; after = cursor.after_sequence;
      }
      for (const id of input.acknowledgedControlIds) {
        need(this.store.get('SELECT 1 FROM control_delivery WHERE generation=? AND control_id=?', generation, id), 'CONFLICT');
        this.store.run('UPDATE control_delivery SET acknowledged=1 WHERE generation=? AND control_id=?', generation, id);
      }
      const rows = this.store.all<{sequence:number;id:string;receipt_json:string}>(
        'SELECT c.* FROM controls c LEFT JOIN control_delivery d ON d.control_id=c.id AND d.generation=? WHERE c.sequence>? AND c.sequence<=? AND coalesce(d.acknowledged,0)=0 ORDER BY c.sequence LIMIT 100', generation, after, watermark);
      let nextCursor: string | null = null;
      if (rows.length) {
        for (const row of rows) this.store.run('INSERT OR IGNORE INTO control_delivery VALUES(?,?,0)', generation, row.id);
        need(this.store.get<{n:number}>('SELECT count(*) n FROM control_cursors')!.n < 1000, 'RATE_LIMITED');
        nextCursor = randomUUID();
        this.store.run('INSERT INTO control_cursors VALUES(?,?,?,?,?,?)', nextCursor, generation, epoch, watermark, rows.at(-1)!.sequence, now + 300);
      } else {
        need(!this.store.get('SELECT 1 FROM controls c LEFT JOIN control_delivery d ON d.control_id=c.id AND d.generation=? WHERE c.sequence<=? AND coalesce(d.acknowledged,0)=0 LIMIT 1', generation, watermark), 'CONFLICT');
        // A new control during pagination requires a fresh traversal, never a stale barrier.
        need(watermark === this.watermark(), 'CURSOR_RESET');
        this.store.run('INSERT INTO barriers VALUES(?,?,?,?,?,?)', input.syncId, generation, epoch, watermark, now, now + this.store.config.limits.controlFreshnessSeconds);
      }
      const result = validate<AskControlSync>('AskControlSync', { schemaVersion: '1.0', syncId: input.syncId,
        controls: rows.map(row => validate<AskControlReceipt>('AskControlReceipt', JSON.parse(row.receipt_json))),
        nextCursor, checkedAt: time(now), validUntil: time(now + this.store.config.limits.controlFreshnessSeconds) });
      this.transport.save(auth, null, result); return result;
    });
  }

  barrier(auth: AskAuth, id: string): void {
    const row = this.store.get<{generation:string;epoch:string;watermark:number;checked_at:number;valid_until:number}>('SELECT * FROM barriers WHERE id=?', id);
    need(row && row.generation === auth.scope.consumerGeneration && row.epoch === this.store.meta().epoch &&
      row.checked_at <= this.now() && row.valid_until > this.now() &&
      this.now() - row.checked_at <= this.store.config.limits.controlFreshnessSeconds &&
      row.watermark === this.watermark(), 'CONFLICT');
  }
}
