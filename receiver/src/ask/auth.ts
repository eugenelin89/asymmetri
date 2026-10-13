import { createPublicKey } from 'node:crypto';
import type { AskServiceScope } from '../../vendor/investment/v1/types.js';
import { canonicalHash, requireContract as need, validate } from '../schema.js';
import { verifySignedRequest, type SignedMessage } from '../signatures.js';
import { AskStore, time } from './database.js';

export interface AskKey { key_id: string; service_id: string; generation: string; scope_json: string; public_key: string; not_before: number; not_after: number; revoked: number }
export interface AskAuth { key: AskKey; scope: AskServiceScope; message: SignedMessage; permission: AskServiceScope['permissions'][number] }

export class AskAuthority {
  constructor(readonly store: AskStore, readonly now: () => number) {}
  authorize(scope: AskServiceScope, input: { publicKey: string; notBefore: number; notAfter: number }): void {
    validate('AskServiceScope', scope);
    need(scope.serviceId === this.store.config.serviceId);
    need(Number.isSafeInteger(input.notBefore) && Number.isSafeInteger(input.notAfter) && input.notBefore < input.notAfter);
    const key = createPublicKey(input.publicKey); need(key.asymmetricKeyType === 'ed25519');
    const pem = key.export({ format: 'pem', type: 'spki' }).toString();
    this.store.atomic(() => {
      need(!this.store.meta().held, 'UNAVAILABLE');
      need(BigInt(scope.consumerGeneration) >= BigInt(this.store.meta().generation), 'CONFLICT');
      const generationExpires = BigInt(scope.consumerGeneration) > BigInt(this.store.meta().generation) ? this.now() + 86400 : this.store.meta().generation_expires;
      need(Date.parse(scope.expiresAt) / 1000 <= input.notAfter && input.notAfter <= generationExpires && input.notAfter > this.now(), 'INVALID_REQUEST');
      const prior = this.store.get<AskKey>('SELECT * FROM service_keys WHERE key_id=?', scope.keyId);
      if (prior) need(!prior.revoked && prior.public_key === pem && prior.generation === scope.consumerGeneration &&
        prior.not_before === input.notBefore && prior.not_after === input.notAfter, 'CONFLICT');
      if (BigInt(scope.consumerGeneration) > BigInt(this.store.meta().generation)) {
        this.store.run('UPDATE service_keys SET revoked=1');
        this.store.run('DELETE FROM barriers'); this.store.run('DELETE FROM control_cursors');
        // Old-generation signatures cannot be replayed. Immutable answers/controls remain.
        this.store.run('DELETE FROM transport_receipts');
        this.store.run('DELETE FROM control_delivery');
      }
      this.store.run('UPDATE ask_meta SET generation=?,generation_expires=? WHERE id=1', scope.consumerGeneration, generationExpires);
      this.store.run('INSERT INTO service_keys VALUES(?,?,?,?,?,?,?,0) ON CONFLICT(key_id) DO UPDATE SET scope_json=excluded.scope_json',
        scope.keyId, scope.serviceId, scope.consumerGeneration, JSON.stringify(scope), pem, input.notBefore, input.notAfter);
      this.store.run('INSERT INTO owner_audit(action,target_hash,recorded_at) VALUES(?,?,?)', 'Ask scope configured', canonicalHash(scope), time(this.now()));
      this.store.touch();
    });
  }

  available(): boolean {
    const now = this.now(), meta = this.store.meta();
    return !meta.held && this.store.all<AskKey>('SELECT * FROM service_keys WHERE revoked=0 AND generation=?', meta.generation).some(key => {
      const scope = validate<AskServiceScope>('AskServiceScope', JSON.parse(key.scope_json));
      return scope.enabled && now >= key.not_before && now < key.not_after && now * 1000 < Date.parse(scope.expiresAt) &&
        ['claim', 'control_sync', 'status', 'answer', 'receipt'].every(value => scope.permissions.includes(value as AskAuth['permission']));
    });
  }

  ready(): boolean {
    if (!this.available()) return false;
    const meta = this.store.meta(), watermark = this.store.get<{seq:number}>("SELECT seq FROM sqlite_sequence WHERE name='controls'")?.seq ?? 0;
    return !!this.store.get('SELECT 1 FROM barriers WHERE generation=? AND epoch=? AND watermark=? AND valid_until>? LIMIT 1',
      meta.generation, meta.epoch, watermark, this.now());
  }

  identify(headers: Map<string, string>, permission: AskAuth['permission']): { key: AskKey; scope: AskServiceScope } {
    const id = /;keyid="([A-Za-z0-9][A-Za-z0-9_-]{0,63})";nonce=/.exec(headers.get('signature-input') ?? '')?.[1];
    need(id, 'UNAUTHENTICATED');
    const key = this.store.get<AskKey>('SELECT * FROM service_keys WHERE key_id=?', id); need(key, 'UNAUTHENTICATED');
    const scope = validate<AskServiceScope>('AskServiceScope', JSON.parse(key.scope_json));
    const now = this.now();
    need(!key.revoked && scope.enabled && key.service_id === this.store.config.serviceId &&
      now >= key.not_before && now < key.not_after && now * 1000 < Date.parse(scope.expiresAt), 'FORBIDDEN');
    need(headers.get('botsquad-generation') === key.generation && key.generation === this.store.meta().generation, 'CONFLICT');
    need(scope.permissions.includes(permission), 'FORBIDDEN');
    need(!this.store.meta().held, 'UNAVAILABLE');
    return { key, scope };
  }

  proof(message: SignedMessage, key: AskKey) {
    return verifySignedRequest(message, { authority: this.store.config.authority,
      generation: key.generation, keyId: key.key_id, publicKey: createPublicKey(key.public_key),
      enabled: !key.revoked, notBefore: key.not_before, notAfter: key.not_after, now: this.now(),
      usedNonces: new Set(), targets: new Set([message.method + ' ' + message.path]) });
  }

  authenticate(message: SignedMessage, permission: AskAuth['permission']): AskAuth {
    const headers = new Map(message.headers), { key, scope } = this.identify(headers, permission);
    const proof = this.proof(message, key), nonce = proof.nonceKey.slice(key.key_id.length + 1);
    this.store.atomic(() => {
      this.identify(headers, permission);
      const now = this.now();
      this.store.run('DELETE FROM nonces WHERE expires<?', now);
      need(!this.store.get('SELECT 1 FROM nonces WHERE key_id=? AND nonce=?', key.key_id, nonce), 'REPLAY');
      // Reconciliation is independent from admission/claim burst quotas.
      this.store.charge('hq:' + (permission === 'control_sync' || permission === 'receipt' ? 'reconcile' : 'work'), 60, 120, now);
      need(this.store.get<{n:number}>('SELECT count(*) n FROM nonces')!.n < 2000, 'RATE_LIMITED');
      this.store.run('INSERT INTO nonces VALUES(?,?,?)', key.key_id, nonce, proof.retainUntil);
    });
    return { key, scope, message, permission };
  }

  recheck(auth: AskAuth): void {
    const current = this.identify(new Map(auth.message.headers), auth.permission);
    need(current.key.public_key === auth.key.public_key && current.key.scope_json === auth.key.scope_json, 'FORBIDDEN');
    this.proof(auth.message, current.key);
  }
}
