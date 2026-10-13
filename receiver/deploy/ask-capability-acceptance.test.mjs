/** Explicit candidate/accepted-package consumer acceptance. Never opens a live store. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

assert.ok(process.env.ASK_CAPABILITY_RUNTIME, 'Select an isolated compiled candidate or accepted runtime explicitly.');
const runtime = resolve(process.env.ASK_CAPABILITY_RUNTIME);
const { askConfig } = await import(pathToFileURL(join(runtime, 'dist/src/ask/config.js')).href);
const { validate, ContractError } = await import(pathToFileURL(join(runtime, 'dist/src/schema.js')).href);
const original = JSON.parse(await readFile(join(runtime, 'ask.config.example.json'), 'utf8'));
const examples = JSON.parse(await readFile(join(runtime, 'vendor/investment/v1/responses.json'), 'utf8')).examples;
const policy = { version: '1', tokenLimits: 'monitored_thresholds', actualCost: 'unavailable',
  overshoot: 'possible', internalRetries: 'possible', onMissingUsage: 'hold', onThresholdViolation: 'hold' };
const activity = () => ({ ...structuredClone(original.limits), monetaryEnforcement: 'activity_capped_subscription',
  dailyBudgetUsd: null, maxRouterExecutions: 0, maxResearchCalls: 0, subscriptionActivityPolicy: { ...policy } });
const rejects = (value, code = 'INVALID_SCHEMA') => assert.throws(() => validate('AskLimits', value),
  error => error instanceof ContractError && error.code === code);
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'asymmetri-ask-capability-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dataDir = join(root, 'private'), publicArchiveDir = join(root, 'public');
  await mkdir(dataDir, { mode: 0o700 }); await mkdir(publicArchiveDir, { mode: 0o700 });
  return { ...structuredClone(original), dataDir, publicArchiveDir };
}

test('activity mode preserves unavailable cost and never activates configured flags', async t => {
  const base = await fixture(t), result = askConfig({ ...base, limits: activity() });
  assert.equal(result.limits.dailyBudgetUsd, null);
  assert.deepEqual(result.limits.subscriptionActivityPolicy, policy);
  for (const flag of ['enabled', 'admissionEnabled', 'claimsEnabled', 'deliveryEnabled']) assert.equal(result[flag], false);
  assert.deepEqual(result.roster.workers, []);
});

test('subscription mode rejects mixed monetary, router, research and policy capabilities', () => {
  for (const [field, value] of [['dailyBudgetUsd', '0'], ['dailyBudgetUsd', '1'], ['maxRouterExecutions', 1], ['maxResearchCalls', 1]]) {
    rejects({ ...activity(), [field]: value });
  }
  const missing = activity(); delete missing.subscriptionActivityPolicy; rejects(missing);
  rejects({ ...activity(), subscriptionActivityPolicy: null });
  rejects({ ...activity(), subscriptionActivityPolicy: { ...policy, inventedHardCap: true } });
  for (const field of Object.keys(policy)) {
    const absent = activity(); delete absent.subscriptionActivityPolicy[field]; rejects(absent);
    rejects({ ...activity(), subscriptionActivityPolicy: { ...policy, [field]: 'unsupported' } });
  }
});

test('strict modes retain their shapes and reject a subscription policy', async t => {
  const base = await fixture(t);
  for (const mode of ['verified_cap', 'unavailable_disable_paid_admission']) {
    const limits = { ...structuredClone(original.limits), monetaryEnforcement: mode,
      dailyBudgetUsd: mode === 'verified_cap' ? '1' : null };
    assert.deepEqual(askConfig({ ...base, limits }).limits, limits);
    rejects({ ...limits, subscriptionActivityPolicy: { ...policy } });
    rejects({ ...limits, subscriptionActivityPolicy: null });
  }
  for (const budget of [null, '0']) assert.throws(() => askConfig({ ...base,
    limits: { ...original.limits, monetaryEnforcement: 'verified_cap', dailyBudgetUsd: budget } }), ContractError);
});

test('activity mode preserves existing owner approval and roster requirements', async t => {
  const base = await fixture(t);
  const roster = { ...structuredClone(examples.AskRoster), serviceId: base.serviceId };
  assert.ok(roster.workers.length > 0);
  const approved = { ...activity(), configurationStatus: 'owner_approved', approvalRecordId: 'synthetic-capability-acceptance' };
  for (const flag of ['admissionEnabled', 'claimsEnabled', 'deliveryEnabled']) {
    assert.throws(() => askConfig({ ...base, [flag]: true, limits: activity(), roster }), ContractError);
    assert.throws(() => askConfig({ ...base, [flag]: true, limits: { ...approved, approvalRecordId: null }, roster }), ContractError);
    assert.throws(() => askConfig({ ...base, [flag]: true, limits: approved }), ContractError);
    // In-memory parsing only: this is neither a listener nor genuine employee authority.
    assert.equal(askConfig({ ...base, [flag]: true, limits: approved, roster })[flag], true);
  }
});
