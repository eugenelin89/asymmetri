import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import type { AskAdmission, AskConversation, AskConversationPage, AskControlReceipt,
  AskQuestion, AskQuestionInput, AskSession, AskSessionCreate, AskStatus, AskAnswer, ContextRef } from '../../vendor/investment/v1/types.js';
import { AskStore, time, type ConversationRow, type QuestionRow, type SessionRow } from './database.js';
import { AskLifecycle } from './lifecycle.js';
import { questionContexts } from './evidence.js';
import { AskAuthority } from './auth.js';
import { canonicalHash, parseJson, requireContract as need, sha256, validate } from '../schema.js';

import type { ContextVerifier } from './context.js';
export interface Visitor { row: SessionRow; secret: string }
const terminal = ['answered', 'declined', 'expired', 'cancelled', 'failed'];
const csrf = (secret: string) => sha256('ask-csrf:' + secret);
const equal = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
export const cookieName = '__Host-botsquad_ask';

export class AskVisitors {
  constructor(readonly store: AskStore, readonly now: () => number, readonly contextVisible: ContextVerifier) {}

  sameOrigin(headers: Map<string, string>, mutation: boolean): void {
    if (headers.has('origin')) need(headers.get('origin') === this.store.config.origin, 'FORBIDDEN');
    else need(!mutation && headers.get('sec-fetch-site') === 'same-origin', 'FORBIDDEN');
    need(!headers.has('sec-fetch-site') || headers.get('sec-fetch-site') === 'same-origin', 'FORBIDDEN');
  }

  authenticate(headers: Map<string, string>, mutation: boolean): Visitor {
    this.sameOrigin(headers, mutation);
    const cookies = (headers.get('cookie') ?? '').split(';').map(value => value.trim().split('='));
    const matches = cookies.filter(([name]) => name === cookieName);
    need(matches.length === 1 && matches[0]!.length === 2, 'NOT_FOUND');
    const secret = matches[0]![1]!;
    need(/^[A-Za-z0-9_-]{43}$/.test(secret), 'NOT_FOUND');
    const row = this.store.get<SessionRow>('SELECT * FROM sessions WHERE secret_hash=?', sha256(secret));
    need(row && !row.deleted && row.expires > this.now(), 'NOT_FOUND');
    if (mutation) need(equal(headers.get('x-csrf-token') ?? '', csrf(secret)), 'FORBIDDEN');
    return { row, secret };
  }

  current(visitor: Visitor): void {
    const row = this.store.get<SessionRow>('SELECT * FROM sessions WHERE id=?', visitor.row.id);
    need(row && !row.deleted && row.expires > this.now() && row.secret_hash === sha256(visitor.secret), 'NOT_FOUND');
    need(!this.store.meta().held, 'UNAVAILABLE');
  }

  sessionDto(visitor: Visitor): AskSession {
    this.current(visitor);
    return validate('AskSession', { schemaVersion: '1.0', serviceId: this.store.config.serviceId,
      sessionId: visitor.row.id, createdAt: visitor.row.created_at, expiresAt: time(visitor.row.expires),
      privacyNoticeVersion: visitor.row.privacy_version, csrfToken: csrf(visitor.secret) });
  }

  createSession(headers: Map<string, string>, bytes: Buffer, requestId: string, network: string): { body: AskSession; cookie?: string } {
    this.sameOrigin(headers, true);
    const input = validate<AskSessionCreate>('AskSessionCreate', parseJson(bytes, this.store.config.limits.requestBytes));
    validate('Id', requestId);
    need(input.privacyNoticeVersion === this.store.config.privacyNoticeVersion, 'CONFLICT');
    return this.store.atomic(() => {
      need(!this.store.meta().held && this.store.config.admissionEnabled && new AskAuthority(this.store, this.now).ready(), 'UNAVAILABLE');
      const prior = this.store.get<{digest:string;session_id:string}>('SELECT * FROM session_creates WHERE request_id=?', requestId);
      if (prior) {
        // Idempotency is not cookie recovery. A lost initial cookie requires a fresh request.
        const visitor = this.authenticate(headers, false);
        need(visitor.row.id === prior.session_id && prior.digest === sha256(bytes), 'CONFLICT');
        return { body: this.sessionDto(visitor) };
      }
      this.store.space();
      need(this.store.get<{n:number}>('SELECT count(*) n FROM sessions')!.n < 3000, 'BUDGET_EXHAUSTED');
      const now = this.now();
      this.store.charge('sessions:global', 86400, 100, now);
      this.store.charge('sessions:network:' + network, 3600, 10, now);
      const secret = randomBytes(32).toString('base64url'), id = randomUUID(), expires = now + this.store.config.limits.sessionTtlSeconds;
      this.store.run('INSERT INTO sessions(id,secret_hash,created_at,expires,privacy_version) VALUES(?,?,?,?,?)',
        id, sha256(secret), time(now), expires, input.privacyNoticeVersion);
      this.store.run('INSERT INTO session_creates VALUES(?,?,?,?)', requestId, sha256(bytes), id,
        expires + this.store.config.limits.suppressionRetentionSeconds);
      const row = this.store.get<SessionRow>('SELECT * FROM sessions WHERE id=?', id)!;
      return { body: this.sessionDto({ row, secret }),
        cookie: `${cookieName}=${secret}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${expires - now}` };
    });
  }

