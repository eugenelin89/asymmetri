import { athleticsSources } from "./athletics-layout";
import { expandedCharacters } from "./character-expansion";
import type { Character, Link, Place, Topic } from "./types";
import {
  orchardPlace,
  residenceDisplays,
  residenceStudents,
} from "./residence-content";

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
  orchardPlace,
  ...[
    ["ken-woods", "Ken Woods Field", "A soccer pitch beside the baseball precinct with source-aligned turf, full field markings, goals, netting and an ambient practice group."],
    ["harry-warren", "Harry Warren Field", "Explore the soccer field, marked playing surface, goal nets and sidelines, with simulated players practising."],
    ["south-turf", "South Turf Soccer Field", "A source-aligned soccer pitch with goals, corner flags, field markings, fencing and an ambient practice group."],
    ["dhillon-track", "Rashpal Dhillon Track & Field Oval", "An eight-lane, 400-metre running oval with straightaways, curved bends, lane markings, field-event fixtures and a small grandstand. Fictional students jog continuously in the lanes."],
    ["thunderbird-stadium", "Thunderbird Stadium", "Explore the existing stadium’s field, covered concrete grandstand and grass embankment. Canadian football and soccer markings, floodlights and interpreted spectator details follow the current facility, not a future replacement proposal."],
  ].map(([id, name, description]): Place => ({
    id, name, description, category: "Athletics", address: "Thunderbird Park · UBC Vancouver",
    interior: "C", verified: "2026-10-31",
    reconstruction: "Detailed outdoor reference reconstruction using official field geometry. Structures, seating, equipment and activity are interpreted; this is not an as-built survey or live facility information.",
    links: [link("Official Thunderbird Park facilities", athleticsSources.park),
      ...(id === "thunderbird-stadium" ? [link("Thunderbird Stadium", athleticsSources.stadium)] : [])],
  })),
  {
    id: "entrance-letters",
    name: "UBC Entrance Letters · Gateway Sign",
    category: "Landmarks",
    address: "University Boulevard at Wesbrook Mall",
    description: "The large silver UBC letters mark the eastern campus entrance. Your visit begins on the pedestrian island in front of the sign, with University Boulevard leading into campus.",
    interior: "C",
    reconstruction: "Original 3D reference reconstruction on the official pedestrian island. Letter dimensions, finish and exact placement are interpreted from public photographs; not a measured survey.",
    links: [
      link("UBC entrance letters", "https://blogs.ubc.ca/anthropocenemanifesto/mapping/ubc-letters/"),
      sources.map,
    ],
    verified: "2026-10-31",
  },
  {
    id: "west-tenth",
    name: "West 10th Avenue · approach context",
    category: "Campus approaches",
    address: "West 10th Avenue, 4200–4600 blocks",
    interior: "C",
    description:
      "Traffic on sourced Vancouver street geometry east of campus. This area is exterior road context; the intervening neighbourhood and pedestrian route are not reconstructed.",
    reconstruction:
      "City street centreline; representative pavement width and original vehicles. No connected campus GPS route is available here.",
    links: [
      link(
        "City of Vancouver street data",
        "https://opendata.vancouver.ca/explore/dataset/public-streets/",
      ),
    ],
    verified: "2026-10-31",
  },
  {
    id: "hennings",
    name: "Hennings · Physics & Astronomy",
    category: "Faculties",
    address: "6224 Agricultural Road",
    interior: "B",
    verified: "2026-10-31",
    description:
      "Physics and Astronomy, with an explorable public learning-space reconstruction inspired by HENN 200.",
    reconstruction,
    links: [
      link("Physics & Astronomy", "https://phas.ubc.ca/contact-us"),
      link(
        "HENN 200 teaching space",
        "https://learningspaces.ubc.ca/classrooms/henn-200/",
      ),
    ],
  },
  {
    id: "war-memorial",
    name: "War Memorial Gymnasium",
    category: "Athletics",
    address: "6081 University Boulevard",
    interior: "B",
    verified: "2026-10-31",
    description:
      "A living memorial opened in 1951. Explore the public lobby, hardwood basketball court and blue spectator seating, with an ambient practice game.",
    reconstruction:
      reconstruction +
      " Hall dimensions follow UBC’s published 160 ft length and 31.5 ft ceiling. Seating and circulation are representative, not a seat-by-seat survey.",
    links: [
      link(
        "War Memorial Gym · official facility",
        "https://sportfacilities.ubc.ca/wmg/",
      ),
    ],
  },
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
      "Explore the public-lobby reconstruction and learn about business study. The adjacent Sauder Powerhouse expansion remains a construction project, with completion expected in 2027.",
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
    name: "AMS Student Nest · Blue Chip & Great Hall",
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
      "See the 26-metre blue whale skeleton through the Main Mall glass pavilion, enter the upper atrium, and follow the ramp to the lower atrium and a reconstructed public collection gallery.",
    interior: "B",
    reconstruction: "Level B · the pavilion footprint follows official GIS. Patkau's public plans and museum photographs inform the glass envelope, north entrance, descending ramp and suspended whale. Floor heights, bone geometry and exhibit fixtures are reference interpretations, not a specimen scan or complete measured museum layout.",
    links: [
      link("Beaty Biodiversity Museum", "https://beatymuseum.ubc.ca/"),
      link("Meet Big Blue", "https://beatymuseum.ubc.ca/exhibitions/permanent-exhibitions/blue-whale-display/blue-whale-project/"),
      link("Museum visitor guide", "https://explore.beatymuseum.ubc.ca/map/"),
    ],
    verified: "2026-10-31",
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
      "Explore the historic Main Library core and modern learning-centre wings, with public study spaces, the Chapman Learning Commons and reading-room reconstructions connected by stairs.",
    interior: "B",
    reconstruction: "Level B · official footprint, public floor maps and architectural photographs inform the heritage stone facade, glass wings and public spaces. Grade, floor heights, furnishings and details are interpreted. Restricted collections and staff rooms are not reconstructed.",
    links: [
      link("Irving K. Barber Learning Centre", "https://ikblc.ubc.ca/"),
      link("Building history and highlights", "https://ikblc.ubc.ca/spaces/building-history-and-highlights/"),
      link("Official interior maps", "https://ikblc.ubc.ca/spaces/wayfinding/"),
    ],
    verified: "2026-10-31",
  },
];
export const displays: Record<
  string,
  { name: string; description: string; links: Link[]; building: string }
