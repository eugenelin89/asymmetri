import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateKeyPairSync, randomBytes, randomUUID, sign } from 'node:crypto';
import assert from 'node:assert/strict';
import type { TestContext } from 'node:test';
import type { AskConfig } from '../src/ask/config.js';
import { askConfig } from '../src/ask/config.js';
import { createAsk } from '../src/ask/http.js';
import { time } from '../src/ask/database.js';
import type { AskServiceScope, AskSession, AskConversation, AskAdmission, AskClaim, AskAnswer, AskControlSync, ContextRef } from '../vendor/investment/v1/types.js';
import { signatureBase, signatureInput, contentDigest, type SignedMessage } from '../src/signatures.js';
import { examples, clone, encode, wireHttp } from './helpers.js';

export const askPrefix = '/api/ask/v1';
export async function askHarness(t: TestContext, changes: Partial<AskConfig> = {}) {
  const root = await mkdtemp(join(tmpdir(), 'asymmetri-private-ask-'));
  const dataDir = join(root, 'private'), publicArchiveDir = join(root, 'public');
  await mkdir(dataDir, {mode:0o700}); await mkdir(publicArchiveDir, {mode:0o700});
  let clock = Date.parse('2026-01-05T22:00:00Z') / 1000, visible = true;
  let contextHook: undefined | ((refs: ContextRef[]) => Promise<boolean>);
  const cfg = askConfig({ enabled: true, admissionEnabled: true, claimsEnabled: true, deliveryEnabled: true,
    dataDir, publicArchiveDir, authority: 'ask.test', origin: 'https://ask.test', port: 0,
    serviceId: 'fixture-ask', privacyNoticeVersion: 'fixture-privacy-1',
    limits: { ...clone(examples.AskLimits as object), configurationStatus: 'owner_approved', approvalRecordId: 'synthetic-test-only' },
    roster: clone(examples.AskRoster), ...changes });
  const now = () => clock, contextVisible = async (refs: ContextRef[]) => contextHook ? contextHook(refs) : visible;
  let service = await createAsk(cfg, {now, contextVisible});
  const scope = clone(examples.AskServiceScope) as AskServiceScope;
  scope.expiresAt = time(clock + 86400);
  const keys = generateKeyPairSync('ed25519');
  const key = {publicKey:keys.publicKey.export({type:'spki',format:'pem'}).toString(), notBefore:clock - 60, notAfter:clock + 86400};
  service.authority.authorize(scope, key);
  t.after(async () => { await service.close(); await rm(root, {recursive:true,force:true}); });
  const h = { root, cfg, scope, keys, key, now, get service() { return service; },
    setClock(value: number) { clock = value; }, setVisible(value: boolean) { visible = value; },
    contextHook(value: typeof contextHook) { contextHook = value; },
    async restart() { await service.close(); service = await createAsk(cfg, {now, contextVisible}); },
    request(method: string, path: string, headers: [string,string][] = [], body: Buffer = Buffer.alloc(0)) {
      return wireHttp((service.server.address() as {port:number}).port, method, path, [['Host', cfg.authority], ...headers], body);
    },
    async session(id = randomUUID()) {
      const response = await h.request('POST', askPrefix + '/sessions', [['Origin', cfg.origin], ['Content-Type', 'application/json'],
        ['Content-Length', String(encode(examples.AskSessionCreate).length)], ['Idempotency-Key', id]], encode(examples.AskSessionCreate));
      assert.equal(response.status, 201, response.raw);
      const body = response.body as unknown as AskSession;
      const cookie = (response.headers['set-cookie'] as string[])[0]!.split(';')[0]!;
      return {body, cookie, headers:[['Origin',cfg.origin], ['Cookie',cookie], ['X-CSRF-Token',body.csrfToken]] as [string,string][]};
    },
    async browser(session: {headers:[string,string][]}, method: string, path: string, value?: unknown, id = randomUUID()) {
      const bytes = value === undefined ? Buffer.alloc(0) : encode(value);
      return h.request(method, path, [...session.headers,
        ...(method === 'GET' ? [] : [['Idempotency-Key', id]] as [string,string][]),
        ...(value === undefined ? [] : [['Content-Type','application/json'], ['Content-Length',String(bytes.length)]] as [string,string][])], bytes);
    },
    async conversation(session: {headers:[string,string][]}) {
      const response = await h.browser(session, 'POST', askPrefix + '/conversations', {schemaVersion:'1.0'});
      assert.equal(response.status, 201, response.raw); return response.body as unknown as AskConversation;
    },
    async question(session: {headers:[string,string][]}, conversation: AskConversation, extra: Record<string,unknown> = {}, id = randomUUID()) {
      const input = {schemaVersion:'1.0',text:'SYNTHETIC: explain a general concept.',context:null,priorQuestionId:null,language:'en',...extra};
      return h.browser(session, 'POST', `${askPrefix}/conversations/${conversation.conversationId}/questions`, input, id);
    },
    signed(method: 'GET'|'POST', path: string, value?: unknown, id = randomUUID()): SignedMessage {
      const body = value === undefined ? Buffer.alloc(0) : encode(value);
      const message: SignedMessage = {method,path,authority:cfg.authority,body,headers:[['botsquad-generation',scope.consumerGeneration]]};
      if (method === 'POST') message.headers.push(['content-type','application/json'],['content-digest',contentDigest(body)],['idempotency-key',id]);
      const input = signatureInput(method, {created:Math.floor(clock),expires:Math.floor(clock)+120,keyId:scope.keyId,nonce:randomBytes(24).toString('base64url')});
      message.headers.push(['signature-input',input], ['signature',`sig1=:${sign(null,Buffer.from(signatureBase(message,input)),keys.privateKey).toString('base64')}:`]);
      return message;
    },
    send(message: SignedMessage) { return h.request(message.method,message.path,[...message.headers,
      ...(message.method === 'GET' ? [] : [['Content-Length',String(message.body.length)]] as [string,string][])],Buffer.from(message.body)); },
    async sync(acknowledgedControlIds: string[] = [], after: string | null = null, id = randomUUID()) {
      return h.send(h.signed('POST',askPrefix+'/hq/control-sync',{schemaVersion:'1.0',serviceId:scope.serviceId,
        consumerGeneration:scope.consumerGeneration,syncId:id,acknowledgedControlIds,after},id));
    },
    async barrier() {
      const response = await h.sync(); assert.equal(response.status,200,response.raw);
      const body = response.body as unknown as AskControlSync;
      assert.equal(body.controls.length,0);assert.equal(body.nextCursor,null);return body.syncId;
    },
    async claim(id = randomUUID()) {
      return h.send(h.signed('POST',askPrefix+'/hq/claims',{schemaVersion:'1.0',serviceId:scope.serviceId,
        consumerGeneration:scope.consumerGeneration,claimRequestId:id,capacity:1},id));
    },
    async ready(extra: Record<string,unknown> = {}) {
      const session = await h.session(), conversation = await h.conversation(session);
      const question = await h.question(session,conversation,extra);assert.equal(question.status,202,question.raw);
      const admission = question.body as unknown as AskAdmission;
      const claimed = await h.claim();assert.equal(claimed.status,200,claimed.raw);
      const claim = claimed.body.claim as AskClaim;assert.ok(claim);
      const barrier = await h.barrier();
      const status = {schemaVersion:'1.0',questionId:admission.questionId,questionHash:admission.questionHash,
        state:'answering',route:clone(examples.AskRoute),updatedAt:time(clock),safeReason:null};
      const statusResponse = await h.send(h.signed('POST',`${askPrefix}/hq/questions/${admission.questionId}/status`,
        {schemaVersion:'1.0',claimId:claim.claimId,consumerGeneration:scope.consumerGeneration,lastControlSyncId:barrier,status}));
      assert.equal(statusResponse.status,200,statusResponse.raw);
      const answer: AskAnswer = {...clone(examples.AskAnswer) as AskAnswer,answerId:randomUUID(),questionId:admission.questionId,
        conversationId:conversation.conversationId,questionHash:admission.questionHash,generatedAt:time(clock),knowledgeAsOf:null,evidence:[],publicSources:[]};
      const delivery = {schemaVersion:'1.0',claimId:claim.claimId,consumerGeneration:scope.consumerGeneration,lastControlSyncId:barrier,answer};
      return {session,conversation,admission,claim,barrier,answer,delivery};
    },
  };
  await h.barrier();
  return h;
}
