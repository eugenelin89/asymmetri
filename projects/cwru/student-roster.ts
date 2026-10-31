import people from "./data/people.json" with { type: "json" };
import students from "./data/students.json" with { type: "json" };
import type { Topic } from "./types";
import { appearanceOptions, type Appearance } from "./appearance";

export type PublicPerson = (typeof people)[number] & {
  program?: string;
  sourceStatus?: string;
  studentRecord?: boolean;
};
export const nameKey = (name: string) => name.normalize("NFKC").toLocaleLowerCase("en").replace(/[^\p{L}\p{N}]+/gu, " ").trim();

/** Public study field chooses a fictional district, never a real room or schedule. */
export function studentZone(program: string) {
  if (/nurs/i.test(program)) return "nursing";
  if (/biochem|biolog|neuro|pre.med|nutrition|medical/i.test(program) && !/engineering/i.test(program)) return "medicine";
  if (/engineering|computer|data science|chemistry|physics|mathematic|statistics/i.test(program)) return "strosacker";
  if (/finance|business|account|supply chain/i.test(program)) return "peter-lewis";
  if (/history|psychology|communication|political|anthropology|international|geolog/i.test(program)) return "mather-house";
  return "tinkham-veale";
}

export function mergeStudentRoster(): PublicPerson[] {
  const result: PublicPerson[] = people.map(p => ({...p, sources:[...p.sources]}));
  const indices = new Map(result.map((p,i)=>[nameKey(p.name),i]));
  for (const student of students) {
    const existing = indices.get(nameKey(student.name));
    const old = existing === undefined ? undefined : result[existing];
    const checked = student.nameRechecked;
    const label = student.sourceKind === "athletics" ? "CWRU athletics student profile" : "CWRU public student directory";
    const corroboratingSource = "corroboratingSource" in student ? student.corroboratingSource : undefined;
    const sources = [{label,url:student.source},...(corroboratingSource ? [{label:"CWRU 2026/27 team roster",url:corroboratingSource}] : []),...(old?.sources||[]).filter(s=>s.url!==student.source && s.url!==corroboratingSource)];
    const sport = student.source.match(/\/sports\/([^/]+)\//)?.[1]?.replace(/^(mens|womens)-/, "").replace(/-/g, " ");
    const intro = `Hi, I’m ${student.name}. ${student.program === "Undecided" ? "I’m still exploring what to study." : `I study ${student.program}.`}${sport ? ` I’m also on the ${sport} team.` : ""}`;
    const year = "expectedClassYear" in student ? ` The supplied research records an expected class year of ${student.expectedClassYear}; that is an expectation, not a completed degree.` : "";
    const record: PublicPerson = {
      id: old?.id || student.id, name: student.name,
      kind: old?.kind || "student", zone: studentZone(student.program),
      title: `${student.sourceKind === "athletics" ? "Student athlete" : "Student"} · ${student.program}`,
      department: student.program, program: student.program, studentRecord: true,
      introduction: intro,
      biography: `${old?.kind === "athlete" ? old.biography + " " : ""}${checked ? "The linked university page lists this name." : "This entry comes from the supplied public-source research; the linked page could not be independently matched during rechecking."} The research lists ${student.program} as the study field.${student.programRechecked ? " The study field was also found on the linked page." : " The study field remains attributed to the supplied research rather than independently reverified."}${year} University listings may be undated or stale; current enrollment is not independently confirmed.`,
      sources, verified: student.sourceChecked,
      sourceAccess: checked ? "public-university-page-name-rechecked; provided-research-study-field" : "provided-public-research; source-recheck-unconfirmed",
      sourceStatus: checked ? "Public university listing · enrollment unverified" : "Provided research · source recheck unconfirmed",
      disclaimer: "Original fictional avatar and scripted study dialogue. No likeness, voice, real schedule or whereabouts represented.",
    };
    if (existing === undefined) {indices.set(nameKey(record.name), result.length);result.push(record);}
    else result[existing] = record;
  }
  return result;
}

/** Natural factual study replies, without inventing research, opinions or a timetable. */
export function studentTopics(person: PublicPerson): Topic[] {
  if (!person.program) return [];
  const answer = person.program === "Undecided" ? "My study field is listed as undecided, so there isn’t a major to share yet." : `My field is ${person.program}.`;
  return [{id:"study", question:"What are you studying?", answer, keywords:["major","program","studying","degree","subject"], sources:person.sources, followups:["explore"]}];
}

/** Varied fictional appearance, assigned by roster position rather than a likeness. */
export function studentAppearance(index: number): Appearance {
  let seed = (index + 71) * 2654435761;
  return Object.fromEntries(Object.entries(appearanceOptions).map(([key,options]) => {
    seed = Math.imul(seed ^ (seed >>> 16), 2246822507) >>> 0;
    return [key, options[seed % options.length]];
  })) as Appearance;
}
