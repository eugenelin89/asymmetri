import assert from "node:assert/strict";
import test from "node:test";
import "../campus-reviews/loader.mjs";

async function endpoint(t, at, upstream) {
  let now = Date.parse(at);
  t.mock.method(Date, "now", () => now);
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push(String(url));
    return upstream(String(url), options);
  });
  // A fresh route module represents one new server with an empty observation cache.
  const route = new URL("../../app/labs/campus-weather-api/[campus]/route.ts", import.meta.url);
  route.searchParams.set("test", t.name);
  const { GET } = await import(route.href);
  return {
    setTime(iso) { now = Date.parse(iso); },
    calls,
    get(campus, query = "") {
      const req = new Request("https://example.com/labs/campus-weather-api/" + encodeURIComponent(campus) + query);
      return GET(req, { params: Promise.resolve({ campus }) });
    },
  };
}

test("unknown campus identifiers cannot select a station or spend an upstream request", async (t) => {
  const api = await endpoint(t, "2026-11-08T20:00:00Z", () => Response.error());
  for (const campus of ["https://example.com", "__proto__", "constructor", "Stanford", "KPAO"]) {
    assert.equal((await api.get(campus)).status, 404);
  }
  assert.deepEqual(api.calls, []);
});

const yvr = "https://api.weather.gc.ca/collections/citypageweather-realtime/items/bc-74?f=json";
function vancouver(time, condition = "Light Snow and Fog", code = "yvr") {
  return Response.json({ properties: { currentConditions: {
    station: { code: { en: code }, value: { en: "Vancouver Int'l Airport" } },
    timestamp: { en: time }, condition: { en: condition },
    wind: { speed: { units: { en: "km/h" }, value: { en: 21 } } },
  } } });
}

test("UBC returns the YVR observation and originator with November snowfall, fog and wind", async (t) => {
  const api = await endpoint(t, "2026-11-08T20:13:00Z", () => vancouver("2026-11-08T20:00:00Z"));
  const res = await api.get("ubc", "?station=elsewhere&url=https://example.com");
  assert.equal(res.headers.get("cache-control"), "no-store");
  const report = await res.json();
  assert.equal(report.cached, false);
  assert.equal(report.nextCheckAt, "2026-11-08T20:28:00.000Z");
  assert.equal(report.observation.station, "Vancouver International Airport (YVR)");
  assert.match(report.observation.provider, /Environment and Climate Change Canada/);
  assert.match(report.observation.provider, /Observational data provided by NAV CANADA\. All rights reserved\./);
  assert.equal(report.observation.observedAt, "2026-11-08T20:00:00.000Z");
  assert.equal(report.observation.condition, "Light Snow and Fog");
  assert.equal(report.observation.weather, "snow");
  assert.equal(report.observation.fog, true);
  assert.ok(report.observation.intensity > 0 && report.observation.intensity < 0.5);
  assert.equal(report.observation.windKph, 21);
  assert.deepEqual(api.calls, [yvr]);
});

test("visitors share one active campus refresh and recheck at exactly fifteen minutes", async (t) => {
  const { promise, resolve } = Promise.withResolvers();
  const api = await endpoint(t, "2026-11-08T20:13:00Z", async () => {
    await promise;
    return vancouver("2026-11-08T20:00:00Z");
  });
  const visitors = Promise.all(Array.from({ length: 32 }, () => api.get("ubc")));
  await new Promise(setImmediate);
  assert.deepEqual(api.calls, [yvr]);
  resolve();
  for (const res of await visitors) assert.equal((await res.json()).observation.windKph, 21);
  api.setTime("2026-11-08T20:27:59.999Z");
  assert.equal((await (await api.get("ubc")).json()).cached, true);
  assert.deepEqual(api.calls, [yvr]);
  api.setTime("2026-11-08T20:28:00Z");
  assert.equal((await (await api.get("ubc")).json()).cached, false);
  assert.deepEqual(api.calls, [yvr, yvr]);
});

const westVan = "https://api.weather.gc.ca/collections/swob-realtime/items?msc_id-value=1108824&sortby=-obs_date_tm&limit=1&f=json";
function westVancouver(time, rain, wind) {
  return Response.json({ features: [{ properties: {
    "msc_id-value": "1108824", "data_pvdr-value": "MSC", obs_date_tm: time,
    rnfl_amt_pst1mt: rain, "rnfl_amt_pst1mt-uom": "mm",
    avg_wnd_spd_10m_pst1mt: wind, "avg_wnd_spd_10m_pst1mt-uom": "km/h",
  } }] });
}

test("a stale YVR report selects West Vancouver's measured rain, with no inferred clear sky once rain stops", async (t) => {
  let rain = 0.1;
  const api = await endpoint(t, "2026-11-08T21:31:00Z", (url) => url === yvr
    ? vancouver("2026-11-08T20:00:00Z") : westVancouver("2026-11-08T21:30:00Z", rain, 10.6));
  const wet = (await (await api.get("ubc")).json()).observation;
  assert.equal(wet.station, "West Vancouver (CWWA)");
  assert.equal(wet.provider, "Environment and Climate Change Canada");
  assert.equal(wet.weather, "rain");
  assert.match(wet.condition, /rain/i);
  assert.equal(wet.windKph, 10.6);
  assert.deepEqual(api.calls, [yvr, westVan]);
  rain = 0;
  api.setTime("2026-11-08T21:46:00Z");
  const dry = (await (await api.get("ubc")).json()).observation;
  assert.equal(dry.weather, "neutral");
  assert.match(dry.condition, /sky condition unreported/i);
  assert.equal(dry.windKph, 10.6);
});

