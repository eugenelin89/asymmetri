import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { constants } from 'node:fs';
import { cp, mkdir, readdir, lstat, open, readFile, writeFile, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Archive } from './database.js';
import { Controls } from './controls.js';
import { Storage } from './storage.js';
import { config, type Config } from './config.js';
import { canonicalHash, parseJson, requireContract as need } from './schema.js';
import type { ContentType } from '../vendor/investment/v1/types.js';
interface Manifest {
    version: 1;
    createdAt: string;
    files: Record<string, string>;
    migrations: {
        version: number;
        digest: string;
    }[];
    controlsDigest: string;
    runtime: Record<string, string>;
    watermarks: {
        experiment_id: string;
        run_id: string;
        watermark: unknown;
    }[];
}
async function hashes(root: string, prefix = ''): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    for (const name of (await readdir(join(root, prefix))).sort()) {
        need(/^[A-Za-z0-9_.-]+$/.test(name) && name !== '.' && name !== '..', 'UNAVAILABLE');
        const relative = prefix ? prefix + '/' + name : name, s = await lstat(join(root, relative));
        need(!s.isSymbolicLink(), 'UNAVAILABLE');
        if (s.isDirectory())
            Object.assign(result, await hashes(root, relative));
        else {
            need(s.isFile() && s.nlink === 1 && s.size <= 1073741824, 'UNAVAILABLE');
            const hash = createHash('sha256');
            for await (const chunk of createReadStream(join(root, relative), { highWaterMark: 65536 }))
                hash.update(chunk);
            result[relative] = hash.digest('hex');
        }
    }
    need(Object.keys(result).length <= 100000, 'TOO_LARGE');
    return result;
}
export async function integrity(db: Archive): Promise<void> {
    need(JSON.stringify(db.db.pragma('integrity_check')) === '[{"integrity_check":"ok"}]', 'UNAVAILABLE');
    need(JSON.stringify(db.db.pragma('foreign_key_check')) === '[]', 'UNAVAILABLE');
    const storage = new Storage(db);
    await storage.init();
    for (const a of db.all<{
        sha256: string;
        content_type: ContentType;
        size_bytes: number;
    }>('SELECT DISTINCT a.sha256,a.content_type,c.size_bytes FROM artifact_versions a JOIN content_objects c USING(sha256)'))
        await storage.read(a.sha256, a.content_type, a.size_bytes);
}
async function syncTree(root: string): Promise<void> {
    for (const name of await readdir(root)) {
        const p = join(root, name), s = await lstat(p);
        if (s.isDirectory())
            await syncTree(p);
        else {
            const f = await open(p, constants.O_RDONLY | constants.O_NOFOLLOW);
            try {
                await f.sync();
            }
            finally {
                await f.close();
            }
        }
    }
    const f = await open(root, constants.O_RDONLY);
    try {
        await f.sync();
    }
    finally {
        await f.close();
    }
}
/** Caller owns the exclusive stopped-service lock. Never point at a live archive. */
export async function backup(db: Archive, destination: string, now: string): Promise<{
    manifest: Manifest;
    digest: string;
}> {
    const root = resolve(destination);
    need(!root.startsWith(resolve(db.config.dataDir) + '/') && root !== resolve(db.config.dataDir));
    await mkdir(root, { mode: 0o700 });
    await mkdir(join(root, 'data'), { mode: 0o700 });
    for (const name of await readdir(db.config.dataDir)) {
        if (['receiver.lock', 'archive.sqlite', 'archive.sqlite-wal', 'archive.sqlite-shm'].includes(name))
            continue;
        const source = join(db.config.dataDir, name), s = await lstat(source);
        need(!s.isSymbolicLink(), 'UNAVAILABLE');
        await cp(source, join(root, 'data', name), { recursive: true, errorOnExist: true, force: false });
    }
    await db.db.backup(join(root, 'data', 'archive.sqlite'));
    const snapshot = new Archive({ ...db.config, dataDir: join(root, 'data') });
    try {
        await integrity(snapshot);
        await writeFile(join(root, 'config.json'), JSON.stringify({ ...db.config, enabled: false }), { mode: 0o600, flag: 'wx' });
        const controls = new Controls(snapshot).snapshot();
        await writeFile(join(root, 'controls.json'), JSON.stringify(controls), { mode: 0o600, flag: 'wx' });
        const manifest: Manifest = { version: 1, createdAt: now, files: {}, migrations: snapshot.all('SELECT * FROM schema_migrations ORDER BY version'), controlsDigest: canonicalHash(controls), runtime: Object.fromEntries(await Promise.all(['package.json', 'package-lock.json', 'dist/src/backup.js', 'dist/src/database.js', 'dist/src/ingestion.js', 'dist/src/http.js'].map(async (p) => [p, createHash('sha256').update(await readFile(new URL('../../' + p, import.meta.url))).digest('hex')]))), watermarks: snapshot.all<{
                experiment_id: string;
                run_id: string;
            }>('SELECT experiment_id,run_id FROM runs').map(r => ({ ...r, watermark: snapshot.watermark(r.experiment_id, r.run_id) })) };
        snapshot.db.pragma('wal_checkpoint(TRUNCATE)');
        snapshot.close();
        manifest.files = await hashes(root);
        await writeFile(join(root, 'manifest.json'), JSON.stringify(manifest), { mode: 0o600, flag: 'wx' });
        await syncTree(root);
        return { manifest, digest: canonicalHash(manifest) };
    }
    finally {
        if (snapshot.db.open)
            snapshot.close();
    }
}
/** Failed restore remains disabled and is never served. Retain its files for diagnosis. */
export async function restore(source: string, destination: string, expectedDigest: string, now: string): Promise<Config> {
    const root = resolve(source), target = resolve(destination);
    need(target !== root && !target.startsWith(root + '/'));
    const manifest = parseJson(await readFile(join(root, 'manifest.json')), 16777216) as Manifest;
    need(manifest.version === 1 && canonicalHash(manifest) === expectedDigest, 'CONFLICT');
    const actual = await hashes(root);
    delete actual['manifest.json'];
    need(canonicalHash(actual) === canonicalHash(manifest.files), 'CONFLICT');
    await mkdir(target, { mode: 0o700 });
    await writeFile(join(target, 'RESTORE_INCOMPLETE'), 'Startup blocked until verified restore fencing completes.\n', { mode: 0o600, flag: 'wx' });
    await syncTree(target);
    for (const name of await readdir(join(root, 'data')))
        await cp(join(root, 'data', name), join(target, name), { recursive: true, force: false, errorOnExist: true });
    const cfg = config({ ...parseJson(await readFile(join(root, 'config.json')), 16384) as Config, dataDir: target, enabled: false });
    const db = new Archive(cfg);
    try {
        db.fenceRestore(now);
        need(canonicalHash(db.all('SELECT * FROM schema_migrations ORDER BY version')) === canonicalHash(manifest.migrations), 'CONFLICT');
        await integrity(db);
    }
    finally {
        db.close();
    }
    await syncTree(target);
    await unlink(join(target, 'RESTORE_INCOMPLETE'));
    await syncTree(target);
    return cfg;
}