  owned(visitor: Visitor, id: string, allowDeleted = false): ConversationRow {
    this.current(visitor);
    const row = this.store.get<ConversationRow>('SELECT * FROM conversations WHERE id=? AND session_id=?', id, visitor.row.id);
    need(row && row.expires > this.now() && (allowDeleted || row.state !== 'deleted' && row.state !== 'expired'), 'NOT_FOUND');
    return row;
  }

  conversationDto(row: ConversationRow): AskConversation {
    return validate('AskConversation', { schemaVersion: '1.0', conversationId: row.id,
      createdAt: row.created_at, expiresAt: time(row.expires), state: row.state });
  }

  receipt<T>(visitor: Visitor, target: string, id: string, bytes: Buffer): T | undefined {
    this.current(visitor); validate('Id', id);
    const old = this.store.get<{digest:string;conversation_id:string;question_id:string|null;response_json:string}>(
      'SELECT * FROM visitor_receipts WHERE session_id=? AND target=? AND request_id=?', visitor.row.id, target, id);
    if (!old) return undefined;
    this.owned(visitor, old.conversation_id, target.endsWith(':delete'));
    need(old.digest === sha256(bytes), 'CONFLICT');
    if (old.question_id && !target.endsWith(':cancel')) {
      const question = this.store.get<QuestionRow>('SELECT * FROM questions WHERE id=?', old.question_id);
      need(question && !question.suppression, 'CANCELLED');
    }
    return JSON.parse(old.response_json) as T;
  }

  save(visitor: Visitor, target: string, id: string, bytes: Buffer, conversationId: string, questionId: string | null, result: unknown): void {
    const count = this.store.get<{n:number}>('SELECT count(*) n FROM visitor_receipts WHERE session_id=? AND target=?', visitor.row.id, target)!.n;
    need(count < 32, 'RATE_LIMITED');
    this.store.space(Buffer.byteLength(JSON.stringify(result)) + 4096, count === 0 && (target.endsWith(':cancel') || target.endsWith(':delete')));
    this.store.run('INSERT INTO visitor_receipts VALUES(?,?,?,?,?,?,?,?)', visitor.row.id, target, id, sha256(bytes),
      conversationId, questionId, JSON.stringify(result), this.now() + this.store.config.limits.suppressionRetentionSeconds);
  }

  createConversation(visitor: Visitor, bytes: Buffer, requestId: string): AskConversation {
    validate('AskConversationCreate', parseJson(bytes, this.store.config.limits.requestBytes));
    return this.store.atomic(() => {
      const old = this.receipt<AskConversation>(visitor, 'conversation:create', requestId, bytes); if (old) return old;
      need(this.store.config.admissionEnabled && new AskAuthority(this.store, this.now).ready(), 'UNAVAILABLE'); this.store.space();
      this.store.charge('conversations:' + visitor.row.id, 86400, 20, this.now());
      this.store.charge('conversations:global', 86400, 200, this.now());
      const id = randomUUID();
      this.store.run('INSERT INTO conversations(id,session_id,created_at,expires) VALUES(?,?,?,?)', id, visitor.row.id, time(this.now()), visitor.row.expires);
      const result = this.conversationDto(this.owned(visitor, id));
      this.save(visitor, 'conversation:create', requestId, bytes, id, null, result); return result;
    });
  }

