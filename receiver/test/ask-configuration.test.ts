import test from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { generateKeyPairSync } from 'node:crypto';
import { askHarness, askPrefix } from './ask-helpers.js';
import { wireHttp } from './helpers.js';
import { canonicalHash, ContractError, validate } from '../src/schema.js';
import { time } from '../src/ask/database.js';
import { backupAsk, restoreAsk, controlSnapshot, reconcileAsk } from '../src/ask/recovery.js';
import { createAsk } from '../src/ask/http.js';
import type { AskLimits, AskServiceConfiguration } from '../vendor/investment/v1/types.js';

const path = askPrefix + '/service/configuration';
type Harness = Awaited<ReturnType<typeof askHarness>>;
async function read(h: Harness): Promise<AskServiceConfiguration> {
  const response = await h.send(h.signed('GET', path));
  assert.equal(response.status, 200, response.raw);
  assert.equal(response.headers['cache-control'], 'private, no-store');
  assert.equal(response.headers['set-cookie'], undefined);
  const body = validate<AskServiceConfiguration>('AskServiceConfiguration', response.body);
  const {configurationHash, checkedAt, validUntil, ...hashed} = body;
  assert.equal(configurationHash, canonicalHash(hashed));
  assert.ok(Date.parse(validUntil) > Date.parse(checkedAt));
  assert.ok(Date.parse(validUntil) - Date.parse(checkedAt) <= 60000);
  assert.ok(Date.parse(validUntil) <= Date.parse(body.scope.expiresAt));
  return body;
}
const observations = (h: Harness) => h.service.store.get<{n:number}>(
  "SELECT count(*) n FROM owner_audit WHERE action LIKE 'Ask configuration observed:%'")!.n;

test('signed configuration reconciles closed intake with exact public fields and no barrier or work', async t => {
  const h = await askHarness(t, {admissionEnabled:false, claimsEnabled:false, deliveryEnabled:false});
  h.service.store.run('DELETE FROM barriers');
  const before = h.service.store.get<{n:number}>('SELECT count(*) n FROM transport_receipts')!.n;
  const body = await read(h);
  assert.deepEqual(body.scope, h.scope); assert.deepEqual(body.limits, h.cfg.limits);
  assert.deepEqual(body.roster, h.cfg.roster);
  assert.equal(body.admissionEnabled, false); assert.equal(body.claimsEnabled, false);
  assert.equal(body.deliveryEnabled, false); assert.equal(body.held, false);
  assert.deepEqual(Object.keys(body).sort(), ['schemaVersion','serviceId','consumerGeneration','configurationRevision',
    'configurationHash','scope','limits','roster','privacyNoticeVersion','checkedAt','validUntil',
    'admissionEnabled','claimsEnabled','deliveryEnabled','held'].sort());
  const serialized = JSON.stringify(body);
  for (const privateValue of [h.cfg.dataDir, h.cfg.publicArchiveDir, h.key.publicKey,
    h.service.store.meta().network_key]) assert.equal(serialized.includes(privateValue), false);
  for (const table of ['barriers','claims','questions','answers','sessions'])
    assert.equal(h.service.store.get<{n:number}>('SELECT count(*) n FROM '+table)!.n, 0, table);
  assert.equal(h.service.store.get<{n:number}>('SELECT count(*) n FROM transport_receipts')!.n, before);
  assert.equal(h.service.authority.ready(), false); assert.equal(observations(h), 1);
});

test('configuration observations persist across restart and advance for stable changes including A to B to A', async t => {
  const h = await askHarness(t), first = await read(h);
  h.setClock(h.now()+1); const fresh = await read(h);
  assert.equal(fresh.configurationHash, first.configurationHash);
  assert.equal(fresh.configurationRevision, first.configurationRevision);
  assert.notEqual(fresh.checkedAt, first.checkedAt); assert.equal(observations(h), 1);
  await h.restart(); assert.equal((await read(h)).configurationHash, first.configurationHash);
  let prior = first;
  for (const change of [
    () => {h.cfg.privacyNoticeVersion = 'fixture-privacy-2';},
    () => {h.cfg.privacyNoticeVersion = 'fixture-privacy-1';},
    () => {h.cfg.limits.dailyExecutions -= 1;},
    () => {h.cfg.roster.workers[0]!.worker.name = 'Fixture renamed';},
    () => {h.cfg.claimsEnabled = false;},
    () => {h.cfg.deliveryEnabled = false;},
    () => {h.scope.permissions = ['control_sync']; h.service.authority.authorize(h.scope, h.key);},
  ]) {
    change(); const next = await read(h);
    assert.ok(BigInt(next.configurationRevision) > BigInt(prior.configurationRevision));
    assert.notEqual(next.configurationHash, prior.configurationHash); prior = next;
  }
  assert.equal(prior.admissionEnabled, false, 'paused claims normalize admission readiness');
  assert.equal(observations(h), 8);
});

