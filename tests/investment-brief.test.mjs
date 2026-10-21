import test from 'node:test';
import assert from 'node:assert/strict';
import { investmentBrief, briefDate, briefTime } from '../lib/investment-brief.ts';

const record = (sequence, type, payload, receivedAt = '2026-10-19T12:05:17Z') => ({ event: { sourceSequence: sequence, type, payload: type === 'run.status' ? {reason:'Published fixture status',effectiveAt:receivedAt,...payload} : payload }, receivedAt });
const proposal = { rationale: 'Hold cash.\nFacts: Evidence remains limited.', sources: [{ retrievedAt: '2026-10-19T11:47:34Z' }, { retrievedAt: '2026-10-19T11:45:14Z' }] };
test('latest decision follows exact source sequence, not late receipt time or input order', () => {
  const newest = record('9007199254740994', 'decision.published', { proposal });
  const older = record('9007199254740993', 'decision.published', { proposal: { ...proposal, rationale: 'Older decision' } }, '2026-10-20T12:00:00Z');
  const result = investmentBrief([newest, older], null);
  assert.equal(result.decisionRecord, newest);
  assert.equal(result.thesis, 'Hold cash.');
  assert.equal(result.sourceCount, 2);
  assert.equal(result.researchFrom, '2026-10-19T11:45:14Z');
  assert.equal(result.researchTo, '2026-10-19T11:47:34Z');
});
test('newer partial valuation remains visible beside an older complete snapshot', () => {
  const complete = { valuationSequence: '3', revision: 1, quality: 'complete' };
  const partial = { valuationSequence: '4', revision: 1, quality: 'partial' };
  const result = investmentBrief([record('21', 'portfolio.snapshot', partial)], complete);
  assert.equal(result.valuation, partial);
});
test('snapshot newer than the event window wins; revisions remain exact', () => {
  const older = { valuationSequence: '4', revision: 1, quality: 'partial' };
  const corrected = { ...older, revision: 2, quality: 'complete' };
  assert.equal(investmentBrief([record('21', 'portfolio.snapshot', corrected)], older).valuation, corrected);
  const newest = { valuationSequence: '5', revision: 1, quality: 'complete' };
  assert.equal(investmentBrief([record('21', 'portfolio.snapshot', corrected)], newest).valuation, newest);
});
test('an explicit absent next review supersedes older schedules, and empty windows invent nothing', () => {
  assert.equal(investmentBrief([record('1', 'run.status', { nextReviewAt: '2026-10-20T12:00:00Z' }), record('2', 'run.status', { nextReviewAt: null })], null).nextReviewAt, null);
  const empty = investmentBrief([], null);
  assert.equal(empty.decision, null);
  assert.equal(empty.valuation, null);
  assert.equal(empty.nextReviewAt, null);
  assert.equal(empty.sourceCount, 0);
});
test('Vancouver dates remain explicit through midnight and daylight-saving changes', () => {
  assert.match(briefDate('2026-10-19T02:00:00Z'), /Sunday, October 18, 2026/);
  assert.match(briefTime('2026-10-19T12:05:17Z'), /5:05.*PDT/);
  assert.match(briefTime('2026-12-19T13:05:17Z'), /5:05.*PST/);
});

