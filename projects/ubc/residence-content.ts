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
    "There are lots of shared spaces to meet people, eat together and study. Orchard is a first-year community, and Residence Advisors can help you settle in and find support when you need it.",
    [housingSources.orchard, housingSources.team],
    ["first-year", "first year", "residence life"],
    ["bathroom", "study"],
  ),
  topic(
    "size",
    "How big is your room?",
    "Many single rooms in Orchard’s published design plans are about 13 square metres, but sizes and layouts vary. Have a look at UBC’s room tours to compare the different options.",
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
    "Yes, connected singles share a bathroom between two bedrooms. You can see how that works here: A connects to B, C to D, and E to F. The doubles have two beds and a bathroom shared by those roommates.",
    [housingSources.orchard, housingSources.rooms],
    ["bathroom", "connected", "single", "double"],
    ["packing"],
  ),
  topic(
    "study",
    "How do you study?",
    "A quiet spot is great when you need to focus, and the shared tables work well for studying together. Orchard has both kinds of study space, and there are campus libraries to try too. Leave yourself time for meals, sleep and breaks!",
    [housingSources.orchard],
    ["study", "studying", "first year student"],
    ["reslife"],
  ),
  topic(
    "packing",
    "What should I bring for my room?",
    "Start with bedding, a pillow, towels, toiletries and laundry supplies—and something for the rain. Talk with your roommate about shared bathroom and cleaning supplies. UBC’s packing list is handy before you buy anything big.",
    [housingSources.packing],
    ["bring", "pack", "bedding"],
    ["bathroom"],
  ),
];
const engineeringTopics = [
  topic(
    "noise",
    "How noisy is residence?",
    "It depends on the time of day and your neighbours. There are quiet hours, and it helps to talk with your roommates about what works for everyone. If noise becomes a problem, your Residence Advisor can help.",
    [housingSources.roommates, housingSources.team],
    ["noisy", "noise", "quiet"],
    ["friends", "study"],
  ),
  topic(
    "friends",
    "Is it easy to make friends?",
    "Everyone settles in at their own pace. The lounges and residence activities are good places to start a conversation. You can also ask your Residence Advisor about ways to get involved.",
    [housingSources.team],
    ["friends", "meet people", "social"],
    ["balance"],
  ),
  topic(
    "study",
    "Where do you study?",
    "There’s a study area just opposite this lounge. Orchard has spaces for studying alone or with a group, and a campus library is another option when you want a change of scene.",
    [housingSources.orchard],
    ["study", "studying"],
    ["facilities"],
  ),
  topic(
    "balance",
    "How do you balance school and social life?",
    "Give yourself time for studying, seeing friends, eating and resting. You might need to adjust things when courses get busy—that’s normal. If you’re finding it hard to manage, the residence team can help you find support.",
    [housingSources.team],
    ["balance", "school", "routine"],
    ["noise"],
  ),
  topic(
    "facilities",
    "What facilities are available?",
    "Orchard has lounges, snack kitchens, study areas, laundry, fitness, music and games spaces, and dining. On this walk, you can explore the lounge, snack kitchen and study area upstairs.",
    [housingSources.orchard],
    ["facilities", "kitchen", "laundry", "lounge"],
    ["study"],
  ),
];
const businessTopics = [
  topic(
    "moving",
    "What is it like moving to Vancouver?",
    "There’s a lot to organize at first, so take it one step at a time. Start with your arrival plans, room essentials and clothes for Vancouver’s rain. UBC’s arrival information and packing list can help you prepare.",
    [housingSources.packing, housingSources.team],
    ["moving", "vancouver", "international", "arriv"],
    ["packing", "support"],
  ),
  topic(
    "support",
    "How does residence help new students?",
    "Your Residence Advisor is a good person to talk to when you’re settling in. The residence team can help you meet people, answer questions and find the right campus support.",
    [housingSources.team],
    ["support", "help", "new students", "advisor"],
    ["apply"],
  ),
  topic(
    "packing",
    "What should students bring?",
    "Bedding, towels, toiletries, laundry supplies and clothes for the weather are a good start. Check what your room includes before buying extras, and talk with your roommate about anything you could share. UBC has a packing checklist you can use.",
    [housingSources.packing],
    ["bring", "pack", "furnish"],
    ["moving"],
  ),
  topic(
    "meals",
    "What are meal plans like?",
    "Orchard residents use the required All Access Dining plan, with unlimited entry to Feast, Gather and Open Kitchen. Flex Dollars can be used at other participating places. The dining page has the latest costs and dietary information.",
    [housingSources.meals],
    ["meal", "dining", "food", "cost", "price"],
    ["apply"],
  ),
  topic(
    "apply",
    "How do you apply for student housing?",
    "Start with the UBC Housing application page and check the deadlines. You can list your preferences, but an application doesn’t guarantee a place at Orchard or a particular room type. The room-assignment page explains how offers work.",
    [housingSources.apply, housingSources.assignments],
    ["apply", "application", "housing", "deadline", "guarantee"],
    ["support", "meals"],
  ),
];
export const residenceStudents: Character[] = [
  {
    id: "student-science",
    name: "Maya",
    introduction: "I’m Maya. I’m a first-year Science student.",
    title: "First-year Science · Fictional student guide",
    department: "Science",
    institution: "Illustrative UBC campus community",
    label: "Maya",
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
    name: "Leo",
    introduction: "I’m Leo. I study Engineering.",
    title: "Engineering · Fictional student guide",
    department: "Engineering",
    institution: "Illustrative UBC campus community",
    label: "Leo",
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
    name: "Ari",
    introduction: "I’m Ari. I’m an international student studying Business.",
    title: "International Business student · Fictional guide",
    department: "Business",
    institution: "Illustrative UBC campus community",
    label: "Ari",
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
