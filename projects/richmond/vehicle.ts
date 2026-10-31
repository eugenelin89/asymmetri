// SPDX-License-Identifier: MIT — checked wrapper around the unchanged shared integrator.
import { stepCar } from "../vancouver/physics";
import { contactAllows, type ContactActor } from "./collision";
import type { State, Input, Pose } from "./types";
import type { World } from "./world";
export function driveCar(
  car: State["car"],
  held: Set<Input>,
  delta: number,
  world: World,
  airfield: boolean,
  actors: ContactActor[],
) {
  let next = { ...car },
    contact = "none";
  const count = Math.max(1, Math.ceil(Math.min(0.1, Math.max(0, delta)) * 120)),
    dt = Math.min(0.1, Math.max(0, delta)) / count;
  for (let i = 0; i < count; i++) {
    const candidate = {
      ...next,
      ...stepCar(
        next,
        Number(held.has("forward")) - Number(held.has("back")),
        Number(held.has("left")) - Number(held.has("right")),
        held.has("brake"),
        dt,
        (p) => world.support(p, next.y, airfield) !== null,
      ),
    };
    candidate.y =
      world.support([candidate.x, candidate.z], next.y, airfield) ?? next.y;
    const middle: Pose = {
      x: (next.x + candidate.x) / 2,
      z: (next.z + candidate.z) / 2,
      y: (next.y + candidate.y) / 2,
      yaw: (next.yaw + candidate.yaw) / 2,
    };
    if (
      candidate.blocked ||
      !world.fits(middle, airfield) ||
      !world.fits(candidate, airfield)
    ) {
      contact =
        world.rejection(candidate, airfield) ?? "surface/elevation sweep";
      next = { ...next, speed: 0, steer: candidate.steer, blocked: true };
      break;
    }
    const actor = actors.find(
      (a) =>
        Math.hypot(a.x - next.x, a.z - next.z) < 9 &&
        (!contactAllows(next, middle, a) || !contactAllows(next, candidate, a)),
    );
    if (actor) {
      contact = `${actor.vehicle ? "traffic" : "person"}:${actor.id ?? "fixture"}`;
      next = { ...next, speed: 0, steer: candidate.steer, blocked: true };
      break;
    }
    next = candidate;
  }
  return { car: next, contact };
}
