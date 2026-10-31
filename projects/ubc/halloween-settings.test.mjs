import test from "node:test";
import assert from "node:assert/strict";
import "./test-loader.mjs";

const {
  defaults, dateDefaults, seasonalEditionRegistry, halloweenAtmosphere, halloweenSchedule, initialHalloweenPreference,
  parseHalloweenPreference, serializeHalloweenPreference, setHalloween,
  toggleHalloween, normalizeSettings,
} = await import("./environment.ts");
const date = (value) => new Date(value);

test("Halloween defaults follow October24–November7 inclusive in Vancouver", () => {
  assert.equal(halloweenSchedule.timeZone, "America/Vancouver");
  assert.equal(initialHalloweenPreference(date("2026-10-24T06:59:59Z")), false, "Still October23 in Vancouver");
  assert.equal(initialHalloweenPreference(date("2026-10-24T07:00:00Z")), true);
  assert.equal(initialHalloweenPreference(date("2026-11-01T08:59:59Z")), true, "Before the daylight-saving change");
  assert.equal(initialHalloweenPreference(date("2026-11-01T09:00:00Z")), true, "After the daylight-saving change");
  assert.equal(initialHalloweenPreference(date("2026-11-08T07:59:59Z")), true, "Last second of November7 in Vancouver");
  assert.equal(initialHalloweenPreference(date("2026-11-08T08:00:00Z")), false);
});

test("the same Halloween calendar window applies in release and future years", () => {
  for (const year of [2026, 2027, 2028, 2030]) {
    assert.equal(initialHalloweenPreference(date(`${year}-10-23T12:00:00-07:00`)), false);
    assert.equal(initialHalloweenPreference(date(`${year}-10-24T12:00:00-07:00`)), true);
    assert.equal(initialHalloweenPreference(date(`${year}-10-31T12:00:00-07:00`)), true);
    assert.equal(initialHalloweenPreference(date(`${year}-11-07T12:00:00-08:00`)), true);
    assert.equal(initialHalloweenPreference(date(`${year}-11-08T12:00:00-08:00`)), false);
  }
});

test("ordinary first-visit defaults follow all twelve calendar months with a damp Vancouver winter", () => {
  const seasons = ["winter", "winter", "spring", "spring", "spring", "summer", "summer", "summer", "autumn", "autumn", "autumn", "winter"];
  for (let month = 1; month <= 12; month++) {
    const settings = dateDefaults(date(`2027-${String(month).padStart(2, "0")}-15T12:00:00-08:00`));
    assert.equal(settings.season, seasons[month - 1]);
    assert.equal(settings.weather, settings.season === "winter" ? "overcast" : "clear");
    assert.equal(settings.halloween, false, "The ordinary baseline does not independently enable a holiday");
    assert.equal(settings.halloweenChase, defaults.halloweenChase);
  }
  assert.notEqual(dateDefaults(date("2027-07-01T12:00:00Z")), defaults, "Every visit receives its own settings object");
  assert.deepEqual(dateDefaults(date("invalid")), defaults);
});

test("season boundaries use Vancouver dates rather than UTC or the visitor's time zone", () => {
  for (const [instant, expected] of [
    ["2027-03-01T07:59:59Z", "winter"], ["2027-03-01T08:00:00Z", "spring"],
    ["2027-06-01T06:59:59Z", "spring"], ["2027-06-01T07:00:00Z", "summer"],
    ["2027-09-01T06:59:59Z", "summer"], ["2027-09-01T07:00:00Z", "autumn"],
    ["2027-12-01T07:59:59Z", "autumn"], ["2027-12-01T08:00:00Z", "winter"],
    ["2028-02-29T20:00:00Z", "winter"], ["2028-03-01T08:00:00Z", "spring"],
  ]) assert.equal(dateDefaults(date(instant)).season, expected, instant);
});

test("December reserves Christmas eligibility without presenting an unavailable edition", () => {
  assert.deepEqual(seasonalEditionRegistry.christmas, { available: false, annual: { start: [12, 1], end: [12, 31] } });
  for (const day of [1, 25, 31]) {
    const now = date(`2027-12-${String(day).padStart(2, "0")}T12:00:00-08:00`);
    const ordinary = dateDefaults(now), initialized = setHalloween(ordinary, initialHalloweenPreference(now));
    assert.deepEqual(initialized.settings, { ...defaults, season: "winter", weather: "overcast" });
    assert.equal("christmas" in initialized.settings, false);
  }
});

