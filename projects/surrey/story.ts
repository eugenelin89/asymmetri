// SPDX-License-Identifier: MIT — every person and incident below is invented.
import type { City, Point } from "./types";
import type { World } from "./world";
export const evidence = [
  { id: "watch", name: "Stopped watch · 13:13", text: "The victim's watch reads 13:13. The face is scratched. A stopped watch is not a reliable time of death." },
  { id: "receipt", name: "Carbon dispatch receipt", text: "Mara signed for blue cart C17 at 13:05. The return line is blank. Theo signed for a different cart earlier." },
  { id: "paint", name: "Red fabric with dry paint", text: "A dramatic red stain. It smells of acrylic paint, not blood. Rowan's exhibition uses the same pigment." },
  { id: "clock", name: "Maintenance clock log", text: "A test chime played at 13:07, six minutes before the display advanced to 13:13. The watch was already broken that morning." },
  { id: "tag", name: "C17 cart tag", text: "A torn blue tag beside the sealed scene matches the C17 number on the dispatch receipt." },
] as const;
export const witnesses = [
  { id: "nina", name: "Nina · student, 24", text: "I heard the test chime when Elliot argued with someone pushing a blue cart. I thought it was 13:13 because of the watch. Idris keeps the dispatch paperwork; Jo knows the maintenance worker." },
  { id: "idris", name: "Idris · kiosk worker, 46", text: "Mara borrowed blue cart C17. Theo returned his own cart before the chime and stayed here helping me. Check the carbon receipt by my bench. Rowan can explain that red fabric." },
  { id: "rowan", name: "Rowan · artist, 39", text: "The red cloth is mine. Acrylic, not blood. I was painting a spectacularly unsuccessful sunset. Mara returned without C17 after the test chime. Jo has a copy of the clock log." },
] as const;
export type StoryPoint = "scene" | "receipt" | "paint" | "clock" | "tag" | "nina" | "idris" | "rowan";
export function storyLocations(city: City, world: World): Record<StoryPoint, Point> {
  const a = city.anchors;
  return {
    scene: [...a.mystery], tag: world.safe([a.mystery[0] + 7, a.mystery[1] + 5]),
    nina: world.safe([a.mystery[0] - 22, a.mystery[1] + 22]),
    idris: world.safe([a.community[0] + 12, a.community[1] + 17]),
    receipt: world.safe([a.community[0] + 18, a.community[1] + 18]),
    rowan: world.safe([a.owner[0] - 35, a.owner[1] + 4]),
    paint: world.safe([a.owner[0] - 30, a.owner[1] + 7]),
    clock: world.safe([a.community[0] - 7, a.community[1] + 3]),
  };
}
export function mysteryVerdict(clues: string[], heard: string[], choice: string) {
  const corroborated = ["receipt", "clock", "tag"].every(id => clues.includes(id)) && ["nina", "idris", "rowan"].every(id => heard.includes(id));
  if (choice === "mara" && corroborated) return { solved: true, reward: 75, text: "Mara's C17 receipt, the torn tag and three accounts agree at the corrected time. Your evidence is handed to the fictional investigator; Mara's account unravels. The red paint cleared Rowan and Idris confirmed Theo's alibi. Case complete. Total investigation stipend across your reports: $75." };
  return { solved: false, reward: 10, text: choice === "uncertain" ? "You record the uncertainty instead of accusing anyone. The case remains open; the initial report earns a one-time $10 stipend. Review the clock, cart paperwork and witnesses, then submit a stronger conclusion." : "That theory is not sufficiently corroborated. No one is charged. The initial report earns a one-time $10 stipend, and the case remains open. Check the clock discrepancy, the C17 trail and all three accounts. You can review and resubmit." };
}
