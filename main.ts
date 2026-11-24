import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");

const text = readFileSync(entryPath, "utf8");

if (text.length < 1 || text.length > 200) {
  console.error(`error: entry must be 1-200 characters, got ${text.length}`);
  process.exit(1);
}
if (text.trim().length === 0) {
  console.error("error: entry must not be only whitespace");
  process.exit(1);
}
if (text !== text.trim()) {
  console.error("error: entry must not have leading or trailing whitespace");
  process.exit(1);
}
if (text.includes("\n") || text.includes("\r")) {
  console.error("error: entry must be exactly one line");
  process.exit(1);
}
if (text.includes("\u2028") || text.includes("\u2029")) {
  console.error("error: entry must not contain Unicode line separators (U+2028/U+2029)");
  process.exit(1);
}
for (const ch of text) {
  if (ch.charCodeAt(0) < 0x20) {
    console.error("error: entry contains a control character");
    process.exit(1);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
