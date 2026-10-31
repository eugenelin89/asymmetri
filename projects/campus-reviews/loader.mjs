// Node test/moderation entry point; uses the repository's existing TypeScript dependency.
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import ts from "typescript";
registerHooks({
  resolve(specifier, context, next) {
    try { return next(specifier, context); }
    catch (error) { if (specifier.startsWith(".") && !specifier.endsWith(".ts")) return next(specifier + ".ts", context); throw error; }
  },
  load(url, context, next) {
    if (url.endsWith(".ts")) return { format: "module", shortCircuit: true, source: ts.transpileModule(readFileSync(new URL(url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText };
    return next(url, context);
  },
});
