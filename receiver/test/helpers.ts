import { mkdtemp, rm, chmod } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateKeyPairSync, randomBytes, sign } from 'node:crypto';
import { request, type OutgoingHttpHeaders } from 'node:http';
import type { TestContext } from 'node:test';
import type { EventBatch, ContentType, PublisherScope } from '../vendor/investment/v1/types.js';
import { config } from '../src/config.js';
import { createReceiver } from '../src/http.js';
import { contentDigest, signatureBase, signatureInput, type SignedMessage } from '../src/signatures.js';

export const golden=JSON.parse(readFileSync(new URL('../../vendor/investment/v1/golden.json',import.meta.url),'utf8')) as {batch:EventBatch;content:{text:string;sha256:string;contentType:ContentType}[]};
export const examples=JSON.parse(readFileSync(new URL('../../vendor/investment/v1/responses.json',import.meta.url),'utf8')).examples as Record<string,unknown>;
export const prefix='/api/experiments/v1/experiments/fixture-experiment/runs/fixture-run';
export const encode=(v:unknown)=>Buffer.from(JSON.stringify(v));
export const clone=<T>(v:T):T=>structuredClone(v);
export interface Response {status:number;body:Record<string,unknown>;headers:Record<string,string|string[]|undefined>;raw:string;bytes:Buffer}
export async function harness(t:TestContext){
  const dir=await mkdtemp(join(tmpdir(),'asymmetri-inv02-'));await chmod(dir,0o700);
  let clock=Math.floor(Date.parse('2026-01-05T22:00:00Z')/1000),fail='',faultAction:undefined|(()=>void);
  const cfg=config({enabled:true,dataDir:dir,authority:'receiver.test',port:0,minFreeBytes:1048576});
  const now=()=>clock,options={now,fault:(point:string)=>{if(point===fail){if(faultAction)faultAction();else throw new Error('PRIVATE disk/database diagnostic must not leak');}}};
  let receiver=await createReceiver(cfg,options);
  const keys=generateKeyPairSync('ed25519');
  const scope=clone(examples.PublisherScope) as PublisherScope;scope.keyId='local-test-key';scope.publisherId='local-test-publisher';scope.expiresAt='2027-01-01T00:00:00Z';
  const key={publicKey:keys.publicKey.export({type:'spki',format:'pem'}).toString(),notBefore:clock-3600,notAfter:clock+86400};
  receiver.db.authorize(scope,key,new Date(clock*1000).toISOString());
  t.after(async()=>{await receiver.close();await rm(dir,{recursive:true,force:true});});
  const h={dir,cfg,scope,key,keys,now,get receiver(){return receiver;},setClock(n:number){clock=n;},fault(point:string,action?:()=>void){fail=point;faultAction=action;},async restart(){await receiver.close();receiver=await createReceiver(cfg,options);},
    signed(method:'GET'|'POST'|'PUT',path:string,body:Buffer=Buffer.alloc(0),id='local-request',type='application/json',generation=scope.generation):SignedMessage{
      const message:SignedMessage={method,authority:cfg.authority,path,body,headers:[['botsquad-generation',generation]]};
      if(method!=='GET')message.headers.push(['content-type',type],['content-digest',contentDigest(body)],['idempotency-key',id]);
      const input=signatureInput(method,{created:clock,expires:clock+120,keyId:scope.keyId,nonce:randomBytes(24).toString('base64url')});
      message.headers.push(['signature-input',input],['signature',`sig1=:${sign(null,Buffer.from(signatureBase(message,input)),keys.privateKey).toString('base64')}:`]);return message;
    },
    send(message:SignedMessage,extra:[string,string][]=[],path=message.path,method=message.method):Promise<Response>{return h.http(method,path,[['Host',cfg.authority],...message.headers,...(method==='GET'?[]:[['Content-Length',String(message.body.length)] as [string,string]]),...extra],Buffer.from(message.body));},
    http(method:string,path:string,headers:[string,string][]=[],body:Buffer=Buffer.alloc(0)):Promise<Response>{
      return wireHttp((receiver.server.address() as {port:number}).port,method,path,headers,body);
    },
    get(path:string,extra:[string,string][]=[]){return h.http('GET',path,[['Host',cfg.authority],...extra]);},
    batch(batch=clone(golden.batch)){return h.send(h.signed('POST',prefix+'/events',encode(batch),batch.batchId));},
    async stage(){for(const c of golden.content){const response=await h.send(h.signed('PUT',prefix+'/content/'+c.sha256,Buffer.from(c.text),randomBytes(16).toString('hex'),c.contentType));if(response.status!==201)throw new Error('Staging failed: '+response.status+' '+response.raw);}}
  };return h;
}

export function wireHttp(port:number,method:string,path:string,headers:[string,string][]=[],body:Buffer=Buffer.alloc(0)):Promise<Response>{
  return new Promise((resolve,reject)=>{const req=request({host:'127.0.0.1',port,method,path,headers:headers.flat() as unknown as OutgoingHttpHeaders,agent:false},res=>{const chunks:Buffer[]=[];res.on('error',reject);res.on('aborted',()=>reject(new Error('response aborted')));res.on('data',b=>chunks.push(b));res.on('end',()=>{const raw=Buffer.concat(chunks).toString();resolve({status:res.statusCode!,headers:res.headers,raw,bytes:Buffer.concat(chunks),body:raw&&/json/.test(res.headers['content-type']??'')?JSON.parse(raw):{}});});});req.setTimeout(20000,()=>req.destroy(new Error('bounded test request timeout')));req.on('error',reject);req.end(body);});
}
