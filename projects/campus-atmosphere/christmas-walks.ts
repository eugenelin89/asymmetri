// Original arrangement code: MIT. UBC geography: PDDL. Stanford and CWRU geography:
// © OpenStreetMap contributors, ODbL 1.0. See each campus’s THIRD_PARTY_NOTICES.md.
// Metres in each explorer's pinned X-east, Z-south reconstruction.
// Each walk starts at the actual visitor spawn and ends inside the public core.
import type { Point } from "../ubc/types";

export type ChristmasTree = { x: number; z: number; height: number; indoor: boolean };
export type ChristmasWalk = {
  destination: string;
  path: Point[];
  trees: ChristmasTree[];
  soundLocations: ChristmasTree[];
};

function walk(destination: string, path: Point[], trees: ChristmasTree[]): ChristmasWalk {
  return { destination, path, trees, soundLocations: trees };
}

export const christmasWalks = {
  ubc: walk("nest", [
    [-46.9, -700], [-53, -708], [-55.23, -714.2], [-75.69, -712.33],
    [-114.28, -700.43], [-170.73, -687.83], [-246.5, -670.76], [-272.57, -667.42],
    [-290.45, -667.79], [-301.15, -687.83], [-301.53, -704.57], [-316.72, -733.13],
    [-320.056, -739.616], [-327.115, -735.852],
  ], [
    { x: -65.9, z: -694.6, height: 5.1, indoor: false },
    { x: -62.27, z: -703.01, height: 3.45, indoor: false },
    { x: -169.7, z: -682.9, height: 4.8, indoor: false },
    { x: -285.1, z: -672.8, height: 4.4, indoor: false },
    { x: -342.08, z: -734.67, height: 6.8, indoor: true },
  ]),
  stanford: walk("green-library", [
    [19.96, -160.08], [11.85, -129.56], [4, -100], [-6, -68], [-6, -56],
    [-18, -28], [-22, .5], [49, 19], [52, 19], [107, 33], [126, 36],
    [140.77, 12.87], [164.19, 13.59], [186.88, 20.03], [188.16, 24.33],
    [299.57, 53.75], [298.04, 59.39], [348.87, 73.17], [350, 81],
    [347.25, 89.01], [329.67, 97.3], [312.040, 105.572], [300.248, 102.487],
  ], [
    { x: 11.9, z: -146.1, height: 4.7, indoor: false },
    { x: 19.9, z: -143.8, height: 4, indoor: false },
    { x: -26, z: -4, height: 6, indoor: false },
    { x: 124.1, z: 27.8, height: 4.5, indoor: false },
    { x: 251, z: 36.7, height: 5.1, indoor: false },
    { x: 289.08, z: 103.70, height: 3.3, indoor: true },
  ]),
  cwru: walk("tinkham-veale", [
    [-83.633, -375.772], [-74.67, -374.84], [-71.19, -399.68], [-72.59, -400.64],
    [-76.86, -427.51], [-77.86, -428.51], [-79.25, -445.1],
    [-75.507, -445.294], [-64.332, -448.216],
  ], [
    { x: -94.3, z: -371.4, height: 4.6, indoor: false },
    { x: -92.7, z: -380.4, height: 3.55, indoor: false },
    { x: -78.4, z: -409.3, height: 4.9, indoor: false },
    { x: -83.6, z: -437.8, height: 3.7, indoor: false },
    { x: -53.92, z: -445.77, height: 3.35, indoor: true },
  ]),
};
