import { initialHalloweenPreference, parseHalloweenPreference } from "./environment";

/** Holiday identity/calendar are separate from user-selected weather and people.
 * Add future editions here with a matching engine overlay; do not repurpose
 * existing visitor settings, profiles or campus geography for a holiday.
 */
export const campusEditions = {
  regular: { label: "Regular campus", halloween: false, available: true, seasonal: () => false },
  halloween: { label: "Halloween", halloween: true, available: true, seasonal: (date: Date) => initialHalloweenPreference(date) },
  christmas: { label: "Christmas · coming later", halloween: false, available: false, seasonal: (date: Date) =>
    Number.isFinite(date.getTime()) && new Intl.DateTimeFormat("en",{timeZone:"America/New_York",month:"numeric"}).format(date) === "12" },
} as const;
export type CampusEdition = keyof typeof campusEditions;
export type EditionChoice = "automatic" | CampusEdition;
export const editionStorageKey = "cwru-campus-edition-v1";
export function scheduledEdition(date: Date): CampusEdition {
  return (Object.keys(campusEditions) as CampusEdition[]).find(id=>campusEditions[id].seasonal(date)) || "regular";
}
export function activeEdition(choice: EditionChoice, date: Date): CampusEdition {
  const requested = choice === "automatic" ? scheduledEdition(date) : choice;
  return campusEditions[requested].available ? requested : "regular";
}
export function readEditionChoice(stored: unknown, legacy?: unknown, date = new Date()): EditionChoice {
  try {
    const value = typeof stored === "string" ? JSON.parse(stored) : stored;
    if (value && typeof value === "object" && "choice" in value && "version" in value && value.version === 1 &&
        (value.choice === "automatic" || (typeof value.choice === "string" && Object.hasOwn(campusEditions,value.choice))))
      return value.choice as EditionChoice;
  } catch { /* Unknown settings fall back to the local seasonal calendar. */ }
  const old = parseHalloweenPreference(legacy);
  const year = Number(new Intl.DateTimeFormat("en",{year:"numeric",timeZone:"America/New_York"}).format(date));
  return old?.year === year ? old.enabled ? "halloween" : "regular" : "automatic";
}
export const serializeEditionChoice = (choice: EditionChoice) => JSON.stringify({version:1,choice});
