export type Point2 = [number, number];
export type Polygon2 = Point2[][];
export type Mode = "aerial" | "drive";
export type Input = "forward" | "back" | "left" | "right" | "brake";
export type City = {
  version: string;
  roadCells?: Record<string, Polygon2[]>;
  graph?: RoadGraph;
  scenicWaypoints?: number[];
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
  recover(): void;
  scenic(reverse?: boolean): void;
  navigate(id: string): void;
  setCruise(enabled: boolean): void;
  clearRoute(): void;
  setInput(input: Input, pressed: boolean): void;
  dispose(): void;
};

export type DriveTelemetry = { speed: number; reverse: boolean; street: string; x: number; z: number; yaw: number; blocked: boolean; blockedReason?: string; navigation?: NavigationStatus; travelled?: number };

export type RoadGraph = { nodes: Point2[]; edges: { a: number; b: number; points: Point2[]; length: number; name: string }[]; clearance: number };
export type DriveRoute = { points: Point2[]; distances: number[]; length: number; turns: { at: number; direction: string; street: string }[]; title: string; loop: boolean; destination?: string };
export type NavigationStatus = { instruction: string; remaining: number; offRoute: boolean; arrived: boolean; cruising: boolean; laps: number; progress: number };
