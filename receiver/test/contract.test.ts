import test from 'node:test';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createPublicKey, generateKeyPairSync, sign, webcrypto } from 'node:crypto';
import { deflateSync, crc32 } from 'node:zlib';
import type { Event, EventBatch, PublisherScope, AskQuestion, AskAnswer, AskLimits, AskRoute, ErrorCode, ContentType } from '../vendor/investment/v1/types.js';
import { canonicalHash, canonicalJson, ContractError, fixed, divideEven, parseJson, problem, schema, sha256, validate } from '../src/schema.js';
import { checkPublicationBatch, latestSnapshot, type PublicationContext } from '../src/publication.js';
import { checkContent } from '../src/content.js';
import { contentDigest, signatureBase, signatureInput, verifySignedRequest, type SignedMessage, type VerificationPolicy } from '../src/signatures.js';

const root = fileURLToPath(new URL('../../vendor/investment/v1/',import.meta.url));
const golden = JSON.parse(readFileSync(root + 'golden.json', 'utf8')) as { label: string; batch: EventBatch; content: { text: string; sha256: string; contentType: ContentType }[]; askQuestion: AskQuestion; askAnswer: AskAnswer; askRoute: AskRoute; askLimits: AskLimits };
const examples = JSON.parse(readFileSync(root + 'responses.json', 'utf8')).examples as Record<string, Record<string, unknown>>;
const catalogue = JSON.parse(readFileSync(root + 'catalogue.json', 'utf8')) as { events: Record<string,string>; roots: string[] };
const bytes = (value: unknown): Buffer => Buffer.from(JSON.stringify(value));
const clone = <T>(value: T): T => structuredClone(value);
function fails(fn: () => unknown, code?: ErrorCode): void {
  assert.throws(fn, (e: unknown) => e instanceof ContractError && (!code || e.code === code), `expected ContractError ${code ?? ''}`);
}
function context(): PublicationContext {
  return { experimentId: 'fixture-experiment', runId: 'fixture-run', now: '2026-01-05T22:00:00Z',
    scope: clone(examples.PublisherScope) as unknown as PublisherScope, history: [], receipts: new Map(),
    content: new Map(golden.content.map(c => [c.sha256, checkContent(Buffer.from(c.text), c.contentType, c.sha256)])) };
}
function batchCheck(batch = clone(golden.batch), ctx = context()) { return checkPublicationBatch(bytes(batch), batch.batchId, ctx); }
function of<T extends Event['type']>(batch: EventBatch, type: T): Extract<Event,{type:T}> {
  const e = batch.events.find(e => e.type === type); assert.ok(e); return e as Extract<Event,{type:T}>;
}
for (const name of catalogue.roots) test(`golden schema ${name}: valid, unknown fields and every required field`, () => {
  const example = examples[name]; assert.ok(example, `missing golden ${name}`); validate(name, example);
  fails(() => validate(name, { ...example, unauthorizedField: 'owner' }), 'INVALID_SCHEMA');
  for (const field of schema.$defs[name].required ?? []) {
    const missing = clone(example); delete missing[field]; fails(() => validate(name, missing), 'INVALID_SCHEMA');
  }
  if ('schemaVersion' in example) fails(() => validate(name, { ...example, schemaVersion: '9.9' }), 'INVALID_SCHEMA');
});
test('all schema definitions compile; root also accepts every golden DTO', () => {
  for (const [name, example] of Object.entries(examples)) assert.doesNotThrow(() => validate(name, example));
  assert.deepEqual(Object.keys(examples).sort(), [...catalogue.roots].sort());
});
test('optional worker preference is bounded data, not authority', () => {
  validate('AskQuestionInput', { ...golden.askQuestion.input, preferredWorkerId: 'fixture-reviewer' });
  for (const field of ['workerId','model','systemPrompt','tools','callbackUrl','grant','sessionId','executionId']) fails(() => validate('AskQuestionInput', { ...golden.askQuestion.input, [field]: 'forged' }));
});
test('all publication event variants have a strict payload and namespace', () => {
  for (const event of golden.batch.events) {
    validate('Event', event); fails(() => validate('Event', { ...event, payload: { ...event.payload, privateThreadId: 'hidden' } }));
  }
  fails(() => validate('Event', golden.askAnswer)); fails(() => validate('AskAnswer', golden.batch.events[0]));
});
for (const [label,text] of [
  ['duplicate keys','{"a":1,"a":2}'], ['escaped duplicate keys','{"a":1,"\\u0061":2}'],
  ['lone surrogate','{"a":"\\ud800"}'], ['trailing comma','{"a":1,}'], ['comment','{"a":/* no */1}'],
  ['nonfinite','{"a":1e999}'], ['unsafe integer','{"a":9007199254740993}'], ['nesting','['.repeat(18)+'0'+']'.repeat(18)],
] as const) test(`strict JSON rejects ${label}`, () => fails(() => parseJson(Buffer.from(text))));
test('strict JSON rejects malformed UTF-8 and oversized data', () => {
  fails(() => parseJson(Buffer.from([0xc0,0xaf]))); fails(() => parseJson(Buffer.alloc(1048577)), 'TOO_LARGE');
});
test('RFC 8785 canonicalization preserves Unicode and sorts keys, independent of input whitespace', () => {
  const value = parseJson(Buffer.from(' { "z": 1e+0, "a": "€\\n", "😀": true } '));
  assert.equal(canonicalJson(value), '{"a":"€\\n","z":1,"😀":true}');
  assert.equal(canonicalHash(value), sha256('{"a":"€\\n","z":1,"😀":true}'));
  assert.notEqual(sha256(bytes(value)), sha256(' { "z": 1, "a": "€\\n", "😀": true } '));
});
test('fixed-point values and half-even arithmetic never use binary monetary math', () => {
  assert.equal(fixed('0.000001'),1n); assert.equal(fixed('-12.000001'),-12000001n);
  assert.equal(divideEven(5n,2n),2n); assert.equal(divideEven(7n,2n),4n); assert.equal(divideEven(-5n,2n),-2n);
  for (const input of ['-1','NaN','Infinity','1e3','0.0000001','1000000000000','01']) fails(() => validate('Decimal',input));
  fails(() => validate('Quantity','1.5'));
});
test('synthetic complete evidence chain is valid and creates no retained state', () => {
  const ctx = context(); const result = batchCheck(clone(golden.batch),ctx);
  assert.equal(result.acceptedIds.length,27); assert.equal(ctx.history.length,0); assert.equal(ctx.receipts.size,0);
  assert.match(golden.label,/SYNTHETIC/); assert.equal(latestSnapshot(golden.batch.events)?.equity,'1020');
});
const publicationMutations: [string,(b: EventBatch,c: PublicationContext)=>void,ErrorCode?][] = [
  ['unsupported version',b => { (b as {schemaVersion:string}).schemaVersion='2.0'; },'UNSUPPORTED_VERSION'],
  ['wrong path run',(_b,c)=>{c.runId='other';},'FORBIDDEN'],
  ['wrong batch run',b=>{b.runId='other';},'FORBIDDEN'],
  ['wrong event run',b=>{b.events[4]!.runId='other';},'FORBIDDEN'],
  ['revoked scope',(_b,c)=>{c.scope.enabled=false;},'FORBIDDEN'],
  ['expired scope',(_b,c)=>{c.now='2027-01-01T00:00:00Z';},'FORBIDDEN'],
  ['unauthorized event',(_b,c)=>{c.scope.eventTypes=['run.published'];},'FORBIDDEN'],
  ['policy mismatch',b=>{b.events[4]!.publicationPolicyVersion='other';},'FORBIDDEN'],
  ['duplicate event ID in batch',b=>{b.events.push(clone(b.events[4]!));},'CONFLICT'],
  ['source sequence collision',b=>{b.events[4]!.sourceSequence=b.events[3]!.sourceSequence;},'CONFLICT'],
  ['bad frozen hash',b=>{of(b,'run.published').payload.configurationHash='b'.repeat(64);}],
  ['fixture relabelled observed',b=>{of(b,'run.published').evidenceMode='observed_paper';}],
  ['unapproved configuration',b=>{const p=of(b,'run.published').payload;p.configuration.configurationStatus='owner_approved';p.configurationHash=canonicalHash(p.configuration);}],
  ['unknown author',b=>{of(b,'discussion.contribution').actor={kind:'worker',workerId:'forged'};},'FORBIDDEN'],
  ['nonparticipant author',b=>{of(b,'discussion.opened').payload.participants=['fixture-reviewer'];},'FORBIDDEN'],
  ['cross-discussion reply',b=>{of(b,'discussion.contribution').payload.replyTo='unknown';},'DEPENDENCY_NOT_READY'],
  ['missing discussion predecessor',b=>{b.events=b.events.filter(e=>e.type!=='discussion.opened') as EventBatch['events'];},'DEPENDENCY_NOT_READY'],
  ['missing artifact bytes',(_b,c)=>{c.content=new Map();},'DEPENDENCY_NOT_READY'],
  ['artifact integrity mismatch',b=>{of(b,'artifact.published').payload.sha256='0'.repeat(64);},'DEPENDENCY_NOT_READY'],
  ['wrong artifact supersedes type',b=>{Object.assign(b.events.filter(e=>e.type==='artifact.published')[1]!.payload.supersedes!,{kind:'transaction'});}],
  ['review of wrong proposal',b=>{of(b,'decision.published').payload.review.proposalHash='b'.repeat(64);},'CONFLICT'],
  ['self-review',b=>{of(b,'decision.published').payload.review.reviewerId='fixture-author';},'CONFLICT'],
  ['negative price',b=>{of(b,'paper.order').payload.priceGuard='-1';}],
  ['unknown decision',b=>{of(b,'paper.order').payload.decisionId='absent';},'DEPENDENCY_NOT_READY'],
  ['fractional discretionary order',b=>{of(b,'paper.order').payload.quantity='1.5';}],
  ['order without finite expiry',b=>{of(b,'paper.order').payload.expiresAt=of(b,'paper.order').payload.deadline;}],
  ['wrong order side',b=>{of(b,'paper.order').payload.side='SELL';},'CONFLICT'],
  ['changed financial reference',b=>{of(b,'portfolio.snapshot').payload.journalHash='b'.repeat(64);},'CONFLICT'],
  ['missing financial predecessor',b=>{b.events=b.events.filter(e=>!(e.type==='paper.ledger_transaction'&&e.payload.effect==='initialization')) as EventBatch['events'];},'SEQUENCE_GAP'],
  ['journal gap',b=>{of(b,'paper.ledger_transaction').payload.journalSequence='3';},'SEQUENCE_GAP'],
  ['negative portfolio cash',b=>{of(b,'portfolio.snapshot').payload.cash='-1';}],
  ['inconsistent portfolio cash',b=>{of(b,'portfolio.snapshot').payload.cash='801';}],
  ['wrong equity',b=>{of(b,'portfolio.snapshot').payload.equity='1021';}],
  ['wrong cost basis',b=>{of(b,'portfolio.snapshot').payload.holdings[0]!.bookCost='199';}],
  ['missing holding',b=>{of(b,'portfolio.snapshot').payload.holdings=[];}],
  ['complete snapshot missing mark',b=>{of(b,'portfolio.snapshot').payload.holdings[0]!.mark=null;}],
  ['benchmark mismatched session',b=>{of(b,'portfolio.snapshot').payload.benchmark.session='2026-01-06';}],
  ['incorrect return',b=>{of(b,'portfolio.snapshot').payload.totalReturn='0.2';}],
  ['active public content',b=>{of(b,'discussion.contribution').payload.body='<script>alert(1)</script>';},'UNSUPPORTED_MEDIA'],
  ['credential-bearing source URL',b=>{of(b,'artifact.published').payload.sources[0]!.url='https://example.com/?token=private';}],
  ['incorrect synthesis kind',b=>{Object.assign(of(b,'discussion.closed').payload.synthesis,{kind:'decision'});}],
  ['incorrect review target kind',b=>{Object.assign(of(b,'review.published').payload.originalDecisions[0]!,{kind:'artifact'});}],
];
for (const [name,mutate,code] of publicationMutations) test(`publication rejects ${name}`,()=>{
  const b=clone(golden.batch),c=context();mutate(b,c);fails(()=>batchCheck(b,c),code);assert.equal(c.history.length,0);
});
test('same immutable event in new batch is duplicate; changed event conflicts',()=>{
  const c=context();c.history=golden.batch.events;const b=clone(golden.batch);b.batchId='fixture-retry';
  const r=batchCheck(b,c);assert.equal(r.acceptedIds.length,0);assert.equal(r.duplicateIds.length,27);
  of(b,'discussion.contribution').payload.body='Changed';fails(()=>batchCheck(b,c),'CONFLICT');
});
test('idempotency checks exact bytes and rechecks current authority before old receipts',()=>{
  const b=clone(golden.batch),c=context();c.receipts=new Map([[b.batchId,sha256(bytes(b))]]);
  assert.equal(batchCheck(b,c).replay,true);
  fails(()=>checkPublicationBatch(Buffer.from(JSON.stringify(b,null,2)),b.batchId,c),'CONFLICT');
  c.scope.enabled=false;fails(()=>batchCheck(b,c),'FORBIDDEN');
});
test('independent source events can arrive out of order; financial dependencies cannot',()=>{
  const b=clone(golden.batch);[b.events[23],b.events[24]]=[b.events[24]!,b.events[23]!];batchCheck(b);
  const c=clone(golden.batch);const snapshot=c.events.findIndex(e=>e.type==='portfolio.snapshot');const fill=c.events.findIndex(e=>e.type==='paper.ledger_transaction'&&e.payload.effect==='fill');[c.events[snapshot],c.events[fill]]=[c.events[fill]!,c.events[snapshot]!];fails(()=>batchCheck(c),'DEPENDENCY_NOT_READY');
});
test('old snapshot arrival cannot replace a newer valuation; revisions stay linked',()=>{
  const b=clone(golden.batch),original=of(b,'portfolio.snapshot');const newer=clone(original);newer.eventId='fixture-new-valuation';newer.sourceSequence='100';newer.payload.valuationId='fixture-valuation-new';newer.payload.valuationSequence='2';
  const c=context();c.history=b.events;batchCheck({...b,batchId:'fixture-new',events:[newer]},c);
  assert.equal(latestSnapshot([...b.events,newer,original])?.valuationId,'fixture-valuation-new');
  const revised=clone(original);revised.eventId='fixture-revision';revised.sourceSequence='101';revised.payload.revision=2;revised.payload.supersedes={kind:'valuation',id:original.payload.valuationId,version:1,relation:'supersedes'};
  batchCheck({...b,batchId:'fixture-revised',events:[revised]},c);assert.equal(latestSnapshot([...b.events,revised])?.revision,2);
});
test('invalid fill arithmetic fails even when attacker recomputes journal hash',()=>{
  const b=clone(golden.batch),e=b.events.find(e=>e.type==='paper.ledger_transaction'&&e.payload.effect==='fill');assert.ok(e?.type==='paper.ledger_transaction');
  e.payload.fill!.price='101';const {journalHash:_,...data}=e.payload;void _;e.payload.journalHash=canonicalHash(data);fails(()=>batchCheck(b));
});

