import test from "node:test";
import assert from "node:assert/strict";
import "./test-loader.mjs";
const { characters } = await import("./registry.ts");
const { emptyConversation, respond, suggestedTopics } = await import(
  "./conversation.ts"
);
const { createPeople, person } = await import("./people.ts");
const { profileCharacter } = await import("./community/model.ts");
const guide = characters.find((c) => c.id === "werker");

test("encounter choices reveal identity, answer a selected question and offer its grounded follow-up", () => {
  const original = emptyConversation();
  const hello = respond(guide, original, { kind: "hello" });
  assert.equal(hello.introduced, false);
  assert.equal(hello.turns.at(-1).gesture, "wave");
  assert.equal(original.turns.length, 0);
  const intro = respond(guide, hello, { kind: "introduce" });
  assert.equal(intro.introduced, true);
  assert.match(intro.turns.at(-1).answer, /^I’m Greg Werker\./);
  assert.ok(!intro.turns.at(-1).answer.includes(guide.biography));
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
  assert.match(unsupported.answer, /not sure about that/);
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
    /isn’t a written reply/,
  );
});

test("every character has a short spoken introduction separate from biography and audit notes", () => {
  for (const character of characters) {
    const state = respond(character, emptyConversation(), { kind: "introduce" });
    const answer = state.turns.at(-1).answer;
    assert.ok(answer?.length > 8 && answer.length < 400, character.id);
    assert.match(answer, /^I[’']m /, character.id);
    assert.doesNotMatch(answer, /virtual character|educational simulation|not a confirmation|verification|by the project owner|no endorsement|unverified|fictional/i, character.id);
    assert.ok(character.disclaimer && character.sources.length, character.id);
  }
  const mitch = characters.find(c => c.id === "coach-mitch-hodge");
  assert.equal(respond(mitch, emptyConversation(), { kind: "introduce" }).turns.at(-1).answer,
    "I’m Mitch Hodge. I’m a coach with UBC Baseball.");
  assert.match(mitch.biography, /profile|assignment/i);
});

test("typed social phrases use the same encounter flow without swallowing unrelated questions", () => {
  const mitch = characters.find(c => c.id === "coach-mitch-hodge");
  for (const text of ["Who are you?", "What's your name?", "Can you introduce yourself?", "Hi, who are you?", "Who are you, please?"]) {
    const state = respond(mitch, emptyConversation(), { kind: "question", text });
    assert.equal(state.introduced, true);
    assert.equal(state.turns.at(-1).answer, mitch.introduction);
    assert.equal(state.turns.at(-1).said, text);
    assert.equal(state.turns.at(-1).action, "introduce");
  }
  const hello = respond(mitch, emptyConversation(), { kind: "question", text: "Hello!" });
  assert.equal(hello.introduced, false);
  assert.equal(hello.turns.at(-1).gesture, "wave");
  const again = respond(mitch, hello, { kind: "hello" });
  assert.match(again.turns.at(-1).answer, /again/);
  assert.equal(respond(mitch, again, { kind: "question", text: "Thank you" }).turns.at(-1).action, "thanks");
  assert.equal(respond(mitch, again, { kind: "question", text: "Goodbye" }).turns.at(-1).action, "goodbye");
  const unsupported = respond(mitch, emptyConversation(), { kind: "question", text: "Who are you and what is your private opinion?" });
  assert.equal(unsupported.introduced, false);
  assert.equal(unsupported.turns.at(-1).topicId, undefined);
  const einstein = characters.find(c => c.id === "historical-einstein");
  const identity = respond(einstein, emptyConversation(), {kind:"topic", id:"identity"});
  assert.equal(identity.introduced, true);
  assert.equal(identity.turns.at(-1).answer, einstein.introduction);
});

test("profile introductions use only supplied identity and leave participant answers untouched", () => {
  const p = profileCharacter({id:"example", name:"Sample Visitor", affiliation:"Student", department:"Engineering Physics", about:"I enjoy learning here.", interests:"I build things.", advice:"Ask lots of questions.", zone:"hennings", color:"teal", updated:"2026-10-31"});
  assert.equal(respond(p, emptyConversation(), {kind:"introduce"}).turns.at(-1).answer,
    "I’m Sample Visitor. I’m a student.");
  assert.doesNotMatch(p.introduction, /UBC|Engineering Physics/);
  assert.equal(respond(p, emptyConversation(), {kind:"topic", id:"about"}).turns.at(-1).answer, "I enjoy learning here.");
  assert.match(p.disclaimer, /not verified/);
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
