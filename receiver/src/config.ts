import { realpathSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseJson, requireContract as need } from './schema.js';
import { readFileSync } from 'node:fs';

export interface Config {
  enabled: boolean;
  dataDir: string;
  host: '127.0.0.1';
  port: number;
  authority: string;
  maxArchiveBytes: number;
  maxRunBytes: number;
  maxContentBytes: number;
  minFreeBytes: number;
}
export function config(input: unknown): Config {
  need(input !== null && typeof input === 'object' && !Array.isArray(input));
  const v = input as Record<string, unknown>;
  need(Object.keys(v).every(k => ['enabled','dataDir','host','port','authority','maxArchiveBytes','maxRunBytes','maxContentBytes','minFreeBytes'].includes(k)));
  need(typeof v.enabled === 'boolean' && typeof v.dataDir === 'string' && isAbsolute(v.dataDir));
  // Resolve the real parent: symlink aliases cannot place runtime files in the checkout.
  const dir = realpathSync(v.dataDir);
  const checkout = realpathSync(fileURLToPath(new URL('../../../', import.meta.url)));
  const outside = relative(checkout, dir);
  need(outside === '..' || outside.startsWith('..' + sep));
  const stat = statSync(dir); need(stat.isDirectory() && (stat.mode & 0o077) === 0);
  need(v.host === undefined || v.host === '127.0.0.1');
  need(typeof v.authority === 'string' && /^[a-z0-9.-]+(?::[0-9]{1,5})?$/.test(v.authority));
  const number = (key: string, fallback: number, min: number, max: number): number => {
    const n = v[key] ?? fallback; need(typeof n === 'number' && Number.isSafeInteger(n) && n >= min && n <= max); return n;
  };
  return { enabled: v.enabled, dataDir: resolve(dir), host: '127.0.0.1', authority: v.authority,
    port: number('port', 3101, 0, 65535), maxArchiveBytes: number('maxArchiveBytes', 67108864, 4194304, 268435456),
    maxRunBytes: number('maxRunBytes', 16777216, 1048576, 16777216),
    maxContentBytes: number('maxContentBytes', 268435456, 4194304, 1073741824),
    minFreeBytes: number('minFreeBytes', 268435456, 1048576, 10737418240) };
}
export function loadConfig(path: string): Config { return config(parseJson(readFileSync(path), 16384)); }
