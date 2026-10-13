import { randomUUID } from 'node:crypto';
import type { AskAnswer, AskAnswerDelivery, AskAnswerReceipt, AskClaim, AskClaimInput,
  AskClaimPage, AskQuestion, AskRenewInput, AskStatus, AskStatusDelivery } from '../../vendor/investment/v1/types.js';
import { canonicalHash, checkPublicStrings, parseJson, requireContract as need, validate } from '../schema.js';
import { AskStore, time, type QuestionRow } from './database.js';
import { AskAuthority, type AskAuth } from './auth.js';
import { AskTransport } from './transport.js';
import { AskSync } from './sync.js';
import { questionContexts } from './evidence.js';
import type { ContextVerifier } from './context.js';

interface ClaimRow { id: string; question_id: string; generation: string; lease_expires: number }
interface AnswerRow { id: string; question_id: string; digest: string; receipt_json: string; answer_json: string | null }
export class AskHq {
  readonly transport: AskTransport;
  readonly controls: AskSync;
  constructor(readonly store: AskStore, readonly now: () => number,
    readonly authority: AskAuthority, readonly contextVisible: ContextVerifier) {
    this.transport = new AskTransport(store, now, authority);
    this.controls = new AskSync(store, now, authority, this.transport);
  }

  question(id: string): QuestionRow {
    const row = this.store.get<QuestionRow>('SELECT * FROM questions WHERE id=?', id);
    need(row, 'NOT_FOUND'); return row;
  }
  claimRow(auth: AskAuth, id: string, questionId: string, fresh: boolean): ClaimRow {
    const row = this.store.get<ClaimRow>('SELECT * FROM claims WHERE id=?', id);
    need(row && row.question_id === questionId && row.generation === auth.scope.consumerGeneration, 'FORBIDDEN');
    if (fresh) need(row.lease_expires > this.now(), 'EXPIRED');
    return row;
  }
  claimDto(row: ClaimRow, question: QuestionRow): AskClaim {
    need(question.question_json && !question.suppression && question.expires > this.now() && question.raw_until > this.now(), 'EXPIRED');
    return validate('AskClaim', { schemaVersion: '1.0', claimId: row.id, serviceId: this.store.config.serviceId,
      consumerGeneration: row.generation, leaseExpiresAt: time(row.lease_expires),
      question: validate<AskQuestion>('AskQuestion', JSON.parse(question.question_json)) });
  }

  claim(auth: AskAuth): AskClaimPage {
    const input = validate<AskClaimInput>('AskClaimInput', parseJson(auth.message.body, 262144));
    need(input.serviceId === auth.scope.serviceId && input.consumerGeneration === auth.scope.consumerGeneration && input.claimRequestId === this.transport.id(auth), 'CONFLICT');
    return this.store.atomic(() => {
      need(this.store.config.claimsEnabled, 'UNAVAILABLE');
      const old = this.transport.prior<AskClaimPage>(auth);
      if (old) {
        if (old.claim) {
          need(Date.parse(old.claim.leaseExpiresAt) > this.now() * 1000, 'EXPIRED');
          this.claimDto(this.claimRow(auth, old.claim.claimId, old.claim.question.questionId, true), this.question(old.claim.question.questionId));
        }
        return old;
      }
      const now = this.now();
      const busy = this.store.get("SELECT 1 FROM claims c JOIN questions q ON q.id=c.question_id WHERE c.lease_expires>? AND q.suppression IS NULL AND q.state NOT IN('answered','declined','expired','cancelled','failed') LIMIT 1", now);
      const question = busy ? undefined : this.store.get<QuestionRow>("SELECT * FROM questions WHERE question_json IS NOT NULL AND suppression IS NULL AND expires>? AND state NOT IN('answered','declined','expired','cancelled','failed') ORDER BY ordinal LIMIT 1", now);
      let claim: AskClaim | null = null;
      if (question) {
        this.store.space();
        const row: ClaimRow = { id: randomUUID(), question_id: question.id,
          generation: auth.scope.consumerGeneration, lease_expires: Math.min(question.expires, question.raw_until,
            Date.parse(auth.scope.expiresAt) / 1000, auth.key.not_after, now + 90) };
        this.store.run('INSERT INTO claims VALUES(?,?,?,?)', row.id, row.question_id, row.generation, row.lease_expires);
        claim = this.claimDto(row, question);
      }
      const result = validate<AskClaimPage>('AskClaimPage', { schemaVersion: '1.0', claimRequestId: input.claimRequestId, claim, retryAfterSeconds: 60 });
      this.transport.save(auth, question?.id ?? null, result); return result;
    });
  }