test("manual choice works year-round and expires with the Vancouver calendar year", () => {
  const off = serializeHalloweenPreference(date("2026-10-31T12:00:00-07:00"), false);
  assert.deepEqual(parseHalloweenPreference(off), { year: 2026, enabled: false });
  assert.equal(initialHalloweenPreference(date("2026-11-02T12:00:00-08:00"), off), false);
  assert.equal(initialHalloweenPreference(date("2027-10-31T12:00:00-07:00"), off), true);
  const on = serializeHalloweenPreference(date("2026-07-08T12:00:00-07:00"), true);
  assert.equal(initialHalloweenPreference(date("2026-12-20T12:00:00-08:00"), on), true);
  assert.equal(initialHalloweenPreference(date("2027-01-01T07:59:59Z"), on), true, "Still the prior year in Vancouver");
  assert.equal(initialHalloweenPreference(date("2027-01-01T08:00:00Z"), on), false);
});

test("invalid storage is ignored and invalid dates never activate the seasonal edition", () => {
  const day = date("2026-10-31T12:00:00-07:00");
  for (const value of [undefined, null, false, "invalid JSON", "null", "[]", "true", { year: "2026", enabled: false }, { year: 2026, enabled: "false" }, { year: 2026.5, enabled: false }, { year: -1, enabled: true }]) {
    assert.equal(parseHalloweenPreference(value), null);
    assert.equal(initialHalloweenPreference(day, value), true, "Invalid preference falls back to the date");
  }
  assert.equal(initialHalloweenPreference(date("invalid"), { year: 2026, enabled: true }), false);
  assert.equal(serializeHalloweenPreference(date("invalid"), true), null);
});

test("turning Halloween off restores the exact previous atmosphere while keeping later performance/accessibility choices", () => {
  const normal = { ...defaults, season: "winter", weather: "snow", hour: 8.25, quality: "ultra", markers: false };
  const before = structuredClone(normal);
  const enabled = toggleHalloween(normal);
  assert.deepEqual(normal, before, "Transition does not mutate its input");
  assert.deepEqual(enabled.previous, { season: "winter", weather: "snow", hour: 8.25 });
  assert.deepEqual({ season: enabled.settings.season, weather: enabled.settings.weather, hour: enabled.settings.hour }, halloweenAtmosphere);
  assert.equal(enabled.settings.halloween, true);
  const repeat = setHalloween(enabled.settings, true, enabled.previous);
  assert.deepEqual(repeat.previous, enabled.previous, "Repeated enable does not overwrite the saved atmosphere");
  const changed = normalizeSettings({ ...repeat.settings, quality: "low", population: false, reducedMotion: true, hour: 12, weather: "clear" });
  assert.equal(changed.hour, halloweenAtmosphere.hour);
  assert.equal(changed.weather, halloweenAtmosphere.weather, "Edition atmosphere remains coordinated across UI and renderer");
  const disabled = toggleHalloween(changed, repeat.previous);
  assert.deepEqual(disabled.settings, { ...normal, quality: "low", population: false, reducedMotion: true });
  assert.equal(disabled.previous, null);
  const enabledAgain = toggleHalloween(disabled.settings, disabled.previous);
  assert.deepEqual(enabledAgain.previous, enabled.previous, "A new visit to the edition captures the current ordinary atmosphere");
});

test("an already-off edition leaves ordinary atmosphere untouched and supports deterministic server defaults", () => {
  assert.equal(defaults.halloween, false, "No server-side date or browser storage access during hydration");
  const spring = { ...defaults, season: "spring", hour: 10.5, weather: "rain" };
  assert.deepEqual(setHalloween(spring, false).settings, spring);
  const missingPrior = setHalloween({ ...defaults, ...halloweenAtmosphere, halloween: true }, false);
  assert.deepEqual(missingPrior.settings, defaults);
});

test("sound volume is bounded and survives edition changes", () => {
  for (const [input, expected] of [[-1, 0], [2, 1], [NaN, 0.35], [Infinity, 0.35], [0.2, 0.2]]) {
    const s = normalizeSettings({ ...defaults, halloweenVolume: input });
    assert.equal(s.halloweenVolume, expected);
    const on = setHalloween(s, true);
    assert.equal(setHalloween(on.settings, false, on.previous).settings.halloweenVolume, expected);
  }
});
