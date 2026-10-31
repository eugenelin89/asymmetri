import type { Character, Link, Place, Topic } from "./types";
import { mergeStudentRoster, studentTopics, studentAppearance } from "./student-roster";
const people = mergeStudentRoster();
export const checked = "2026-10-31";
export const unofficial = "An independent Asymmetri Labs reconstruction. Not affiliated with or endorsed by Case Western Reserve University. Virtual access does not grant real-world access.";
const link = (label: string, url: string): Link => ({ label, url });
export const sources = {
  geo: link("OpenStreetMap contributors · ODbL", "https://www.openstreetmap.org/copyright"),
  map: link("Official CWRU campus map", "https://case.edu/maps/"),
};
const reconstruction = "Reference reconstruction informed by public university descriptions, floor maps and photographs. Original models preserve recognizable architectural features. Room dimensions, furnishing positions and some circulation are interpretations; this is not an as-built model.";
const catalog = [
  ["kelvin-smith", "Kelvin Smith Library", "Libraries", "11055 Euclid Avenue", "Explore the library’s reading spaces, study tables, book stacks and connected public levels, behind its limestone facade and curved entrance.", "https://case.edu/library/spaces/interactive-map"],
  ["tinkham-veale", "Tinkham Veale University Center", "Student life", "11038 Bellflower Road", "A glass-walled gathering place with a low green roof, open commons, dining and upper-level meeting spaces.", "https://case.edu/universitycenter/"],
  ["peter-lewis", "Peter B. Lewis Building · Weatherhead", "Faculties", "11119 Bellflower Road", "Frank Gehry’s landmark combines sculptural stainless-steel forms and brick. Enter a reconstructed atrium, classrooms and study spaces.", "https://case.edu/weatherhead/about/facilities/peter-b-lewis-building"],
  ["adelbert", "Adelbert Hall", "Landmarks", "2040 Adelbert Road", "Historic stone architecture on the Case Quad, with a reconstructed public entrance hall and upper gallery.", "https://case.edu/its/archives/Buildings/adlmai.htm"],
  ["amasa-stone", "Amasa Stone Chapel", "Landmarks", "10940 Euclid Avenue", "Step inside the reconstructed Gothic chapel, with a nave, pews, pointed windows and a landmark tower.", "https://case.edu/artsci/music/about/facilities/music-facilities-policies-and-procedures/weddings/history-amasa-stone-chapel"],
  ["thinkbox", "Sears think[box] · Richey Mixon Building", "Faculties", "11201 Cedar Avenue", "Explore a makerspace reconstruction with workbenches, fabrication equipment and public collaboration areas across connected levels.", "https://case.edu/thinkbox/"],
  ["strosacker", "Strosacker Auditorium · Case Quad", "Lecture halls", "2125 Adelbert Road", "Enter a tiered lecture-hall reconstruction, with seating rows, a presentation screen, teaching desk and side aisles.", "https://case.edu/utech/departments/client-experience/mediavision/technology-enhanced-classroom-tec/list-classrooms/strosacker-auditorium"],
  ["veale", "Veale Center · Horsburgh Gymnasium", "Athletics", "2138 Adelbert Road", "Explore a reconstructed basketball court, spectator seating and recreation lobby within the athletics precinct.", "https://athletics.case.edu/facilities"],
  ["clarke", "Clarke Tower", "Residences", "North Residential Village", "Enter the public lobby, games area and a representative eight-person suite. The tower has eleven exterior storeys; selected demonstration floors are accessible.", "https://case.edu/housing/facilities/first-year-buildings/clarke-tower"],
  ["village", "Village at 115 · House 4", "Residences", "North Residential Village", "Explore the residence great room, a fireplace lounge, full kitchen and a representative upstairs apartment. No real room assignments are represented.", "https://case.edu/housing/facilities/upperclass-buildings/village-115"],
  ["village-clocktower", "Village at 115 · House 3A Clock Tower", "Landmarks", "House 3A · North Residential Village", "The brick clock-tower landmark above the western café wing of House 3A, with a reconstructed public café commons.", "https://case.edu/housing/facilities/upperclass-buildings/village-house-3a"],
  ["mather-house", "Mather House · Arts and Sciences", "Faculties", "11201 Euclid Avenue", "Explore a representative humanities learning space, seminar room and reading area near the Mather Quad.", "https://history.case.edu/about/contact-us/"],
  ["law", "School of Law", "Faculties", "11075 East Boulevard", "Explore a reconstructed academic lobby, seminar seating and courtroom-inspired teaching space.", "https://case.edu/law/"],
  ["nursing", "Samson Pavilion · Health Education Campus", "Faculties", "9501 Euclid Avenue · Samson Pavilion, Health Education Campus", "A representative public learning area associated with nursing education. Teaching-room layout is interpreted; no clinical patient information is shown.", "https://case.edu/nursing/"],
  ["medicine", "School of Medicine · Health Sciences", "Faculties", "2109 Adelbert Road · Health Sciences Complex", "A reconstructed academic learning space in the health-sciences precinct with lecture seating, study tables and a public lobby.", "https://case.edu/medicine/about/maps-directions"],
  ["dental", "Dental Clinic · Public Learning Spaces", "Faculties", "9601 Chester Avenue", "Explore a representative dental education learning space with classroom seating and public information.", "https://hec.case.edu/about-campus/dental-clinic"],
  ["mandel", "Jack, Joseph and Morton Mandel School", "Faculties", "11235 Bellflower Road", "A reconstructed social-work learning space with a lobby, seminar tables and community discussion area.", "https://case.edu/socialwork/"],
] as const;
export const places: Place[] = catalog.map(([id,name,category,address,description,url]) => ({
  id,name,category,address,description,interior:"B",reconstruction,verified:checked,
  links:[link("University information",url),sources.map],
}));
places.push({id:"disanto",name:"DiSanto Field",category:"Athletics",address:"North Residential Village · East 115th Street",description:"Walk onto an original football and soccer field reconstruction with goals, markings, supported spectator steps and fictional practice figures.",interior:"C",reconstruction:"Source-aligned field with US-football proportions. Seating, markings and activities are interpreted; no actual team event is represented.",verified:checked,links:[link("CWRU Athletics facilities","https://athletics.case.edu/facilities"),sources.map]});
export const displays: Record<string,{name:string;building:string;description:string;links:Link[]}> = Object.fromEntries(places.map(p=>[`${p.id}-info`,{name:p.name,building:p.id,description:p.description,links:p.links}]));
const guideTopics: Topic[] = [
  {id:"explore",question:"Where should I explore?",answer:"Try Kelvin Smith Library, then cross to Tinkham Veale. Peter B. Lewis has a very different architectural character. The map lets you visit an entrance or follow a walking route.",keywords:["where","explore","visit","campus"],sources:[sources.map],followups:["inside"]},
  {id:"inside",question:"Which buildings can I enter?",answer:"The reconstructed library, university center, lecture hall, chapel, residence and academic buildings have walk-through spaces. Search Explore campus for a destination, then choose Visit entrance.",keywords:["inside","building","enter","room"],sources:[sources.map],followups:["residence"]},
  {id:"residence",question:"Can I visit a residence?",answer:"Clarke Tower has a virtual lobby and a demonstration suite. The suite is a reconstruction with no real student room assignments.",keywords:["residence","housing","dorm"],sources:[link("Clarke Tower",catalog[8][5])]},
];
export const characters: Character[] = [
  {id:"campus-guide",name:"Alex · Campus guide",introduction:"Hi, I’m Alex, your fictional campus guide. Want a few ideas for where to explore?",title:"Virtual campus guide",department:"Campus exploration",institution:"Independent simulation",label:"Fictional campus guide",category:"fictional",model:"original-generic-avatar",zone:"kelvin-smith",route:[[-3,5],[3,5],[3,10],[-3,10]],behaviour:"Simulated walking loop",topics:guideTopics,biography:"An original fictional guide to the virtual campus.",sources:[sources.map],verified:checked,permissions:"Original fictional character",disclaimer:"This character is fictional.",status:"Fictional"},
  ...people.map((person,index):Character=>({
    id:person.id,name:person.name,introduction:person.introduction,title:person.title,
    department:person.department,institution:"Case Western Reserve University",label:"Source-linked virtual character",
    category:"named",kind:person.kind as Character["kind"],model:"original-generic-avatar",zone:person.zone,
    route:[],routeSpace:"network",behaviour:"Fictional walk on public paths near an academic zone. No claim of actual whereabouts.",
    color:["#243e63","#63706c","#675b73","#8d674b"][index%4],
    appearance: person.studentRecord || person.kind === "student" ? studentAppearance(index) : undefined,
    topics:[
      {id:"work",question:person.kind==="student"?"What do you study?":person.kind==="athlete"?"Tell me about your team and studies.":"What do you teach or research?",answer:person.introduction,keywords:["study","research","teach","team","work","program","major"],sources:person.sources,followups:["explore"]},
      ...studentTopics(person),
      guideTopics[0],
    ],biography:person.biography+" Source access: "+person.sourceAccess,
    sources:person.sources,verified:person.verified,
    permissions:"Public factual profile reference; no endorsement, likeness or voice permission asserted.",
    disclaimer:"Original simulated avatar and scripted dialogue, not this person speaking. Walking location and appearance are fictional. Public educational or professional facts are linked below; no personal opinions or schedules are generated.",
    status:person.sourceStatus || (person.kind==="student"?"Self-published academic affiliation · public search excerpt":"Public university profile · checked "+checked),
  })),
];
export function safeExternalUrl(value:string):string|null {
  try { const u=new URL(value);return u.protocol==="https:"&&!u.username&&!u.password&&(u.hostname==="case.edu"||u.hostname.endsWith(".case.edu")||["www.linkedin.com","linkedin.com","www.openstreetmap.org","openstreetmap.org","case.stackmap.com","hec.case.edu"].includes(u.hostname))?u.href:null; } catch {return null;}
}
export function answerQuestion(character:Character,question:string):Topic|null {
  const q=question.trim().toLowerCase();
  if(!q||/\b(opinion|believe|endorse|promise|guarantee|salary|live|schedule|where are you|private)\b/.test(q))return null;
  return character.topics.map(t=>({t,score:t.keywords.reduce((n,k)=>n+(q.includes(k)?k.length:0),0)})).sort((a,b)=>b.score-a.score).find(x=>x.score>0)?.t??null;
}