  renew(auth: AskAuth, claimId: string): AskClaim {
    const input = validate<AskRenewInput>('AskRenewInput', parseJson(auth.message.body, 262144));
    need(input.serviceId === auth.scope.serviceId && input.consumerGeneration === auth.scope.consumerGeneration, 'FORBIDDEN');
    return this.store.atomic(() => {
      need(this.store.config.claimsEnabled, 'UNAVAILABLE');
      const question = this.question(input.questionId);
      need(question.question_hash === input.questionHash, 'CONFLICT');
      const row = this.claimRow(auth, claimId, question.id, true);
      this.claimDto(row, question);
      const old = this.transport.prior<AskClaim>(auth);
      if (old) { need(Date.parse(old.leaseExpiresAt) > this.now() * 1000, 'EXPIRED'); return old; }
      row.lease_expires = Math.min(question.expires, question.raw_until, Date.parse(auth.scope.expiresAt) / 1000, auth.key.not_after, this.now() + 90);
      this.store.run('UPDATE claims SET lease_expires=? WHERE id=?', row.lease_expires, claimId);
      const result = this.claimDto(row, question); this.transport.save(auth, question.id, result); return result;
    });
  }

  async evidence(question: QuestionRow, answer?: AskAnswer): Promise<boolean> {
    const refs = questionContexts(this.store, question, this.now(), answer);
    return refs !== null && this.contextVisible(refs);
  }

  suppressed(question: QuestionRow): AskAnswerReceipt['disposition'] | null {
    const conversation = this.store.get<{state:string;expires:number}>('SELECT state,expires FROM conversations WHERE id=?', question.conversation_id);
    if (question.suppression === 'delete' || conversation?.state === 'deleted') return 'discarded_deleted';
    if (question.suppression === 'expire' || !conversation || conversation.expires <= this.now() || question.expires <= this.now() || question.raw_until <= this.now()) return 'discarded_expired';
    if (question.suppression) return 'discarded_cancelled';
    return null;
  }

  async status(auth: AskAuth, questionId: string): Promise<AskStatus> {
    const input = validate<AskStatusDelivery>('AskStatusDelivery', parseJson(auth.message.body, 262144));
    checkPublicStrings(input.status);
    need(input.consumerGeneration === auth.scope.consumerGeneration && input.status.questionId === questionId, 'CONFLICT');
    const visible = await this.evidence(this.question(questionId));
    return this.store.atomic(() => {
      this.authority.recheck(auth);
      const question = this.question(questionId);
      need(input.status.questionHash === question.question_hash, 'CONFLICT');
      this.claimRow(auth, input.claimId, questionId, false);
      const suppression = this.suppressed(question);
      if (suppression) {
        const safe = validate<AskStatus>('AskStatus', { schemaVersion: '1.0', questionId,
          questionHash: question.question_hash, state: suppression === 'discarded_expired' ? 'expired' : 'cancelled',
          route: null, updatedAt: time(this.now()), safeReason: 'This question is no longer available.' });
        const old = this.transport.prior<AskStatus>(auth); if (old) return safe;
        this.transport.save(auth, questionId, safe); return safe;
      }
      this.claimRow(auth, input.claimId, questionId, true);
      this.controls.barrier(auth, input.lastControlSyncId);
      const old = this.transport.prior<AskStatus>(auth); if (old) return old;
      need(visible && questionContexts(this.store, question, this.now()) !== null, 'WITHDRAWN');
      const status = input.status, prior = validate<AskStatus>('AskStatus', JSON.parse(question.status_json!));
      const transitions: Record<string, string[]> = {
        queued: ['routed', 'answering', 'declined', 'failed', 'outcome_unknown'],
        routed: ['routed', 'answering', 'declined', 'failed', 'outcome_unknown'],
        answering: ['answering', 'declined', 'failed', 'outcome_unknown'],
        outcome_unknown: ['outcome_unknown', 'declined', 'failed'],
      };
      need(transitions[prior.state]?.includes(status.state), 'CONFLICT');
      need(Date.parse(status.updatedAt) >= Date.parse(prior.updatedAt) && Date.parse(status.updatedAt) <= this.now() * 1000, 'CONFLICT');
      if (['routed', 'answering'].includes(status.state)) need(status.route, 'INVALID_REQUEST');
      if (status.route) need(this.store.config.roster.workers.some(row => row.worker.workerId === status.route!.workerId), 'FORBIDDEN');
      if (prior.route && ['answering', 'outcome_unknown'].includes(prior.state)) need(status.route?.workerId === prior.route.workerId && status.route?.routingPolicyVersion === prior.route.routingPolicyVersion, 'CONFLICT');
      if (prior.route && status.route && prior.route.workerId !== status.route.workerId) need(status.route.previousWorkerId === prior.route.workerId, 'CONFLICT');
      this.store.run('UPDATE questions SET state=?,status_json=? WHERE id=?', status.state, JSON.stringify(status), questionId);
      this.transport.save(auth, questionId, status); this.store.touch(); return status;
    });
  }

