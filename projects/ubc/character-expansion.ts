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
  introduction: string,
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
    introduction,
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
function facultyRole(title: string, department: string) {
  const onLeave = title.includes("(On Leave)");
  const interim = title.includes("(Interim)");
  let role = title
    .replace(/ \((?:On Leave|Interim|Continuing)\)/g, "")
    .replace("Associate Professor - Teaching", "Associate Professor of Teaching")
    .replace(" - Receptionist", " and Receptionist")
    .replace(/ - Masters? of Data Science/, " for the Master of Data Science program")
    .replace("Software Developer - Skin Simulation", "Software Developer working on Skin Simulation")
    .replace("Program and Project Manager - AML-TN/PLAI", "Program and Project Manager for AML-TN and PLAI")
    .replace("Systems Admin - Systopia Lab", "Systems Administrator with the Systopia Lab")
    .replace(/\s*&\s*|\//g, " and ")
    .replace(/\b[A-Z][a-z]+\b/g, (word) =>
      ["Warren", "Systopia"].includes(word) ? word : word.toLowerCase(),
    );
  if (interim) role = `interim ${role}`;
  const unit = /^(Computer Science|Physics & Astronomy)$/.test(department)
    ? `${department} department`
    : department;
  const context = /^dean\b/i.test(role)
    ? `of UBC’s ${unit}`
    : `in UBC’s ${unit}`;
  const leave = onLeave ? " I’m currently on leave." : "";
  if (/^(administrative support|systems administration)$/i.test(role))
    return `I work in ${role} ${context}.${leave}`;
  const article = /^dean\b/i.test(role)
    ? "the"
    : /^(?:[aeiou]|honorary)/i.test(role) ? "an" : "a";
  return `I’m ${article} ${role} ${context}.${leave}`;
}
for (const p of faculty.people) {
  const sources = [
      { label: "Official professional profile", url: p.url },
      { label: "Department directory", url: p.source },
    ],
    bio = `${p.name} is listed by UBC ${p.department} as ${p.title}.`,
    role = facultyRole(p.title, p.department);
  const c = record(
    p.id,
    p.name,
    p.title,
    p.department,
    p.zone,
    bio,
    sources,
    "faculty",
    `I’m ${p.name}. ${role}`,
  );
  c.topics = [
    topic(
      "role",
      "What is your university role?",
      role,
      sources,
      ["role", "teach", "job", "who"],
      ["field"],
    ),
    topic(
      "field",
      "What areas does your work involve?",
      p.research
        ? `My work includes ${p.research.replace(/\s*,\s*/g, ", ").replace(/\s*&\s*/g, " and ")}. You can read more on my profile.`
        : `I work with UBC’s ${p.department}. My professional profile has more about my role; would you like to explore the department?`,
      sources,
      ["research", "subject", "work", "field"],
      ["study"],
    ),
    topic(
      "study",
      "How can I explore this department?",
      `A good place to start is the ${p.department} website. You can explore courses, compare programs and find student resources there.`,
      [{ label: "Department", url: new URL(p.source).origin }],
      ["study", "program", "courses", "apply"],
    ),
    topic(
      "more",
      "Where can I learn more?",
      "Take a look at my professional profile or the department directory below. They’re good starting points for learning more.",
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
  const season = p.season.match(/\d{4}[-–]\d{2,4}/)?.[0] || p.season;
  const team = `UBC’s ${season} ${p.sport.toLowerCase()} team`;
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
    `I’m ${p.name}, from ${team}.`,
  );
  c.uniform = p.sport;
  c.jerseyNumber = p.number;
  c.permissions +=
    " The original bird drawing is not the UBC Thunderbird mark; the kit is a stylized reconstruction, not official merchandise.";
  c.topics = [
    topic(
      "sport",
      "Which sport do you play?",
      `I’m here with ${team}. You can find the rest of the team on our roster.`,
      sources,
      ["sport", "play", "who", "team"],
      ["season"],
    ),
    topic(
      "season",
      "Which season is your team from?",
      `The ${season} season. The roster below has the team lineup for that year.`,
      sources,
      ["season", "roster", "current"],
    ),
    topic(
      "practice",
      "Where can I find games and results?",
      "Check the team’s UBC Athletics page for fixtures, results and news. It’s the best place to follow along.",
      sources,
      ["practice", "game", "schedule", "where"],
    ),
    topic(
      "uniform",
      "What is the bird on your uniform?",
      "It’s a bird design made for this campus experience. A little nod to the teams you’ll meet around here!",
      sources,
      ["bird", "uniform", "clothing"],
    ),
    topic(
      "more",
      "Where can I follow UBC athletics?",
      "You can follow the team on UBC Athletics’ website. Try the profile and roster links below for more about the players and the season.",
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
for (const [id, name, title, zone, bio, introduction, story, connection] of [
  [
    "kim-campbell",
    "Kim Campbell",
    "UBC alumna · BA, LLB",
    "law",
    "Kim Campbell became Canada’s first woman prime minister in 1993. She studied arts and law at UBC.",
    "I’m Kim Campbell. I studied arts and law at UBC and went on to become Canada’s first woman prime minister.",
    "I became Canada’s first woman prime minister in 1993. Before my political career, I studied arts and law here at UBC.",
    "I studied arts and law at UBC, earning a BA and an LLB.",
  ],
  [
    "justin-trudeau",
    "Justin Trudeau",
    "UBC alumnus · BEd",
    "education",
    "Justin Trudeau earned a Bachelor of Education at UBC and served as Canada’s prime minister from 2015 to 2025.",
    "I’m Justin Trudeau. I studied education at UBC and served as Canada’s prime minister from 2015 to 2025.",
    "I served as Canada’s prime minister from 2015 to 2025. My UBC connection is through education—I earned my Bachelor of Education here.",
    "I earned a Bachelor of Education at UBC.",
  ],
  [
    "jody-wilson-raybould",
    "Jody Wilson-Raybould",
    "UBC alumna · LLB",
    "law",
    "Jody Wilson-Raybould is a UBC law graduate and a former federal Minister of Justice and Attorney General of Canada.",
    "I’m Jody Wilson-Raybould. I’m a UBC law graduate and a former Minister of Justice and Attorney General of Canada.",
    "I served as Canada’s Minister of Justice and Attorney General. My path included studying law here at UBC.",
    "I graduated from UBC with an LLB, a law degree.",
  ],
  [
    "robert-mundell",
    "Robert Mundell",
    "Historical UBC alumnus · economist",
    "sauder",
    "Robert Mundell was a UBC arts graduate and Nobel laureate in economics, known for international monetary theory and optimal currency areas.",
    "I’m Robert Mundell, an economist and UBC alumnus. My work explored currencies and international monetary policy.",
    "I received the Nobel Prize in economics. My work explored international monetary theory, including when it makes sense for different economies to share a currency.",
    "I was an arts student at UBC before continuing my work in economics.",
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
    introduction,
  );
  c.topics = [
    topic(
      "known",
      "Why are you well known?",
      story,
      [alumniSource],
      ["famous", "known", "why", "who"],
      ["connection"],
    ),
    topic(
      "connection",
      "What is your UBC connection?",
      connection,
      [alumniSource],
      ["degree", "ubc", "connection"],
    ),
    topic(
      "learn",
      "What can I learn from this story?",
      "A degree can lead in many directions. Exploring alumni stories is one way to see how people connect their studies with work beyond university.",
      [alumniSource],
      ["learn", "advice"],
    ),
    topic(
      "more",
      "Where can I read more?",
      "You’ll find more of my story in UBC Magazine. The link below is a good place to start.",
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
  "I’m Albert Einstein, a theoretical physicist. You may know my work on relativity and the photoelectric effect.",
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
    einstein.introduction,
    einsteinSources,
    ["who", "identity"],
    ["nobel"],
  ),
  topic(
    "ubc",
    "Did you teach at UBC?",
    "No. I was a faculty member at the Institute for Advanced Study from 1933 to 1955.",
    einsteinSources,
    ["ubc", "teach", "worked", "faculty"],
    ["relativity"],
  ),
  topic(
    "nobel",
    "What was your Nobel Prize for?",
    "I received the 1921 Nobel Prize in Physics for work in theoretical physics, especially the law of the photoelectric effect. The prize wasn’t specifically for relativity.",
    einsteinSources,
    ["nobel", "prize"],
  ),
  topic(
    "light",
    "What is the photoelectric effect?",
    "Light can give energy to electrons in a material. I described light as arriving in little packets of energy, with each packet’s energy tied to its frequency. If the frequency is too low, simply making the light brighter won’t free the electrons.",
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
    "The Institute for Advanced Study has a biography of my life and work. The Nobel Prize website explains the award, too—both links are below.",
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
  "I’m Mitch Hodge. I’m a coach with UBC Baseball.",
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
    "I’m an assistant coach with UBC Baseball.",
    mitchSources,
    ["who", "role", "coach"],
    ["facility"],
  ),
  topic(
    "facility",
    "What is inside Rose Training Centre?",
    "There are four batting cages, pitching machines and a pitching area with two mounds. Take a look around—you can walk through the training hall.",
    mitchSources,
    ["facility", "rose", "inside", "cages"],
  ),
  topic(
    "practice",
    "What are the players practicing?",
    "They’re working on batting and fielding fly balls. Watch the pitch, the swing and how the fielder gets underneath the ball.",
    mitchSources,
    ["practice", "players", "batting", "catch"],
  ),
  topic(
    "more",
    "Where can I learn more?",
    "Take a look at my UBC Athletics profile or the Rose Training Centre page below. You’ll find more about the coaching role and the facility there.",
    mitchSources,
    ["more", "website", "source"],
  ),
];
mitch.permissions +=
  " The approximately 6-foot-2 model height was requested by the project owner and is not a verified personal measurement. The walking route and dialogue are simulated.";
expandedCharacters.push(mitch);
