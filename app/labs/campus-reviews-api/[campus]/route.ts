import { handleReviews } from "@/projects/campus-reviews/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ campus: string }> };
async function handle(request: Request, context: Context) {
  return handleReviews(request, (await context.params).campus);
}
export { handle as GET, handle as POST, handle as PATCH, handle as DELETE };
