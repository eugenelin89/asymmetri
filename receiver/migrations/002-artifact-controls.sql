-- Additive INV-03 controls. No startup authority is created.
CREATE TABLE recovery_control (id INTEGER PRIMARY KEY CHECK(id=1), reads_held INTEGER NOT NULL CHECK(reads_held IN(0,1)), reconciled_digest TEXT);
INSERT INTO recovery_control VALUES(1,0,NULL);
CREATE TABLE artifact_controls (id INTEGER PRIMARY KEY, experiment_id TEXT NOT NULL, run_id TEXT NOT NULL, artifact_id TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN('registered','awaiting_publication','failed','withheld','withdrawn')), recorded_at TEXT NOT NULL);
CREATE INDEX artifact_control_target ON artifact_controls(experiment_id,run_id,artifact_id,id);
CREATE TABLE artifact_approvals (experiment_id TEXT NOT NULL, run_id TEXT NOT NULL, artifact_id TEXT NOT NULL, version INTEGER NOT NULL, metadata_hash TEXT NOT NULL, approved_at TEXT NOT NULL, PRIMARY KEY(experiment_id,run_id,artifact_id,version));
CREATE TABLE correction_releases (experiment_id TEXT NOT NULL, run_id TEXT NOT NULL, event_id TEXT NOT NULL, prior_event_id TEXT NOT NULL, approved_at TEXT NOT NULL, PRIMARY KEY(experiment_id,run_id,event_id,prior_event_id), FOREIGN KEY(experiment_id,run_id,event_id) REFERENCES events(experiment_id,run_id,event_id));
CREATE TABLE control_audit (id INTEGER PRIMARY KEY, action TEXT NOT NULL, target_hash TEXT NOT NULL, recorded_at TEXT NOT NULL);
CREATE TRIGGER controls_no_update BEFORE UPDATE ON artifact_controls BEGIN SELECT RAISE(ABORT,'immutable control'); END;
CREATE TRIGGER controls_no_delete BEFORE DELETE ON artifact_controls BEGIN SELECT RAISE(ABORT,'immutable control'); END;
CREATE TRIGGER audit_no_update BEFORE UPDATE ON control_audit BEGIN SELECT RAISE(ABORT,'immutable audit'); END;
CREATE TRIGGER audit_no_delete BEFORE DELETE ON control_audit BEGIN SELECT RAISE(ABORT,'immutable audit'); END;
CREATE TABLE recovery_suppressions (experiment_id TEXT NOT NULL, run_id TEXT NOT NULL, event_id TEXT NOT NULL, visibility TEXT NOT NULL CHECK(visibility IN('withheld','withdrawn')), recorded_at TEXT NOT NULL, PRIMARY KEY(experiment_id,run_id,event_id));
CREATE TABLE denied_content (sha256 TEXT PRIMARY KEY, recorded_at TEXT NOT NULL);
