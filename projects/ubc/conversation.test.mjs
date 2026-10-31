import test from "node:test";
import assert from "node:assert/strict";
import "./test-loader.mjs";
const { characters } = await import("./registry.ts");
const { emptyConversation, respond, suggestedTopics } = await import(
  "./conversation.ts"
);
const { createPeople, person } = await import("./people.ts");
const guide = characters.find((c) => c.id === "werker");

test("encounter choices reveal identity, answer a selected question and offer its grounded follow-up", () => {
  const original = emptyConversation();
  const hello = respond(guide, original, { kind: "hello" });
  assert.equal(hello.introduced, false);
  assert.equal(hello.turns.at(-1).gesture, "wave");
  assert.equal(original.turns.length, 0);
  const intro = respond(guide, hello, { kind: "introduce" });
  assert.equal(intro.introduced, true);
  assert.ok(intro.turns.at(-1).answer.includes(guide.name));
  assert.ok(intro.turns.at(-1).answer.includes(guide.biography));
  const topic = guide.topics.find((t) => t.followups?.length);
  const answer = respond(guide, intro, { kind: "topic", id: topic.id });
  assert.equal(answer.turns.at(-1).answer, topic.answer);
  assert.deepEqual(answer.turns.at(-1).sources, topic.sources);
  const next = suggestedTopics(guide, answer, answer.turns.at(-1));
  assert.equal(next[0].id, topic.followups[0]);
  const followup = respond(guide, answer, { kind: "topic", id: next[0].id });
  assert.equal(followup.turns.at(-1).answer, next[0].answer);
  assert.equal(
    respond(guide, followup, { kind: "goodbye" }).turns.at(-1).action,
    "goodbye",
  );
});

test("unsupported questions remain honest and stale or empty choices cannot manufacture an answer", () => {
  const state = emptyConversation();
  assert.equal(respond(guide, state, { kind: "topic", id: "missing" }), state);
  assert.equal(respond(guide, state, { kind: "question", text: "   " }), state);
  const unsupported = respond(guide, state, {
    kind: "question",
    text: "What is your private opinion?",
  }).turns.at(-1);
  assert.match(unsupported.answer, /don’t have a verified answer/);
  assert.equal(unsupported.topicId, undefined);
  const known = respond(guide, state, {
    kind: "question",
    text: "What is operations research?",
  }).turns.at(-1);
  assert.equal(known.topicId, "or");
});

test("session history remains bounded without forgetting the encounter's introduction", () => {
  let state = respond(guide, emptyConversation(), { kind: "introduce" });
  for (let i = 0; i < 30; i++) state = respond(guide, state, { kind: "wave" });
  assert.equal(state.turns.length, 24);
  assert.equal(state.introduced, true);
  assert.equal(emptyConversation().turns.length, 0);
});

test("participant-written answers are preserved and do not invent new participant replies", () => {
  const participant = {
    ...guide,
    category: "community",
    topics: [
      {
        id: "about",
        question: "What do you study?",
        answer: "Engineering Physics.",
        sources: [],
        keywords: ["study"],
      },
    ],
  };
  assert.equal(
    respond(participant, emptyConversation(), {
      kind: "topic",
      id: "about",
    }).turns.at(-1).answer,
    "Engineering Physics.",
  );
  assert.match(
    respond(participant, emptyConversation(), {
      kind: "question",
      text: "Unrelated 991",
    }).turns.at(-1).answer,
    /hasn’t written an answer/,
  );
});

test("active conversation gestures animate while walking is paused, remain in place and respect reduced motion", () => {
  const people = createPeople(
    {
      origin: [0, 0],
      buildings: [],
      surfaces: [],
      trees: [],
      routes: [],
      entrances: [],
    },
    {
      sauder: {
        id: "sauder",
        x: 0,
        z: 0,
        width: 30,
        depth: 20,
        yaw: 0,
        entry: [0, 20],
      },
    },
    () => false,
  );
  const actor = people.actors.find((a) => a.id === "werker"),
    start = actor.group.position.clone();
  const focus = [start.x + 2, start.z];
  assert.equal(people.react(actor.id, "wave"), true);
  people.update(0, 1, focus, 12, true, actor.id, false, 0.1);
  assert.ok(Math.abs(actor.arms[0].rotation.z) > 0.1);
  assert.deepEqual(actor.group.position.toArray(), start.toArray());
  assert.ok(Math.abs(actor.group.rotation.y - Math.PI / 2) < 0.001);
  people.update(0, 2, focus, 12, true, actor.id, true, 0.1);
  assert.equal(actor.arms[0].rotation.z, 0);
  assert.equal(people.react("absent", "wave"), false);
  people.react(actor.id, "nod");
  people.update(0, 3, focus, 12, true, actor.id, false, 0.1);
  assert.ok(Math.abs(actor.head.rotation.x) > 0);
  people.update(1 / 30, 4, focus, 12, true, null, false);
  assert.equal(actor.head.rotation.x, 0);
  people.group.traverse((o) => {
    o.geometry?.dispose();
    o.material?.dispose();
  });
});

test("only the selected partner stops; nearby passers-by keep walking and can pass in opposite directions", () => {
  const p = createPeople(
    {
      origin: [0, 0],
      buildings: [],
      surfaces: [],
      trees: [],
      routes: [],
      entrances: [],
    },
    {},
    () => false,
  );
  function add(id, x, z, targetX) {
    const model = person(id, x + z, true);
    model.group.position.set(x, 0, z);
    p.group.add(model.group);
    const actor = {
      ...model,
      id,
      route: [
        [x, z],
        [targetX, z],
      ],
      target: 1,
      pause: 0,
      speed: 1,
      named: true,
    };
    p.actors.push(actor);
    return actor;
  }
  const speaking = add("speaking", 0, 0, 15),
    passer = add("passing", 0, 4, 15);
  for (let i = 0; i < 90; i++)
    p.update(1 / 30, i / 30, [0, 2], 12, true, speaking.id, false);
  assert.equal(speaking.group.position.x, 0);
  assert.ok(
    passer.group.position.x > 2,
    "proximity alone must not freeze passers-by",
  );
  const left = add("left", 0, 12, 15),
    right = add("right", 8, 12, -7);
  for (let i = 0; i < 300; i++) {
    p.update(1 / 30, i / 30, [0, 2], 12, true, speaking.id, false);
    assert.ok(left.group.position.distanceTo(right.group.position) >= 0.84);
  }
  assert.ok(
    left.group.position.x > right.group.position.x,
    "opposing walkers pass rather than form a permanent queue",
  );
  p.group.traverse((o) => {
    o.geometry?.dispose();
    o.material?.dispose();
  });
});
