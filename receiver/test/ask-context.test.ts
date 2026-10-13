import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { askHarness } from './ask-helpers.js';
import { contextVerifier } from '../src/ask/context.js';
import { examples,clone } from './helpers.js';
import type { ContextRef,RecordDetail } from '../vendor/investment/v1/types.js';

test('archive lookup requires consistent exact-record visibility and a final witness',async t=>{
  const h=await askHarness(t);let requestCount=0,mode:'stable'|'bad-header'|'change'|'wrong-record'='stable';
  const dto=clone(examples.RecordDetail) as RecordDetail;
  const server=createServer((req,res)=>{
    requestCount++;assert.equal(req.headers.host,'archive.test');
    let fingerprint='a'.repeat(64);if(mode==='bad-header')fingerprint='unchecked';if(mode==='change'&&requestCount>1)fingerprint='b'.repeat(64);
    res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'private, no-store','X-Archive-Visibility':fingerprint});
    res.end(JSON.stringify(mode==='wrong-record'?{...dto,runId:'foreign-run'}:dto));
  });await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise<void>(resolve=>server.close(()=>resolve())));
  const verify=contextVerifier({...h.cfg,archiveOrigin:`http://127.0.0.1:${(server.address() as {port:number}).port}`,archiveAuthority:'archive.test'});
  const ref:ContextRef={experimentId:dto.experimentId,runId:dto.runId,record:dto.record};
  assert.equal(await verify([ref,ref]),true);assert.equal(requestCount,2);
  for(const bad of ['bad-header','change','wrong-record'] as const){mode=bad;requestCount=0;assert.equal(await verify([ref]),false,bad);}
});