  async answer(auth: AskAuth, questionId: string): Promise<AskAnswerReceipt> {
    const input = validate<AskAnswerDelivery>('AskAnswerDelivery', parseJson(auth.message.body, 262144));
    const answer = input.answer;
    checkPublicStrings(answer);
    need(input.consumerGeneration === auth.scope.consumerGeneration && answer.serviceId === auth.scope.serviceId && answer.questionId === questionId, 'CONFLICT');
    need([...answer.text].length <= this.store.config.limits.answerCharacters, 'TOO_LARGE');
    need(Date.parse(answer.generatedAt) <= this.now() * 1000 &&
      (answer.knowledgeAsOf === null || Date.parse(answer.knowledgeAsOf) <= Date.parse(answer.generatedAt)), 'INVALID_REQUEST');
    const visible = await this.evidence(this.question(questionId), answer);
    return this.store.atomic(() => {
      this.authority.recheck(auth);
      const question = this.question(questionId), digest = canonicalHash(answer);
      need(answer.questionHash === question.question_hash && answer.conversationId === question.conversation_id, 'CONFLICT');
      this.claimRow(auth, input.claimId, questionId, false);
      const existing = this.store.get<AnswerRow>('SELECT * FROM answers WHERE id=? OR question_id=?', answer.answerId, questionId);
      if (existing) {
        need(existing.id === answer.answerId && existing.question_id === questionId && existing.digest === digest, 'CONFLICT');
        const old = this.transport.prior<AskAnswerReceipt>(auth); if (old) return old;
        const receipt = validate<AskAnswerReceipt>('AskAnswerReceipt', JSON.parse(existing.receipt_json));
        this.transport.save(auth, questionId, receipt); return receipt;
      }
      let disposition = this.suppressed(question);
      if (!disposition) {
        need(this.store.config.deliveryEnabled, 'UNAVAILABLE');
        this.claimRow(auth, input.claimId, questionId, true);
        this.controls.barrier(auth, input.lastControlSyncId);
        need(Date.parse(answer.generatedAt) >= Date.parse(question.received_at), 'CONFLICT');
        const status = validate<AskStatus>('AskStatus', JSON.parse(question.status_json!));
        need(['answering', 'outcome_unknown'].includes(status.state) && status.route?.workerId === answer.workerId && status.route.routingPolicyVersion === answer.routingPolicyVersion, 'FORBIDDEN');
        need(this.store.config.roster.workers.some(row => row.worker.workerId === answer.workerId), 'FORBIDDEN');
        disposition = visible && questionContexts(this.store,question,this.now(),answer) !== null ? 'accepted' : 'withheld_evidence';
      }
      this.store.space(32768 + (disposition === 'accepted' ? Buffer.byteLength(JSON.stringify(answer)) : 0), disposition !== 'accepted');
      const receipt = validate<AskAnswerReceipt>('AskAnswerReceipt', { schemaVersion: '1.0', answerId: answer.answerId,
        questionId, questionHash: question.question_hash, answerDigest: digest, receiptId: randomUUID(),
        receivedAt: time(this.now()), disposition });
      this.store.run('INSERT INTO answers VALUES(?,?,?,?,?,?,?,?)', answer.answerId, questionId, question.question_hash,
        answer.generatedAt, digest, disposition === 'accepted' ? JSON.stringify(answer) : null, JSON.stringify(receipt), question.suppression_until);
      if (disposition === 'accepted' || disposition === 'withheld_evidence') {
        const prior = validate<AskStatus>('AskStatus', JSON.parse(question.status_json!));
        const status: AskStatus = { ...prior, state: disposition === 'accepted' ? 'answered' : 'declined',
          updatedAt: time(this.now()), safeReason: disposition === 'accepted' ? null : 'Referenced public evidence is unavailable.' };
        this.store.run('UPDATE questions SET state=?,status_json=?,answer_id=? WHERE id=?', status.state, JSON.stringify(status), answer.answerId, questionId);
      }
      this.transport.save(auth, questionId, receipt); this.store.touch(); return receipt;
    });
  }

  receipt(auth: AskAuth, answerId: string): AskAnswerReceipt {
    this.authority.recheck(auth);
    const row = this.store.get<AnswerRow>('SELECT * FROM answers WHERE id=?', answerId); need(row, 'NOT_FOUND');
    return validate('AskAnswerReceipt', JSON.parse(row.receipt_json));
  }
}
