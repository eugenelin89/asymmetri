import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  statSync,
  mkdirSync,
  rmdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import "./test-loader.mjs";
const { createProfileStore } = await import("./community/store.ts");
const { validateProfile, profileCharacter } =
  await import("./community/model.ts");
const { body, guard, response } = await import("./community/http.ts");
const draft = {
  name: "Test Visitor",
  affiliation: "Visitor",
  department: "",
  about: "A disposable validation profile.",
  interests: "Campus architecture",
  advice: "",
  zone: "nest",
  color: "teal",
  consent: true,
};
test("public profile lifecycle: immediate publication, ownership, moderation, recovery and removal", () => {
  const dir = mkdtempSync(join(tmpdir(), "ubc-profile-test-"));
  try {
    const s = createProfileStore(dir),
      a = s.create(draft),
      b = s.create({ ...draft, name: "Second Visitor" });
    assert.equal(s.list().length, 2);
    assert.equal(s.mine(a.recoveryCode).profile.name, draft.name);
    assert.throws(
      () => s.update(a.profile.id + "." + b.recoveryCode.split(".")[1], draft),
      /not valid/,
    );
    assert.throws(() => s.mine(a.recoveryCode + ".extra"), /not valid/);
    s.update(a.recoveryCode, { ...draft, about: "Updated by its owner." });
    assert.equal(s.list()[0].about, "Updated by its owner.");
    const raw = readFileSync(join(dir, "community.json"), "utf8");
    assert.ok(!raw.includes(a.recoveryCode.split(".")[1]));
    assert.equal(statSync(join(dir, "community.json")).mode & 0o777, 0o600);
    for (const p of s.list()) {
      assert.ok(!("secretHash" in p));
      assert.ok(!("reports" in p));
    }
    s.report(a.profile.id, "privacy", "Test report", "hashed-reporter");
    s.report(a.profile.id, "privacy", "Duplicate", "hashed-reporter");
    assert.equal(s.review().length, 1);
    assert.ok(!("reporter" in s.review()[0]));
    s.moderate(a.profile.id, true);
    assert.equal(s.list().length, 1);
    assert.equal(s.mine(a.recoveryCode).hidden, true);
    assert.throws(() => s.update(a.recoveryCode, draft), /moderation/);
    assert.equal(s.list().length, 1, "Editing cannot undo moderation");
    s.moderate(a.profile.id, false);
    assert.equal(s.list().length, 2);
    assert.match(profileCharacter(a.profile).disclaimer, /not verified/);
    mkdirSync(join(dir, ".write-lock"));
    assert.throws(() => s.update(a.recoveryCode, draft), /busy/);
    rmdirSync(join(dir, ".write-lock"));
    s.remove(a.recoveryCode);
    assert.equal(s.list().length, 1);
    assert.equal(s.review().length, 0);
    assert.throws(() => s.mine(a.recoveryCode), /not valid/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("profile validation rejects markup, contacts, malformed enums and missing own-profile consent", () => {
  for (const value of [
    { ...draft, consent: false },
    { ...draft, name: "<script>" },
    { ...draft, about: "Email test@example.com" },
    { ...draft, about: "Call 604 123 4567" },
    { ...draft, zone: "private-room" },
    { ...draft, color: "__proto__" },
    { ...draft, name: "\u202eTest" },
  ])
    assert.throws(() => validateProfile(value));
  assert.equal(
    validateProfile({ ...draft, name: "  Test Visitor  " }).name,
    "Test Visitor",
  );
});
test("profile HTTP boundary enforces origin, body limit, rate limit and secure private cookie", async () => {
  const req = (origin = "https://asymmetri.co", more = {}) =>
    new Request("https://asymmetri.co/api/ubc/profile", {
      method: "POST",
      headers: { origin, "x-real-ip": "test-rate-identity", ...more },
    });
  assert.throws(() => guard(req("https://evil.example"), "create"), /website/);
  assert.throws(
    () => guard(req(undefined, { "sec-fetch-site": "cross-site" }), "create"),
    /Cross-site/,
  );
  for (let i = 0; i < 3; i++) guard(req(), "create");
  assert.throws(() => guard(req(), "create"), /Too many/);
  const json = await body(
    new Request("https://asymmetri.co", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    }),
  );
  assert.equal(json.name, draft.name);
  await assert.rejects(
    () =>
      body(
        new Request("https://asymmetri.co", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "a".repeat(8193),
        }),
      ),
    /large/,
  );
  await assert.rejects(
    () =>
      body(
        new Request("https://asymmetri.co", {
          method: "POST",
          headers: { "content-type": "text/plain" },
          body: "{}",
        }),
      ),
    /JSON/,
  );
  const cookie = response({}, 200, "test").headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Strict/);
  assert.match(cookie, /Secure/);
  assert.equal(response({}).headers.get("cache-control"), "no-store");
});
