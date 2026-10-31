/** Server-only durable store. Set STANFORD_PROFILE_DIR to a private, persistent directory. */
import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmdirSync,
  writeFileSync,
} from "node:fs";
import { isAbsolute, join } from "node:path";
import {
  createHash,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import {
  ProfileError,
  validateProfile,
  type PublicProfile,
  type ProfileDraft,
} from "./model";

type StoredProfile = PublicProfile & {
  secretHash: string;
  hidden: boolean;
  created: string;
};
type Report = {
  id: string;
  profile: string;
  reason: string;
  detail: string;
  created: string;
  reporter: string;
};
type State = { version: 1; profiles: StoredProfile[]; reports: Report[] };
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export const validId = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
    id,
  );
export function publicProfile(p: StoredProfile): PublicProfile {
  return {
    id: p.id,
    name: p.name,
    affiliation: p.affiliation,
    department: p.department,
    about: p.about,
    interests: p.interests,
    advice: p.advice,
    zone: p.zone,
    color: p.color,
    updated: p.updated,
  };
}
export function createProfileStore(directory: string) {
  if (!isAbsolute(directory))
    throw new Error("Profile storage must use an absolute private path.");
  const path = join(directory, "community.json"),
    lock = join(directory, ".write-lock");
  function read(): State {
    if (!existsSync(path)) return { version: 1, profiles: [], reports: [] };
    const state = JSON.parse(readFileSync(path, "utf8")) as State;
    if (
      state.version !== 1 ||
      !Array.isArray(state.profiles) ||
      !Array.isArray(state.reports)
    )
      throw new Error("Unsupported profile store; do not overwrite.");
    return state;
  }
  function transaction<T>(change: (state: State) => T): T {
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    try {
      mkdirSync(lock, { mode: 0o700 });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST")
        throw new ProfileError(
          "Profiles are busy. Please try again shortly.",
          503,
        );
      throw error;
    }
    try {
      const state = read(),
        result = change(state);
      const temp = join(directory, `.community-${randomUUID()}.tmp`),
        fd = openSync(temp, "wx", 0o600);
      try {
        writeFileSync(fd, JSON.stringify(state));
        fsyncSync(fd);
      } finally {
        closeSync(fd);
      }
      renameSync(temp, path);
      const folder = openSync(directory, "r");
      try {
        fsyncSync(folder);
      } finally {
        closeSync(folder);
      }
      return result;
    } finally {
      rmdirSync(lock);
    }
  }
  function owned(state: State, token: string) {
    const parts = token.split(".");
    const [id, secret] = parts;
    if (
      parts.length !== 2 ||
      !validId(id || "") ||
      !/^[A-Za-z0-9_-]{43}$/.test(secret || "")
    )
      throw new ProfileError("Your private recovery code is not valid.", 401);
    const p = state.profiles.find((p) => p.id === id);
    if (
      !p ||
      !timingSafeEqual(
        Buffer.from(p.secretHash, "hex"),
        Buffer.from(digest(secret), "hex"),
      )
    )
      throw new ProfileError("Your private recovery code is not valid.", 401);
    return p;
  }
  return {
    list: () =>
      read()
        .profiles.filter((p) => !p.hidden)
        .map(publicProfile),
    mine: (token: string) => {
      const p = owned(read(), token);
      return { profile: publicProfile(p), hidden: p.hidden };
    },
    create(value: unknown) {
      const draft = validateProfile(value);
      return transaction((state) => {
        if (state.profiles.length >= 2000)
          throw new ProfileError(
            "Community capacity has been reached. Please try later.",
            503,
          );
        const now = new Date().toISOString(),
          secret = randomBytes(32).toString("base64url"),
          id = randomUUID();
        const profile: StoredProfile = {
          ...draft,
          id,
          created: now,
          updated: now,
          secretHash: digest(secret),
          hidden: false,
        };
        state.profiles.push(profile);
        return {
          profile: publicProfile(profile),
          recoveryCode: `${id}.${secret}`,
        };
      });
    },
    update(token: string, value: unknown) {
      const draft = validateProfile(value);
      return transaction((state) => {
        const p = owned(state, token);
        if (p.hidden)
          throw new ProfileError(
            "This profile has been removed by moderation. You can delete it or contact support.",
            403,
          );
        Object.assign(p, draft, { updated: new Date().toISOString() });
        return publicProfile(p);
      });
    },
    remove(token: string) {
      transaction((state) => {
        const p = owned(state, token);
        state.profiles = state.profiles.filter((x) => x.id !== p.id);
        state.reports = state.reports.filter((r) => r.profile !== p.id);
      });
    },
    report(id: string, reason: string, detail: string, reporter: string) {
      if (
        !validId(id) ||
        !["privacy", "impersonation", "harassment", "spam", "other"].includes(
          reason,
        ) ||
        typeof detail !== "string" ||
        detail.length > 300
      )
        throw new ProfileError(
          "Choose a report reason and keep details under 300 characters.",
        );
      transaction((state) => {
        if (!state.profiles.some((p) => p.id === id && !p.hidden))
          throw new ProfileError("That profile is no longer public.", 404);
        state.reports = state.reports.filter(
          (r) => Date.now() - Date.parse(r.created) < 90 * 86400000,
        );
        if (
          state.reports.some((r) => r.profile === id && r.reporter === reporter)
        )
          return;
        if (state.reports.length >= 5000)
          throw new ProfileError(
            "Reports are busy. Please contact support.",
            503,
          );
        state.reports.push({
          id: randomUUID(),
          profile: id,
          reason,
          detail: detail.trim(),
          reporter,
          created: new Date().toISOString(),
        });
      });
    },
    review: () => {
      const state = read();
      return state.reports.map((r) => ({
        id: r.id,
        profile: r.profile,
        reason: r.reason,
        detail: r.detail,
        created: r.created,
        profileContent:
          state.profiles.find((p) => p.id === r.profile) &&
          publicProfile(state.profiles.find((p) => p.id === r.profile)!),
      }));
    },
    moderate(id: string, hidden: boolean) {
      if (!validId(id)) throw new ProfileError("Invalid profile ID.");
      transaction((state) => {
        const p = state.profiles.find((p) => p.id === id);
        if (!p) throw new ProfileError("Profile not found.", 404);
        p.hidden = hidden;
        p.updated = new Date().toISOString();
      });
    },
  };
}
export type ProfileStore = ReturnType<typeof createProfileStore>;
export type { ProfileDraft };