function signed(method: SignedMessage['method']='POST', keyId='fixture-key') {
  const keys=generateKeyPairSync('ed25519');const body=method==='GET'?Buffer.alloc(0):bytes({schemaVersion:'1.0',message:'Synthetic € vector'});
  const path=method==='GET'?'/api/experiments/v1/experiments/fixture-experiment/runs/fixture-run/receipts/fixture-batch':'/api/experiments/v1/experiments/fixture-experiment/runs/fixture-run/events';
  const message:SignedMessage={method,authority:'asymmetri.co',path,body,headers:[['botsquad-generation','1']]};
  if(method!=='GET')message.headers.push(['content-type','application/json'],['content-digest',contentDigest(body)],['idempotency-key','fixture-batch']);
  const input=signatureInput(method,{created:1767657600,expires:1767657900,keyId,nonce:'0123456789abcdefghijklmnop'});
  const base=signatureBase(message,input),signature=sign(null,Buffer.from(base),keys.privateKey).toString('base64');
  message.headers.push(['signature-input',input],['signature',`sig1=:${signature}:`]);
  const policy:VerificationPolicy={authority:message.authority,generation:'1',keyId,publicKey:keys.publicKey,enabled:true,notBefore:1767657000,notAfter:1767660000,now:1767657700,usedNonces:new Set(),targets:new Set([`${method} ${path}`])};
  return {message,policy,base,signature,publicKey:keys.publicKey};
}
test('RFC 9421 signature base has independently asserted exact bytes and verifies with WebCrypto',async()=>{
  const {message,policy,base,signature,publicKey}=signed();
  const expected=[
    '"@method": POST','"@authority": asymmetri.co','"@path": /api/experiments/v1/experiments/fixture-experiment/runs/fixture-run/events',
    '"botsquad-generation": 1','"content-type": application/json',`"content-digest": ${contentDigest(message.body)}`,'"idempotency-key": fixture-batch',
    '"@signature-params": ("@method" "@authority" "@path" "botsquad-generation" "content-type" "content-digest" "idempotency-key");created=1767657600;expires=1767657900;keyid="fixture-key";nonce="0123456789abcdefghijklmnop";alg="ed25519"',
  ].join('\n');assert.equal(base,expected);assert.equal(base.endsWith('\n'),false);
  const result=verifySignedRequest(message,policy);assert.equal(result.retainUntil,1767657960);
  const key=await webcrypto.subtle.importKey('spki',new Uint8Array(publicKey.export({type:'spki',format:'der'})),{name:'Ed25519'},false,['verify']);
  assert.equal(await webcrypto.subtle.verify('Ed25519',key,new Uint8Array(Buffer.from(signature,'base64')),new Uint8Array(Buffer.from(expected))),true);
});
test('authenticated receipt GET has no body or write headers',()=>{
  const {message,policy}=signed('GET');verifySignedRequest(message,policy);message.body=Buffer.from('x');fails(()=>verifySignedRequest(message,policy),'UNAUTHENTICATED');
});
const signatureMutations:[string,(m:SignedMessage,p:VerificationPolicy)=>void,ErrorCode?][]=[
  ['body altered',m=>{m.body=Buffer.from('{}');},'UNAUTHENTICATED'],
  ['wrong method',m=>{m.method='PUT';},'FORBIDDEN'],
  ['wrong path',m=>{m.path+='/other';},'FORBIDDEN'],
  ['untrusted authority',m=>{m.authority='evil.example';},'FORBIDDEN'],
  ['query string',m=>{m.path+='?x=1';},'FORBIDDEN'],
  ['stale signature',(_m,p)=>{p.now=1767658000;},'UNAUTHENTICATED'],
  ['future creation',(_m,p)=>{p.now=1767657500;},'UNAUTHENTICATED'],
  ['revoked key',(_m,p)=>{p.enabled=false;},'FORBIDDEN'],
  ['wrong key',(_m,p)=>{p.publicKey=generateKeyPairSync('ed25519').publicKey;},'UNAUTHENTICATED'],
  ['nonce replay',(_m,p)=>{p.usedNonces=new Set(['fixture-key:0123456789abcdefghijklmnop']);},'REPLAY'],
  ['stale publisher generation',(_m,p)=>{p.generation='2';},'CONFLICT'],
  ['duplicate header',m=>{m.headers.push(['Content-Type','application/json']);},'UNAUTHENTICATED'],
  ['malformed signature',m=>{m.headers.find(([n])=>n==='signature')![1]='sig1=:not-base64:';},'UNAUTHENTICATED'],
  ['wrong digest',m=>{m.headers.find(([n])=>n==='content-digest')![1]='sha-256=:bad:';},'UNAUTHENTICATED'],
  ['extended signature lifetime',m=>{m.headers.find(([n])=>n==='signature-input')![1]=signatureInput('POST',{created:1767657600,expires:1767657901,keyId:'fixture-key',nonce:'0123456789abcdefghijklmnop'});},'UNAUTHENTICATED'],
];
for(const [name,mutate,code] of signatureMutations)test(`signed profile rejects ${name}`,()=>{const{message,policy}=signed();mutate(message,policy);fails(()=>verifySignedRequest(message,policy),code);});
test('key rotation preserves immutable publication identity and retires old verification authority',()=>{
  const current=signed(),rotated=signed('POST','fixture-key-rotated');assert.deepEqual(current.message.body,rotated.message.body);
  verifySignedRequest(current.message,current.policy);verifySignedRequest(rotated.message,rotated.policy);current.policy.enabled=false;
  fails(()=>verifySignedRequest(current.message,current.policy),'FORBIDDEN');assert.equal(golden.batch.batchId,'fixture-batch');
});

