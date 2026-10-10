import test from 'node:test';
import assert from 'node:assert/strict';
import {harness,prefix,clone} from './helpers.js';
import {showcaseFixture} from './showcase-fixture.js';
import {sha256,validate} from '../src/schema.js';
import type {Event,EventBatch,EventPage,PerformancePage} from '../vendor/investment/v1/types.js';
import {Controls} from '../src/controls.js';
async function seed(h:Awaited<ReturnType<typeof harness>>){
 const f=showcaseFixture();
 h.setClock(Math.floor(Date.parse('2026-01-21T00:00:00Z')/1000));h.scope.keyId='showcase-test-key';h.key.notBefore=h.now()-3600;h.key.notAfter=h.now()+86400;h.receiver.db.authorize(h.scope,h.key,'2026-01-21T00:00:00Z');
 for(const c of f.content){assert.equal(sha256(c.text),c.sha256);assert.equal((await h.send(h.signed('PUT',prefix+'/content/'+c.sha256,Buffer.from(c.text),'showcase-'+c.sha256.slice(0,10),c.contentType))).status,201);}
 for(let i=0;i<f.batch.events.length;i+=50){const r=await h.batch({...f.batch,batchId:'seed-'+i,events:f.batch.events.slice(i,i+50) as EventBatch['events']});assert.equal(r.status,201,r.raw);}
 return f;
}
test('showcase is deterministic, signed, contract-valid, arithmetically consistent and visibly synthetic',async t=>{
 assert.deepEqual(showcaseFixture(),showcaseFixture());const h=await harness(t),f=await seed(h);
 assert.ok(f.batch.events.every(e=>e.evidenceMode==='synthetic_fixture'));
 const p=(await h.get(prefix+'/performance?limit=100')).body as unknown as PerformancePage;validate('PerformancePage',p);
 assert.ok(p.items.some(s=>s.equity===null));assert.ok(p.items.some(s=>Number(s.totalReturn)<0));assert.ok(p.items.some(s=>Number(s.totalReturn)>0));assert.ok(p.items.some(s=>s.revision===2));
 assert.equal((await h.get(prefix+'/status')).body.state,'ended');
 const snapshot=(await h.get(prefix+'/snapshot')).body.snapshot as {equity:string};assert.equal(snapshot.equity,'992.000000');
 const journal=await h.get(prefix+'/transactions?limit=100');assert.match(journal.raw,/"cancelled"/);assert.match(journal.raw,/"expired"/);
 h.setClock(h.now()+86400*4);assert.equal(((await h.get(prefix+'/status')).body.freshness as {status:string}).status,'stale');
 new Controls(h.receiver.db).registry('fixture-experiment','fixture-run','fixture-artifact','withdrawn','2026-01-21T00:00:00Z');
 const cards=await h.get(prefix+'/artifacts');assert.doesNotMatch(cards.raw,/Position note/);assert.equal((await h.get(prefix+'/artifacts/fixture-artifact/versions/1/content')).status,410);
});
test('latest event cursor stays bounded, sees appended records after page 100, and fails on withdrawal/expiry',async t=>{
 const h=await harness(t),f=await seed(h),witness=(await h.get(prefix+'/status')).headers['x-archive-visibility'];
 let seq=200;
 async function append(n:number){const events:Event[]=[];for(let i=0;i<n;i++){const e=clone(f.batch.events.find(e=>e.type==='worker.activity')!);if(e.type!=='worker.activity')throw Error();e.eventId='tail-event-'+seq;e.sourceSequence=String(seq++);e.payload.activityId=e.eventId;e.payload.summary='Synthetic bounded catch-up '+e.eventId;events.push(e);}const r=await h.batch({...f.batch,batchId:'append-'+seq,events:events as EventBatch['events']});assert.equal(r.status,201,r.raw);}
 await append(50);await append(50);assert.equal((await h.get(prefix+'/status')).headers['x-archive-visibility'],witness);
 const first=await h.get(prefix+'/events?limit=100');const cursor=String(first.headers['x-archive-latest-cursor']);assert.notEqual(cursor,'undefined');
 const tail=await h.get(prefix+'/events?limit=100&after='+cursor);const data=tail.body as unknown as EventPage;assert.equal(data.items.length,100);assert.equal(data.items.at(-1)!.event.eventId,'tail-event-299');assert.equal(data.nextCursor,null);
 await append(1);assert.equal(((await h.get(prefix+'/events?limit=100&after='+cursor)).body as unknown as EventPage).items.at(-1)!.event.eventId,'tail-event-299');
 const fresh=await h.get(prefix+'/events?limit=100');const latest=await h.get(prefix+'/events?limit=100&after='+fresh.headers['x-archive-latest-cursor']);assert.equal((latest.body as unknown as EventPage).items.at(-1)!.event.eventId,'tail-event-300');
 h.receiver.db.hide('fixture-experiment','fixture-run','tail-event-300','withdrawn','2026-01-21T00:00:00Z');assert.notEqual((await h.get(prefix+'/status')).headers['x-archive-visibility'],witness);assert.equal((await h.get(prefix+'/events?limit=100&after='+cursor)).body.code,'CURSOR_RESET');
 const next=await h.get(prefix+'/events?limit=100');h.setClock(h.now()+901);assert.equal((await h.get(prefix+'/events?limit=100&after='+next.headers['x-archive-latest-cursor'])).body.code,'CURSOR_RESET');
});
