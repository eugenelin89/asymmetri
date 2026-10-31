import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import "./test-loader.mjs";
const { parseSuppliedUbcStudents, deduplicateStudents, validStudentSource, isStudentExternalSourceUrl } = await import("./student-import.ts");
const { studentRecords, buildStudentCharacters } = await import("./student-characters.ts");
const { studentSourceAudit } = await import("./student-source-audit.ts");
const { studentDepartment, createStudentDepartmentAnchors, planStudentRoutes, orderStudentEncounters } = await import("./student-departments.ts");
const { characters: integratedCharacters, safeExternalUrl, studentImportReport } = await import("./registry.ts");
const existingCharacters = integratedCharacters.filter((character) => character.model !== "original-stylized-student");
const { createCollision, segmentDistance } = await import("./spatial.ts");
const { createPeople } = await import("./people.ts");
const data = JSON.parse(readFileSync(new URL("../../public/ubc/v0.1-2026-10-30/data.json", import.meta.url), "utf8"));
const snapshotText = readFileSync(new URL("./data/students.json", import.meta.url), "utf8");
const result = buildStudentCharacters(existingCharacters);
const table = (rows) => `# Research\n## University of British Columbia (UBC)\n${rows.join("\n")}\n## Case Western Reserve University\n| University of British Columbia (UBC) | Outside | Section | 2028 | Wrong | private@example.invalid | [Profile](https://www.ubc.ca/) |`;
const row = (first, last, source = "https://www.math.ubc.ca/user/4402") => `| University of British Columbia (UBC) | ${first} | ${last} | | Mathematics | private@example.invalid | [Profile](${source}) |`;

test("import boundary selects only the UBC section and discards contact columns", () => {
  const parsed = parseSuppliedUbcStudents(table([row("Example", "Student")]));
  assert.equal(parsed.students.length, 1);
  assert.equal(parsed.students[0].name, "Example Student");
  assert.equal(parsed.students[0].expectedCompletion, null);
  assert.deepEqual(Object.keys(parsed.students[0]).sort(), ["expectedCompletion", "id", "name", "program", "sourceKind", "sourceUrl"]);
  assert.doesNotMatch(JSON.stringify(parsed), /private@example|email|portrait|Outside/);
  assert.throws(() => parseSuppliedUbcStudents(table([row("<img>", "Student")])), /Invalid allowed/);
  assert.throws(() => parseSuppliedUbcStudents(table([row("Example", "Student", "javascript:alert(1)")])), /Invalid allowed/);
});

test("snapshot preserves 500 unique study records, 76 programs and only three published completion years", () => {
  assert.equal(studentRecords.length, 500);
  assert.equal(new Set(studentRecords.map((record) => record.id)).size, 500);
  assert.equal(new Set(studentRecords.map((record) => record.name)).size, 500);
  assert.equal(deduplicateStudents(studentRecords).report.included, 500);
  assert.equal(new Set(studentRecords.map((record) => record.program)).size, 76);
  assert.deepEqual(studentRecords.filter((record) => record.expectedCompletion).map((record) => [record.name, record.expectedCompletion]).sort(), [["Christie Wu", "2027"], ["David Zhao", "2027"], ["Lauren Huang", "2027"]]);
  assert.equal(studentRecords.filter((record) => record.sourceKind === "university-profile").length, 497);
  assert.doesNotMatch(snapshotText, /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|"(?:email|phone|portrait|image|contact|gender|ethnicity)"\s*:|\/Users\/|\.jpe?g|\.png/);
});

test("normalised deduplication preserves 500 represented identities without cloning two existing rowers", () => {
  assert.equal(result.characters.length, 498);
  assert.deepEqual(result.report.duplicateNames.sort(), ["Claudia Makhanko-Tang", "Sarah Cushnie"]);
  assert.equal(result.existingStudyUpdates.length, 2);
  for (const update of result.existingStudyUpdates) {
    assert.ok(existingCharacters.some((character) => character.id === update.existingId && character.name === update.student.name));
    assert.ok(update.student.topics.find((topic) => topic.id === "studies"));
  }
  const parsed = parseSuppliedUbcStudents(table([row("Éxample", "Student"), row("Example", "Student", "https://www.ubc.ca/profile")]), [{ name: "Dr. Example Student" }]);
  assert.equal(parsed.students.length, 0);
  assert.equal(parsed.report.duplicateNames.length, 2);
  const sameSource = parseSuppliedUbcStudents(table([row("First", "Person"), row("Second", "Person")]));
  assert.equal(sameSource.report.duplicateSources.length, 1);
});