  async submit(visitor: Visitor, conversationId: string, bytes: Buffer, requestId: string, network: string): Promise<AskAdmission> {
    this.owned(visitor, conversationId);
    const input = validate<AskQuestionInput>('AskQuestionInput', parseJson(bytes, this.store.config.limits.requestBytes));
    need([...input.text].length <= this.store.config.limits.questionCharacters, 'TOO_LARGE');
    if (input.context) need(await this.contextVisible([input.context]), 'NOT_FOUND');
    return this.store.atomic(() => {
      const conversation = this.owned(visitor, conversationId);
      const target = conversationId + ':question';
      const old = this.receipt<AskAdmission>(visitor, target, requestId, bytes); if (old) return old;
      need(this.store.config.admissionEnabled && conversation.state === 'open' && new AskAuthority(this.store, this.now).ready(), 'UNAVAILABLE');
      const active = this.store.all<{state:string}>('SELECT state FROM questions WHERE session_id=? AND suppression IS NULL', visitor.row.id);
      need(active.every(row => terminal.includes(row.state)), 'CONFLICT');
      const queued = this.store.get<{n:number}>("SELECT count(*) n FROM questions WHERE suppression IS NULL AND state NOT IN('answered','declined','expired','cancelled','failed')")!.n;
      need(queued < this.store.config.limits.queueCapacity, 'RATE_LIMITED');
      const history: string[] = [];
      const completed = this.store.all<QuestionRow>("SELECT * FROM questions WHERE conversation_id=? AND state='answered' AND suppression IS NULL AND question_json IS NOT NULL ORDER BY ordinal", conversationId);
      need(completed.length < this.store.config.limits.historyTurns, 'BUDGET_EXHAUSTED');
      need(input.priorQuestionId === (completed.at(-1)?.id ?? null), 'CONFLICT');
      if (input.priorQuestionId) {
        const prior = this.store.get<QuestionRow>("SELECT * FROM questions WHERE id=? AND conversation_id=? AND session_id=? AND state='answered' AND suppression IS NULL AND question_json IS NOT NULL", input.priorQuestionId, conversationId, visitor.row.id);
        need(prior, 'NOT_FOUND');
        history.push(...this.store.all<{id:string}>("SELECT id FROM questions WHERE conversation_id=? AND ordinal<=? AND state='answered' AND suppression IS NULL AND question_json IS NOT NULL ORDER BY ordinal DESC LIMIT ?",
          conversationId, prior.ordinal, this.store.config.limits.historyTurns - 1).reverse().map(row => row.id));
      }
      const now = this.now(), limits = this.store.config.limits;
      this.store.space(bytes.length * 2 + 32768);
      this.store.charge('questions:hour:' + visitor.row.id, 3600, limits.sessionHourlyQuestions, now);
      this.store.charge('questions:day:' + visitor.row.id, 86400, limits.sessionDailyQuestions, now);
      this.store.charge('questions:global', 86400, Math.min(50, limits.dailyExecutions), now);
      this.store.charge('questions:network:' + network, 3600, 20, now);
      const base = { schemaVersion: '1.0', serviceId: this.store.config.serviceId, sessionId: visitor.row.id,
        conversationId, questionId: randomUUID(), revision: 1, input, priorOwnedQuestionIds: history,
        receivedAt: time(now), expiresAt: time(Math.min(conversation.expires, now + limits.queueTtlSeconds, now + limits.rawRetentionSeconds)) };
      const question = validate<AskQuestion>('AskQuestion', { ...base, questionHash: canonicalHash(base) });
      const status = validate<AskStatus>('AskStatus', { schemaVersion: '1.0', questionId: question.questionId,
        questionHash: question.questionHash, state: 'queued', route: null, updatedAt: time(now), safeReason: null });
      this.store.run('INSERT INTO questions(id,session_id,conversation_id,question_hash,question_json,status_json,state,received_at,expires,raw_until,suppression_until,context_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
        question.questionId, visitor.row.id, conversationId, question.questionHash, JSON.stringify(question), JSON.stringify(status),
        'queued', time(now), Date.parse(question.expiresAt) / 1000, now + limits.rawRetentionSeconds,
        now + limits.suppressionRetentionSeconds, input.context ? JSON.stringify(input.context) : null);
      const result = validate<AskAdmission>('AskAdmission', { schemaVersion: '1.0', conversationId,
        questionId: question.questionId, revision: 1, questionHash: question.questionHash,
        state: 'queued', receivedAt: question.receivedAt, expiresAt: question.expiresAt });
      this.save(visitor, target, requestId, bytes, conversationId, question.questionId, result);
      this.store.touch(); return result;
    });
  }

  cancel(visitor: Visitor, id: string, bytes: Buffer, requestId: string): AskControlReceipt {
    validate('AskCancel', parseJson(bytes, this.store.config.limits.requestBytes));
    return this.store.atomic(() => {
      this.current(visitor);
      const row = this.store.get<QuestionRow>('SELECT * FROM questions WHERE id=? AND session_id=?', id, visitor.row.id);
      need(row, 'NOT_FOUND'); this.owned(visitor, row.conversation_id);
      const old = this.receipt<AskControlReceipt>(visitor, id + ':cancel', requestId, bytes); if (old) return old;
      const result = new AskLifecycle(this.store).control(row.conversation_id, id, 'cancel', this.now());
      this.save(visitor, id + ':cancel', requestId, bytes, row.conversation_id, id, result); return result;
    });
  }

