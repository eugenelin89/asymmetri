/** Original avatar options. Local preferences, never an inference about identity. */
export const appearanceOptions = {
  presentation: ["Feminine", "Masculine", "Androgynous"],
  skin: ["#f2cfb2", "#d7a67e", "#b57a52", "#895637", "#543729", "#372821"],
  hair: [
    "#241e1b",
    "#55382b",
    "#98613b",
    "#c9ac70",
    "#aaa59c",
    "#dedbd2",
    "#704d80",
  ],
  hairstyle: ["Short", "Long", "Curly", "Bald"],
  outfit: ["T-shirt", "Jacket", "Hoodie"],
  shirt: ["#31556e", "#5d7771", "#963d4c", "#c5a357", "#dedbd2", "#30373f"],
  trousers: ["#303941", "#527088", "#8a7760", "#e1d8bf"],
  footwear: ["Trainers", "Boots"],
  shoes: ["#292e32", "#ede9df", "#9b573f", "#385b7b"],
} as const;
export type Appearance = { [K in keyof typeof appearanceOptions]: string };
export const defaultAppearance: Appearance = {
  presentation: "Androgynous",
  skin: "#b57a52",
  hair: "#55382b",
  hairstyle: "Short",
  outfit: "Jacket",
  shirt: "#31556e",
  trousers: "#303941",
  footwear: "Trainers",
  shoes: "#ede9df",
};
export const appearanceStorageKey = "stanford-visitor-appearance-v1";
export function normalizeAppearance(value: unknown): Appearance {
  const input =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  return Object.fromEntries(
    Object.entries(appearanceOptions).map(([key, values]) => [
      key,
      (values as readonly unknown[]).includes(input[key])
        ? input[key]
        : defaultAppearance[key as keyof Appearance],
    ]),
  ) as Appearance;
}
