import { request } from 'node:http';
import type { ContextRef, RecordDetail } from '../../vendor/investment/v1/types.js';
import { parseJson, validate } from '../schema.js';
import type { AskConfig } from './config.js';

/** One bounded snapshot check, including a final visibility witness, for all output refs. */
export type ContextVerifier = (contexts: ContextRef[]) => Promise<boolean>;
export function contextVerifier(config: AskConfig): ContextVerifier {
  return async (contexts: ContextRef[]): Promise<boolean> => {
    if (!contexts.length) return true;
    try {
      if (!config.archiveOrigin || !config.archiveAuthority) return false;
      const refs = [...new Map(contexts.map(context => {
        validate('ContextRef', context);
        if (!['transaction', 'order', 'decision', 'artifact'].includes(context.record.kind)) throw new Error('Unsupported record');
        const path = `/api/experiments/v1/experiments/${context.experimentId}/runs/${context.runId}/records/${context.record.kind}/${context.record.id}/versions/${context.record.version}`;
        return [path, context] as const;
      }))];
      if (refs.length > 168) return false;
      const origin = new URL(config.archiveOrigin), deadline = Date.now() + 5000;
      let total = 0, fingerprint: string | null = null;
      const read = async ([path, context]: typeof refs[number]): Promise<boolean> => {
        if (Date.now() >= deadline || total > 8388608) return false;
        return new Promise<boolean>(resolve => {
          const req = request({ hostname: '127.0.0.1', port: origin.port || '80', path, method: 'GET',
            headers: { Host: config.archiveAuthority!, Connection: 'close' }, agent: false }, res => {
            const witness = res.headers['x-archive-visibility'];
            if (res.statusCode !== 200 || res.headers['content-type'] !== 'application/json' ||
                typeof witness !== 'string' || !/^[a-f0-9]{64}$/.test(witness) ||
                res.headers['cache-control'] !== 'private, no-store' || fingerprint !== null && fingerprint !== witness) {
              res.destroy(); resolve(false); return;
            }
            fingerprint = witness;
            const chunks: Buffer[] = []; let size = 0;
            res.on('data', (part: Buffer) => {
              size += part.length; total += part.length;
              if (size > 2097152 || total > 8388608) { res.destroy(); resolve(false); } else chunks.push(part);
            });
            res.on('error', () => resolve(false)); res.on('aborted', () => resolve(false));
            res.on('end', () => {
              try {
                const result = validate<RecordDetail>('RecordDetail', parseJson(Buffer.concat(chunks), 2097152));
                resolve(result.experimentId === context.experimentId && result.runId === context.runId &&
                  result.visibility === 'published' && result.event !== null &&
                  result.record.kind === context.record.kind && result.record.id === context.record.id && result.record.version === context.record.version);
              } catch { resolve(false); }
            });
          });
          const timeout = setTimeout(() => { req.destroy(); resolve(false); }, Math.max(1, deadline - Date.now()));
          req.on('close', () => clearTimeout(timeout)); req.on('error', () => resolve(false)); req.end();
        });
      };
      // At most two requests in flight and eight MiB total, regardless of evidence fan-out.
      for (let i = 0; i < refs.length; i += 2) if (!(await Promise.all(refs.slice(i, i + 2).map(read))).every(Boolean)) return false;
      return await read(refs[0]!);
    } catch { return false; }
  };
}
