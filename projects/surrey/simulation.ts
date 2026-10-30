// SPDX-License-Identifier: MIT — fictional characters/events; no real incident data.
import { createWorld, distance, move, route } from "./world";
import type { City, Dialogue, Point, Snapshot, Stage } from "./types";
export function seeded(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
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
    state.danger.active = active;
    state.danger.seconds = Math.ceil(dangerTime);
    state.street = world.streetAt(playerPoint());
  }
  function interact() {
    if (state.dialogue) {
      dismiss();
      return;
    }
    refresh();
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
          "My manuscript! And the sandwich survived. Here’s $35. A strange sealed case turned up nearby, if your detective career isn’t over already. Thanks for helping.",
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
        state.helped = true;
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
      if (!state.mystery) {
        state.mystery = true;
        state.inventory.push("Case 02: stopped watch");
      }
      say(
        "Case 02 · The thirteenth minute",
        "A sealed evidence case holds a watch stopped at 13:13 and a note: “The witness heard tomorrow’s train.” This fictional homicide mystery begins in a future chapter. No real person, business or incident is represented.",
      );
    }
    refresh();
  }
  function dismiss() {
    const dialog: Dialogue | null = state.dialogue;
    state.dialogue = null;
    if (dialog?.action) {
      state.inventory = [];
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
    notify("Back at Surrey Central. Your mission progress is safe.");
    refresh();
  }
  function tick(dt: number, dx = 0, dz = 0, sprint = false) {
    dt = Math.max(0, Math.min(0.1, dt));
    if (state.dialogue) return;
    clock += dt;
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
      stage("failed");
      recover();
    }
    if (clock > noticeUntil && !active) state.message = "";
    refresh();
  }
  function calm(value: boolean) {
    state.calm = value;
    if (value) {
      active = false;
      state.money += stolen;
      stolen = 0;
    }
    refresh();
  }
  refresh();
  return { state, world, tick, interact, dismiss, recover, calm };
}
