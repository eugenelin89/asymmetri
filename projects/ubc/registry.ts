import type { Character, Link, Place, Topic } from "./types";

export const checked = "2026-10-30";
export const unofficial =
  "An independent Asymmetri Labs visualization. Not affiliated with or endorsed by UBC. Virtual access does not grant real-world access.";
const link = (label: string, url: string): Link => ({ label, url });
export const sources = {
  geo: link(
    "UBC Open Geospatial Data",
    "https://github.com/UBCGeodata/ubc-geospatial-opendata",
  ),
  map: link(
    "Official campus maps · September 2026",
    "https://planning.ubc.ca/about-us/campus-maps",
  ),
  rose: link(
    "Official Rose facility information",
    "https://sportfacilities.ubc.ca/baseball-tc/",
  ),
  stadium: link(
    "Official baseball stadium information",
    "https://sportfacilities.ubc.ca/construction-news/completed-projects/baseball-stadium/",
  ),
  sauder: link("UBC Sauder School of Business", "https://www.sauder.ubc.ca/"),
  werker: link(
    "Greg Werker · official faculty profile",
    "https://www.sauder.ubc.ca/people/greg-werker",
  ),
  health: link(
    "Centre for Advancing Health Outcomes",
    "https://www.advancinghealth.ubc.ca/team-member/greg-werker/",
  ),
  president: link(
    "Office of the President · biography",
    "https://president.ubc.ca/about-the-president/",
  ),
  about: link("About UBC", "https://www.ubc.ca/about/"),
  admissions: link("UBC prospective students", "https://you.ubc.ca/"),
  books: link(
    "Bookstore location and current hours",
    "https://bookstore.ubc.ca/pages/locations/vancouver",
  ),
  nest: link("AMS Student Nest", "https://www.ams.ubc.ca/your-building/"),
  study: link(
    "AMS study rooms",
    "https://www.ams.ubc.ca/your-building/study-rooms/",
  ),
  clubs: link(
    "AMS clubs and student organizations",
    "https://www.ams.ubc.ca/student-life/clubs/",
  ),
};
const reconstruction =
  "Level B · reference-based reconstruction. Public descriptions and historical plans inform this original model; dimensions, facade details and furnishings are not an as-built survey.";
