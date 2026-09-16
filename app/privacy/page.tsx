import { UtilityPage } from "@/components/utility-page";
import { motionPages } from "@/content/site";
import { utilityMetadata } from "@/lib/metadata";

export const metadata = utilityMetadata(motionPages.privacy, "/privacy");

export default function PrivacyPage() {
  return <UtilityPage page={motionPages.privacy} />;
}
