/** Allowlist importer for the supplied research table. Contact, image and other
 * columns are deliberately never read into a record or diagnostic. */
export type StudentRecord = {
  id: string;
  name: string;
  program: string;
  expectedCompletion: string | null;
  sourceUrl: string;
  sourceKind: "university-profile" | "self-report";
};
export type StudentIdentity = { id?: string; name: string; sources?: readonly { url: string }[] };
export type StudentImportReport = {
  inputRows: number;
  included: number;
  duplicateNames: string[];
  duplicateSources: string[];
  programs: Record<string, number>;
  sourceHosts: Record<string, number>;
};
export const studentResearchDate = "2026-10-31";
export const studentExternalSourceUrls = [
  "https://ca.linkedin.com/in/lauren-huang",
  "https://ca.linkedin.com/in/christiewu03",
  "https://dykzhao.com/",
] as const;
const externalSources = new Set<string>(studentExternalSourceUrls);
export const isStudentExternalSourceUrl = (value: string) => externalSources.has(value);
export function normalizedStudentName(name: string): string {
  return name.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase()
    .replace(/^(?:(?:dr|prof|professor)\.?\s+)+/, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
export function studentSeed(value: string): number {
  let seed = 2166136261;
  for (const ch of value) seed = Math.imul(seed ^ ch.charCodeAt(0), 16777619);
  return seed >>> 0;
}
export function validStudentSource(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port
      && !url.hash && value.length < 600
      && (url.hostname === "ubc.ca" || url.hostname.endsWith(".ubc.ca") || externalSources.has(value));
  } catch { return false; }
}
export function deduplicateStudents(records: readonly StudentRecord[], existing: readonly StudentIdentity[] = []) {
  const names = new Set(existing.map((record) => normalizedStudentName(record.name)));
  const urls = new Set(existing.flatMap((record) => (record.sources ?? []).map((s) => s.url)));
  const report: StudentImportReport = {
    inputRows: records.length, included: 0, duplicateNames: [], duplicateSources: [], programs: {}, sourceHosts: {},
  };
  const students: StudentRecord[] = [];
  for (const record of records) {
    const name = normalizedStudentName(record.name);
    if (names.has(name)) { report.duplicateNames.push(record.name); continue; }
    if (urls.has(record.sourceUrl)) { report.duplicateSources.push(record.sourceUrl); continue; }
    names.add(name); urls.add(record.sourceUrl); students.push(record);
    report.programs[record.program] = (report.programs[record.program] || 0) + 1;
    const host = new URL(record.sourceUrl).hostname;
    report.sourceHosts[host] = (report.sourceHosts[host] || 0) + 1;
  }
  report.included = students.length;
  return { students, report };
}
export function parseSuppliedUbcStudents(markdown: string, existing: readonly StudentIdentity[] = []) {
  const records: StudentRecord[] = [];
  let inUbc = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^##\s+/.test(line)) {
      inUbc = /^## University of British Columbia \(UBC\)\s*$/.test(line);
      continue;
    }
    if (!inUbc || !line.startsWith("| University of British Columbia (UBC) |")) continue;
    const cells = line.split("|").slice(1, -1).map((value) => value.trim());
    if (cells.length !== 7) throw new Error(`Invalid UBC table structure at record ${records.length + 1}`);
    // Only these five supplied fields cross the import boundary.
    const name = `${cells[1]} ${cells[2]}`.trim();
    const program = cells[4];
    const expectedCompletion = cells[3] || null;
    const sourceUrl = cells[6].match(/\]\((https:\/\/[^)]+)\)/)?.[1];
    if (!name || !program || name.length > 160 || program.length > 200 || /[@<>\u0000-\u001f]/.test(name + program)
      || !sourceUrl || !validStudentSource(sourceUrl)
      || (expectedCompletion !== null && !/^20\d{2}$/.test(expectedCompletion)))
      throw new Error(`Invalid allowed UBC fields at record ${records.length + 1}`);
    const sourceKind = externalSources.has(sourceUrl) ? "self-report" : "university-profile";
    records.push({
      id: `student-${normalizedStudentName(name).replaceAll(" ", "-")}-${studentSeed(sourceUrl).toString(36)}`,
      name, program, expectedCompletion, sourceUrl, sourceKind,
    });
  }
  return deduplicateStudents(records, existing);
}