export const places: Place[] = [
  {
    id: "stadium",
    name: "Tourmaline West Baseball Stadium",
    category: "Athletics",
    address: "Thunderbird Park · UBC Vancouver",
    description:
      "The home of UBC Baseball. The 2018 upgrade added artificial turf, LED lighting, a scoreboard, covered dugouts, bullpens and a 480-seat grandstand.",
    interior: "B",
    reconstruction:
      "Reference-based field and spectator structures on official landscape geometry. Field markings and architectural details remain approximate. You may explore the virtual field; real access is separate.",
    links: [
      sources.stadium,
      link(
        "Stadium design reference",
        "https://www.mbtw.com/design-portfolio/tourmaline-west-stadium",
      ),
    ],
    verified: checked,
  },
  {
    id: "rose",
    name: "Rose Indoor Training Centre",
    category: "Athletics",
    address: "3085 Wesbrook Mall",
    description:
      "A baseball training facility beside the stadium, with four batting cages and a separate pitching area. The official facility lists two pitching mounds and protective screens.",
    interior: "B",
    reconstruction,
    links: [sources.rose],
    verified: checked,
  },
  {
    id: "sauder",
    name: "Henry Angus · UBC Sauder",
    category: "Faculties",
    address: "2053 Main Mall",
    description:
      "Explore the public-lobby reconstruction and meet the educational simulation of Dr. Greg Werker. The adjacent Sauder Powerhouse expansion remains a construction project, with completion expected in 2027.",
    interior: "B",
    reconstruction,
    links: [
      sources.sauder,
      link(
        "Sauder expansion status",
        "https://planning.ubc.ca/CV2050-implementation",
      ),
    ],
    verified: checked,
  },
  {
    id: "bookstore",
    name: "UBC Bookstore",
    category: "Retail",
    address: "6200 University Boulevard",
    description:
      "Course materials, books, stationery, official university apparel and gifts. Published regular hours, checked October 30, 2026: Mon–Fri 10–6, Sat 10–5, Sun closed. Holidays and events may change hours.",
    interior: "B",
    reconstruction:
      "Level B · historical plans and public references inform the exterior. Shelves, merchandise and circulation are representative, not a current inventory or exact retail layout.",
    links: [
      sources.books,
      link(
        "Public historical building plans",
        "https://planning.ubc.ca/ubc-bookstore",
      ),
    ],
    verified: checked,
  },
  {
    id: "nest",
    name: "AMS Student Nest",
    category: "Student life",
    address: "6133 University Boulevard",
    description:
      "Student-run spaces for study, food, clubs and gathering. Explore the reconstructed atrium and supported upper galleries. The official amenities map documents five levels; this preview models three public levels.",
    interior: "B",
    reconstruction:
      "Level B · a public-space interpretation informed by the AMS amenities map and published timber architecture. Supported stairs and galleries are navigable; not an exact floor plan.",
    links: [
      sources.nest,
      sources.study,
      link(
        "Official amenities and floor map",
        "https://www.ams.ubc.ca/wp-content/uploads/2023/01/v2_Nest-Amenities-Map-1.pdf",
      ),
    ],
    verified: checked,
  },
  {
    id: "rose-garden",
    name: "UBC Rose Garden",
    category: "Gardens",
    address: "North end of Main Mall",
    description:
      "A garden destination overlooking the Strait of Georgia. This preview retains GIS landscape geometry; detailed garden planting is still in development.",
    interior: "C",
    reconstruction: "GIS exterior with illustrative vegetation.",
    links: [sources.map],
    verified: checked,
  },
  {
    id: "beaty",
    name: "Beaty Biodiversity Museum",
    category: "Museums",
    address: "2212 Main Mall",
    description:
      "Explore biodiversity through the museum’s collections and public exhibits. Museum interiors are not yet modelled in this preview.",
    interior: "C",
    reconstruction: "GIS exterior only.",
    links: [link("Beaty Biodiversity Museum", "https://beatymuseum.ubc.ca/")],
    verified: checked,
  },
  {
    id: "koerner",
    name: "Walter C. Koerner Library",
    category: "Libraries",
    address: "1958 Main Mall",
    description:
      "A major UBC library destination. Follow the official library information for services and current access.",
    interior: "C",
    reconstruction: "GIS exterior only.",
    links: [link("UBC Library", "https://www.library.ubc.ca/")],
    verified: checked,
  },
  {
    id: "irving",
    name: "Irving K. Barber Learning Centre",
    category: "Libraries",
    address: "1961 East Mall",
    description:
      "Learning and library spaces in the academic core. This version includes its geographic exterior context.",
    interior: "C",
    reconstruction: "GIS exterior only.",
    links: [link("Irving K. Barber Learning Centre", "https://ikblc.ubc.ca/")],
    verified: checked,
  },
];
export const displays: Record<
  string,
  { name: string; description: string; links: Link[]; building: string }
