// SPDX-License-Identifier: MIT — fictional adult cast; no real addresses or transaction guidance.
import type { Choice, City, Point } from "./types";
import type { World } from "./world";
export type EncounterDefinition = { id: string; name: string; speaker: string; text: string; threatening: boolean; mature: boolean; choices: Choice[]; offset: Point; anchor: string };
export const encounters: EncounterDefinition[] = [
  { id: "robbery", name: "An unwelcome demand", speaker: "Vex · fictional adult, 32", threatening: true, mature: false, anchor: "danger", offset: [38, 20], text: "Hand over twelve dollars. Don't make this complicated. Your adult character can refuse, leave or call for help. There is no graphic violence.", choices: [
    { id: "pay", label: "Hand over up to $12" }, { id: "refuse", label: "Refuse" }, { id: "run", label: "Run away" }, { id: "help", label: "Call for help" }, { id: "distract", label: "Distract: is that your bus?" }] },
  { id: "theft", name: "The missing portfolio", speaker: "Cleo · design student, 23", threatening: true, mature: false, anchor: "owner", offset: [-48, 46], text: "That person took my portfolio! It's three months of work and one truly terrible self-portrait. Can you help?", choices: [
    { id: "chase", label: "Pursue the thief" }, { id: "victim", label: "Stay and help Cleo" }, { id: "witness", label: "Ask a witness where they went" }, { id: "leave", label: "Walk on" }] },
  { id: "solicitation", name: "A private proposition", speaker: "Rae · fictional adult, 36", threatening: false, mature: true, anchor: "escape", offset: [-18, -16], text: "Looking for adult company? I offer private sexual services for money. No pressure. Your character and everyone in this story are adults. No sexual activity is depicted or purchased in this game.", choices: [
    { id: "decline", label: "Politely decline" }, { id: "question", label: "Ask about the neighbourhood" }, { id: "scam", label: "Ask whether this is a scam" }, { id: "leave", label: "End the conversation" }] },
  { id: "dealer", name: "An unlicensed offer", speaker: "Ash · fictional adult, 29", threatening: false, mature: true, anchor: "clue", offset: [90, -15], text: "Want to buy some illegal pills? I can make you a deal. You don't know what's in them. No purchase is available; this is a fictional story interaction.", choices: [
    { id: "decline", label: "Decline" }, { id: "question", label: "Question the claim" }, { id: "report", label: "Report within the fictional story" }, { id: "investigate", label: "Ask about the sealed case" }, { id: "leave", label: "Walk away" }] },
  { id: "scam", name: "The clipboard economy", speaker: "Kit · fictional adult, 31", threatening: true, mature: false, anchor: "spawn", offset: [-42, 20], text: "Three dollars for the Society for Improving Societies? The clipboard looks official. That is the clipboard's entire business model. Ask before deciding.", choices: [
    { id: "question", label: "Ask what the collection funds" }, { id: "pay", label: "Give up to $3" }, { id: "decline", label: "Decline" }] },
  { id: "community", name: "A wallet and a way home", speaker: "Dev · commuter, 54", threatening: false, mature: false, anchor: "community", offset: [-36, 35], text: "I've found a wallet, missed my bus, and somehow become the responsible adult. Could you take it to Jo or point me toward the station?", choices: [
    { id: "wallet", label: "Help return the wallet to Jo" }, { id: "directions", label: "Point out the station" }, { id: "leave", label: "Wish Dev well" }] },
];
export function encounterLocations(city: City, world: World) {
  return Object.fromEntries(encounters.map(e => [e.id, world.safe([city.anchors[e.anchor][0] + e.offset[0], city.anchors[e.anchor][1] + e.offset[1]])])) as Record<string, Point>;
}
