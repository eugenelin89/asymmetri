import type { Mode, Pose } from "./types";

export const cameraModes: { id: Mode; label: string; icon: string }[] = [
  { id: "walk", label: "First person", icon: "↟" },
  { id: "third", label: "Third person", icon: "♙" },
  { id: "aerial", label: "Aerial", icon: "⌁" },
  { id: "map", label: "Map", icon: "▧" },
];
export const onFoot = (mode: Mode) => mode === "walk" || mode === "third";
export const walkSpeed = 1.45;
export const runSpeed = 5.5;

/** View changes never own or replace the visitor's physical position. */
export function footInput(pose: Pose, keys: string[], seconds: number) {
  const dt = Math.max(0, Math.min(0.1, seconds));
  const held = (...names: string[]) =>
    names.some((name) => keys.includes(name));
  const yaw =
    pose.yaw +
    (Number(held("arrowleft")) - Number(held("arrowright"))) * dt * 1.8;
  const forward = Number(held("w", "arrowup")) - Number(held("s", "arrowdown"));
  const right = Number(held("d")) - Number(held("a"));
  const length = Math.hypot(forward, right) || 1;
  const speed = held("shift") ? runSpeed : walkSpeed;
  return {
    yaw,
    dx:
      ((-Math.sin(yaw) * forward + Math.cos(yaw) * right) / length) *
      dt *
      speed,
    dz:
      ((-Math.cos(yaw) * forward - Math.sin(yaw) * right) / length) *
      dt *
      speed,
  };
}
