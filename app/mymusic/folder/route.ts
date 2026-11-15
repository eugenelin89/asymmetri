import { parseFolderHtml, parseFolderUrl } from "@/lib/mymusic";
import { fetchGoogle, limitedText, privateHeaders } from "@/lib/mymusic-google";

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && (!/^https?:\/\//.test(origin) || new URL(origin).host !== request.headers.get("host"))) {
      return Response.json({ error: "Open the player on this website." }, { status: 403, headers: privateHeaders });
    }
    const body = await limitedText(new Response(request.body), 4096);
    const input: unknown = JSON.parse(body);
    if (!input || typeof input !== "object" || !("url" in input) || typeof input.url !== "string") throw new Error("Paste a Google Drive folder link.");
    const { id, resourceKey } = parseFolderUrl(input.url);
    const url = new URL("https://drive.google.com/embeddedfolderview");
    url.searchParams.set("id", id);
    if (resourceKey) url.searchParams.set("resourcekey", resourceKey);
    const response = await fetchGoogle(url, { signal: AbortSignal.any([request.signal, AbortSignal.timeout(20000)]) });
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error('Google could not open this folder. Check “Anyone with the link” access, or try again later.');
    }
    return Response.json({ entries: parseFolderHtml(await limitedText(response)) }, { headers: privateHeaders });
  } catch (error) {
    const message = error instanceof Error && !["TimeoutError", "AbortError", "TypeError", "SyntaxError"].includes(error.name)
      ? error.message : "Could not load the folder. Check the link and try again.";
    return Response.json({ error: message }, { status: 400, headers: privateHeaders });
  }
}
