// Local-only production-mode bundle; never registers a public app route.
import { build, preview } from "vite";
import { fileURLToPath } from "node:url";
import { resolve, relative, join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync, cpSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const root = fileURLToPath(new URL("../../../", import.meta.url));
const output = resolve(root, "dist/ubc-benchmark");
const snapshots = ["ubc/v0.1-2026-10-30/data.json", "ubc/v0.1-2026-10-30/anchors.json", "ubc/orchard-v0.2-2026-10-31/geography.json"];
const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? sourceFiles(join(dir, entry.name)) : [join(dir, entry.name)]);
}
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const config = {
  configFile: false, root: resolve(root, "projects/ubc/benchmark"), publicDir: false,
  build: { outDir: output, emptyOutDir: true, target: "es2022" },
};
await build(config);
for (const path of snapshots) {
  mkdirSync(resolve(output, path, ".."), { recursive: true });
  cpSync(resolve(root, "public", path), resolve(output, path));
}
const sources = [...sourceFiles(resolve(root, "projects/ubc")), resolve(root, "projects/surrey/resources.ts"), resolve(root, "package-lock.json")]
  .filter((file) => /\.(ts|tsx|mjs|json|html)$/.test(file)).sort();
writeFileSync(resolve(output, "source-manifest.json"), JSON.stringify({
  sourceSha: git("rev-parse", "HEAD"), dirtyFiles: git("status", "--porcelain"),
  buildMode: "Vite production-mode isolated engine harness; not a deployed Next.js build",
  node: process.version, snapshots: Object.fromEntries(snapshots.map((p) => [p, sha(resolve(root, "public", p))])),
  files: Object.fromEntries(sources.map((p) => [relative(root, p), sha(p)])),
}, null, 2));
if (!process.argv.includes("--build")) {
  const server = await preview({ ...config, preview: { host: "127.0.0.1", port: 3045, strictPort: true } });
  server.printUrls();
}
