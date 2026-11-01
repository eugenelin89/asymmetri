import test from "node:test";
import assert from "node:assert/strict";
import "./test-loader.mjs";
const { distribution, createFrameSample } = await import("./performance.ts");
const frame = (frameMs) => ({ frameMs, updateMs: 3, renderSubmitMs: 4, calls: 20, triangles: 500, geometries: 40, textures: 5, programs: 2 });

test("percentiles use nearest rank and do not mutate samples", () => {
  const values = [100, 10, 20, 30];
  assert.deepEqual(distribution(values), { mean: 40, p50: 20, p95: 100, p99: 100, max: 100 });
  assert.deepEqual(values, [100, 10, 20, 30]);
  assert.throws(() => distribution([]));
  assert.throws(() => distribution([NaN]));
});
test("warmup is excluded and slow frames are measured without the physics clamp", () => {
  const sample = createFrameSample(100, 1000);
  sample.push(frame(120));
  sample.push(frame(10));
  assert.equal(sample.push(frame(990)), true);
  const result = sample.result();
  assert.equal(result.valid, true);
  assert.equal(result.fps, 2);
  assert.equal(result.frameMs.max, 990);
  assert.equal(result.over50Ms, 1);
  assert.deepEqual(result.frameIntervalsMs, [10, 990]);
  sample.push(frame(500));
  assert.equal(sample.result().frameCount, 2);
});
test("incomplete, hidden, resized and malformed samples cannot pass", () => {
  assert.equal(createFrameSample().result().valid, false);
  for (const reason of ["Page hidden", "Viewport changed", "Graphics context lost"]) {
    const sample = createFrameSample(0, 10);
    sample.push(frame(10));
    sample.invalidate(reason);
    assert.equal(sample.result().valid, false);
    assert.equal(sample.result().reason, reason);
  }
  for (const ms of [NaN, Infinity, -1, 0]) {
    const sample = createFrameSample(0, 10);
    sample.push(frame(ms));
    assert.equal(sample.result().valid, false);
  }
  assert.throws(() => createFrameSample(0, 0));
  assert.throws(() => createFrameSample(0, 120001));
});
