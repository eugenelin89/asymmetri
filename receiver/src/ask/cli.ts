import { open, unlink } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadAskConfig } from './config.js';
import { AskStore } from './database.js';
import { AskAuthority } from './auth.js';
import { AskLifecycle } from './lifecycle.js';
import { createAsk } from './http.js';
import { backupAsk, restoreAsk, controlSnapshot, fenceAsk, reconcileAsk } from './recovery.js';
import { canonicalHash, parseJson, requireContract as need, validate } from '../schema.js';
import type { AskServiceScope } from '../../vendor/investment/v1/types.js';
process.umask(0o077);

async function main(): Promise<void> {
  const [command,...args] = process.argv.slice(2), path = process.env.ASYMMETRI_ASK_CONFIG;
  need(path && command && ['serve','migrate','diagnostics','authorize','revoke-key','cleanup','backup','restore','restore-fence','export-controls','reconcile-controls'].includes(command), 'UNAVAILABLE');
  const config = loadAskConfig(path), lock = join(config.dataDir,'ask.lock');
  // All owner operations are offline to keep purge/checkpoint and recovery custody unambiguous.
  const handle = await open(lock,'wx',0o600); await handle.writeFile(String(process.pid));
  try {
    if (command === 'serve') {
      need(args.length === 0);
      const service = await createAsk(config,{log:entry => console.error(JSON.stringify(entry))});
      console.log(JSON.stringify({state:'listening',host:config.host,port:(service.server.address() as {port:number}).port}));
      await new Promise<void>(resolve => { let stopping = false; const stop = () => { if (!stopping) { stopping = true; void service.close().then(resolve); } }; process.once('SIGTERM',stop); process.once('SIGINT',stop); }); return;
    }
    const store = new AskStore(config), now = Date.now()/1000;
    try {
      switch (command) {
        case 'migrate': need(args.length===0); console.log('Separate Ask schema initialized.'); break;
        case 'diagnostics': need(args.length===0); console.log(JSON.stringify({integrity:store.db.pragma('quick_check'),foreignKeys:store.db.pragma('foreign_key_check'),held:store.meta().held,generation:store.meta().generation,authorityAvailable:new AskAuthority(store,()=>now).available(),counts:Object.fromEntries(['sessions','questions','answers','controls','transport_receipts'].map(table=>[table,store.get<{n:number}>(`SELECT count(*) n FROM ${table}`)!.n]))})); break;
        case 'authorize': {
          need(args.length===1); const input = parseJson(readFileSync(args[0]!),16384) as {scope:AskServiceScope;publicKey:string;notBefore:number;notAfter:number};
          need(Object.keys(input).sort().join(',')==='notAfter,notBefore,publicKey,scope'); new AskAuthority(store,()=>now).authorize(input.scope,input);
          console.log('Ask verification scope recorded; activation flags are unchanged.'); break;
        }
        case 'revoke-key': need(args.length===1); validate('Id',args[0]); store.atomic(()=>{store.run('UPDATE service_keys SET revoked=1 WHERE key_id=?',args[0]!);store.run('INSERT INTO owner_audit(action,target_hash,recorded_at) VALUES(?,?,?)','Ask key revoked',canonicalHash(args[0]),new Date(now*1000).toISOString());store.touch();});console.log('Ask verification key revoked.');break;
        case 'cleanup': need(args.length===0);new AskLifecycle(store).cleanup(now);store.checkpoint();console.log('Ask retention cleanup and WAL truncation complete.');break;
        case 'backup':need(args.length===1);console.log(JSON.stringify({digest:await backupAsk(store,args[0]!,now),content:'non-content recovery journal only'}));break;
        case 'restore':need(args.length===3 || args.length===4);await restoreAsk(args[0]!,args[1]!,args[2]!,now,args[3]);console.log('Isolated Ask restore verified and held; disabled config.json saved in destination. Reconcile current privacy controls before new authority.');break;
        case 'restore-fence':need(args.length===0);fenceAsk(store,now);console.log('Ask sessions and authority retired; raw content purged; recovery held.');break;
        case 'export-controls':need(args.length===0);console.log(JSON.stringify(controlSnapshot(store,now)));break;
        case 'reconcile-controls':need(args.length===2);reconcileAsk(store,parseJson(readFileSync(args[0]!),16777216),args[1]!,now);console.log('Owner-supplied current privacy journal reconciled. New authority and explicit activation are still required.');break;
      }
    } finally { store.close(); }
  } finally { await handle.close(); await unlink(lock); }
}
main().catch(()=>{console.error('Ask command failed. Check private configuration, exclusive lock, storage and recovery state.');process.exitCode=1;});
