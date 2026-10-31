// SPDX-License-Identifier: MIT
import type { State, Place, Point } from "./types";
import { point, distance, type World } from "./world";
import { interiorFor, interiorRoute } from "./interiors";
export type Navigation = {
  route: Point[];
  target: Point | null;
  leg: string;
  instruction: string;
};
export function navigationFor(
  s: State,
  world: World,
  destination: Place | null,
  indoorTarget: Point | null,
): Navigation {
  let route: Point[] = [],
    omitProjectionTurn = false,
    target: Point | null = null,
    leg = "Explore Richmond";
  if (s.interior) {
    const place = world.city.places.find((p) => p.id === s.interior!.place)!;
    const layout = interiorFor(place);
    target = indoorTarget ?? layout.exit;
    route = interiorRoute(point(s.player), target, layout);
    leg =
      distance(target, layout.exit) < 1 ? "Walk to the exit" : "Walk inside";
  } else if (
    s.locomotion === "walk" &&
    (!destination || distance(point(s.car), destination.parking) > 40)
  ) {
    target = point(world.exit(s.car, s.airfield) ?? s.car);
    if (distance(point(s.player), point(s.car)) > 4) {
      if (world.clear(point(s.player), target, s.player.y, s.airfield))
        route = [point(s.player), target];
      else {
        const near = world.nearest(point(s.car));
        route = near
          ? world.route(
              point(s.player),
              near.segment.road.nodes[near.segment.index],
              true,
            )
          : [];
        if (
          route.length &&
          world.clear(route.at(-1)!, target, s.car.y, s.airfield)
        )
          route.push(target);
      }
    }
    leg = "Return to your parked car";
  } else if (destination) {
    if (s.locomotion === "drive") {
      target = destination.parking;
      route =
        distance(point(s.car), target) < 8
          ? [point(s.car), target]
          : world.route(point(s.car), destination.roadNode);
      // The graph starts with car -> nearest road projection. This is a
      // positioning segment, not a junction; keep it on the map, not in turn cues.
      omitProjectionTurn =
        route.length > 2 && distance(route[0], route[1]) > 0.05;
      if (route.length) route.push(target);
      leg = "Drive to a stopping place";
    } else {
      target = destination.entrance;
      route = world.entranceRoute(s.player, destination, s.airfield);
      leg = "Walk to the entrance / meeting point";
    }
  }
  route = route.filter((p, i, a) => !i || distance(p, a[i - 1]) > 0.05);
  return {
    route,
    target,
    leg,
    instruction:
      s.locomotion === "drive"
        ? advanceTurn(omitProjectionTurn ? route.slice(1) : route)
        : leg,
  };
}
export function advanceTurn(route: Point[]) {
  let ahead = 0;
  for (let i = 1; i < route.length - 1; i++) {
    ahead += distance(route[i - 1], route[i]);
    const a = Math.atan2(
      route[i][0] - route[i - 1][0],
      route[i][1] - route[i - 1][1],
    );
    const b = Math.atan2(
      route[i + 1][0] - route[i][0],
      route[i + 1][1] - route[i][1],
    );
    const turn = Math.atan2(Math.sin(b - a), Math.cos(b - a));
    if (Math.abs(turn) > 0.55)
      return `${ahead < 12 ? "Turn" : `In ${Math.round(ahead / 5) * 5} m, turn`} ${turn > 0 ? "left" : "right"}${Math.abs(turn) > 2.5 ? " to turn around" : ""}`;
    if (ahead > 500) break;
  }
  return route.length > 1
    ? "Continue to the marked stopping place"
    : "Park, stop, then F to leave your car";
}
