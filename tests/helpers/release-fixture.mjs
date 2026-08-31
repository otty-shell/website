import { readFileSync } from "node:fs";
import { join } from "node:path";

export function readStableReleaseFixture(repositoryRoot) {
  const releases = JSON.parse(
    readFileSync(join(repositoryRoot, "fixtures", "github-releases.json"), "utf8"),
  );
  const stableRelease = releases.find(
    (candidate) => candidate.draft === false && candidate.prerelease === false,
  );

  if (!stableRelease) {
    throw new Error("The release fixture must contain a published stable GitHub Release.");
  }

  return stableRelease;
}