test("external study URLs are exact reviewed links, with no wildcard LinkedIn or personal-site permission", () => {
  for (const record of studentRecords) assert.equal(validStudentSource(record.sourceUrl), true, record.name);
  assert.equal(validStudentSource("https://economics.ubc.ca/people/?type=graduate_student"), true);
  for (const bad of ["https://ca.linkedin.com/in/another-person", "https://ca.linkedin.com/in/lauren-huang?tracking=1", "https://dykzhao.com/private", "https://evilubc.ca/", "https://ubc.ca.evil.invalid/", "https://user:secret@www.ubc.ca/", "http://www.ubc.ca/"]) assert.equal(validStudentSource(bad), false, bad);
  assert.equal(isStudentExternalSourceUrl("https://ca.linkedin.com/in/christiewu03"), true);
  assert.equal(isStudentExternalSourceUrl("https://www.linkedin.com/in/christiewu03"), false);
});

test("natural study replies remain separate from honest per-record source provenance and cosmetic representation", () => {
  const all = buildStudentCharacters().characters;
  assert.equal(Object.keys(studentSourceAudit).length, 11);
  assert.equal(all.filter((character) => character.sourceVerificationLabel === "Research supplied").length, 489);
  assert.equal(all.filter((character) => character.sourceVerificationLabel === "Source reviewed").length, 9);
  assert.equal(all.filter((character) => character.sourceVerificationLabel === "Indexed source reviewed").length, 2);
  for (const character of all) {
    assert.match(character.introduction, /^I’m /);
    assert.doesNotMatch(character.introduction, /virtual|simulation|registrar|verification|portrait/i);
    assert.ok(character.topics.length >= 3);
    assert.equal(character.routeSpace, "network");
    assert.deepEqual(character.route, []);
    assert.ok(character.biography.includes("registrar-confirmed"));
    assert.ok(character.disclaimer.includes("not quotations"));
    assert.equal(character.studentEvidence.program, studentRecords.find((record) => record.id === character.id).program);
  }
  assert.ok(new Set(all.map((character) => JSON.stringify(character.appearance))).size > 300);
  assert.deepEqual(all[0].appearance, buildStudentCharacters().characters[0].appearance);
  const corrected = all.find((character) => character.name === "Clement Soubrier");
  assert.ok(corrected?.sources.some((source) => source.url === "https://www.iam.ubc.ca/people/graduate-students/"));
  assert.ok(corrected?.biography.includes("malformed display title"));
  assert.equal(all.some((character) => character.name === "Clement PDF"), false);
});

test("integrated registry represents all 500 identities once, enriches existing rowers, and accepts every retained source URL", () => {
  assert.equal(studentImportReport.included, 498);
  for (const record of studentRecords) {
    const matches = integratedCharacters.filter((character) => character.name === record.name);
    assert.equal(matches.length, 1, record.name);
    const character = matches[0];
    assert.ok(character.topics.find((topic) => topic.id === "studies")?.answer.includes("UBC"));
    assert.ok(character.sources.some((source) => source.url === record.sourceUrl));
    assert.ok(character.sourceVerificationLabel);
    for (const source of character.sources) assert.equal(safeExternalUrl(source.url), source.url);
  }
  assert.equal(safeExternalUrl("https://ca.linkedin.com/in/other-student"), null);
  for (const name of ["Sarah Cushnie", "Claudia Makhanko-Tang"]) assert.equal(integratedCharacters.find((character) => character.name === name)?.kind, "athlete");
});

test("department-area anchors come from actual source buildings, with Economics distinct from Sauder", () => {
  const anchors = createStudentDepartmentAnchors(data);
  assert.equal(anchors["student-economics-0"].buildingId, "VBL10292");
  assert.equal(anchors["student-psychology-0"].buildingId, "VBL10131");
  assert.equal(anchors["student-statistics-0"].buildingId, "VBL10072");
  assert.equal(studentDepartment("Medical Physics"), "physics");
  assert.equal(studentDepartment("Chemical Engineering"), "chemical");
  for (const character of result.characters) assert.ok(anchors[character.zone], character.department);
  for (const anchor of Object.values(anchors)) {
    const building = data.buildings.find((b) => b.id === anchor.buildingId);
    const points = building.rings.flat();
    assert.equal(anchor.x, (Math.min(...points.map((p) => p[0])) + Math.max(...points.map((p) => p[0]))) / 2);
    assert.equal(anchor.z, (Math.min(...points.map((p) => p[1])) + Math.max(...points.map((p) => p[1]))) / 2);
  }
});

