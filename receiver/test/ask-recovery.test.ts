import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { askHarness,askPrefix as p } from './ask-helpers.js';
import { examples } from './helpers.js';
import { backupAsk,restoreAsk,controlSnapshot,reconcileAsk } from '../src/ask/recovery.js';
import { AskStore } from '../src/ask/database.js';
import { AskAuthority } from '../src/ask/auth.js';
import { canonicalHash } from '../src/schema.js';

test('cancellation checkpoints private content out of SQLite and WAL before acknowledging',async t=>{
  const h=await askHarness(t),marker='PRIVATE-SYNTHETIC-WAL-SENTINEL-4124',q=await h.ready({text:marker});
  assert.equal((await h.browser(q.session,'POST',`${p}/questions/${q.admission.questionId}/cancel`,examples.AskCancel)).status,200);
  for(const file of await readdir(h.cfg.dataDir))if(file.startsWith('ask.sqlite'))assert.equal((await readFile(join(h.cfg.dataDir,file))).includes(Buffer.from(marker)),false,file);
});

test('private recovery copies omit raw content and restore held with retired sessions and keys',async t=>{
  const h=await askHarness(t),marker='PRIVATE-SYNTHETIC-BACKUP-SENTINEL-8742',q=await h.ready({text:marker});
  const answer=await h.send(h.signed('POST',`${p}/hq/questions/${q.admission.questionId}/answer`,q.delivery));assert.equal(answer.status,200);
  const backup=join(h.root,'recovery'),digest=await backupAsk(h.service.store,backup,h.now());
  for(const file of await readdir(backup))assert.equal((await readFile(join(backup,file))).includes(Buffer.from(marker)),false,file);
  assert.ok(h.service.store.get<{question_json:string}>('SELECT question_json FROM questions')!.question_json.includes(marker));
  const cancel=await h.browser(q.session,'POST',`${p}/questions/${q.admission.questionId}/cancel`,examples.AskCancel);assert.equal(cancel.status,200);
  const current=controlSnapshot(h.service.store,h.now());
  const relocated=join(h.root,'relocated');await rename(backup,relocated);
  const cfg=await restoreAsk(relocated,join(h.root,'restored'),digest,h.now());
  assert.equal(JSON.parse(await readFile(join(cfg.dataDir,'config.json'),'utf8')).enabled,false);
  assert.equal(cfg.enabled,false);assert.equal(cfg.admissionEnabled,false);
  const restored=new AskStore(cfg);t.after(()=>restored.close());
  assert.equal(restored.meta().held,1);assert.equal(new AskAuthority(restored,h.now).available(),false);
  assert.equal(restored.get<{question_json:null}>('SELECT question_json FROM questions')!.question_json,null);
  assert.equal(restored.get<{deleted:number}>('SELECT deleted FROM sessions')!.deleted,1);
  assert.deepEqual(JSON.parse(restored.get<{receipt_json:string}>('SELECT receipt_json FROM answers')!.receipt_json),answer.body);
  assert.throws(()=>reconcileAsk(restored,current,'0'.repeat(64),h.now()));
  const stale={...current,capturedAt:new Date((h.now()-301)*1000).toISOString()};assert.throws(()=>reconcileAsk(restored,stale,canonicalHash(stale),h.now()));
  current.generation='100';
  reconcileAsk(restored,current,canonicalHash(current),h.now());assert.equal(restored.meta().generation,'101');assert.equal(restored.meta().held,0);
  assert.ok(restored.get('SELECT 1 FROM controls WHERE id=?',cancel.body.controlId as string));
  assert.equal(new AskAuthority(restored,h.now).available(),false);
  assert.equal(restored.get<{question_json:null}>('SELECT question_json FROM questions')!.question_json,null);
});
