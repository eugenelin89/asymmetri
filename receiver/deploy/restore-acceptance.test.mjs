// Disposable stopped-service backup/restore proof; never reads operational state.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, rm, chmod, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { harness, golden, prefix } from '../dist/test/helpers.js';
import { Archive } from '../dist/src/database.js';
import { Storage } from '../dist/src/storage.js';
import { config } from '../dist/src/config.js';
import { Controls } from '../dist/src/controls.js';
import { canonicalHash } from '../dist/src/schema.js';
import { PublicReads } from '../dist/src/reads.js';

test('stopped complete archive backup restores hashes, receipts and newer withdrawals with fenced authority',async t=>{
  const h=await harness(t);await h.stage();assert.equal((await h.batch()).status,201);
  const beforeReceipt=(await h.batch()).body;
  const snapshot=golden.batch.events.find(e=>e.type==='portfolio.snapshot');
  h.receiver.db.hide('fixture-experiment','fixture-run',snapshot.eventId,'withdrawn',new Date(h.now()*1000).toISOString());
  // Stop admission and checkpoint/close before copying the complete archive, not just an active main file.
  await h.receiver.close();
  const backup=await mkdtemp(join(tmpdir(),'infra02-backup-'));await chmod(backup,0o700);
  const restore=await mkdtemp(join(tmpdir(),'infra02-restore-'));await chmod(restore,0o700);
  t.after(async()=>{await rm(backup,{recursive:true,force:true});await rm(restore,{recursive:true,force:true});});
  await cp(h.dir,backup,{recursive:true});
  async function manifest(root) {
    const result={};
    for(const entry of await readdir(root,{withFileTypes:true,recursive:true})) {
      if(entry.isFile()) {
        const path=join(entry.parentPath,entry.name);result[path.slice(root.length+1)]=createHash('sha256').update(await readFile(path)).digest('hex');
      }
    }
    return result;
  }
  const expected=await manifest(backup);await cp(backup,restore,{recursive:true});assert.deepEqual(await manifest(restore),expected);
  const db=new Archive(config({...h.cfg,enabled:false,dataDir:restore}));
  try {
    assert.deepEqual(db.db.pragma('integrity_check'),[{integrity_check:'ok'}]);assert.deepEqual(db.db.pragma('foreign_key_check'),[]);
    db.fenceRestore(new Date(h.now()*1000).toISOString());
    assert.equal(db.key(h.scope.keyId).revoked,1);assert.equal(JSON.parse(db.key(h.scope.keyId).scope_json).enabled,false);
    // A newer operator control receipt is reconciled before any read is exposed.
    const newer=golden.batch.events.find(e=>e.type==='discussion.contribution');
    assert.ok(newer);
    db.hide('fixture-experiment','fixture-run',newer.eventId,'withheld',new Date((h.now()+1)*1000).toISOString());
    const reads=new PublicReads(db,h.now);
    assert.throws(()=>reads.read(prefix+'/events',new URLSearchParams(),'fixture-experiment','fixture-run',['events']));
    const controls=new Controls(db),snapshot=controls.snapshot();controls.reconcile(snapshot,canonicalHash(snapshot),new Date(h.now()*1000).toISOString());
    assert.equal(reads.read(prefix+'/snapshot',new URLSearchParams(),'fixture-experiment','fixture-run',['snapshot']).body.snapshot,null);
    const events=reads.read(prefix+'/events',new URLSearchParams(),'fixture-experiment','fixture-run',['events']).body.items;
    assert.ok(!events.some(x=>[snapshot.eventId,newer.eventId].includes(x.event.eventId)));
    assert.deepEqual(JSON.parse(db.get('SELECT receipt_json FROM batches WHERE batch_id=?',golden.batch.batchId).receipt_json),beforeReceipt);
    const storage=new Storage(db);await storage.init();for(const item of golden.content)assert.equal((await storage.read(item.sha256,item.contentType,Buffer.byteLength(item.text))).toString(),item.text);
    assert.equal(db.get('SELECT count(*) n FROM events').n,27);
    assert.equal(db.get('SELECT count(*) n FROM publication_approvals').n,0);
  } finally {db.close();await h.restart();}
});
