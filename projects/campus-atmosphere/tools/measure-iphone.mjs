// Run on the checkout's Node version. The phone must be able to reach SITE_ORIGIN.
import { readFile, writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";
import { christmasWalks } from "../christmas-walks.ts";

const origin = process.env.SITE_ORIGIN;
const driver = process.env.SAFARIDRIVER_URL;
const build = process.env.BUILD_ID;
const output = process.env.RESULTS_FILE;
if (!origin || !driver || !build || !output) throw Error("Set SITE_ORIGIN, SAFARIDRIVER_URL, BUILD_ID and RESULTS_FILE");
const campuses = process.argv.slice(2);
if (!campuses.length) campuses.push("cwru", "ubc", "stanford");
if (campuses.some(campus => !christmasWalks[campus])) throw Error("Unknown campus");

async function request(path, body, method = body ? "POST" : "GET") {
  const response = await fetch(driver + path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const { value } = await response.json();
  if (!response.ok) throw Error(value.error + " " + value.message);
  return value;
}
const existing = process.env.SAFARI_SESSION_ID;
const session = existing || (await request("/session", { capabilities: { alwaysMatch: {
  browserName: "Safari", platformName: "iOS", "safari:deviceType": "iPhone", "safari:useSimulator": false,
} } })).sessionId;
const command = (path, body) => request("/session/" + session + path, body);
const js = (script, ...args) => command("/execute/sync", { script, args });
const invoke = (fn, ...args) => js("return (" + fn.toString() + ")(...arguments)", ...args);
async function waitFor(fn, seconds = 45, interval = 220) {
  const start = Date.now();
  while (Date.now() - start < seconds * 1000) {
    const value = await fn();
    if (value) return value;
    await sleep(interval);
  }
  throw Error("Timed out waiting for " + fn.toString());
}
const welcome = "[data-edition] button[class*=primary]";
const atmosphere = "button[aria-label='Change atmosphere and campus edition']";
const ready = () => js("return !!document.querySelector(arguments[0])", atmosphere);
async function element(selector) {
  const result = await command("/element", { using: "css selector", value: selector });
  return "/element/" + Object.values(result)[0];
}

async function enter(campus, edition) {
  await command("/url", { url: origin + "/labs/" + campus });
  await waitFor(() => js("return !!document.querySelector('[data-edition] select')"));
  await js(`localStorage.setItem(arguments[0]+'-explorer-preferences-v1',JSON.stringify({
    quality:'low',sound:true,volume:.42,markers:true,population:true,reducedMotion:false
  }));`, campus);
  await command("/refresh", {});
  await waitFor(() => js("return !!document.querySelector('[data-edition] select')"));
  await js(`const [edition]=arguments,select=document.querySelector('[data-edition] select');
    if (document.querySelector('[data-edition]').dataset.edition !== edition) {
      select.value=edition;select.dispatchEvent(new Event('change',{bubbles:true}));
    }`, edition);
  await waitFor(() => js("return document.querySelector('[data-edition]')?.dataset.edition===arguments[0]", edition));
  await invoke(function prepare(button) {
    const start = document.querySelector(button);
    window.iphoneAudio = [];
    window.AudioContext = class extends window.AudioContext {
      constructor(...args) { super(...args); window.iphoneAudio.push(this); }
    };
    window.iphoneEntry = { touches: 0, activations: [] };
    start.addEventListener("pointerdown", event => {
      if (event.isTrusted && event.pointerType === "touch") window.iphoneEntry.touches++;
    });
    for (const type of ["click", "keydown"]) start.addEventListener(type, event => {
      if (event.isTrusted) window.iphoneEntry.activations.push(event.key || event.pointerType || event.type);
    });
    // Keep document scrollY at zero while targeting the below-fold welcome button.
    // On iOS 26.5.2 SafariDriver offsets native touch coordinates by scrollY.
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.style.overflow = "hidden";
    document.body.style.height = "100dvh";
    document.body.style.overflowY = "auto";
    start.scrollIntoView({ block: "center", behavior: "instant" });
  }, welcome);
  const start = await element(welcome);
  for (let i = 0; i < 3 && await js("return !!document.querySelector('[data-edition]')"); i++) {
    await command(start + "/click", {});
    await sleep(450);
  }
  if (await js("return !!document.querySelector('[data-edition]')")) {
    await command(start + "/value", { text: "\uE007" });
  }
  await waitFor(ready, 90);
  await js(`document.documentElement.style.removeProperty('overflow');document.body.style.removeProperty('height');
    document.body.style.removeProperty('overflow-y');window.scrollTo({top:0,behavior:'instant'})`);
  const entry = await js("return {...window.iphoneEntry,contexts:window.iphoneAudio.map(c=>c.state),session:navigator.audioSession?.type}");
  await js("document.querySelector(arguments[0]).click()", atmosphere);
  await waitFor(() => js("return !!document.querySelector('select[aria-label=weather]')"));
  await js("[...document.querySelectorAll('[role=dialog] button')].find(b=>b.textContent==='Midday').click()");
  for (const [name, value] of [["season", "winter"], ["weather", "rain"]]) {
    await js("const s=document.querySelector('select[aria-label='+arguments[0]+']');s.value=arguments[1];s.dispatchEvent(new Event('change',{bubbles:true}))", name, value);
  }
  const settings = await js(`return [...document.querySelectorAll('[role=dialog] label')].map(l=>[l.textContent.trim(),l.querySelector('select')?.value]).filter(p=>p[1])`);
  for (const value of ["winter","rain","low"]) {
    if (!settings.some(([, selected]) => selected === value)) throw Error("Did not restore " + value);
  }
  await js("document.querySelector('button[aria-label=\"Close panel\"]').click()");
  await waitFor(() => js("return !document.querySelector('[role=dialog]') && /Simulated · 12:00.+Rain/.test(document.body.innerText)"));
  return entry;
}

// Executes in the page, independently of the application render loop. Read pose
// from the mounted engine. Movement only uses events on the public canvas.
function follow(points, campus) {
  const canvas = document.querySelector("canvas"), host = canvas.parentElement;
  let fiber = host[Object.keys(host).find(key => key.startsWith("__reactFiber"))];
  while (fiber && !window.iphonePose) {
    for (let hook = fiber.memoizedState; hook; hook = hook.next) {
      const ref = hook.memoizedState?.current;
      if (typeof ref?.position === "function" && typeof ref.input === "function") {
        window.iphonePose = () => ref.position();
        break;
      }
    }
    fiber = fiber.return;
  }
  if (!window.iphonePose) throw Error("Cannot read mounted explorer pose");
  const pose = window.iphonePose;
  const pressed = new Set(), intervals = [];
  const width = innerWidth, height = innerHeight;
  let checkpoint = 1, start, previous, best = Infinity, progress, stopped = false;
  function inputs(keys) {
    for (const key of new Set([...pressed, ...keys])) {
      if (pressed.has(key) === keys.includes(key)) continue;
      canvas.dispatchEvent(new KeyboardEvent(keys.includes(key) ? "keydown" : "keyup", { bubbles: true, key }));
      if (keys.includes(key)) pressed.add(key); else pressed.delete(key);
    }
  }
  function stop(status) {
    if (stopped) return;
    stopped = true;
    inputs([]);
    document.removeEventListener("visibilitychange", interrupt);
    window.removeEventListener("resize", interrupt);
    canvas.removeEventListener("webglcontextlost", interrupt);
    const times = intervals.sort((a,b) => a-b);
    const at = p => times[Math.ceil(times.length*p)-1];
    const seconds = (previous-start)/1000;
    window.iphoneWalk = { status, checkpoint, width, height, frames:times.length, seconds,
      p50:at(.5), p95:at(.95), p99:at(.99), max:times.at(-1), over50:times.filter(ms=>ms>50).length,
      meanFps:times.length/seconds, medianFps:1000/at(.5) };
  }
  function interrupt(event) { stop(event.type); }
  document.addEventListener("visibilitychange", interrupt);
  window.addEventListener("resize", interrupt);
  canvas.addEventListener("webglcontextlost", interrupt);
  function frame(t) {
    if (stopped) return;
    if (document.hidden || width !== innerWidth || height !== innerHeight) { stop("interrupted"); return; }
    if (start === undefined) start = progress = t; else intervals.push(t-previous);
    previous = t;
    const p = pose();
    let [x,z] = points[checkpoint], distance = Math.hypot(p.x-x,p.z-z);
    if (distance<.34) {
      if (++checkpoint === points.length) { stop(t-start>=30000 ? "arrived" : "too short"); return; }
      [x,z] = points[checkpoint]; distance = Math.hypot(p.x-x,p.z-z);
      best = Infinity; progress = t;
    }
    if (distance<best-.05) { best=distance; progress=t; }
    if (t-progress>12000) { stop("stalled"); return; }
    const targetYaw = Math.atan2(p.x-x,p.z-z);
    const err = Math.atan2(Math.sin(targetYaw-p.yaw),Math.cos(targetYaw-p.yaw));
    const keys = [];
    if (err>.019) keys.push("ArrowLeft");
    if (err<-.019) keys.push("ArrowRight");
    if (Math.abs(err)<.16) keys.push("w");
    // Walk the final CWRU straight at normal walking speed for a >=30 s sample.
    if (distance>1.6 && !(campus==="cwru" && checkpoint===points.length-1)) keys.push("Shift");
    inputs(keys);
    requestAnimationFrame(frame);
  }
  canvas.focus({preventScroll:true});
  setTimeout(() => requestAnimationFrame(frame),5000);
}
const hud = () => js("return document.querySelector('[class*=location] strong')?.textContent");
async function touchDoor(points) {
  // Back out along the final approach, retaining the inward-facing heading.
  const [insideX,insideZ] = points.at(-1), [doorX,doorZ] = points.at(-2);
  const length = Math.hypot(insideX-doorX,insideZ-doorZ);
  const dx = (insideX-doorX)/length, dz = (insideZ-doorZ)/length;
  const progress = () => invoke(function(x,z,dx,dz) {
    const p=window.iphonePose();return (p.x-x)*dx+(p.z-z)*dz;
  },doorX,doorZ,dx,dz);
  const key = (name,down) => js("document.querySelector('canvas').dispatchEvent(new KeyboardEvent(arguments[1]?'keydown':'keyup',{key:arguments[0],bubbles:true}))",name,down);
  const indoor = await hud();
  await key("s", true);
  try { await waitFor(async () => (await progress()) < -.75, 24); } finally { await key("s",false); }
  await sleep(550);
  const outdoor = await hud();
  const control = 'button[aria-label="↑"]';
  await js(`const b=document.querySelector(arguments[0]);window.iphoneDoor=[];
    for(const t of ['pointerdown','pointerup'])b.addEventListener(t,e=>window.iphoneDoor.push([t,e.pointerType,e.isTrusted]))`, control);
  const forward = await element(control);
  try {
    // On this physical SafariDriver session an element click delivers touch
    // down. Release actions flushes the outstanding contact after traversal.
    await command(forward + "/click", {});
    await waitFor(async () => (await progress()) >= length-.6, 22);
  } finally {
    await request("/session/"+session+"/actions",undefined,"DELETE");
  }
  await sleep(550);
  const result = { outdoor, indoor: await hud(), events: await js("return window.iphoneDoor") };
  if (result.indoor !== indoor || result.outdoor === result.indoor ||
      !result.events.some(([event,type,trusted])=>event==="pointerdown" && type==="touch" && trusted)) throw Error("Touch verification failed " + JSON.stringify(result));
  return result;
}

let report;
try { report = JSON.parse(await readFile(output,"utf8")); }
catch(error) { if (error.code !== "ENOENT") throw error; report = { build, runs:[], touch:{} }; }
if (report.build !== build) throw Error("Use a new results file for this build");
const save = () => writeFile(output, JSON.stringify(report,null,2)+"\n");
try {
  for (const campus of campuses) {
    for (let run = 1; run<=3; run++) for (const edition of ["regular","christmas"]) {
      const prior = report.runs.find(r=>r.campus===campus && r.run===run && r.edition===edition);
      if (prior) continue;
      const entry = await enter(campus,edition);
      console.log("Starting",campus,edition,run,entry);
      const points = christmasWalks[campus].path;
      await invoke(follow,points,campus);
      const sample = await waitFor(()=>js("return window.iphoneWalk"),300,1800);
      if (sample.status!=="arrived") throw Error(JSON.stringify({campus,edition,run,sample}));
      await sleep(500);
      const location = await hud();
      if (!/Level [1G]|Atrium/i.test(location)) throw Error("Unexpected destination " + location);
      report.runs.push({campus,edition,run,utc:new Date().toISOString(),location,entry,...sample});
      await save();
      console.log("Finished",campus,edition,run,sample.seconds,sample.p95,location);
      if (edition==="christmas" && !report.touch[campus]) {
        try { report.touch[campus]=await touchDoor(points); await save(); }
        catch(error) { console.error("Touch check pending",campus,error.message); }
      }
    }
  }
} finally {
  if (!existing) await request("/session/"+session,undefined,"DELETE");
}
