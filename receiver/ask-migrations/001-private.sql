-- Separate private database. Never applied to archive.sqlite or copied with its backups.
CREATE TABLE ask_meta (
  id INTEGER PRIMARY KEY CHECK(id=1), service_id TEXT NOT NULL, epoch TEXT NOT NULL,
  generation TEXT NOT NULL DEFAULT '0', generation_expires INTEGER NOT NULL DEFAULT 0, held INTEGER NOT NULL DEFAULT 0,
  revision INTEGER NOT NULL DEFAULT 0, network_key TEXT NOT NULL
);
CREATE TABLE sessions (id TEXT PRIMARY KEY, secret_hash TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL, expires INTEGER NOT NULL, privacy_version TEXT NOT NULL, deleted INTEGER NOT NULL DEFAULT 0);
CREATE TABLE session_creates (request_id TEXT PRIMARY KEY, digest TEXT NOT NULL,
  session_id TEXT NOT NULL REFERENCES sessions(id), expires INTEGER NOT NULL);
CREATE TABLE conversations (id TEXT PRIMARY KEY, session_id TEXT NOT NULL REFERENCES sessions(id),
  created_at TEXT NOT NULL, expires INTEGER NOT NULL, state TEXT NOT NULL DEFAULT 'open');
CREATE INDEX owned_conversations ON conversations(session_id,id);
CREATE TABLE questions (ordinal INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT UNIQUE NOT NULL,
  session_id TEXT NOT NULL REFERENCES sessions(id), conversation_id TEXT NOT NULL REFERENCES conversations(id),
  question_hash TEXT NOT NULL, question_json TEXT, status_json TEXT,
  state TEXT NOT NULL, received_at TEXT NOT NULL, expires INTEGER NOT NULL,
  raw_until INTEGER NOT NULL, suppression_until INTEGER NOT NULL, suppression TEXT,
  answer_id TEXT, context_json TEXT);
CREATE INDEX owned_questions ON questions(session_id,conversation_id,ordinal);
CREATE INDEX queue_questions ON questions(suppression,state,ordinal);
CREATE TABLE visitor_receipts (session_id TEXT NOT NULL, target TEXT NOT NULL, request_id TEXT NOT NULL,
  digest TEXT NOT NULL, conversation_id TEXT NOT NULL, question_id TEXT, response_json TEXT NOT NULL,
  expires INTEGER NOT NULL, PRIMARY KEY(session_id,target,request_id));
CREATE TABLE service_keys (key_id TEXT PRIMARY KEY, service_id TEXT NOT NULL, generation TEXT NOT NULL,
  scope_json TEXT NOT NULL, public_key TEXT NOT NULL, not_before INTEGER NOT NULL, not_after INTEGER NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0);
CREATE TABLE nonces (key_id TEXT NOT NULL REFERENCES service_keys(key_id), nonce TEXT NOT NULL,
  expires INTEGER NOT NULL, PRIMARY KEY(key_id,nonce));
CREATE TABLE quotas (bucket TEXT NOT NULL, period INTEGER NOT NULL, count INTEGER NOT NULL,
  expires INTEGER NOT NULL, PRIMARY KEY(bucket,period));
CREATE TABLE claims (id TEXT PRIMARY KEY, question_id TEXT NOT NULL REFERENCES questions(id),
  generation TEXT NOT NULL, lease_expires INTEGER NOT NULL);
CREATE INDEX leased_questions ON claims(question_id,lease_expires);
CREATE TABLE transport_receipts (key_id TEXT NOT NULL, generation TEXT NOT NULL, target TEXT NOT NULL,
  request_id TEXT NOT NULL, digest TEXT NOT NULL, question_id TEXT, response_json TEXT,
  expires INTEGER NOT NULL, PRIMARY KEY(generation,target,request_id));
CREATE TABLE answers (id TEXT PRIMARY KEY, question_id TEXT UNIQUE NOT NULL REFERENCES questions(id),
  question_hash TEXT NOT NULL, generated_at TEXT NOT NULL, digest TEXT NOT NULL,
  answer_json TEXT, receipt_json TEXT NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE controls (sequence INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT UNIQUE NOT NULL,
  conversation_id TEXT NOT NULL, question_id TEXT, action TEXT NOT NULL,
  receipt_json TEXT NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE control_delivery (generation TEXT NOT NULL, control_id TEXT NOT NULL REFERENCES controls(id),
  acknowledged INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(generation,control_id));
CREATE TABLE control_cursors (id TEXT PRIMARY KEY, generation TEXT NOT NULL, epoch TEXT NOT NULL,
  watermark INTEGER NOT NULL, after_sequence INTEGER NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE barriers (id TEXT PRIMARY KEY, generation TEXT NOT NULL, epoch TEXT NOT NULL,
  watermark INTEGER NOT NULL, checked_at INTEGER NOT NULL, valid_until INTEGER NOT NULL);
CREATE TABLE conversation_cursors (id TEXT PRIMARY KEY, session_id TEXT NOT NULL, conversation_id TEXT NOT NULL,
  epoch TEXT NOT NULL, watermark INTEGER NOT NULL, after_ordinal INTEGER NOT NULL,
  page_limit INTEGER NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE owner_audit (id INTEGER PRIMARY KEY, action TEXT NOT NULL, target_hash TEXT NOT NULL, recorded_at TEXT NOT NULL);
