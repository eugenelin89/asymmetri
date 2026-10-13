/** Explicit synthetic interoperability launcher. Never imports an operational config. */
import { mkdtemp, mkdir, writeFile, readFile, chmod, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { generateKeyPairSync } from 'node:crypto';
import { connect, type Socket } from 'node:net';
import { createServer, createSecureContext, type TLSSocket } from 'node:tls';
import { askConfig } from '../src/ask/config.js';
import { createAsk } from '../src/ask/http.js';
import type { AskLimits, AskServiceScope } from '../vendor/investment/v1/types.js';
import { examples, clone } from './helpers.js';

process.umask(0o077);
async function main(): Promise<void> {
  const mode = process.argv[2];
  if (process.argv.length !== 3 || !['--start-synthetic-interop', '--start-synthetic-subscription-interop'].includes(mode!)) {
    throw new Error('Explicit synthetic interoperability mode required.');
  }
  let root: string | undefined;
  let service: Awaited<ReturnType<typeof createAsk>> | undefined;
  let tls: ReturnType<typeof createServer> | undefined;
  const sockets=new Set<Socket|TLSSocket>();
  const track=(socket:Socket|TLSSocket)=>{sockets.add(socket);socket.once('close',()=>sockets.delete(socket));};
  let stopRequested=false,finish!:()=>void;
  const stopped=new Promise<void>(resolve=>{finish=resolve;});
  const stop=()=>{stopRequested=true;finish();};
  const ensureRunning=()=>{if(stopRequested)throw new Error('Fixture cancelled during setup.');};
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
  const timeout=setTimeout(stop,3600000);timeout.unref();
  try {
    root=await mkdtemp(join(tmpdir(),'asymmetri-ask-interop-'));
    await chmod(root,0o700);ensureRunning();
    const dataDir=join(root,'private'),publicArchiveDir=join(root,'empty-public');
    await mkdir(dataDir,{mode:0o700});await mkdir(publicArchiveDir,{mode:0o700});
    ensureRunning();
    const limits: AskLimits = {...clone(examples.AskLimits as AskLimits),
      configurationStatus:'owner_approved',approvalRecordId:'synthetic-interop-only'};
    if (mode === '--start-synthetic-subscription-interop') {
      limits.monetaryEnforcement = 'activity_capped_subscription';
      limits.dailyBudgetUsd = null; limits.maxRouterExecutions = 0; limits.maxResearchCalls = 0;
      limits.subscriptionActivityPolicy = {version:'1',tokenLimits:'monitored_thresholds',actualCost:'unavailable',
        overshoot:'possible',internalRetries:'possible',onMissingUsage:'hold',onThresholdViolation:'hold'};
    }
    const config=askConfig({enabled:true,admissionEnabled:true,claimsEnabled:true,deliveryEnabled:true,
      dataDir,publicArchiveDir,port:0,authority:'asymmetri.co',origin:'https://asymmetri.co',
      serviceId:'fixture-ask',privacyNoticeVersion:'fixture-privacy-1',
      limits,
      roster:clone(examples.AskRoster)});
    // This fixture has no published context. Non-empty evidence must fail closed.
    service=await createAsk(config,{contextVisible:async refs=>refs.length===0});
    ensureRunning();
    const now=Math.floor(Date.now()/1000),scope=clone(examples.AskServiceScope) as AskServiceScope;
    scope.expiresAt=new Date((now+3600)*1000).toISOString();
    const keys=generateKeyPairSync('ed25519'),privateKeyPath=join(root,'hq-private-key.pem');
    service.authority.authorize(scope,{publicKey:keys.publicKey.export({format:'pem',type:'spki'}).toString(),notBefore:now-1,notAfter:now+3600});
    await writeFile(privateKeyPath,keys.privateKey.export({format:'pem',type:'pkcs8'}),{mode:0o600});
    ensureRunning();
    const certificatePath=join(root,'tls-cert.pem'),tlsKeyPath=join(root,'tls-key.pem');
    execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',tlsKeyPath,'-out',certificatePath,
      '-days','1','-subj','/CN=asymmetri.co','-addext','subjectAltName=DNS:asymmetri.co'],{stdio:'ignore',timeout:10000});
    await chmod(certificatePath,0o600);await chmod(tlsKeyPath,0o600);
    ensureRunning();
    const cert=await readFile(certificatePath),key=await readFile(tlsKeyPath),context=createSecureContext({cert,key});
    const receiverPort=(service.server.address() as {port:number}).port;
    tls=createServer({cert,key,minVersion:'TLSv1.2',maxVersion:'TLSv1.3',handshakeTimeout:5000,
      ALPNCallback:hello=>hello.protocols.includes('http/1.1')?'http/1.1':undefined,
      SNICallback:(name,callback)=>name==='asymmetri.co'?callback(null,context):callback(new Error('Wrong fixture TLS name.'))},socket=>{
      track(socket);socket.pause();socket.setTimeout(15000,()=>socket.destroy());
      const upstream=connect(receiverPort,'127.0.0.1');track(upstream);
      const close=()=>{socket.destroy();upstream.destroy();};
      socket.on('error',close);upstream.on('error',close);socket.on('close',()=>upstream.destroy());
      upstream.on('close',()=>{if(!upstream.readableEnded)socket.destroy();});
      upstream.once('connect',()=>{socket.pipe(upstream);upstream.pipe(socket);socket.resume();});
    });
    tls.on('connection',socket=>{track(socket);if(sockets.size>64)socket.destroy();});
    tls.on('tlsClientError',()=>{});
    await new Promise<void>((resolve,reject)=>{tls!.once('error',reject);tls!.listen(0,'127.0.0.1',resolve);});
    ensureRunning();
    const manifestPath=join(root,'fixture.json');
    await writeFile(manifestPath,JSON.stringify({synthetic:true,authority:'asymmetri.co',origin:'https://asymmetri.co',
      tlsPort:(tls.address() as {port:number}).port,certificatePath,privateKeyPath,scope,limits:config.limits,
      roster:config.roster,privacyNoticeVersion:config.privacyNoticeVersion,
      expiresAt:scope.expiresAt,contextPolicy:'No public records; question context must be null and evidence empty.'},null,2),{mode:0o600});
    ensureRunning();
    console.log(JSON.stringify({synthetic:true,manifestPath,expiresAt:scope.expiresAt,ready:'TLS only; HQ must drain privacy controls before creating a visitor session.'}));
    await stopped;
  } finally {
    clearTimeout(timeout);
    try {
      try {
        for(const socket of sockets)socket.destroy();
        if(tls)await new Promise<void>(resolve=>tls!.close(()=>resolve()));
      } finally {
        try {if(service)await service.close();}
        finally {if(root)await rm(root,{recursive:true,force:true});}
      }
    } finally {
      process.off('SIGINT',stop);process.off('SIGTERM',stop);
    }
  }
}
main().catch(()=>{console.error('Synthetic Ask fixture stopped or failed. Verify temporary-directory cleanup.');process.exitCode=1;});
