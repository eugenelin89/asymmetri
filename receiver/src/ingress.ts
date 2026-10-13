import { connect, createServer, isIP, type Socket } from 'node:net';
import { requireContract as need } from './schema.js';

export interface IngressConfig {
  enabled: boolean;
  port: number;
  websitePort: number;
  investmentPort: number;
  askPort: number;
}
export function ingressConfig(input: unknown): IngressConfig {
  need(input !== null && typeof input === 'object' && !Array.isArray(input));
  const value = input as Record<string,unknown>;
  need(Object.keys(value).sort().join(',') === 'askPort,enabled,investmentPort,port,websitePort' && typeof value.enabled === 'boolean');
  for (const name of ['port','websitePort','investmentPort','askPort']) need(Number.isInteger(value[name]) && Number(value[name]) >= (name === 'port' ? 0 : 1) && Number(value[name]) <= 65535);
  const config = value as unknown as IngressConfig;
  need(new Set([config.websitePort,config.investmentPort,config.askPort]).size === 3 && ![config.websitePort,config.investmentPort,config.askPort].includes(config.port));
  return config;
}

/** Post-TLS loopback router. Inspect only PROXY v1 and the first request line.
 * Signed HTTP bytes are never reconstructed, retried, or transferred across connections.
 */
export async function createIngress(config: IngressConfig) {
  need(config.enabled, 'UNAVAILABLE');
  const sockets = new Set<Socket>(); let apiConnections = 0;
  const server = createServer(client => {
    if (sockets.size >= 256) { client.destroy(); return; }
    sockets.add(client);
    let buffer: Buffer = Buffer.alloc(0), proxy: Buffer | null = null, upstream: Socket | null = null;
    let routed = false, api = false, finished = false;
    const deadline = setTimeout(() => client.destroy(), 5000); deadline.unref();
    let duration: NodeJS.Timeout | undefined;
    const reject = () => {
      if (finished) return; finished = true;
      client.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nCache-Control: private, no-store\r\nContent-Length: 0\r\n\r\n');
    };
    client.on('error', () => client.destroy());
    client.on('close', () => {
      clearTimeout(deadline); if (duration) clearTimeout(duration);
      upstream?.destroy(); sockets.delete(client); if (api) apiConnections--;
    });
    client.setTimeout(15000, () => client.destroy());
    const inspect = (chunk: Buffer) => {
      if (routed || finished) return;
      buffer = Buffer.concat([buffer,chunk]);
      if (!proxy) {
        const end = buffer.indexOf('\r\n');
        if (end < 0) { if (buffer.length > 107) reject(); return; }
        if (end > 105) { reject(); return; }
        const line = buffer.subarray(0,end).toString('latin1');
        const match = /^PROXY (TCP4|TCP6) ([^ ]+) ([^ ]+) ([0-9]{1,5}) ([0-9]{1,5})$/.exec(line);
        if (!match || ![match[2],match[3]].every(address => isIP(address!) === (match[1] === 'TCP4' ? 4 : 6)) ||
            ![match[4],match[5]].every(port => Number(port) >= 1 && Number(port) <= 65535)) { reject(); return; }
        proxy = buffer.subarray(0,end+2); buffer = buffer.subarray(end+2);
      }
      const end = buffer.indexOf('\r\n');
      if (end < 0) { if (buffer.length > 4096) reject(); return; }
      if (end > 4096) { reject(); return; }
      const line = buffer.subarray(0,end).toString('latin1');
      const match = /^([A-Z]+) (\/[^\x00-\x20\x7f]*) HTTP\/1\.[01]$/.exec(line);
      if (!match) { reject(); return; }
      const target = match[2]!;
      const kind = /^\/api\/experiments\/v1(?:[/?]|$)/.test(target) ? 'investment' :
        /^\/api\/ask\/v1(?:[/?]|$)/.test(target) ? 'ask' : target.startsWith('/api/') ? null : 'website';
      if (!kind) { reject(); return; }
      if (kind !== 'website' && apiConnections >= 32) { reject(); return; }
      api = kind !== 'website'; if (api) apiConnections++;
      routed = true; clearTimeout(deadline); client.pause(); client.off('data',inspect);
      duration = setTimeout(() => client.destroy(), api ? 30000 : 60000); duration.unref();
      const port = kind === 'investment' ? config.investmentPort : kind === 'ask' ? config.askPort : config.websitePort;
      upstream = connect({host:'127.0.0.1',port});
      const pending = upstream, timeout = setTimeout(() => pending.destroy(),2000); timeout.unref();
      pending.on('connect', () => {
        clearTimeout(timeout);
        // Only the ordinary Nginx listener receives the already-validated client-IP preamble.
        // APIs receive exactly the original HTTP bytes and retain their conservative peer cap.
        if (kind === 'website') pending.write(proxy!);
        pending.write(buffer); buffer = Buffer.alloc(0);
        client.pipe(pending); pending.pipe(client); client.resume();
      });
      pending.on('error', () => client.destroy());
      pending.on('close', () => { clearTimeout(timeout); if (!pending.readableEnded) client.destroy(); });
    };
    client.on('data',inspect);
  });
  await new Promise<void>((resolve,reject) => {server.once('error',reject);server.listen(config.port,'127.0.0.1',()=>{server.off('error',reject);resolve();});});
  return {server,async close(){for(const socket of sockets)socket.destroy();await new Promise<void>(resolve=>server.close(()=>resolve()));}};
}
