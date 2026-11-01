import type { Pose, Settings } from "./types";

/** Opt-in observations for the local benchmark, never visitor analytics. */
export type FrameObservation = {
  frameMs: number;
  updateMs: number;
  renderSubmitMs: number;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
};
export type CampusDiagnostics = {
  initialPose: Pose;
  settings: Settings;
  onFrame: (frame: FrameObservation) => void;
};

export function distribution(values: readonly number[]) {
  if (!values.length || values.some((v) => !Number.isFinite(v) || v < 0))
    throw new Error("Expected nonempty finite, nonnegative samples.");
  const sorted = [...values].sort((a, b) => a - b);
  const percentile = (p: number) => sorted[Math.max(0, Math.ceil(p * sorted.length) - 1)];
  return {
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    p50: percentile(0.5), p95: percentile(0.95), p99: percentile(0.99),
    max: sorted[sorted.length - 1],
  };
}

/** Bounded sampling: long frames count in full; hidden/changed runs are invalid. */
export function createFrameSample(warmupMs = 5000, durationMs = 30000) {
  if (![warmupMs, durationMs].every(Number.isFinite) || warmupMs < 0 || durationMs <= 0 || durationMs > 120000)
    throw new Error("Invalid benchmark duration.");
  const frames: FrameObservation[] = [];
  let warmup = 0, sampled = 0, invalid: string | null = null;
  return {
    invalidate(reason: string) { invalid ||= reason; },
    invalidReason() { return invalid; },
    push(frame: FrameObservation) {
      if (invalid || sampled >= durationMs) return false;
      if (Object.values(frame).some((v) => !Number.isFinite(v) || v < 0) || frame.frameMs <= 0) {
        invalid = "Invalid frame observation";
        return false;
      }
      // Drop the entire boundary frame so warmup and measurement never overlap.
      if (warmup < warmupMs) { warmup += frame.frameMs; return false; }
      if (frames.length >= 72000) { invalid = "Sample capacity exceeded"; return false; }
      frames.push({ ...frame });
      sampled += frame.frameMs;
      return sampled >= durationMs;
    },
    result() {
      const reason = invalid || (sampled < durationMs ? "Incomplete sample" : null);
      if (reason) return { valid: false as const, reason, frameCount: frames.length, sampledMs: sampled };
      const metric = (key: keyof FrameObservation) => distribution(frames.map((f) => f[key]));
      return {
        valid: true as const, frameCount: frames.length, sampledMs: sampled,
        warmupMs: warmup, fps: frames.length * 1000 / sampled,
        frameMs: metric("frameMs"), updateMs: metric("updateMs"),
        renderSubmitMs: metric("renderSubmitMs"), calls: metric("calls"),
        triangles: metric("triangles"), geometries: metric("geometries"),
        textures: metric("textures"), programs: metric("programs"),
        over16_67Ms: frames.filter((f) => f.frameMs > 1000 / 60).length,
        over33_33Ms: frames.filter((f) => f.frameMs > 1000 / 30).length,
        over50Ms: frames.filter((f) => f.frameMs > 50).length,
        // Retain raw intervals so aggregate results can be independently checked.
        frameIntervalsMs: frames.map((f) => f.frameMs),
      };
    },
  };
}
