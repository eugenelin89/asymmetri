// SPDX-License-Identifier: MIT — browser-local game progress; never transmitted.
import type { Snapshot } from "./types";
import { evidence, witnesses } from "./story";
import { encounters } from "./encounters";
import { MAP_VERSION, LEGACY_MAP_VERSION } from "./data";
import { newTime } from "./time";
import { newMissing, missingClues, missingWitnesses } from "./missing";
export const SAVE_KEY = "asymmetri.surrey.save.v2";
export type SavedGame = {
  version: 3; map: string; savedAt: number; quality: "auto" | "low"; state: Snapshot;
  migratedFrom?: string;
  runtime: {
    thiefIndex: number; chaseTime: number; drop: boolean; dangerCooldown: number; dangerTime: number;
    active: boolean; stolen: number; caught: boolean; exhausted: boolean; clock: number;
    encounterCooldown: number; cooldowns: Record<string, number>; random: number;
  };
};
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const number = (v: unknown, lo = 0, hi = 1e9): v is number => typeof v === "number" && Number.isFinite(v) && v >= lo && v <= hi;
const text = (v: unknown, max = 500): v is string => typeof v === "string" && v.length <= max;
const strings = (v: unknown, allowed?: readonly string[]): v is string[] => Array.isArray(v) && v.length <= 40 && new Set(v).size === v.length && v.every(x => text(x, 100) && (!allowed || allowed.includes(x)));
const point = (v: unknown) => Array.isArray(v) && v.length === 2 && v.every(x => number(x, -1e6, 1e6));
const bool = (v: unknown) => typeof v === "boolean";
export function parseSave(raw: string | null, map = MAP_VERSION): SavedGame | null {
  if (!raw || raw.length > 50000) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!record(data) || ![2, 3].includes(data.version as number) || (data.map !== map && !(map === MAP_VERSION && data.map === LEGACY_MAP_VERSION)) || !number(data.savedAt, 0, 1e15) || !["auto", "low"].includes(data.quality as string)) return null;
    const s = data.state, r = data.runtime;
    if (!record(s) || !record(r) || !record(s.player) || !record(s.danger) || !record(s.investigation)) return null;
    if (!number(s.player.x, -1e6, 1e6) || !number(s.player.z, -1e6, 1e6) || !number(s.player.yaw, -1e6, 1e6)) return null;
    if (!number(s.health, 0, 100) || !number(s.stamina, 0, 100) || !number(s.money, 0, 1e6) || !Number.isInteger(s.money)) return null;
    if (!["available", "clue", "chase", "return", "completed", "failed"].includes(s.stage as string) || !["ground", "aerial"].includes(s.mode as string)) return null;
    if (!["calm", "mystery", "helped", "follow", "mature"].every(k => bool(s[k])) || !number(s.elapsed) || !point(s.thief) || !point(s.danger.position)) return null;
    const inventory = ["Yellow transit slip", "Alex’s backpack", "Case 02: stopped watch", ...evidence.map(e => e.name), ...missingClues.map(e => e.name)];
    if (!strings(s.inventory, inventory) || !strings(s.resolved, encounters.map(e => e.id))) return null;
    const m = s.investigation;
    if (!["available", "active", "closed", "inconclusive"].includes(m.stage as string) || !strings(m.evidence, evidence.map(e => e.id)) || !strings(m.witnesses, witnesses.map(w => w.id)) || !text(m.conclusion, 1200) || (!number(m.reward, 0, 75) || ![0, 10, 75].includes(m.reward))) return null;
    if (s.waypoint !== null && (!record(s.waypoint) || !text(s.waypoint.name, 100) || !point(s.waypoint.point))) return null;
    if (s.encounter !== null) {
      const e = s.encounter;
      if (!record(e) || !encounters.some(d => d.id === e.id) || !["offer", "pursuit", "chase"].includes(e.phase as string) || !point(e.position) || !number(e.seconds, 0, 60) || !bool(e.hit) || !bool(e.variant)) return null;
      if ((e.phase === "chase" && e.id !== "theft") || (e.phase === "pursuit" && e.id !== "robbery")) return null;
    }
    if (!["drop", "active", "caught", "exhausted"].every(k => bool(r[k])) || !number(r.thiefIndex, 0, 25000) || !Number.isInteger(r.thiefIndex) || !number(r.chaseTime, 0, 200) || !number(r.clock) || !number(r.stolen, 0, 5) || !number(r.random, 0, 4294967295)) return null;
    if (!["dangerCooldown", "dangerTime", "encounterCooldown"].every(k => number(r[k], -1e9, 600)) || !record(r.cooldowns) || Object.keys(r.cooldowns).some(k => !encounters.some(e => e.id === k) || !number((r.cooldowns as Record<string, unknown>)[k], -1e9, 600))) return null;
    if (data.version === 2) {
      if (s.inventory.some(item => missingClues.some(c => c.name === item))) return null;
      // Same local key, explicit v2 -> v3 migration. Do not infer new-case progress.
      Object.assign(s, { time: newTime(), missing: newMissing(), trust: s.helped ? 1 : 0, stableVisibility: false, volume: 0 });
    } else {
      if (!record(s.time) || !number(s.time.day, 1, 1000000) || !Number.isInteger(s.time.day) || !number(s.time.minutes, 0, 1439.9999999999998) || ![1, 4, 12].includes(s.time.rate as number)) return null;
      if (!number(s.trust, 0, 3) || !Number.isInteger(s.trust) || !bool(s.stableVisibility) || !number(s.volume, 0, 1) || !record(s.missing)) return null;
      const missing = s.missing;
      if (!["available", "investigating", "return", "closed"].includes(missing.stage as string) || !["people", "trail"].includes(missing.approach as string) || !strings(missing.clues, missingClues.map(c => c.id)) || !strings(missing.witnesses, missingWitnesses.map(w => w.id)) || !["", "message", "reunion"].includes(missing.ending as string) || ![0, 60, 75].includes(missing.reward as number)) return null;
      const finished = missing.stage === "closed", returning = missing.stage === "return";
      if ((finished || returning) !== (missing.ending !== "") || (!finished && missing.reward !== 0) || (finished && missing.reward !== (missing.ending === "message" ? 60 : 75))) return null;
      if ((finished || returning) && !(missing.approach === "people" ? missing.witnesses.length === 2 && missing.clues.length >= 1 : missing.clues.length === 2 && missing.witnesses.length >= 1)) return null;
      if (missing.stage === "available" && (missing.clues.length || missing.witnesses.length)) return null;
      const clues = missing.clues, items = s.inventory;
      if (missingClues.some(c => clues.includes(c.id) !== items.includes(c.name))) return null;
    }
    // Restore copies only validated gameplay fields; UI/dialogue remain derived.
    return { ...data, version: 3, map, ...(data.map === LEGACY_MAP_VERSION && map === MAP_VERSION ? { migratedFrom: LEGACY_MAP_VERSION } : {}) } as unknown as SavedGame;
  } catch { return null; }
}
export type SaveStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export function readSave(storage: SaveStorage): { save: SavedGame | null; message: string } {
  try { const raw = storage.getItem(SAVE_KEY), save = parseSave(raw); return { save, message: raw && !save ? "The local save is incompatible or damaged. New Game starts safely; the old save is kept until you choose a new story." : save ? "Progress saved on this browser only." : "Autosaves stay on this browser only." }; }
  catch { return { save: null, message: "Browser storage is unavailable. You can play, but progress will not survive reloads." }; }
}
export function writeSave(storage: SaveStorage, save: SavedGame) {
  try { storage.setItem(SAVE_KEY, JSON.stringify(save)); return true; } catch { return false; }
}
