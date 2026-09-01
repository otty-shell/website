import { readFileSync } from "node:fs";
import {
  describeReleaseDataStage,
  releaseDataStageManifest,
} from "./release-data-stage.mjs";

let expectedStage;

try {
  expectedStage = JSON.parse(readFileSync(releaseDataStageManifest, "utf8"));
} catch (cause) {
  throw new Error("Generated release data is missing or invalid. Run npm run prepare:release.", {
    cause,
  });
}

if (expectedStage?.version !== 1 || expectedStage.sha256 !== describeReleaseDataStage()) {
  throw new Error(
    "Generated release data changed after validation. Run npm run prepare:release again.",
  );
}
