/** Local-only visual review. This file is not imported by either production build. */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const reviewRoot = join(root, 'exploration');
const origin = 'http://127.0.0.1:4314';
const themes = ['cobalt', 'teal', 'signal'];
const servers = [];
let app;
let shuttingDown = false;

function stop(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const server of servers) server.closeAllConnections();
  for (const server of servers) server.close();
  app?.kill('SIGTERM');
  process.exitCode = code;
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());

function localServer(port, handler) {
  const server = createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Robots-Tag', 'noindex, nofollow');
    const host = request.headers.host?.split(':')[0];
    if (!['127.0.0.1', 'localhost'].includes(host)) {
      response.writeHead(403).end('Local review only.');
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    try {
      await handler(request, response);
    } catch (error) {
      console.error(error.message);
      if (!response.headersSent) response.writeHead(502);
      response.end('Local review unavailable. Check the terminal.');
    }
  });
  servers.push(server);
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
}

async function proxy(theme, request, response) {
  const url = new URL(request.url, origin);
  if (url.pathname === '/__exploration/theme.css') {
    const sheets = await Promise.all(['shared', theme].map((name) => readFile(join(reviewRoot, 'themes', `${name}.css`), 'utf8')));
    response.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
    response.end(sheets.join('\n'));
    return;
  }
  // Pin every request to the one local upstream, including protocol-relative paths.
  const target = new URL(url.pathname + url.search, origin);
  target.host = '127.0.0.1:4314';
  const headers = {};
  for (const name of ['accept', 'rsc', 'next-router-state-tree', 'next-router-prefetch', 'next-url']) {
    if (request.headers[name]) headers[name] = request.headers[name];
  }
  const upstream = await fetch(target, { headers, redirect: 'manual', signal: AbortSignal.timeout(30000) });
  const type = upstream.headers.get('content-type') ?? 'application/octet-stream';
  response.statusCode = upstream.status;
  response.setHeader('Content-Type', type);
  const location = upstream.headers.get('location');
  if (location) {
    const next = new URL(location, origin);
    response.setHeader('Location', next.origin === origin ? next.pathname + next.search + next.hash : location);
  }
  if (request.method === 'HEAD') { response.end(); return; }
  if (type.includes('text/html')) {
    let html = await upstream.text();
    // Capture mode loads all local images before a full-page screenshot.
    // Normal live review retains the baseline's lazy-loading behavior.
    if (url.searchParams.get('capture') === '1') {
      html = html.replace('</body>', `<script>
        const loadImages = () => document.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager'; });
        new MutationObserver(loadImages).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['loading'] });
        loadImages();
      </script></body>`);
    }
    response.end(html.replace('</head>', '<link rel="stylesheet" href="/__exploration/theme.css"/></head>'));
  } else {
    response.end(Buffer.from(await upstream.arrayBuffer()));
  }
}

try {
  await readFile(join(root, '.next/BUILD_ID'));
  await localServer(4310, async (request, response) => {
    const path = new URL(request.url, origin).pathname;
    const uiFiles = { '/': ['index.html', 'text/html'], '/comparison.css': ['comparison.css', 'text/css'], '/comparison.js': ['comparison.js', 'text/javascript'] };
    if (uiFiles[path]) {
      const [file, type] = uiFiles[path];
      response.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` });
      response.end(await readFile(join(reviewRoot, file)));
    } else if (/^\/captures\/(baseline|cobalt|teal|signal)-(home|sports|labs|motion|botsquad)-(desktop|mobile|full)\.jpg$/.test(path)) {
      try {
        const image = await readFile(join(root, 'docs/previews/dark-themes', path.split('/').at(-1)));
        response.writeHead(200, { 'Content-Type': 'image/jpeg' });
        response.end(image);
      } catch {
        response.writeHead(404).end('Capture not created yet.');
      }
    } else { response.writeHead(404).end('Not found.'); }
  });
  for (const [index, theme] of themes.entries()) {
    await localServer(4311 + index, (request, response) => proxy(theme, request, response));
  }
  app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '4314'], {
    cwd: root, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  });
  app.on('error', (error) => { console.error(error.message); stop(1); });
  app.on('exit', (code) => { if (!shuttingDown) stop(code || 1); });
  console.log('LOCAL EXPERIMENT ONLY — no deployment or visitor storage.');
  console.log('Comparison: http://127.0.0.1:4310');
  themes.forEach((theme, index) => console.log(`${theme}: http://127.0.0.1:${4311 + index}`));
  console.log('Unmodified baseline: http://127.0.0.1:4314');
} catch (error) {
  console.error(`${error.message}\nRun npm run build:next first. Ports 4310–4314 must be free.`);
  stop(1);
}