test("all 498 new students receive distributed, collision-clear loops on source paths, including closing edges", () => {
  const anchors = createStudentDepartmentAnchors(data);
  const collision = createCollision(data, [], new Set());
  const routes = planStudentRoutes(result.characters, data, anchors, collision.blocked);
  assert.equal(routes.size, 498);
  assert.ok(new Set([...routes.values()].map((route) => JSON.stringify(route.slice(1)))).size > 300, "departments do not share one tiny loop");
  const edges = data.routes.flatMap((route) => route.points.slice(1).map((point, i) => [route.points[i], point]));
  const checked = new Set();
  for (const route of routes.values()) for (let i = 0; i < route.length; i++) {
    const a = route[i], b = route[(i + 1) % route.length];
    const key = JSON.stringify([a, b]);
    if (checked.has(key)) continue;
    checked.add(key);
    assert.ok(edges.some(([p, q]) => segmentDistance(a, p, q) < 1e-6 && segmentDistance(b, p, q) < 1e-6), "every step stays on an actual source segment");
    const count = Math.max(1, Math.ceil(Math.hypot(a[0] - b[0], a[1] - b[1])));
    for (let n = 0; n <= count; n++) assert.equal(collision.blocked([a[0] + (b[0] - a[0]) * n / count, a[1] + (b[1] - a[1]) * n / count], 0), false);
  }
  assert.equal(planStudentRoutes(result.characters, data, anchors, () => true).size, 0, "blocked departments fail closed, never inventing a path");
});

test("vacant-slot selection prioritises unseen and least-recently encountered students without mutating input", () => {
  const candidates = [{ id: "recent", distance: 12 }, { id: "old", distance: 20 }, { id: "unseen-far", distance: 60 }, { id: "unseen-near", distance: 30 }];
  const order = orderStudentEncounters(candidates, new Map([["recent", 200], ["old", 10]]));
  assert.deepEqual(order.map((candidate) => candidate.id), ["unseen-near", "unseen-far", "old", "recent"]);
  assert.equal(candidates[0].id, "recent");
});

test("integrated population keeps at most twelve streamed actors, moves students without entering source buildings, and preserves active conversations during rotation", () => {
  const anchors = {
    ...JSON.parse(readFileSync(new URL("../../public/ubc/v0.1-2026-10-30/anchors.json", import.meta.url), "utf8")),
    ...JSON.parse(readFileSync(new URL("./data/expansion-anchors.json", import.meta.url), "utf8")),
  };
  const departments = createStudentDepartmentAnchors(data);
  const collision = createCollision(data, [], new Set());
  const people = createPeople(data, anchors, collision.blocked);
  const streamedIds = new Set(integratedCharacters.filter((character) => character.routeSpace === "network").map((character) => character.id));
  const studentIds = new Set(result.characters.map((character) => character.id));
  const encountered = new Set();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 250);
  let time = 0;
  try {
    for (const zone of ["student-mathematics-0", "student-economics-0", "student-psychology-0", "student-statistics-0", "student-computer-0"]) {
      const anchor = departments[zone];
      const focus = [anchor.x, anchor.z];
      camera.position.set(anchor.x, 1.7, anchor.z);
      camera.lookAt(anchor.x, 1.7, anchor.z - 50);
      for (let step = 0; step < 45; step++) {
        time += 0.05;
        people.update(0.05, time, focus, 12, true, null, false, 0.05, camera);
        const streamed = people.actors.filter((actor) => streamedIds.has(actor.id));
        assert.ok(streamed.length <= 12, `streamed pool is bounded in ${zone}`);
        for (const actor of streamed.filter((actor) => studentIds.has(actor.id))) {
          encountered.add(actor.id);
          assert.equal(collision.blocked([actor.group.position.x, actor.group.position.z], actor.group.position.y), false, "student body never enters source building collision");
        }
      }
      const active = people.actors.find((actor) => studentIds.has(actor.id));
      if (active) {
        const before = active.group.position.clone();
        people.update(0.7, time + 120, focus, 12, true, active.id, false, 0.05, camera);
        assert.ok(people.actors.includes(active), "active conversation is not replaced by an unseen waiting student");
        assert.ok(active.group.position.equals(before), "selected speaker stays still");
        time += 120;
      }
    }
    assert.ok(encountered.size >= 20, `actual student discovery across department areas: ${encountered.size}`);
  } finally {
    const resources = new Set();
    people.group.traverse((object) => {
      if (object.geometry) resources.add(object.geometry);
      for (const material of object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : []) {
        resources.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
      }
    });
    resources.forEach((resource) => resource.dispose());
  }
});
