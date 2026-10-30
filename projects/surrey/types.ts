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
    baseElevation: number;
    facilityId: string;
    heightProvenance: { source: string; officialSource: string | null; officialId: number | null; sourceValue: number | null; unit: "m"; unitVerified: boolean; surveyDate: null; measurementMethod: null; nativeMatchResidualM: number | null };
    name?: string | null;
  }[];
  roads: { name: string; points: Point[]; width: number; widthMethod: string }[];
  pavement: Polygon[];
  sidewalks: Polygon[];
  plazas: Polygon[];
  medians: Polygon[];
  curbs: Point[][];
  crossings: Polygon[];
  markings: Polygon[];
  paths: { id: string; points: Point[]; width: number; widthMethod: string; material: string | null }[];
  terrain: { kind: "flat"; elevation: 0; verticalDatum: null; reason: string };
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
export type Mode = "ground" | "aerial";
export type Choice = { id: string; label: string };
export type Dialogue = { speaker: string; text: string; action?: string; choices?: Choice[]; context?: string };
export type Investigation = {
  stage: "available" | "active" | "closed" | "inconclusive";
  evidence: string[];
  witnesses: string[];
  conclusion: string;
  reward: number;
};
export type StreetEncounter = {
  id: string;
  phase: "offer" | "pursuit" | "chase";
  position: Point;
  seconds: number;
  hit: boolean;
  variant: boolean;
};
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
  mode: Mode;
  follow: boolean;
  cameraYaw: number;
  mature: boolean;
  investigation: Investigation;
  encounter: StreetEncounter | null;
  resolved: string[];
  waypoint: { name: string; point: Point } | null;
};
export type Game = {
  input(action: Input, pressed: boolean): void;
  interact(): void;
  dismiss(): void;
  choose(id: string): void;
  mode(value: Mode): void;
  follow(value: boolean): void;
  returnToPlayer(): void;
  selectPlace(id: string): void;
  track(point: Point, name: string): void;
  clearWaypoint(): void;
  mature(value: boolean): void;
  save(): boolean;
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