> = {
  ...residenceDisplays,
  "irving-study": {
    name: "Study at Irving",
    description: "Find individual and group study spaces in Irving K. Barber Learning Centre. Explore the public floors here, then use UBC Library’s visitor guide for current facilities, accessibility and room information.",
    building: "irving",
    links: [link("IKB wayfinding", "https://ikblc.ubc.ca/spaces/wayfinding/"), link("Study spaces", "https://ikblc.ubc.ca/spaces/book-a-study-space/")],
  },
  "irving-chapman": {
    name: "Chapman Learning Commons",
    description: "The historic Main Library reading room is part of today’s Irving K. Barber Learning Centre. Its tall windows, timber roof and study areas are interpreted in this reconstruction. Learn about the building’s history and its public learning spaces.",
    building: "irving",
    links: [link("Building history and highlights", "https://ikblc.ubc.ca/spaces/building-history-and-highlights/"), link("IKB visitor guide", "https://ikblc.ubc.ca/spaces/wayfinding/")],
  },
  "beaty-whale": {
    name: "Meet Big Blue",
    description: "The museum's blue whale skeleton is approximately 26 metres long. Recovered from Prince Edward Island, it is suspended in a lunge-feeding pose. This original virtual model interprets the bones and posture; it is not a scientific scan.",
    building: "beaty",
    links: [link("Big Blue's story", "https://beatymuseum.ubc.ca/exhibitions/permanent-exhibitions/blue-whale-display/blue-whale-project/")],
  },
  "beaty-collections": {
    name: "Biodiversity collections",
    description: "Explore plants, insects, fishes, birds, fossils and marine life. The virtual cases are representative educational fixtures; discover the museum's real specimens, exhibitions and visitor information on its official website.",
    building: "beaty",
    links: [link("Explore Beaty", "https://beatymuseum.ubc.ca/")],
  },
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
    "What do you teach?",
    "I teach in areas such as quantitative decision-making, statistics, supply-chain analytics and operations. My faculty profile lists Operations and Climate for 2026–2027. Are you interested in how mathematics helps people make decisions?",
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
    "You can explore undergraduate and graduate business programs at Sauder. The program pages are a good place to compare what you’ll study and the requirements for each option.",
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
    "Think about scheduling appointments, planning staff coverage or helping patients move through a hospital with less waiting. My research includes healthcare planning and resource allocation. The challenge is making good use of limited resources while considering people’s needs.",
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
    "Henry Angus is at 2053 Main Mall, and you can explore the lobby here. If you’re looking for a particular classroom or accessible entrance, UBC’s campus map and Sauder’s website can help.",
    ["classroom", "facility", "facilities", "where"],
    [sources.sauder, sources.map],
    ["study"],
  ),
  topic(
    "more",
    "Where can I learn more?",
    "My faculty profile is a good place to start. You can also read about my healthcare research at the Centre for Advancing Health Outcomes. Both links are below.",
    ["more", "profile", "biography"],
    [sources.werker, sources.health],
  ),
];
const baconTopics: Topic[] = [
  topic(
    "welcome",
    "I’m new here. Where should I begin?",
    "Welcome to UBC! This campus is on the traditional, ancestral and unceded territory of the Musqueam people. You could start with Main Mall, then stop by the Student Nest to explore student life.",
    ["hello", "welcome"],
    [sources.about],
    ["explore", "life"],
  ),
  topic(
    "known",
    "What is UBC known for?",
    "UBC brings together teaching and research across a wide range of subjects, with campuses in Vancouver and the Okanagan. There’s a lot to discover, from science and engineering to the arts and business.",
    ["known", "special", "research"],
    [sources.about],
  ),
  topic(
    "international",
    "What can international students study?",
    "There are many programs to explore. UBC’s admissions website lets you compare them by campus and subject, then check the requirements for your educational background. It also has the application deadlines.",
    ["international", "study", "admission", "program"],
    [sources.admissions],
    ["life"],
  ),
  topic(
    "life",
    "What is student life like?",
    "There’s plenty beyond classes: clubs, recreation, places to study and spaces to meet people. The Student Nest is a great starting point—you’ll find food, study areas and information about student organizations there.",
    ["student", "life", "clubs"],
    [sources.nest, sources.clubs],
    ["explore"],
  ),
  topic(
    "explore",
    "Where should I explore next?",
    "Try the Rose training centre beside the baseball stadium, or head to the Bookstore, Student Nest or Sauder. You can choose a place on the campus map and use Guide me to find your way.",
    ["explore", "next", "visit", "where"],
    [sources.map],
  ),
];
export const characters: Character[] = [
  {
    id: "werker",
    name: "Dr. Greg Werker",
    introduction: "I’m Greg Werker. I teach operations and logistics at UBC Sauder, where I’m also Senior Associate Dean for Student Experience.",
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
      "His public professional work includes operations research, management science and healthcare planning.",
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
    introduction: "I’m Benoit-Antoine Bacon, President and Vice-Chancellor of UBC. Welcome to campus!",
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
      "Benoit-Antoine Bacon began his five-year term as UBC’s 17th President and Vice-Chancellor on November 1, 2023.",
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
characters.push(...residenceStudents, ...expandedCharacters);

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
        u.hostname === "www.mbtw.com" ||
        [
          "gothunderbirds.ca",
          "opendata.vancouver.ca",
          "www.nobelprize.org",
          "www.ias.edu",
          "gvrsf.ca",
          "sciencefairs.ca",
          "www.translink.ca",
          "translink.ca",
          "ubcproperties.com",
          "mg-architecture.ca",
        ].includes(u.hostname))
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

Object.assign(displays, {
  "hennings-info": {
    building: "hennings",
    name: "Physics & Astronomy",
    description:
      "Public teaching-space reconstruction. HENN 200 is documented as a 180-seat active-learning theatre. The tables, circulation and adjoining lobby here are interpreted, not an exact floor plan.",
    links: [
      link("HENN 200", "https://learningspaces.ubc.ca/classrooms/henn-200/"),
    ],
  },
  "gym-info": {
    building: "war-memorial",
    name: "War Memorial Gym · A living memorial",
    description:
      "Opened in 1951 as a memorial to those who died in the World Wars. UBC’s current facility page lists 2,176 spectators. This basketball practice is fictional and is not a live game or schedule.",
    links: [
      link(
        "Official facility and history",
        "https://sportfacilities.ubc.ca/wmg/",
      ),
    ],
  },
});

displays["nest-blue-chip"] = {
  building: "nest",
  name: "Blue Chip Café · Main floor, AMS Nest",
  description:
    "AMS-owned Blue Chip serves coffee, tea, cookies, baked goods and sandwiches. Its main-floor location is documented by AMS; the counter and fixtures here are reconstructed. Open the official page for current hours and menu information. No live menu, prices or ordering.",
  links: [
    link(
      "Blue Chip · official hours and information",
      "https://www.ams.ubc.ca/business/blue-chip-cafe/",
    ),
    link("UBC Food · Blue Chip", "https://food.ubc.ca/places/blue-chip-cafe/"),
  ],
};

const fairLinks = [
  link("GVRSF · previous Nest venue", "https://gvrsf.ca/students/faq/"),
  link("GVRSF · current event information", "https://gvrsf.ca/"),
];
displays["gvrsf-info"] = {
  building: "nest",
  name: "GVRSF · Great Hall retrospective",
  description:
    "GVRSF’s published FAQ names the Great Hall at the AMS Nest as its venue, and AMS identifies the room as 2404 on Level 2. This original virtual fair recalls the Nest years, with fictional exhibits and participants. It is not a live event or an endorsed recreation. The organizer has announced the Life Sciences Institute for April 8–10, 2027; consult its website for current details.",
  links: fairLinks,
};
[
  [
    "Solar energy",
    "Fictional exhibit: compare the electrical output of identical solar cells at different angles while keeping light intensity and temperature as constant as possible. Repeat measurements and report variability. These are suggested experimental questions, not a real pupil’s project or measured findings.",
  ],
  [
    "Clean water",
    "Fictional exhibit: compare how different filter media change water clarity. Clear water is not necessarily safe to drink; this display does not test biological or chemical safety. Use repeated observations and distinguish appearance from water quality.",
  ],
  [
    "Bridge design",
    "Fictional exhibit: compare paper bridge shapes under gradually applied weights. Keep paper mass and span constant, repeat trials and record the load at deformation. The model shows an experimental idea, not a certified structural design.",
  ],
  [
    "Biodiversity",
    "Fictional exhibit: compare plant observations in equally sized sample plots. Record sampling effort, season and uncertainty. A larger count can reflect more observation rather than greater diversity; consistent methods make comparisons more useful.",
  ],
].forEach(
  ([name, description], i) =>
    (displays[`fair-${i}`] = {
      building: "nest",
      name,
      description,
      links: fairLinks,
    }),
);
