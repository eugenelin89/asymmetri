// These endpoints are fixed: user-supplied URLs are never fetched directly.
export async function fetchGoogle(url: URL, init: RequestInit = {}): Promise<Response> {
  for (let redirects = 0; redirects < 5; redirects++) {
    if (url.protocol !== "https:" || url.port || url.username || url.password ||
      !["drive.google.com", "drive.usercontent.google.com"].includes(url.hostname) && !url.hostname.endsWith(".googleusercontent.com")) {
      throw new Error("Google did not provide a public download.");
    }
    const response = await fetch(url, { ...init, redirect: "manual", cache: "no-store", credentials: "omit" });
    if (![301, 302, 303, 307, 308].includes(response.status)) return response;
    const location = response.headers.get("location");
    await response.body?.cancel();
    if (!location) break;
    url = new URL(location, url);
  }
  throw new Error("Google could not open this public file.");
}

export const privateHeaders = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff" };

export async function limitedText(response: Response, limit = 4 * 1024 * 1024) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Google returned an empty response.");
  const decoder = new TextDecoder();
  let total = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) throw new Error("This folder is too large to read. Try a smaller subfolder.");
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally { await reader.cancel(); }
}