// Render the real component with the existing React/TypeScript toolchain.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as briefModule from '../lib/investment-brief.ts';
import * as links from '../lib/investment-links.ts';
const require = createRequire(import.meta.url);
function loadSource(path, dependencies) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  runInNewContext(output, { exports, require: id => dependencies[id] ?? require(id), process, Date, encodeURIComponent });
  return exports;
}
const { SessionBrief } = loadSource('../components/investment/session-brief.tsx', { '@/lib/investment-brief': briefModule, '@/lib/investment-links': links });
const decision = record('28', 'decision.published', {
  proposal: { ...proposal, action: 'HOLD', decisionId: 'decision-1', committedAt: '2026-10-19T12:01:03Z', invalidationCondition: 'Reassess after valid marks.', risks: ['Cash can lag.'] },
  review: { reviewerId: 'maya', disposition: 'approve', reviewedAt: '2026-10-19T12:02:08Z', rationale: 'New risk is blocked by missing benchmark data.', dissent: ['Three bars are insufficient.'] },
});
decision.event.actor = { kind: 'worker', workerId: 'atlas' };
const props = { events: { data: { items: [decision] }, error: null }, snapshot: null, status: { watermark: { sourceGaps: false } }, workers: [{ workerId: 'atlas', name: 'Atlas' }, { workerId: 'maya', name: 'Maya' }], run: 'exact-run', synthetic: false, checkedAt: Date.parse('2026-10-19T19:00:00Z') };
const render = changes => renderToStaticMarkup(React.createElement(SessionBrief, { ...props, ...changes }));
test('summary explains HOLD, reviewer and blocker with local clocks and exact-run evidence', () => {
  const html = render({});
  assert.match(html, /HOLD — keep the portfolio unchanged/);
  assert.match(html, /Maya approved it/);
  assert.match(html, /New risk is blocked by missing benchmark data/);
  assert.match(html, /5:05.*PDT/);
  assert.match(html, /decisions\/decision-1\?run=exact-run/);
  assert.match(html, /This decision proposes no buy or sell order/);
  assert.doesNotMatch(html, /All .* requests succeeded|No execution failures/);
});
test('BUY, rejected HOLD and revision do not imply a completed trade or approved hold', () => {
  for (const [action, disposition, expected] of [['BUY', 'approve', 'BUY proposal approved'], ['SELL', 'approve', 'SELL proposal approved'], ['HOLD', 'reject', 'HOLD proposal rejected'], ['HOLD', 'revise', 'HOLD proposal needs revision']]) {
    const changed = structuredClone(decision); changed.event.payload.proposal.action = action; changed.event.payload.review.disposition = disposition;
    const html = render({ events: { data: { items: [changed] }, error: null } });
    assert.ok(html.includes(expected));
    assert.match(html, /not a completed trade/);
    assert.doesNotMatch(html, /This decision proposes no buy or sell order/);
  }
});
test('unavailable and empty records do not claim a completed decision; content is escaped', () => {
  assert.match(render({ events: { data: null, error: 'Failed' } }), /Latest update unavailable/);
  assert.match(render({ events: { data: { items: [] }, error: null } }), /No decision in the latest published records/);
  const changed = structuredClone(decision); changed.event.payload.review.rationale = '<script>alert(1)</script>';
  assert.doesNotMatch(render({ events: { data: { items: [changed] }, error: null } }), /<script>/);
});
test('past next review stays historical and incomplete valuations remain explicit', () => {
  const partial = { valuationSequence: '4', revision: 1, cash: '100000.000000', holdings: [], valuationAsOf: '2026-10-16T20:00:00Z', quality: 'partial', benchmark: { missingReason: 'Missing SPY mark' } };
  const html = render({ events: { data: { items: [decision, record('29', 'run.status', { nextReviewAt: '2026-10-19T12:00:00Z' }), record('21', 'portfolio.snapshot', partial)] }, error: null }, synthetic: true, status: { watermark: { sourceGaps: true } } });
  assert.match(html, /Last scheduled review/);
  assert.match(html, /Benchmark comparison unavailable: Missing SPY mark/);
  assert.match(html, /Synthetic demonstration/);
  assert.match(html, /Some public records are missing/);
});
test('showcase reads one bounded tail and includes it in the final visibility witness', async () => {
  const calls = [], ok = data => ({ data, error: null, fingerprint: 'same' });
  const { readShowcase } = loadSource('../lib/investment-showcase.ts', { './investment-archive': {
    experimentRead: async () => ok({}),
    archiveRead: async path => { calls.push(path); return path === 'events?limit=100' ? { ...ok({ items: ['old'] }), tailCursor: 'tail-cursor' } : path.includes('after=') ? ok({ items: ['new'] }) : ok({}); },
  } });
  const result = await readShowcase('run-1');
  assert.equal(result.recentEvents.data.items[0], 'new');
  assert.equal(calls.filter(path => path.includes('after=')).length, 1);
  assert.equal(calls.at(-1), 'status');
  assert.equal(calls.length, 9); // plus the experiment read
});
test('failed or visibility-mismatched tail never falls back to an older decision', async () => {
  for (const tail of [{ data: null, error: 'Failed' }, { data: { items: ['new'] }, error: null, fingerprint: 'changed' }]) {
    const ok = data => ({ data, error: null, fingerprint: 'same' });
    const { readShowcase } = loadSource('../lib/investment-showcase.ts', { './investment-archive': {
      experimentRead: async () => ok({}),
      archiveRead: async path => path === 'events?limit=100' ? { ...ok({ items: ['old'] }), tailCursor: 'tail-cursor' } : path.includes('after=') ? tail : ok({}),
    } });
    assert.equal((await readShowcase('run-1')).recentEvents.data, null);
  }
});

test('new operational failure is shown above the separately dated older decision', () => {
 const status = record('30', 'run.status', { state: 'paused', reason: 'Research collection stopped on 2026-10-21. The team did not reach its decision stage.', nextReviewAt: null }, '2026-10-21T11:48:00Z');
 const html = render({ events: { data: { items: [status, decision] }, error: null } });
 assert.ok(html.indexOf('Research collection stopped') < html.indexOf('Latest published decision'));
 assert.match(html, /October 19, 2026/);assert.match(html, /did not reach its decision stage/);
 assert.match(render({ events: { data: { items: [status] }, error: null } }), /Research collection stopped/);
});
