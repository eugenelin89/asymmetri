import test from "node:test";
import assert from "node:assert/strict";
import "./test-loader.mjs";
const {
  publicEducationRecords,
  publicEducationCharacters,
  publicEducationSourceChecked,
} = await import("./public-education-characters.ts");
const { characters, places, displays, safeExternalUrl, answerQuestion } =
  await import("./registry.ts");
const { emptyConversation, respond } = await import("./conversation.ts");

test("six public graduation self-reports retain bounded education facts and explicit source provenance", () => {
  const expected = new Map([
    ["Rewa Roy", ["Bachelor of Commerce", "marketing and entrepreneurship"]],
    ["Juliana Angel", ["Bachelor of Applied Science", "engineering physics"]],
    ["Pani Ayoubizadeh", ["Bachelor of Science", "biology"]],
    ["Danya Balagopal", ["Bachelor of Arts", "psychology"]],
    ["Bryna McGarrigle", ["Bachelor of Arts", "sociology with a minor in psychology"]],
    ["Varenya Srivastava", ["Bachelor of Arts", "psychology and economics"]],
  ]);
  assert.equal(publicEducationRecords.length, expected.size);
  assert.equal(publicEducationSourceChecked, "2026-10-31");
  assert.equal(new Set(publicEducationRecords.map((r) => r.id)).size, 6);
  assert.equal(new Set(publicEducationRecords.map((r) => r.sourceUrl)).size, 6);
  for (const record of publicEducationRecords) {
    assert.deepEqual([record.degree, record.field], expected.get(record.name));
    assert.deepEqual(Object.keys(record).sort(), ["degree", "field", "id", "name", "sourceUrl", "zone"]);
    const character = publicEducationCharacters.find((c) => c.id === record.id);
    assert.equal(character.kind, "alumni");
    assert.equal(character.verified, publicEducationSourceChecked);
    assert.match(character.biography, /Source checked 2026-10-31/);
    assert.match(character.biography, /self-published education claim, not independent verification/);
    assert.match(character.disclaimer, /not quotations, a live conversation/);
    assert.equal(character.sources[0].url, record.sourceUrl);
    assert.doesNotMatch(character.title + character.introduction, /current|student|staff|faculty|employed|202[0-9]/i);
  }
});

test("only the exact six canonical LinkedIn source URLs pass the existing external-link boundary", () => {
  for (const record of publicEducationRecords) {
    const url = record.sourceUrl;
    assert.equal(safeExternalUrl(url), url);
    for (const altered of [
      `${url}?tracking=1`, `${url}#fragment`, `${url}/`, ` ${url}`, `${url} `,
      url.replace("https:", "http:"),
      url.replace("https:", "HTTPS:"),
      url.replace("https://", "//"),
      url.replace("www.linkedin.com", "www.linkedin.com.evil.test"),
      url.replace("www.linkedin.com", "ca.linkedin.com"),
      url.replace("www.linkedin.com", "user:secret@www.linkedin.com"),
      url.replace("www.linkedin.com", "www.linkedin.com:443"),
      url.replace("/posts/", "/%70osts/"),
      url.replace("/posts/", "/redirect/../posts/"),
    ]) assert.equal(safeExternalUrl(altered), null, altered);
  }
  for (const url of ["https://www.linkedin.com/in/someone", "https://www.linkedin.com/posts/unreviewed", "javascript:alert(1)"])
    assert.equal(safeExternalUrl(url), null);
  assert.equal(safeExternalUrl("https://www.ubc.ca/about/"), "https://www.ubc.ca/about/");
});

test("visitors reveal identity through an encounter and answer only the sourced study and degree topics", () => {
  for (const character of publicEducationCharacters) {
    const record = publicEducationRecords.find((r) => r.id === character.id);
    let state = respond(character, emptyConversation(), { kind: "hello" });
    assert.equal(state.introduced, false);
    assert.ok(!state.turns.at(-1).answer.includes(character.name));
    state = respond(character, state, { kind: "introduce" });
    assert.equal(state.introduced, true);
    assert.equal(state.turns.at(-1).answer, `I’m ${record.name}. I studied ${record.field} at UBC.`);
    for (const [question, id] of [["What did you study at UBC?", "studies"], ["What degree did you graduate with?", "degree"], ["Where can I learn more?", "education-source"]]) {
      state = respond(character, state, { kind: "question", text: question });
      assert.equal(state.turns.at(-1).topicId, id);
      assert.deepEqual(state.turns.at(-1).sources, character.sources);
      assert.doesNotMatch(state.turns.at(-1).answer, /simulation|verification|not a confirmation|self-report/i);
    }
    for (const question of ["What is your current job?", "What is your private opinion?", "Where are you live right now?", "Promise I will be admitted"])
      assert.equal(answerQuestion(character, question), null);
  }
});

test("education visitors join the existing walking registry without becoming directory destinations or community profiles", () => {
  const ids = new Set(publicEducationCharacters.map((c) => c.id));
  const names = new Set(publicEducationCharacters.map((c) => c.name));
  for (const character of publicEducationCharacters) {
    assert.equal(characters.filter((c) => c.id === character.id).length, 1);
    assert.equal(character.category, "named");
    assert.equal(character.routeSpace, "network");
    assert.deepEqual(character.route, []);
    assert.ok(places.some((place) => place.id === character.zone), character.zone);
    assert.equal(character.topics.length, 3);
    assert.equal(character.model, "original-stylized-education-visitor");
    assert.equal(character.appearance, undefined);
    assert.match(character.behaviour, /No real schedule/);
  }
  assert.ok(places.every((p) => !ids.has(p.id) && !names.has(p.name)));
  assert.ok(Object.entries(displays).every(([id, display]) => !ids.has(id) && !names.has(display.name)));
});
