import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateReleaseDataFile } from "./generate-release-data.mjs";
import {
  describeReleaseDataStage,
  generatedReleaseData,
  releaseDataStageManifest,
} from "./release-data-stage.mjs";

const releaseSource = process.env.OTTY_RELEASE_SOURCE?.trim();
const ciValue = process.env.CI?.trim().toLowerCase();
const runningInCi =
  (ciValue !== undefined && !["", "0", "false"].includes(ciValue)) ||
  process.env.GITHUB_ACTIONS === "true";

rmSync(generatedReleaseData, { force: true });
rmSync(releaseDataStageManifest, { force: true });

if (releaseSource !== "fixture") {
  throw new Error(
    'OTTY_RELEASE_SOURCE must be set explicitly to "fixture" for local release preparation.',
  );
}

if (runningInCi) {
  throw new Error("The local-only release fixture cannot be selected in CI.");
}

const fixturePath = fileURLToPath(new URL("../fixtures/github-releases.json", import.meta.url));
generateReleaseDataFile(fixturePath, generatedReleaseData);
mkdirSync(dirname(releaseDataStageManifest), { recursive: true });
writeFileSync(
  releaseDataStageManifest,
  `${JSON.stringify(
    { version: 1, sha256: describeReleaseDataStage() },
    null,
    2,
  )}\n`,
);
