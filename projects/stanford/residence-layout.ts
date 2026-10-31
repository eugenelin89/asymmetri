// SPDX-License-Identifier: MIT
/** An original, public demonstration plan inside the source-fitted Branner core.
 * These letters are exhibit labels, never actual rooms or resident assignments.
 */
export const residenceId = "branner";
export const residenceFloor = 4.2;
export const residenceRooms = Array.from({ length: 5 }, (_, i) => ({
  id: String.fromCharCode(65 + i), x: (i - 2) * 4, width: 4, depth: 8.8,
  beds: i < 3 ? 2 : 1, doorZ: 1.5,
}));
export const residenceLift = { minX: 8.7, maxX: 10.9, minZ: -5.8, maxZ: -3 };
export const residenceBathroom = { x: -9.4, z: -4.4, width: 4, depth: 4.2, doorZ: -2.3 };
export const residenceDoorWidth = 1.78;
