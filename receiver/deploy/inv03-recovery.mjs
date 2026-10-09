// Explicitly disposable Linux capacity/recovery archive only.
import assert from 'node:assert/strict';
import {generateKeyPairSync,randomBytes,sign,createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {Archive} from '../dist/src/database.js';
import {Controls} from '../dist/src/controls.js';
import {integrity,backup,restore} from '../dist/src/backup.js';
import {canonicalHash} from '../dist/src/schema.js';
import {loadConfig} from '../dist/src/config.js';
import {contentDigest,signatureBase,signatureInput} from '../dist/src/signatures.js';
import {golden,examples,prefix,clone,encode,wireHttp} from '../dist/test/helpers.js';
process.umask(0o077);
const root='/var/lib/inv03-acceptance',cfg=loadConfig(root+'/config.json');assert.equal(cfg.dataDir,root+'/data');assert.equal(cfg.port,13101);
const db=new Archive(cfg),mode=process.argv[2],now=()=>Math.floor(Date.now()/1000),time=()=>new Date().toISOString();
const state=()=>({events:db.get('SELECT count(*) n FROM events').n,batches:db.get('SELECT count(*) n FROM batches').n,receiptHash:createHash('sha256').update(JSON.stringify(db.all('SELECT batch_id,body_digest,receipt_json FROM batches ORDER BY batch_id'))).digest('hex')});
try{
 if(mode==='capture'){await integrity(db);await writeFile(root+'/restart-state.json',JSON.stringify(state()));console.log(JSON.stringify({state:state(),integrity:true}));}
 else if(mode==='compare'){assert.deepEqual(state(),JSON.parse(await readFile(root+'/restart-state.json')));await integrity(db);console.log(JSON.stringify({state:state(),integrity:true}));}
 else if(mode==='overlap'){
  const key=generateKeyPairSync('ed25519'),scope={...clone(examples.PublisherScope),publisherId:'inv03-synthetic',keyId:'inv03-recovery-'+randomBytes(4).toString('hex'),generation:String(BigInt(db.key('inv03-ephemeral').generation)+1n),expiresAt:new Date((now()+300)*1000).toISOString(),writesPerMinute:60};
  assert.equal(db.key('inv03-ephemeral').revoked,1);db.authorize(scope,{publicKey:key.publicKey.export({type:'spki',format:'pem'}).toString(),notBefore:now()-1,notAfter:now()+300},time());
  const send=async(method,path,body=Buffer.alloc(0),id='recovery')=>{const m={method,path,body,authority:cfg.authority,headers:[['botsquad-generation',scope.generation]]};if(method!=='GET')m.headers.push(['content-type','application/json'],['content-digest',contentDigest(body)],['idempotency-key',id]);const input=signatureInput(method,{created:now(),expires:now()+120,keyId:scope.keyId,nonce:randomBytes(24).toString('base64url')});m.headers.push(['signature-input',input],['signature',`sig1=:${sign(null,Buffer.from(signatureBase(m,input)),key.privateKey).toString('base64')}:`]);return wireHttp(cfg.port,method,path,[['Host',cfg.authority],...m.headers,...(method==='GET'?[]:[['Content-Length',String(body.length)]])],body);};
  const original=JSON.parse(db.get('SELECT receipt_json FROM batches WHERE batch_id=?',golden.batch.batchId).receipt_json);const receipt=await send('GET',prefix+'/receipts/'+golden.batch.batchId);assert.equal(receipt.status,200);assert.deepEqual(receipt.body,original);const retry=await send('POST',prefix+'/events',encode(golden.batch),golden.batch.batchId);assert.equal(retry.status,200);assert.deepEqual(retry.body,original);
  const conflict=clone(golden.batch);conflict.events[0].occurredAt='2026-01-05T11:00:00Z';assert.equal((await send('POST',prefix+'/events',encode(conflict),golden.batch.batchId)).status,409);
  const timings=[];
  for(let i=0;i<4;i++){
   const event=clone(golden.batch.events.find(x=>x.type==='worker.activity'));event.eventId='overlap-'+i;event.sourceSequence=String(5000+i);const batch={...golden.batch,batchId:event.eventId,events:[event]};
   const locker=spawn(process.execPath,['--input-type=module','-e',"import Database from 'better-sqlite3';const d=new Database(process.argv[1]);d.exec('BEGIN IMMEDIATE');console.log('locked');setTimeout(()=>{d.exec('COMMIT');d.close()},300)",cfg.dataDir+'/archive.sqlite'],{stdio:['ignore','pipe','inherit']});const finished=once(locker,'close');await once(locker.stdout,'data');const start=performance.now();
   const results=await Promise.all([send('POST',prefix+'/events',encode(batch),batch.batchId),...Array.from({length:3},()=>wireHttp(cfg.port,'GET',prefix+'/events?limit=20',[['Host',cfg.authority]]))]);assert.equal(results[0].status,201);results.slice(1).forEach(r=>assert.equal(r.status,200));await finished;timings.push(performance.now()-start);
  }
  const cursor=(await wireHttp(cfg.port,'GET',prefix+'/events?limit=2',[['Host',cfg.authority]])).body.nextCursor;
  const current=new Controls(db).snapshot();db.fenceRestore(time());new Controls(db).reconcile(current,canonicalHash(current),time());assert.equal((await send('GET',prefix+'/receipts/'+golden.batch.batchId)).status,403);assert.equal((await wireHttp(cfg.port,'GET',prefix+'/events?limit=2&after='+cursor,[['Host',cfg.authority]])).body.code,'CURSOR_RESET');
  await integrity(db);console.log(JSON.stringify({overlappingWrites:4,overlappingReads:12,sqliteWriterLockMs:300,timings,lostReceiptReconciled:true,duplicateSuppressed:true,conflictingReceiptRejected:true,oldKeysFenced:true,cursorReset:true}));
 }else if(mode==='backup'){
  const result=await backup(db,root+'/snapshot',time());const event=golden.batch.events.find(x=>x.type==='artifact.published');db.hide('fixture-experiment','fixture-run',event.eventId,'withdrawn',time());const controls=new Controls(db).snapshot();
  const restored=await restore(root+'/snapshot',root+'/restored',result.digest,time()),copy=new Archive(restored);try{assert.equal(new Controls(copy).held(),true);new Controls(copy).reconcile(controls,canonicalHash(controls),time());assert.equal(copy.get('SELECT count(*) n FROM publisher_keys WHERE revoked=0').n,0);await integrity(copy);console.log(JSON.stringify({files:Object.keys(result.manifest.files).length,manifest:result.digest,restoreFenced:true,newerWithdrawalReconciled:true,events:copy.get('SELECT count(*) n FROM events').n}));}finally{copy.close();}
 }else throw Error('Unknown explicit mode');
}finally{db.close();}
