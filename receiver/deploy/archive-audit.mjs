// Explicit offline audit. Prints schema/health/counts only, never bodies or credentials.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Archive } from '../dist/src/database.js';
import { loadConfig } from '../dist/src/config.js';
const cfg=loadConfig(process.env.ASYMMETRI_RECEIVER_CONFIG);
assert.equal(cfg.enabled,false);
const db=new Archive(cfg);
try {
 const migration=db.all('SELECT * FROM schema_migrations');
 const expected=['001-archive.sql','002-artifact-controls.sql'].map((name,index)=>({version:index+1,digest:createHash('sha256').update(readFileSync(new URL('../migrations/'+name,import.meta.url))).digest('hex')}));
 assert.deepEqual(migration,expected);
 const integrity=db.db.pragma('integrity_check'),foreignKeys=db.db.pragma('foreign_key_check');
 assert.deepEqual(integrity,[{integrity_check:'ok'}]);assert.deepEqual(foreignKeys,[]);
 const counts=Object.fromEntries(['publishers','publisher_keys','runs','events','batches','nonces','content_objects','publication_approvals','artifact_approvals','artifact_controls','denied_content','recovery_suppressions'].map(name=>[name,db.get(`SELECT count(*) n FROM ${name}`).n]));
 assert.ok(Object.values(counts).every(n=>n===0),'operational archive must be empty at INFRA-02 completion');
 console.log(JSON.stringify({sqlite:db.get('SELECT sqlite_version() version').version,migration,integrity,foreignKeys,counts,journalMode:db.db.pragma('journal_mode',{simple:true}),synchronous:db.db.pragma('synchronous',{simple:true}),foreignKeyEnforcement:db.db.pragma('foreign_keys',{simple:true})}));
} finally {db.close();}
