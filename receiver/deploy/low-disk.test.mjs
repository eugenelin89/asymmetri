import test from 'node:test';
import assert from 'node:assert/strict';
import {writeFile,unlink,statfs} from 'node:fs/promises';
import {join} from 'node:path';
import {harness,golden,prefix} from '../dist/test/helpers.js';
test('small isolated tmpfs rejects admission while preserving accepted receipts',async t=>{
 assert.equal(process.env.TMPDIR,'/var/lib/inv03-lowdisk');const h=await harness(t);await h.stage();await h.batch();const n=h.receiver.db.get('SELECT count(*) n FROM events').n;
 const stats=await statfs(h.dir);assert.ok(stats.bsize*stats.blocks<=16*1024*1024);const fill=join(h.dir,'synthetic-disk-pressure');await writeFile(fill,Buffer.alloc(stats.bsize*stats.bavail-512*1024));
 try{const response=await h.send(h.signed('PUT',prefix+'/content/'+golden.content[0].sha256,Buffer.from(golden.content[0].text),'lowdisk-upload',golden.content[0].contentType));assert.equal(response.status,503,response.raw);assert.equal(h.receiver.db.get('SELECT count(*) n FROM events').n,n);}finally{await unlink(fill);}
 assert.equal((await h.send(h.signed('GET',prefix+'/receipts/'+golden.batch.batchId))).status,200);
});
