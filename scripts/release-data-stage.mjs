import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const generatedReleaseData = fileURLToPath(
  new URL("../.generated/release-data.json", import.meta.url),
);
export const releaseDataStageManifest = fileURLToPath(
  new URL("../.generated/release-data-stage.json", import.meta.url),
);

export function describeReleaseDataStage() {
  return createHash("sha256").update(readFileSync(generatedReleaseData)).digest("hex");
}
