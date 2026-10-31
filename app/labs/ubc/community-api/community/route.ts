import { failure, response, store } from "@/projects/ubc/community/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET() {
  try {
    return response({ profiles: store().list() });
  } catch (error) {
    return failure(error);
  }
}
