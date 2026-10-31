import type { Character } from "../types";
import { normalizeAppearance, type Appearance } from "../appearance";

export const communityZones = [
  { id: "kelvin-smith", name: "Kelvin Smith Library oval" },
  { id: "tinkham-veale", name: "Tinkham Veale public plaza" },
  { id: "peter-lewis", name: "Weatherhead / Peter B. Lewis approach" },
  { id: "strosacker", name: "Case Quad / engineering approach" },
  { id: "mather-house", name: "Arts and Sciences / Mather Quad" },
  { id: "veale", name: "Veale athletics public approach" },
  { id: "clarke", name: "Clarke Tower public approach" },
  { id: "village", name: "Village at 115 public paths" },
  { id: "law", name: "School of Law public approach" },
  { id: "nursing", name: "Health Education Campus public paths" },
  { id: "mandel", name: "Mandel School public approach" },
] as const;
export const affiliations = [
  "Visitor",
  "Prospective student",
  "Student",
  "Alumnus / alumna",
  "Faculty",
  "Staff",
] as const;
export const shirtColors = {
  teal: "#507d7b",
  blue: "#315d88",
  gold: "#b18b51",
  rust: "#985f4d",
  plum: "#80567d",
};
export type ProfileDraft = {
  name: string;
  affiliation: (typeof affiliations)[number];
  department: string;
  about: string;
  interests: string;
  advice: string;
  zone: (typeof communityZones)[number]["id"];
  color: keyof typeof shirtColors;
  appearance?: Appearance;
};
export type PublicProfile = ProfileDraft & { id: string; updated: string };
export class ProfileError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function validateProfile(value: unknown): ProfileDraft {
  if (!value || typeof value !== "object")
    throw new ProfileError("Please complete your profile.");
  const v = value as Record<string, unknown>;
  const text = (key: string, min: number, max: number) => {
    if (typeof v[key] !== "string") throw new ProfileError(`Check ${key}.`);
    const result = v[key].trim().normalize("NFC");
    if (
      result.length < min ||
      result.length > max ||
      /[<>\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(result)
    )
      throw new ProfileError(
        `Check ${key}: use ${min}–${max} plain-text characters.`,
      );
    if (
      /https?:|www\.|[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){8,}/i.test(
        result,
      )
    )
      throw new ProfileError(
        "Keep links, contact details and private information out of public profiles.",
      );
    return result;
  };
  const name = text("name", 2, 50),
    department = text("department", 0, 80),
    about = text("about", 1, 300),
    interests = text("interests", 1, 240),
    advice = text("advice", 0, 240);
  if (
    !affiliations.includes(v.affiliation as ProfileDraft["affiliation"]) ||
    !communityZones.some((z) => z.id === v.zone) ||
    !Object.hasOwn(shirtColors, String(v.color))
  )
    throw new ProfileError(
      "Select a listed affiliation, meeting area and shirt colour.",
    );
  if (v.consent !== true)
    throw new ProfileError(
      "Confirm that this is your own profile and you agree to publish the information you entered.",
    );
  return {
    name,
    department,
    about,
    interests,
    advice,
    affiliation: v.affiliation as ProfileDraft["affiliation"],
    zone: v.zone as ProfileDraft["zone"],
    color: v.color as ProfileDraft["color"],
    appearance: normalizeAppearance(v.appearance),
  };
}
export function profileCharacter(p: PublicProfile): Character {
  const role = {
    Visitor: "I’m visiting campus.",
    "Prospective student": "I’m thinking about coming here to study.",
    Student: "I’m a student.",
    "Alumnus / alumna": "I’m an alum.",
    Faculty: "I’m a faculty member.",
    Staff: "I’m a staff member.",
  }[p.affiliation];
  return {
    id: `community-${p.id}`,
    name: p.name,
    introduction: `I’m ${p.name}. ${role}`,
    title: `${p.affiliation} · Self-described${p.department ? ` · ${p.department}` : ""}`,
    department: p.department,
    institution: "Community participant; affiliation unverified",
    label: p.name,
    category: "community",
    model: "original-community-visitor",
    zone: p.zone,
    routeSpace: "network",
    route: [
      [-4, 6],
      [4, 6],
      [4, 11],
      [-4, 11],
    ],
    behaviour: "Simulated public walking route, not live presence",
    biography: p.about,
    sources: [],
    verified: p.updated.slice(0, 10),
    permissions:
      "Participant-submitted text and consent; original avatar, no uploaded likeness",
    disclaimer:
      "Player-written public profile. Identity and university affiliation are not verified. This character is a simulation, not a live chat or the person’s real location.",
    status: "Community profile",
    color: shirtColors[p.color],
    appearance: { ...normalizeAppearance(p.appearance), shirt: shirtColors[p.color] },
    topics: [
      {
        id: "about",
        question: "Tell me about yourself.",
        answer: p.about,
        keywords: ["hello", "who", "about"],
        sources: [],
        followups: ["interests"],
      },
      {
        id: "interests",
        question: "What are you interested in?",
        answer: p.interests,
        keywords: ["interest", "study", "research"],
        sources: [],
        followups: ["advice"],
      },
      ...(p.advice
        ? [
            {
              id: "advice",
              question: "What would you like visitors to know?",
              answer: p.advice,
              keywords: ["advice", "visitor", "know"],
              sources: [],
            },
          ]
        : []),
    ],
  };
}
