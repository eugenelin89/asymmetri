import { connect,createServer,isIP,type Socket } from 'node:net';
import { Duplex } from 'node:stream';
import { createSecureContext,TLSSocket,type SecureContext } from 'node:tls';
import { readFileSync,statSync } from 'node:fs';
import { isAbsolute } from 'node:path';
import { X509Certificate } from 'node:crypto';
import { requireContract as need } from './schema.js';

export interface TlsIngressConfig { enabled:boolean;port:number;upstreamPort:number;servername:string;certificatePath:string;privateKeyPath:string }
export function tlsIngressConfig(value:unknown):TlsIngressConfig {
  need(value!==null&&typeof value==='object'&&!Array.isArray(value));const input=value as Record<string,unknown>;
  need(Object.keys(input).sort().join(',')==='certificatePath,enabled,port,privateKeyPath,servername,upstreamPort'&&typeof input.enabled==='boolean');
  need(Number.isInteger(input.port)&&Number(input.port)>=0&&Number(input.port)<=65535);
  need(Number.isInteger(input.upstreamPort)&&Number(input.upstreamPort)>0&&Number(input.upstreamPort)<=65535&&input.port!==input.upstreamPort);
  need(typeof input.servername==='string'&&/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(input.servername));
  for(const field of ['certificatePath','privateKeyPath'])need(typeof input[field]==='string'&&isAbsolute(input[field] as string));
  return input as unknown as TlsIngressConfig;
}

/** Loopback PROXY-v1 + TLS endpoint for only the apex selected by the SNI dispatcher.
 * Generic Duplex wrapping preserves coalesced TLS bytes without undocumented socket internals.
 */
export async function createTlsIngress(config:TlsIngressConfig,clock=Date.now){
  need(config.enabled,'UNAVAILABLE');
  const load=():SecureContext=>{
    for(const path of [config.certificatePath,config.privateKeyPath]){const stat=statSync(path);need(stat.isFile()&&stat.size<=131072,'UNAVAILABLE');}
    const cert=readFileSync(config.certificatePath),leaf=new X509Certificate(cert),now=Date.now();
    need(leaf.checkHost(config.servername,{subject:'never'})!==undefined&&
      Date.parse(leaf.validFrom)<=now&&now<Date.parse(leaf.validTo),'UNAVAILABLE');
    return createSecureContext({cert,key:readFileSync(config.privateKeyPath),minVersion:'TLSv1.2',maxVersion:'TLSv1.3'});
  };
  let context=load(),pendingHandshakes=0,handshakeTokens=64,lastRefill=clock();
  const sockets=new Set<Socket>();
  const server=createServer(raw=>{
    if(sockets.size>=256||pendingHandshakes>=32){raw.destroy();return;}
    sockets.add(raw);pendingHandshakes++;
    let handshaking=true,buffer:Buffer=Buffer.alloc(0),encrypted:Duplex|undefined,tls:TLSSocket|undefined,upstream:Socket|undefined;
    const finishHandshake=()=>{if(handshaking){handshaking=false;pendingHandshakes--;}};
    const deadline=setTimeout(()=>raw.destroy(),5000);deadline.unref();
    raw.setTimeout(15000,()=>raw.destroy());
    raw.on('error',()=>raw.destroy());
    raw.on('close',()=>{finishHandshake();clearTimeout(deadline);sockets.delete(raw);tls?.destroy();encrypted?.destroy();upstream?.destroy();});
    const inspect=(chunk:Buffer)=>{
      buffer=Buffer.concat([buffer,chunk]);const end=buffer.indexOf('\r\n');
      if(end<0){if(buffer.length>107)raw.destroy();return;}
      if(end>105){raw.destroy();return;}
      const match=/^PROXY (TCP4|TCP6) ([^ ]+) ([^ ]+) ([0-9]{1,5}) ([0-9]{1,5})$/.exec(buffer.subarray(0,end).toString('latin1'));
      if(!match||![match[2],match[3]].every(ip=>isIP(ip!)===(match[1]==='TCP4'?4:6))||![match[4],match[5]].every(port=>Number(port)>=1&&Number(port)<=65535)){raw.destroy();return;}
      // Aggregate, in-memory budget: no client identifier or request is retained.
      const now=clock();handshakeTokens=Math.min(64,handshakeTokens+Math.max(0,now-lastRefill)*32/1000);lastRefill=Math.max(lastRefill,now);
      if(handshakeTokens<1){raw.destroy();return;}handshakeTokens--;
      const proxy=Buffer.from(buffer.subarray(0,end+2)),rest=buffer.subarray(end+2);buffer=Buffer.alloc(0);
      raw.pause();raw.off('data',inspect);
      encrypted=new Duplex({
        read(){raw.resume();},
        write(chunk:Buffer,_encoding,callback){raw.write(chunk,callback);},
        final(callback){raw.end(callback);},
        destroy(error,callback){raw.destroy();callback(error);},
      });
      const transport=encrypted;
      transport.on('error',()=>raw.destroy());
      raw.on('data',part=>{if(!transport.push(part))raw.pause();});
      raw.on('end',()=>transport.push(null));
      if(rest.length)transport.push(rest);
      tls=new TLSSocket(transport,{isServer:true,secureContext:context,requestCert:false,
        ALPNCallback:hello=>hello.protocols.includes('http/1.1')?'http/1.1':undefined,
        SNICallback:(name,callback)=>name===config.servername?callback(null,context):callback(new Error('Unrecognized TLS name.'))});
      const secure=tls;
      secure.on('error',()=>raw.destroy());
      secure.once('secure',()=>{
        finishHandshake();clearTimeout(deadline);secure.disableRenegotiation();secure.pause();
        upstream=connect({host:'127.0.0.1',port:config.upstreamPort});const target=upstream;
        const timeout=setTimeout(()=>target.destroy(),2000);timeout.unref();
        target.on('connect',()=>{clearTimeout(timeout);target.write(proxy);secure.pipe(target);target.pipe(secure);secure.resume();});
        target.on('error',()=>raw.destroy());
        target.on('close',()=>{clearTimeout(timeout);if(!target.readableEnded)raw.destroy();});
      });
    };
    raw.on('data',inspect);
  });
  await new Promise<void>((resolve,reject)=>{server.once('error',reject);server.listen(config.port,'127.0.0.1',()=>{server.off('error',reject);resolve();});});
  return {server,reload(){const next=load();context=next;},async close(){for(const socket of sockets)socket.destroy();await new Promise<void>(resolve=>server.close(()=>resolve()));}};
}
