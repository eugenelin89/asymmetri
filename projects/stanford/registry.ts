import type { Character, Link, Place, Topic } from "./types";
import architecture from "./architecture-sources.json" with { type: "json" };
import peopleData from "./data/people.json" with { type: "json" };
export const checked = "2026-10-31";
export const unofficial = "An independent Asymmetri Labs reconstruction, not affiliated with or endorsed by Stanford University. Virtual access is independent of real-world access.";
const link=(label:string,url:string):Link=>({label,url});
export const sources = {
  geo:link("OpenStreetMap contributors · ODbL","https://www.openstreetmap.org/copyright"),
  map:link("Official Stanford campus map","https://campus-map.stanford.edu/"),
  visit:link("Stanford visitor guide","https://visit.stanford.edu/explore-campus"),
  athletics:link("Stanford Athletics","https://gostanford.com/"),
};
export const places:Place[]=architecture.landmarks.map(p=>({
  id:p.id,name:p.name,category:p.category,address:p.address,
  description:p.description+("accessNote" in p&&p.accessNote?" "+p.accessNote:""),
  interior:"B",reconstruction:p.interpreted.join(" "),links:p.links,verified:checked,
}));
const outdoorPlaces:[string,string,string,string][] = [
  ["stanford-stadium","Stanford Stadium","Football bowl, field markings, open spectator tiers and player approaches.","stanford-stadium"],
  ["sunken-diamond","Klein Field at Sunken Diamond","Diamond, bases, pitcher’s mound, dugouts, backstop and grandstand.","klein-field-at-sunken-diamond"],
  ["cobb-track","Cobb Track and Angell Field","Running track, infield and athletics precinct.","cobb-track-and-angell-field"],
  ["cagan","Laird Q. Cagan Stadium · Maloney Field","Soccer field with goals, penalty areas, stands and touchlines.","maloney-field-at-laird-q-cagan-stadium"],
  ["field-hockey","Varsity Field Hockey Turf","Field hockey pitch and practice precinct.","varsity-field-hockey-turf"],
  ["avery","Avery Aquatic Center","Competition pools, lane markings, diving structures and viewing areas.","avery-aquatic-center"],
  ["taube","Taube Family Tennis Stadium","Tennis courts, nets, court markings and spectator precinct.","https://gostanford.com/taube-family-tennis-center"],
  ["sand-volleyball","Stanford Beach Volleyball Stadium","Sand courts and nets in the beach volleyball venue.","beach-volleyball-stadium"],
  ["softball","Stanford Softball Stadium","Softball diamond, bases, backstop and dugout areas.","https://gostanford.com/stanford-softball-stadium-1"],
  ["golf","Stanford Golf Course","The source-mapped golf landscape and clubhouse approach.","stanford-golf-course"],
  ["rowing","Arrillaga Family Rowing and Sailing Center","The waterfront boathouse in Redwood City, approximately 9.6 km from the central campus. A separate visit destination at its real location.","arrillaga-family-rowing-and-sailing-center"],
];
for(const [id,name,description,slug] of outdoorPlaces)places.push({id,name,category:"Athletics",address:id==="rowing"?"300 Cardinal Way · Redwood City waterfront":"Stanford athletics precinct",description,interior:"C",reconstruction:"Mapped venue with original reference geometry. Fixture positions, practice activity and virtual access are interpreted.",verified:checked,links:[link("Official facility",slug.startsWith("https:")?slug:`https://gostanford.com/facilities/${slug}`),sources.map]});
places.push({id:"frost",name:"Frost Amphitheater",category:"Arts & gardens",address:"Stanford arts district",description:"Explore the outdoor amphitheater and its curved landscape terraces.",interior:"C",reconstruction:"Interpreted terrain terraces and stage at the source-mapped venue.",verified:checked,links:[link("Stanford Live","https://live.stanford.edu/your-visit/venues/frost-amphitheater/"),sources.map]});
places.push({id:"oval",name:"The Oval · Palm Drive",category:"Landmarks",address:"Palm Drive · Main Quad approach",description:"The palm-lined arrival and landscaped oval at Stanford’s historic campus entrance.",interior:"C",reconstruction:"Source-mapped lawns, roads and trees; individual planting appearance is interpreted.",verified:checked,links:[sources.visit,sources.map]});
export const displays:Record<string,{name:string;building:string;description:string;links:Link[]}>=Object.fromEntries(places.map(p=>[`${p.id}-info`,{name:p.name,building:p.id,description:p.description,links:p.links}]));
const guideTopics:Topic[]=[
  {id:"explore",question:"Where should I explore?",answer:"Start with the sandstone arcades of the Main Quad and Memorial Church. Green Library and Hoover Tower are nearby. For a different atmosphere, visit the arts district, the engineering quad or an athletics venue.",keywords:["where","explore","visit","campus"],sources:[sources.visit],followups:["inside","athletics"]},
  {id:"inside",question:"Which buildings can I enter?",answer:"The campus guide marks every supported interior. You can walk into the reconstructed church, libraries, galleries, concert halls, teaching spaces, residences and indoor sports venues. Select a building and choose Visit entrance, then walk through its doorway.",keywords:["inside","enter","building","room"],sources:[sources.map],followups:["residence"]},
  {id:"residence",question:"Can I explore student housing?",answer:"Toyon, Branner and Roble have demonstration interiors with communal spaces and representative rooms. They show the feel of residence life; they do not show current room assignments.",keywords:["housing","dorm","residence"],sources:[link("Stanford housing","https://rde.stanford.edu/studenthousing/undergraduate-housing")]},
  {id:"athletics",question:"Where are the sports venues?",answer:"The eastern athletics district includes Stanford Stadium, Sunken Diamond, Maples, Cagan, Avery and Taube. Rowing and sailing use the waterfront center in Redwood City; the campus guide offers a separate visit there.",keywords:["athlete","sport","team","field"],sources:[sources.athletics]},
];
type SourcedPerson={id:string;name:string;title:string;department:string;kind:Character["kind"];zone:string;introduction:string;biography:string;sources:Link[];verified:string;sourceAccess:string;disclaimer?:string;jerseyNumber?:string;researchArea?:string;teams?:{sport:string;team:string;season:string;venue:string;rosterUrl:string;profileUrl:string;major?:string}[]};
const people=peopleData as SourcedPerson[];
export const characters:Character[]=[
  {id:"campus-guide",name:"Alex · Campus guide",introduction:"Hi, I’m Alex, your campus guide. There’s a lot to explore here. Would you like a suggestion?",title:"Fictional visitor guide",department:"Campus exploration",institution:"Independent simulation",label:"Campus guide",category:"fictional",model:"original-generic-avatar",zone:"main-quad",route:[],routeSpace:"network",behaviour:"Fictional public walking loop",topics:guideTopics,biography:"An original guide to this virtual Stanford campus.",sources:[sources.visit],verified:checked,permissions:"Original character",disclaimer:"Fictional campus guide.",status:"Fictional"},
  ...people.map((p,i):Character=>({
    id:p.id,name:p.name,introduction:p.introduction,title:p.title,department:p.department,institution:"Stanford University · source-linked educational simulation",label:p.name,
    category:"named",kind:p.kind,model:"original-generic-avatar",zone:p.zone,route:[],routeSpace:"network",behaviour:"Fictional walk near a public academic district or sports venue; not an actual schedule or location.",
    color:p.kind==="athlete"?(i%3===0?"#e7e1d3":"#8c2531"):["#374f52","#665e50","#5c546e","#795444","#3e5c48"][i%5],
    ...(p.kind==="athlete"?{uniform:p.teams?.[0]?.sport||"athletics",jerseyNumber:p.jerseyNumber||""}:{}),
    topics:[{id:"work",question:p.kind==="athlete"?"Tell me about your team.":p.kind==="student"?"What do you study?":p.kind==="alumni"||p.kind==="historical"?"Tell me about your Stanford connection.":"What do you teach or research?",answer:p.introduction,keywords:["study","research","teach","team","work","major","stanford","connection"],sources:p.sources,followups:["background","explore"]},
      {id:"background",question:p.kind==="athlete"?"Which published roster are you on?":"Tell me a little more.",answer:p.biography,keywords:["background","roster","more","career","biography"],sources:p.sources,followups:["explore"]},guideTopics[0]],
    biography:p.biography+" Source access: "+p.sourceAccess,sources:p.sources,verified:p.verified,permissions:"Public academic facts and original generic avatar; no likeness, endorsement or voice rights asserted.",disclaimer:p.disclaimer||"Original educational avatar and scripted paraphrase, not the real person speaking. Appearances and routes are fictional.",status:p.kind==="historical"?"Historical educational guest":p.sourceAccess.includes("excerpt")?"Public search excerpt · affiliation may be stale":p.sourceAccess==="user-supplied-public-source-reference"?"Provided research · current enrollment unverified":"Public source snapshot · "+p.verified,
  })),
];
export function safeExternalUrl(value:string):string|null {
  try {const u=new URL(value);return u.protocol==="https:"&&!u.username&&!u.password&&(u.hostname==="stanford.edu"||u.hostname.endsWith(".stanford.edu")||["gostanford.com","www.gostanford.com","hoover.org","www.hoover.org","histories.hoover.org","www.linkedin.com","linkedin.com","www.openstreetmap.org","openstreetmap.org","sherylchenn.github.io"].includes(u.hostname))?u.href:null;}catch{return null;}
}
export function answerQuestion(character:Character,question:string):Topic|null {
  const q=question.trim().toLowerCase();if(!q||/\b(opinion|believe|endorse|promise|guarantee|salary|schedule|where are you|private)\b/.test(q))return null;
  return character.topics.map(t=>({t,score:t.keywords.reduce((n,k)=>n+(q.includes(k)?k.length:0),0)})).sort((a,b)=>b.score-a.score).find(x=>x.score>0)?.t??null;
}
