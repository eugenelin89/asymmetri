// SPDX-License-Identifier: MIT
// Explicit, development-only initial fixtures. No mid-journey state controls.
import { initialState } from "./simulation";
import { createWorld } from "./world";
import type { City, State } from "./types";

export const scenarios = [
  ["core", "A · City-centre delivery"],
  ["mall", "B · Richmond Centre visit"],
  ["terminal", "C · Terminal Takeout"],
  ["office", "D · Airport Lunch Run"],
  ["airfield", "E · Office to airfield"],
  ["regional", "F · City centre to Terra Nova"],
  ["clear-road", "Diagnostic · Recorded clear-road pose"],
] as const;

export function scenarioState(city: City, id: string): State {
  const s = initialState(city),
    world = createWorld(city);
  const start = {
    mall: "richmond-centre",
    terminal: "alexandra",
    office: "yvr",
    airfield: "airport-office",
  }[id];
  if (start) {
    const place = city.places.find((p) => p.id === start);
    if (!place) throw Error("Unknown scenario place: " + start);
    Object.assign(s.car, world.poseNear(place.parking));
    s.player = world.exit(s.car, id === "airfield") ?? { ...s.car };
  }
  if (id === "clear-road") {
    Object.assign(s.car, { x: -1319.23, z: -1495.8, y: 0, yaw: 5.902 });
    s.player = { ...s.car };
    s.locomotion = "drive";
  }
  s.checkpoint = { ...s.player };
  s.airfield = id === "airfield";
  s.camera = "top";
  s.settings = {
    ...s.settings,
    gentle: true,
    lite: true,
    density: 1,
    reducedMotion: true,
  };
  return s;
}
