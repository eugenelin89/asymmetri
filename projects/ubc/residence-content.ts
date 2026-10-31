import type { Character, Link, Place, Topic } from "./types";
const checked = "2026-10-31";
const link = (label: string, url: string): Link => ({ label, url });
export const housingSources = {
  orchard: link(
    "Official Orchard Commons information",
    "https://vancouver.housing.ubc.ca/residences/orchard-commons/",
  ),
  tours: link(
    "Official residence virtual tours",
    "https://vancouver.housing.ubc.ca/residence-virtual-tours/#orchard-commons",
  ),
  rooms: link(
    "UBC room types",
    "https://vancouver.housing.ubc.ca/residences-rooms/rooms-suites/",
  ),
  team: link(
    "Residence support team",
    "https://vancouver.housing.ubc.ca/residence-life/meet-the-team/",
  ),
  packing: link(
    "What should I pack?",
    "https://vancouver.housing.ubc.ca/moving-in/what-should-i-pack/",
  ),
  roommates: link(
    "Living with roommates",
    "https://vancouver.housing.ubc.ca/residence-life/living-with-roomates/",
  ),
  meals: link(
    "Residence meal plan · All Access Dining",
    "https://food.ubc.ca/meal-plans/residence-meal-plan-all-access-dining/",
  ),
  apply: link(
    "Housing application essentials",
    "https://vancouver.housing.ubc.ca/applications/essential-facts/",
  ),
  assignments: link(
    "How UBC assigns rooms",
    "https://vancouver.housing.ubc.ca/applications/how-we-assign-rooms/",
  ),
};
export const orchardPlace: Place = {
  id: "orchard",
  name: "Orchard Commons",
  category: "Residences",
  address: "6363 Agronomy Road · Bartlett and Braeburn Houses",
  description:
    "A first-year residence community with connected singles, shared rooms, lounges, study spaces and dining. Enter the virtual Bartlett courtyard entrance to explore a lobby and one representative residential floor: six connected singles, two shared doubles, five shared private bathrooms, a lounge, snack kitchen and study area.",
  interior: "B",
  reconstruction:
    "Representative UBC residence reconstruction. Eight fictional demonstration rooms, labelled A–H, are arranged on one supported floor above the lobby. This is not a particular current residential floor or a real room assignment. The two source footprints and courtyard entrance are geographically grounded; upper massing, room arrangements, furnishings and vertical circulation are interpreted. Real bedrooms are private; virtual open-house access does not grant real-world access.",
  links: [housingSources.orchard, housingSources.tours, housingSources.rooms],
  verified: checked,
};
export const residenceDisplays = {
  "orchard-life": {
    name: "Your residence open house",
    building: "orchard",
    description:
      "Walk through the courtyard entrance. Turn right in the lobby for stairs or the lift. Upstairs, every bedroom A–H and each shared bathroom door opens with E or a tap. Six singles form three bathroom-connected pairs; two doubles each have two beds and a private shared bathroom. Meet three clearly fictional student guides. Other floors are outside this tour.",
    links: [housingSources.orchard, housingSources.tours],
  },
  "orchard-facilities": {
    name: "Floor lounge and snack kitchen",
    building: "orchard",
    description:
      "Orchard Commons documents interconnected floor lounges with snack kitchens, study spaces and dining. This furnished lounge is a representative arrangement. The snack kitchen does not replace the required residence dining plan; consult UBC for current details.",
    links: [housingSources.orchard, housingSources.meals],
  },
  "orchard-study": {
    name: "Find your study rhythm",
    building: "orchard",
    description:
      "Orchard has group and private study areas. This demonstration study area illustrates shared tables and academic supplies, without displaying live availability or providing room booking.",
    links: [housingSources.orchard, housingSources.team],
  },
};
const topic = (
  id: string,
  question: string,
  answer: string,
  sources: Link[],
  keywords: string[],
  followups: string[] = [],
): Topic => ({ id, question, answer, sources, keywords, followups });
const scienceTopics = [
  topic(
    "reslife",
    "What is first-year residence life like?",
    "This is a fictional student guide, so the tour is not a personal testimonial. UBC describes Orchard as a first-year community with shared living, dining and study spaces. Residence Advisors and Residence Life Managers support residents and connect them with campus resources.",
    [housingSources.orchard, housingSources.team],
    ["first-year", "first year", "residence life"],
    ["bathroom", "study"],
  ),
  topic(
    "size",
    "How big is your room?",
    "The rooms here are representative, not measured replicas of an assigned room. Public 2014 Orchard drawings label many single bedroom areas around 13.17 square metres. Actual room sizes and configurations vary; use the official tours to compare. This open-house layout adds circulation space and should not be used to measure a future room.",
    [
      housingSources.tours,
      link(
        "Public 2014 design drawings",
        "https://planning.ubc.ca/sites/default/files/2019-12/DP13034-Plans_0.pdf",
      ),
    ],
    ["big", "size", "dimensions", "room area"],
    ["bathroom"],
  ),
  topic(
    "bathroom",
    "Do you share a bathroom?",
    "Connected singles are individual bedrooms linked through a semi-private bathroom shared by two residents. In this tour A connects with B, C with D, and E with F. Each shared double has two beds and its own shared private bathroom. These letters identify fictional demonstration rooms.",
    [housingSources.orchard, housingSources.rooms],
    ["bathroom", "connected", "single", "double"],
    ["packing"],
  ),
  topic(
    "study",
    "How do you study?",
    "Try a quiet place for focused work and a shared table for discussion. Orchard documents both group and private study spaces; campus libraries provide more options. A schedule that leaves time for meals, sleep and breaks can help you settle into university routines.",
    [housingSources.orchard],
    ["study", "studying", "first year student"],
    ["reslife"],
  ),
  topic(
    "packing",
    "What should I bring for my room?",
    "Check UBC’s current packing list. Bedding, a pillow, towels, toiletries, laundry supplies and rain-ready clothing are useful starting points. Coordinate shared cleaning supplies and bathroom essentials with your roommate; avoid buying large items before checking your room and residence rules.",
    [housingSources.packing],
    ["bring", "pack", "bedding"],
    ["bathroom"],
  ),
];
const engineeringTopics = [
  topic(
    "noise",
    "How noisy is residence?",
    "Noise varies by time and neighbours; this fictional guide cannot promise a particular experience. UBC publishes quiet hours and residence standards. Discuss noise respectfully with roommates and contact your Residence Advisor when you need help. Check current rules, especially around exams.",
    [housingSources.roommates, housingSources.team],
    ["noisy", "noise", "quiet"],
    ["friends", "study"],
  ),
  topic(
    "friends",
    "Is it easy to make friends?",
    "Shared lounges and residence activities provide opportunities to meet people, though everyone settles in differently. Residence Advisors help build community. Starting a conversation in a common space or joining an activity can be a practical first step; this is general guidance, not a real student's testimonial.",
    [housingSources.team],
    ["friends", "meet people", "social"],
    ["balance"],
  ),
  topic(
    "study",
    "Where do you study?",
    "Orchard includes group and private study spaces. The demonstration study area opposite this lounge shows one possible shared arrangement. Choose a library or other campus study space when you need a change of environment; no live occupancy is represented here.",
    [housingSources.orchard],
    ["study", "studying"],
    ["facilities"],
  ),
  topic(
    "balance",
    "How do you balance school and social life?",
    "There is no single schedule that suits everyone. Make space for study, meals, rest and social activities, and review it when courses become demanding. Residence support staff can help connect students with advice and campus services.",
    [housingSources.team],
    ["balance", "school", "routine"],
    ["noise"],
  ),
  topic(
    "facilities",
    "What facilities are available?",
    "Official Orchard information lists interconnected lounges with snack kitchens, study areas, laundry, fitness, music and games spaces, and dining. This release models the lobby, one residential floor, lounge/snack kitchen and a study area. The remaining facilities are information only.",
    [housingSources.orchard],
    ["facilities", "kitchen", "laundry", "lounge"],
    ["study"],
  ),
];
const businessTopics = [
  topic(
    "moving",
    "What is it like moving to Vancouver?",
    "This is a fictional international-student guide, not a real moving experience. UBC’s arrival and packing information can help you plan essentials, weather-appropriate clothing and your first days in residence. Seek official guidance for your own travel and arrival circumstances.",
    [housingSources.packing, housingSources.team],
    ["moving", "vancouver", "international", "arriv"],
    ["packing", "support"],
  ),
  topic(
    "support",
    "How does residence help new students?",
    "Residents have a Residence Advisor and Residence Life Manager. They support community activities, referrals and residence standards. Ask the residence team about current services and help finding the right campus resource.",
    [housingSources.team],
    ["support", "help", "new students", "advisor"],
    ["apply"],
  ),
  topic(
    "packing",
    "What should students bring?",
    "Start with UBC’s current packing checklist: bedding, towels, toiletries, laundry supplies and suitable clothing. Coordinate shared items with roommates. This tour’s books, laptops and decorations are fictional examples, not an official list of included furnishings.",
    [housingSources.packing],
    ["bring", "pack", "furnish"],
    ["moving"],
  ),
  topic(
    "meals",
    "What are meal plans like?",
    "Orchard residents have a required All Access Dining plan. Unlimited entry applies to Feast, Gather and Open Kitchen; Flex Dollars cover purchases at other participating locations. Check the official page for current terms, dietary information and costs. This tour does not display live prices or balances.",
    [housingSources.meals],
    ["meal", "dining", "food", "cost", "price"],
    ["apply"],
  ),
  topic(
    "apply",
    "How do you apply for student housing?",
    "Follow UBC Housing’s current application process and deadlines. You may express preferences, but applying does not itself guarantee an offer, Orchard Commons or a particular room type. Use the official eligibility, application and room-assignment pages for your situation.",
    [housingSources.apply, housingSources.assignments],
    ["apply", "application", "housing", "deadline", "guarantee"],
    ["support", "meals"],
  ),
];
export const residenceStudents: Character[] = [
  {
    id: "student-science",
    name: "Maya · fictional Science student",
    title: "First-year Science · Fictional student guide",
    department: "Science",
    institution: "Illustrative UBC campus community",
    label: "Maya · Fictional Science student",
    category: "fictional",
    model: "original-student-teal",
    zone: "orchard",
    route: [
      [2.1, -3],
      [2.1, -2],
      [3.4, -2],
    ],
    routeSpace: "interior",
    floor: 3.4,
    behaviour: "Reading, looking up and short clear study-area walks",
    topics: scienceTopics,
    biography:
      "A fictional first-year guide interested in science. Meet Maya in the demonstration study area and explore connected-single living arrangements.",
    sources: [housingSources.orchard, housingSources.team],
    verified: checked,
    permissions:
      "Original stylized fictional character; no identifiable student's likeness or belongings.",
    disclaimer:
      "Fictional student, not a real resident or testimonial. Educational dialogue based on official UBC resources.",
    status: "Available in the virtual study area",
  },
  {
    id: "student-engineering",
    name: "Leo · fictional Engineering student",
    title: "Engineering · Fictional student guide",
    department: "Engineering",
    institution: "Illustrative UBC campus community",
    label: "Leo · Fictional Engineering student",
    category: "fictional",
    model: "original-student-ochre",
    zone: "orchard",
    route: [
      [8.4, 2.2],
      [8.4, 3.2],
      [7.4, 3.2],
    ],
    routeSpace: "interior",
    floor: 3.4,
    behaviour:
      "Pauses beside the lounge, gestures and walks a short circulation route",
    topics: engineeringTopics,
    biography:
      "A fictional engineering guide in the floor lounge. Ask about shared facilities, studying and getting along with roommates.",
    sources: [housingSources.orchard, housingSources.roommates],
    verified: checked,
    permissions:
      "Original stylized fictional character; no real student's identity.",
    disclaimer:
      "Fictional student, not a real resident or testimonial. Educational dialogue based on official UBC resources.",
    status: "Available in the virtual lounge",
  },
  {
    id: "student-business",
    name: "Ari · fictional international Business student",
    title: "International Business student · Fictional guide",
    department: "Business",
    institution: "Illustrative UBC campus community",
    label: "Ari · Fictional Business student",
    category: "fictional",
    model: "original-student-rust",
    zone: "orchard",
    route: [
      [2, 5],
      [3, 5],
      [3, 3],
    ],
    routeSpace: "interior",
    floor: 0,
    behaviour:
      "Welcomes visitors in the lobby, pauses and walks between information points",
    topics: businessTopics,
    biography:
      "A fictional international-student guide in the lobby. Explore arrival planning, packing, dining and official housing applications.",
    sources: [housingSources.apply, housingSources.meals],
    verified: checked,
    permissions:
      "Original stylized fictional character; no real person's story.",
    disclaimer:
      "Fictional student, not a real resident or testimonial. Educational dialogue based on official UBC resources.",
    status: "Available in the virtual lobby",
  },
];
