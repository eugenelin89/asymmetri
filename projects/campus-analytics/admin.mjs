// Private host CLI. Default output is aggregate-only; --sessions explicitly reveals retained IP/UA.
// node --import ./projects/campus-analytics/loader.mjs projects/campus-analytics/admin.mjs report [ubc|cwru|stanford|all] [1-90] [--sessions]
// node --import ./projects/campus-analytics/loader.mjs projects/campus-analytics/admin.mjs prune
import { createAnalyticsStore } from "./store.ts";
import { campusId, reportDays } from "./model.ts";
const [action, ...args] = process.argv.slice(2), directory = process.env.CAMPUS_ANALYTICS_DATA_DIR;
if (!directory) throw new Error("Set CAMPUS_ANALYTICS_DATA_DIR to the private analytics directory.");
const store = createAnalyticsStore(directory);
let result;
if (action === "prune" && !args.length) result = await store.prune();
else if (action === "report") {
  const includeSessions = args.includes("--sessions"), parts = args.filter((a) => a !== "--sessions");
  if (parts.length > 2 || args.filter((a) => a === "--sessions").length > 1) throw new Error("Usage: report [CAMPUS|all] [1-90] [--sessions]");
  result = await store.report(parts[0] && parts[0] !== "all" ? campusId(parts[0]) : undefined, parts[1] ? reportDays(parts[1]) : 30, includeSessions);
} else throw new Error("Usage: report [CAMPUS|all] [1-90] [--sessions] | prune");
process.stdout.write(JSON.stringify(result, null, 2) + "\n");