test("an outage serves cache at exactly ninety minutes, expires a millisecond later and then recovers", async (t) => {
  let observedAt = "2026-11-08T20:00:00Z";
  const api = await endpoint(t, "2026-11-08T21:15:00Z", (url) => {
    if (!observedAt || url === westVan) throw new TypeError("Station unavailable");
    return vancouver(observedAt);
  });
  assert.equal((await (await api.get("ubc")).json()).cached, false);
  observedAt = null;
  api.setTime("2026-11-08T21:30:00Z");
  const last = await (await api.get("ubc")).json();
  assert.equal(last.observation.observedAt, "2026-11-08T20:00:00.000Z");
  assert.equal(last.cached, true);
  api.setTime("2026-11-08T21:30:00.001Z");
  assert.deepEqual(await (await api.get("ubc")).json(), {
    observation: null, cached: false, nextCheckAt: "2026-11-08T21:45:00.000Z",
  });
  assert.deepEqual(api.calls, [yvr, yvr, westVan]);
  api.setTime("2026-11-08T21:45:00Z");
  observedAt = "2026-11-08T21:42:00Z";
  assert.equal((await (await api.get("ubc")).json()).observation.observedAt, "2026-11-08T21:42:00.000Z");
});

function nws(station, time, description, phenomena = [], layers = []) {
  return Response.json({ properties: {
    station: "https://api.weather.gov/stations/" + station, stationId: station, timestamp: time,
    textDescription: description, presentWeather: phenomena,
    windSpeed: { value: 18.5, unitCode: "wmoUnit:km_h-1", qualityControl: "V" },
    cloudLayers: layers.map((amount) => ({ amount })),
  } });
}

test("a Stanford reporting gap uses Moffett Field; Cleveland and Vancouver keep independent primary reports", async (t) => {
  const routes = {
    KPAO: () => nws("KPAO", "2026-11-08T02:47:00Z", "Clear"),
    KNUQ: () => nws("KNUQ", "2026-11-08T08:10:00Z", "Rain and Fog", [
      { weather: "rain", intensity: "heavy" }, { weather: "fog", intensity: null },
    ]),
    KBKL: () => nws("KBKL", "2026-11-08T08:05:00Z", "Cloudy", [], ["OVC"]),
  };
  const api = await endpoint(t, "2026-11-08T08:20:00Z", (url) => {
    if (url === yvr) return vancouver("2026-11-08T08:00:00Z");
    const match = /^https:\/\/api\.weather\.gov\/stations\/(\w+)\/observations\/latest$/.exec(url);
    return routes[match?.[1]]?.() ?? Response.error();
  });
  const [stanford, cleveland, ubc] = await Promise.all(["stanford", "cwru", "ubc"].map(async (id) => (await (await api.get(id)).json()).observation));
  assert.equal(stanford.station, "Mountain View, Moffett Field (KNUQ)");
  assert.equal(stanford.provider, "U.S. National Weather Service");
  assert.equal(stanford.windKph, 18.5);
  assert.equal(stanford.weather, "rain");
  assert.equal(stanford.fog, true);
  assert.equal(stanford.intensity, 1);
  assert.equal(cleveland.station, "Cleveland, Burke Lakefront Airport (KBKL)");
  assert.equal(cleveland.weather, "overcast");
  assert.equal(ubc.station, "Vancouver International Airport (YVR)");
  assert.equal(api.calls.length, 4);
  for (const id of ["ubc", "stanford", "cwru"]) assert.equal((await (await api.get(id)).json()).cached, true);
  assert.equal(api.calls.length, 4);
});

test("missing ECCC conditions and an unmeasured alternate leave weather unavailable until the next cycle", async (t) => {
  const api = await endpoint(t, "2026-11-08T08:20:00Z", (url) => url === yvr
    ? vancouver("2026-11-08T08:00:00Z", "N/A")
    : westVancouver("2026-11-08T08:12:00Z", null, null));
  assert.deepEqual(await (await api.get("ubc")).json(), {
    observation: null, cached: false, nextCheckAt: "2026-11-08T08:35:00.000Z",
  });
  await api.get("ubc");
  assert.deepEqual(api.calls, [yvr, westVan]);
});

test("a future Cleveland report falls back to Hopkins and nearby showers do not become rain at the station", async (t) => {
  const api = await endpoint(t, "2026-11-08T08:10:00Z", (url) => url.includes("/KBKL/")
    ? nws("KBKL", "2026-11-08T09:52:00Z", "Heavy Rain")
    : nws("KCLE", "2026-11-08T07:51:00Z", "Showers in Vicinity", [
      { weather: "rain", intensity: "heavy", inVicinity: true },
    ], ["SCT", "OVC"]));
  const actual = (await (await api.get("cwru")).json()).observation;
  assert.equal(actual.station, "Cleveland Hopkins International Airport (KCLE)");
  assert.equal(actual.observedAt, "2026-11-08T07:51:00.000Z");
  assert.equal(actual.condition, "Showers in Vicinity");
  assert.equal(actual.weather, "overcast");
  assert.equal(actual.intensity, 0);
});
