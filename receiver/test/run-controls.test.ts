import test from 'node:test';
import assert from 'node:assert/strict';
import { RunControls } from '../src/run-controls.js';
import { canonicalHash } from '../src/schema.js';
import type { RunPublishedEvent } from '../vendor/investment/v1/types.js';
import { harness, golden, clone } from './helpers.js';

function observed(): RunPublishedEvent {
  const event = clone(golden.batch.events[0]!);
  assert.equal(event.type, 'run.published');
  const run = event as RunPublishedEvent;
  run.evidenceMode = 'observed_paper';
  run.payload.runKind = 'official';
  run.payload.configuration.configurationStatus = 'owner_approved';
  run.payload.configuration.approvalRecordId = 'test-owner-approval';
  run.payload.configurationHash = canonicalHash(run.payload.configuration);
  return run;
}

test('local approval precedes signed observed ingestion; selection is explicit, audited and persistent', async t => {
  const h = await harness(t), event = observed(), now = new Date(h.now() * 1000).toISOString();
  const controls = new RunControls(h.receiver.db);
  const batch = { ...clone(golden.batch), events: [event] as [RunPublishedEvent] };
  assert.equal((await h.batch(batch)).status, 403);
  controls.approve(event, now);
  controls.approve(event, now);
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM control_audit')!.n, 1);
  assert.equal((await h.batch(batch)).status, 201);
  const path = '/api/experiments/v1/experiments/' + event.experimentId;
  assert.equal((await h.get(path)).body.officialRunId, null);
  const epoch = h.receiver.db.meta().visibility_epoch;
  controls.selectOfficial(event.experimentId, event.runId, null, now);
  assert.equal((await h.get(path)).body.officialRunId, event.runId);
  assert.equal(h.receiver.db.meta().visibility_epoch, epoch + 1);
  assert.throws(() => controls.selectOfficial(event.experimentId, event.runId, null, now), /CONFLICT/);
  controls.selectOfficial(event.experimentId, event.runId, event.runId, now);
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM control_audit')!.n, 2);
  await h.restart();
  assert.equal((await h.get(path)).body.officialRunId, event.runId);
  h.receiver.db.hide(event.experimentId, event.runId, event.eventId, 'withdrawn', now);
  assert.throws(() => new RunControls(h.receiver.db).selectOfficial(event.experimentId, event.runId, event.runId, now), /NOT_FOUND/);
});

test('approval rejects fixtures, publisher-only claims, corrupt and conflicting frozen configuration', async t => {
  const h = await harness(t), controls = new RunControls(h.receiver.db);
  const now = new Date(h.now() * 1000).toISOString();
  assert.throws(() => controls.approve(golden.batch.events[0], now));
  const unapproved = observed(); unapproved.payload.configuration.approvalRecordId = null;
  assert.throws(() => controls.approve(unapproved, now));
  const corrupt = observed(); corrupt.payload.configurationHash = '0'.repeat(64);
  assert.throws(() => controls.approve(corrupt, now), /CONFLICT/);
  const event = observed(); controls.approve(event, now);
  const conflicting = clone(event); conflicting.payload.configuration.commission = '1';
  conflicting.payload.configurationHash = canonicalHash(conflicting.payload.configuration);
  assert.throws(() => controls.approve(conflicting, now), /CONFLICT/);
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM publication_approvals')!.n, 1);
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM runs')!.n, 0);
});

test('fixture or private-trial publication cannot be selected as official', async t => {
  const h = await harness(t), controls = new RunControls(h.receiver.db);
  const now = new Date(h.now() * 1000).toISOString();
  await h.stage(); assert.equal((await h.batch()).status, 201);
  assert.throws(() => controls.selectOfficial('fixture-experiment', 'fixture-run', null, now), /FORBIDDEN/);
  const conflicting = observed();
  assert.throws(() => controls.approve(conflicting, now), /CONFLICT/);
  const trial = observed(); trial.runId = 'private-trial'; trial.eventId = 'private-run-event'; trial.payload.runKind = 'private_trial';
  // Owner control is tested independently of publisher provisioning for this second run.
  controls.approve(trial, now);
  h.receiver.db.run('INSERT INTO runs VALUES(?,?,?,?,?,0)', trial.experimentId, trial.runId,
    trial.payload.configurationHash, JSON.stringify(trial.payload), trial.evidenceMode);
  h.receiver.db.insertEvent(trial, now, 'private-test-receipt');
  assert.throws(() => controls.selectOfficial(trial.experimentId, trial.runId, null, now), /FORBIDDEN/);
});

test('restored or unapproved observed runs cannot acquire official selection', async t => {
  const h = await harness(t), event = observed(), now = new Date(h.now() * 1000).toISOString();
  const controls = new RunControls(h.receiver.db);
  controls.approve(event, now);
  assert.equal((await h.batch({ ...clone(golden.batch), events: [event] })).status, 201);
  h.receiver.db.run('DELETE FROM publication_approvals');
  assert.throws(() => controls.selectOfficial(event.experimentId, event.runId, null, now), /FORBIDDEN/);
  h.receiver.db.fenceRestore(now);
  assert.throws(() => controls.approve(event, now), /UNAVAILABLE/);
  assert.throws(() => controls.selectOfficial(event.experimentId, event.runId, null, now), /UNAVAILABLE/);
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM publication_approvals')!.n, 0);
});

test('official replacement preserves history and a stale expectation changes no state', async t => {
  const h = await harness(t), first = observed(), second = observed();
  const now = new Date(h.now() * 1000).toISOString(), controls = new RunControls(h.receiver.db);
  controls.approve(first, now);
  assert.equal((await h.batch({ ...clone(golden.batch), events: [first] })).status, 201);
  controls.selectOfficial(first.experimentId, first.runId, null, now);
  second.runId = 'second-official'; second.eventId = 'second-run-event';
  Object.assign(h.scope, { runId: second.runId, publisherId: 'second-publisher', keyId: 'second-key' });
  h.receiver.db.authorize(h.scope, h.key, now);
  controls.approve(second, now);
  const batch = { ...clone(golden.batch), runId: second.runId, batchId: 'second-batch', events: [second] };
  const path = '/api/experiments/v1/experiments/' + first.experimentId;
  assert.equal((await h.send(h.signed('POST', path + '/runs/' + second.runId + '/events',
    Buffer.from(JSON.stringify(batch)), batch.batchId))).status, 201);
  controls.selectOfficial(first.experimentId, second.runId, first.runId, now);
  const epoch = h.receiver.db.meta().visibility_epoch;
  const audits = h.receiver.db.get<{n:number}>('SELECT count(*) n FROM control_audit')!.n;
  assert.throws(() => controls.selectOfficial(first.experimentId, first.runId, first.runId, now), /CONFLICT/);
  assert.equal(h.receiver.db.meta().visibility_epoch, epoch);
  assert.equal(h.receiver.db.get<{n:number}>('SELECT count(*) n FROM control_audit')!.n, audits);
  const result = (await h.get(path)).body;
  assert.equal(result.officialRunId, second.runId);
  assert.equal((result.runs as unknown[]).length, 2);
});
