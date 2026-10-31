// SPDX-License-Identifier: MIT — each finger/key owns its held action.
import type { Input } from "./types";
export function createInputState() {
  const owners = new Map<string, Input>();
  return {
    set(source: string, action: Input, pressed: boolean) {
      if (pressed) owners.set(source, action);
      else owners.delete(source);
    },
    has(action: Input) { return [...owners.values()].includes(action); },
    clear() { owners.clear(); },
  };
}
