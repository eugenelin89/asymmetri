import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

// Explicit integration suite: use only the documented disposable fixture.
const origin=process.env.TRADE_TEST_ORIGIN;
assert.ok(origin,'Set TRADE_TEST_ORIGIN to the local synthetic website.');
assert.ok(['127.0.0.1','localhost','[::1]'].includes(new URL(origin).hostname));
const old='/botsquad/investment', current='/botsquad/trade';
const request=(path,options={})=>fetch(new URL(path,origin),{redirect:'manual',signal:AbortSignal.timeout(30000),...options});
const query='?run=fixture-run';
const pages=['','/guide','/hq-guide','/methodology'+query,'/runs/fixture-run','/discussions/fixture-discussion'+query,'/decisions/fixture-decision'+query,'/records/valuation/fixture-valuation/versions/1'+query,'/artifacts/fixture-artifact/versions/1'+query];

async function redirected(suffix,method='GET') {
 const response=await request(old+suffix,{method});assert.equal(response.status,308,old+suffix);
 const target=new URL(response.headers.get('location'),origin),expected=new URL(current+suffix,origin);
 assert.equal(target.pathname,expected.pathname);assert.deepEqual([...target.searchParams],[...expected.searchParams]);assert.equal(target.hash,'');
 return target.pathname+target.search;
}

test('every public page redirects once, renders the canonical Trade URL and retains run context',async()=>{
 for(const suffix of pages){
  const target=await redirected(suffix),response=await request(target);assert.equal(response.status,200,target);assert.equal(response.headers.get('location'),null);
  const body=await response.text(),expected=new URL(target,origin);
  assert.ok(body.includes('content="noindex, nofollow"'),target);
  assert.ok(body.includes('href="https://asymmetri.co'+expected.pathname+expected.search+'"'),target+' canonical');
  assert.ok(body.includes('property="og:url" content="https://asymmetri.co'+expected.pathname+expected.search+'"'),target+' OG');
  assert.ok(!body.includes('href="/botsquad/investment'),target+' authored link');
 }
});

test('redirects retain empty and duplicate values, encoded nested queries and unrelated parameters',async()=>{
 for(const suffix of ['?run=fixture-run&empty=&flag&repeat=one&repeat=two','/discussions/fixture-discussion?after=a_b-2&run=fixture-run','/read?resource=events%3Flimit%3D20%26after%3Da_b-2&run=fixture-run','/read?resource=status&resource=snapshot&run=fixture-run','/artifacts/fixture-artifact/versions/1/content?display=1&run=fixture-run'])await redirected(suffix);
});

test('read projection and exact downloads preserve results, bytes and security headers',async()=>{
 for(const suffix of ['/read?resource=status&run=fixture-run','/read?resource=events%3Flimit%3D20&run=fixture-run','/read?resource=invalid&run=fixture-run','/artifacts/fixture-artifact/versions/1/content?run=fixture-run','/artifacts/missing/versions/1/content?run=fixture-run']){
  const target=await redirected(suffix),direct=await request(target),followed=await fetch(new URL(old+suffix,origin),{signal:AbortSignal.timeout(30000)});
  assert.equal(followed.url,new URL(target,origin).href);assert.equal(followed.status,direct.status);
  for(const name of ['content-type','content-disposition','cache-control','content-security-policy','x-content-type-options','referrer-policy'])assert.equal(followed.headers.get(name),direct.headers.get(name),name);
  const directBytes=Buffer.from(await direct.arrayBuffer()),oldBytes=Buffer.from(await followed.arrayBuffer());assert.deepEqual(oldBytes,directBytes);
  if(suffix.includes('/fixture-artifact/')){
   assert.equal(direct.status,200);assert.match(direct.headers.get('content-disposition'),/^attachment;/);
   const detail=await request(current+'/artifacts/fixture-artifact/versions/1?run=fixture-run');
   const publishedHash=(await detail.text()).match(/<dt>SHA-256<\/dt><dd><code>([a-f0-9]{64})<\/code>/)?.[1];
   assert.ok(publishedHash,'The exact artifact page must publish its content hash.');
   assert.equal(createHash('sha256').update(directBytes).digest('hex'),publishedHash);
  }
 }
});

test('HEAD and unsupported methods keep their original semantics after a 308',async()=>{
 for(const suffix of ['/read?resource=status&run=fixture-run','/artifacts/fixture-artifact/versions/1/content?run=fixture-run']){
  const target=await redirected(suffix,'HEAD'),head=await request(target,{method:'HEAD'});assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0);
  for(const method of ['POST','PUT','PATCH','DELETE']){
   await redirected(suffix,method);const response=await request(current+suffix,{method});assert.equal(response.status,405);
  }
  const options=await request(current+suffix,{method:'OPTIONS'});assert.equal(options.status,204);assert.match(options.headers.get('allow'),/GET/);
 }
});

test('unknown paths remain 404 and near-prefix routes do not redirect',async()=>{
 const unknown='/not-a-public-route';await redirected(unknown);assert.equal((await request(current+unknown)).status,404);
 for(const path of ['/botsquad/investments','/botsquad/investment-extra','/botsquad/trades']){const r=await request(path);assert.equal(r.status,404);assert.equal(r.headers.get('location'),null);}
});

test('existing trailing-slash normalization is bounded and never loops',async()=>{
 for(const suffix of ['/','/guide/','/hq-guide/','/artifacts/fixture-artifact/versions/1/content/?run=fixture-run']){
  let path=old+suffix;const seen=new Set();let hops=0;
  for(;;){assert.ok(!seen.has(path),'Redirect loop');seen.add(path);const r=await request(path);if(r.status!==308){assert.equal(r.status,200);break;}
   hops++;assert.ok(hops<=2);path=new URL(r.headers.get('location'),origin).pathname+new URL(r.headers.get('location'),origin).search;
  }
  assert.ok(path.startsWith(current));
 }
});

test('rendered internal navigation and guide anchors resolve without broken links',async()=>{
 const queue=['/','/sports','/labs','/botsquad','/botsquad/research','/botsquad/ask',...pages.map(s=>current+s)],seen=new Set(),checkedAnchors=new Set();
 const decode=s=>s.replaceAll('&amp;','&').replaceAll('&#x27;',"'").replaceAll('&quot;','"');
 while(queue.length){
  const path=queue.shift();if(seen.has(path))continue;seen.add(path);assert.ok(seen.size<500,'Unexpected unbounded navigation');
  const response=await fetch(new URL(path,origin),{signal:AbortSignal.timeout(30000)});assert.equal(response.status,200,path);
  if(!response.headers.get('content-type')?.includes('text/html'))continue;
  const body=await response.text(),base=new URL(response.url);
  for(const match of body.matchAll(/<a\b[^>]*href="([^"]+)"/g)){
   const url=new URL(decode(match[1]),base);
   if(![new URL(origin).host,'asymmetri.co','www.asymmetri.co'].includes(url.host)||!['http:','https:'].includes(url.protocol))continue;
   const target=url.pathname+url.search;if(!seen.has(target))queue.push(target);
   if(url.hash){
    const key=target+url.hash;if(checkedAnchors.has(key))continue;checkedAnchors.add(key);
    const fragmentResponse=target===base.pathname+base.search?null:await fetch(new URL(target,origin),{signal:AbortSignal.timeout(30000)});
    if(fragmentResponse)assert.equal(fragmentResponse.status,200,key);
    const fragmentBody=fragmentResponse?await fragmentResponse.text():body;
    assert.ok(fragmentBody.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'),key+' anchor');
   }
  }
 }
 assert.ok(seen.size>=25);assert.ok(checkedAnchors.size>=30);
});
