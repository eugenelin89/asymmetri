import { randomBytes, randomUUID } from 'node:crypto';
import { mkdir, open, readFile, writeFile, lstat, realpath, unlink } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { AskStore, time, type QuestionRow } from './database.js';
import { AskLifecycle } from './lifecycle.js';
import { askConfig, type AskConfig } from './config.js';
import { canonicalHash, parseJson, requireContract as need, sha256, validate } from '../schema.js';
import type { AskControlReceipt } from '../../vendor/investment/v1/types.js';

interface ControlSnapshot { version: 1; serviceId: string; generation: string; capturedAt: string; controls: AskControlReceipt[] }
export function controlSnapshot(store: AskStore, now: number): ControlSnapshot {
  return { version: 1, serviceId: store.config.serviceId, generation: store.meta().generation, capturedAt: time(now),
    controls: store.all<{receipt_json:string}>('SELECT receipt_json FROM controls ORDER BY sequence').map(row => validate('AskControlReceipt', JSON.parse(row.receipt_json))) };
}

/** Explicit offline fence. Old sessions, authority, cursors and all private content are retired. */
export function fenceAsk(store: AskStore, now: number): void {
  store.atomic(() => {
    const before = store.meta(), lifecycle = new AskLifecycle(store);
    for (const row of store.all<QuestionRow>('SELECT * FROM questions')) {
      lifecycle.control(row.conversation_id, row.id, 'expire', now); lifecycle.purge(row.id);
    }
    store.run('UPDATE ask_meta SET held=1,generation=?,generation_expires=0,epoch=?,network_key=? WHERE id=1',
      String(BigInt(before.generation) + 1n), randomUUID(), randomBytes(32).toString('hex'));
    store.run('UPDATE service_keys SET revoked=1');
    store.run("UPDATE sessions SET deleted=1,secret_hash=lower(hex(randomblob(32)))");
    store.run("UPDATE conversations SET state='expired'");
    for (const table of ['session_creates','visitor_receipts','transport_receipts','nonces','barriers','control_cursors','conversation_cursors','control_delivery']) store.run(`DELETE FROM ${table}`);
    store.run('INSERT INTO owner_audit(action,target_hash,recorded_at) VALUES(?,?,?)', 'Ask recovery fence', canonicalHash({generation:before.generation,epoch:before.epoch}), time(now));
    store.touch(); store.markPurge();
  });
}

/** Owner supplies a separately retained CURRENT non-content journal, never the stale backup's journal. */
export function reconcileAsk(store: AskStore, value: unknown, expectedDigest: string, now: number): void {
  need(store.meta().held && canonicalHash(value) === expectedDigest, 'CONFLICT');
  need(value !== null && typeof value === 'object'); const input = value as ControlSnapshot;
  need(Object.keys(input).sort().join(',') === 'capturedAt,controls,generation,serviceId,version' && input.version === 1 && input.serviceId === store.config.serviceId);
  validate('Sequence', input.generation); validate('Time', input.capturedAt);
  // A newly fenced backup has generation N+1; restore fences it again to N+2.
  need(BigInt(input.generation) >= BigInt(store.meta().generation) - 2n &&
    Date.parse(input.capturedAt) <= now * 1000 && Date.parse(input.capturedAt) >= (now - 300) * 1000, 'CONFLICT');
  need(Array.isArray(input.controls) && input.controls.length <= 50000);
  const ids = new Set<string>();
  for (const receipt of input.controls) {
    validate('AskControlReceipt', receipt); need(!ids.has(receipt.controlId)); ids.add(receipt.controlId);
    need(Date.parse(receipt.effectiveAt) <= Date.parse(input.capturedAt) && Date.parse(receipt.suppressionUntil) > Date.parse(receipt.effectiveAt));
  }
  store.atomic(() => {
    for (const receipt of input.controls) {
      const old = store.get<{receipt_json:string}>('SELECT receipt_json FROM controls WHERE id=?', receipt.controlId);
      if (old) { need(canonicalHash(JSON.parse(old.receipt_json)) === canonicalHash(receipt), 'CONFLICT'); continue; }
      if (Date.parse(receipt.suppressionUntil) <= now * 1000) continue;
      store.space(8192, true);
      store.run('INSERT INTO controls(id,conversation_id,question_id,action,receipt_json,expires) VALUES(?,?,?,?,?,?)',
        receipt.controlId, receipt.conversationId, receipt.questionId, receipt.action, JSON.stringify(receipt), Date.parse(receipt.suppressionUntil) / 1000);
    }
    // Restored content was purged by fencing, including questions missing from this journal.
    const floor = BigInt(store.meta().generation) > BigInt(input.generation) ? BigInt(store.meta().generation) : BigInt(input.generation);
    const generation = validate<string>('Sequence', String(floor + 1n));
    store.run('UPDATE ask_meta SET held=0,generation=?,generation_expires=0 WHERE id=1', generation);
    store.run('INSERT INTO owner_audit(action,target_hash,recorded_at) VALUES(?,?,?)', 'Ask current controls reconciled; authority remains revoked', expectedDigest, time(now));
    store.touch();
  });
}

