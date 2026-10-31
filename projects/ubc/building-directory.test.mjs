import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import "./test-loader.mjs";
const { groupBuildings } = await import("./building-directory.ts");

test("multipart source buildings have one directory destination without removing map footprints", () => {
  const data = JSON.parse(
    readFileSync(
      new URL("../../public/ubc/v0.1-2026-10-30/data.json", import.meta.url),
    ),
  );
  const before = JSON.stringify(data.buildings);
  const groups = groupBuildings(data.buildings);
  assert.equal(groups.length, 425);
  assert.equal(new Set(groups.map((g) => g.building.name)).size, groups.length);
  const crescent = groups.filter((g) => g.building.name === "Crescent West");
  assert.equal(crescent.length, 1);
  assert.equal(crescent[0].parts.length, 7);
  assert.equal(crescent[0].building.id, "VBL10219");
  assert.equal(crescent[0].building.address, "5879 Gray Avenue");
  assert.equal(groups.flatMap((g) => g.parts).length, data.buildings.length);
  assert.equal(JSON.stringify(data.buildings), before);
});

test("same-named distinct source records remain distinct destinations, regardless of part order", () => {
  const part = { id: "A-part2", name: "Same name", rings: [], height: 3 };
  const root = { ...part, id: "A" };
  const groups = groupBuildings([part, { ...part, id: "B" }, root]);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].building, root);
  assert.equal(groups[0].parts.length, 2);
  assert.equal(groups[1].building.id, "B");
});
