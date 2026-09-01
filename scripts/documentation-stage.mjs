import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const stagedDocumentation = fileURLToPath(
  new URL("../src/content/docs/docs/", import.meta.url),
);
export const documentationStageManifest = fileURLToPath(
  new URL("../.generated/documentation-stage.json", import.meta.url),
);

export function describeDocumentationStage() {
  return listFiles(stagedDocumentation)
    .map((path) => ({
      path: relative(stagedDocumentation, path).split(sep).join("/"),
      sha256: createHash("sha256").update(readFileSync(path)).digest("hex"),
    }))
    .sort((left, right) => left.path.localeCompare(right.path));
}

function listFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFiles(entryPath));
    } else if (entry.isFile() || entry.isSymbolicLink()) {
      files.push(entryPath);
    }
  }

  return files;
}
