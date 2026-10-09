import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import type { Config } from './config.js';
import type { ContentType } from '../vendor/investment/v1/types.js';
import { Archive } from './database.js';
import { Storage, type Fault } from './storage.js';
import { Ingestion } from './ingestion.js';
import { PublicReads } from './reads.js';
import { rawHeaders, identify, authenticate } from './auth.js';
import { ContractError, problem, requireContract as need, validate } from './schema.js';
import type { SignedMessage } from './signatures.js';

interface Parameter {name:string;in:string;schema:{$ref?:string;type?:string;minimum?:number;maximum?:number;enum?:string[]}}
interface Operation {operationId:string;security:unknown[];parameters:Parameter[]}
const api=JSON.parse(readFileSync(new URL('../../vendor/investment/v1/openapi.json',import.meta.url),'utf8')) as {paths:Record<string,Record<string,Operation>>};
const routes=Object.entries(api.paths).filter(([path])=>path.startsWith('/api/experiments/v1/')).map(([path,methods])=>({methods,names:[...path.matchAll(/\{([^}]+)\}/g)].map(x=>x[1]!),pattern:new RegExp('^'+path.replace(/\{[^}]+\}/g,'([^/]+)')+'$')}));
function parameter(p:Parameter,v:string):void {
  if(p.schema.$ref)validate(p.schema.$ref.split('/').at(-1)!,v);
  else if(p.schema.type==='integer'){need(/^[1-9][0-9]*$/.test(v));const n=Number(v);need(Number.isSafeInteger(n)&&n>=(p.schema.minimum??1)&&n<=(p.schema.maximum??1000000));}
  else if(p.schema.enum)need(p.schema.enum.includes(v));
}
async function body(req:IncomingMessage,length:number,limit:number):Promise<Buffer> {
  need(length>0&&length<=limit,'TOO_LARGE');const chunks:Buffer[]=[];let size=0;
  for await(const part of req){const b=Buffer.from(part);size+=b.length;need(size<=limit&&size<=length,'TOO_LARGE');chunks.push(b);}
  need(req.complete&&size===length,'INVALID_REQUEST');return Buffer.concat(chunks);
}
export interface Diagnostics {requests:number;accepted:number;errors:number;active:number}
export async function createReceiver(config:Config,options:{now?:()=>number;fault?:Fault;log?:(entry:{requestId:string;code:string;status:number})=>void}={}) {
  need(config.enabled,'UNAVAILABLE');
  const now=options.now??(()=>Math.floor(Date.now()/1000)),fault=options.fault??(()=>{});
  const db=new Archive(config),storage=new Storage(db,fault);await storage.init();
  const ingestion=new Ingestion(db,storage,now,fault),reads=new PublicReads(db,now);
  const diagnostics:Diagnostics={requests:0,accepted:0,errors:0,active:0};
  let bucket=-1,count=0,closing=false;
  function send(res:ServerResponse,status:number,value:unknown,cache='private, no-store',headers:Record<string,string>={}):void {
    const bytes=Buffer.from(JSON.stringify(value));need(bytes.length<=2097152,'UNAVAILABLE');
    res.writeHead(status,{'Content-Type':status>=400?'application/problem+json':'application/json','Cache-Control':cache,'X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'; sandbox",'Referrer-Policy':'no-referrer','Content-Length':String(bytes.length),...headers});res.end(bytes);
  }
  const server=createServer({maxHeaderSize:16384,requestTimeout:15000,keepAliveTimeout:2000},async(req,res)=>{
    const requestId=randomUUID();let active=false,temp:string|undefined;
    try {
      diagnostics.requests++;
      if(bucket!==Math.floor(now()/60)){bucket=Math.floor(now()/60);count=0;}
      need(!closing&&++count<=600,'RATE_LIMITED');need(diagnostics.active<8,'RATE_LIMITED');diagnostics.active++;active=true;
      need(req.rawHeaders.length<=128,'TOO_LARGE');
      const h=rawHeaders(req,config.authority),url=req.url??'';
      need(url.length<=2048&&!url.includes('#'),'INVALID_REQUEST');
      const [path,queryText]=url.split('?');need(path&&/^\/api\/[A-Za-z0-9_/-]+$/.test(path)&&!path.includes('//'),'INVALID_REQUEST');
      const route=routes.find(x=>x.pattern.test(path));need(route,'NOT_FOUND');
      const method=req.method??'',op=route.methods[method.toLowerCase()];
      if(!op){const p=problem('INVALID_REQUEST',requestId);p.status=405;send(res,405,validate('Problem',p),'private, no-store',{Allow:Object.keys(route.methods).map(x=>x.toUpperCase()).join(', ')});return;}
      const signed=op.security.length>0;
      if(signed)need(!url.includes('?'),'UNAUTHENTICATED');
      const match=route.pattern.exec(path)!,params=Object.fromEntries(route.names.map((name,i)=>[name,match[i+1]!]));
      const query=new URLSearchParams(queryText??'');need(!queryText||!queryText.includes('?'),'INVALID_REQUEST');
      need(new Set([...query.keys()]).size===[...query.keys()].length,'INVALID_REQUEST');
      for(const [name,value]of query){const p=op.parameters.find(p=>p.in==='query'&&p.name===name);need(p,'INVALID_REQUEST');parameter(p,value);}
      for(const p of op.parameters.filter(x=>x.in==='path'))parameter(p,params[p.name]!);
      if(query.has('from')&&query.has('to'))need(query.get('from')!<=query.get('to')!);
      const experiment=params.experimentId!,run=params.runId;
      if(!signed) {
        need(method==='GET'&&(!h.has('content-length')||h.get('content-length')==='0')&&!h.has('content-type')&&!h.has('content-digest'),'INVALID_REQUEST');
        const prefix=`/api/experiments/v1/experiments/${experiment}/runs/${run}/`;
        const tail=run?path.slice(prefix.length).split('/'):[];
        const result=reads.read(path,query,experiment,run,tail);
        // Revalidation on every reuse prevents shared caches serving withdrawn bodies.
        const cache='public, max-age=0, must-revalidate';
        if(h.get('if-none-match')===result.etag){res.writeHead(304,{'Cache-Control':cache,ETag:result.etag,'X-Content-Type-Options':'nosniff'});res.end();return;}
        send(res,200,result.body,cache,{ETag:result.etag});return;
      }
      need(run,'FORBIDDEN');identify(db,h,experiment,run,now());
      const methodTyped=method as SignedMessage['method'];let bytes:Buffer=Buffer.alloc(0),contentType:ContentType|undefined;
      if(method==='GET'){need(!h.has('content-length')||h.get('content-length')==='0','UNAUTHENTICATED');}
      else {
        const lengthText=h.get('content-length');need(lengthText&&/^(0|[1-9][0-9]{0,8})$/.test(lengthText),'INVALID_REQUEST');const length=Number(lengthText);
        if(op.operationId==='stageArtifactContent'){
          need(['text/plain','text/markdown','application/json','text/csv','image/png'].includes(h.get('content-type')??''),'UNSUPPORTED_MEDIA');
          contentType=validate<ContentType>('ContentType',h.get('content-type'));
          const upload=await storage.temporary(req,contentType==='image/png'?4194304:131072,length);temp=upload.path;bytes=upload.bytes;
        }else{need(h.get('content-type')==='application/json','UNSUPPORTED_MEDIA');bytes=await body(req,length,op.operationId==='publishHeartbeat'?16384:1048576);}
      }
      const message:SignedMessage={method:methodTyped,authority:config.authority,path,headers:[...h],body:bytes};
      const auth=authenticate(db,message,experiment,run,now());
      switch(op.operationId){
        case 'publishEventBatch':{const result=await ingestion.batch(auth);fault('before-http-response');send(res,result.status,result.body);diagnostics.accepted++;break;}
        case 'stageArtifactContent':{const result=await ingestion.content(auth,temp!,contentType!,params.sha256!);send(res,201,result);diagnostics.accepted++;break;}
        case 'publishHeartbeat':send(res,200,ingestion.heartbeat(auth));break;
        case 'readPublicationReceipt':send(res,200,ingestion.receipt(auth,params.batchId!));break;
        default:need(false,'NOT_FOUND');
      }
    }catch(error){
      diagnostics.errors++;
      const sqlCode=(error as {code?:string}).code;
      const code=error instanceof ContractError?error.code:sqlCode?.startsWith('SQLITE_CONSTRAINT')?'CONFLICT':'UNAVAILABLE';
      const p=problem(code,requestId);options.log?.({requestId,code,status:p.status});
      if(!res.headersSent&&!res.destroyed)send(res,p.status,p,'private, no-store',{Connection:'close',...(p.retryAfterSeconds?{'Retry-After':String(p.retryAfterSeconds)}:{})});
      else res.destroy();
    }finally{if(temp)await unlink(temp).catch(()=>{});if(active)diagnostics.active--;}
  });
  server.maxHeadersCount=0;server.maxRequestsPerSocket=100;server.headersTimeout=5000;server.setTimeout(15000);
  server.on('timeout',socket=>socket.destroy());
  let connections=0;
  server.on('connection',socket=>{if(++connections>64)socket.destroy();socket.once('close',()=>connections--);});
  server.on('clientError',(_error,socket)=>{if(socket.writable)socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nCache-Control: private, no-store\r\nContent-Length: 0\r\n\r\n');});
  server.on('checkContinue',(_req,res)=>{send(res,400,problem('INVALID_REQUEST',randomUUID()),'private, no-store',{Connection:'close'});});
  await new Promise<void>((resolve,reject)=>{server.once('error',reject);server.listen(config.port,config.host,()=>{server.off('error',reject);resolve();});});
  const address=server.address();need(address&&typeof address==='object');
  return {server,db,storage,diagnostics,url:`http://127.0.0.1:${address.port}`,async close(){closing=true;await new Promise<void>(resolve=>server.close(()=>resolve()));db.close();}};
}
