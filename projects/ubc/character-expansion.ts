import type { Character, Link, Topic } from "./types";
import athletes from "./data/athletes.json" with { type: "json" };
import faculty from "./data/faculty.json" with { type: "json" };
import { defaultAppearance } from "./appearance";
const checked = "2026-10-31";
const topic = (
  id: string,
  question: string,
  answer: string,
  sources: Link[],
  keywords: string[],
  followups?: string[],
): Topic => ({ id, question, answer, sources, keywords, followups });
function record(
  id: string,
  name: string,
  title: string,
  department: string,
  zone: string,
  biography: string,
  sources: Link[],
  kind: Character["kind"],
): Character {
  return {
    id,
    name,
    title,
    department,
    institution: "University of British Columbia",
    label: name,
    category: "named",
    kind,
    model: "original-stylized-educational-guide",
    zone,
    route: [],
    routeSpace: "network",
    behaviour:
      "Simulated walking on checked nearby campus paths. No real schedule or location tracking.",
    biography,
    sources,
    verified: checked,
    permissions:
      "Original stylized mesh and clothing. No portrait textures, cloned voice, endorsement or licensed likeness claimed.",
    disclaimer: `Educational simulation based on public information. Not a quotation, live conversation or official statement by ${name}.`,
    status: "Discover by meeting in the virtual world",
    topics: [],
  };
}
export const expandedCharacters: Character[] = [];
for (const p of faculty.people) {
  const sources = [
      { label: "Official professional profile", url: p.url },
      { label: "Department directory", url: p.source },
    ],
    bio = `${p.name} is listed by UBC ${p.department} as ${p.title}.`;
  const c = record(
    p.id,
    p.name,
    p.title,
    p.department,
    p.zone,
    bio,
    sources,
    "faculty",
  );
  c.topics = [
    topic(
      "role",
      "What is your university role?",
      bio,
      sources,
      ["role", "teach", "job", "who"],
      ["field"],
    ),
    topic(
      "field",
      "What areas does your work involve?",
      p.research
        ? `The department lists these research areas: ${p.research}. Follow the professional profile for details.`
        : `The directory verifies the role above. This simulation does not infer a research specialty or teaching assignment; the linked department is the reliable place to learn more.`,
      sources,
      ["research", "subject", "work", "field"],
      ["study"],
    ),
    topic(
      "study",
      "How can I explore this department?",
      `Visit the official ${p.department} website to explore its courses, programs and student resources. This character cannot make admissions promises or advise on individual eligibility.`,
      [{ label: "Department", url: new URL(p.source).origin }],
      ["study", "program", "courses", "apply"],
    ),
    topic(
      "location",
      "Is this where you are in real life?",
      "No. This is a simulated educational character on a virtual walking route, not a real person’s whereabouts, office appointment or timetable.",
      sources,
      ["where", "today", "location", "schedule"],
    ),
    topic(
      "more",
      "Where can I learn more?",
      "Open the official professional profile and department directory below. Roles can change after the verification date.",
      sources,
      ["more", "profile", "contact", "website"],
    ),
  ];
  expandedCharacters.push(c);
}
function sportZone(s: string) {
  const k = s.toLowerCase();
  return /basketball|volleyball/.test(k)
    ? "war-memorial"
    : /swimming/.test(k)
      ? "aquatic"
      : /ice hockey|men's hockey|women's hockey/.test(k)
        ? "sports-centre"
        : "stadium";
}
for (const p of athletes.people) {
  const sources = [
      { label: "Official athlete profile", url: p.url },
      { label: p.season, url: p.rosterUrl },
    ],
    bio = `${p.name} appears on UBC’s published ${p.season}${p.position ? ` as ${p.position}` : ""}. This is a season-specific roster record, not live team membership.`;
  const c = record(
    p.id,
    p.name,
    `${p.sport} · ${p.season}`,
    "UBC Athletics",
    sportZone(p.sport),
    bio,
    sources,
    "athlete",
  );
  c.uniform = p.sport;
  c.jerseyNumber = p.number;
  c.topics = [
    topic(
      "sport",
      "Which sport do you play?",
      bio,
      sources,
      ["sport", "play", "who", "team"],
      ["season"],
    ),
    topic(
      "season",
      "Which roster is this based on?",
      `This character is based on the official ${p.season}, checked ${checked}. Historical season entries are retained with their season label; no current enrollment or eligibility is inferred.`,
      sources,
      ["season", "roster", "current"],
    ),
    topic(
      "practice",
      "Is this a real practice or game?",
      "No. All movement and sports activity here are fictional ambient scenes. These positions do not show any athlete’s real location or training schedule.",
      sources,
      ["practice", "game", "schedule", "where"],
    ),
    topic(
      "uniform",
      "What is the bird on your uniform?",
      "An original bird drawing created for this independent campus experience. It is not the UBC Thunderbird mark. The sport-specific kit is a stylized reconstruction, not official merchandise.",
      sources,
      ["bird", "uniform", "clothing"],
    ),
    topic(
      "more",
      "Where can I follow UBC athletics?",
      "Use the official profile and roster links below for published team information, results and schedules. This character does not speak for the real athlete.",
      sources,
      ["more", "website", "results", "follow"],
    ),
  ];
  expandedCharacters.push(c);
}
const alumniSource: Link = {
  label: "UBC Magazine · alumni profiles (2026)",
  url: "https://magazine.alumni.ubc.ca/2026/most-famous-alum/bracket-business-politics-and-community-leadership-round-1",
};
for (const [id, name, title, zone, bio] of [
  [
    "kim-campbell",
    "Kim Campbell",
    "UBC alumna · BA, LLB",
    "law",
    "Kim Campbell became Canada’s first woman prime minister in 1993. She studied arts and law at UBC.",
  ],
  [
    "justin-trudeau",
    "Justin Trudeau",
    "UBC alumnus · BEd",
    "education",
    "Justin Trudeau earned a Bachelor of Education at UBC and served as Canada’s prime minister from 2015 to 2025.",
  ],
  [
    "jody-wilson-raybould",
    "Jody Wilson-Raybould",
    "UBC alumna · LLB",
    "law",
    "Jody Wilson-Raybould is a UBC law graduate and a former federal Minister of Justice and Attorney General of Canada.",
  ],
  [
    "robert-mundell",
    "Robert Mundell",
    "Historical UBC alumnus · economist",
    "sauder",
    "Robert Mundell was a UBC arts graduate and Nobel laureate in economics, known for international monetary theory and optimal currency areas.",
  ],
]) {
  const c = record(
    `alumni-${id}`,
    name,
    title,
    "UBC alumni",
    zone,
    bio,
    [alumniSource],
    "alumni",
  );
  c.topics = [
    topic(
      "known",
      "Why are you well known?",
      bio,
      [alumniSource],
      ["famous", "known", "why", "who"],
      ["connection"],
    ),
    topic(
      "connection",
      "What is your UBC connection?",
      title +
        ". The university’s alumni publication documents this connection.",
      [alumniSource],
      ["degree", "ubc", "connection"],
    ),
    topic(
      "history",
      "Is this a visit by the real person?",
      "No. This is a historical or illustrative alumni encounter. It does not imply a real campus visit, endorsement or current whereabouts.",
      [alumniSource],
      ["visit", "real", "today"],
    ),
    topic(
      "learn",
      "What can I learn from this story?",
      "Alumni pursue many different paths after university. Read the linked profile for this person’s documented public work, rather than treating this simulation as personal advice.",
      [alumniSource],
      ["learn", "advice"],
    ),
    topic(
      "more",
      "Where can I read more?",
      "The source below is UBC’s public alumni profile collection.",
      [alumniSource],
      ["more", "source", "website"],
    ),
  ];
  expandedCharacters.push(c);
}
const einsteinSources: Link[] = [
  {
    label: "Albert Einstein · Institute for Advanced Study",
    url: "https://www.ias.edu/scholars/einstein",
  },
  {
    label: "1921 Nobel Prize in Physics",
    url: "https://www.nobelprize.org/prizes/physics/1921/summary/",
  },
];
const einstein = record(
  "historical-einstein",
  "Albert Einstein",
  "Historical guest · physicist (1879–1955)",
  "History of physics",
  "hennings",
  "A historical educational guest near the virtual Physics building. Einstein was an Institute for Advanced Study faculty member from 1933 to 1955; this character does not present him as UBC faculty or an alumnus.",
  einsteinSources,
  "historical",
);
einstein.institution = "Historical guest; not affiliated with UBC";
einstein.appearance = {
  ...defaultAppearance,
  hair: "#dedbd2",
  hairstyle: "Curly",
  shirt: "#dedbd2",
  skin: "#d7a67e",
};
einstein.topics = [
  topic(
    "identity",
    "Who are you?",
    einstein.biography,
    einsteinSources,
    ["who", "ubc", "here"],
    ["nobel"],
  ),
  topic(
    "nobel",
    "What was Einstein’s Nobel Prize for?",
    "The 1921 physics prize recognized his work in theoretical physics, especially the law of the photoelectric effect. It was not awarded specifically for relativity.",
    einsteinSources,
    ["nobel", "prize"],
  ),
  topic(
    "light",
    "What is the photoelectric effect?",
    "Light can transfer energy to electrons in a material. Einstein’s light-quanta explanation connects each packet’s energy with its frequency; below a threshold frequency, increasing intensity alone cannot eject electrons from the material.",
    einsteinSources,
    ["light", "photoelectric", "electron"],
  ),
  topic(
    "relativity",
    "What does relativity mean?",
    "Special relativity relates measurements of space and time made by observers moving at constant speeds relative to one another. The speed of light in vacuum is the same for those observers. General relativity describes gravity through the geometry of spacetime.",
    [
      {
        label: "Einstein in brief · IAS",
        url: "https://www.ias.edu/albert-einstein-brief",
      },
    ],
    ["relativity", "gravity", "time", "space"],
  ),
  topic(
    "more",
    "Where can I learn more?",
    "Read the historical biography and Nobel Prize resources below. These are original educational summaries, not Einstein quotations or an imitation of his voice.",
    einsteinSources,
    ["more", "source", "website"],
  ),
];
expandedCharacters.push(einstein);
const mitchSources: Link[] = [
  {
    label: "Mitch Hodge · official UBC Athletics profile",
    url: "https://gothunderbirds.ca/sports/baseball/roster/coaches/mitch-hodge/4204",
  },
  {
    label: "Rose Indoor Training Centre",
    url: "https://sportfacilities.ubc.ca/baseball-tc/",
  },
];
const mitch = record(
  "coach-mitch-hodge",
  "Mitch Hodge",
  "Baseball coach · assistant-coach profile",
  "UBC Baseball",
  "rose",
  "The linked UBC Athletics profile lists Mitch Hodge as Assistant Coach. Its staff selector is not a confirmation of his current assignment, so this simulation preserves the profile attribution without claiming current staff membership.",
  mitchSources,
  "coach",
);
mitch.height = 1.8796;
mitch.uniform = "baseball coach";
mitch.beard = true;
mitch.appearance = {
  ...defaultAppearance,
  presentation: "Masculine",
  skin: "#f2cfb2",
  hair: "#55382b",
  shirt: "#31556e",
  trousers: "#e1d8bf",
  outfit: "T-shirt",
};
mitch.routeSpace = undefined;
mitch.route = [
  [0, 4],
  [5, 4],
  [5, 10],
  [0, 10],
];
mitch.topics = [
  topic(
    "role",
    "What is your baseball role?",
    mitch.biography,
    mitchSources,
    ["who", "role", "coach"],
    ["facility"],
  ),
  topic(
    "facility",
    "What is inside Rose Training Centre?",
    "UBC documents four batting cages, pitching machines and a designated pitching area with two mounds. This virtual interior reconstructs the public training space.",
    mitchSources,
    ["facility", "rose", "inside", "cages"],
  ),
  topic(
    "practice",
    "What are the players practicing?",
    "The fictional baseball scene demonstrates a pitched ball, a bat swing and fielding a fly ball. It is an ambient illustration, not a coaching plan or a real team practice.",
    mitchSources,
    ["practice", "players", "batting", "catch"],
  ),
  topic(
    "model",
    "Is this your actual appearance and schedule?",
    "This is an original stylized model, approximately 6 feet 2 inches tall by the project owner’s request. That model height is not a verified personal measurement. The walking route and all dialogue are simulated.",
    mitchSources,
    ["height", "appearance", "schedule", "real"],
  ),
  topic(
    "more",
    "Where can I learn more?",
    "Use the official coach profile and facility page below for published information. No participation or endorsement by Mitch Hodge is implied.",
    mitchSources,
    ["more", "website", "source"],
  ),
];
expandedCharacters.push(mitch);
