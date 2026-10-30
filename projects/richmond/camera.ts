// SPDX-License-Identifier: MIT — camera is independent of movement/interior state.
import { clamp } from "./world";
import type { Point, State, City } from "./types";
export function createCamera(city: City) {
  const view = {
    yaw: Math.PI,
    pitch: 0.5,
    distance: 16,
    aerialDistance: 800,
    target: [0, 0] as Point,
    follow: true,
  };
  return {
    view,
    look(dx: number, dy: number) {
      view.yaw -= dx * 0.005;
      view.pitch = clamp(view.pitch + dy * 0.003, -0.85, 1.3);
    },
    zoom(d: number, aerial: boolean) {
      if (aerial)
        view.aerialDistance = clamp(
          view.aerialDistance * Math.exp(d * 0.0015),
          45,
          23000,
        );
      else view.distance = clamp(view.distance * Math.exp(d * 0.0015), 5, 160);
    },
    focus(p: Point) {
      view.target = [
        clamp(p[0], city.bounds[0], city.bounds[2]),
        clamp(p[1], city.bounds[1], city.bounds[3]),
      ];
      view.follow = false;
    },
    pan(dx: number, dz: number) {
      view.target[0] = clamp(
        view.target[0] + dx,
        city.bounds[0],
        city.bounds[2],
      );
      view.target[1] = clamp(
        view.target[1] + dz,
        city.bounds[1],
        city.bounds[3],
      );
    },
    pose(state: State) {
      const p = state.player;
      let target: [number, number, number] = [p.x, p.y + 1.6, p.z],
        position: [number, number, number];
      if (state.camera === "aerial") {
        const t = view.follow ? [p.x, p.z] : view.target,
          d = state.interior
            ? Math.min(200, view.aerialDistance)
            : view.aerialDistance,
          pitch = clamp(view.pitch, 0.35, 1.4);
        target = [t[0], 0, t[1]];
        position = [
          t[0] + Math.sin(view.yaw) * Math.cos(pitch) * d,
          Math.sin(pitch) * d,
          t[1] + Math.cos(view.yaw) * Math.cos(pitch) * d,
        ];
      } else if (state.camera === "top") {
        const yaw = state.settings.northUp ? 0 : p.yaw,
          d = state.interior
            ? Math.min(80, view.distance * 2.5)
            : view.distance * 4;
        position = [
          p.x - Math.sin(yaw) * 0.1,
          p.y + d,
          p.z + Math.cos(yaw) * 0.1,
        ];
        target = [p.x, p.y, p.z];
      } else if (state.camera === "first") {
        const yaw =
          state.locomotion === "drive" ? p.yaw + view.yaw - Math.PI : view.yaw;
        position = [
          p.x,
          p.y + (state.locomotion === "drive" ? 1.45 : 1.7),
          p.z,
        ];
        target = [
          p.x + Math.sin(yaw) * 10,
          position[1] + Math.sin(view.pitch - 0.5) * 8,
          p.z + Math.cos(yaw) * 10,
        ];
      } else {
        const yaw = state.locomotion === "drive" ? p.yaw : view.yaw,
          d = state.interior
            ? Math.min(8, view.distance)
            : state.locomotion === "drive"
              ? view.distance + 6
              : view.distance;
        position = [
          p.x - Math.sin(yaw) * d,
          p.y + Math.max(3, d * 0.55),
          p.z - Math.cos(yaw) * d,
        ];
      }
      return { position, target };
    },
  };
}