test('configuration revisions remain independent when caller keys alternate', async t => {
  const h = await askHarness(t), keyA = h.scope.keyId, firstA = await read(h);
  h.scope.keyId = 'fixture-second-key'; h.service.authority.authorize(h.scope, h.key);
  const firstB = await read(h); assert.ok(BigInt(firstB.configurationRevision) > BigInt(firstA.configurationRevision));
  h.scope.keyId = keyA; assert.equal((await read(h)).configurationHash, firstA.configurationHash);
  h.scope.keyId = 'fixture-second-key'; assert.equal((await read(h)).configurationHash, firstB.configurationHash);
  assert.equal(observations(h), 2);
});

test('configuration rejects unauthenticated, wrongly scoped, held, stale and expired authority', async t => {
  const h = await askHarness(t);
  assert.equal((await h.request('GET', path)).status, 401);
  h.scope.permissions = ['claim']; h.service.authority.authorize(h.scope,h.key);
  assert.equal((await h.send(h.signed('GET',path))).status, 403);
  h.scope.permissions = ['control_sync']; h.service.authority.authorize(h.scope,h.key);
  h.scope.enabled = false; h.service.authority.authorize(h.scope,h.key);
  assert.equal((await h.send(h.signed('GET',path))).status, 403);
  h.scope.enabled = true; h.service.authority.authorize(h.scope,h.key);
  h.service.store.run('UPDATE ask_meta SET held=1');
  assert.equal((await h.send(h.signed('GET',path))).status, 503);
  h.service.store.run('UPDATE ask_meta SET held=0');
  const old = h.signed('GET',path);
  old.headers = old.headers.map(([name,value]) => [name,name==='botsquad-generation'?'0':value]);
  assert.equal((await h.send(old)).status, 409);
  h.service.store.run('UPDATE service_keys SET revoked=1');
  assert.equal((await h.send(h.signed('GET',path))).status, 403);
  h.service.store.run('UPDATE service_keys SET revoked=0');
  h.setClock(h.key.notAfter);
  assert.equal((await h.send(h.signed('GET',path))).status, 403);
  assert.equal(observations(h), 0);
});

test('configuration GET rejects query, body, digest, idempotency, wrong method and replay', async t => {
  const h = await askHarness(t);
  for (const suffix of ['?', '?unexpected=1']) {
    const message = h.signed('GET',path); message.path += suffix;
    assert.equal((await h.send(message)).status, 401);
  }
  for (const [name,value,status] of [['content-digest','sha-256=:AAAA:',400],
    ['idempotency-key','fixture-unwanted-id',401],['content-type','application/json',400]] as const) {
    const message = h.signed('GET',path); message.headers.push([name,value]);
    assert.equal((await h.send(message)).status, status);
  }
  const body = h.signed('GET',path); body.headers.push(['content-length','2']); body.body=Buffer.from('{}');
  assert.equal((await h.send(body)).status, 400);
  assert.equal((await h.request('POST',path,[['Content-Length','0']])).status, 405);
  const message = h.signed('GET',path); assert.equal((await h.send(message)).status, 200);
  assert.equal((await h.send(message)).status, 409);
  assert.equal(observations(h), 1);
});

test('configuration uses reserved reconciliation capacity and still enforces its ceiling', async t => {
  const h = await askHarness(t), now = h.now();
  h.service.store.atomic(() => {for(let n=0;n<120;n++) h.service.store.charge('http:ordinary',60,120,now);});
  assert.equal((await h.request('GET',askPrefix+'/availability')).status,429);
  await read(h);
  h.service.store.run("UPDATE quotas SET count=120 WHERE bucket='hq:reconcile'");
  assert.equal((await h.send(h.signed('GET',path))).status,429);
  assert.equal(observations(h),1);
});

