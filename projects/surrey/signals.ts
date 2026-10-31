// SPDX-License-Identifier: MIT — fictional shared phases, never real Surrey timing.
export type SignalPhase = "green" | "yellow" | "red";
export function signalState(seconds: number): { phase: SignalPhase; remaining: number; pedestrians: boolean } {
  const t = ((seconds % 68) + 68) % 68;
  if (t < 32) return { phase: "green", remaining: 32 - t, pedestrians: false };
  if (t < 36) return { phase: "yellow", remaining: 36 - t, pedestrians: false };
  return { phase: "red", remaining: 68 - t, pedestrians: true };
}
