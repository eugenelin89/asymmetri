// Run against a local website with Playwright and its Chromium browser.
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = new URL(process.env.CAMPUS_TEST_ORIGIN || "http://localhost:3065");
if (!["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname)) throw new Error("Use a local website.");

const browser = await chromium.launch({ executablePath: process.env.CAMPUS_BROWSER });
try {
  for (const campus of ["ubc", "cwru", "stanford"]) {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const url = new URL(`/labs/${campus}`, origin).href;
    await context.route("**/labs/campus-weather-api/*", route => route.fulfill({
      json: { observation: null, cached: false, nextCheckAt: "2027-10-31T20:15:00Z" },
    }));
    async function enterTab() {
      const tab = await context.newPage();
      await tab.clock.setFixedTime(new Date("2027-10-31T20:00:00Z"));
      await tab.goto(url);
      return tab;
    }
    const edition = tab => tab.getByRole("combobox", { name: "Campus edition", exact: true });
    const welcome = (tab, value) => tab.locator(`[data-edition="${value}"]`).waitFor();
    // A saved December choice belongs to one campus on one browser profile.
    const december = await context.newPage();
    await december.clock.setFixedTime(new Date("2026-12-10T20:00:00Z"));
    await december.goto(url);
    await welcome(december, "christmas");
    await edition(december).selectOption("regular");
    await welcome(december, "regular");
    await december.clock.setFixedTime(new Date("2026-12-20T20:00:00Z"));
    await december.reload();
    await welcome(december, "regular");
    assert.equal(await edition(december).inputValue(), "regular");
    const neighbor = campus === "ubc" ? "stanford" : "ubc";
    await december.goto(new URL(`/labs/${neighbor}`, origin).href);
    await welcome(december, "christmas");
    assert.equal(await edition(december).inputValue(), "automatic");
    const separateDevice = await browser.newContext();
    const other = await separateDevice.newPage();
    await other.clock.setFixedTime(new Date("2026-12-20T20:00:00Z"));
    await other.goto(url);
    await welcome(other, "christmas");
    await separateDevice.close();
    await december.close();

    const first = await enterTab();
    await welcome(first, "halloween");
    await edition(first).selectOption("regular");
    await welcome(first, "regular");
    assert.equal(await edition(first).inputValue(), "regular");
    const second = await enterTab();
    await welcome(second, "halloween");
    assert.equal(await edition(second).inputValue(), "automatic");
    await first.reload();
    await welcome(first, "halloween");
    assert.equal(await edition(first).inputValue(), "automatic");
    const key = `${campus}-explorer-preferences-v1`;
    const sound = tab => tab.getByRole("checkbox", { name: "Campus sound" });
    await sound(second).uncheck();
    await first.waitForFunction(() => [...document.querySelectorAll("label")].find(label => label.textContent.trim() === "Campus sound")?.querySelector("input")?.checked === false);
    assert.equal(await sound(first).isChecked(), false);
    assert.deepEqual(await second.evaluate(key => JSON.parse(localStorage.getItem(key)), key), { sound: false });
    await first.getByRole("button", { name: /^(Start exploring|Explore Stanford|Enter if you dare|Enter the Halloween campus)/ }).click();
    await first.getByRole("button", { name: "Change atmosphere and campus edition" }).click();
    const volume = first.getByRole("slider", { name: "Sound volume" });
    await volume.fill("63");
    assert.equal(await sound(first).isChecked(), false);
    assert.equal(await sound(second).isChecked(), false);
    assert.deepEqual(await second.evaluate(key => JSON.parse(localStorage.getItem(key)), key), { sound: false, volume: .63 });
    // A change from another document sends a native storage event to the explorer.
    await second.evaluate(key => localStorage.setItem(key, JSON.stringify({ sound: false, volume: .21, reducedMotion: false })), key);
    await first.waitForFunction(() => document.querySelector('[aria-label="Sound volume"]').value === "21");
    const motion = first.getByRole("checkbox", { name: /reduce animated movement/i });
    assert.equal(await motion.isChecked(), false);
    await second.evaluate(key => localStorage.removeItem(key), key);
    await first.waitForFunction(() => document.querySelector('[aria-label="Sound volume"]').value !== "21");
    assert.equal(await motion.isChecked(), true);
    assert.equal(await sound(first).isChecked(), true);
    await context.close();
    console.log(`${campus}: visit-only Regular and same-campus preference changes across tabs passed`);
  }
} finally {
  await browser.close();
}
