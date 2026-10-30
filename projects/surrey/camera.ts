// SPDX-License-Identifier: MIT
// Renderer-independent orbit/pan mathematics, following Vancouver's bounded exploration model.
import type { City, Point } from "./types";
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
export function createAerial(bounds: City["bounds"], player: Point) {
  const state = { target: [...player] as Point, yaw: 0.55, pitch: 0.8, distance: 490, follow: true };
  function focus(p: Point, follow = true) {
    state.target = [clamp(p[0], bounds[0], bounds[2]), clamp(p[1], bounds[1], bounds[3])];
    state.follow = follow;
  }
  function pan(right: number, forward: number) {
    focus([state.target[0] + Math.cos(state.yaw) * right - Math.sin(state.yaw) * forward,
      state.target[1] - Math.sin(state.yaw) * right - Math.cos(state.yaw) * forward], false);
  }
  function orbit(dx: number, dy: number) {
    state.yaw = (state.yaw - dx * .006) % (Math.PI * 2);
    state.pitch = clamp(state.pitch + dy * .004, .30, 1.42);
  }
  function zoom(delta: number) { state.distance = clamp(state.distance * Math.exp(clamp(delta, -500, 500) * .0015), 65, 1700); }
  function pose() {
    const horizontal = Math.cos(state.pitch) * state.distance;
    return { position: [state.target[0] + Math.sin(state.yaw) * horizontal, Math.sin(state.pitch) * state.distance + 12,
      state.target[1] + Math.cos(state.yaw) * horizontal] as [number, number, number], target: [state.target[0], 8, state.target[1]] as [number, number, number] };
  }
  return { state, focus, pan, orbit, zoom, pose };
}
