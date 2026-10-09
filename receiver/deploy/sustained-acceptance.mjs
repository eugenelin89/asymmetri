// Explicit 15-minute synthetic workload, only the disposable INV-03 archive.
import assert from 'node:assert/strict';
import { generateKeyPairSync, randomBytes, sign, createHash } from 'node:crypto';
import { deflateSync, crc32 } from 'node:zlib';
import { writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { Archive } from '../dist/src/database.js';
import { Controls } from '../dist/src/controls.js';
import { loadConfig } from '../dist/src/config.js';
import { contentDigest, signatureBase, signatureInput } from '../dist/src/signatures.js';
import { golden, examples, prefix, encode, clone, wireHttp } from '../dist/test/helpers.js';
process.umask(0o077);
const cfg=loadConfig('/var/lib/inv03-acceptance/config.json');assert.equal(cfg.dataDir,'/var/lib/inv03-acceptance/data');assert.equal(cfg.port,13101);
const db=new Archive(cfg),keys=generateKeyPairSync('ed25519'),now=()=>Math.floor(Date.now()/1000);
assert.equal(db.get('SELECT count(*) n FROM events').n,0);
const scope={...clone(examples.PublisherScope),publisherId:'inv03-synthetic',keyId:'inv03-ephemeral',generation:'1',expiresAt:new Date((now()+3600)*1000).toISOString(),writesPerMinute:60,bytesPerDay:16777216};
db.authorize(scope,{publicKey:keys.publicKey.export({type:'spki',format:'pem'}).toString(),notBefore:now()-60,notAfter:now()+3600},new Date().toISOString());
function message(method,path,body=Buffer.alloc(0),id='inv03-request',type='application/json'){
 const m={method,path,authority:cfg.authority,body,headers:[['botsquad-generation',scope.generation]]};
 if(method!=='GET')m.headers.push(['content-type',type],['content-digest',contentDigest(body)],['idempotency-key',id]);
 const input=signatureInput(method,{created:now(),expires:now()+120,keyId:scope.keyId,nonce:randomBytes(24).toString('base64url')});m.headers.push(['signature-input',input],['signature',`sig1=:${sign(null,Buffer.from(signatureBase(m,input)),keys.privateKey).toString('base64')}:`]);return m;
}
const send=m=>wireHttp(cfg.port,m.method,m.path,[['Host',cfg.authority],...m.headers,...(m.method==='GET'?[]:[['Content-Length',String(m.body.length)]])],Buffer.from(m.body));
const read=path=>wireHttp(cfg.port,'GET',prefix+'/'+path,[['Host',cfg.authority]]);
const report={synthetic:true,started:new Date().toISOString(),reads:[],writes:[],errors:[],rounds:60,idleSeconds:60};
function image(){const chunk=(type,data)=>{const b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(type,4);data.copy(b,8);b.writeUInt32BE(crc32(b.subarray(4,-4)),b.length-4);return b;};const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(128);ihdr.writeUInt32BE(128,4);ihdr.set([8,6,0,0,0],8);const pixels=randomBytes(128*(1+128*4));for(let y=0;y<128;y++)pixels[y*513]=0;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]);}
let sequence=1000;
try{
 await delay(30000);
 for(const c of golden.content)assert.equal((await send(message('PUT',prefix+'/content/'+c.sha256,Buffer.from(c.text),'seed-'+c.sha256.slice(0,12),c.contentType))).status,201);
 const initial=await send(message('POST',prefix+'/events',encode(golden.batch),golden.batch.batchId));assert.equal(initial.status,201);report.receipt=initial.body;
 const topic=clone(golden.batch.events.find(x=>x.type==='discussion.opened'));topic.eventId='capacity-topic';topic.sourceSequence=String(sequence++);topic.payload.discussionId='capacity-topic';topic.payload.topic='SYNTHETIC capacity discussion';
 assert.equal((await send(message('POST',prefix+'/events',encode({...golden.batch,batchId:'capacity-topic',events:[topic]}),'capacity-topic'))).status,201);
 for(let round=0;round<60;round++){
  const began=performance.now(),id='capacity-artifact-'+Math.floor(round/10),version=round%10+1,events=[];
  const type=['text/plain','application/json','image/png'][round%3];const bytes=type==='image/png'?image():type==='application/json'?encode({synthetic:true,round,observations:Array.from({length:1000},(_,i)=>({id:i,description:'synthetic only'}))}):Buffer.from('SYNTHETIC CAPACITY REPORT '+round+'\n'+'Evidence limitation. '.repeat(3000));const hash=createHash('sha256').update(bytes).digest('hex');
  const upload=()=>send(message('PUT',prefix+'/content/'+hash,bytes,'capacity-upload-'+round,type));assert.equal((await upload()).status,201);if(round%10===0)assert.equal((await upload()).status,201);
  if(version===1){const reg=clone(golden.batch.events.find(x=>x.type==='artifact.registered'));reg.eventId=id+'-registered';reg.sourceSequence=String(sequence++);reg.payload.artifactId=id;reg.payload.title='Synthetic capacity report';events.push(reg);}
  const artifact=clone(golden.batch.events.find(x=>x.type==='artifact.published'));artifact.eventId=id+'-'+version;artifact.sourceSequence=String(sequence++);Object.assign(artifact.payload,{artifactId:id,version,title:'Synthetic capacity report '+round,sha256:hash,sizeBytes:bytes.length,contentType:type,supersedes:version===1?null:{kind:'artifact',id,version:version-1,relation:'supersedes'}});events.push(artifact);
  for(let n=0;n<30;n++){const c=clone(golden.batch.events.find(x=>x.type==='discussion.contribution'));c.eventId='capacity-contribution-'+round+'-'+n;c.sourceSequence=String(sequence++);Object.assign(c.payload,{discussionId:'capacity-topic',contributionId:c.eventId,ordinal:String(round*30+n+1),body:'SYNTHETIC discussion contribution. '+ 'Evidence limitation. '.repeat(50),replyTo:n?events.at(-1).payload.contributionId:null,evidence:[{kind:'artifact',id,version,relation:n%5===0?'challenges':'supports'}]});events.push(c);}
  const batch={...golden.batch,batchId:'capacity-round-'+round,events};const request=()=>send(message('POST',prefix+'/events',encode(batch),batch.batchId));
  const writeStart=performance.now();const result=await request();assert.equal(result.status,201,result.raw);report.writes.push({round,ms:performance.now()-writeStart,events:events.length,contentBytes:bytes.length,type});
  if(round%10===0){const retry=await request();assert.equal(retry.status,200);assert.deepEqual(retry.body,result.body);}
  await Promise.all(['events?limit=20','discussions/capacity-topic?limit=20','artifacts?limit=20','artifacts/'+id+'/versions/'+version+'/content'].map(async path=>{const start=performance.now(),response=await read(path);assert.equal(response.status,200);report.reads.push({path: path.split('?')[0],ms:performance.now()-start,bytes:response.bytes.length});if(response.body.nextCursor){const next=await read(path+'&after='+response.body.nextCursor);assert.equal(next.status,200);}}));
  if(round%10===0)report.writes.at(-1).checkpoint=db.db.pragma('wal_checkpoint(PASSIVE)');
  if(round===29)await delay(30000);
  await delay(Math.max(0,15000-(performance.now()-began)));
 }
 report.events=db.get('SELECT count(*) n FROM events').n;report.artifactVersions=db.get('SELECT count(*) n FROM artifact_versions').n;report.registry=db.get("SELECT count(*) n FROM events WHERE event_type='artifact.registered'").n;report.archiveBytes=db.get('SELECT sum(bytes) n FROM runs').n;report.contentBytes=db.get('SELECT sum(size_bytes) n FROM content_objects').n;
 report.integrity=db.db.pragma('integrity_check');report.foreignKeys=db.db.pragma('foreign_key_check');assert.deepEqual(report.integrity,[{integrity_check:'ok'}]);assert.deepEqual(report.foreignKeys,[]);
 const values=report.reads.map(x=>x.ms).sort((a,b)=>a-b);report.latency={p50:values[Math.floor(values.length*.5)],p95:values[Math.floor(values.length*.95)],max:values.at(-1)};report.finished=new Date().toISOString();
 await writeFile('/var/lib/inv03-acceptance/capacity.json',JSON.stringify(report),{mode:0o600});console.log(JSON.stringify({...report,reads:report.reads.length,writes:report.writes.length}));
}finally{const controls=new Controls(db).snapshot();db.fenceRestore(new Date().toISOString());new Controls(db).reconcile(controls,(await import('../dist/src/schema.js')).canonicalHash(controls),new Date().toISOString());db.close();}
