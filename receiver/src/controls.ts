/** Local owner operations only. Never reachable through publisher HTTP routes. */
import type { ArtifactVersion, ArtifactState } from '../vendor/investment/v1/types.js';
import { Archive, eventFrom, type EventRow } from './database.js';
import { canonicalHash, requireContract as need, validate } from './schema.js';
export type RegistryState = Exclude<ArtifactState, 'published' | 'superseded'>;
interface ControlSnapshot {
    version: 1;
    denied: {
        sha256: string;
        recorded_at: string;
    }[];
    visibility: {
        experiment_id: string;
        run_id: string;
        event_id: string;
        visibility: 'withheld' | 'withdrawn';
        recorded_at: string;
    }[];
    registry: {
        experiment_id: string;
        run_id: string;
        artifact_id: string;
        status: RegistryState;
        recorded_at: string;
    }[];
}
export class Controls {
    constructor(readonly db: Archive) { }
    held(): boolean { return this.db.get<{
        reads_held: number;
    }>('SELECT reads_held FROM recovery_control WHERE id=1')!.reads_held === 1; }
    state(e: string, r: string, id: string): RegistryState | undefined {
        return this.db.get<{
            status: RegistryState;
        }>('SELECT status FROM artifact_controls WHERE experiment_id=? AND run_id=? AND artifact_id=? ORDER BY id DESC LIMIT 1', e, r, id)?.status;
    }
    registry(e: string, r: string, id: string, status: RegistryState, now: string): void {
        [e, r, id].forEach(x => validate('Id', x));
        validate('ArtifactState', status);
        need(!['published', 'superseded'].includes(status));
        this.db.atomic(() => {
            need(this.db.get('SELECT 1 FROM records WHERE experiment_id=? AND run_id=? AND kind=? AND record_id=? AND version=0', e, r, 'artifact', id), 'NOT_FOUND');
            const prior = this.state(e, r, id);
            if (prior === status)
                return;
            need(prior !== 'withdrawn', 'FORBIDDEN');
            if (status === 'withdrawn' || status === 'withheld')
                for (const a of this.db.all<{
                    sha256: string;
                }>('SELECT sha256 FROM artifact_versions WHERE experiment_id=? AND run_id=? AND artifact_id=?', e, r, id))
                    this.db.run('INSERT OR IGNORE INTO denied_content VALUES(?,?)', a.sha256, now);
            this.db.run('INSERT INTO artifact_controls(experiment_id,run_id,artifact_id,status,recorded_at) VALUES(?,?,?,?,?)', e, r, id, status, now);
            this.db.run('UPDATE archive_meta SET visibility_epoch=visibility_epoch+1,revision=revision+1 WHERE id=1');
        });
    }
    approve(e: string, r: string, metadata: ArtifactVersion, now: string): void {
        validate('Id', e);
        validate('Id', r);
        validate('ArtifactVersion', metadata);
        this.db.atomic(() => {
            const hash = canonicalHash(metadata), prior = this.db.get<{
                metadata_hash: string;
            }>('SELECT metadata_hash FROM artifact_approvals WHERE experiment_id=? AND run_id=? AND artifact_id=? AND version=?', e, r, metadata.artifactId, metadata.version);
            need(!prior || prior.metadata_hash === hash, 'CONFLICT');
            this.db.run('INSERT OR IGNORE INTO artifact_approvals VALUES(?,?,?,?,?,?)', e, r, metadata.artifactId, metadata.version, hash, now);
            this.db.run('INSERT INTO control_audit(action,target_hash,recorded_at) VALUES(?,?,?)', 'artifact rights approved', canonicalHash({ e, r, hash }), now);
            this.db.run('UPDATE archive_meta SET visibility_epoch=visibility_epoch+1,revision=revision+1 WHERE id=1');
        });
    }
    approved(e: string, r: string, p: ArtifactVersion): boolean {
        return !!this.db.get('SELECT 1 FROM artifact_approvals WHERE experiment_id=? AND run_id=? AND artifact_id=? AND version=? AND metadata_hash=?', e, r, p.artifactId, p.version, canonicalHash(p));
    }
    /** A reviewed replacement may cross only its own supersedes edge, never evidence links. */
    releaseCorrection(e: string, r: string, eventId: string, now: string): void {
        this.db.atomic(() => {
            const row = this.db.get<EventRow>('SELECT * FROM events WHERE experiment_id=? AND run_id=? AND event_id=?', e, r, eventId);
            need(row, 'NOT_FOUND');
            const event = eventFrom(row);
            need(event.type === 'artifact.published' && event.payload.supersedes, 'INVALID_REQUEST');
            const prior = this.db.get<{
                event_id: string;
            }>('SELECT event_id FROM artifact_versions WHERE experiment_id=? AND run_id=? AND artifact_id=? AND version=?', e, r, event.payload.supersedes.id, event.payload.supersedes.version);
            need(prior, 'NOT_FOUND');
            this.db.run('INSERT OR IGNORE INTO correction_releases VALUES(?,?,?,?,?)', e, r, eventId, prior.event_id, now);
            this.db.run('INSERT INTO control_audit(action,target_hash,recorded_at) VALUES(?,?,?)', 'correction reviewed', canonicalHash({ e, r, eventId, prior: prior.event_id }), now);
            this.db.run('UPDATE archive_meta SET visibility_epoch=visibility_epoch+1,revision=revision+1 WHERE id=1');
        });
    }
    snapshot(): ControlSnapshot {
        return this.db.atomic(() => ({ version: 1, denied: this.db.all('SELECT sha256,recorded_at FROM denied_content ORDER BY sha256'), visibility: this.db.all('SELECT experiment_id,run_id,event_id,visibility,recorded_at FROM visibility_actions UNION SELECT experiment_id,run_id,event_id,visibility,recorded_at FROM recovery_suppressions'), registry: this.db.all('SELECT experiment_id,run_id,artifact_id,status,recorded_at FROM artifact_controls ORDER BY id') }));
    }
    /** Owner supplies a separately preserved CURRENT control snapshot and verified digest.
     * Unknown targets remain absent; publisher fences prevent stale outbound resurrection.
     */
    reconcile(snapshot: ControlSnapshot, expectedDigest: string, now: string): void {
        validate('Hash', expectedDigest);
        need(snapshot.version === 1 && Array.isArray(snapshot.visibility) && Array.isArray(snapshot.registry) && Array.isArray(snapshot.denied) && canonicalHash(snapshot) === expectedDigest, 'CONFLICT');
        need(snapshot.visibility.length + snapshot.registry.length + snapshot.denied.length <= 100000, 'TOO_LARGE');
        this.db.atomic(() => {
            need(this.held(), 'CONFLICT');
            for (const a of snapshot.denied) {
                validate('Hash', a.sha256);
                validate('Time', a.recorded_at);
                this.db.run('INSERT OR IGNORE INTO denied_content VALUES(?,?)', a.sha256, a.recorded_at);
            }
            for (const a of snapshot.visibility) {
                [a.experiment_id, a.run_id, a.event_id].forEach(x => validate('Id', x));
                need(['withheld', 'withdrawn'].includes(a.visibility));
                validate('Time', a.recorded_at);
                this.db.run("INSERT INTO recovery_suppressions VALUES(?,?,?,?,?) ON CONFLICT(experiment_id,run_id,event_id) DO UPDATE SET visibility=CASE WHEN recovery_suppressions.visibility='withdrawn' THEN 'withdrawn' ELSE excluded.visibility END,recorded_at=excluded.recorded_at", a.experiment_id, a.run_id, a.event_id, a.visibility, a.recorded_at);
                if (this.db.get('SELECT 1 FROM events WHERE experiment_id=? AND run_id=? AND event_id=?', a.experiment_id, a.run_id, a.event_id))
                    this.db.hide(a.experiment_id, a.run_id, a.event_id, a.visibility, a.recorded_at);
            }
            for (const a of snapshot.registry) {
                [a.experiment_id, a.run_id, a.artifact_id].forEach(x => validate('Id', x));
                validate('Time', a.recorded_at);
                need(['registered', 'awaiting_publication', 'failed', 'withheld', 'withdrawn'].includes(a.status));
                if (this.state(a.experiment_id, a.run_id, a.artifact_id) !== 'withdrawn')
                    this.db.run('INSERT INTO artifact_controls(experiment_id,run_id,artifact_id,status,recorded_at) VALUES(?,?,?,?,?)', a.experiment_id, a.run_id, a.artifact_id, a.status, a.recorded_at);
            }
            this.db.run('UPDATE recovery_control SET reads_held=0,reconciled_digest=? WHERE id=1', expectedDigest);
            this.db.run('INSERT INTO control_audit(action,target_hash,recorded_at) VALUES(?,?,?)', 'restore controls reconciled', expectedDigest, now);
            this.db.run('UPDATE archive_meta SET visibility_epoch=visibility_epoch+1,revision=revision+1 WHERE id=1');
            this.db.resetEpoch();
        });
    }
}
