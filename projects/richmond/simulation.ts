// SPDX-License-Identifier: MIT — deterministic, renderer-independent game state.
import { stepCar, carFits } from "../vancouver/physics";
import { createWorld, clamp, distance, point } from "./world";
import { interiorFor, interiorFits, catalogue } from "./interiors";
import { missions, encounterText, community } from "./story";
import type {
  City,
  State,
  Point,
  Input,
  Order,
  Settings,
  Mission,
} from "./types";
export function initialState(city: City): State {
  const world = createWorld(city),
    start = city.places.find((p) => p.id === "brighouse")!;
  const car = world.poseNear(start.parking);
  const player = world.exit(car, false) ?? car;
  return {
    version: 1,
    map: city.version,
    player,
    car: { ...car, speed: 0, steer: 0, condition: 100, blocked: false },
    locomotion: "walk",
    interior: null,
    camera: "third",
    airfield: false,
    cash: 20,
    health: 100,
    stamina: 100,
    inventory: { bag: 1 },
    active: null,
    history: [],
    ledger: [],
    sequence: 1,
    rng: 18273,
    elapsed: 0,
    cooldown: 90,
    encounter: null,
    resolved: 0,
    settings: {
      gentle: false,
      encounterRate: 1,
      encounterSeverity: 1,
      lite: false,
      density: 1,
      reducedMotion: false,
      northUp: true,
      locale: "en",
      textScale: 1,
    },
    checkpoint: { ...player },
    tutorial: 0,
    shopping: false,
  };
}
export function createSimulation(city: City, saved?: State) {
  const world = createWorld(city);
  let state = saved ?? initialState(city),
    message =
      "Welcome to Richmond. Take First Day in Richmond from the order board, or explore at your own pace.",
    paused = false,
    impactCooldown = 0;
  type Obstacle = {
    x: number;
    z: number;
    y: number;
    yaw?: number;
    vehicle?: boolean;
  };
  let obstacles: Obstacle[] = [];
  function obstructs(p: Point, o: Obstacle, margin = 0.2) {
    if (Math.abs(o.y - state.player.y) > 2) return false;
    const dx = p[0] - o.x,
      dz = p[1] - o.z,
      yaw = o.yaw ?? 0;
    return o.vehicle
      ? Math.abs(dx * Math.cos(yaw) - dz * Math.sin(yaw)) < 1.05 + margin &&
          Math.abs(dx * Math.sin(yaw) + dz * Math.cos(yaw)) < 2.1 + margin
      : Math.hypot(dx, dz) < 0.45 + margin;
  }
  const places = new Map(city.places.map((p) => [p.id, p]));
  function rand() {
    state.rng = (Math.imul(1664525, state.rng) + 1013904223) >>> 0;
    return state.rng / 4294967296;
  }
  function say(text: string) {
    message = text;
  }
  function locate() {
    return state.interior ? places.get(state.interior.place)! : null;
  }
  function shoppingBreak() {
    return (
      !state.active &&
      !state.inventory.insulation &&
      state.history.some(
        (h) =>
          h.title === "Richmond Centre Shopping Break" &&
          h.outcome === "delivered",
      )
    );
  }
  function targetPlace() {
    return state.active
      ? places.get(
          state.active.stage === "accepted"
            ? state.active.pickup
            : state.active.destination,
        )!
      : shoppingBreak()
        ? places.get("richmond-centre")!
        : null;
  }
  function target(): Point | null {
    const place = targetPlace();
    if (!place) return null;
    if (state.interior) {
      if (place.id !== state.interior.place) return interiorFor(locate()!).exit;
      const layout = interiorFor(place);
      if (shoppingBreak()) return layout.shops[1].point;
      return state.active?.stage === "accepted"
        ? layout.pickup
        : layout.customer;
    }
    return state.locomotion === "drive" ? place.parking : place.entrance;
  }
  const at = (p: Point, r = 3) => distance(point(state.player), p) < r;
  function quote(m: Mission) {
    const a = places.get(m.pickup),
      b = places.get(m.destination);
    if (!a || !b) return null;
    const path = world.route(a.parking, b.roadNode);
    if (path.length < 2) return null;
    const length =
      path.slice(1).reduce((s, p, i) => s + distance(path[i], p), 0) +
      distance(path[path.length - 1], b.parking);
    const approach =
      distance(point(state.car), a.parking) < 8
        ? [point(state.car), a.parking]
        : world.route(point(state.car), a.roadNode);
    if (approach.length < 2) return null;
    const approachDistance =
      approach
        .slice(1)
        .reduce((sum, p, i) => sum + distance(approach[i], p), 0) +
      distance(approach[approach.length - 1], a.parking);
    return {
      distance: Math.round(length),
      approachDistance: Math.round(approachDistance),
      basePay: Math.round(8 + length * 0.0045),
      duration: Math.max(
        m.id === "first-day" ? 1200 : 0,
        Math.ceil(
          (length + approachDistance) / 8 +
            360 +
            (a.interior === "mall" || a.interior === "terminal" ? 180 : 0) +
            (b.interior === "terminal" ? 180 : 0),
        ),
      ),
    };
  }
  function offers(sequence = state.sequence) {
    const randomFoods = [
      "Dim sum",
      "Noodles",
      "Taiwanese bento",
      "Bubble tea",
      "Sushi",
      "Pizza",
      "Burgers",
      "Fish and chips",
    ];
    const picks = city.places.filter((p) => p.role === "pickup"),
      destinations = city.places.filter((p) => p.role === "customer");
    const repeat: Mission[] = [0, 1, 2].map((i) => ({
      id: "shift-" + i,
      title: "Neighbourhood order " + (i + 1),
      food: randomFoods[(sequence + i) % randomFoods.length],
      pickup: picks[(sequence + i * 3) % picks.length].id,
      destination: destinations[(sequence * 3 + i) % destinations.length].id,
      customer: ["Kai", "Amira", "Charlie"][i],
      description: "A new local delivery generated for this shift.",
    }));
    return [...missions, ...repeat]
      .map((m) => ({ ...m, quote: quote(m) }))
      .filter((m) => m.quote !== null);
  }
  function accept(id: string) {
    if (state.active) return say("Finish or cancel your current order first.");
    const m = offers().find((m) => m.id === id);
    if (!m || !m.quote)
      return say("This order does not have a verified connected route.");
    state.active = {
      ...m,
      ...m.quote,
      id: "order-" + state.sequence++,
      mission: m.id,
      remaining: m.quote.duration,
      condition: 100,
      stage: "accepted",
    };
    state.tutorial = Math.max(1, state.tutorial);
    say(
      `Accepted ${m.title}. Park near ${places.get(m.pickup)!.name}, then walk inside to the marked pickup counter.`,
    );
  }
  function finish(outcome: "cancelled" | "expired" | "stolen") {
    const o = state.active;
    if (!o) return;
    delete state.inventory[o.id];
    state.history.unshift({
      id: o.id,
      title: o.title,
      pay: 0,
      tip: 0,
      rating: 0,
      outcome,
    });
    state.history = state.history.slice(0, 200);
    state.active = null;
    say(
      outcome === "expired"
        ? "The order expired. No cash penalty; take a fresh order."
        : outcome === "stolen"
          ? "The food was lost. The order is cancelled without debt."
          : "Order cancelled. You can take another at no cost.",
    );
  }
  function pay(o: Order) {
    const transaction = "delivery:" + o.id;
    if (state.ledger.includes(transaction)) return;
    const tip = Math.round((o.condition / 100) * 4),
      pay = Math.max(5, Math.round(o.basePay * (0.75 + o.condition * 0.0025)));
    state.ledger.push(transaction);
    state.cash += pay + tip;
    delete state.inventory[o.id];
    state.history.unshift({
      id: o.id,
      title: o.title,
      pay,
      tip,
      rating: Math.max(1, Math.round(o.condition / 20)),
      outcome: "delivered",
    });
    state.history = state.history.slice(0, 200);
    state.active = null;
    state.tutorial = 6;
    say(
      `Delivered to ${o.customer}! +$${pay} CAD and $${tip} tip. Thank you / 多謝！ Payment recorded once.`,
    );
  }
  function interact() {
    if (paused || state.camera === "aerial" || state.locomotion === "drive")
      return;
    const here = locate(),
      o = state.active,
      place = targetPlace();
    if (here) {
      const layout = interiorFor(here);
      if (
        at(layout.exit, 3) ||
        (layout.alternateExit && at(layout.alternateExit, 3))
      ) {
        const p =
          layout.alternateExit && at(layout.alternateExit, 3)
            ? (here.entrances?.[1]?.point ?? state.interior!.entrance)
            : here.entrance;
        state.player = { x: p[0], z: p[1], y: 0, yaw: 0 };
        state.interior = null;
        state.shopping = false;
        state.checkpoint = { ...state.player };
        say(`Outside ${here.name}. Your car is where you parked it.`);
        return;
      }
      if (o && place?.id === here.id) {
        if (o.stage === "accepted" && at(layout.pickup, 3.5)) {
          o.stage = "collected";
          state.inventory[o.id] = 1;
          state.tutorial = 4;
          say(
            `Collected ${o.food}, ${o.id}. Next: ${places.get(o.destination)!.name}, for ${o.customer}.`,
          );
          return;
        }
        if (
          o.stage === "collected" &&
          at(layout.customer, 3.5) &&
          state.inventory[o.id] === 1
        ) {
          pay(o);
          return;
        }
      }
      const shop = layout.shops.find((s) => at(s.point, 4));
      if (shop) {
        state.shopping = true;
        say(
          `${shop.name}. Choose an item to purchase with fictional game money.`,
        );
        return;
      }
      say(community[Math.floor(rand() * community.length)].join(": "));
      return;
    }
    if (
      o &&
      place &&
      !place.interior &&
      o.stage === "collected" &&
      at(place.entrance, 3.5) &&
      state.inventory[o.id] === 1
    ) {
      pay(o);
      return;
    }
    const entry = city.places.find(
      (p) =>
        p.interior &&
        (p.entrances ?? [{ point: p.entrance }]).some((e) => at(e.point, 4)),
    );
    if (entry) {
      const layout = interiorFor(entry),
        entrance =
          entry.entrances?.find((e) => at(e.point, 4))?.point ?? entry.entrance,
        spawn =
          entrance !== entry.entrance &&
          entry.entrances?.findIndex((e) => e.point === entrance) === 1 &&
          layout.alternateExit
            ? layout.alternateExit
            : layout.spawn;
      state.interior = { place: entry.id, entrance: [...entrance] };
      state.player = { x: spawn[0], z: spawn[1], y: 0, yaw: Math.PI };
      state.tutorial = Math.max(3, state.tutorial);
      say(
        `${entry.name}. Original fictional interior. Follow the labelled counter or explore the shops.`,
      );
      return;
    }
    say(
      "No entrance or customer in reach. Follow the route and look for the labelled meeting marker.",
    );
  }
  function vehicle() {
    if (paused || state.camera === "aerial") return;
    if (state.interior)
      return say("Leave the building before returning to your car.");
    if (state.locomotion === "drive") {
      if (Math.abs(state.car.speed) > 0.5)
        return say("Brake to a stop before getting out.");
      const exit = world.exit(state.car, state.airfield, (p) =>
        obstacles.some((o) => obstructs(p, o, 0.5)),
      );
      if (!exit)
        return say(
          "There is no clear exit here. Move to a wider stopping place.",
        );
      state.player = exit;
      state.locomotion = "walk";
      state.car.speed = 0;
      state.checkpoint = { ...exit };
      state.tutorial = Math.max(state.tutorial, 2);
      say("Car parked. Walk to the marked entrance; E interacts.");
    } else {
      if (distance(point(state.player), point(state.car)) > 5)
        return say(
          "Walk back to your car. Find my car shows its saved position.",
        );
      state.locomotion = "drive";
      state.player = { ...state.car };
      say(
        "W/S accelerate, brake and reverse. A/D steer. Space brakes. Stop, then F to get out.",
      );
    }
  }
  function buy(id: string) {
    if (!state.interior || !state.shopping) return;
    const item = catalogue.find((i) => i.id === id);
    const layout = interiorFor(locate()!);
    if (!item || !layout.shops.some((s) => at(s.point, 4))) return;
    if (state.cash < item.price)
      return say("Not enough cash. The next delivery is free to start.");
    if (["insulation", "jacket"].includes(id) && state.inventory[id])
      return say("You already own that item.");
    const completesShoppingBreak = id === "insulation" && shoppingBreak();
    const tx = "purchase:" + state.sequence++;
    state.ledger.push(tx);
    state.cash -= item.price;
    state.inventory[id] = (state.inventory[id] ?? 0) + 1;
    if (id === "meal") consumeItem("meal");
    say(
      `${completesShoppingBreak ? "Richmond Centre Shopping Break complete! " : ""}Purchased ${item.name} for $${item.price} CAD. Balance $${state.cash}.`,
    );
  }
  function consumeItem(id: string) {
    if (!state.inventory[id]) return say("That item is not in your bag.");
    if (id === "medkit") state.health = Math.min(100, state.health + 55);
    else if (id === "meal") {
      state.health = Math.min(100, state.health + 30);
      state.stamina = Math.min(100, state.stamina + 40);
    } else if (id === "repair")
      state.car.condition = Math.min(100, state.car.condition + 55);
    else return;
    state.inventory[id]--;
    say("Item used. Your remaining supplies are in your bag.");
  }
  function recover() {
    state.health = Math.max(60, state.health);
    state.stamina = 100;
    state.car.condition = Math.max(40, state.car.condition);
    state.car.speed = 0;
    state.encounter = null;
    state.cooldown = 90 / state.settings.encounterRate;
    if (state.interior) {
      const l = interiorFor(locate()!);
      state.player = { x: l.spawn[0], z: l.spawn[1], y: 0, yaw: Math.PI };
    } else if (state.locomotion === "drive") {
      const destination = targetPlace(),
        route = destination
          ? world.route(point(state.car), destination.roadNode)
          : [],
        ahead = route.find((p) => distance(p, point(state.car)) > 4),
        heading = ahead
          ? Math.atan2(ahead[0] - state.car.x, ahead[1] - state.car.z)
          : state.car.yaw;
      const p = world.poseNear(point(state.car), heading, state.airfield);
      state.car = { ...state.car, ...p, steer: 0, blocked: false };
      state.player = { ...p };
    } else state.player = { ...state.checkpoint };
    say(
      state.locomotion === "drive"
        ? "Recovered on a nearby clear surface, aligned with your delivery route where available. Cash and order preserved."
        : "Recovered safely. Health and mobility restored; cash, order and parked car are preserved.",
    );
  }
  function resolve(choice: "leave" | "help" | "give") {
    if (!state.encounter) return;
    if (choice === "give") {
      state.cash -= Math.min(
        Math.round(8 * state.settings.encounterSeverity),
        state.cash,
      );
      say("You gave up a small amount and reached safety.");
    } else
      say(
        choice === "help"
          ? "Help arrived. The incident is reported and resolved."
          : "You left safely. Keep moving toward a busy meeting point.",
      );
    state.encounter = null;
    state.cooldown = 100 / state.settings.encounterRate;
    state.resolved++;
  }
  function settings(value: Partial<Settings>) {
    state.settings = { ...state.settings, ...value };
    state.settings.density = clamp(state.settings.density, 0.25, 1.5);
    state.settings.encounterRate = clamp(
      state.settings.encounterRate,
      0.5,
      1.5,
    );
    state.settings.encounterSeverity = clamp(
      state.settings.encounterSeverity,
      0.5,
      1,
    );
    if (value.gentle) state.encounter = null;
  }
  function step(delta: number, held: Set<Input>, viewYaw: number) {
    if (paused || state.shopping || state.camera === "aerial") return;
    const dt = clamp(delta, 0, 0.1);
    state.elapsed += dt;
    impactCooldown = Math.max(0, impactCooldown - dt);
    state.cooldown = Math.max(0, state.cooldown - dt);
    if (state.locomotion === "drive") {
      const oldSpeed = state.car.speed;
      // A moving actor can overlap a bumper between ticks. Permit separation
      // along the outward contact normal, while rejecting deeper penetration.
      // Nearby actors are still solid; distance alone never disables collision.
      const nearby = obstacles.filter(
        (o) =>
          Math.abs(o.y - state.car.y) <= 2 &&
          Math.hypot(o.x - state.car.x, o.z - state.car.z) < 8,
      );
      const escape = nearby.map((o) => {
        if (carFits(state.car, (p) => !obstructs(p, o, 0.15))) return null;
        const dx = state.car.x - o.x,
          dz = state.car.z - o.z,
          length = Math.hypot(dx, dz),
          nx = length ? dx / length : Math.sin(state.car.yaw),
          nz = length ? dz / length : Math.cos(state.car.yaw),
          sin = Math.sin(state.car.yaw),
          cos = Math.cos(state.car.yaw);
        return {
          nx,
          nz,
          minimum:
            dx * nx +
            dz * nz -
            Math.abs(nx * cos - nz * sin) * 1.02 -
            Math.abs(nx * sin + nz * cos) * 2.08,
        };
      });
      const next = stepCar(
        state.car,
        (held.has("forward") ? 1 : 0) - (held.has("back") ? 1 : 0),
        (held.has("left") ? 1 : 0) - (held.has("right") ? 1 : 0),
        held.has("brake"),
        dt,
        (p) =>
          world.support(p, state.car.y, state.airfield) !== null &&
          !nearby.some(
            (o, i) =>
              obstructs(p, o, 0.15) &&
              (!escape[i] ||
                (p[0] - o.x) * escape[i]!.nx + (p[1] - o.z) * escape[i]!.nz <
                  escape[i]!.minimum - 1e-7),
          ),
      );
      state.car = { ...state.car, ...next };
      state.car.y =
        world.support(point(state.car), state.car.y, state.airfield) ??
        state.car.y;
      state.player = { ...state.car };
      if (next.blocked && Math.abs(oldSpeed) > 3 && impactCooldown === 0) {
        state.car.condition = Math.max(
          0,
          state.car.condition - Math.min(8, Math.abs(oldSpeed) * 0.35),
        );
        state.health = Math.max(0, state.health - 2);
        if (state.active)
          state.active.condition = Math.max(0, state.active.condition - 3);
        impactCooldown = 2;
        say("A bump. Reverse and correct your steering, or use Recover.");
      }
    } else {
      let forward = (held.has("forward") ? 1 : 0) - (held.has("back") ? 1 : 0),
        right = (held.has("right") ? 1 : 0) - (held.has("left") ? 1 : 0);
      const norm = Math.hypot(forward, right);
      const running = held.has("sprint") && state.stamina > 5 && norm > 0;
      if (norm) {
        forward /= norm;
        right /= norm;
        const speed = running ? 6 : 3.4,
          dx =
            (Math.sin(viewYaw) * forward - Math.cos(viewYaw) * right) *
            speed *
            dt,
          dz =
            (Math.cos(viewYaw) * forward + Math.sin(viewYaw) * right) *
            speed *
            dt;
        const layout = state.interior ? interiorFor(locate()!) : null;
        const fits = (p: Point) =>
          layout
            ? interiorFits(p, layout)
            : world.walkFits(p, state.player.y, state.airfield) &&
              !obstructs(p, { ...state.car, vehicle: true }, 0.4) &&
              !obstacles.some((o) => obstructs(p, o, 0.35));
        const n = Math.max(1, Math.ceil((speed * dt) / 0.16));
        for (let i = 0; i < n; i++) {
          const p: Point = [state.player.x + dx / n, state.player.z + dz / n];
          if (fits(p)) {
            state.player.x = p[0];
            state.player.z = p[1];
          } else {
            if (fits([p[0], state.player.z])) state.player.x = p[0];
            if (fits([state.player.x, p[1]])) state.player.z = p[1];
          }
        }
        state.player.y = layout
          ? 0
          : (world.support(
              point(state.player),
              state.player.y,
              state.airfield,
              true,
            ) ?? state.player.y);
        state.player.yaw = Math.atan2(dx, dz);
        state.stamina = clamp(state.stamina + (running ? -14 : 8) * dt, 0, 100);
      } else state.stamina = Math.min(100, state.stamina + 16 * dt);
    }
    if (state.active) {
      state.active.remaining -= dt;
      if (state.active.stage === "collected")
        state.active.condition = Math.max(
          0,
          state.active.condition -
            dt * (state.inventory.insulation ? 0.018 : 0.036),
        );
      if (state.active.remaining <= 0) finish("expired");
    }
    const safe =
      !!state.interior ||
      city.places.some((p) => distance(p.entrance, point(state.player)) < 22);
    if (safe && state.encounter) resolve("leave");
    if (!state.settings.gentle && !safe) {
      if (!state.encounter && state.cooldown === 0) {
        const kinds: (keyof typeof encounterText)[] =
          state.locomotion === "drive"
            ? ["hazard"]
            : [
                "pickpocket",
                "scam",
                "robbery",
                ...(distance(point(state.player), point(state.car)) < 50
                  ? ["breakin" as const]
                  : []),
              ];
        const kind = kinds[Math.floor(rand() * kinds.length)];
        state.encounter = {
          id: "event-" + state.sequence++,
          kind,
          origin: point(state.player),
          remaining: 12,
          warning: encounterText[kind],
        };
        state.cooldown = 100 / state.settings.encounterRate;
        if (state.locomotion === "drive") state.car.speed = 0;
        say(encounterText[kind]);
      }
      if (state.encounter) {
        const e = state.encounter;
        e.remaining -= dt;
        if (distance(e.origin, point(state.player)) > 22) resolve("leave");
        else if (e.remaining <= 0) {
          if (e.kind === "pickpocket" || e.kind === "robbery")
            state.cash -= Math.min(
              Math.round(5 * state.settings.encounterSeverity),
              state.cash,
            );
          else if (e.kind === "breakin")
            state.car.condition = Math.max(
              0,
              state.car.condition - 6 * state.settings.encounterSeverity,
            );
          else if (e.kind === "hazard") {
            state.health = Math.max(
              0,
              state.health - 5 * state.settings.encounterSeverity,
            );
            state.car.condition = Math.max(
              0,
              state.car.condition - 3 * state.settings.encounterSeverity,
            );
          } else if (state.active?.stage === "collected")
            state.active.condition = Math.max(
              0,
              state.active.condition - 8 * state.settings.encounterSeverity,
            );
          state.encounter = null;
          state.resolved++;
          say(
            "The incident caused a small setback. Help and recovery are always available.",
          );
        }
      }
    }
    if (state.health <= 0 || state.car.condition <= 0) recover();
  }
  function prompt() {
    if (state.locomotion === "drive")
      return Math.abs(state.car.speed) > 0.5
        ? "Space · Brake to park"
        : "F · Exit your car";
    if (state.interior) {
      const l = interiorFor(locate()!);
      if (at(l.exit, 3) || (l.alternateExit && at(l.alternateExit, 3)))
        return "E · Leave building";
      if (state.active && target() && at(target()!, 3.5))
        return state.active?.stage === "accepted"
          ? "E · Collect your labelled order"
          : "E · Hand over the correct order";
      if (l.shops.some((s) => at(s.point, 4))) return "E · Shop / 購物";
      return "E · Talk · Walk to the marked counter";
    }
    if (distance(point(state.player), point(state.car)) < 5)
      return "F · Enter your car";
    if (
      city.places.some(
        (p) =>
          p.interior &&
          (p.entrances ?? [{ point: p.entrance }]).some((e) => at(e.point, 4)),
      )
    )
      return "E · Enter building";
    if (state.active && target() && at(target()!, 3.5))
      return "E · Deliver order";
    return "Follow the marked entrance · E interacts";
  }
  function objective() {
    const o = state.active;
    if (shoppingBreak())
      return "Shopping Break · Return to Richmond Centre and buy an insulated bag at Courier Supply ($28).";
    if (!o)
      return "Free roam · Take an order, explore Richmond or try Open Airfield.";
    const p = targetPlace()!;
    return `${o.stage === "accepted" ? "Pick up " + o.food : "Deliver to " + o.customer} · ${p.name}${state.interior ? " · Follow the indoor marker" : state.locomotion === "drive" ? " · Park, then walk" : " · Enter on foot"}`;
  }
  function restore(value: State) {
    state = value;
    message = state.active
      ? `Shift restored · ${state.active.title}. Your order, cash and parked car are preserved.`
      : "Your saved Richmond shift is ready.";
    const o = state.active;
    if (o?.mission === "first-day" && o.duration < 1200) {
      o.remaining += 1200 - o.duration;
      o.duration = 1200;
    }
  }
  if (saved) restore(saved);
  return {
    world,
    places,
    obstacles(value: Obstacle[]) {
      obstacles = value;
    },
    get state() {
      return state;
    },
    get message() {
      return message;
    },
    get paused() {
      return paused || state.shopping;
    },
    say,
    step,
    accept,
    offers,
    quote,
    interact,
    vehicle,
    buy,
    use: consumeItem,
    recover,
    resolve,
    settings,
    target,
    targetPlace,
    prompt,
    objective,
    cancel() {
      finish("cancelled");
    },
    pause(value: boolean) {
      paused = value;
      if (value) state.shopping = false;
    },
    camera(value: State["camera"]) {
      state.camera = value;
      state.shopping = false;
    },
    airfield(value: boolean) {
      if (
        !value &&
        (world.nearest(point(state.car), "airfield")?.d ?? Infinity) < 40
      )
        return say(
          "Return to public access roads before closing Open Airfield.",
        );
      state.airfield = value;
      say(
        value
          ? "Open Airfield enabled. Fictional airport sandbox; drive via the marked operations-office connection. This is not real airport access."
          : "Public-road mode.",
      );
    },
    reset() {
      state = initialState(city);
      say("A new shift begins. Your local Richmond progress was reset.");
    },
    restore,
  };
}
export type Simulation = ReturnType<typeof createSimulation>;
