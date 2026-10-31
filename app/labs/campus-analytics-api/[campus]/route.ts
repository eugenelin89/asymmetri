import { handleAnalytics } from "@/projects/campus-analytics/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ campus: string }> };
async function handle(request: Request, context: Context) { return handleAnalytics(request, (await context.params).campus); }
export { handle as POST, handle as DELETE };
