import Database from 'better-sqlite3';
import { chmodSync, lstatSync, readFileSync, statfsSync } from 'node:fs';
import { createHmac, randomBytes, randomUUID } from 'node:crypto';
import { join } from 'node:path';
import type { AskConfig } from './config.js';
import { requireContract as need, sha256 } from '../schema.js';

type SQL = string | number | bigint | Buffer | null;
export interface AskMeta { service_id: string; epoch: string; generation: string; generation_expires: number; held: number; revision: number; network_key: string }
export interface SessionRow { id: string; secret_hash: string; created_at: string; expires: number; privacy_version: string; deleted: number }
export interface ConversationRow { id: string; session_id: string; created_at: string; expires: number; state: 'open' | 'closed' | 'deleted' | 'expired' }
export interface QuestionRow {
  ordinal: number; id: string; session_id: string; conversation_id: string; question_hash: string;
  question_json: string | null; status_json: string | null; state: string; received_at: string;
  expires: number; raw_until: number; suppression_until: number; suppression: string | null;
  answer_id: string | null; context_json: string | null;
}
export const time = (seconds: number): string => new Date(seconds * 1000).toISOString();

export class AskStore {
  readonly db: Database.Database;
  private purgePending = true;
  constructor(readonly config: AskConfig) {
    const path = join(config.dataDir, 'ask.sqlite');
    for (const file of [path, path + '-wal', path + '-shm']) {
      try { const stat = lstatSync(file); need(stat.isFile() && !stat.isSymbolicLink() && stat.nlink === 1, 'UNAVAILABLE'); }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
    }
    this.db = new Database(path, { timeout: 1000 });
    chmodSync(path, 0o600);
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = FULL');
    this.db.pragma('secure_delete = ON');
    this.db.pragma('wal_autocheckpoint = 128');
    this.db.pragma('journal_size_limit = 2097152');
    this.db.pragma('max_page_count = 16384');
    const sql = readFileSync(new URL('../../../ask-migrations/001-private.sql', import.meta.url), 'utf8');
    this.atomic(() => {
      this.db.exec('CREATE TABLE IF NOT EXISTS ask_migrations (version INTEGER PRIMARY KEY, digest TEXT NOT NULL)');
      const rows = this.all<{ version: number; digest: string }>('SELECT * FROM ask_migrations ORDER BY version');
      need(rows.length <= 1 && (!rows.length || rows[0]!.version === 1 && rows[0]!.digest === sha256(sql)), 'UNAVAILABLE');
      if (!rows.length) {
        this.db.exec(sql);
        this.run('INSERT INTO ask_meta(id,service_id,epoch,network_key) VALUES(1,?,?,?)', config.serviceId, randomUUID(), randomBytes(32).toString('hex'));
        this.run('INSERT INTO ask_migrations VALUES(1,?)', sha256(sql));
      }
      need(this.meta().service_id === config.serviceId, 'CONFLICT');
    });
  }
  get<T>(sql: string, ...values: SQL[]): T | undefined { return this.db.prepare<SQL[], T>(sql).get(...values); }
  all<T>(sql: string, ...values: SQL[]): T[] { return this.db.prepare<SQL[], T>(sql).all(...values); }
  run(sql: string, ...values: SQL[]): Database.RunResult { return this.db.prepare(sql).run(...values); }
  atomic<T>(operation: () => T): T {
    const result = this.db.transaction(operation).immediate();
    if (!this.db.inTransaction && this.purgePending) this.checkpoint();
    return result;
  }
  markPurge(): void { this.purgePending = true; }
  checkpoint(): void {
    const result = this.db.pragma('wal_checkpoint(TRUNCATE)') as {busy:number}[];
    need(result.every(row => row.busy === 0), 'UNAVAILABLE');
    this.purgePending = false;
  }
  meta(): AskMeta { return this.get<AskMeta>('SELECT * FROM ask_meta WHERE id=1')!; }
  touch(): void { this.run('UPDATE ask_meta SET revision=revision+1 WHERE id=1'); }
  space(bytes = 65536, critical = false): void {
    const pageSize = Number(this.db.pragma('page_size', { simple: true }));
    const used = (Number(this.db.pragma('page_count', { simple: true })) - Number(this.db.pragma('freelist_count', { simple: true }))) * pageSize;
    const free = statfsSync(this.config.dataDir);
    need(used + bytes < (critical ? 63 : 56) * 1048576 && free.bavail * free.bsize > (critical ? 8 : 32) * 1048576 + bytes, 'BUDGET_EXHAUSTED');
  }
  charge(bucket: string, span: number, maximum: number, now: number): void {
    const period = Math.floor(now / span), count = this.get<{count:number}>('SELECT count FROM quotas WHERE bucket=? AND period=?', bucket, period)?.count ?? 0;
    need(count < maximum, 'RATE_LIMITED');
    this.run('INSERT INTO quotas VALUES(?,?,1,?) ON CONFLICT(bucket,period) DO UPDATE SET count=count+1', bucket, period, (period + 2) * span);
  }
  network(address: string, now: number): string {
    // Direct peer only; proxy traffic shares a conservative aggregate bucket. No forwarded IP trust.
    return createHmac('sha256', this.meta().network_key).update(String(Math.floor(now / 86400)) + ':' + address).digest('hex');
  }
  close(): void { this.db.close(); }
}
