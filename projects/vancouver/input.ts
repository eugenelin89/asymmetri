import type { Input } from "./types";

/** Each finger/key owns its press. Releasing one must not release another. */
export function createInputState() {
  const held = new Map<string, Input>();
  return {
    set(source: string, action: Input, pressed: boolean) {
      if (pressed) held.set(source, action); else held.delete(source);
    },
    has(action: Input) { return [...held.values()].includes(action); },
    clear() { held.clear(); },
  };
}
