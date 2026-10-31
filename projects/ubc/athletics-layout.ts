import type { Anchors, Point } from "./types";

/** Metre-space anchors fitted to the immutable UBC landscape/footprint snapshot.
 * Field names are reconciled with the official Thunderbird Park map. Dimensions
 * of reconstructed fixtures, seating and fences are interpretations, not surveys.
 */
export const athleticsSources = {
  park: "https://sportfacilities.ubc.ca/thunderbird-park/",
  map: "https://sportfacilities.ubc.ca/wp-content/uploads/2020/08/3-THUNDERBIRD-PARK-Map-page-001.jpg",
  stadium: "https://sportfacilities.ubc.ca/thunderbird-stadium/",
  football: "https://footballcanada.com/wp-content/uploads/2025/03/2025-Tackle-Rulebook-English.pdf",
  checked: "2026-10-31",
};
export const soccerFields = [
  { id: "ken-woods", name: "Ken Woods Field", surfaceId: "LSSOFT_TYPE-4161-0", x: 124.531, z: 200.703, yaw: 0.4892, width: 75 * 0.9144, length: 120 * 0.9144, sourceWidth: 76.507, sourceLength: 124.428, entryLocal: [-40, -25], measuredDimensions: true },
  { id: "harry-warren", name: "Harry Warren Field", surfaceId: "LSSOFT_TYPE-4171-0", x: 183.067, z: 319.74, yaw: 0.4892, width: 71 * 0.9144, length: 110 * 0.9144, sourceWidth: 70.766, sourceLength: 106.851, entryLocal: [-37, -25], measuredDimensions: true },
  { id: "south-turf", name: "South Turf Soccer Field", surfaceId: "LSSOFT_TYPE-4167-0", x: 279.99, z: 379.04, yaw: 2.0608, width: 68, length: 105, sourceWidth: 76.78, sourceLength: 115.24, entryLocal: [38, 0], measuredDimensions: false },
] as const;

export const trackLayout = {
  surfaceId: "LSHARD_TYPE-969-0",
  infieldId: "LSSOFT_TYPE-886-0",
  lanes: 8,
  laneWidth: 1.22,
  innerRadius: 36.5,
  // The 400 m measurement line is 0.30 m outside the inside kerb, rather than
  // an ellipse fitted to a photograph. Source footprint includes run-out areas.
  measurementOffset: 0.3,
  straightLength: (400 - Math.PI * 2 * 36.8) / 2,
};

export const athleticsAnchors: Anchors = {
  ...Object.fromEntries(soccerFields.map((field) => [field.id, {
    id: field.id, x: field.x, z: field.z, yaw: field.yaw,
    width: field.sourceWidth, depth: field.sourceLength,
    entry: [field.x + Math.cos(field.yaw) * field.entryLocal[0] + Math.sin(field.yaw) * field.entryLocal[1], field.z - Math.sin(field.yaw) * field.entryLocal[0] + Math.cos(field.yaw) * field.entryLocal[1]] as Point,
  }])),
  "dhillon-track": {
    // Oval centre is fitted to the lane corridor, not the apron bounding box.
    id: "dhillon-track", x: 472.4255, z: 385.509, yaw: 0.489,
    width: 105, depth: 195,
    entry: [472.4255 - 49.26 * Math.cos(0.489) - 18 * Math.sin(0.489), 385.509 + 49.26 * Math.sin(0.489) - 18 * Math.cos(0.489)],
  },
  "thunderbird-stadium": {
    id: "thunderbird-stadium", x: -31.453, z: 614.302, yaw: 0.491,
    width: 185, depth: 210, buildingId: "VBL10214",
    entry: [8.24, 593.08],
  },
};

/** Counter-clockwise running lane, at constant speed along straights and arcs. */
export function trackPoint(distance: number, lane = 1) {
  const { innerRadius, laneWidth, straightLength } = trackLayout;
  const radius = innerRadius + (Math.max(1, Math.min(8, lane)) - 0.5) * laneWidth;
  const half = straightLength / 2, curveLength = Math.PI * radius;
  const length = straightLength * 2 + curveLength * 2;
  let d = ((Number.isFinite(distance) ? distance : 0) % length + length) % length;
  if (d < straightLength) return { x: radius, z: half - d, yaw: Math.PI, length };
  d -= straightLength;
  if (d < curveLength) {
    const a = d / radius;
    return { x: radius * Math.cos(a), z: -half - radius * Math.sin(a), yaw: Math.atan2(-Math.sin(a), -Math.cos(a)), length };
  }
  d -= curveLength;
  if (d < straightLength) return { x: -radius, z: -half + d, yaw: 0, length };
  const a = Math.PI + (d - straightLength) / radius;
  return { x: radius * Math.cos(a), z: half - radius * Math.sin(a), yaw: Math.atan2(-Math.sin(a), -Math.cos(a)), length };
}

export function trackBoundary(radius: number, steps = 160): Point[] {
  const half = trackLayout.straightLength / 2;
  const points: Point[] = [];
  for (let i = 0; i <= steps / 2; i++) {
    const a = i / (steps / 2) * Math.PI;
    points.push([radius * Math.cos(a), -half - radius * Math.sin(a)]);
  }
  for (let i = 0; i <= steps / 2; i++) {
    const a = Math.PI + i / (steps / 2) * Math.PI;
    points.push([radius * Math.cos(a), half - radius * Math.sin(a)]);
  }
  points.push(points[0]);
  return points;
}
