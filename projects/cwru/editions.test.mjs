import './test-loader.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { campusDate, scheduledEdition, persistentChoice } = await import('../campus-atmosphere/calendar.ts');

test('Cleveland switches at its local midnight, even on a device in another zone', () => {
  const edition = instant => scheduledEdition(campusDate('cwru',new Date(instant)).date);
  assert.equal(edition('2026-10-24T03:59:59Z'),'regular');
  assert.equal(edition('2026-10-24T04:00:00Z'),'halloween');
  assert.equal(edition('2026-11-08T04:59:59Z'),'halloween');
  assert.equal(edition('2026-11-08T05:00:00Z'),'christmas');
  assert.equal(edition('2027-01-01T04:59:59Z'),'christmas');
  assert.equal(edition('2027-01-01T05:00:00Z'),'regular');
  assert.equal(edition('2027-12-25T20:00:00Z'),'regular');
});

test('a pre-Christmas value cannot suppress Automatic Christmas or resurrect a replay', () => {
  for (const old of ['regular','halloween','christmas','{"version":1,"choice":"regular"}','{"year":2026,"enabled":false}']) {
    assert.equal(persistentChoice(old,'2026-12-10'),'automatic');
  }
  assert.equal(persistentChoice('regular-through-2026','2026-12-31'),'regular');
  assert.equal(persistentChoice('regular-through-2026','2027-01-01'),'automatic');
});
