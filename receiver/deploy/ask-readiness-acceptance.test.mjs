/** Explicit disposable host acceptance; never reads production config or stores.
 * Run under the isolated service profile documented in ASK-04-READINESS.md.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';

const here = fileURLToPath(import.meta.url);
const runtime = resolve(process.env.ASK_REHEARSAL_RUNTIME ?? join(dirname(here), '..'));
const moduleAt = relative => pathToFileURL(join(runtime, 'dist', relative)).href;

if (process.argv[2] === 'backup-child') {
  // Fault injection only in this disposable child. Pause at a durable-copy phase
  // and let the parent send an actual SIGKILL; production source is untouched.
  const fs = await import('node:fs/promises');
  const { syncBuiltinESMExports } = await import('node:module');
  const original = fs.default.writeFile;
  const [configFile, destination, phase, now] = process.argv.slice(3);
  fs.default.writeFile = async (path, ...args) => {
    const result = await original(path, ...args);
    if (path === join(destination, phase)) {
      process.send({ phase });
      await new Promise(() => {});
    }
    return result;
  };
  syncBuiltinESMExports();
  const { AskStore } = await import(moduleAt('src/ask/database.js'));
  const { backupAsk } = await import(moduleAt('src/ask/recovery.js'));
  const config = JSON.parse(await readFile(configFile, 'utf8'));
  const store = new AskStore(config);
  try { await backupAsk(store, destination, Number(now)); }
  finally { store.close(); }
} else {
  const { askHarness, askPrefix } = await import(moduleAt('test/ask-helpers.js'));
  const { examples } = await import(moduleAt('test/helpers.js'));
  const { restoreAsk } = await import(moduleAt('src/ask/recovery.js'));
  const { canonicalHash } = await import(moduleAt('src/schema.js'));

  if (process.env.ASK_REHEARSAL_CONFINED === '1') {
    test('host rehearsal excludes live stores and forbids process core memory', async () => {
      assert.equal(process.platform, 'linux');
      assert.equal((await readFile('/proc/self/coredump_filter', 'utf8')).trim(), '00000000');
      assert.match(await readFile('/proc/self/limits', 'utf8'), /Max core file size\s+0\s+0\s+bytes/);
      for (const path of ['/var/lib/asymmetri-ask/ask.sqlite', '/var/lib/asymmetri-investment/archive.sqlite']) {
        await assert.rejects(readFile(path));
      }
    });
  }

  test('actual killed recovery copies exclude private text and cannot restore', async t => {
    const h = await askHarness(t);
    const marker = 'SYNTHETIC-ASK-INTERRUPTED-BACKUP-PRIVATE-TEXT-20261013';
    await h.ready({ text: marker });
    const configFile = join(h.root, 'child-config.json');
    await writeFile(configFile, JSON.stringify(h.cfg), { mode: 0o600 });
    for (const phase of ['INCOMPLETE', 'manifest.json']) {
      const destination = join(h.root, 'interrupted-' + phase.replace('.', '-'));
      const child = fork(here, ['backup-child', configFile, destination, phase, String(h.now())],
        { execArgv: ['--max-old-space-size=96'], stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
          env: { ...process.env, ASK_REHEARSAL_RUNTIME: runtime } });
      let diagnostic = '';
      child.stderr.on('data', part => { diagnostic += part; });
      await new Promise((ok, fail) => {
        let reached = false;
        const timer = setTimeout(() => { child.kill('SIGKILL'); fail(new Error('Child phase deadline')); }, 30000);
        child.once('message', message => { reached = message.phase === phase; child.kill('SIGKILL'); });
        child.once('error', error => { clearTimeout(timer); fail(error); });
        child.once('exit', (_code, signal) => {
          clearTimeout(timer);
          if (reached && signal === 'SIGKILL') ok();
          else fail(new Error('Backup child did not reach ' + phase + ': ' + diagnostic));
        });
      });
      for (const name of await readdir(destination)) {
        assert.equal((await readFile(join(destination, name))).includes(Buffer.from(marker)), false, name);
      }
      const expectedDigest = phase === 'manifest.json'
        ? canonicalHash(JSON.parse(await readFile(join(destination, phase), 'utf8')))
        : '0'.repeat(64);
      // At the final phase the digest is valid: the incomplete marker itself
      // must block restoration, rather than an unrelated checksum mismatch.
      await assert.rejects(restoreAsk(destination, destination + '-restore', expectedDigest, h.now()),
        error => error.code === 'UNAVAILABLE');
      console.log(JSON.stringify({ fixture: 'interrupted_non_content_backup', phase, signal: 'SIGKILL', sentinelAbsent: true, restoreRejected: true }));
    }
  });

  test('bounded concurrent owned reads retain cancellation and control capacity', async t => {
    const h = await askHarness(t);
    const q = await h.ready();
    const answer = await h.send(h.signed('POST', `${askPrefix}/hq/questions/${q.admission.questionId}/answer`, q.delivery));
    assert.equal(answer.status, 200);
    const durations = [], statuses = {};
    // Twenty simulated views, four refreshes each, with six requests in flight.
    // Frozen fixture time deliberately puts all requests in one quota window.
    let sent = 0;
    while (sent < 80) {
      const count = Math.min(6, 80 - sent); sent += count;
      await Promise.all(Array.from({ length: count }, async () => {
        const start = performance.now();
        const response = await h.browser(q.session, 'GET', `${askPrefix}/conversations/${q.conversation.conversationId}`);
        durations.push(performance.now() - start);
        statuses[response.status] = (statuses[response.status] ?? 0) + 1;
        assert.equal(response.status, 200, response.raw);
      }));
    }
    let exhausted = false, probes = 0;
    for (; probes < 120; probes++) {
      const response = await h.request('GET', askPrefix + '/availability');
      if (response.status === 429) { exhausted = true; break; }
      assert.equal(response.status, 200);
    }
    assert.equal(exhausted, true);
    const cancelStart = performance.now();
    const cancelled = await h.browser(q.session, 'POST', `${askPrefix}/questions/${q.admission.questionId}/cancel`, examples.AskCancel);
    const cancelMs = performance.now() - cancelStart;
    assert.equal(cancelled.status, 200, cancelled.raw);
    assert.equal((await h.sync()).status, 200);
    durations.sort((a, b) => a - b);
    console.log(JSON.stringify({ fixture: 'concurrent_owned_reads', views: 20, requests: sent, concurrency: 6, statuses,
      latencyMs: { p50: durations[Math.floor(durations.length * .5)], p95: durations[Math.floor(durations.length * .95)], max: durations.at(-1) },
      ordinaryExhaustionObserved: true, exhaustionProbes: probes + 1, cancellationStatus: cancelled.status, cancellationMs: cancelMs,
      hqControlSyncStatus: 200, genuineModelCalls: 0 }));
  });
}