test('configuration freshness honors millisecond scope, key and generation bounds without stale observations', async t => {
  const h = await askHarness(t);
  h.scope.expiresAt = time(h.now()+20.125); h.service.authority.authorize(h.scope,h.key);
  assert.equal((await read(h)).validUntil,h.scope.expiresAt);
  h.service.store.run('UPDATE ask_meta SET generation_expires=?',h.now()+10.25);
  assert.equal((await read(h)).validUntil,time(h.now()+10.25));
  h.service.store.run('UPDATE service_keys SET not_after=?',h.now()+5);
  assert.equal((await read(h)).validUntil,time(h.now()+5));
  h.service.store.run('UPDATE ask_meta SET generation_expires=?',h.now());
  h.cfg.privacyNoticeVersion = 'changed-after-expiry';
  assert.equal((await h.send(h.signed('GET',path))).status,410); assert.equal(observations(h),1);
});

test('configuration preserves subscription null cost and its exact monitored policy', async t => {
  const h = await askHarness(t);
  h.cfg.limits = {...h.cfg.limits,monetaryEnforcement:'activity_capped_subscription',dailyBudgetUsd:null,
    maxRouterExecutions:0,maxResearchCalls:0,subscriptionActivityPolicy:{version:'1',tokenLimits:'monitored_thresholds',
      actualCost:'unavailable',overshoot:'possible',internalRetries:'possible',onMissingUsage:'hold',onThresholdViolation:'hold'}} satisfies AskLimits;
  const body = await read(h); assert.equal(body.limits.dailyBudgetUsd,null);
  assert.deepEqual(body.limits,h.cfg.limits);
});

test('configuration capacity and audit integer bounds fail atomically without a new observation', async t => {
  const h = await askHarness(t), original = h.service.store.space;
  h.service.store.space = () => {throw new ContractError('BUDGET_EXHAUSTED');};
  assert.equal((await h.send(h.signed('GET',path))).body.code,'BUDGET_EXHAUSTED');
  assert.equal(observations(h),0); h.service.store.space = original;
  h.service.store.run('INSERT INTO owner_audit(id,action,target_hash,recorded_at) VALUES(?,?,?,?)',
    BigInt(Number.MAX_SAFE_INTEGER),'fixture audit boundary','0'.repeat(64),time(h.now()));
  const revision = h.service.store.meta().revision;
  assert.equal((await h.send(h.signed('GET',path))).body.code,'BUDGET_EXHAUSTED');
  assert.equal(observations(h),0); assert.equal(h.service.store.meta().revision,revision);
});

test('configuration observations survive held recovery while retired keys cannot authorize the restored service', async t => {
  const h = await askHarness(t), before = await read(h), backup = join(h.root,'configuration-backup');
  const digest = await backupAsk(h.service.store,backup,h.now()), journal=controlSnapshot(h.service.store,h.now());
  const cfg = await restoreAsk(backup,join(h.root,'configuration-restored'),digest,h.now());
  cfg.enabled=true;cfg.port=0;
  const restored=await createAsk(cfg,{now:h.now,contextVisible:async()=>true});t.after(()=>restored.close());
  const send=() => {const message=h.signed('GET',path);return wireHttp((restored.server.address() as {port:number}).port,
    'GET',path,[['Host',cfg.authority],...message.headers]);};
  assert.equal((await send()).status,401);
  assert.ok(restored.store.get('SELECT 1 FROM owner_audit WHERE CAST(id AS TEXT)=?',before.configurationRevision));
  reconcileAsk(restored.store,journal,canonicalHash(journal),h.now());
  h.scope.consumerGeneration=String(BigInt(restored.store.meta().generation)+1n);h.scope.keyId='fresh-configuration-key';
  const fresh=generateKeyPairSync('ed25519');h.keys.privateKey=fresh.privateKey;h.keys.publicKey=fresh.publicKey;
  h.key.publicKey=fresh.publicKey.export({type:'spki',format:'pem'}).toString();restored.authority.authorize(h.scope,h.key);
  const response=await send();assert.equal(response.status,200,response.raw);
  assert.ok(BigInt(response.body.configurationRevision as string)>BigInt(before.configurationRevision));
  assert.equal(response.body.admissionEnabled,false);assert.equal(restored.authority.ready(),false);
  assert.equal(restored.store.get<{n:number}>('SELECT count(*) n FROM barriers')!.n,0);
});
