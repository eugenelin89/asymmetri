import {
  body,
  failure,
  guard,
  response,
  store,
  token,
} from "@/projects/stanford/community/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET(request: Request) {
  try {
    const s = store();
    return response(
      token(request) ? s.mine(token(request)) : { profile: null },
    );
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    guard(request, "create");
    const s = store();
    if (token(request)) {
      try {
        s.mine(token(request));
        return response(
          { error: "You already have a profile. Edit or remove it first." },
          409,
        );
      } catch {
        /* A removed or expired capability can create anew. */
      }
    }
    const created = s.create(await body(request));
    return response(created, 201, created.recoveryCode, request);
  } catch (error) {
    return failure(error);
  }
}
export async function PATCH(request: Request) {
  try {
    guard(request, "edit");
    return response({
      profile: store().update(token(request), await body(request)),
    });
  } catch (error) {
    return failure(error);
  }
}
export function DELETE(request: Request) {
  try {
    guard(request, "edit");
    store().remove(token(request));
    return response({ removed: true }, 200, "", request);
  } catch (error) {
    return failure(error);
  }
}
