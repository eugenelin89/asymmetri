import type { ServerResponse } from 'node:http';
import { setTimeout as delay, setImmediate as nextTurn } from 'node:timers/promises';
import type { ArtifactDetail } from '../vendor/investment/v1/types.js';
import { PublicReads } from './reads.js';
import { Storage, type Fault } from './storage.js';
import { canonicalHash, requireContract as need } from './schema.js';
const extensions = { 'text/plain': 'txt', 'text/markdown': 'md', 'application/json': 'json', 'text/csv': 'csv', 'image/png': 'png' } as const;
/** Bounded bytes, no hash-only routes, no ranges and no cache-reusable bodies. */
export async function download(reads: PublicReads, storage: Storage, res: ServerResponse, e: string, r: string, id: string, version: number, fault: Fault): Promise<void> {
    const lookup = () => reads.db.atomic(() => reads.artifact(e, r, id, version).body as ArtifactDetail);
    const initial = lookup();
    need(initial.metadata && ['published', 'superseded'].includes(initial.status), initial.status === 'withdrawn' || initial.status === 'withheld' ? 'WITHDRAWN' : 'DEPENDENCY_NOT_READY');
    const metadata = initial.metadata, identity = canonicalHash(metadata);
    const bytes = await storage.read(metadata.sha256, metadata.contentType, metadata.sizeBytes);
    let revision = -1;
    const deadline = Date.now() + 15000;
    const current = () => { need(Date.now() < deadline, 'UNAVAILABLE'); const next = reads.db.meta().revision; if (next === revision)
        return; const d = lookup(); need(d.metadata && canonicalHash(d.metadata) === identity && ['published', 'superseded'].includes(d.status), 'WITHDRAWN'); revision = next; };
    fault('before-download-headers');
    current();
    res.writeHead(200, { 'Content-Type': metadata.contentType, 'Content-Length': String(bytes.length), 'Content-Disposition': `attachment; filename="${id}-v${version}.${extensions[metadata.contentType]}"`, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; sandbox", 'Referrer-Policy': 'no-referrer', Connection: 'close' });
    // Yield between chunks and recheck durable controls even while backpressured.
    // Bytes already handed to TCP or third parties cannot be recalled.
    for (let offset = 0; offset < bytes.length; offset += 16384) {
        current();
        need(!res.destroyed, 'UNAVAILABLE');
        res.write(bytes.subarray(offset, offset + 16384));
        fault('download-chunk');
        while (res.writableNeedDrain && !res.destroyed) {
            await delay(20);
            current();
        }
        await nextTurn();
    }
    current();
    res.end();
}
