import { UtilityPage } from "@/components/utility-page";
import { motionPages } from "@/content/site";
import { utilityMetadata } from "@/lib/metadata";

export const metadata = utilityMetadata(motionPages.support, "/support");

export default function SupportPage() {
  return <UtilityPage page={motionPages.support} />;
}
