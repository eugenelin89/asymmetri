/** Owner-only observed-run controls. These operations have no HTTP route. */
import type { RunPublishedEvent } from '../vendor/investment/v1/types.js';
import { Archive, eventFrom } from './database.js';
import { Controls } from './controls.js';
import { PublicReads } from './reads.js';
import { canonicalHash, requireContract as need, validate } from './schema.js';

export class RunControls {
  constructor(readonly db: Archive) {}

  approve(input: unknown, now: string): void {
    const event = validate<RunPublishedEvent>('RunPublishedEvent', input);
    validate('Time', now);
    const { experimentId: experiment, runId: run, payload } = event;
    need(event.evidenceMode === 'observed_paper' && payload.runKind !== 'fixture');
    need(payload.configuration.configurationStatus === 'owner_approved' &&
      payload.configuration.approvalRecordId !== null);
    need(payload.configurationHash === canonicalHash(payload.configuration), 'CONFLICT');
    this.db.atomic(() => {
      need(!new Controls(this.db).held(), 'UNAVAILABLE');
      const existing = this.db.get<{ config_hash: string }>(
        'SELECT config_hash FROM runs WHERE experiment_id=? AND run_id=?', experiment, run);
      need(!existing || existing.config_hash === payload.configurationHash, 'CONFLICT');
      const approvals = this.db.all<{ configuration_hash: string }>(
        'SELECT configuration_hash FROM publication_approvals WHERE experiment_id=? AND run_id=?', experiment, run);
      need(approvals.every(row => row.configuration_hash === payload.configurationHash), 'CONFLICT');
      if (approvals.length) return;
      this.db.admitWrite(65536);
      this.db.run('INSERT INTO publication_approvals VALUES(?,?,?,?)', experiment, run, payload.configurationHash, now);
      this.db.run('INSERT INTO control_audit(action,target_hash,recorded_at) VALUES(?,?,?)',
        'observed run approved', canonicalHash({ experiment, run, configurationHash: payload.configurationHash }), now);
      this.db.touch();
    });
  }

  selectOfficial(experiment: string, run: string, expectedPrior: string | null, now: string): void {
    [experiment, run].forEach(id => validate('Id', id));
    if (expectedPrior !== null) validate('Id', expectedPrior);
    validate('Time', now);
    this.db.atomic(() => {
      need(!new Controls(this.db).held(), 'UNAVAILABLE');
      const current = this.db.get<{ official_run_id: string | null }>(
        'SELECT official_run_id FROM experiments WHERE experiment_id=?', experiment);
      need(current, 'NOT_FOUND');
      need(current.official_run_id === expectedPrior, 'CONFLICT');
      const published = new PublicReads(this.db, () => Date.parse(now) / 1000)
        .visible(experiment, run).rows.map(eventFrom).find(event => event.type === 'run.published');
      need(published?.type === 'run.published', 'NOT_FOUND');
      need(published.evidenceMode === 'observed_paper' && published.payload.runKind === 'official', 'FORBIDDEN');
      need(this.db.get('SELECT 1 FROM publication_approvals WHERE experiment_id=? AND run_id=? AND configuration_hash=?',
        experiment, run, published.payload.configurationHash), 'FORBIDDEN');
      if (current.official_run_id === run) return;
      this.db.admitWrite(65536);
      this.db.run('UPDATE experiments SET official_run_id=? WHERE experiment_id=?', run, experiment);
      this.db.run('INSERT INTO control_audit(action,target_hash,recorded_at) VALUES(?,?,?)',
        'official run selected', canonicalHash({ experiment, prior: expectedPrior, run }), now);
      this.db.run('UPDATE archive_meta SET visibility_epoch=visibility_epoch+1,revision=revision+1 WHERE id=1');
    });
  }
}
