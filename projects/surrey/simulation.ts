// SPDX-License-Identifier: MIT — fictional characters/events; no real incident data.
import { createWorld, distance, move, route } from "./world";
import type { City, Dialogue, Point, Snapshot, Stage } from "./types";
import { evidence, witnesses, storyLocations, mysteryVerdict } from "./story";
import { encounters, encounterLocations } from "./encounters";
import type { SavedGame } from "./save";
import { newTime, advanceTime, timePhase } from "./time";
import { newMissing, missingLocations, missingClues, missingWitnesses, missingReady } from "./missing";
export function seeded(seed: number) {
  const next = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Object.assign(next, { getState: () => seed >>> 0, setState: (value: number) => { seed = value >>> 0; } });
}
const objectives: Record<Stage, string> = {
  available: "Meet Alex by the station",
  clue: "Find the yellow transit slip",
  chase: "Recover the backpack · sprint or call out",
  return: "Return the backpack to Alex",
  completed: "Welcome to Surrey · explore the city",
  failed: "Try again · speak with Alex",
};
export function createSimulation(city: City, seed = 2061030) {
  const world = createWorld(city),
    random = seeded(seed),
    anchor = city.anchors;
  const story = storyLocations(city, world), locations = encounterLocations(city, world);
  const missingPoints = missingLocations(city, world);
  const cooldowns: Record<string, number> = {};
  let encounterCooldown = 24, encounterPath: Point[] = [], encounterIndex = 1;
  const spawn = world.safe(anchor.spawn),
    thiefPath = route(world, anchor.thief, anchor.escape);
  let thiefIndex = 1,
    chaseTime = 0,
    drop = false,
    dangerCooldown = 12,
    dangerTime = 0,
    active = false,
    stolen = 0,
    caught = false,
    exhausted = false,
    clock = 0,
    noticeUntil = 0;
  const state: Snapshot = {
    time: newTime(), missing: newMissing(), trust: 0, stableVisibility: false, volume: 0,
    player: {
      x: spawn[0],
      z: spawn[1],
      yaw: Math.PI,
      moving: false,
      running: false,
      blocked: false,
    },
    health: 100,
    stamina: 100,
    money: 20,
    inventory: [],
    stage: "available",
    objective: objectives.available,
    marker: anchor.owner,
    nearby: null,
    dialogue: null,
    message: "A city of small stories. Start with the gold marker.",
    elapsed: 0,
    thief: [...anchor.thief],
    danger: { active: false, position: [...anchor.danger], seconds: 0 },
    calm: false,
    mystery: false,
    helped: false,
    street: "Surrey Central",
    mode: "ground", follow: true, cameraYaw: 0, mature: false,
    investigation: { stage: "available", evidence: [], witnesses: [], conclusion: "", reward: 0 },
    encounter: null, resolved: [], waypoint: null,
  };
  function say(speaker: string, text: string, action?: string) {
    state.dialogue = { speaker, text, action };
    state.player.moving = false;
  }
  function notify(text: string) {
    state.message = text;
    noticeUntil = clock + 7;
  }
  const playerPoint = (): Point => [state.player.x, state.player.z];
  function near(p: Point, r = 5) {
    return distance(playerPoint(), p) < r && world.clear(playerPoint(), p);
  }
  function stage(next: Stage) {
    state.stage = next;
    state.objective = objectives[next];
    refresh();
  }
  function refresh() {
    state.marker =
      state.stage === "clue"
        ? anchor.clue
        : state.stage === "chase"
          ? state.thief
          : state.stage === "completed"
            ? anchor.mystery
            : anchor.owner;
    state.objective = objectives[state.stage];
    if ((state.stage === "completed" && state.investigation.stage !== "available") || (state.stage === "available" && ["active", "inconclusive"].includes(state.investigation.stage))) {
      state.objective = state.investigation.stage === "closed" ? "Both cases closed · explore Surrey" : "The Surrey Central Mystery · follow the journal leads";
      state.marker = state.waypoint?.point ?? anchor.mystery;
    }
    if (state.missing.stage === "investigating" || state.missing.stage === "return") {
      state.objective = state.missing.stage === "return" ? "Return to Tess with Riley’s wishes" : missingReady(state.missing) ? "Find Riley at Holland Park" : "The Missing Person · compare the journal leads";
      state.marker = state.waypoint?.point ?? (state.missing.stage === "return" ? missingPoints.tess : missingReady(state.missing) ? missingPoints.riley : state.missing.approach === "people" ? missingPoints.mo : missingPoints.notice);
    }
    state.nearby =
      active && near(state.danger.position)
        ? "Call for help"
        : near(anchor.owner)
          ? "Talk to Alex"
          : state.stage === "clue" && near(anchor.clue)
            ? "Examine transit slip"
            : state.stage === "chase" && near(state.thief)
              ? drop
                ? "Pick up backpack"
                : "Call out to the runner"
              : near(anchor.community)
                ? "Talk to Sam & Jo"
                : near(anchor.mystery)
                  ? "Inspect the sealed case"
                  : null;
    if (state.investigation.stage !== "available") {
      const clue = evidence.find(e => e.id !== "watch" && !state.investigation.evidence.includes(e.id) && near(story[e.id], 4));
      const witness = witnesses.find(w => near(story[w.id], 5));
      if (clue) state.nearby = `Inspect ${clue.name.split(" ·")[0]}`;
      else if (witness) state.nearby = `Talk to ${witness.name.split(" ·")[0]}`;
    }
    if (state.encounter && near(state.encounter.position, state.encounter.phase === "offer" ? 7 : 5)) state.nearby = state.encounter.phase === "chase" ? "Recover Cleo’s portfolio" : "Respond to street encounter";
    const missingTarget = nearbyMissing();
    if (missingTarget) state.nearby = missingTarget === "tess" ? "Talk to Tess" : missingTarget === "riley" ? "Talk to Riley" : missingClues.some(c => c.id === missingTarget) ? "Inspect workshop clue" : `Talk to ${missingTarget === "mo" ? "Mo" : "Eden"}`;
    if (state.mode === "aerial") state.nearby = null;
    state.danger.active = active;
    state.danger.seconds = Math.ceil(dangerTime);
    state.street = world.streetAt(playerPoint());
  }
  function interact() {
    if (state.mode === "aerial") return;
    if (state.dialogue) {
      dismiss();
      return;
    }
    refresh();
    if (interactMissing()) { refresh(); return; }
    if (state.encounter && near(state.encounter.position, state.encounter.phase === "offer" ? 7 : 5)) {
      const def = encounters.find(e => e.id === state.encounter!.id)!;
      if (state.encounter.phase === "chase") finishEncounter("You return Cleo’s portfolio. The terrible portrait lives to disappoint another day. +$20", 20);
      else if (state.encounter.phase === "pursuit") { finishEncounter("You call for help. The robber retreats; the street is clear."); }
      else state.dialogue = { speaker: def.speaker, text: `${timePhase(state.time.minutes) === "Night" ? "The evening crowd has thinned. " : ""}${state.encounter.variant ? def.text : def.alternate ?? def.text}${state.trust > 0 && def.id === "community" ? " Jo remembers your help and greets you by name." : ""}`, choices: def.choices, context: `encounter:${def.id}` };
      refresh(); return;
    }
    if (state.investigation.stage !== "available") {
      const clue = evidence.find(e => e.id !== "watch" && !state.investigation.evidence.includes(e.id) && near(story[e.id], 4));
      const witness = witnesses.find(w => near(story[w.id], 5));
      if (clue) { collect(clue.id); say("Evidence recorded", clue.text); refresh(); return; }
      if (witness) {
        if (!state.investigation.witnesses.includes(witness.id)) state.investigation.witnesses.push(witness.id);
        say(witness.name, witness.text); refresh(); return;
      }
    }
    if (active && near(state.danger.position)) {
      active = false;
      dangerCooldown = 90;
      state.money += stolen;
      stolen = 0;
      notify(
        "You called for help. The pickpocket backs off; your money is safe.",
      );
    } else if (near(anchor.owner)) {
      if (state.stage === "available" || state.stage === "failed")
        say(
          "Alex · commuter",
          "Someone ran off with my orange backpack. My lunch is in there. So is a manuscript nobody asked for. Can you help? They dropped a yellow transit slip just north of here.",
          "Take the case",
        );
      else if (state.stage === "return") {
        state.inventory = state.inventory.filter(
          (i) => i !== "Alex’s backpack",
        );
        state.money += 35;
        stage("completed");
        say(
          "Alex · commuter",
          state.investigation.stage === "closed" ? "My manuscript! And the sandwich survived. Here’s $35. Two closed cases — you have earned a quiet walk through the city. Thanks for helping." : "My manuscript! And the sandwich survived. Here’s $35. A strange sealed case turned up nearby, if your detective career isn’t over already. Thanks for helping.",
        );
        notify("MISSION COMPLETE · Welcome to Surrey · +$35");
      } else if (state.stage === "completed")
        say(
          "Alex · commuter",
          "You rescued my lunch and a deeply unnecessary novel. A good day. Try the blue community marker or the sealed case.",
        );
      else
        say(
          "Alex · commuter",
          "Follow the gold marker. You can sprint, or call out once you get close. Please don’t start a fight over my sandwich.",
        );
    } else if (state.stage === "clue" && near(anchor.clue)) {
      state.inventory.push("Yellow transit slip");
      stage("chase");
      chaseTime = 0;
      say(
        "A small clue",
        "Fresh orange fabric caught on the slip. A runner with the backpack is farther north. Catch up and press E to call out. Sam and Jo at the blue marker also know a shortcut through this story.",
      );
    } else if (state.stage === "chase" && near(state.thief)) {
      state.inventory.push("Alex’s backpack");
      stage("return");
      say(
        "The runner · fictional character",
        drop
          ? "The backpack is on the pavement. You found it before the story could get any stranger."
          : "All right, all right. Take it. I thought it was full of rare trading cards. It’s just a sandwich and 400 pages about a haunted parking meter.",
      );
    } else if (near(anchor.community)) {
      if (!state.helped) {
        state.helped = true; state.trust = Math.min(3, state.trust + 1);
        state.health = Math.min(100, state.health + 15);
      }
      if (state.stage === "chase") {
        drop = true;
        notify(
          "Jo calls across the plaza. The runner leaves the backpack behind.",
        );
      }
      say(
        "Sam & Jo · neighbours",
        "Sam: I’m staying in a shelter while I look for a room. Jo’s an outreach worker and a ferocious crossword rival. Jo: Take some water. We look out for each other here. That runner? I can persuade them to leave the bag.",
      );
    } else if (near(anchor.mystery)) {
      const investigation = state.investigation;
      if (investigation.stage === "available") {
        state.mystery = true; investigation.stage = "active"; collect("watch");
        say("Case 02 · The Surrey Central Mystery", "A fictional courier, Elliot Bell, has been killed. There is no body or graphic scene: a sealed case holds a broken watch. Nina, at the purple witness marker west of here, heard an argument. Examine the tagged parcel beside this scene, then compare witness accounts. Open Journal for leads. The gold marker returns to this case when you are ready to submit a theory.");
      } else if (investigation.stage === "closed") say("Case 02 · Closed", investigation.conclusion);
      else state.dialogue = { speaker: "Case 02 · Review the evidence", text: "A watch is not a clock. A stain is not proof. Who is connected to C17 at the corrected time? Three clues and two witness accounts are needed to submit a theory; stronger corroboration earns a conclusive outcome.", context: "conclusion", choices: [
        ...(investigation.evidence.length >= 3 && investigation.witnesses.length >= 2 ? [{ id: "mara", label: "Mara · the cart and corrected time" }, { id: "theo", label: "Theo · the first courier theory" }, { id: "rowan", label: "Rowan · the red cloth theory" }, { id: "uncertain", label: "Submit an inconclusive report" }] : []),
        { id: "leave", label: "Keep investigating" }] };
    }
    refresh();
  }
  function nearbyMissing() {
    const m = state.missing;
    if (near(missingPoints.tess, 4)) return "tess";
    if (m.stage === "available" || m.stage === "closed") return null;
    if (missingReady(m) && near(missingPoints.riley, 5)) return "riley";
    return [...missingClues.filter(c => !m.clues.includes(c.id)), ...missingWitnesses].find(c => near(missingPoints[c.id as keyof typeof missingPoints], 4))?.id ?? null;
  }
  function interactMissing() {
    const id = nearbyMissing(), m = state.missing;
    if (!id) return false;
    if (id === "tess") {
      if (m.stage === "available") state.dialogue = { speaker: "Tess · The Missing Person", text: "My friend Riley Vale is an adult who organises our art workshop. They missed our usual check-in and their phone is off. Could you help find out if they’re all right? Mo is at the bus loop; the library has our workshop notice. Please respect Riley’s choices.", context: "missing:start", choices: [{ id: "people", label: "Start with people · compare two witnesses" }, { id: "trail", label: "Follow the paper trail · corroborate two clues" }, { id: "leave", label: "Come back later" }] };
      else if (m.stage === "return") {
        const reward = m.ending === "reunion" ? 75 : 60;
        state.money += Math.max(0, reward - m.reward); m.reward = reward; m.stage = "closed"; state.trust = Math.min(3, state.trust + 1); state.waypoint = null;
        say("Case 03 · The Missing Person · Complete", m.ending === "message" ? "You pass on Riley’s message without sharing their location. Tess is relieved and agrees to wait for their call. Riley keeps the quiet afternoon they asked for. +$60 and Jo’s trust." : "Riley agreed to meet Tess at the next workshop. Tess apologises for jumping to conclusions about the van. A reunion, on Riley’s terms. +$75 and Jo’s trust.");
        notify(`CASE 03 COMPLETE · ${m.ending === "message" ? "Privacy respected" : "A reunion by consent"} · +$${reward}`);
      } else if (m.stage === "closed") say("Tess · friend", "Riley has checked in. Thank you for listening to them, and checking the evidence before believing the van story.");
      else state.dialogue = { speaker: "Tess · compare your leads", text: "Mo’s first impression may be wrong. Talk to Eden about the van; compare the notice and receipt. You can change your investigation approach without losing evidence.", context: "missing:start", choices: [{ id: "people", label: "Use witness accounts" }, { id: "trail", label: "Use the paper trail" }, { id: "leave", label: "Keep investigating" }] };
    } else if (id === "riley") state.dialogue = { speaker: "Riley · a quiet afternoon", text: "I’m safe. I walked here because I needed space after organising the workshop. That van was Eden’s equipment delivery. I should have left Tess a clearer message. Please let me choose what happens next.", context: "missing:ending", choices: [{ id: "message", label: "Offer to relay a message; keep their location private" }, { id: "reunion", label: "Ask whether they want to arrange a reunion" }, { id: "leave", label: "Give them time" }] };
    else {
      const clue = missingClues.find(c => c.id === id), witness = missingWitnesses.find(w => w.id === id);
      if (clue) { m.clues.push(id); state.inventory.push(clue.name); say("Case 03 · evidence recorded", clue.text); }
      if (witness) { if (!m.witnesses.includes(id)) m.witnesses.push(id); say(witness.name, witness.text); }
      if (missingReady(m)) { state.waypoint = null; notify("The accounts agree · find Riley near the Holland Park fountain. Pin the lead in Journal."); }
    }
    return true;
  }
  function chooseMissing(context: string, id: string) {
    if (id === "leave") return;
    const m = state.missing;
    if (context === "missing:start" && (id === "people" || id === "trail")) { m.stage = "investigating"; m.approach = id; state.waypoint = null; notify("CASE 03 · The Missing Person · new leads in Journal"); }
    else if (context === "missing:ending" && (id === "message" || id === "reunion")) {
      m.ending = id; m.stage = "return"; state.waypoint = null;
      say("Riley · your choice matters", id === "message" ? "Please tell Tess I’m safe and will call tonight. Keep this spot between us. Thank you for asking." : "Yes. Tell Tess I’ll meet them at tomorrow’s workshop. I’d like to reconnect, but first I need this afternoon to myself.");
    }
  }
  function dismiss() {
    const dialog: Dialogue | null = state.dialogue;
    if (dialog?.choices) return; // A choice must be explicit; E cannot accept the first option.
    state.dialogue = null;
    if (dialog?.action) {
      state.inventory = state.inventory.filter(i => i !== "Yellow transit slip" && i !== "Alex’s backpack");
      state.thief = [...anchor.thief];
      thiefIndex = 1;
      drop = false;
      stage("clue");
    }
    refresh();
  }
  function recover() {
    const p = world.safe(anchor.spawn);
    state.player = {
      ...state.player,
      x: p[0],
      z: p[1],
      moving: false,
      blocked: false,
    };
    state.health = 100;
    state.stamina = 100;
    active = false;
    stolen = 0;
    dangerCooldown = 30;
    state.dialogue = null;
    state.encounter = null; encounterCooldown = 60;
    notify("Back at Surrey Central. Your mission progress is safe.");
    refresh();
  }
  function tick(dt: number, dx = 0, dz = 0, sprint = false) {
    dt = Math.max(0, Math.min(0.1, dt));
    if (state.dialogue || state.mode === "aerial") return;
    clock += dt;
    state.time = advanceTime(state.time, dt);
    state.elapsed = clock;
    if (state.stamina <= 1) exhausted = true;
    else if (state.stamina >= 25) exhausted = false;
    const running =
      sprint && !exhausted && state.stamina > 1 && Math.hypot(dx, dz) > 0;
    state.player = move(state.player, dx, dz, running ? 6.8 : 3.6, dt, world);
    state.stamina = Math.max(
      0,
      Math.min(
        100,
        state.stamina + (running && state.player.moving ? -12 : 18) * dt,
      ),
    );
    if (state.stage === "chase") {
      chaseTime += dt;
      if (!drop && thiefIndex < thiefPath.length) {
        const dest = thiefPath[thiefIndex],
          d = distance(state.thief, dest),
          step = Math.min(d, 3.2 * dt);
        if (d < 0.1) thiefIndex++;
        else
          state.thief = [
            state.thief[0] + ((dest[0] - state.thief[0]) * step) / d,
            state.thief[1] + ((dest[1] - state.thief[1]) * step) / d,
          ];
      } else drop = true;
      if (chaseTime > 180) {
        stage("failed");
        state.inventory = state.inventory.filter(
          (i) => i !== "Yellow transit slip",
        );
        notify(
          "The trail went cold. Alex can restart the case; there is no penalty.",
        );
      }
    }
    dangerCooldown -= dt;
    if (
      !state.calm &&
      !active &&
      !state.encounter &&
      dangerCooldown <= 0 &&
      near(anchor.danger, 32)
    ) {
      dangerCooldown = 18 + random() * 15;
      if (random() < 0.7) {
        active = true;
        dangerTime = 16;
        stolen = 0;
        caught = false;
        state.danger.position = world.safe(anchor.danger);
        notify(
          "WATCH YOUR POCKETS · A fictional pickpocket approaches. Move away or press E nearby to call for help.",
        );
      }
    }
    if (active) {
      dangerTime -= dt;
      const p = playerPoint(),
        q = state.danger.position,
        d = distance(p, q);
      if (d > 1 && world.clear(q, p)) {
        const step = Math.min(d, 2.6 * dt);
        state.danger.position = [
          q[0] + ((p[0] - q[0]) * step) / d,
          q[1] + ((p[1] - q[1]) * step) / d,
        ];
      }
      if (d < 1.8 && !caught) {
        caught = true;
        stolen = Math.min(5, state.money);
        state.money -= stolen;
        state.health = Math.max(0, state.health - 8);
        notify(
          stolen
            ? `You lost $${stolen} in the commotion. E nearby calls for help and recovers it.`
            : "A close call. Move away or press E to call for help.",
        );
      }
      if (dangerTime <= 0 || d > 48) {
        active = false;
        dangerCooldown = 90;
        notify(
          stolen
            ? "The pickpocket left. You are safe; the backpack quest is unaffected."
            : "You avoided the pickpocket. Clear streets ahead.",
        );
        stolen = 0;
      }
    }
    if (state.health <= 0) {
      if (state.stage !== "completed") stage("failed");
      recover();
    }
    tickEncounters(dt);
    if (clock > noticeUntil && !active) state.message = "";
    refresh();
  }
  function calm(value: boolean) {
    state.calm = value;
    if (value) {
      active = false;
      state.money += stolen;
      stolen = 0;
      if (state.encounter && encounters.find(e => e.id === state.encounter!.id)?.threatening) {
        state.encounter = null; state.dialogue = null; encounterCooldown = 60;
      }
    }
    refresh();
  }
  function collect(id: string) {
    const item = evidence.find(e => e.id === id);
    if (item && !state.investigation.evidence.includes(id)) {
      state.investigation.evidence.push(id);
      state.inventory.push(id === "watch" ? "Case 02: stopped watch" : item.name);
      notify(`EVIDENCE · ${item.name} · recorded in Journal`);
    }
  }
  function finishEncounter(message: string, reward = 0) {
    const e = state.encounter;
    if (!e) return;
    if (!state.resolved.includes(e.id)) { state.money += reward; state.resolved.push(e.id); if ((e.id === "community" || e.id === "theft") && reward > 0) state.trust = Math.min(3, state.trust + 1); }
    else message = message.replace(/\s*\+\$\d+/g, "");
    cooldowns[e.id] = 240; encounterCooldown = 55; state.encounter = null; state.dialogue = null;
    notify(message);
    say("Street story", message);
  }
  function choose(id: string) {
    const d = state.dialogue;
    if (!d?.choices?.some(c => c.id === id)) return;
    state.dialogue = null;
    if (d.context?.startsWith("missing:")) {
      chooseMissing(d.context, id);
    } else if (d.context === "conclusion") {
      if (id !== "leave") {
        const result = mysteryVerdict(state.investigation.evidence, state.investigation.witnesses, id);
        state.money += Math.max(0, result.reward - state.investigation.reward);
        state.investigation.reward = Math.max(state.investigation.reward, result.reward);
        state.investigation.stage = result.solved ? "closed" : "inconclusive";
        state.investigation.conclusion = result.text; say("The Surrey Central Mystery", result.text);
        notify(result.solved ? "CASE 02 COMPLETE · Evidence, not assumptions." : "Case 02 · More evidence needed; you can resubmit.");
      }
    } else if (d.context?.startsWith("encounter:") && state.encounter) {
      const e = state.encounter;
      if (e.id === "robbery") {
        if (id === "pay") { const amount = Math.min(12, state.money); state.money -= amount; finishEncounter(`You hand over $${amount}. The robber leaves. Your missions are unaffected.`); }
        else if (id === "help") finishEncounter("Jo and nearby commuters respond. The robber backs away. Nobody is hurt.");
        else if (id === "distract" && (state.trust >= 2 || random() < .65)) finishEncounter("They check the bus number while neighbours make room for you. You leave safely. Jo’s trust makes this distraction reliable at 2 or more.");
        else { e.phase = "pursuit"; e.seconds = 16; notify("Move away or get close and press E to call for help. This pursuit ends after 16 seconds."); }
      } else if (e.id === "theft") {
        if (id === "chase") { e.phase = "chase"; e.seconds = 50; encounterPath = route(world, e.position, world.safe([locations.theft[0] + 30, locations.theft[1] - 30])); encounterIndex = 1; notify("Catch the portfolio runner and press E. They stop at the end of this short route."); }
        else if (id === "victim") finishEncounter("You help Cleo cancel a card and contact a friend. The portfolio is missing, but Cleo is no longer alone. +$8", 8);
        else if (id === "witness") finishEncounter("A witness points out the discarded portfolio beside a bench. Cleo gets it back without a chase. +$15", 15);
        else finishEncounter("You keep walking. Another commuter stays with Cleo.");
      } else if (e.id === "solicitation") {
        finishEncounter(id === "question" ? "Rae points out the station and a late bus. 'Everyone has somewhere to get to.' A useful conversation, no transaction." : id === "scam" ? "Rae: 'Ask questions. Keep your boundaries. I don't ask for deposits.' You both move on. The proposition was not a crime trap." : "You decline. Rae respects the answer and wishes you a good evening.");
      } else if (e.id === "dealer") {
        finishEncounter(id === "report" ? "You pass a concern to the fictional outreach desk. No real report or network message is sent." : id === "investigate" ? "Ash saw a blue cart near the sealed case. 'Ask the kiosk worker, Idris. I didn't see who had it.' An unverified lead, not evidence." : id === "question" ? "Ash cannot substantiate the claim. You decline the unknown pills and leave safely." : "You decline and walk away. The offer ends.");
      } else if (e.id === "scam") {
        if (id === "pay") { const amount = Math.min(3, state.money); state.money -= amount; finishEncounter(e.variant ? `The collection was fake. You lose $${amount}; an expensive lesson in clipboard typography.` : `The collection funds a fictional community garden. Your $${amount} buys seedlings. Suspicious does not always mean dishonest.`); }
        else finishEncounter(id === "question" ? e.variant ? "Kit cannot name a project. You spot the invented organization and keep your money." : "Kit produces a handwritten garden budget. The awkward pitch was sincere. You offer directions instead of money." : "You decline. Kit moves on; your money stays yours.");
      } else finishEncounter(id === "wallet" ? "You flag down Jo and help return the wallet. Dev thanks you. +$8" : id === "directions" ? "You point Dev toward the station. A useful bit of local kindness. +$4" : "You wish Dev well. Jo notices the wallet and comes over.", id === "wallet" ? 8 : id === "directions" ? 4 : 0);
    }
    refresh();
  }
  function tickEncounters(dt: number) {
    encounterCooldown -= dt;
    for (const id of Object.keys(cooldowns)) cooldowns[id] -= dt;
    if (!state.encounter && !active && encounterCooldown <= 0 && state.stage !== "chase") {
      const candidates = encounters.filter(e => (!e.threatening || !state.calm) && (!e.mature || state.mature) && (!e.mature || state.time.minutes >= 1080 || state.time.minutes < 360) && (cooldowns[e.id] ?? 0) <= 0 && near(locations[e.id], 26));
      if (candidates.length) {
        const def = candidates[Math.floor(random() * candidates.length)];
        state.encounter = { id: def.id, phase: "offer", position: [...locations[def.id]], seconds: 45, hit: false, variant: random() < .5 };
        notify(`${def.name.toUpperCase()} · Approach the coral marker and press E, or walk away.`);
      }
    }
    const e = state.encounter;
    if (!e) return;
    e.seconds -= dt;
    if (e.phase === "chase" && encounterIndex < encounterPath.length) {
      const target = encounterPath[encounterIndex], d = distance(e.position, target), step = Math.min(d, 2.5 * dt);
      if (d < .1) encounterIndex++; else e.position = [e.position[0] + (target[0] - e.position[0]) * step / d, e.position[1] + (target[1] - e.position[1]) * step / d];
    } else if (e.phase === "pursuit" || (e.phase === "offer" && e.id === "robbery")) {
      const p = playerPoint(), d = distance(e.position, p);
      if (d > 2 && world.clear(e.position, p)) { const step = Math.min(d, dt * 2.5); e.position = [e.position[0] + (p[0] - e.position[0]) * step / d, e.position[1] + (p[1] - e.position[1]) * step / d]; }
      if (e.phase === "pursuit" && d < 2 && !e.hit) { state.health = Math.max(1, state.health - 6); e.hit = true; notify("A non-graphic shove costs 6 health. Keep moving or press E to call for help."); }
    }
    if (e.seconds <= 0 || distance(playerPoint(), e.position) > 65) {
      cooldowns[e.id] = 150; encounterCooldown = 45; state.encounter = null;
      notify(e.phase === "chase" ? "The portfolio trail went cold. Cleo finds help; your main cases are safe." : "The street encounter ends. You have room to explore.");
    }
  }
  function mode(value: Snapshot["mode"]) { state.mode = value; state.player.moving = state.player.running = false; refresh(); }
  function mature(value: boolean) { state.mature = value; if (!value && state.encounter && encounters.find(e => e.id === state.encounter!.id)?.mature) { state.encounter = null; state.dialogue = null; encounterCooldown = 60; } refresh(); }
  function serialize(quality: "auto" | "low" = "auto"): SavedGame {
    return { version: 3, map: city.version, savedAt: Date.now(), quality, state: structuredClone(state),
      runtime: { thiefIndex, chaseTime, drop, dangerCooldown, dangerTime, active, stolen, caught, exhausted, clock, encounterCooldown, cooldowns: { ...cooldowns }, random: random.getState() } };
  }
  function restore(save: SavedGame) {
    const s = save.state;
    for (const key of ["time", "missing", "trust", "stableVisibility", "volume", "health", "stamina", "money", "inventory", "stage", "elapsed", "thief", "calm", "mystery", "helped", "mode", "follow", "mature", "investigation", "encounter", "resolved", "waypoint"] as const) Object.assign(state, { [key]: structuredClone(s[key]) });
    const p = world.safe([s.player.x, s.player.z]); state.player = { ...state.player, x: p[0], z: p[1], yaw: s.player.yaw };
    state.thief = world.safe(state.thief); state.danger.position = world.safe(s.danger.position);
    ({ thiefIndex, chaseTime, drop, dangerCooldown, dangerTime, active, stolen, caught, exhausted, clock, encounterCooldown } = save.runtime);
    thiefIndex = Math.min(thiefIndex, thiefPath.length); random.setState(save.runtime.random);
    Object.assign(cooldowns, save.runtime.cooldowns);
    if (state.encounter) { state.encounter.position = world.safe(state.encounter.position); if (state.encounter.phase === "chase") encounterPath = route(world, state.encounter.position, world.safe([locations.theft[0] + 30, locations.theft[1] - 30])); encounterIndex = 1; }
    state.dialogue = null;
    notify(save.migratedFrom ? (distance(p, [s.player.x, s.player.z]) > .05 ? "City updated. You resumed at the nearest safe point; all story progress is preserved." : "City updated. Your position and story progress are preserved.") : "Story resumed. Your progress stayed in this browser."); refresh();
  }
  function rest(minutes: 480 | 1260) {
    if (active || state.encounter?.phase === "pursuit" || state.encounter?.phase === "chase" || state.stage === "chase") { notify("Finish the pursuit before resting."); return; }
    if (state.time.minutes >= minutes) state.time.day = Math.min(1000000, state.time.day + 1);
    state.time.minutes = minutes; state.stamina = 100; state.encounter = null; encounterCooldown = 30;
    notify("You take a quiet break. Your cases and evidence are preserved."); refresh();
  }
  refresh();
  return { rest, missingPoints, state, world, story, locations, tick, interact, dismiss, choose, recover, calm, mode, mature, serialize, restore };
}