async function syncFile(path: string): Promise<void> { const file = await open(path, 'r'); try { await file.sync(); } finally { await file.close(); } }
async function privateDestination(config: AskConfig, destination: string): Promise<string> {
  const absolute = resolve(destination), root = join(await realpath(dirname(absolute)), basename(absolute));
  for (const source of [config.dataDir, config.publicArchiveDir]) {
    const path = relative(source, root); need(path === '..' || path.startsWith('..' + sep));
  }
  await mkdir(root, {mode:0o700}); return root;
}
export async function backupAsk(store: AskStore, destination: string, now: number): Promise<string> {
  const root = await privateDestination(store.config, destination);
  await writeFile(join(root, 'INCOMPLETE'), 'Unverified private recovery copy.\n', {mode:0o600,flag:'wx'});
  await syncFile(root);
  // Copy only a fixed non-content projection. Even interrupted copies contain no raw text.
  const config = askConfig({...store.config,dataDir:root,enabled:false,admissionEnabled:false,claimsEnabled:false,deliveryEnabled:false});
  const snapshot = new AskStore(config);
  try {
    store.atomic(() => snapshot.atomic(() => {
      snapshot.run('DELETE FROM ask_meta');
      for (const table of ['ask_meta','sessions','conversations','questions','answers','controls','owner_audit']) {
        const columns = store.all<{name:string}>(`PRAGMA table_info(${table})`).map(row => row.name);
        const projection = columns.map(name => ['question_json','status_json','context_json','answer_json'].includes(name) ? `NULL AS ${name}` :
          table === 'sessions' && name === 'secret_hash' ? 'lower(hex(randomblob(32))) AS secret_hash' : name).join(',');
        for (const row of store.all<Record<string,string|number|null>>(`SELECT ${projection} FROM ${table}`)) {
          snapshot.run(`INSERT INTO ${table}(${columns.join(',')}) VALUES(${columns.map(() => '?').join(',')})`, ...columns.map(name => row[name]!));
        }
      }
    }));
    fenceAsk(snapshot, now); snapshot.checkpoint();
  } finally { snapshot.close(); }
  await writeFile(join(root, 'config.json'), JSON.stringify(config), {mode:0o600,flag:'wx'});
  const manifest = {version:1,createdAt:time(now),serviceId:config.serviceId,files:{
    'ask.sqlite':sha256(await readFile(join(root, 'ask.sqlite'))), 'config.json':sha256(await readFile(join(root, 'config.json'))) }};
  await writeFile(join(root, 'manifest.json'), JSON.stringify(manifest), {mode:0o600,flag:'wx'});
  for (const name of ['ask.sqlite','config.json','manifest.json']) await syncFile(join(root,name));
  await unlink(join(root, 'INCOMPLETE')); await syncFile(root); return canonicalHash(manifest);
}

/** Caller stops the service and uses an empty isolated destination. Every restored session is invalid. */
export async function restoreAsk(source: string, destination: string, expectedDigest: string, now: number, publicArchiveDir?: string): Promise<AskConfig> {
  const root = await realpath(source), files: Record<string, Buffer> = {};
  try { await lstat(join(root, 'INCOMPLETE')); need(false, 'UNAVAILABLE'); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  for (const name of ['manifest.json','config.json','ask.sqlite']) {
    const stat = await lstat(join(root,name)); need(stat.isFile() && !stat.isSymbolicLink() && stat.nlink === 1 && stat.size <= 67108864, 'UNAVAILABLE');
    files[name] = await readFile(join(root,name));
  }
  const manifest = parseJson(files['manifest.json']!, 65536) as {version:number;serviceId:string;files:Record<string,string>};
  need(manifest.version === 1 && canonicalHash(manifest) === expectedDigest && Object.keys(manifest.files).sort().join(',') === 'ask.sqlite,config.json', 'CONFLICT');
  for (const name of Object.keys(manifest.files)) need(sha256(files[name]!) === manifest.files[name], 'CONFLICT');
  const saved = parseJson(files['config.json']!, 65536) as AskConfig;
  const original = askConfig({...saved,dataDir:root,publicArchiveDir:publicArchiveDir ?? saved.publicArchiveDir});
  need(original.serviceId === manifest.serviceId && !original.enabled);
  const target = await privateDestination(original, destination);
  await writeFile(join(target,'RESTORE_INCOMPLETE'), 'Restored Ask is held until fencing and current privacy reconciliation.\n', {mode:0o600,flag:'wx'}); await syncFile(target);
  await writeFile(join(target,'ask.sqlite'), files['ask.sqlite']!, {mode:0o600,flag:'wx'});
  const config = askConfig({...original,dataDir:target,enabled:false,admissionEnabled:false,claimsEnabled:false,deliveryEnabled:false});
  const store = new AskStore(config);
  try {
    need(JSON.stringify(store.db.pragma('integrity_check')) === '[{"integrity_check":"ok"}]' && JSON.stringify(store.db.pragma('foreign_key_check')) === '[]', 'UNAVAILABLE');
    fenceAsk(store,now); store.checkpoint();
  } finally { store.close(); }
  await writeFile(join(target,'config.json'), JSON.stringify(config), {mode:0o600,flag:'wx'});
  await syncFile(join(target,'config.json')); await syncFile(join(target,'ask.sqlite')); await unlink(join(target,'RESTORE_INCOMPLETE')); await syncFile(target); return config;
}
