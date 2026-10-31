// Private host CLI, never an HTTP route. Run as the application owner:
// node --import ./projects/campus-reviews/loader.mjs projects/campus-reviews/admin.mjs reports [ubc|cwru|stanford] [--all]
// node --import ./projects/campus-reviews/loader.mjs projects/campus-reviews/admin.mjs hide|restore|remove CAMPUS REVIEW_ID
import { createReviewStore } from "./store.ts";
import { campusId } from "./model.ts";
const [action, ...args] = process.argv.slice(2);
const directory = process.env.CAMPUS_REVIEWS_DATA_DIR;
if (!directory) throw new Error("Set CAMPUS_REVIEWS_DATA_DIR to the private persistent directory.");
const store = createReviewStore(directory);
let result;
if (action === "reports" && args.length <= 2 && args.filter((a) => a === "--all").length <= 1) {
  const campuses = args.filter((a) => a !== "--all");
  if (campuses.length > 1) throw new Error("Choose one campus, or omit it for all campuses.");
  result = await store.reports(campuses.length ? campusId(campuses[0]) : undefined, args.includes("--all"));
} else if (["hide", "restore", "remove"].includes(action) && args.length === 2) {
  result = await store.moderate(campusId(args[0]), args[1], action);
} else throw new Error("Usage: reports [CAMPUS] [--all] | hide|restore|remove CAMPUS REVIEW_ID");
process.stdout.write(JSON.stringify(result, null, 2) + "\n");
