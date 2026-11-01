import { createCampus, type CampusAPI } from "../engine";
import { createFrameSample } from "../performance";
import { extendGeography } from "../extensions";
import { benchmarkScenes, benchmarkSettings } from "./scenes";
import type { CampusData, Anchors } from "../types";
import type { OrchardGeography } from "../residence-exterior";

const element = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const host = element<HTMLDivElement>("scene"), status = element<HTMLParagraphElement>("status");
const station = element<HTMLSelectElement>("station"), form = element<HTMLFormElement>("controls");
const report = element<HTMLTextAreaElement>("report"), cancel = element<HTMLButtonElement>("cancel");
let api: CampusAPI | null = null, running = false, cancelRun: (() => void) | null = null;
let reportUrl: string | null = null;
const results: unknown[] = [];
async function json<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json() as Promise<T>;
}
const assetsStarted = performance.now();
const [world, anchors, residence, source] = await Promise.all([
  json<CampusData>("/ubc/v0.1-2026-10-30/data.json"),
  json<Anchors>("/ubc/v0.1-2026-10-30/anchors.json"),
  json<OrchardGeography>("/ubc/orchard-v0.2-2026-10-31/geography.json"),
  json<Record<string, unknown>>("/source-manifest.json"),
]);
const assetsMs = performance.now() - assetsStarted;
const scenes = benchmarkScenes(anchors);
for (const scene of scenes) station.add(new Option(scene.name, scene.id));
function publish() {
  report.value = JSON.stringify({
    schemaVersion: 1, source, assetsMs,
    limits: [
      "Engine-only harness excludes React shell, network community and audio overhead.",
      "renderSubmitMs is CPU submission including driver stalls, not GPU execution time.",
      "Frame intervals use real RAF timestamps without the movement timestep clamp.",
      "Resource counts are Three.js allocations, not GPU memory bytes; heap is optional browser-wide estimate.",
      "Fixed cameras/settings are repeatable; live animated frames are not pixel-identical.",
      "A phone-sized viewport on a desktop is not physical mobile performance validation.",
    ], results,
  }, null, 2);
  if (reportUrl) URL.revokeObjectURL(reportUrl);
  reportUrl = URL.createObjectURL(new Blob([report.value], { type: "application/json" }));
  const link = element<HTMLAnchorElement>("save-report");
  link.href = reportUrl; link.hidden = false;
}
function heapBytes() {
  return (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? null;
}
async function runScene(scene: (typeof scenes)[number], repetition: number) {
  api?.dispose(); api = null;
  const [width, height] = element<HTMLSelectElement>("size").value.split("x").map(Number);
  host.style.width = `${width}px`; host.style.height = `${height}px`;
  const bounds = host.getBoundingClientRect();
  const quality = element<HTMLSelectElement>("quality").value as "high" | "medium" | "low";
  const runMode = element<HTMLSelectElement>("mode").value;
  const settings = benchmarkSettings(quality, !!scene.halloween, runMode === "frozen", runMode !== "no-population");
  const sample = createFrameSample();
  const started = performance.now(), heapBefore = heapBytes();
  let firstFrameMs: number | null = null, finished = false;
  status.textContent = `${scene.name} · repetition ${repetition} · warming up, then sampling 30 seconds…`;
  await new Promise<void>((resolve) => {
    const finish = (reason?: string) => {
      if (finished) return;
      finished = true;
      if (reason) sample.invalidate(reason);
      cancelRun = null;
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("resize", resized);
      clearTimeout(watchdog);
      resolve();
    };
    const visibility = () => { if (document.hidden) finish("Page hidden during measurement"); };
    const resized = () => finish("Viewport changed during measurement");
    const watchdog = window.setTimeout(() => finish("No complete sample before 120-second watchdog"), 120000);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("resize", resized);
    cancelRun = () => finish("Cancelled by operator");
    if (document.hidden) { finish("Page hidden at start"); return; }
    try {
      api = createCampus(host, extendGeography(structuredClone(world)), structuredClone(anchors),
        () => {}, () => {}, () => {}, () => {}, (error) => finish(error), structuredClone(residence), () => {}, {
          initialPose: scene.pose, settings,
          onFrame(frame) {
            if (finished) return;
            // A newly scheduled RAF can share the timestamp of the prior
            // scene's last frame, earlier than this engine's creation time.
            if (firstFrameMs === null) { firstFrameMs = performance.now() - started; return; }
            const current = host.getBoundingClientRect();
            if (current.width !== bounds.width || current.height !== bounds.height) { finish("Canvas dimensions changed"); return; }
            if (sample.push(frame)) finish();
            else if (sample.invalidReason()) finish(sample.invalidReason()!);
          },
        });
    } catch (error) { finish(error instanceof Error ? error.message : "Engine creation failed"); }
  });
  const result = sample.result();
  const canvas = host.querySelector("canvas");
  results.push({ scene: scene.id, repetition, mode: runMode, measuredAt: new Date().toISOString(),
    hardware: element<HTMLInputElement>("device").value.trim(), userAgent: navigator.userAgent,
    devicePixelRatio, viewport: { width: innerWidth, height: innerHeight },
    canvas: { cssWidth: bounds.width, cssHeight: bounds.height, width: canvas?.width, height: canvas?.height },
    settings, initialPose: scene.pose, firstFrameMs, heapBefore, heapAfter: heapBytes(), ...result });
  publish();
  // The engine is assigned inside the Promise executor above.
  const completedApi = api as CampusAPI | null;
  if (completedApi && result.valid) {
    const png = completedApi.capture();
    const link = element<HTMLAnchorElement>("save-photo");
    link.href = png; link.download = `${scene.id}-${quality}-${runMode}.png`; link.hidden = false;
    const image = element<HTMLImageElement>("preview"); image.src = png; image.hidden = false;
    // Retain each completed capture for comparison, even after an all-scenes run.
    const saved = document.createElement("a");
    saved.href = png; saved.download = `${scene.id}-${quality}-${runMode}-${repetition}.png`;
    saved.textContent = `PNG: ${scene.id} (${repetition})`; saved.dataset.scene = scene.id;
    document.body.append(saved);
  }
  return result.valid;
}
async function run(all: boolean) {
  if (running || !form.reportValidity()) return;
  running = true; cancel.disabled = false;
  const controls = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>("input,select,button")];
  controls.forEach((control) => control.disabled = true);
  const selected = all ? scenes : scenes.filter((scene) => scene.id === station.value);
  let complete = true;
  try {
    outer: for (let n = 1; n <= Number(element<HTMLSelectElement>("repetitions").value); n++) {
      for (const scene of selected) if (!await runScene(scene, n)) { complete = false; break outer; }
    }
    status.textContent = complete ? `Complete · ${results.length} recorded samples. Save JSON and PNG evidence below.` : "Run invalid or cancelled. See report; rerun with the tab visible and viewport unchanged.";
  } catch (error) {
    status.textContent = `Benchmark error: ${error instanceof Error ? error.message : String(error)}`;
  } finally {
    running = false; cancel.disabled = true; controls.forEach((control) => control.disabled = false);
    api?.dispose(); api = null;
  }
}
form.addEventListener("submit", (event) => { event.preventDefault(); void run(false); });
element<HTMLButtonElement>("all").addEventListener("click", () => { void run(true); });
cancel.addEventListener("click", () => cancelRun?.());
// Fixed-camera samples must not accidentally accept gameplay input.
window.addEventListener("keydown", (event) => { if (running && ["w","a","s","d","e","v","m","shift","arrowup","arrowdown","arrowleft","arrowright"].includes(event.key.toLowerCase())) { event.preventDefault(); event.stopImmediatePropagation(); } }, true);
window.addEventListener("pagehide", () => { cancelRun?.(); api?.dispose(); if (reportUrl) URL.revokeObjectURL(reportUrl); });
