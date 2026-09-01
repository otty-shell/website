import { readFileSync } from "node:fs";
import {
  describeDocumentationStage,
  documentationStageManifest,
} from "./documentation-stage.mjs";

let expectedStage;

try {
  expectedStage = JSON.parse(readFileSync(documentationStageManifest, "utf8"));
} catch (cause) {
  throw new Error("Documentation staging manifest is missing or invalid. Run npm run prepare:docs.", {
    cause,
  });
}

if (
  expectedStage?.version !== 1 ||
  !Array.isArray(expectedStage.files) ||
  JSON.stringify(expectedStage.files) !== JSON.stringify(describeDocumentationStage())
) {
  throw new Error(
    "Documentation staging changed or is contaminated after preparation. Run npm run prepare:docs again.",
  );
}
