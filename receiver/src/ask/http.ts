import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import type { Socket } from 'node:net';
import { rawHeaders } from '../auth.js';
import { ContractError, problem, requireContract as need, validate } from '../schema.js';
import type { SignedMessage } from '../signatures.js';
import type { AskAvailability } from '../../vendor/investment/v1/types.js';
import type { AskConfig } from './config.js';
import { AskStore } from './database.js';
import { AskLifecycle } from './lifecycle.js';
import { AskVisitors } from './visitors.js';
import { AskAuthority, type AskAuth } from './auth.js';
import { AskHq } from './hq.js';
import { contextVerifier, type ContextVerifier } from './context.js';

interface Operation { operationId: string; security: Record<string, unknown>[]; parameters?: {name:string;in:string}[] }
const api = JSON.parse(readFileSync(new URL('../../../vendor/investment/v1/openapi.json', import.meta.url), 'utf8')) as {paths:Record<string,Record<string,Operation>>};
const routes = Object.entries(api.paths).filter(([path]) => path.startsWith('/api/ask/v1/')).map(([path, methods]) => ({
  methods, names: [...path.matchAll(/\{([^}]+)\}/g)].map(match => match[1]!),
  pattern: new RegExp('^' + path.replace(/\{[^}]+\}/g, '([^/]+)') + '$'),
}));
const permissions: Record<string, AskAuth['permission']> = { claimAskQuestion: 'claim', renewAskClaim: 'claim',
  deliverAskStatus: 'status', deliverAskAnswer: 'answer', readAskAnswerReceipt: 'receipt', syncAskPrivacyControls: 'control_sync' };

async function readBody(req: IncomingMessage, headers: Map<string, string>, limit: number): Promise<Buffer> {
  const text = headers.get('content-length');
  need(text && /^[1-9][0-9]{0,6}$/.test(text), 'INVALID_REQUEST');
  const length = Number(text); need(length <= limit, 'TOO_LARGE');
  need(headers.get('content-type') === 'application/json', 'UNSUPPORTED_MEDIA');
  let size = 0; const chunks: Buffer[] = [];
  for await (const part of req) { const bytes = Buffer.from(part); size += bytes.length; need(size <= length && size <= limit, 'TOO_LARGE'); chunks.push(bytes); }
  need(req.complete && size === length); return Buffer.concat(chunks);
}