> = {
  "rose-info": {
    name: "Train at the Rose",
    description:
      "Four batting cages, a pitching area and year-round indoor training. Explore the virtual reconstruction and consult UBC for real facility access.",
    links: [sources.rose],
    building: "rose",
  },
  "stadium-info": {
    name: "Welcome to Thunderbird Park",
    description:
      "Explore the stadium, grandstand, dugouts and bullpens. These are virtual privileges; real facility use has separate rules.",
    links: [sources.stadium],
    building: "stadium",
  },
  "books-textbooks": {
    name: "Textbooks & course materials",
    description:
      "Find official course-material information for students. These display books are representative; no live stock or prices are shown.",
    links: [
      link(
        "Find course materials",
        "https://bookstore.ubc.ca/pages/info/course-materials-for-students",
      ),
    ],
    building: "bookstore",
  },
  "books-apparel": {
    name: "University apparel",
    description:
      "Discover official UBC clothing through the bookstore. Display garments are original illustrative models.",
    links: [
      link(
        "Official UBC apparel",
        "https://bookstore.ubc.ca/collections/ubc-originals",
      ),
    ],
    building: "bookstore",
  },
  "books-supplies": {
    name: "Campus supplies",
    description:
      "Pens, notebooks and study essentials. Visit the official store for current selection.",
    links: [
      link("Pens and stationery", "https://bookstore.ubc.ca/collections/pens"),
      sources.books,
    ],
    building: "bookstore",
  },
  "nest-study": {
    name: "Find a place to study",
    description:
      "AMS provides study-room information and booking policies. This simulation does not show availability or accept bookings.",
    links: [sources.study],
    building: "nest",
  },
  "nest-clubs": {
    name: "Find your community",
    description:
      "Student clubs bring people together around shared interests. Explore the official AMS directory.",
    links: [sources.clubs],
    building: "nest",
  },
  "nest-food": {
    name: "Food at the Nest",
    description:
      "Explore current food outlets and services through AMS. The virtual counters represent public food spaces.",
    links: [
      link("AMS food outlets", "https://www.ams.ubc.ca/your-building/food/"),
    ],
    building: "nest",
  },
  "sauder-programs": {
    name: "Study at Sauder",
    description:
      "Explore undergraduate and graduate business education, program requirements and current student information.",
    links: [sources.sauder],
    building: "sauder",
  },
};
const topic = (
  id: string,
  question: string,
  answer: string,
  keywords: string[],
  links: Link[],
  followups?: string[],
): Topic => ({ id, question, answer, keywords, sources: links, followups });
const werkerTopics: Topic[] = [
  topic(
    "teaching",
    "What does Dr. Werker teach?",
    "His UBC faculty profile lists Operations and Climate for 2026–2027. His public professional biography also describes teaching in quantitative decision-making, statistics, supply-chain analytics and operations. Those teaching areas do not establish the current timetable.",
    ["teach", "course", "quantitative"],
    [sources.werker, sources.health],
    ["or", "statistics"],
  ),
  topic(
    "or",
    "What is Operations Research?",
    "Operations research uses mathematical models to compare decisions under constraints. A hospital, for example, can compare staffing plans while accounting for demand, skill requirements and limited resources. Models support human decisions; their assumptions and consequences still need scrutiny.",
    ["operations research", "optimization", "optimisation"],
    [sources.health],
    ["health", "math"],
  ),
  topic(
    "management",
    "What is Management Science?",
    "Management science uses quantitative models, data and structured analysis to support organizational decisions. It overlaps with operations research; the emphasis is on defining a decision, testing alternatives and understanding trade-offs.",
    ["management science"],
    [sources.health],
    ["analytics"],
  ),
  topic(
    "study",
    "What can students study at Sauder?",
    "Sauder provides undergraduate and graduate business education. Programs, prerequisites and admissions requirements vary. Use the official program pages to compare current options; this guide cannot promise admission.",
    ["study", "sauder", "program", "admission"],
    [sources.sauder],
    ["teaching"],
  ),
  topic(
    "math",
    "How is mathematics used in business?",
    "Mathematics helps express choices and constraints: how much stock to hold, where to locate a service or how to allocate staff. An objective such as reducing waiting time can be balanced against cost and fairness. A good model makes its assumptions visible.",
    ["math", "mathematics", "business"],
    [sources.health],
    ["health", "statistics"],
  ),
  topic(
    "statistics",
    "How does statistics support decisions?",
    "Statistics helps distinguish patterns from chance, estimate uncertainty and evaluate evidence. For example, demand forecasts should include uncertainty rather than treating one predicted number as certain. Data quality and the way observations were collected matter.",
    ["statistics", "statistical", "data"],
    [sources.health],
    ["analytics"],
  ),
  topic(
    "health",
    "What are examples of healthcare optimization?",
    "Examples include planning staffing, scheduling appointments and modelling patient flow. Dr. Werker’s public biography describes healthcare planning and resource-allocation research. These are educational examples, not medical advice or claims about a particular hospital’s current operations.",
    ["healthcare optimization", "healthcare", "health", "hospital", "patient"],
    [sources.health],
    ["or"],
  ),
  topic(
    "analytics",
    "How do business analytics and management differ?",
    "Business analytics focuses on using data and models to understand situations and support choices. Management includes setting direction, coordinating people and resources, and taking responsibility for decisions. The two often work together.",
    ["analytics", "management"],
    [sources.sauder],
    ["math"],
  ),
  topic(
    "facilities",
    "Where are Sauder student facilities?",
    "You are near Henry Angus at 2053 Main Mall. This preview reconstructs part of the public lobby. Consult UBC’s official maps and Sauder resources for real classrooms, accessibility and current construction changes.",
    ["classroom", "facility", "facilities", "where"],
    [sources.sauder, sources.map],
    ["study"],
  ),
  topic(
    "more",
    "Where can I learn more?",
    "Start with Dr. Werker’s official faculty profile and the Centre for Advancing Health Outcomes biography. These describe his public professional work. This educational guide was not written or endorsed by Dr. Werker.",
    ["more", "profile", "biography"],
    [sources.werker, sources.health],
  ),
];
const baconTopics: Topic[] = [
  topic(
    "welcome",
    "Welcome to UBC?",
    "Welcome to this independent virtual visit. UBC’s Vancouver campus is on the traditional, ancestral and unceded territory of the Musqueam people. Begin with the baseball precinct or explore the academic core and student spaces.",
    ["hello", "welcome"],
    [sources.about],
    ["explore", "life"],
  ),
  topic(
    "known",
    "What is UBC known for?",
    "UBC is a public research university with Vancouver and Okanagan campuses. Teaching, research and community engagement span a broad range of disciplines. The official university overview provides current facts and research information.",
    ["known", "special", "research"],
    [sources.about],
  ),
  topic(
    "international",
    "What can international students study?",
    "Prospective international students can explore programs through UBC’s admissions website. Requirements depend on the program, campus and educational background. Check the official pages for current eligibility and deadlines.",
    ["international", "study", "admission", "program"],
    [sources.admissions],
    ["life"],
  ),
  topic(
    "life",
    "What is student life like?",
    "Campus life includes learning, student organizations, recreation and places to gather. The AMS Student Nest is one place to discover clubs, food and study spaces. This simulated population is illustrative, not live occupancy.",
    ["student", "life", "clubs"],
    [sources.nest, sources.clubs],
    ["explore"],
  ),
  topic(
    "explore",
    "Where should I explore next?",
    "Try the Rose training centre beside the baseball stadium, then use the directory to visit the Bookstore, AMS Nest and Sauder. Follow the campus map for geographic context. Virtual walking routes are not real-world access advice.",
    ["explore", "next", "visit", "where"],
    [sources.map],
  ),
];
export const characters: Character[] = [
  {
    id: "werker",
    name: "Dr. Greg Werker",
    title:
      "Senior Associate Dean, Student Experience; Lecturer, Operations and Logistics",
    department: "UBC Sauder School of Business",
    institution: "University of British Columbia",
    label: "Dr. Greg Werker · Virtual Campus Guide",
    category: "named",
    model: "original-stylized-faculty",
    zone: "sauder",
    route: [
      [-5, 7],
      [5, 7],
      [5, 14],
      [-5, 14],
    ],
    behaviour:
      "Walk a short public-approach loop; pause and face visitors during conversation.",
    topics: werkerTopics,
    biography:
      "His public professional work includes operations research, management science and healthcare planning. The faculty profile is used for the current title; the leadership directory still uses “Senior Associate Dean, Students”.",
    sources: [sources.werker, sources.health],
    verified: checked,
    permissions:
      "Original stylized model. No portrait textures, voice imitation, likeness licence or endorsement.",
    disclaimer:
      "Educational simulation based on publicly available information. Not an official statement by Dr. Greg Werker.",
    status: "Available in the virtual Sauder area",
  },
  {
    id: "bacon",
    name: "Dr. Benoit-Antoine Bacon",
    title: "17th President and Vice-Chancellor of UBC",
    department: "Office of the President",
    institution: "University of British Columbia",
    label: "Dr. Benoit-Antoine Bacon · Virtual Campus Guide",
    category: "named",
    model: "original-stylized-president",
    zone: "nest",
    route: [
      [-8, 8],
      [8, 8],
      [8, 17],
      [-8, 17],
    ],
    behaviour:
      "Walk a simulated public plaza loop and pause for conversation. Not a real schedule.",
    topics: baconTopics,
    biography:
      "Benoit-Antoine Bacon began his five-year term as UBC’s 17th President and Vice-Chancellor on November 1, 2023. His official September 2026 welcome corroborates the role; the biography may require browser verification.",
    sources: [
      sources.president,
      link(
        "Official September 2026 welcome",
        "https://president.ubc.ca/communications/2026/09/08/welcome-back-message-from-dr-benoit-antoine-bacon-2/",
      ),
    ],
    verified: checked,
    permissions:
      "Original stylized model; no copied likeness or voice. No endorsement.",
    disclaimer:
      "Educational simulation based on public UBC information. Not a quotation, live conversation or official statement by Dr. Bacon.",
    status: "Available in the virtual academic core",
  },
];
export function safeExternalUrl(value: string): string | null {
  try {
    const u = new URL(value);
    return u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      (u.hostname === "ubc.ca" ||
        u.hostname.endsWith(".ubc.ca") ||
        u.hostname === "www.ams.ubc.ca" ||
        u.hostname === "github.com" ||
        u.hostname === "www.mbtw.com")
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export function answerQuestion(
  character: Character,
  question: string,
): Topic | null {
  const q = question.trim().toLowerCase();
  // Curated lookup only: private opinions, schedules and unsupported claims never generated.
  if (
    !q ||
    /\b(opinion|believe|endorse|promise|guarantee|salary|live|schedule|where are you|private)\b/.test(
      q,
    )
  )
    return null;
  return (
    character.topics
      .map((t) => ({
        t,
        score: t.keywords.reduce(
          (n, k) => n + (q.includes(k) ? k.length : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score)
      .find((x) => x.score > 0)?.t ?? null
  );
}
