import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { askHarness, askPrefix as p } from './ask-helpers.js';
import { examples } from './helpers.js';
import type { AskConversation } from '../vendor/investment/v1/types.js';

for (const closed of ['claimsEnabled', 'deliveryEnabled', 'privacyNoticeVersion'] as const) {
  test(`new admissions respect ${closed}; original receipts and owned controls survive`, async t => {
    const h = await askHarness(t), sessionId = randomUUID(), conversationId = randomUUID(), questionId = randomUUID();
    const session = await h.session(sessionId);
    const created = await h.browser(session, 'POST', p+'/conversations', {schemaVersion:'1.0'}, conversationId);
    assert.equal(created.status, 201);
    const conversation = created.body as unknown as AskConversation;
    const admitted = await h.question(session, conversation, {}, questionId);
    assert.equal(admitted.status, 202);
    const before = ['sessions', 'conversations', 'questions'].map(table =>
      h.service.store.get<{n:number}>('SELECT count(*) n FROM '+table)!.n);
    if (closed === 'privacyNoticeVersion') h.cfg.privacyNoticeVersion = 'fixture-privacy-2';
    else h.cfg[closed] = false;
    await h.restart();
    assert.equal(h.service.authority.ready(), true, 'fresh authority must not bypass the new gate');

    const expected = closed === 'privacyNoticeVersion' ? 409 : 503;
    const newSession = await h.browser(session, 'POST', p+'/sessions', examples.AskSessionCreate);
    assert.equal(newSession.status, expected, newSession.raw);
    assert.equal(newSession.headers['set-cookie'], undefined);
    assert.equal((await h.browser(session, 'POST', p+'/conversations', {schemaVersion:'1.0'})).status, expected);
    assert.equal((await h.question(session, conversation)).status, expected);
    assert.deepEqual(['sessions', 'conversations', 'questions'].map(table =>
      h.service.store.get<{n:number}>('SELECT count(*) n FROM '+table)!.n), before);
    if (closed !== 'privacyNoticeVersion') {
      assert.equal((await h.request('GET', p+'/availability')).body.state, 'paused');
      assert.equal((await h.send(h.signed('GET', p+'/service/configuration'))).body.admissionEnabled, false);
    }

    const sessionReplay = await h.browser(session, 'POST', p+'/sessions', examples.AskSessionCreate, sessionId);
    assert.equal(sessionReplay.status, 201); assert.deepEqual(sessionReplay.body, session.body);
    assert.equal(sessionReplay.headers['set-cookie'], undefined);
    const conversationReplay = await h.browser(session, 'POST', p+'/conversations', {schemaVersion:'1.0'}, conversationId);
    assert.equal(conversationReplay.status, 201); assert.deepEqual(conversationReplay.body, created.body);
    const questionReplay = await h.question(session, conversation, {}, questionId);
    assert.equal(questionReplay.status, 202); assert.deepEqual(questionReplay.body, admitted.body);
    assert.equal((await h.question(session, conversation, {text:'Different request bytes'}, questionId)).status, 409);
    const path = p+'/conversations/'+conversation.conversationId;
    assert.equal((await h.browser(session, 'GET', path)).status, 200);
    const cancel = await h.browser(session, 'POST', p+'/questions/'+admitted.body.questionId+'/cancel', examples.AskCancel);
    assert.equal(cancel.status, 200, cancel.raw);
    if (closed === 'privacyNoticeVersion') {
      const controls = await h.sync(); assert.equal(controls.status, 200);
      const acknowledged = await h.sync([cancel.body.controlId as string]);
      assert.equal(acknowledged.status, 200); assert.equal(h.service.authority.ready(), true);
      const count = h.service.store.get<{n:number}>('SELECT count(*) n FROM questions')!.n;
      // No outstanding question or stale barrier can mask the obsolete-consent check.
      assert.equal((await h.question(session, conversation)).status, 409);
      assert.equal(h.service.store.get<{n:number}>('SELECT count(*) n FROM questions')!.n, count);
      const renewed = await h.browser(session, 'POST', p+'/sessions',
        {schemaVersion:'1.0',privacyNoticeVersion:h.cfg.privacyNoticeVersion});
      assert.equal(renewed.status, 201, renewed.raw);
      const cookie = (renewed.headers['set-cookie'] as string[])[0]!.split(';')[0]!;
      const newVisitor = {headers:[['Origin',h.cfg.origin],['Cookie',cookie],['X-CSRF-Token',renewed.body.csrfToken as string]] as [string,string][]};
      const newConversation = await h.conversation(newVisitor);
      assert.equal((await h.question(newVisitor, newConversation)).status, 202);
    }
    const deleted = await h.browser(session, 'DELETE', path);
    assert.equal(deleted.status, 200, deleted.raw);

    // Reopening alone cannot repair obsolete consent. A fresh consent session is required.
    if (closed === 'privacyNoticeVersion') {
      assert.equal((await h.browser(session, 'POST', p+'/conversations', {schemaVersion:'1.0'})).status, 409);
    }
  });
}
