export type DriveEntry = {
  id: string;
  name: string;
  url: string;
  kind: "folder" | "audio";
  resourceKey?: string;
};

export type MusicTrack = DriveEntry & { path: string };
export const driveIdPattern = /^[a-zA-Z0-9_-]{10,200}$/;

export function parseFolderUrl(value: string) {
  let url: URL;
  try { url = new URL(value.trim()); } catch { throw new Error("Paste a Google Drive folder link."); }
  const id = url.pathname.match(/^\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)\/?$/)?.[1]
    ?? (url.pathname === "/open" ? url.searchParams.get("id") : null);
  if (url.protocol !== "https:" || url.hostname !== "drive.google.com" || url.port || url.username || url.password || !id || !driveIdPattern.test(id)) {
    throw new Error("Paste a Google Drive folder link, not a file link.");
  }
  const resourceKey = url.searchParams.get("resourcekey") ?? undefined;
  if (resourceKey && !/^[a-zA-Z0-9_-]{1,200}$/.test(resourceKey)) throw new Error("This folder link has an invalid resource key.");
  return { id, resourceKey };
}

function decodeHtml(value: string) {
  const named: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (original, entity: string) => {
    if (!entity.startsWith("#")) return named[entity.toLowerCase()] ?? original;
    const point = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return point <= 0x10ffff ? String.fromCodePoint(point) : original;
  });
}

// Google's public folder embed requires no account or API key. Fail explicitly if
// its markup changes; never interpret arbitrary links or return upstream HTML.
export function parseFolderHtml(html: string): DriveEntry[] {
  if (!html.includes('class="flip-entries"')) throw new Error('Cannot read this folder. Set General access to “Anyone with the link” for the folder and its contents.');
  const entries: DriveEntry[] = [];
  for (const block of html.split(/<div class="flip-entry"\s/).slice(1)) {
    const href = block.match(/<a\s[^>]*href="([^"]+)"/)?.[1];
    const title = block.match(/<div class="flip-entry-title">([\s\S]*?)<\/div>/)?.[1];
    if (!href || title === undefined) throw new Error("Google changed its folder listing. This folder could not be read completely.");
    const url = new URL(decodeHtml(href), "https://drive.google.com");
    if (url.origin !== "https://drive.google.com") continue;
    const folderId = url.pathname.match(/^\/drive\/(?:u\/\d+\/)?folders\/([\w-]+)$/)?.[1];
    const fileId = url.pathname.match(/^\/file\/d\/([\w-]+)\/view$/)?.[1];
    const name = decodeHtml(title.replace(/<[^>]*>/g, ""));
    const id = folderId ?? fileId;
    if (!id || !driveIdPattern.test(id)) continue;
    if (!folderId && !/alt="Audio"|\/type\/audio\//.test(block) && !/\.(mp3|m4a|aac|wav|ogg|oga|opus|flac|aif|aiff|weba|wma)$/i.test(name)) continue;
    const resourceKey = url.searchParams.get("resourcekey") ?? undefined;
    entries.push({ id, name, url: url.href, kind: folderId ? "folder" : "audio", ...(resourceKey ? { resourceKey } : {}) });
  }
  return entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export async function collectMusic(
  root: string,
  readFolder: (url: string) => Promise<DriveEntry[]>,
  progress: (folders: number, tracks: number) => void,
  signal: AbortSignal,
) {
  const pending = [{ url: root, path: "" }];
  const folders = new Set<string>();
  const files = new Set<string>();
  const tracks: MusicTrack[] = [];
  let skipped = 0;
  let limited = false;
  while (pending.length) {
    signal.throwIfAborted();
    const folder = pending.shift()!;
    const { id } = parseFolderUrl(folder.url);
    if (folders.has(id)) continue;
    if (folders.size >= 500 || tracks.length >= 10000) { limited = true; break; }
    folders.add(id);
    let entries: DriveEntry[];
    try { entries = await readFolder(folder.url); }
    catch (error) {
      signal.throwIfAborted();
      if (folders.size === 1) throw error;
      skipped++;
      continue;
    }
    for (const entry of entries) {
      if (entry.kind === "folder") pending.push({ url: entry.url, path: folder.path ? `${folder.path} / ${entry.name}` : entry.name });
      else if (!files.has(entry.id)) {
        files.add(entry.id);
        tracks.push({ ...entry, path: folder.path });
      }
    }
    progress(folders.size, tracks.length);
  }
  tracks.sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }) || a.name.localeCompare(b.name, undefined, { numeric: true }));
  return { tracks, skipped, limited };
}
