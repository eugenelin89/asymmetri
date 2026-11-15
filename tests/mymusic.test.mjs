import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFolderUrl, parseFolderHtml, collectMusic } from '../lib/mymusic.ts';
import { fetchGoogle, limitedText } from '../lib/mymusic-google.ts';
const root = 'https://drive.google.com/drive/folders/root_folder_123';
const entry = (id, kind = 'audio') => ({ id, kind, name: id, url: `https://drive.google.com/drive/folders/${id}` });

test('accepts account-specific folder URLs and preserves resource keys; rejects arbitrary destinations', () => {
  assert.deepEqual(parseFolderUrl('https://drive.google.com/drive/u/3/folders/root_folder_123?resourcekey=0-key'), { id: 'root_folder_123', resourceKey: '0-key' });
  for (const url of ['https://evil.example/drive/folders/root_folder_123', 'http://drive.google.com/drive/folders/root_folder_123', 'https://drive.google.com@evil.example/drive/folders/root_folder_123', 'https://drive.google.com/file/d/root_folder_123/view', 'https://drive.google.com:8080/drive/folders/root_folder_123']) assert.throws(() => parseFolderUrl(url));
});

test('public embed parsing selects audio and folders, decodes names and retains resource keys', () => {
  const item = (link, name, icon = '') => `<div class="flip-entry" id="entry-example"><a href="${link}">${icon}<div class="flip-entry-title">${name}</div></a></div>`;
  const html = `<div class="flip-entries">${item(root + '?resourcekey=0-key&amp;usp=sharing', 'Album &amp; friends')}${item('https://drive.google.com/file/d/audio_file_123/view', 'Track &#49;.MP3')}${item('https://drive.google.com/file/d/audio_file_456/view', 'Recording', '<img alt="Audio"/>')}${item('https://drive.google.com/file/d/other_file_123/view', 'Cover.jpg')}${item('https://example.com/file/d/evil_file_123/view', 'No.mp3')}</div>`;
  const result = parseFolderHtml(html);
  assert.equal(result.length, 3);
  assert.equal(result[0].name, 'Album & friends');
  assert.equal(result[0].resourceKey, '0-key');
  assert.ok(result.some(x => x.name === 'Track 1.MP3'));
  assert.throws(() => parseFolderHtml('<html>Sign in</html>'));
  assert.throws(() => parseFolderHtml('<div class="flip-entries"><div class="flip-entry" broken>'));
  assert.deepEqual(parseFolderHtml('<div class="flip-entries"></div>'), []);
});

test('traversal reaches grandchildren, avoids cycles and duplicate audio, and reports unreadable children', async () => {
  const graph = {
    root_folder_123: [entry('child_folder_123', 'folder'), entry('bad_folder_123', 'folder'), entry('track_file_123')],
    child_folder_123: [entry('root_folder_123', 'folder'), entry('grand_folder_123', 'folder'), entry('track_file_123')],
    grand_folder_123: [entry('track_file_456')],
  };
  const seen = [];
  const result = await collectMusic(root, async url => {
    const { id } = parseFolderUrl(url); seen.push(id);
    if (!graph[id]) throw new Error('Unavailable');
    return graph[id];
  }, () => {}, new AbortController().signal);
  assert.equal(result.tracks.length, 2);
  assert.equal(result.tracks[1].path, 'child_folder_123 / grand_folder_123');
  assert.equal(result.skipped, 1);
  assert.equal(result.limited, false);
  assert.equal(seen.filter(id => id === 'root_folder_123').length, 1);
});

test('root failures and cancellation never masquerade as an empty queue', async () => {
  await assert.rejects(collectMusic(root, async () => { throw new Error('Private'); }, () => {}, new AbortController().signal), /Private/);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(collectMusic(root, async () => [], () => {}, controller.signal), { name: 'AbortError' });
});

test('Google transport rejects unsafe hosts and redirects, and bounds listing memory', async () => {
  await assert.rejects(fetchGoogle(new URL('https://example.com/')), /public download/);
  await assert.rejects(fetchGoogle(new URL('https://googleusercontent.com.evil.example/')), /public download/);
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/private' } });
    await assert.rejects(fetchGoogle(new URL('https://drive.google.com/')), /public download/);
  } finally { globalThis.fetch = original; }
  await assert.rejects(limitedText(new Response('12345'), 4), /too large/);
  assert.equal(await limitedText(new Response('1234'), 4), '1234');
});

import { playOrder, adjacentTrack } from '../lib/mymusic-playback.ts';

test('shuffle keeps the current track, includes every track once, and can restore normal order', () => {
  const shuffled = playOrder(5, true, 2, () => 0);
  assert.equal(shuffled[0], 2);
  assert.deepEqual([...shuffled].sort(), [0, 1, 2, 3, 4]);
  assert.deepEqual(playOrder(5, false, 2), [0, 1, 2, 3, 4]);
  assert.deepEqual(playOrder(0, true), []);
  assert.deepEqual(playOrder(1, true, 0), [0]);
});

test('queue navigation follows shuffled order and wraps only with repeat all', () => {
  const queue = [2, 0, 1];
  assert.equal(adjacentTrack(queue, 2, 1, false), 0);
  assert.equal(adjacentTrack(queue, 1, 1, false), null);
  assert.equal(adjacentTrack(queue, 1, 1, true), 2);
  assert.equal(adjacentTrack(queue, 2, -1, true), 1);
  assert.equal(adjacentTrack([0], 0, 1, true), 0);
});

test('repeat all skips unavailable tracks and stops if all tracks fail', () => {
  assert.equal(adjacentTrack([2, 0, 1], 1, 1, true, new Set([2, 1])), 0);
  assert.equal(adjacentTrack([2, 0, 1], 1, 1, true, new Set([2, 0, 1])), null);
  assert.equal(adjacentTrack([0], 0, 1, true, new Set([0])), null);
});