test('public content checks exact bytes, conservative Markdown, JSON and CSV',()=>{
  for(const c of golden.content)assert.equal(checkContent(Buffer.from(c.text),c.contentType,c.sha256).sha256,c.sha256);
  fails(()=>checkContent(Buffer.from('changed'),'text/plain',golden.content[0]!.sha256),'CONFLICT');
  for(const t of ['<img src=x onerror=alert(1)>','![image](https://example.com/x.png)','[click](javascript:alert(1))','[click](https://u:p@example.com)'])fails(()=>checkContent(Buffer.from(t),'text/markdown',sha256(t)));
  for(const csv of ['name,value\nA,=1+1','"x","  @SUM(1,2)"','"x","\n+command"'])fails(()=>checkContent(Buffer.from(csv),'text/csv',sha256(csv)),'UNSUPPORTED_MEDIA');
  const safe='name,value\nA,\'=-safe';checkContent(Buffer.from(safe),'text/csv',sha256(safe));
  fails(()=>checkContent(Buffer.from('<svg/>'),'image/svg+xml' as ContentType,sha256('<svg/>')),'UNSUPPORTED_MEDIA');
  fails(()=>checkContent(Buffer.alloc(131073),'text/plain','a'.repeat(64)),'TOO_LARGE');
});
function png(width=1,height=1):Buffer {
  function chunk(type:string,data:Buffer):Buffer{const t=Buffer.from(type),n=Buffer.alloc(4),crc=Buffer.alloc(4);n.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([t,data])));return Buffer.concat([n,t,data,crc]);}
  const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(width,0);ihdr.writeUInt32BE(height,4);Buffer.from([8,6,0,0,0]).copy(ihdr,8);
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(Buffer.from([0,255,0,0,255]))),chunk('IEND',Buffer.alloc(0))]);
}
test('normalized PNG boundary rejects fake MIME, dimensions, integrity and trailing payloads',()=>{
  const image=png();checkContent(image,'image/png',sha256(image));
  for(const bad of [Buffer.from('not a PNG'),Buffer.concat([image,Buffer.from('<script>')]),Buffer.from(image)]){
    if(bad.length===image.length)bad[20]=1;
    fails(()=>checkContent(bad,'image/png',sha256(bad)));
  }
  const oversized=png(3000,1);fails(()=>checkContent(oversized,'image/png',sha256(oversized)),'TOO_LARGE');
});
test('bounded problem serialization never echoes raw input, private paths or provider errors',()=>{
  for(const code of schema.$defs.ErrorCode.enum as ErrorCode[]){const result=problem(code,'fixture-request');validate('Problem',result);assert.equal(result.code,code);assert.ok(result.detail.length<300);}
  assert.equal(problem('OUTCOME_UNKNOWN','fixture-request').retryable,false);
  assert.equal(problem('CURSOR_RESET','fixture-request').resync,'status_snapshot_page');
});
test('OpenAPI operation references resolve, cookie and service boundaries stay disjoint, private errors are no-store',()=>{
  const api=JSON.parse(readFileSync(root+'openapi.json','utf8'));const operations=new Set<string>();
  for(const [path,methods] of Object.entries(api.paths) as [string,Record<string,Record<string,unknown>>][]){for(const op of Object.values(methods)){
    assert.ok(!operations.has(op.operationId as string));operations.add(op.operationId as string);
    const json=JSON.stringify(op);for(const match of json.matchAll(/schema\.json#\/\$defs\/([A-Za-z]+)/g))assert.ok(schema.$defs[match[1]!]);
    if(path.startsWith('/api/ask/')||JSON.stringify(op.security)!=='[]')for(const response of Object.values(op.responses as Record<string,unknown>))assert.match(JSON.stringify(response),/private, no-store/);
    if(path.includes('/hq/'))assert.match(JSON.stringify(op.security),/httpSignature/);
    if(path.includes('/api/experiments/'))assert.doesNotMatch(json,/AskQuestion|AskAnswer|visitorSession/);
  }}
  assert.equal(operations.size,31);
});
test('version and hash pins are transport-independent and detect vendor drift',()=>{
  const manifest=JSON.parse(readFileSync(root+'manifest.json','utf8'));assert.equal(manifest.contractVersion,'1.0');
  for(const [file,hash] of Object.entries(manifest.files))assert.equal(sha256(readFileSync(root+file)),hash);
  assert.ok(manifest.files['golden.json']);assert.ok(manifest.files['responses.json']);
  assert.equal(schema.$defs.Version.const,'1.0');assert.equal(schema.$defs.AskVersion.const,'1.0');
});


test('published signature vector verifies without retaining a private key', async () => {
  const vector=JSON.parse(readFileSync(root+'signature-vector.json','utf8'));
  const {bodyUtf8,...request}=vector.request;
  const message:SignedMessage={...request,body:Buffer.from(bodyUtf8)};
  const publicKey=createPublicKey(vector.publicKeyPem);
  const policy:VerificationPolicy={authority:'asymmetri.co',generation:'1',keyId:'fixture-vector-key',publicKey,enabled:true,notBefore:1767657000,notAfter:1767660000,now:vector.verifyAt,usedNonces:new Set(),targets:new Set([`${message.method} ${message.path}`])};
  assert.equal(signatureBase(message,message.headers.find(([name])=>name==='signature-input')![1]),vector.signatureBaseUtf8);
  verifySignedRequest(message,policy);
  const key=await webcrypto.subtle.importKey('spki',new Uint8Array(publicKey.export({type:'spki',format:'der'})),{name:'Ed25519'},false,['verify']);
  const sig=message.headers.find(([name])=>name==='signature')![1].slice(6,-1);
  assert.equal(await webcrypto.subtle.verify('Ed25519',key,new Uint8Array(Buffer.from(sig,'base64')),new Uint8Array(Buffer.from(vector.signatureBaseUtf8))),true);
});
test('all event types have positive golden coverage',()=>{
  assert.deepEqual([...new Set(golden.batch.events.map(e=>e.type))].sort(),Object.keys(catalogue.events).sort());
});
test('parser bounds deep nesting before recursive parsing and canonicalization rejects lossy objects',()=>{
  fails(()=>parseJson(Buffer.from('['.repeat(5000)+'0'+']'.repeat(5000))));
  for(const value of [{value:Infinity},{value:undefined},[undefined],new Date(),9007199254740992])fails(()=>canonicalJson(value));
  const cyclic:Record<string,unknown>={};cyclic.self=cyclic;fails(()=>canonicalJson(cyclic));
});
test('sequence binds one valuation identity independent of arrival order',()=>{
  const c=context();c.history=golden.batch.events;
  const e=clone(of(golden.batch,'portfolio.snapshot'));e.eventId='fixture-collision';e.sourceSequence='99';e.payload.valuationId='fixture-collision';
  fails(()=>batchCheck({...golden.batch,batchId:'fixture-new',events:[e]},c),'CONFLICT');
});
test('a cancelled order cannot fill using its historic pending revision',()=>{
  const b=clone(golden.batch),i=b.events.findIndex(e=>e.type==='paper.ledger_transaction'&&e.payload.effect==='fill');
  const cancelled=clone(b.events[i-1]!);assert.ok(cancelled.type==='paper.order');
  cancelled.eventId='fixture-cancel';cancelled.sourceSequence='90';cancelled.payload.revision=4;cancelled.payload.previousEventId=b.events[i-1]!.eventId;cancelled.payload.status='cancelled';cancelled.payload.reason='Synthetic cancellation';cancelled.payload.reservedCash='0';
  b.events.splice(i,0,cancelled);fails(()=>batchCheck(b),'CONFLICT');
});
test('split fractional entitlement is exact rather than silently rounded away',()=>{
  const b=clone(golden.batch),last=b.events.findLast(e=>e.type==='paper.ledger_transaction');assert.ok(last?.type==='paper.ledger_transaction');
  const e=clone(last);e.eventId='fixture-split';e.sourceSequence='99';const t=e.payload;t.transactionId='fixture-split-tx';t.sourceOperationId='fixture-split-op';t.journalSequence='3';t.ledgerVersion='3';t.previousLedgerVersion='2';t.previousHash=last.payload.journalHash;t.effect='split';t.fill=null;
  const action=clone(of(b,'market.action').payload);action.kind='split';action.actionId='fixture-split-action';action.providerActionId='fixture-split-provider';action.numerator='1';action.denominator='3';action.newSymbol=null;action.fractionalEntitlement={numerator:'2',denominator:'3000000'};t.corporateAction=action;t.entries=[{account:'quantity',instrumentId:'fixture-stock',amount:'-1.333334',currency:'USD'}];
  const hash=()=>{const {journalHash:_,...rest}=t;void _;t.journalHash=canonicalHash(rest);};hash();
  const c=context();c.history=b.events;batchCheck({...b,batchId:'fixture-split-batch',events:[e]},c);
  t.corporateAction.fractionalEntitlement=null;hash();fails(()=>batchCheck({...b,batchId:'fixture-split-batch',events:[e]},c));
});

test('public Markdown rejects reference-link and encoded-destination bypasses',()=>{
  for(const text of ['[click][ref]\n\n[ref]: https://user:secret@example.com','[click][ref]\n\n[ref]: https://example.com?token=secret','[click](jav&#x61;script:alert(1))','[click][foo bar]\n\n[foo\nbar]: https://user:secret@example.com','[click][ref]\n\n> [ref]: https://user:secret@example.com','[click][ref]\n\n- [ref]: https://example.com/?token=secret'])fails(()=>checkContent(Buffer.from(text),'text/markdown',sha256(text)),'UNSUPPORTED_MEDIA');
});
test('publication history cannot supply dependencies from another run',()=>{
  const c=context();c.history=golden.batch.events;c.runId='other';c.scope.runId='other';
  const b=clone(golden.batch);b.runId='other';b.events.forEach(e=>e.runId='other');fails(()=>batchCheck(b,c),'FORBIDDEN');
});

test('ticker updates bind action and maintain effective historical symbols',()=>{
  const bad=clone(golden.batch);of(bad,'instrument.updated').payload.instrument.symbol='UNRELATED';fails(()=>batchCheck(bad),'CONFLICT');
  const c=context();c.history=golden.batch.events;c.now='2026-01-06T22:00:00Z';c.scope.expiresAt='2026-01-08T00:00:00Z';
  const e=clone(of(golden.batch,'portfolio.snapshot'));e.eventId='fixture-nextday';e.sourceSequence='100';e.occurredAt=c.now;e.recordedAt=c.now;
  const s=e.payload;s.valuationId='fixture-nextday';s.valuationSequence='2';s.session='2026-01-06';s.valuationAsOf='2026-01-06T21:00:00Z';s.holdings[0]!.symbol='SYNNEW';s.benchmark.session=s.session;
  for(const mark of [s.holdings[0]!.mark!,s.benchmark.mark!]){mark.session=s.session;mark.marketAt=s.valuationAsOf;mark.availableAt=s.valuationAsOf;mark.retrievedAt=s.valuationAsOf;}
  batchCheck({...golden.batch,batchId:'fixture-nextday',events:[e]},c);
  s.holdings[0]!.symbol='SYNTH';fails(()=>batchCheck({...golden.batch,batchId:'fixture-nextday',events:[e]},c));
});

test('split entries cannot contaminate another instrument and dividends settle exact accrued terms',()=>{
  const c=context();c.history=golden.batch.events;c.now='2026-01-07T22:00:00Z';c.scope.expiresAt='2026-01-08T00:00:00Z';
  const last=golden.batch.events.findLast(e=>e.type==='paper.ledger_transaction');assert.ok(last?.type==='paper.ledger_transaction');
  const make=(id:string,sequence:string)=>{const e=clone(last);e.eventId=id;e.sourceSequence=sequence;e.payload.transactionId=id;e.payload.sourceOperationId=id;e.payload.fill=null;return e;};
  const hash=(e:typeof last)=>{const{journalHash:_,...rest}=e.payload;void _;e.payload.journalHash=canonicalHash(rest);};
  const split=make('fixture-split-contamination','91'),t=split.payload;t.effect='split';t.journalSequence='3';t.ledgerVersion='3';t.previousLedgerVersion='2';t.previousHash=last.payload.journalHash;
  t.corporateAction={...clone(of(golden.batch,'market.action').payload),kind:'split',numerator:'2',denominator:'1',newSymbol:null};
  t.entries=[{account:'quantity',instrumentId:'fixture-stock',amount:'2',currency:'USD'},{account:'quantity',instrumentId:'fixture-benchmark',amount:'1000',currency:'USD'}];hash(split);fails(()=>batchCheck({...golden.batch,batchId:'fixture-split-invalid',events:[split]},c));
  const accrual=make('fixture-accrual','92'),a=accrual.payload;a.effect='dividend_accrual';a.journalSequence='3';a.ledgerVersion='3';a.previousLedgerVersion='2';a.previousHash=last.payload.journalHash;a.effectiveAt='2026-01-06T14:30:00Z';a.recordedAt=a.effectiveAt;accrual.occurredAt=a.effectiveAt;accrual.recordedAt=a.effectiveAt;
  a.corporateAction={...clone(of(golden.batch,'market.action').payload),actionId:'fixture-dividend',providerActionId:'fixture-dividend',kind:'dividend_accrual',effectiveAt:a.effectiveAt,exDate:'2026-01-06',paymentDate:'2026-01-07',cashPerShare:'5',entitledQuantity:'2',newSymbol:null};
  a.entries=[{account:'receivable',instrumentId:null,amount:'10',currency:'USD'},{account:'income',instrumentId:null,amount:'10',currency:'USD'}];hash(accrual);
  const payment=clone(accrual);payment.eventId='fixture-payment';payment.sourceSequence='93';const p=payment.payload;p.transactionId='fixture-payment';p.sourceOperationId='fixture-payment';p.effect='dividend_payment';p.journalSequence='4';p.ledgerVersion='4';p.previousLedgerVersion='3';p.previousHash=a.journalHash;p.effectiveAt='2026-01-07T14:30:00Z';p.recordedAt=p.effectiveAt;payment.occurredAt=p.effectiveAt;payment.recordedAt=p.effectiveAt;p.corporateAction!.kind='dividend_payment';p.corporateAction!.effectiveAt=p.effectiveAt;p.entries=[{account:'receivable',instrumentId:null,amount:'-10',currency:'USD'},{account:'cash',instrumentId:null,amount:'10',currency:'USD'}];hash(payment);
  batchCheck({...golden.batch,batchId:'fixture-dividend',events:[accrual,payment]},c);
  p.corporateAction!.cashPerShare='2.5';p.entries[0]!.amount='-5';p.entries[1]!.amount='5';hash(payment);fails(()=>batchCheck({...golden.batch,batchId:'fixture-dividend',events:[accrual,payment]},c),'CONFLICT');
});

test('fill and split reject extra postings even for another allowlisted instrument',()=>{
  const b=clone(golden.batch),run=of(b,'run.published').payload;
  run.configuration.universe.push({...clone(run.configuration.universe[0]!),instrumentId:'fixture-other'});
  run.configurationHash=canonicalHash(run.configuration);
  let previous:string|null=null;
  for(const e of b.events){
    if('configurationHash' in e.payload)e.payload.configurationHash=run.configurationHash;
    if(e.type==='paper.ledger_transaction'){e.payload.previousHash=previous;const{journalHash:_,...rest}=e.payload;void _;e.payload.journalHash=canonicalHash(rest);previous=e.payload.journalHash;}
    if(e.type==='portfolio.snapshot')e.payload.journalHash=previous!;
  }
  batchCheck(b);
  const fill=b.events.find(e=>e.type==='paper.ledger_transaction'&&e.payload.effect==='fill');assert.ok(fill?.type==='paper.ledger_transaction');
  const bad=clone(b),badFill=bad.events.find(e=>e.eventId===fill.eventId);assert.ok(badFill?.type==='paper.ledger_transaction');
  badFill.payload.entries.push({account:'quantity',instrumentId:'fixture-other',amount:'1000',currency:'USD'},{account:'book_cost',instrumentId:'fixture-other',amount:'1',currency:'USD'});
  const{journalHash:_,...rest}=badFill.payload;void _;badFill.payload.journalHash=canonicalHash(rest);fails(()=>batchCheck(bad),'CONFLICT');
  const split=clone(fill);split.eventId='fixture-other-split';split.sourceSequence='99';const t=split.payload;t.transactionId='fixture-other-split';t.sourceOperationId='fixture-other-split';t.effect='split';t.fill=null;t.journalSequence='3';t.ledgerVersion='3';t.previousLedgerVersion='2';t.previousHash=fill.payload.journalHash;
  t.corporateAction={...clone(of(b,'market.action').payload),kind:'split',numerator:'2',denominator:'1',newSymbol:null};
  t.entries=[{account:'quantity',instrumentId:'fixture-stock',amount:'2',currency:'USD'}];
  const hash=()=>{const{journalHash:_,...data}=t;void _;t.journalHash=canonicalHash(data);};hash();const c=context();c.history=b.events;
  batchCheck({...b,batchId:'fixture-other-split',events:[split]},c);
  t.entries.push({account:'quantity',instrumentId:'fixture-other',amount:'1000',currency:'USD'});hash();fails(()=>batchCheck({...b,batchId:'fixture-other-split',events:[split]},c));
});

test('equivalent UTC precision represents the same fill instant',()=>{
  const b=clone(golden.batch),e=b.events.find(e=>e.type==='paper.ledger_transaction'&&e.payload.effect==='fill');assert.ok(e?.type==='paper.ledger_transaction');
  e.payload.effectiveAt='2026-01-05T14:30:00.000Z';const{journalHash:_,...rest}=e.payload;void _;e.payload.journalHash=canonicalHash(rest);of(b,'portfolio.snapshot').payload.journalHash=e.payload.journalHash;batchCheck(b);
});
