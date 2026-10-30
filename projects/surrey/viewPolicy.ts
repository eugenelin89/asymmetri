// SPDX-License-Identifier: MIT
import type { Mode } from "./types";
export const VIEW_HELP_KEY = "asymmetri.surrey.view-help.v1";
export const views: { mode: Mode; label: string }[] = [
  { mode: "ground", label: "Street Adventure" },
  { mode: "aerial", label: "Aerial Explore" },
];
export function viewShortcut(event: { key: string; repeat: boolean; ctrlKey: boolean; metaKey: boolean; altKey: boolean; defaultPrevented: boolean }, blocked: boolean, editable: boolean) {
  return !blocked && !editable && !event.defaultPrevented && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey && event.key.toLowerCase() === "v";
}
export function needsViewHelp(storage: Pick<Storage, "getItem">) {
  try { return storage.getItem(VIEW_HELP_KEY) !== "seen"; } catch { return true; }
}
export function rememberViewHelp(storage: Pick<Storage, "setItem">) {
  try { storage.setItem(VIEW_HELP_KEY, "seen"); } catch { /* Play and progress do not depend on tutorial storage. */ }
}
