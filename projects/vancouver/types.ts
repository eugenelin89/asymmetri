export type Point2 = [number, number];
export type Polygon2 = Point2[][];
export type Mode = "aerial" | "drive";
export type Input = "forward" | "back" | "left" | "right" | "brake";
export type City = {
  version: string;
  bounds: Point2[];
  anchors: Record<string, Point2>;
  land: Polygon2[];
  water: Polygon2[];
  pavement: Polygon2[];
  sidewalks: Polygon2[];
  promenade: Polygon2[];
  buildings: { id: string; shape: Polygon2; height: number; heightMethod: string; landmark?: string | null }[];
  roads: { name: string; points: Point2[]; width: number; bridge: boolean }[];
  parks: { name: string; shape: Polygon2 }[];
};
export type Explorer = {
  setMode(mode: Mode): void;
  focus(id: string): void;
  driveNear(id: string): void;
  setQuality(quality: "auto" | "low"): void;
  reset(): void;
  setInput(input: Input, pressed: boolean): void;
  dispose(): void;
};

export type DriveTelemetry = { speed: number; reverse: boolean; street: string; x: number; z: number; yaw: number; blocked: boolean };
