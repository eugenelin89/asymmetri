import { handleReport } from "@/projects/campus-reviews/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request, context: { params: Promise<{ campus: string }> }) {
  return handleReport(request, (await context.params).campus);
}
