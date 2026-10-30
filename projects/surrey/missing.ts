// SPDX-License-Identifier: MIT — all characters and events are fictional adults.
import type { City, Point } from "./types";
import type { World } from "./world";
import { landmarks } from "./landmarks";
export type MissingCase = {
  stage: "available" | "investigating" | "return" | "closed";
  approach: "people" | "trail"; clues: string[]; witnesses: string[];
  ending: "" | "message" | "reunion"; reward: number;
};
export const newMissing = (): MissingCase => ({ stage: "available", approach: "people", clues: [], witnesses: [], ending: "", reward: 0 });
export function missingLocations(city: City, world: World) {
  const park = landmarks(city).find(p => p.id === "holland")!.point;
  const safe = (p: Point) => world.safe(p);
  return { tess: safe([city.anchors.spawn[0] - 12, city.anchors.spawn[1] - 5]),
    mo: safe([18, 82]), eden: safe([-82, 139]), notice: safe([11, -89]), receipt: safe([-69, 140]),
    riley: safe([park[0] + 34, park[1] - 18]) };
}
export const missingClues = [
  { id: "notice", name: "Case 03: workshop notice", text: "The volunteer art workshop moved from the library to Holland Park. Riley wrote: ‘Phone off for a quiet afternoon. I will check in after I finish.’ The date matches today in this fictional story." },
  { id: "receipt", name: "Case 03: canvas receipt", text: "A signed delivery receipt lists canvases, brushes and a red rental van. Riley collected a sketchbook on foot. The van carried equipment; it is not evidence that anyone was taken." },
];
export const missingWitnesses = [
  { id: "mo", name: "Mo · transit volunteer", text: "Riley, our adult workshop organiser, asked me for the walking route to Holland Park. I saw a red van and worried they got into it, but I was watching the bus doors. Ask Eden at the campus entrance before trusting my guess. The library notice has their plan." },
  { id: "eden", name: "Eden · artist", text: "I drove that red van with the canvases. Riley walked away freely with a sketchbook. I left the delivery receipt beside me. They wanted somewhere quiet near the Holland Park fountain. Please ask what they want before bringing anyone there." },
];
export function missingReady(m: MissingCase) {
  return m.approach === "people" ? m.witnesses.length === 2 && m.clues.length >= 1 : m.clues.length === 2 && m.witnesses.length >= 1;
}
export function missingLeads(m: MissingCase) {
  const leads = [{ id: "tess", name: "Tess · request / return", hint: "A friend asks for help near your arrival at Surrey Central." }];
  if (m.stage === "available" || m.stage === "closed") return leads;
  leads.push({ id: "mo", name: "Mo · bus loop", hint: "Compare what a witness saw with what they assumed." }, { id: "notice", name: "Library workshop notice", hint: "A small notice south of the library records Riley’s own plan." });
  if (m.witnesses.includes("mo") || m.clues.includes("notice") || m.approach === "trail") leads.push({ id: "eden", name: "Eden · campus entrance", hint: "An artist can explain the red van. Look nearby for a delivery receipt." });
  if (missingReady(m) || m.stage === "return") leads.push({ id: "riley", name: "Riley · Holland Park", hint: "Follow the evidence to the quiet garden near the fountain." });
  return leads;
}
