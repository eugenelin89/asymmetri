import { readFileSync, realpathSync } from 'node:fs';
import { relative, sep } from 'node:path';
import type { AskLimits, AskRoster } from '../../vendor/investment/v1/types.js';
import { config as archiveConfig } from '../config.js';
import { parseJson, requireContract as need, validate } from '../schema.js';

export interface AskConfig {
  enabled: boolean;
  admissionEnabled: boolean;
  claimsEnabled: boolean;
  deliveryEnabled: boolean;
  dataDir: string;
  publicArchiveDir: string;
  host: '127.0.0.1';
  port: number;
  authority: string;
  origin: string;
  serviceId: string;
  privacyNoticeVersion: string;
  limits: AskLimits;
  roster: AskRoster;
  archiveOrigin: string | null;
  archiveAuthority: string | null;
}

/** Configuration alone cannot grant admission: current authority and controls are also required. */
export const askAdmissionConfigured = (config: AskConfig): boolean =>
  config.admissionEnabled && config.claimsEnabled && config.deliveryEnabled;

export function askConfig(input: unknown): AskConfig {
  need(input !== null && typeof input === 'object' && !Array.isArray(input));
  const value = input as Record<string, unknown>;
  const fields = ['enabled', 'admissionEnabled', 'claimsEnabled', 'deliveryEnabled', 'dataDir',
    'publicArchiveDir', 'host', 'port', 'authority', 'origin', 'serviceId', 'privacyNoticeVersion',
    'limits', 'roster', 'archiveOrigin', 'archiveAuthority'];
  need(Object.keys(value).every(key => fields.includes(key)));
  const base = archiveConfig({ enabled: value.enabled, dataDir: value.dataDir, host: value.host,
    port: value.port ?? 3102, authority: value.authority });
  need(typeof value.publicArchiveDir === 'string');
  const publicArchiveDir = realpathSync(value.publicArchiveDir);
  const separate = (from: string, to: string) => {
    const path = relative(from, to); return path === '..' || path.startsWith('..' + sep);
  };
  // Archive backup recursively copies its tree. Neither store may contain the other.
  need(separate(base.dataDir, publicArchiveDir) && separate(publicArchiveDir, base.dataDir));
  need(typeof value.origin === 'string');
  const origin = new URL(value.origin);
  need(origin.protocol === 'https:' && origin.origin === value.origin && origin.host === base.authority);
  const limits = validate<AskLimits>('AskLimits', value.limits);
  need(limits.dutyCycleBps <= 2500);
  need(limits.monetaryEnforcement !== 'verified_cap' || limits.dailyBudgetUsd !== null && Number(limits.dailyBudgetUsd) > 0);
  const serviceId = validate<string>('Id', value.serviceId);
  const privacyNoticeVersion = validate<string>('Id', value.privacyNoticeVersion);
  const roster = validate<AskRoster>('AskRoster', value.roster);
  need(roster.serviceId === serviceId && new Set(roster.workers.map(row => row.worker.workerId)).size === roster.workers.length);
  const flag = (name: string) => { need(value[name] === undefined || typeof value[name] === 'boolean'); return value[name] === true; };
  const admissionEnabled = flag('admissionEnabled'), claimsEnabled = flag('claimsEnabled'), deliveryEnabled = flag('deliveryEnabled');
  if (admissionEnabled || claimsEnabled || deliveryEnabled) {
    need(limits.configurationStatus === 'owner_approved' && limits.approvalRecordId !== null && roster.workers.length > 0);
  }
  const archiveOrigin = value.archiveOrigin ?? null, archiveAuthority = value.archiveAuthority ?? null;
  need((archiveOrigin === null) === (archiveAuthority === null));
  if (archiveOrigin !== null) {
    need(typeof archiveOrigin === 'string' && typeof archiveAuthority === 'string');
    const url = new URL(archiveOrigin);
    need(url.protocol === 'http:' && url.hostname === '127.0.0.1' && url.origin === archiveOrigin);
    need(/^[a-z0-9.-]+(?::[0-9]{1,5})?$/.test(archiveAuthority));
  }
  return { enabled: base.enabled, admissionEnabled, claimsEnabled, deliveryEnabled,
    dataDir: base.dataDir, publicArchiveDir, host: base.host, port: base.port,
    authority: base.authority, origin: origin.origin, serviceId, privacyNoticeVersion, limits, roster,
    archiveOrigin: archiveOrigin as string | null, archiveAuthority: archiveAuthority as string | null };
}

export const loadAskConfig = (path: string): AskConfig => askConfig(parseJson(readFileSync(path), 65536));
