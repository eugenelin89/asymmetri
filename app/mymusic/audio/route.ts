import { driveIdPattern } from "@/lib/mymusic";
import { fetchGoogle, privateHeaders } from "@/lib/mymusic-google";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const id = params.get("id") ?? "";
  const key = params.get("resourcekey");
  const range = request.headers.get("range");
  if (!driveIdPattern.test(id) || (key && !/^[\w-]{1,200}$/.test(key)) || (range && !/^bytes=(?:\d+-\d*|-\d+)$/.test(range))) {
    return new Response("Invalid audio request.", { status: 400, headers: privateHeaders });
  }
  const url = new URL("https://drive.usercontent.google.com/download");
  url.searchParams.set("id", id);
  url.searchParams.set("export", "download");
  url.searchParams.set("confirm", "t");
  if (key) url.searchParams.set("resourcekey", key);
  try {
    const response = await fetchGoogle(url, { headers: range ? { Range: range } : {}, signal: AbortSignal.any([request.signal, AbortSignal.timeout(60 * 60 * 1000)]) });
    const type = response.headers.get("content-type")?.split(";")[0] ?? "";
    if (![200, 206].includes(response.status) || (!type.startsWith("audio/") && !["application/octet-stream", "application/ogg"].includes(type))) {
      await response.body?.cancel();
      return new Response("This track is unavailable. Check public download access or try again later.", { status: response.status === 416 ? 416 : 502, headers: privateHeaders });
    }
    const headers = new Headers(privateHeaders);
    for (const name of ["content-type", "content-length", "content-range", "accept-ranges"]) {
      const value = response.headers.get(name);
      if (value) headers.set(name, value);
    }
    headers.set("Content-Disposition", "inline");
    headers.set("X-Accel-Buffering", "no");
    return new Response(response.body, { status: response.status, headers });
  } catch {
    return new Response("Google could not stream this track. Try again later.", { status: 502, headers: privateHeaders });
  }
}