export async function createAsk(config: AskConfig, options: { now?: () => number; contextVisible?: ContextVerifier;
  log?: (entry: {requestId:string;code:string;status:number}) => void } = {}) {
  need(config.enabled && !existsSync(join(config.dataDir, 'RESTORE_INCOMPLETE')), 'UNAVAILABLE');
  const now = options.now ?? (() => Date.now() / 1000), store = new AskStore(config);
  const context = options.contextVisible ?? contextVerifier(config), visitors = new AskVisitors(store, now, context);
  const authority = new AskAuthority(store, now), hq = new AskHq(store, now, authority, context), lifecycle = new AskLifecycle(store);
  const usedSockets = new WeakSet<Socket>();
  let active = 0, ordinaryActive = 0, closing = false, connections = 0;
  function send(res: ServerResponse, status: number, value: unknown, headers: Record<string,string> = {}): void {
    const bytes = Buffer.from(JSON.stringify(value)); need(bytes.length <= (status >= 400 ? 8192 : 524288), 'TOO_LARGE');
    res.writeHead(status, { Connection: 'close', 'Content-Type': status >= 400 ? 'application/problem+json' : 'application/json',
      'Content-Length': String(bytes.length), 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; sandbox", ...headers }); res.end(bytes);
  }
  const server = createServer({ maxHeaderSize: 16384, requestTimeout: 15000, keepAliveTimeout: 1000 }, async (req, res) => {
    if (usedSockets.has(req.socket)) { req.socket.destroy(); return; }
    usedSockets.add(req.socket); res.shouldKeepAlive = false;
    const requestId = randomUUID(); let entered = false, ordinaryEntered = false;
    try {
      need(!closing && active < 8, 'RATE_LIMITED'); active++; entered = true;
      need(req.httpVersion === '1.1' && req.rawHeaders.length <= 128);
      lifecycle.cleanup(now());
      const network = store.network(req.socket.remoteAddress ?? 'unknown', now());
      // Absolute DoS ceiling; ordinary admission has a lower independent cap.
      store.atomic(() => { store.charge('http:global', 60, 2400, now()); store.charge('http:peer:' + network, 60, 1200, now()); });
      const headers = rawHeaders(req, config.authority), url = req.url ?? '';
      need(url.length <= 2048 && !url.includes('#'));
      const [path, queryString] = url.split('?');
      need(path && /^\/api\/ask\/v1\/[A-Za-z0-9_/-]+$/.test(path) && !path.includes('//'));
      const route = routes.find(value => value.pattern.test(path)); need(route, 'NOT_FOUND');
      const method = req.method ?? '', operation = route.methods[method.toLowerCase()];
      if (!operation) { const error = problem('INVALID_REQUEST', requestId); error.status = 405; send(res, 405, validate('Problem', error), {Allow:Object.keys(route.methods).map(value => value.toUpperCase()).join(', ')}); return; }
      const params = Object.fromEntries(route.names.map((name, index) => [name, route.pattern.exec(path)![index + 1]!]));
      Object.values(params).forEach(value => validate('Id', value));
      const signed = operation.security.some(value => 'httpSignature' in value);
      const visitorRoute = operation.security.some(value => 'visitorSession' in value);
      if (signed) need(!url.includes('?'), 'UNAUTHENTICATED');
      need(!queryString?.includes('?'));
      const query = new URLSearchParams(queryString);
      need(new Set(query.keys()).size === [...query.keys()].length);
      for (const [name, value] of query) {
        need(operation.parameters?.some(parameter => parameter.in === 'query' && parameter.name === name));
        if (name === 'after') validate('Id', value);
      }
      const control = ['cancelOwnAskQuestion', 'deleteOwnAskConversation', 'syncAskPrivacyControls', 'readAskAnswerReceipt'].includes(operation.operationId);
      if (!control) {
        need(ordinaryActive < 6, 'RATE_LIMITED'); ordinaryActive++; ordinaryEntered = true;
        store.atomic(() => store.charge('http:ordinary', 60, 120, now()));
      }
      let visitor;
      if (visitorRoute) visitor = visitors.authenticate(headers, method !== 'GET');
      if (operation.operationId === 'createAskSession') visitors.sameOrigin(headers, true);
      if (signed) authority.identify(headers, permissions[operation.operationId]!);
      let bytes: Buffer = Buffer.alloc(0);
      if (method === 'GET' || method === 'DELETE') need((!headers.has('content-length') || headers.get('content-length') === '0') && !headers.has('content-type') && !headers.has('content-digest'));
      else bytes = await readBody(req, headers, signed ? 262144 : config.limits.requestBytes);
      const id = method !== 'GET' ? validate<string>('Id', headers.get('idempotency-key')) : '';
      let auth: AskAuth | undefined;
      if (signed) auth = authority.authenticate({ method: method as SignedMessage['method'], authority: config.authority,
        path, headers: [...headers], body: bytes }, permissions[operation.operationId]!);
      if (control) store.atomic(() => store.charge('http:controls', 60, 180, now()));
      switch (operation.operationId) {
        case 'askAvailability': {
          const state: AskAvailability['state'] = store.meta().held || !config.admissionEnabled ? 'disabled' :
            !config.claimsEnabled || !config.deliveryEnabled || !authority.ready() ? 'paused' : 'available';
          send(res, 200, validate('AskAvailability', { schemaVersion: '1.0', serviceId: config.serviceId, state,
            retryAfterSeconds: state === 'available' ? null : 60, privacyNoticeVersion: config.privacyNoticeVersion })); break;
        }
        case 'readAskPublicRoster': send(res, 200, config.roster); break;
        case 'createAskSession': { const result = visitors.createSession(headers, bytes, id, network); send(res, 201, result.body, result.cookie ? {'Set-Cookie':result.cookie} : {}); break; }
        case 'createAskConversation': send(res, 201, visitors.createConversation(visitor!, bytes, id)); break;
        case 'submitAskQuestion': send(res, 202, await visitors.submit(visitor!, params.id!, bytes, id, network)); break;
        case 'readOwnAskConversation': send(res, 200, await visitors.read(visitor!, params.id!, query)); break;
        case 'cancelOwnAskQuestion': send(res, 200, visitors.cancel(visitor!, params.id!, bytes, id)); break;
        case 'deleteOwnAskConversation': send(res, 200, visitors.deleteConversation(visitor!, params.id!, bytes, id)); break;
        case 'claimAskQuestion': send(res, 200, hq.claim(auth!)); break;
        case 'renewAskClaim': send(res, 200, hq.renew(auth!, params.id!)); break;
        case 'deliverAskStatus': send(res, 200, await hq.status(auth!, params.id!)); break;
        case 'deliverAskAnswer': send(res, 200, await hq.answer(auth!, params.id!)); break;
        case 'readAskAnswerReceipt': send(res, 200, hq.receipt(auth!, params.answerId!)); break;
        case 'syncAskPrivacyControls': send(res, 200, hq.controls.sync(auth!)); break;
        default: need(false, 'NOT_FOUND');
      }
    } catch (error) {
      const sql = (error as {code?:string}).code;
      const code = error instanceof ContractError ? error.code : sql?.startsWith('SQLITE_CONSTRAINT') ? 'CONFLICT' : 'UNAVAILABLE';
      const value = problem(code, requestId); options.log?.({requestId, code, status:value.status});
      if (!res.headersSent && !res.destroyed) send(res, value.status, value);
      else res.destroy();
    } finally { if (entered) active--; if (ordinaryEntered) ordinaryActive--; }
  });
  server.maxHeadersCount = 0; server.maxRequestsPerSocket = 100; server.headersTimeout = 5000; server.setTimeout(15000);
  server.on('timeout', socket => socket.destroy());
  server.on('connection', socket => { if (++connections > 64) socket.destroy(); socket.once('close', () => connections--); });
  server.on('clientError', (_error, socket) => { usedSockets.add(socket as Socket); if (socket.writable) socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nCache-Control: private, no-store\r\nContent-Length: 0\r\n\r\n'); });
  for (const event of ['checkContinue', 'checkExpectation'] as const) server.on(event, (req, res) => { usedSockets.add(req.socket); send(res, 400, problem('INVALID_REQUEST', randomUUID())); });
  for (const event of ['upgrade', 'connect'] as const) server.on(event, (_req, socket) => { usedSockets.add(socket as Socket); socket.destroy(); });
  const timer = setInterval(() => { try { lifecycle.cleanup(now()); } catch { /* Held for operator diagnostics; no private exception logging. */ } }, 30000); timer.unref();
  try {
    await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(config.port, config.host, () => { server.off('error', reject); resolve(); }); });
  } catch (error) { clearInterval(timer); store.close(); throw error; }
  return { server, store, visitors, authority, hq, lifecycle, async close() { closing = true; clearInterval(timer); await new Promise<void>(resolve => server.close(() => resolve())); store.close(); } };
}
