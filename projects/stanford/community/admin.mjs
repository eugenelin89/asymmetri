// Run on the existing Node host as the application owner. Never expose this CLI publicly.
import { createProfileStore } from "./store.ts";
const [action, id] = process.argv.slice(2);
if (!process.env.STANFORD_PROFILE_DIR)
  throw new Error("Set STANFORD_PROFILE_DIR to the private persistent store.");
const store = createProfileStore(process.env.STANFORD_PROFILE_DIR);
if (action === "reports")
  process.stdout.write(JSON.stringify(store.review(), null, 2) + "\n");
else if (action === "hide" || action === "restore") {
  store.moderate(id, action === "hide");
  process.stdout.write("Moderation saved.\n");
} else
  throw new Error(
    "Usage: admin.mjs reports | hide PROFILE_ID | restore PROFILE_ID",
  );
