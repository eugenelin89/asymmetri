import type { Character } from "./types";

/** Source-read date only: these are public self-reports, not registrar checks.
 * Each author explicitly states graduation, UBC and the listed degree/field in
 * the linked public post. No profile photos, contact data or other biography is
 * imported. Relative post timestamps are not used to infer graduation years.
 */
export const publicEducationSourceChecked = "2026-10-31";
export const publicEducationRecords = [
  {
    id: "education-rewa-roy",
    name: "Rewa Roy",
    degree: "Bachelor of Commerce",
    field: "marketing and entrepreneurship",
    zone: "sauder",
    sourceUrl: "https://www.linkedin.com/posts/rewa-roy_ubc-sauderschoolofbusiness-classof2025-activity-7335500550114816001-Rx3J",
  },
  {
    id: "education-juliana-angel",
    name: "Juliana Angel",
    degree: "Bachelor of Applied Science",
    field: "engineering physics",
    zone: "hennings",
    sourceUrl: "https://www.linkedin.com/posts/julianaangel_happy-to-share-that-ive-graduated-from-the-activity-7468354503918952448-L3mv",
  },
  {
    id: "education-pani-ayoubizadeh",
    name: "Pani Ayoubizadeh",
    degree: "Bachelor of Science",
    field: "biology",
    zone: "beaty",
    sourceUrl: "https://www.linkedin.com/posts/pani-ayoubizadeh-_i-am-proud-to-share-that-i-have-graduated-activity-7470382349738893313-bkbT",
  },
  {
    id: "education-danya-balagopal",
    name: "Danya Balagopal",
    degree: "Bachelor of Arts",
    field: "psychology",
    zone: "irving",
    sourceUrl: "https://www.linkedin.com/posts/danya-balagopal_i-am-incredibly-proud-to-announce-that-i-activity-7465244786040414208-mULX",
  },
  {
    id: "education-bryna-mcgarrigle",
    name: "Bryna McGarrigle",
    degree: "Bachelor of Arts",
    field: "sociology with a minor in psychology",
    zone: "nest",
    sourceUrl: "https://www.linkedin.com/posts/bryna-mcgarrigle_i-am-proud-to-share-that-i-have-officially-activity-7467449883453657088-7GT6",
  },
  {
    id: "education-varenya-srivastava",
    name: "Varenya Srivastava",
    degree: "Bachelor of Arts",
    field: "psychology and economics",
    zone: "koerner",
    sourceUrl: "https://www.linkedin.com/posts/varenya-srivastava-93502020b_ubc-ubcalumni-graduation-activity-7332972215279202305-rRT6",
  },
] as const;

const reviewedSourceUrls = new Set<string>(
  publicEducationRecords.map((record) => record.sourceUrl),
);
/** Exact canonical URLs only; this does not authorize arbitrary LinkedIn links. */
export const isPublicEducationSourceUrl = (value: string): boolean =>
  reviewedSourceUrls.has(value);

export const publicEducationCharacters: Character[] = publicEducationRecords.map(
  (record) => {
    const sources = [{ label: "Public education post · LinkedIn", url: record.sourceUrl }];
    return {
      id: record.id,
      name: record.name,
      introduction: `I’m ${record.name}. I studied ${record.field} at UBC.`,
      title: `UBC alumni visitor · ${record.degree}`,
      department: record.field,
      institution: "University of British Columbia · self-reported education",
      label: record.name,
      category: "named",
      kind: "alumni",
      model: "original-stylized-education-visitor",
      zone: record.zone,
      route: [],
      routeSpace: "network",
      behaviour: "Simulated visitor route on checked public campus paths. No real schedule, department assignment or location is represented.",
      biography: `Source checked ${publicEducationSourceChecked}: ${record.name} publicly reported graduating from the University of British Columbia with a ${record.degree}, studying ${record.field}. This is a self-published education claim, not independent verification of a degree or current enrollment.`,
      sources,
      // The shared field is a source-review date; the biography explains its scope.
      verified: publicEducationSourceChecked,
      permissions: "Original generic stylized model. No portrait, personal likeness, voice or LinkedIn media is used. Public education facts are summarized; participation and endorsement are not claimed.",
      disclaimer: `Educational simulation based on a public education self-report. These scripted replies are not quotations, a live conversation or statements supplied by ${record.name} for this project.`,
      status: "Alumni visitor · discover through a campus encounter",
      topics: [
        {
          id: "studies",
          question: "What did you study at UBC?",
          answer: `I studied ${record.field} at UBC.`,
          keywords: ["study", "studied", "subject", "field", "major", "minor"],
          sources,
          followups: ["degree"],
        },
        {
          id: "degree",
          question: "What degree did you graduate with?",
          answer: `I graduated from UBC with a ${record.degree}.`,
          keywords: ["degree", "graduate", "graduated", "alumni", "qualification"],
          sources,
          followups: ["education-source"],
        },
        {
          id: "education-source",
          question: "Where can I learn more about your studies?",
          answer: "My public graduation post has the details of my degree. You can open it here.",
          keywords: ["learn more", "source", "linkedin", "post", "profile"],
          sources,
          followups: ["studies"],
        },
      ],
    };
  },
);
