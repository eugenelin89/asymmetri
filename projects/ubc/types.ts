export type Point = [number, number];
export type Mode = "walk" | "third" | "aerial" | "map";
export type Season = "spring" | "summer" | "autumn" | "winter";
export type Weather = "clear" | "cloudy" | "overcast" | "rain" | "fog" | "snow";
export type Quality = "auto" | "ultra" | "high" | "medium" | "low";
export type Settings = {
  season: Season;
  weather: Weather;
  hour: number;
  quality: Quality;
  markers: boolean;
  population: boolean;
  reducedMotion: boolean;
};
export type Building = {
  id: string;
  name: string;
  rings: Point[][];
  height: number;
  heightSource?: string;
  address?: string;
};
export type CampusData = {
  origin: Point;
  buildings: Building[];
  surfaces: { id: string; kind: string; rings: Point[][] }[];
  trees: {
    id: string;
    x: number;
    z: number;
    species: string;
    height: number;
    evergreen: boolean;
  }[];
  routes: { id: string; points: Point[]; kind?: string }[];
  entrances: { id: string; buildingId?: string; x: number; z: number }[];
  roads?: { id: string; name: string; points: Point[] }[];
};
export type Anchor = {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  yaw: number;
  buildingId?: string;
  entry?: Point;
};
export type Anchors = Record<string, Anchor>;
export type Link = { label: string; url: string };
export type Place = {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  interior: "B" | "C";
  reconstruction: string;
  links: Link[];
  verified: string;
};
export type Topic = {
  id: string;
  question: string;
  answer: string;
  sources: Link[];
  followups?: string[];
  keywords: string[];
};
export type Character = {
  id: string;
  name: string;
  /** Short spoken introduction; provenance and reconstruction notes belong in biography. */
  introduction: string;
  title: string;
  department: string;
  institution: string;
  label: string;
  category: "named" | "fictional" | "community";
  color?: string;
  uniform?: string;
  jerseyNumber?: string;
  height?: number;
  appearance?: import("./appearance").Appearance;
  beard?: boolean;
  kind?: "athlete" | "faculty" | "alumni" | "historical" | "coach";
  model: string;
  zone: string;
  route: Point[];
  routeSpace?: "interior" | "network";
  floor?: number;
  behaviour: string;
  topics: Topic[];
  biography: string;
  sources: Link[];
  verified: string;
  permissions: string;
  disclaimer: string;
  status: string;
};
export type Pose = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
};
export type Telemetry = {
  pose: Pose;
  mode: Mode;
  location: string;
  nearby: string | null;
  nearbyLabel?: string;
  fps: number;
  draws: number;
  triangles: number;
  loaded: number;
  routeDistance: number | null;
  guidance: {
    label: string;
    distance: number;
    turn: number;
    status: "following" | "off-route" | "arrived" | "exit-building";
  } | null;
};
