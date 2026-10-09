// Explicit, bounded synthetic client for the disposable INFRA-02 systemd instance.
// The private signing key exists only in this process and authority is fenced on exit.
import assert from 'node:assert/strict';
import { generateKeyPairSync, randomBytes, sign } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { Archive } from '../dist/src/database.js';
import { loadConfig } from '../dist/src/config.js';
import { contentDigest, signatureBase, signatureInput } from '../dist/src/signatures.js';
import { golden, examples, prefix, encode, clone, wireHttp } from '../dist/test/helpers.js';
process.umask(0o077);
const cfg=loadConfig('/var/lib/infra02-acceptance/config.json');
assert.equal(cfg.dataDir,'/var/lib/infra02-acceptance/data');assert.equal(cfg.port,13101);
const db=new Archive(cfg),keys=generateKeyPairSync('ed25519'),now=()=>Math.floor(Date.now()/1000);
assert.equal(db.get('SELECT count(*) n FROM events').n,0,'requires fresh disposable archive');
const scope={...clone(examples.PublisherScope),publisherId:'infra02-synthetic',keyId:'infra02-ephemeral',generation:'1',expiresAt:new Date((now()+900)*1000).toISOString(),writesPerMinute:60,bytesPerDay:16777216};
db.authorize(scope,{publicKey:keys.publicKey.export({type:'spki',format:'pem'}).toString(),notBefore:now()-60,notAfter:now()+900},new Date().toISOString());
function message(method,path,body=Buffer.alloc(0),id='infra02-request',type='application/json') {
 const m={method,path,authority:cfg.authority,body,headers:[['botsquad-generation',scope.generation]]};
 if(method!=='GET')m.headers.push(['content-type',type],['content-digest',contentDigest(body)],['idempotency-key',id]);
 const input=signatureInput(method,{created:now(),expires:now()+120,keyId:scope.keyId,nonce:randomBytes(24).toString('base64url')});
 m.headers.push(['signature-input',input],['signature',`sig1=:${sign(null,Buffer.from(signatureBase(m,input)),keys.privateKey).toString('base64')}:`]);return m;
}
const trafficPort=13102;
const send=m=>wireHttp(trafficPort,m.method,m.path,[['Host',cfg.authority],...m.headers,...(m.method==='GET'?[]:[['Content-Length',String(m.body.length)]])],Buffer.from(m.body));
const report={synthetic:true,started:new Date().toISOString(),writes:[],requests:[],maxConcurrency:0};
try {
 for(const c of golden.content)assert.equal((await send(message('PUT',prefix+'/content/'+c.sha256,Buffer.from(c.text),'capacity-content-'+c.sha256.slice(0,10),c.contentType))).status,201);
 const initial=await send(message('POST',prefix+'/events',encode(golden.batch),golden.batch.batchId));assert.equal(initial.status,201);report.receipt=initial.body;
 for(let batchNo=0;batchNo<16;batchNo++) {
  const batch={...golden.batch,batchId:'capacity-batch-'+batchNo,events:[]};
  for(let j=0;j<50;j++) {
   const n=batchNo*50+j,e=clone(golden.batch.events.find(x=>x.type==='worker.activity'));
   e.eventId='capacity-event-'+n;e.sourceSequence=String(n+28);e.payload.activityId='capacity-activity-'+n;e.payload.summary='SYNTHETIC CAPACITY FIXTURE. '+ 'x'.repeat(970);batch.events.push(e);
  }
  const start=performance.now(),result=await send(message('POST',prefix+'/events',encode(batch),batch.batchId));assert.equal(result.status,201,result.raw);
  report.writes.push({events:50,bytes:encode(batch).length,ms:performance.now()-start});await delay(500);
 }
 const duplicate=await Promise.all([send(message('POST',prefix+'/events',encode(golden.batch),golden.batch.batchId)),send(message('POST',prefix+'/events',encode(golden.batch),golden.batch.batchId))]);
 for(const response of duplicate){assert.equal(response.status,200);assert.deepEqual(response.body,initial.body);}
 assert.equal((await send(message('GET',prefix+'/receipts/'+golden.batch.batchId))).status,200);
 for(let round=0;round<60;round++) {
  const start=performance.now();let active=0;
  await Promise.all(['events?limit=50','snapshot','status','performance'].map(async path=>{
   active++;report.maxConcurrency=Math.max(report.maxConcurrency,active);const began=performance.now();
   const result=await wireHttp(trafficPort,'GET',prefix+'/'+path,[['Host',cfg.authority]]);active--;
   assert.equal(result.status,200,result.raw);report.requests.push({path,status:result.status,ms:performance.now()-began,bytes:Buffer.byteLength(result.raw)});
  }));
  await delay(Math.max(0,2000-(performance.now()-start)));
 }
 report.events=db.get('SELECT count(*) n FROM events').n;
 report.archivePayloadBytes=db.get('SELECT sum(length(body_json)) n FROM events').n;
 report.integrity=db.db.pragma('integrity_check');report.foreignKeys=db.db.pragma('foreign_key_check');
 assert.equal(report.events,827);assert.deepEqual(report.integrity,[{integrity_check:'ok'}]);assert.deepEqual(report.foreignKeys,[]);
 const values=report.requests.map(x=>x.ms).sort((a,b)=>a-b);report.latency={p50:values[Math.floor(values.length*.50)],p95:values[Math.floor(values.length*.95)],max:values.at(-1)};
 report.finished=new Date().toISOString();
 // Safe receipt/nonce metadata for restart reconciliation; contains no private key/signature.
 await writeFile('/var/lib/infra02-acceptance/capacity.json',JSON.stringify(report,null,2),{mode:0o600});
 console.log(JSON.stringify({events:report.events,archivePayloadBytes:report.archivePayloadBytes,requests:report.requests.length,maxConcurrency:report.maxConcurrency,latency:report.latency,integrity:report.integrity}));
} finally {
 db.fenceRestore(new Date().toISOString());db.close();
}
// Reading a report is deliberately separate from authority; no private key is persisted.
assert.ok((await readFile('/var/lib/infra02-acceptance/capacity.json')).length);
