import {
  body,
  failure,
  guard,
  response,
  store,
} from "@/projects/cwru/community/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const identity = guard(request, "report"),
      v = await body(request);
    store().report(
      String(v.id),
      String(v.reason),
      typeof v.detail === "string" ? v.detail : "",
      identity,
    );
    return response({ received: true });
  } catch (error) {
    return failure(error);
  }
}
