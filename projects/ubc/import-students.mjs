// Run: node --import ./projects/ubc/test-loader.mjs projects/ubc/import-students.mjs /path/to/supplied-research.md
// The source file stays outside the repository. This writes only allowlisted UBC facts.
import { readFileSync, writeFileSync } from "node:fs";
import { parseSuppliedUbcStudents, studentResearchDate } from "./student-import.ts";

const input = process.argv[2];
if (!input) throw new Error("Supply the local research Markdown file as the first argument.");
const { students, report } = parseSuppliedUbcStudents(readFileSync(input, "utf8"));
if (report.inputRows !== 500 || report.included !== 500)
  throw new Error(`Expected 500 unique supplied UBC rows; found ${report.inputRows} rows and ${report.included} unique records. Review before updating the snapshot.`);
const snapshot = {
  schemaVersion: 1,
  researchDate: studentResearchDate,
  provenance: "User-supplied public student research. Student status and study fields are attributed to linked public profiles; this is not registrar-confirmed enrollment. Only a documented sample was independently reviewed during import.",
  fields: "Names, study fields, explicitly supplied expected completion years and source URLs only. No contact details, portraits, likenesses or other biographical attributes.",
  records: students,
};
writeFileSync(new URL("./data/students.json", import.meta.url), JSON.stringify(snapshot, null, 2) + "\n");
console.log(JSON.stringify({ included: report.included, programs: Object.keys(report.programs).length, sourceHosts: report.sourceHosts }));
