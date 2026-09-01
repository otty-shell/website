import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export function writeTestFile(path, contents) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
}
