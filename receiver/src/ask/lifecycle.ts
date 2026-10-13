import { randomUUID } from 'node:crypto';
import type { AskControlReceipt } from '../../vendor/investment/v1/types.js';
import { AskStore, time, type QuestionRow } from './database.js';
import { validate } from '../schema.js';

export class AskLifecycle {
  constructor(readonly store: AskStore) {}

  control(conversationId: string, questionId: string | null,
    action: AskControlReceipt['action'], now: number): AskControlReceipt {
    const previous = this.store.get<{receipt_json:string}>(
      'SELECT receipt_json FROM controls WHERE conversation_id=? AND question_id IS ? AND action=? ORDER BY sequence DESC LIMIT 1', conversationId, questionId, action);
    if (previous) return validate('AskControlReceipt', JSON.parse(previous.receipt_json));
    if (questionId && this.store.get<QuestionRow>('SELECT * FROM questions WHERE id=?', questionId)?.suppression) {
      const suppressed = this.store.get<{receipt_json:string}>('SELECT receipt_json FROM controls WHERE conversation_id=? AND (question_id=? OR question_id IS NULL) ORDER BY sequence DESC LIMIT 1', conversationId, questionId);
      if (suppressed) return validate('AskControlReceipt', JSON.parse(suppressed.receipt_json));
    }
    this.store.space(8192, true);
    const until = now + this.store.config.limits.suppressionRetentionSeconds;
    const receipt = validate<AskControlReceipt>('AskControlReceipt', {
      schemaVersion: '1.0', controlId: randomUUID(), conversationId, questionId, action,
      effectiveAt: time(now), purgeBy: time(now + 60), suppressionUntil: time(until),
    });
    this.store.run('INSERT INTO controls(id,conversation_id,question_id,action,receipt_json,expires) VALUES(?,?,?,?,?,?)',
      receipt.controlId, conversationId, questionId, action, JSON.stringify(receipt), until);
    const questions = questionId ? this.store.all<QuestionRow>('SELECT * FROM questions WHERE id=?', questionId)
      : this.store.all<QuestionRow>('SELECT * FROM questions WHERE conversation_id=?', conversationId);
    for (const question of questions) {
      const suppression = question.suppression === 'delete' ? 'delete' : action;
      this.store.run('UPDATE questions SET suppression=?,state=?,suppression_until=max(suppression_until,?) WHERE id=?',
        suppression, suppression === 'expire' ? 'expired' : 'cancelled', until, question.id);
      this.purge(question.id);
    }
    this.store.touch();
    return receipt;
  }

  purge(questionId: string): void {
    this.store.markPurge();
    this.store.run('UPDATE questions SET question_json=NULL,status_json=NULL,context_json=NULL WHERE id=?', questionId);
    this.store.run('UPDATE answers SET answer_json=NULL WHERE question_id=?', questionId);
    this.store.run("UPDATE transport_receipts SET response_json=NULL WHERE question_id=? AND target NOT LIKE '%/answer'", questionId);
  }

  /** Bounded maintenance also runs before requests; traffic is not required for CLI cleanup. */
  cleanup(now: number): void {
    this.store.atomic(() => {
      for (const row of this.store.all<{id:string}>('SELECT id FROM conversations WHERE expires<=? AND state NOT IN(?,?) LIMIT 100', now, 'deleted', 'expired')) {
        this.control(row.id, null, 'expire', now);
        this.store.run("UPDATE conversations SET state='expired' WHERE id=?", row.id);
      }
      for (const row of this.store.all<QuestionRow>("SELECT * FROM questions WHERE expires<=? AND suppression IS NULL AND state NOT IN('answered','declined') LIMIT 100", now)) {
        this.control(row.conversation_id, row.id, 'expire', now);
      }
      for (const row of this.store.all<QuestionRow>('SELECT * FROM questions WHERE raw_until<=? AND question_json IS NOT NULL LIMIT 100', now)) this.control(row.conversation_id, row.id, 'expire', now);
      this.store.run('DELETE FROM nonces WHERE expires<?', now);
      this.store.run('DELETE FROM quotas WHERE expires<?', now);
      this.store.run('DELETE FROM barriers WHERE valid_until<?', now);
      this.store.run('DELETE FROM control_cursors WHERE expires<?', now);
      this.store.run('DELETE FROM conversation_cursors WHERE expires<?', now);
      this.store.run('DELETE FROM transport_receipts WHERE expires<?', now);
      this.store.run('DELETE FROM visitor_receipts WHERE expires<?', now);
      this.store.run('DELETE FROM session_creates WHERE expires<?', now);
      this.store.run('DELETE FROM control_delivery WHERE control_id IN(SELECT id FROM controls WHERE expires<?)', now);
      this.store.run('DELETE FROM controls WHERE expires<?', now);
      for (const row of this.store.all<{id:string}>('SELECT id FROM questions WHERE suppression_until<? AND question_json IS NULL LIMIT 100', now)) {
        this.store.run('DELETE FROM claims WHERE question_id=?', row.id);
        this.store.run('DELETE FROM answers WHERE question_id=?', row.id);
        this.store.run('DELETE FROM questions WHERE id=?', row.id);
      }
      this.store.run("DELETE FROM conversations WHERE expires<? AND NOT EXISTS(SELECT 1 FROM questions WHERE conversation_id=conversations.id)", now - this.store.config.limits.suppressionRetentionSeconds);
      this.store.run('DELETE FROM sessions WHERE expires<? AND NOT EXISTS(SELECT 1 FROM conversations WHERE session_id=sessions.id) AND NOT EXISTS(SELECT 1 FROM session_creates WHERE session_id=sessions.id)', now - this.store.config.limits.suppressionRetentionSeconds);
    });
  }
}
