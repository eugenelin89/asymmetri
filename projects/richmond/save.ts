// SPDX-License-Identifier: MIT
import type { City, State } from "./types";
import { createWorld, point } from "./world";
import { interiorFor, interiorFits } from "./interiors";
export const SAVE_KEY = "asymmetri.richmond.save.v1";
type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const record = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const num = (x: unknown, min = 0, max = 1e9): x is number =>
  typeof x === "number" && Number.isFinite(x) && x >= min && x <= max;
const str = (x: unknown, max = 200): x is string =>
  typeof x === "string" && x.length <= max;
const pose = (x: unknown) =>
  record(x) &&
  num(x.x, -30000, 30000) &&
  num(x.z, -30000, 30000) &&
  num(x.y, -5, 100) &&
  num(x.yaw, -1e8, 1e8);
export function parseSave(raw: string | null, city: City): State | null {
  if (!raw || raw.length > 2000000) return null;
  try {
    const d: unknown = JSON.parse(raw);
    if (
      !record(d) ||
      d.version !== 1 ||
      d.map !== city.version ||
      !pose(d.player) ||
      !pose(d.car) ||
      !record(d.car) ||
      !pose(d.checkpoint)
    )
      return null;
    if (
      !num(d.cash, 0, 1e7) ||
      !Number.isInteger(d.cash) ||
      !num(d.health, 0, 100) ||
      !num(d.stamina, 0, 100) ||
      !num(d.car.condition, 0, 100) ||
      !num(d.car.speed, -6, 20) ||
      !num(d.car.steer, -1, 1) ||
      typeof d.car.blocked !== "boolean"
    )
      return null;
    if (
      !["walk", "drive"].includes(String(d.locomotion)) ||
      !["third", "first", "top", "aerial"].includes(String(d.camera)) ||
      typeof d.airfield !== "boolean" ||
      typeof d.shopping !== "boolean"
    )
      return null;
    if (
      !record(d.settings) ||
      !["gentle", "lite", "reducedMotion", "northUp"].every(
        (k) =>
          typeof d.settings === "object" &&
          typeof (d.settings as Record<string, unknown>)[k] === "boolean",
      ) ||
      !num(d.settings.density, 0.25, 1.5) ||
      !num(d.settings.textScale, 1, 1.5) ||
      !["en", "zh"].includes(String(d.settings.locale))
    )
      return null;
    // Additive v1 migration: earlier previews did not store encounter tuning.
    if (d.settings.encounterRate === undefined) d.settings.encounterRate = 1;
    if (d.settings.encounterSeverity === undefined)
      d.settings.encounterSeverity = 1;
    if (
      !num(d.settings.encounterRate, 0.5, 1.5) ||
      !num(d.settings.encounterSeverity, 0.5, 1)
    )
      return null;
    if (
      !num(d.sequence, 1, 1e8) ||
      !Number.isInteger(d.sequence) ||
      !num(d.rng, 0, 4294967295) ||
      !Number.isInteger(d.rng) ||
      !num(d.elapsed) ||
      !num(d.cooldown, 0, 200) ||
      !num(d.resolved) ||
      !num(d.tutorial, 0, 6)
    )
      return null;
    if (
      !record(d.inventory) ||
      Object.entries(d.inventory).some(
        ([k, v]) =>
          !/^(bag|meal|medkit|insulation|repair|jacket|order-\d+)$/.test(k) ||
          !num(v, 0, 999) ||
          !Number.isInteger(v),
      )
    )
      return null;
    if (
      !Array.isArray(d.ledger) ||
      d.ledger.length > 30000 ||
      new Set(d.ledger).size !== d.ledger.length ||
      !d.ledger.every(
        (x) => str(x, 70) && /^(delivery:order-|purchase:)\d+$/.test(x),
      )
    )
      return null;
    if (
      !Array.isArray(d.history) ||
      d.history.length > 200 ||
      !d.history.every(
        (r) =>
          record(r) &&
          str(r.id, 70) &&
          str(r.title) &&
          num(r.pay, 0, 1e5) &&
          num(r.tip, 0, 4) &&
          num(r.rating, 0, 5) &&
          ["delivered", "cancelled", "expired", "stolen"].includes(
            String(r.outcome),
          ),
      )
    )
      return null;
    const placeIds = city.places.map((p) => p.id);
    if (d.active !== null) {
      const o = d.active;
      if (
        !record(o) ||
        !str(o.id, 70) ||
        !/^order-\d+$/.test(o.id) ||
        !["mission", "title", "food", "customer"].every((k) => str(o[k])) ||
        !placeIds.includes(String(o.pickup)) ||
        !placeIds.includes(String(o.destination)) ||
        !num(o.basePay, 0, 10000) ||
        !num(o.distance, 0, 1e6) ||
        !num(o.duration, 0, 100000) ||
        !num(o.remaining, 0, 100000) ||
        !num(o.condition, 0, 100) ||
        !["accepted", "collected"].includes(String(o.stage))
      )
        return null;
      if (
        d.ledger.includes("delivery:" + o.id) ||
        (o.stage === "collected" && d.inventory[o.id] !== 1) ||
        (o.stage === "accepted" && d.inventory[o.id])
      )
        return null;
    }
    if (d.interior !== null) {
      const i = d.interior;
      if (
        !record(i) ||
        !city.places.some((p) => p.id === i.place && p.interior) ||
        !Array.isArray(i.entrance) ||
        i.entrance.length !== 2 ||
        !i.entrance.every((n) => num(n, -30000, 30000)) ||
        d.locomotion !== "walk"
      )
        return null;
    }
    if (d.encounter !== null) {
      const e = d.encounter;
      if (
        !record(e) ||
        !str(e.id, 70) ||
        !["pickpocket", "scam", "robbery", "breakin", "hazard"].includes(
          String(e.kind),
        ) ||
        !Array.isArray(e.origin) ||
        e.origin.length !== 2 ||
        !e.origin.every((n) => num(n, -30000, 30000)) ||
        !num(e.remaining, 0, 12) ||
        !str(e.warning, 500)
      )
        return null;
    }
    const state = d as unknown as State,
      world = createWorld(city);
    state.shopping = false;
    state.car.speed = 0;
    if (!world.fits(state.car, state.airfield)) {
      const p = world.poseNear(point(state.car));
      state.car = { ...state.car, ...p, blocked: false };
    }
    if (state.interior) {
      const place = city.places.find((p) => p.id === state.interior!.place)!;
      state.interior.entrance = [...place.entrance];
      const l = interiorFor(place);
      if (!interiorFits(point(state.player), l))
        state.player = { x: l.spawn[0], z: l.spawn[1], y: 0, yaw: Math.PI };
    } else if (state.locomotion === "drive") state.player = { ...state.car };
    else if (
      !world.walkFits(point(state.player), state.player.y, state.airfield)
    )
      state.player =
        world.exit(state.car, state.airfield) ??
        world.poseNear(city.places[0].parking);
    if (
      !world.walkFits(
        point(state.checkpoint),
        state.checkpoint.y,
        state.airfield,
      )
    )
      state.checkpoint =
        world.exit(state.car, state.airfield) ??
        world.poseNear(city.places[0].parking);
    return state;
  } catch {
    return null;
  }
}
export function readSave(store: Store, city: City) {
  try {
    const raw = store.getItem(SAVE_KEY),
      state = parseSave(raw, city);
    return {
      state,
      message:
        raw && !state
          ? "Saved data could not be restored. It is retained until you explicitly start a new shift."
          : "Progress stays in this browser. Game money is fictional.",
      invalid: !!raw && !state,
    };
  } catch {
    return {
      state: null,
      message:
        "Storage is unavailable. Play works, but progress may not survive reload.",
      invalid: false,
    };
  }
}
export function writeSave(store: Store, state: State) {
  try {
    store.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
