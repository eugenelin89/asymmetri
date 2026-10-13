import type { AskAnswer, AskQuestion, ContextRef } from '../../vendor/investment/v1/types.js';
import { validate } from '../schema.js';
import type { AskStore, QuestionRow } from './database.js';

/** Follow-up history is trusted context even when the new answer omits a citation. */
export function questionContexts(store: AskStore, question: QuestionRow, now: number, answer?: AskAnswer): ContextRef[] | null {
  const refs: ContextRef[] = [], visited = new Set<string>();
  function visit(row: QuestionRow, current: boolean): boolean {
    if (visited.has(row.id)) return true;
    visited.add(row.id);
    if (visited.size > store.config.limits.historyTurns || !row.question_json || row.suppression || row.raw_until <= now ||
        row.conversation_id !== question.conversation_id || row.session_id !== question.session_id) return false;
    const value = validate<AskQuestion>('AskQuestion', JSON.parse(row.question_json));
    if (value.input.context) refs.push(value.input.context);
    const saved = store.get<{answer_json:string|null}>('SELECT answer_json FROM answers WHERE question_id=?',row.id);
    const output = current && answer ? answer : saved?.answer_json ? validate<AskAnswer>('AskAnswer',JSON.parse(saved.answer_json)) : null;
    if (!current && !output) return false;
    refs.push(...(output?.evidence ?? []));
    for (const id of value.priorOwnedQuestionIds) {
      const ancestor = store.get<QuestionRow>('SELECT * FROM questions WHERE id=?',id);
      if (!ancestor || !visit(ancestor,false)) return false;
    }
    return true;
  }
  return visit(question,true) ? refs : null;
}