  deleteConversation(visitor: Visitor, id: string, bytes: Buffer, requestId: string): AskControlReceipt {
    need(bytes.length === 0);
    return this.store.atomic(() => {
      this.owned(visitor, id, true);
      const old = this.receipt<AskControlReceipt>(visitor, id + ':delete', requestId, bytes); if (old) return old;
      const result = new AskLifecycle(this.store).control(id, null, 'delete', this.now());
      this.store.run("UPDATE conversations SET state='deleted' WHERE id=?", id);
      this.save(visitor, id + ':delete', requestId, bytes, id, null, result); return result;
    });
  }

  async read(visitor: Visitor, id: string, query: URLSearchParams): Promise<AskConversationPage> {
    this.owned(visitor, id);
    const requested = query.get('limit') ?? '50'; need(/^[1-9][0-9]*$/.test(requested) && Number(requested) <= 100);
    const limit = Math.min(Number(requested), this.store.config.limits.historyTurns);
    let upper = this.store.get<{n:number}>('SELECT coalesce(max(ordinal),0) n FROM questions WHERE conversation_id=?', id)!.n, after = 0;
    if (query.has('after')) {
      const cursor = this.store.get<{session_id:string;conversation_id:string;epoch:string;watermark:number;after_ordinal:number;page_limit:number;expires:number}>('SELECT * FROM conversation_cursors WHERE id=?', query.get('after')!);
      need(cursor && cursor.session_id === visitor.row.id && cursor.conversation_id === id && cursor.epoch === this.store.meta().epoch && cursor.page_limit === limit && cursor.expires > this.now(), 'CURSOR_RESET');
      upper = cursor.watermark; after = cursor.after_ordinal;
    }
    const rows = this.store.all<QuestionRow>('SELECT * FROM questions WHERE conversation_id=? AND ordinal>? AND ordinal<=? AND question_json IS NOT NULL ORDER BY ordinal LIMIT ?', id, after, upper, limit + 1);
    const turns: AskConversationPage['turns'] = [];
    const refs: ContextRef[] = [];
    let processed = after, bytes = 1024, historyAvailable = true;
    for (const row of rows.slice(0, limit)) {
      if (row.raw_until <= this.now() || row.suppression) { processed = row.ordinal; continue; }
      const question = validate<AskQuestion>('AskQuestion', JSON.parse(row.question_json!));
      const answerRow = this.store.get<{answer_json:string|null}>('SELECT answer_json FROM answers WHERE question_id=?', row.id);
      const answer = answerRow?.answer_json ? validate<AskAnswer>('AskAnswer', JSON.parse(answerRow.answer_json)) : null;
      const status = validate<AskStatus>('AskStatus', JSON.parse(row.status_json!));
      const turn = { questionId: row.id, input: question.input, status, answer: this.store.config.deliveryEnabled ? answer : null };
      const size = Buffer.byteLength(JSON.stringify(turn));
      if (bytes + size > 500000) break;
      bytes += size; processed = row.ordinal; turns.push(turn);
      const contexts = questionContexts(this.store,row,this.now(),answer ?? undefined);
      if (contexts === null) historyAvailable = false; else refs.push(...contexts);
    }
    const visible = historyAvailable && await this.contextVisible(refs);
    // No await after the final archive witness and current ownership/suppression checks.
    if (!visible) for (const turn of turns) {
      turn.answer = null;
      turn.status = { ...turn.status, state: 'declined', route: null, safeReason: 'Referenced public evidence is unavailable.' };
    }
    const conversation = this.conversationDto(this.owned(visitor, id));
    let nextCursor: string | null = null;
    if (rows.some(row => row.ordinal > processed)) {
      need(this.store.get<{n:number}>('SELECT count(*) n FROM conversation_cursors')!.n < 1000, 'RATE_LIMITED');
      this.store.space(4096);
      nextCursor = randomUUID();
      this.store.run('INSERT INTO conversation_cursors VALUES(?,?,?,?,?,?,?,?)', nextCursor, visitor.row.id, id,
        this.store.meta().epoch, upper, processed, limit, this.now() + 300);
    }
    const stillOwned = turns.filter(turn => {
      const current = this.store.get<QuestionRow>('SELECT * FROM questions WHERE id=?', turn.questionId);
      if (!current?.question_json || current.suppression || current.raw_until <= this.now()) return false;
      if (questionContexts(this.store,current,this.now(),turn.answer ?? undefined) === null) {
        turn.answer = null; turn.status = {...turn.status,state:'declined',route:null,safeReason:'Prior private context is no longer available.'};
      }
      return true;
    });
    return validate('AskConversationPage', { schemaVersion: '1.0', conversation, turns: stillOwned, nextCursor });
  }
}
