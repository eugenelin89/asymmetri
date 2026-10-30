// SPDX-License-Identifier: MIT
export type Point = [number, number];
export type Polygon = Point[][];
export type City = {
  version: string;
  origin: Point;
  bbox: number[];
  bounds: [number, number, number, number];
  anchors: Record<string, Point>;
  buildings: {
    id: string;
    shape: Polygon;
    height: number;
    heightMethod: string;
    name?: string | null;
  }[];
  roads: { name: string; points: Point[]; width: number }[];
  pavement: Polygon[];
  sidewalks: Polygon[];
  plazas: Polygon[];
  parks: { name: string; shape: Polygon }[];
  rail: Point[][];
  signals: Point[];
  walkCells: Record<string, Polygon[]>;
  civic: { name: string | null; centre: Point }[];
};
export type Input = "forward" | "back" | "left" | "right" | "sprint";
export type Pose = {
  x: number;
  z: number;
  yaw: number;
  moving: boolean;
  running: boolean;
  blocked: boolean;
};
export type Stage =
  | "available"
  | "clue"
  | "chase"
  | "return"
  | "completed"
  | "failed";
export type Dialogue = { speaker: string; text: string; action?: string };
export type Snapshot = {
  player: Pose;
  health: number;
  stamina: number;
  money: number;
  inventory: string[];
  stage: Stage;
  objective: string;
  marker: Point;
  nearby: string | null;
  dialogue: Dialogue | null;
  message: string;
  elapsed: number;
  thief: Point;
  danger: { active: boolean; position: Point; seconds: number };
  calm: boolean;
  mystery: boolean;
  helped: boolean;
  street: string;
};
export type Game = {
  input(action: Input, pressed: boolean): void;
  interact(): void;
  dismiss(): void;
  pause(value: boolean): void;
  recover(): void;
  reset(): void;
  calm(value: boolean): void;
  quality(value: "auto" | "low"): void;
  rotate(value: number): void;
  zoom(value: number): void;
  focus(): void;
  dispose(): void;
};
