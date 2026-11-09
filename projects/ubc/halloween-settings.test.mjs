import test from "node:test";
import assert from "node:assert/strict";
import "./test-loader.mjs";
const { campusDate, scheduledEdition, actualSun } = await import("../campus-atmosphere/calendar.ts");
const { defaults, normalizeSettings } = await import("./environment.ts");

test("Vancouver follows the final B.C. clock change on browsers with older zone data", () => {
  const local = instant => campusDate("ubc", new Date(instant));
  assert.equal(local("2026-03-08T09:59:59Z").offset, -8);
  assert.equal(local("2026-03-08T10:00:00Z").offset, -7);
  for (const [instant, edition] of [
    ["2026-10-24T06:59:59Z", "regular"], ["2026-10-24T07:00:00Z", "halloween"],
    ["2026-11-08T06:59:59Z", "halloween"], ["2026-11-08T07:00:00Z", "christmas"],
    ["2027-01-01T06:59:59Z", "christmas"], ["2027-01-01T07:00:00Z", "regular"],
    ["2027-10-31T12:00:00Z", "halloween"], ["2027-12-25T12:00:00Z", "regular"],
  ]) assert.equal(scheduledEdition(local(instant).date), edition, instant);
  assert.equal(local("2027-03-01T06:59:59Z").season, "winter");
  assert.equal(local("2027-03-01T07:00:00Z").season, "spring");
});
test("Vancouver sunlight follows the observed date and twilight precedes sunrise", () => {
  const sun = instant => actualSun("ubc", campusDate("ubc", new Date(instant)));
  const summer = sun("2026-06-21T20:00:00Z"), winter = sun("2026-12-21T20:00:00Z");
  assert.ok(summer.altitude > winter.altitude && winter.altitude > 0);
  assert.ok(summer.sunset - summer.sunrise > 16 && winter.sunset - winter.sunrise < 9);
  assert.ok(winter.dawn < winter.sunrise && winter.sunset < winter.dusk);
  assert.ok(sun("2026-12-22T08:00:00Z").altitude < 0);
});
test("seasonal editions preserve staged conditions and volume constraints", () => {
  for (const volume of [-1, 0.2, 1, 2, NaN]) {
    const settings = normalizeSettings({ ...defaults, hour: 12, weather:"snow", halloween:true, halloweenVolume:volume });
    assert.equal(settings.hour, 12);
    assert.equal(settings.weather, "snow");
    assert.equal(settings.halloweenVolume, Number.isNaN(volume) ? 0.35 : Math.max(0, Math.min(1,volume)));
  }
});
