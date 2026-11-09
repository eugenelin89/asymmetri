// Exercise Live weather at a fixed viewpoint with controlled nearby reports.
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = new URL(process.env.CAMPUS_TEST_ORIGIN || "http://localhost:3065");
if (!["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname)) throw Error("Use a local campus server.");

async function capture(region) {
  await region.getByRole("button", { name: "Capture PNG" }).click();
  const image = region.getByRole("img", { name: /captured view/i });
  const pixels = await image.evaluate(async img => {
    await img.decode();
    const sample = document.createElement("canvas");
    sample.width = 40; sample.height = 32;
    const drawing = sample.getContext("2d");
    drawing.drawImage(img, 0, 0, 40, 32);
    return Array.from(drawing.getImageData(0, 0, 40, 32).data);
  });
  await region.getByRole("button", { name: "Close photo preview" }).click();
  return pixels;
}

const novemberDaylight = {
  ubc: { dawn: "07:38", sunrise: "08:12", sunset: "17:41", dusk: "18:15", night: "21:00 Vancouver" },
  cwru: { dawn: "06:37", sunrise: "07:07", sunset: "17:13", dusk: "17:42", night: "23:00 Cleveland" },
  stanford: { dawn: "06:13", sunrise: "06:41", sunset: "17:04", dusk: "17:31", night: "20:00 Stanford" },
};
async function walkPastSunset(browser, campus) {
  const time = Date.parse("2026-11-09T20:00:00Z");
  const context = await browser.newContext({ viewport: { width: 950, height: 650 }, timezoneId: "Asia/Tokyo" });
  const page = await context.newPage();
  await page.clock.install({ time: new Date(time) });
  await page.route("**/labs/campus-weather-api/*", route => route.fulfill({ json: {
    observation: null, cached: false, nextCheckAt: new Date(time + 15 * 60_000).toISOString(),
  } }));
  await page.goto(new URL("/labs/" + campus, origin).href);
  const region = page.getByRole("region", { name: /Virtual Campus explorer/ });
  await region.getByRole("button", { name: /Start exploring|Explore Stanford/ }).click();
  await region.getByRole("button", { name: "Change atmosphere and campus edition" }).click();
  const events = novemberDaylight[campus];
  const dialog = region.getByRole("dialog");
  await dialog.getByText("Weather unavailable.", { exact: true }).waitFor();
  const daylight = await dialog.innerText();
  for (const [name, value] of [["First light", events.dawn], ["Sunrise", events.sunrise], ["Sunset", events.sunset], ["Last light", events.dusk]]) {
    assert.ok(daylight.includes(name + " " + value), campus + " shows actual-date " + name);
  }
  await dialog.getByRole("button", { name: "Close panel" }).click();
  await region.getByRole("button", { name: "Open photo mode" }).click();
  const day = await capture(region);
  await page.clock.fastForward(8 * 3600_000);
  await region.getByRole("button", { name: "Return to exploring" }).click();
  await region.getByText("Live · " + events.night + " · Weather unavailable.").waitFor();
  await region.getByRole("button", { name: "Open photo mode" }).click();
  const night = await capture(region);
  const average = pixels => pixels.reduce((sum, value) => sum + value, 0) / pixels.length;
  assert.ok(average(night) + 5 < average(day), campus + " scene darkens after sunset during station outage");
  await context.close();
}
const browser = await chromium.launch({ executablePath: process.env.CAMPUS_BROWSER });
try {
  for (const campus of ["ubc", "cwru", "stanford"]) {
    const context = await browser.newContext({
      viewport: { width: 950, height: 650 }, reducedMotion: "reduce", timezoneId: "Asia/Tokyo",
    });
    const page = await context.newPage();
    let now = Date.parse("2026-11-09T20:00:00Z"), weather = "clear", hold = false, deliver;
    let windKph = 0;
    await page.clock.setFixedTime(new Date(now));
    await page.route("**/labs/campus-weather-api/*", async route => {
      const response = {
        observation: weather && { condition: "Fixture " + weather, weather, intensity: .85, windKph, fog: weather === "fog",
          station: "Controlled nearby station", provider: "Fixture", observedAt: new Date(now).toISOString() },
        cached: false, nextCheckAt: new Date(now + 1500).toISOString(),
      };
      if (hold) await new Promise(resolve => { deliver = resolve; });
      await route.fulfill({ json: response });
    });
    await page.goto(new URL("/labs/" + campus, origin).href);
    const region = page.getByRole("region", { name: /Virtual Campus explorer/ });
    await region.getByText(/Live · .*Fixture clear/).waitFor();
    await region.getByRole("button", { name: /Start exploring|Explore Stanford/ }).click();
    await region.getByRole("button", { name: "Open photo mode" }).click();
    const mode = region.getByRole("combobox", { name: "Atmosphere", exact: true });
    const weatherSelect = region.getByRole("combobox", { name: "Photo weather" });
    async function refresh() {
      now += 2000;
      await page.clock.setFixedTime(new Date(now));
      await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
    }
    const clear = await capture(region);
    for (const condition of ["overcast", "rain", "snow", "fog"]) {
      weather = condition;
      windKph = 35;
      await refresh();
      await page.waitForFunction(value => document.querySelector('[aria-label="Photo weather"]')?.value === value, condition);
      const samples = await capture(region);
      const difference = samples.reduce((sum, value, i) => sum + Math.abs(value - clear[i]), 0) / samples.length;
      assert.ok(difference > 1, campus + " Live " + condition + " changes the rendered viewpoint");
    }
    weather = null;
    await refresh();
    await page.waitForFunction(() => document.querySelector('[aria-label="Photo weather"]')?.value === "neutral");
    assert.equal(await mode.inputValue(), "live");
    hold = true;
    weather = "rain";
    await refresh();
    const deadline = Date.now() + 10_000;
    while (!deliver && Date.now() < deadline) await page.waitForTimeout(50);
    assert.ok(deliver, "The explorer requested another nearby observation");
    await weatherSelect.selectOption("snow");
    assert.equal(await mode.inputValue(), "simulated");
    const finished = page.waitForResponse(response => response.url().includes("/labs/campus-weather-api/"));
    deliver();
    await finished;
    assert.equal(await weatherSelect.inputValue(), "snow");
    await mode.selectOption("live");
    await page.waitForFunction(() => document.querySelector('[aria-label="Photo weather"]')?.value === "rain");
    await context.close();
    await walkPastSunset(browser, campus);
    console.log(campus + ": Live weather, delayed recovery and actual-date sunset during outage passed");
  }
} finally {
  await browser.close();
}
