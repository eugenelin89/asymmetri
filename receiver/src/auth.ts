import { createPublicKey } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import type { PublisherScope } from '../vendor/investment/v1/types.js';
import { Archive, type KeyRow } from './database.js';
import { requireContract as need, validate } from './schema.js';
import { verifySignedRequest, type SignedMessage } from './signatures.js';

export interface Auth { key: KeyRow; scope: PublisherScope; message: SignedMessage; now: number }
export function rawHeaders(req: IncomingMessage, authority: string): Map<string,string> {
  const h = new Map<string,string>();
  for (let i=0;i<req.rawHeaders.length;i+=2) {
    const k=req.rawHeaders[i]!.toLowerCase(), v=req.rawHeaders[i+1]!;
    need(!h.has(k) && /^[!#$%&'*+.^_`|~0-9a-z-]+$/.test(k) && v===v.trim() && !/[\r\n]/.test(v),'UNAUTHENTICATED'); h.set(k,v);
  }
  need(h.get('host')===authority,'UNAUTHENTICATED');
  // A future proxy must preserve the configured Host. Forwarded authority is never trusted.
  need(![...h.keys()].some(k=>k==='forwarded'||k.startsWith('x-forwarded-')),'UNAUTHENTICATED');
  need(!h.has('transfer-encoding') && !h.has('content-encoding') && !h.has('expect') && !h.has('trailer'),'INVALID_REQUEST');
  return h;
}
export function identify(db: Archive, h: Map<string,string>, experiment: string, run: string, now: number): KeyRow {
  const input=h.get('signature-input'); need(input,'UNAUTHENTICATED');
  const id=/;keyid="([A-Za-z0-9][A-Za-z0-9_-]{0,63})";nonce=/.exec(input)?.[1]; need(id,'UNAUTHENTICATED');
  const key=db.key(id); need(key,'UNAUTHENTICATED');
  const scope=validate<PublisherScope>('PublisherScope',JSON.parse(key.scope_json));
  need(!key.revoked && scope.enabled && now>=key.not_before && now<key.not_after && now*1000<Date.parse(scope.expiresAt),'FORBIDDEN');
  need(scope.experimentId===experiment && scope.runId===run,'FORBIDDEN');
  need(h.get('botsquad-generation')===key.generation,'CONFLICT');
  return key;
}
export function authenticate(db: Archive, message: SignedMessage, experiment: string, run: string, now: number): Auth {
  const h=new Map(message.headers.map(([k,v])=>[k.toLowerCase(),v]));
  const key=identify(db,h,experiment,run,now), scope={...JSON.parse(key.scope_json),keyId:key.key_id} as PublisherScope;
  const proof=verifySignedRequest(message,{authority:db.config.authority,generation:key.generation,keyId:key.key_id,publicKey:createPublicKey(key.public_key),enabled:!key.revoked,notBefore:key.not_before,notAfter:key.not_after,now,usedNonces:new Set(),targets:new Set([`${message.method} ${message.path}`])});
  const nonce=proof.nonceKey.slice(key.key_id.length+1);
  db.atomic(()=>{
    identify(db,h,experiment,run,now);
    db.run('DELETE FROM nonces WHERE expires<?',now);
    need(!db.get('SELECT 1 FROM nonces WHERE key_id=? AND nonce=?',key.key_id,nonce),'REPLAY');
    const minute=`m${Math.floor(now/60)}`,day=`d${Math.floor(now/86400)}`;
    const minutes=db.get<{count:number}>('SELECT count FROM quotas WHERE publisher_id=? AND period=?',key.publisher_id,minute)?.count??0;
    const bytes=db.get<{bytes:number}>('SELECT bytes FROM quotas WHERE publisher_id=? AND period=?',key.publisher_id,day)?.bytes??0;
    need((message.method==='GET'||minutes<scope.writesPerMinute) && bytes+message.body.length<=scope.bytesPerDay,'RATE_LIMITED');
    // Receipt access has a separate bounded bucket, so reconciliation survives a write burst.
    const period=message.method==='GET'?`r${Math.floor(now/60)}`:minute;
    const count=db.get<{count:number}>('SELECT count FROM quotas WHERE publisher_id=? AND period=?',key.publisher_id,period)?.count??0;
    need(count<(message.method==='GET'?60:scope.writesPerMinute),'RATE_LIMITED');
    if(message.method!=='GET')db.admitWrite(8192);
    need(db.get<{n:number}>('SELECT count(*) n FROM nonces')!.n<10000,'RATE_LIMITED');
    db.run('INSERT INTO nonces VALUES(?,?,?)',key.key_id,nonce,proof.retainUntil);
    for(const p of [period,day]) db.run('INSERT INTO quotas VALUES(?,?,1,?) ON CONFLICT(publisher_id,period) DO UPDATE SET count=count+1,bytes=bytes+excluded.bytes',key.publisher_id,p,message.body.length);
    db.run('DELETE FROM quotas WHERE period NOT IN(?,?,?)',minute,day,`r${Math.floor(now/60)}`);
  });
  return {key,scope,message,now};
}
export function recheck(db: Archive, auth: Auth, now: number): PublisherScope {
  const key=identify(db,new Map(auth.message.headers),auth.scope.experimentId,auth.scope.runId,now);
  need(key.public_key===auth.key.public_key,'FORBIDDEN');
  verifySignedRequest(auth.message,{authority:db.config.authority,generation:key.generation,keyId:key.key_id,publicKey:createPublicKey(key.public_key),enabled:!key.revoked,notBefore:key.not_before,notAfter:key.not_after,now,usedNonces:new Set(),targets:new Set([`${auth.message.method} ${auth.message.path}`])});
  const scope={...JSON.parse(key.scope_json),keyId:key.key_id} as PublisherScope;
  need(JSON.stringify(scope)===JSON.stringify(auth.scope),'FORBIDDEN');
  return scope;
}
