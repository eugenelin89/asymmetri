import snapshot from "./data/students.json" with { type: "json" };
import { appearanceOptions, type Appearance } from "./appearance";
import type { Character, Topic } from "./types";
import { deduplicateStudents, normalizedStudentName, studentResearchDate, studentSeed, type StudentIdentity, type StudentRecord } from "./student-import";
import { studentDepartment, studentDepartmentAreas, studentZone } from "./student-departments";
import { studentNameCorrections, studentSourceAudit, type StudentSourceReview } from "./student-source-audit";

export type StudentCharacter = Character & {
  sourceVerificationLabel: "Source reviewed" | "Indexed source reviewed" | "Research supplied";
  studentEvidence: {
    researchDate: string;
    program: string;
    expectedCompletion: string | null;
    sourceKind: StudentRecord["sourceKind"];
    review: StudentSourceReview | null;
  };
};
export const studentRecords: StudentRecord[] = snapshot.records.map((record) => ({
  ...record,
  name: studentNameCorrections[record.sourceUrl]?.displayName ?? record.name,
  sourceKind: record.sourceKind as StudentRecord["sourceKind"],
}));

function appearanceForStudent(id: string): Appearance {
  // Cosmetic variety comes from an arbitrary stable seed, never a photograph,
  // name-based gender/ethnicity inference or claim about personal appearance.
  return Object.fromEntries(Object.entries(appearanceOptions).map(([key, values]) => [key, values[studentSeed(id + key) % values.length]])) as Appearance;
}
function studySentence(program: string): string {
  if (/^(?:Doctor|Master|LLM)/.test(program)) return `I’m in UBC’s ${program} program.`;
  const spoken = /^(?:English|Germanic)/.test(program) ? program : program.toLowerCase();
  return `I study ${spoken} at UBC.`;
}

export function buildStudentCharacters(existing: readonly StudentIdentity[] = []) {
  const { students, report } = deduplicateStudents(studentRecords, existing);
  const included = new Set(students.map((student) => student.id));
  const allCharacters: StudentCharacter[] = studentRecords.map((record) => {
    const review = studentSourceAudit[record.sourceUrl] ?? null;
    const sourceVerificationLabel = review?.method === "profile-read" ? "Source reviewed"
      : review?.method === "search-index-read" ? "Indexed source reviewed" : "Research supplied";
    const sourceLabel = record.sourceKind === "university-profile" ? "UBC public study profile / directory"
      : record.sourceUrl.includes("linkedin.com") ? "Public education self-report · LinkedIn" : "Public education self-report · personal site";
    const sources = [{ label: sourceLabel, url: record.sourceUrl }];
    const correction = studentNameCorrections[record.sourceUrl];
    if (correction) sources.push({ label: "UBC applied mathematics directory · name correction", url: correction.sourceUrl });
    const study = studySentence(record.program);
    const area = studentDepartmentAreas[studentDepartment(record.program)];
    const topics: Topic[] = [
      { id: "studies", question: "What are you studying?", answer: study, sources, followups: ["subject-area", "study-profile"], keywords: ["study", "studying", "major", "subject", "program", "degree"] },
      { id: "subject-area", question: "What can I explore around here?", answer: `You can explore ${area.label}. The campus map can help you find other buildings, libraries and student spaces.`, sources: [{ label: "UBC campus maps", url: "https://planning.ubc.ca/about-us/campus-maps" }], followups: ["studies", "study-profile"], keywords: ["explore", "nearby", "department", "building", "around here", "where"] },
      { id: "study-profile", question: "Where can I learn more?", answer: "You can open the public profile here to read more about my studies.", sources, followups: ["studies"], keywords: ["learn more", "profile", "source", "research", "details"] },
    ];
    if (record.expectedCompletion) topics.push({ id: "completion", question: "When do you expect to finish?", answer: `My expected completion year is ${record.expectedCompletion}.`, sources, followups: ["studies"], keywords: ["graduate", "graduation", "finish", "completion", "class of"] });
    const provenance = review
      ? `${sourceVerificationLabel} ${review.date}. ${review.finding}`
      : `Research supplied ${studentResearchDate}. This profile was included in the user-supplied public student research; it was not individually rechecked during this import.`;
    return {
      id: record.id, name: record.name, introduction: `I’m ${record.name}. ${study}`,
      title: `UBC student · ${record.program}`, department: record.program, institution: "University of British Columbia",
      label: record.name, category: "named", model: "original-stylized-student", appearance: appearanceForStudent(record.id),
      zone: studentZone(record.program, record.id), route: [], routeSpace: "network",
      behaviour: "Encounter-only student representation on collision-checked public paths near the relevant department or faculty area. Positions and routes are simulated; no actual schedule, office or current whereabouts are represented.",
      topics, biography: `${record.name} is represented studying ${record.program}, based on the linked public study source. ${provenance} Public profiles can become outdated and do not constitute registrar-confirmed current enrollment.`,
      sources, verified: review?.date ?? studentResearchDate, sourceVerificationLabel,
      studentEvidence: { researchDate: studentResearchDate, program: record.program, expectedCompletion: record.expectedCompletion, sourceKind: record.sourceKind, review },
      permissions: "Original generic avatar with seeded cosmetic variety. No portrait, personal likeness, voice, contact information or copied profile media is used. Public study facts only; participation and endorsement are not claimed.",
      disclaimer: `Educational simulation based on public study information. Scripted replies are illustrative, not quotations or messages authored by ${record.name}.`,
      status: "Discover through a campus encounter",
    };
  });
  const characters = allCharacters.filter((character) => included.has(character.id));
  const existingStudyUpdates = allCharacters.filter((character) => !included.has(character.id)).flatMap((student) => {
    const match = existing.find((character) => normalizedStudentName(character.name) === normalizedStudentName(student.name));
    return match?.id ? [{ existingId: match.id, student }] : [];
  });
  // The caller may enrich the existing athlete's topics/sources with these study
  // facts while preserving its original ID, costume, identity and movement.
  return { characters, existingStudyUpdates, report };
}
