import {
  body,
  failure,
  guard,
  response,
  store,
} from "@/projects/stanford/community/http";
import { ProfileError } from "@/projects/stanford/community/model";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    guard(request, "recover");
    const value = await body(request);
    if (typeof value.recoveryCode !== "string")
      throw new ProfileError("Enter your private recovery code.");
    const recovered = store().mine(value.recoveryCode);
    return response(recovered, 200, value.recoveryCode, request);
  } catch (error) {
    return failure(error);
  }
}
