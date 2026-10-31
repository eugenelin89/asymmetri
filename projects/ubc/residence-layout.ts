import type { Anchor, Point } from "./types";
import type { DoorDefinition } from "./doors";

export const residenceVersion = "0.2.0 · Orchard Commons open house";
/** Derived from source entrance 05735B81 and the Bartlett footprint, not a campus guess. */
export const orchardAnchor: Anchor = {
  id: "orchard",
  buildingId: "VBL10013-part1",
  x: -450.5443912079143,
  z: -43.99321172379285,
  yaw: -1.0821463267948965,
  width: 40,
  depth: 24,
  entry: [-461.14, -38.36],
};
export const residenceFloor = 3.4;
export type ResidenceRoom = {
  id: string;
  name: string;
  type: "connected-single" | "shared-double";
  interest: string;
  minX: number;
  maxX: number;
  side: 1 | -1;
  bathroom: string;
  beds: 1 | 2;
  colour: "teal" | "ochre" | "rust" | "navy";
};
export const orchardRooms: ResidenceRoom[] = [
  {
    id: "a",
    name: "Room A",
    type: "connected-single",
    interest: "Science",
    minX: -17.5,
    maxX: -14.2,
    side: 1,
    bathroom: "ab",
    beds: 1,
    colour: "teal",
  },
  {
    id: "b",
    name: "Room B",
    type: "connected-single",
    interest: "Engineering",
    minX: -12.4,
    maxX: -9.1,
    side: 1,
    bathroom: "ab",
    beds: 1,
    colour: "ochre",
  },
  {
    id: "c",
    name: "Room C",
    type: "connected-single",
    interest: "Business",
    minX: -8.5,
    maxX: -5.2,
    side: 1,
    bathroom: "cd",
    beds: 1,
    colour: "rust",
  },
  {
    id: "d",
    name: "Room D",
    type: "connected-single",
    interest: "Computer Science",
    minX: -3.4,
    maxX: -0.1,
    side: 1,
    bathroom: "cd",
    beds: 1,
    colour: "navy",
  },
  {
    id: "e",
    name: "Room E",
    type: "connected-single",
    interest: "Student athlete",
    minX: -17.5,
    maxX: -14.2,
    side: -1,
    bathroom: "ef",
    beds: 1,
    colour: "ochre",
  },
  {
    id: "f",
    name: "Room F",
    type: "connected-single",
    interest: "Music",
    minX: -12.4,
    maxX: -9.1,
    side: -1,
    bathroom: "ef",
    beds: 1,
    colour: "rust",
  },
  {
    id: "g",
    name: "Room G",
    type: "shared-double",
    interest: "Shared perspectives",
    minX: -8.5,
    maxX: -4.3,
    side: -1,
    bathroom: "g",
    beds: 2,
    colour: "teal",
  },
  {
    id: "h",
    name: "Room H",
    type: "shared-double",
    interest: "Roommates",
    minX: -3.7,
    maxX: 0.5,
    side: -1,
    bathroom: "h",
    beds: 2,
    colour: "navy",
  },
];
export const orchardBathrooms = [
  {
    id: "ab",
    rooms: ["a", "b"],
    minX: -14.2,
    maxX: -12.4,
    minZ: 3.4,
    maxZ: 5.85,
  },
  {
    id: "cd",
    rooms: ["c", "d"],
    minX: -5.2,
    maxX: -3.4,
    minZ: 3.4,
    maxZ: 5.85,
  },
  {
    id: "ef",
    rooms: ["e", "f"],
    minX: -14.2,
    maxX: -12.4,
    minZ: -5.85,
    maxZ: -3.4,
  },
  { id: "g", rooms: ["g"], minX: -8.5, maxX: -6.6, minZ: -8.4, maxZ: -6 },
  { id: "h", rooms: ["h"], minX: -3.7, maxX: -1.8, minZ: -8.4, maxZ: -6 },
];
export const roomEntry = (room: ResidenceRoom): Point => [
  (room.minX + room.maxX) / 2,
  room.side * 1.35,
];
export function orchardDoorDefinitions(): DoorDefinition[] {
  const doors: DoorDefinition[] = orchardRooms.map((room) => ({
    id: `door-room-${room.id}`,
    name: room.name,
    hinge: [roomEntry(room)[0] - 0.55, room.side * 1.35],
    y: residenceFloor,
    width: 1.1,
    angle: 0,
    swing: room.side,
  }));
  for (const bath of orchardBathrooms) {
    if (bath.rooms.length === 2) {
      for (const [index, x] of [bath.minX, bath.maxX].entries())
        doors.push({
          id: `door-bath-${bath.id}-${index}`,
          name: `shared bathroom ${bath.id.toUpperCase()}`,
          hinge: [x, (bath.minZ + bath.maxZ) / 2 - 0.5],
          y: residenceFloor,
          width: 1,
          angle: Math.PI / 2,
          swing: index === 0 ? 1 : -1,
        });
    } else
      doors.push({
        id: `door-bath-${bath.id}`,
        name: `Room ${bath.id.toUpperCase()} bathroom`,
        hinge: [(bath.minX + bath.maxX) / 2 - 0.5, bath.maxZ],
        y: residenceFloor,
        width: 1,
        angle: 0,
        swing: -1,
      });
  }
  return doors;
}
