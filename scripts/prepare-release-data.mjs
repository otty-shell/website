import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateReleaseData, generateReleaseDataFile } from "./generate-release-data.mjs";
import {
  describeReleaseDataStage,
  generatedReleaseData,
  releaseDataStageManifest,
} from "./release-data-stage.mjs";

const releaseSource = process.env.OTTY_RELEASE_SOURCE?.trim() || "github";
const ciValue = process.env.CI?.trim().toLowerCase();
const runningInCi =
  (ciValue !== undefined && !["", "0", "false"].includes(ciValue)) ||
  process.env.GITHUB_ACTIONS === "true";

rmSync(generatedReleaseData, { force: true });
rmSync(releaseDataStageManifest, { force: true });

if (!new Set(["fixture", "github"]).has(releaseSource)) {
  throw new Error(
    'OTTY_RELEASE_SOURCE must be "fixture" or "github" when set.',
  );
}

if (releaseSource === "fixture" && runningInCi) {
  throw new Error("The local-only release fixture cannot be selected in CI.");
}

if (releaseSource === "fixture") {
  const fixturePath = fileURLToPath(new URL("../fixtures/github-releases.json", import.meta.url));
  generateReleaseDataFile(fixturePath, generatedReleaseData);
} else {
  const releasesApiUrl = new URL(
    process.env.OTTY_GITHUB_RELEASES_API_URL ??
      "https://api.github.com/repos/otty-shell/otty/releases/latest",
  );
  const release = await fetchGithubJson(releasesApiUrl, "Releases");

  if (!release || typeof release !== "object" || Array.isArray(release)) {
    throw new Error("GitHub latest Release API response must be a JSON object.");
  }

  generateReleaseData([release], generatedReleaseData);
}

mkdirSync(dirname(releaseDataStageManifest), { recursive: true });
writeFileSync(
  releaseDataStageManifest,
  `${JSON.stringify(
    { version: 1, sha256: describeReleaseDataStage() },
    null,
    2,
  )}\n`,
);

async function fetchGithubJson(apiUrl, label) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "otty-website",
    "X-GitHub-Api-Version": "2026-03-10",
  };
  const githubToken = process.env.GITHUB_TOKEN?.trim();

  if (githubToken && apiUrl.origin === "https://api.github.com") {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(apiUrl, {
    headers,
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub ${label} API request failed with ${response.status} ${response.statusText}.`,
    );
  }

  try {
    return await response.json();
  } catch (cause) {
    throw new Error(`GitHub ${label} API returned invalid JSON.`, { cause });
  }
}
