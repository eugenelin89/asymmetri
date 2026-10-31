/** A small source audit, not independent enrollment verification of all 500.
 * Findings are paraphrases of study facts only; no source media/contact data. */
export type StudentSourceReview = {
  date: string;
  method: "profile-read" | "search-index-read";
  finding: string;
};
const read = (finding: string): StudentSourceReview => ({ date: "2026-10-31", method: "profile-read", finding });
const indexed = (finding: string): StudentSourceReview => ({ date: "2026-10-31", method: "search-index-read", finding });
export const studentSourceAudit: Readonly<Record<string, StudentSourceReview>> = {
  "https://www.math.ubc.ca/user/3026": read("The supplied Mathematics profile has the malformed display title Clement PDF and account heading c.soubrier. The official UBC Institute of Applied Mathematics graduate directory identifies Clement Soubrier as a Mathematics PhD student. The display name is corrected using that directory; the original supplied source is retained."),
  "https://www.math.ubc.ca/user/4402": read("The UBC Mathematics profile identifies Syed-Kaushin Aaron as a graduate student. The page does not supply a completion year."),
  "https://economics.ubc.ca/profile/bruno-esposito-acosta/": read("The Vancouver School of Economics profile identifies Bruno Esposito Acosta and an entrance cohort. A cohort is not a completion date or registrar confirmation of current enrollment."),
  "https://psych.ubc.ca/profile/ashling-ayekun/": read("UBC Psychology describes Ashling Ayekun as an MA student in clinical psychology. No UBC completion year is inferred from the previous degree listed there."),
  "https://www.stat.ubc.ca/users/gian-carlo-diluvi": read("UBC Statistics lists Gian Carlo Diluvi as a PhD student. No completion year is provided."),
  "https://www.grad.ubc.ca/campus-community/meet-our-students/abou-ibrahim-hayfaa": read("The UBC graduate profile identifies Hayfaa Abou Ibrahim's program as Doctor of Philosophy in Planning. No completion year is provided."),
  "https://dykzhao.com/": read("David Zhao's public personal site says he studies Computer Science at UBC and expects to graduate in 2027. This remains a self-reported education claim."),
  "https://ca.linkedin.com/in/lauren-huang": indexed("The indexed public LinkedIn profile identifies Lauren Huang as a UBC Civil Engineering student and lists 2022–2027 education. Direct profile fetching was blocked; the indexed self-report was reviewed."),
  "https://ca.linkedin.com/in/christiewu03": indexed("The indexed public LinkedIn profile identifies Christie Wu as a UBC Chemical Engineering student and lists 2021–2027 education. Direct profile fetching was blocked; the indexed self-report was reviewed."),
  "https://www.grad.ubc.ca/campus-community/meet-our-students/cushnie-sarah": read("The UBC graduate profile identifies Sarah Cushnie's program as a Master of Applied Science in Biomedical Engineering and discusses rowing. The same full name is already represented by the official UBC rowing roster, so study topics enrich that actor instead of creating a duplicate."),
  "https://www.grad.ubc.ca/campus-community/meet-our-students/makhanko-tang-claudia": read("The UBC graduate profile identifies Claudia Makhanko-Tang's program as a Master of Science in Women+ and Children's Health Sciences and discusses rowing. The same full name is already represented by the official UBC rowing roster, so study topics enrich that actor instead of creating a duplicate."),
};

export const studentNameCorrections: Readonly<Record<string, { suppliedName: string; displayName: string; sourceUrl: string }>> = {
  "https://www.math.ubc.ca/user/3026": {
    suppliedName: "Clement PDF",
    displayName: "Clement Soubrier",
    sourceUrl: "https://www.iam.ubc.ca/people/graduate-students/",
  },
};
