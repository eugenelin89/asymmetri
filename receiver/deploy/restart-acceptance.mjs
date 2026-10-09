// Receipts/authority reconciliation for the disposable systemd recovery drill.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash,generateKeyPairSync,randomBytes,sign } from 'node:crypto';
import { Archive } from '../dist/src/database.js';
import { loadConfig } from '../dist/src/config.js';
import { signatureBase,signatureInput,contentDigest } from '../dist/src/signatures.js';
import { golden,examples,prefix,encode,wireHttp } from '../dist/test/helpers.js';
process.umask(0o077);
const cfg=loadConfig('/var/lib/infra02-acceptance/config.json');assert.equal(cfg.dataDir,'/var/lib/infra02-acceptance/data');
const db=new Archive(cfg),mode=process.argv[2];
const receipt=JSON.parse(db.get('SELECT receipt_json FROM batches WHERE batch_id=?',golden.batch.batchId).receipt_json);
const snapshot=()=>({events:db.get('SELECT count(*) n FROM events').n,batches:db.get('SELECT count(*) n FROM batches').n,nonces:db.get('SELECT count(*) n FROM nonces').n,receiptHash:createHash('sha256').update(JSON.stringify(receipt)).digest('hex'),integrity:db.db.pragma('integrity_check'),foreignKeys:db.db.pragma('foreign_key_check')});
try {
 if(mode==='capture') {
  await writeFile('/var/lib/infra02-acceptance/restart-before.json',JSON.stringify(snapshot()),{mode:0o600});console.log(JSON.stringify(snapshot()));
 } else {
  assert.equal(mode,'reconcile');const before=JSON.parse(await readFile('/var/lib/infra02-acceptance/restart-before.json','utf8'));
  assert.deepEqual(snapshot(),before);
  const now=Math.floor(Date.now()/1000),keys=generateKeyPairSync('ed25519');
  const scope={...structuredClone(examples.PublisherScope),publisherId:'infra02-synthetic',keyId:'infra02-reconcile-'+randomBytes(4).toString('hex'),generation:String(BigInt(db.key('infra02-ephemeral').generation)+1n),expiresAt:new Date((now+300)*1000).toISOString()};
  assert.equal(db.key('infra02-ephemeral').revoked,1);assert.equal(JSON.parse(db.key('infra02-ephemeral').scope_json).enabled,false);
  const unsigned=await wireHttp(cfg.port,'GET',prefix+'/receipts/'+golden.batch.batchId,[['Host',cfg.authority]]);assert.equal(unsigned.status,401);
  db.authorize(scope,{publicKey:keys.publicKey.export({type:'spki',format:'pem'}).toString(),notBefore:now-1,notAfter:now+300},new Date().toISOString());
  async function request(method,path,body=Buffer.alloc(0)) {
   const m={method,path,body,authority:cfg.authority,headers:[['botsquad-generation',scope.generation]]};
   if(method!=='GET')m.headers.push(['content-type','application/json'],['content-digest',contentDigest(body)],['idempotency-key',golden.batch.batchId]);
   const input=signatureInput(method,{created:now,expires:now+120,keyId:scope.keyId,nonce:randomBytes(24).toString('base64url')});m.headers.push(['signature-input',input],['signature',`sig1=:${sign(null,Buffer.from(signatureBase(m,input)),keys.privateKey).toString('base64')}:`]);
   return wireHttp(cfg.port,method,path,[['Host',cfg.authority],...m.headers,...(method==='GET'?[]:[['Content-Length',String(body.length)]])],body);
  }
  const fetched=await request('GET',prefix+'/receipts/'+golden.batch.batchId);assert.equal(fetched.status,200);assert.deepEqual(fetched.body,receipt);
  const retried=await request('POST',prefix+'/events',encode(golden.batch));assert.equal(retried.status,200);assert.deepEqual(retried.body,receipt);
  assert.equal(db.get('SELECT count(*) n FROM events').n,before.events);
  db.fenceRestore(new Date().toISOString());console.log(JSON.stringify({durable:before,oldAuthorityDenied:true,receiptReconciled:true,identicalRetry:true,newTemporaryAuthorityFenced:true}));
 }
} finally {db.close();}
