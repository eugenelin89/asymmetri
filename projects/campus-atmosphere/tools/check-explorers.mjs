// Run against the normal campus routes with a locally installed Playwright and browser.
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");

const origin = new URL(process.env.CAMPUS_TEST_ORIGIN || "http://localhost:3065");
if (!["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname)) {
  throw new Error("Use a local website for controlled campus visits.");
}
const campuses = [
  { id: "ubc", city: "Vancouver", midnight: 7, time: "13:30" },
  { id: "cwru", city: "Cleveland", midnight: 5, time: "15:30" },
  { id: "stanford", city: "Stanford", midnight: 8, time: "12:30" },
];
const sizes = [{ width: 390, height: 844 }, { width: 820, height: 1180 }, { width: 1440, height: 900 }];
const scenarios = sizes.flatMap(size => campuses.map(campus => ({ ...size, ...campus })));
const browser = await chromium.launch({ executablePath: process.env.CAMPUS_BROWSER });
try {
  for (const { id, city, midnight, time, width, height } of scenarios) {
    const context = await browser.newContext({
      timezoneId: "Asia/Tokyo", reducedMotion: "no-preference", viewport: { width, height }, hasTouch: width < 900,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    let instant = Date.parse("2026-12-10T20:30:00Z");
    let weather = "rain", cached = false, station = "Controlled primary";
    const url = new URL(`/labs/${id}`, origin).href;
    const edition = page.getByRole("combobox", { name: "Campus edition", exact: true });
    const atmosphere = page.getByRole("combobox", { name: "Atmosphere", exact: true });
    const region = page.getByRole("region", { name: /Virtual Campus explorer/ });
    async function resumeAt(time) {
      instant = time;
      await page.clock.setFixedTime(new Date(time));
      await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
    }
    await page.route(`**/labs/campus-weather-api/${id}`, route => route.fulfill({ json: {
      observation: weather && {
        condition: weather === "rain" ? "Light rain" : "Light snow",
        weather, windKph: 17, intensity: .4, fog: false, station,
        provider: id === "ubc" ? "Environment and Climate Change Canada" : "National Weather Service",
        observedAt: new Date(instant - 5 * 60_000).toISOString(),
      }, cached, nextCheckAt: new Date(instant + 15 * 60_000).toISOString(),
    } }));
    // Genuine pre-Christmas device state, including the old CWRU Regular preference.
    await page.addInitScript(campus => {
      localStorage.setItem(`${campus}-halloween-preference-v1`, JSON.stringify({ year: 2026, enabled: true }));
      if (campus === "cwru") {
        localStorage.setItem("cwru-campus-edition-v1", JSON.stringify({ version: 1, choice: "regular" }));
        localStorage.setItem("cwru-halloween-audio-v1", JSON.stringify({ halloweenSound: false, halloweenVolume: .22 }));
      }
    }, id);
    await page.clock.setFixedTime(new Date(instant));
    await page.goto(url);
    const expectChoice = async value => assert.equal(await edition.inputValue(), value);
    const expectWelcome = value => region.locator(`[data-edition="${value}"]`).waitFor();
    const entry = region.getByRole("button", { name: /^(Start exploring|Explore Stanford|Enter if you dare|Enter the Halloween campus)/ });
    const settings = () => page.getByRole("button", { name: "Change atmosphere and campus edition" }).click();
    const close = () => page.getByRole("button", { name: "Close panel" }).click();

    await expectWelcome("christmas");
    await expectChoice("automatic");
    await region.getByText(`Live · ${time} ${city} · Light rain`).waitFor();
    if (id === "cwru") assert.equal(await region.getByRole("checkbox", { name: "Campus sound" }).isChecked(), false);
    const sound = region.getByRole("checkbox", { name: "Campus sound" });
    await sound.setChecked(!await sound.isChecked());
    await sound.setChecked(!await sound.isChecked());
    await page.emulateMedia({ reducedMotion: "reduce" });
    await edition.selectOption("regular");
    await expectWelcome("regular");
    await edition.selectOption("christmas");
    await expectWelcome("christmas");
    await page.reload();
    await expectWelcome("regular");
    await expectChoice("regular");
    await edition.selectOption("halloween");
    await expectWelcome("halloween");
    await region.getByRole("button", { name: "End replay" }).click();
    await expectWelcome("regular");
    await edition.selectOption("automatic");
    await expectWelcome("christmas");

    // Fast entry as soon as the welcome displays the campus-local boundary.
    const nov = Date.UTC(2026, 10, 8, midnight);
    await resumeAt(nov - 1000);
    await expectWelcome("halloween");
    await resumeAt(nov);
    await expectWelcome("christmas");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "Welcome fits the viewport");
    if (width < 900) await entry.tap();
    else {
      await entry.focus();
      await entry.press("Enter");
    }
    await settings();
    await expectChoice("automatic");
    await page.getByText("Christmas edition", { exact: true }).waitFor();
    assert.equal(await page.getByRole("checkbox", { name: /reduce animated movement/i }).isChecked(), true);
    await resumeAt(Date.parse("2026-12-20T20:30:00Z"));
    await page.getByText(/Nearby station: Controlled primary/).waitFor();
    if (id === "cwru") assert.equal(await page.getByRole("slider", { name: "Sound volume" }).inputValue(), "22");
    await page.getByRole("slider", { name: "Sound volume" }).fill("0");
    await page.getByRole("checkbox", { name: "Campus sound" }).uncheck();
    await edition.selectOption("regular");
    await edition.selectOption("halloween");
    await page.getByRole("button", { name: /Halloween evening/ }).click();
    assert.equal(await atmosphere.inputValue(), "simulated");
    await close();
    await page.getByRole("button", { name: "Open photo mode" }).click();
    assert.equal(await page.getByRole("slider", { name: "Photo time" }).inputValue(), "19.5");
    assert.equal(await page.getByRole("combobox", { name: "Photo weather" }).inputValue(), "overcast");
    await page.getByRole("combobox", { name: "Photo weather" }).selectOption("snow");
    await page.getByRole("button", { name: "Return to exploring" }).click();
    await region.getByText(/Simulated · 19:30 .*Snow/).waitFor();
    await page.getByRole("button", { name: "Open photo mode" }).click();
    await atmosphere.selectOption("live");
    assert.equal(await atmosphere.inputValue(), "live");
    const photoTime = page.getByRole("slider", { name: "Photo time" });
    await photoTime.focus();
    await photoTime.press("ArrowLeft");
    assert.equal(await atmosphere.inputValue(), "simulated");
    await page.getByRole("button", { name: "Return to exploring" }).click();
    await settings();
    const jan = Date.UTC(2027, 0, 1, midnight);
    await resumeAt(jan - 1000);
    await expectChoice("halloween");
    await resumeAt(jan);
    await expectChoice("halloween");
    await page.getByRole("button", { name: "End replay" }).click();
    await expectChoice("automatic");
    await page.getByText("Regular edition", { exact: true }).waitFor();
    // Start the separate Automatic boundary scenario before rewinding the
    // fixture to December, when a saved Regular choice would still apply.
    await edition.selectOption("christmas");
    await edition.selectOption("automatic");
    await resumeAt(jan - 1000);
    await page.getByText("Christmas edition", { exact: true }).waitFor();
    await resumeAt(jan);
    await page.getByText("Regular edition", { exact: true }).waitFor();
    assert.equal(await atmosphere.inputValue(), "simulated");
    await atmosphere.selectOption("live");
    station = "Controlled alternate";
    cached = true;
    weather = "snow";
    await resumeAt(jan + 16 * 60_000);
    await page.getByText(/Nearby station: Controlled alternate/).waitFor();
    await page.getByText(/Cached observation/).waitFor();
    await page.getByText("Light snow", { exact: true }).waitFor();
    weather = null;
    await resumeAt(jan + 32 * 60_000);
    await page.getByText("Weather unavailable.", { exact: true }).waitFor();
    weather = "rain";
    cached = false;
    await resumeAt(jan + 48 * 60_000);
    await page.getByText("Light rain", { exact: true }).waitFor();
    // Leave a running, staged replay. BFCache must release the renderer and
    // restore a new welcome for the saved preference before another gesture.
    await edition.selectOption("halloween");
    await close();
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
    assert.equal(await page.locator("canvas").count(), 0);
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    await expectWelcome("regular");
    await expectChoice("automatic");
    await page.reload();
    await expectWelcome("regular");
    await expectChoice("automatic");
    assert.equal(await region.getByRole("checkbox", { name: "Campus sound" }).isChecked(), false);
    await edition.selectOption("christmas");
    await expectWelcome("christmas");
    // Exercise the persisted pageshow branch independently of the browser's
    // decision to keep a dev-server page with a WebSocket in its back/forward cache.
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    await expectWelcome("regular");
    await edition.selectOption("halloween");
    await expectWelcome("halloween");
    await page.goto(new URL("/labs", origin).href);
    await page.goBack();
    await expectWelcome("regular");
    await expectChoice("automatic");
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`${id}: welcome, live station, replay, Photo, expiry and recovery passed at ${width} × ${height}`);
  }
  // Advance the active clock with no resume event. Keep reading the original
  // observation timestamp at both sides of the inclusive freshness boundary.
  for (const { id, midnight } of campuses) {
    for (const [cutoff, before, after] of [
      [Date.UTC(2026, 10, 8, midnight), "halloween", "christmas"],
      [Date.UTC(2027, 0, 1, midnight), "christmas", "regular"],
    ]) {
      const context = await browser.newContext({ timezoneId: "Europe/Paris" });
      const page = await context.newPage();
      await page.clock.install({ time: new Date(cutoff - 2000) });
      await page.clock.pauseAt(new Date(cutoff - 100));
      await page.route("**/labs/campus-weather-api/*", route => route.fulfill({ json: {
        cached: true, nextCheckAt: new Date(cutoff + 14 * 60_000).toISOString(),
        observation: { condition: "Light snow", weather: "snow", intensity: .3, windKph: 12,
          provider: "Fixture", station: "Controlled station", observedAt: new Date(cutoff - 90 * 60_000).toISOString() },
      } }));
      await page.goto(new URL(`/labs/${id}`, origin).href);
      await page.clock.runFor(50); // Also deliver the initial preference-reading animation frame.
      await page.locator(`[data-edition="${before}"]`).waitFor();
      await page.clock.runFor(50);
      const welcome = page.locator(`[data-edition="${after}"]`);
      await welcome.waitFor();
      await welcome.getByText(/Live · 00:00 .*Light snow/).waitFor();
      await page.clock.runFor(1);
      await welcome.getByText(/Weather unavailable\./).waitFor();
      await context.close();
    }
    console.log(`${id}: open pages crossed both local midnights and expired the cached report at 90 minutes + 1 ms`);
  }
} finally {
  await browser.close();
}
