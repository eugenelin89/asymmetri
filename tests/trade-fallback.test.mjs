import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const origin=process.env.TRADE_TEST_ORIGIN;
assert.ok(origin,'Set TRADE_TEST_ORIGIN to the local compatibility fallback with synthetic archive.');
assert.ok(['127.0.0.1','localhost','[::1]'].includes(new URL(origin).hostname));
const prefixes=['/botsquad/investment','/botsquad/trade'];
const request=(path,options={})=>fetch(new URL(path,origin),{redirect:'manual',signal:AbortSignal.timeout(30000),...options});
const pages=['','/guide','/hq-guide','/methodology?run=fixture-run','/runs/fixture-run','/discussions/fixture-discussion?run=fixture-run','/decisions/fixture-decision?run=fixture-run','/records/valuation/fixture-valuation/versions/1?run=fixture-run','/artifacts/fixture-artifact/versions/1?run=fixture-run'];

test('compatibility fallback directly serves both bookmarked route families without redirects',async()=>{
 for(const suffix of pages)for(const prefix of prefixes){
  const response=await request(prefix+suffix);assert.equal(response.status,200,prefix+suffix);assert.equal(response.headers.get('location'),null);
  const body=await response.text();assert.ok(body.includes('BotSquad navigation'));assert.ok(body.includes('content="noindex, nofollow"'));
  if(suffix.includes('fixture-run'))assert.ok(body.includes('fixture-run'));
 }
});

test('fallback preserves nested reads, unavailable responses and exact download bytes/security headers',async()=>{
 for(const suffix of ['/read?resource=status&run=fixture-run','/read?resource=events%3Flimit%3D20&run=fixture-run','/read?resource=invalid&run=fixture-run','/artifacts/fixture-artifact/versions/1/content?run=fixture-run','/artifacts/missing/versions/1/content?run=fixture-run']){
  const [old,current]=await Promise.all(prefixes.map(p=>request(p+suffix)));assert.equal(old.status,current.status);assert.equal(current.headers.get('location'),null);
  for(const name of ['content-type','content-disposition','cache-control','content-security-policy','x-content-type-options','referrer-policy'])assert.equal(current.headers.get(name),old.headers.get(name));
  const bytes=Buffer.from(await current.arrayBuffer());assert.deepEqual(bytes,Buffer.from(await old.arrayBuffer()));
  if(suffix.includes('/fixture-artifact/')){
   assert.equal(current.status,200);assert.match(current.headers.get('content-disposition'),/^attachment;/);
   const detail=await request('/botsquad/trade/artifacts/fixture-artifact/versions/1?run=fixture-run');
   const hash=(await detail.text()).match(/<dt>SHA-256<\/dt><dd><code>([a-f0-9]{64})<\/code>/)?.[1];assert.ok(hash);assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);
  }
 }
});

test('fallback preserves HEAD and rejects writes in both namespaces',async()=>{
 for(const prefix of prefixes)for(const suffix of ['/read?resource=status&run=fixture-run','/artifacts/fixture-artifact/versions/1/content?run=fixture-run']){
  const head=await request(prefix+suffix,{method:'HEAD'});assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0);
  for(const method of ['POST','PUT','PATCH','DELETE'])assert.equal((await request(prefix+suffix,{method})).status,405);
 }
});
