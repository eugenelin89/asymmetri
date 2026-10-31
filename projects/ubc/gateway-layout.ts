// SPDX-License-Identifier: MIT
import type { Anchor, Anchors, Point, Pose } from "./types";

/**
 * The letters occupy the east end of the University Boulevard central median,
 * west of Wesbrook Mall. Placement within the pinned pedestrian island follows
 * reference photographs and the published map pin, not an as-built survey.
 * x is east and z south in the unchanged campus local UTM coordinate system.
 */
export const gatewaySpawn: Point = [-46.9, -700];

export const gatewayAnchor: Anchor = {
  id: "entrance-letters",
  x: -59,
  z: -697.6,
  width: 6.7,
  depth: 0.95,
  yaw: 1.792,
  entry: [...gatewaySpawn],
};

export const gatewayProvenance = {
  sourcePadId: "LSHARD_TYPE-642-0",
  sourcePadKind: "Pedestrian",
  sourceSnapshot: "v0.1-2026-10-30",
  sourceRevision: "885732d332a20a59143f655c83fb15e1367ebe4d",
  sourceRouteIds: ["route-5462", "route-6247"],
  signWgs84: [-123.245842037, 49.266273274] as Point,
  spawnWgs84: [-123.245675826, 49.266295217] as Point,
  referencePinWgs84: [-123.24578600952293, 49.26627544890612] as Point,
  referencePinLocal: [-54.92, -697.83] as Point,
  referencePinUrl:
    "https://www.arcgis.com/sharing/rest/content/items/4a135db3b28449f784eb3d43b56f7873/resources/pub_expressmap_1704929926999.json",
  referencePageUrl:
    "https://blogs.ubc.ca/anthropocenemanifesto/mapping/ubc-letters/",
  officialLocationUrl:
    "https://med-fom-audiology.sites.olt.ubc.ca/files/2021/09/Directions-to-the-Friedman-Building-Parking-Lot-SASS-Clinic.pdf",
  checked: "2026-10-31",
  confidence:
    "Intersection and pedestrian island are source-supported. Letter dimensions, exact placement and orientation are reference-based interpretations; no survey accuracy or current physical access is claimed.",
};

/** Start on the pedestrian island, looking at the letters from their east front. */
export function initialGatewayPose(): Pose {
  return {
    x: gatewaySpawn[0],
    y: 0,
    z: gatewaySpawn[1],
    yaw: Math.atan2(
      gatewaySpawn[0] - gatewayAnchor.x,
      gatewaySpawn[1] - gatewayAnchor.z,
    ),
    pitch: 0,
  };
}

/** Share one additive overlay between the renderer, directory and map. */
export function applyGatewayAnchors(anchors: Anchors): Anchors {
  const pose = initialGatewayPose();
  return {
    ...anchors,
    [gatewayAnchor.id]: {
      ...gatewayAnchor,
      entry: [...gatewaySpawn],
    },
    spawn: {
      id: "spawn",
      x: pose.x,
      z: pose.z,
      width: 1,
      depth: 1,
      yaw: pose.yaw,
    },
  };
}
