import { UtilityPage } from "@/components/utility-page";
import { hittingPages } from "@/content/site";
import { utilityMetadata } from "@/lib/metadata";

// Source-only draft. Publication requires docs/HITTING_PUBLICATION_PLAN.md.
export const metadata = {
  ...utilityMetadata(hittingPages.privacy, "/privacy/hitting"),
  robots: { index: false, follow: false },
};

export default function HittingPrivacyPage() {
  return <UtilityPage page={hittingPages.privacy} />;
}
